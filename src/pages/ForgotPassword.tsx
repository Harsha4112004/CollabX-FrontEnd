import React, { useState, FormEvent, ChangeEvent } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import {useNavigate}  from "react-router-dom";

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      // POST request to your backend
      const emailType = 'RESET'
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/sendresetpassword`,
        { emailType,email },
        { withCredentials: true } 
      );
      toast.success("Password reset link sent to your email!");
      navigate("/login");
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to send reset link. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-black/80 backdrop-blur-lg p-10 rounded-2xl shadow-2xl max-w-md w-full border border-gray-800"
      >
        <h2 className="text-3xl font-extrabold text-white text-center mb-6">
          Forgot Password
        </h2>
        <p className="text-gray-400 text-center mb-6">
          Enter your email to reset your password
        </p>

        {/* Error or Success Message */}
        {error && (
          <div className="bg-red-600 text-white px-4 py-2 rounded mb-4 text-center">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-600 text-white px-4 py-2 rounded mb-4 text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full px-6 py-3 rounded-xl font-semibold text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-200 transform ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-xl hover:scale-[1.03] active:scale-[0.97]"
            }`}
          >
            {loading ? "Sending..." : "Reset Password"}
          </button>
        </form>

        <div className="text-center mt-6 text-gray-400">
          Back to{" "}
          <a href="/login" className="text-indigo-400 hover:text-purple-500">
            Login
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
