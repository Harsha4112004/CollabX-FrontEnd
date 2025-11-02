import "./globals.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Toast from "./components/toast/Toast"
import EditorPage from "./pages/EditorPage"
import HomePage from "./pages/HomePage"
import Dashboard from "./pages/Dashboard"
import ForgotPasswordPage from "./pages/ForgotPassword"
import CollabXLandingPage from "./pages/Landing"
import LoginPage from "./pages/Login"
import SignupPage from "./pages/Signup"
import OTPPage from "./pages/Otp"
import ResetPasswordPage from "./pages/ResetPassword"

const App = () => {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<CollabXLandingPage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/editor/:roomId" element={<EditorPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/otp" element={<OTPPage/>} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </Router>
            <Toast /> {/* Toast component from react-hot-toast */}
        </>
    )
}

export default App
