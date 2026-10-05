from __future__ import annotations

from pathlib import Path
import sqlite3

from fastapi import APIRouter, Request
from pydantic import BaseModel


router = APIRouter(prefix="/voice-call", tags=["voice-call"])


class CallStartRequest(BaseModel):
    user_id: int
    contact_id: int | None = None
    mode: str = "ai"


class CallEndRequest(BaseModel):
    call_id: int
    summary: str | None = None


class CallLogStore:
    def __init__(self, path: Path) -> None:
        self.path = Path(path)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.connection = sqlite3.connect(self.path)
        self.connection.row_factory = sqlite3.Row
        self.connection.execute(
            """
            CREATE TABLE IF NOT EXISTS call_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                contact_id INTEGER,
                mode TEXT NOT NULL,
                status TEXT DEFAULT 'active',
                summary TEXT,
                started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                ended_at DATETIME
            )
            """
        )
        self.connection.commit()

    def start(self, payload: CallStartRequest) -> dict:
        cursor = self.connection.execute(
            "INSERT INTO call_logs (user_id, contact_id, mode) VALUES (?, ?, ?)",
            (payload.user_id, payload.contact_id, payload.mode),
        )
        self.connection.commit()
        return self.get(cursor.lastrowid)

    def end(self, payload: CallEndRequest) -> dict:
        self.connection.execute(
            """
            UPDATE call_logs
            SET status = 'ended',
                summary = ?,
                ended_at = CURRENT_TIMESTAMP
            WHERE id = ?
            """,
            (payload.summary, payload.call_id),
        )
        self.connection.commit()
        return self.get(payload.call_id)

    def get(self, call_id: int) -> dict:
        row = self.connection.execute("SELECT * FROM call_logs WHERE id = ?", (call_id,)).fetchone()
        return dict(row)

    def close(self) -> None:
        self.connection.close()


@router.post("/start")
def start_call(payload: CallStartRequest, request: Request):
    return {"call": request.app.state.call_logs.start(payload)}


@router.post("/end")
def end_call(payload: CallEndRequest, request: Request):
    return {"call": request.app.state.call_logs.end(payload)}
