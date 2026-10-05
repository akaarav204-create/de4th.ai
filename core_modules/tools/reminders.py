from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class Reminder:
    text: str
    due_at: datetime


class ReminderStore:
    def __init__(self) -> None:
        self._items: list[Reminder] = []

    def add(self, text: str, due_at: datetime) -> Reminder:
        reminder = Reminder(text=text, due_at=due_at)
        self._items.append(reminder)
        return reminder

    def upcoming(self) -> list[Reminder]:
        now = datetime.now()
        return sorted((item for item in self._items if item.due_at >= now), key=lambda item: item.due_at)
