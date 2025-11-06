// src/components/RouteMiddleware.tsx
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

interface Props {
  children: JSX.Element;
  isPublic?: boolean; // true for login/signup routes
}

const RouteMiddleware: React.FC<Props> = ({ children, isPublic = false }) => {
  const { user, loading, checkAuth } = useAuth();

  // ✅ Double-check authentication on mount (helps with refresh)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      checkAuth();
    }
  }, [user, checkAuth]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
        <motion.div
          className="w-16 h-16 border-4 border-t-indigo-500 border-gray-700 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
        <p className="mt-4 text-white text-lg font-medium animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  // 🟢 If the route is public (e.g., login/signup) and user is logged in → redirect to dashboard
  if (isPublic && user) {
    return <Navigate to="/dashboard" replace />;
  }

  // 🔴 If the route is protected and user is not logged in → redirect to login
  if (!isPublic && !user) {
    return <Navigate to="/login" replace />;
  }

  // 🟣 Otherwise, render the route content
  return children;
};

export default RouteMiddleware;
