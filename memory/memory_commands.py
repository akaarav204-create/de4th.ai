from __future__ import annotations

from memory.vector_db import VectorMemoryStore


class MemoryCommands:

    def __init__(
        self,
        vector_memory: VectorMemoryStore,
    ) -> None:
        self.vector_memory = vector_memory

    # =====================
    # SAVE MEMORY
    # =====================

    def remember(self, text: str) -> str:

        text = text.strip()

        if not text:
            return "Nothing to remember."

        self.vector_memory.add_text(text)

        return f"I will remember: {text}"

    # =====================
    # RECALL MEMORY
    # =====================

    def recall(
        self,
        query: str = "user memory",
        limit: int = 10,
    ) -> str:

        memories = self.vector_memory.search(
            query,
            limit=limit,
        )

        if not memories:
            return "I do not remember anything yet."

        return "\n".join(memories)

    # =====================
    # SEARCH MEMORY
    # =====================

    def search(
        self,
        query: str,
        limit: int = 10,
    ) -> str:

        memories = self.vector_memory.search(
            query,
            limit=limit,
        )

        if not memories:
            return "No matching memory found."

        return "\n".join(memories)

    # =====================
    # CLEAR MEMORY
    # =====================

    def clear(self) -> str:

        if hasattr(
            self.vector_memory,
            "_fallback_texts",
        ):
            self.vector_memory._fallback_texts.clear()

        return "Memory cleared."
