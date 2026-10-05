import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaKey,
  FaShieldAlt
} from "react-icons/fa";

export default function ForgotPin() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");

  const handleReset = () => {

    if (!username.trim()) {
      alert("Enter Username");
      return;
    }

    alert(
      "PIN recovery module will be connected soon."
    );
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">

      <div className="w-full max-w-md bg-zinc-900 border border-cyan-500/20 rounded-3xl p-8">

        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 text-cyan-400 mb-6"
        >
          <FaArrowLeft />
          Back to Login
        </button>

        <div className="text-center">

          <FaShieldAlt
            size={70}
            className="mx-auto text-cyan-400"
          />

          <h1 className="text-4xl font-bold mt-5">
            Forgot PIN
          </h1>

          <p className="text-zinc-400 mt-3">
            Recover your account access
          </p>

        </div>

        <div className="mt-8">

          <div className="relative">

            <FaKey className="absolute left-4 top-5 text-cyan-400" />

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              className="w-full bg-zinc-800 pl-12 p-4 rounded-xl outline-none border border-zinc-700 focus:border-cyan-400"
            />

          </div>

          <button
            onClick={handleReset}
            className="w-full mt-6 p-4 rounded-xl bg-cyan-500 text-black font-bold"
          >
            Recover PIN
          </button>

        </div>

      </div>

    </div>
  );
}