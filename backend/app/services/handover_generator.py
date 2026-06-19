from datetime import datetime
from sqlalchemy.orm import Session
from app.models import Employee, DocumentRecord
from app.services.simulator import run_resignation_simulation
from app.services.ai_assistant import get_gemini_model


def generate_handover_document(db: Session, employee_id: str) -> dict:
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        return None

    sim = run_resignation_simulation(db, employee_id)
    owned = employee.owned_projects
    authored_docs = db.query(DocumentRecord).filter(DocumentRecord.author_id == employee_id).all()

    now = datetime.utcnow().strftime("%B %d, %Y at %H:%M UTC")
    title = f"Knowledge Transfer Brief — {employee.name}, {employee.role}"

    # Try Gemini first
    model = get_gemini_model()
    if model:
        owned_names = ", ".join([p.name for p in owned]) if owned else "None"
        doc_list = ", ".join([f"{d.title} ({d.staleness})" for d in authored_docs]) if authored_docs else "None"
        impacted = ", ".join([f"{p['name']} ({p['severity']})" for p in sim["impacted_projects"]]) if sim else "Unknown"
        ramp = sim["estimated_ramp_weeks"] if sim else "Unknown"
        gap = sim["knowledge_gap_score"] if sim else "Unknown"

        prompt = f"""Generate a professional Knowledge Transfer Brief for the following employee leaving the organization.

Employee: {employee.name}
Role: {employee.role}
Team: {employee.team}
Tenure: {employee.tenure_years} years
Knowledge Risk Score: {employee.risk_score} ({employee.risk_level})
Documentation Coverage: {employee.documentation_coverage}%
Owned Projects: {owned_names}
Authored Documents: {doc_list}
Impacted Projects on Departure: {impacted}
Estimated Successor Ramp: {ramp} weeks
Knowledge Gap Score: {gap}

Write exactly 4 sections with these headings (use the exact heading text):
1. Scope
2. Existing documentation
3. Open knowledge gaps
4. Suggested successor ramp plan

Each section should be 2-4 sentences, professional, specific to the data above. Do not add extra headings or preamble. Format as:
HEADING: <heading>
BODY: <body>
(repeat for each section)"""

        try:
            response = model.generate_content(prompt)
            raw = response.text.strip()
            sections = []
            current_heading = None
            current_body_lines = []

            for line in raw.splitlines():
                line = line.strip()
                if line.startswith("HEADING:"):
                    if current_heading and current_body_lines:
                        sections.append({"heading": current_heading, "body": " ".join(current_body_lines).strip()})
                    current_heading = line.replace("HEADING:", "").strip()
                    current_body_lines = []
                elif line.startswith("BODY:"):
                    current_body_lines = [line.replace("BODY:", "").strip()]
                elif current_heading and line:
                    current_body_lines.append(line)

            if current_heading and current_body_lines:
                sections.append({"heading": current_heading, "body": " ".join(current_body_lines).strip()})

            if len(sections) >= 2:
                return {
                    "employee_id": employee_id,
                    "title": title,
                    "generated_at": now,
                    "sections": sections,
                }
        except Exception as e:
            print(f"Gemini handover generation failed: {e}. Using fallback.")

    # Template fallback
    ramp_weeks = sim["estimated_ramp_weeks"] if sim else max(2, round(employee.tenure_years * 1.6))
    gap_score = sim["knowledge_gap_score"] if sim else round(employee.risk_score * 0.6 + (100 - employee.documentation_coverage) * 0.4)
    undoc = sim.get("undocumented_areas", []) if sim else []
    impacted_projects = sim.get("impacted_projects", []) if sim else []

    sections = [
        {
            "heading": "Scope",
            "body": (
                f"This brief covers the {len(owned)} project(s) owned by {employee.name} "
                f"({', '.join([p.name for p in owned]) or 'none'}) and the institutional knowledge behind them. "
                f"{employee.name} has been with the organization for {employee.tenure_years} years on the {employee.team} team, "
                f"accumulating significant undocumented context that this document aims to surface."
            ),
        },
        {
            "heading": "Existing documentation",
            "body": (
                f"{len(authored_docs)} document(s) are currently attributed to {employee.name}: "
                f"{', '.join([d.title for d in authored_docs]) or 'none'}. "
                + ("Documents marked as stale should be treated as starting points only and verified before handover." if any(d.staleness == "stale" for d in authored_docs) else "")
                + (f" Overall documentation coverage is critically low at {employee.documentation_coverage}% — this brief is essential." if employee.documentation_coverage < 40 else "")
            ) if authored_docs else (
                f"No documentation is currently attributed to {employee.name} in the knowledge graph. "
                f"This brief represents the first written record of their institutional knowledge. "
                f"Immediate shadowing sessions are strongly recommended."
            ),
        },
        {
            "heading": "Open knowledge gaps",
            "body": (
                (undoc[0] if undoc else f"Day-to-day operational decisions on {', '.join([p.name for p in owned[:2]]) or 'key projects'} are largely undocumented. ")
                + f"Knowledge gap score is {gap_score}/100. "
                + (f"Projects at immediate risk: {', '.join([p['name'] for p in impacted_projects[:3]])}." if impacted_projects else "")
            ),
        },
        {
            "heading": "Suggested successor ramp plan",
            "body": (
                f"Budget approximately {ramp_weeks} weeks for a successor to reach operational independence. "
                f"Pair them on the next active cycle of each owned project and schedule weekly knowledge-transfer sessions for the first month. "
                f"Prioritize documenting live operational procedures before departure and assign a buddy from the {employee.team} team."
            ),
        },
    ]

    return {
        "employee_id": employee_id,
        "title": title,
        "generated_at": now,
        "sections": sections,
    }
