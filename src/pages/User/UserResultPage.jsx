import ResultEventTable from "../../components/results/ResultEventTable";
import Header from "../../components/common/Header";



const UserResultPage = () => {
    const user = true;
	return (
		<div className='flex-1 overflow-auto relative z-10 bg-white'>
			<Header title={"Result/Events"} placeholder="search events" showSearch={true}/>


         <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>

	{/* <ResultTable/> */}
	<ResultEventTable user={user} />
             </main>

		</div>
	);
};
export default UserResultPage;
