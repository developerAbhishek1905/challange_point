import { motion } from "framer-motion";
import { useState } from "react";
import { getOrganizationByEmail, addMember } from "../../utils/api";
import { toast } from "react-toastify";
import { Modal } from "antd";
import { Search, Users, Send, RefreshCw, CheckCircle2 } from "lucide-react";

const AddMembersToOrganization = () => {
  const [orgSearchEmail, setOrgSearchEmail] = useState("");
  const [findLoading, setFindLoading] = useState(false);
  const [foundOrg, setFoundOrg] = useState();
  const [orgId, setOrgId] = useState(null);
  const [currentMembers, setCurrentMembers] = useState([]);
  const [addMemberInput, setAddMemberInput] = useState("");
  const [pendingToAdd, setPendingToAdd] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleFindOrganization = async () => {
    if (!orgSearchEmail?.trim() || !emailRegex.test(orgSearchEmail)) {
        setFoundOrg(null);
      return toast.error("Please enter a valid group email");
    }

    try {
      setFindLoading(true);
      const res = await getOrganizationByEmail(orgSearchEmail.trim());
      const org = res?.organization || res?.data || res;

      if (!org?._id) {
        toast.error("Group not found");
        setFoundOrg(null);
        setOrgId(null);
        setCurrentMembers([]);
        return;
      }

      setOrgId(org._id);
      setFoundOrg({
        companyName: org.companyName || org.name || "Unknown Group",
        organizationEmail: org.organizationEmail || org.email || orgSearchEmail,
      });

      const membersList = [
        ...(org.members || []),
        ...(org.draftMembers || []),
        ...(org.pendingMembers || []),
      ];

      const allEmails = membersList
        .map((m) => (typeof m === "string" ? m : m.email || m.user?.email))
        .filter((email) => email && emailRegex.test(email))
        .map((email) => email.toLowerCase());

      setCurrentMembers(allEmails);
      toast.success("Group found!");
    } catch (err) {
        setFoundOrg(null);
      toast.error(err?.response?.data?.message || "Failed to find group");
      
      setOrgId(null);
      setCurrentMembers([]);
    } finally {
      setFindLoading(false);
    }
  };

  console.log(foundOrg)

  const parseEmails = (input) =>
    input
      .split(/[\s,;]+/)
      .map((s) => s.trim())
      .filter((s) => s && emailRegex.test(s))
      .map((email) => email.toLowerCase());

  const handleAddMember = () => {
    const emails = parseEmails(addMemberInput);
    if (emails.length === 0) return toast.error("No valid emails found");

    const duplicates = emails.filter((e) => currentMembers.includes(e));
    const newOnes = emails.filter((e) => !currentMembers.includes(e));

    if (duplicates.length > 0) {
      toast.info(`${duplicates.length} email(s) already in group (skipped)`);
    }

    if (newOnes.length === 0) {
      setAddMemberInput("");
      return toast.info("No new members to add");
    }

    setPendingToAdd(newOnes);
    setShowConfirmModal(true);
    setAddMemberInput("");
  };

  const confirmAddMembers = async () => {
    if (!orgId || pendingToAdd.length === 0) return;

    try {
      setSendLoading(true);
      const res = await addMember(orgId, pendingToAdd);
      toast.success(res?.message || `${pendingToAdd.length} member(s) added!`);

      setCurrentMembers((prev) => [...prev, ...pendingToAdd]);
      setPendingToAdd([]);
      setShowConfirmModal(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add members");
    } finally {
      setSendLoading(false);
    }
  };

  const resetForm = () => {
    setOrgSearchEmail("");
    setFoundOrg();
    setOrgId(null);
    setCurrentMembers([]);
    setAddMemberInput("");
    setPendingToAdd([]);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen py-8 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Add Members to Group
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              Search by group email and invite new members instantly
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 sm:p-8 lg:p-10">
              {/* Search Section */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold  text-gray-700 mb-3">
                    <Search className="inline w-5 h-5 mr-2 text-teal-600" />
                    Search Group by Email
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      placeholder="team@company.com"
                      className="flex-1 px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition text-base"
                      value={orgSearchEmail}
                      onChange={(e) => setOrgSearchEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleFindOrganization()}
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={handleFindOrganization}
                        disabled={findLoading}
                        className="px-6 py-4 bg-teal-600 text-white rounded-xl hover:bg-teal-700 disabled:bg-teal-400 transition font-medium flex items-center gap-2 whitespace-nowrap"
                      >
                        {findLoading ? "Searching..." : "Find Group"}
                      </button>
                      <button
                        onClick={resetForm}
                        className="px-5 py-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition flex items-center gap-2"
                      >
                        <RefreshCw size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Found Organization */}
                {foundOrg && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-r from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-2xl p-6"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-teal-600 text-white p-4 rounded-full">
                        <Users size={28} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {foundOrg.companyName}
                        </h3>
                        <p className="text-teal-700 font-medium">
                          {foundOrg.organizationEmail}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Add Members Input */}
                {foundOrg && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <label className="block text-sm font-semibold text-gray-700">
                      Add New Members
                    </label>
                    <textarea
                      rows={4}
                      placeholder="john@example.com, jane@company.org; bob.work@gmail.com (comma, space, or new line)"
                      className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none text-base"
                      value={addMemberInput}
                      onChange={(e) => setAddMemberInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleAddMember())}
                    />
                    <button
                      onClick={handleAddMember}
                      className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl hover:from-teal-700 hover:to-cyan-700 transition font-semibold flex items-center justify-center gap-3 shadow-lg"
                    >
                      <Send size={20} />
                      Add Members ({parseEmails(addMemberInput).filter(e => !currentMembers.includes(e)).length} new)
                    </button>
                  </motion.div>
                )}

                {/* No Group Found */}
                {foundOrg===null && orgSearchEmail && !findLoading && (
                  <div className="text-center py-16 text-gray-500">
                    <Users size={64} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-xl">No group found</p>
                    <p className="text-sm mt-2">Try searching with the correct group email address</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Confirmation Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-teal-600" size={24} />
            <span className="text-xl font-semibold">Confirm Member Invitations</span>
          </div>
        }
        open={showConfirmModal}
        onCancel={() => setShowConfirmModal(false)}
        footer={null}
        width={520}
        centered
      >
        <div className="py-6">
          <p className="text-gray-700 text-lg mb-6">
            Send invitation to <strong>{pendingToAdd.length}</strong> new member(s)?
          </p>
          <div className="bg-gray-50 rounded-xl p-5 max-h-64 overflow-y-auto border">
            {pendingToAdd.map((email) => (
              <div key={email} className="flex items-center gap-3 py-2 text-gray-800">
                <CheckCircle2 className="text-teal-600" size={20} />
                <span className="font-medium">{email}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={confirmAddMembers}
              disabled={sendLoading}
              className="px-8 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl hover:from-teal-700 hover:to-cyan-700 disabled:opacity-70 transition font-medium flex items-center gap-2"
            >
              {sendLoading ? "Sending..." : "Send Invitations"}
              <Send size={18} />
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddMembersToOrganization;