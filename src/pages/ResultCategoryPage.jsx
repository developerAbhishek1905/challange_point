import Header from "../components/common/Header";

import { useEffect, useState } from "react";
import {  useLocation, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import ResultCategoryTable from "../components/results/ResultCategoryTable";
import { EventCategoryList } from "../Redux/API/API";


const ResultCategoryPage = () => {
  const [categories, setCategories] = useState([]);

const dispatch = useDispatch();
            const { eventName } = useParams();
            const location = useLocation();
  const eventId = location.state?.eventId;
  console.log(eventId,'checking eventId')

   console.log("Event Name:", eventName);

const getCategoriesList = async () => {
  try {
    const response = await dispatch(EventCategoryList({ eventName }));
    console.log(response, 'ResultCategoryAllResponse');

    const eventList = response?.payload?.data?.data || [];
    // Flatten category_id from all events into one array
    const flattenedCategories = eventList.flatMap(event =>
      event.category_id.map(category => ({
        ...category,
        date: event.date, // attach event-level info if needed
        start_time: event.time,
        cutoff_time: "", // Add logic if you have cutoff_time somewhere
      }))
    );

    console.log(flattenedCategories, 'Flattened categories list');
    setCategories(flattenedCategories);


  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
    getCategoriesList();
  }, [eventName]);

  
	
	
	return (
		<div className='flex-1 overflow-auto relative z-10 bg-white'>
			<Header title={`${eventName}/categories`} placeholder='search participants' showSearch={false} />
         <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>

		     
         <ResultCategoryTable categories={categories} eventId={eventId}/>
       </main>

		</div>
	);
};
export default ResultCategoryPage;
