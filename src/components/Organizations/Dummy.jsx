import { motion } from "framer-motion";
import { useState } from "react";
import { createOrganization } from "../../utils/api";
import { toast } from "react-toastify";
import { Modal } from "antd";
import { Building2, Mail, Globe, Users, CheckCircle2, AlertCircle, Plus, X } from "lucide-react";

const RegisterOrganization = () => {
  const [companyName, setCompanyName] = useState("");
  const [organizationEmail, setOrganizationEmail] = useState("");
  const [organizationWebsite, setOrganizationWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [leaders, setLeaders] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [memberDetails, setMemberDetails] = useState(null);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const websiteRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[^\s]*)?$/i;

  const extractDomain = (email) => {
    if (!email) return "";
    const atIndex = email.lastIndexOf("@");
    if (atIndex === -1) return "";
    return email.slice(atIndex + 1).split(/[\/?#\s]/)[0].replace(/^www\./, "");
  };

  const handleOrganizationEmailChange = (e) => {
    const value = e?.target?.value ?? "";
    setOrganizationEmail(value);
    setErrors(prev => ({ ...prev, organizationEmail: "" }));

    // only auto-fill when the email is a valid full email
    if (!emailRegex.test(value)) return;

    const domain = extractDomain(value);
    if (!domain) return;

    const cleanDomain = domain.replace(/^www\./, "").toLowerCase();
    const suggested = `www.${cleanDomain}`;

    const currentWebsite = (organizationWebsite ?? "").toLowerCase().trim();

    // Auto-fill only when website is empty or already looks like an auto-suggestion
    const looksAutoFilled =
      !currentWebsite ||
      currentWebsite === "www." ||
      (currentWebsite.startsWith("www.") && currentWebsite.length <= 8) ||
      currentWebsite.includes(cleanDomain);

    if (looksAutoFilled) {
      setOrganizationWebsite(suggested);
    }
  };

  const addMember = () => {
    if (!emailInput.trim()) return;

    const emails = emailInput.trim().split(/[\s,]+/).map(e => e.trim()).filter(Boolean);
    const invalid = [];
    const duplicates = [];
    const validNew = [];

    emails.forEach(email => {
      if (!emailRegex.test(email)) invalid.push(email);
      else if (leaders.includes(email.toLowerCase())) duplicates.push(email);
      else validNew.push(email.toLowerCase());
    });

    if (invalid.length > 0) {
      setErrors({ member: `Invalid emails: ${invalid.join(", ")}` });
      return;
    }
    if (duplicates.length > 0) {
      toast.info(`Already added: ${duplicates.join(", ")}`);
    }

    if (validNew.length > 0) {
      setLeaders(prev => [...prev, ...validNew]);
      setEmailInput("");
      setErrors(prev => ({ ...prev, member: "" }));
    }
  };

  const removeMember = (email) => {
    setLeaders(prev => prev.filter(e => e !== email));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!companyName.trim()) newErrors.companyName = "Group name is required";
    if (!organizationEmail.trim()) newErrors.organizationEmail = "Group email is required";
    else if (!emailRegex.test(organizationEmail)) newErrors.organizationEmail = "Invalid email format";

    if (!organizationWebsite.trim()) newErrors.organizationWebsite = "Website is required";
    else if (!websiteRegex.test(organizationWebsite)) newErrors.organizationWebsite = "Invalid website URL";

    if (!description.trim()) newErrors.description = "Description is required";
    if (leaders.length === 0) newErrors.member = "Add at least one member";

    const emailDomain = extractDomain(organizationEmail);
    const websiteDomain = organizationWebsite.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];

    if (emailDomain && websiteDomain && !websiteDomain.endsWith(emailDomain)) {
      newErrors.organizationWebsite = "Website domain must match email domain";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix all errors before submitting");
      return;
    }

    const payload = {
      companyName,
      organizationEmail: organizationEmail.toLowerCase(),
      organizationWebsite,
      description,
      leaders,
    };

    try {
      setLoading(true);
      const res = await createOrganization(payload);
      setMemberDetails(res?.membersStatus || res);
      toast.success("Group registered successfully!");
      setSuccessModalVisible(true);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to register group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen  py-12 px-4"
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Register New Group
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Create your organization and invite team members
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="p-8 md:p-12">
              <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                {/* Group Name */}
                <div>
                  <label className="flex items-center gap-3 text-lg font-semibold text-gray-800 mb-3">
                    <Building2 className="text-teal-600" size={24} />
                    Group Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Green Earth Warriors"
                    className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-teal-500 focus:ring-4 focus:ring-teal-100 outline-none transition"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                  {errors.companyName && <p className="mt-2 text-red-600 flex items-center gap-2"><AlertCircle size={18} /> {errors.companyName}</p>}
                </div>

                {/* Group Email */}
                <div>
                  <label className="flex items-center gap-3 text-lg font-semibold text-gray-800 mb-3">
                    <Mail className="text-teal-600" size={24} />
                    Group Email
                  </label>
                  <input
                    type="email"
                    placeholder="contact@greenerath.org"
                    className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-teal-500 focus:ring-4 focus:ring-teal-100 outline-none transition"
                    value={organizationEmail}
                    onChange={handleOrganizationEmailChange}
                  />
                  {errors.organizationEmail && <p className="mt-2 text-red-600 flex items-center gap-2"><AlertCircle size={18} /> {errors.organizationEmail}</p>}
                </div>

                {/* Website */}
                <div>
                  <label className="flex items-center gap-3 text-lg font-semibold text-gray-800 mb-3">
                    <Globe className="text-teal-600" size={24} />
                    Website
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.greenerath.org"
                    className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-teal-500 focus:ring-4 focus:ring-teal-100 outline-none transition"
                    value={organizationWebsite}
                    onChange={(e) => setOrganizationWebsite(e.target.value)}
                  />
                  {errors.organizationWebsite && <p className="mt-2 text-red-600 flex items-center gap-2"><AlertCircle size={18} /> {errors.organizationWebsite}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="flex items-center gap-3 text-lg font-semibold text-gray-800 mb-3">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your group's mission..."
                    className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-teal-500 focus:ring-4 focus:ring-teal-100 outline-none resize-none transition"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  {errors.description && <p className="mt-2 text-red-600 flex items-center gap-2"><AlertCircle size={18} /> {errors.description}</p>}
                </div>

                {/* Members */}
                <div>
                  <label className="flex items-center gap-3 text-lg font-semibold text-gray-800 mb-4">
                    <Users className="text-teal-600" size={24} />
                    Group Members ({leaders.length})
                  </label>

                  {leaders.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-5">
                      {leaders.map((email) => (
                        <motion.div
                          key={email}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="flex items-center gap-2 bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-800 px-4 py-2.5 rounded-full font-medium shadow-sm border border-teal-200"
                        >
                          {email}
                          <button
                            onClick={() => removeMember(email)}
                            className="ml-2 hover:bg-white/50 rounded-full p-1 transition"
                          >
                            <X size={16} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <input
                      type="email"
                      placeholder="member@example.com (press Enter or click Add)"
                      className="flex-1 px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-teal-500 focus:ring-4 focus:ring-teal-100 outline-none transition"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addMember())}
                    />
                    <button
                      type="button"
                      onClick={addMember}
                      className="px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-2xl hover:from-teal-700 hover:to-cyan-700 transition font-semibold shadow-lg flex items-center gap-3"
                    >
                      <Plus size={22} />
                      Add
                    </button>
                  </div>
                  {errors.member && <p className="mt-3 text-red-600 flex items-center gap-2"><AlertCircle size={18} /> {errors.member}</p>}
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setCompanyName(""); setOrganizationEmail(""); setOrganizationWebsite(""); setDescription(""); setLeaders([]); setEmailInput("");
                    }}
                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-10 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-2xl hover:from-teal-700 hover:to-cyan-700 disabled:opacity-70 transition font-bold text-lg shadow-xl flex items-center gap-3"
                  >
                    {loading ? "Creating Group..." : "Register Group"}
                    <CheckCircle2 size={22} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Success Modal */}
      <Modal
        open={successModalVisible}
        onCancel={() => setSuccessModalVisible(false)}
        footer={null}
        width={600}
        centered
        title={
          <div className="flex items-center gap-3 text-2xl font-bold text-teal-700">
            <CheckCircle2 size={32} />
            Group Created Successfully!
          </div>
        }
      >
        <div className="py-6 space-y-6">
          {memberDetails?.alreadyInOrganization?.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
              <p className="font-semibold text-orange-900 mb-3">Already in another group:</p>
              <div className="space-y-2">
                {memberDetails.alreadyInOrganization.map((email, i) => (
                  <div key={i} className="flex items-center gap-3 text-orange-800">
                    <AlertCircle size={18} />
                    <span className="font-medium">{email}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {memberDetails?.draftMembers?.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <p className="font-semibold text-blue-900 mb-3">Invited (new users):</p>
              <div className="space-y-2">
                {memberDetails.draftMembers.map((email, i) => (
                  <div key={i} className="flex items-center gap-3 text-blue-800">
                    <Mail size={18} />
                    <span className="font-medium">{email}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center pt-4">
            <button
              onClick={() => setSuccessModalVisible(false)}
              className="px-10 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-2xl hover:from-teal-700 hover:to-cyan-700 transition font-bold text-lg shadow-lg"
            >
              Done
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default RegisterOrganization;