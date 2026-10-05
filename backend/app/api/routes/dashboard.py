"""
Dashboard API endpoints
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Student
from pydantic import BaseModel

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


class DashboardMetrics(BaseModel):
    """Dashboard metrics response."""
    total_students: int
    high_risk_count: int
    medium_risk_count: int
    low_risk_count: int
    improving_count: int
    declining_count: int
    active_interventions: int = 0
    average_attendance: float = 0.0
    average_performance: float = 0.0


@router.get("/metrics", response_model=DashboardMetrics)
def get_dashboard_metrics(db: Session = Depends(get_db)):
    """Get dashboard metrics."""
    
    # Get all students
    students = db.query(Student).all()
    total_students = len(students)
    
    # Count by risk level
    high_risk_count = len([s for s in students if s.risk_level == "high"])
    medium_risk_count = len([s for s in students if s.risk_level == "medium"])
    low_risk_count = len([s for s in students if s.risk_level == "low"])
    
    # Count by trend
    improving_count = len([s for s in students if s.performance_trend == "improving"])
    declining_count = len([s for s in students if s.performance_trend == "declining"])
    
    # Calculate averages
    if total_students > 0:
        avg_attendance = sum(s.attendance_percentage or 0 for s in students) / total_students
        avg_performance = sum(s.current_average or 0 for s in students) / total_students
    else:
        avg_attendance = 0.0
        avg_performance = 0.0
    
    return DashboardMetrics(
        total_students=total_students,
        high_risk_count=high_risk_count,
        medium_risk_count=medium_risk_count,
        low_risk_count=low_risk_count,
        improving_count=improving_count,
        declining_count=declining_count,
        active_interventions=0,  # TODO: Implement interventions count
        average_attendance=round(avg_attendance, 2),
        average_performance=round(avg_performance, 2),
    )
