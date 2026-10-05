import { Link } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import { FaUserShield } from "react-icons/fa";
import {
  FaRobot,
  FaBrain,
  FaBell,
  FaMobileAlt,
  FaCog,
  FaUser,
  FaComments,
  FaMicrophone,
  FaInfoCircle,
  FaAward,
  FaUserFriends,
} from "react-icons/fa";
import { getDisplayName } from "../utils/demoMode";

export default function Dashboard() {
  const displayName = getDisplayName();

  const cards = [
    {
      title: "Chat",
      icon: <FaComments size={28} />,
      path: "/chat"
    },
    {
      title: "Memory",
      icon: <FaBrain size={28} />,
      path: "/memory"
    },
    {
      title: "Notifications",
      icon: <FaBell size={28} />,
      path: "/notifications"
    },
    {
      title: "Admin",
      icon: <FaUserShield size={28} />,
      path: "/admin"
    },
    {
      title: "Reminders",
      icon: <FaBell size={28} />,
      path: "/reminders"
    },
    {
      title: "Devices",
      icon: <FaMobileAlt size={28} />,
      path: "/devices"
    },
    {
      title: "Profile",
      icon: <FaUser size={28} />,
      path: "/profile"
    },
    {
      title: "Settings",
      icon: <FaCog size={28} />,
      path: "/settings"
    },
    {
     title: "Groups",
      icon: <FaUsers size={28} />,
      path: "/groups"
    },
    {
      title: "Friends",
      icon: <FaUserFriends size={28} />,
      path: "/friends"
    },
    {
      title: "About",
      icon: <FaInfoCircle size={28} />,
      path: "/about"
    },
    {
      title: "Credits",
      icon: <FaAward size={28} />,
      path: "/credits"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Header */}

      <div className="p-6 border-b border-cyan-500/20">

        <div className="flex items-center gap-4">

          <div className="text-cyan-400">
            <FaRobot size={50} />
          </div>

          <div>

            <h1 className="text-4xl font-bold">
              JARVIS
            </h1>

            <p className="text-cyan-400">
              Personal AI Operating System
            </p>

          </div>

        </div>

      </div>

      <div className="p-8">

        {/* Welcome Card */}

        <div className="bg-zinc-900 rounded-3xl p-6 border border-cyan-500/20 mb-8">

          <h2 className="text-3xl font-bold">
            Welcome Back {displayName}
          </h2>

          <p className="text-zinc-400 mt-2">
            All Systems Online
          </p>

          <div className="flex gap-4 mt-6">

            <button className="bg-cyan-500 text-black px-6 py-3 rounded-xl font-bold">

              <FaMicrophone className="inline mr-2" />

              Voice Mode

            </button>

            <Link
              to="/chat"
              className="border border-cyan-500 px-6 py-3 rounded-xl hover:bg-cyan-500/10"
            >
              Open Chat
            </Link>

          </div>

        </div>

        {/* Stats */}

        <div className="grid md:grid-cols-3 gap-4 mb-8">

          <div className="bg-zinc-900 p-5 rounded-2xl border border-cyan-500/20">

            <p className="text-zinc-400">
              Memory
            </p>

            <h3 className="text-3xl font-bold text-cyan-400">
              Active
            </h3>

          </div>

          <div className="bg-zinc-900 p-5 rounded-2xl border border-cyan-500/20">

            <p className="text-zinc-400">
              Tasks
            </p>

            <h3 className="text-3xl font-bold text-cyan-400">
              Ready
            </h3>

          </div>

          <div className="bg-zinc-900 p-5 rounded-2xl border border-cyan-500/20">

            <p className="text-zinc-400">
              Status
            </p>

            <h3 className="text-3xl font-bold text-green-400">
              Online
            </h3>

          </div>

        </div>

        {/* Navigation Cards */}

        <div className="grid md:grid-cols-3 gap-6">

          {cards.map((card) => (

            <Link
              key={card.title}
              to={card.path}
              className="bg-zinc-900 p-6 rounded-3xl border border-cyan-500/20 hover:border-cyan-400 hover:scale-105 transition-all"
            >

              <div className="text-cyan-400 mb-4">
                {card.icon}
              </div>

              <h3 className="text-xl font-bold">
                {card.title}
              </h3>

            </Link>

          ))}

        </div>

      </div>

    </div>
  );
}

