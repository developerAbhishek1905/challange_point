import { motion } from "framer-motion";
import { useState } from "react";
import { getOrganizationByEmail, removeMember } from "../../utils/api";
import { toast } from "react-toastify";
import { Modal } from "antd";
import { Search, Users, Trash2, RefreshCw, AlertCircle } from "lucide-react";

const RemoveMembersFromOrganization = () => {
  const [orgSearchEmail, setOrgSearchEmail] = useState("");
  const [findLoading, setFindLoading] = useState(false);
  const [foundOrg, setFoundOrg] = useState();
  const [orgId, setOrgId] = useState(null);
  const [currentMembers, setCurrentMembers] = useState([]);
  const [removeInput, setRemoveInput] = useState("");
  const [pendingToRemove, setPendingToRemove] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  console.log(foundOrg)

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

      const allEmails = [...new Set(
        membersList
          .map(m => typeof m === "string" ? m : m?.email || m?.user?.email)
          .filter(email => email && emailRegex.test(email))
          .map(email => email.toLowerCase())
      )];

      setCurrentMembers(allEmails);
      toast.success("Group found!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to find group");
      setFoundOrg(null);
      setOrgId(null);
      setCurrentMembers([]);
    } finally {
      setFindLoading(false);
    }
  };

  const parseEmails = (input) =>
    input
      .split(/[\s,;]+/)
      .map(s => s.trim())
      .filter(s => s && emailRegex.test(s))
      .map(e => e.toLowerCase());

  const handlePrepareRemove = () => {
    const emails = parseEmails(removeInput);
    if (emails.length === 0) return toast.error("No valid emails entered");

    const notInGroup = emails.filter(e => !currentMembers.includes(e));
    const validToRemove = emails.filter(e => currentMembers.includes(e));

    if (notInGroup.length > 0) {
      toast.info(`${notInGroup.length} email(s) not in group (skipped)`);
    }

    if (validToRemove.length === 0) {
      setRemoveInput("");
      return toast.info("No valid members to remove");
    }

    setPendingToRemove(validToRemove);
    setShowConfirmModal(true);
    setRemoveInput("");
  };

  const confirmRemoveMembers = async () => {
    if (!orgId || pendingToRemove.length === 0) return;

    try {
      setSendLoading(true);
      await removeMember(orgId, { emails: pendingToRemove });

      toast.success(`${pendingToRemove.length} member(s) removed successfully!`);

      setCurrentMembers(prev => prev.filter(e => !pendingToRemove.includes(e)));
      setPendingToRemove([]);
      setShowConfirmModal(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to remove members");
    } finally {
      setSendLoading(false);
    }
  };

  const resetForm = () => {
    setOrgSearchEmail("");
    setFoundOrg();
    setOrgId(null);
    setCurrentMembers([]);
    setRemoveInput("");
    setPendingToRemove([]);
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
              Remove Members from Group
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              Search by group email and remove members safely
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 sm:p-8 lg:p-10">
              {/* Search Section */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <Search className="inline w-5 h-5 mr-2 text-red-600" />
                    Search Group by Email
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      placeholder="team@company.com"
                      className="flex-1 px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition text-base"
                      value={orgSearchEmail}
                      onChange={(e) => setOrgSearchEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleFindOrganization()}
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={handleFindOrganization}
                        disabled={findLoading}
                        className="px-6 py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:bg-red-400 transition font-medium flex items-center gap-2 whitespace-nowrap"
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
                    className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-red-600 text-white p-4 rounded-full">
                        <Users size={28} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {foundOrg.companyName}
                        </h3>
                        <p className="text-red-700 font-medium">
                          {foundOrg.organizationEmail}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Remove Members Input */}
                {foundOrg && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <label className="block text-sm font-semibold text-gray-700">
                      Remove Members (comma, space, or new line)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="john@example.com, jane@company.org; bob@gmail.com"
                      className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none text-base"
                      value={removeInput}
                      onChange={(e) => setRemoveInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handlePrepareRemove())}
                    />
                    <button
                      onClick={handlePrepareRemove}
                      className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition font-semibold flex items-center justify-center gap-3 shadow-lg"
                    >
                      <Trash2 size={20} />
                      Remove Members ({parseEmails(removeInput).filter(e => currentMembers.includes(e)).length} valid)
                    </button>
                  </motion.div>
                )}

                {/* Group Not Found */}
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
            <AlertCircle className="text-red-600" size={24} />
            <span className="text-xl font-semibold">Confirm Member Removal</span>
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
            Permanently remove <strong>{pendingToRemove.length}</strong> member(s) from the group?
          </p>
          <div className="bg-red-50 rounded-xl p-5 max-h-64 overflow-y-auto border border-red-200">
            {pendingToRemove.map((email) => (
              <div key={email} className="flex items-center gap-3 py-2 text-gray-800">
                <Trash2 className="text-red-600" size={20} />
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
              onClick={confirmRemoveMembers}
              disabled={sendLoading}
              className="px-8 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 disabled:opacity-70 transition font-medium flex items-center gap-2"
            >
              {sendLoading ? "Removing..." : "Remove Members"}
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default RemoveMembersFromOrganization;