import { motion } from "framer-motion";
import { CalendarDaysIcon, Clock, Edit, Ellipsis, Eye, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../../Redux/API/API";
import { selectSearchTerm } from "../../Redux/Slice/searchSlice";
import { Empty, Pagination } from "antd";



const CatogriesTable = ({ showModal, setShowModal, modalMode, setModalMode,}) => {
	const [openMenuId, setOpenMenuId] = useState(null);
	const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

    const menuRef = useRef(null);

     const [currentPage,setCurrentPage] = useState(1);
  const [totatItems, setTotalItems] = useState('');
  

	const [categoryCode, setCategoryCode] = useState('');
	const [categoryName, setCategoryName] = useState('');
	const [date, setDate] = useState('');
	const [winnerTotal, setWinnerTotal] = useState('');
	const [standBy, setStandBy] = useState('')
	const [gender,setGender] = useState('');
	const [startTime, setStartTIme] = useState('')
	const [cutOffTime, setCutOffTIme] = useState('');

const dispatch = useDispatch();
  const searchTerm = useSelector(selectSearchTerm)


const getAllCategories =async (page = currentPage) =>{
	try {
	const response =  await dispatch(getCategories({ page, searchTerm }))

	if (response?.payload?.status === 200){
		setCategories(response?.payload?.data?.data);
     setCurrentPage(response?.payload?.data?.currentPage);
      setTotalItems(response?.payload?.data?.count);
	}
	console.log(response)

		
	} catch (error) {
		console.log(error)
	}
}

useEffect(()=>{
	getAllCategories(currentPage);
},[currentPage,searchTerm])

 useEffect(() => {
    function handleClickOutside(event) {
      // Close the menu if clicked outside
      if (
        openMenuId &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpenMenuId(null);
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

 const resetFormFields = () => {
    setCategoryName("");
    setCategoryCode("");
    setDate("");
    setWinnerTotal("");
    setStandBy("");
    setGender("");
    setStartTIme("");
	setCutOffTIme("")
    setSelectedCategory(null);
  };



 const handleSubmit = async () => {
	const data = {
	    category_name: categoryName,
		category_code: categoryCode,
		date,
		winner_total: winnerTotal,
		standbywinner_total: standBy,
		gender: gender,
		start_time: startTime,
		cutoff_time: cutOffTime,
		status:true
	};
	try {
	  const response = await dispatch(createCategory(data));
	  if (response.payload.status === 201) {
		alert("Event Created successfully");
		handleModalClose();
		getAllCategories();
	  }

	  console.log(response, "create event response");
	} catch (error) {
	  console.log(error);
	} finally {
	  resetFormFields();
	}
  };


const handlEditClick = (category) => {
	setSelectedCategory(category)
    setCategoryName(category.category_name);
    setCategoryCode(category.category_code);
    const dateObj = new Date(category.date);
    const formattedDate = dateObj.toISOString().split("T")[0];
    setDate(formattedDate);
    setWinnerTotal(category.winner_total);
    setStandBy(category.standbywinner_total);
    setGender(category.gender);
    setStartTIme(category.start_time);
    setCutOffTIme(category.cutoff_time);
    setModalMode("Edit");
    setShowModal(true);
  };

    const handleModalClose = () => {
    setShowModal(false);
    resetFormFields();
  };

  const handleEditSubmit = async () => {
	  if (!selectedCategory) return;
  
	  const data = {
		category_name: categoryName,
		category_code: categoryCode,
		date,
		winner_total: winnerTotal,
		standbywinner_total: standBy,
		gender: gender,
		start_time: startTime,
		cutoff_time: cutOffTime,
		status:true
	  };
  
	  try {
		const response = await dispatch(
		  updateCategory({
			categoryId: selectedCategory._id,
			data: data,
		  })
		);
  
		if (response.payload.status === 200) {
		  alert("Category Updated successfully");
		  handleModalClose();
		  getAllCategories();
		}
		console.log(response, "edit response");
	  } catch (error) {
		console.log(error);
	  }
	};


	  const handleDelete = async(category) =>{
		   if (!category || !category._id) return;
		  try {
			const response = await dispatch(deleteCategory(category._id));
			
		  alert("User deleted successfully");
		
			console.log(response);
			getAllCategories();
		  } catch (error) {
			console.log(error);
		  }
		}
	

    const handlePageChange = (page) => {
  setCurrentPage(page);
};

	return (
		<>
		
		  {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="bg-white p-6 rounded-xl w-full max-w-xl shadow-xl"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              {modalMode === "Edit" ? "Edit Category" : "Create Category"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-900">
                  Category name
                </label>
                <input
                  type="text"
                  placeholder="Category name"
                  className="w-full mt-1 p-2 border rounded-md text-gray-600"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-900">
                  Category code
                </label>
                <input
                  type="text"
                  placeholder="Category code"
                  className="w-full mt-1 p-2 border rounded-md text-gray-600"
                  value={categoryCode}
                  onChange={(e) => setCategoryCode(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-900">
                    Date
                  </label>
                  <div className="relative mt-1 text-gray-900">
                    <input
                      type="date"
                      className="w-full p-2 pr-10 border rounded-md text-gray-600"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                    {/* <CalendarDaysIcon className="absolute right-2 top-2.5 h-5 w-5 text-gray-400" /> */}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900">
                    Winners Total
                  </label>
                  <div className="relative mt-1">
                    <input
                      type="number"
                      className="w-full p-2 pr-10 border rounded-md text-gray-600"
                      value={winnerTotal}
                      onChange={(e) => setWinnerTotal(e.target.value)}
                    />
                    {/* <Clock className="absolute right-2 top-2.5 h-5 w-5 text-gray-400" /> */}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-900">
                  StandBy Winner Total
                </label>
                <input
                  type="number"
                  placeholder="StandBy Winner Total"
                  className="w-full mt-1 p-2 border rounded-md text-gray-500"
                  value={standBy}
                  onChange={(e) => setStandBy(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-900">
                  Gender
                </label>
                <select
                  className="w-full mt-1 p-2 border rounded-md text-gray-600"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="" disabled hidden>
                    Gender
                  </option>
                  <option value="male">male</option>
                  <option value="female">female</option>
                </select>
              </div>



                <div>
                <label className="text-sm font-medium text-gray-900">
                  Start Time
                </label>
                <input
                  type="time"
                  placeholder="Start Time"
                  className="w-full mt-1 p-2 border rounded-md text-gray-500"
                  value={startTime}
                  onChange={(e) => setStartTIme(e.target.value)}
                />
              </div> 

                <div>
                <label className="text-sm font-medium text-gray-900">
                  Cutt Off Time
                </label>
                <input
                  type="time"
                  placeholder="Cutt Off Time"
                  className="w-full mt-1 p-2 border rounded-md text-gray-500"
                  value={cutOffTime}
                  onChange={(e) => setCutOffTIme(e.target.value)}
                />
              </div> 
            

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={handleModalClose}
                  className="px-4 py-2 rounded-md border text-gray-700"
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                  onClick={
                    modalMode === "Edit" ? handleEditSubmit : handleSubmit
                  }
                >
                  {modalMode === "Edit" ? "Edit Category" : "Create Category"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

		<motion.div
			className='bg-white rounded-xl  border border-gray-200 mb-8 pb-2'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			{/* <div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-gray-900'>Categories</h2>
				<div className='relative'>
					<button
					
						className='bg-black border-2 text-white rounded-lg pl-4 pr-4 py-2 flex gap-1'
					> <Plus/>Create Category </button>
				</div>
			</div> */}

			<div className='overflow-x-auto'>
				<table className='min-w-full'>
				<thead className="bg-gray-100">
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>
                            Category Code
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>
                            Category Name
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>
								Date
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>
                            Winner's Total
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>
                            Standby Winner's Total
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>
                            Gender
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>
                            Start time
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>
                            Cut off Time
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>
								Actions
							</th>
						</tr>
					</thead>

					<tbody>
            {categories && categories.length > 0 ? (
						categories.map((category) => (
							<motion.tr
								key={category._id}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 flex gap-2 items-center'>
								
									{category.category_code}
								</td>

								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
									{category.category_name}
								</td>

								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
									  {category.date
    ? new Date(category.date).toISOString().split("T")[0]
    : "-"}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>{category.winner_total}</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>{category.standbywinner_total}</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>{category.gender}</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>{category.start_time}</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>{category.cutoff_time}</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700 relative'>
  <button onClick={() => setOpenMenuId(openMenuId === category._id ? null : category._id)}>
    <Ellipsis className="text-gray-600 hover:text-gray-800" />
  </button>

  {openMenuId === category._id && (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-10"
    >
      <button
        onClick={() => {
          setOpenMenuId(null);
        }}
        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        <Eye size={16} className="mr-2" /> View
      </button>
      <button
       onClick={() => {
            handlEditClick(category);
                }}
        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        <Edit size={16} className="mr-2" /> Edit
      </button>
      <button
        onClick={() => {
         handleDelete(category)
			
        }}
        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
      >
        <Trash2 size={16} className="mr-2" /> Delete
      </button>
    </motion.div>
  )}
</td>
							</motion.tr>
						))
          ): (
                <tr>
                  <td colSpan="8" className="text-center py-8">
                    <Empty 
                      description="No categories found" 
                      image={Empty.PRESENTED_IMAGE_SIMPLE} 
                    />
                  </td>
                </tr>
              )
          }
					</tbody>
				</table>
			</div>
            <Pagination align="end"  defaultCurrent={currentPage} total={totatItems} showSizeChanger={false}  onChange={handlePageChange}/>

		</motion.div>
		</>
	);
};
export default CatogriesTable;
