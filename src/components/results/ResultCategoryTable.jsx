import { motion } from "framer-motion";
import { CalendarDaysIcon, Clock, Edit, Ellipsis, Eye, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../../Redux/API/API";
import { selectSearchTerm } from "../../Redux/Slice/searchSlice";
import { Empty, Pagination } from "antd";
import { useLocation, useNavigate } from "react-router-dom";



const ResultCategoryTable = ({ categories,eventId}) => {


   


const navigate = useNavigate();



	return (
		<>
		


		<motion.div
			className='bg-white rounded-xl  border border-gray-200 mb-8 pb-2'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			{/* <div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-gray-900'>Categories</h2>
				<div className='relative'>
					<button
					
						className='bg-black border-2 text-white rounded-lg pl-4 pr-4 py-2 flex gap-1'
					> <Plus/>Create Category </button>
				</div>
			</div> */}

			<div className='overflow-x-auto'>
				<table className='min-w-full'>
				<thead className="bg-gray-100">
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>
                            Category Code
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>
                            Category Name
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>
								Date
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>
                            Winner's Total
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>
                            Standby Winner's Total
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>
                            Gender
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>
                            Start time
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>
                            Cut off Time
							</th>
							
						</tr>
					</thead>

					<tbody>
            {categories && categories.length > 0 ? (
						categories.map((category) => (
							<motion.tr
								key={category._id}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
								className="cursor-pointer hover:bg-gray-100"
								onClick={()=>navigate(`/event/${category.category_name}`,{state:{eventId:eventId, categoryId:category._id}})}
							>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 flex gap-2 items-center'>
								
									{category.category_code}
								</td>

								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
									{category.category_name}
								</td>

								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
									  {category.date
    ? new Date(category.date).toISOString().split("T")[0]
    : "-"}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>{category.winner_total}</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>{category.standByWinner_total}</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>{category.gender}</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>{category.start_time}</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>{category.cutoff_time}</td>
							</motion.tr>
						))
          ): (
                <tr>
                  <td colSpan="8" className="text-center py-8">
                    <Empty 
                      description="No categories found" 
                      image={Empty.PRESENTED_IMAGE_SIMPLE} 
                    />
                  </td>
                </tr>
              )
          }
					</tbody>
				</table>
			</div>

		</motion.div>
		</>
	);
};
export default ResultCategoryTable;
