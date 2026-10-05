from pathlib import Path
import sqlite3


class NotificationStore:

    def __init__(self, db_path: Path):

        self.connection = sqlite3.connect(
            db_path,
            check_same_thread=False
        )

        self.connection.row_factory = sqlite3.Row

        self.connection.execute(
            """
            CREATE TABLE IF NOT EXISTS notifications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                title TEXT,
                message TEXT,
                is_read INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        )

        self.connection.commit()

    def create_notification(
        self,
        user_id: int,
        title: str,
        message: str
    ):

        self.connection.execute(
            """
            INSERT INTO notifications
            (
                user_id,
                title,
                message
            )
            VALUES (?, ?, ?)
            """,
            (
                user_id,
                title,
                message
            )
        )

        self.connection.commit()

    def get_notifications(
        self,
        user_id: int
    ):

        rows = self.connection.execute(
            """
            SELECT *
            FROM notifications
            WHERE user_id=?
            ORDER BY id DESC
            """,
            (user_id,)
        ).fetchall()

        return [dict(row) for row in rows]

    def mark_read(
        self,
        notification_id: int
    ):

        self.connection.execute(
            """
            UPDATE notifications
            SET is_read=1
            WHERE id=?
            """,
            (notification_id,)
        )

        self.connection.commit()

    def close(self):

        self.connection.close()