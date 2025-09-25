import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Edit, Eye, Search, Trash2, Ellipsis } from "lucide-react";
// import ParticipantDetailModal from "./ParticipantDetailModal";
import { deleteParticipant, getParticipant } from "../../Redux/API/API";
import { useDispatch, useSelector } from "react-redux";
import { selectSearchTerm } from "../../Redux/Slice/searchSlice";
import { Dropdown, Empty, Menu, Pagination } from "antd";





const UserParticipantTable = ({showModal,setShowModal}) => {

	const [selectedParticipant, setSelectedParticipant] = useState(null);
	const [Participant, setParticipant] = useState(null);
	const [openMenuId, setOpenMenuId] = useState(null);
	  const [currentPage,setCurrentPage] = useState(1);
  const [totatItems, setTotalItems] = useState('');
  const [shouldOpenUp, setShouldOpenUp] = useState(false);


	const [allParticipant, setAllParticipant] = useState([]);

	  const menuRef = useRef(null);
	

	const dispatch = useDispatch();
  const searchTerm = useSelector(selectSearchTerm)
  const { userData } = useSelector((state) => state.user);
    console.log(userData.eventId,'userData')

 const fetchParticipantList = async (page = currentPage) => {
	try {
	  const response = await dispatch(getParticipant({ page, searchTerm,eventId:userData.eventId,event:true }));
	  console.log(response?.payload?.data);
	  console.log(response,'Participant response');

	  setAllParticipant(response?.payload?.data?.data);
	  setCurrentPage(response?.payload?.data?.currentPage);
	  setTotalItems(response?.payload?.data?.count);
	} catch (error) {
	  console.log(error, "error");
	}
  };

  useEffect(() => {
	fetchParticipantList(currentPage);
  }, [currentPage,searchTerm]);

   useEffect(() => {
    function handleClickOutside(event) {
      // Close the menu if clicked outside
      if (
        openMenuId &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpenMenuId(null);
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);


  const handlePageChange = (page) => {
  setCurrentPage(page);
};

const handleEllipsisClick = (id, event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;
  setShouldOpenUp(spaceBelow < 180); // 180px = estimated menu height
  setOpenMenuId(prev => (prev === id ? null : id));
};
	const handleDelete = async(user) =>{
		try {
			const response = await dispatch(deleteParticipant(user._id));
			console.log(response);
		} catch (error) {
			console.log(error)
		}finally{
			fetchParticipantList();
		}
	}

	const eventMenu = (user) => (
  <Menu>
    <Menu.Item
      key="view"
      icon={<Eye size={16} />}
      onClick={() => {
        setSelectedParticipant(user);
        setOpenMenuId(null);// optional, can be removed if unused
      }}
    >
      View
    </Menu.Item>
    <Menu.Item
      key="edit"
      icon={<Edit size={16} />}
      onClick={() => {setParticipant(user);
          setShowModal(true);}}
    >
      Edit
    </Menu.Item>
    <Menu.Item
      key="delete"
      icon={<Trash2 size={16} />}
      danger
      onClick={() =>handleDelete(user)}
    >
      Delete
    </Menu.Item>
  </Menu>
);

	return (
		<>
			<motion.div
				className='bg-white rounded-xl  border border-gray-200 pb-2'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
			>
				

				<div className='overflow-x-auto rounded-xl'>
					<table className='min-w-full'>
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
									Created At
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider'>
									Category
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider'>
									Status
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider'>
									Actions
								</th>
							</tr>
						</thead>

						<tbody>
							{allParticipant && allParticipant.length > 0 ? (
							allParticipant.map((user) => (
								<motion.tr
									key={user._id}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.3 }}
								>
									<td className='px-6 py-4 whitespace-nowrap'>
										<div className='flex items-center'>
											<div className='flex-shrink-0 h-10 w-10'>
												<div className='h-10 w-10 rounded-full bg-gradient-to-r  flex items-center justify-center text-white font-semibold'>
													{/* {user.first_name.charAt(0)} */}
													<img src={user.file} alt="profile" className="h-full w-full object-cover rounded-full"/>
												</div>
											</div>
											<div className='ml-4'>
												<div className='text-sm font-medium text-gray-700'>{user.first_name}{user.last_name}</div>
											</div>
										</div>
									</td>

									<td className='px-6 py-4 whitespace-nowrap'>
										<div className='text-sm text-gray-700'>{user.bib_number}</div>
									</td>

									<td className='px-6 py-4 whitespace-nowrap'>
										<div className='text-sm text-gray-700'>{user.phone_number}</div>
									</td>

									<td className='px-6 py-4 whitespace-nowrap'>
										<div className='text-sm text-gray-700'>{user.email}</div>
									</td>
									<td className='px-6 py-4 whitespace-nowrap'>
										<div className='text-sm text-gray-700'>{user.createdAt? new Date(user.createdAt).toISOString().split("T")[0]: "-"}</div>
									</td>

									<td className='px-6 py-4 whitespace-nowrap'>
										<div className='text-sm text-gray-700'>{user.category?.category_name}</div>
									</td>
									{/* <td className='px-6 py-4 whitespace-nowrap'>
									<span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100'>
										{user.role}
									</span>
								</td> */}

									<td className='px-6 py-4 whitespace-nowrap'>
										<div className='text-sm text-gray-700'>{user.status}</div>
									</td>

									{/* <td className='px-6 py-4 whitespace-nowrap'>
									<span
										className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
											user.status === "Active"
												? "bg-green-800 text-green-100"
												: "bg-red-800 text-red-100"
										}`}
									>
										{user.status}
									</span>
								</td> */}

<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700 relative'>
  <Dropdown overlay={eventMenu(user)} trigger={['click']} placement="bottomRight">
    <button>
      <Ellipsis className="text-gray-600 hover:text-gray-800" />
    </button>
  </Dropdown>

  {/* {openMenuId === user._id && (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
	  ref={menuRef}
       className={`absolute right-0 w-40 bg-white border rounded-md shadow-lg z-10 ${
      shouldOpenUp ? 'bottom-full mb-2' : 'mt-2'
    }`}
    >
      <button
        onClick={() => {
          setOpenMenuId(null);
		  setSelectedParticipant(user)
        }}
        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        <Eye size={16} className="mr-2" /> View
      </button>
      <button
        onClick={() => {
		  setParticipant(user)
          setShowModal(true);
        }}
        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        <Edit size={16} className="mr-2" /> Edit
      </button>
      <button
        onClick={() => {
				  handleDelete(user);

        }}
        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
      >
        <Trash2 size={16} className="mr-2" /> Delete
      </button>
    </motion.div>
  )} */}
</td>
								</motion.tr>
							))
						):(
                <tr>
                  <td colSpan="8" className="text-center py-8">
                    <Empty 
                      description="No participants found" 
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
		


			{/* {selectedParticipant && (
				<ParticipantDetailModal
					participant={selectedParticipant}
					onClose={() => setSelectedParticipant(null)}
				/>
			)} */}
		</>
	);
};
export default UserParticipantTable;
