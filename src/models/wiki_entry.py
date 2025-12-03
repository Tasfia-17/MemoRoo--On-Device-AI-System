from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from src.database.base import Base

class WikiEntry(Base):
    __tablename__ = "wiki_entries"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    type = Column(String, nullable=True) # e.g., "Project", "Event", "Knowledge"
    summary = Column(Text, nullable=False)
    content = Column(Text, nullable=True) # Full content, if different from summary
    tags = Column(ARRAY(String), default=[]))
    embedding_id = Column(UUID(as_uuid=True), ForeignKey("embeddings.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    user = relationship("User", backref="wiki_entries")
    embedding = relationship("Embedding", backref="wiki_entry_source")

    def __repr__(self):
        return f"<WikiEntry(id=\\\\\\\\\\\\\\\\'{self.id}\\\\\\\\\\\\\\\\' title=\\\\\\\\\\\\\\\\'{self.title}\\\\\\\\\\\\\\\\' )>"
