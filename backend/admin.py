from fastapi import APIRouter, Request
from pydantic import BaseModel

router = APIRouter(
    prefix="/admin",
    tags=["admin"]
)


class DeleteUser(BaseModel):
    user_id: int


class DeleteGroup(BaseModel):
    group_id: int


class Broadcast(BaseModel):
    title: str
    message: str


@router.post("/delete-user")
def delete_user(
    payload: DeleteUser,
    request: Request
):

    request.app.state.users.connection.execute(
        "DELETE FROM users WHERE id=?",
        (payload.user_id,)
    )

    request.app.state.users.connection.commit()

    return {
        "success": True
    }


@router.post("/delete-group")
def delete_group(
    payload: DeleteGroup,
    request: Request
):

    request.app.state.groups.connection.execute(
        "DELETE FROM groups WHERE id=?",
        (payload.group_id,)
    )

    request.app.state.groups.connection.commit()

    return {
        "success": True
    }


@router.post("/broadcast")
def broadcast(
    payload: Broadcast,
    request: Request
):

    users = (
        request.app.state.users.list_users()
    )

    for user in users:

        request.app.state.notifications.create_notification(
            user["id"],
            payload.title,
            payload.message
        )

    return {
        "success": True
    }
