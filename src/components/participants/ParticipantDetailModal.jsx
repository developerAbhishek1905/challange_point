import { Avatar, Image } from "antd";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { useDispatch } from "react-redux";
import { getParticipantById } from "../../Redux/API/API";
import { useEffect, useState } from "react";

const ParticipantDetailModal = ({ participant, onClose }) => {

	const [paricipantDetails, setParticipantDetails] = useState('');
	if (!participant) return null;
	const dispatch = useDispatch();

	const participantById = async() =>{
		const response = await dispatch(getParticipantById(participant));
		console.log(response,'participant by ID respone');
		setParticipantDetails(response?.payload?.data?.data);
	}

	useEffect(()=>{
		participantById();
	},[dispatch]);

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
			<motion.div
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 0.3 }}
				className='bg-white w-full max-w-2xl rounded-lg p-6 shadow-xl'
			>
				<div className='flex justify-between items-start mb-6'>
					<div className='flex items-center space-x-4'>
						 {paricipantDetails.file ? (
                              <Image
                                src={paricipantDetails.file}
                                alt="profile"
                                className="h-full w-full object-cover rounded-full"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  borderRadius: "50%",
                                }}
                                preview={{
                                  mask: false,
                                  maskClassName: "rounded-full",
                                }}
                              />
                            ) : (
                              <Avatar
                                icon={<User size={40} />}
                                className="bg-gray-400"
                                style={{ width: "100%", height: "100%" }}
                              />
                            )}
						<div>
							<h2 className='text-xl font-semibold text-gray-700'>{paricipantDetails.first_name} {paricipantDetails.last_name}</h2>
							<p className='text-sm text-gray-500'>{paricipantDetails.email}</p>
						</div>
					</div>
					<button onClick={onClose} className='text-gray-600 text-lg font-semibold'>&times;</button>
				</div>

				<div className='grid grid-cols-2 gap-y-4 text-sm'>
					<LabelValue label="Phone Number" value={paricipantDetails.phone_number} />
					<LabelValue label="Gender" value={paricipantDetails.category?.gender} />
					<LabelValue label="Nationality" value={paricipantDetails.nationality} />
					<LabelValue label="ID Number" value={paricipantDetails.id_number} />
					<LabelValue label="Status" value={paricipantDetails.status}/>
					<LabelValue label="Face Verification" value={paricipantDetails.isFaceVerified}/>
					<hr className='col-span-2 my-4' />
					<LabelValue label="Event" value={paricipantDetails.event?.event_name} />
					<LabelValue label="Category" value={paricipantDetails.category?.category_name} />
					<LabelValue label="BIB Number" value={paricipantDetails.bib_number} />
					<LabelValue label="Wave" value={paricipantDetails.wave} />
					<LabelValue label="Registration ID" value={paricipantDetails.registration_id} />
					<hr className='col-span-2 my-4' />
					<LabelValue label="Result(Time)" value={
    paricipantDetails?.result?.resultTime
      ? dayjs(paricipantDetails.result.resultTime).format("DD MMM YYYY, hh:mm:ss.SSS A")
      : "-- --"
  } />
					<LabelValue label="Ranking" value={paricipantDetails?.result?.ranking||'--'} />
					<LabelValue label="Status" value={paricipantDetails?.result?.status ||'--'} />
					
				</div>
			</motion.div>
		</div>
	);
};

const LabelValue = ({ label, value, dropdown }) => (
	<div>
		<p className='text-gray-500'>{label}</p>
		{dropdown ? (
			<select className='bg-transparent text-black border rounded px-2 py-1 mt-1'>
				<option>{value}</option>
			</select>
		) : (
			<p className='font-medium text-gray-900 mt-1'>{value}</p>
		)}
	</div>
);

export default ParticipantDetailModal;
