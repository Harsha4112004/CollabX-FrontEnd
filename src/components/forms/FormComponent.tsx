import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Plus, LogIn, CheckCircle2, AlertCircle } from "lucide-react";
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
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Extract username from JWT - FIXED: Removed currentUser from dependencies
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
      // Only set if username is different to prevent unnecessary updates
      setCurrentUser({
        ...currentUser,
        username: name,
      });
    } catch (err) {
      console.error("Invalid token:", err);
      toast.error("Session expired. Please log in again.");
      navigate("/login");
    }
  }, [setCurrentUser, navigate]); // Removed currentUser from dependencies

  // ✅ Create Room
  const handleCreateRoom = async () => {
    const newRoomId = uuidv4();
    const userData = {
      username,
      roomId: newRoomId,
    };
    
    setCurrentUser(userData);
    setError(null);
    toast.success("Room created successfully!");

    try {
      await navigator.clipboard.writeText(newRoomId);
      setCopied(true);
      toast("Room ID copied to clipboard!", { 
        icon: "📋",
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #374151'
        }
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast("Could not copy room ID", { 
        icon: "⚠️",
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #374151'
        }
      });
    }

    startSession(userData);
  };

  // ✅ Join Room
  const handleJoinRoom = () => {
    if (!joinRoomId.trim()) {
      setError("Please enter a Room ID");
      return;
    }

    const userData = {
      username,
      roomId: joinRoomId.trim(),
    };

    setCurrentUser(userData);
    setError(null);
    toast.success("Joining room...");

    startSession(userData);
  };

  const startSession = (userData: { username: string; roomId: string }) => {
    if (status === USER_STATUS.ATTEMPTING_JOIN) return;

    toast.loading("Connecting to room...", {
      style: {
        background: '#1f2937',
        color: '#fff',
        border: '1px solid #374151'
      }
    });
    setStatus(USER_STATUS.ATTEMPTING_JOIN);
    socket.emit(SocketEvent.JOIN_REQUEST, userData);
  };

  // ✅ Fixed: Added proper dependencies and condition
  useEffect(() => {
    if (status === USER_STATUS.JOINED && currentUser.roomId) {
      sessionStorage.removeItem("homepageRefreshed");

      navigate(`/editor/${currentUser.roomId}`, {
        state: { username: currentUser.username },
      });
    }
  }, [status, navigate, currentUser.roomId, currentUser.username]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="bg-gray-900/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-800/50"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-16 h-16 mx-auto bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-4"
        >
          <Users className="w-8 h-8 text-white" />
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-extrabold text-white mb-2"
        >
          Welcome, {username}!
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-400 text-lg"
        >
          Start collaborating in real-time
        </motion.p>
      </div>

      {/* Notifications */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30 backdrop-blur-sm"
          >
            <div className="flex items-center space-x-2 text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Join Room Section */}
      <div className="space-y-6 mb-8">
        <div>
          <label className="block text-gray-300 mb-3 font-medium" htmlFor="roomId">
            Join Existing Room
          </label>
          <div className="relative">
            <input
              type="text"
              id="roomId"
              placeholder="Enter Room ID"
              value={joinRoomId}
              onChange={(e) => {
                setJoinRoomId(e.target.value);
                setError(null);
              }}
              className="w-full pl-4 pr-4 py-4 rounded-xl bg-gray-800/50 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
            />
          </div>
        </div>

        <motion.button
          onClick={handleJoinRoom}
          disabled={status === USER_STATUS.ATTEMPTING_JOIN}
          whileHover={status !== USER_STATUS.ATTEMPTING_JOIN ? { scale: 1.02 } : {}}
          whileTap={status !== USER_STATUS.ATTEMPTING_JOIN ? { scale: 0.98 } : {}}
          className={`w-full px-6 py-4 rounded-xl font-semibold text-white shadow-lg focus:outline-none focus:ring-4 transition-all duration-200 relative overflow-hidden group ${
            status === USER_STATUS.ATTEMPTING_JOIN
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-xl hover:shadow-indigo-500/25"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative z-10 flex items-center justify-center space-x-2">
            {status === USER_STATUS.ATTEMPTING_JOIN ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Join Room</span>
              </>
            )}
          </span>
        </motion.button>
      </div>

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-700/50"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-gray-900 text-gray-400 font-medium">Or</span>
        </div>
      </div>

      {/* Create Room Section */}
      <motion.button
        onClick={handleCreateRoom}
        disabled={status === USER_STATUS.ATTEMPTING_JOIN}
        whileHover={status !== USER_STATUS.ATTEMPTING_JOIN ? { scale: 1.02 } : {}}
        whileTap={status !== USER_STATUS.ATTEMPTING_JOIN ? { scale: 0.98 } : {}}
        className={`w-full px-6 py-4 rounded-xl font-semibold text-white shadow-lg focus:outline-none focus:ring-4 transition-all duration-200 relative overflow-hidden group mb-6 ${
          status === USER_STATUS.ATTEMPTING_JOIN
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-xl hover:shadow-indigo-500/25"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="relative z-10 flex items-center justify-center space-x-2">
          {status === USER_STATUS.ATTEMPTING_JOIN ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Creating...</span>
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              <span>Create New Room</span>
            </>
          )}
        </span>
      </motion.button>

      {/* Copy Success Message */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mb-4 p-3 rounded-xl bg-green-500/20 border border-green-500/30 backdrop-blur-sm"
          >
            <div className="flex items-center space-x-2 text-green-400">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <p className="text-sm font-medium">Room ID copied to clipboard!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FormComponent;