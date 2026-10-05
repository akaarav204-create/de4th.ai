from __future__ import annotations

import asyncio
from dataclasses import dataclass
from typing import Protocol

import requests

from config import settings


class LLMProvider(Protocol):
    name: str

    def is_configured(self) -> bool:
        ...

    def complete(self, messages: list[dict[str, str]]) -> str:
        ...


# =====================================
# GEMINI
# =====================================

@dataclass
class GeminiProvider:
    name: str = "gemini"

    def is_configured(self) -> bool:
        return bool(settings.gemini_api_key)

    def complete(self, messages: list[dict[str, str]]) -> str:

        prompt = "\n".join(
            f"{msg['role']}: {msg['content']}"
            for msg in messages
        )

        url = (
            "https://generativelanguage.googleapis.com/v1beta/models/"
            f"{settings.gemini_model}:generateContent"
            f"?key={settings.gemini_api_key}"
        )

        response = requests.post(
            url,
            json={
                "contents": [
                    {
                        "parts": [
                            {"text": prompt}
                        ]
                    }
                ]
            },
            timeout=60,
        )

        response.raise_for_status()

        data = response.json()

        return (
            data["candidates"][0]
            ["content"]["parts"][0]["text"]
        )


# =====================================
# GROQ
# =====================================

@dataclass
class GroqProvider:
    name: str = "groq"

    def is_configured(self) -> bool:
        return bool(settings.groq_api_key)

    def complete(self, messages: list[dict[str, str]]) -> str:

        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization":
                f"Bearer {settings.groq_api_key}"
            },
            json={
                "model": settings.groq_model,
                "messages": messages,
            },
            timeout=60,
        )

        response.raise_for_status()

        return (
            response.json()["choices"][0]
            ["message"]["content"]
        )


# =====================================
# SAMBANOVA
# =====================================

@dataclass
class SambaNovaProvider:
    name: str = "sambanova"

    def is_configured(self) -> bool:
        return bool(settings.sambanova_api_key)

    def complete(self, messages: list[dict[str, str]]) -> str:

        response = requests.post(
            "https://api.sambanova.ai/v1/chat/completions",
            headers={
                "Authorization":
                f"Bearer {settings.sambanova_api_key}"
            },
            json={
                "model": settings.sambanova_model,
                "messages": messages,
            },
            timeout=60,
        )

        response.raise_for_status()

        return (
            response.json()["choices"][0]
            ["message"]["content"]
        )


# =====================================
# MANAGER
# =====================================

class LLMManager:

    def __init__(self) -> None:

        providers = {
            "sambanova": SambaNovaProvider(),
            "groq": GroqProvider(),
            "gemini": GeminiProvider(),
        }

        ordered_names = [
            settings.default_llm_provider,
            *settings.llm_fallback_providers,
        ]

        self.providers = [
            providers[name]
            for name in dict.fromkeys(
                ordered_names
            )
            if name in providers
        ]

    async def complete(
        self,
        messages: list[dict[str, str]]
    ) -> str:

        errors: list[str] = []

        for provider in self.providers:

            if not provider.is_configured():

                errors.append(
                    f"{provider.name}: missing key"
                )

                continue

            try:

                return await asyncio.to_thread(
                    provider.complete,
                    messages,
                )

            except Exception as exc:

                errors.append(
                    f"{provider.name}: {exc}"
                )

        return (
            "All AI providers failed.\n\n"
            + "\n".join(errors)
        )
