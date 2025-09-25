

import Header from "../components/common/Header";

import { Plus} from "lucide-react";

import CatogriesTable from "../components/catogries/CatogriesTable";
import { useState } from "react";




const CategoriesPage = () => {
	const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("");


	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Categories' placeholder='search catogries' showSearch={true} />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				

			
				<CatogriesTable  showModal={showModal} setShowModal={setShowModal}  modalMode={modalMode}
          setModalMode={setModalMode} />
				<button
					onClick={() => {
              setShowModal(true);
              setModalMode("create");
            }}
						className='bg-black border-2 text-white rounded-lg mt-2 pl-4 pr-4 py-2 flex gap-1' 
					> <Plus/>Create Category </button>

			
			</main>
		</div>
	);
};
export default CategoriesPage;
