from sqlalchemy import Column, String, Numeric, Text, DateTime, func, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base, generate_uuid


class RiskFactor(Base):
    __tablename__ = "risk_factors"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    risk_score_id = Column(String(36), ForeignKey("risk_scores.id", ondelete="CASCADE"), nullable=False)
    factor_name = Column(String(255), nullable=False)
    contribution_points = Column(Numeric(10, 2), nullable=False)
    explanation = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    risk_score = relationship("RiskScore", back_populates="risk_factors")

    def __repr__(self):
        return f"<RiskFactor {self.factor_name} points={self.contribution_points}>"
