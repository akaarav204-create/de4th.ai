from __future__ import annotations

import asyncio
import tempfile
from pathlib import Path

import edge_tts

from config import settings


class Speaker:

    def __init__(self) -> None:
        self.voice = settings.edge_tts_voice

    async def speak(self, text: str) -> str:

        text = text.strip()

        if not text:
            return "Nothing to speak."

        temp_file = Path(
            tempfile.gettempdir()
        ) / "jarvis_response.mp3"

        communicate = edge_tts.Communicate(
            text=text,
            voice=self.voice,
        )

        await communicate.save(
            str(temp_file)
        )

        await self._play_audio(
            temp_file
        )

        return "Speech completed."

    async def _play_audio(
        self,
        audio_file: Path,
    ) -> None:

        try:

            import winsound

            winsound.PlaySound(
                str(audio_file),
                winsound.SND_FILENAME,
            )

        except Exception:

            try:

                import os

                os.startfile(
                    str(audio_file)
                )

            except Exception:
                pass


speaker = Speaker()


async def speak(
    text: str,
) -> str:

    return await speaker.speak(
        text
    )
