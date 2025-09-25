import { User } from "lucide-react";
import SettingSection from "./SettingSection";
import { Avatar } from "antd";

// Hardcoded user info
const userData = {
  role: "admin", // Change to "user" for user view
  email: "admin@demo.com"
};

const Profile = () => {
  return (
    <SettingSection icon={User} title={"Profile"}>
      <div className='flex flex-col sm:flex-row items-center mb-6'>
        <Avatar size={44} icon={<User />} className="m-2" />
        <div>
          <h3 className='text-lg font-semibold text-gray-900'>
            {userData.role === 'admin' ? 'Admin' : 'User'}
          </h3>
          <p className='text-gray-500'>{userData.email}</p>
        </div>
      </div>
    </SettingSection>
  );
};
export default Profile;
