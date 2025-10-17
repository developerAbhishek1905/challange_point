import React from "react";
import { Empty, Popover } from "antd";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const UpcomingRacesTable = ({ data }) => {
  const navigate = useNavigate();

  const truncateWords = (text, num) => {
    if (!text) return "-";
    const words = text.split(" ");
    return words.length > num ? words.slice(0, num).join(" ") + "..." : text;
  };

  // ✅ show only top 5 challenges
  const topChallanges = data && data.length > 0 ? data.slice(0, 5) : [];

  return (
    <motion.div
      className="bg-white rounded-xl lg:col-span-2 border border-gray-300 divide-y divide-gray-300 h-fit"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-base font-semibold text-gray-900">Challenges</h2>
        <button
          className="text-sm text-blue-600 hover:underline font-medium"
          onClick={() => navigate("/events")}
        >
          View All
        </button>
      </div>

      {/* Table */}
      {topChallanges.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-800">
              <tr>
                <th className="px-6 py-3 text-left font-semibold tracking-wide w-1/3">
                  Title
                </th>
                <th className="px-6 py-3 text-left font-semibold tracking-wide w-1/4">
                  Date
                </th>
                <th className="px-6 py-3 text-left font-semibold tracking-wide w-1/3">
                  Address
                </th>
              </tr>
            </thead>

            <tbody>
              {topChallanges.map((product, idx) => (
                <motion.tr
                  key={product._id || idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="hover:bg-gray-50 transition-colors border-b last:border-0"
                >
                  <td className="px-6 py-4 align-middle text-gray-800">
                    <Popover content={product.title} title="Title">
                      <span className="block truncate max-w-[220px]">
                        {truncateWords(product.title, 4)}
                      </span>
                    </Popover>
                  </td>

                  <td className="px-6 py-4 align-middle text-gray-700">
                    <Popover
                      content={
                        product.expireAt
                          ? new Date(product.expireAt).toISOString().split("T")[0]
                          : "-"
                      }
                      title="Date"
                    >
                      <span>
                        {product.expireAt
                          ? new Date(product.expireAt).toISOString().split("T")[0]
                          : "-"}
                      </span>
                    </Popover>
                  </td>

                  <td className="px-6 py-4 align-middle text-gray-700">
                    <Popover content={product.address} title="Address">
                      <span className="block truncate max-w-[220px]">
                        {truncateWords(product.address, 4)}
                      </span>
                    </Popover>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex justify-center items-center py-10">
          <Empty
            description="No challenges found"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      )}
    </motion.div>
  );
};

export default UpcomingRacesTable;
