import os
from sqlalchemy.orm import Session
from app.models import Employee, Project, DocumentRecord, Team
from app.core.config import settings


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


def _build_org_context(db: Session) -> str:
    db_employees = db.query(Employee).all()
    db_projects = db.query(Project).all()
    db_docs = db.query(DocumentRecord).all()
    db_teams = db.query(Team).all()

    emp_lines = []
    for e in db_employees:
        owned = [p.name for p in e.owned_projects]
        emp_lines.append(
            f"- {e.name} | Role: {e.role} | Team: {e.team} | Risk Score: {e.risk_score} | "
            f"Risk Level: {e.risk_level} | Doc Coverage: {e.documentation_coverage}% | "
            f"Dependents: {e.dependents} | Tenure: {e.tenure_years} yrs | Owned Projects: {owned or 'None'}"
        )

    proj_lines = []
    for p in db_projects:
        contribs = [c.name for c in p.contributors]
        proj_lines.append(
            f"- {p.name} | Status: {p.status} | Team: {p.team} | "
            f"Owner ID: {p.owner_id} | Contributors: {contribs or 'None'}"
        )

    doc_lines = [
        f"- {d.title} | Type: {d.type} | Staleness: {d.staleness} | Last Updated: {d.last_updated} | Author ID: {d.author_id}"
        for d in db_docs
    ]

    team_lines = [f"- {t.name} (ID: {t.id})" for t in db_teams]

    return f"""=== ORGANIZATIONAL KNOWLEDGE GRAPH ===

EMPLOYEES:
{chr(10).join(emp_lines)}

PROJECTS:
{chr(10).join(proj_lines)}

DOCUMENTS:
{chr(10).join(doc_lines)}

TEAMS:
{chr(10).join(team_lines)}
"""


def _keyword_fallback(db: Session, query: str) -> dict:
    """Rich rule-based fallback when Gemini is unavailable."""
    q = query.lower()
    employees = db.query(Employee).all()
    projects = db.query(Project).all()
    docs = db.query(DocumentRecord).all()

    # Find mentioned employee
    emp = next(
        (e for e in employees if e.name.lower() in q or e.name.split()[0].lower() in q), None
    )
    # Find mentioned project
    proj = next((p for p in projects if p.name.lower() in q), None)

    # Who owns / responsible for a project
    if proj and any(w in q for w in ["responsible", "owns", "who", "owner"]):
        owner = next((e for e in employees if e.id == proj.owner_id), None)
        cited = [d.title for d in docs if d.author_id == (owner.id if owner else None)]
        return {
            "content": (
                f"{owner.name} owns {proj.name} ({proj.status.replace('-', ' ')}). "
                f"Their Knowledge Risk Score is {owner.risk_score} with "
                f"{owner.documentation_coverage}% documentation coverage."
                + (" That makes this project a single point of failure." if owner.risk_score >= 75 else "")
                if owner else f"No owner is currently assigned to {proj.name}."
            ),
            "cited_docs": cited,
        }

    # What happens if someone leaves
    if emp and any(w in q for w in ["leave", "resign", "impact", "depend", "what if", "happen"]):
        owned = [p for p in projects if p.owner_id == emp.id]
        cited = [d.title for d in docs if d.author_id == emp.id]
        gap_score = round(emp.risk_score * 0.6 + (100 - emp.documentation_coverage) * 0.4)
        ramp = max(2, round(emp.tenure_years * 1.6))
        return {
            "content": (
                f"If {emp.name} leaves, {len(owned)} project(s) are immediately impacted: "
                f"{', '.join(p.name for p in owned) or 'none'}. "
                f"Knowledge gap score: {gap_score}. "
                f"Estimated successor ramp: {ramp} weeks."
            ),
            "cited_docs": cited,
        }

    # General employee info
    if emp:
        owned = [p.name for p in projects if p.owner_id == emp.id]
        return {
            "content": (
                f"{emp.name} is a {emp.role} on {emp.team}. "
                f"Knowledge Risk Score: {emp.risk_score} ({emp.risk_level}). "
                f"Documentation coverage: {emp.documentation_coverage}%. "
                f"Dependents: {emp.dependents}. Owned projects: {', '.join(owned) or 'none'}."
            ),
            "cited_docs": [],
        }

    # General project info
    if proj:
        owner = next((e for e in employees if e.id == proj.owner_id), None)
        return {
            "content": (
                f"{proj.name} is currently {proj.status.replace('-', ' ')}, "
                f"owned by {owner.name if owner else 'no one'}, "
                f"under {proj.team}."
            ),
            "cited_docs": [],
        }

    # High-risk overview
    if any(w in q for w in ["high risk", "critical", "dangerous", "top risk"]):
        critical = sorted(employees, key=lambda e: e.risk_score, reverse=True)[:3]
        lines = [f"{e.name} ({e.risk_level}, score {e.risk_score})" for e in critical]
        return {
            "content": f"Top knowledge risks right now: {', '.join(lines)}.",
            "cited_docs": [],
        }

    return {
        "content": (
            "I can answer questions about employee ownership, project dependencies, "
            "documentation staleness, and resignation impact. Try asking: "
            "'Who owns the Core Deployment Pipeline?' or 'What happens if Priya Nair leaves?'"
        ),
        "cited_docs": [],
    }


def answer_user_query(db: Session, query: str) -> dict:
    model = get_gemini_model()

    if model:
        org_context = _build_org_context(db)
        system_prompt = f"""You are Sentinel's AI Knowledge Assistant. You have access to the organization's knowledge graph below.
Answer questions about ownership, dependencies, risk scores, documentation coverage, and resignation impact.
Be concise but specific. Always cite employee names and project names from the graph.
If you mention documents, list their titles.

{org_context}"""
        try:
            response = model.generate_content(
                f"{system_prompt}\n\nUser question: {query}"
            )
            cited = []
            docs = db.query(DocumentRecord).all()
            resp_text = response.text
            for d in docs:
                if d.title.lower() in resp_text.lower():
                    cited.append(d.title)
            return {"content": resp_text, "cited_docs": cited}
        except Exception as e:
            print(f"Gemini call failed: {e}. Using fallback.")

    return _keyword_fallback(db, query)
