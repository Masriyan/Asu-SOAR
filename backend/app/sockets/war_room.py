from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, List

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        # Maps incident_id to a list of active WebSocket connections
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, ws: WebSocket, incident_id: str):
        await ws.accept()
        if incident_id not in self.active_connections:
            self.active_connections[incident_id] = []
        self.active_connections[incident_id].append(ws)

    def disconnect(self, ws: WebSocket, incident_id: str):
        if incident_id in self.active_connections:
            self.active_connections[incident_id].remove(ws)
            if not self.active_connections[incident_id]:
                del self.active_connections[incident_id]

    async def broadcast_to_incident(self, message: str, incident_id: str):
        if incident_id in self.active_connections:
            for connection in self.active_connections[incident_id]:
                await connection.send_text(message)

manager = ConnectionManager()

@router.websocket("/{incident_id}/ws")
async def war_room_websocket(websocket: WebSocket, incident_id: str):
    await manager.connect(websocket, incident_id)
    try:
        while True:
            data = await websocket.receive_text()
            # Broadcast the chat event to all users connected to this incident
            await manager.broadcast_to_incident(f"Analyst: {data}", incident_id)
    except WebSocketDisconnect:
        manager.disconnect(websocket, incident_id)
        await manager.broadcast_to_incident("System: Analyst disconnected.", incident_id)
