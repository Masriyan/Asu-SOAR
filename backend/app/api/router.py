from fastapi import APIRouter
from app.api.endpoints import health, playbooks

api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(playbooks.router, prefix="/playbooks", tags=["playbooks"])
