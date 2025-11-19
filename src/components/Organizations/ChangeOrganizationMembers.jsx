import { motion } from "framer-motion";
import { useState } from "react";
import {
  getOrganizationByEmail,
  putOrganizationByEmail,
} from "../../utils/api";
import { toast } from "react-toastify";
import { Modal } from "antd"; // Import Ant Design Modal for optional popup

const ChangeOrganizationMembers = () => {
  const [orgSearchEmail, setOrgSearchEmail] = useState("");
  const [findLoading, setFindLoading] = useState(false);
  const [foundOrg, setFoundOrg] = useState(null);
  const [orgMembers, setOrgMembers] = useState([]);
  const [orgDraftMembers, setOrgDraftMembers] = useState([]);
  const [removedMembers, setRemovedMembers] = useState([]);
  const [addedMembers, setAddedMembers] = useState([]);
  const [addMemberInput, setAddMemberInput] = useState("");
  const [sendLoading, setSendLoading] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false); // State for modal popup
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const resetChangeTabState = () => {
    setFoundOrg(null);
    setOrgMembers([]);
    setOrgDraftMembers([]);
    setRemovedMembers([]);
    setAddedMembers([]);
    setAddMemberInput("");
    setOrgSearchEmail("");
  };

  const handleFindOrganization = async () => {
    if (!orgSearchEmail.trim() || !emailRegex.test(orgSearchEmail)) {
      toast.error("Enter a valid Group email to find");
      return;
    }
    try {
      setFindLoading(true);
      const res = await getOrganizationByEmail(orgSearchEmail.trim());
      console.log("API Response:", res);

      const org = res?.organization || res?.data || res || null;
      if (!org || typeof org !== "object") {
        toast.error("Group not found");
        setFoundOrg(null);
        setOrgMembers([]);
        setOrgDraftMembers([]);
        return;
      }

      console.log("Selected Group:", org);
      if (!org.members && !org.draftMembers) {
        console.warn("Group has no members or draftMembers fields");
      }

      console.log(org)
      setFoundOrg({
        companyName: org.companyName || org.name || org.organizationName || "Unknown Group",
        organizationEmail: org.organizationEmail || org.email || orgSearchEmail,
        members: org.members || [],
        draftMembers: org.draftMembers || [],
      });
      setOrgMembers(org.members || []);
      setOrgDraftMembers(org.draftMembers || []);
      setRemovedMembers([]);
      setAddedMembers([]);
    } catch (err) {
      console.error("Error fetching group:", err);
      toast.error("Failed to fetch group");
      setFoundOrg(null);
      setOrgMembers([]);
      setOrgDraftMembers([]);
    } finally {
      setFindLoading(false);
    }
  };

  console.log(foundOrg)

  const toggleRemoveMember = (email) => {
    setRemovedMembers((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const parseEmails = (input) => {
    if (!input) return [];
    return input
      .split(/[\s,;]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  };

  const handleAddMemberToChangeTab = () => {
    const raw = addMemberInput.trim();
    if (!raw) {
      toast.error("Enter at least one email address");
      return;
    }
    const candidates = parseEmails(raw);
    if (candidates.length === 0) {
      toast.error("No valid emails found");
      return;
    }
    const invalid = [];
    const duplicates = [];
    const toAdd = [];
    candidates.forEach((email) => {
      if (!emailRegex.test(email)) {
        invalid.push(email);
      } else {
        const already =
          orgMembers.includes(email) ||
          orgDraftMembers.includes(email) ||
          addedMembers.includes(email);
        if (already) duplicates.push(email);
        else toAdd.push(email);
      }
    });
    if (invalid.length > 0) {
      toast.error(`Invalid email(s): ${invalid.join(", ")}`);
    }
    if (duplicates.length > 0) {
      toast.info(`Already present (skipped): ${duplicates.join(", ")}`);
    }
    if (toAdd.length > 0) {
      const uniqueToAdd = [...new Set(toAdd)];
      setAddedMembers((p) => [...p, ...uniqueToAdd]);
    }
    setAddMemberInput("");
  };

  const removeAddedMember = (email) => {
    setAddedMembers((p) => p.filter((e) => e !== email));
  };

  const handleRemoveFromPreview = (email) => {
    if (addedMembers.includes(email)) {
      removeAddedMember(email);
      return;
    }
    toggleRemoveMember(email);
  };

  

  const sendChangeMembersRequest = async () => {
    if (!foundOrg) return toast.error("Find a group first");
    if (addedMembers.length === 0 && removedMembers.length === 0) {
      return toast.error("No changes to send");
    }
    try {
      setSendLoading(true);
      const payload = {
        addMembers: addedMembers,
        removeMembers: removedMembers,
      };
      console.log("Sending payload:", payload);
      console.log(foundOrg.organizationEmail)
      console.log(orgSearchEmail)
      const res = await putOrganizationByEmail(
         orgSearchEmail,
        // payload
        addedMembers
      );

      console.log("already exist member",res)

      // Prepare detailed notification message
      let notificationMessage = "Group members updated successfully.";
      if (addedMembers.length > 0) {
        notificationMessage += `\nAdded: ${addedMembers.join(", ")}`;
      }
      if (removedMembers.length > 0) {
        notificationMessage += `\nRemoved: ${removedMembers.join(", ")}`;
      }

      // Option 1: Show detailed toast notification
      toast.success("Changes Request Sent to Admin Successfully", {
        autoClose: 5000, // Keep toast visible longer to read details
        style: { whiteSpace: "pre-line" }, // Allow line breaks in toast
      });

      // Option 2: Show modal popup (uncomment to use instead of toast)
      /*
      setShowNotificationModal(true);
      setTimeout(() => setShowNotificationModal(false), 5000); // Auto-close modal after 5 seconds
      */

      const updated = res?.organization || res?.data || null;
      if (updated) {
        setOrgMembers(updated.members || []);
        setOrgDraftMembers(updated.draftMembers || []);
        setAddedMembers([]);
        setRemovedMembers([]);
      } else {
        setAddedMembers([]);
        setRemovedMembers([]);
      }
    } catch (err) {
      console.error("Error sending change request:", err);
      toast.error("Failed to send change request");
    } finally {
      setSendLoading(false);
    }
  };
 console.log(orgMembers)
 const orgMembersEmail = []
 orgMembers.map((member)=>orgDraftMembers.push(member.email))

 console.log(addedMembers)
 console.log(removedMembers)
 console.log(orgMembersEmail)

 const finalPreview = [...new Set([
  ...orgMembersEmail.filter(m => !removedMembers.includes(m)),
  ...orgDraftMembers.filter(m => !removedMembers.includes(m)),
  ...addedMembers
])];

  return (
    <>
      {/* Optional Modal for Notification Popup */}
      <Modal
        open={showNotificationModal}
        onCancel={() => setShowNotificationModal(false)}
        footer={null}
        title="Group Members Updated"
        destroyOnClose
      >
        <div className="space-y-4">
          <p className="text-gray-700">The following changes have been requested:</p>
          {addedMembers.length > 0 && (
            <div>
              <p className="font-semibold text-green-700">Added Members:</p>
              <ul className="list-disc pl-5">
                {addedMembers.map((email) => (
                  <li key={email} className="text-gray-600">{email}</li>
                ))}
              </ul>
            </div>
          )}
          {removedMembers.length > 0 && (
            <div>
              <p className="font-semibold text-red-700">Removed Members:</p>
              <ul className="list-disc pl-5">
                {removedMembers.map((email) => (
                  <li key={email} className="text-gray-600">{email}</li>
                ))}
              </ul>
            </div>
          )}
          {(addedMembers.length === 0 && removedMembers.length === 0) && (
            <p className="text-gray-500 italic">No changes were made.</p>
          )}
        </div>
      </Modal>

      <motion.div
        className="bg-white p-6 rounded-xl w-[95%] md:w-[80%] lg:w-[60%] mx-auto shadow-xl mt-6 overflow-y-auto min-h-[75vh] mb-10"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-semibold mb-4">Find Group by Email</h3>
        <div className="flex gap-2 mb-6">
          <input
            type="email"
            placeholder="group@example.com"
            className="flex-1 p-2.5 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={orgSearchEmail}
            onChange={(e) => setOrgSearchEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleFindOrganization();
              }
            }}
          />
          <button
            onClick={handleFindOrganization}
            disabled={findLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
          >
            {findLoading ? "Finding..." : "Find"}
          </button>
          <button
            onClick={resetChangeTabState}
            className="px-3 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
          >
            Reset
          </button>
        </div>
        {foundOrg ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-gray-900">
                  {foundOrg.companyName || "Unknown Group"}
                </h4>
                <p className="text-sm text-gray-500">
                  {foundOrg.organizationEmail || orgSearchEmail}
                </p>
              </div>
              <div className="text-sm font-medium text-gray-700">
                Members: {finalPreview.length}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-2">
                Previewed Members ({finalPreview.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {finalPreview.length > 0 ? (
                  finalPreview.map((m, index) => {
                    const isAdded = addedMembers.includes(m);
                    const isDraft = orgDraftMembers.includes(m);
                    const flagged = !isAdded && removedMembers.includes(m);
                    return (
                      <div
                        key={`${m}-${index}`}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition ${
                          isAdded
                            ? "bg-green-50 text-green-800"
                            : flagged
                            ? "bg-red-100 text-red-700 line-through"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {isAdded ? (
                          <span className="text-green-600">+</span>
                        ) : isDraft ? (
                          <span className="text-yellow-700">☆</span>
                        ) : null}
                        <span className="max-w-xs truncate">{m}</span>
                        <button
                          onClick={() => handleRemoveFromPreview(m)}
                          type="button"
                          className="ml-1 text-xs px-1 hover:text-red-600"
                          aria-label={`Remove ${m}`}
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-gray-500 italic">
                    No members in preview
                  </p>
                )}
              </div>
            </div>
            <div className="border-t pt-4">
              <p className="text-sm font-semibold text-gray-900 mb-3">
                Add New Member(s)
              </p>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Enter one or multiple emails (comma/space/semicolon separated)"
                  className="flex-1 p-2.5 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                  value={addMemberInput}
                  onChange={(e) => setAddMemberInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddMemberToChangeTab();
                    }
                  }}
                />
                <button
                  onClick={handleAddMemberToChangeTab}
                  type="button"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Add
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t pt-4">
              <button
                onClick={resetChangeTabState}
                type="button"
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={sendChangeMembersRequest}
                disabled={
                  sendLoading ||
                  (addedMembers.length === 0 && removedMembers.length === 0)
                }
                type="button"
                className={`px-4 py-2 rounded-md text-white transition ${
                  sendLoading ||
                  (addedMembers.length === 0 && removedMembers.length === 0)
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {sendLoading ? "Sending..." : "Send Request"}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">No Group selected.</p>
            <p className="text-xs text-gray-400 mt-1">
              Enter a group email above and click "Find" to get started.
            </p>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default ChangeOrganizationMembers;