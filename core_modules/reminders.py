from __future__ import annotations

import threading
import time
from datetime import datetime


class ReminderManager:

    def __init__(self) -> None:

        self.reminders: list[dict] = []

        self.running = True

        self.thread = threading.Thread(
            target=self._worker,
            daemon=True,
        )

        self.thread.start()

    # =====================
    # ADD REMINDER
    # =====================

    def add(
        self,
        title: str,
        remind_at: datetime,
    ) -> str:

        self.reminders.append(
            {
                "title": title,
                "time": remind_at,
                "triggered": False,
            }
        )

        return (
            f"Reminder added: "
            f"{title} at {remind_at}"
        )

    # =====================
    # LIST REMINDERS
    # =====================

    def list_reminders(
        self,
    ) -> list[dict]:

        return self.reminders

    # =====================
    # DELETE REMINDER
    # =====================

    def delete(
        self,
        index: int,
    ) -> str:

        if index < 0:
            return "Invalid reminder."

        if index >= len(self.reminders):
            return "Reminder not found."

        removed = self.reminders.pop(index)

        return (
            f"Deleted reminder: "
            f"{removed['title']}"
        )

    # =====================
    # BACKGROUND WORKER
    # =====================

    def _worker(self):

        while self.running:

            now = datetime.now()

            for reminder in self.reminders:

                if reminder["triggered"]:
                    continue

                if now >= reminder["time"]:

                    reminder["triggered"] = True

                    print(
                        "\n🔔 REMINDER:",
                        reminder["title"],
                    )

            time.sleep(5)

    # =====================
    # STOP
    # =====================

    def stop(self):

        self.running = False


reminder_manager = ReminderManager()
