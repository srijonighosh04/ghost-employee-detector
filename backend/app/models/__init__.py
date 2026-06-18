from sqlalchemy import Column, String, Integer, Float, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.core.database import Base

# Junction table for many-to-many relationship between projects and employees (contributors)
project_contributors = Table(
    "project_contributors",
    Base.metadata,
    Column("project_id", String, ForeignKey("projects.id", ondelete="CASCADE"), primary_key=True),
    Column("employee_id", String, ForeignKey("employees.id", ondelete="CASCADE"), primary_key=True)
)

class Team(Base):
    __tablename__ = "teams"
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    
    # We can query members dynamically or via relationship if mapped
    members = relationship("Employee", back_populates="team_rel")

class Employee(Base):
    __tablename__ = "employees"
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    team = Column(String, nullable=False)  # Store team name directly as well for easy frontend mapping
    team_id = Column(String, ForeignKey("teams.id", ondelete="SET NULL"), nullable=True)
    avatar_color = Column(String)
    initials = Column(String)
    risk_score = Column(Integer, default=0)
    risk_level = Column(String, default="low")
    tenure_years = Column(Float, default=0.0)
    documentation_coverage = Column(Integer, default=0)  # percentage
    dependents = Column(Integer, default=0)
    last_active = Column(String)
    
    # Relationships
    team_rel = relationship("Team", back_populates="members")
    owned_projects = relationship("Project", back_populates="owner", foreign_keys="[Project.owner_id]")
    contributing_projects = relationship("Project", secondary=project_contributors, back_populates="contributors")
    documents = relationship("DocumentRecord", back_populates="author")

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    status = Column(String, nullable=False)  # "on-track", "at-risk", "blocked"
    owner_id = Column(String, ForeignKey("employees.id", ondelete="SET NULL"), nullable=True)
    team = Column(String, nullable=False)
    
    # Relationships
    owner = relationship("Employee", back_populates="owned_projects", foreign_keys=[owner_id])
    contributors = relationship("Employee", secondary=project_contributors, back_populates="contributing_projects")

class DocumentRecord(Base):
    __tablename__ = "documents"
    
    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    type = Column(String, nullable=False)  # "SOP", "Runbook", "Architecture", "Onboarding", "Postmortem"
    author_id = Column(String, ForeignKey("employees.id", ondelete="SET NULL"), nullable=True)
    last_updated = Column(String)
    staleness = Column(String)  # "fresh", "aging", "stale"
    
    # Relationships
    author = relationship("Employee", back_populates="documents")
