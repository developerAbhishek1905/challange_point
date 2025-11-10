import Header from "../components/common/Header";
import { Search } from "lucide-react";

import FeedManageTable from "../feedManage/FeedManageTable";
import { useState } from "react";


const FeedManage = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("");
      const [searchValue, setSearchValue] = useState("");



  return (
    <div className="flex-1 relative z-10 overflow-auto">
      {/* ================= Header ================= */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8 gap-3">
        <h1 className="text-2xl font-semibold text-gray-900">Feeds</h1>

        {/* 🔍 Search Box */}
        <div className="relative w-full sm:w-72">
          <Search
            className="absolute left-3 top-2.5 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search Feeds..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full bg-white text-gray-900 placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 shadow-sm"
          />
        </div>
      </header>
      

      <main className="max-w-7xl mx-auto py-2 px-4 lg:px-8">
        

        <FeedManageTable
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
export default FeedManage;
