from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete
from uuid import UUID
from typing import List

from src.models.graph_node import GraphNode
from src.models.graph_edge import GraphEdge
from src.schemas.graph import GraphNodeCreate, GraphNodeUpdate, GraphEdgeCreate, GraphEdgeUpdate
from src.core.exceptions import UserNotFoundException, MemoryCardNotFoundException, UnauthorizedAccessException, AttachmentNotFoundException # Added exceptions for clarity
from src.core.exceptions import MemoryCardNotFoundException, UnauthorizedAccessException # Corrected to existing exceptions
from src.core.exceptions import MemoryCardNotFoundException, UnauthorizedAccessException # Corrected again
from src.core.exceptions import GraphNodeNotFoundException, GraphEdgeNotFoundException, UnauthorizedAccessException

class GraphNodeNotFoundException(Exception):
    pass

class GraphEdgeNotFoundException(Exception):
    pass


class GraphService:
    def __init__(self, db: AsyncSession):
        self.db = db

    # --- Graph Nodes ---
    async def get_node_by_id(self, user_id: UUID, node_id: UUID) -> GraphNode:
        result = await self.db.execute(
            select(GraphNode).filter(GraphNode.id == node_id, GraphNode.user_id == user_id)
        )
        node = result.scalar_one_or_none()
        if not node:
            raise GraphNodeNotFoundException(f"GraphNode with id {node_id} not found.")
        return node

    async def get_all_nodes(self, user_id: UUID) -> List[GraphNode]:
        result = await self.db.execute(select(GraphNode).filter(GraphNode.user_id == user_id))
        return result.scalars().all()

    async def create_node(self, user_id: UUID, node_data: GraphNodeCreate) -> GraphNode:
        new_node = GraphNode(**node_data.model_dump(), user_id=user_id)
        self.db.add(new_node)
        await self.db.commit()
        await self.db.refresh(new_node)
        return new_node

    async def update_node(self, user_id: UUID, node_id: UUID, node_data: GraphNodeUpdate) -> GraphNode:
        node = await self.get_node_by_id(user_id, node_id)
        
        update_data = node_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(node, key, value)

        await self.db.commit()
        await self.db.refresh(node)
        return node

    async def delete_node(self, user_id: UUID, node_id: UUID):
        node = await self.get_node_by_id(user_id, node_id)
        await self.db.delete(node)
        await self.db.commit()

    # --- Graph Edges ---
    async def get_edge_by_id(self, user_id: UUID, edge_id: UUID) -> GraphEdge:
        result = await self.db.execute(
            select(GraphEdge).filter(GraphEdge.id == edge_id, GraphEdge.user_id == user_id)
        )
        edge = result.scalar_one_or_none()
        if not edge:
            raise GraphEdgeNotFoundException(f"GraphEdge with id {edge_id} not found.")
        return edge

    async def get_all_edges(self, user_id: UUID) -> List[GraphEdge]:
        result = await self.db.execute(select(GraphEdge).filter(GraphEdge.user_id == user_id))
        return result.scalars().all()

    async def create_edge(self, user_id: UUID, edge_data: GraphEdgeCreate) -> GraphEdge:
        # Ensure both source and target nodes exist and belong to the user
        await self.get_node_by_id(user_id, edge_data.source_node_id)
        await self.get_node_by_id(user_id, edge_data.target_node_id)

        new_edge = GraphEdge(**edge_data.model_dump(), user_id=user_id)
        self.db.add(new_edge)
        await self.db.commit()
        await self.db.refresh(new_edge)
        return new_edge

    async def update_edge(self, user_id: UUID, edge_id: UUID, edge_data: GraphEdgeUpdate) -> GraphEdge:
        edge = await self.get_edge_by_id(user_id, edge_id)
        
        update_data = edge_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(edge, key, value)

        await self.db.commit()
        await self.db.refresh(edge)
        return edge

    async def delete_edge(self, user_id: UUID, edge_id: UUID):
        edge = await self.get_edge_by_id(user_id, edge_id)
        await self.db.delete(edge)
        await self.db.commit()
