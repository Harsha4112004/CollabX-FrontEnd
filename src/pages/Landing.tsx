import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

type ButtonVariant = "primary" | "secondary" | "light";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
}

const Button: React.FC<ButtonProps> = ({ children, variant = "primary" }) => {
  const base =
    "px-6 py-3 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-[1.03] active:scale-[0.97]";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl focus:ring-indigo-400",
    secondary:
      "border border-gray-500 text-gray-200 hover:bg-gray-800/60 focus:ring-gray-400",
    light:
      "bg-white text-gray-900 hover:bg-gray-100 focus:ring-gray-300 shadow-md",
  };

  return <button className={`${base} ${variants[variant]}`}>{children}</button>;
};

const CollabXLandingPage: React.FC = () => {
  const features = [
    {
      title: "Real-Time Collaboration",
      desc: "See changes instantly with multiple cursor support and live editing.",
      icon: (
        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M7 20H2v-2a3 3 0 015.356-1.857m0 0a5.002 5.002 0 019.288 0" />
      ),
    },
    {
      title: "Syntax Highlighting",
      desc: "Support for 100+ languages with smart code completion.",
      icon: <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />,
    },
    {
      title: "Integrated Chat",
      desc: "Stay connected with built-in voice & text chat inside the editor.",
      icon: (
        <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6h18v8h-5l-5 5v-5z" />
      ),
    },
    {
      title: "AI Partner",
      desc: "Get instant coding help, suggestions, and debugging assistance from an AI partner right inside your workspace.",
      icon: (
        <path d="M12 4v1m0 14v1m8-8h1M3 12H2m15.364-6.364l.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
      ),
    },
    {
      title: "Drawing Board",
      desc: "Sketch, annotate, and brainstorm ideas with your team in real-time using the integrated collaborative drawing board.",
      icon: (
        <path d="M3 16.5V21h4.5L17.87 10.63l-4.5-4.5L3 16.5zM20.71 7.04a1.003 1.003 0 000-1.42l-2.34-2.34a1.003 1.003 0 00-1.42 0l-1.83 1.83 4.5 4.5 1.09-1.09z" />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-100 font-sans">
      {/* Header */}
      <header className="border-b border-gray-800 sticky top-0 bg-black/70 backdrop-blur z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold">CX</span>
            </div>
            <h1 className="text-xl font-bold">CollabX</h1>
          </div>
          <div className="flex space-x-3">
            <Link to="/login">
              <Button variant="secondary">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 md:py-28">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="md:w-1/2"
          >
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              Code Together in{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                Real-Time
              </span>
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-lg">
              Collaborate seamlessly with developers worldwide. Write, debug,
              and deploy code together — all inside your browser.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup">
                <Button>Start Coding Now</Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="md:w-1/2"
          >
            <img
              src="Landing.jpg"
              alt="CollabX editor showing real-time code collaboration"
              className="rounded-xl shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-14">
            Powerful Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="bg-black p-8 rounded-xl border border-gray-800 shadow-lg hover:border-indigo-500/50 transition-colors"
              >
                <div className="w-14 h-14 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-indigo-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {f.icon}
                  </svg>
                </div>
                <h4 className="text-xl font-semibold mb-2">{f.title}</h4>
                <p className="text-gray-400">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Ready to Code Together?
          </motion.h3>
          <p className="text-gray-200 mb-10 max-w-2xl mx-auto">
            Join thousands of developers already collaborating on CollabX. No
            credit card required.
          </p>
          <Button variant="light">Create Free Account</Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-10 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">CX</span>
            </div>
            <span className="font-medium">CollabX</span>
          </div>

          <p className="mt-2 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} CollabX. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CollabXLandingPage;
