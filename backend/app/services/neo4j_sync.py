from sqlalchemy.orm import Session
from app.core.config import settings
from app.models import Employee, Project, DocumentRecord, Team

def get_neo4j_driver():
    if not settings.NEO4J_URI:
        return None
    try:
        from neo4j import GraphDatabase
        user = settings.NEO4J_USER or ""
        password = settings.NEO4J_PASSWORD or ""
        # Handle empty auth if needed
        auth = (user, password) if user and password else None
        return GraphDatabase.driver(settings.NEO4J_URI, auth=auth)
    except Exception as e:
        print(f"Failed to initialize Neo4j driver: {e}")
        return None

def sync_db_to_neo4j(db: Session):
    """
    Syncs the current state of the relational database to Neo4j.
    Merges nodes and connects relationships.
    """
    driver = get_neo4j_driver()
    if not driver:
        print("Neo4j synchronization bypassed: NEO4J_URI is not set.")
        return
        
    employees = db.query(Employee).all()
    projects = db.query(Project).all()
    documents = db.query(DocumentRecord).all()
    teams = db.query(Team).all()
    
    print(f"Syncing graph to Neo4j: {len(employees)} Employees, {len(projects)} Projects, {len(documents)} Docs, {len(teams)} Teams...")
    
    try:
        with driver.session() as session:
            # 1. Clear existing nodes & relationships to prevent duplicates
            session.run("MATCH (n) DETACH DELETE n")
            
            # 2. Merge Team nodes
            for t in teams:
                session.run(
                    "MERGE (t:Team {id: $id}) SET t.name = $name",
                    id=t.id, name=t.name
                )
                
            # 3. Merge Employee nodes and connect to Teams
            for e in employees:
                session.run(
                    "MERGE (emp:Employee {id: $id}) SET emp.name = $name, emp.role = $role, "
                    "emp.riskScore = $risk_score, emp.riskLevel = $risk_level, "
                    "emp.tenureYears = $tenure_years, emp.documentationCoverage = $documentation_coverage, "
                    "emp.dependents = $dependents, emp.lastActive = $last_active",
                    id=e.id, name=e.name, role=e.role, risk_score=e.risk_score,
                    risk_level=e.risk_level, tenure_years=e.tenure_years,
                    documentation_coverage=e.documentation_coverage,
                    dependents=e.dependents, last_active=e.last_active
                )
                if e.team_id:
                    session.run(
                        "MATCH (emp:Employee {id: $emp_id}), (t:Team {id: $team_id}) "
                        "MERGE (emp)-[:MEMBER_OF]->(t)",
                        emp_id=e.id, team_id=e.team_id
                    )
                    
            # 4. Merge Project nodes, connect owners and contributors
            for p in projects:
                session.run(
                    "MERGE (proj:Project {id: $id}) SET proj.name = $name, proj.status = $status, proj.team = $team",
                    id=p.id, name=p.name, status=p.status, team=p.team
                )
                if p.owner_id:
                    session.run(
                        "MATCH (proj:Project {id: $proj_id}), (emp:Employee {id: $owner_id}) "
                        "MERGE (emp)-[:OWNS]->(proj)",
                        proj_id=p.id, owner_id=p.owner_id
                    )
                for c in p.contributors:
                    session.run(
                        "MATCH (proj:Project {id: $proj_id}), (emp:Employee {id: $contrib_id}) "
                        "MERGE (emp)-[:CONTRIBUTES_TO]->(proj)",
                        proj_id=p.id, contrib_id=c.id
                    )
                    
            # 5. Merge Document nodes and connect authors
            for d in documents:
                session.run(
                    "MERGE (doc:Document {id: $id}) SET doc.title = $title, doc.type = $type, "
                    "doc.lastUpdated = $last_updated, doc.staleness = $staleness",
                    id=d.id, title=d.title, type=d.type,
                    last_updated=d.last_updated, staleness=d.staleness
                )
                if d.author_id:
                    session.run(
                        "MATCH (doc:Document {id: $doc_id}), (emp:Employee {id: $author_id}) "
                        "MERGE (emp)-[:AUTHORED]->(doc)",
                        doc_id=d.id, author_id=d.author_id
                    )
                    
        print("Neo4j database successfully synchronized.")
    except Exception as err:
        print(f"Error during Neo4j sync: {err}")
    finally:
        driver.close()
