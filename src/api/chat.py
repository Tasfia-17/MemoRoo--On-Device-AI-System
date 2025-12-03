from typing import Annotated, List
from uuid import UUID

from fastapi import APIRouter, Depends, status

from src.schemas.chat import ConversationCreate, ConversationResponse, ChatMessageCreate, ChatMessageResponse
from src.services.chat_service import ChatService
from src.services.ai_pipeline_service import AiPipelineService
from src.api.deps import CurrentUser

router = APIRouter()

# --- Conversations ---
@router.post("/conversations", response_model=ConversationResponse, status_code=status.HTTP_201_CREATED)
async def create_conversation(
    conversation_data: ConversationCreate,
    current_user_id: CurrentUser,
    chat_service: Annotated[ChatService, Depends()]
):
    return await chat_service.create_conversation(UUID(current_user_id), conversation_data)

@router.get("/conversations", response_model=List[ConversationResponse])
async def get_all_conversations(
    current_user_id: CurrentUser,
    chat_service: Annotated[ChatService, Depends()]
):
    return await chat_service.get_all_conversations(UUID(current_user_id))

@router.get("/conversations/{conversation_id}", response_model=ConversationResponse)
async def get_conversation_by_id(
    conversation_id: UUID,
    current_user_id: CurrentUser,
    chat_service: Annotated[ChatService, Depends()]
):
    # Potentially load messages here as well, or have a separate endpoint for messages
    return await chat_service.get_conversation_by_id(UUID(current_user_id), conversation_id)

@router.delete("/conversations/{conversation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_conversation(
    conversation_id: UUID,
    current_user_id: CurrentUser,
    chat_service: Annotated[ChatService, Depends()]
):
    await chat_service.delete_conversation(UUID(current_user_id), conversation_id)
    return None

# --- Chat Messages ---
@router.post("/conversations/{conversation_id}/messages", response_model=ChatMessageResponse, status_code=status.HTTP_201_CREATED)
async def create_chat_message(
    conversation_id: UUID,
    message_data: ChatMessageCreate,
    current_user_id: CurrentUser,
    chat_service: Annotated[ChatService, Depends()]
):
    return await chat_service.create_chat_message(UUID(current_user_id), conversation_id, message_data)

@router.get("/conversations/{conversation_id}/messages", response_model=List[ChatMessageResponse])
async def get_messages_for_conversation(
    conversation_id: UUID,
    current_user_id: CurrentUser,
    chat_service: Annotated[ChatService, Depends()]
):
    return await chat_service.get_messages_for_conversation(UUID(current_user_id), conversation_id)

@router.post("/conversations/{conversation_id}/chat-with-ai", response_model=ChatMessageResponse)
async def chat_with_ai(
    conversation_id: UUID,
    user_message: ChatMessageCreate, # Expects a user message to process
    current_user_id: CurrentUser,
    chat_service: Annotated[ChatService, Depends()],
    ai_pipeline_service: Annotated[AiPipelineService, Depends()]
):
    # 1. Save user message
    user_msg_record = await chat_service.create_chat_message(UUID(current_user_id), conversation_id, user_message)

    # 2. Perform RAG (Retrieval Augmented Generation)
    retrieved_memories = await ai_pipeline_service.perform_rag_search(user_message.content, UUID(current_user_id))
    context_for_llm = [m["content"] for m in retrieved_memories]

    # 3. LLM Inference
    ai_response_content = await ai_pipeline_service.llm_inference(user_message.content, context=context_for_llm)
    
    # 4. Mood Detection
    mood = await ai_pipeline_service.detect_mood_sentiment(user_message.content)

    # 5. Create AI response message
    ai_message_data = ChatMessageCreate(
        role="ai",
        content=ai_response_content,
        related_memory_ids=[m["memory_card_id"] for m in retrieved_memories],
        mood_context=mood
    )
    ai_msg_record = await chat_service.create_chat_message(UUID(current_user_id), conversation_id, ai_message_data)

    return ai_msg_record

@router.delete("/messages/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_chat_message(
    message_id: UUID,
    current_user_id: CurrentUser,
    chat_service: Annotated[ChatService, Depends()]
):
    await chat_service.delete_chat_message(UUID(current_user_id), message_id)
    return None
