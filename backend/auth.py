from __future__ import annotations

from datetime import datetime, timedelta, timezone
import secrets
import sqlite3

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel


router = APIRouter(prefix="/auth", tags=["auth"])


class LoginRequest(BaseModel):
    username: str
    pin: str


class RegisterRequest(BaseModel):
    username: str
    display_name: str | None = None
    pin: str


def _new_session_token() -> tuple[str, str]:
    token = secrets.token_urlsafe(32)
    expires_at = (datetime.now(timezone.utc) + timedelta(days=30)).isoformat()
    return token, expires_at


@router.post("/register")
def register(payload: RegisterRequest, request: Request):
    try:
        user = request.app.state.users.create_user(
            username=payload.username,
            pin=payload.pin,
            display_name=payload.display_name,
        )
        return {"user": user}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Username already exists.")


@router.post("/login")
def login(payload: LoginRequest, request: Request):
    user = request.app.state.users.verify_pin(payload.username, payload.pin)
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid username or PIN.")
    token, expires_at = _new_session_token()
    request.app.state.users.save_session(user["id"], token, expires_at)
    return {"token": token, "expires_at": expires_at, "user": user}
