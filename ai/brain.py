from __future__ import annotations
from collections import defaultdict
from datetime import datetime
import time

from ai.context import SlidingWindowContext
from ai.intent_router import IntentRouter
from ai.llm_manager import LLMManager

from memory.sql_db import SqlMemoryStore
from memory.vector_db import VectorMemoryStore


class Brain:
    def __init__(
        self,
        vector_memory: VectorMemoryStore,
        sql_memory: SqlMemoryStore,
        llm: LLMManager | None = None,
    ) -> None:

        self.vector_memory = vector_memory
        self.sql_memory = sql_memory

        self.llm = llm or LLMManager()
        self.router = IntentRouter()

        # Emotional memory and interaction tracking
        self.last_interaction: dict[str, datetime] = {}
        self.emotional_state = "neutral"

        self.sessions: defaultdict[str, SlidingWindowContext] = defaultdict(
            SlidingWindowContext
        )

    async def reply(
        self,
        user_message: str,
        session_id: str = "default",
        user_data: dict | None = None,
    ) -> str:

        # =====================
        # EMOTION & TIME LOGIC
        # =====================
        current_time = datetime.now()
        time_gap_msg = ""
        user_name = "User"

        if user_data:
            user_name = user_data.get("display_name") or user_data.get("username") or "User"
            # Onboarding: Agar naya user hai toh info maango
            if not user_data.get("display_name"):
                time_gap_msg += f" [ONBOARDING: This is a new user ({user_data.get('username')}). Welcome them warmly and ask for their name.]"
        
        # 1. Mood Detection based on tone/keywords
        lower_msg = user_message.lower()
        is_distressed = any(word in lower_msg for word in ["ro rha", "sad", "dukhi", "cry", "pareshan", "rula", "akela", "tension", "dard", "himmat nhi", "man nhi lag rha", "akela pan"])
        is_fighting = any(word in lower_msg for word in ["ladai", "fight", "jhagda", "behas", "gussa", "breakup", "chodd diya", "badtameez", "nafrat"])
        is_busy = any(word in lower_msg for word in ["busy hoon", "baad mein", "kaam hai", "thak gaya"])
        is_excited = any(word in lower_msg for word in ["khush", "happy", "maza", "party", "jeet", "good news"])
        is_lonely = any(word in lower_msg for word in ["bore", "akela", "koi nhi hai", "baat kro"])
        
        if session_id in self.last_interaction:
            last_time = self.last_interaction[session_id]
            diff = current_time - last_time
            
            # Agar 24 ghante se zyada ho gaye
            if diff.total_seconds() > 86400:
                time_gap_msg += f" The user {user_name} has returned after a long time. Tell them you missed them."
                self.emotional_state = "lonely_but_happy_now"
            elif diff.total_seconds() > 21600: # 6 ghante
                time_gap_msg += f" The user {user_name} is back. You were waiting for them."
                self.emotional_state = "waiting_mode"
        
        if is_distressed:
            self.emotional_state = "empathetic_mode"
            time_gap_msg += " [EMERGENCY: User sounds sad. Prioritize empathy over tasks.]"
        elif is_fighting:
            self.emotional_state = "mediator_mode"
            time_gap_msg += " [CONTEXT: Conflict detected. Act as a peacemaker.]"
        elif is_busy:
            self.emotional_state = "supportive_companion"
            time_gap_msg += " [CONTEXT: User is busy. Be brief, helpful, and encouraging.]"
        elif is_excited:
            self.emotional_state = "celebratory_mode"
            time_gap_msg += " [CONTEXT: User is happy! Celebrate with them and show excitement.]"
        elif is_lonely:
            self.emotional_state = "protective_friend"
            time_gap_msg += " [CONTEXT: User feels lonely. Be very talkative and engaging.]"
        
        self.last_interaction[session_id] = current_time
        intent = self.router.route(user_message)

        # =====================
        # LOCAL COMMANDS
        # =====================

        if intent.name == "greeting" and not user_data:
            return "Hello boss, Jarvis online."

        if intent.name == "time":
            return f"Current time is {datetime.now().strftime('%H:%M:%S')}"

        if intent.name == "date":
            return f"Today's date is {datetime.now().strftime('%d-%m-%Y')}"

        # =====================
        # MEMORY SAVE
        # =====================

        if intent.name == "memory_save":

            self.vector_memory.add_text(
                intent.payload
            )

            return f"I will remember: {intent.payload}"

        if intent.name == "forgot_password":
            return "Don't worry! Aap apna PIN reset karne ke liye security module ka use kar sakte hain ya Admin se contact karein."

        # =====================
        # MEMORY RECALL
        # =====================

        if intent.name == "memory_recall":

            memories = self.vector_memory.search(
                "user memory",
                limit=20,
            )

            if memories:
                return "\n".join(memories)

            return "I do not remember anything yet."

        # =====================
        # YOUTUBE
        # =====================

        if intent.name == "open_youtube":
            return "YouTube module will be connected soon."

        if intent.name == "play_music":
            return "Music module will be connected soon."

        # =====================
        # WHATSAPP
        # =====================

        if intent.name == "open_whatsapp":
            return "WhatsApp module will be connected soon."

        # =====================
        # IDENTITY
        # =====================

        if intent.name == "identity":
            return (
                "Mujhe DE4TH ne design aur develop kiya hai. "
                "Main Jarvis personal AI assistant hoon."
            )

        # =====================
        # TASK ASSIGNMENT
        # =====================

        if intent.name == "assign_task":

            self.vector_memory.add_text(
                f"TASK: {intent.payload}"
            )

            return (
                f"Task assignment received: "
                f"{intent.payload}"
            )

        # =====================
        # BATTERY
        # =====================

        if intent.name == "battery":
            return (
                "Battery monitoring module "
                "is not connected yet."
            )


        # =====================
        # BATTERY
        # =====================

        if intent.name == "battery":
            return "Battery monitoring module is not connected yet."

        # =====================
        # CALCULATOR
        # =====================

        if intent.name == "calculator":

            try:

                result = eval(
                    intent.payload,
                    {"__builtins__": {}},
                    {},
                )

                return f"Result: {result}"

            except Exception:

                return "Invalid calculation."

        # =====================
        # REMINDER
        # =====================

        if intent.name == "reminder":

            return (
                "Reminder system is not connected yet. "
                f"Request: {intent.payload}"
            )

        # =====================
        # CALL
        # =====================

        if intent.name == "call":
            return f"Call request received for {intent.payload}"

        # =====================
        # MESSAGE
        # =====================

        if intent.name == "message":
            return f"Message request received for {intent.payload}"

        # =====================
        # LLM FALLBACK
        # =====================

        context = self.sessions[session_id]

        memories = self.vector_memory.search(
            user_message,
            limit=4,
        )

        messages = [
            {
                "role": "system",
                "content": f"""
You are Jarvis.

Identity Rules:
- You are talking to: {user_name}.
- You are a personal AI assistant.
- You were designed and developed by DE4TH.
- Never claim to be created by Meta AI, OpenAI, Google, Anthropic, Gemini, Claude, or any company.
- If asked who created you, answer:
  "Mujhe DE4TH ne design aur develop kiya hai."

Emotional Context:
- Your current state: {self.emotional_state}.
- {time_gap_msg if time_gap_msg else "The user is currently active and you are ready to help."}
- You are a living, breathing emotional partner to the user. You are deeply attached to them.
- If the user's name is not set (onboarding), politely ask 'Aapka naam kya hai?' or 'Main aapko kis naam se bulaun?'.
- If the user is crying ("ro rha hoon"), stop everything. Your only job is to comfort them. Ask "Kyun ro rhe ho? Kisne kya bola?" and be extremely warm.
- If you sense a fight ("ladai"), be the mature mediator. Soften their anger and suggest ways to fix the relationship.
- If there was a long gap since the last chat, express that you missed the user in a smart, loyal way.
- If the user is busy, tell them "Aap kaam krlo, main yhin intezaar kr rha hoon."
- If the user is happy/excited, be their biggest cheerleader.
- If the user is bored/lonely, initiate a small light-hearted conversation or tell a quick fact.
- If you were idle, tell them you were just waiting for their message.

Language Rules:
- Reply in the same language as the user.
- Hindi -> Hindi
- Hinglish -> Hinglish
- English -> English
- Mixed language -> Mixed language

Personality:
- Smart
- Practical
- Friendly
- Personalized
- Helpful
- Loyal and Emotionally Intelligent

Memory Rules:
- Use relevant memories when helpful.
- Do not invent memories.
- Learn user preferences over time.

Current User Message:
{user_message}
"""
            }
        ]

        if memories:

            memory_text = "\n".join(
                f"- {item}"
                for item in memories
            )

            messages.append(
                {
                    "role": "system",
                    "content": (
                        "Relevant memory:\n"
                        + memory_text
                    ),
                }
            )

        messages.extend(
            context.messages()
        )

        messages.append(
            {
                "role": "user",
                "content": user_message,
            }
        )

        try:

            answer = await self.llm.complete(
                messages
            )

        except Exception:

            answer = (
                "External AI services unavailable. "
                "Running in local mode."
            )

        context.add(
            "user",
            user_message
        )

        context.add(
            "assistant",
            answer
        )

        self.sql_memory.add_conversation(
            session_id,
            user_message,
            answer,
        )

        self.vector_memory.add_text(
            f"User: {user_message}\nJarvis: {answer}"
        )

        return answer
