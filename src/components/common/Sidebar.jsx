import { LogOut, Menu, User } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import HomeIcon from "../../../public/icons/HomeIcon.svg";
import EventIcon from "../../../public/icons/EventIcon.svg";
import ParticipantIcon from "../../../public/icons/ParticipantIcon.svg";
import OrganizationIcon from "../../../public/icons/OrganizationIcon.svg";
import SettingIcon from "../../../public/icons/SettingIcon.svg";
import ResultIcon from "../../../public/icons/ResultIcon.svg";
import UserIcon from "../../../public/icons/UserIcon.svg";
import { Avatar, Modal } from "antd";
import { GraduationCap } from 'lucide-react'

// Hardcoded user info
const userData = {
  role: "admin", // Change to "user" for user view
  email: "admin@demo.com"
};

const SIDEBAR_ITEMS = [
  {
    name: "Dashboard",
    icon: HomeIcon,
    color: "#6366f1",
    href: "/dashboard",
    roles: ["admin"],
  },
  {
    name: "Challenge Manage",
    icon: EventIcon,
    color: "#8B5CF6",
    href: "/events",
    roles: ["admin", "user"],
  },
  { name: "User Manage", icon: UserIcon, color: "#10B981", href: "/users", roles: ["admin"], },
  {
    name: "Organization Manage",
    icon: OrganizationIcon,
    color: "#F59E0B",
    href: "/organization",
    roles: ["admin"],
  },
  // {
  //   name: "Participants",
  //   icon: ParticipantIcon,
  //   color: "#3B82F6",
  //   href: "/participants",
  //   roles: ["admin", "user"],
  // },
  // { name: "Results", icon: ResultIcon, color: "#be2528", href: "/resultEvents", roles: ["admin", "user"],},
  {
    name: "Reports & Settings",
    icon: SettingIcon,
    color: "#481818",
    href: "/settings",
    roles: ["admin"],
  },
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const navigate = useNavigate();

  const confirmLogout = () => {
    navigate("/"); // Redirect to login page after logout
  };

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
      animate={{ width: isSidebarOpen ? 256 : 95 }}
    >
      <div className="h-full bg-white text-black backdrop-blur-md p-4 flex flex-col border-r border-gray-300">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full hover:bg-gray-300 transition-colors max-w-fit"
        >
          <Menu size={24} />
        </motion.button>

        {/* Top Section */}
        <div className="mt-6 mb-4">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-100">
            <div className="w-10 h-10  rounded-lg flex items-center justify-center text-white font-bold text-lg">
              <img src="/WhatsApp Image 2025-10-06 at 22.17.14.jpeg" alt="" className="rounded-full" />
            </div>
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.div
                  className="flex flex-col"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2, delay: 0.2 }}
                >
                  <span className="font-semibold text-sm">STK Challenge app</span>
                  <span className="text-xs text-gray-500">{userData.role === 'admin' ? 'Admin' : 'User'}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <nav className="mt-6 flex-grow">
          {SIDEBAR_ITEMS.filter((item) => item.roles.includes(userData.role)).map((item) => {
            let dynamicHref = item.href;
            // Conditional routing for user role
            if (userData.role === "user") {
              if (item.name === "Events Management") dynamicHref = "/user/event";
              if (item.name === "Participants") dynamicHref = "/user/participants";
              if (item.name === "Results") dynamicHref = "/user/result";
            }
            return (
              <Link key={item.href} to={dynamicHref}>
                <motion.div className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors mb-2">
                  <img
                    src={item.icon}
                    alt={item.name}
                    className="w-5 h-5 min-w-[20px] rounded-full"
                  />
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span
                        className="ml-4 whitespace-nowrap"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2, delay: 0.3 }}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            );
          })}
        </nav>
           
           <div className="mt-auto flex items-center gap-3  p-3 hover:bg-gray-100 rounded-lg ">
          <GraduationCap className="text-black" />
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                className="flex flex-col"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2, delay: 0.3 }}
              >
                <a
                  href="/leaderboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm ml-1 font-medium hover:underline"
                >
                  Leaderboard
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Profile Section */}
        <div className="mt-auto flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
          <Avatar size={44} icon={<User />} />
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                className="flex flex-col"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2, delay: 0.3 }}
              >
                <span className="text-sm font-medium">
                  {userData.role === "admin" ? "Admin" : "User"}
                </span>
                <span className="text-xs text-gray-500">{userData.email} </span>
                <LogOut
                  size={18}
                  className="cursor-pointer text-gray-600 hover:text-red-500 transition-colors"
                  onClick={() => setIsLogoutModalVisible(true)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Modal
        title="Confirm Logout"
        open={isLogoutModalVisible}
        onOk={() => {
          setIsLogoutModalVisible(false);
          confirmLogout();
        }}
        onCancel={() => setIsLogoutModalVisible(false)}
        okText="Logout"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to logout?</p>
      </Modal>
    </motion.div>
  );
};
export default Sidebar;
