import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading, initialCheckDone, initialize } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (!initialCheckDone) {
      initialize();
    }
  }, [initialize, initialCheckDone]);

  if (loading || !initialCheckDone) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A0C878]"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;