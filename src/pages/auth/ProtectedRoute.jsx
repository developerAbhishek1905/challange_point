// RoleProtectedRoute.js
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, userData } = useSelector((state) => state.user);

  if (!isAuthenticated) return <Navigate to="/" replace />;
const userRole = userData?.role;
  // If the user's role is not in the list of allowed roles, redirect
   if (!allowedRoles.includes(userRole)) {
    return <Navigate to={userRole === 'user' ? '/user/event' : '/dashboard'} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
