import {
  FaRobot,
  FaBrain,
  FaMicrochip,
  FaShieldAlt,
  FaCode
} from "react-icons/fa";

export default function About() {

  return (
    <div className="min-h-screen bg-black text-white">

      <div className="p-8 border-b border-cyan-500/20">

        <h1 className="text-5xl font-bold">
          About Jarvis
        </h1>

        <p className="text-zinc-400 mt-3">
          Next Generation Personal AI Ecosystem
        </p>

      </div>

      <div className="p-8 space-y-8">

        <div className="bg-zinc-900 border border-cyan-500/20 rounded-3xl p-8">

          <FaRobot
            size={70}
            className="text-cyan-400 mb-5"
          />

          <h2 className="text-3xl font-bold">
            What is Jarvis?
          </h2>

          <p className="mt-5 text-zinc-300 leading-8">
            Jarvis is an intelligent AI ecosystem designed
            to become a true digital companion.
            It combines conversation, memory, productivity,
            social interaction and automation into one system.
          </p>

        </div>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-zinc-900 p-8 rounded-3xl border border-cyan-500/20">

            <FaBrain
              size={45}
              className="text-cyan-400"
            />

            <h3 className="text-2xl font-bold mt-4">
              AI Memory
            </h3>

            <p className="text-zinc-400 mt-3">
              Learns user preferences and remembers
              important conversations.
            </p>

          </div>

          <div className="bg-zinc-900 p-8 rounded-3xl border border-cyan-500/20">

            <FaShieldAlt
              size={45}
              className="text-cyan-400"
            />

            <h3 className="text-2xl font-bold mt-4">
              Privacy First
            </h3>

            <p className="text-zinc-400 mt-3">
              Designed with personal control,
              security and user ownership in mind.
            </p>

          </div>

          <div className="bg-zinc-900 p-8 rounded-3xl border border-cyan-500/20">

            <FaMicrochip
              size={45}
              className="text-cyan-400"
            />

            <h3 className="text-2xl font-bold mt-4">
              Smart Automation
            </h3>

            <p className="text-zinc-400 mt-3">
              Tasks, reminders, notifications
              and intelligent workflows.
            </p>

          </div>

          <div className="bg-zinc-900 p-8 rounded-3xl border border-cyan-500/20">

            <FaCode
              size={45}
              className="text-cyan-400"
            />

            <h3 className="text-2xl font-bold mt-4">
              Modern Stack
            </h3>

            <p className="text-zinc-400 mt-3">
              React, FastAPI, AI Models,
              Voice Systems and Smart Memory.
            </p>

          </div>

        </div>

        <div className="bg-zinc-900 border border-cyan-500/20 rounded-3xl p-8">

          <h2 className="text-2xl font-bold">
            Vision
          </h2>

          <p className="text-zinc-400 mt-4 leading-8">
            Build an AI companion that can assist,
            remember, collaborate, communicate,
            manage tasks and evolve with its users.
          </p>

        </div>

      </div>

    </div>
  );
}