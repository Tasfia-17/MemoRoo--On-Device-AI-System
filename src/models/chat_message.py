from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Enum
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from src.database.base import Base

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    conversation_id = Column(UUID(as_uuid=True), ForeignKey("conversations.id"), nullable=False)
    role = Column(Enum("user", "ai", name="chat_message_role"), nullable=False)
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    related_memory_ids = Column(ARRAY(UUID(as_uuid=True)), nullable=True, default=[])
    action = Column(String, nullable=True) # e.g., "memory_created", "memory_updated"
    mood_context = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    conversation = relationship("Conversation", backref="messages")

    def __repr__(self):
        return f"<ChatMessage(id=\\\\\\'{self.id}\\' role=\\\\\\'{self.role}\\' conversation_id=\\\\\\'{self.conversation_id}\\' )>"
