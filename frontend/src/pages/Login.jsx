import { useState } from "react";
import { FaEye, FaEyeSlash, FaFingerprint } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);

  const navigate = useNavigate();

const login = async () => {

  try {

    const response = await fetch(
      api("/auth/login"),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          pin,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.detail || "Login Failed");
      return;
    }

    localStorage.setItem(
      "token",
      data.token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    navigate("/dashboard");

  } catch (error) {

    console.error(error);

    alert(
      "Backend connection failed."
    );
  }
};



  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">

      <div className="w-full max-w-md bg-zinc-900/80 backdrop-blur-xl rounded-3xl p-8 border border-cyan-500/30 shadow-[0_0_40px_rgba(0,255,255,0.2)]">

        <div className="text-center mb-8">
          <div className="text-7xl text-cyan-400 font-bold">J</div>

          <h1 className="text-5xl font-bold tracking-widest">
            JARVIS
          </h1>

          <p className="text-cyan-400 mt-2">
            Your AI Assistant
          </p>
        </div>

        <div className="space-y-5">

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            className="w-full p-4 rounded-xl bg-zinc-800 border border-zinc-700 focus:border-cyan-400 outline-none"
          />

          <div className="relative">

            <input
              type={showPin ? "text" : "password"}
              placeholder="PIN"
              value={pin}
              onChange={(e) =>
                setPin(e.target.value)
              }
              className="w-full p-4 rounded-xl bg-zinc-800 border border-zinc-700 focus:border-cyan-400 outline-none"
            />

            <button
              type="button"
              onClick={() =>
                setShowPin(!showPin)
              }
              className="absolute right-4 top-4"
            >
              {showPin ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </button>

          </div>

          <button
            onClick={login}
            className="w-full p-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold"
          >
            LOGIN
          </button>
          <p className="text-center mt-4">

             Don't have an account?

           <button
            onClick={() => navigate("/signup")}
           className="text-cyan-400 ml-2"
           >
             Sign Up
            </button>

          </p>

          <button
            className="w-full p-4 rounded-xl border border-cyan-500 text-cyan-400 flex items-center justify-center gap-3 hover:bg-cyan-500/10"
          >
            <FaFingerprint size={22} />
            Fingerprint Login
          </button>

        </div>

        <div className="grid grid-cols-3 gap-3 mt-8 text-center text-sm">

          <div>
            🔒
            <p>Secure</p>
          </div>

          <div>
            ⚡
            <p>Fast</p>
          </div>

          <div>
            🧠
            <p>Smart</p>
          </div>

        </div>

      </div>

    </div>
  );
}