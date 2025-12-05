import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Ellipsis, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Empty, Pagination, Dropdown, Menu,Modal } from "antd";
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
  const [pageCountForSearch, setPageCountForSearch] = useState(1);

  const pageSize = 8;

  const TraitItem = ({ label, values }) => {
    return (
      <div className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-md">
        <span className="font-medium">{label}</span>
        <div className="space-x-4">
          <span className="text-sm font-bold text-green-600">
            {values.plusOne <= 0 ? "+0" : `+${values.plusOne}`}

            {/* |  {values.minusOne ?? 0} */}
          </span>

          {/* <span className="text-sm font-bold text-red-600"> */}
          {/* + {values.plusOne ?? 0}  */}
          {/* {values.minusOne <= 0 ? "+0" : `-${values.minusOne}`} */}
          {/* </span> */}
        </div>
      </div>
    );
  };

  const summary = {
  CivicCharacteristics: {
    CivicResponsibility: { plusOne: 0, minusOne: 0 },
    RespectForOthers: { plusOne: 0, minusOne: 0 },
    Integrity: { plusOne: 0, minusOne: 0 },
    ActiveEngagement: { plusOne: 0, minusOne: 0 },
    EnvironmentalResponsibility: { plusOne: 0, minusOne: 0 },
    LifelongLearning: { plusOne: 0, minusOne: 0 },
    CooperationAndCollaboration: { plusOne: 0, minusOne: 0 },
    EmpowermentAndAdvocacy: { plusOne: 0, minusOne: 0 },
    PreparednessAndResilience: { plusOne: 0, minusOne: 0 },
    PositiveContributions: { plusOne: 0, minusOne: 0 }
  },

  QualitiesToCareGardens: {
    Patience: { plusOne: 0, minusOne: 0 },
    Observation: { plusOne: 0, minusOne: 0 },
    Knowledgeable: { plusOne: 0, minusOne: 0 },
    Diligence: { plusOne: 0, minusOne: 0 },
    Perseverance: { plusOne: 0, minusOne: 0 },
    Adaptability: { plusOne: 0, minusOne: 0 },
    Organization: { plusOne: 0, minusOne: 0 },
    AttentionToDetail: { plusOne: 0, minusOne: 0 },
    ProblemSolving: { plusOne: 0, minusOne: 0 },
    Creativity: { plusOne: 0, minusOne: 0 },
    PhysicalStamina: { plusOne: 0, minusOne: 0 },
    EnvironmentalAwareness: { plusOne: 0, minusOne: 0 },
    CuriosityAndLearning: { plusOne: 0, minusOne: 0 },
    Passion: { plusOne: 0, minusOne: 0 },
    RespectForNature: { plusOne: 0, minusOne: 0 },
    Enjoyment: { plusOne: 0, minusOne: 0 }
  },

  GoodBusinessPerson: {
    VisionAndAmbition: { plusOne: 0, minusOne: 0 },
    Leadership: { plusOne: 0, minusOne: 0 },
    IntegrityAndEthics: { plusOne: 0, minusOne: 0 },
    AdaptabilityAndResilience: { plusOne: 0, minusOne: 0 },
    StrategicThinking: { plusOne: 0, minusOne: 0 },
    FinancialAcumen: { plusOne: 0, minusOne: 0 },
    CommunicationAndInterpersonalSkills: { plusOne: 0, minusOne: 0 },
    CustomerFocus: { plusOne: 0, minusOne: 0 },
    InnovationAndCreativity: { plusOne: 0, minusOne: 0 },
    NetworkingAndRelationshipBuilding: { plusOne: 0, minusOne: 0 },
    PersistenceAndDetermination: { plusOne: 0, minusOne: 0 },
    ContinuousLearning: { plusOne: 0, minusOne: 0 }
  },

  BeingAGoodStudent: {
    DiligenceAndMotivation: { plusOne: 0, minusOne: 0 },
    DisciplineAndTimeManagement: { plusOne: 0, minusOne: 0 },
    ActiveListeningAndParticipation: { plusOne: 0, minusOne: 0 },
    CriticalThinkingAndProblemSolving: { plusOne: 0, minusOne: 0 },
    CuriosityAndEagernessToLearn: { plusOne: 0, minusOne: 0 },
    OrganizationAndNoteTaking: { plusOne: 0, minusOne: 0 },
    SelfDisciplineAndSelfReflection: { plusOne: 0, minusOne: 0 },
    CollaborationAndCommunication: { plusOne: 0, minusOne: 0 },
    InitiativeAndResourcefulness: { plusOne: 0, minusOne: 0 },
    ResilienceAndPerseverance: { plusOne: 0, minusOne: 0 },
    RespectForTeachersAndPeers: { plusOne: 0, minusOne: 0 },
    BalanceAndWellBeing: { plusOne: 0, minusOne: 0 }
  },

  AnimalCare: {
    Compassion: { plusOne: 0, minusOne: 0 },
    Patience: { plusOne: 0, minusOne: 0 },
    Responsibility: { plusOne: 0, minusOne: 0 },
    Knowledgeable: { plusOne: 0, minusOne: 0 },
    Observation: { plusOne: 0, minusOne: 0 },
    Communication: { plusOne: 0, minusOne: 0 },
    PhysicalStamina: { plusOne: 0, minusOne: 0 },
    Adaptability: { plusOne: 0, minusOne: 0 },
    ProblemSolving: { plusOne: 0, minusOne: 0 },
    AttentionToDetail: { plusOne: 0, minusOne: 0 },
    SafetyConsciousness: { plusOne: 0, minusOne: 0 },
    TimeManagement: { plusOne: 0, minusOne: 0 },
    RespectForAnimals: { plusOne: 0, minusOne: 0 },
    Collaboration: { plusOne: 0, minusOne: 0 },
    EmotionalStability: { plusOne: 0, minusOne: 0 },
    LifelongLearning: { plusOne: 0, minusOne: 0 },
    Advocacy: { plusOne: 0, minusOne: 0 }
  },

  GoodHumanCare: {
    Empathy: { plusOne: 0, minusOne: 0 },
    Compassion: { plusOne: 0, minusOne: 0 },
    ActiveListening: { plusOne: 0, minusOne: 0 },
    Respect: { plusOne: 0, minusOne: 0 },
    Patience: { plusOne: 0, minusOne: 0 },
    Communication: { plusOne: 0, minusOne: 0 },
    Trustworthiness: { plusOne: 0, minusOne: 0 },
    Flexibility: { plusOne: 0, minusOne: 0 },
    ProblemSolving: { plusOne: 0, minusOne: 0 },
    CulturalSensitivity: { plusOne: 0, minusOne: 0 },
    Collaboration: { plusOne: 0, minusOne: 0 },
    Advocacy: { plusOne: 0, minusOne: 0 },
    EmotionalIntelligence: { plusOne: 0, minusOne: 0 },
    Professionalism: { plusOne: 0, minusOne: 0 },
    SelfCare: { plusOne: 0, minusOne: 0 },
    ContinuousLearning: { plusOne: 0, minusOne: 0 },
    NonJudgmentalAttitude: { plusOne: 0, minusOne: 0 }
  },

  BeingAGoodWorker: {
    ReliabilityAndPunctuality: { plusOne: 0, minusOne: 0 },
    Professionalism: { plusOne: 0, minusOne: 0 },
    AdaptabilityAndFlexibility: { plusOne: 0, minusOne: 0 },
    InitiativeAndProactiveness: { plusOne: 0, minusOne: 0 },
    StrongWorkEthic: { plusOne: 0, minusOne: 0 },
    EffectiveCommunication: { plusOne: 0, minusOne: 0 },
    CollaborationAndTeamwork: { plusOne: 0, minusOne: 0 },
    TimeManagementAndOrganization: { plusOne: 0, minusOne: 0 },
    ProblemSolvingAndCriticalThinking: { plusOne: 0, minusOne: 0 },
    ContinuousLearning: { plusOne: 0, minusOne: 0 },
    PositiveAttitude: { plusOne: 0, minusOne: 0 },
    IntegrityAndEthics: { plusOne: 0, minusOne: 0 }
  },

  GoodFamilyMember: {
    LoveAndAffection: { plusOne: 0, minusOne: 0 },
    TrustAndHonesty: { plusOne: 0, minusOne: 0 },
    Respect: { plusOne: 0, minusOne: 0 },
    Communication: { plusOne: 0, minusOne: 0 },
    EmpathyAndCompassion: { plusOne: 0, minusOne: 0 },
    ActiveListening: { plusOne: 0, minusOne: 0 },
    FlexibilityAndAdaptability: { plusOne: 0, minusOne: 0 },
    Forgiveness: { plusOne: 0, minusOne: 0 },
    SharedValues: { plusOne: 0, minusOne: 0 },
    QualityTime: { plusOne: 0, minusOne: 0 },
    Support: { plusOne: 0, minusOne: 0 },
    CooperationAndCollaboration: { plusOne: 0, minusOne: 0 },
    Boundaries: { plusOne: 0, minusOne: 0 },
    CelebrationAndJoy: { plusOne: 0, minusOne: 0 },
    Commitment: { plusOne: 0, minusOne: 0 }
  }
};


  /** ✅ Fetch users */
  const fetchUsers = useCallback(async () => {
    try {
      const data = await getAllUsers(searchValue, searchValue==='' ?currentPage:pageCountForSearch, pageSize);
      setAllUsers(data?.users || []);
      setPagination(data);
      searchValue === '' && setPageCountForSearch(1);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
      setAllUsers([]);
      setPagination(null);
    }
  }, [searchValue, currentPage,pageCountForSearch]);

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
  const handlePageChange = (page) => setCurrentPage(page)||setPageCountForSearch(page);


  const filteredUsers = allUsers.filter(
    (user) => !user.email?.includes("@admin.com")
  );

  const viewUserDetails = async (userId) => {
    try {
      const response = await getUserTraitSummery(userId);
      setUserTraitsRetings(response.summary || null);
    } catch (err) {
      console.error(err);
      setUserTraitsRetings(null);
    }
  };
  console.log(pageCountForSearch)

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
  <Modal
    open={true}
    footer={null}
    onCancel={() => {
      setViewUser(null);
      setOpenSection(null);
    }}
    centered
    width={800}
    destroyOnClose
    className="custom-user-modal"
  >
    <motion.div
     initial={{ scale: 0.9 }}
  animate={{ scale: 1 }}
  exit={{ scale: 0.95, opacity: 0 }}
