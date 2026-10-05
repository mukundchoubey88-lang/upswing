from sqlalchemy import Column, Numeric, String, DateTime, func, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.database import Base, generate_uuid


class RiskScore(Base):
    __tablename__ = "risk_scores"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    student_id = Column(String(36), ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    overall_score = Column(Numeric(10, 2), nullable=False)
    attendance_factor = Column(Numeric(10, 2), nullable=False, default=0)
    performance_factor = Column(Numeric(10, 2), nullable=False, default=0)
    history_factor = Column(Numeric(10, 2), nullable=False, default=0)
    assignment_factor = Column(Numeric(10, 2), nullable=False, default=0)
    trend_factor = Column(Numeric(10, 2), nullable=False, default=0)
    risk_level = Column(String(50), nullable=False)  # low, medium, high
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    student = relationship("Student", back_populates="risk_scores")
    risk_factors = relationship("RiskFactor", back_populates="risk_score", cascade="all, delete-orphan")

    # Indexes
    __table_args__ = (
        Index("idx_risk_scores_student_date", "student_id", "created_at"),
        Index("idx_risk_scores_level", "risk_level"),
    )

    def __repr__(self):
        return f"<RiskScore student={self.student_id} level={self.risk_level}>"
