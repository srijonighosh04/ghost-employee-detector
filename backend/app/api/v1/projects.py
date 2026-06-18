from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import Project, Employee
from app.schemas import ProjectOut, ProjectCreate
from app.services.neo4j_sync import sync_db_to_neo4j

router = APIRouter()

@router.get("/", response_model=List[ProjectOut])
def get_projects(db: Session = Depends(get_db)):
    return db.query(Project).all()

@router.get("/{project_id}", response_model=ProjectOut)
def get_project(project_id: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with ID {project_id} not found"
        )
    return project

@router.post("/", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
def create_project(project_in: ProjectCreate, db: Session = Depends(get_db)):
    existing = db.query(Project).filter(Project.id == project_in.id).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Project with ID {project_in.id} already exists"
        )
        
    project = Project(
        id=project_in.id,
        name=project_in.name,
        status=project_in.status,
        owner_id=project_in.owner_id,
        team=project_in.team
    )
    
    # Add owner as initial contributor automatically if owner exists
    if project_in.owner_id:
        owner = db.query(Employee).filter(Employee.id == project_in.owner_id).first()
        if owner:
            project.contributors.append(owner)
            
    db.add(project)
    db.commit()
    db.refresh(project)
    
    # Trigger graph sync
    sync_db_to_neo4j(db)
    
    return project

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(project_id: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with ID {project_id} not found"
        )
    db.delete(project)
    db.commit()
    
    # Trigger graph sync
    sync_db_to_neo4j(db)
    
    return None
