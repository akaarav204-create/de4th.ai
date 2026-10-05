from __future__ import annotations

import tempfile
from pathlib import Path

import sounddevice as sd
import soundfile as sf
from faster_whisper import WhisperModel


class Listener:

    def __init__(self) -> None:

        self.model = WhisperModel(
            "base",
            device="cpu",
            compute_type="int8",
        )

    def record(
        self,
        seconds: int = 5,
        sample_rate: int = 16000,
    ) -> Path:

        print("Listening...")

        audio = sd.rec(
            int(seconds * sample_rate),
            samplerate=sample_rate,
            channels=1,
            dtype="float32",
        )

        sd.wait()

        file_path = (
            Path(tempfile.gettempdir())
            / "jarvis_input.wav"
        )

        sf.write(
            str(file_path),
            audio,
            sample_rate,
        )

        return file_path

    def transcribe(
        self,
        audio_path: Path,
    ) -> str:

        segments, _ = self.model.transcribe(
            str(audio_path)
        )

        text = " ".join(
            segment.text
            for segment in segments
        )

        return text.strip()

    def listen(
        self,
        seconds: int = 5,
    ) -> str:

        audio_path = self.record(
            seconds=seconds
        )

        text = self.transcribe(
            audio_path
        )

        return text


listener = Listener()


def listen(
    seconds: int = 5,
) -> str:

    return listener.listen(
        seconds=seconds
    )
