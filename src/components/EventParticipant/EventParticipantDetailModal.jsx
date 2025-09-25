import { Avatar, Image } from "antd";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { User } from "lucide-react";

const EventParticipantDetailModal = ({ participant, onClose }) => {
	if (!participant) return null;

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
						{participant.file ? (
                              <Image
                                src={participant.file}
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
							<h2 className='text-xl font-semibold text-gray-700'>{participant.name}</h2>
							<p className='text-sm text-gray-500'>{participant.email}</p>
						</div>
					</div>
					<button onClick={onClose} className='text-gray-600 text-lg font-semibold'>&times;</button>
				</div>

				<div className='grid grid-cols-2 gap-y-4 text-sm'>
					<LabelValue label="Phone Number" value={participant.phone_number} />
					<LabelValue label="Gender" value={participant.category?.gender} />
					<LabelValue label="Nationality" value={participant.nationality} />
					<LabelValue label="ID Number" value={participant.id_number} />
					<LabelValue label="Status" value={participant.status}/>
					<hr className='col-span-2 my-4' />
					<LabelValue label="Event" value={participant.event?.event_name} />
					<LabelValue label="Category" value={participant.category?.category_name} />
					<LabelValue label="BIB Number" value={participant.bib_number} />
					<LabelValue label="Wave" value={participant.wave} />
					<LabelValue label="Registration ID" value={participant.registration_id} />
					<hr className='col-span-2 my-4' />
					<LabelValue label="Result(Time)" value={
						participant?.result?.resultTime
						  ? dayjs(participant.result.resultTime).format("DD MMM YYYY, hh:mm:ss.SSS A")
						  : "-- --"
					  } />
										<LabelValue label="Ranking" value={participant?.result?.ranking||'--'} />
										<LabelValue label="Status" value={participant?.result?.status||'--'} />
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

export default EventParticipantDetailModal;
