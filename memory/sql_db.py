from __future__ import annotations

from pathlib import Path
import sqlite3


class SqlMemoryStore:
    def __init__(self, path: Path) -> None:
        self.path = Path(path)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.connection = sqlite3.connect(self.path)
        self.connection.execute(
            """
            CREATE TABLE IF NOT EXISTS conversations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL,
                user_message TEXT NOT NULL,
                assistant_message TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        self.connection.commit()

    def add_conversation(self, session_id: str, user_message: str, assistant_message: str) -> None:
        self.connection.execute(
            """
            INSERT INTO conversations (session_id, user_message, assistant_message)
            VALUES (?, ?, ?)
            """,
            (session_id, user_message, assistant_message),
        )
        self.connection.commit()

    def close(self) -> None:
        self.connection.close()
