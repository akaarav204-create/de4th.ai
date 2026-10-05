import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { api, ws } from "../api";

export default function PrivateChat() {

  const { friendId } = useParams();

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const wsRef = useRef(null);

  const loadMessages = async () => {

    try {

      const response = await axios.get(
        api(`/messages/chat/${currentUser.id}/${friendId}`)
      );

      setMessages(
        response.data.messages
      );

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {
    loadMessages();

    const socket = new WebSocket(
      ws(`/ws/${currentUser.id}`)
    );

    wsRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket Connected");
      axios.post(
        api("/presence/online"),
        {
          user_id: currentUser.id,
        }
      );
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "message") {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            sender_id: data.sender_id,
            receiver_id: currentUser.id,
            message: data.message,
          },
        ]);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket Closed");
      axios.post(
        api("/presence/offline"),
        {
          user_id: currentUser.id,
        }
      );
    };

    return () => {
      socket.close();
    };
  }, [friendId]);

  const sendMessage = async () => {

    if (!message.trim()) {
      return;
    }

    try {

      await axios.post(
        api("/messages/send"),
        {
          sender_id:
            currentUser.id,
          receiver_id:
            Number(friendId),
          message
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender_id:
            currentUser.id,
          receiver_id:
            Number(friendId),
          message
        }
      ]);

      setMessage("");

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="min-h-screen bg-black text-white flex flex-col">

      <div className="border-b border-cyan-500/20 p-5">

        <h1 className="text-2xl font-bold">
          Private Chat
        </h1>

        <p className="text-zinc-400">
          Friend ID: {friendId}
        </p>

      </div>

      <div className="flex-1 p-5 overflow-y-auto">

        {messages.map((msg) => (

          <div
            key={msg.id}
            className={
              msg.sender_id === currentUser.id
                ? "text-right mb-3"
                : "text-left mb-3"
            }
          >

            <div
              className={
                msg.sender_id === currentUser.id
                  ? "inline-block bg-cyan-500 text-black px-4 py-2 rounded-2xl"
                  : "inline-block bg-zinc-800 px-4 py-2 rounded-2xl"
              }
            >
              {msg.message}
            </div>

          </div>

        ))}

      </div>

      <div className="p-4 border-t border-cyan-500/20 flex gap-3">

        <input
          value={message}
          onChange={(e) =>
            setMessage(
              e.target.value
            )
          }
          placeholder="Type message..."
          className="flex-1 bg-zinc-800 p-4 rounded-xl outline-none"
        />

        <button
          onClick={sendMessage}
          className="bg-cyan-500 text-black px-6 rounded-xl font-bold"
        >
          Send
        </button>

      </div>

    </div>

  );

}