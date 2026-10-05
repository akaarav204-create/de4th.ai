from fastapi import APIRouter, Request
from pydantic import BaseModel


router = APIRouter(prefix="/chat", tags=["chat"])


class ChatRequest(BaseModel):
    message: str
    session_id: str = "default"
    user_id: int | None = None
    language: str = "hinglish"


@router.post("")
async def send_message(payload: ChatRequest, request: Request):
    user_data = None
    if payload.user_id:
        user_data = request.app.state.users.get_user(payload.user_id)

    answer = await request.app.state.brain.reply(
        payload.message,
        session_id=payload.session_id,
        user_data=user_data
    )
    return {
        "answer": answer,
        "session_id": payload.session_id,
        "language": payload.language,
    }
