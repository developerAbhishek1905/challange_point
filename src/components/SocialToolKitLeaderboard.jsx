import React, { useEffect, useState } from "react";
import {
  Crown,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
} from "lucide-react";
import { getLeaderboard, getGroupChallangeInfoById } from "../utils/api";
import CreateOrganization from "./Organizations/CreateOrganization";
import { Popover } from "antd";

const SocialToolKitLeaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [clickHome, setClickHome] = useState(true);
  const [clickCreateOrg, setClickCreateOrg] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [challengeList, setChallengeList] = useState([]);
  const [challengeGroupName, setChallengeGroupName] = useState("");
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  const toggleDescription = (index) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

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

  console.log(clickCreateOrg);
  console.log(clickHome);

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

  // open modal with dummy 5 challenges for a group
  const openChallengesModal = async (group) => {
    console.log(group);

    try {
      setShowChallengeModal(true);

      const res = await getGroupChallangeInfoById(group.id);
      console.log(res.challenges);

      setChallengeList(res.challenges || []);
      // return data.challenges || [];
    } catch (error) {
      console.error("Error fetching challenges for group:", error);
    }

    // setChallengeList(dummy);
    // setChallengeGroupName(group?.name ?? group?.companyName ?? "Group");
    // setShowChallengeModal(true);
  };
  console.log(challengeList);
  const closeChallengesModal = () => setShowChallengeModal(false);

  const handleDownloadClick = () => {
    setIsPopoverVisible(!isPopoverVisible);
  };

  return (
    <div className="min-h-screen flex flex-col items-center ">
      {/* Header */}
      <div className="p-6 md:p-8 flex flex-col items-center bg-gradient-to-br from-teal-800 via-teal-700 to-teal-900 w-full">
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
                Register Group
              </div>
                   <Popover
        content={
          <div>
            <img
              src="./bing_generated_qrcode.png"
              alt="APK Download QR Code"
              className="w-64 h-64 object-contain"
            />
          </div>
        }
        // title="Download APK"
        trigger="click"
        visible={isPopoverVisible}
        onVisibleChange={setIsPopoverVisible}
      >
              <div
                onClick={handleDownloadClick}
                className="hover:text-green-200 transition-colors cursor-pointer"
              >
                Download APK
              </div>
              </Popover>
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
                Register Group
              </div>
            </div>
          )}
        </nav>

        {/* Hero Section */}

        {clickHome && (
          <div className=" mx-auto text py-12 md:py-20 ">
           
           <div class="font-sans max-w-6xl mx-auto mt-16 mb-20 px-6 py-12 
            bg-white/20 backdrop-blur-xl border border-gray-200 
            rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] ">

  {/* <!-- Heading Section --> */}
  <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-6">
    About <span class="text-gray-100">STK (Social Tool Kit)</span>
  </h1>

  {/* <!-- Subheading / Intro --> */}
  <p class="text-lg text-gray-100 mb-8">
    STK is a platform designed to validate actions, promote positive behavior, 
    and create meaningful impact across communities worldwide.
  </p>

  {/* <!-- Highlight Card --> */}
  <div class="bg-green-50 border border-green-200 rounded-xl p-5 my-8">
    <p class="text-gray-900 font-semibold text-lg">
      “Every user controls how their actions are represented through real-time validated performance.”
    </p>
  </div>

  {/* <!-- Body Paragraphs --> */}
  <p class="text-lg text-gray-100 mb-5">
    STK empowers individuals to validate each other's actions in different contexts 
    such as Nature Care, Animal Care, and Human Care. These interactions shape how 
    users are viewed during different moments of their real-time performance.
  </p>

  <p class="text-lg text-gray-100 mb-5">
    Every user can develop personal qualities within multiple environments like 
    Family, School, Work, Business, and Civism. These qualities help others understand 
    their contribution and performance in community-driven activities.
  </p>

  {/* <!-- Notice Box --> */}
  <div class="bg-gray-100 border border-gray-200 rounded-xl p-4 my-6">
    <p class="text-lg font-medium text-gray-800">
      🔐 All user data is fully owned and controlled by the user.
    </p>
  </div>

  <p class="text-lg text-gray-100">
    Challenges represent larger collective actions. Groups play a major role 
    in these challenges and can register themselves through the “Register Group” 
    option available in the Top Menu. Registered groups are showcased to highlight 
    meaningful contributions that positively impact communities globally.
  </p>
</div>

          </div>
        )}

        {clickCreateOrg && (
          <div className="max-w-6xl mx-auto text-center py-12 md:py-20 ">
            <div className=" bg-white/20 max-w-6xl mx-auto p- rounded-2xl shadow-lg border border-gray-100">
              

<div class="font-sans max-w-6xl mx-auto  px-6 py-12 
            bg-white/20 backdrop-blur-xl border border-gray-200 text-gray-100
            rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] ">                
                Welcome to this Challenge. Please add the correct information
                about your members group. If you are the group leader, please
                continue. All information needs to be valid, and will be
                validated by the administration of this platform. You need to
                own your domain site, with email services to make group
                registration possible. All users need to use a Gmail account,
                within this application usage. Leaders can Lock challenges to
                solve them and get promotion in the main page of this site. We
                add an option to each leader, to add a dedicated Gmail account
                to upload the videos made with their group. These videos can be
                longer than 5 minutes, and we suggest you to edit and make a
                resume of that event, since some of these challenging events can
                take you some hours to solve. In the group members input box,
                the leader should add his own Gmail account as a regular user.
                Regular group members can only select the video-challenges. All
                user members that will participate in solving the selected
                challenge, need to select the challenge, before leaders can lock
                the challenge. We assume that more than 50% of members select
                the challenge to be able to lock it. Challenges grow in points,
                for each user who views the challenge. After the challenge is
                locked, and the challenge is solved, the group gets the number
                of points associated with that challenge. These points will be
                used to put your group above or below other groups.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="w-full flex flex-col items-center bg-gray-50 pt-12 ">
       

        {clickHome && (
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
                          Group Name
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                          All Points
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                          Number of Members
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                          Approved Challanges
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboardData.length > 0 ? (
                        leaderboardData.map((item, index) => (
                          <tr
                            key={index}
                            className={
                              index % 2 === 0 ? "bg-green-50" : "bg-white"
                            }
                          >
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {index + 1}
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
                            <td className="px-6 py-4 text-sm text-blue-600 hover:text-blue-800">
                              {/* <a href={`mailto:${item.email}`}>{item.email}</a> */}
                              <button
                                onClick={() => openChallengesModal(item)}
                                className="underline text-blue-600 hover:text-blue-800"
                              >
                                {item.rateChallengeCount ?? 0}
                              </button>
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
                <a href="#" className="hover:text-green-300 transition-colors">
                  Terms & Conditions
                </a>
                <a href="#" className="hover:text-green-300 transition-colors">
                  Privacy Policy
                </a>
              </div>
              <div className=" h-[1px] w-full bg-white"></div>
              <div className="flex justify-around mt-8">
                <p className="text-sm opacity-75">
                  © PresentYear STK - All rights reserved
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
      </main>

      {/* Challenges Modal */}
      {showChallengeModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">
                Approved Challenges — {challengeGroupName}
              </h3>
              <button
                onClick={closeChallengesModal}
                className="text-gray-600 hover:text-gray-900"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-3 max-h-80 overflow-y-auto">
              {challengeList?.length > 0 ? (
                challengeList.map((c, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all"
                  >
                    {/* Title */}
                    <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-start gap-2">
                      <span className="text-blue-600 font-bold">{i + 1}.</span>
                      {c?.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {expandedDescriptions[i] || c.description.length <= 100
                        ? c.description
                        : c.description.slice(0, 100) + "... "}

                      {/* Read More / Less Button */}
                      {c.description.length > 100 && (
                        <button
                          onClick={() => toggleDescription(i)}
                          className="text-blue-600 font-medium ml-1 hover:underline"
                        >
                          {expandedDescriptions[i] ? "Read Less" : "Read More"}
                        </button>
                      )}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No approved challenges found.</p>
              )}
            </div>
            <div className="flex justify-end gap-3 p-4 border-t">
              <button
                onClick={closeChallengesModal}
                className="px-4 py-2 rounded-md border hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Download APK Popover */}
      {/* <Popover
        content={
          <div>
            <img
              src="/path-to-your-image.jpg"
              alt="APK Download QR Code"
              className="w-64 h-64 object-contain"
            />
          </div>
        }
        title="Download APK"
        trigger="click"
        visible={isPopoverVisible}
        onVisibleChange={setIsPopoverVisible}
      >
        <div className="hover:text-green-200 transition-colors cursor-pointer">
          Download APK
        </div>
      </Popover> */}
    </div>
  );
};

export default SocialToolKitLeaderboard;
