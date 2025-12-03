from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Enum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from src.database.base import Base

class TimelineEvent(Base):
    __tablename__ = "timeline_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    type = Column(Enum("voice", "photo", "text", "event", "habit_completion", name="timeline_event_type"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    memory_card_id = Column(UUID(as_uuid=True), ForeignKey("memory_cards.id"), nullable=True)
    mood_context = Column(String, nullable=True)
    metadata = Column(JSONB, default={})
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    user = relationship("User", backref="timeline_events")
    memory_card = relationship("MemoryCard", backref="timeline_events_list")

    def __repr__(self):
        return f"<TimelineEvent(id=\\\\\\\\\\'{self.id}\\\\\\\\\\' title=\\\\\\\\\\'{self.title}\\\\\\\\\\' type=\\\\\\\\\\'{self.type}\\\\\\\\\\' )>"
