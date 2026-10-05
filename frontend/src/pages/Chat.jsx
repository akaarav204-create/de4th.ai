import { useState } from "react";
import axios from "axios";
import { api } from "../api";
import {
  FaPaperPlane,
  FaMicrophone,
  FaImage,
  FaRobot
} from "react-icons/fa";
import { getDisplayName, getDemoReply } from "../utils/demoMode";

export default function Chat() {
  const displayName = getDisplayName();

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
  {
    sender: "jarvis",
    text: `Welcome back ${displayName}. All systems operational.`
  }
 ]);
  const sendMessage = async () => {

    if (!message.trim()) return;

    const userText = message;

    const userMessage = {
      sender: "user",
      text: userText
    };

    setMessages((prev) => [
      ...prev,
      userMessage
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post(
        api("/chat"),
        {
          message: userText,
          session_id: "default",
          user_id: 1,
          language: "hinglish"
        },
        { timeout: 5000 }
      );

      const jarvisReply = {
        sender: "jarvis",
        text: response?.data?.answer || getDemoReply(userText)
      };

      setMessages((prev) => [
        ...prev,
        jarvisReply
      ]);

    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "jarvis",
          text: getDemoReply(userText)
        }
      ]);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col">

      {/* Header */}

      <div className="border-b border-cyan-500/20 p-5 flex justify-between items-center">

        <div className="flex items-center gap-3">

          <FaRobot
            size={35}
            className="text-cyan-400"
          />

          <div>

            <h1 className="font-bold text-2xl">
              JARVIS
            </h1>

            
           <p className="text-green-400 text-sm">
              {displayName} • Online
           </p>

          </div>

        </div>

      </div>

      {/* AI Orb */}

      <div className="flex justify-center mt-6">

        <div className="w-32 h-32 rounded-full bg-cyan-500/20 border border-cyan-400 animate-pulse flex items-center justify-center">

          <FaRobot
            size={50}
            className="text-cyan-400"
          />

        </div>

      </div>

      {/* Messages */}

      <div className="flex-1 overflow-y-auto p-5 space-y-4">

        {messages.map((msg, index) => (

          <div
            key={index}
            className={`flex ${
              msg.sender === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >

            <div
              className={`max-w-[70%] p-4 rounded-2xl ${
                msg.sender === "user"
                  ? "bg-cyan-500 text-black"
                  : "bg-zinc-900 border border-cyan-500/20"
              }`}
            >
              {msg.text}
            </div>

          </div>

        ))}

        {loading && (

          <div className="flex justify-start">

            <div className="bg-zinc-900 border border-cyan-500/20 p-4 rounded-2xl">

              Jarvis is thinking...

            </div>

          </div>

        )}

      </div>

      {/* Input */}

      <div className="p-5 border-t border-cyan-500/20">

        <div className="flex gap-3">

          <button
            className="bg-zinc-900 p-4 rounded-xl"
          >
            <FaImage />
          </button>

          <button
            className="bg-zinc-900 p-4 rounded-xl"
          >
            <FaMicrophone />
          </button>

          <input
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            placeholder="Talk to Jarvis..."
            className="flex-1 bg-zinc-900 p-4 rounded-xl outline-none"
          />

          <button
            onClick={sendMessage}
            className="bg-cyan-500 text-black p-4 rounded-xl"
          >
            <FaPaperPlane />
          </button>

        </div>

      </div>

    </div>
  );
}
