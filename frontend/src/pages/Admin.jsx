import { useState, useEffect } from "react";
import axios from "axios";
import { api } from "../api";
import {
  FaUsers,
  FaLayerGroup,
  FaSync,
  FaUserShield,
  FaTrash,
  FaBullhorn
} from "react-icons/fa";

export default function Admin() {

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  const [broadcastTitle, setBroadcastTitle] =
    useState("");

  const [broadcastMessage, setBroadcastMessage] =
    useState("");

  useEffect(() => {

    loadData();

  }, []);

  const loadData = async () => {

    try {

      setLoading(true);

      const usersResponse =
        await axios.get(
          api("/users")
        );

      const groupsResponse =
        await axios.get(
          api(`/groups/user/${user.id}`)
        );

      setUsers(
        usersResponse.data.users || []
      );

      setGroups(
        groupsResponse.data.groups || []
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  const deleteUser = async (id) => {

    const ok = window.confirm(
      "Delete User?"
    );

    if (!ok) return;

    try {

      await axios.post(
        api("/admin/delete-user"),
        {
          user_id: id
        }
      );

      loadData();

    } catch (error) {

      console.log(error);

    }

  };

  const deleteGroup = async (id) => {

    const ok = window.confirm(
      "Delete Group?"
    );

    if (!ok) return;

    try {

      await axios.post(
        api("/admin/delete-group"),
        {
          group_id: id
        }
      );

      loadData();

    } catch (error) {

      console.log(error);

    }

  };

  const broadcastNotification =
    async () => {

      if (
        !broadcastTitle ||
        !broadcastMessage
      ) {
        alert(
          "Enter Title & Message"
        );
        return;
      }

      try {

        await axios.post(
          api("/admin/broadcast"),
          {
            title:
              broadcastTitle,
            message:
              broadcastMessage
          }
        );

        alert(
          "Broadcast Sent"
        );

        setBroadcastTitle("");
        setBroadcastMessage("");

      } catch (error) {

        console.log(error);

      }

    };

  return (

    <div className="min-h-screen bg-black text-white">

      {/* HEADER */}

      <div className="p-8 border-b border-cyan-500/20">

        <div className="flex justify-between items-center">

          <div className="flex items-center gap-4">

            <FaUserShield
              size={50}
              className="text-cyan-400"
            />

            <div>

              <h1 className="text-4xl font-bold">
                Super Admin
              </h1>

              <p className="text-zinc-400">
                Echo Control Center
              </p>

            </div>

          </div>

          <button
            onClick={loadData}
            className="bg-cyan-500 text-black px-5 py-3 rounded-xl flex items-center gap-2 font-bold"
          >
            <FaSync />
            Refresh
          </button>

        </div>

      </div>

      <div className="p-8">

        {/* STATS */}

        <div className="grid md:grid-cols-2 gap-6 mb-8">

          <div className="bg-zinc-900 p-6 rounded-3xl">

            <div className="flex items-center gap-3">

              <FaUsers
                size={35}
                className="text-cyan-400"
              />

              <div>

                <p className="text-zinc-400">
                  Total Users
                </p>

                <h2 className="text-4xl font-bold">
                  {users.length}
                </h2>

              </div>

            </div>

          </div>

          <div className="bg-zinc-900 p-6 rounded-3xl">

            <div className="flex items-center gap-3">

              <FaLayerGroup
                size={35}
                className="text-cyan-400"
              />

              <div>

                <p className="text-zinc-400">
                  Total Groups
                </p>

                <h2 className="text-4xl font-bold">
                  {groups.length}
                </h2>

              </div>

            </div>

          </div>

        </div>

        {/* BROADCAST */}

        <div className="bg-zinc-900 p-6 rounded-3xl mb-8">

          <h2 className="text-2xl font-bold mb-4">
            Broadcast
          </h2>

          <input
            value={broadcastTitle}
            onChange={(e) =>
              setBroadcastTitle(
                e.target.value
              )
            }
            placeholder="Title"
            className="w-full bg-zinc-800 p-4 rounded-xl mb-3"
          />

          <textarea
            value={broadcastMessage}
            onChange={(e) =>
              setBroadcastMessage(
                e.target.value
              )
            }
            placeholder="Message"
            className="w-full bg-zinc-800 p-4 rounded-xl mb-3"
          />

          <button
            onClick={
              broadcastNotification
            }
            className="bg-purple-600 px-5 py-3 rounded-xl flex items-center gap-2"
          >
            <FaBullhorn />
            Broadcast
          </button>

        </div>

        {/* USERS */}

        <div className="bg-zinc-900 p-6 rounded-3xl mb-8">

          <h2 className="text-2xl font-bold mb-4">
            Users
          </h2>

          {users.map((item) => (

            <div
              key={item.id}
              className="bg-zinc-800 p-4 rounded-xl mb-3 flex justify-between items-center"
            >

              <div>

                <h3 className="font-bold">
                  {item.display_name}
                </h3>

                <p className="text-zinc-400">
                  @{item.username}
                </p>

              </div>

              <button
                onClick={() =>
                  deleteUser(
                    item.id
                  )
                }
                className="bg-red-600 px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <FaTrash />
                Delete
              </button>

            </div>

          ))}

        </div>

        {/* GROUPS */}

        <div className="bg-zinc-900 p-6 rounded-3xl">

          <h2 className="text-2xl font-bold mb-4">
            Groups
          </h2>

          {groups.map((group) => (

            <div
              key={group.id}
              className="bg-zinc-800 p-4 rounded-xl mb-3 flex justify-between items-center"
            >

              <div>

                <h3 className="font-bold">
                  {group.name}
                </h3>

                <p className="text-zinc-400">
                  Group ID: {group.id}
                </p>

              </div>

              <button
                onClick={() =>
                  deleteGroup(
                    group.id
                  )
                }
                className="bg-red-600 px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <FaTrash />
                Delete
              </button>

            </div>

          ))}

        </div>

        {loading && (

          <div className="text-center mt-6 text-cyan-400">

            Loading...

          </div>

        )}

      </div>

    </div>

  );

}
