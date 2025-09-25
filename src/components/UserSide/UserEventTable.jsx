import { motion } from "framer-motion";
import { Edit, Ellipsis, Eye, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { EventDetailModal } from "../events/EventDetailModal";
import { useDispatch, useSelector } from "react-redux";
import { createEvent, deleteEvent, getCategories, getEvent, getOrganisation, updateEvent } from "../../Redux/API/API";
import { all } from "axios";
// import Paginations from "../common/Pagination";
import { DatePicker, Dropdown, Empty, Input, Menu, Pagination, Select, TimePicker } from "antd";
import { selectSearchTerm } from "../../Redux/Slice/searchSlice";
import dayjs from "dayjs";
import ConfirmationModal from "../ConfirmationModal";
import { toast } from "react-toastify";

const UserEventTable = ({
  showModal,
  setShowModal,
  modalMode,
  setModalMode,
}) => {
  const [allEvents, setAllEvents] = useState([]);
	const [categories, setCategories] = useState([]);
  const [allOrganisation, setAllOrgainisation] = useState([]);


  const [showDetailModal, setShowDetailModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentPage,setCurrentPage] = useState(1);
  const [totatItems, setTotalItems] = useState('');
  console.log(totatItems,'totatItems')


  const menuRef = useRef(null);


  const [selectedOrganisationId, setSelectedOrganisationId] = useState("");
  console.log(selectedOrganisationId,'organisation_id')

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [eventIdToDelete, setEventIdToDelete] = useState(null);


  const [eventOrganisation, setEventOrganisation] = useState("");
  const [shouldOpenUp, setShouldOpenUp] = useState(false);

  const dispatch = useDispatch();
  const searchTerm = useSelector(selectSearchTerm)
	// const { userData } = useSelector((state) => state.user);
    // console.log(userData.eventId,'userData')

    const userId = JSON.parse(localStorage.getItem('id'));



  const fetchEventList = async (page = currentPage) => {
    try {
      const response = await dispatch(getEvent({ page, searchTerm,userId:userId,user:true }));
      console.log(response,'userEventResponse')
      console.log(response?.payload?.data);
      console.log(response,'event response');

      setAllEvents(response?.payload?.data?.data);
      setCurrentPage(response?.payload?.data?.currentPage);
      setTotalItems(response?.payload?.data?.count);
    } catch (error) {
      console.log(error, "error");
    }
  };

  useEffect(() => {
    fetchEventList(currentPage);
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

 

 

  
 

  

 


;

const handlePageChange = (page) => {
  setCurrentPage(page);
};

  const handleDelete = async() =>{
       if (!eventIdToDelete) return;
      try {
        const response = await dispatch(deleteEvent(eventIdToDelete));
        console.log(response,'delete response')
         if (response.payload.status === 200) {
          toast.success(response?.payload?.data?.message)
    }
        console.log(response,'delete response');
        fetchEventList();
          setEventIdToDelete(null);
      } catch (error) {
        console.log(error);
      }
    }




  const handleEllipsisClick = (id, event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;
  setShouldOpenUp(spaceBelow < 180); // 180px = estimated menu height
  setOpenMenuId(prev => (prev === id ? null : id));
};

const eventMenu = (product) => (
  <Menu>
   
    <Menu.Item
      key="edit"
      icon={<Edit size={16} />}
      onClick={() => {setShowDetailModal(true);
                            setOpenMenuId(product._id);}}
    >
      view
    </Menu.Item>
    <Menu.Item
      key="delete"
      icon={<Trash2 size={16} />}
      danger
      onClick={() => {
       setEventIdToDelete(product._id); 
                            setConfirmModalOpen(true);
      }}
    >
      Delete
    </Menu.Item>
    
  </Menu>
);

  return (
    <>
      {showDetailModal && (
        <EventDetailModal
          onClose={() => setShowDetailModal(false)}
          openMenuId={openMenuId}
        />
      )}

     
      

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
                  Paticipants
                </th>
                {/* <th className="px-6 py-5 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Status
                </th> */}
                <th className="px-6 py-5 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
             {allEvents && allEvents.length > 0 ? (
               
                  allEvents.map((product) => (
                <motion.tr
                  key={product._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
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
                    {product.organization_name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                   {product.category_id?.map(cat => cat.category_name).join(", ") || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {product.totalParticipants}
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    Ongoing
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 relative">
                    <Dropdown overlay={eventMenu(product)} trigger={['click']} placement="bottomRight">
    <button>
      <Ellipsis className="text-gray-600 hover:text-gray-800" />
    </button>
  </Dropdown>

                    {/* {openMenuId === product._id && (
                      <motion.div
                        ref={menuRef}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                         className={`absolute right-0 w-40 bg-white border rounded-md shadow-lg z-10 ${
      shouldOpenUp ? 'bottom-full mb-2' : 'mt-2'
    }`}
                      >
                        <button
                          onClick={() => {
                            setShowDetailModal(true);
                            setOpenMenuId(product._id);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Eye size={16} className="mr-2" /> View
                        </button>
                       
                        <button
                          onClick={() => {
                              setEventIdToDelete(product._id); 
                            setConfirmModalOpen(true);

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
            ): (
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
            <Pagination align="end"  defaultCurrent={currentPage} total={totatItems} showSizeChanger={false}  onChange={handlePageChange}/>
      </motion.div>

      <ConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={() => {
          // Handle delete or cancel confirmation
          setConfirmModalOpen(false);
         
            handleDelete()
        }}
        title={"Are you sure you want to delete?"}
        description="This action can’t be undone once confirmed"
        confirmText={"Yes, I'm sure" }
      />
    </>
  );
};
export default UserEventTable;
