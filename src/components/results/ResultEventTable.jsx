import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { Empty, Pagination } from "antd";
import { useNavigate } from "react-router-dom";

// Hardcoded events data
const initialEvents = [
  {
    _id: "e1",
    event_name: "Annual Sports Meet",
    event_code: "CHE001",
    date: "2025-09-20",
    time: "10:00",
    venue: "Main Stadium",
    organization_name: "Checkpoint Org",
    organization_id: { _id: "org1" },
    category_id: [
      { _id: "cat1", category_name: "Track" },
      { _id: "cat2", category_name: "Field" }
    ],
    totalParticipants: 120
  },
  {
    _id: "e2",
    event_name: "Science Fair",
    event_code: "CHE002",
    date: "2025-10-05",
    time: "09:00",
    venue: "Auditorium",
    organization_name: "Checkpoint Org",
    organization_id: { _id: "org1" },
    category_id: [
      { _id: "cat3", category_name: "Robotics" }
    ],
    totalParticipants: 80
  }
];

const ResultEventTable = ({
  showModal,
  setShowModal,
  modalMode,
  setModalMode,
  user,
}) => {
  const [allEvents, setAllEvents] = useState(initialEvents);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [totatItems, setTotalItems] = useState(initialEvents.length);

  const navigate = useNavigate();

  // Pagination logic
  const pagedEvents = allEvents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <motion.div
        className="bg-white border border-gray-200 rounded-xl mb-8 pb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="overflow-x-auto rounded-xl">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-5 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Event Name
                </th>
                <th className="px-6 py-5 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-5 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Venue
                </th>
                <th className="px-6 py-5 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Organization
                </th>
                <th className="px-6 py-5 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Categories
                </th>
                <th className="px-6 py-5 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Participants
                </th>
                <th className="px-6 py-5 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {pagedEvents && pagedEvents.length > 0 ? (
                pagedEvents.map((product) => (
                  <motion.tr
                    key={product._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() =>
                      navigate(`/result/${product.event_name}`, {
                        state: { eventId: product._id },
                      })
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 flex gap-2 items-center">
                      {product.event_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {product.date
                        ? new Date(product.date).toISOString().split("T")[0]
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {product.venue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {product.organization_name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {product.category_id
                        ?.map((cat) => cat.category_name)
                        .join(", ") || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {product.totalParticipants}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      Ongoing
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-8">
                    <Empty
                      description="No events found"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          align="end"
          defaultCurrent={currentPage}
          total={totatItems}
          pageSize={pageSize}
          showSizeChanger={false}
          onChange={handlePageChange}
        />
      </motion.div>
    </>
  );
};
export default ResultEventTable;
