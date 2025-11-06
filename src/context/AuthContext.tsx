// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode"; // npm install jwt-decode

interface DecodedToken {
  exp?: number;
  id?: string;
  email?: string;
  username?: string;
  isVerified?: boolean;
}

interface AuthContextType {
  user: any;
  loading: boolean;
  setUser: (user: any) => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
  checkAuth: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      // Decode token
      const decoded: DecodedToken = jwtDecode(token);

      // Check if token expired
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        console.warn("Token expired, clearing localStorage");
        localStorage.removeItem("token");
        setUser(null);
      } else {
        // Valid token → set user info from token
        setUser({
          id: decoded.id,
          email: decoded.email,
          username: decoded.username,
          isVerified: decoded.isVerified,
        });
      }
    } catch (err) {
      console.error("Error decoding token:", err);
      setUser(null);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
