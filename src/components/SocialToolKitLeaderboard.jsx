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


const leaderboardData = [
  {
    organization_name: "TechNova Solutions",
    organization_point: "92",
    organization_member_count: 45,
  },
  {
    organization_name: "NextGen Innovators",
    organization_point: "88",
    organization_member_count: 30,
  },
  {
    organization_name: "PixelWave Studios",
    organization_point: "76",
    organization_member_count: 22,
  },
  {
    organization_name: "AlphaSoft Technologies",
    organization_point: "95",
    organization_member_count: 58,
  },
  {
    organization_name: "EcoBuild Systems",
    organization_point: "82",
    organization_member_count: 34,
  },
  {
    organization_name: "UrbanEdge Designs",
    organization_point: "79",
    organization_member_count: 27,
  },
  {
    organization_name: "CyberSphere Labs",
    organization_point: "91",
    organization_member_count: 41,
  },
  {
    organization_name: "QuantumWorks Pvt Ltd",
    organization_point: "85",
    organization_member_count: 39,
  },
  {
    organization_name: "DataHive Analytics",
    organization_point: "98",
    organization_member_count: 52,
  },
  {
    organization_name: "BrightPath Consulting",
    organization_point: "73",
    organization_member_count: 18,
  },
  {
    organization_name: "CoreVision Industries",
    organization_point: "90",
    organization_member_count: 49,
  },
  {
    organization_name: "CodeCrafters Hub",
    organization_point: "87",
    organization_member_count: 35,
  },
  {
    organization_name: "MetaLink Solutions",
    organization_point: "93",
    organization_member_count: 55,
  },
  {
    organization_name: "GreenWave Energy",
    organization_point: "80",
    organization_member_count: 29,
  },
  {
    organization_name: "Visionary Minds",
    organization_point: "89",
    organization_member_count: 38,
  },
];

// 🏆 Sort leaderboard data
const sortedData = [...leaderboardData].sort((a, b) => b.points - a.points);
const topThree = sortedData.slice(0, 3);
const tableData = sortedData.slice(3); // start from 4th rank

const SocialToolKitLeaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [clickHome, setClickHome] = useState(true);
  const [clickCreateOrg, setClickCreateOrg] = useState(false);

  const handleNavClick = (page) => {
    setClickHome(page === "home");
    setClickCreateOrg(page === "createOrg");
  };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard();
        console.log(data.leaderboard);
        setLeaderboardData(data.leaderboard || []);
      } catch (error) {
        setLeaderboardData([]);
      }
    };
    fetchLeaderboard();
  }, []);

  

  // const CompanyCard = ({
  //   organization_name,
  //   organization_point,
  //   organization_member_count,
  // }) => (
  //   <div
  //     className={`bg-green-700 text-white rounded-lg p-6 ${
  //       isTop ? "transform -translate-y-4" : ""
  //     } relative`}
  //   >
  //     <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
  //       <div className="bg-white rounded-full p-2 border-green-700 border-[8px] ">
  //         <Crown className={`h-8 w-8 ${crownColor}`} />
  //       </div>
  //     </div>
  //     <div className="text-center mt-4">
  //       <h3 className="font-semibold text-lg mb-4">{points}</h3>
  //       <div className="flex justify-between text-sm mb-4">
  //         <div>
  //           <p className="text-gray-300">Organization</p>
  //           <p className="font-semibold">{}</p>
  //         </div>
  //         <div>
  //           <p className="text-gray-300">Employee</p>
  //           <p className="font-semibold">{organization_member_count}</p>
  //         </div>
  //       </div>
  //       <p className="text-sm">{website}</p>
  //     </div>
  //   </div>
  // );


  const CompanyCard = ({ organization_name,
    organization_point,
    organization_member_count, isTop, crownColor, position }) => (
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
    <h3 className="font-semibold text-gray-800 mt-2">{organization_name}</h3>
    <p className="text-gray-500 text-sm">Points: {organization_point}</p>
    <p className="text-gray-500 text-sm">Members: {organization_member_count}</p>
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
      <div className="p-8 flex flex-col items-center bg-gradient-to-br from-teal-800 via-teal-700 w-full  to-teal-900">
        <nav className="bg-[#7a9d72]  w-[80%] backdrop-blur-sm rounded-lg mx-4 px-10 p-4">
          <div className="flex justify-between items-center">
            <div className="text-white">
              <h1 className="text-5xl font-bold">STK</h1>
              <p className="text-sm opacity-90">SOCIAL TOOL KIT</p>
            </div>
            <div className=" flex gap-10 text-white text-lg">
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
            <div className="md:hidden">
              <button className="text-white">
                <svg
                  className="h-6 w-6"
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
        </nav>

        {/* Hero Section */}
        <div className="text-center py-16 ">
          <h2 className="text-white text-3xl md:text-4xl font-bold mb-8">
            UNDER HARD DEVELOPMENT - DEMONSTRATION
            <br />
            STATIC PAGE
          </h2>
          <p className="text-[#2E4629] text-lg md:text-3xl font-bold">
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
      {clickHome && (
        <div className="absolute min-h-screen w-full flex flex-col items-center md:top-[50%] top-[70%]">
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
        <div className="text-center mb-8">
          <button className="text-gray-600 hover:text-gray-800 font-medium">
            View All Leaderboard &gt;
          </button>
        </div>

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
                    Name
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
                      className={index % 2 === 0 ? "bg-green-50" : "bg-white"}
                    >
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {index + 4}
                      </td>
                      
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {item.organization_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.organization_point}
                      </td>
                      <td className="px-6 py-4 text-sm text-blue-600 hover:text-blue-800">
                        {/* <a href={`mailto:${item.email}`}>{item.email}</a> */}
                        {item.organization_member_count}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
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
      )}

      {clickCreateOrg && (
        <div className=" min-h-screen w-full flex flex-col items-center justify-center md:top-[50%] top-[70%]">
          <CreateOrganization></CreateOrganization>
        </div>
      )}
    </div>
  );
};

export default SocialToolKitLeaderboard;
