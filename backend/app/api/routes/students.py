"""
Students API endpoints
"""
from datetime import datetime
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Student
from pydantic import BaseModel, field_validator
from typing import List, Optional

router = APIRouter(prefix="/students", tags=["students"])


class StudentResponse(BaseModel):
    """Student response model."""
    id: str
    student_id: str
    name: str
    email: str | None
    course: str | None
    semester: int | None
    department: str | None
    attendance_percentage: float
    current_average: float
    previous_average: float
    assignment_completion: float
    risk_score: float
    risk_level: str
    performance_trend: str
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True

    @field_validator("id", "created_at", "updated_at", mode="before")
    @classmethod
    def stringify_fields(cls, v):
        if v is None:
            return ""
        if isinstance(v, datetime):
            return v.isoformat()
        return str(v)


class PaginatedStudents(BaseModel):
    """Paginated students response."""
    items: List[StudentResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


@router.get("", response_model=PaginatedStudents)
def get_students(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    risk_level: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    semester: Optional[int] = Query(None),
    department: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """Get paginated list of students with filters."""
    
    # Build query
    query = db.query(Student)
    
    # Apply filters
    if risk_level:
        query = query.filter(Student.risk_level == risk_level)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Student.name.ilike(search_term)) |
            (Student.student_id.ilike(search_term)) |
            (Student.email.ilike(search_term))
        )
    
    if semester:
        query = query.filter(Student.semester == semester)
    
    if department:
        query = query.filter(Student.department == department)
    
    # Get total count
    total = query.count()
    
    # Apply pagination
    offset = (page - 1) * page_size
    students = query.offset(offset).limit(page_size).all()
    
    # Calculate total pages
    total_pages = (total + page_size - 1) // page_size if total > 0 else 1
    
    return PaginatedStudents(
        items=[StudentResponse.model_validate(s) for s in students],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.get("/{student_id}", response_model=StudentResponse)
def get_student(student_id: str, db: Session = Depends(get_db)):
    """Get student by ID."""
    student = db.query(Student).filter(Student.id == student_id).first()
    
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    return StudentResponse.model_validate(student)
