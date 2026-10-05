import {
  FaMobileAlt,
  FaLaptop,
  FaTabletAlt,
  FaWifi,
  FaBatteryFull
} from "react-icons/fa";

export default function Devices() {

  const devices = [
    {
      name: "DE4TH-PC",
      type: "Windows",
      icon: <FaLaptop size={30} />,
      status: "Online",
      battery: "Charging"
    },
    {
      name: "DE4TH-PHONE",
      type: "Android",
      icon: <FaMobileAlt size={30} />,
      status: "Online",
      battery: "82%"
    },
    {
      name: "DE4TH-TABLET",
      type: "Android Tablet",
      icon: <FaTabletAlt size={30} />,
      status: "Offline",
      battery: "64%"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">

      <div className="p-8 border-b border-cyan-500/20">

        <h1 className="text-4xl font-bold">
          Connected Devices
        </h1>

        <p className="text-zinc-400">
          Manage all Jarvis devices
        </p>

      </div>

      <div className="p-8 grid md:grid-cols-2 gap-6">

        {devices.map((device) => (

          <div
            key={device.name}
            className="bg-zinc-900 p-6 rounded-3xl border border-cyan-500/20"
          >

            <div className="flex justify-between">

              <div>
                {device.icon}
              </div>

              <div
                className={`px-3 py-1 rounded-full ${
                  device.status === "Online"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {device.status}
              </div>

            </div>

            <h2 className="text-2xl font-bold mt-4">
              {device.name}
            </h2>

            <p className="text-zinc-400">
              {device.type}
            </p>

            <div className="flex items-center gap-3 mt-4">

              <FaWifi />

              <span>
                Connected
              </span>

            </div>

            <div className="flex items-center gap-3 mt-2">

              <FaBatteryFull />

              <span>
                {device.battery}
              </span>

            </div>

            <button
              className="w-full mt-6 bg-cyan-500 text-black font-bold p-3 rounded-xl"
            >
              Manage Device
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}
