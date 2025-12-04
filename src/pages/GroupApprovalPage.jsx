import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import {
  getAllOrganizationsList,
  getGroupApprovalList,
  getApproveList,
} from "../utils/api";

import OrganizationTable from "../components/Organizations/OrganizationTable";
import GroupRequestTable from "../components/Organizations/GroupRequestTable";
import MemberRequestTable from "../components/Organizations/MemberRequestTable";

const GroupApprovalPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState("groups");

  // Pagination states
  const [orgPage, setOrgPage] = useState(1);
  const [groupReqPage, setGroupReqPage] = useState(1);
  const [memberReqPage, setMemberReqPage] = useState(1);
  const pageSize = 8;

  // Data states
  const [organizationData, setOrganizationData] = useState([]);
  const [groupRequestData, setGroupRequestData] = useState([]);
  const [memberRequestData, setMemberRequestData] = useState([]);

  const [groupsCount, setGroupsCount] = useState(0);
  const [groupCount, setGroupCount] = useState(0);
  const [memberCount, setMemberCount] = useState(0);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const orgRes = await getAllOrganizationsList(
          searchValue,
          orgPage,
          pageSize
        );
        setOrganizationData(orgRes?.organizations ?? orgRes?.data ?? []);
        setGroupsCount(orgRes?.totalOrganizations);

        const groupReqRes = await getGroupApprovalList(
          groupReqPage,
          pageSize,
          searchValue
        );
        setGroupRequestData(groupReqRes?.requests ?? groupReqRes?.data ?? []);
        setGroupCount(groupReqRes?.total);

        const memberReqRes = await getApproveList(
          memberReqPage,
          pageSize,
          searchValue
        );
        setMemberRequestData(memberReqRes?.requests ?? memberReqRes?.data ?? []);
        setMemberCount(memberReqRes?.total ?? memberReqRes?.totalRequests ?? 0);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAll();
  }, [searchValue, orgPage, groupReqPage, memberReqPage]);

  return (
    <div className="flex-1 relative z-10 overflow-auto">
      {/* Header */}
      <header className="max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            Group Approvals
          </h1>

          {/* Search Box */}
          {/* <div className="relative w-full max-w-md">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full bg-white text-gray-900 placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div> */}
        </div>
      </header>

      <main className="max-w-7xl mx-auto pb-10 px-4 sm:px-6 lg:px-8">
        {/* Responsive Tabs */}
        <div className="w-full">
  <div className="flex bg-gray-100 rounded-lg p-1 shadow-sm gap-1">
    {[
      { key: "groups", label: "Groups", count: groupsCount },
      { key: "group_requests", label: "Group Requests", count: groupCount },
      { key: "member_requests", label: "Member Requests", count: memberCount },
    ].map((tab) => (
      <button
        key={tab.key}
        onClick={() => setActiveTab(tab.key)}
        className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 py-3 px-2 
          rounded-md font-medium transition-all duration-200 text-[10px] sm:text-sm text-center
          ${
            activeTab === tab.key
              ? "bg-white text-blue-700 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
      >

        {/* Count Badge */}
        {tab.count > 0 && (
          <span className="inline-flex items-center justify-center min-w-[16px] h-[16px] 
            text-[9px] font-medium text-white bg-red-600 rounded-full">
            {tab.count > 99 ? "99+" : tab.count}
          </span>
        )}
        {/* Label — mobile par 2 line allow hogi */}
        <span className="leading-tight text-center break-words">
          {tab.label}
        </span>

        
      </button>
    ))}
  </div>
</div>



        {/* Responsive Tables */}
        <div className="mt-6">
          {activeTab === "groups" && (
            <OrganizationTable
              organizations={organizationData}
              currentPage={orgPage}
              setCurrentPage={setOrgPage}
            />
          )}

          {activeTab === "group_requests" && (
            <GroupRequestTable
              groupList={groupRequestData}
              currentPage={groupReqPage}
              setCurrentPage={setGroupReqPage}
            />
          )}

          {activeTab === "member_requests" && (
            <MemberRequestTable
              memberList={memberRequestData}
              currentPage={memberReqPage}
              setCurrentPage={setMemberReqPage}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default GroupApprovalPage;
