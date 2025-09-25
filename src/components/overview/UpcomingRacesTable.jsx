import { Empty } from "antd";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const UpcomingRacesTable = ({ data }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      className="bg-white rounded-xl lg:col-span-2 border border-gray-300 divide-y divide-gray-300 h-fit"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-900">Upcoming Races</h2>
        <button className="text-sm text-gray-500 hover:underline"  onClick={()=>navigate('/events')}>
          View All
        </button>
      </div>

      <div>
        {data && data.length > 0 ? (
          data.map((result, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between px-4 py-4"
            >
              <div className="text-sm">
                <p className="font-semibold text-gray-900">
                  {result.event_name}
                </p>
                <p className="text-gray-500 whitespace-pre-line">
                  {result.event_code}
                </p>
              </div>
              <button className=" text-gray-900 text-xs font-medium px-4 py-1.5 ">
                {result.createdAt
                  ? new Date(result.createdAt).toISOString().split("T")[0]
                  : "-"}
              </button>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center py-6">
            <Empty
              description="No races found"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};
export default UpcomingRacesTable;
