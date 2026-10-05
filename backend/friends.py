from fastapi import APIRouter, Request
from pydantic import BaseModel

router = APIRouter(
    prefix="/friends",
    tags=["friends"]
)


class FriendRequest(BaseModel):
    sender_id: int
    receiver_id: int


class RequestAction(BaseModel):
    request_id: int


@router.post("/request")
def send_request(
    payload: FriendRequest,
    request: Request
):

    request.app.state.friends.send_request(
        payload.sender_id,
        payload.receiver_id
    )

    request.app.state.notifications.create_notification(
        payload.receiver_id,
        "Friend Request",
        f"User {payload.sender_id} sent you a friend request"
    )

    return {
        "success": True,
        "message": "Friend request sent"
    }


@router.post("/accept")
def accept_request(
    payload: RequestAction,
    request: Request
):

    request.app.state.friends.accept_request(
        payload.request_id
    )

    request.app.state.notifications.create_notification(
        1,
        "Friend Request Accepted",
        "Your friend request was accepted"
    )

    return {
        "success": True
    }


@router.post("/reject")
def reject_request(
    payload: RequestAction,
    request: Request
):

    request.app.state.friends.reject_request(
        payload.request_id
    )

    return {
        "success": True
    }


@router.get("/list/{user_id}")
def get_friends(
    user_id: int,
    request: Request
):

    return {
        "friends":
        request.app.state.friends.get_friends(
            user_id
        )
    }


@router.get("/requests/{user_id}")
def get_requests(
    user_id: int,
    request: Request
):

    return {
        "requests": request.app.state.friends.get_requests(user_id)
    }
