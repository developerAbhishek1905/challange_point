import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, Ellipsis, Trash2 } from "lucide-react";
import ConfirmationModal from "../ConfirmationModal";
import { Empty, Pagination, Dropdown, Menu } from "antd";
import { toast } from "react-toastify";
import { getAllUsers, signUp, deleteUser, userUpdate } from "../../utils/api";

const UsersTable = ({ showModal, setShowModal, modalMode, setModalMode }) => {
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // 'delete' | 'cancel'
  const [openMenuId, setOpenMenuId] = useState(null);

  const [allUsers, setAllUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [userToDelete, setUserToDelete] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  // ✅ Fetch users from API
  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setAllUsers(data.users || []);
    } catch (error) {
      toast.error("Failed to fetch users");
      setAllUsers([]);
    }
  };

  // ✅ Fetch users once on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const totalItems = allUsers.length;
  const pagedUsers = allUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const resetFormFields = () => {
    setName("");
    setEmail("");
    setSelectedUser(null);
    setErrors({});
  };

  // ✅ Validation
  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Add User
  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      const newUser = { name, email };
      await signUp(newUser);
      toast.success("User added successfully");
      setShowModal(false);
      resetFormFields();
      fetchUsers();
    } catch (error) {
      toast.error("Failed to add user");
    }
  };

  // ✅ Edit Click
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setName(user.name);
    setEmail(user.email);
    setModalMode("Edit");
    setShowModal(true);
  };

  // console.log(name, email, selectedUser._id);
  // ✅ Update User
  const handleEditSubmit = async () => {
    if (!selectedUser || !validateForm()) return;
    try {
      const updatedUser = { name, email };
      await userUpdate(selectedUser._id, updatedUser);
      toast.success("User updated successfully");
      setShowModal(false);
      resetFormFields();
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update user");
    }
  };

  // ✅ Delete User
  const handleDelete = async () => {
    try {
      await deleteUser(userToDelete._id);
      toast.success("User deleted successfully");
      setUserToDelete(null);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const eventMenu = (user) => (
    <Menu>
      <Menu.Item
        key="edit"
        icon={<Edit size={16} />}
        onClick={() => handleEditClick(user)}
      >
        Edit
      </Menu.Item>
      <Menu.Item
        key="delete"
        icon={<Trash2 size={16} />}
        danger
        onClick={() => {
          setUserToDelete(user);
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
      {/* ✅ Modal */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-white p-6 rounded-xl w-full max-w-xl shadow-xl"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              {modalMode === "Edit" ? "Edit User" : "Add User"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-900">
                  Full name
                </label>
                <input
                  type="text"
                  placeholder="Full name"
                  className="w-full mt-1 p-2 border rounded-md text-gray-600"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    clearError("name");
                  }}
                />
                {errors.name && (
                  <div className="text-red-500 text-xs mt-1">{errors.name}</div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-900">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  className="w-full mt-1 p-2 border rounded-md text-gray-600"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError("email");
                  }}
                />
                {errors.email && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.email}
                  </div>
                )}
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
                    modalMode === "Edit" ? handleEditSubmit : handleSubmit
                  }
                >
                  {modalMode === "Edit" ? "Update User" : "Add User"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* ✅ Table */}
      <motion.div
        className="bg-white mb-8 rounded-xl border border-gray-200 pb-2 overflow-x-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Avatar
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Points
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {pagedUsers.length > 0 ? (
              pagedUsers.map((user) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt="Avatar"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-600 font-semibold">
                          {user.name?.charAt(0)?.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{user.name}</td>
                  <td className="px-6 py-4 text-gray-700">{user.email}</td>
                  <td className="px-6 py-4 text-gray-700">{user.points || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 relative">
                    <Dropdown
                      overlay={eventMenu(user)}
                      trigger={["click"]}
                      placement="bottomRight"
                    >
                      <button>
                        <Ellipsis className="text-gray-600 hover:text-gray-800" />
                      </button>
                    </Dropdown>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-8">
                  <Empty
                    description="No users found"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* ✅ Pagination */}
        <Pagination
          align="end"
          current={currentPage}
          total={totalItems}
          pageSize={pageSize}
          showSizeChanger={false}
          onChange={handlePageChange}
          className="p-4"
        />

        {/* ✅ Confirmation Modal */}
        <ConfirmationModal
          isOpen={confirmModalOpen}
          onClose={() => setConfirmModalOpen(false)}
          onConfirm={() => {
            setConfirmModalOpen(false);
            if (modalType === "cancel") {
              setShowModal(false);
              resetFormFields();
            }
            if (modalType === "delete") handleDelete();
          }}
          title={
            modalType === "delete"
              ? "Are you sure you want to delete?"
              : "Are you sure you want to cancel?"
          }
          description="This action cannot be undone."
          confirmText={
            modalType === "delete" ? "Yes, delete" : "Yes, cancel"
          }
        />
      </motion.div>
    </>
  );
};

export default UsersTable;
