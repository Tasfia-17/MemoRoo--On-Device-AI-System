from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from src.database.base import Base

class MoodLog(Base):
    __tablename__ = "mood_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    mood_label = Column(String, nullable=False) # e.g., "Calm", "Stressed", "Joyful"
    score = Column(Integer, nullable=True) # e.g., 0-100
    note = Column(Text, nullable=True) # Short explanation of mood
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", backref="mood_logs")

    def __repr__(self):
        return f"<MoodLog(id=\\\\\\\\'{self.id}\\' mood=\\\\\\\\'{self.mood_label}\\' user_id=\\\\\\\\'{self.user_id}\\' )>"
