import sqlite3
from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from ai.brain import Brain

from config import settings

from memory.sql_db import SqlMemoryStore
from memory.vector_db import VectorMemoryStore
from memory.tasks_db import TaskStore
from memory.friends_db import FriendStore
from memory.chat_db import ChatStore

from memory.presence_db import PresenceStore
from backend import presence

from memory.notifications_db import NotificationStore
from backend import notifications

from memory.groups_db import GroupStore
from backend import groups
from backend import admin
from backend import (
    auth,
    chat,
    users,
    tasks,
    friends,
    messages,
    voice_call,
    websocket_server,
)
@asynccontextmanager
async def lifespan(app: FastAPI):
    
    print("\n==============================")
    print("Starting JarvisAI...")
    print("==============================")

    # Memory Systems
    vector_memory = VectorMemoryStore(
        settings.vector_db_path
    )

    sql_memory = SqlMemoryStore(
        settings.messages_db_path
    )

    # AI Brain
    app.state.brain = Brain(
        vector_memory=vector_memory,
        sql_memory=sql_memory,
    )

    # Tasks Database
    app.state.tasks = TaskStore(
        Path("database/tasks.db")
    )

    # Friends Database
    app.state.friends = FriendStore(
         Path("database/friends.db")
    )
    app.state.chat_db = ChatStore(
         Path("database/chat.db")
    )

    # User Database
    app.state.users = users.UserStore(
        settings.users_db_path
    )

    # Ensure default admin credentials exist
    try:
        admin_user = app.state.users.get_user_by_username("aarav")
        if admin_user is None:
            app.state.users.create_user(
                username="aarav",
                pin="aarav1",
                display_name="Aarav Admin"
            )
    except sqlite3.IntegrityError:
        pass

    # Call Logs
    app.state.call_logs = voice_call.CallLogStore(
        settings.call_logs_db_path
    )

    app.state.presence = PresenceStore(
         Path("database/presence.db")
    )
    app.state.groups = GroupStore(
         Path("database/groups.db")
    )
    app.state.notifications = NotificationStore(
         Path("database/notifications.db")
    )

    print("Brain Loaded")
    print("Users Loaded")
    print("Memory Loaded")
    print("Tasks Loaded")
    print("Call Logs Loaded")

    yield

    print("\nShutting Down JarvisAI...")

    sql_memory.close()
    app.state.users.close()
    app.state.call_logs.close()
    app.state.tasks.close()
    app.state.friends.close()
    app.state.chat_db.close()
    app.state.presence.close() 
    app.state.notifications.close()
    app.state.groups.close()

    print("Memory Closed")
    print("Users Closed")
    print("Friends Closed")
    print("Cleanup Complete")


def create_app() -> FastAPI:

    app = FastAPI(
        title="JarvisAI",
        version=settings.app_version,
        lifespan=lifespan,
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # ======================
    # CORS
    # ======================

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost",
            "http://127.0.0.1",
            "capacitor://localhost",
            "http://localhost:5173",
            "https://localhost:5173",
            "https://de4th-ai.onrender.com",
            "https://de4th-ai.onrender.com:5173"
        ],
        allow_origin_regex=r"https?://.*",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ======================
    # Routers
    # ======================

    app.include_router(auth.router)
    app.include_router(users.router)
    app.include_router(chat.router)
    app.include_router(voice_call.router)
    app.include_router(websocket_server.router)
    app.include_router(tasks.router)
    app.include_router(friends.router)
    app.include_router(messages.router)
    app.include_router(presence.router)
    app.include_router(notifications.router)
    app.include_router(groups.router)
    app.include_router(admin.router)

    # ======================
    # Home
    # ======================

    @app.get("/")
    async def home():

        return {
            "assistant": settings.assistant_name,
            "status": "online",
            "version": settings.app_version,
            "provider": settings.default_llm_provider,
            "modules": [
                "auth",
                "users",
                "chat",
                "voice_call",
                "websocket"
            ]
        }

    # ======================
    # Health Check
    # ======================

    @app.get("/health")
    async def health():

        return {
            "status": "healthy",
            "assistant": settings.assistant_name,
            "version": settings.app_version
        }

    # ======================
    # System Info
    # ======================

    @app.get("/system")
    async def system():

        return {
            "assistant": settings.assistant_name,
            "version": settings.app_version,
            "default_provider":
                settings.default_llm_provider,
            "fallback_providers":
                settings.llm_fallback_providers,
            "voice":
                settings.edge_tts_voice
        }

    return app


app = create_app()
