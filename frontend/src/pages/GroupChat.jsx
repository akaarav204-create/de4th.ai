import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  FaPaperPlane,
  FaRobot,
  FaUserPlus,
  FaUsers
} from "react-icons/fa";
import { api, ws } from "../api";
import { getStoredUser } from "../utils/demoMode";

export default function GroupChat() {

  const { groupId } = useParams();

  const socketRef = useRef(null);

  const user = getStoredUser();

  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  const [members, setMembers] =
    useState([]);

  const [memberId, setMemberId] =
    useState("");

  // ======================
  // LOAD OLD MESSAGES
  // ======================

  const loadMessages = async () => {

    try {

      const response = await axios.get(
        api(`/groups/messages/${groupId}`)
      );

      setMessages(
        response.data.messages
      );

    } catch (error) {

      console.log(error);

    }

  };

  // ======================
  // LOAD MEMBERS
  // ======================

  const loadMembers = async () => {

    try {

      const response = await axios.get(
        api(`/groups/members/${groupId}`)
      );

      setMembers(
        response.data.members
      );

    } catch (error) {

      console.log(error);

    }

  };

  // ======================
  // SOCKET
  // ======================

  useEffect(() => {

    loadMessages();
    loadMembers();

    const socket = new WebSocket(
      ws(`/ws/group/${groupId}`)
    );

    socketRef.current = socket;

    socket.onopen = () => {

      console.log(
        "Group Socket Connected"
      );

    };

    socket.onmessage = (event) => {

      const data = JSON.parse(
        event.data
      );

      setMessages((prev) => [

        ...prev,

        {
          id: Date.now(),
          sender_id: data.sender_id,
          message: data.message
        }

      ]);

    };

    socket.onerror = (error) => {

      console.log(error);

    };

    return () => {

      socket.close();

    };

  }, [groupId]);

  // ======================
  // SEND MESSAGE
  // ======================

  const sendMessage = async () => {

    if (!message.trim()) {
      return;
    }

    try {

      if (
        message.startsWith("@echo")
      ) {

        const response =
          await axios.post(
            api("/groups/echo"),
            {
              group_id: Number(groupId),
              user_id: user.id,
              prompt: message.replace(
                "@echo",
                ""
              )
            }
          );

        setMessages((prev) => [

          ...prev,

          {
            id: Date.now(),
            sender_id: 0,
            message:
              response.data.reply
          }

        ]);

        setMessage("");

        return;
      }

      await axios.post(
        api("/groups/send"),
        {
          group_id: Number(groupId),
          sender_id: user.id,
          message
        }
      );

      setMessage("");

    } catch (error) {

      console.log(error);

    }

  };

  // ======================
  // ADD MEMBER
  // ======================

  const addMember = async () => {

    if (!memberId) {
      return;
    }

    try {

      await axios.post(
        api("/groups/add-member"),
        {
          group_id: Number(groupId),
          user_id: Number(memberId)
        }
      );

      setMemberId("");

      loadMembers();

      alert(
        "Member Added"
      );

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="min-h-screen bg-black text-white flex">

      {/* MEMBERS */}

      <div className="w-72 bg-zinc-900 border-r border-cyan-500/20 p-4">

        <div className="flex items-center gap-3 mb-6">

          <FaUsers
            className="text-cyan-400"
          />

          <h2 className="font-bold">
            Members
          </h2>

        </div>

        <div className="space-y-3">

          {members.map((member) => (

            <div
              key={member.id}
              className="bg-zinc-800 p-3 rounded-xl"
            >

              <p>
                User {member.user_id}
              </p>

              <p className="text-xs text-cyan-400">
                {member.role}
              </p>

            </div>

          ))}

        </div>

      </div>

      {/* CHAT */}

      <div className="flex-1 flex flex-col">

        {/* HEADER */}

        <div className="p-5 border-b border-cyan-500/20 flex justify-between">

          <div>

            <h1 className="text-3xl font-bold">
              Group Chat
            </h1>

            <p className="text-zinc-400">
              Group ID: {groupId}
            </p>

          </div>

          <button
            className="bg-cyan-500 text-black px-4 py-2 rounded-xl flex items-center gap-2"
          >
            <FaRobot />
            Echo
          </button>

        </div>

        {/* ADD MEMBER */}

        <div className="p-4 border-b border-cyan-500/20">

          <div className="flex gap-3">

            <input
              value={memberId}
              onChange={(e) =>
                setMemberId(
                  e.target.value
                )
              }
              placeholder="User ID"
              className="bg-zinc-800 p-3 rounded-xl flex-1"
            />

            <button
              onClick={addMember}
              className="bg-cyan-500 text-black px-4 rounded-xl flex items-center gap-2"
            >
              <FaUserPlus />
              Add
            </button>

          </div>

        </div>

        {/* MESSAGES */}

        <div className="flex-1 overflow-y-auto p-6">

          {messages.map((msg) => (

            msg.sender_id === 0 ? (

              <div
                key={msg.id}
                className="text-center mb-4"
              >

                <div className="inline-block bg-purple-600 px-5 py-3 rounded-2xl">

                  🤖 Echo

                  <br />

                  {msg.message}

                </div>

              </div>

            ) : (

              <div
                key={msg.id}
                className={
                  msg.sender_id === user.id
                    ? "text-right mb-4"
                    : "text-left mb-4"
                }
              >

                <div
                  className={
                    msg.sender_id === user.id
                      ? "inline-block bg-cyan-500 text-black px-4 py-3 rounded-2xl"
                      : "inline-block bg-zinc-800 px-4 py-3 rounded-2xl"
                  }
                >

                  <div className="text-xs opacity-70 mb-1">

                    User {msg.sender_id}

                  </div>

                  {msg.message}

                </div>

              </div>

            )

          ))}

        </div>

        {/* INPUT */}

        <div className="p-4 border-t border-cyan-500/20">

          <div className="flex gap-3">

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
              className="bg-cyan-500 text-black px-6 rounded-xl flex items-center gap-2 font-bold"
            >
              <FaPaperPlane />
              Send
            </button>

          </div>

        </div>

      </div>

    </div>

  );

}
