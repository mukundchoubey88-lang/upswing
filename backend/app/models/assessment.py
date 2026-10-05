from sqlalchemy import Column, Numeric, Date, DateTime, String, func, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.database import Base, generate_uuid


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    student_id = Column(String(36), ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    subject_id = Column(String(36), ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False)
    marks = Column(Numeric(10, 2), nullable=False)
    max_marks = Column(Numeric(10, 2), nullable=False, default=100)
    date = Column(Date, nullable=False)
    assessment_type = Column(String(50), nullable=True)  # quiz, midterm, final, project
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    student = relationship("Student", back_populates="assessments")
    subject = relationship("Subject", back_populates="assessments")

    # Indexes
    __table_args__ = (
        Index("idx_assessments_student_date", "student_id", "date"),
        Index("idx_assessments_student_subject", "student_id", "subject_id"),
    )

    def __repr__(self):
        return f"<Assessment student={self.student_id} subject={self.subject_id} marks={self.marks}>"
