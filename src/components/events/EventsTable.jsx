import { motion } from "framer-motion";
import { Edit, Ellipsis, Eye, Trash2 } from "lucide-react";
import { useState } from "react";
import { DatePicker, Dropdown, Empty, Input, Menu, Pagination, Select, TimePicker } from "antd";
import dayjs from "dayjs";
import ConfirmationModal from "../ConfirmationModal";
import AddCategoryModal from "./AddCategoryModal";
import { toast } from "react-toastify";

// Hardcoded data
const initialEvents = [
  {
    _id: "1",
    event_name: "Annual Sports Meet",
    event_code: "CHE001",
    date: "2025-09-20",
    time: "10:00",
    venue: "Main Stadium",
    organization_name: "Checkpoint Org",
    organization_id: { _id: "org1" },
    category_id: [
      { _id: "cat1", category_name: "Track" },
      { _id: "cat2", category_name: "Field" }
    ],
    totalParticipants: 120
  },
  {
    _id: "2",
    event_name: "Science Fair",
    event_code: "CHE002",
    date: "2025-10-05",
    time: "09:00",
    venue: "Auditorium",
    organization_name: "Checkpoint Org",
    organization_id: { _id: "org1" },
    category_id: [
      { _id: "cat3", category_name: "Robotics" }
    ],
    totalParticipants: 80
  }
];

const initialCategories = [
  { _id: "cat1", category_name: "Track" },
  { _id: "cat2", category_name: "Field" },
  { _id: "cat3", category_name: "Robotics" }
];

const initialOrganisations = [
  { _id: "org1", organization_name: "Checkpoint Org" },
  { _id: "org2", organization_name: "Tech Society" }
];

