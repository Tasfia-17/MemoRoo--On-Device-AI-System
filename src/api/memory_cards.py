from typing import Annotated, List
from uuid import UUID

from fastapi import APIRouter, Depends, status

from src.schemas.memory_card import MemoryCardCreate, MemoryCardUpdate, MemoryCardResponse, MemoryCardCanvasPositionUpdate
from src.services.memory_card_service import MemoryCardService
from src.api.deps import CurrentUser

router = APIRouter()

@router.post("/", response_model=MemoryCardResponse, status_code=status.HTTP_201_CREATED)
async def create_memory_card(
    card_data: MemoryCardCreate,
    current_user_id: CurrentUser,
    memory_card_service: Annotated[MemoryCardService, Depends()]
):
    return await memory_card_service.create_memory_card(UUID(current_user_id), card_data)

@router.get("/", response_model=List[MemoryCardResponse])
async def get_all_memory_cards(
    current_user_id: CurrentUser,
    memory_card_service: Annotated[MemoryCardService, Depends()]
):
    return await memory_card_service.get_all_memory_cards(UUID(current_user_id))

@router.get("/{memory_card_id}", response_model=MemoryCardResponse)
async def get_memory_card_by_id(
    memory_card_id: UUID,
    current_user_id: CurrentUser,
    memory_card_service: Annotated[MemoryCardService, Depends()]
):
    return await memory_card_service.get_memory_card_by_id(UUID(current_user_id), memory_card_id)

@router.put("/{memory_card_id}", response_model=MemoryCardResponse)
async def update_memory_card(
    memory_card_id: UUID,
    card_data: MemoryCardUpdate,
    current_user_id: CurrentUser,
    memory_card_service: Annotated[MemoryCardService, Depends()]
):
    return await memory_card_service.update_memory_card(UUID(current_user_id), memory_card_id, card_data)

@router.patch("/{memory_card_id}/position", response_model=MemoryCardResponse)
async def update_memory_card_position(
    memory_card_id: UUID,
    position_data: MemoryCardCanvasPositionUpdate,
    current_user_id: CurrentUser,
    memory_card_service: Annotated[MemoryCardService, Depends()]
):
    return await memory_card_service.update_memory_card_canvas_position(UUID(current_user_id), memory_card_id, position_data)

@router.delete("/{memory_card_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_memory_card(
    memory_card_id: UUID,
    current_user_id: CurrentUser,
    memory_card_service: Annotated[MemoryCardService, Depends()]
):
    await memory_card_service.delete_memory_card(UUID(current_user_id), memory_card_id)
    return None
