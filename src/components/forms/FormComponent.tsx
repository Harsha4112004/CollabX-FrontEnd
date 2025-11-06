import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import { useSocket } from "@/context/SocketContext";
import { SocketEvent } from "@/types/socket";
import { USER_STATUS } from "@/types/user";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  username?: string;
  email?: string;
  exp?: number;
}

const FormComponent: React.FC = () => {
  const { currentUser, setCurrentUser, status, setStatus } = useAppContext();
  const { socket } = useSocket();
  const navigate = useNavigate();

  const [joinRoomId, setJoinRoomId] = useState("");
  const [username, setUsername] = useState("");

  // ✅ Extract username from JWT
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in first.");
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const name = decoded.username || decoded.email?.split("@")[0] || "Guest";

      setUsername(name);
      setCurrentUser({
        ...currentUser,
        username: name,
      });
    } catch (err) {
      console.error("Invalid token:", err);
      toast.error("Session expired. Please log in again.");
      navigate("/login");
    }
  }, [setCurrentUser, navigate, currentUser]);

  // ✅ Create Room
  const handleCreateRoom = async () => {
    const newRoomId = uuidv4();
    const userData = {
      username,
      roomId: newRoomId,
    };

    setCurrentUser(userData);
    toast.success("Room created!");

    try {
      await navigator.clipboard.writeText(newRoomId);
      toast("Room ID copied to clipboard!", { icon: "📋" });
    } catch {
      toast("Could not copy room ID", { icon: "⚠️" });
    }

    startSession(userData);
  };

  // ✅ Join Room
  const handleJoinRoom = () => {
    if (!joinRoomId.trim()) {
      toast.error("Please enter a Room ID");
      return;
    }

    const userData = {
      username,
      roomId: joinRoomId.trim(),
    };

    setCurrentUser(userData);
    toast.success("Joining room...");
    startSession(userData);
  };

  const startSession = (userData: { username: string; roomId: string }) => {
    if (status === USER_STATUS.ATTEMPTING_JOIN) return;

    toast.loading("Connecting...");
    setStatus(USER_STATUS.ATTEMPTING_JOIN);
    socket.emit(SocketEvent.JOIN_REQUEST, userData);
  };

  useEffect(() => {
    if (status === USER_STATUS.JOINED) {
      navigate(`/editor/${currentUser.roomId}`, {
        state: { username: currentUser.username },
      });
    }
  }, [status, navigate, currentUser]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-black/70 backdrop-blur-lg p-10 rounded-2xl shadow-2xl max-w-md w-full border border-gray-800"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white">
            Welcome, {username}
          </h2>
          <p className="text-gray-400 mt-2">
            Start a new session or join an existing one
          </p>
        </div>

        {/* Join Room */}
        <div className="space-y-4 mb-8">
          <label
            htmlFor="roomId"
            className="block text-gray-300 font-medium text-sm"
          >
            Room ID
          </label>
          <input
            type="text"
            id="roomId"
            placeholder="Enter Room ID to Join"
            value={joinRoomId}
            onChange={(e) => setJoinRoomId(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleJoinRoom}
            disabled={status === USER_STATUS.ATTEMPTING_JOIN}
            className={`w-full px-6 py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-200 transform ${
              status === USER_STATUS.ATTEMPTING_JOIN
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-xl hover:scale-[1.03] active:scale-[0.97]"
            }`}
          >
            {status === USER_STATUS.ATTEMPTING_JOIN
              ? "Joining..."
              : "Join Room"}
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-700" />
          <span className="px-3 text-gray-400 text-sm">OR</span>
          <div className="flex-grow h-px bg-gray-700" />
        </div>

        {/* Create Room */}
        <button
          onClick={handleCreateRoom}
          disabled={status === USER_STATUS.ATTEMPTING_JOIN}
          className={`w-full px-6 py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-200 transform ${
            status === USER_STATUS.ATTEMPTING_JOIN
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-xl hover:scale-[1.03] active:scale-[0.97]"
          }`}
        >
          {status === USER_STATUS.ATTEMPTING_JOIN
            ? "Creating..."
            : "Create Room"}
        </button>

        {/* Info */}
        <p className="text-gray-400 text-xs mt-6 text-center">
          Logged in as{" "}
          <span className="text-indigo-400 font-semibold">{username}</span>.
        </p>
      </motion.div>
    </div>
  );
};

export default FormComponent;
