from fastapi import APIRouter

api_router = APIRouter()

from . import auth, users, memory_cards, attachments, graph, chat, life_os

api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(memory_cards.router, prefix="/memory-cards", tags=["Memory Cards"])
api_router.include_router(attachments.router, prefix="/attachments", tags=["Attachments"])
api_router.include_router(graph.router, prefix="/graph", tags=["Graph"])
api_router.include_router(chat.router, prefix="/chat", tags=["Chat"])
api_router.include_router(life_os.router, prefix="/life-os", tags=["Life OS"])
