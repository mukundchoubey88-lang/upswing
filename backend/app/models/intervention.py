from sqlalchemy import Column, String, Date, Text, DateTime, func, ForeignKey, Index, Numeric
from sqlalchemy.orm import relationship
from app.database import Base, generate_uuid


class Intervention(Base):
    __tablename__ = "interventions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    student_id = Column(String(36), ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    assigned_teacher_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    problem = Column(Text, nullable=False)
    intervention_type = Column(String(100), nullable=True)
    start_date = Column(Date, nullable=False)
    follow_up_date = Column(Date, nullable=True)
    status = Column(String(50), nullable=False, default="planned")  # planned, in_progress, completed, monitoring
    notes = Column(Text, nullable=True)
    outcome = Column(Text, nullable=True)
    risk_score_before = Column(Numeric(10, 2), nullable=True)
    risk_score_after = Column(Numeric(10, 2), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    student = relationship("Student", back_populates="interventions")
    assigned_teacher = relationship("User")

    # Indexes
    __table_args__ = (
        Index("idx_interventions_student_date", "student_id", "created_at"),
        Index("idx_interventions_status", "status"),
    )

    def __repr__(self):
        return f"<Intervention student={self.student_id} status={self.status}>"
