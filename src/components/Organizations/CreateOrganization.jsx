import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RegisterOrganization from "./RegisterOrganization";
import ChangeOrganizationMembers from "./ChangeOrganizationMembers";

const CreateOrganization = () => {
  const [activeTab, setActiveTab] = useState("register");

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      {/* Tabs */}
      <div className="max-w-5xl md:w-1/3 mx-auto mt-6 px-4">
        <div className="flex gap-2 bg-white rounded-xl shadow p-2">
          <button
            className={`flex-1 py-2 rounded-md text-sm font-medium ${
              activeTab === "register" ? "bg-blue-600 text-white" : "text-gray-700"
            }`}
            onClick={() => setActiveTab("register")}
          >
           <div> Group </div> Registration
          </button>
          <button
            className={`flex-1 py-2 rounded-md text-sm font-medium ${
              activeTab === "change" ? "bg-blue-600 text-white" : "text-gray-700"
            }`}
            onClick={() => setActiveTab("change")}
          >
            <div> Add / Remove </div>Members
          </button>
        </div>
      </div>

      {/* Render Components */}
      {activeTab === "register" && <RegisterOrganization />}
      {activeTab === "change" && <ChangeOrganizationMembers />}
    </>
  );
};

export default CreateOrganization;
