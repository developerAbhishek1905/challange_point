import { Download, FolderInput, Plus } from "lucide-react";
import Header from "../../components/common/Header";

import { useState } from "react";
import UserParticipantTable from "../../components/UserSide/UserParticipantTable";


const UserParticipantsPage = () => {
  const [showModal, setShowModal] = useState(false);

  

  return (
    <div className="flex-1 overflow-auto relative z-10 bg-white">
      <Header
        title={"Participants"}
        placeholder="search participants"
        showSearch={true}
      />

      <main className="max-w-7xl mx-auto py-2 px-4 lg:px-8">
        
        <UserParticipantTable showModal={showModal} setShowModal={setShowModal} />
       
      </main>
    </div>
  );
};
export default UserParticipantsPage;
