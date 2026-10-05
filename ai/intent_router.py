from __future__ import annotations

from dataclasses import dataclass
@dataclass
class Intent:
    name: str
    payload: str = ""


class IntentRouter:

    def route(self, text: str) -> Intent:

        original_text = text.strip()
        text = original_text.lower()

        # =====================
        # GREETINGS
        # =====================

        greetings = [
            "hello",
            "hi",
            "hey",
            "namaste",
            "good morning",
            "good afternoon",
            "good evening"
        ]

        if text in greetings:
            return Intent("greeting")

        # =====================
        # IDENTITY
        # =====================

        if (
            "who created you" in text
            or "kisne banaya" in text
            or "tumhe kisne banaya" in text
            or "who made you" in text
        ):
            return Intent("identity")

        # =====================
        # TIME
        # =====================

        if (
            "time" in text
            or "samay" in text
            or "time kya hua" in text
        ):
            return Intent("time")

        # =====================
        # DATE
        # =====================

        if (
            "date" in text
            or "aaj ki date" in text
            or "today date" in text
        ):
            return Intent("date")

        # =====================
        # MEMORY SAVE
        # =====================

        if text.startswith("remember "):
            return Intent(
                "memory_save",
                payload=original_text.replace(
                    "remember ",
                    "",
                    1
                )
            )

        if text.startswith("yaad rakho "):
            return Intent(
                "memory_save",
                payload=original_text.replace(
                    "yaad rakho ",
                    "",
                    1
                )
            )

        # =====================
        # MEMORY RECALL
        # =====================

        if (
            "what do you remember" in text
            or "my memories" in text
            or "show memory" in text
            or "kya yaad hai" in text
            or "meri memory" in text
        ):
            return Intent("memory_recall")

        # =====================
        # MUSIC
        # =====================

        if (
            "play music" in text
            or "music chalao" in text
            or "song play" in text
        ):
            return Intent("play_music")

        # =====================
        # YOUTUBE
        # =====================

        if (
            "open youtube" in text
            or "youtube kholo" in text
        ):
            return Intent("open_youtube")

        # =====================
        # WHATSAPP
        # =====================

        if (
            "open whatsapp" in text
            or "whatsapp kholo" in text
        ):
            return Intent("open_whatsapp")

        # =====================
        # CALCULATOR
        # =====================

        if text.startswith("calculate "):
            return Intent(
                "calculator",
                payload=original_text.replace(
                    "calculate ",
                    "",
                    1
                )
            )

        # =====================
        # REMINDER
        # =====================

        if (
            text.startswith("remind me")
            or text.startswith("yaad dilana")
        ):
            return Intent(
                "reminder",
                payload=original_text
            )

        # =====================
        # BATTERY
        # =====================

        if (
            "battery" in text
            or "battery status" in text
        ):
            return Intent("battery")

        # =====================
        # SYSTEM
        # =====================

        if (
            "system info" in text
            or "system status" in text
        ):
            return Intent("system_info")

        # =====================
        # CALL
        # =====================

        if text.startswith("call "):
            return Intent(
                "call",
                payload=original_text.replace(
                    "call ",
                    "",
                    1
                )
            )

        # =====================
        # MESSAGE
        # =====================

        if text.startswith("message "):
            return Intent(
                "message",
                payload=original_text.replace(
                    "message ",
                    "",
                    1
                )
            )

        # =====================
        # TASK ASSIGN
        # Example:
        # "Rahul ko project yaad dilana"
        # =====================

        if " ko " in text and "yaad dilana" in text:
            return Intent(
                "assign_task",
                payload=original_text
            )

        # =====================
        # AUTH / SECURITY
        # =====================

        if (
            "forgot password" in text
            or "password bhool gaya" in text
            or "pin yaad nahi" in text
            or "reset pin" in text
            or "naya account" in text
            or "signup" in text
        ):
            return Intent("forgot_password")

        # =====================
        # UNKNOWN -> LLM
        # =====================

        return Intent(
            "llm",
            payload=original_text
        )
