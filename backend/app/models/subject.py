from sqlalchemy import Column, String, Integer, DateTime, func
from sqlalchemy.orm import relationship
from app.database import Base, generate_uuid


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    code = Column(String(50), unique=True, nullable=False, index=True)
    semester = Column(Integer, nullable=True)
    department = Column(String(100), nullable=True)
    credits = Column(Integer, default=3)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    assessments = relationship("Assessment", back_populates="subject", cascade="all, delete-orphan")
    assignments = relationship("Assignment", back_populates="subject", cascade="all, delete-orphan")
    attendance = relationship("Attendance", back_populates="subject", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Subject {self.code} - {self.name}>"
