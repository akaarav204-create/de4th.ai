from pathlib import Path
import sqlite3


class TaskStore:

    def __init__(self, db_path: Path):

        self.connection = sqlite3.connect(
            db_path,
            check_same_thread=False
        )

        self.connection.row_factory = sqlite3.Row

        self.connection.execute(
            """
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                created_by INTEGER,
                assigned_to INTEGER,
                title TEXT,
                status TEXT DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        )

        self.connection.commit()

    def create_task(
        self,
        created_by: int,
        assigned_to: int,
        title: str
    ):

        self.connection.execute(
            """
            INSERT INTO tasks
            (created_by, assigned_to, title)
            VALUES (?, ?, ?)
            """,
            (
                created_by,
                assigned_to,
                title
            )
        )

        self.connection.commit()

    def get_tasks(
        self,
        user_id: int
    ):

        rows = self.connection.execute(
            """
            SELECT *
            FROM tasks
            WHERE assigned_to = ?
            """,
            (user_id,)
        ).fetchall()

        return [dict(row) for row in rows]

    def close(self):
        self.connection.close()
