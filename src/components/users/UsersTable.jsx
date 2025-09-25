import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Edit, Ellipsis, Trash2 } from "lucide-react";
import ConfirmationModal from "../ConfirmationModal";
import { Empty, Pagination, Dropdown, Menu } from "antd";
import { toast } from "react-toastify";

// Hardcoded user data
const initialUsers = [
  {
    _id: "u1",
    first_name: "Alice",
    last_name: "Johnson",
    email: "alice@example.com",
    password: "password123",
    phone: "9876543210",
    status: "active"
  },
  {
    _id: "u2",
    first_name: "Bob",
    last_name: "Smith",
    email: "bob@example.com",
    password: "password456",
    phone: "9123456789",
    status: "inactive"
  }
];

const UsersTable = ({ showModal, setShowModal, modalMode, setModalMode }) => {
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // 'delete' | 'cancel'
  const [openMenuId, setOpenMenuId] = useState(null);
  const [shouldOpenUp, setShouldOpenUp] = useState(false);

  const [allUsers, setAllUsers] = useState(initialUsers);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const pagedUsers = allUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const [totatItems, setTotalItems] = useState(initialUsers.length);

  const [userToDelete, setUserToDelete] = useState(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [errors, setErrors] = useState({});

  const menuRef = useRef(null);

  const resetFormFields = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setStatus("");
    setSelectedUser(null);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!password.trim()) newErrors.password = "Password is required";
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10,15}$/.test(phone.replace(/\s/g, ''))) {
      newErrors.phone = "Please enter a valid phone number (10-15 digits)";
    }
    if (!status) newErrors.status = "Status is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    const newUser = {
      _id: String(Date.now()),
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      phone,
      status
    };
    setAllUsers([newUser, ...allUsers]);
    setTotalItems(allUsers.length + 1);
    toast.success("User added successfully");
    setShowModal(false);
    resetFormFields();
  };

  const handlEditClick = (user) => {
    setSelectedUser(user);
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setEmail(user.email);
    setPhone(user.phone);
    setPassword(user.password);
    setStatus(user.status);
    setModalMode("Edit");
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    resetFormFields();
  };

  const handleEditSubmit = () => {
    if (!selectedUser) return;
    if (!validateForm()) return;
    const updatedUser = {
      ...selectedUser,
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      phone,
      status
    };
    setAllUsers(allUsers.map(u => u._id === selectedUser._id ? updatedUser : u));
    toast.success("User updated successfully");
    setShowModal(false);
    resetFormFields();
  };

  const handleDelete = () => {
    setAllUsers(allUsers.filter(u => u._id !== userToDelete._id));
    setTotalItems(allUsers.length - 1);
    toast.success("User deleted successfully");
    setUserToDelete(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const eventMenu = (user) => (
    <Menu>
      <Menu.Item
        key="edit"
        icon={<Edit size={16} />}
        onClick={() => handlEditClick(user)}
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
              {modalMode === "Edit" ? "Edit User" : "Add User"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-900">
                  First name
                </label>
                <input
                  type="text"
                  placeholder="First name"
                  className="w-full mt-1 p-2 border rounded-md text-gray-600"
                  value={firstName}
                  onChange={(e) => { setFirstName(e.target.value); clearError('firstName'); }}
                />
                {errors.firstName && (
                  <div className="text-red-500 text-xs mt-1">{errors.firstName}</div>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-900">
                  Last name
                </label>
                <input
                  type="text"
                  placeholder="Last name"
                  className="w-full mt-1 p-2 border rounded-md text-gray-600"
                  value={lastName}
                  onChange={(e) => { setLastName(e.target.value); clearError('lastName'); }}
                />
                {errors.lastName && (
                  <div className="text-red-500 text-xs mt-1">{errors.lastName}</div>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-900">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  className="w-full mt-1 p-2 border rounded-md text-gray-500"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
                  required
                />
                {errors.email && (
                  <div className="text-red-500 text-xs mt-1">{errors.email}</div>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-900">
                  Password
                </label>
                <input
                  type="text"
                  placeholder="Password"
                  className="w-full mt-1 p-2 border rounded-md text-gray-500"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearError('password'); }}
                />
                {errors.password && (
                  <div className="text-red-500 text-xs mt-1">{errors.password}</div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-900">
                    Phone Number
                  </label>
                  <div className="relative mt-1 text-gray-900">
                    <input
                      type="number"
                      placeholder="21212143213"
                      className="w-full p-2 pr-10 border rounded-md text-gray-600"
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); clearError('phone'); }}
                    />
                  </div>
                  {errors.phone && (
                    <div className="text-red-500 text-xs mt-1">{errors.phone}</div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-900">
                    Status
                  </label>
                  <select
                    className="w-full mt-1 p-2 border rounded-md text-gray-500 placeholder:add status"
                    value={status}
                    onChange={(e) => { setStatus(e.target.value); clearError('status'); }}
                  >
                    <option value="" disabled hidden>
                      Add status
                    </option>
                    <option value="active">active</option>
                    <option value="inactive">inactive</option>
                  </select>
                  {errors.status && (
                    <div className="text-red-500 text-xs mt-1">{errors.status}</div>
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
      <motion.div
        className="bg-white mb-8 rounded-xl  border border-gray-200 pb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="overflow-x-auto rounded-xl">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {pagedUsers && pagedUsers.length > 0 ? (
                pagedUsers.map((user) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                            {user.first_name.charAt(0)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-700">
                            {user.first_name} {user.last_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === "active"
                            ? "bg-green-800 text-green-100"
                            : "bg-red-800 text-red-100"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 relative">
                      <Dropdown overlay={eventMenu(user)} trigger={['click']} placement="bottomRight">
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
                      description="No users found"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <ConfirmationModal
            isOpen={confirmModalOpen}
            onClose={() => setConfirmModalOpen(false)}
            onConfirm={() => {
              setConfirmModalOpen(false);
              if (modalType === "cancel") handleModalClose();
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
    </>
  );
};
export default UsersTable;
