from fastapi import APIRouter, Request
from pydantic import BaseModel

from backend.websocket_server import manager

router = APIRouter(
    prefix="/messages",
    tags=["messages"]
)


class MessageCreate(BaseModel):
    sender_id: int
    receiver_id: int
    message: str


@router.post("/send")
async def send_message(
    payload: MessageCreate,
    request: Request
):

    request.app.state.chat_db.send_message(
        payload.sender_id,
        payload.receiver_id,
        payload.message
    )

    await manager.send_to_user(
        str(payload.receiver_id),
        {
            "type": "message",
            "sender_id": payload.sender_id,
            "message": payload.message
        }
    )

    return {
        "success": True
    }


@router.get("/chat/{user1}/{user2}")
def get_chat(
    user1: int,
    user2: int,
    request: Request
):

    return {
        "messages":
        request.app.state.chat_db.get_messages(
            user1,
            user2
        )
    }