from sqlalchemy import Column, String, Numeric, Date, DateTime, func, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.database import Base, generate_uuid


class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    student_id = Column(String(36), ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    subject_id = Column(String(36), ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    due_date = Column(Date, nullable=False)
    submission_date = Column(Date, nullable=True)
    marks = Column(Numeric(10, 2), nullable=True)
    max_marks = Column(Numeric(10, 2), nullable=False, default=100)
    status = Column(String(50), nullable=False, default="pending")  # pending, submitted, graded, overdue
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    student = relationship("Student", back_populates="assignments")
    subject = relationship("Subject", back_populates="assignments")

    # Indexes
    __table_args__ = (
        Index("idx_assignments_student_date", "student_id", "due_date"),
        Index("idx_assignments_status", "status"),
    )

    def __repr__(self):
        return f"<Assignment {self.title} student={self.student_id}>"
