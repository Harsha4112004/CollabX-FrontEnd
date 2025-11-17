import React, { Suspense } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Carousel from '../components/dashboard/carousel';

// Dynamically import Spline with no SSR to avoid conflicts
const Spline = React.lazy(() => import('@splinetool/react-spline'));

const Dashboard: React.FC = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100 font-sans overflow-hidden">

      {/* Light Glow Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
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

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b border-gray-800/50 sticky top-0 bg-black/20 backdrop-blur-xl z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">CX</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              CollabX
            </h1>
          </motion.div>

          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3 bg-gray-800/50 rounded-xl px-4 py-2 border border-gray-700/50"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <span className="text-white font-medium">{user?.username}</span>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-gray-700 to-gray-800 text-white border border-gray-600 hover:border-gray-500 transition-all duration-300 font-semibold"
            >
              Logout
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* =================== MAIN =================== */}
      <main className="relative max-w-7xl mx-auto px-6 py-20 z-10">

        {/* FULLSCREEN ROBOT BACKGROUND with Suspense */}
        <div className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden">
          <div className="absolute top-0 right-[-15%] w-[1300px] h-full opacity-80">
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-gray-400">Loading 3D scene...</div>
              </div>
            }>
              <Spline
                scene="https://prod.spline.design/yWXLbXR26D3-Iz4z/scene.splinecode"
                onLoad={(splineApp) => {
                  // Only add event listeners in browser environment
                  if (typeof window !== 'undefined') {
                    window.addEventListener("mousemove", (e) => {
                      const x = (e.clientX / window.innerWidth - 0.5) * 2;
                      const y = (e.clientY / window.innerHeight - 0.5) * -2;

                      const head = splineApp.findObjectByName("Head");
                      if (head) {
                        head.rotation.y = x * 0.2;
                        head.rotation.x = -y * 0.5;
                      }

                      const torso = splineApp.findObjectByName("Torso");
                      if (torso) {
                        torso.rotation.y = x * 0.2;
                      }
                    });
                  }
                }}
              />
            </Suspense>
          </div>
        </div>

        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 z-10 relative"
        >
          <h2 className="text-6xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent drop-shadow-2xl">
            Welcome back, {user?.username}!
          </h2>

          <p className="text-xl text-gray-400 max-w-2xl">
            CollabX environment is synced and ready, bringing you into a real-time collaborative coding space where AI, speed, and teamwork come together.
          </p>
        </motion.div>

        {/* Carousel Section */}
        <div style={{ height: '300px', position: 'relative' }} className="mb-8">
          <Carousel
            baseWidth={300}
            autoplay={true}
            autoplayDelay={3000}
            pauseOnHover={true}
            loop={true}
            round={true}
          />
        </div>

        {/* Start Work Button */}
        <div className="w-full flex justify-center mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-purple-500/30 transition-all"
            onClick={() => navigate('/work')}
          >
            Start Work
          </motion.button>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;