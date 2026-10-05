from sqlalchemy import Column, String, Date, DateTime, func, ForeignKey, UniqueConstraint, Index
from sqlalchemy.orm import relationship
from app.database import Base, generate_uuid


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    student_id = Column(String(36), ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    subject_id = Column(String(36), ForeignKey("subjects.id", ondelete="CASCADE"), nullable=True)
    date = Column(Date, nullable=False)
    status = Column(String(20), nullable=False)  # present, absent, late
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    student = relationship("Student", back_populates="attendance")
    subject = relationship("Subject", back_populates="attendance")

    # Constraints
    __table_args__ = (
        UniqueConstraint("student_id", "subject_id", "date", name="uq_attendance_student_subject_date"),
        Index("idx_attendance_student_date", "student_id", "date"),
    )

    def __repr__(self):
        return f"<Attendance student={self.student_id} date={self.date} status={self.status}>"
