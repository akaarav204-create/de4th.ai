from __future__ import annotations

from pathlib import Path
from uuid import uuid4


class VectorMemoryStore:
    def __init__(self, path: Path) -> None:
        self.path = Path(path)
        self.path.mkdir(parents=True, exist_ok=True)
        self._collection = None
        self._fallback_texts: list[str] = []
        self._init_chromadb()

    def _init_chromadb(self) -> None:
        try:
            import chromadb
        except ImportError:
            return

        client = chromadb.PersistentClient(path=str(self.path))
        self._collection = client.get_or_create_collection("jarvis_memory")

    def add_text(self, text: str) -> None:
        if not text.strip():
            return
        if self._collection is None:
            self._fallback_texts.append(text)
            return
        self._collection.add(ids=[str(uuid4())], documents=[text])

    def search(self, query: str, limit: int = 4) -> list[str]:
        if self._collection is None:
            words = {word.lower() for word in query.split() if len(word) > 2}
            ranked = [
                text for text in self._fallback_texts if words.intersection(text.lower().split())
            ]
            return ranked[-limit:]

        results = self._collection.query(query_texts=[query], n_results=limit)
        return results.get("documents", [[]])[0]
