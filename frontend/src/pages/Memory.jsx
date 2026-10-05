import { FaBrain, FaSearch } from "react-icons/fa";
import { useState } from "react";

export default function Memory() {

  const [search, setSearch] = useState("");

  const memories = [
    "Favourite Movie: Interstellar",
    "Favourite Language: Python",
    "CreatorHub Project",
    "Preferred Name: DE4TH"
  ];

  return (
    <div className="min-h-screen bg-black text-white">

      <div className="p-8 border-b border-cyan-500/20">

        <div className="flex items-center gap-4">

          <FaBrain
            size={40}
            className="text-cyan-400"
          />

          <div>

            <h1 className="text-4xl font-bold">
              Memory
            </h1>

            <p className="text-zinc-400">
              Long-Term AI Memory
            </p>

          </div>

        </div>

      </div>

      <div className="p-8">

        <div className="bg-zinc-900 p-4 rounded-2xl flex gap-3">

          <FaSearch className="text-cyan-400 mt-3" />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search memories..."
            className="bg-transparent flex-1 outline-none"
          />

        </div>

        <div className="mt-8 space-y-4">

          {memories.map((memory, index) => (

            <div
              key={index}
              className="bg-zinc-900 border border-cyan-500/20 p-5 rounded-2xl"
            >
              {memory}
            </div>

          ))}

        </div>

      </div>

    </div>
  );
}