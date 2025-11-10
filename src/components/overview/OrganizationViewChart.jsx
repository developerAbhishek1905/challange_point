import { Empty } from "antd";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";




const OrganizationViewChart = ({data}) => {
  const navigate = useNavigate();

    const topOrganizations = data && data.length > 0 ? data.slice(0, 5) : [];
  return (
    <motion.div
      className="bg-white border border-gray-200 divide-y divide-gray-100 rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-base font-semibold text-gray-900">Organizations</h2>
        <button className="text-sm text-blue-600 hover:underline font-medium"onClick={()=>navigate('/organization')}>View All</button>
      </div>

      {/* List */}
      <div>
        {topOrganizations && topOrganizations.length >0 ? (
        topOrganizations.map((org) => (
          <div
            key={org._id}
            className="flex items-center justify-between px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="text-sm">
                <p className="font-medium text-gray-900 capitalize">{ org.name}</p>
                <p className="text-gray-500">{org.organization_type}</p>
              </div>
            </div>
            <span className="bg-green-50 text-green-500 text-sm px-3 py-1 rounded-md">
              {org.code}
            </span>
          </div>
        ))
        ):(
							<div className='flex justify-center items-center py-6'>
  <Empty 
    description="No organizations found" 
    image={Empty.PRESENTED_IMAGE_SIMPLE} 
  />
</div>

						)
      
      }
      </div>
    </motion.div>
  );
};

export default OrganizationViewChart;
