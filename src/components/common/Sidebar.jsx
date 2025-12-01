import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, Menu, User, Newspaper, GraduationCap } from "lucide-react";
import { Avatar, Modal } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { logout as logoutAction } from "../../Redux/Slice/authSlice";

// ✅ Local icons
import HomeIcon from "../../../public/icons/HomeIcon.svg";
import EventIcon from "../../../public/icons/EventIcon.svg";
import OrganizationIcon from "../../../public/icons/OrganizationIcon.svg";
import SettingIcon from "../../../public/icons/SettingIcon.svg";
import UserIcon from "../../../public/icons/UserIcon.svg";
import FeedIcon from "../../../public/icons/newspaper.svg";

import { getGroupApprovalList, getApproveList } from "../../utils/api";
const SIDEBAR_ITEMS = [
  { name: "Dashboard", icon: HomeIcon, href: "/dashboard", roles: ["admin"] },
  { name: "Challenge Manage", icon: EventIcon, href: "/challange", roles: ["admin", "user"] },
  { name: "User Manage", icon: UserIcon, href: "/users", roles: ["admin"] },
  { name: "Feed Manage", icon: FeedIcon, href: "/feed", roles: ["admin"] },
  { name: "Group Approvals", icon: OrganizationIcon, href: "/group-approvals", roles: ["admin"] },

  { name: "Group Manage", icon: OrganizationIcon, href: "/group", roles: ["admin"] },
  { name: "Settings & Notifications", icon: SettingIcon, href: "/settings", roles: ["admin"] },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state?.auth?.user?.user);
  const location = useLocation();
  const [allGroups, setAllGroups] = useState([]);
  const [members, setMembers] = useState([]);

  // show red dot when both group requests and member requests exist
  const hasApprovalRequests = (allGroups?.length ?? 0) > 0 && (members?.length ?? 0) > 0;

  // 🧠 Auto-collapse sidebar on small devices

  const fetchGroups = async () => {
      try {
        
  
        
          // Group requests (groups seeking approval)
          const res = await getGroupApprovalList();
          const groups = res?.requests ?? res?.data ?? [];
          setAllGroups(groups);
         
          const response = await getApproveList();
          const members = response?.requests ?? response?.data ?? [];
          setMembers(members);
      
      } catch (err) {
        console.error("Failed to fetch groups/members", err);
       
        setAllGroups([]);
       
      } 
      
    };
  useEffect(() => {
    const handleResize = () => setIsOpen(window.innerWidth > 768); // >768px → open, else collapsed
    handleResize();
    fetchGroups()
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

 

  const confirmLogout = () => {
    ["token", "isLoggedIn", "authUser", "role", "email", "eventId"].forEach((key) =>
      localStorage.removeItem(key)
    );
    dispatch(logoutAction());
    navigate("/");
  };

  const isActiveRoute = (href) => location.pathname === href;

  return (
    <motion.aside
      animate={{ width: isOpen ? 240 : 80 }}
      className="relative flex flex-col bg-white text-black border-r border-gray-300 p-3 h-screen transition-all duration-300 ease-in-out overflow-hidden"
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-full hover:bg-gray-200 transition-colors ${isOpen === false ?"self-center":"self-auto"} lg:self-auto`}
      >
        <Menu size={22} />
      </button>

      {/* Profile Section */}
      <div className="flex items-center gap-3 mt-6 p-2 bg-gray-100 rounded-lg overflow-hidden">
        <img
          src="/WhatsApp Image 2025-10-06 at 22.17.14.jpeg"
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
        />
        {isOpen && (
          <div className="flex flex-col">
            <span className="font-semibold text-sm">STK Challenge App</span>
            <span className="text-xs text-gray-500 capitalize">
              {authUser?.role || "Admin"}
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col mt-6 flex-grow overflow-hidden ">
        {SIDEBAR_ITEMS.filter((i) => i.roles.includes(authUser?.role || "admin")).map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={`flex items-center gap-3 p-3 mb-1 rounded-lg text-sm font-medium transition-colors  ${isOpen === false ? "justify-center" : "justify-start"} lg:justify-start
              ${isActiveRoute(item.href)
                ? "bg-gray-100 text-blue-600"
                : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
              }`}
          >
            <div className="relative flex items-center">
              <img
                src={item.icon}
                alt={item.name}
                className={`w-5 h-5 ${isActiveRoute(item.href) ? "filter-blue" : ""}`}
              />
              {/* red dot for Group Approvals when both lists are non-empty */}
              {item.href === "/group-approvals" && hasApprovalRequests && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full ring-1 ring-white" />
              )}
            </div>
            {isOpen && <span>{item.name}</span>}
          </Link>
         ))}
      </nav>

      {/* Footer Section */}
      <div className="mt-auto">
        <div className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition ${isOpen === false ?"justify-center":"justify-start"} lg:justify-start`}>
          <GraduationCap className="text-black" size={20} />
          {isOpen && (
            <a
              href="/leaderboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium"
            >
              Leaderboard
            </a>
          )}
        </div>

        <div
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition justify-center md:justify-start"
          onClick={() => setShowLogout(true)}
        >
          <div className="relative flex-shrink-0 w-[30px] h-[30px] md:w-[44px] md:h-[44px] rounded-full overflow-hidden border border-gray-300">
            <Avatar
              className="!w-full !h-full !rounded-full !overflow-hidden !object-cover"
              icon={
                <User className="text-gray-100 w-[15px] h-[15px] md:w-[25px] md:h-[25px]" />
              }
            />
          </div>

          {isOpen && (
            <div className="flex flex-col">
              <span className="text-sm font-medium">{authUser?.role}</span>
              <span className="text-sm font-medium">
                {authUser?.email || "admin@demo.com"}
              </span>
              <LogOut
                size={18}
                className="cursor-pointer text-gray-600 hover:text-red-500 mt-1"
              />
            </div>
          )}
        </div>
      </div>

      {/* Logout Modal */}
      <Modal
        title="Confirm Logout"
        open={showLogout}
        onOk={() => {
          setShowLogout(false);
          confirmLogout();
        }}
        onCancel={() => setShowLogout(false)}
        okText="Logout"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to logout?</p>
      </Modal>
    </motion.aside>
  );
};

export default Sidebar;
