import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUser,
  FaFingerprint
} from "react-icons/fa";
import { api } from "../api";
import { getStoredUser } from "../utils/demoMode";

export default function Profile() {
  const user = getStoredUser();
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) {
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(api(`/users/${user.id}`));
        setProfile(response.data.user || user);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user.id]);

  return (

    <div className="min-h-screen bg-black text-white">

      <div className="p-8 border-b border-cyan-500/20">

        <h1 className="text-4xl font-bold">
          Profile
        </h1>

      </div>

      <div className="p-8">

        <div className="bg-zinc-900 rounded-3xl p-8 border border-cyan-500/20">

          <div className="flex justify-center">

            <div className="w-32 h-32 rounded-full bg-cyan-500/20 flex items-center justify-center">

              <FaUser
                size={50}
                className="text-cyan-400"
              />

            </div>

          </div>

          <div className="mt-8 space-y-5">

            <div>

              <label className="text-zinc-400">
                Username
              </label>

              <input
                value={profile?.username || ""}
                readOnly
                className="w-full bg-zinc-800 p-4 rounded-xl mt-2"
              />

            </div>

            <div>

              <label className="text-zinc-400">
                Email
              </label>

              <input
                value={profile?.display_name || profile?.username || ""}
                readOnly
                className="w-full bg-zinc-800 p-4 rounded-xl mt-2"
              />

            </div>

            <div className="flex items-center gap-3">

              <FaFingerprint
                className="text-cyan-400"
              />

              {loading ? "Loading profile..." : "Fingerprint Enabled"}

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}