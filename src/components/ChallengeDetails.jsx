import React, { useState } from "react";
import {
  MapPin,
  Calendar,
  Eye,
  Heart,
  User,
  PlayCircle,
  X,
} from "lucide-react";
import { getAllMembers } from "../utils/api";

const ChallengeDetails = ({ data }) => {
  const [members, setMembers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!data)
    return (
      <div className="text-center py-10 text-gray-600">
        No challenge data available.
      </div>
    );

  // Fetch Members when "View Members" clicked
  const handleViewMembers = async () => {
    setLoading(true);
    try {
      const res = await getAllMembers(data._id); // assuming data._id is challenge id
      setMembers(res.data || []);
      setShowMembers(true);
    } catch (err) {
      console.error("Failed to load members", err);
      setMembers([]);
      setShowMembers(true);
    } finally {
      setLoading(false);
    }
  };

  // Open video when thumbnail or button clicked
  const handleVideoClick = () => {
    if (data.video) {
      window.open(data.video, "_blank");
    }
  };

  return (
    <div className="p-6 lg:p-10 relative">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
        {/* LEFT SIDE - Video Thumbnail */}
        <div className="w-full lg:w-2/5">
          <div
            onClick={handleVideoClick}
            className="rounded-xl overflow-hidden shadow-md relative cursor-pointer group"
          >
            <img
              src={data.youtubeThumbnail || "/placeholder.png"}
              alt={data.title}
              className="w-full h-60 sm:h-72 md:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-3 left-3 bg-black/60 px-3 py-1 rounded-md text-white text-xs uppercase tracking-wide">
              {data.status || "unknown"}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/50 rounded-full p-3 group-hover:bg-black/70 transition">
                <PlayCircle className="text-white w-10 h-10" />
              </div>
            </div>
          </div>

          {/* YouTube Info */}
          <div className="flex items-center gap-3 mt-4">
            <img
              src={data.youtubeUserImage}
              alt={data.youtubeUserName}
              className="w-10 h-10 rounded-full border"
            />
            <div>
              <p className="font-semibold text-gray-800">
                {data.youtubeUserName}
              </p>
              <p className="text-sm text-gray-500">
                {data.youtubeViews?.toLocaleString()} views
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Challenge Info */}
        <div className="flex-1 space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{data.title}</h2>
            <p className="text-gray-600 mt-2 leading-relaxed">
              {data.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <span>Uploaded by: {data.uploadedBy?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>
                {data.uploadedAt
                  ? new Date(data.uploadedAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>{data.address}</span>
            </div>
          </div>

          {/* Points + Likes */}
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 font-medium">
              Points: {data.points}
            </span>
            <span className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-lg text-gray-700 font-medium">
              <Heart className="w-4 h-4 text-red-500" /> {data.likesCount}
            </span>
            <span className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-lg text-gray-700 font-medium">
              <Eye className="w-4 h-4 text-blue-500" />{" "}
              {data.youtubeViews?.toLocaleString()}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-4">
            

            <button
              onClick={handleViewMembers}
              className="flex items-center gap-2 border border-gray-300 hover:bg-gray-100 text-gray-800 px-5 py-2.5 rounded-lg font-medium transition-all"
            >
              View Members{" "}
              <div className="bg-blue-500 w-6 aspect-square text-center text-sm leading-6 text-white rounded-full">
                {data?.members?.length || 0}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* MEMBERS MODAL */}
      {showMembers && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg relative p-6">
            <button
              onClick={() => setShowMembers(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Challenge Members
            </h3>

            {loading ? (
              <p className="text-center text-gray-500">Loading members...</p>
            ) : members.length === 0 ? (
              <p className="text-center text-gray-500">
                No members found for this challenge.
              </p>
            ) : (
              <ul className="divide-y divide-gray-200 max-h-72 overflow-y-auto">
                {members.map((member) => (
                  <li
                    key={member._id}
                    className="py-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatar || "/default-user.png"}
                        alt={member.name}
                        className="w-10 h-10 rounded-full border"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">
                          {member.name}
                        </p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600">
                      {member.role || "Member"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeDetails;
