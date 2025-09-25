

import { useState } from "react";

import UserEventTable from "../../components/UserSide/UserEventTable";
import Header from "../../components/common/Header";


const UserEventPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("");


 

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Event" placeholder="search events" showSearch={false} />

      <main className="max-w-7xl mx-auto py-2 px-4 lg:px-8">
            
        <UserEventTable
          showModal={showModal}
          setShowModal={setShowModal}
          modalMode={modalMode}
          setModalMode={setModalMode}
        />
    
      </main>
    </div>
  );
};
export default UserEventPage;
