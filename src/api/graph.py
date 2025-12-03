from typing import Annotated, List
from uuid import UUID

from fastapi import APIRouter, Depends, status

from src.schemas.graph import GraphNodeCreate, GraphNodeUpdate, GraphNodeResponse, GraphEdgeCreate, GraphEdgeUpdate, GraphEdgeResponse
from src.services.graph_service import GraphService
from src.api.deps import CurrentUser

router = APIRouter()

# --- Graph Nodes ---
@router.post("/nodes", response_model=GraphNodeResponse, status_code=status.HTTP_201_CREATED)
async def create_graph_node(
    node_data: GraphNodeCreate,
    current_user_id: CurrentUser,
    graph_service: Annotated[GraphService, Depends()]
):
    return await graph_service.create_node(UUID(current_user_id), node_data)

@router.get("/nodes", response_model=List[GraphNodeResponse])
async def get_all_graph_nodes(
    current_user_id: CurrentUser,
    graph_service: Annotated[GraphService, Depends()]
):
    return await graph_service.get_all_nodes(UUID(current_user_id))

@router.get("/nodes/{node_id}", response_model=GraphNodeResponse)
async def get_graph_node_by_id(
    node_id: UUID,
    current_user_id: CurrentUser,
    graph_service: Annotated[GraphService, Depends()]
):
    return await graph_service.get_node_by_id(UUID(current_user_id), node_id)

@router.put("/nodes/{node_id}", response_model=GraphNodeResponse)
async def update_graph_node(
    node_id: UUID,
    node_data: GraphNodeUpdate,
    current_user_id: CurrentUser,
    graph_service: Annotated[GraphService, Depends()]
):
    return await graph_service.update_node(UUID(current_user_id), node_id, node_data)

@router.delete("/nodes/{node_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_graph_node(
    node_id: UUID,
    current_user_id: CurrentUser,
    graph_service: Annotated[GraphService, Depends()]
):
    await graph_service.delete_node(UUID(current_user_id), node_id)
    return None

# --- Graph Edges ---
@router.post("/edges", response_model=GraphEdgeResponse, status_code=status.HTTP_201_CREATED)
async def create_graph_edge(
    edge_data: GraphEdgeCreate,
    current_user_id: CurrentUser,
    graph_service: Annotated[GraphService, Depends()]
):
    return await graph_service.create_edge(UUID(current_user_id), edge_data)

@router.get("/edges", response_model=List[GraphEdgeResponse])
async def get_all_graph_edges(
    current_user_id: CurrentUser,
    graph_service: Annotated[GraphService, Depends()]
):
    return await graph_service.get_all_edges(UUID(current_user_id))

@router.get("/edges/{edge_id}", response_model=GraphEdgeResponse)
async def get_graph_edge_by_id(
    edge_id: UUID,
    current_user_id: CurrentUser,
    graph_service: Annotated[GraphService, Depends()]
):
    return await graph_service.get_edge_by_id(UUID(current_user_id), edge_id)

@router.put("/edges/{edge_id}", response_model=GraphEdgeResponse)
async def update_graph_edge(
    edge_id: UUID,
    edge_data: GraphEdgeUpdate,
    current_user_id: CurrentUser,
    graph_service: Annotated[GraphService, Depends()]
):
    return await graph_service.update_edge(UUID(current_user_id), edge_id, edge_data)

@router.delete("/edges/{edge_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_graph_edge(
    edge_id: UUID,
    current_user_id: CurrentUser,
    graph_service: Annotated[GraphService, Depends()]
):
    await graph_service.delete_edge(UUID(current_user_id), edge_id)
    return None
