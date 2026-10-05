from pathlib import Path
import sqlite3
from datetime import datetime


class PresenceStore:

    def __init__(self, db_path: Path):

        self.connection = sqlite3.connect(
            db_path,
            check_same_thread=False
        )

        self.connection.row_factory = sqlite3.Row

        self.connection.execute(
            """
            CREATE TABLE IF NOT EXISTS presence (
                user_id INTEGER PRIMARY KEY,
                is_online INTEGER DEFAULT 0,
                last_seen TEXT
            )
            """
        )

        self.connection.commit()

    def set_online(
        self,
        user_id: int
    ):

        self.connection.execute(
            """
            INSERT OR REPLACE INTO presence
            (
                user_id,
                is_online,
                last_seen
            )
            VALUES (?, 1, ?)
            """,
            (
                user_id,
                datetime.now().isoformat()
            )
        )

        self.connection.commit()

    def set_offline(
        self,
        user_id: int
    ):

        self.connection.execute(
            """
            UPDATE presence
            SET
                is_online=0,
                last_seen=?
            WHERE user_id=?
            """,
            (
                datetime.now().isoformat(),
                user_id
            )
        )

        self.connection.commit()

    def get_status(
        self,
        user_id: int
    ):

        row = self.connection.execute(
            """
            SELECT *
            FROM presence
            WHERE user_id=?
            """,
            (user_id,)
        ).fetchone()

        if not row:
            return {
                "is_online": False,
                "last_seen": None
            }

        return {
            "is_online":
                bool(row["is_online"]),
            "last_seen":
                row["last_seen"]
        }

    def close(self):
        self.connection.close()
