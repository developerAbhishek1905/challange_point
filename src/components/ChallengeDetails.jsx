import React from "react";
import { MapPin, Calendar, Eye, Heart, User, PlayCircle } from "lucide-react";

const ChallengeDetails = ({ data }) => {
  if (!data)
    return (
      <div className="text-center py-10 text-gray-600">
        No challenge data available.
      </div>
    );

  return (
    <div className="p-6 lg:p-10">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
        {/* LEFT SIDE - Video Thumbnail */}
        <div className="w-full lg:w-2/5">
          <div className="rounded-xl overflow-hidden shadow-md relative">
            <img
              src={data.youtubeThumbnail || "/placeholder.png"}
              alt={data.title}
              className="w-full h-60 sm:h-72 md:h-80 object-cover"
            />
            <div className="absolute top-3 left-3 bg-black/60 px-3 py-1 rounded-md text-white text-xs uppercase tracking-wide">
              {data.status || "unknown"}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/50 rounded-full p-3">
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
              <p className="font-semibold text-gray-800">{data.youtubeUserName}</p>
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
              <span>{new Date(data.uploadedAt).toLocaleDateString()}</span>
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
              onClick={() =>
                window.open(
                  `https://www.youtube.com/watch?v=${data.youtubeVideoTitle}`,
                  "_blank"
                )
              }
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all"
            >
              Watch Video
            </button>
            <button className="border border-gray-300 hover:bg-gray-100 text-gray-800 px-5 py-2.5 rounded-lg font-medium transition-all">
              View Submissions
            </button>
            <button className="border border-gray-300 hover:bg-gray-100 text-gray-800 px-5 py-2.5 rounded-lg font-medium transition-all">
              Add Members
            </button>
          </div>
        </div>
      </div>

      {/* MAP PREVIEW */}
      {/* <div className="mt-10">
        <div className="bg-white shadow-md rounded-xl p-4">
          <h3 className="font-semibold text-lg mb-3 text-gray-800">Location</h3>
          <iframe
            title="map"
            width="100%"
            height="250"
            className="rounded-lg border"
            src={`https://maps.google.com/maps?q=${data.location.lat},${data.location.lng}&z=15&output=embed`}
            allowFullScreen
          ></iframe>
        </div>
      </div> */}
    </div>
  );
};

export default ChallengeDetails;
