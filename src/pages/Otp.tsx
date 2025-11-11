import { useState, ChangeEvent, FormEvent, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, RotateCcw, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";

const OTPPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Get email from URL query
  const params = new URLSearchParams(location.search);
  const email = params.get("email") || "";

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [verified, setVerified] = useState(false);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
    setCountdown(30); // Start countdown
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value;
    
    // Only allow numbers
    if (/^\d?$/.test(val)) {
      const newOtp = [...otp];
      newOtp[index] = val;
      setOtp(newOtp);
      setError(null);

      // Auto-focus next input
      if (val && index < 5) {
        const nextInput = inputRefs.current[index + 1];
        nextInput?.focus();
      }

      // Auto-submit when all fields are filled
      if (newOtp.every(digit => digit !== "") && index === 5) {
        handleVerify(newOtp.join(""));
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = inputRefs.current[index - 1];
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pasteData)) {
      const newOtp = pasteData.split("").slice(0, 6);
      const updatedOtp = [...otp];
      newOtp.forEach((digit, index) => {
        updatedOtp[index] = digit;
      });
      setOtp(updatedOtp);
      
      // Focus the next empty input or last input
      const nextEmptyIndex = newOtp.length < 6 ? newOtp.length : 5;
      inputRefs.current[nextEmptyIndex]?.focus();
    }
  };

  const handleVerify = async (otpCode?: string) => {
    const code = otpCode || otp.join("");
    
    if (code.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/verifyemail`, { 
        email, 
        otp: code 
      });
      
      setSuccess("Email verified successfully!");
      setVerified(true);
      
      // Redirect after delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);

    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
      
      // Clear OTP on error
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setError(null);

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/send-otp`, {
        email,
        emailType: "VERIFY",
      });

      setSuccess("New OTP sent to your email!");
      setCountdown(30);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();

      // Auto-clear success message
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend OTP. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleVerify();
  };

  const allFilled = otp.every(digit => digit !== "");

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
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="bg-gray-900/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl max-w-md w-full border border-gray-800/50 relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/signup"
            className="inline-flex items-center text-gray-400 hover:text-gray-300 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to signup
          </Link>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-16 h-16 mx-auto bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-4"
          >
            <Mail className="w-8 h-8 text-white" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-extrabold text-white mb-2"
          >
            Verify Your Email
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400 mb-2"
          >
            Enter the 6-digit code sent to
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-indigo-400 font-semibold text-lg"
          >
            {email}
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

        {/* OTP Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Inputs */}
          <div className="flex justify-between gap-3 mb-2">
            {otp.map((digit, index) => (
              <motion.input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={index === 0 ? handlePaste : undefined}
                disabled={loading || verified}
                className={`w-12 h-14 text-center text-xl font-bold rounded-xl bg-gray-800/50 text-white border-2 focus:outline-none focus:ring-4 transition-all duration-200 ${
                  digit 
                    ? 'border-indigo-500 focus:border-indigo-500 focus:ring-indigo-500/20' 
                    : 'border-gray-700 focus:border-indigo-500 focus:ring-indigo-500/20'
                } ${loading || verified ? 'opacity-50 cursor-not-allowed' : ''}`}
                required
              />
            ))}
          </div>

          {/* Resend OTP */}
          <div className="text-center">
            {countdown > 0 ? (
              <p className="text-gray-500 text-sm">
                Resend OTP in <span className="text-indigo-400">{countdown}s</span>
              </p>
            ) : (
              <motion.button
                type="button"
                onClick={handleResendOTP}
                disabled={resendLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="text-indigo-400 hover:text-purple-500 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-center space-x-2">
                  <RotateCcw className="w-4 h-4" />
                  <span>{resendLoading ? "Sending..." : "Resend OTP"}</span>
                </div>
              </motion.button>
            )}
          </div>

          {/* Verify Button */}
          <motion.button
            type="submit"
            disabled={loading || !allFilled || verified}
            whileHover={(!loading && allFilled && !verified) ? { scale: 1.02 } : {}}
            whileTap={(!loading && allFilled && !verified) ? { scale: 0.98 } : {}}
            className={`w-full px-6 py-4 rounded-xl font-semibold text-white shadow-lg focus:outline-none focus:ring-4 transition-all duration-200 relative overflow-hidden group ${
              loading || !allFilled || verified
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-xl hover:shadow-indigo-500/25"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center justify-center space-x-2">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : verified ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Verified!</span>
                </>
              ) : (
                <span>Verify Email</span>
              )}
            </span>
          </motion.button>
        </form>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6 text-gray-500 text-sm"
        >
          <p>Can't find the code? Check your spam folder</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OTPPage;