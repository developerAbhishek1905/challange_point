import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Ellipsis, Bell } from "lucide-react";
import { Dropdown, Menu, Empty, Pagination, Popover } from "antd";
import { toast } from "react-toastify";
import {
  getApproveList,
  approve_rejectByAdmin,
  getGroupApprovalList,
  approve_reject,
} from "../../utils/api";
import { Search } from "lucide-react";
import OrganizationDetails from "./OrganizationDetails";
import ConfirmationModal from "../ConfirmationModal";

const GroupApprovalTable = ({ searchValue }) => {
  // lists and pagination separate for groups & members
  const [groupList, setGroupList] = useState([]);
  const [groupPage, setGroupPage] = useState(1);
  const [groupTotal, setGroupTotal] = useState(0);

  const [memberList, setMemberList] = useState([]);
  const [memberPage, setMemberPage] = useState(1);
  const [memberTotal, setMemberTotal] = useState(0);

  const [pageSize] = useState(2);
  const [activeTab, setActiveTab] = useState("group"); // "group" | "member"

  // modals, loading, confirm
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [groupToView, setGroupToView] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [search, setSearch] = useState("");

  const debounceGroup = useRef(null);
  const debounceMember = useRef(null);

  // counts for badges
  const [groupCount, setGroupCount] = useState(0);
  const [memberCount, setMemberCount] = useState(0);

  // fetch group requests (independent)
  const fetchGroupRequests = async () => {
    try {
      setLoadingGroups(true);
      const res = await getGroupApprovalList(groupPage, pageSize, searchValue);
      const items = res?.requests ?? res?.data ?? res?.organizations ?? [];
      const total = Number(res?.total ?? res?.totalRequests ?? res?.totalOrganizations ?? items.length) || 0;
      setGroupList(Array.isArray(items) ? items : []);
      setGroupTotal(total);
      setGroupCount(total);
    } catch (err) {
      console.error("Failed to fetch group requests", err);
      toast.error("Failed to fetch group requests");
      setGroupList([]);
      setGroupTotal(0);
      setGroupCount(0);
    } finally {
      setLoadingGroups(false);
    }
  };

  // fetch member requests (independent)
  const fetchMemberRequests = async (search = "", page = 1) => {
    try {
      setLoadingMembers(true);
      const res = await getApproveList(page, pageSize, search);
      const items = res?.requests ?? res?.data ?? [];
      const total = Number(res?.total ?? res?.totalRequests ?? res?.count ?? items.length) || 0;
      setMemberList(Array.isArray(items) ? items : []);
      setMemberTotal(total);
      setMemberCount(total);
    } catch (err) {
      console.error("Failed to fetch member requests", err);
      toast.error("Failed to fetch member requests");
      setMemberList([]);
      setMemberTotal(0);
      setMemberCount(0);
    } finally {
      setLoadingMembers(false);
    }
  };

  console.log(groupPage)

  console.log(groupTotal)

  // debounce and trigger independent fetches when relevant deps change
  useEffect(() => {
    if (debounceGroup.current) clearTimeout(debounceGroup.current);
    debounceGroup.current = setTimeout(() => {
      fetchGroupRequests();
    }, 300);
    return () => clearTimeout(debounceGroup.current);
  }, [searchValue, groupPage]);

  useEffect(() => {
    if (debounceMember.current) clearTimeout(debounceMember.current);
    debounceMember.current = setTimeout(() => {
      fetchMemberRequests(searchValue || "", memberPage);
    }, 300);
    return () => clearTimeout(debounceMember.current);
  }, [searchValue, memberPage]);

  // initial load both lists
  useEffect(() => {
    fetchGroupRequests(searchValue || "", );
    fetchMemberRequests(searchValue || "", memberPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // open view modal
  const openViewModal = (item) => {
    setGroupToView(item);
    setViewModalOpen(true);
  };

  const handleOpenConfirm = (id, type) => {
    setConfirmAction({ id, type });
    setConfirmModalOpen(true);
  };

  // Approve/reject handler uses correct API depending on activeTab
  const handleAction = async (id, status) => {
    try {
      setLoadingAction(true);
      if (activeTab === "group") {
        await approve_reject(id, status);
      } else {
        await approve_rejectByAdmin(id, status);
      }
      toast.success(status.status === "approved" ? "Approved" : "Rejected");
      // refresh both lists so sidebar / badges stay consistent
      fetchGroupRequests(searchValue || "", groupPage);
      fetchMemberRequests(searchValue || "", memberPage);
      try {
        window.dispatchEvent(new CustomEvent("groupApprovalUpdated", { detail: { groupCount, memberCount } }));
      } catch {}
    } catch (err) {
      console.error("Action failed", err);
      toast.error("Action failed");
    } finally {
      setLoadingAction(false);
    }
  };

  // render rows from the appropriate list
  const dataToRender = activeTab === "group" ? groupList : memberList;

  const eventMenu = (item) => (
    <Menu>
      <Menu.Item key="view">
        <div onClick={() => openViewModal(item)} className="text-sm">View</div>
      </Menu.Item>
      <Menu.Item key="approve">
        <div onClick={() => handleOpenConfirm(item?._id ?? item?.id, "approve")} className="text-green-600 text-sm">Approve</div>
      </Menu.Item>
      <Menu.Item key="reject">
        <div onClick={() => handleOpenConfirm(item?._id ?? item?.id, "deny")} className="text-red-600 text-sm">Reject</div>
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
              activeTab === "group" ? "bg-white text-blue-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span>Group Requests</span>
              {groupCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-red-600 rounded-full">
                  {groupCount > 99 ? "99+" : groupCount}
                </span>
              )}
            </div>
          </button>

          <button
            onClick={() => setActiveTab("member")}
            className={`flex-1 py-3 px-6 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === "member" ? "bg-white text-blue-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span>Member Requests</span>
              {memberCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-red-600 rounded-full">
                  {memberCount > 99 ? "99+" : memberCount}
                </span>
              )}
            </div>
          </button>
        </div>
      </div>

      <motion.div className="bg-white rounded-xl border pb-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="relative w-full sm:w-72">
          
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search groups..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full bg-white text-gray-900 placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 shadow-sm"
          />
        </div>
        <div className="overflow-x-auto rounded-xl">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                {["Organisation Name", "Request Type", "Actions"].map((head) => (
                  <th key={head} className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">{head}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {dataToRender?.length > 0 ? (
                dataToRender.map((item) => (
                  <motion.tr key={item?._id ?? item?.id} className="border-b hover:bg-gray-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700 truncate max-w-[180px]">
                      <span className="cursor-help">
                        {item?.organizationId?.name ?? item?.companyName ?? item?.name ?? item?.requesterName ?? "—"}
                      </span>
                    </td>

                    <td className={`px-6 py-4 text-sm capitalize ${item?.type === "remove" ? "text-red-500" : "text-green-500"} truncate max-w-[160px]`}>
                      {item?.type ?? (activeTab === "group" ? "group" : "")}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openViewModal(item)} className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition whitespace-nowrap">View</button>

                        <button onClick={() => handleAction(item?._id ?? item?.id, { status: "approved" })} className="px-3 py-1.5 text-xs font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200 transition whitespace-nowrap">Accept</button>

                        <button onClick={() => handleAction(item?._id ?? item?.id, { status: "denied" })} className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition whitespace-nowrap">Deny</button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-8">
                    <Empty description={(activeTab === "group" ? (loadingGroups ? "Loading..." : "No group requests") : (loadingMembers ? "Loading..." : "No member requests"))} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-3 pr-4">
          <Pagination
            current={activeTab === "group" ? groupPage : memberPage}
            total={activeTab === "group" ? groupTotal : memberTotal}
            pageSize={pageSize}
            showSizeChanger={false}
            onChange={(p) => {
              if (activeTab === "group") setGroupPage(p);
              else setMemberPage(p);
            }}
          />
        </div>
      </motion.div>

      {/* View Modal */}
      {viewModalOpen && groupToView && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto relative">
            <button onClick={() => { setViewModalOpen(false); setGroupToView(null); }} className="absolute top-3 right-3 text-black bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1">✕</button>

            <div className="p-6">
              <h3 className="text-lg text-gray-900 font-semibold mb-2">Member Emails</h3>
              <p className="text-sm text-gray-600 mb-4">{groupToView?.organizationId?.name ?? groupToView?.name}</p>

              {(() => {
                const emails = groupToView?.emails ?? groupToView?.leaders ?? [];
                const normalized = Array.isArray(emails) && emails.length > 0 ? emails : groupToView?.emails ?? [];
                return (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium capitalize text-gray-800">{groupToView?.type ?? "Request"} Member List ({normalized?.length ?? 0})</h4>
                      {normalized?.length > 0 ? (
                        <div className="mt-2 border rounded p-3 max-h-40 overflow-y-auto bg-white">
                          {normalized.map((em, i) => (
                            <div key={i} className="text-sm text-gray-700 py-1">• {typeof em === "string" ? em : em?.email ?? em?.user?.email ?? JSON.stringify(em)}</div>
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
        onClose={() => { setConfirmModalOpen(false); setConfirmAction(null); }}
        onConfirm={async () => {
          if (!confirmAction?.id || !confirmAction?.type) return;
          try {
            setLoadingAction(true);
            const statusPayload = { status: confirmAction.type === "approve" ? "approved" : "denied" };
            if (activeTab === "group") {
              await approve_reject(confirmAction.id, statusPayload);
            } else {
              await approve_rejectByAdmin(confirmAction.id, statusPayload);
            }
            toast.success(confirmAction.type === "approve" ? "Approved" : "Rejected");
            setConfirmModalOpen(false);
            await fetchGroupRequests(searchValue || "", groupPage);
            await fetchMemberRequests(searchValue || "", memberPage);
            try {
              window.dispatchEvent(new CustomEvent("groupApprovalUpdated", { detail: { groupCount, memberCount } }));
            } catch {}
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