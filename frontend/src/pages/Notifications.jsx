import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaBell } from "react-icons/fa";
import { api, ws } from "../api";
import { getStoredUser } from "../utils/demoMode";

export default function Notifications() {

  const user = getStoredUser();

  const [notifications, setNotifications] =
    useState([]);

  const wsRef = useRef(null);

  useEffect(() => {

    loadNotifications();

    if (!user?.id) {
      return;
    }

    const socket = new WebSocket(ws(`/ws/${user.id}`));
    wsRef.current = socket;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "notification") {
        setNotifications((prev) => [data.payload, ...prev]);
      }
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };

  }, [user.id]);

  const loadNotifications = async () => {

    try {

      const response = await axios.get(
        api(`/notifications/${user.id}`)
      );

      setNotifications(
        response.data.notifications
      );

    } catch (error) {

      console.log(error);

    }

  };

  const markRead = async (id) => {

    await axios.post(
      api(`/notifications/read/${id}`)
    );

    loadNotifications();

  };

  return (

    <div className="min-h-screen bg-black text-white p-8">

      <div className="flex items-center gap-4 mb-8">

        <FaBell
          size={40}
          className="text-cyan-400"
        />

        <h1 className="text-4xl font-bold">
          Notifications
        </h1>

      </div>

      <div className="space-y-4">

        {notifications.map((item) => (

          <div
            key={item.id}
            className="bg-zinc-900 p-5 rounded-2xl border border-cyan-500/20"
          >

            <h3 className="font-bold text-cyan-400">
              {item.title}
            </h3>

            <p className="mt-2">
              {item.message}
            </p>

            <button
              onClick={() =>
                markRead(item.id)
              }
              className="mt-4 bg-cyan-500 text-black px-4 py-2 rounded-lg"
            >
              Mark Read
            </button>

          </div>

        ))}

      </div>

    </div>

  );

}