import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";

import TotalEventsIcon from '../../public/icons/TotalEventsIcon.svg'
import ActiveEventsIcon from '../../public/icons/ActiveEventsIcon.svg'
import TotalOrganizationsIcon from '../../public/icons/TotalOrganizationsIcon.svg'
import VerifiedParticipantsIcon from '../../public/icons/VerifiedParticipantsIcon.svg'

import RecentResultTable from "../components/overview/RecentResultTable";
import QuickActionsTable from "../components/overview/QuickActionsTable";
import UpcomingRacesTable from "../components/overview/UpcomingRacesTable";
import OrganizationViewChart from "../components/overview/OrganizationViewChart";
import { useDispatch } from "react-redux";
import { dashboard } from "../Redux/API/API";
import { useEffect, useState } from "react";

const OverviewPage = () => {
     //stats
	const [totalEvents,setTotalEvents] = useState('');
	const [totalOrganizations,setTotalOrganizations] = useState('');
	const [activeEvents,setActiveEvents] = useState('');
	const [verifiedParticipants,setVerifiedParticipants] = useState('');

	//list
	const [recentResult, setRecentResult] = useState([]);
	const [organizationsList,setOrganizationList] = useState([]);
	const [upcomingRaces, setUpcomingRaces] = useState([]);

	const dispatch = useDispatch();

     const dashboardData = async() =>{
		try {
			const response = await dispatch(dashboard());
			console.log(response);

			setTotalEvents(response?.payload?.data?.count?.totalEvent)
			setActiveEvents(response?.payload?.data?.count?.activeEvent)
			setTotalOrganizations(response?.payload?.data?.count?.totalOrganization)
			setVerifiedParticipants(response?.payload?.data?.count?.totalParticipant)

			setRecentResult(response?.payload?.data?.recentResult)
			setOrganizationList(response?.payload?.data?.organizationList)
			setUpcomingRaces(response?.payload?.data?.upcomingRaces)

		} catch (error) {
			console.log(error)
		}
	 }

	  useEffect(()=>{
		dashboardData();
	  },[dispatch])

	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Dashboard' showSearch={false} />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Total Events' icon={TotalEventsIcon} value={totalEvents} color='#6366F1' />
					<StatCard name='Upcoming / Active Events' icon={ActiveEventsIcon} value={activeEvents} color='#EC4899' />
					<StatCard name='Total Organizations' icon={TotalOrganizationsIcon} value={totalOrganizations} color='#10B981' />
					<StatCard name='Verified Participants' icon={VerifiedParticipantsIcon} value={verifiedParticipants} color='#8B5CF6' />
				</motion.div>

				{/* CHARTS */}

				<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
					<RecentResultTable data = {recentResult} />
					<QuickActionsTable/>
					<UpcomingRacesTable data = {upcomingRaces}/>
					<OrganizationViewChart data={organizationsList}/>

				</div>
			</main>
		</div>
	);
};
export default OverviewPage;
