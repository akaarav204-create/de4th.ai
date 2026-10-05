from collections import defaultdict

class ConnectionManager:

    def __init__(self):
        self.connections = defaultdict(list)

    async def connect(
        self,
        user_id,
        websocket
    ):
        await websocket.accept()

        self.connections[
            str(user_id)
        ].append(websocket)

    def disconnect(
        self,
        user_id,
        websocket
    ):
        self.connections[
            str(user_id)
        ].remove(websocket)

    async def send_to_user(
        self,
        user_id,
        data
    ):

        for ws in self.connections.get(
            str(user_id),
            []
        ):

            await ws.send_json(data)