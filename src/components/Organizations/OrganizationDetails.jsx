import React, { useState } from "react";
import { Plus, MoreVertical } from "lucide-react";
import { toast } from "react-toastify";
import { addMember } from "../../utils/api";

export default function OrganizationDetails({ organization, Users, memberAdded, seMemberAdded, onMemberAdded, onApproveMember, onRejectOrganization, setViewModalOpen}) {
  const [showModal, setShowModal] = useState(false);
  const [checkedUser, setCheckedUser] = useState({}); // Only one user at a time

  // Get IDs of current members
  const memberIds = organization.members.map((m) => m.user?._id);

  // Filter Users to only those not already members
  const nonMemberUsers = Users.filter((u) => !memberIds.includes(u._id));

  const handleRadioChange = (id) => {
    console.log(id)
    setCheckedUser({ userId: id });
  };

  console.log(organization)
  const handleAddUser = async (orgId) => {
    if (!checkedUser.userId) {
      toast.error("Please select a user to add.");
      return;
    }
    try {
      await addMember(orgId, checkedUser); // send only userId
      toast.success("Member added successfully");
      setCheckedUser({});
      setShowModal(false);
      setViewModalOpen(false);
      if (onMemberAdded) await onMemberAdded();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add member");
    }
  };

  // render
  return (
    <div className="p-6">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">{organization.name}</h2>
          <p className="text-sm text-gray-500">{organization.description}</p>
        </div>
        <div>
          <button onClick={() => setShowModal(true)} className="bg-black text-white px-4 py-2 rounded-md">Add Member</button>
        </div>
      </header>

      {/* Members list with Approve / Reject */}
      <section className="mb-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Registered Users
        </h3>
       
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
       
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              {/* <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {organization.members.map((member, i) => (
              <tr key={i} className="border-t hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 flex items-center gap-3">
                  <img src={member?.user?.profileImage} alt={member?.user?.name} className="w-10 h-10 rounded-full" />
                  <span className="font-medium text-gray-800">{member?.user?.name}</span>
                </td>
                <td className="px-6 py-4 text-gray-600">{member?.user?.email}</td>
                {/* <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${member?.status === "approved" ? "bg-green-100 text-green-700" : member?.status === "active" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                    {member?.status}
                  </span>
                </td> */}
                {/* <td className="px-6 py-4 text-right"> */}
                  {/* Approve button */}
                  {/* {member?.status !== "approved" && (
                    <button
                      onClick={() => onApproveMember && onApproveMember(organization._id, member.user._id)}
                      className="mr-2 bg-green-600 text-white px-3 py-1 rounded-md text-xs hover:bg-green-700"
                    >
                      Approve
                    </button>
                  )} */}
                  {/* Reject organization (per your requirement) */}
                  {/* <button
                    onClick={() => onRejectOrganization && onRejectOrganization(organization._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-md text-xs hover:bg-red-700"
                  >
                    Reject
                  </button> */}
                {/* </td> */}
              </tr>
            ))}
            {organization.members.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">No members</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
</section>

<section>
<h3 className="text-lg font-semibold text-gray-800 mb-3">
          Unregistered Users
        </h3>
     
            {/* drafted members list */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
            <tr>
            
              <th className="px-6 py-3">Email</th>
              {/* <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {organization.draftMembers.map((member, i) => (
              <tr key={i} className="border-t hover:bg-gray-50 transition-colors">
                {/* <td className="px-6 py-4 flex items-center gap-3">
                  <img src={member?.user?.profileImage} alt={member?.user?.name} className="w-10 h-10 rounded-full" />
                  <span className="font-medium text-gray-800">{member?.user?.name}</span>
                </td> */}
                <td className="px-6 py-4 text-gray-600">{member}</td>
                {/* <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${member?.status === "approved" ? "bg-green-100 text-green-700" : member?.status === "active" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                    {member?.status}
                  </span>
                </td> */}
                {/* <td className="px-6 py-4 text-right"> */}
                  {/* Approve button */}
                  {/* {member?.status !== "approved" && (
                    <button
                      onClick={() => onApproveMember && onApproveMember(organization._id, member.user._id)}
                      className="mr-2 bg-green-600 text-white px-3 py-1 rounded-md text-xs hover:bg-green-700"
                    >
                      Approve
                    </button>
                  )} */}
                  {/* Reject organization (per your requirement) */}
                  {/* <button
                    onClick={() => onRejectOrganization && onRejectOrganization(organization._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-md text-xs hover:bg-red-700"
                  >
                    Reject
                  </button> */}
                {/* </td> */}
              </tr>
            ))}
            {organization.draftMembers.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">No members</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
</section>

      {/* Add Member Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 pt-6">
              <h3 className="text-lg font-semibold text-gray-800">Select User to Add</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-800 text-xl font-bold">×</button>
            </div>

            <div className="px-6 py-4 overflow-y-auto flex-1">
              {nonMemberUsers.length === 0 ? (
                <div className="text-gray-500 text-center mt-10">No users available to add.</div>
              ) : (
                nonMemberUsers.map((user) => (
                  <label key={user._id} className="flex items-center gap-3 border p-2 rounded-md cursor-pointer hover:bg-gray-50 mb-2">
                    <input type="radio" checked={checkedUser.userId === user._id} onChange={() => handleRadioChange(user._id)} className="w-4 h-4" />
                    <img src={user.profileImage} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-medium text-[#0c2443]">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </label>
                ))
              )}
            </div>

            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="border border-gray-500 text-gray-500 px-4 py-2 rounded-md">Cancel</button>
              <button onClick={() => handleAddUser(organization._id)} className="bg-[#0c2443] text-white px-4 py-2 rounded-md hover:bg-[#143b6b]" disabled={!checkedUser.userId}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
