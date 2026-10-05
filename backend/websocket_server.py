from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter(tags=["websocket"])


class ConnectionManager:

    def __init__(self):

        # Private Chat Connections
        self.active_connections: dict[
            str,
            list[WebSocket]
        ] = {}

        # Group Chat Connections
        self.group_connections: dict[
            str,
            list[WebSocket]
        ] = {}

    # =========================
    # PRIVATE CHAT
    # =========================

    async def connect(
        self,
        user_id: str,
        websocket: WebSocket
    ):

        await websocket.accept()

        if user_id not in self.active_connections:
            self.active_connections[user_id] = []

        self.active_connections[user_id].append(
            websocket
        )

    def disconnect(
        self,
        user_id: str,
        websocket: WebSocket
    ):

        if user_id in self.active_connections:

            if websocket in self.active_connections[user_id]:

                self.active_connections[user_id].remove(
                    websocket
                )

            if not self.active_connections[user_id]:

                del self.active_connections[user_id]

    async def send_to_user(
        self,
        user_id: str,
        message: dict
    ):

        sockets = self.active_connections.get(
            str(user_id),
            []
        )

        for ws in sockets:

            try:

                await ws.send_json(message)

            except Exception:
                pass

    # =========================
    # GROUP CHAT
    # =========================

    async def connect_group(
        self,
        group_id: str,
        websocket: WebSocket
    ):

        await websocket.accept()

        if group_id not in self.group_connections:

            self.group_connections[group_id] = []

        self.group_connections[group_id].append(
            websocket
        )

    def disconnect_group(
        self,
        group_id: str,
        websocket: WebSocket
    ):

        if group_id in self.group_connections:

            if websocket in self.group_connections[group_id]:

                self.group_connections[group_id].remove(
                    websocket
                )

            if not self.group_connections[group_id]:

                del self.group_connections[group_id]

    async def send_to_group(
        self,
        group_id: str,
        message: dict
    ):

        sockets = self.group_connections.get(
            str(group_id),
            []
        )

        for ws in sockets:

            try:

                await ws.send_json(message)

            except Exception:
                pass


manager = ConnectionManager()


# =========================
# PRIVATE CHAT SOCKET
# =========================

@router.websocket("/ws/{user_id}")
async def chat_socket(
    websocket: WebSocket,
    user_id: str
):

    await manager.connect(
        user_id,
        websocket
    )

    try:

        while True:

            await websocket.receive_text()

    except WebSocketDisconnect:

        manager.disconnect(
            user_id,
            websocket
        )


# =========================
# GROUP CHAT SOCKET
# =========================

@router.websocket("/ws/group/{group_id}")
async def group_socket(
    websocket: WebSocket,
    group_id: str
):

    await manager.connect_group(
        group_id,
        websocket
    )

    try:

        while True:

            await websocket.receive_text()

    except WebSocketDisconnect:

        manager.disconnect_group(
            group_id,
            websocket
        )
