import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RegisterOrganization from "./RegisterOrganization";
import AddMembersToOrganization from "./AddMembersToOrganization";
import RemoveMembersFromOrganization from "./RemoveMembersFromOrganization";

const CreateOrganization = () => {
  const [activeTab, setActiveTab] = useState("register");

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      {/* Tabs */}
      <div className="max-w-5xl mx-auto mt-6 px-4">
        <div className="flex gap-2 bg-white rounded-xl shadow p-2 flex-wrap">
          <button
            className={`flex-1 min-w-[140px] py-2 rounded-md text-sm font-medium ${
              activeTab === "register" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("register")}
          >
            Group Registration
          </button>
          <button
            className={`flex-1 min-w-[120px] py-2 rounded-md text-sm font-medium ${
              activeTab === "addMembers" ? "bg-green-600 text-white" : "text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("addMembers")}
          >
            Add Members
          </button>
          <button
            className={`flex-1 min-w-[140px] py-2 rounded-md text-sm font-medium ${
              activeTab === "removeMembers" ? "bg-red-600 text-white" : "text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("removeMembers")}
          >
            Remove Members
          </button>
        </div>
      </div>

      {/* Render Components */}
      {activeTab === "register" && <RegisterOrganization />}
      {activeTab === "addMembers" && <AddMembersToOrganization />}
      {activeTab === "removeMembers" && <RemoveMembersFromOrganization />}
    </>
  );
};

export default CreateOrganization;
