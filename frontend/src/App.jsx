
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
import Browse from "./pages/student/Browse";
import Dashboard from "./pages/student/Dashboard";
import ShowCourse from "./pages/student/ShowCourse";
import ViewCourseContent from "./pages/student/ViewCourseContent";
import useAuthStore from "./zustand/authStore";
import {Toaster} from "react-hot-toast";
function App() {
  const user = useAuthStore((state) => state.user);

  // Redirect to /dashboard if user exists, else show the component
  const PublicRoute = ({ children }) => {
    return user ? <Navigate to="/dashboard" replace /> : children;
  };

  // Redirect to /register if user doesn't exist
  const RequireAuth = ({ children }) => {
    return user ? children : <Navigate to="/register" replace />;
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Router>
        <Toaster/>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/verify-email"
            element={
              <PublicRoute>
                <Verifymail />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/unauthorized"
            element={
              <PublicRoute>
                <Unauthorized />
              </PublicRoute>
            }
          />

          {/* Authenticated User Routes */}
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/browse"
            element={
              <RequireAuth>
                <Browse />
              </RequireAuth>
            }
          />
          <Route
            path="/course/:id"
            element={
              <RequireAuth>
                <ShowCourse />
              </RequireAuth>
            }
          />
          <Route
            path="/course/:id/viewCourse"
            element={
              <RequireAuth>
                <ViewCourseContent />
              </RequireAuth>
            }
          />

          {/* Default & Fallback Routes */}
          <Route
            path="/"
            element={<Navigate to={user ? "/dashboard" : "/register"} replace />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;

