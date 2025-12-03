from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Text, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from src.database.base import Base

class Habit(Base):
    __tablename__ = "habits"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    target_value = Column(Float, nullable=True)
    current_value = Column(Float, default=0.0)
    unit = Column(String, nullable=True) # e.g., "ml", "hours", "mins"
    frequency = Column(String, default="daily") # e.g., "daily", "weekly", "monthly"
    streak_count = Column(Integer, default=0)
    last_completed = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    user = relationship("User", backref="habits")

    def __repr__(self):
        return f"<Habit(id=\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\'{self.id}\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\' name=\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\'{self.name}\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\' )>"
