from fastapi import APIRouter, Request
from pydantic import BaseModel

router = APIRouter(
    prefix="/notifications",
    tags=["notifications"]
)


class NotificationCreate(BaseModel):
    user_id: int
    title: str
    message: str


@router.post("/create")
def create_notification(
    payload: NotificationCreate,
    request: Request
):

    request.app.state.notifications.create_notification(
        payload.user_id,
        payload.title,
        payload.message
    )

    return {
        "success": True
    }


@router.get("/{user_id}")
def get_notifications(
    user_id: int,
    request: Request
):

    return {
        "notifications":
        request.app.state.notifications.get_notifications(
            user_id
        )
    }


@router.post("/read/{notification_id}")
def mark_read(
    notification_id: int,
    request: Request
):

    request.app.state.notifications.mark_read(
        notification_id
    )

    return {
        "success": True
    }