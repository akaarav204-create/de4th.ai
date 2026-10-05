import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaRobot,
  FaMicrophone,
  FaFingerprint,
  FaPalette,
  FaBrain,
  FaBell
} from "react-icons/fa";
import { api } from "../api";
import { getStoredUser } from "../utils/demoMode";

export default function Settings() {
  const user = getStoredUser();
  const [assistantName, setAssistantName] = useState(user.display_name || "JARVIS");
  const [theme, setTheme] = useState("Neon Blue");
  const [voice, setVoice] = useState("Neerja");
  const [provider, setProvider] = useState("SambaNova");
  const [fingerprint, setFingerprint] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user?.id) {
      setAssistantName(user.display_name || "JARVIS");
    }
  }, [user.id]);

  const handleSave = async () => {
    if (!user?.id) {
      setMessage("Please log in to save settings.");
      return;
    }

    setSaving(true);
    try {
      await axios.patch(api(`/users/${user.id}`), {
        display_name: assistantName,
        language: voice === "Neerja" ? "hinglish" : "english",
        personality_mode: provider.toLowerCase()
      });
      setMessage("Settings saved successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Unable to save settings right now.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">

      <div className="p-8 border-b border-cyan-500/20">

        <h1 className="text-4xl font-bold">
          Settings
        </h1>

        <p className="text-zinc-400">
          Personalize your AI assistant
        </p>

      </div>

      <div className="p-8 space-y-8">

        {/* Assistant */}

        <div className="bg-zinc-900 p-6 rounded-3xl border border-cyan-500/20">

          <div className="flex items-center gap-3 mb-4">
            <FaRobot className="text-cyan-400" />
            <h2 className="text-xl font-bold">
              Assistant
            </h2>
          </div>

          <input
            value={assistantName}
            onChange={(e) =>
              setAssistantName(e.target.value)
            }
            className="w-full bg-zinc-800 p-3 rounded-xl"
            placeholder="Assistant Name"
          />

        </div>

        {/* Theme */}

        <div className="bg-zinc-900 p-6 rounded-3xl border border-cyan-500/20">

          <div className="flex items-center gap-3 mb-4">
            <FaPalette className="text-cyan-400" />
            <h2 className="text-xl font-bold">
              Theme
            </h2>
          </div>

          <select
            value={theme}
            onChange={(e) =>
              setTheme(e.target.value)
            }
            className="w-full bg-zinc-800 p-3 rounded-xl"
          >
            <option>Neon Blue</option>
            <option>Cyber Purple</option>
            <option>Matrix Green</option>
            <option>Iron Red</option>
            <option>AMOLED Black</option>
          </select>

        </div>

        {/* Voice */}

        <div className="bg-zinc-900 p-6 rounded-3xl border border-cyan-500/20">

          <div className="flex items-center gap-3 mb-4">
            <FaMicrophone className="text-cyan-400" />
            <h2 className="text-xl font-bold">
              Voice
            </h2>
          </div>

          <select
            value={voice}
            onChange={(e) =>
              setVoice(e.target.value)
            }
            className="w-full bg-zinc-800 p-3 rounded-xl"
          >
            <option>Neerja</option>
            <option>Aria</option>
            <option>Jenny</option>
            <option>Guy</option>
          </select>

        </div>

        {/* AI Provider */}

        <div className="bg-zinc-900 p-6 rounded-3xl border border-cyan-500/20">

          <div className="flex items-center gap-3 mb-4">
            <FaBrain className="text-cyan-400" />
            <h2 className="text-xl font-bold">
              AI Provider
            </h2>
          </div>

          <select
            value={provider}
            onChange={(e) =>
              setProvider(e.target.value)
            }
            className="w-full bg-zinc-800 p-3 rounded-xl"
          >
            <option>SambaNova</option>
            <option>Groq</option>
            <option>Gemini</option>
            <option>Auto</option>
          </select>

        </div>

        {/* Fingerprint */}

        <div className="bg-zinc-900 p-6 rounded-3xl border border-cyan-500/20">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <FaFingerprint className="text-cyan-400" />

              <span>
                Fingerprint Login
              </span>

            </div>

            <input
              type="checkbox"
              checked={fingerprint}
              onChange={() =>
                setFingerprint(!fingerprint)
              }
            />

          </div>

        </div>

        {/* Notifications */}

        <div className="bg-zinc-900 p-6 rounded-3xl border border-cyan-500/20">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <FaBell className="text-cyan-400" />

              <span>
                Notifications
              </span>

            </div>

            <input
              type="checkbox"
              checked={notifications}
              onChange={() =>
                setNotifications(!notifications)
              }
            />

          </div>

        </div>

        {/* Save */}

        {message ? <p className="text-sm text-cyan-400">{message}</p> : null}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-cyan-500 text-black font-bold p-4 rounded-2xl disabled:opacity-70"
        >
          {saving ? "SAVING..." : "SAVE SETTINGS"}
        </button>

      </div>

    </div>
  );
}