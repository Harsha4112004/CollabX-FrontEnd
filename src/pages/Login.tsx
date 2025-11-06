// src/pages/LoginPage.tsx
import React, { useState, FormEvent, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { setUser } = useAuth();

  // ✅ Login handler
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1️⃣ Send login request
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/login`,
        { email, password }
      );

      // 2️⃣ Store token in localStorage
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-black/80 backdrop-blur-lg p-10 rounded-2xl shadow-2xl max-w-md w-full border border-gray-800"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md flex items-center justify-center">
            <span className="text-white font-bold">CX</span>
          </div>
          <h2 className="text-3xl font-extrabold mt-4 text-white">Welcome Back</h2>
          <p className="text-gray-400 mt-2">Sign in to continue collaborating in real-time</p>
        </div>

        {error && (
          <div className="bg-red-600 text-white px-4 py-2 rounded mb-4 text-center">{error}</div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <div className="text-right mt-2">
              <a href="/forgot-password" className="text-indigo-400 hover:text-purple-500 text-sm">
                Forgot Password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full px-6 py-3 rounded-xl font-semibold text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-200 transform ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-xl hover:scale-[1.03] active:scale-[0.97]"
            }`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="text-center mt-6 text-gray-400">
          Don’t have an account?{" "}
          <a href="/signup" className="text-indigo-400 hover:text-purple-500">
            Sign Up
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
