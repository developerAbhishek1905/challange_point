import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Ellipsis, Edit, Trash2 } from "lucide-react";
import ConfirmationModal from "../ConfirmationModal";
import { Dropdown, Empty, Pagination, Select, Menu } from "antd";
import { toast } from "react-toastify";

// Hardcoded organization data
const initialOrganisations = [
  {
    _id: "org1",
    organization_name: "Checkpoint Org",
    code: "CHO001",
    organization_email: "checkpoint@org.com",
    user_id: { _id: "u1", first_name: "Alice", last_name: "Johnson" },
    status: "active"
  },
  {
    _id: "org2",
    organization_name: "Tech Society",
    code: "CHO002",
    organization_email: "techsociety@org.com",
    user_id: { _id: "u2", first_name: "Bob", last_name: "Smith" },
    status: "inactive"
  }
];

// Hardcoded user data
const initialUsers = [
  { _id: "u1", first_name: "Alice", last_name: "Johnson" },
  { _id: "u2", first_name: "Bob", last_name: "Smith" }
];

const OrganizationTable = ({ showModal, setShowModal, modalMode, setModalMode }) => {
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // 'delete' | 'cancel'
  const [openMenuId, setOpenMenuId] = useState(null);

  const [allOrganisation, setAllOrgainisation] = useState(initialOrganisations);
  const [allUsers, setAllUsers] = useState(initialUsers);
  const [errors, setErrors] = useState({});

  const [organisationName, setOrganisationName] = useState('');
  const [organisationCode, setOrganisationCode] = useState('');
  const [organisationEmail, setOrganisationEmail] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [organisationStatus, setOrganisationStatus] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const pagedOrganisations = allOrganisation.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const [totatItems, setTotalItems] = useState(initialOrganisations.length);

  const [organizationToDelete, setOrganizationToDelete] = useState(null);
  const [selectedOrganization, setSelectedOrganization] = useState(null);

  const resetForm = () => {
    setOrganisationName('');
    setOrganisationCode('');
    setOrganisationEmail('');
    setSelectedUserId('');
    setOrganisationStatus('');
    setSelectedOrganization(null);
    setErrors({});
  };

  const validateOrganizationForm = () => {
    const newErrors = {};
    if (!organisationName.trim()) newErrors.organisationName = "Organization name is required";
    if (!organisationCode.trim()) newErrors.organisationCode = "Organization code is required";
    if (!organisationEmail.trim()) {
      newErrors.organisationEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(organisationEmail)) {
      newErrors.organisationEmail = "Please enter a valid email address";
    }
    if (!selectedUserId) newErrors.organisationAssignUser = "Assigning a user is required";
    if (!organisationStatus) newErrors.organisationStatus = "Status is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addOrganisation = () => {
    if (!validateOrganizationForm()) return;
    const newOrg = {
      _id: String(Date.now()),
      organization_name: organisationName,
      code: `CHO${organisationCode}`,
      organization_email: organisationEmail,
      user_id: allUsers.find(u => u._id === selectedUserId),
      status: organisationStatus
    };
    setAllOrgainisation([newOrg, ...allOrganisation]);
    setTotalItems(allOrganisation.length + 1);
    toast.success("Organization added successfully");
    setShowModal(false);
    resetForm();
  };

  const handlEditClick = (organisation) => {
    setSelectedOrganization(organisation);
    setOrganisationName(organisation.organization_name);
    setOrganisationCode(organisation.code.replace("CHO", ""));
    setOrganisationEmail(organisation.organization_email);
    setSelectedUserId(organisation.user_id?._id || "");
    setOrganisationStatus(organisation.status);
    setModalMode("Edit");
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    resetForm();
  };

  const handleEditSubmit = () => {
    if (!selectedOrganization) return;
    if (!validateOrganizationForm()) return;
    const updatedOrg = {
      ...selectedOrganization,
      organization_name: organisationName,
      code: `CHO${organisationCode}`,
      organization_email: organisationEmail,
      user_id: allUsers.find(u => u._id === selectedUserId),
      status: organisationStatus
    };
    setAllOrgainisation(allOrganisation.map(org => org._id === selectedOrganization._id ? updatedOrg : org));
    toast.success("Organization updated successfully");
    setShowModal(false);
    resetForm();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = () => {
    setAllOrgainisation(allOrganisation.filter(org => org._id !== organizationToDelete));
    setTotalItems(allOrganisation.length - 1);
    toast.success("Organization deleted successfully");
    setOrganizationToDelete(null);
  };

  const UsersOptions = allUsers.map((user) => ({
    label: `${user.first_name} ${user.last_name}`,
    value: user._id,
  }));

  const eventMenu = (Organisation) => (
    <Menu>
      <Menu.Item
        key="edit"
        icon={<Edit size={16} />}
        onClick={() => handlEditClick(Organisation)}
      >
        Edit
      </Menu.Item>
      <Menu.Item
        key="delete"
        icon={<Trash2 size={16} />}
        danger
        onClick={() => {
          setOrganizationToDelete(Organisation._id);
          setConfirmModalOpen(true);
          setModalType("delete");
          setOpenMenuId(null);
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
              {modalMode === "Edit" ? "Edit Organization" : "Add Organization"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-900">
                  Organization name
                </label>
                <input
                  type="text"
                  placeholder="Organization name"
                  className="w-full mt-1 p-2 border rounded-md text-gray-600"
                  value={organisationName}
                  onChange={(e) => { setOrganisationName(e.target.value); clearError('organisationName'); }}
                />
                {errors.organisationName && (
                  <div className="text-red-500 text-xs mt-1">{errors.organisationName}</div>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-900">
                  Organization Code
                </label>
                <input
                  type="text"
                  placeholder="Organization Code"
                  className="w-full mt-1 p-2 border rounded-md text-gray-600"
                  value={organisationCode}
                  onChange={(e) => { setOrganisationCode(e.target.value); clearError('organisationCode'); }}
                />
                {errors.organisationCode && (
                  <div className="text-red-500 text-xs mt-1">{errors.organisationCode}</div>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-900">
                  Email Address
                </label>
                <input
                  type="text"
                  placeholder="example@gmail.com"
                  className="w-full mt-1 p-2 border rounded-md text-gray-500"
                  value={organisationEmail}
                  onChange={(e) => { setOrganisationEmail(e.target.value); clearError('organisationEmail'); }}
                />
                {errors.organisationEmail && (
                  <div className="text-red-500 text-xs mt-1">{errors.organisationEmail}</div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-900">
                    Assign User
                  </label>
                  <Select
                    showSearch
                    allowClear
                    style={{ width: '100%', marginTop: '0.25rem' }}
                    placeholder={allUsers.length > 0 ? "Select user" : "No users available"}
                    value={selectedUserId || undefined}
                    onChange={(value) => {
                      setSelectedUserId(value);
                      clearError("organisationAssignUser");
                    }}
                    options={UsersOptions}
                    optionFilterProp="label"
                    disabled={allUsers.length === 0}
                    notFoundContent={allUsers.length === 0 ? "No users available" : "No matching users"}
                  />
                  {errors.organisationAssignUser && (
                    <div className="text-red-500 text-xs mt-1">{errors.organisationAssignUser}</div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-900">
                    Status
                  </label>
                  <select
                    className="w-full mt-1 p-2 border rounded-md text-gray-500"
                    value={organisationStatus}
                    onChange={(e) => { setOrganisationStatus(e.target.value); clearError('organisationStatus'); }}
                  >
                    <option value="" disabled hidden>status</option>
                    <option value="active">active</option>
                    <option value="inactive">inactive</option>
                  </select>
                  {errors.organisationStatus && (
                    <div className="text-red-500 text-xs mt-1">{errors.organisationStatus}</div>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => {
                    setModalType("cancel");
                    setConfirmModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-md border text-gray-700"
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                  onClick={
                    modalMode === "Edit" ? handleEditSubmit : addOrganisation
                  }
                >
                  {modalMode === "Edit" ? "Edit Organization" : "Add Organization"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      <motion.div
        className="bg-white rounded-xl border border-gray-200 pb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="overflow-x-auto rounded-xl">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Person in charge
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {pagedOrganisations && pagedOrganisations.length > 0 ? (
                pagedOrganisations.map((Organisation) => (
                  <motion.tr
                    key={Organisation._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 flex gap-2 items-center">
                      {Organisation.organization_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                      {Organisation.code ? Organisation.code : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                      {Organisation?.user_id?.first_name} {Organisation?.user_id?.last_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                      {Organisation.organization_email ? Organisation.organization_email : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          Organisation.status === "active"
                            ? "bg-green-900 text-white"
                            : Organisation.status === "inactive"
                            ? "bg-red-800 text-white"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {Organisation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 relative">
                      <Dropdown overlay={eventMenu(Organisation)} trigger={['click']} placement="bottomRight">
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
                      description="No organizations found"
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
          if (modalType === "cancel") { setShowModal(false); resetForm(); }
          if (modalType === "delete") handleDelete();
        }}
        title={
          modalType === "delete"
            ? "Are you sure you want to delete?"
            : "Are you sure you want to cancel?"
        }
        description="This action can’t be undone once confirmed"
        confirmText={modalType === "delete" ? "Yes, I'm sure" : "Yes, Cancel"}
      />
    </>
  );
};
export default OrganizationTable;
