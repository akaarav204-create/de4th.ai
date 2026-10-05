from pathlib import Path
import sqlite3


class ChatStore:

    def __init__(self, db_path: Path):

        self.connection = sqlite3.connect(
            db_path,
            check_same_thread=False
        )

        self.connection.row_factory = sqlite3.Row

        self.connection.execute(
            """
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sender_id INTEGER,
                receiver_id INTEGER,
                message TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        )

        self.connection.commit()

    def send_message(
        self,
        sender_id: int,
        receiver_id: int,
        message: str
    ):

        self.connection.execute(
            """
            INSERT INTO messages
            (
                sender_id,
                receiver_id,
                message
            )
            VALUES (?, ?, ?)
            """,
            (
                sender_id,
                receiver_id,
                message
            )
        )

        self.connection.commit()

    def get_messages(
        self,
        user1: int,
        user2: int
    ):

        rows = self.connection.execute(
            """
            SELECT *
            FROM messages
            WHERE
            (
                sender_id=? AND receiver_id=?
            )
            OR
            (
                sender_id=? AND receiver_id=?
            )
            ORDER BY id ASC
            """,
            (
                user1,
                user2,
                user2,
                user1
            )
        ).fetchall()

        return [dict(row) for row in rows]

    def close(self):
        self.connection.close()