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

const SocialToolKitLeaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [clickHome, setClickHome] = useState(true);
  const [clickCreateOrg, setClickCreateOrg] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Challenge modal state
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
            {/* <div className="max-w-5xl mx-auto px-6 py-16"> */}
            {/* Hero Title */}
            {/* <h2 className="text-4xl md:text-5xl font-bold text-center  mb-8">
    About <span className="text-gray-100">STK</span> 
    <span className="block text-xl md:text-3xl font-medium text-teal-400 mt-3">
      Social Tool Kit
    </span>
  </h2> */}

            {/* <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"> */}
            {/* <div className="p-10 md:p-14 space-y-10 text-gray-700 text-lg leading-relaxed"> */}

            {/* Intro */}
            {/* <p className="text-xl md:text-2xl font-medium text-center text-gray-800">
        STK is a real-world social validation platform where actions speak louder than words.
      </p> */}

            {/* Core Description */}
            {/* <div className="space-y-8"> */}
            {/* <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-8 border border-teal-100">
          <p className="text-lg md:text-xl">
            Anyone can use the <strong>STK Android app</strong> to <span className="text-teal-700 font-bold">validate real-life actions</span> of others in three vital areas:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="text-4xl mb-3">Nature Care</div>
              <p className="text-gray-600">Protecting our planet</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">Animal Care</div>
              <p className="text-gray-600">Compassion for all beings</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">Human Care</div>
              <p className="text-gray-600">Kindness in action</p>
            </div>
          </div>
        </div> */}

            {/* Real-time Feedback */}
            {/* <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
          <p className="text-lg">
            See how the world perceives your behavior — <span className="font-bold text-blue-700">in real time</span>. 
            Every action you take can be recognized, validated, and celebrated by your community.
          </p>
        </div> */}

            {/* Personal Qualities */}
            {/* <div className="bg-purple-50 rounded-2xl p-8 border border-purple-100">
          <p className="text-lg mb-6">
            Every user has a unique social profile shaped by qualities across life contexts:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            {["Family", "School", "Work", "Civism", "Business"].map((context) => (
              <div key={context} className="bg-white rounded-xl py-4 px-3 shadow-sm border">
                <span className="font-semibold text-purple-700">{context}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-purple-800 font-medium">
            Others evaluate you. You grow. Society improves.
          </p>
        </div> */}

            {/* Data Ownership - Highlight */}
            {/* <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-8 text-center border border-amber-200">
          <p className="text-2xl font-bold text-amber-900">
            Your data. Your control. Always.
          </p>
          <p className="mt-3 text-amber-800">
            All information belongs 100% to you — private, secure, and never shared without consent.
          </p>
        </div> */}

            {/* Challenges & Groups */}
            {/* <div className="bg-gradient-to-br from-teal-600 to-cyan-700 rounded-2xl p-10 text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center">
            Challenges = Big Impact
          </h3>
          <p className="text-lg opacity-95 leading-relaxed text-center max-w-3xl mx-auto">
            Join or create <strong>registered groups</strong> to take on global challenges. 
            Complete them together → earn points → rise on the world leaderboard.
          </p>
          <div className="mt-8 text-center">
            <p className="text-sm uppercase tracking-wider opacity-80">
              Register your group via
            </p>
            <p className="text-xl font-bold mt-2">
              Top Menu → Register Group
            </p>
          </div>
        </div> */}
            {/* </div> */}

            {/* Final CTA Section */}
            {/* <div className="text-center py-12 bg-gray-50 rounded-2xl">
        <h3 className="text-3xl font-bold text-gray-900 mb-4">
          Global Leaderboard of Impact Groups
        </h3>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Coming soon: Live ranking of groups making the biggest real-world difference — 
          powered by verified actions and community validation.
        </p>
        <div className="mt-8 inline-block px-10 py-4 bg-teal-600 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-teal-700 transition">
          Your group belongs here
        </div>
      </div> */}
            {/* </div> */}
            {/* </div> */}
            {/* </div> */}
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
              {/* <h1 className="text-3xl font-bold text-teal-700 mb-6 text-center">
    Welcome to the Challenge Arena!
  </h1> */}

<div class="font-sans max-w-6xl mx-auto  px-6 py-12 
            bg-white/20 backdrop-blur-xl border border-gray-200 text-gray-100
            rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] ">                {/* <p>
      Please complete your <span className="font-semibold text-teal-600">group profile</span> with accurate information. 
      If you are the <span className="font-semibold">Group Leader</span>, continue below — all details will be verified by platform administration.
    </p>

    <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
      <p className="font-semibold text-amber-900 mb-2">Important Requirements</p>
      <ul className="list-disc list-inside space-y-1 text-amber-800">
        <li>You must own a verified domain with active email services</li>
        <li>All members must use a <span className="font-medium">Gmail account</span> within this platform</li>
      </ul>
    </div>

    <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-100">
      <h2 className="text-xl font-bold text-teal-800 mb-3">Leader-Only Features</h2>
      <ul className="space-y-3 text-gray-700">
        <li className="flex items-start gap-3">
          <span className="text-teal-600 mt-1">Lock</span>
          <span>Lock a challenge once <strong>more than 50% of your members</strong> have selected it</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="text-teal-600 mt-1">Upload</span>
          <span>Add a <strong>dedicated Gmail account</strong> to upload full-length solution videos (no 5-minute limit)</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="text-teal-600 mt-1">Promote</span>
          <span>Solved challenges earn points → higher ranking on the leaderboard & homepage promotion</span>
        </li>
      </ul>
    </div>

    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
      <p className="font-medium text-blue-900">
        Pro Tip: We recommend editing long recordings into a concise highlight reel (even if the solve took hours!)
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      <div className="bg-gray-50 rounded-lg p-5 border">
        <h3 className="font-bold text-gray-800 mb-2">Group Leader</h3>
        <p className="text-sm text-gray-600">
          • Add your own Gmail as a regular member in the members list<br />
          • Select & lock challenges<br />
          • Upload solution videos<br />
          • Earn points and climb rankings
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-5 border">
        <h3 className="font-bold text-gray-800 mb-2">Regular Members</h3>
        <p className="text-sm text-gray-600">
          • Browse and select available video-challenges<br />
          • Vote by selecting a challenge (helps leader lock it)<br />
          • Participate in solving locked challenges
        </p>
      </div>
    </div>

    <div className="mt-8 text-center">
      <p className="text-xl font-semibold text-teal-700">
        Challenges grow in value with every view.<br />
        Solve them. Earn points. Dominate the leaderboard.
      </p>
      <p className="mt-4 text-sm text-gray-500">
        Let’s build the strongest team — ready when you are!
      </p>
    </div> */}
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
        {/* <div className="h-48 w-full  bg-teal-800"></div> */}
        {/* <div></div> */}

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
    </div>
  );
};

export default SocialToolKitLeaderboard;
