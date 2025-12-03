from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from src.database.base import Base

class Attachment(Base):
    __tablename__ = "attachments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    memory_card_id = Column(UUID(as_uuid=True), ForeignKey("memory_cards.id"), nullable=False)
    filename = Column(String, nullable=False)
    mimetype = Column(String, nullable=False)
    file_url = Column(String, nullable=False) # Path to stored file
    size = Column(Integer, nullable=False)
    ocr_text = Column(Text, nullable=True)
    transcription = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    user = relationship("User", backref="attachments")
    memory_card = relationship("MemoryCard", backref="attachments_list")

    def __repr__(self):
        return f"<Attachment(id=\\\'{self.id}\\' filename=\\\'{self.filename}\\' memory_card_id=\\\'{self.memory_card_id}\\' )>"
