import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const OTPPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from URL query: /verify-otp?email=user@example.com
  const params = new URLSearchParams(location.search);
  const email = params.get("email") || "";

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value;
    if (/^\d?$/.test(val)) {
      const newOtp = [...otp];
      newOtp[index] = val;
      setOtp(newOtp);

      if (val && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement | null;
        nextInput?.focus();
      }
    }
  };

  const handleVerify = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const code = otp.join("");
      console.log(code);
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/verifyemail`, { email, otp: code });
      alert("OTP verified successfully!");
      navigate("/dashboard"); // Redirect after successful verification
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-gray-800 p-8 rounded-xl w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Enter OTP</h2>
        <p className="text-gray-400 mb-6">Enter the 6-digit code sent to your email.</p>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-between gap-2 mb-4">
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, i)}
                className="w-12 h-12 text-center text-xl rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-500"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OTPPage;
