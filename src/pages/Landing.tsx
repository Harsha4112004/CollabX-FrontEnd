import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

type ButtonVariant = "primary" | "secondary" | "light" | "gradient";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = "primary", 
  onClick,
  className = ""
}) => {
  const base =
    "px-8 py-4 rounded-2xl font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg relative overflow-hidden group";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-2xl hover:shadow-indigo-500/25 focus:ring-indigo-400",
    secondary:
      "border-2 border-gray-600 text-gray-200 hover:bg-gray-800/80 hover:border-gray-400 focus:ring-gray-400 backdrop-blur-sm",
    light:
      "bg-white text-gray-900 hover:bg-gray-50 focus:ring-gray-300 shadow-xl hover:shadow-2xl",
    gradient:
      "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:shadow-2xl hover:shadow-purple-500/30 focus:ring-purple-400",
  };

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ y: 0 }}
      className={`${base} ${variants[variant]} ${className} relative overflow-hidden`}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

const FloatingShape = () => (
  <motion.div
    className="absolute w-72 h-72 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
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
);

const ParticleBackground = () => {
  const [particles, setParticles] = useState<Array<{ x: number; y: number; size: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute bg-indigo-400/30 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};

const FeatureCard = ({ feature, index }: { feature: any; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    whileHover={{ y: -10, scale: 1.02 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="group relative bg-gradient-to-br from-gray-900/50 to-gray-800/30 p-8 rounded-3xl border border-gray-700/50 shadow-2xl hover:shadow-indigo-500/10 backdrop-blur-sm overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative z-10">
      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {feature.icon}
        </svg>
      </div>
      <h4 className="text-2xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
        {feature.title}
      </h4>
      <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
    </div>
  </motion.div>
);

const CollabXLandingPage: React.FC = () => {

  const features = [
    {
      title: "Real-Time Collaboration",
      desc: "Experience seamless collaboration with multiple cursor support, live editing, and instant synchronization across all participants.",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M7 20H2v-2a3 3 0 015.356-1.857m0 0a5.002 5.002 0 019.288 0" />
      ),
    },
    {
      title: "Advanced AI Partner",
      desc: "Get intelligent code suggestions, automated debugging, and contextual assistance powered by cutting-edge AI technology.",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m0 14v1m8-8h1M3 12H2m15.364-6.364l.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
      ),
    },
    {
      title: "Smart Syntax Highlighting",
      desc: "Advanced language support for 200+ programming languages with intelligent autocomplete and error detection.",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />,
    },
    {
      title: "Integrated Communication",
      desc: "Built-in voice, video, and text chat with screen sharing capabilities for seamless team communication.",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6h18v8h-5l-5 5v-5z" />
      ),
    },
    {
      title: "Interactive Drawing Board",
      desc: "Collaborative whiteboard with real-time sketching, diagramming, and annotation tools for visual brainstorming.",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5V21h4.5L17.87 10.63l-4.5-4.5L3 16.5zM20.71 7.04a1.003 1.003 0 000-1.42l-2.34-2.34a1.003 1.003 0 00-1.42 0l-1.83 1.83 4.5 4.5 1.09-1.09z" />
      ),
    },
    {
      title: "Cloud Deployment",
      desc: "One-click deployment to cloud platforms with automated CI/CD pipelines and environment management.",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100 font-sans overflow-hidden">
      <ParticleBackground />
      
      {/* Animated Background Shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <FloatingShape />
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"
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

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b border-gray-800/50 sticky top-0 bg-black/20 backdrop-blur-xl z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">CX</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              CollabX
            </h1>
          </motion.div>
          
          <nav className="hidden md:flex space-x-8">
            {["Features", "Pricing", "Docs", "Community"].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-gray-400 hover:text-white transition-colors duration-300 font-medium"
                whileHover={{ y: -2 }}
              >
                {item}
              </motion.a>
            ))}
          </nav>

          <div className="flex space-x-4">
            <Link to="/login">
              <Button variant="secondary">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button variant="gradient">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 py-28 md:py-36">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2"
          >
            
            <h2 className="text-6xl md:text-7xl font-extrabold mb-8 leading-tight">
              Code Together{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                in Real-Time
              </span>
            </h2>
            
            <p className="text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed">
              Revolutionize how you collaborate. Write, debug, and deploy code together 
              with our advanced real-time platform featuring AI assistance and seamless integration.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <Link to="/signup">
                <Button variant="gradient" className="text-lg px-10 py-5">
                  Start Coding Now 🚀
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="md:w-1/2 relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-purple-500/10">
              <img
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="CollabX editor showing real-time code collaboration"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              
              {/* Floating elements */}
              <motion.div
                className="absolute top-6 right-6 bg-green-500/20 backdrop-blur-sm rounded-2xl p-4 border border-green-500/30"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm font-medium">Live Collaboration</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h3 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Powerful Features
            </h3>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to collaborate effectively and ship code faster than ever before.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-4xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80')] bg-cover bg-center mix-blend-overlay" />
            <div className="relative z-10 py-20 px-6">
              <h3 className="text-5xl font-bold text-white mb-6">
                Ready to Transform Your Workflow?
              </h3>
              <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
                Join thousands of developers and teams who are already building amazing things together on CollabX.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button variant="light" className="text-lg px-12 py-6">
                  Create Free Account
                </Button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="text-white border-2 border-white/30 hover:border-white px-12 py-6 rounded-2xl font-semibold transition-all duration-300"
                >
                  Schedule a Demo
                </motion.button>
              </div>
              <p className="text-indigo-200 mt-8 text-sm">
                No credit card required • Free forever plan • Setup in 2 minutes
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 border-t border-gray-800/50 py-16 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CX</span>
                </div>
                <span className="font-bold text-xl">CollabX</span>
              </div>
              <p className="text-gray-400 mb-6">
                The future of collaborative coding starts here.
              </p>
              <div className="flex space-x-4">
                {["twitter", "github", "linkedin", "discord"].map((social) => (
                  <motion.a
                    key={social}
                    href="#"
                    whileHover={{ y: -2, scale: 1.1 }}
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                  >
                    <span className="text-gray-400">🔗</span>
                  </motion.a>
                ))}
              </div>
            </div>
            
            {["Product", "Company", "Resources", "Legal"].map((category) => (
              <div key={category}>
                <h4 className="font-semibold text-white mb-6">{category}</h4>
                <ul className="space-y-4">
                  {Array.from({ length: 4 }, (_, i) => (
                    <li key={i}>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">
                        Link {i + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="pt-8 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} CollabX. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {["Privacy", "Terms", "Cookies"].map((item) => (
                <a key={item} href="#" className="text-gray-500 hover:text-gray-400 text-sm transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CollabXLandingPage;