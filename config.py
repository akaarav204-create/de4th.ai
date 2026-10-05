from dataclasses import dataclass, field
from pathlib import Path
import os

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")


def _csv_env(name: str, default: str) -> list[str]:
    raw = os.getenv(name, default)
    return [item.strip() for item in raw.split(",") if item.strip()]


@dataclass(frozen=True)
class Settings:
    assistant_name: str = os.getenv("ASSISTANT_NAME", "Jarvis")
    app_version: str = os.getenv("APP_VERSION", "1.1.0")

    # AI Provider Order
    default_llm_provider: str = os.getenv(
        "DEFAULT_LLM_PROVIDER",
        "sambanova"
    )

    llm_fallback_providers: list[str] = field(
        default_factory=lambda: _csv_env(
            "LLM_FALLBACK_PROVIDERS",
            "sambanova,groq,gemini"
        )
    )

    # OpenAI
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    openai_model: str = os.getenv(
        "OPENAI_MODEL",
        "gpt-4o-mini"
    )

    # Gemini
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    gemini_model: str = os.getenv(
        "GEMINI_MODEL",
        "gemini-1.5-flash"
    )

    # Groq
    groq_api_key: str = os.getenv("GROQ_API_KEY", "")
    groq_model: str = os.getenv(
        "GROQ_MODEL",
        "llama-3.3-70b-versatile"
    )

    # SambaNova
    sambanova_api_key: str = os.getenv(
        "SAMBANOVA_API_KEY",
        ""
    )

    sambanova_model: str = os.getenv(
        "SAMBANOVA_MODEL",
        "Meta-Llama-3.3-70B-Instruct"
    )

    # Claude
    anthropic_api_key: str = os.getenv(
        "ANTHROPIC_API_KEY",
        ""
    )

    anthropic_model: str = os.getenv(
        "ANTHROPIC_MODEL",
        "claude-3-5-haiku-latest"
    )

    # ElevenLabs
    elevenlabs_api_key: str = os.getenv(
        "ELEVENLABS_API_KEY",
        ""
    )

    elevenlabs_voice_id: str = os.getenv(
        "ELEVENLABS_VOICE_ID",
        ""
    )

    edge_tts_voice: str = os.getenv(
        "EDGE_TTS_VOICE",
        "en-IN-NeerjaNeural"
    )

    # Home Assistant
    home_assistant_url: str = os.getenv(
        "HOME_ASSISTANT_URL",
        ""
    )

    home_assistant_token: str = os.getenv(
        "HOME_ASSISTANT_TOKEN",
        ""
    )

    # Databases
    vector_db_path: Path = BASE_DIR / os.getenv(
        "VECTOR_DB_PATH",
        "data/vector_memory"
    )

    sql_db_path: Path = BASE_DIR / os.getenv(
        "SQL_DB_PATH",
        "data/jarvis.db"
    )

    users_db_path: Path = BASE_DIR / os.getenv(
        "USERS_DB_PATH",
        "database/users.db"
    )

    messages_db_path: Path = BASE_DIR / os.getenv(
        "MESSAGES_DB_PATH",
        "database/messages.db"
    )

    call_logs_db_path: Path = BASE_DIR / os.getenv(
        "CALL_LOGS_DB_PATH",
        "database/call_logs.db"
    )


settings = Settings()
