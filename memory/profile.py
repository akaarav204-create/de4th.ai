from collections import Counter


class UserProfile:
    def __init__(self) -> None:
        self.preferences: Counter[str] = Counter()

    def remember_preference(self, key: str, weight: int = 1) -> None:
        self.preferences[key] += weight

    def top_preferences(self, limit: int = 10) -> list[tuple[str, int]]:
        return self.preferences.most_common(limit)
