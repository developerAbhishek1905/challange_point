import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { completeCategory, eventById } from "../../Redux/API/API";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const EventDetailModal = ({ onClose,openMenuId }) => {

  const [eventDetail, setEventDetail] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getEventId = async() =>{
    try {
      const response = await dispatch(eventById(openMenuId));
      console.log(response,'eventById respose');
      if(response?.payload?.status === 200){
    setEventDetail(response?.payload?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    getEventId();
  },[])
  
const handleAdd = (eventId, category) =>{
  const encodedCategory = encodeURIComponent(category.category_name); // encode for URL
  navigate(`/participant/${eventDetail.event_name}/${encodedCategory}`, {
    state: {
      eventId: eventDetail._id,
      eventName: eventDetail.event_name,
      categoryId: category._id,
      categoryName: category.category_name
    }
  });
}

  // Get all categories or empty array if none exist
  const categories = Array.isArray(eventDetail.category_id) ? eventDetail.category_id : [];

  const handleComplete = async(categoryId) =>{
    const data = {
      isCompleted:1,
    }
    try {
      const respone = await dispatch(completeCategory({categoryId, data}))
      if(respone?.payload?.data?.status === true){
        toast.success(respone?.payload?.data?.message);
        getEventId(openMenuId);
      }
      console.log(respone)
    } catch (error) {
      console.log(error)
    }
  }
  const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        className="bg-white p-6 rounded-xl w-full max-w-2xl shadow-xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Event Details</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900 text-xl font-bold">×</button>
        </div>

        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex justify-between"><span className="font-medium">Event name</span><span>{eventDetail.event_name}</span></div>
          <div className="flex justify-between"><span className="font-medium">Venue</span><span>{eventDetail.venue}</span></div>
          <div className="flex justify-between"><span className="font-medium">Organisation</span><span>{eventDetail.organization?.organization_name}</span></div>
          {/* <div className="flex justify-between"><span className="font-medium">Date</span><span>May 16, 2024</span></div> */}
          <div className="flex justify-between"><span className="font-medium">Date</span><span> {eventDetail.date? new Date(eventDetail.date).toISOString().split("T")[0]: "-"}</span></div>
        </div>

        <hr className="my-4" />

        {/* Category Details Table */}
        <div>
          <h3 className="text-sm font-medium text-gray-800 mb-2">Category Details</h3>
          <div className="overflow-x-auto">
            <div className="max-h-60 overflow-y-auto">
            <table className="w-full text-sm text-left border border-gray-200">
              <thead className="bg-gray-100 text-gray-700 sticky top-0">
                <tr>
                  <th className="px-3 py-2 border">Race Category</th>
                  <th className="px-3 py-2 border">Gender</th>
                  <th className="px-3 py-2 border">Start Time</th>
                  <th className="px-3 py-2 border">Cut-off time</th>
                </tr>
              </thead>
              <tbody>
               {categories.length > 0 ? (
                    categories.map((category, index) => (
                      <tr key={category._id || index}>
                        <td className="px-3 py-2 border text-gray-700">{category.category_name || "-"}</td>
                        <td className="px-3 py-2 border text-gray-700">{category.gender || "-"}</td>
                        <td className="px-3 py-2 border text-gray-700">{category.start_time||"-"}</td>
                         
                        <td className="px-3 py-2 border text-gray-700">{category.cutoff_time|| "-"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-3 py-2 border text-gray-700 text-center">No categories found</td>
                    </tr>
                  )}
              </tbody>
            </table>
              </div>
          </div>
        </div>

        <hr className="my-4" />

        {/* Participants */}
        {/* <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-700">{eventDetail.totalParticipants} Participants</p>
            <div className="flex mt-2 -space-x-2">
              {Array.isArray(eventDetail.participantsImages) &&
    eventDetail.participantsImages.map((participant, i) => (
      <img
        key={i}
        src={participant.file}
        alt={`Avatar ${i + 1}`}
        className="w-8 h-8 rounded-full border-2 border-white"
      />
    ))}
            </div>
          </div>
          <button className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm hover:bg-blue-700" onClick={handleViewAll}>View all</button>
        </div> */}

         <div>
          <h3 className="text-sm font-medium text-gray-800 mb-2">Participants</h3>
          <div className="overflow-x-auto">
            <div className="max-h-60 overflow-y-auto">
            <table className="w-full text-sm text-left border border-gray-200">
              <thead className="bg-gray-100 text-gray-700 sticky top-0">
                <tr>
                  <th className="px-3 py-2 border">Category</th>
                  <th className="px-3 py-2 border">Paritcipant</th>
                  <th className="px-3 py-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
               {categories.length > 0 ? (
                    categories.map((category, index) => (
                      <tr key={category._id || index}>
                        <td className="px-3 py-2 border text-gray-700">{category.category_name || "-"}</td>
                        <td className="px-3 py-2 border text-gray-700">{category.participantCount || "-"}</td>
                         <td className="px-3 py-2 border">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-2 py-0 rounded" onClick={()=>handleAdd(eventDetail._id, category)}>
                    Add / View
                  </button>
                </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-3 py-2 border text-gray-700 text-center">No categories found</td>
                    </tr>
                  )}
              </tbody>
            </table>
              </div>
          </div>
        </div>

        <hr className="my-4" />

        {/* Results Table */}
        <div>
          <h3 className="text-sm font-medium text-gray-800 mb-2">Results</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border border-gray-200">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-3 py-2 border">Race Category</th>
                  <th className="px-3 py-2 border">Result</th>
                </tr>
              </thead>
              <tbody>
                {/* <tr>
                  <td className="px-3 py-2 border text-gray-700">International Half Marathon (21km)</td>
                  <td className="px-3 py-2 border text-gray-700">To be announced</td>
                </tr> */}
                 {categories.length > 0 ? (
                    categories.map((category, index) => (
                      <tr key={category._id || index}>
                        <td className="px-3 py-2 border text-gray-700">{category.category_name || "-"}</td>
                       
                        <td className="px-3 py-2 border text-gray-700"> {category.is_result_declared ? (
    <button className="bg-green-500 text-white px-3 py-1 rounded text-sm" onClick={()=>navigate(`/event/${category.category_name}`,{state:{eventId:eventDetail._id, categoryId:category._id}})}>
      View Result
    </button>
  ) : (
    <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm" disabled={category.participantCount === 0}onClick={()=>handleComplete(category._id)}>
      Complete Result
    </button>
  )}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-3 py-2 border text-gray-700 text-center">No categories found</td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
        </div>

        {/* <div className="flex justify-end mt-4">
          <button className="border px-4 py-1.5 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-700">See results</button>
        </div> */}
      </motion.div>
    </motion.div>
  );
};
