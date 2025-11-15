import { Empty,Popover } from "antd";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const RecentResultTable = ({ data }) => {
  const navigate = useNavigate();

  // Show only top 5 results
  const topResults = data && data.length > 0 ? data.slice(0, 5) : [];

  return (
    <motion.div
      className="bg-white rounded-xl lg:col-span-2 border border-gray-300 divide-y divide-gray-300 h-fit"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-base font-semibold text-gray-900">
          Feeds
        </h2>
        <button
          className="text-sm text-blue-600 hover:underline font-medium"
          onClick={() => navigate("/feed")}
        >
          View All
        </button>
      </div>

      {/* Table */}
      {topResults.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-800">
              <tr>
                <th className="px-6 py-3 text-left font-semibold tracking-wide w-1/3">
                  Name
                </th>
                <th className="px-6 py-3 text-left font-semibold tracking-wide w-1/3">
                  Uploded By
                </th>
                <th className="px-6 py-3 text-left font-semibold tracking-wide w-1/3">
                  Points
                </th>
              </tr>
            </thead>

            <tbody>
              {topResults.map((result, idx) => (
                <motion.tr
                  key={result._id || idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="hover:bg-gray-50 border-b last:border-0 transition-colors"
                >
                  <td className="px-6 py-3 text-sm font-medium flex items-center">
  {/* Handle 4-word limit */}
  <Popover
    content={<span>{result.title}</span>}
    title="Full Title"
    trigger="hover"
  >
    <span className="cursor-pointer">
      {result.title.split(" ").slice(0, 4).join(" ")}
      {result.title.split(" ").length > 4 ? "..." : ""}
    </span>
  </Popover>

  {/* Report Badge */}
  {(result.dislikesCount >= 7 || result?.reports?.length >= 7) && (
    <span className="inline-flex items-center gap-1 px-2 py-1 ml-2 rounded-full text-xs bg-red-500 text-white">
      Reported
    </span>
  )}
</td>

                  <td className="px-6 py-4 text-gray-600">
                    {result.uploadedBy.name}
                  </td>
                  <td className="px-6 py-4 text-gray-800 font-semibold">
                    {result.likesCount}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex justify-center items-center py-10">
          <Empty
            description="No results found"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      )}
    </motion.div>
  );
};

export default RecentResultTable;
