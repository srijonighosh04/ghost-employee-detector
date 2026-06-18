from sqlalchemy.orm import Session
from app.models import Employee, Project
from app.services.risk_scoring import get_risk_level
from app.services.neo4j_sync import get_neo4j_driver

def run_resignation_simulation(db: Session, employee_id: str):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        return None
        
    owned_projects = employee.owned_projects
    impacted_projects = []
    impacted_teammates_ids = set()
    
    for p in owned_projects:
        # Find contributors on this project (excluding the leaving employee)
        contributors = p.contributors
        contrib_ids = [c.id for c in contributors if c.id != employee_id]
        
        for cid in contrib_ids:
            impacted_teammates_ids.add(cid)
            
        severity = get_risk_level(employee.risk_score)
        
        if len(contrib_ids) == 0:
            reason = f"{employee.name} is the sole owner and contributor. Leaving this project with zero active contributors."
        else:
            reason = f"{employee.name} is the listed owner. Peer context is limited to {len(contrib_ids)} other contributors."
            
        impacted_projects.append({
            "project_id": p.id,
            "name": p.name,
            "severity": severity,
            "reason": reason
        })
        
    # --- Neo4j Graph Traversal Integration ---
    # Query secondary/indirect downstream project risks if Neo4j is configured
    try:
        driver = get_neo4j_driver()
        if driver:
            from knowledge_graph.cypher_queries import get_downstream_risk
            downstream = get_downstream_risk(driver, employee_id)
            if downstream:
                for row in downstream:
                    colleague = row.get("colleagueName")
                    shared_p = row.get("sharedProject")
                    other_projs = row.get("otherProjectsAtRisk")
                    if other_projs:
                        for op_name in other_projs:
                            # Avoid adding if already immediately impacted
                            if op_name not in [ip["name"] for ip in impacted_projects]:
                                impacted_projects.append({
                                    "project_id": f"indirect-{op_name.lower().replace(' ', '-')}",
                                    "name": op_name,
                                    "severity": "medium" if employee.risk_score >= 60 else "low",
                                    "reason": f"Indirect Risk: Increased pressure on {colleague} (who shares {shared_p}) might derail their focus on {op_name}."
                                })
            driver.close()
    except Exception as e:
        print(f"Warning: Failed to execute Neo4j downstream risk traversal: {e}")

        
    # High-fidelity mock details for demo database entries
    mock_sims = {
        "e1": {
            "projects": {
                "p1": "Sole maintainer of the release orchestration scripts",
                "p4": "Only engineer who has run a full failover drill",
                "p8": "Holds undocumented context on policy exceptions"
            },
            "undocumented": [
                "Manual rollback sequence for region-level outages",
                "Tribal knowledge of CI runner quirks not in any runbook",
                "Informal escalation path with the cloud provider's TAM"
            ]
        },
        "e2": {
            "projects": {
                "p2": "Owns reconciliation logic with no peer reviewer"
            },
            "undocumented": [
                "Edge-case proration rules",
                "Currency rounding overrides for 3 legacy markets"
            ]
        },
        "e6": {
            "projects": {
                "p7": "Last remaining engineer who understands the legacy schema",
                "p2": "Co-architect of dunning workflow"
            },
            "undocumented": [
                "Legacy schema migration path",
                "Vendor-specific tax exemption handling"
            ]
        }
    }
    
    undocumented_areas = []
    if employee_id in mock_sims:
        special = mock_sims[employee_id]
        undocumented_areas = special["undocumented"]
        # Update reasons for projects with our high-fidelity texts
        for ip in impacted_projects:
            pid = ip["project_id"]
            if pid in special["projects"]:
                ip["reason"] = special["projects"][pid]
    else:
        # Dynamic fallback for new employees
        if employee.documentation_coverage < 60:
            primary_proj = owned_projects[0].name if owned_projects else "their work"
            undocumented_areas = [f"Day-to-day decisions on {primary_proj} aren't written down anywhere"]
            
    # Number of teammates impacted
    impacted_teammates = len(impacted_teammates_ids)
    if impacted_teammates == 0 and len(owned_projects) > 0:
        impacted_teammates = 1
        
    # Calculation formulas matching frontend
    knowledge_gap_score = round(employee.risk_score * 0.6 + (100 - employee.documentation_coverage) * 0.4)
    estimated_ramp_weeks = max(2, round(employee.tenure_years * 1.6))
    
    return {
        "employee_id": employee_id,
        "impacted_projects": impacted_projects,
        "impacted_teammates": impacted_teammates,
        "knowledge_gap_score": knowledge_gap_score,
        "estimated_ramp_weeks": estimated_ramp_weeks,
        "undocumented_areas": undocumented_areas
    }
