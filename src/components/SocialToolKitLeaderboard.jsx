import React, { useEffect, useState } from "react";
import {
  Crown,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
} from "lucide-react";
import { getLeaderboard } from "../utils/api";
import CreateOrganization from "./Organizations/CreateOrganization";

const SocialToolKitLeaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [clickHome, setClickHome] = useState(true);
  const [clickCreateOrg, setClickCreateOrg] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = (page) => {
    setClickHome(page === "home");
    setClickCreateOrg(page === "createOrg");
  };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard();
        setLeaderboardData(data.organizations || []);
      } catch (error) {
        setLeaderboardData([]);
      }
    };
    fetchLeaderboard();
  }, []);

  // 🏆 Sort leaderboard data
  const sortedData = [...leaderboardData].sort((a, b) => b.points - a.points);
  const topThree = sortedData.slice(0, 3);
  const tableData = sortedData.slice(3); // start from 4th rank

  

  

  const CompanyCard = ({
    name,
    points,
    memberCount,
    isTop,
    crownColor,
    position,
  }) => (
    <div
      className={`flex flex-col items-center justify-center bg-white shadow-lg rounded-2xl p-6 ${
        isTop ? "scale-110 border-4 border-yellow-400" : ""
      }`}
    >
      <div className={`text-3xl ${crownColor}`}>👑</div>
      {/* <img
      src={profileImage}
      alt={name}
      className="h-16 w-16 rounded-full object-cover mt-2"
    /> */}
      <h3 className="font-semibold text-gray-800 mt-2">{name}</h3>
      <p className="text-gray-500 text-sm">Points: {points}</p>
      <p className="text-gray-500 text-sm">Members: {memberCount}</p>
      <span className="text-lg font-bold text-gray-700 mt-1">#{position}</span>
    </div>
  );
  // Get top 3 for podium
  // const topThree = leaderboardData.slice(0, 3);
  // console.log("Top three companies:", topThree);

  return (
    <div
      className="min-h-screen flex flex-col items-center 
    "
    >
      {/* Header */}
      <div className="p-6 md:p-8 flex flex-col items-center bg-gradient-to-br from-teal-800 via-teal-700 to-teal-900 w-full min-h-screen">
        {/* Navbar */}
        <nav className="bg-[#7a9d72] w-full md:w-[80%] backdrop-blur-sm rounded-lg mx-2 md:mx-4 px-6 md:px-10 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="text-white">
              <h1 className="text-3xl md:text-5xl font-bold">STK</h1>
              <p className="text-xs md:text-sm opacity-90">SOCIAL TOOL KIT</p>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex gap-10 text-white text-base md:text-lg">
              <div
                onClick={() => handleNavClick("home")}
                className="hover:text-green-200 transition-colors cursor-pointer"
              >
                Home
              </div>
              <div
                onClick={() => handleNavClick("createOrg")}
                className="hover:text-green-200 transition-colors cursor-pointer"
              >
                Create Organization
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-white focus:outline-none"
              >
                <svg
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {menuOpen && (
            <div className="mt-4 flex flex-col gap-4 text-white text-center md:hidden">
              <div
                onClick={() => {
                  handleNavClick("home");
                  setMenuOpen(false);
                }}
                className="hover:text-green-200 transition-colors cursor-pointer"
              >
                Home
              </div>
              <div
                onClick={() => {
                  handleNavClick("createOrg");
                  setMenuOpen(false);
                }}
                className="hover:text-green-200 transition-colors cursor-pointer"
              >
                Create Organization
              </div>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <div className="text-center py-12 md:py-20 px-4">
          <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-6 md:mb-8 leading-snug">
            UNDER HARD DEVELOPMENT – DEMONSTRATION
            <br className="hidden sm:block" />
            STATIC PAGE
          </h2>
          <p className="text-[#2E4629] text-base sm:text-lg md:text-2xl font-semibold">
            This{" "}
            <span className="underline text-[#7a9d72] decoration-[#7a9d72]">
              application
            </span>{" "}
            aims to be used by companies. But we all have a choice
            <br className="hidden md:block" />
            <span className="underline text-[#7a9d72] decoration-[#7a9d72]">
              inside
            </span>
          </p>
        </div>
      </div>

      {/* Main Content */}
                <div className="absolute min-h-screen w-full flex flex-col items-center lg:top-[50%] md:top-[65%] top-[60%]">

      {clickHome &&(
            <div className="bg-gray-50 min-h-screen rounded-3xl w-[95%] mx-auto p-4">
              <div className="container mx-auto px-4 py-12">
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
                  Top Leaderboard
                </h2>

                {/* Podium Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
                  <div className="order-2 md:order-1">
                    {topThree[1] && (
                      <CompanyCard
                        {...topThree[1]}
                        position={2}
                        crownColor="text-gray-400"
                      />
                    )}
                  </div>
                  <div className="order-1 md:order-2">
                    {topThree[0] && (
                      <CompanyCard
                        {...topThree[0]}
                        position={1}
                        crownColor="text-yellow-500"
                        isTop={true}
                      />
                    )}
                  </div>
                  <div className="order-3 md:order-3">
                    {topThree[2] && (
                      <CompanyCard
                        {...topThree[2]}
                        position={3}
                        crownColor="text-amber-600"
                      />
                    )}
                  </div>
                </div>

                {/* View All Button */}
                {/* <div className="text-center mb-8">
          <button className="text-gray-600 hover:text-gray-800 font-medium">
            View All Leaderboard &gt;
          </button>
        </div> */}

                {/* Table Section */}
                <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-green-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                            S. No.
                          </th>

                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                            Organization Name
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                            Points
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                            Member Count
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.length > 0 ? (
                          tableData.map((item, index) => (
                            <tr
                              key={index}
                              className={
                                index % 2 === 0 ? "bg-green-50" : "bg-white"
                              }
                            >
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {index + 4}
                              </td>

                              <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                {item.name}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {item.points}
                              </td>
                              <td className="px-6 py-4 text-sm text-blue-600 hover:text-blue-800">
                                {/* <a href={`mailto:${item.email}`}>{item.email}</a> */}
                                {item.memberCount}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={5}
                              className="text-center py-8 text-gray-500"
                            >
                              No leaderboard data found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            
            
          
        )}
        {clickCreateOrg && (
        // <div className="absolute rounded-3xl min-h-screen w-[90%] bg-white flex flex-col items-center justify-center lg:top-[50%] md:top-[65%] top-[60%]">
          <CreateOrganization></CreateOrganization>
        // </div>
      )}
        {/* Footer */}
        <footer className="bg-[#2e4629] text-white py-12 w-full ">
              <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                  <div className="flex justify-center font-bold space-x-8 mb-6">
                    <a
                      href="#"
                      className="hover:text-green-300 transition-colors"
                    >
                      Terms & Conditions
                    </a>
                    <a
                      href="#"
                      className="hover:text-green-300 transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </div>
                  <div className=" h-[1px] w-full bg-white"></div>
                  <div className="flex justify-around mt-8">
                    <p className="text-sm opacity-75">
                      © 2025 Company challenges
                    </p>
                    {/* <div className="flex justify-center space-x-6 mb-6">
                    <a
                      href="#"
                      className="hover:text-green-300 transition-colors"
                    >
                      <Facebook className="h-6 w-6" />
                    </a>
                    <a
                      href="#"
                      className="hover:text-green-300 transition-colors"
                    >
                      <Instagram className="h-6 w-6" />
                    </a>
                    <a
                      href="#"
                      className="hover:text-green-300 transition-colors"
                    >
                      <Twitter className="h-6 w-6" />
                    </a>
                    <a
                      href="#"
                      className="hover:text-green-300 transition-colors"
                    >
                      <Linkedin className="h-6 w-6" />
                    </a>
                    <a
                      href="#"
                      className="hover:text-green-300 transition-colors"
                    >
                      <Youtube className="h-6 w-6" />
                    </a>
                  </div> */}
                  </div>
                </div>
              </div>
            </footer>
        </div>

      
    </div>
  );
};

export default SocialToolKitLeaderboard;
