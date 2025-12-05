import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Ellipsis, Trash2, Eye,Bell } from "lucide-react";
import { Dropdown, Empty, Pagination, Menu, Popover, Modal } from "antd";
import { toast } from "react-toastify";
import { Search } from "lucide-react";
import {
  getAllOrganizationsList,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  getAllUsers,
  approve_reject,
  actionApproveRejectByAdmin
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
  const [searchValue, setSearchValue] = useState("");
  const pageSize = 8;

  // new: notify modal state
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  const [notifyOrganization, setNotifyOrganization] = useState(null);
  const [notifyLoading, setNotifyLoading] = useState(false);
    const [pageCountForSearch, setPageCountForSearch] = useState(1);


  // ✅ Fetch organizations & users
  const fetchOrganizations = useCallback( async () => {
    try {
      const orgs = await getAllOrganizationsList(searchValue,searchValue==='' ?currentPage : pageCountForSearch, pageSize);
      const allusers = await getAllUsers();

      setAllOrganisation(orgs.organizations || []);
      setUsers(allusers.users || []);
      searchValue === '' && setPageCountForSearch(1);
      setPagination(orgs);
    } catch (error) {
      toast.error("Failed to fetch Group");
    }
  }, [searchValue, currentPage,pageCountForSearch]);

  // ✅ Delete organization
  const handleDelete = async () => {
    try {
      await deleteOrganization(organizationToDelete);
      toast.success("Group deleted successfully");
      setOrganizationToDelete(null);
      fetchOrganizations();
      // setMemberAdded(!memberAdded);
    } catch {
      toast.error("Failed to delete group");
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => fetchOrganizations(), 500);
    return () => clearTimeout(delay);
  }, [fetchOrganizations]);

  
  /** ✅ Pagination handler */
  const handlePageChange = (page) => setCurrentPage(page)||setPageCountForSearch(page);

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
      newErrors.organisationName = "Group name is required";
    if (!organizationDescription.trim())
      newErrors.organizationDescription = "Group description is required";
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
      toast.success("Group added successfully");
      setShowModal(false);
      resetForm();
      setMemberAdded(!memberAdded);
    } catch {
      toast.error("Failed to add group");
    }
  };

  

  // ✅ Approve/Reject organization
  const apporoveOrganization = async (orgId, statusObj) => {
    try {
      await approve_reject(orgId, statusObj);
      toast.success(
        statusObj?.status === "approved"
          ? "Group approved"
          : "Group rejected"
      );
      setMemberAdded(!memberAdded);
    } catch {
      toast.error("Failed");
    }
  };



  // updated: handle notify action -> prevent default, call API, refresh list
  const handleNotifyAction = async (action, e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!notifyOrganization) return;
    setNotifyLoading(true);
    try {
      const res = await actionApproveRejectByAdmin(
        notifyOrganization._id,
        { status: action === "approve" ? "approved" : "denied" }
      );
      toast.success(res?.message || (action === "approve" ? "Approved" : "Denied"));
      setNotifyModalOpen(false);
      setNotifyOrganization(null);
      // refresh data in-place instead of reloading the page
      await fetchOrganizations();
      setMemberAdded((s) => !s);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Action failed");
    } finally {
      setNotifyLoading(false);
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
      toast.success("Group updated successfully");
      setShowModal(false);
      resetForm();
      setMemberAdded(!memberAdded);
    } catch {
      toast.error("Failed to update group");
    }
  };

  const AnimatedModal = ({ children }) => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className="w-full max-w-[60vw] sm:max-w-[90vw]"
  >
    {children}
  </motion.div>
);


  

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
  <Modal
    open={showModal}
    onCancel={() => setShowModal(false)}
    footer={null}
    centered
    width={800}  // ⬅ MAIN WIDTH CONTROL
    distroyOnHidden
    className="max-w-[60vw] md:max-w-[50vw] sm:max-w-[90vw]"
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="p-6"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-900">
        {modalMode === "Edit" ? "Edit Group" : "Add Group"}
      </h2>

      <div className="space-y-4">
        {/* Group Name */}
        <div>
          <label className="text-sm font-medium">Group Name</label>
          <input
            type="text"
            placeholder="Group name"
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
            Group Description
          </label>
          <input
            type="text"
            placeholder="Group Description"
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
            className="w-28 py-2 rounded-md border text-gray-700"
          >
            Cancel
          </button>

          <button
            className="w-28 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            onClick={modalMode === "Edit" ? handleEditSubmit : addOrganisation}
          >
            {modalMode === "Edit" ? "Edit Group" : "Add Group"}
          </button>
        </div>
      </div>
    </motion.div>
  </Modal>
)}


      {/* ✅ Table */}

      <div className="relative w-full my-4 sm:w-72">
          <Search
            className="absolute left-3 top-2.5 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search Group..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full bg-white text-gray-900 placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 shadow-sm"
          />
        </div>
      <motion.div
        className="bg-white rounded-xl border pb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* 🔍 Search Box */}
        
        <div className="rounded-xl overflow-scroll">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                {[ 
                  // "",
                  "Group Name",
                  "Created By",
                  "Website",
                  "Total Members",
                  "Group Description",
                  // "Status",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase whitespace-nowrap"
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
                    {/* <td className="px-3 py-4 text-center">
                      {org.review?.status === "pending" && (
                        <button
                          type="button"
                          onClick={() => handleBellClick(org)}
                          className="inline-flex items-center justify-center text-red-600 hover:text-red-800 cursor-pointer"
                          aria-label="Open review actions"
                        >
                          <Bell size={18} />
                        </button>
                      )}
                    </td> */}
                    
                    <td className="px-3 py-4 text-sm font-medium text-gray-700">
                      <Popover 
                        content={org.companyName}
                        title="Group Name"
                      >
                        <span className="cursor-help truncate block max-w-[120px]">
                          {org.companyName}
                        </span>
                      </Popover>
                    </td>
                    
                    <td className="px-3 py-4 text-sm text-gray-700 truncate max-w-[120px]">
                      {org.organizationEmail || "N/A"}
                    </td>
                    
                    <td className="px-3 py-4 text-sm text-gray-700 truncate max-w-[100px]">
                      {org.organizationWebsite}
                    </td>
                    
                    <td
                      className="px-3 py-4 text-sm text-gray-700 cursor-pointer text-center"
                      onClick={() => {
                        setOrganizationToView(org);
                        setViewModalOpen(true);
                      }}
                    >
                      {(org.members?.length || 0) + (org.draftMembers?.length || 0)}
                    </td>
                    
                    <td className="px-3 py-4 text-sm font-medium text-gray-700">
                      <Popover 
                        content={org.description}
                        title="Group Description"
                      >
                        <span className="cursor-help truncate block max-w-[120px]">
                          {org.description}
                        </span>
                      </Popover>
                    </td>
                    
                    {/* <td className="px-3 py-4">
                      <Dropdown overlay={eventMenu(org)} trigger={["click"]}>
                        <button
                          className={`px-2 py-1 rounded-md text-xs text-white whitespace-nowrap ${
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
                    </td> */}
                    
                    <td className="px-3 py-4 text-center">
                      <Dropdown overlay={ActionMenu(org)} trigger={["click"]}>
                        <Ellipsis className="text-gray-600 hover:text-gray-800 cursor-pointer" size={18} />
                      </Dropdown>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-8">
                    <Empty
                      description="No Groups found"
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
            current={searchValue === '' ? currentPage : pageCountForSearch}
            total={pagination?.totalOrganizations}
            pageSize={pageSize}
            showSizeChanger={false}
            onChange={handlePageChange}
          />
        </div>
      </motion.div>

      {/* notify modal */}
      {notifyModalOpen && notifyOrganization && (
       <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
  <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
    <h3 className="text-lg font-semibol text-black mb-2">Review Group</h3>
  

    {/* <p className="text-sm text-gray-600 mb-4">
      {notifyOrganization.companyName} — {notifyOrganization.organizationEmail}
    </p> */}

    {/* ----------------------------------------------------------- */}
    {/* CALCULATE MEMBER COMPARISON */}
    {/* ----------------------------------------------------------- */}
    {(() => {
      // Safe extraction of emails from nested structures
      const extractEmails = (arr = []) => {
        if (!arr || !Array.isArray(arr)) return [];
        return arr
          .map((item) => {
            // Handle different data structures
            if (typeof item === "string") return item; // direct email string
            if (item?.user?.email) return item.user.email; // nested user object
            if (item?.email) return item.email; // direct email property
            return null;
          })
          .filter(Boolean);
      };

      const previousMembers = [
        ...new Set([
          ...extractEmails(notifyOrganization?.members),
          ...extractEmails(notifyOrganization?.draftMembers),
        ]),
      ];

      const reviewedMembers = [
        ...new Set([
          ...extractEmails(notifyOrganization?.review?.members),
          ...extractEmails(notifyOrganization?.review?.draftMembers),
        ]),
      ];

      // If reviewed list is EMPTY → show NO removed, NO added
      let removedMembers = [];
      let addedMembers = [];

      if (reviewedMembers.length > 0) {
        removedMembers = previousMembers.filter(
          (email) => !reviewedMembers.includes(email)
        );
        addedMembers = reviewedMembers.filter(
          (email) => !previousMembers.includes(email)
        );
      }

      console.log("Previous:", previousMembers);
      console.log("Reviewed:", reviewedMembers);
      console.log("Removed:", removedMembers);
      console.log("Added:", addedMembers);

      return (
        <div className="space-y-6">
          {/* Previous Members */}
          {/* <div>
            <h4 className="font-semibold text-gray-900 text-sm mb-2">
              Previous Members ({previousMembers.length})
            </h4>
            {previousMembers.length > 0 ? (
              <div className="max-h-40 overflow-y-auto border rounded">
                <table className="w-full text-sm">
                  <tbody>
                    {previousMembers.map((email, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="p-2 text-gray-700">{email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic">No previous members</p>
            )}
          </div> */}

          {/* Removed Members */}
          <div>
            <h4 className="font-semibold text-sm mb-2 text-red-700">
              Removed Members ({removedMembers.length})
            </h4>
            {removedMembers.length > 0 ? (
              <div className="max-h-40 overflow-y-auto border border-red-200 rounded bg-red-50">
                <table className="w-full text-sm">
                  <tbody>
                    {removedMembers.map((email, i) => (
                      <tr key={i} className="border-b bg-red-100">
                        <td className="p-2 text-red-700 font-medium">- {email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic">No members removed</p>
            )}
          </div>

          {/* Added Members */}
          <div>
            <h4 className="font-semibold text-sm mb-2 text-green-700">
              Added Members ({addedMembers.length})
            </h4>
            {addedMembers.length > 0 ? (
              <div className="max-h-40 overflow-y-auto border border-green-200 rounded bg-green-50">
                <table className="w-full text-sm">
                  <tbody>
                    {addedMembers.map((email, i) => (
                      <tr key={i} className="border-b bg-green-100">
                        <td className="p-2 text-green-700 font-medium">+ {email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic">No new members added</p>
            )}
          </div>
        </div>
      );
    })()}

    {/* ----------------------------------------------------------- */}
    {/* BUTTONS */}
    {/* ----------------------------------------------------------- */}
    <div className="flex gap-3 justify-end mt-6">
      <button
        type="button"
        onClick={() => {
          setNotifyModalOpen(false);
          setNotifyOrganization(null);
        }}
        className="px-4 py-2 border rounded-md text-gray-700"
      >
        Close
      </button>

      <button
        type="button"
        onClick={(e) => handleNotifyAction("deny", e)}
        disabled={notifyLoading}
        className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
      >
        {notifyLoading ? "Processing..." : "Deny"}
      </button>

      <button
        type="button"
        onClick={(e) => handleNotifyAction("approve", e)}
        disabled={notifyLoading}
        className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
      >
        {notifyLoading ? "Processing..." : "Approve"}
      </button>
    </div>
  </div>
</div>
      )}

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
        <Modal
        
        open={viewModalOpen && organizationToView}
          onCancel={() => setViewModalOpen(false)}
          footer={null}
          centered 
          width={900}
          destroyOnClose
           className="bg-white rounded-2xl shadow-lg w-full max-w-6xl h-[90vh] overflow-y-auto relative"

        >
        {/* <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 text-black"> */}
          {/* <div className="bg-white rounded-2xl shadow-lg w-full max-w-6xl h-[90vh] overflow-y-auto relative"> */}
            {/* <button
              onClick={() => setViewModalOpen(false)}
              className="absolute top-4 right-4 text-black bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1"
            >
              ✕
            </button> */}
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
          {/* </div> */}
        {/* // </div> */}
        </Modal>
      )}
    </>
  );
};

export default OrganizationTable;
