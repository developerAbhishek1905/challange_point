import { Plus } from "lucide-react";

import Header from "../components/common/Header";

import UsersTable from "../components/users/UsersTable";
import { useState } from "react";




const UsersPage = () => {
		const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("");

	
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Users' placeholder='search users' showSearch={true}/>

			<main className='max-w-7xl mx-auto py-2 px-4 lg:px-8'>

				{/* <button
					  onClick={() => {
              setShowModal(true);
              setModalMode("create");
            }}
						className='bg-black border-2 text-white mb-2 rounded-lg pl-4 pr-4 py-2 flex gap-1' 
					> <Plus/>Create User </button> */}
			

				<UsersTable showModal={showModal} setShowModal={setShowModal} modalMode={modalMode}
          setModalMode={setModalMode} />
			
					
			
			</main>
		</div>
	);
};
export default UsersPage;
