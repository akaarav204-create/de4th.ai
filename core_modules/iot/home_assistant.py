from __future__ import annotations

import requests

from config import settings


class HomeAssistantClient:
    def __init__(self, base_url: str | None = None, token: str | None = None) -> None:
        self.base_url = (base_url or settings.home_assistant_url).rstrip("/")
        self.token = token or settings.home_assistant_token

    @property
    def headers(self) -> dict[str, str]:
        return {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json",
        }

    def is_configured(self) -> bool:
        return bool(self.base_url and self.token)

    def call_service(self, domain: str, service: str, payload: dict) -> dict:
        if not self.is_configured():
            raise RuntimeError("Set HOME_ASSISTANT_URL and HOME_ASSISTANT_TOKEN in .env.")
        response = requests.post(
            f"{self.base_url}/api/services/{domain}/{service}",
            headers=self.headers,
            json=payload,
            timeout=20,
        )
        response.raise_for_status()
        return response.json()
