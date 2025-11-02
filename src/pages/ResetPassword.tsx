import React, { useState, FormEvent, ChangeEvent } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ResetPasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!token) {
      setError("Invalid or missing reset token");
      return;
    }

    setLoading(true);

    try {
        const password = newPassword;
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/resetpassword`,
        { token, password },
        { withCredentials: true }
      );
      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to reset password. Please try again."
      );
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
        <h2 className="text-3xl font-extrabold text-white text-center mb-6">
          Reset Password
        </h2>
        <p className="text-gray-400 text-center mb-6">
          Enter your new password below
        </p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-600 text-white px-4 py-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2" htmlFor="new-password">
              New Password
            </label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNewPassword(e.target.value)
              }
              placeholder="********"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label
              className="block text-gray-300 mb-2"
              htmlFor="confirm-password"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setConfirmPassword(e.target.value)
              }
              placeholder="********"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
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
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="text-center mt-6 text-gray-400">
          Remember your password?{" "}
          <a href="/login" className="text-indigo-400 hover:text-purple-500">
            Login
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
