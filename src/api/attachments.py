from typing import Annotated, List
from uuid import UUID

from fastapi import APIRouter, Depends, status, UploadFile, File

from src.schemas.attachment import AttachmentResponse
from src.services.attachment_service import AttachmentService
from src.api.deps import CurrentUser

router = APIRouter()

@router.post("/{memory_card_id}", response_model=AttachmentResponse, status_code=status.HTTP_201_CREATED)
async def upload_attachment_for_memory_card(
    memory_card_id: UUID,
    file: Annotated[UploadFile, File(...)],
    current_user_id: CurrentUser,
    attachment_service: Annotated[AttachmentService, Depends()]
):
    return await attachment_service.upload_attachment(UUID(current_user_id), memory_card_id, file)

@router.get("/{memory_card_id}", response_model=List[AttachmentResponse])
async def get_attachments_for_memory_card(
    memory_card_id: UUID,
    current_user_id: CurrentUser,
    attachment_service: Annotated[AttachmentService, Depends()]
):
    return await attachment_service.get_attachments_for_memory_card(UUID(current_user_id), memory_card_id)

@router.delete("/{attachment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_attachment(
    attachment_id: UUID,
    current_user_id: CurrentUser,
    attachment_service: Annotated[AttachmentService, Depends()]
):
    await attachment_service.delete_attachment(UUID(current_user_id), attachment_id)
    return None
