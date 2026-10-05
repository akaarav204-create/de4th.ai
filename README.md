# JarvisAI

JarvisAI is a FastAPI backend foundation for a mobile-first AI assistant. It is
structured for auth, users, chat, voice calls, WebSocket device sync, memory, and
future mobile app screens.

## Current Version

`1.1.0`

## Project Structure

```text
JarvisAI/
├── backend/
│   ├── main.py
│   ├── auth.py
│   ├── users.py
│   ├── chat.py
│   ├── voice_call.py
│   └── websocket_server.py
├── ai/
│   ├── brain.py
│   ├── context.py
│   ├── llm_manager.py
│   └── memory.py
├── memory/
│   ├── sql_db.py
│   ├── vector_db.py
│   └── profile.py
├── database/
├── media/
├── mobile_app/
├── voice/
├── core_modules/
├── config.py
└── main.py
```

## Setup

Create or activate the virtual environment:

```powershell
venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

Configure `.env`:

```env
ASSISTANT_NAME=Jarvis
APP_VERSION=1.1.0
OPENAI_API_KEY=
GEMINI_API_KEY=
ANTHROPIC_API_KEY=
```

At least one LLM key is needed for real AI responses. Without keys, `/chat`
returns a safe setup message instead of crashing.

## Run

```powershell
uvicorn backend.main:app --host de4th-ai.onrender.com --port 8000 --reload
```

Compatibility entrypoint:

```powershell
uvicorn main:app --host de4th-ai.onrender.com --port 8000 --reload
```

Open:

- API: `https://de4th-ai.onrender.com`
- Docs: `https://de4th-ai.onrender.com/docs`

## API Endpoints

- `GET /` - health and module status
- `POST /auth/register` - create a user with PIN
- `POST /auth/login` - login and get a session token
- `GET /users` - list users
- `GET /users/{user_id}` - get user profile
- `PATCH /users/{user_id}` - update user profile
- `POST /chat` - send message to JarvisAI
- `POST /voice-call/start` - start call log
- `POST /voice-call/end` - end call log
- `WS /ws/{device_id}` - device sync WebSocket

## Quick Test

```powershell
python -m compileall -q .
python -c "from main import app; print(app.title, app.version)"
```

Expected output:

```text
JarvisAI 1.1.0
```

## Mobile App Status

The backend is ready for a mobile client prototype. The `mobile_app/` folder
currently contains screen placeholders:

- `login_screen`
- `contacts_screen`
- `chat_screen`
- `call_screen`
- `settings_screen`

Next step is choosing Flutter, React Native, or native Android and connecting
the screens to the backend endpoints above.

## Echo Dot Integration Status

Echo Dot can pair as a Bluetooth speaker today. Direct voice integration needs
an Alexa Custom Skill with a public HTTPS endpoint that forwards Alexa requests
to this backend.

Suggested future endpoint:

```text
POST /alexa/skill
```

## Notes

- Runtime SQLite files in `database/*.db` are ignored by git.
- Secrets stay in `.env`.
- Optional AI/voice packages are commented in `requirements.txt` until needed.
