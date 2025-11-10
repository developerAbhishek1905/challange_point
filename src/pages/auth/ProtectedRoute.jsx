import { Navigate } from "react-router-dom";

/**
 * Protect routes by checking for auth token (or isLoggedIn flag).
 * Leaderboard and auth pages remain public (handled in App.jsx).
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token") || localStorage.getItem("isLoggedIn");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

