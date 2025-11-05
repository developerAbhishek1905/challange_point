import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Ellipsis, Edit, Trash2, Eye } from "lucide-react";
import ConfirmationModal from "../ConfirmationModal";
import { Dropdown, Empty, Pagination, Select, Menu } from "antd";
import { toast } from "react-toastify";
import {
  getAllOrganizationsList,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  getAllUsers,
  approve_reject,
} from "../../utils/api";
import OrganizationDetails from "./OrganizationDetails";

const OrganizationTable = ({
  showModal,
  setShowModal,
  modalMode,
  setModalMode,
}) => {
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // 'delete' | 'cancel'
  const [openMenuId, setOpenMenuId] = useState(null);

  const [allOrganisation, setAllOrganisation] = useState([]);
  const [Users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});

  const [organisationName, setOrganisationName] = useState("");
  const [organizationDescription, setOrganizationDescription] = useState("");
  const [organisationEmail, setOrganisationEmail] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [organisationStatus, setOrganisationStatus] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [totalItems, setTotalItems] = useState(0);

  const [organizationToDelete, setOrganizationToDelete] = useState(null);
  const [selectedOrganization, setSelectedOrganization] = useState(null);

  // 🆕 New state for "View" popup
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [organizationToView, setOrganizationToView] = useState(null);
  const [addPopupOpen, setAddPopupOpen] = useState(false);
  const [memberAdded, setMemberAdded] = useState(false);
  const [status, setStatus] = useState({});

  console.log(JSON.stringify(selectedUserId), "selectedUserId");
  // ✅ Fetch organizations once & on demand
  const fetchOrganizations = async () => {
    try {
      const orgs = await getAllOrganizationsList();
      setAllOrganisation(orgs.organizations || []);
      const allusers = await getAllUsers();
      setUsers(allusers.users || []);
      console.log(allusers.users);
      console.log(orgs);
      setTotalItems((orgs.organizations || []).length);
    } catch (error) {
      toast.error("Failed to fetch organizations");
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, [currentPage, memberAdded]);

  // Pagination
  const pagedOrganisations = allOrganisation.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const resetForm = () => {
    setOrganisationName("");
    setOrganizationDescription("");
    setOrganisationEmail("");
    setSelectedUserId("");
    setOrganisationStatus("");
    setSelectedOrganization(null);
    setErrors({});
  };

  const validateOrganizationForm = () => {
    const newErrors = {};
    if (!organisationName.trim())
      newErrors.organisationName = "Organization name is required";
    if (!organizationDescription.trim())
      newErrors.organizationDescription =
        "Organization description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add organization
  const addOrganisation = async () => {
    if (!validateOrganizationForm()) return;
    try {
      const newOrgData = {
        name: organisationName,
        description: organizationDescription,
        // organization_email: organisationEmail,
        // user_id: selectedUserId,
        // status: organisationStatus,
      };
      await createOrganization(newOrgData);
      toast.success("Organization added successfully");
      setShowModal(false);
      resetForm();
      fetchOrganizations(); // ✅ refresh
    } catch (error) {
      toast.error("Failed to add organization");
    }
  };

  // Edit
  const handleEditClick = (organisation) => {
    setSelectedOrganization(organisation);
    setOrganisationName(organisation.name);
    setOrganizationDescription(organisation.description);
    setOrganisationEmail(organisation.organization_email || "");
    setSelectedUserId(organisation.user_id || "");
    setOrganisationStatus(organisation.status || "");
    setModalMode("Edit");
    setShowModal(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedOrganization) return;
    if (!validateOrganizationForm()) return;
    try {
      const updatedOrgData = {
        name: organisationName,
        description: organizationDescription,
        // organization_email: organisationEmail,
        // user_id: selectedUserId,
        // status: organisationStatus,
      };
      await updateOrganization(selectedOrganization._id, updatedOrgData);
      toast.success("Organization updated successfully");
      setShowModal(false);
      resetForm();
      fetchOrganizations(); // ✅ refresh
    } catch (error) {
      toast.error("Failed to update organization");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteOrganization(organizationToDelete);
      toast.success("Organization deleted successfully");
      setOrganizationToDelete(null);
      fetchOrganizations(); // ✅ refresh
    } catch (error) {
      toast.error("Failed to delete organization");
    }
  };

  const apporoveOrganization = async (orgId, status) => {
    try {
      await approve_reject(orgId, status);
      toast.success(
        status?.status === "approved"
          ? "Organization approved"
          : "Organization Rejected"
      );

      fetchOrganizations(); // ✅ refresh
    } catch (error) {
      toast.error("Failed");
    }
  };

  // If you have user data, map it for Select options
  // const UsersOptions = allUsers.map((user) => ({
  //   label: `${user.first_name} ${user.last_name}`,
  //   value: user._id,
  // }));

  const eventMenu = (org) => (
    <Menu>
      {/* 🆕 View Option */}
      {/* <Menu.Item
        key="view"
        icon={<Eye size={16} />}
        onClick={() => {
          setOrganizationToView(Organisation);
          setViewModalOpen(true);
        }}
      >
        View
      </Menu.Item>
      <Menu.Item key="edit" icon={<Edit size={16} />} onClick={() => handleEditClick(Organisation)}>
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
      </Menu.Item> */}
      <Menu.Item key="approve">
        <div
          onClick={() => apporoveOrganization(org._id, { status: "approved" })}
          className="text-green-600 px-3 py-1 rounded-md text-xs text:bg-green-700"
        >
          Approve
        </div>
      </Menu.Item>

      <Menu.Item key="reject">
        <div
          onClick={() => apporoveOrganization(org._id, { status: "denied" })}
          className="text-red-600  px-3 py-1 rounded-md text-xs text:bg-red-700"
        >
          Reject
        </div>
      </Menu.Item>
    </Menu>
  );

  const clearError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <>
      {/* Modal */}
      {showModal && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <motion.div className="bg-white p-6 rounded-xl w-full max-w-xl shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              {modalMode === "Edit" ? "Edit Organization" : "Add Organization"}
            </h2>
            <div className="space-y-4">
              {/* Organization name */}
              <div>
                <label className="text-sm font-medium text-gray-900">
                  Organization name
                </label>
                <input
                  type="text"
                  placeholder="Organization name"
                  className="w-full mt-1 p-2 border rounded-md text-gray-600"
                  value={organisationName}
                  onChange={(e) => {
                    setOrganisationName(e.target.value);
                    clearError("organisationName");
                  }}
                />
                {errors.organisationName && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.organisationName}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-gray-900">
                  Organization Description
                </label>
                <input
                  type="text"
                  placeholder="Organization Code"
                  className="w-full mt-1 p-2 border rounded-md text-gray-600"
                  value={organizationDescription}
                  onChange={(e) => {
                    setOrganizationDescription(e.target.value);
                    clearError("organizationDescription");
                  }}
                />
                {errors.organizationDescription && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.organizationDescription}
                  </div>
                )}
              </div>

              {/* Email */}
              {/* <div>
                <label className="text-sm font-medium text-gray-900">Email Address</label>
                <input
                  type="text"
                  placeholder="example@gmail.com"
                  className="w-full mt-1 p-2 border rounded-md text-gray-500"
                  value={organisationEmail}
                  onChange={(e) => {
                    setOrganisationEmail(e.target.value);
                    clearError("organisationEmail");
                  }}
                />
              </div> */}

              {/* User + Status */}
              {/* <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-900">Assign User</label>
                  <Select
                    showSearch
                    allowClear
                    style={{ width: "100%", marginTop: "0.25rem" }}
                    placeholder={allUsers.length > 0 ? "Select user" : "No users available"}
                    value={selectedUserId || undefined}
                    onChange={(value) => {
                      setSelectedUserId(value);
                      clearError("organisationAssignUser");
                    }}
                    options={UsersOptions}
                    disabled={allUsers.length === 0}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-900">Status</label>
                  <select
                    className="w-full mt-1 p-2 border rounded-md text-gray-500"
                    value={organisationStatus}
                    onChange={(e) => {
                      setOrganisationStatus(e.target.value);
                      clearError("organisationStatus");
                    }}
                  >
                    <option value="" disabled hidden>
                      status
                    </option>
                    <option value="active">active</option>
                    <option value="inactive">inactive</option>
                  </select>
                </div>
              </div> */}

              {/* Buttons */}
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
                  {modalMode === "Edit"
                    ? "Edit Organization"
                    : "Add Organization"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Table */}
      <motion.div
        className="bg-white rounded-xl border border-gray-200 pb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Table container */}
        <div className="overflow-x-auto rounded-xl">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100 hidden md:table-header-group">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Organization Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Created By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Website
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Total Members
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {pagedOrganisations && pagedOrganisations.length > 0 ? (
                pagedOrganisations.map((org) => (
                  <motion.tr
                    key={org._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-50 border-b md:table-row block mb-4 md:mb-0 rounded-lg md:rounded-none shadow-sm md:shadow-none"
                  >
                    {/* Organization Name */}
                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-700 block md:table-cell before:content-['Organization:'] md:before:content-none before:block before:text-gray-500 before:text-xs">
                      {org.companyName}
                    </td>

                    {/* Created By */}
                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-700 block md:table-cell before:content-['Created By:'] md:before:content-none before:block before:text-gray-500 before:text-xs">
                      {org.organizationEmail || "N/A"}
                    </td>

                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-700 block md:table-cell before:content-['Organization:'] md:before:content-none before:block before:text-gray-500 before:text-xs">
                      {org.name}
                    </td>

                    {/* Total Members */}
                    <td
                      className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-700 cursor-pointer block md:table-cell before:content-['Total Members:'] md:before:content-none before:block before:text-gray-500 before:text-xs"
                      onClick={() => {
                        setOrganizationToView(org);
                        setViewModalOpen(true);
                      }}
                      title="View members"
                    >
                      {org.members?.length <= 1
                        ? org.draftMembers?.length
                        : org.members?.length}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-3 text-right block md:table-cell before:content-['Actions:'] md:before:content-none before:block before:text-gray-500 before:text-xs">
                      <div className="flex md:justify-center gap-2">
                        {org.orgStatus === "pending" && (
                          <Dropdown
                            overlay={eventMenu(org)}
                            trigger={["click"]}
                            placement="bottomRight"
                          >
                            <button className="bg-gray-400 text-white px-3 py-1 rounded-md text-xs hover:bg-gray-500">
                              Pending
                            </button>
                          </Dropdown>
                        )}
                        {org.orgStatus === "approved" && (
                          <Dropdown
                            overlay={eventMenu(org)}
                            trigger={["click"]}
                            placement="bottomRight"
                          >
                          <button className="bg-green-600 text-white px-3 py-1 rounded-md text-xs hover:bg-green-700">
                            Approved
                          </button>
                          </Dropdown>
                        )}
                        {org.orgStatus === "denied" && (
                          <Dropdown
                            overlay={eventMenu(org)}
                            trigger={["click"]}
                            placement="bottomRight"
                          >
                          <button className="bg-red-600 text-white px-3 py-1 rounded-md text-xs hover:bg-red-700">
                            Rejected
                          </button>
                          </Dropdown>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-8">
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

        {/* Pagination */}
        <div className="flex justify-end mt-3 pr-4">
          <Pagination
            current={currentPage}
            total={totalItems}
            pageSize={pageSize}
            showSizeChanger={false}
            onChange={setCurrentPage}
          />
        </div>
      </motion.div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={() => {
          setConfirmModalOpen(false);
          if (modalType === "cancel") {
            setShowModal(false);
            resetForm();
          }
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

      {/* 🆕 View Modal */}
      {viewModalOpen && organizationToView && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-6xl h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setViewModalOpen(false)}
              className="absolute top-4 right-4 text-black  bg-gray-100 hover:bg-gray-200 rounded-full px-3  py-1"
            >
              ✕
            </button>
            <OrganizationDetails
              organization={organizationToView}
              Users={Users}
              onMemberAdded={async () => {
                await fetchOrganizations();
                // Find the updated organization and set it for the modal
                const updatedOrg = allOrganisation.find(
                  (org) => org._id === organizationToView._id
                );
                if (updatedOrg) setOrganizationToView(updatedOrg);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default OrganizationTable;
