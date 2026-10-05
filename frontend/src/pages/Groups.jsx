import { useState, useEffect } from "react";
import axios from "axios";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaPlus,
  FaRobot
} from "react-icons/fa";
import { getStoredUser } from "../utils/demoMode";

export default function Groups() {

  const navigate = useNavigate();

  const user = getStoredUser();

  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] =
    useState("");

  useEffect(() => {

    loadGroups();

  }, []);

  const loadGroups = async () => {

    try {

      const response = await axios.get(
        api(`/groups/user/${user.id}`)
      );

      setGroups(
        response.data.groups
      );

    } catch (error) {

      console.log(error);

    }

  };

  const createGroup = async () => {

    if (!groupName.trim()) {
      return;
    }

    try {

      await axios.post(
        api("/groups/create"),
        {
          name: groupName,
          created_by: user.id
        }
      );

      setGroupName("");

      loadGroups();

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="min-h-screen bg-black text-white">

      <div className="p-8 border-b border-cyan-500/20">

        <div className="flex items-center gap-4">

          <FaUsers
            size={50}
            className="text-cyan-400"
          />

          <div>

            <h1 className="text-4xl font-bold">
              Groups
            </h1>

            <p className="text-zinc-400">
              Echo Communities
            </p>

          </div>

        </div>

      </div>

      <div className="p-8">

        <div className="bg-zinc-900 p-6 rounded-3xl border border-cyan-500/20 mb-8">

          <h2 className="text-2xl font-bold mb-4">
            Create Group
          </h2>

          <div className="flex gap-4">

            <input
              value={groupName}
              onChange={(e) =>
                setGroupName(
                  e.target.value
                )
              }
              placeholder="Group Name"
              className="flex-1 bg-zinc-800 p-4 rounded-xl outline-none"
            />

            <button
              onClick={createGroup}
              className="bg-cyan-500 text-black px-6 rounded-xl font-bold flex items-center gap-2"
            >
              <FaPlus />
              Create
            </button>

          </div>

        </div>

        <div className="space-y-4">

          {groups.map((group) => (

            <div
              key={group.id}
              className="bg-zinc-900 p-5 rounded-2xl border border-cyan-500/20"
            >

              <div className="flex justify-between items-center">

                <div>

                  <h3 className="text-xl font-bold">
                    {group.name}
                  </h3>

                  <p className="text-zinc-400">
                    Group ID: {group.id}
                  </p>

                </div>

                <div className="flex gap-3">

                  <button
                    onClick={() =>
                      navigate(
                        `/group-chat/${group.id}`
                      )
                    }
                    className="border border-cyan-500 px-5 py-2 rounded-xl"
                  >
                    Open
                  </button>

                  <button
                    className="bg-cyan-500 text-black px-5 py-2 rounded-xl flex items-center gap-2"
                  >
                    <FaRobot />
                    Echo
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}