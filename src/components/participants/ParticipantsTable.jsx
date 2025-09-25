import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Edit, Eye, Ellipsis, User, Trash2 } from "lucide-react";
import ParticipantDetailModal from "./ParticipantDetailModal";
import AddParticipantModal from "./AddParticipantModal";
import { Avatar, Dropdown, Empty, Image, Menu, Pagination } from "antd";
import { toast } from "react-toastify";

// Hardcoded participant data
const initialParticipants = [
  {
    _id: "p1",
    first_name: "John",
    last_name: "Doe",
    bib_number: "101",
    phone_number: "9876543210",
    email: "john.doe@example.com",
    createdAt: "2025-09-10",
    category: { category_name: "Track" },
    status: "Active",
    file: null,
  },
  {
    _id: "p2",
    first_name: "Jane",
    last_name: "Smith",
    bib_number: "102",
    phone_number: "9123456789",
    email: "jane.smith@example.com",
    createdAt: "2025-09-12",
    category: { category_name: "Field" },
    status: "Inactive",
    file: null,
  }
];

const ParticipantsTable = ({ showModal, setShowModal }) => {
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [Participant, setParticipant] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [allParticipant, setAllParticipant] = useState(initialParticipants);
  const [totatItems, setTotalItems] = useState(initialParticipants.length);
  const menuRef = useRef(null);

  // Pagination logic
  const pagedParticipants = allParticipant.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = (user) => {
    setAllParticipant(allParticipant.filter(p => p._id !== user._id));
    setTotalItems(allParticipant.length - 1);
    toast.success("Participant deleted successfully");
  };

  const handleUpdate = (updatedParticipant) => {
    setAllParticipant(allParticipant.map(p => p._id === updatedParticipant._id ? updatedParticipant : p));
    toast.success("Participant updated successfully");
    setParticipant(null);
    setShowModal(false);
  };

  const handleAdd = (newParticipant) => {
    setAllParticipant([newParticipant, ...allParticipant]);
    setTotalItems(allParticipant.length + 1);
    toast.success("Participant added successfully");
    setShowModal(false);
  };

  const eventMenu = (user) => (
    <Menu>
      <Menu.Item
        key="view"
        icon={<Eye size={16} />}
        onClick={() => {
          setSelectedParticipant(user);
          setOpenMenuId(null);
        }}
      >
        View
      </Menu.Item>
      <Menu.Item
        key="edit"
        icon={<Edit size={16} />}
        onClick={() => {
          setParticipant(user);
          setShowModal(true);
        }}
      >
        Edit
      </Menu.Item>
      <Menu.Item
        key="delete"
        icon={<Trash2 size={16} />}
        danger
        onClick={() => handleDelete(user)}
      >
        Delete
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <motion.div
        className="bg-white rounded-xl border border-gray-200 pb-2"
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
                  Bib Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Category
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
              {pagedParticipants && pagedParticipants.length > 0 ? (
                pagedParticipants.map((user) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r flex items-center justify-center text-white font-semibold cursor-pointer">
                            {user.file ? (
                              <Image
                                src={user.file}
                                alt="profile"
                                className="h-full w-full object-cover rounded-full"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  borderRadius: "50%",
                                }}
                                preview={{
                                  mask: false,
                                  maskClassName: "rounded-full",
                                }}
                              />
                            ) : (
                              <Avatar
                                icon={<User size={20} />}
                                className="bg-gray-400"
                                style={{ width: "100%", height: "100%" }}
                              />
                            )}
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
                      <div className="text-sm text-gray-700">
                        {user.bib_number}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        {user.phone_number}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        {user.createdAt
                          ? new Date(user.createdAt).toISOString().split("T")[0]
                          : "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        {user.category?.category_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{user.status}</div>
                    </td>
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
                  <td colSpan="8" className="text-center py-8">
                    <Empty
                      description="No participants found"
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
      {showModal && (
        <AddParticipantModal
          onClose={() => {
            setShowModal(false);
            setParticipant(null);
          }}
          isEdit={!!Participant}
          participant={Participant}
          onUpdate={handleUpdate}
          onAdd={handleAdd}
        />
      )}
      {selectedParticipant && (
        <ParticipantDetailModal
          participant={selectedParticipant}
          onClose={() => setSelectedParticipant(null)}
        />
      )}
    </>
  );
};
export default ParticipantsTable;
