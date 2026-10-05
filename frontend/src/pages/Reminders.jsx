import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaBell,
  FaPlus
} from "react-icons/fa";
import { api } from "../api";
import { getStoredUser } from "../utils/demoMode";

export default function Reminders() {
  const user = getStoredUser();
  const [reminders, setReminders] = useState([]);
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const loadReminders = async () => {
      try {
        const response = await axios.get(api(`/tasks/${user.id}`));
        setReminders(response.data.tasks || []);
      } catch (error) {
        console.error(error);
      }
    };

    loadReminders();
  }, [user.id]);

  const addReminder = async () => {
    if (!title.trim() || !user?.id) {
      return;
    }

    setSaving(true);
    try {
      await axios.post(api("/tasks"), {
        created_by: user.id,
        assigned_to: user.id,
        title: title.trim()
      });
      setTitle("");
      const response = await axios.get(api(`/tasks/${user.id}`));
      setReminders(response.data.tasks || []);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">

      <div className="p-8 border-b border-cyan-500/20 flex justify-between items-center">

        <div>

          <h1 className="text-4xl font-bold">
            Reminders
          </h1>

          <p className="text-zinc-400">
            Jarvis Reminder Center
          </p>

        </div>

        <div className="flex items-center gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New reminder"
            className="bg-zinc-800 px-4 py-3 rounded-xl outline-none"
          />
          <button
            onClick={addReminder}
            disabled={saving}
            className="bg-cyan-500 text-black p-4 rounded-xl disabled:opacity-70"
          >
            <FaPlus />
          </button>
        </div>

      </div>

      <div className="p-8 space-y-5">

        {reminders.length === 0 ? (
          <div className="bg-zinc-900 border border-cyan-500/20 rounded-2xl p-5 text-zinc-400">
            No reminders yet. Add one above to get started.
          </div>
        ) : reminders.map((item, index) => (

          <div
            key={index}
            className="bg-zinc-900 border border-cyan-500/20 rounded-2xl p-5 flex justify-between"
          >

            <div className="flex gap-4 items-center">

              <FaBell className="text-cyan-400" />

              <div>

                <h2 className="font-bold">
                  {item.title}
                </h2>

                <p className="text-zinc-400">
                  {item.status || "pending"}
                </p>

              </div>

            </div>

            <button
              className="text-red-400"
            >
              Pending
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}