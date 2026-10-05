"""Database session management and utilities."""

from sqlalchemy.orm import Session
from app.models import Student, RiskScore, Assessment, Attendance, Assignment
from datetime import datetime, timedelta


def get_student_with_relations(db: Session, student_id: str):
    """Get student with all related data."""
    return db.query(Student).filter(Student.id == student_id).first()


def get_student_risk_history(db: Session, student_id: str, days: int = 30) -> list:
    """Get risk score history for student."""
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    return (
        db.query(RiskScore)
        .filter(
            RiskScore.student_id == student_id,
            RiskScore.created_at >= cutoff_date,
        )
        .order_by(RiskScore.created_at)
        .all()
    )


def get_student_recent_assessments(db: Session, student_id: str, limit: int = 10):
    """Get recent assessments for student."""
    return (
        db.query(Assessment)
        .filter(Assessment.student_id == student_id)
        .order_by(Assessment.date.desc())
        .limit(limit)
        .all()
    )


def get_student_attendance_percentage(db: Session, student_id: str, days: int = 90) -> float:
    """Calculate attendance percentage for student."""
    cutoff_date = datetime.utcnow().date() - timedelta(days=days)
    
    total = db.query(Attendance).filter(
        Attendance.student_id == student_id,
        Attendance.date >= cutoff_date,
    ).count()
    
    if total == 0:
        return 0.0
    
    present = db.query(Attendance).filter(
        Attendance.student_id == student_id,
        Attendance.date >= cutoff_date,
        Attendance.status == "present",
    ).count()
    
    return (present / total) * 100


def get_student_average_marks(db: Session, student_id: str) -> float:
    """Calculate average marks for student."""
    assessments = db.query(Assessment).filter(
        Assessment.student_id == student_id
    ).all()
    
    if not assessments:
        return 0.0
    
    total_percentage = sum(
        (float(a.marks) / float(a.max_marks)) * 100 for a in assessments
    )
    
    return total_percentage / len(assessments)


def get_student_assignment_completion(db: Session, student_id: str) -> float:
    """Calculate assignment completion percentage."""
    total = db.query(Assignment).filter(
        Assignment.student_id == student_id
    ).count()
    
    if total == 0:
        return 0.0
    
    completed = db.query(Assignment).filter(
        Assignment.student_id == student_id,
        Assignment.status.in_(["submitted", "graded"]),
    ).count()
    
    return (completed / total) * 100


def get_student_performance_history(db: Session, student_id: str, periods: int = 5):
    """Get performance history for trend analysis."""
    assessments = (
        db.query(Assessment)
        .filter(Assessment.student_id == student_id)
        .order_by(Assessment.date.desc())
        .limit(periods * 5)  # Get more, then group by period
        .all()
    )
    
    if not assessments:
        return []
    
    # Convert to percentages
    return [
        (float(a.marks) / float(a.max_marks)) * 100
        for a in reversed(assessments)
    ]
