import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import Sidebar from "./components/common/Sidebar";
import OverviewPage from "./pages/OverviewPage";
import EventsPage from "./pages/EventPage";
import UsersPage from "./pages/UsersPage";
import OrganizationPage from "./pages/OrganizationPage";

import SettingsPage from "./pages/SettingsPage";
import Login from "./pages/auth/Login";
import ForgetPassword from "./pages/auth/ForgetPassword";

import { ToastContainer } from "react-toastify";
import SocialToolKitLeaderboard from "./components/SocialToolKitLeaderboard";
import FeedManage from "./pages/FeedManage";
import ProtectedRoute from "./pages/auth/ProtectedRoute";

function App() {
  const location = useLocation();
  const token = localStorage.getItem("token") || localStorage.getItem("isLoggedIn");

  // Public route: leaderboard (render alone)
  if (location.pathname === "/leaderboard") {
    return <SocialToolKitLeaderboard />;
  }

  // Pages that must be public (login / forget password)
  const isPublicPage =
    location.pathname === "/" || location.pathname === "/forgetPassword";

  return (
    <div className="flex h-screen bg-white text-gray-100 overflow-hidden">
      <ToastContainer />
      {/* show Sidebar only when not on public pages AND user is authenticated */}
      {!isPublicPage && token && <Sidebar />}

      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/forgetPassword" element={<ForgetPassword />} />

        {/* Protected routes — wrap each element with ProtectedRoute */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <OverviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/challange"
          element={
            <ProtectedRoute>
              <EventsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <FeedManage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/group"
          element={
            <ProtectedRoute>
              <OrganizationPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        
        
       
        
        
        
        {/* Redirect unknown routes to dashboard (protected) */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

export default App;