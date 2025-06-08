import React, { useEffect } from "react";
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
import { Toaster } from "react-hot-toast";
import InstructorDashboard from "./pages/instructor/Dashboard";
import CourseDetails from "./pages/instructor/CourseDetails";
import AdminDashboard from "./pages/admin/Dashboard";
import PendingRequests from "./pages/admin/PendingRequests";

function App() {
  const { user, loading, initialCheckDone, initialize } = useAuthStore();

  useEffect(() => {
    if (!initialCheckDone) {
      initialize();
    }
  }, [initialCheckDone, initialize]);

  // Public Route - Redirects to appropriate dashboard if user is logged in
  const PublicRoute = ({ children }) => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A0C878]"></div>
        </div>
      );
    }

    if (user) {
      switch (user.role) {
        case "user":
          return <Navigate to="/dashboard" replace />;
        case "instructor":
          return <Navigate to="/instructor/dashboard" replace />;
        case "admin":
          return <Navigate to="/admin/dashboard" replace />;
        default:
          return <Navigate to="/unauthorized" replace />;
      }
    }

    return children;
  };

  // Protected Route - Ensures user is authenticated and has correct role
  const ProtectedRouteWithRole = ({ children, allowedRoles }) => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A0C878]"></div>
        </div>
      );
    }

    if (!user) {
      return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
    }

    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/unauthorized" replace />;
    }

    return children;
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Router>
        <Toaster />
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
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Student Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRouteWithRole allowedRoles={["user"]}>
                <Dashboard />
              </ProtectedRouteWithRole>
            }
          />
          <Route
            path="/browse"
            element={
              <ProtectedRouteWithRole allowedRoles={["user"]}>
                <Browse />
              </ProtectedRouteWithRole>
            }
          />
          <Route
            path="/course/:id"
            element={
              <ProtectedRouteWithRole allowedRoles={["user"]}>
                <ShowCourse />
              </ProtectedRouteWithRole>
            }
          />
          <Route
            path="/course/:id/viewCourse"
            element={
              <ProtectedRouteWithRole allowedRoles={["user"]}>
                <ViewCourseContent />
              </ProtectedRouteWithRole>
            }
          />

          {/* Instructor Routes */}
          <Route
            path="/instructor/dashboard"
            element={
              <ProtectedRouteWithRole allowedRoles={["instructor"]}>
                <InstructorDashboard />
              </ProtectedRouteWithRole>
            }
          />
          <Route
            path="/instructor/course/:courseId"
            element={
              <ProtectedRouteWithRole allowedRoles={["instructor"]}>
                <CourseDetails />
              </ProtectedRouteWithRole>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRouteWithRole allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRouteWithRole>
            }
          />
          <Route
            path="/admin/pending-requests"
            element={
              <ProtectedRouteWithRole allowedRoles={["admin"]}>
                <PendingRequests />
              </ProtectedRouteWithRole>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRouteWithRole allowedRoles={["admin"]}>
                <div>Users Management</div>
              </ProtectedRouteWithRole>
            }
          />
          <Route
            path="/admin/courses"
            element={
              <ProtectedRouteWithRole allowedRoles={["admin"]}>
                <div>Courses Management</div>
              </ProtectedRouteWithRole>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRouteWithRole allowedRoles={["admin"]}>
                <div>Admin Settings</div>
              </ProtectedRouteWithRole>
            }
          />

          {/* Default & Fallback Routes */}
          <Route
            path="/"
            element={
              loading ? (
                <div className="flex justify-center items-center h-screen">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A0C878]"></div>
                </div>
              ) : user ? (
                <Navigate
                  to={
                    user.role === "user"
                      ? "/dashboard"
                      : user.role === "instructor"
                      ? "/instructor/dashboard"
                      : "/admin/dashboard"
                  }
                  replace
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;

