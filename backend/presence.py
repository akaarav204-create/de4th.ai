from fastapi import APIRouter, Request
from pydantic import BaseModel

router = APIRouter(
    prefix="/presence",
    tags=["presence"]
)


class PresencePayload(BaseModel):
    user_id: int


@router.post("/online")
def online(
    payload: PresencePayload,
    request: Request
):

    request.app.state.presence.set_online(
        payload.user_id
    )

    return {
        "success": True
    }


@router.post("/offline")
def offline(
    payload: PresencePayload,
    request: Request
):

    request.app.state.presence.set_offline(
        payload.user_id
    )

    return {
        "success": True
    }


@router.get("/{user_id}")
def status(
    user_id: int,
    request: Request
):

    return request.app.state.presence.get_status(
        user_id
    )
