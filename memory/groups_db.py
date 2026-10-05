from pathlib import Path
import sqlite3


class GroupStore:

    def __init__(self, db_path: Path):

        self.connection = sqlite3.connect(
            db_path,
            check_same_thread=False
        )

        self.connection.row_factory = sqlite3.Row

        self._init_schema()

    def _init_schema(self):

        self.connection.execute(
            """
            CREATE TABLE IF NOT EXISTS groups (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT DEFAULT '',
                avatar TEXT DEFAULT '',
                invite_code TEXT,
                created_by INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        )

        self.connection.execute(
            """
            CREATE TABLE IF NOT EXISTS group_members (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                group_id INTEGER,
                user_id INTEGER,
                role TEXT DEFAULT 'member',
                joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        )

        self.connection.execute(
            """
            CREATE TABLE IF NOT EXISTS group_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                group_id INTEGER,
                sender_id INTEGER,
                message TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        )

        self.connection.commit()

    # =====================
    # GROUPS
    # =====================

    def create_group(
        self,
        name,
        created_by,
        description="",
        avatar=""
    ):

        cursor = self.connection.execute(
            """
            INSERT INTO groups
            (
                name,
                description,
                avatar,
                created_by
            )
            VALUES (?, ?, ?, ?)
            """,
            (
                name,
                description,
                avatar,
                created_by
            )
        )

        self.connection.commit()

        group_id = cursor.lastrowid

        self.connection.execute(
            """
            INSERT INTO group_members
            (
                group_id,
                user_id,
                role
            )
            VALUES (?, ?, 'admin')
            """,
            (
                group_id,
                created_by
            )
        )

        self.connection.commit()

        return group_id

    def rename_group(
        self,
        group_id,
        name
    ):

        self.connection.execute(
            """
            UPDATE groups
            SET name=?
            WHERE id=?
            """,
            (
                name,
                group_id
            )
        )

        self.connection.commit()

    def get_group(
        self,
        group_id
    ):

        row = self.connection.execute(
            """
            SELECT *
            FROM groups
            WHERE id=?
            """,
            (group_id,)
        ).fetchone()

        if not row:
            return None

        return dict(row)

    def get_groups(
        self,
        user_id
    ):

        rows = self.connection.execute(
            """
            SELECT g.*
            FROM groups g
            JOIN group_members gm
            ON g.id = gm.group_id
            WHERE gm.user_id=?
            ORDER BY g.id DESC
            """,
            (user_id,)
        ).fetchall()

        return [dict(row) for row in rows]

    # =====================
    # MEMBERS
    # =====================

    def add_member(
        self,
        group_id,
        user_id
    ):

        exists = self.connection.execute(
            """
            SELECT id
            FROM group_members
            WHERE group_id=?
            AND user_id=?
            """,
            (
                group_id,
                user_id
            )
        ).fetchone()

        if exists:
            return

        self.connection.execute(
            """
            INSERT INTO group_members
            (
                group_id,
                user_id
            )
            VALUES (?, ?)
            """,
            (
                group_id,
                user_id
            )
        )

        self.connection.commit()

    def remove_member(
        self,
        group_id,
        user_id
    ):

        self.connection.execute(
            """
            DELETE FROM group_members
            WHERE group_id=?
            AND user_id=?
            """,
            (
                group_id,
                user_id
            )
        )

        self.connection.commit()

    def get_members(
        self,
        group_id
    ):

        rows = self.connection.execute(
            """
            SELECT *
            FROM group_members
            WHERE group_id=?
            """,
            (group_id,)
        ).fetchall()

        return [dict(row) for row in rows]

    # =====================
    # MESSAGES
    # =====================

    def send_message(
        self,
        group_id,
        sender_id,
        message
    ):

        self.connection.execute(
            """
            INSERT INTO group_messages
            (
                group_id,
                sender_id,
                message
            )
            VALUES (?, ?, ?)
            """,
            (
                group_id,
                sender_id,
                message
            )
        )

        self.connection.commit()

    def get_messages(
        self,
        group_id
    ):

        rows = self.connection.execute(
            """
            SELECT *
            FROM group_messages
            WHERE group_id=?
            ORDER BY id ASC
            """,
            (group_id,)
        ).fetchall()

        return [dict(row) for row in rows]

    def delete_message(
        self,
        message_id
    ):

        self.connection.execute(
            """
            DELETE FROM group_messages
            WHERE id=?
            """,
            (message_id,)
        )

        self.connection.commit()

    # =====================
    # CLOSE
    # =====================

    def close(self):

        self.connection.close()