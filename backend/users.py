from pathlib import Path
import sqlite3

from fastapi import APIRouter, Request
from pydantic import BaseModel


router = APIRouter(
    prefix="/users",
    tags=["users"]
)


class UserUpdate(BaseModel):
    display_name: str | None = None
    language: str | None = None
    personality_mode: str | None = None


class UserStore:

    def __init__(self, path: Path):

        self.path = Path(path)

        self.path.parent.mkdir(
            parents=True,
            exist_ok=True
        )

        self.connection = sqlite3.connect(
            self.path,
            check_same_thread=False
        )

        self.connection.row_factory = sqlite3.Row

        self._init_schema()

    def _init_schema(self):

        self.connection.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                display_name TEXT,
                pin TEXT,
                language TEXT DEFAULT 'hinglish',
                personality_mode TEXT DEFAULT 'balanced'
            )
            """
        )

        self.connection.execute(
            """
            CREATE TABLE IF NOT EXISTS sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                token TEXT UNIQUE,
                expires_at DATETIME,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )
            """
        )

        self.connection.commit()

    def create_user(
        self,
        username: str,
        pin: str,
        display_name: str | None = None
    ):

        cursor = self.connection.execute(
            """
            INSERT INTO users
            (
                username,
                pin,
                display_name
            )
            VALUES (?, ?, ?)
            """,
            (
                username,
                pin,
                display_name
            )
        )

        self.connection.commit()

        return self.get_user(
            cursor.lastrowid
        )

    def verify_pin(
        self,
        username: str,
        pin: str
    ):

        row = self.connection.execute(
            """
            SELECT *
            FROM users
            WHERE username=?
            AND pin=?
            """,
            (
                username,
                pin
            )
        ).fetchone()

        return dict(row) if row else None

    def save_session(
        self,
        user_id: int,
        token: str,
        expires_at: str
    ):

        self.connection.execute(
            """
            INSERT INTO sessions
            (
                user_id,
                token,
                expires_at
            )
            VALUES (?, ?, ?)
            """,
            (
                user_id,
                token,
                expires_at
            )
        )

        self.connection.commit()

    def list_users(self):

        rows = self.connection.execute(
            """
            SELECT *
            FROM users
            """
        ).fetchall()

        return [dict(row) for row in rows]

    def get_user(
        self,
        user_id: int
    ):

        row = self.connection.execute(
            """
            SELECT *
            FROM users
            WHERE id=?
            """,
            (user_id,)
        ).fetchone()

        if not row:
            return None

        return dict(row)

    def get_user_by_username(
        self,
        username: str
    ):

        row = self.connection.execute(
            """
            SELECT *
            FROM users
            WHERE username=?
            """,
            (username,)
        ).fetchone()

        return dict(row) if row else None

    def update_user(
        self,
        user_id: int,
        payload: UserUpdate
    ):

        self.connection.execute(
            """
            UPDATE users
            SET display_name=?,
                language=?,
                personality_mode=?
            WHERE id=?
            """,
            (
                payload.display_name,
                payload.language,
                payload.personality_mode,
                user_id
            )
        )

        self.connection.commit()

        return self.get_user(
            user_id
        )

    def close(self):
        self.connection.close()


# =========================
# USERS ROUTES
# =========================

@router.get("")
def list_users(
    request: Request
):

    return {
        "users":
        request.app.state.users.list_users()
    }


@router.get("/search/{username}")
def search_user(
    username: str,
    request: Request
):

    users = request.app.state.users.list_users()

    results = [
        user
        for user in users
        if username.lower()
        in user["username"].lower()
    ]

    return {
        "users": results
    }


@router.get("/{user_id}")
def get_user(
    user_id: int,
    request: Request
):

    return {
        "user":
        request.app.state.users.get_user(
            user_id
        )
    }


@router.patch("/{user_id}")
def update_user(
    user_id: int,
    payload: UserUpdate,
    request: Request
):

    return {
        "user":
        request.app.state.users.update_user(
            user_id,
            payload
        )
    }
