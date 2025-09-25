import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getResult } from "../../Redux/API/API";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, Empty, Menu, Pagination } from "antd";
import { selectSearchTerm } from "../../Redux/Slice/searchSlice";
import ParticipantDetailModal from "../participants/ParticipantDetailModal";
import { Ellipsis, Eye } from "lucide-react";





const ResultTable = ({eventId,categoryId}) => {
	const [results,setResults] = useState([]);
	const [currentPage,setCurrentPage] = useState(1);
  const [totatItems, setTotalItems] = useState('');

  const [selectedParticipant, setSelectedParticipant] = useState(null);

		const dispatch = useDispatch();
  const searchTerm = useSelector(selectSearchTerm)

	

	const fetchResult =async (page = currentPage) =>{
    try {
        const response = await dispatch(getResult({ page, searchTerm, eventId, categoryId }));
        console.log(response,'result response');
		setResults(response?.payload?.data?.data);
		 setCurrentPage(response?.payload?.data?.currentPage);
      setTotalItems(response?.payload?.data?.count);

    } catch (error) {
        console.log(error);
    }
}

useEffect(()=>{
    fetchResult(currentPage);
},[currentPage,searchTerm])

const handlePageChange = (page) => {
  setCurrentPage(page);
};

const eventMenu = (result) => (
    <Menu>
      <Menu.Item
        key="view"
        icon={<Eye size={16} />}
        onClick={() => {
          setSelectedParticipant(result?.participantId);
        }}
      >
        View
      </Menu.Item>
      {/* <Menu.Item
        key="edit"
        icon={<Edit size={16} />}
        onClick={() => {
          setParticipant(user);
          setShowModal(true);
        }}
      >
        Edit
      </Menu.Item>
      <Menu.Item
        key="delete"
        icon={<Trash2 size={16} />}
        danger
        onClick={() => handleDelete(user)}
      >
        Delete
      </Menu.Item> */}
    </Menu>
  );
	

	return (
		<>
		<motion.div
			className='bg-white border border-gray-200 rounded-xl mb-8 pb-2'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			

			<div className='overflow-x-auto'>
				<table className='min-w-full '>
					<thead className="bg-gray-100">
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider'>
								Name
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider'>
								Bib Number
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider'>
								Phone
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider'>
								Email
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider'>
							    Time
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider'>
								Ranking
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider'>
								Status
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Actions
                </th>
							
						</tr>
					</thead>

					<tbody>

						{results && results.length > 0 ? (
						results.map((result) => (
							<motion.tr
								key={result._id}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								<td className='px-6 py-4 whitespace-nowrap'>
										
											<div className='text-sm font-medium text-gray-700'>{result.participant_name}</div>
								</td>

                                <td className='px-6 py-4 whitespace-nowrap'>
									<div className='text-sm text-gray-700'>{result.bib_number}</div>
								</td>

								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='text-sm text-gray-700'>{result.phone_number || 'N/A'}</div>
								</td>

								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='text-sm text-gray-700'>{result.email || 'N/A'}</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='text-sm text-gray-700'>    {new Date(result.resultTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
								</td>

                                <td className='px-6 py-4 whitespace-nowrap'>
									<div className='text-sm text-gray-700'>{result.ranking}</div>
								</td>
								{/* <td className='px-6 py-4 whitespace-nowrap'>
									<span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100'>
										{result.role}
									</span>
								</td> */}

                                 <td className='px-6 py-4 whitespace-nowrap'>
									<div className='text-sm text-gray-700'>{result.status}</div>
								</td>

								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 relative">
                      <Dropdown
                        overlay={eventMenu(result)}
                        trigger={["click"]}
                        placement="bottomRight"
                      >
                        <button>
                          <Ellipsis className="text-gray-600 hover:text-gray-800" />
                        </button>
                      </Dropdown>
                    </td>


								{/* <td className='px-6 py-4 whitespace-nowrap'>
									<span
										className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
											result.status === "Active"
												? "bg-green-800 text-green-100"
												: "bg-red-800 text-red-100"
										}`}
									>
										{result.status}
									</span>
								</td> */}

								
							</motion.tr>
						))
					): (
                <tr>
                  <td colSpan="8" className="text-center py-8">
                    <Empty 
                      description="No results found" 
                      image={Empty.PRESENTED_IMAGE_SIMPLE} 
                    />
                  </td>
                </tr>
              )}
					</tbody>
				</table>
			</div>
            <Pagination align="end"  defaultCurrent={currentPage} total={totatItems} showSizeChanger={false}  onChange={handlePageChange}/>

		</motion.div>
		{selectedParticipant && (
        <ParticipantDetailModal
          participant={selectedParticipant}
          onClose={() => setSelectedParticipant(null)}
        />
      )}
	  </>
	);
};
export default ResultTable;
