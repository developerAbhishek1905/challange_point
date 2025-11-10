// import { Search } from "lucide-react";
// import { useDispatch } from "react-redux";
// import { setSearchTerm } from "../../Redux/Slice/searchSlice";
// import { useEffect, useState } from "react";

// const Header = ({ title,placeholder,showSearch }) => {

// 	const [localSearchTerm, setLocalSearchTerm] = useState("");
//   const dispatch = useDispatch();

//   // Debounce implementation to avoid excessive API calls
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       dispatch(setSearchTerm(localSearchTerm));
//     }, 500); // Wait 500ms after typing stops

//     return () => clearTimeout(timer);
//   }, [localSearchTerm, dispatch]);

// 	return (
// 		// <header className='bg-white'>
// 		// 	<div className='max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8'>
// 		// 		<h1 className='text-2xl font-semibold text-black'>{title}</h1>
// 		// 	</div>
// 		// </header>

// 		<div className=' flex justify-between items-center flex-wrap gap-4 max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8 mt-5'>
// 							<h1 className='text-2xl font-semibold text-black'>{title}</h1>
// {showSearch&&
// 					<div className='relative'>
// 						<input
// 							type='text'
// 							placeholder={placeholder}
// 							className='bg-gray-100 text-black placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
// 							 value={localSearchTerm}
//           onChange={(e) => setLocalSearchTerm(e.target.value)}
// 						/>
// 						<Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
// 					</div>
// }
// 				</div>
// 	);
// };
// export default Header;

const Header = ({ title, placeholder, showSearch, onSearchChange }) => {
  return (
    <div className="flex items-center justify-between py-4">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>

      {showSearch && (
        <input
          type="text"
          placeholder={placeholder}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 w-64"
        />
      )}
    </div>
  );
};

export default Header;
 