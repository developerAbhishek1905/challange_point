import React, { useEffect, useState, useRef,useCallback } from "react";
import { Pagination, Empty } from "antd";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { toast } from "react-toastify";
import { getApproveList, approve_rejectByAdmin } from "../../utils/api";

const MemberRequestTable = () => {
  const [memberList, setMemberList] = useState([]);
  const [memberPage, setMemberPage] = useState(1);
  const [memberTotal, setMemberTotal] = useState(0);
  const [pageSize] = useState(8);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [groupToView, setGroupToView] = useState(null);
      const [pageCountForSearch, setPageCountForSearch] = useState(1);

  const fetchMembers =useCallback( async () => {
    try {
      setLoading(true);
      const res = await getApproveList(search === '' ? memberPage : pageCountForSearch, pageSize, search);
      const items = res?.requests ?? res?.data ?? [];
      setMemberList(items);
      setMemberTotal(res?.total ?? items.length ?? 0);
      search === '' && setPageCountForSearch(1);
    } catch {

      toast.error("Failed to load members");
    } finally {
      setLoading(false);
    }
  },[search, memberPage, pageCountForSearch]);
  console.log(memberPage)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchMembers, 300);
  }, [fetchMembers]);

    /** ✅ Pagination handler */
  const handlePageChange = (page) => {
    console.log(page)
    setMemberPage(page)||setPageCountForSearch(page)};


  console.log(memberPage)
  console.log(pageCountForSearch)

  const handleAction = async (id, status) => {
    try {
      await approve_rejectByAdmin(id, { status });
      toast.success(status === "approved" ? "Approved" : "Rejected");
      fetchMembers();
    } catch {
      toast.error("Action failed");
    }
  };

  return (
    <>
      <div className="relative w-full sm:w-72 my-4">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white text-gray-900 placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 shadow-sm"
        />
      </div>

      <div className="bg-white rounded-xl border pb-2">
        <div className="overflow-x-auto rounded-xl">
          <table className="min-w-full">
            <thead className="bg-gray-100 uppercase text-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium">Group Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Action Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {memberList.length > 0 ? (
                memberList.map((item) => (
                  <motion.tr key={item._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b">
                    <td className="px-6 py-3 text-gray-800 text-sm">{item?.organizationId?.name}</td>
                    <td className="px-6 py-3 text-sm text-gray-800">{item?.type}</td>
                    <td className="px-6 py-3 text-xs flex space-x-2">
                         <button
                        onClick={() => {
                          setGroupToView(item);
                          setViewModalOpen(true);
                        }}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleAction(item._id, "approved")}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleAction(item._id, "rejected")}
                        className=" px-3 py-1 bg-red-100 text-red-700 rounded"
                      >
                        Deny
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                 <td colSpan={8} className="text-center py-8">
                    <Empty
                      description="No Groups found"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-3 pr-4">
          <Pagination
            current={search ===''?memberPage:pageCountForSearch}
            total={memberTotal}
            pageSize={pageSize}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      </div>

      {/* View Modal */}
      {viewModalOpen && groupToView && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto relative">

            <button
              onClick={() => {
                setViewModalOpen(false);
                setGroupToView(null);
              }}
              className="absolute top-3 right-3 text-black bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1"
            >
              ✕
            </button>

            <div className="p-6">
              <h3 className="text-lg text-gray-900 font-semibold mb-2">Member Emails</h3>
              <p className="text-sm text-gray-600 mb-4">
                {groupToView?.organizationId?.name ?? groupToView?.name}
              </p>

              {(() => {
                const emails =
                  groupToView?.emails ?? groupToView?.leaders ?? [];
                return (
                  <div>
                    <h4 className="font-medium text-gray-800">
                      {groupToView?.type ?? "Request"} Member List ({emails.length})
                    </h4>

                    {emails.length > 0 ? (
                      <div className="mt-2 border rounded p-3 max-h-40 overflow-y-auto bg-white">
                        {emails.map((em, i) => (
                          <div key={i} className="text-sm text-gray-700 py-1">
                            • {typeof em === "string" ? em : em?.email}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 mt-2">No emails available</p>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
      
    </>
  );
};

export default MemberRequestTable;
