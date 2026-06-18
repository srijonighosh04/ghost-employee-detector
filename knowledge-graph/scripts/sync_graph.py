import os
import sqlite3
from neo4j import GraphDatabase

# Locate local SQLite database file
BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "backend"))
DEFAULT_DB_PATH = os.path.join(BACKEND_DIR, "sentinel.db")

# Neo4j Environment Configuration
NEO4J_URI = os.environ.get("NEO4J_URI") or "bolt://localhost:7687"
NEO4J_USER = os.environ.get("NEO4J_USER") or "neo4j"
NEO4J_PASSWORD = os.environ.get("NEO4J_PASSWORD") or "password"

def get_db_connection(db_path: str = DEFAULT_DB_PATH):
    """
    Opens a sqlite3 connection to the local database file.
    """
    if not os.path.exists(db_path):
        raise FileNotFoundError(f"Database file not found at: {db_path}. Run the backend server first to seed it.")
    return sqlite3.connect(db_path)

def sync_data():
    """
    Main sync logic: extracts SQL records and writes them to Neo4j.
    """
    print(f"Connecting to SQLite database at: {DEFAULT_DB_PATH}")
    try:
        sql_conn = get_db_connection()
        cursor = sql_conn.cursor()
    except Exception as e:
        print(f"Aborting sync: Failed to connect to SQLite: {e}")
        return

    # Extract all rows from SQLite tables
    try:
        teams = cursor.execute("SELECT id, name FROM teams").fetchall()
        employees = cursor.execute("SELECT id, name, role, team, team_id, avatar_color, initials, risk_score, risk_level, tenure_years, documentation_coverage, dependents, last_active FROM employees").fetchall()
        projects = cursor.execute("SELECT id, name, status, owner_id, team FROM projects").fetchall()
        contributors = cursor.execute("SELECT project_id, employee_id FROM project_contributors").fetchall()
        documents = cursor.execute("SELECT id, title, type, author_id, last_updated, staleness FROM documents").fetchall()
    except Exception as e:
        print(f"Aborting sync: Failed to extract SQL records: {e}")
        sql_conn.close()
        return
    finally:
        sql_conn.close()

    print(f"Extracted: {len(teams)} Teams, {len(employees)} Employees, {len(projects)} Projects, {len(documents)} Documents.")

    # Connect to Neo4j
    print(f"Connecting to Neo4j database at: {NEO4J_URI} (User: {NEO4J_USER})")
    try:
        driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
        # Quick health verify query
        driver.verify_connectivity()
    except Exception as e:
        print(f"Skipping sync: Neo4j is offline or configuration is missing. Error: {e}")
        return

    try:
        with driver.session() as session:
            print("Purging existing Neo4j graph data...")
            session.run("MATCH (n) DETACH DELETE n")

            # 1. Merge Team nodes
            print("Syncing Team nodes...")
            for t_id, t_name in teams:
                session.run(
                    "MERGE (t:Team {id: $id}) SET t.name = $name",
                    id=t_id, name=t_name
                )

            # 2. Merge Employee nodes and connect MEMBER_OF
            print("Syncing Employee nodes and relationships...")
            for emp in employees:
                e_id, name, role, team_name, team_id, avatar_color, initials, risk_score, risk_level, tenure_years, doc_coverage, dependents, last_active = emp
                session.run(
                    "MERGE (e:Employee {id: $id}) SET e.name = $name, e.role = $role, e.team = $team, "
                    "e.avatarColor = $avatar_color, e.initials = $initials, e.riskScore = $risk_score, "
                    "e.riskLevel = $risk_level, e.tenureYears = $tenure_years, e.documentationCoverage = $doc_coverage, "
                    "e.dependents = $dependents, e.lastActive = $last_active",
                    id=e_id, name=name, role=role, team=team_name, avatar_color=avatar_color,
                    initials=initials, risk_score=risk_score, risk_level=risk_level,
                    tenure_years=tenure_years, doc_coverage=doc_coverage, dependents=dependents,
                    last_active=last_active
                )
                if team_id:
                    session.run(
                        "MATCH (e:Employee {id: $emp_id}), (t:Team {id: $team_id}) "
                        "MERGE (e)-[:MEMBER_OF]->(t)",
                        emp_id=e_id, team_id=team_id
                    )

            # 3. Merge Project nodes, connect OWNS and CONTRIBUTES_TO
            print("Syncing Project nodes and relationships...")
            for p_id, name, status, owner_id, team_name in projects:
                session.run(
                    "MERGE (p:Project {id: $id}) SET p.name = $name, p.status = $status, p.team = $team",
                    id=p_id, name=name, status=status, team=team_name
                )
                if owner_id:
                    session.run(
                        "MATCH (p:Project {id: $proj_id}), (e:Employee {id: $owner_id}) "
                        "MERGE (e)-[:OWNS]->(p)",
                        proj_id=p_id, owner_id=owner_id
                    )

            for p_id, e_id in contributors:
                session.run(
                    "MATCH (p:Project {id: $proj_id}), (e:Employee {id: $emp_id}) "
                    "MERGE (e)-[:CONTRIBUTES_TO]->(p)",
                    proj_id=p_id, emp_id=e_id
                )

            # 4. Merge Document nodes and connect AUTHORED
            print("Syncing Document nodes and relationships...")
            for d_id, title, type_name, author_id, last_updated, staleness in documents:
                session.run(
                    "MERGE (d:Document {id: $id}) SET d.title = $title, d.type = $type, "
                    "d.lastUpdated = $last_updated, d.staleness = $staleness",
                    id=d_id, title=title, type=type_name, last_updated=last_updated, staleness=staleness
                )
                if author_id:
                    session.run(
                        "MATCH (d:Document {id: $doc_id}), (e:Employee {id: $author_id}) "
                        "MERGE (e)-[:AUTHORED]->(d)",
                        doc_id=d_id, author_id=author_id
                    )

        print("Neo4j database sync completed successfully.")
    except Exception as e:
        print(f"Error executing Neo4j sync Cypher queries: {e}")
    finally:
        driver.close()

if __name__ == "__main__":
    sync_data()
