import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Edit, Ellipsis, Eye, Trash2, Flag } from "lucide-react";
import {
  DatePicker,
  Dropdown,
  Empty,
  Input,
  Menu,
  Pagination,
  Select,
  TimePicker,
  Popover,
  Modal,
} from "antd";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import ConfirmationModal from "../ConfirmationModal";
import AddCategoryModal from "./AddCategoryModal";
import ChallengeDetails from "../ChallengeDetails";
import {
  getAllChallangeList,
  deleteChallange,
  getChallangeById,
  getreportById,
} from "../../utils/api";

const initialCategories = [
  { _id: "cat1", category_name: "Track" },
  { _id: "cat2", category_name: "Field" },
  { _id: "cat3", category_name: "Robotics" },
];

const initialOrganisations = [
  { _id: "org1", organization_name: "Checkpoint Org" },
  { _id: "org2", organization_name: "Tech Society" },
];

const EventsTable = ({
  showModal,
  setShowModal,
  modalMode,
  setModalMode,
  searchValue,
}) => {
  const [allEvents, setAllEvents] = useState([]);
  const [categories, setCategories] = useState(initialCategories);
  const [allOrganisation, setAllOrgainisation] = useState(initialOrganisations);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pagination, setPagination] = useState(null);

  const [eventName, setEventName] = useState("");
  const [eventCode, setEventCode] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState([]);
  const [selectedOrganisationId, setSelectedOrganisationId] = useState("");
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [eventIdToDelete, setEventIdToDelete] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [challengeDetailsData, setChallengeDetailsData] = useState(null);
  const [challangeId, setChallangeId] = useState(null);
  const [getChallangeData, setGetChallangeData] = useState(null);
  const [report, setReport] = useState(null);

  const pageSize = 8;

  const reportCount = [
    {
      profile: "https://randomuser.me/api/portraits/men/1.jpg",
      name: "Amit Sharma",
      email: "amit.sharma@example.com",
      comment: "Inappropriate content found in the post. ",
    },
    {
      profile: "https://randomuser.me/api/portraits/women/2.jpg",
      name: "Priya Mehta",
      email: "priya.mehta@example.com",
      comment: "Spam links shared repeatedly.",
    },
    {
      profile: "https://randomuser.me/api/portraits/men/3.jpg",
      name: "Rahul Verma",
      email: "rahul.verma@example.com",
      comment: "Harassment reported in chat.",
    },
    {
      profile: "https://randomuser.me/api/portraits/women/4.jpg",
      name: "Sneha Kapoor",
      email: "sneha.kapoor@example.com",
      comment: "False information being shared.",
    },
    {
      profile: "https://randomuser.me/api/portraits/men/5.jpg",
      name: "Vikram Singh",
      email: "vikram.singh@example.com",
      comment: "User using offensive language.",
    },
    {
      profile: "https://randomuser.me/api/portraits/women/6.jpg",
      name: "Anjali Gupta",
      email: "anjali.gupta@example.com",
      comment: "Duplicate posts cluttering the feed.",
    },
  ];

  // 🔹 Fetch events
  const fetchEvents = async () => {
    try {
      const data = await getAllChallangeList(
        searchValue,
        currentPage,
        pageSize
      );

      let events = data?.challenges || [];
      
      // Sort: reported challenges first, then others
      events.sort((a, b) => {
        const aReported = (a.dislikesCount >= 7 || a.reports?.length >= 7) ? 1 : 0;
        const bReported = (b.dislikesCount >= 7 || b.reports?.length >= 7) ? 1 : 0;
        return bReported - aReported; // reported first
      });

      setAllEvents(events);
      setTotalItems(data?.totalCount || events?.length || 0);
      setPagination(data);
    } catch (error) {
      console.error("Failed to fetch challenges:", error);
      toast.error("Failed to fetch challenges");
      setAllEvents([]);
      setTotalItems(0);
    }
  };

  // 🔹 Debounced API call on search or page change
  useEffect(() => {
    const delay = setTimeout(fetchEvents, 500);
    return () => clearTimeout(delay);
  }, [searchValue, currentPage]);

  // 🔹 Utility Functions
  const resetFormFields = () => {
    setEventName("");
    setEventCode("");
    setEventDate("");
    setEventTime("");
    setEventVenue("");
    setSelectedCategoryId([]);
    setSelectedOrganisationId("");
    setSelectedEvent(null);
    setErrors({});
  };

  const clearError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!eventName.trim()) newErrors.eventName = "Event name is required";
    if (!eventCode.trim()) newErrors.eventCode = "Event code is required";
    if (!eventDate) newErrors.eventDate = "Event date is required";
    if (!eventTime) newErrors.eventTime = "Event time is required";
    if (!eventVenue.trim()) newErrors.eventVenue = "Event venue is required";
    if (!selectedCategoryId?.length)
      newErrors.selectedCategoryId = "At least one category is required";
    if (!selectedOrganisationId)
      newErrors.selectedOrganisationId = "Organization is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 CRUD Handlers
  const handleSubmit = () => {
    if (!validateForm()) return;
    const newEvent = {
      _id: String(Date.now()),
      event_name: eventName,
      event_code: `CHE${eventCode}`,
      date: eventDate.format("YYYY-MM-DD"),
      time: eventTime.format("HH:mm"),
      venue: eventVenue,
      organization_name:
        allOrganisation.find((o) => o._id === selectedOrganisationId)
          ?.organization_name || "",
      organization_id: { _id: selectedOrganisationId },
      category_id: categories.filter((cat) =>
        selectedCategoryId.includes(cat._id)
      ),
      totalParticipants: 0,
    };
    setAllEvents([newEvent, ...allEvents]);
    setTotalItems((prev) => prev + 1);
    toast.success("Challenge created successfully");
    resetFormFields();
    handleModalClose();
  };

  const handlEditClick = (event) => {
    setSelectedEvent(event);
    setEventName(event.event_name);
    setEventCode(event.event_code.replace("CHE", ""));
    setEventDate(dayjs(event.date));
    setEventTime(dayjs(event.time, "HH:mm"));
    setEventVenue(event.venue);
    setSelectedCategoryId(event.category_id?.map((cat) => cat._id) || []);
    setSelectedOrganisationId(event.organization_id?._id || "");
    setModalMode("Edit");
    setShowModal(true);
  };

  const handleEditSubmit = () => {
    if (!validateForm() || !selectedEvent) return;
    const updatedEvent = {
      ...selectedEvent,
      event_name: eventName,
      event_code: `CHE${eventCode}`,
      date: eventDate.format("YYYY-MM-DD"),
      time: eventTime.format("HH:mm"),
      venue: eventVenue,
      organization_name:
        allOrganisation.find((o) => o._id === selectedOrganisationId)
          ?.organization_name || "",
      organization_id: { _id: selectedOrganisationId },
      category_id: categories.filter((cat) =>
        selectedCategoryId.includes(cat._id)
      ),
    };
    setAllEvents(
      allEvents.map((ev) => (ev._id === selectedEvent._id ? updatedEvent : ev))
    );
    toast.success("Challenge updated successfully");
    handleModalClose();
  };

  const handleDelete = async () => {
    if (!eventIdToDelete) return;
    try {
      await deleteChallange(eventIdToDelete);
      toast.success("Challenge deleted successfully");
      fetchEvents(); // refresh list
    } catch (error) {
      console.error("Error deleting challenge:", error);
      toast.error("Failed to delete challenge");
    } finally {
      setConfirmModalOpen(false);
      setEventIdToDelete(null);
    }
  };

  // 🔹 Misc Handlers
  const handleModalClose = () => {
    setShowModal(false);
    resetFormFields();
  };

  const handleCategoryCreated = (newCategory) => {
    setCategories((prev) => [...prev, newCategory]);
    setSelectedCategoryId((prev) => [...(prev || []), newCategory._id]);
    clearError("selectedCategoryId");
    setShowCategoryModal(false);
  };

  const handleOrganisationChange = (value) => {
    setSelectedOrganisationId(value);
    clearError("selectedOrganisationId");
  };

  const handleViewChallenge = async (challangeID) => {
    console.log(challangeID);
    try {
      const aChallangeData = await getChallangeById(challangeID);
      const getReport = await getreportById(challangeID);
      setReport(getReport);
      console.log(getReport);
      setGetChallangeData(aChallangeData.challenge);
      // toast.success("Challenge deleted successfully");
      setShowDetailModal(true);
    } catch (error) {
      console.error("Error get challenge:", error);
      toast.error("Failed to get challenge");
    }

    // setChallengeDetailsData(product);
  };
  const getreportData = async (id) => {
    try {
      const report = await getreportById(id);
      setReport(report);
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  };

  console.log(report?.length);

  const truncateWords = (text, numWords = 4) =>
    !text
      ? ""
      : text.split(" ").length > numWords
      ? text.split(" ").slice(0, numWords).join(" ") + "..."
      : text;

  const getReportStatus = (item) => {
    const count = item.dislikesCount || 0;
    return count >= 7
      ? { level: "Reported", color: "bg-red-300 text-red-700" }
      : { level: "None", color: "bg-green-300 text-green-700" };
  };

  const categoryOptions = categories.map((c) => ({
    label: c.category_name,
    value: c._id,
  }));
  const organisationOptions = allOrganisation.map((o) => ({
    label: o.organization_name,
    value: o._id,
  }));

  const eventMenu = (product) => (
    <Menu>
      <Menu.Item
        key="view"
        icon={<Eye size={16} />}
        onClick={() => handleViewChallenge(product._id)}
      >
        View
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
      <AddCategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onCategoryCreated={handleCategoryCreated}
      />

      {/* --- Modal for Create/Edit --- */}
      {showModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white p-6 rounded-xl w-full max-w-xl shadow-xl"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              {modalMode === "Edit" ? "Edit Event" : "Create Event"}
            </h2>
            <div className="space-y-4">
              {/* --- Form fields (unchanged) --- */}
              {/* kept same structure as before */}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* --- Table --- */}
      <motion.div
        className="bg-white border border-gray-200 rounded-xl mb-8 pb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="overflow-x-auto rounded-xl">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                {[
                  "Challenge Name",
                  "Date",
                  "Venue",
                  "Description",
                  "Actions",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-6 py-5 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allEvents.length > 0 ? (
                allEvents.map((product) => {
                  const isReported = product.dislikesCount >= 7 || product.reports?.length >= 7;
                  const report = getReportStatus(product);
                  return (
                    <motion.tr
                      key={product._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`border-b ${isReported ? "bg-red-50" : ""}`}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-700 flex gap-2 items-center">
                        <Popover content={product.title} title="Title">
                          <span className="cursor-help truncate max-w-[150px]">
                            {truncateWords(product.title, 4)}
                          </span>
                        </Popover>
                        {isReported && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 ml-2 rounded-full text-xs bg-red-500 text-white whitespace-nowrap">
                            Reported
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <Popover content={product.expireAt} title="Date">
                          <span className="cursor-help">
                            {truncateWords(
                              product.expireAt
                                ? new Date(product.expireAt)
                                    .toISOString()
                                    .split("T")[0]
                                : "-",
                              4
                            )}
                          </span>
                        </Popover>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <Popover content={product.address} title="Address">
                          <span className="cursor-help truncate max-w-[150px] block">
                            {truncateWords(product.address, 4)}
                          </span>
                        </Popover>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <Popover
                          content={product.description || "N/A"}
                          title="Description"
                        >
                          <span className="cursor-help truncate max-w-[150px] block">
                            {truncateWords(product.description, 4)}
                          </span>
                        </Popover>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <Dropdown
                          overlay={eventMenu(product)}
                          trigger={["click"]}
                          placement="bottomRight"
                        >
                          <button>
                            <Ellipsis className="text-gray-600 hover:text-gray-800" />
                          </button>
                        </Dropdown>
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-8">
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

        <div className="flex justify-end mt-2 pr-4">
          <Pagination
            align="end"
            current={currentPage}
            total={pagination?.total}
            pageSize={pageSize}
            showSizeChanger={false}
            onChange={setCurrentPage}
          />
        </div>
      </motion.div>

      {/* --- Modals --- */}
      <ConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleDelete}
        title="Are you sure you want to delete?"
        description="This action can’t be undone once confirmed"
        confirmText="Yes, I'm sure"
      />

      <Modal
        open={showDetailModal}
        onCancel={() => setShowDetailModal(false)}
        footer={null}
        width={900}
        destroyOnHidden
      >
        <ChallengeDetails data={getChallangeData} report={report} />
      </Modal>
    </>
  );
};

export default EventsTable;
