import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Ellipsis, Trash2, Eye } from "lucide-react";
import { Dropdown, Empty, Pagination, Menu } from "antd";
import { toast } from "react-toastify";
import {
  getAllOrganizationsList,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  getAllUsers,
  approve_reject,
} from "../../utils/api";
import ConfirmationModal from "../ConfirmationModal";
import OrganizationDetails from "./OrganizationDetails";

const OrganizationTable = ({
  showModal,
  setShowModal,
  modalMode,
  setModalMode,
  currentPage,
  setCurrentPage,
  organizations,
  memberAdded,
  setMemberAdded,
  searchValue,
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
  const [pagination, setPagination] = useState("");
  const [organizationToDelete, setOrganizationToDelete] = useState(null);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [organizationToView, setOrganizationToView] = useState(null);
  const [status, setStatus] = useState({});
  const pageSize = 6;

  // ✅ Fetch organizations & users
  const fetchOrganizations = async () => {
    try {
      const orgs = await getAllOrganizationsList(searchValue, currentPage, pageSize);
      const allusers = await getAllUsers();

      setAllOrganisation(orgs.organizations || []);
      setUsers(allusers.users || []);
      setPagination(orgs);
    } catch (error) {
      toast.error("Failed to fetch organizations");
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => fetchOrganizations(searchValue, currentPage), 500);
    return () => clearTimeout(delay);
  }, [searchValue, memberAdded, currentPage]);

  // ✅ Pagination slice (only for UI, not backend-driven pagination)
  const pagedOrganisations = allOrganisation.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // ✅ Reset form
  const resetForm = () => {
    setOrganisationName("");
    setOrganizationDescription("");
    setOrganisationEmail("");
    setSelectedUserId("");
    setOrganisationStatus("");
    setSelectedOrganization(null);
    setErrors({});
  };

  // ✅ Form validation
  const validateOrganizationForm = () => {
    const newErrors = {};
    if (!organisationName.trim())
      newErrors.organisationName = "Organization name is required";
    if (!organizationDescription.trim())
      newErrors.organizationDescription = "Organization description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Add organization
  const addOrganisation = async () => {
    if (!validateOrganizationForm()) return;
    try {
      const newOrgData = {
        name: organisationName,
        description: organizationDescription,
      };
      await createOrganization(newOrgData);
      toast.success("Organization added successfully");
      setShowModal(false);
      resetForm();
      setMemberAdded(!memberAdded);
    } catch {
      toast.error("Failed to add organization");
    }
  };

  // ✅ Delete organization
  const handleDelete = async () => {
    try {
      await deleteOrganization(organizationToDelete);
      toast.success("Organization deleted successfully");
      setOrganizationToDelete(null);
      setMemberAdded(!memberAdded);
    } catch {
      toast.error("Failed to delete organization");
    }
  };

  // ✅ Approve/Reject organization
  const apporoveOrganization = async (orgId, status) => {
    try {
      await approve_reject(orgId, status);
      toast.success(
        status?.status === "approved"
          ? "Organization approved"
          : "Organization rejected"
      );
      setMemberAdded(!memberAdded);
    } catch {
      toast.error("Failed");
    }
  };

  // ✅ Edit organization
  const handleEditSubmit = async () => {
    if (!selectedOrganization || !validateOrganizationForm()) return;
    try {
      const updatedOrgData = {
        name: organisationName,
        description: organizationDescription,
      };
      await updateOrganization(selectedOrganization._id, updatedOrgData);
      toast.success("Organization updated successfully");
      setShowModal(false);
      resetForm();
      setMemberAdded(!memberAdded);
    } catch {
      toast.error("Failed to update organization");
    }
  };

  // ✅ Menus
  const eventMenu = (org) => (
    <Menu>
      <Menu.Item key="approve">
        <div
          onClick={() => apporoveOrganization(org._id, { status: "approved" })}
          className="text-green-600 text-xs"
        >
          Approve
        </div>
      </Menu.Item>
      <Menu.Item key="reject">
        <div
          onClick={() => apporoveOrganization(org._id, { status: "denied" })}
          className="text-red-600 text-xs"
        >
          Reject
        </div>
      </Menu.Item>
    </Menu>
  );

  const ActionMenu = (org) => (
    <Menu>
      <Menu.Item
        key="view"
        icon={<Eye size={16} />}
        onClick={() => {
          setOrganizationToView(org);
          setViewModalOpen(true);
        }}
      >
        View
      </Menu.Item>
      <Menu.Item
        key="delete"
        icon={<Trash2 size={16} />}
        danger
        onClick={() => {
          setOrganizationToDelete(org._id);
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
      {/* ✅ Add/Edit Modal */}
      {showModal && (
        <motion.div className="fixed inset-0 text-black z-50 flex items-center justify-center bg-black bg-opacity-40">
          <motion.div className="bg-white p-6 rounded-xl w-full max-w-xl shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              {modalMode === "Edit" ? "Edit Organization" : "Add Organization"}
            </h2>
            <div className="space-y-4">
              {/* Organization name */}
              <div>
                <label className="text-sm font-medium">Organization name</label>
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
                  placeholder="Organization Description"
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

      {/* ✅ Table */}
      <motion.div
        className="bg-white rounded-xl border pb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="overflow-x-auto rounded-xl">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                {[
                  "Organization Name",
                  "Created By",
                  "Website",
                  "Total Members",
                  "Status",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {allOrganisation.length > 0 ? (
                allOrganisation.map((org) => (
                  <motion.tr
                    key={org._id}
                    className="hover:bg-gray-50 border-b"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">
                      {org.companyName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {org.organizationEmail || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {org.name}
                    </td>
                    <td
                      className="px-6 py-4 text-sm text-gray-700 cursor-pointer"
                      onClick={() => {
                        setOrganizationToView(org);
                        setViewModalOpen(true);
                      }}
                    >
                      {org.members?.length || 0}
                    </td>
                    <td className="px-6 py-4">
                      <Dropdown overlay={eventMenu(org)} trigger={["click"]}>
                        <button
                          className={`px-3 py-1 rounded-md text-xs text-white ${
                            org.orgStatus === "pending"
                              ? "bg-gray-400 hover:bg-gray-500"
                              : org.orgStatus === "approved"
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-red-600 hover:bg-red-700"
                          }`}
                        >
                          {org.orgStatus === "pending"
                            ? "Pending"
                            : org.orgStatus === "approved"
                            ? "Approved"
                            : "Rejected"}
                        </button>
                      </Dropdown>
                    </td>
                    <td className="px-6 py-4">
                      <Dropdown overlay={ActionMenu(org)} trigger={["click"]}>
                        <Ellipsis className="text-gray-600 hover:text-gray-800 cursor-pointer" />
                      </Dropdown>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8">
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

        {/* ✅ Pagination */}
        <div className="flex justify-end mt-3 pr-4">
          <Pagination
            current={currentPage}
            total={pagination?.totalOrganizations}
            pageSize={pageSize}
            showSizeChanger={false}
            onChange={setCurrentPage}
          />
        </div>
      </motion.div>

      {/* ✅ Confirmation Modal */}
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

      {/* ✅ View Modal */}
      {viewModalOpen && organizationToView && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 text-black">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-6xl h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setViewModalOpen(false)}
              className="absolute top-4 right-4 text-black bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1"
            >
              ✕
            </button>
            <OrganizationDetails
              organization={organizationToView}
              setViewModalOpen={setViewModalOpen}
              Users={Users}
              onMemberAdded={async () => {
                await fetchOrganizations();
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
