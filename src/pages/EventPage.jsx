import Header from "../components/common/Header";

import { Download, Plus } from "lucide-react";

import EventsTable from "../components/events/EventsTable";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { EventCSV } from "../Redux/API/API";
import { saveAs } from "file-saver";

const ProductsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("");

const dispatch = useDispatch();

  const handleCSV = async() =>{
    try {
      const response = await dispatch(EventCSV()).unwrap()
  .then((blobData) => {
    const blob = new Blob([blobData], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, "events.xlsx");
  })
      console.log(response,'CSV response')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Events" placeholder="search events" showSearch={true} />

      <main className="max-w-7xl mx-auto py-2 px-4 lg:px-8">
            <div className="flex flex-wrap">
          <button
            className="bg-green-700 border-2 text-white rounded-lg mb-2 pl-4 pr-4 py-2 flex gap-1"
            onClick={handleCSV}
          >
            {" "}
            <Download /> Export CSV{" "}
          </button>

          <button
            onClick={() => {
              setShowModal(true);
              setModalMode("create");
            }}
            className="bg-black border-2 text-white rounded-lg mb-2 pl-4 pr-4 py-2 flex gap-1"
          >
            {" "}
            <Plus />
            Create Event{" "}
          </button>
        </div>
        <EventsTable
          showModal={showModal}
          setShowModal={setShowModal}
          modalMode={modalMode}
          setModalMode={setModalMode}
        />
    
      </main>
    </div>
  );
};
export default ProductsPage;
