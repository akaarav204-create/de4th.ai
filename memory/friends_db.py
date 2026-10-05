from pathlib import Path
import sqlite3


class FriendStore:

    def __init__(self, db_path: Path):

        self.connection = sqlite3.connect(
            db_path,
            check_same_thread=False
        )

        self.connection.row_factory = sqlite3.Row

        self.connection.execute(
            """
            CREATE TABLE IF NOT EXISTS friend_requests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sender_id INTEGER,
                receiver_id INTEGER,
                status TEXT DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        )

        self.connection.commit()

    def send_request(
        self,
        sender_id: int,
        receiver_id: int
    ):

        self.connection.execute(
            """
            INSERT INTO friend_requests
            (
                sender_id,
                receiver_id
            )
            VALUES (?, ?)
            """,
            (
                sender_id,
                receiver_id
            )
        )

        self.connection.commit()

    def get_requests(
        self,
        user_id: int
    ):

        rows = self.connection.execute(
            """
            SELECT *
            FROM friend_requests
            WHERE receiver_id = ?
            AND status='pending'
            """,
            (user_id,)
        ).fetchall()

        return [dict(row) for row in rows]

    def accept_request(
        self,
        request_id: int
    ):

        self.connection.execute(
            """
            UPDATE friend_requests
            SET status='accepted'
            WHERE id=?
            """,
            (request_id,)
        )

        self.connection.commit()

    def reject_request(
        self,
        request_id: int
    ):

        self.connection.execute(
            """
            UPDATE friend_requests
            SET status='rejected'
            WHERE id=?
            """,
            (request_id,)
        )

        self.connection.commit()

    def close(self):
        self.connection.close()
