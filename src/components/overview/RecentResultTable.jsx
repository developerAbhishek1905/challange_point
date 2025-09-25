import { Empty } from "antd";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";



const RecentResultTable = ({data}) => {
	const navigate = useNavigate();
	return (
		<motion.div
			className='bg-white rounded-xl lg:col-span-2 border border-gray-300 divide-y divide-gray-300 h-fit'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.4 }}
		>
			<div className='flex items-center justify-between px-4 py-3'>
				<h2 className='text-sm font-semibold text-gray-900'>Recent Results announced</h2>
				<button className='text-sm text-gray-500 hover:underline' onClick={()=>navigate('/resultEvents')}>View All</button>
			</div>

			<div> 
				{data && data.length > 0 ? (
				data.map((result) => (
					<div key={result._id} className='flex items-center justify-between px-4 py-4'>
						<div className='text-sm'>
							<p className='font-semibold text-gray-900'>{result.event_name}</p>
							<p className='text-gray-500 whitespace-pre-line'>{result.venue}</p>
						</div>
						<button className='bg-green-500 hover:bg-green-600 text-white text-xs font-medium px-4 py-1.5 rounded-md' onClick={()=>navigate(`/result/${result.event_name}`)}>
							View Results
						</button>
					</div>
				))
			):(
							<div className='flex justify-center items-center py-6'>
  <Empty 
    description="No results found" 
    image={Empty.PRESENTED_IMAGE_SIMPLE} 
  />
</div>

						)
			}
			</div>
		</motion.div>
	);
};

export default RecentResultTable;
