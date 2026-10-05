from fastapi import APIRouter, Request
from pydantic import BaseModel
from typing import Optional
from backend.websocket_server import manager
router = APIRouter(
    prefix="/groups",
    tags=["groups"]
)


# =========================
# MODELS
# =========================

class GroupCreate(BaseModel):
    name: str
    created_by: int
    description: Optional[str] = ""
    avatar: Optional[str] = ""


class GroupMember(BaseModel):
    group_id: int
    user_id: int


class RemoveMember(BaseModel):
    group_id: int
    user_id: int


class GroupMessage(BaseModel):
    group_id: int
    sender_id: int
    message: str


class RenameGroup(BaseModel):
    group_id: int
    name: str


class EchoCommand(BaseModel):
    group_id: int
    user_id: int
    prompt: str


# =========================
# CREATE GROUP
# =========================

@router.post("/create")
def create_group(
    payload: GroupCreate,
    request: Request
):

    group_id = (
        request.app.state.groups.create_group(
            payload.name,
            payload.created_by
        )
    )

    return {
        "success": True,
        "group_id": group_id
    }


# =========================
# ADD MEMBER
# =========================

@router.post("/add-member")
def add_member(
    payload: GroupMember,
    request: Request
):

    request.app.state.groups.add_member(
        payload.group_id,
        payload.user_id
    )

    return {
        "success": True
    }


# =========================
# REMOVE MEMBER
# =========================

@router.post("/remove-member")
def remove_member(
    payload: RemoveMember,
    request: Request
):

    request.app.state.groups.remove_member(
        payload.group_id,
        payload.user_id
    )

    return {
        "success": True
    }


# =========================
# USER GROUPS
# =========================

@router.get("/user/{user_id}")
def get_groups(
    user_id: int,
    request: Request
):

    return {
        "groups":
        request.app.state.groups.get_groups(
            user_id
        )
    }


# =========================
# SEND GROUP MESSAGE
# =========================

@router.post("/send")
async def send_message(
    payload: GroupMessage,
    request: Request
):

    request.app.state.groups.send_message(
        payload.group_id,
        payload.sender_id,
        payload.message
    )

    await manager.send_to_group(
        str(payload.group_id),
        {
            "id": 0,
            "group_id": payload.group_id,
            "sender_id": payload.sender_id,
            "message": payload.message
        }
    )

    return {
        "success": True
    }

# =========================
# GET GROUP MESSAGES
# =========================

@router.get("/messages/{group_id}")
def get_messages(
    group_id: int,
    request: Request
):

    return {
        "messages":
        request.app.state.groups.get_messages(
            group_id
        )
    }


# =========================
# RENAME GROUP
# =========================

@router.post("/rename")
def rename_group(
    payload: RenameGroup,
    request: Request
):

    request.app.state.groups.rename_group(
        payload.group_id,
        payload.name
    )

    return {
        "success": True
    }


# =========================
# ECHO AI PLACEHOLDER
# =========================

@router.post("/echo")
def echo_command(
    payload: EchoCommand
):

    return {
        "success": True,
        "reply":
        f"Echo received: {payload.prompt}"
    }
@router.get("/members/{group_id}")
def get_members(
    group_id: int,
    request: Request
):
    return {
        "members":
        request.app.state.groups.get_members(
            group_id
        )
    }