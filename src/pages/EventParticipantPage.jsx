import { Download, FolderInput, Plus, UploadIcon } from "lucide-react";
import Header from "../components/common/Header";
import { motion } from "framer-motion";

import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import EventParticipantTable from "../components/EventParticipant/EventParticipantTable";
import { useDispatch } from "react-redux";
import { ParticipantDownload, ParticipantSample, uploadParticipant } from "../Redux/API/API";
import { saveAs } from "file-saver";
import { Select, Upload } from "antd";
import { toast } from "react-toastify";


const EventParticipantsPage = () => {
			const [showModal, setShowModal] = useState(false);
  const [openSampleModal, setOpenSampleModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);


    const [selectedFile, setSelectedFile] = useState(null);
const [fileList, setFileList] = useState([]);

const dispatch = useDispatch();
            const { eventName } = useParams();
            const { categoryName } = useParams();
              const location = useLocation();
  const eventId = location.state?.eventId;
  const categoryId = location.state?.categoryId
   console.log("Event Name:", eventName);
  console.log("Event ID:", eventId);

  const handleDownload = async() =>{
      try {
        const response = await dispatch(ParticipantDownload(eventId)).unwrap()
    .then((blobData) => {
      const blob = new Blob([blobData], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(blob, "paricipants.xlsx");
    })
        console.log(response,'CSV response')
      } catch (error) {
        console.log(error)
      }
    }
  
	 const handleSample = async() =>{
      try {
        const response = await dispatch(ParticipantSample()).unwrap()
    .then((blobData) => {
      const blob = new Blob([blobData], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(blob, "paricipantSample.xlsx");
    })
        console.log(response,'CSV response')
      } catch (error) {
        console.log(error)
      }
    }

     const handleImportModalClose = () => {
    setOpenSampleModal(false);
    // setSelectedEventId(null);
    // setCategoriesForEvent([]);
    // setSelectedCategoryId(null);
     setSelectedFile(null);
    setFileList([]);
  };

      // Handle file upload
  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length > 0) {
      setSelectedFile(newFileList[0].originFileObj);
    } else {
      setSelectedFile(null);
    }
  };

      // Handle import participant
      const handleImportParticipant = async() => {
        if (!eventName || !categoryName) {
          alert("Please select both event and category");
          return;
        }
    
         if (!selectedFile) {
          alert("Please select a file to import");
          return;
        }
        
        // Add your import logic here
        console.log("Importing participant for:", {
          eventId: eventId,
          categoryId: categoryId
        });
    
       
    
    try {
       const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('eventId', eventId);
    formData.append('categoryId', categoryId);
    
    const response = await dispatch(uploadParticipant(formData))
     const resPayload = response?.payload;

    if (resPayload?.status === 201) {
      toast.success(resPayload?.data?.message);
      setRefreshKey((prev) => prev + 1);
    } else {
      // Check if it's a known validation error with required/found columns
      if (resPayload?.message?.includes("Missing required columns")) {
        toast.error(`❌ ${resPayload.message}`);
      } else {
        toast.error(resPayload?.message || "Missing required columns");
      }
    console.log(response,'upload response');
    }
      
    } catch (error) {
       toast.error('fail to upload participant')
    }
        
        // Close modal after import
        handleImportModalClose();
      };

  const labelClass = "text-sm font-medium text-gray-900";

	
	return (
		<div className='flex-1 overflow-auto relative z-10 bg-white'>
			<Header title={`${eventName} / ${categoryName}`} placeholder='search participants' showSearch={true} />

		

         <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>

	<EventParticipantTable key={refreshKey} showModal={showModal} setShowModal={setShowModal} eventId = {eventId} categoryId = {categoryId}/>
	<div className="flex flex-wrap">

	<button
					onClick={handleDownload}
						className='bg-green-700 border-2 text-white rounded-lg mt-2 pl-4 pr-4 py-2 flex gap-1' 
					> <Download/> Download Data </button>
	<button
						className='bg-black border-2 text-white rounded-lg mt-2 pl-4 pr-4 py-2 flex gap-1' onClick={() => setOpenSampleModal(true)} 
					> <FolderInput/> Import Participant </button>
	<button
					onClick={() => setShowModal(true)}
						className='bg-blue-600 border-2 text-white rounded-lg mt-2 pl-4 pr-4 py-2 flex gap-1' 
					> <Plus/> Add Participant </button>
	<button
					onClick={handleSample}
						className='bg-yellow-600 border-2 text-white rounded-lg mt-2 pl-4 pr-4 py-2 flex gap-1' 
					> <Download/> DownLoad Sample </button>
					</div>
             </main>

              {/* Import Participant Modal */}
      {openSampleModal && (
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
            className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Import Participants
            </h2>

            <div className="space-y-4">
              {/* Event Selection */}
              <div>
                <label className={labelClass}>Select Event</label>
                <Select
                  // showSearch
                  // allowClear
                  // placeholder="Select Event"
                  // options={events}
                  optionFilterProp="label"
                  value={eventName}
                  style={{ width: '100%', marginTop: '0.25rem' }}
                  // onChange={handleEventChange}
                  disabled
                />
              </div>

              {/* Category Selection */}
              <div>
                <label className={labelClass}>Select Category</label>
                <Select
                  // showSearch
                  // allowClear
                  className="w-full"
                  // placeholder="Select Category"
                  // value={selectedCategoryId || undefined}
                  value={categoryName}
                  // onChange={(value) => setSelectedCategoryId(value)}
                  // disabled={!categoriesForEvent.length}
                  // optionFilterProp="label"
                  style={{ marginTop: '0.25rem' }}
                  disabled
                >
                  {/* {categoriesForEvent.map((category) => (
                    <Select.Option 
                      key={category._id} 
                      value={category._id} 
                      label={category.category_name}
                    >
                      {category.category_name}
                    </Select.Option>
                  ))} */}
                </Select>
              </div>

              {/* File Upload */}
              <div>
                <label className={labelClass}>Upload Excel File (.xlsx)</label>
                <div className="mt-1">
                  <Upload
                    beforeUpload={() => false} // Prevent auto upload
                    onChange={handleFileChange}
                    fileList={fileList}
                    accept=".xlsx,.xls"
                    maxCount={1}
                    showUploadList={{
                      showPreviewIcon: false,
                      showRemoveIcon: true,
                    }}
                  >
                    <button
                      type="button"
                      className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors"
                    >
                      <UploadIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        Click to select Excel file or drag and drop
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Supports .xlsx and .xls files
                      </p>
                    </button>
                  </Upload>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={handleImportModalClose}
                  className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-50 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImportParticipant}
                  // disabled={!selectedEventId || !selectedCategoryId || !selectedFile}
                  className={`px-4 py-2 rounded-md transition duration-200 ${
                    selectedFile
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Import Participants
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

		</div>
	);
};
export default EventParticipantsPage;
