import { useNavigate } from "react-router-dom";
import {
  FaRobot,
  FaArrowRight,
  FaBrain,
  FaComments,
  FaMicrophone
} from "react-icons/fa";

export default function Welcome() {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">

      {/* Background */}

      <div className="fixed inset-0">

        <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />

        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      </div>

      {/* Content */}

      <div className="relative z-10">

        {/* Navbar */}

        <div className="flex justify-between items-center p-6">

          <h1 className="text-3xl font-bold text-cyan-400">
            JARVIS
          </h1>

          <div className="flex gap-4">

            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 rounded-xl border border-cyan-500 text-cyan-400"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="px-5 py-2 rounded-xl bg-cyan-500 text-black font-bold"
            >
              Sign Up
            </button>

          </div>

        </div>
        <div className="flex justify-center gap-4 mt-6">

            <button
               onClick={() => navigate("/about")}
              className="text-cyan-400"
             >
              About
             </button>
             <button
               onClick={() => navigate("/credits")}
             className="text-cyan-400"
             >
             Credits
             </button>

        </div>
        {/* Hero */}

        <div className="flex flex-col items-center justify-center text-center px-6 pt-20">

          <div className="w-44 h-44 rounded-full border border-cyan-500 flex items-center justify-center bg-cyan-500/10 animate-pulse">

            <FaRobot
              size={80}
              className="text-cyan-400"
            />

          </div>

          <h1 className="text-7xl font-bold mt-10">
            JARVIS AI
          </h1>

          <p className="text-zinc-400 text-xl mt-6 max-w-3xl">

            A next generation AI companion that remembers,
            learns, helps, communicates and grows with you.

          </p>

          <button
            onClick={() => navigate("/signup")}
            className="mt-10 flex items-center gap-3 bg-cyan-500 text-black px-8 py-4 rounded-2xl text-lg font-bold"
          >
            Get Started
            <FaArrowRight />
          </button>

        </div>

        {/* Features */}

        <div className="grid md:grid-cols-3 gap-6 p-10 mt-16 max-w-7xl mx-auto">

          <div className="bg-zinc-900/70 border border-cyan-500/20 p-8 rounded-3xl">

            <FaBrain
              size={40}
              className="text-cyan-400"
            />

            <h2 className="text-2xl font-bold mt-4">
              Smart Memory
            </h2>

            <p className="text-zinc-400 mt-3">
              Learns preferences and remembers important conversations.
            </p>

          </div>

          <div className="bg-zinc-900/70 border border-cyan-500/20 p-8 rounded-3xl">

            <FaComments
              size={40}
              className="text-cyan-400"
            />

            <h2 className="text-2xl font-bold mt-4">
              AI Companion
            </h2>

            <p className="text-zinc-400 mt-3">
              Talk naturally in Hindi, Hinglish or English.
            </p>

          </div>

          <div className="bg-zinc-900/70 border border-cyan-500/20 p-8 rounded-3xl">

            <FaMicrophone
              size={40}
              className="text-cyan-400"
            />

            <h2 className="text-2xl font-bold mt-4">
              Voice Assistant
            </h2>

            <p className="text-zinc-400 mt-3">
              Future-ready voice interaction and smart automation.
            </p>

          </div>

        </div>

        {/* Footer */}

        <div className="text-center py-10 text-zinc-500">

          Developed by DE4TH

        </div>

      </div>

    </div>
  );
}