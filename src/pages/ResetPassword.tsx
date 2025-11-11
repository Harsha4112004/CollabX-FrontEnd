import React, { useState, FormEvent, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Key, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const ResetPasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [passwordValid, setPasswordValid] = useState<boolean>(true);
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  // Password validation
  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const validatePasswordsMatch = (pass: string, confirm: string): boolean => {
    return pass === confirm;
  };

  // Password strength indicator
  const getPasswordStrength = (password: string): { strength: string; color: string } => {
    if (password.length === 0) return { strength: "", color: "gray" };
    if (password.length < 6) return { strength: "Weak", color: "red" };
    if (password.length < 8) return { strength: "Fair", color: "yellow" };
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return { strength: "Good", color: "blue" };
    return { strength: "Strong", color: "green" };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  // Real-time validation
  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    if (value) setPasswordValid(validatePassword(value));
    if (confirmPassword) setPasswordsMatch(validatePasswordsMatch(value, confirmPassword));
    setError(null);
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (newPassword) setPasswordsMatch(validatePasswordsMatch(newPassword, value));
    setError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Client-side validation
    const isPasswordValid = validatePassword(newPassword);
    const doPasswordsMatch = validatePasswordsMatch(newPassword, confirmPassword);

    setPasswordValid(isPasswordValid);
    setPasswordsMatch(doPasswordsMatch);

    if (!isPasswordValid || !doPasswordsMatch) {
      setError("Please check your password entries");
      return;
    }

    if (!token) {
      setError("Invalid or expired reset link. Please request a new one.");
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
      
      setSuccess("Password reset successfully! Redirecting to login...");
      toast.success("Password reset successfully!");

      // Redirect after delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err: any) {
      console.error(err);
      const errorMessage = err.response?.data?.message ||
        "Failed to reset password. The link may have expired. Please request a new one.";
      
      setError(errorMessage);
      toast.error(errorMessage);

      // Auto-clear error after 5 seconds
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-indigo-500/10 to-purple-600/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-r from-purple-500/10 to-pink-600/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="bg-gray-900/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl max-w-md w-full border border-gray-800/50 relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-16 h-16 mx-auto bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-4"
          >
            <Key className="w-8 h-8 text-white" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-extrabold text-white mb-2"
          >
            New Password
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400 text-center"
          >
            Create a new password for your account
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

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-xl bg-green-500/20 border border-green-500/30 backdrop-blur-sm"
            >
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{success}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reset Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password Field */}
          <div>
            <label className="block text-gray-300 mb-3 font-medium" htmlFor="new-password">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className={`h-5 w-5 ${newPassword ? 'text-indigo-400' : 'text-gray-500'}`} />
              </div>
              <input
                type={showNewPassword ? "text" : "password"}
                id="new-password"
                value={newPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleNewPasswordChange(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-10 pr-12 py-4 rounded-xl bg-gray-800/50 text-white placeholder-gray-500 border focus:outline-none focus:ring-4 transition-all duration-200 ${
                  passwordValid 
                    ? 'border-gray-700 focus:border-indigo-500 focus:ring-indigo-500/20' 
                    : 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-400 transition-colors"
              >
                {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {newPassword && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Password strength</span>
                  <span className={`text-sm font-medium ${
                    passwordStrength.color === 'red' ? 'text-red-400' :
                    passwordStrength.color === 'yellow' ? 'text-yellow-400' :
                    passwordStrength.color === 'blue' ? 'text-blue-400' : 'text-green-400'
                  }`}>
                    {passwordStrength.strength}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      passwordStrength.color === 'red' ? 'bg-red-500 w-1/4' :
                      passwordStrength.color === 'yellow' ? 'bg-yellow-500 w-1/2' :
                      passwordStrength.color === 'blue' ? 'bg-blue-500 w-3/4' : 'bg-green-500 w-full'
                    }`}
                  />
                </div>
              </motion.div>
            )}
            
            {!passwordValid && newPassword && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-sm text-red-400 flex items-center space-x-1"
              >
                <AlertCircle className="w-4 h-4" />
                <span>Password must be at least 6 characters</span>
              </motion.p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-gray-300 mb-3 font-medium" htmlFor="confirm-password">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className={`h-5 w-5 ${confirmPassword ? 'text-indigo-400' : 'text-gray-500'}`} />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-password"
                value={confirmPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleConfirmPasswordChange(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-10 pr-12 py-4 rounded-xl bg-gray-800/50 text-white placeholder-gray-500 border focus:outline-none focus:ring-4 transition-all duration-200 ${
                  passwordsMatch 
                    ? 'border-gray-700 focus:border-indigo-500 focus:ring-indigo-500/20' 
                    : 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-400 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {!passwordsMatch && confirmPassword && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-sm text-red-400 flex items-center space-x-1"
              >
                <AlertCircle className="w-4 h-4" />
                <span>Passwords do not match</span>
              </motion.p>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            className={`w-full px-6 py-4 rounded-xl font-semibold text-white shadow-lg focus:outline-none focus:ring-4 transition-all duration-200 relative overflow-hidden group ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-xl hover:shadow-indigo-500/25"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center justify-center space-x-2">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Resetting Password...</span>
                </>
              ) : (
                <span>Reset Password</span>
              )}
            </span>
          </motion.button>
        </form>

        {/* Login Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8 text-gray-400"
        >
          <p>
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-indigo-400 hover:text-purple-500 font-semibold transition-colors duration-200"
            >
              Back to login
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;