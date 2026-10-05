from collections import deque
from dataclasses import dataclass


@dataclass(frozen=True)
class ChatTurn:
    role: str
    content: str


class SlidingWindowContext:
    def __init__(self, max_turns: int = 12) -> None:
        self._turns: deque[ChatTurn] = deque(maxlen=max_turns)

    def add(self, role: str, content: str) -> None:
        self._turns.append(ChatTurn(role=role, content=content))

    def messages(self) -> list[dict[str, str]]:
        return [{"role": turn.role, "content": turn.content} for turn in self._turns]
