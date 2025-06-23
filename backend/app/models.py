from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Enum, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(Enum("manager", "employee", name="role_enum"), nullable=False)
    manager_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    team_members = relationship("User", backref="manager", remote_side=[id])
    feedback_given = relationship("Feedback", back_populates="manager", foreign_keys='Feedback.manager_id')
    feedback_received = relationship("Feedback", back_populates="employee", foreign_keys='Feedback.employee_id')

class Feedback(Base):
    __tablename__ = "feedback"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("users.id"))
    manager_id = Column(Integer, ForeignKey("users.id"))
    strengths = Column(Text)
    areas_to_improve = Column(Text)
    sentiment = Column(Enum("positive", "neutral", "negative", name="sentiment_enum"))
    tags = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    acknowledged = Column(Boolean, default=False)
    employee_comment = Column(Text, nullable=True)

    employee = relationship("User", foreign_keys=[employee_id], back_populates="feedback_received")
    manager = relationship("User", foreign_keys=[manager_id], back_populates="feedback_given")
