import { useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import { Download, Plus, Search } from "lucide-react";

import EventsTable from "../components/events/EventsTable";
import { EventCSV } from "../Redux/API/API";
import { getAllChallangeList } from "../utils/api";

const ProductsPage = () => {
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  /** ✅ Debounced Search API */
  // useEffect(() => {
  //   const delay = setTimeout(async () => {
  //     if (!searchValue.trim()) {
  //       setSearchResults([]);
  //       return;
  //     }

  //     try {
  //       setIsLoading(true);
  //       const data = await getAllChallangeList(1, 10, searchValue);
  //       setSearchResults(data?.challenges || []);
  //     } catch (error) {
  //       console.error("Search failed:", error);
  //       toast.error("Search failed");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }, 500);

  //   return () => clearTimeout(delay);
  // }, [searchValue]);

  /** ✅ Memoized Results (avoid re-renders) */
  const filteredResults = useMemo(() => searchResults || [], [searchResults]);

  return (
    <div className="flex-1 overflow-auto relative z-10 bg-gray-50 min-h-screen">
      {/* ================= Header ================= */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8 gap-3">
        <h1 className="text-2xl font-semibold text-gray-900">Challenges</h1>

        {/* 🔍 Search Box */}
        <div className="relative w-full sm:w-72">
          <Search
            className="absolute left-3 top-2.5 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search challenges..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full bg-white text-gray-900 placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 shadow-sm"
          />
        </div>
      </header>

      
      {/* ================= Main Content ================= */}
      <main className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 space-y-4">
        {/* 🔍 Search Results Section */}
       

        {/* ✅ Events Table */}
        <EventsTable
          showModal={showModal}
          setShowModal={setShowModal}
          modalMode={modalMode}
          setModalMode={setModalMode}
          searchValue={searchValue}
        />
      </main>
    </div>
  );
};

export default ProductsPage;
