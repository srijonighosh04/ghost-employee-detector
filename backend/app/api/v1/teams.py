from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import Team
from app.schemas import TeamOut

router = APIRouter()

@router.get("/", response_model=List[TeamOut])
def get_teams(db: Session = Depends(get_db)):
    return db.query(Team).all()

@router.get("/{team_id}", response_model=TeamOut)
def get_team(team_id: str, db: Session = Depends(get_db)):
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Team with ID {team_id} not found"
        )
    return team
