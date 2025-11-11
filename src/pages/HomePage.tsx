import { motion } from "framer-motion";
import FormComponent from "@/components/forms/FormComponent";
import { useEffect } from "react";

function HomePage() {
    // ✅ One-time refresh when component mounts
    useEffect(() => {
        const hasRefreshed = sessionStorage.getItem('homepageRefreshed');
        
        if (!hasRefreshed) {
            sessionStorage.setItem('homepageRefreshed', 'true');
            window.location.reload();
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black relative overflow-hidden">
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

            <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-16">
                <div className="my-12 flex h-full w-full max-w-7xl flex-col items-center justify-evenly px-6 sm:flex-row sm:pt-0">
                    {/* Coding Console Section */}
                    <motion.div 
                        className="flex w-full justify-center sm:w-1/2 sm:pl-4"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="relative">
                            {/* Main Console Image */}
                            <motion.div
                                className="relative rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/20 border border-gray-700/50"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                                    alt="Code Editor Console"
                                    className="w-full max-w-lg rounded-2xl"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                
                                {/* Floating Code Elements */}
                                <motion.div
                                    className="absolute top-4 left-4 bg-green-500/20 backdrop-blur-sm rounded-lg p-2 border border-green-500/30"
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        <span className="text-green-400 text-sm font-mono">Live</span>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="absolute bottom-4 right-4 bg-indigo-500/20 backdrop-blur-sm rounded-lg p-3 border border-indigo-500/30"
                                    animate={{ y: [0, 5, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                                >
                                    <span className="text-indigo-400 text-sm font-mono">2 collaborators</span>
                                </motion.div>
                            </motion.div>

                            {/* Floating Terminal Window */}
                            <motion.div
                                className="absolute -bottom-6 -right-6 bg-gray-800/90 backdrop-blur-md rounded-xl p-4 border border-gray-600/50 shadow-2xl w-64"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                                whileHover={{ y: -5 }}
                            >
                                <div className="flex items-center space-x-2 mb-3">
                                    <div className="flex space-x-1">
                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    </div>
                                    <span className="text-gray-400 text-sm font-mono">terminal</span>
                                </div>
                                <div className="font-mono text-xs text-gray-300 space-y-1">
                                    <div className="flex">
                                        <span className="text-green-400">$</span>
                                        <span className="ml-2">npm run dev</span>
                                    </div>
                                    <div className="text-cyan-400">→ Starting development server...</div>
                                    <div className="text-blue-400">→ Local: http://localhost:3000</div>
                                </div>
                            </motion.div>

                            {/* Floating Code Snippet */}
                            <motion.div
                                className="absolute -top-4 -left-4 bg-gray-800/90 backdrop-blur-md rounded-xl p-4 border border-gray-600/50 shadow-2xl w-56"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.7, duration: 0.6 }}
                                whileHover={{ y: 5 }}
                            >
                                <div className="text-gray-400 text-sm font-mono mb-2">app.jsx</div>
                                <div className="font-mono text-xs text-gray-300 space-y-1">
                                    <div className="text-purple-400">function</div>
                                    <div className="text-yellow-400">Collaborate</div>
                                    <div className="text-gray-400">() {`{`}</div>
                                    <div className="text-blue-400 ml-4">return</div>
                                    <div className="text-green-400 ml-8">"Real-time coding"</div>
                                    <div className="text-gray-400">{`}`}</div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Form Section */}
                    <motion.div 
                        className="flex w-full items-center justify-center sm:w-1/2"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="w-full max-w-md">
                            <FormComponent />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;