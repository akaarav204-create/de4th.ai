from fastapi import APIRouter, Request
from pydantic import BaseModel

router = APIRouter(
    prefix="/tasks",
    tags=["tasks"]
)


class TaskCreate(BaseModel):
    created_by: int
    assigned_to: int
    title: str


@router.post("")
def create_task(
    payload: TaskCreate,
    request: Request
):

    request.app.state.tasks.create_task(
        payload.created_by,
        payload.assigned_to,
        payload.title
    )

    return {
        "success": True,
        "message": "Task created"
    }


@router.get("/{user_id}")
def get_tasks(
    user_id: int,
    request: Request
):

    return {
        "tasks":
        request.app.state.tasks.get_tasks(
            user_id
        )
    }
