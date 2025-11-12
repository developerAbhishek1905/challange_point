import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Eye, Ellipsis, Trash2 } from "lucide-react";
import { Empty, Pagination, Dropdown, Menu } from "antd";
import { toast } from "react-toastify";
import ConfirmationModal from "../ConfirmationModal";
import { getAllUsers, deleteUser } from "../../utils/api";

const UsersTable = ({ searchValue }) => {
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // 'delete' | 'cancel'
  const [viewUser, setViewUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  const pageSize = 8;

  /** ✅ Fetch users */
  const fetchUsers = useCallback(async () => {
    try {
      const data = await getAllUsers(searchValue, currentPage, pageSize);
      setAllUsers(data?.users || []);
      setPagination(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
      setAllUsers([]);
    }
  }, [searchValue, currentPage]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => fetchUsers(), 500);
    return () => clearTimeout(delayDebounce);
  }, [fetchUsers]);

  /** ✅ Delete User */
  const handleDelete = async () => {
    try {
      await deleteUser(userToDelete._id);
      toast.success("User deleted successfully");
      setUserToDelete(null);
      fetchUsers();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  /** ✅ Pagination handler */
  const handlePageChange = (page) => setCurrentPage(page);

  const filteredUsers = allUsers.filter((user)=> user.email.includes("@admin.com") === false)

  

  /** ✅ Dropdown menu for actions */
  const eventMenu = (user) => (
    <Menu>
      <Menu.Item
        key="view"
        icon={<Eye size={16} />}
        onClick={() => setViewUser(user)}
      >
        View
      </Menu.Item>
      <Menu.Item
        key="delete"
        icon={<Trash2 size={16} />}
        danger
        onClick={() => {
          setUserToDelete(user);
          setConfirmModalOpen(true);
          setModalType("delete");
        }}
      >
        Delete
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      {/* ✅ View Modal */}
      {viewUser && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-white p-6 rounded-xl w-full max-w-3xl shadow-xl overflow-y-auto max-h-[90vh]"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 text-center">
              User Details
            </h2>

            {/* ✅ Profile Section */}
            <div className="flex flex-col items-center justify-center rounded-lg py-6 mb-6 shadow-sm">
              <div
                className="h-24 w-24 rounded-full overflow-hidden bg-gray-200 border-4 shadow-md"
                style={{
                  border: `4px solid rgb(
                    ${viewUser?.challengeTypeCounts?.human || 0}, 
                    ${viewUser?.challengeTypeCounts?.nature || 0}, 
                    ${viewUser?.challengeTypeCounts?.animal || 0}, 
                    1
                  )`,
                }}
              >
                {viewUser?.profileImage ? (
                  <img
                    src={viewUser.profileImage}
                    alt="User Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-300 text-3xl font-bold text-gray-700">
                    {viewUser?.name?.charAt(0)?.toUpperCase()}
                  </div>
                )}
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mt-3">
                {viewUser?.name}
              </h3>
              <p className="text-gray-600">{viewUser?.email}</p>
            </div>

            {/* ✅ User Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-gray-700 bg-white p-6 rounded-lg shadow-sm">
              <div>
                <strong className="block text-gray-800">Role:</strong>
                <span>{viewUser?.role || "N/A"}</span>
              </div>
              <div>
                <strong className="block text-gray-800">Points:</strong>
                <span>{viewUser?.points ?? 0}</span>
                <div className="flex flex-wrap gap-4 mt-2 text-sm">
                  <p>
                    <strong>Human:</strong>{" "}
                    {viewUser?.challengeTypeCounts?.human ?? 0}
                  </p>
                  <p>
                    <strong>Nature:</strong>{" "}
                    {viewUser?.challengeTypeCounts?.nature ?? 0}
                  </p>
                  <p>
                    <strong>Animal:</strong>{" "}
                    {viewUser?.challengeTypeCounts?.animal ?? 0}
                  </p>
                </div>
              </div>
              <div>
                <strong className="block text-gray-800">
                  Created Challenges:
                </strong>
                <span>{viewUser?.createdChallenges ?? 0}</span>
              </div>
              <div>
                <strong className="block text-gray-800">Average Rating:</strong>
                <span>{viewUser?.avgRating ?? "N/A"}</span>
              </div>
              <div>
                <strong className="block text-gray-800">Created At:</strong>
                <span>
                  {viewUser?.createdAt
                    ? new Date(viewUser.createdAt).toLocaleString()
                    : "N/A"}
                </span>
              </div>
              <div>
                <strong className="block text-gray-800">Updated At:</strong>
                <span>
                  {viewUser?.updatedAt
                    ? new Date(viewUser.updatedAt).toLocaleString()
                    : "N/A"}
                </span>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setViewUser(null)}
                className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* ✅ Table */}
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
                {["Avatar", "Name", "Email", "Points", "Actions"].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-50 border-b"
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
                    <td className="px-6 py-4 text-gray-700">
                      {user.points || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
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
        </div>

        {/* ✅ Pagination */}
        <div className="flex justify-end mt-2 pr-4">
          <Pagination
            align="end"
            current={currentPage}
            total={pagination?.totalUsers}
            pageSize={pageSize}
            showSizeChanger={false}
            onChange={handlePageChange}
          />
        </div>

        {/* ✅ Confirmation Modal */}
        <ConfirmationModal
          isOpen={confirmModalOpen}
          onClose={() => setConfirmModalOpen(false)}
          onConfirm={() => {
            setConfirmModalOpen(false);
            if (modalType === "delete") handleDelete();
          }}
          title="Are you sure you want to delete this user?"
          description="This action cannot be undone."
          confirmText="Yes, delete"
        />
      </motion.div>
    </>
  );
};

export default UsersTable;
