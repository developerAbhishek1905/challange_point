import { Empty } from "antd";
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
          Recent Results Announced
        </h2>
        <button
          className="text-sm text-blue-600 hover:underline font-medium"
          onClick={() => navigate("/leaderboard")}
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
                  Email
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
                  <td className="px-6 py-4 text-gray-800 font-medium">
                    {result.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {result.email}
                  </td>
                  <td className="px-6 py-4 text-gray-800 font-semibold">
                    {result.points}
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
