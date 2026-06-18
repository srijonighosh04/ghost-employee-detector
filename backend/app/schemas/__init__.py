from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field, model_validator
from pydantic.alias_generators import to_camel

# Base class configures automatic camelCase conversion for frontend compatibility
class BaseSchema(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )

# --- Employee Schemas ---
class EmployeeBase(BaseSchema):
    name: str
    role: str
    team: str
    avatar_color: str
    initials: str
    risk_score: int
    risk_level: str
    tenure_years: float
    documentation_coverage: int
    dependents: int
    last_active: str

class EmployeeCreate(EmployeeBase):
    id: str

class EmployeeUpdate(BaseSchema):
    name: Optional[str] = None
    role: Optional[str] = None
    team: Optional[str] = None
    avatar_color: Optional[str] = None
    initials: Optional[str] = None
    risk_score: Optional[int] = None
    risk_level: Optional[str] = None
    tenure_years: Optional[float] = None
    documentation_coverage: Optional[int] = None
    dependents: Optional[int] = None
    last_active: Optional[str] = None

class EmployeeOut(EmployeeBase):
    id: str
    owned_projects: List[str] = Field(default_factory=list)

    @model_validator(mode="before")
    @classmethod
    def from_orm_custom(cls, data):
        if not isinstance(data, dict):
            return {
                "id": data.id,
                "name": data.name,
                "role": data.role,
                "team": data.team,
                "avatar_color": data.avatar_color,
                "initials": data.initials,
                "risk_score": data.risk_score,
                "risk_level": data.risk_level,
                "tenure_years": data.tenure_years,
                "documentation_coverage": data.documentation_coverage,
                "dependents": data.dependents,
                "last_active": data.last_active,
                "owned_projects": [p.id for p in data.owned_projects] if hasattr(data, "owned_projects") and data.owned_projects else []
            }
        return data

# --- Project Schemas ---
class ProjectBase(BaseSchema):
    name: str
    status: str  # "on-track", "at-risk", "blocked"
    owner_id: Optional[str] = None
    team: str

class ProjectCreate(ProjectBase):
    id: str

class ProjectOut(ProjectBase):
    id: str
    contributors: List[str] = Field(default_factory=list)

    @model_validator(mode="before")
    @classmethod
    def from_orm_custom(cls, data):
        if not isinstance(data, dict):
            return {
                "id": data.id,
                "name": data.name,
                "status": data.status,
                "owner_id": data.owner_id,
                "team": data.team,
                "contributors": [c.id for c in data.contributors] if hasattr(data, "contributors") and data.contributors else []
            }
        return data

# --- Document Schemas ---
class DocumentBase(BaseSchema):
    title: str
    type: str  # "SOP", "Runbook", "Architecture", "Onboarding", "Postmortem"
    author_id: Optional[str] = None
    last_updated: str
    staleness: str  # "fresh", "aging", "stale"

class DocumentCreate(DocumentBase):
    id: str

class DocumentOut(DocumentBase):
    id: str

# --- Team Schemas ---
class TeamBase(BaseSchema):
    name: str

class TeamCreate(TeamBase):
    id: str

class TeamOut(TeamBase):
    id: str
    member_ids: List[str] = Field(default_factory=list)

    @model_validator(mode="before")
    @classmethod
    def from_orm_custom(cls, data):
        if not isinstance(data, dict):
            return {
                "id": data.id,
                "name": data.name,
                "member_ids": [m.id for m in data.members] if hasattr(data, "members") and data.members else []
            }
        return data

# --- Simulation Schemas ---
class ImpactedProjectOut(BaseSchema):
    project_id: str
    name: str
    severity: str
    reason: str

class SimulationResultOut(BaseSchema):
    employee_id: str
    impacted_projects: List[ImpactedProjectOut]
    impacted_teammates: int
    knowledge_gap_score: int
    estimated_ramp_weeks: int
    undocumented_areas: List[str]

# --- AI Assistant / Chat Schemas ---
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseSchema):
    content: str
    cited_docs: Optional[List[str]] = None

# --- Handover Schemas ---
class HandoverSectionOut(BaseSchema):
    heading: str
    body: str

class HandoverOut(BaseSchema):
    employee_id: str
    title: str
    generated_at: str
    sections: List[HandoverSectionOut]
