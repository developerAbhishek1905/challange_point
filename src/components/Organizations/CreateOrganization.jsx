import { motion } from "framer-motion";
import { useState } from "react";
import { createOrganization } from "../../utils/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateOrganization = () => {
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [organizationEmail, setOrganizationEmail] = useState("");
  const [description, setDescription] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [members, setMembers] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // ✅ Add member(s) on "+ Add" click
  const addMember = () => {
    if (!emailInput.trim()) return;

    const newEmails = emailInput
      .trim()
      .split(" ")
      .map((e) => e.trim())
      .filter((e) => e.length > 0);

    const invalidEmails = [];
    const duplicateEmails = [];
    const validNewEmails = [];

    newEmails.forEach((email) => {
      if (!emailRegex.test(email)) {
        invalidEmails.push(email);
      } else if (members.includes(email)) {
        duplicateEmails.push(email);
      } else {
        validNewEmails.push(email);
      }
    });

    if (invalidEmails.length > 0) {
      setErrors({ member: `Invalid email(s): ${invalidEmails.join(", ")}` });
      return;
    }

    if (duplicateEmails.length > 0) {
      setErrors({ member: "Member email already added" });
      return;
    }

    if (validNewEmails.length > 0) {
      setMembers((prev) => [...prev, ...validNewEmails]);
      setEmailInput("");
      setErrors((prev) => ({ ...prev, member: "" }));
    }
  };

  // ✅ Remove member pill
  const removeMember = (index) => {
    setMembers((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ Validate form before submission
  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!companyName.trim()) newErrors.companyName = "Organization name is required";
    if (!organizationEmail.trim()) {
      newErrors.organizationEmail = "Organization email is required";
    } else if (!emailRegex.test(organizationEmail)) {
      newErrors.organizationEmail = "Enter a valid email";
    }
    if (!description.trim()) newErrors.description = "Organization description is required";
    if (members.length === 0) newErrors.member = "At least one member is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Final submit with API call
  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload = {
      name,
      companyName,
      organizationEmail,
      description,
      members,
    };

    try {
      setLoading(true);
      const res = await createOrganization(payload);
      toast.success("Organization created successfully!");
      console.log("✅ API Response:", res);

      // Reset form
      setName("");
      setCompanyName("");
      setOrganizationEmail("");
      setDescription("");
      setEmailInput("");
      setMembers([]);
      setErrors({});
    } catch (error) {
      console.error("❌ API Error:", error);
      toast.error(error?.response?.data?.message || "Failed to create organization");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ✅ Toastify Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      <motion.div className="bg-white p-6 rounded-xl w-[60%] mx-auto shadow-xl mt-10">
        <h2 className="text-4xl font-semibold mb-16 text-gray-900">Add Organization</h2>

        <div className="space-y-10">
          {/* Name */}
          <div>
            <label className="text-xl font-medium text-gray-900">Name</label>
            <input
              type="text"
              placeholder="Name"
              className="w-full mt-4 p-2 border text-lg rounded-md text-gray-600"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prev) => ({ ...prev, name: "" }));
              }}
            />
            {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
          </div>

          {/* Organization Name */}
          <div>
            <label className="text-xl font-medium text-gray-900">Organization Name</label>
            <input
              type="text"
              placeholder="Organization name"
              className="w-full mt-4 p-2 border text-lg rounded-md text-gray-600"
              value={companyName}
              onChange={(e) => {
                setCompanyName(e.target.value);
                setErrors((prev) => ({ ...prev, companyName: "" }));
              }}
            />
            {errors.companyName && <div className="text-red-500 text-xs mt-1">{errors.companyName}</div>}
          </div>

          {/* Organization Email */}
          <div>
            <label className="text-xl font-medium text-gray-900">Organization Email</label>
            <input
              type="text"
              placeholder="Organization email"
              className="w-full mt-4 p-2 border text-lg rounded-md text-gray-600"
              value={organizationEmail}
              onChange={(e) => {
                setOrganizationEmail(e.target.value);
                setErrors((prev) => ({ ...prev, organizationEmail: "" }));
              }}
            />
            {errors.organizationEmail && <div className="text-red-500 text-xs mt-1">{errors.organizationEmail}</div>}
          </div>

          {/* Description */}
          <div>
            <label className="text-xl font-medium text-gray-900">Organization Description</label>
            <input
              type="text"
              placeholder="Organization description"
              className="w-full mt-4 text-lg p-2 border rounded-md text-gray-600"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setErrors((prev) => ({ ...prev, description: "" }));
              }}
            />
            {errors.description && <div className="text-red-500 text-xs mt-1">{errors.description}</div>}
          </div>

          {/* Members */}
          <div>
            <label className="text-xl font-medium text-gray-900">Organization Members</label>

            {/* Pills */}
            {members.length > 0 && (
              <div className="flex flex-wrap my-4">
                {members.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-blue-100 m-2 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    <span>{member}</span>
                    <button
                      onClick={() => removeMember(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input + Add Button */}
            <div className="flex items-center gap-3 mt-2">
              <input
                type="text"
                placeholder="Enter member email(s)"
                className="flex-1 p-2 text-lg border rounded-md text-gray-600"
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  setErrors((prev) => ({ ...prev, member: "" }));
                }}
              />
              <button
                type="button"
                onClick={addMember}
                className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 whitespace-nowrap"
              >
                + Add
              </button>
            </div>

            {errors.member && <div className="text-red-500 text-xs mt-1">{errors.member}</div>}

            <div className="mt-2 text-sm text-gray-500">Members Added: {members.length}</div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              className="px-4 py-2 rounded-md border text-gray-700"
              onClick={() => {
                setName("");
                setCompanyName("");
                setOrganizationEmail("");
                setDescription("");
                setEmailInput("");
                setMembers([]);
                setErrors({});
              }}
            >
              Cancel
            </button>
            <button
              disabled={loading}
              onClick={handleSubmit}
              className={`px-4 py-2 rounded-md text-white ${
                loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Creating..." : "Add Organization"}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default CreateOrganization;
