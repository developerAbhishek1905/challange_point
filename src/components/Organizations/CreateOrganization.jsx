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
  const [organizationWebsite, setOrganizationWebsite] = useState("");

  // ✅ Regex for validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const websiteRegex =
    /^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[^\s]*)?$/i;

  // ✅ Extract domain from email
  const extractDomain = (email) => {
    const match = email.match(/@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/);
    return match ? match[1].toLowerCase() : "";
  };

  // ✅ Auto-fill website from email
  const handleOrganizationEmailChange = (e) => {
    const value = e.target.value;
    setOrganizationEmail(value);
    setErrors((prev) => ({ ...prev, organizationEmail: "" }));

    const domain = extractDomain(value);
    if (domain && !organizationWebsite.trim()) {
      setOrganizationWebsite(`www.${domain}`);
    }
  };

  // ✅ Add member
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
      if (!emailRegex.test(email)) invalidEmails.push(email);
      else if (members.includes(email)) duplicateEmails.push(email);
      else validNewEmails.push(email);
    });

    if (invalidEmails.length > 0)
      return setErrors({ member: `Invalid email(s): ${invalidEmails.join(", ")}` });
    if (duplicateEmails.length > 0)
      return setErrors({ member: "Member email already added" });

    if (validNewEmails.length > 0) {
      setMembers((prev) => [...prev, ...validNewEmails]);
      setEmailInput("");
      setErrors((prev) => ({ ...prev, member: "" }));
    }
  };

  const removeMember = (index) => {
    setMembers((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ Validate all fields
  const validateForm = () => {
    const newErrors = {};

    // if (!name.trim()) newErrors.name = "Your name is required";
    if (!companyName.trim()) newErrors.companyName = "Organization name is required";
    if (!organizationEmail.trim())
      newErrors.organizationEmail = "Organization email is required";
    else if (!emailRegex.test(organizationEmail))
      newErrors.organizationEmail = "Enter a valid email address";

    if (!organizationWebsite.trim())
      newErrors.organizationWebsite = "Website is required";
    else if (!websiteRegex.test(organizationWebsite))
      newErrors.organizationWebsite = "Enter a valid website (e.g., www.example.com)";

    if (!description.trim())
      newErrors.description = "Organization description is required";
    if (members.length === 0)
      newErrors.member = "At least one member is required";

    // ✅ Domain matching validation
    const emailDomain = extractDomain(organizationEmail);
    const websiteDomain = organizationWebsite
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .split("/")[0]
      .toLowerCase();

    if (emailDomain && websiteDomain && !websiteDomain.includes(emailDomain)) {
      newErrors.organizationWebsite =
        "Website domain must match organization email domain";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit handler
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fill all fields correctly before submitting.");
      return;
    }

    const payload = {
      name:companyName,
      companyName,
      organizationEmail,
      organizationWebsite,
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
      setOrganizationWebsite("");
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
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      <motion.div
        className="bg-white p-6 sm:p-8 md:p-10 rounded-xl w-[95%] sm:w-[90%] md:w-[80%] lg:w-[60%] xl:w-[50%] mx-auto shadow-xl mt-6 sm:mt-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-3xl font-semibold mb-8 text-gray-900 text-center">
          Add Organization
        </h2>

        <div className="space-y-6">
          {/* Name */}
          {/* <div>
            <label className="font-medium text-gray-900">Your Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full mt-2 p-3 border rounded-md text-gray-700"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prev) => ({ ...prev, name: "" }));
              }}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div> */}

          {/* Organization Name */}
          <div>
            <label className="font-medium text-gray-900">Organization Name</label>
            <input
              type="text"
              placeholder="Organization name"
              className="w-full mt-2 p-3 border rounded-md text-gray-700"
              value={companyName}
              onChange={(e) => {
                setCompanyName(e.target.value);
                setErrors((prev) => ({ ...prev, companyName: "" }));
              }}
            />
            {errors.companyName && (
              <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
            )}
          </div>

          {/* Organization Email */}
          <div>
            <label className="font-medium text-gray-900">Organization Email</label>
            <input
              type="text"
              placeholder="Organization email"
              className="w-full mt-2 p-3 border rounded-md text-gray-700"
              value={organizationEmail}
              onChange={handleOrganizationEmailChange}
            />
            {errors.organizationEmail && (
              <p className="text-red-500 text-sm mt-1">{errors.organizationEmail}</p>
            )}
          </div>

          {/* Website */}
          <div>
            <label className="font-medium text-gray-900">Website</label>
            <input
              type="text"
              placeholder="Organization website"
              className="w-full mt-2 p-3 border rounded-md text-gray-700"
              value={organizationWebsite}
              onChange={(e) => {
                setOrganizationWebsite(e.target.value.trim());
                setErrors((prev) => ({ ...prev, organizationWebsite: "" }));
              }}
            />
            {errors.organizationWebsite && (
              <p className="text-red-500 text-sm mt-1">{errors.organizationWebsite}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="font-medium text-gray-900">Description</label>
            <textarea
              placeholder="Organization description"
              className="w-full mt-2 p-3 border rounded-md text-gray-700 resize-none"
              rows={3}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setErrors((prev) => ({ ...prev, description: "" }));
              }}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Members */}
          <div>
            <label className="font-medium text-gray-900">Organization Members</label>
            <div className="flex flex-wrap my-2">
              {members.map((member, i) => (
                <div
                  key={i}
                  className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 m-1 rounded-full text-sm"
                >
                  {member}
                  <button
                    onClick={() => removeMember(i)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                placeholder="Enter member email(s)"
                className="flex-1 p-3 border rounded-md text-gray-700"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />
              <button
                onClick={addMember}
                type="button"
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                + Add
              </button>
            </div>
            {errors.member && <p className="text-red-500 text-sm mt-1">{errors.member}</p>}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => {
                setName("");
                setCompanyName("");
                setOrganizationEmail("");
                setOrganizationWebsite("");
                setDescription("");
                setEmailInput("");
                setMembers([]);
                setErrors({});
              }}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              onClick={handleSubmit}
              className={`px-4 py-2 rounded-md text-white ${
                loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Creating..." : "Create Organization"}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default CreateOrganization;
