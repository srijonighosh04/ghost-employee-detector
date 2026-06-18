from typing import List, Dict, Any, Optional

def execute_read_query(driver, query: str, parameters: Optional[Dict[str, Any]] = None) -> Optional[List[Dict[str, Any]]]:
    """
    Executes a read query against Neo4j and returns the records as a list of dicts.
    Handles sessions and errors gracefully.
    """
    if not driver:
        return None
    try:
        with driver.session() as session:
            result = session.run(query, parameters or {})
            return [record.data() for record in result]
    except Exception as e:
        print(f"Neo4j query execution error: {e}")
        return None

def get_resignation_impact(driver, employee_id: str) -> Optional[Dict[str, Any]]:
    """
    Finds direct resignation impact metrics for a specific employee.
    """
    query = """
    MATCH (e:Employee {id: $employee_id})
    OPTIONAL MATCH (e)-[:OWNS]->(p:Project)
    OPTIONAL MATCH (contrib:Employee)-[:CONTRIBUTES_TO]->(p) WHERE contrib.id <> $employee_id
    OPTIONAL MATCH (e)-[:AUTHORED]->(d:Document)
    RETURN 
        e.id AS employeeId,
        e.name AS employeeName,
        e.role AS role,
        e.riskScore AS riskScore,
        e.riskLevel AS riskLevel,
        collect(DISTINCT {id: p.id, name: p.name, status: p.status}) AS ownedProjects,
        collect(DISTINCT {name: contrib.name, id: contrib.id}) AS impactedTeammates,
        collect(DISTINCT {id: d.id, title: d.title, staleness: d.staleness}) AS authoredDocuments
    """
    results = execute_read_query(driver, query, {"employee_id": employee_id})
    if results and results[0].get("employeeId"):
        return results[0]
    return None

def get_downstream_risk(driver, employee_id: str) -> List[Dict[str, Any]]:
    """
    Finds colleagues who share projects with the departing employee
    and the other projects those colleagues support.
    """
    query = """
    MATCH (e:Employee {id: $employee_id})-[:OWNS|CONTRIBUTES_TO]->(p:Project)<-[:CONTRIBUTES_TO|OWNS]-(c:Employee)
    WHERE c.id <> $employee_id
    OPTIONAL MATCH (c)-[:OWNS|CONTRIBUTES_TO]->(otherProj:Project)
    WHERE otherProj.id <> p.id
    RETURN 
        c.name AS colleagueName, 
        c.role AS colleagueRole,
        p.name AS sharedProject,
        collect(DISTINCT otherProj.name) AS otherProjectsAtRisk
    """
    results = execute_read_query(driver, query, {"employee_id": employee_id})
    return results or []

def get_single_points_of_failure(driver) -> List[Dict[str, Any]]:
    """
    Identifies projects that have an owner but no other contributors.
    """
    query = """
    MATCH (p:Project)<-[:OWNS]-(owner:Employee)
    WHERE NOT (p)<-[:CONTRIBUTES_TO]-(:Employee)
    RETURN 
        p.id AS projectId,
        p.name AS projectName,
        owner.name AS soleOwner,
        owner.riskScore AS riskScore,
        owner.riskLevel AS riskLevel
    """
    results = execute_read_query(driver, query)
    return results or []

def get_orphaned_projects(driver) -> List[Dict[str, Any]]:
    """
    Identifies projects with no owner.
    """
    query = """
    MATCH (p:Project)
    WHERE NOT (p)<-[:OWNS]-(:Employee)
    RETURN 
        p.id AS projectId,
        p.name AS projectName,
        p.status AS status
    """
    results = execute_read_query(driver, query)
    return results or []

def get_team_risk_aggregation(driver) -> List[Dict[str, Any]]:
    """
    Aggregates risk metrics per team.
    """
    query = """
    MATCH (t:Team)<-[:MEMBER_OF]-(e:Employee)
    OPTIONAL MATCH (e)-[:OWNS]->(p:Project)
    OPTIONAL MATCH (e)-[:AUTHORED]->(d:Document)
    RETURN 
        t.id AS teamId,
        t.name AS teamName,
        count(DISTINCT e) AS memberCount,
        avg(e.riskScore) AS averageRiskScore,
        count(DISTINCT p) AS totalProjectsOwned,
        count(DISTINCT d) AS totalDocsAuthored
    ORDER BY averageRiskScore DESC
    """
    results = execute_read_query(driver, query)
    return results or []
