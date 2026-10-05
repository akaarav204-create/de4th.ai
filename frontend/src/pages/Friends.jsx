import { useState, useEffect } from "react";
import axios from "axios";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import {
  FaUserFriends,
  FaRobot,
  FaCircle
} from "react-icons/fa";
import { getStoredUser } from "../utils/demoMode";

export default function Friends() {

  const navigate = useNavigate();

  const user = getStoredUser();

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);

  useEffect(() => {

    loadRequests();
    loadFriends();

  }, []);

  const loadRequests = async () => {

    try {

      const response = await axios.get(
        api(`/friends/requests/${user.id}`)
      );

      setRequests(
        response.data.requests
      );

    } catch (error) {

      console.log(error);

    }

  };
  const loadStatus = async (id) => {

  const response = await axios.get(
    api(`/presence/${id}`)
  );

  return response.data;

 };
  const loadFriends = async () => {

    try {

      const response = await axios.get(
        api(`/friends/list/${user.id}`)
      );

      setFriends(
        response.data.friends
      );

    } catch (error) {

      console.log(error);

    }

  };

  const acceptRequest = async (id) => {

    await axios.post(
      api("/friends/accept"),
      {
        request_id: id
      }
    );

    loadRequests();
    loadFriends();

  };

  const searchUsers = async () => {

    try {

      const response = await axios.get(
        api(`/users/search/${search}`)
      );

      setResults(
        response.data.users
      );

    } catch (error) {

      console.log(error);

    }

  };

  const sendRequest = async (receiverId) => {

    try {

      await axios.post(
        api("/friends/request"),
        {
          sender_id: user.id,
          receiver_id: receiverId
        }
      );

      alert("Friend Request Sent");

    } catch (error) {

      console.log(error);

    }

  };

  return (
    <div className="min-h-screen bg-black text-white p-8">

      <h1 className="text-4xl font-bold mb-8">
        Friends
      </h1>

      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-4">
          Friend Requests
        </h2>

        {requests.map((item) => (

          <div
            key={item.id}
            className="bg-zinc-900 p-4 rounded-xl mb-3"
          >

            <p>
              User ID {item.sender_id}
            </p>

            <button
              onClick={() =>
                acceptRequest(item.id)
              }
              className="bg-green-500 text-black px-4 py-2 rounded-lg mt-2"
            >
              Accept
            </button>

          </div>

        ))}

      </div>

      <div className="bg-zinc-900 p-6 rounded-3xl mb-8">

        <div className="flex gap-4">

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search Username"
            className="flex-1 bg-zinc-800 p-4 rounded-xl"
          />

          <button
            onClick={searchUsers}
            className="bg-cyan-500 text-black px-6 rounded-xl"
          >
            Search
          </button>

        </div>

        <div className="mt-4 space-y-3">

          {results.map((item) => (

            <div
              key={item.id}
              className="bg-zinc-800 p-4 rounded-xl flex justify-between"
            >

              <div>

                <h3>
                  {item.display_name}
                </h3>

                <p>
                  @{item.username}
                </p>

              </div>

              <button
                onClick={() =>
                  sendRequest(item.id)
                }
                className="bg-cyan-500 text-black px-4 rounded-lg"
              >
                Add Friend
              </button>

            </div>

          ))}

        </div>

      </div>

      <div className="bg-zinc-900 p-6 rounded-3xl mb-8">

        <div className="flex items-center gap-3">

          <FaRobot
            className="text-cyan-400"
          />

          <span>
            Invite Jarvis to Group Chats
          </span>

        </div>

      </div>

      <div className="space-y-4">

        {friends.map((friend) => (

          <div
            key={friend.id}
            className="bg-zinc-900 p-5 rounded-2xl flex justify-between items-center"
          >

            <div>

              <h3>
                Friend #{friend.id}
              </h3>

              <div className="flex items-center gap-2">

                <FaCircle
                  className="text-green-400"
                  size={10}
                />

                <span>
                  Connected
                </span>

              </div>

            </div>

            <button
              onClick={() =>
                navigate(
                  `/private-chat/${friend.id}`
                )
              }
              className="border border-cyan-500 px-5 py-2 rounded-xl"
            >
              Chat
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}
