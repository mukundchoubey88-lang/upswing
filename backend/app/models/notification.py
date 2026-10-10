from sqlalchemy import Column, String, Text, Boolean, DateTime, func, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.database import Base, generate_uuid


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(String(36), ForeignKey("students.id", ondelete="CASCADE"), nullable=True)
    type = Column(String(100), nullable=False)
    message = Column(Text, nullable=False)
    priority = Column(String(50), nullable=False, default="medium")  # critical, high, medium, low
    read = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User")
    student = relationship("Student", back_populates="notifications")

    # Indexes
    __table_args__ = (
        Index("idx_notifications_user_read", "user_id", "read"),
        Index("idx_notifications_priority", "priority"),
    )

    def __repr__(self):
        return f"<Notification user={self.user_id} type={self.type}>"
