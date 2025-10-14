import { Plus } from "lucide-react";

import Header from "../components/common/Header";

import OrganizationTable from "../components/Organizations/OrganizationTable";
import { useState } from "react";
import { getAllOrganizationsList } from "../utils/api";

const orderStats = {
  totalOrders: "1,234",
  pendingOrders: "56",
  completedOrders: "1,178",
  totalRevenue: "$98,765",
};

const OrganizationPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("");
  getAllOrganizationsList();

  return (
    <div className="flex-1 relative z-10 overflow-auto">
      <Header
        title={"Organization"}
        placeholder="search organization"
        showSearch={true}
      />

      <main className="max-w-7xl mx-auto py-2 px-4 lg:px-8">
        <button
          onClick={() => {
            setShowModal(true);
            setModalMode("create");
          }}
          className="bg-black border-2 text-white rounded-lg mb-2 pl-4 pr-4 py-2 flex gap-1"
        >
          {" "}
          <Plus />
          Add Organization{" "}
        </button>

        <OrganizationTable
          showModal={showModal}
          setShowModal={setShowModal}
          modalMode={modalMode}
          setModalMode={setModalMode}
        />
      </main>
    </div>
  );
};
export default OrganizationPage;
