from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID
from typing import List
import os
import shutil

from fastapi import UploadFile

from src.models.attachment import Attachment
from src.models.memory_card import MemoryCard
from src.core.exceptions import AttachmentNotFoundException, MemoryCardNotFoundException, UnauthorizedAccessException
from src.config.settings import settings

class AttachmentService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_attachment_by_id(self, user_id: UUID, attachment_id: UUID) -> Attachment:
        result = await self.db.execute(
            select(Attachment).filter(Attachment.id == attachment_id, Attachment.user_id == user_id)
        )
        attachment = result.scalar_one_or_none()
        if not attachment:
            raise AttachmentNotFoundException()
        return attachment

    async def get_attachments_for_memory_card(self, user_id: UUID, memory_card_id: UUID) -> List[Attachment]:
        result = await self.db.execute(
            select(Attachment).filter(Attachment.memory_card_id == memory_card_id, Attachment.user_id == user_id)
        )
        return result.scalars().all()

    async def upload_attachment(self, user_id: UUID, memory_card_id: UUID, file: UploadFile) -> Attachment:
        # Verify memory card exists and belongs to user
        memory_card_result = await self.db.execute(
            select(MemoryCard).filter(MemoryCard.id == memory_card_id, MemoryCard.user_id == user_id)
        )
        memory_card = memory_card_result.scalar_one_or_none()
        if not memory_card:
            raise MemoryCardNotFoundException()

        # Create user-specific media directory if it doesn't exist
        user_media_dir = os.path.join(settings.MEDIA_PATH, str(user_id), "attachments")
        os.makedirs(user_media_dir, exist_ok=True)

        # Generate a unique filename or use original and ensure uniqueness
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(user_media_dir, unique_filename)

        # Save file to disk
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Create Attachment record
        new_attachment = Attachment(
            user_id=user_id,
            memory_card_id=memory_card_id,
            filename=file.filename,
            mimetype=file.content_type,
            file_url=file_path, # Store local path
            size=file.size
        )
        self.db.add(new_attachment)
        await self.db.commit()
        await self.db.refresh(new_attachment)
        
        return new_attachment

    async def delete_attachment(self, user_id: UUID, attachment_id: UUID):
        attachment = await self.get_attachment_by_id(user_id, attachment_id)
        
        # Delete file from disk
        if os.path.exists(attachment.file_url):
            os.remove(attachment.file_url)

        # Delete record from database
        await self.db.delete(attachment)
        await self.db.commit()
