import os
from sqlalchemy.orm import Session
from app.models import Employee, Project, DocumentRecord, Team
from app.core.config import settings
from app.services.simulator import run_resignation_simulation

# Initialize Gemini if key is provided
def get_gemini_model():
    api_key = settings.effective_gemini_api_key
    if not api_key:
        return None
    try:
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        return genai.GenerativeModel("gemini-1.5-flash")
    except Exception as e:
        print(f"Error configuring Gemini client: {e}")
        return None

def answer_user_query(db: Session, query: str) -> dict:
    """
    Answers user questions about the organization's knowledge graph.
    Uses LangChain and Gemini from the ai_engine package if available.
    """
    db_employees = db.query(Employee).all()
    db_projects = db.query(Project).all()
    db_docs = db.query(DocumentRecord).all()
    db_teams = db.query(Team).all()
    
    # Build database context snapshot
    emp_list = []
    for e in db_employees:
        owned = [p.name for p in e.owned_projects]
        emp_list.append(
            f"- {e.name} (Role: {e.role}, Team: {e.team}, "
            f"Risk Score: {e.risk_score}, Risk Level: {e.risk_level}, "
            f"Doc Coverage: {e.documentation_coverage}%, Dependents: {e.dependents}, "
            f"Owned Projects: {owned})"
        )
        
    proj_list = []
    for p in db_projects:
        contribs = [c.name for c in p.contributors]
        owner_name = p.owner.name if p.owner else "None"
        proj_list.append(
            f"- {p.name} (Status: {p.status}, Owner: {owner_name}, Team: {p.team}, Contributors: {contribs})"
        )
        
    team_list = []
    for t in db_teams:
        m_names = [m.name for m in t.members]
        team_list.append(f"- {t.name} (Members: {m_names})")
        
    db_context = (
        "EMPLOYEES:\n" + "\n".join(emp_list) + "\n\n"
        "PROJECTS:\n" + "\n".join(proj_list) + "\n\n"
        "TEAMS:\n" + "\n".join(team_list)
    )
    
    # Try executing the LangChain assistant chain from the ai_engine package
    try:
        from ai_engine.chains.assistant_chain import run_assistant_chain
        return run_assistant_chain(query, db_context)
    except Exception as e:
        print(f"Warning: Failed to execute RAG assistant chain: {e}. Falling back to db local lookup.")


    # Rule-Based Fallback Mode (Grounded in DB data)
    q = query.lower()
    
    # 1. Look for employee-related query
    matched_employee = None
    for emp in db_employees:
        first_name = emp.name.split(" ")[0].lower()
        if emp.name.lower() in q or first_name in q:
            matched_employee = emp
            break
            
    # 2. Look for project-related query
    matched_project = None
    for proj in db_projects:
        if proj.name.lower() in q:
            matched_project = proj
            break

    # Scenario A: Project query about owner/status
    if matched_project and any(kw in q for kw in ["responsible", "owns", "who", "owner"]):
        owner = matched_project.owner
        docs = db.query(DocumentRecord).filter(DocumentRecord.author_id == matched_project.owner_id).all()
        doc_titles = [d.title for d in docs]
        
        if owner:
            risk_text = " That combination makes this project a single point of failure right now." if owner.risk_score >= 75 else ""
            content = f"{owner.name} owns {matched_project.name} ({matched_project.status.replace('-', ' ')}). Their Knowledge Risk Score is {owner.risk_score}, and documentation coverage for their work sits at {owner.documentation_coverage}%.{risk_text}"
            return {
                "content": content,
                "cited_docs": doc_titles
            }
        else:
            return {
                "content": f"No owner is currently assigned to {matched_project.name} in the graph.",
                "cited_docs": []
            }
            
    # Scenario B: Resignation/Impact query on Employee
    if matched_employee and any(kw in q for kw in ["depend", "impact", "leave", "resign", "quit"]):
        sim = run_resignation_simulation(db, matched_employee.id)
        if sim and sim["impacted_projects"]:
            names = ", ".join([p["name"] for p in sim["impacted_projects"]])
            content = f"{len(sim['impacted_projects'])} active project(s) depend on {matched_employee.name}: {names}. Estimated ramp time for a successor is {sim['estimated_ramp_weeks']} weeks, with a knowledge gap score of {sim['knowledge_gap_score']}."
        else:
            content = f"No active projects currently depend solely on {matched_employee.name}."
            
        docs = db.query(DocumentRecord).filter(DocumentRecord.author_id == matched_employee.id).all()
        doc_titles = [d.title for d in docs]
        return {
            "content": content,
            "cited_docs": doc_titles
        }
        
    # Scenario C: Simple Employee Info query
    if matched_employee:
        return {
            "content": f"{matched_employee.name} is a {matched_employee.role} on the {matched_employee.team} team, with a Knowledge Risk Score of {matched_employee.risk_score} ({matched_employee.risk_level}). Documentation coverage for their work is {matched_employee.documentation_coverage}%, and {matched_employee.dependents} people or processes currently depend on them."
        }
        
    # Scenario D: Simple Project Info query
    if matched_project:
        owner_name = matched_project.owner.name if matched_project.owner else "no one"
        return {
            "content": f"{matched_project.name} is currently {matched_project.status.replace('-', ' ')}, owned by {owner_name}, with {len(matched_project.contributors)} contributor(s)."
        }
        
    # General Info
    return {
        "content": (
            "I can answer questions grounded in the database knowledge graph — try asking about "
            "a specific person (\"What does Priya Nair own?\"), a project (\"Who is responsible "
            "for the Subscription Billing Engine?\"), or an impact scenario (\"What happens if "
            "Tobias Hahn leaves?\")."
        )
    }
