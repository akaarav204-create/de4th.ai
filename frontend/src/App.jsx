import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Signup from "./pages/Signup";
import ForgotPin from "./pages/ForgotPin";
import About from "./pages/About";
import Credits from "./pages/Credits";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Settings from "./pages/Settings";
import Devices from "./pages/Devices";
import Memory from "./pages/Memory";
import Profile from "./pages/Profile";
import Reminders from "./pages/Reminders";
import Notifications from "./pages/Notifications";
import Friends from "./pages/Friends";
import PrivateChat from "./pages/PrivateChat";
import Groups from "./pages/Groups";
import GroupChat from "./pages/GroupChat";
import Admin from "./pages/Admin";
import VoiceAssistant from "../voice/VoiceAssistant";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-pin" element={<ForgotPin />} />
        <Route path="/about" element={<About />} />
        <Route path="/credits" element={<Credits />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/devices" element={<Devices />} />
        <Route path="/memory" element={<Memory />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/private-chat/:friendId" element={<PrivateChat />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/group-chat/:groupId" element={<GroupChat />} />
        <Route path="/reminders" element={<Reminders />} />
      </Routes>
      <VoiceAssistant />
    </BrowserRouter>
  );
}

export default App;