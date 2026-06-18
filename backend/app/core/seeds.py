from sqlalchemy.orm import Session
from app.models import Team, Employee, Project, DocumentRecord

def seed_db(db: Session):
    # Check if we already have data to prevent duplicate seeding issues
    if db.query(Team).first() is not None or db.query(Employee).first() is not None:
        return

    # 1. Seed Teams
    teams_data = [
        {"id": "t-platform", "name": "Platform Infrastructure"},
        {"id": "t-payments", "name": "Payments & Billing"},
        {"id": "t-data", "name": "Data & Analytics"},
        {"id": "t-growth", "name": "Growth Engineering"},
    ]
    teams = {}
    for t in teams_data:
        team = Team(id=t["id"], name=t["name"])
        db.add(team)
        teams[t["id"]] = team
        
    db.commit()

    # 2. Seed Employees
    employees_data = [
        {
            "id": "e1",
            "name": "Priya Nair",
            "role": "Principal Infrastructure Engineer",
            "team": "Platform Infrastructure",
            "team_id": "t-platform",
            "avatar_color": "#F0A93B",
            "initials": "PN",
            "risk_score": 92,
            "risk_level": "critical",
            "tenure_years": 7.0,
            "documentation_coverage": 18,
            "dependents": 11,
            "last_active": "2 hours ago",
        },
        {
            "id": "e2",
            "name": "Marcus Webb",
            "role": "Staff Engineer, Billing Core",
            "team": "Payments & Billing",
            "team_id": "t-payments",
            "avatar_color": "#E15C5C",
            "initials": "MW",
            "risk_score": 81,
            "risk_level": "high",
            "tenure_years": 5.0,
            "documentation_coverage": 34,
            "dependents": 7,
            "last_active": "1 day ago",
        },
        {
            "id": "e3",
            "name": "Sofia Reyes",
            "role": "Lead Data Engineer",
            "team": "Data & Analytics",
            "team_id": "t-data",
            "avatar_color": "#46C2D8",
            "initials": "SR",
            "risk_score": 58,
            "risk_level": "medium",
            "tenure_years": 3.0,
            "documentation_coverage": 61,
            "dependents": 4,
            "last_active": "3 hours ago",
        },
        {
            "id": "e4",
            "name": "Daniel Osei",
            "role": "Senior SRE",
            "team": "Platform Infrastructure",
            "team_id": "t-platform",
            "avatar_color": "#8FE4F2",
            "initials": "DO",
            "risk_score": 47,
            "risk_level": "medium",
            "tenure_years": 2.0,
            "documentation_coverage": 55,
            "dependents": 3,
            "last_active": "5 hours ago",
        },
        {
            "id": "e5",
            "name": "Lena Kowalski",
            "role": "Growth Tech Lead",
            "team": "Growth Engineering",
            "team_id": "t-growth",
            "avatar_color": "#F0A93B",
            "initials": "LK",
            "risk_score": 39,
            "risk_level": "low",
            "tenure_years": 2.0,
            "documentation_coverage": 72,
            "dependents": 2,
            "last_active": "30 minutes ago",
        },
        {
            "id": "e6",
            "name": "Tobias Hahn",
            "role": "Payments Architect",
            "team": "Payments & Billing",
            "team_id": "t-payments",
            "avatar_color": "#FF8A8A",
            "initials": "TH",
            "risk_score": 87,
            "risk_level": "critical",
            "tenure_years": 9.0,
            "documentation_coverage": 22,
            "dependents": 9,
            "last_active": "Yesterday",
        },
        {
            "id": "e7",
            "name": "Imani Carter",
            "role": "Platform Security Engineer",
            "team": "Platform Infrastructure",
            "team_id": "t-platform",
            "avatar_color": "#46C2D8",
            "initials": "IC",
            "risk_score": 64,
            "risk_level": "high",
            "tenure_years": 4.0,
            "documentation_coverage": 41,
            "dependents": 5,
            "last_active": "4 hours ago",
        },
        {
            "id": "e8",
            "name": "Yuki Tanaka",
            "role": "Analytics Engineer",
            "team": "Data & Analytics",
            "team_id": "t-data",
            "avatar_color": "#8FE4F2",
            "initials": "YT",
            "risk_score": 28,
            "risk_level": "low",
            "tenure_years": 1.0,
            "documentation_coverage": 80,
            "dependents": 1,
            "last_active": "1 hour ago",
        },
        {
            "id": "e9",
            "name": "Omar Farouk",
            "role": "Frontend Engineer",
            "team": "Growth Engineering",
            "team_id": "t-growth",
            "avatar_color": "#F0A93B",
            "initials": "OF",
            "risk_score": 22,
            "risk_level": "low",
            "tenure_years": 1.0,
            "documentation_coverage": 86,
            "dependents": 1,
            "last_active": "20 minutes ago",
        },
        {
            "id": "e10",
            "name": "Hannah Brooks",
            "role": "Growth PM",
            "team": "Growth Engineering",
            "team_id": "t-growth",
            "avatar_color": "#E15C5C",
            "initials": "HB",
            "risk_score": 35,
            "risk_level": "low",
            "tenure_years": 2.0,
            "documentation_coverage": 75,
            "dependents": 2,
            "last_active": "2 hours ago",
        },
    ]
    
    employees = {}
    for emp_d in employees_data:
        emp = Employee(
            id=emp_d["id"],
            name=emp_d["name"],
            role=emp_d["role"],
            team=emp_d["team"],
            team_id=emp_d["team_id"],
            avatar_color=emp_d["avatar_color"],
            initials=emp_d["initials"],
            risk_score=emp_d["risk_score"],
            risk_level=emp_d["risk_level"],
            tenure_years=emp_d["tenure_years"],
            documentation_coverage=emp_d["documentation_coverage"],
            dependents=emp_d["dependents"],
            last_active=emp_d["last_active"]
        )
        db.add(emp)
        employees[emp_d["id"]] = emp
        
    db.commit()

    # 3. Seed Projects
    projects_data = [
        {"id": "p1", "name": "Core Deployment Pipeline", "status": "at-risk", "owner_id": "e1", "team": "Platform Infrastructure", "contributors": ["e1", "e4"]},
        {"id": "p2", "name": "Subscription Billing Engine", "status": "at-risk", "owner_id": "e2", "team": "Payments & Billing", "contributors": ["e2", "e6"]},
        {"id": "p3", "name": "Customer Analytics Warehouse", "status": "on-track", "owner_id": "e3", "team": "Data & Analytics", "contributors": ["e3", "e8"]},
        {"id": "p4", "name": "Multi-Region Failover", "status": "blocked", "owner_id": "e1", "team": "Platform Infrastructure", "contributors": ["e1", "e7"]},
        {"id": "p5", "name": "Observability Stack Migration", "status": "on-track", "owner_id": "e4", "team": "Platform Infrastructure", "contributors": ["e4"]},
        {"id": "p6", "name": "Onboarding Funnel Revamp", "status": "on-track", "owner_id": "e5", "team": "Growth Engineering", "contributors": ["e5", "e9", "e10"]},
        {"id": "p7", "name": "Legacy Invoicing Bridge", "status": "blocked", "owner_id": "e6", "team": "Payments & Billing", "contributors": ["e6"]},
        {"id": "p8", "name": "Zero-Trust Access Rollout", "status": "at-risk", "owner_id": "e7", "team": "Platform Infrastructure", "contributors": ["e7", "e1"]},
    ]
    
    for proj_d in projects_data:
        proj = Project(
            id=proj_d["id"],
            name=proj_d["name"],
            status=proj_d["status"],
            owner_id=proj_d["owner_id"],
            team=proj_d["team"]
        )
        # Add contributors
        for contrib_id in proj_d["contributors"]:
            if contrib_id in employees:
                proj.contributors.append(employees[contrib_id])
        db.add(proj)
        
    db.commit()

    # 4. Seed Documents
    documents_data = [
        {"id": "d1", "title": "Deploy Pipeline Runbook", "type": "Runbook", "author_id": "e1", "last_updated": "14 months ago", "staleness": "stale"},
        {"id": "d2", "title": "Billing Engine Architecture", "type": "Architecture", "author_id": "e2", "last_updated": "9 months ago", "staleness": "aging"},
        {"id": "d3", "title": "Warehouse ETL SOP", "type": "SOP", "author_id": "e3", "last_updated": "1 month ago", "staleness": "fresh"},
        {"id": "d4", "title": "Failover Drill Postmortem", "type": "Postmortem", "author_id": "e1", "last_updated": "11 months ago", "staleness": "stale"},
        {"id": "d5", "title": "Observability Onboarding Guide", "type": "Onboarding", "author_id": "e4", "last_updated": "2 months ago", "staleness": "fresh"},
        {"id": "d6", "title": "Growth Funnel Experiment Log", "type": "SOP", "author_id": "e5", "last_updated": "3 weeks ago", "staleness": "fresh"},
        {"id": "d7", "title": "Legacy Invoicing Bridge Notes", "type": "Architecture", "author_id": "e6", "last_updated": "21 months ago", "staleness": "stale"},
        {"id": "d8", "title": "Zero-Trust Rollout SOP", "type": "SOP", "author_id": "e7", "last_updated": "6 months ago", "staleness": "aging"},
    ]
    
    for doc_d in documents_data:
        doc = DocumentRecord(
            id=doc_d["id"],
            title=doc_d["title"],
            type=doc_d["type"],
            author_id=doc_d["author_id"],
            last_updated=doc_d["last_updated"],
            staleness=doc_d["staleness"]
        )
        db.add(doc)
        
    db.commit()
    print("Database seeding completed.")