const EventsTable = ({
  showModal,
  setShowModal,
  modalMode,
  setModalMode,
}) => {
  const [allEvents, setAllEvents] = useState(initialEvents);
  const [categories, setCategories] = useState(initialCategories);
  const [allOrganisation, setAllOrgainisation] = useState(initialOrganisations);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totatItems, setTotalItems] = useState(initialEvents.length);

  const [eventName, setEventName] = useState("");
  const [eventCode, setEventCode] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTIme, setEventTime] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState([]);
  const [selectedOrganisationId, setSelectedOrganisationId] = useState("");
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [eventIdToDelete, setEventIdToDelete] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [errors, setErrors] = useState({});

  // Pagination logic (hardcoded for demo)
  const pageSize = 5;
  const pagedEvents = allEvents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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

  const validateForm = () => {
    const newErrors = {};
    if (!eventName.trim()) newErrors.eventName = "Event name is required";
    if (!eventCode.trim()) newErrors.eventCode = "Event code is required";
    if (!eventDate) newErrors.eventDate = "Event date is required";
    if (!eventTIme) newErrors.eventTIme = "Event time is required";
    if (!eventVenue.trim()) newErrors.eventVenue = "Event venue is required";
    if (!selectedCategoryId || selectedCategoryId.length === 0) newErrors.selectedCategoryId = "At least one category is required";
    if (!selectedOrganisationId) newErrors.selectedOrganisationId = "Organization is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    const newEvent = {
      _id: String(Date.now()),
      event_name: eventName,
      event_code: `CHE${eventCode}`,
      date: eventDate.format("YYYY-MM-DD"),
      time: eventTIme.format("HH:mm"),
      venue: eventVenue,
      organization_name: allOrganisation.find(org => org._id === selectedOrganisationId)?.organization_name || "",
      organization_id: { _id: selectedOrganisationId },
      category_id: categories.filter(cat => selectedCategoryId.includes(cat._id)),
      totalParticipants: 0
    };
    setAllEvents([newEvent, ...allEvents]);
    setTotalItems(allEvents.length + 1);
    toast.success("Event created successfully");
    resetFormFields();
    handleModalClose();
  };

  const handlEditClick = (event) => {
    setSelectedEvent(event);
    setEventName(event.event_name);
    setEventCode(event.event_code.replace("CHE", ""));
    setEventDate(dayjs(event.date));
    setEventTime(dayjs(event.time, 'HH:mm'));
    setEventVenue(event.venue);
    setSelectedCategoryId(event.category_id?.map(cat => cat._id) || []);
    setSelectedOrganisationId(event.organization_id?._id || "");
    setModalMode("Edit");
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    resetFormFields();
  };

  const handleEditSubmit = () => {
    if (!validateForm()) return;
    if (!selectedEvent) return;
    const updatedEvent = {
      ...selectedEvent,
      event_name: eventName,
      event_code: `CHE${eventCode}`,
      date: eventDate.format("YYYY-MM-DD"),
      time: eventTIme.format("HH:mm"),
      venue: eventVenue,
      organization_name: allOrganisation.find(org => org._id === selectedOrganisationId)?.organization_name || "",
      organization_id: { _id: selectedOrganisationId },
      category_id: categories.filter(cat => selectedCategoryId.includes(cat._id)),
    };
    setAllEvents(allEvents.map(ev => ev._id === selectedEvent._id ? updatedEvent : ev));
    toast.success("Event updated successfully");
    handleModalClose();
  };

  const handleCategoryChange = (values) => {
    setSelectedCategoryId(values);
  };

  const handleOrganisationChange = (value) => {
    setSelectedOrganisationId(value);
    clearError("selectedOrganisationId");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = () => {
    setAllEvents(allEvents.filter(ev => ev._id !== eventIdToDelete));
    setTotalItems(allEvents.length - 1);
    toast.success("Event deleted successfully");
    setEventIdToDelete(null);
  };

  const handleCategoryCreated = (newCategory) => {
    setCategories(prevCategories => [...prevCategories, newCategory]);
    setSelectedCategoryId(prevSelected =>
      prevSelected ? [...prevSelected, newCategory._id] : [newCategory._id]
    );
    clearError("selectedCategoryId");
    setShowCategoryModal(false);
  };

  const categoryOptions = categories.map((category) => ({
    label: category.category_name,
    value: category._id,
  }));

  const OrganisationOptions = allOrganisation.map((organisation) => ({
    label: organisation.organization_name,
    value: organisation._id,
  }));

  const eventMenu = (product) => (
    <Menu>
      <Menu.Item
        key="view"
        icon={<Eye size={16} />}
        onClick={() => {
          setShowDetailModal(true);
          setOpenMenuId(product._id);
        }}
      >
        View
      </Menu.Item>
      <Menu.Item
        key="edit"
        icon={<Edit size={16} />}
        onClick={() => handlEditClick(product)}
      >
        Edit
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

  const clearError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <>
      {/* Category Modal */}
      <AddCategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onCategoryCreated={handleCategoryCreated}
      />

      {showModal && (
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
            className="bg-white p-6 rounded-xl w-full max-w-xl shadow-xl"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              {modalMode === "Edit" ? "Edit Event" : "Create Event"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-900">
                  Event name
                </label>
                <Input
                  placeholder="Event Name"
                  value={eventName}
                  onChange={(e) => { setEventName(e.target.value); clearError("eventName"); }}
                  className="w-full mt-1 p-2 border rounded-md text-gray-500"
                />
                {errors.eventName && (
                  <div className="text-red-500 text-xs mt-1">{errors.eventName}</div>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-900">
                  Event code
                </label>
                <Input
                  placeholder="Event Code"
                  value={eventCode}
                  onChange={(e) => { setEventCode(e.target.value); clearError("eventCode"); }}
                  className="w-full mt-1 p-2 border rounded-md text-gray-500"
                />
                {errors.eventCode && (
                  <div className="text-red-500 text-xs mt-1">{errors.eventCode}</div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-900">
                    Date
                  </label>
                  <div className="relative mt-1 text-gray-900">
                    <DatePicker
                      value={eventDate}
                      onChange={(date) => { setEventDate(date); clearError("eventDate"); }}
                      className="w-full p-2 pr-10 border rounded-md text-gray-600"
                      disabledDate={(current) => current && current < dayjs().startOf('day')}
                    />
                  </div>
                  {errors.eventDate && (
                    <div className="text-red-500 text-xs mt-1">{errors.eventDate}</div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-900">
                    Time
                  </label>
                  <div className="relative mt-1">
                    <TimePicker
                      use12Hours
                      format="h:mm A"
                      value={eventTIme}
                      onChange={(time) => { setEventTime(time); clearError("eventTIme"); }}
                      className="w-full p-2 pr-10 border rounded-md text-gray-600"
                    />
                  </div>
                  {errors.eventTIme && (
                    <div className="text-red-500 text-xs mt-1">{errors.eventTIme}</div>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-900">
                  Venue
                </label>
                <Input
                  placeholder="Venue"
                  value={eventVenue}
                  onChange={(e) => { setEventVenue(e.target.value); clearError("eventVenue"); }}
                  className="w-full mt-1 p-2 border rounded-md text-gray-500"
                />
                {errors.eventVenue && (
                  <div className="text-red-500 text-xs mt-1">{errors.eventVenue}</div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-900">
                    Category
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-grow">
                      <div className="border rounded-md p-2 mt-1 min-h-10 flex flex-wrap gap-1">
                        {selectedCategoryId && selectedCategoryId.length > 0 ? (
                          categories
                            .filter(cat => selectedCategoryId.includes(cat._id))
                            .map((cat) => (
                              <div key={cat._id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center">
                                <span>{cat.category_name}</span>
                                <button
                                  onClick={() => {
                                    setSelectedCategoryId(prev => {
                                      const updated = prev.filter(id => id !== cat._id);
                                      if (updated.length === 0) clearError("selectedCategoryId");
                                      return updated;
                                    });
                                  }}
                                  className="ml-1 text-blue-500 hover:text-blue-700 font-bold"
                                >
                                  ×
                                </button>
                              </div>
                            ))
                        ) : (
                          <div className="text-gray-400">No categories selected</div>
                        )}
                      </div>
                    </div>
                    <button
                      className="bg-blue-500 text-white px-3 py-2 rounded-md text-sm"
                      onClick={() => setShowCategoryModal(true)}
                    >
                      Add Category
                    </button>
                  </div>
                  {errors.selectedCategoryId && (
                    <div className="text-red-500 text-xs mt-1">{errors.selectedCategoryId}</div>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-900">
                  Organization
                </label>
                <Select
                  showSearch
                  allowClear
                  style={{ width: '100%', marginTop: '0.25rem' }}
                  placeholder="Select organization"
                  value={selectedOrganisationId || undefined}
                  onChange={handleOrganisationChange}
                  options={OrganisationOptions}
                  optionFilterProp="label"
                />
                {errors.selectedOrganisationId && (
                  <div className="text-red-500 text-xs mt-1">{errors.selectedOrganisationId}</div>
                )}
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={handleModalClose}
                  className="px-4 py-2 rounded-md border text-gray-700"
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                  onClick={
                    modalMode === "Edit" ? handleEditSubmit : handleSubmit
                  }
                >
                  {modalMode === "Edit" ? "Update Event" : "Create Event"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
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
                <th className="px-6 py-5 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-5 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {pagedEvents && pagedEvents.length > 0 ? (
                pagedEvents.map((product) => (
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      Ongoing
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 relative">
                      <Dropdown overlay={eventMenu(product)} trigger={['click']} placement="bottomRight">
                        <button>
                          <Ellipsis className="text-gray-600 hover:text-gray-800" />
                        </button>
                      </Dropdown>
                    </td>
                  </motion.tr>
                ))
              ) : (
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
        <Pagination
          align="end"
          defaultCurrent={currentPage}
          total={totatItems}
          pageSize={pageSize}
          showSizeChanger={false}
          onChange={handlePageChange}
        />
      </motion.div>

      <ConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={() => {
          setConfirmModalOpen(false);
          handleDelete();
        }}
        title={"Are you sure you want to delete?"}
        description="This action can’t be undone once confirmed"
        confirmText={"Yes, I'm sure"}
      />
    </>
  );
};
export default EventsTable;
