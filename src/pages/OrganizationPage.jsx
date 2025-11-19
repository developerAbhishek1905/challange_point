import { useState, useEffect } from "react";
import { getAllOrganizationsList } from "../utils/api";
import { toast } from "react-toastify";
import OrganizationTable from "../components/Organizations/OrganizationTable";
import { Search } from "lucide-react";

const OrganizationPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [organizations, setOrganizations] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [memberAdded, setMemberAdded] = useState(false);

  // ✅ Fetch organizations on search / pagination / member added
  // useEffect(() => {
  //   const delayDebounce = setTimeout(() => {
  //     fetchOrganizations(searchValue, currentPage);
  //   }, 500);

  //   return () => clearTimeout(delayDebounce);
  // }, [searchValue, memberAdded]); // ✅ removed "organizations"

  // const fetchOrganizations = async (value, page) => {
  //   try {
  //     const orgs = await getAllOrganizationsList(value, page);
  //     if (orgs && orgs.organizations) {
  //       setOrganizations(orgs.organizations);
  //     } else {
  //       setOrganizations([]);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching organizations:", error);
  //     setOrganizations([]);
  //     toast.error("Failed to fetch organizations");
  //   }
  // };
  


  return (
    <div className="flex-1 relative z-10 overflow-auto">
      {/* 🔍 Search Input */}
      {/* ================= Header ================= */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8 gap-3">
        <h1 className="text-2xl font-semibold text-gray-900">Group</h1>

        {/* 🔍 Search Box */}
        <div className="relative w-full sm:w-72">
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
      </header>

      {/* ✅ Table */}
      <main className="max-w-7xl mx-auto py-2 px-4 lg:px-8">
        <OrganizationTable
          organizations={organizations}
          showModal={showModal}
          setShowModal={setShowModal}
          modalMode={modalMode}
          setModalMode={setModalMode}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          memberAdded={memberAdded}
          setMemberAdded={setMemberAdded}
          searchValue={searchValue}
        />
      </main>
    </div>
  );
};

export default OrganizationPage;
