import {
  FaLightbulb,
  FaCode,
  FaBrain,
  FaPaintBrush
} from "react-icons/fa";

export default function Credits() {

  const team = [
    {
      icon: <FaLightbulb />,
      role: "Original Idea & Vision",
      name: "Unseen Soul"
    },
    {
      icon: <FaCode />,
      role: "Founder & Lead Developer",
      name: "DE4TH"
    },
    {
      icon: <FaBrain />,
      role: "AI Architecture",
      name: "DE4TH"
    },
    {
      icon: <FaPaintBrush />,
      role: "UI / UX Design",
      name: "DE4TH"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">

      <div className="p-8 border-b border-cyan-500/20">

        <h1 className="text-5xl font-bold">
          Credits
        </h1>

        <p className="text-zinc-400 mt-3">
          The people behind Jarvis
        </p>

      </div>

      <div className="p-8 space-y-6">

        {team.map((member, index) => (

          <div
            key={index}
            className="bg-zinc-900 border border-cyan-500/20 rounded-3xl p-8 flex items-center gap-6"
          >

            <div className="text-cyan-400 text-3xl">
              {member.icon}
            </div>

            <div>

              <h2 className="text-2xl font-bold">
                {member.role}
              </h2>

              <p className="text-cyan-400 mt-2">
                {member.name}
              </p>

            </div>

          </div>

        ))}

        <div className="bg-zinc-900 border border-cyan-500/20 rounded-3xl p-8 text-center">

          <h2 className="text-3xl font-bold text-cyan-400">
            Jarvis AI
          </h2>

          <p className="text-zinc-400 mt-4">
            Built to become more than an assistant.
            Built to become a companion.
          </p>

        </div>

      </div>

    </div>
  );
}