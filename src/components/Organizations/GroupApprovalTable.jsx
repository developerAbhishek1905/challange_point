import React, { useEffect, useState,useRef } from "react";
import { motion } from "framer-motion";
import { Ellipsis, Bell } from "lucide-react";
import { Dropdown, Menu, Empty, Pagination, Popover } from "antd";
import { toast } from "react-toastify";
import {
  getApproveList,
  approve_rejectByAdmin,
  getGroupApprovalList,
  approve_reject
} from "../../utils/api";
import OrganizationDetails from "./OrganizationDetails";
import ConfirmationModal from "../ConfirmationModal";

const GroupApprovalTable = ({ searchValue }) => {
  const [allGroups, setAllGroups] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [pageSize] = useState(8);
  const [activeTab, setActiveTab] = useState("group"); // "group" or "member"

  // View modal
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [groupToView, setGroupToView] = useState(null);
  const PageSize = 8
  const isMounted = useRef(false);
    const debounceRef = useRef(null);

  // Confirm modal for approval/reject
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [loading, setLoading] = useState(false);
    
  // fetch depending on activeTab:
  const fetchGroups = async (search = "") => {
    try {
      setLoading(true);

      if (activeTab === "group") {
        // Group requests (groups seeking approval)
        const res = await getGroupApprovalList(currentPage, PageSize,search);
        const groups = res?.requests ?? res?.data ?? [];
        setAllGroups(groups);
        setPagination(res ?? null);
      } else {
        // Member requests (add/remove member requests)
        const res = await getApproveList(currentPage, pageSize,search);
        const members = res?.requests ?? res?.data ?? [];
        setAllGroups(members);
        setPagination(res ?? null);
      }
    } catch (err) {
      console.error("Failed to fetch groups/members", err);
      toast.error("Failed to fetch data");
      setAllGroups([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  console.log(allGroups)

  console.log(pagination)

  // refetch when activeTab changes or on mount (debounce not required here)
//   useEffect(() => {
//     fetchGroups();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [activeTab]);
    // Debounced effect: runs on searchValue or currentPage change
  useEffect(() => {
    isMounted.current = true;

    // reset to first page when search query changes
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      // ensure currentPage is used (if search changed we usually want page 1)
      const pageToFetch = currentPage;
      fetchGroups(searchValue || "", pageToFetch);
    }, 400);

    return () => {
      clearTimeout(debounceRef.current);
    };
    // intentionally DO NOT include allFeed in deps to avoid refetch loops
  }, [activeTab, searchValue, currentPage]);

  // initial mount fetch
  useEffect(() => {
    fetchGroups(searchValue || "", currentPage);
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  const openViewModal = (group) => {
    setGroupToView(group);
    setViewModalOpen(true);
  };

  const handleOpenConfirm = (groupId, type) => {
    setConfirmAction({ groupId, type });
    setConfirmModalOpen(true);
  };

  // UPDATED: call correct API depending on activeTab
  const handleAction = async (groupId, status) => {
    try {
      setLoadingAction(true);

      if (activeTab === "group") {
        // approving/rejecting a group -> use approve_reject
        await approve_reject(groupId, status);
      } else {
        // approving/rejecting a member request -> use approve_rejectByAdmin
        await approve_rejectByAdmin(groupId, status);
      }

      toast.success(status.status === "approved" ? "Approved" : "Rejected");
      await fetchGroups();
    } catch (err) {
      console.error("Action failed", err);
      toast.error("Action failed");
    } finally {
      setLoadingAction(false);
    }
  };

  const eventMenu = (group) => (
    <Menu>
      <Menu.Item key="view">
        <div
          onClick={() => openViewModal(group)}
          className="text-sm"
        >
          View
        </div>
      </Menu.Item>
      <Menu.Item key="approve">
        <div
          onClick={() => handleOpenConfirm(group?._id, "approve")}
          className="text-green-600 text-sm"
        >
          Approve
        </div>
      </Menu.Item>
      <Menu.Item key="reject">
        <div
          onClick={() => handleOpenConfirm(group?._id, "deny")}
          className="text-red-600 text-sm"
        >
          Reject
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <div className="w-full max-w-2xl mx-auto mb-8">
        <div className="flex bg-gray-100 rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setActiveTab("group")}
            className={`flex-1 py-3 px-6 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === "group"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Group Requests
          </button>

          <button
            onClick={() => setActiveTab("member")}
            className={`flex-1 py-3 px-6 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === "member"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Member Requests
          </button>
        </div>
      </div>

      <motion.div
        className="bg-white rounded-xl border pb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="overflow-x-auto rounded-xl">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                {["Organisation Name", "Request Type", "Actions"].map((head) => (
                  <th
                    key={head}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {allGroups?.length > 0 ? (
                allGroups.map((group) => {
                  return (
                    <motion.tr
                      key={group?._id ?? group?.id}
                      className="border-b hover:bg-gray-50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-700 truncate max-w-[180px]">
                        <span className="cursor-help">
                          {activeTab === "group"
                            ? group?.organizationId?.name ?? group?.companyName ?? "—"
                            : group?.organizationId?.name ?? group?.companyName ?? group?.requesterName ?? "—"}
                        </span>
                      </td>

                      <td
                        className={`px-6 py-4 text-sm capitalize ${
                          group?.type === "remove" ? "text-red-500" : "text-green-500"
                        } truncate max-w-[160px]`}
                      >
                        {group?.type ?? (activeTab === "group" ? "group" : "")}
                      </td>

                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openViewModal(group)}
                            className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition whitespace-nowrap"
                          >
                            View
                          </button>

                          <button
                            onClick={() => handleAction(group?._id ?? group?.id, { status: "approved" })}
                            className="px-3 py-1.5 text-xs font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200 transition whitespace-nowrap"
                          >
                            Accept
                          </button>

                          <button
                            onClick={() => handleAction(group?._id ?? group?.id, { status: "rejected" })}
                            className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition whitespace-nowrap"
                          >
                            Deny
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-8">
                    <Empty description={loading ? "Loading..." : "No requests found"} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-3 pr-4">
          <Pagination
            current={currentPage}
            total={pagination?.total ?? pagination?.total ?? 0}
            pageSize={pageSize}
            showSizeChanger={false}
            onChange={(p) => setCurrentPage(p)}
          />
        </div>
      </motion.div>

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
                // for member requests the emails may be directly on request (e.g. request.emails)
                const emails = groupToView?.emails ?? groupToView?.leaders ?? [];

                // fallback: if group's payload contains an object with user emails
                const normalized =
                  Array.isArray(emails) && emails.length > 0
                    ? emails
                    : Array.isArray(groupToView?.emails) && groupToView?.emails.length > 0
                    ? groupToView?.emails
                    : groupToView?.emails ?? [];

                return (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium capitalize text-gray-800">
                        {groupToView?.type ?? "Request"} Member List ({(normalized?.length ?? 0)})
                      </h4>
                      {normalized?.length > 0 ? (
                        <div className="mt-2 border rounded p-3 max-h-40 overflow-y-auto bg-white">
                          {normalized.map((em, i) => (
                            <div key={i} className="text-sm text-gray-700 py-1">
                              • {typeof em === "string" ? em : em?.email ?? em?.user?.email ?? JSON.stringify(em)}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500 mt-2">No emails available</p>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => {
          setConfirmModalOpen(false);
          setConfirmAction(null);
        }}
        onConfirm={async () => {
          if (!confirmAction?.groupId || !confirmAction?.type) return;
          try {
            setLoadingAction(true);
            const statusPayload = {
              status: confirmAction.type === "approve" ? "approved" : "denied",
            };

            // call appropriate API depending on activeTab
            if (activeTab === "group") {
              await approve_reject(confirmAction.groupId, statusPayload);
            } else {
              await approve_rejectByAdmin(confirmAction.groupId, statusPayload);
            }

            toast.success(confirmAction.type === "approve" ? "Approved" : "Rejected");
            setConfirmModalOpen(false);
            await fetchGroups();
          } catch (err) {
            console.error(err);
            toast.error("Action failed");
          } finally {
            setLoadingAction(false);
          }
        }}
        title={`Are you sure you want to ${confirmAction?.type ?? ""} this request?`}
        description="This action can’t be undone once confirmed"
        confirmText={`Yes, ${confirmAction?.type === "approve" ? "Approve" : "Reject"}`}
        loadingConfirm={loadingAction}
      />
    </>
  );
};

export default GroupApprovalTable;