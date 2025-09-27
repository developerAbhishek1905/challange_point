import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import Sidebar from "./components/common/Sidebar";
import OverviewPage from "./pages/OverviewPage";
import EventsPage from "./pages/EventPage";
import UsersPage from "./pages/UsersPage";
import OrganizationPage from "./pages/OrganizationPage";
import ParticipantsPage from "./pages/ParticipantsPage";
import SettingsPage from "./pages/SettingsPage";
import ResultPage from "./pages/ResultPage";
import Login from "./pages/auth/Login";
import ForgetPassword from "./pages/auth/ForgetPassword";
import EventParticipantsPage from "./pages/EventParticipantPage";
import ResultCategoryPage from "./pages/ResultCategoryPage";
import ResultEventPage from "./pages/ResultEventPage";
import UserEventPage from "./pages/User/UserEventPage";
import UserParticipantsPage from "./pages/User/UserParticipantPage";
import UserResultPage from "./pages/User/UserResultPage";
import { ToastContainer } from "react-toastify";
import SocialToolKitLeaderboard from "./components/SocialToolKitLeaderboard";

function App() {
  const location = useLocation();

  // If the route is /leaderboard, render only SocialToolKitLeaderboard
  if (location.pathname === "/leaderboard") {
    return <SocialToolKitLeaderboard />;
  }

  const isAuthPage =
    location.pathname === "/" || location.pathname === "/forgetPassword";

  return (
    <div className="flex h-screen bg-white text-gray-100 overflow-hidden">
      <ToastContainer />
      {!isAuthPage && <Sidebar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgetPassword" element={<ForgetPassword />} />
        <Route path="/dashboard" element={<OverviewPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/organization" element={<OrganizationPage />} />
        <Route path="/participants" element={<ParticipantsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/result/:eventName" element={<ResultCategoryPage />} />
        <Route path="/event/:categoryName" element={<ResultPage />} />
        <Route
          // path="/participant/:eventName/:categoryName"
          element={<EventParticipantsPage />}
        />
        <Route path="/resultEvents" element={<ResultEventPage />} />
        <Route path="/user/event" element={<UserEventPage />} />
        <Route path="/user/participants" element={<UserParticipantsPage />} />
        <Route path="/user/result" element={<UserResultPage />} />
        {/* Redirect unknown routes to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

export default App;