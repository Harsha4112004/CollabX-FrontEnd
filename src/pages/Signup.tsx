import React, { useState, ChangeEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const SignupPage: React.FC = () => {
  const [username, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [emailValid, setEmailValid] = useState<boolean>(true);
  const [passwordValid, setPasswordValid] = useState<boolean>(true);
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true);

  const navigate = useNavigate();

  // ✅ Validation functions
  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const validatePasswordsMatch = (pass: string, confirm: string): boolean => {
    return pass === confirm;
  };

  // ✅ Real-time validation
  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (value) setEmailValid(validateEmail(value));
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (value) setPasswordValid(validatePassword(value));
    if (confirmPassword) setPasswordsMatch(validatePasswordsMatch(value, confirmPassword));
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (password && value) setPasswordsMatch(validatePasswordsMatch(password, value));
  };

  // ✅ Password strength indicator
  const getPasswordStrength = (password: string): { strength: string; color: string } => {
    if (password.length === 0) return { strength: "", color: "gray" };
    if (password.length < 6) return { strength: "Weak", color: "red" };
    if (password.length < 8) return { strength: "Fair", color: "yellow" };
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return { strength: "Good", color: "blue" };
    return { strength: "Strong", color: "green" };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Client-side validation
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const doPasswordsMatch = validatePasswordsMatch(password, confirmPassword);

    setEmailValid(isEmailValid);
    setPasswordValid(isPasswordValid);
    setPasswordsMatch(doPasswordsMatch);

    if (!isEmailValid || !isPasswordValid || !doPasswordsMatch) {
      setError("Please check your form entries");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Call signup API
      console.log(import.meta.env.VITE_BACKEND_URL);
      
      const signupRes = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/signup`, {
        username,
        email,
        password,
      });

      console.log("Signup success:", signupRes.data);

      // 2️⃣ Call OTP API to send verification code
      try {
        const otpRes = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/send-otp`, {
          email,
          emailType: "VERIFY",
        });
        console.log("OTP sent:", otpRes.data);
      } catch (error) {
        console.log("Error sending mail:", error);
      }

      // 3️⃣ Show success message
      setSuccess("Account created successfully! Redirecting to verification...");

      // 4️⃣ Redirect to OTP verification page after delay
      setTimeout(() => {
        navigate(`/otp?email=${encodeURIComponent(email)}`);
      }, 1500);

    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );

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
            Join CollabX
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400 mt-2 text-lg"
          >
            Start your collaborative coding journey today
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

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-gray-300 mb-3 font-medium" htmlFor="name">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className={`h-5 w-5 ${username ? 'text-indigo-400' : 'text-gray-500'}`} />
              </div>
              <input
                type="text"
                id="name"
                value={username}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                placeholder="Your Username"
                className="w-full pl-10 pr-4 py-4 rounded-xl bg-gray-800/50 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                required
              />
            </div>
          </div>

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
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleEmailChange(e.target.value)}
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
                onChange={(e: ChangeEvent<HTMLInputElement>) => handlePasswordChange(e.target.value)}
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
            
            {/* Password Strength Indicator */}
            {password && (
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

          {/* Confirm Password Field */}
          <div>
            <label className="block text-gray-300 mb-3 font-medium" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className={`h-5 w-5 ${confirmPassword ? 'text-indigo-400' : 'text-gray-500'}`} />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
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
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </span>
          </motion.button>
        </form>

        {/* Sign In Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8 text-gray-400"
        >
          <p>
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-400 hover:text-purple-500 font-semibold transition-colors duration-200"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignupPage;