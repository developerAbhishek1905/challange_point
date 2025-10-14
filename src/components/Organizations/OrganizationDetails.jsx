import React, { useState } from "react";
import { Plus, MoreVertical, Search } from "lucide-react";

export default function OrganizationDetails({ organization }) {
    //  if (!organization) return null;
//   const [organization, setOrganization] = useState({
//     name: "Tech Innovators",
//     description:
//       "A community of innovators working on AI, ML, and Cloud solutions.",
//     members: [
//       {
//         user: {
//           name: "Shubham Pal",
//           email: "shubhampalpal832@gmail.com",
//           profileImage:
//             "https://lh3.googleusercontent.com/a/ACg8ocJFc9xFKuI2i2bS6hRLHeyd0X485ez7YqVLkpUJAhoul533d_Ox=s96-c",
//         },
//         status: "active",
//       },
//       {
//         user: {
//           name: "Urvashi Patidar",
//           email: "patidarurvashi99@gmail.com",
//           profileImage:
//             "https://lh3.googleusercontent.com/a/ACg8ocIECBGUkGj-HXbrxl_faELP8XAs2SkNjqQm0VWvJeNKuL5-Dw=s96-c",
//         },
//         status: "inactive",
//       },
//     ],
//   });

  const [showModal, setShowModal] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    profileImage: "",
    status: "active",
  });

  const handleAddMember = () => {
    if (!newMember.name || !newMember.email) {
      alert("Please fill all fields");
      return;
    }

    const newM = {
      user: {
        name: newMember.name,
        email: newMember.email,
        profileImage:
          newMember.profileImage ||
          "https://via.placeholder.com/96x96.png?text=User",
      },
      status: newMember.status,
    };

    setOrganization((prev) => ({
      ...prev,
      members: [...prev.members, newM],
    }));

    setNewMember({ name: "", email: "", profileImage: "", status: "active" });
    setShowModal(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      {/* <aside className="hidden md:flex flex-col w-64 bg-white border-r p-4">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center font-bold text-white">
            C
          </div>
          <div>
            <h2 className="font-semibold">STK Challenge App</h2>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
        <nav className="flex flex-col gap-3 text-gray-700 text-sm">
          <a href="#" className="flex items-center gap-3 hover:text-black">
            <i className="bx bx-grid-alt"></i> Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 hover:text-black">
            <i className="bx bx-task"></i> Challenge Management
          </a>
          <a href="#" className="flex items-center gap-3 hover:text-black">
            <i className="bx bx-user"></i> User Management
          </a>
          <a
            href="#"
            className="flex items-center gap-3 text-black font-medium"
          >
            <i className="bx bx-buildings"></i> Organization
          </a>
          <a href="#" className="flex items-center gap-3 hover:text-black">
            <i className="bx bx-cog"></i> Reports & Settings
          </a>
        </nav>

        <div className="mt-auto pt-6 border-t">
          <p className="text-sm text-gray-500">Admin</p>
          <p className="text-xs text-gray-400">admin@demo.com</p>
        </div>
      </aside> */}

      {/* Main content */}
      <main className="flex-1 p-6">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              {organization.name}
            </h1>
            <p className="text-gray-500">{organization.description}</p>
          </div>
          <div className="flex gap-3">
            {/* <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search members"
                className="border border-gray-300 rounded-md pl-9 pr-3 py-2 text-sm w-48"
              />
            </div> */}
            <button
              onClick={() => setShowModal(true)}
              className="bg-black text- px-4 py-2  mr-10 rounded-md flex items-center gap-2 hover:bg-gray-800"
            >
              <Plus className="w-4 h-4 " /> Add Member
            </button>
          </div>
        </header>

        {/* Members Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {organization.members.map((member, i) => (
                <tr
                  key={i}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img
                      src={member?.user?.profileImage}
                      alt={member?.user?.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <span className="font-medium text-gray-800">
                      {member?.user?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {member?.user?.email}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        member?.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {member?.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <MoreVertical className="w-5 h-5 text-gray-500 hover:text-black cursor-pointer" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Add Member Modal */}
      {/* {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Add New Member
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                value={newMember.name}
                onChange={(e) =>
                  setNewMember({ ...newMember, name: e.target.value })
                }
                className="border w-full p-2 rounded-md"
              />
              <input
                type="email"
                placeholder="Email"
                value={newMember.email}
                onChange={(e) =>
                  setNewMember({ ...newMember, email: e.target.value })
                }
                className="border w-full p-2 rounded-md"
              />
              <input
                type="text"
                placeholder="Profile Image URL"
                value={newMember.profileImage}
                onChange={(e) =>
                  setNewMember({ ...newMember, profileImage: e.target.value })
                }
                className="border w-full p-2 rounded-md"
              />
              <select
                value={newMember.status}
                onChange={(e) =>
                  setNewMember({ ...newMember, status: e.target.value })
                }
                className="border w-full p-2 rounded-md"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="border px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMember}
                className="bg-black text-white px-4 py-2 rounded-md"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}
