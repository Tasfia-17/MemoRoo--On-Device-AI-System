from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Enum, Float
from sqlalchemy.dialects.postgresql import UUID, ARRAY, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from src.database.base import Base

class MemoryCard(Base):
    __tablename__ = "memory_cards"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    type = Column(Enum("note", "link", "file", "voice", "image", name="memory_card_type"), nullable=False)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=True) # Raw text, or summary/transcription
    url = Column(String, nullable=True)
    attachment_id = Column(UUID(as_uuid=True), ForeignKey("attachments.id"), nullable=True)
    embedding_id = Column(UUID(as_uuid=True), ForeignKey("embeddings.id"), nullable=True)
    tags = Column(ARRAY(String), default=[]))
    metadata = Column(JSONB, default={})
    canvas_position_x = Column(Float, nullable=True)
    canvas_position_y = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    user = relationship("User", backref="memory_cards")
    attachment = relationship("Attachment", backref="memory_card_parent")
    embedding = relationship("Embedding", backref="memory_card_source")

    def __repr__(self):
        return f"<MemoryCard(id=\\'{self.id}\\' title=\\'{self.title}\\' type=\\'{self.type}\\' user_id=\\'{self.user_id}\\' )>"
