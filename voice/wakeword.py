class WakeWordDetector:
    def __init__(self, model_names: list[str] | None = None) -> None:
        self.model_names = model_names or ["hey jarvis"]
        self._model = None

    def _load_model(self) -> None:
        if self._model is not None:
            return
        try:
            from openwakeword.model import Model
        except ImportError as exc:
            raise RuntimeError("Install openwakeword to enable wake word detection.") from exc
        self._model = Model()

    def predict(self, audio_frame) -> dict[str, float]:
        self._load_model()
        return self._model.predict(audio_frame)
