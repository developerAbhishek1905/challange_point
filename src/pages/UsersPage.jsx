import { useState } from "react";
import { Search, Plus } from "lucide-react";
import UsersTable from "../components/users/UsersTable";

const UsersPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="flex-1 overflow-auto relative z-10">
      {/* ✅ Header Section */}
     {/* ================= Header ================= */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8 gap-3">
        <h1 className="text-2xl font-semibold text-gray-900">Users</h1>

        {/* 🔍 Search Box */}
        <div className="relative w-full sm:w-72">
          <Search
            className="absolute left-3 top-2.5 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search Users..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full bg-white text-gray-900 placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 shadow-sm"
          />
        </div>
      </header>

      {/* ✅ Main Content */}
      <main className="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8">
        <UsersTable
          showModal={showModal}
          setShowModal={setShowModal}
          modalMode={modalMode}
          setModalMode={setModalMode}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
      </main>

      {/* ✅ Optional Floating Add Button for Small Screens */}
      <button
        onClick={() => {
          setShowModal(true);
          setModalMode("create");
        }}
        className="fixed bottom-6 right-6 bg-black text-white rounded-full p-3 shadow-lg sm:hidden"
        aria-label="Add User"
      >
        <Plus size={22} />
      </button>
    </div>
  );
};

export default UsersPage;
