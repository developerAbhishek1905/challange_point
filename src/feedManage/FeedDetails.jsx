
import {X, Play, MapPin, Calendar, Eye } from "lucide-react";
import { useState } from "react";


const reportCount = [
  {
    profile: "https://randomuser.me/api/portraits/men/1.jpg",
    name: "Amit Sharma",
    email: "amit.sharma@example.com",
    comment: "Inappropriate content found in the post. ",
  },
  {
    profile: "https://randomuser.me/api/portraits/women/2.jpg",
    name: "Priya Mehta",
    email: "priya.mehta@example.com",
    comment: "Spam links shared repeatedly.",
  },
  {
    profile: "https://randomuser.me/api/portraits/men/3.jpg",
    name: "Rahul Verma",
    email: "rahul.verma@example.com",
    comment: "Harassment reported in chat.",
  },
  {
    profile: "https://randomuser.me/api/portraits/women/4.jpg",
    name: "Sneha Kapoor",
    email: "sneha.kapoor@example.com",
    comment: "False information being shared.",
  },
  {
    profile: "https://randomuser.me/api/portraits/men/5.jpg",
    name: "Vikram Singh",
    email: "vikram.singh@example.com",
    comment: "User using offensive language.",
  },
  {
    profile: "https://randomuser.me/api/portraits/women/6.jpg",
    name: "Anjali Gupta",
    email: "anjali.gupta@example.com",
    comment: "Duplicate posts cluttering the feed.",
  },
  {
    profile: "https://randomuser.me/api/portraits/men/7.jpg",
    name: "Rohit Malhotra",
    email: "rohit.malhotra@example.com",
    comment: "Fake profile suspected.",
  },
  {
    profile: "https://randomuser.me/api/portraits/women/8.jpg",
    name: "Kritika Jain",
    email: "kritika.jain@example.com",
    comment: "Scam attempts through messages.",
  },
  {
    profile: "https://randomuser.me/api/portraits/men/9.jpg",
    name: "Aditya Khanna",
    email: "aditya.khanna@example.com",
    comment: "Unauthorized promotional content.",
  },
  {
    profile: "https://randomuser.me/api/portraits/women/10.jpg",
    name: "Nisha Yadav",
    email: "nisha.yadav@example.com",
    comment: "Plagiarized content detected.",
  },
  {
    profile: "https://randomuser.me/api/portraits/men/11.jpg",
    name: "Saurabh Chauhan",
    email: "saurabh.chauhan@example.com",
    comment: "Misleading profile information.",
  },
  {
    profile: "https://randomuser.me/api/portraits/women/12.jpg",
    name: "Tanya Bhatia",
    email: "tanya.bhatia@example.com",
    comment: "Offensive memes shared publicly.",
  },
  {
    profile: "https://randomuser.me/api/portraits/men/13.jpg",
    name: "Karan Joshi",
    email: "karan.joshi@example.com",
    comment: "Fake giveaways being promoted.",
  },
  {
    profile: "https://randomuser.me/api/portraits/women/14.jpg",
    name: "Neha Reddy",
    email: "neha.reddy@example.com",
    comment: "User spreading hate speech.",
  },
  {
    profile: "https://randomuser.me/api/portraits/men/15.jpg",
    name: "Arjun Nair",
    email: "arjun.nair@example.com",
    comment: "Suspicious login activities detected.",
  },
];



