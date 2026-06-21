# Neo4j Schema Definitions for NexusIQ

# Node Labels
EMPLOYEE_LABEL = "Employee"
PROJECT_LABEL = "Project"
DOCUMENT_LABEL = "Document"
TEAM_LABEL = "Team"

# Relationship Types
MEMBER_OF = "MEMBER_OF"          # (Employee)-[:MEMBER_OF]->(Team)
OWNS = "OWNS"                    # (Employee)-[:OWNS]->(Project)
CONTRIBUTES_TO = "CONTRIBUTES_TO" # (Employee)-[:CONTRIBUTES_TO]->(Project)
AUTHORED = "AUTHORED"            # (Employee)-[:AUTHORED]->(Document)

# Node Properties Schemas (for documentation and validation)
NODE_PROPERTIES = {
    EMPLOYEE_LABEL: {
        "id": "String (Primary Key)",
        "name": "String",
        "role": "String",
        "team": "String",
        "avatarColor": "String",
        "initials": "String",
        "riskScore": "Integer",
        "riskLevel": "String",
        "tenureYears": "Float",
        "documentationCoverage": "Integer",
        "dependents": "Integer",
        "lastActive": "String"
    },
    PROJECT_LABEL: {
        "id": "String (Primary Key)",
        "name": "String",
        "status": "String",  # "on-track", "at-risk", "blocked"
        "team": "String"
    },
    DOCUMENT_LABEL: {
        "id": "String (Primary Key)",
        "title": "String",
        "type": "String",    # "SOP", "Runbook", "Architecture", "Onboarding", "Postmortem"
        "lastUpdated": "String",
        "staleness": "String"  # "fresh", "aging", "stale"
    },
    TEAM_LABEL: {
        "id": "String (Primary Key)",
        "name": "String"
    }
}
