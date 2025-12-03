from sqlalchemy import Column, String, DateTime, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from src.database.base import Base

class Embedding(Base):
    __tablename__ = "embeddings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    vector = Column(ARRAY(Float), nullable=False) # Store as array of floats
    source_type = Column(Enum("memory_card", "graph_node", "chat_message", name="embedding_source_type"), nullable=False)
    source_id = Column(UUID(as_uuid=True), nullable=False) # ID of the originating entity (MemoryCard, GraphNode, ChatMessage)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", backref="embeddings")

    def __repr__(self):
        return f"<Embedding(id=\\'{self.id}\\' source_type=\\'{self.source_type}\\' source_id=\\'{self.source_id}\\' )>"
