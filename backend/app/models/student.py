from sqlalchemy import Column, String, DateTime, Integer, Float, func
from sqlalchemy.orm import relationship
from app.database import Base, generate_uuid


class Student(Base):
    __tablename__ = "students"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=True, index=True)
    student_id = Column(String(50), unique=True, nullable=False, index=True)
    class_semester = Column(String(50), nullable=False)
    enrollment_status = Column(String(50), default="active")  # active, inactive, graduated
    
    # Additional fields for frontend display
    course = Column(String(100), nullable=True)
    semester = Column(Integer, nullable=True)
    department = Column(String(100), nullable=True)
    enrollment_year = Column(Integer, nullable=True)
    
    # Cached computed fields (updated by risk engine)
    attendance_percentage = Column(Float, default=0.0)
    current_average = Column(Float, default=0.0)
    previous_average = Column(Float, default=0.0)
    assignment_completion = Column(Float, default=0.0)
    missing_assignments = Column(Integer, default=0)
    risk_score = Column(Float, default=0.0)
    risk_level = Column(String(20), default="low")  # low, medium, high
    performance_trend = Column(String(20), default="stable")  # improving, stable, declining
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    attendance = relationship("Attendance", back_populates="student", cascade="all, delete-orphan")
    assessments = relationship("Assessment", back_populates="student", cascade="all, delete-orphan")
    assignments = relationship("Assignment", back_populates="student", cascade="all, delete-orphan")
    academic_history = relationship("AcademicHistory", back_populates="student", cascade="all, delete-orphan")
    risk_scores = relationship("RiskScore", back_populates="student", cascade="all, delete-orphan")
    interventions = relationship("Intervention", back_populates="student", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="student", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Student {self.name} ({self.student_id})>"
