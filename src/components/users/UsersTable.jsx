import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Ellipsis, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Empty, Pagination, Dropdown, Menu } from "antd";
import { toast } from "react-toastify";
import ConfirmationModal from "../ConfirmationModal";
import { getAllUsers, deleteUser, getUserTraitSummery } from "../../utils/api";

const UsersTable = ({ searchValue }) => {
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // 'delete' | 'cancel'
  const [viewUser, setViewUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [openSection, setOpenSection] = useState(null);
  const [userTraitsRetings, setUserTraitsRetings] = useState(null);

  const pageSize = 8;


  const TraitItem = ({ label, values }) => {
  return (
    <div className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-md">
      <span className="font-medium">{label}</span>
      <span className="text-sm text-gray-600">
        + {values?.plusOne ?? 0}
      </span>
    </div>
  );
};

  const summary = {
  CivicCharacteristics: {
    Responsibility: { plusOne: 0, minusOne: 0 },
    Leadership: { plusOne: 0, minusOne: 0 },
    Empathy: { plusOne: 0, minusOne: 0 },
    ActiveParticipation: { plusOne: 0, minusOne: 0 }
  },

  QualitiesToCareGardens: {
    Compassion: { plusOne: 0, minusOne: 0 },
    EnvironmentalCare: { plusOne: 0, minusOne: 0 },
    Teamwork: { plusOne: 0, minusOne: 0 },
    Teamwork123: { plusOne: 0, minusOne: 0 }
  },

  GoodBusinessPerson: {
    Innovation: { plusOne: 0, minusOne: 0 },
    Fairness: { plusOne: 0, minusOne: 0 },
    Entrepreneurship: { plusOne: 0, minusOne: 0 },
    Entrepreneurship123: { plusOne: 0, minusOne: 0 }
  },

  BeingAGoodStudent: {
    Discipline: { plusOne: 0, minusOne: 0 },
    Curiosity: { plusOne: 0, minusOne: 0 },
    Punctuality: { plusOne: 0, minusOne: 0 },
    Punctuality123: { plusOne: 0, minusOne: 0 }
  }
};


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
      setPagination(null);
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

  const filteredUsers = allUsers.filter((user) => !user.email?.includes("@admin.com"));

  const viewUserDetails = async (userId) => {
    try {
      const response = await getUserTraitSummery(userId);
      setUserTraitsRetings(response.summary || null);
    } catch (err) {
      console.error(err);
      setUserTraitsRetings(null);
    }
  };

  /** ✅ Dropdown menu for actions */
  const eventMenu = (user) => (
    <Menu>
      <Menu.Item
        key="view"
        icon={<Eye size={16} />}
        onClick={() => {
          setViewUser(user);
          viewUserDetails(user._id);
          setOpenSection(null);
        }}
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

  const toggleSection = (section) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

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
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white p-6 rounded-xl w-full max-w-3xl shadow-xl overflow-y-auto max-h-[90vh]"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 text-center">User Details</h2>

            {/* Profile Section (simplified border) */}
            <div className="flex flex-col items-center justify-center rounded-lg py-6 mb-6 shadow-sm">
              <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-200 border-4 border-gray-300 shadow-md">
                {/* {viewUser?.profileImage ? (
                  <img src={viewUser.profileImage} alt="User Avatar" className="h-full w-full object-cover" />
                ) : ( */}
                  <div className="h-full w-full flex items-center justify-center bg-gray-300 text-3xl font-bold text-gray-700">
                    {viewUser?.name?.charAt(0)?.toUpperCase()}
                  </div>
                {/* )} */}
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mt-3">{viewUser?.name}</h3>
              <p className="text-gray-600">{viewUser?.email}</p>
            </div>

            {/* User Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-gray-700 bg-white p-6 rounded-lg shadow-sm mb-6">
              <div>
                <strong className="block text-gray-800">Role:</strong>
                <span>{viewUser?.role || "N/A"}</span>
              </div>
              <div>
                <strong className="block text-gray-800">Points:</strong>
                <div className="flex flex-wrap gap-4 mt-2 text-sm">
                  <p><strong>Human:</strong> {viewUser?.challengeTypeCounts?.human ?? 0}</p>
                  <p><strong>Nature:</strong> {viewUser?.challengeTypeCounts?.nature ?? 0}</p>
                  <p><strong>Animal:</strong> {viewUser?.challengeTypeCounts?.animal ?? 0}</p>
                </div>
              </div>
              <div>
                <strong className="block text-gray-800">Created Challenges:</strong>
                <span>{viewUser?.createdChallenges ?? 0}</span>
              </div>
              {/* <div>
                <strong className="block text-gray-800">Average Rating:</strong>
                <span>{viewUser?.avgRating ?? "N/A"}</span>
              </div> */}
              <div>
                <strong className="block text-gray-800">Created At:</strong>
                <span>{viewUser?.createdAt ? new Date(viewUser.createdAt).toLocaleString() : "N/A"}</span>
              </div>
              <div>
                <strong className="block text-gray-800">Updated At:</strong>
                <span>{viewUser?.updatedAt ? new Date(viewUser.updatedAt).toLocaleString() : "N/A"}</span>
              </div>
            </div>

            {/* Traits Accordion */}
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Personalized Characteristics</h3>

              {userTraitsRetings && Object.keys(userTraitsRetings).length > 0 ? (
                Object.entries(userTraitsRetings).map(([category, traits]) => (
                  <div key={category} className="border rounded-lg overflow-hidden">
                    <button
                      className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 font-semibold text-gray-800"
                      onClick={() => toggleSection(category)}
                      type="button"
                    >
                      <span>{category}</span>
                      {openSection === category ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>

                    <AnimatePresence initial={false}>
                      {openSection === category && (
                        <motion.div
                          key={category}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="px-4 py-3 text-gray-700 border-t grid grid-cols-1 sm:grid-cols-2 gap-3"
                        >
                          {Object.entries(traits).map(([trait, values]) => (
                            <div key={trait} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-md">
                              <span className="font-medium">{trait}</span>
                              <span className="text-sm text-gray-600">+ {values.plusOne ?? 0} 
                                {/* |  {values.minusOne ?? 0} */}
                                </span>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg text-gray-800 shadow-sm  space-y-4">
      

      {/* ================== 1. CivicCharacteristics ================== */}
      <div className="border rounded-lg overflow-hidden">
        <button
          className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 font-semibold text-gray-800"
          onClick={() => toggleSection("CivicCharacteristics")}
        >
          <span>Civic Characteristics</span>
          {openSection === "CivicCharacteristics" ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </button>

        <AnimatePresence>
          {openSection === "CivicCharacteristics" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="px-4 py-3 border-t grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              <TraitItem label="Responsibility" values={summary.CivicCharacteristics.Responsibility} />
              <TraitItem label="Leadership" values={summary.CivicCharacteristics.Leadership} />
              <TraitItem label="Empathy" values={summary.CivicCharacteristics.Empathy} />
              <TraitItem label="Active Participation" values={summary.CivicCharacteristics.ActiveParticipation} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ================== 2. QualitiesToCareGardens ================== */}
      <div className="border rounded-lg overflow-hidden">
        <button
          className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 font-semibold text-gray-800"
          onClick={() => toggleSection("QualitiesToCareGardens")}
        >
          <span>Qualities To Care Gardens</span>
          {openSection === "QualitiesToCareGardens" ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </button>

        <AnimatePresence>
          {openSection === "QualitiesToCareGardens" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="px-4 py-3 border-t grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              <TraitItem label="Compassion" values={summary.QualitiesToCareGardens.Compassion} />
              <TraitItem label="Environmental Care" values={summary.QualitiesToCareGardens.EnvironmentalCare} />
              <TraitItem label="Teamwork" values={summary.QualitiesToCareGardens.Teamwork} />
              <TraitItem label="Teamwork123" values={summary.QualitiesToCareGardens.Teamwork123} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ================== 3. GoodBusinessPerson ================== */}
      <div className="border rounded-lg overflow-hidden">
        <button
          className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 font-semibold text-gray-800"
          onClick={() => toggleSection("GoodBusinessPerson")}
        >
          <span>Good Business Person</span>
          {openSection === "GoodBusinessPerson" ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </button>

        <AnimatePresence>
          {openSection === "GoodBusinessPerson" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="px-4 py-3 border-t grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              <TraitItem label="Innovation" values={summary.GoodBusinessPerson.Innovation} />
              <TraitItem label="Fairness" values={summary.GoodBusinessPerson.Fairness} />
              <TraitItem label="Entrepreneurship" values={summary.GoodBusinessPerson.Entrepreneurship} />
              <TraitItem label="Entrepreneurship123" values={summary.GoodBusinessPerson.Entrepreneurship123} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ================== 4. BeingAGoodStudent ================== */}
      <div className="border rounded-lg overflow-hidden">
        <button
          className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 font-semibold text-gray-800"
          onClick={() => toggleSection("BeingAGoodStudent")}
        >
          <span>Being A Good Student</span>
          {openSection === "BeingAGoodStudent" ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </button>

        <AnimatePresence>
          {openSection === "BeingAGoodStudent" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="px-4 py-3 border-t grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              <TraitItem label="Discipline" values={summary.BeingAGoodStudent.Discipline} />
              <TraitItem label="Curiosity" values={summary.BeingAGoodStudent.Curiosity} />
              <TraitItem label="Punctuality" values={summary.BeingAGoodStudent.Punctuality} />
              <TraitItem label="Punctuality123" values={summary.BeingAGoodStudent.Punctuality123} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
       )}
            </div>

            <div className="flex justify-end mt-6">
              <button onClick={() => { setViewUser(null); setOpenSection(null); }} className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Close</button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* ✅ Table */}
      <motion.div className="bg-white border border-gray-200 rounded-xl mb-8 pb-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="overflow-x-auto rounded-xl">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                {["Avatar", "Name", "Email", "Total Points", "Actions"].map((header) => (
                  <th key={header} className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <motion.tr key={user._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="hover:bg-gray-50 border-b">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        {/* {user.profileImage ? <img src={user.profileImage} alt="Avatar" className="h-full w-full object-cover" /> :  */}
                        <span className="text-gray-600 font-semibold">{user.name?.charAt(0)?.toUpperCase()}</span>
                        {/* } */}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{user.name}</td>
                    <td className="px-6 py-4 text-gray-700">{user.email}</td>
                    <td className="px-6 py-4 text-gray-700">{user.points || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <Dropdown overlay={eventMenu(user)} trigger={["click"]} placement="bottomRight">
                        <button><Ellipsis className="text-gray-600 hover:text-gray-800" /></button>
                      </Dropdown>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-8">
                    <Empty description="No users found" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ Pagination */}
        <div className="flex justify-end mt-2 pr-4">
          <Pagination align="end" current={currentPage} total={pagination?.totalUsers} pageSize={pageSize} showSizeChanger={false} onChange={handlePageChange} />
        </div>

        {/* ✅ Confirmation Modal */}
        <ConfirmationModal isOpen={confirmModalOpen} onClose={() => setConfirmModalOpen(false)} onConfirm={() => { setConfirmModalOpen(false); if (modalType === "delete") handleDelete(); }} title="Are you sure you want to delete this user?" description="This action cannot be undone." confirmText="Yes, delete" />
      </motion.div>
    </>
  );
};

export default UsersTable;
