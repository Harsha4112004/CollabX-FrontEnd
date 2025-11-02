import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";

interface Project {
  id: number;
  name: string;
  description: string;
}

interface UserPayload {
  name: string;
  email: string;
  [key: string]: any;
}

const initialProjects: Project[] = [
  { id: 1, name: "CollabX Web App", description: "Real-time coding platform" },
  { id: 2, name: "AI Code Assistant", description: "AI helper integration" },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newProjectName, setNewProjectName] = useState<string>("");
  const [newProjectDesc, setNewProjectDesc] = useState<string>("");
  const [user, setUser] = useState<UserPayload | null>(null);

  useEffect(() => {
    try {
      const token = Cookies.get("token"); // 👈 name of your JWT cookie
      if (token) {
        const decoded: UserPayload = jwtDecode(token);
        setUser(decoded);
        console.log("Decoded JWT Payload:", decoded);
      }
      else {
        console.log("no token");
        
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, []);

  const handleCreateProject = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newProject: Project = {
      id: projects.length + 1,
      name: newProjectName.trim(),
      description: newProjectDesc.trim(),
    };

    setProjects([...projects, newProject]);
    setNewProjectName("");
    setNewProjectDesc("");
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-100">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold">CX</span>
            </div>
            <h1 className="text-2xl font-bold">CollabX Dashboard</h1>
          </div>
          <nav className="flex space-x-6">
            <a href="#" className="hover:text-indigo-400">Projects</a>
            <a href="#" className="hover:text-indigo-400">Teams</a>
            <a href="#" className="hover:text-indigo-400">Settings</a>
          </nav>
          <button
            onClick={async () => {
              await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/logout`);
              navigate("/login");
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* ✅ User Info Card */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/70 p-6 rounded-xl border border-gray-800 shadow-lg flex items-center justify-between"
          >
            <div>
              <h2 className="text-2xl font-semibold">{user.name}</h2>
              <p className="text-gray-400">{user.email}</p>
            </div>
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-[2px] rounded-full">
              <div className="bg-black rounded-full px-5 py-2 text-sm font-medium">
                Logged In
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Your Projects</h2>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            + Create Project
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              whileHover={{ scale: 1.03 }}
              className="bg-black/70 p-6 rounded-xl border border-gray-800 shadow-lg cursor-pointer"
            >
              <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
              <p className="text-gray-400">{project.description}</p>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/80 p-8 rounded-2xl shadow-2xl border border-gray-800 w-full max-w-md"
          >
            <h2 className="text-2xl font-bold mb-4">Create New Project</h2>
            <form className="space-y-4" onSubmit={handleCreateProject}>
              <input
                type="text"
                placeholder="Project Name"
                value={newProjectName}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setNewProjectName(e.target.value)
                }
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <textarea
                placeholder="Project Description"
                value={newProjectDesc}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setNewProjectDesc(e.target.value)
                }
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  Create
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
