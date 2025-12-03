from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete
from uuid import UUID
from typing import List

from src.models.conversation import Conversation
from src.models.chat_message import ChatMessage
from src.schemas.chat import ConversationCreate, ChatMessageCreate
from src.core.exceptions import UserNotFoundException, ConversationNotFoundException, ChatMessageNotFoundException, UnauthorizedAccessException

class ConversationNotFoundException(Exception):
    pass

class ChatMessageNotFoundException(Exception):
    pass

class ChatService:
    def __init__(self, db: AsyncSession):
        self.db = db

    # --- Conversations ---
    async def get_conversation_by_id(self, user_id: UUID, conversation_id: UUID) -> Conversation:
        result = await self.db.execute(
            select(Conversation).filter(Conversation.id == conversation_id, Conversation.user_id == user_id)
        )
        conversation = result.scalar_one_or_none()
        if not conversation:
            raise ConversationNotFoundException(f"Conversation with id {conversation_id} not found.")
        return conversation

    async def get_all_conversations(self, user_id: UUID) -> List[Conversation]:
        result = await self.db.execute(select(Conversation).filter(Conversation.user_id == user_id))
        return result.scalars().all()

    async def create_conversation(self, user_id: UUID, conversation_data: ConversationCreate) -> Conversation:
        new_conversation = Conversation(**conversation_data.model_dump(), user_id=user_id)
        self.db.add(new_conversation)
        await self.db.commit()
        await self.db.refresh(new_conversation)
        return new_conversation
    
    async def delete_conversation(self, user_id: UUID, conversation_id: UUID):
        conversation = await self.get_conversation_by_id(user_id, conversation_id)
        await self.db.delete(conversation)
        await self.db.commit()

    # --- Chat Messages ---
    async def get_message_by_id(self, user_id: UUID, message_id: UUID) -> ChatMessage:
        result = await self.db.execute(
            select(ChatMessage).join(Conversation)
            .filter(ChatMessage.id == message_id, Conversation.user_id == user_id)
        )
        message = result.scalar_one_or_none()
        if not message:
            raise ChatMessageNotFoundException(f"Chat message with id {message_id} not found.")
        return message

    async def get_messages_for_conversation(self, user_id: UUID, conversation_id: UUID) -> List[ChatMessage]:
        conversation = await self.get_conversation_by_id(user_id, conversation_id) # Ensures conversation belongs to user
        result = await self.db.execute(
            select(ChatMessage).filter(ChatMessage.conversation_id == conversation_id).order_by(ChatMessage.timestamp)
        )
        return result.scalars().all()

    async def create_chat_message(self, user_id: UUID, conversation_id: UUID, message_data: ChatMessageCreate) -> ChatMessage:
        # Ensure conversation exists and belongs to user
        await self.get_conversation_by_id(user_id, conversation_id)

        new_message = ChatMessage(**message_data.model_dump(), conversation_id=conversation_id)
        self.db.add(new_message)
        await self.db.commit()
        await self.db.refresh(new_message)
        return new_message
    
    async def delete_chat_message(self, user_id: UUID, message_id: UUID):
        message = await self.get_message_by_id(user_id, message_id)
        await self.db.delete(message)
        await self.db.commit()
