from sqlalchemy import Column, String, Numeric, DateTime, func, ForeignKey, UniqueConstraint, Index
from sqlalchemy.orm import relationship
from app.database import Base, generate_uuid


class AcademicHistory(Base):
    __tablename__ = "academic_history"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    student_id = Column(String(36), ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    semester = Column(String(50), nullable=False)
    average_marks = Column(Numeric(10, 2), nullable=True)
    gpa = Column(Numeric(4, 2), nullable=True)
    backlogs = Column(Numeric(4, 0), nullable=True, default=0)
    status = Column(String(50), nullable=True)  # pass, fail, incomplete
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    student = relationship("Student", back_populates="academic_history")

    # Constraints
    __table_args__ = (
        UniqueConstraint("student_id", "semester", name="uq_academic_history_student_semester"),
        Index("idx_academic_history_student", "student_id"),
    )

    def __repr__(self):
        return f"<AcademicHistory student={self.student_id} semester={self.semester}>"
