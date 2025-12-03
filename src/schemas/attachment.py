from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from uuid import UUID

class AttachmentResponse(BaseModel):
    id: UUID
    user_id: UUID
    memory_card_id: UUID
    filename: str
    mimetype: str
    file_url: str
    size: int
    ocr_text: Optional[str] = None
    transcription: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
