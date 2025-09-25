import { Lock } from "lucide-react";
import { motion } from "framer-motion";
import SettingSection from "./SettingSection";
import ToggleSwitch from "./ToggleSwitch";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { changePassword } from "../../Redux/API/API";
import { toast } from "react-toastify";

const Security = () => {
	const [twoFactor, setTwoFactor] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	// const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errors, setErrors] = useState({});
const dispatch = useDispatch();

const Id = JSON.parse(localStorage.getItem('id'));

	const validatePasswordForm = () => {
		const newErrors = {};

		// if (!currentPassword.trim()) newErrors.currentPassword = "Current password is required";
		if (!newPassword.trim()) {
			newErrors.newPassword = "New password is required";
		} else if (newPassword.length < 6) {
			newErrors.newPassword = "Password must be at least 6 characters";
		}
		if (!confirmPassword.trim()) {
			newErrors.confirmPassword = "Please confirm your password";
		} else if (newPassword !== confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const resetForm = () => {
		// setCurrentPassword("");
		setNewPassword("");
		setConfirmPassword("");
		setErrors({});
	};

	const handleModalClose = () => {
		setOpenModal(false);
		resetForm();
	};

	const handlePasswordChange = async() => {
		if (!validatePasswordForm()) return;
		const data =  {
    password:confirmPassword
		}

		try {
			const response = await dispatch(changePassword({Id,data}));
			console.log(response,'change password response')
			toast.success(response?.payload?.data?.message)
		} catch (error) {
			toast.success(response?.payload?.data?.message)
		}finally{
		toast.success(response?.payload?.data?.message)
		handleModalClose();
		}

		
	};

	return (
		<>
			<SettingSection icon={Lock} title={"Security"}>
				{/* <ToggleSwitch
					label={"Two-Factor Authentication"}
					isOn={twoFactor}
					onToggle={() => setTwoFactor(!twoFactor)}
				/> */}

				<div className='mt-4'>
					<button
						className='bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded 
						transition duration-200'
						onClick={() => setOpenModal(true)}
					>
						Change Password
					</button>
				</div>
			</SettingSection>

			{openModal && (
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
						className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl"
					>
						<h2 className="text-xl font-semibold mb-4 text-gray-900">
							Change Password
						</h2>

						<div className="space-y-4">
							{/* <div>
								<label className="text-sm font-medium text-gray-900">
									Current Password
								</label>
								<input
									type="password"
									placeholder="Enter current password"
									className="w-full mt-1 p-2 border rounded-md text-gray-600"
									value={currentPassword}
									onChange={(e) => setCurrentPassword(e.target.value)}
								/>
								{errors.currentPassword && (
									<div className="text-red-500 text-xs mt-1">{errors.currentPassword}</div>
								)}
							</div> */}

							<div>
								<label className="text-sm font-medium text-gray-900">
									New Password
								</label>
								<input
									type="password"
									placeholder="Enter new password"
									className="w-full mt-1 p-2 border rounded-md text-gray-600"
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
								/>
								{errors.newPassword && (
									<div className="text-red-500 text-xs mt-1">{errors.newPassword}</div>
								)}
							</div>

							<div>
								<label className="text-sm font-medium text-gray-900">
									Confirm New Password
								</label>
								<input
									type="password"
									placeholder="Confirm new password"
									className="w-full mt-1 p-2 border rounded-md text-gray-600"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
								/>
								{errors.confirmPassword && (
									<div className="text-red-500 text-xs mt-1">{errors.confirmPassword}</div>
								)}
							</div>

							<div className="flex justify-end gap-3 mt-6">
								<button
									onClick={handleModalClose}
									className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-50 transition duration-200"
								>
									Cancel
								</button>
								<button
									onClick={handlePasswordChange}
									className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition duration-200"
								>
									Change Password
								</button>
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</>
	);
};

export default Security;