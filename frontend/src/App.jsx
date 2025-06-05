import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import Verifymail from "./components/Auth/Verifymail";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";
import Browse from "./pages/student/Browse"
import Dashboard from "./pages/student/Dashboard"
import ShowCourse from "./pages/student/ShowCourse"
import ViewCourseContent from "./pages/student/ViewCourseContent"
import useAuthStore from "./zustand/authStore";

function App() {
  const user = useAuthStore((state)=>state.user)
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-email" element={<Verifymail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route element={<ProtectedRoute roles={["user", "admin"]} />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/register" replace />} />

          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/browse' element={<Browse />} />
          <Route path='/course/:id' element={<ShowCourse />} />
          <Route path='/course/:id/viewCourse' element={<ViewCourseContent />} />

        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
