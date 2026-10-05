import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api } from "../api";

import {
  FaUser,
  FaLock,
  FaUserPlus,
  FaArrowLeft,
  FaFingerprint,
  FaRobot
} from "react-icons/fa";

export default function Signup() {

  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const [fingerprintSupported, setFingerprintSupported] =
    useState(false);

  useEffect(() => {

    if (
      window.PublicKeyCredential &&
      navigator.credentials
    ) {
      setFingerprintSupported(true);
    }

  }, []);

  const handleSignup = async () => {

    try {

      if (!displayName.trim()) {
        alert("Enter Full Name");
        return;
      }

      if (!username.trim()) {
        alert("Enter Username");
        return;
      }

      if (!pin.trim()) {
        alert("Enter PIN");
        return;
      }

      if (pin !== confirmPin) {
        alert("PINs do not match");
        return;
      }

      const response = await axios.post(
        api("/auth/register"),
        {
          username,
          display_name: displayName,
          pin
        }
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      alert("Account Created Successfully");

      navigate("/dashboard");

    } catch (error) {

      alert(
        error?.response?.data?.detail ||
        "Signup Failed"
      );

    }

  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">

      {/* Background Glow */}

      <div className="fixed inset-0">

        <div className="absolute top-20 left-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />

        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      </div>

      {/* Back Button */}

      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-cyan-400"
      >
        <FaArrowLeft />
        Back
      </button>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">

        <div className="w-full max-w-lg bg-zinc-900/80 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-8">

          <div className="text-center">

            <FaRobot
              size={90}
              className="mx-auto text-cyan-400"
            />

            <h1 className="text-5xl font-bold mt-5">
              Create Account
            </h1>

            <p className="text-zinc-400 mt-3">
              Join the Jarvis Ecosystem
            </p>

          </div>

          <div className="space-y-5 mt-10">

            {/* Full Name */}

            <div className="relative">

              <FaUser className="absolute left-4 top-5 text-cyan-400" />

              <input
                type="text"
                placeholder="Full Name"
                value={displayName}
                onChange={(e) =>
                  setDisplayName(e.target.value)
                }
                className="w-full bg-zinc-800 pl-12 p-4 rounded-xl border border-zinc-700 focus:border-cyan-400 outline-none"
              />

            </div>

            {/* Username */}

            <div className="relative">

              <FaUser className="absolute left-4 top-5 text-cyan-400" />

              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                className="w-full bg-zinc-800 pl-12 p-4 rounded-xl border border-zinc-700 focus:border-cyan-400 outline-none"
              />

            </div>

            {/* PIN */}

            <div className="relative">

              <FaLock className="absolute left-4 top-5 text-cyan-400" />

              <input
                type="password"
                placeholder="Create PIN"
                value={pin}
                onChange={(e) =>
                  setPin(e.target.value)
                }
                className="w-full bg-zinc-800 pl-12 p-4 rounded-xl border border-zinc-700 focus:border-cyan-400 outline-none"
              />

            </div>

            {/* Confirm PIN */}

            <div className="relative">

              <FaLock className="absolute left-4 top-5 text-cyan-400" />

              <input
                type="password"
                placeholder="Confirm PIN"
                value={confirmPin}
                onChange={(e) =>
                  setConfirmPin(e.target.value)
                }
                className="w-full bg-zinc-800 pl-12 p-4 rounded-xl border border-zinc-700 focus:border-cyan-400 outline-none"
              />

            </div>

            {/* Signup Button */}

            <button
              onClick={handleSignup}
              className="w-full p-4 rounded-xl bg-cyan-500 text-black font-bold flex items-center justify-center gap-3"
            >
              <FaUserPlus />
              Create Account
            </button>

            {/* Fingerprint */}

            {fingerprintSupported && (

              <button
                className="w-full p-4 rounded-xl border border-cyan-500 text-cyan-400 flex items-center justify-center gap-3"
              >
                <FaFingerprint />
                Fingerprint Signup
              </button>

            )}

          </div>

          <div className="text-center mt-8">

            <span className="text-zinc-500">
              Already have an account?
            </span>

            <button
              onClick={() => navigate("/login")}
              className="ml-2 text-cyan-400 font-bold"
            >
              Login
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
