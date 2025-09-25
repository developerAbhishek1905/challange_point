import { useDispatch } from "react-redux";
import Header from "../components/common/Header";
import ResultTable from "../components/results/ResultTable";
import { useLocation } from "react-router-dom";
import { getResult } from "../Redux/API/API";
import { useEffect } from "react";



const ResultPage = () => {

    const location = useLocation();

    const eventId = location.state?.eventId;
    const categoryId = location.state?.categoryId;



	return (
		<div className='flex-1 overflow-auto relative z-10 bg-white'>
			<Header title={"Result"} placeholder="search results" showSearch={true}/>

			

         <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>

	<ResultTable eventId={eventId} categoryId={categoryId}/>
             </main>

		</div>
	);
};
export default ResultPage;
