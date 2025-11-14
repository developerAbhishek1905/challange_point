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
  const [memberDetailes, setMemberDetails] = useState(null);

  // <-- added state for success popup
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  // ✅ Regex for validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const websiteRegex =
    /^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[^\s]*)?$/i;

  // ✅ Extract domain from email (more robust)
  const extractDomain = (email) => {
    if (!email) return "";
    const e = String(email).trim().toLowerCase();
    const atIndex = e.lastIndexOf("@");
    if (atIndex === -1) return "";
    // take chars after @ until first slash, space or query/hash
    const domainPart = e.slice(atIndex + 1).split(/[\/?#\s]/)[0];
    // remove leading www.
    return domainPart.replace(/^www\./, "");
  };

  // ✅ Auto-fill website from email (only if user hasn't set custom website)
  const handleOrganizationEmailChange = (e) => {
    const value = e.target.value;
    setOrganizationEmail(value);
    setErrors((prev) => ({ ...prev, organizationEmail: "" }));

    const domain = extractDomain(value);
    if (!domain) return;

    // If website is empty OR it currently matches previous auto value, update it.
    const currentWebsite = String(organizationWebsite || "").trim().toLowerCase();
    const previousAuto = `www.${extractDomain(organizationEmail || "")}`.toLowerCase();
    const suggested = `www.${domain}`;

    if (!currentWebsite || currentWebsite === previousAuto) {
      setOrganizationWebsite(suggested);
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

    // ❌ Problem in domain comparison logic (it fails when email domain = "openai.com" and website = "www.openai.com")
// if (emailDomain && websiteDomain && !websiteDomain.includes(emailDomain)) {
//   newErrors.organizationWebsite =
//     "Website domain must match organization email domain";
// }

// ✅ FIX: Normalize both domains before comparison and allow subdomains
const normalizeDomain = (domain) =>
      String(domain || "")
        .replace(/^https?:\/\//, "")
        .replace(/^www\./, "")
        .replace(/\/.*$/, "")
        .toLowerCase();

    const emailDomain = extractDomain(organizationEmail);
    const websiteDomain = normalizeDomain(organizationWebsite);

    if (emailDomain && websiteDomain) {
      const domainMatches =
        websiteDomain === emailDomain || websiteDomain.endsWith("." + emailDomain);

      if (!domainMatches) {
        newErrors.organizationWebsite =
          "Website domain must match organization email domain (or be a subdomain)";
      }
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
      setMemberDetails(res?.membersStatus
)
      toast.success("Organization created successfully!");

      // open success popup
      setSuccessModalVisible(true);

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
      toast.error(error?.response?.data?.message || "Failed to create organization");
    } finally {
      setLoading(false);
    }
  };

  console.log(memberDetailes)

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      <motion.div
  className="bg-white p-4 sm:p-6 md:p-8 lg:p-10 rounded-xl w-[95%] sm:w-[90%] md:w-[80%] lg:w-[60%] xl:w-[50%] mx-auto shadow-xl mt-4 sm:mt-8 py-8"
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
>
  <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8 text-gray-900 text-center">
    Register Organization
  </h2>

  <form className="space-y-5 sm:space-y-6">
    {/* ✅ Organization Name */}
    <div>
      <label className="block font-medium text-gray-900 mb-1">Organization Name</label>
      <input
        type="text"
        placeholder="Organization name"
        className="w-full p-2.5 sm:p-3 border rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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

    {/* ✅ Organization Email */}
    <div>
      <label className="block font-medium text-gray-900 mb-1">Organization Email</label>
      <input
        type="email"
        placeholder="Organization email"
        className="w-full p-2.5 sm:p-3 border rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        value={organizationEmail}
        onChange={handleOrganizationEmailChange}
      />
      {errors.organizationEmail && (
        <p className="text-red-500 text-sm mt-1">{errors.organizationEmail}</p>
      )}
    </div>

    {/* ✅ Website */}
    <div>
      <label className="block font-medium text-gray-900 mb-1">Website</label>
      <input
        type="url"
        placeholder="Organization website"
        className="w-full p-2.5 sm:p-3 border rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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

    {/* ✅ Description */}
    <div>
      <label className="block font-medium text-gray-900 mb-1">Description</label>
      <textarea
        placeholder="Organization description"
        className="w-full p-2.5 sm:p-3 border rounded-md text-gray-700 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
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

    {/* ✅ Members Section */}
    <div>
      <label className="block font-medium text-gray-900 mb-1">Organization Members</label>

      <div className="flex flex-wrap my-2 gap-2">
        {members.map((member, i) => (
          <div
            key={i}
            className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs sm:text-sm"
          >
            {member}
            <button
              onClick={() => removeMember(i)}
              type="button"
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-2">
        <input
          type="email"
          placeholder="Enter member email"
          className="flex-1 p-2.5 sm:p-3 border rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
        />
        <button
          onClick={addMember}
          type="button"
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm sm:text-base"
        >
          + Add
        </button>
      </div>

      {errors.member && <p className="text-red-500 text-sm mt-1">{errors.member}</p>}
    </div>

    {/* ✅ Buttons */}
    <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-6">
      <button
        type="button"
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
        className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100 text-sm sm:text-base"
      >
        Cancel
      </button>
      <button
        type="button"
        disabled={loading}
        onClick={handleSubmit}
        className={`px-4 py-2 rounded-md text-white text-sm sm:text-base transition ${
          loading
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Creating..." : "Register Organization"}
      </button>
    </div>
  </form>
</motion.div>

{/* Success Popup */}
    {successModalVisible && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Organization Registerd
      </h3>

      {/* Already in another organization */}
      <div>
        <p className="font-medium text-gray-800 mb-1">
          These users are already members of another organization:
        </p>
        <ul className="list-disc list-inside text-gray-700">
          {memberDetailes?.alreadyInOrganization?.length > 0 ? (
            memberDetailes.alreadyInOrganization.map((member, i) => (
              <li key={`already-${i}`}>{member}</li>
            ))
          ) : (
            <li className="text-gray-500 italic">None</li>
          )}
        </ul>
      </div>

      {/* Auto-assigned members */}
      {/* <div>
        <p className="font-medium text-gray-800 mb-1">
          These users are registered in your organization:
        </p>
        <ul className="list-disc list-inside text-gray-700">
          {memberDetailes?.autoAssignedMembers?.length > 0 ? (
            memberDetailes.autoAssignedMembers.map((member, i) => (
              <li key={`auto-${i}`}>{member}</li>
            ))
          ) : (
            <li className="text-gray-500 italic">None</li>
          )}
        </ul>
      </div> */}

      {/* Draft members */}
      <div>
        <p className="font-medium text-gray-800 mb-1">
          These users are non-registered:
        </p>
        <ul className="list-disc list-inside text-gray-700">
          {memberDetailes?.draftMembers?.length > 0 ? (
            memberDetailes.draftMembers.map((member, i) => (
              <li key={`draft-${i}`}>{member}</li>
            ))
          ) : (
            <li className="text-gray-500 italic">None</li>
          )}
        </ul>
      </div>

      {/* OK Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={() => setSuccessModalVisible(false)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          OK
        </button>
      </div>
    </motion.div>
  </div>
)}


    </>
  );
};

export default CreateOrganization;
