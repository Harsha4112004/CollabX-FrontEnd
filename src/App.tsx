import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Toast from "./components/toast/Toast";
import EditorPage from "./pages/EditorPage";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import ForgotPasswordPage from "./pages/ForgotPassword";
import CollabXLandingPage from "./pages/Landing";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import OTPPage from "./pages/Otp";
import ResetPasswordPage from "./pages/ResetPassword";

import { AuthProvider } from "./context/AuthContext";
import RouteMiddleware from "./components/RouteMiddleware";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public pages accessible to guests only */}
          <Route path="/login" element={<RouteMiddleware isPublic><LoginPage /></RouteMiddleware>} />
          <Route path="/signup" element={<RouteMiddleware isPublic><SignupPage /></RouteMiddleware>} />
          <Route path="/forgot-password" element={<RouteMiddleware isPublic><ForgotPasswordPage /></RouteMiddleware>} />
          <Route path="/reset-password" element={<RouteMiddleware isPublic><ResetPasswordPage /></RouteMiddleware>} />
          <Route path="/otp" element={<RouteMiddleware isPublic><OTPPage /></RouteMiddleware>} />

          {/* Public landing pages accessible to everyone */}
          <Route path="/" element={<CollabXLandingPage />} />
          <Route path="/work" element={<HomePage />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={<RouteMiddleware><Dashboard /></RouteMiddleware>} />
          <Route path="/editor/:roomId" element={<RouteMiddleware><EditorPage /></RouteMiddleware>} />
          
        </Routes>
      </Router>
      <Toast /> {/* Toast component */}
    </AuthProvider>
  );
};

export default App;
