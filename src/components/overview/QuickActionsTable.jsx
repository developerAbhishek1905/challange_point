import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import TotalEventsIcon from "../../../public/icons/TotalEventsIcon.svg";
import ActiveEventsIcon from "../../../public/icons/ActiveEventsIcon.svg";
import TotalOrganizationsIcon from "../../../public/icons/TotalOrganizationsIcon.svg";
import { useNavigate } from "react-router-dom";

const recentResults = [
  {
    title: "Create Events",
    icon: TotalEventsIcon,
    path:'/events'
  },
  {
    title: "Create Organizations",
    icon: ActiveEventsIcon,
    path:'/organization'
  },
  {
    title: "Create Users",
    icon: TotalOrganizationsIcon,
    path:'/users'
  },
];

const QuickActionsTable = () => {
    const navigate = useNavigate();
  
  return (
    <>
    <motion.div
      className="bg-white  border border-gray-200 divide-y divide-gray-300 rounded-xl h-fit"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-900">Quick Actions</h2>
        {/* <button className="text-sm text-gray-500 hover:underline">
          View All
        </button> */}
      </div>

      <div>
        {recentResults.map((result, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between px-4 py-4"
          >
            <div className="text-sm">
              <span className="flex items-center text-sm font-medium text-gray-400">
                <img src={result.icon} alt="icon" className="w-7 h-7 mr-2" />
                <p className="font-semibold text-gray-600">{result.title}</p>
              </span>
            </div>
            <button className=" text-gray-600 px-4 py-1.5 rounded-md" onClick={()=>navigate(result.path)}>
              <ArrowRight size={20} />
            </button>
          </div>
        ))}
      </div>
    </motion.div>
    </>
  );
};
export default QuickActionsTable;
