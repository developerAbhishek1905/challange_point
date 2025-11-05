import Header from "../components/common/Header";
import NotificationForm from "../components/settings/NotificationForm";
// import DangerZone from "../components/settings/DangerZone";
import Profile from "../components/settings/Profile";
// import Security from "../components/settings/Security";

const SettingsPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10 bg-white'>
			<Header title='' />
			<main className='max-w-4xl mx-auto py-6 px-4 lg:px-8'>
				<Profile />
				{/* <Security /> */}
				<NotificationForm />
				{/* <DangerZone /> */}
			</main>
		</div>
	);
};
export default SettingsPage;
