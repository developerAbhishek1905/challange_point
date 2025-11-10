
import { Play, MapPin, Calendar, Eye } from "lucide-react";

export default function FeedDetails({ feed }) {
  if (!feed) {
    return (
      <div className="p-6 text-center text-gray-500">
        No feed data available
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">{feed.title}</h2>
          <p className="text-sm text-gray-500">{feed.description}</p>
        </div>
      </header>

      {/* Feed Overview */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
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
            </h3>

            <p className="text-sm text-gray-500 mb-4">
              Uploaded by:{" "}
              <span className="font-medium text-gray-700">
                {feed.youtubeUserName}
              </span>
            </p>

            <div className="flex items-center gap-3 mb-4">
              <img
                src={feed.youtubeUserImage}
                alt={feed.youtubeUserName}
                className="w-12 h-12 rounded-full object-cover"
              />
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
              <div className="flex items-center gap-2">
                <Eye size={16} />
                <span>{feed.youtubeViews.toLocaleString()} views</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>
                  {new Date(feed.youtubeDate).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
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
            <strong>Likes:</strong> {feed.likesCount}
          </li>
          <li>
            <strong>Points Awarded:</strong>{" "}
            {feed.likesPointsAwarded ? "Yes" : "No"}
          </li>
          <li>
            <strong>Created At:</strong>{" "}
            {new Date(feed.createdAt).toLocaleString()}
          </li>
          <li>
            <strong>Updated At:</strong>{" "}
            {new Date(feed.updatedAt).toLocaleString()}
          </li>
          {/* <li>
            <strong>Coordinates:</strong> Lat {feed.location.lat}, Lng{" "}
            {feed.location.lng}
          </li> */}
        </ul>
      </div>
    </div>
  );
}
