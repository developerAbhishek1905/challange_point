import { Download, FolderInput, Plus, Upload as UploadIcon } from "lucide-react";
import Header from "../components/common/Header";
import ParticipantsTable from "../components/participants/ParticipantsTable";
import { useState } from "react";
import { motion } from "framer-motion";
import { Select, Upload } from "antd";
import { toast } from "react-toastify";

// Hardcoded events and categories
const initialEvents = [
  {
    _id: "e1",
    event_name: "Annual Sports Meet",
    category_id: [
      { _id: "cat1", category_name: "Track" },
      { _id: "cat2", category_name: "Field" }
    ]
  },
  {
    _id: "e2",
    event_name: "Science Fair",
    category_id: [
      { _id: "cat3", category_name: "Robotics" }
    ]
  }
];

const ParticipantsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [openSampleModal, setOpenSampleModal] = useState(false);

  // Event and Category states for import modal
  const [eventDetails] = useState(initialEvents);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [categoriesForEvent, setCategoriesForEvent] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileList, setFileList] = useState([]);

  // Download stub
  const handleDownload = () => {
    toast.info("Download is disabled in hardcoded mode.");
  };

  // Sample stub
  const handleSample = () => {
    toast.info("Sample download is disabled in hardcoded mode.");
  };

  // Handle event selection in import modal
  const handleEventChange = (value) => {
    setSelectedEventId(value);
    const selectedEvent = eventDetails.find(event => event._id === value);
    setCategoriesForEvent(selectedEvent?.category_id || []);
    setSelectedCategoryId(null); // Reset category selection
  };

  // Handle import modal close
  const handleImportModalClose = () => {
    setOpenSampleModal(false);
    setSelectedEventId(null);
    setCategoriesForEvent([]);
    setSelectedCategoryId(null);
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

  // Handle import participant stub
  const handleImportParticipant = () => {
    if (!selectedEventId || !selectedCategoryId) {
      alert("Please select both event and category");
      return;
    }
    if (!selectedFile) {
      alert("Please select a file to import");
      return;
    }
    toast.info("Import is disabled in hardcoded mode.");
    handleImportModalClose();
  };

  // Convert events data for dropdown
  const events = eventDetails.map((event) => ({
    label: event.event_name,
    value: event._id,
  }));

  const labelClass = "text-sm font-medium text-gray-900";

  return (
    <div className="flex-1 overflow-auto relative z-10 bg-white">
      <Header
        title={"Participants"}
        placeholder="search participants"
        showSearch={true}
      />

      <main className="max-w-7xl mx-auto py-2 px-4 lg:px-8">
        <div className="flex flex-wrap mb-2">
          <button
            onClick={handleDownload}
            className="bg-green-700 text-white border-2 rounded-lg mt-2 pl-4 pr-4 py-2 flex gap-1"
          >
            <Download /> Download Data
          </button>
          <button
            className="bg-black border-2 text-white rounded-lg mt-2 pl-4 pr-4 py-2 flex gap-1"
            onClick={() => setOpenSampleModal(true)}
          >
            <FolderInput /> Import Participant
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 border-2 text-white rounded-lg mt-2 pl-4 pr-4 py-2 flex gap-1"
          >
            <Plus /> Add Participant
          </button>
          <button
            onClick={handleSample}
            className="bg-yellow-600 border-2 text-white rounded-lg mt-2 pl-4 pr-4 py-2 flex gap-1"
          >
            <Download /> DownLoad Sample
          </button>
        </div>
        <ParticipantsTable showModal={showModal} setShowModal={setShowModal} />
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
                  showSearch
                  allowClear
                  placeholder="Select Event"
                  options={events}
                  optionFilterProp="label"
                  value={selectedEventId}
                  style={{ width: '100%', marginTop: '0.25rem' }}
                  onChange={handleEventChange}
                />
              </div>

              {/* Category Selection */}
              <div>
                <label className={labelClass}>Select Category</label>
                <Select
                  showSearch
                  allowClear
                  className="w-full"
                  placeholder="Select Category"
                  value={selectedCategoryId || undefined}
                  onChange={(value) => setSelectedCategoryId(value)}
                  disabled={!categoriesForEvent.length}
                  optionFilterProp="label"
                  style={{ marginTop: '0.25rem' }}
                >
                  {categoriesForEvent.map((category) => (
                    <Select.Option 
                      key={category._id} 
                      value={category._id} 
                      label={category.category_name}
                    >
                      {category.category_name}
                    </Select.Option>
                  ))}
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
                  disabled={!selectedEventId || !selectedCategoryId || !selectedFile}
                  className={`px-4 py-2 rounded-md transition duration-200 ${
                    selectedEventId && selectedCategoryId && selectedFile
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
export default ParticipantsPage;
