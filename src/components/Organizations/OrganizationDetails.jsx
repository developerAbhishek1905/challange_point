import React, { useState } from "react";
import { Plus, MoreVertical } from "lucide-react";
import { toast } from "react-toastify";
import { addMember } from "../../utils/api";

export default function OrganizationDetails({
  organization,
  Users,
  onMemberAdded,
  setViewModalOpen,
}) {
  const [showModal, setShowModal] = useState(false);
  
  // Now we store an array of selected user IDs
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Get IDs of current members (registered)
  const memberIds = organization.members.map((m) => m.user?._id);

  // Filter out users who are already members
  const availableUsers = Users.filter((u) => !memberIds.includes(u._id));

  // Toggle selection (checkbox behavior)
  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)   // deselect
        : [...prev, userId]                   // select
    );
  };

  // Select/deselect all
  const toggleSelectAll = () => {
    if (selectedUsers.length === availableUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(availableUsers.map((u) => u._id));
    }
  };

  const handleAddUsers = async (orgId) => {
    if (selectedUsers.length === 0) {
      toast.error("Please select at least one user to add.");
      return;
    }

    // Map selected user IDs → emails
    const selectedEmails = availableUsers
      .filter((user) => selectedUsers.includes(user._id))
      .map((user) => user.email);

    try {
      // New API expects array of emails
      await addMember(orgId, selectedEmails);
      
      toast.success(`${selectedEmails.length} member(s) added successfully`);
      setSelectedUsers([]);
      setShowModal(false);
      setViewModalOpen(false);
      if (onMemberAdded) await onMemberAdded();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add members");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">{organization.name}</h2>
          <p className="text-sm text-gray-500">{organization.description}</p>
        </div>
        {/* <button
          onClick={() => setShowModal(true)}
          className="bg-black text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Plus size={18} />
          Add Member
        </button> */}
      </header>



      {/* Leaderboard Members Table */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Leaderboard Users ({organization.leaders.length})
        </h3>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
              </tr>
            </thead>
            <tbody>
              {organization.leaders.map((member, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="bg-gray-300 w-10 h-10 rounded-full flex items-center justify-center text-gray-700 font-semibold">
                      {member?.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <span className="font-medium text-gray-800">
                      {member?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {member?.email}
                  </td>
                </tr>
              ))}
              {organization.leaders.length === 0 && (
                <tr>
                  <td colSpan={2} className="text-center py-8 text-gray-500">
                    No registered members
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Registered Members Table */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Registered Users ({organization.members.length})
        </h3>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
              </tr>
            </thead>
            <tbody>
              {organization.members.map((member, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="bg-gray-300 w-10 h-10 rounded-full flex items-center justify-center text-gray-700 font-semibold">
                      {member?.user?.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <span className="font-medium text-gray-800">
                      {member?.user?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {member?.user?.email}
                  </td>
                </tr>
              ))}
              {organization.members.length === 0 && (
                <tr>
                  <td colSpan={2} className="text-center py-8 text-gray-500">
                    No registered members
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Draft/Unregistered Members */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Unregistered Users ({organization.draftMembers?.length || 0})
        </h3>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-3">Email</th>
              </tr>
            </thead>
            <tbody>
              {organization.draftMembers?.map((email, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-600">{email}</td>
                </tr>
              ))}
              {(!organization.draftMembers || organization.draftMembers.length === 0) && (
                <tr>
                  <td className="text-center py-8 text-gray-500">
                    No draft members
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add Members Modal – Now with Checkboxes */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Add Members ({selectedUsers.length} selected)
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedUsers([]);
                }}
                className="text-gray-500 hover:text-gray-800 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Select All */}
            {availableUsers.length > 0 && (
              <div className="px-6 mt-3">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === availableUsers.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4"
                  />
                  <span>Select All</span>
                </label>
              </div>
            )}

            {/* Users List */}
            <div className="px-6 py-4 overflow-y-auto flex-1">
              {availableUsers.length === 0 ? (
                <div className="text-gray-500 text-center mt-10">
                  No users available to add.
                </div>
              ) : (
                availableUsers.map((user) => (
                  <label
                    key={user._id}
                    className="flex items-center gap-3 border p-3 rounded-md cursor-pointer hover:bg-gray-50 mb-2 transition"
                  >
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => toggleUserSelection(user._id)}
                      className="w-5 h-5 text-[#0c2443] rounded focus:ring-[#0c2443]"
                    />
                    <div className="bg-gray-300 w-10 h-10 rounded-full flex items-center justify-center text-gray-700 font-semibold">
                      {user?.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="font-medium text-[#0c2443]">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </label>
                ))
              )}
            </div>

            {/* Actions */}
            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedUsers([]);
                }}
                className="border border-gray-500 text-gray-700 px-5 py-2 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddUsers(organization._id)}
                disabled={selectedUsers.length === 0}
                className="bg-[#0c2443] text-white px-6 py-2 rounded-md hover:bg-[#143b6b] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Selected ({selectedUsers.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}