className="
    bg-white p-6 rounded-xl w-full 
    max-w-xl sm:max-w-2xl md:max-w-5xl lg:max-w-5xl xl:max-w-6xl
    shadow-xl overflow-y-auto max-h-[90vh]
  "    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 text-center">
        User Details
      </h2>

      {/* Avatar Section */}
      <div className="flex flex-col items-center justify-center py-6 mb-6">
        <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center text-3xl font-bold text-gray-700 shadow-md">
          {viewUser?.name?.charAt(0)?.toUpperCase()}
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mt-3">
          {viewUser?.name}
        </h3>
        <p className="text-gray-600 text-center break-all">{viewUser?.email}</p>
      </div>

      {/* User Details - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 mb-6">
        <div className="bg-gray-100 rounded-md text-center p-4 flex flex-col justify-center">
          <strong className="block text-gray-800">Points</strong>
          <div className="flex flex-wrap justify-center gap-3 text-sm mt-2">
            <p><strong>Human:</strong> {viewUser?.challengeTypeCounts?.human ?? 0}</p>
            <p><strong>Nature:</strong> {viewUser?.challengeTypeCounts?.nature ?? 0}</p>
            <p><strong>Animal:</strong> {viewUser?.challengeTypeCounts?.animal ?? 0}</p>
          </div>
        </div>

        <div className="bg-gray-100 rounded-md text-center p-4 flex flex-col justify-center">
          <strong className="block text-gray-800">Created Challenges</strong>
          <span>{viewUser?.createdChallenges ?? 0}</span>
        </div>

        <div className="bg-gray-100 rounded-md text-center p-4 flex flex-col justify-center sm:col-span-2">
          <strong className="block text-gray-800">Created At</strong>
          <span>
            {viewUser?.createdAt
              ? new Date(viewUser.createdAt).toLocaleString()
              : "N/A"}
          </span>
        </div>
      </div>

      {/* Traits Sections */}
      <div className="bg-white rounded-lg text-gray-800 shadow-sm space-y-4">
        {Object.entries(summary).map(([sectionKey, sectionData]) => (
          <div key={sectionKey} className="border rounded-lg overflow-hidden">

            {/* Header */}
            <button
              className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 font-semibold text-gray-800"
              onClick={() => toggleSection(sectionKey)}
            >
              <span>{sectionKey}</span>
              {openSection === sectionKey ? <ChevronUp /> : <ChevronDown />}
            </button>

            {/* Collapsible Content */}
            <AnimatePresence>
              {openSection === sectionKey && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="px-4 py-3 border-t grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  {Object.entries(sectionData).map(([traitKey, values]) => (
                    <TraitItem key={traitKey} label={traitKey} values={values} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={() => {
            setViewUser(null);
            setOpenSection(null);
          }}
          className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto"
        >
          Close
        </button>
      </div>
    </motion.div>
  </Modal>
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
                {["Avatar", "Name", "Email", "Total Points", "Actions"].map(
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
                        {/* {user.profileImage ? <img src={user.profileImage} alt="Avatar" className="h-full w-full object-cover" /> :  */}
                        <span className="text-gray-600 font-semibold">
                          {user.name?.charAt(0)?.toUpperCase()}
                        </span>
                        {/* } */}
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
            current={searchValue === '' ? currentPage : pageCountForSearch}
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
