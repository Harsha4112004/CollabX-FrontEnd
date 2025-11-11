// src/pages/LoginPage.tsx
import React, { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [emailValid, setEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const navigate = useNavigate();

  const { setUser } = useAuth();

  // ✅ Email validation
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // ✅ Password validation
  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  // ✅ Real-time validation
  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (value) setEmailValid(validateEmail(value));
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (value) setPasswordValid(validatePassword(value));
  };

  // ✅ Login handler
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Client-side validation
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    setEmailValid(isEmailValid);
    setPasswordValid(isPasswordValid);

    if (!isEmailValid || !isPasswordValid) {
      setError("Please check your email and password");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Send login request
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/login`,
        { email, password }
      );

      // 2️⃣ Store token in localStorage
      localStorage.setItem("token", res.data.token);

      // 3️⃣ Set user context
      setUser(res.data.user);
      
      // 4️⃣ Show success message
      setSuccess("Login successful! Redirecting...");

      // 5️⃣ Navigate after short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } catch (err: any) {
      console.error("Login error:", err);
      
      // Enhanced error handling
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          "Something went wrong. Please try again.";
      
      setError(errorMessage);

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
            <span className="text-white font-bold text-xl">CX</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-extrabold text-white"
          >
            Welcome Back
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400 mt-2 text-lg"
          >
            Sign in to continue your collaboration journey
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

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-gray-300 mb-3 font-medium" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className={`h-5 w-5 ${email ? 'text-indigo-400' : 'text-gray-500'}`} />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="you@example.com"
                className={`w-full pl-10 pr-4 py-4 rounded-xl bg-gray-800/50 text-white placeholder-gray-500 border focus:outline-none focus:ring-4 transition-all duration-200 ${
                  emailValid 
                    ? 'border-gray-700 focus:border-indigo-500 focus:ring-indigo-500/20' 
                    : 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
                }`}
                required
              />
            </div>
            {!emailValid && email && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-sm text-red-400 flex items-center space-x-1"
              >
                <AlertCircle className="w-4 h-4" />
                <span>Please enter a valid email address</span>
              </motion.p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-300 mb-3 font-medium" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className={`h-5 w-5 ${password ? 'text-indigo-400' : 'text-gray-500'}`} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
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
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-400 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {!passwordValid && password && (
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

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-indigo-400 hover:text-purple-500 text-sm font-medium transition-colors duration-200"
            >
              Forgot your password?
            </Link>
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
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </span>
          </motion.button>
        </form>

        {/* Sign Up Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8 text-gray-400"
        >
          <p>
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-400 hover:text-purple-500 font-semibold transition-colors duration-200"
            >
              Sign up now
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;