import React, { useEffect, useState, useRef, useCallback } from "react";
import { Pagination, Empty } from "antd";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { toast } from "react-toastify";
import { getGroupApprovalList, approve_reject } from "../../utils/api";
import ConfirmationModal from "../ConfirmationModal";
import OrganizationDetails from "./OrganizationDetails";

const GroupRequestTable = () => {
  const [groupList, setGroupList] = useState([]);
  const [groupPage, setGroupPage] = useState(1);
  const [groupTotal, setGroupTotal] = useState(0);
  const [pageSize] = useState(8);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const debounceRef = useRef(null);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [groupToView, setGroupToView] = useState(null);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [actionData, setActionData] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);

  // 👉 Separate page for search results
  const [pageCountForSearch, setPageCountForSearch] = useState(1);

  const fetchGroups = useCallback(
    async () => {
      try {
        setLoading(true);

        const currentPage =
          search === "" ? groupPage : pageCountForSearch;

        const res = await getGroupApprovalList(
          currentPage,
          pageSize,
          search
        );

        const items = res?.requests ?? res?.data ?? [];
        setGroupList(items);

        if (search === "") setPageCountForSearch(1);

        setGroupTotal(res?.total ?? items?.length ?? 0);
      } catch (err) {
        toast.error("Failed to load groups");
      } finally {
        setLoading(false);
      }
    },
    [search, groupPage, pageCountForSearch]
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchGroups, 300);
  }, [fetchGroups]);


  /** Approve / Reject Handler */
  const handleApproveReject = async (id, status) => {
    try {
      setLoadingAction(true);
      await approve_reject(id, { status });
      toast.success(status === "approved" ? "Approved" : "Rejected");

      fetchGroups();
    } catch {
      toast.error("Action failed");
    } finally {
      setLoadingAction(false);
    }
  };


  /** Pagination Handler */
  const handlePageChange = (page) => {
    setGroupPage(page);
    setPageCountForSearch(page);
  };


  return (
    <>
      {/* Search Box */}
      <div className="relative w-full sm:w-72 my-4">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search groups..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white text-gray-900 placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 shadow-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border pb-2">
        <div className="overflow-x-auto rounded-xl">
          <table className="min-w-full">
            <thead className="bg-gray-100 text-gray-800 uppercase">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium">Group Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Request Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {groupList.length > 0 ? (
                groupList.map((item) => (
                  <motion.tr
                    key={item._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b"
                  >
                    <td className="px-6 py-3 text-gray-800 text-sm">
                      {item?.companyName ?? item?.name}
                    </td>

                    <td className="px-6 py-3 text-green-600 text-sm capitalize">
                      {item?.type || "Group"}
                    </td>

                    <td className="px-6 py-3 text-xs flex space-x-2 ">
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
                        onClick={() => handleApproveReject(item._id, "approved")}
                        className="ml-2 px-3 py-1 bg-green-100 text-green-700 rounded"
                      >
                        Accept
                      </button>

                      <button
                        onClick={() => handleApproveReject(item._id, "rejected")}
                        className="ml-2 px-3 py-1 bg-red-100 text-red-700 rounded"
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

        {/* Pagination */}
        <div className="flex justify-end mt-3 pr-4">
          <Pagination
            current={search === "" ? groupPage : pageCountForSearch}
            total={groupTotal}
            pageSize={pageSize}
            showSizeChanger={false}
            onChange={handlePageChange}
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

export default GroupRequestTable;