export default function FeedDetails({ feed, report }) {

      const [showReportCount, setShowReportCount] = useState(false)
        const [loading, setLoading] = useState(false);
      
    
  if (!feed) {
    return (
      <div className="p-6 text-center text-gray-500">
        No feed data available
      </div>
    );
  }

  console.log(report)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      {/* <header className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">{feed.title}</h2>
          <p className="text-sm text-gray-500">{feed.description}</p>
        </div>
      </header> */}

      {/* Feed Overview */}
      <div className="bg-white rounded-xl mt-8 shadow-sm border overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left: YouTube Thumbnail */}
          <div className="md:w-1/2 relative">
            <img
              src={feed.youtubeThumbnail}
              alt={feed.youtubeVideoTitle}
              className="w-full h-72 object-cover"
            />
            <a
              href={feed.videos}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition"
            >
              <Play className="text-white w-14 h-14" />
            </a>
          </div>

          {/* Right: Feed Info */}
          <div className="p-6 flex-1">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              {feed.youtubeVideoTitle}
                        <p className="text-sm text-gray-500">{feed.description}</p>

            </h3>

            <p className="text-sm text-gray-500 mb-4">
              Uploaded by:{" "}
              <span className="font-medium text-gray-700">
                {feed.youtubeUserName}
              </span>
            </p>

            <div className="flex items-center gap-3 mb-4">
              {/* <img
                src={feed.youtubeUserImage}
                alt={feed.youtubeUserName}
                className="w-12 h-12 rounded-full object-cover"
              /> */}
              <div className="bg-gray-300 w-10 h-10 rounded-full flex items-center justify-center text-gray-700 font-semibold">
  {feed?.uploadedBy?.name?.charAt(0)?.toUpperCase() || "?"}
</div>

              <div>
                <p className="font-medium text-gray-800">
                  {feed.uploadedBy?.name}
                </p>
                <p className="text-sm text-gray-500">
                  {feed.uploadedBy?.email}
                </p>
              </div>
            </div>

            <div className="text-sm text-gray-500 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>{feed.address}</span>
              </div>
              {/* <div className="flex items-center gap-2">
                <Eye size={16} />
                <span>{feed.youtubeViews.toLocaleString()} views</span>
              </div> */}
              <div className="flex items-center gap-2">
                {/* <Calendar size={16} /> */}
                {/* <span>
                  {new Date(feed.youtubeDate).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="bg-gray-50 border rounded-xl p-4">
        <h4 className="font-semibold text-gray-800 mb-2">Feed Summary</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          {/* <li>
            <strong>Feed ID:</strong> {feed._id}
          </li> */}
          <li>
            <strong>Approved:</strong> {feed.likesCount}
          </li>
          <li>
            <strong>Denied:</strong> {feed.dislikesCount}
          </li>
          <li>
            <strong>Report Count: </strong>{" "}
            {report?.length}
             
  <button
    onClick={() => setShowReportCount(true)}
    className="text-blue-600 hover:underline ml-1"
  >
    View Reports
  </button>
          </li>
          {/* <li>
            <strong>Points Awarded:</strong>{" "}
            {feed.likesPointsAwarded ? "Yes" : "No"}
          </li> */}
          <li>
            <strong>Created At:</strong>{" "}
            {new Date(feed.createdAt).toLocaleString()}
          </li>
          
          {/* <li>
            <strong>Coordinates:</strong> Lat {feed.location.lat}, Lng{" "}
            {feed.location.lng}
          </li> */}
        </ul>
 
      </div>
      {showReportCount && (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg relative p-6">
      {/* ❌ Close Button */}
      <button
        onClick={() => setShowReportCount(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
      >
        <X className="w-6 h-6" />
      </button>

      {/* 🧾 Title */}
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Reported Users
      </h3>

      {/* 🌀 Loader or No Data */}
      {loading ? (
        <p className="text-center text-gray-500">Loading reports...</p>
      ) : report?.length === 0 ? (
        <p className="text-center text-gray-500">
          No reports found.
        </p>
      ) : (
        <ul className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
  {report?.map((report, index) => {
    const formattedDate = new Date(report.updatedAt
).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    return (
      <li key={index} className="py-3 flex items-start gap-3">
        
        {/* Profile Initial */}
        <div className="w-10 h-10 flex items-center justify-center bg-gray-300 text-xl font-bold text-gray-700 rounded-full">
          {report?.reportedBy?.name?.charAt(0)?.toUpperCase()}
        </div>

        {/* User Info */}
        <div className="flex-1">
          <p className="font-semibold text-gray-800">{report.reportedBy.name}</p>
          <p className=" text-sm text-gray-500">{report.reportedBy.email}</p>
          <p className="text-base text-gray-800 mt-1">{report.reason}</p>

          {/* Date + Time */}
          <p className="text-xs text-gray-500">{formattedDate}</p>
        </div>
      </li>
    );
  })}
</ul>
      )}
    </div>
  </div>
)}
    </div>
  );
}
