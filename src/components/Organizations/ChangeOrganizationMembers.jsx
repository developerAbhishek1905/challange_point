import { motion } from "framer-motion";
import { useState } from "react";
import {
  getOrganizationByEmail,
  putOrganizationByEmail,
} from "../../utils/api";
import { toast } from "react-toastify";
import { Modal, Tabs } from "antd";

const ChangeOrganizationMembers = () => {
  const [orgSearchEmail, setOrgSearchEmail] = useState("");
  const [findLoading, setFindLoading] = useState(false);
  const [foundOrg, setFoundOrg] = useState(null);
  const [orgMembers, setOrgMembers] = useState([]);
  const [orgDraftMembers, setOrgDraftMembers] = useState([]);
  const [removedMembers, setRemovedMembers] = useState([]);
  const [addedMembers, setAddedMembers] = useState([]);
  
  // Separate inputs for add and remove tabs
  const [addMemberInput, setAddMemberInput] = useState("");
  const [removeMemberInput, setRemoveMemberInput] = useState("");
  const [activeTab, setActiveTab] = useState("add"); // 'add' | 'remove'
  
  const [sendLoading, setSendLoading] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const resetChangeTabState = () => {
    setFoundOrg(null);
    setOrgMembers([]);
    setOrgDraftMembers([]);
    setRemovedMembers([]);
    setAddedMembers([]);
    setAddMemberInput("");
    setRemoveMemberInput("");
    setOrgSearchEmail("");
    setActiveTab("add");
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

  const parseEmails = (input) => {
    if (!input) return [];
    return input
      .split(/[\s,;]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  };

  // ✅ ADD MEMBERS TAB
  const handleAddMember = () => {
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
      toast.success(`${uniqueToAdd.length} member(s) added to queue`);
    }

    setAddMemberInput("");
  };

  const removeAddedMember = (email) => {
    setAddedMembers((p) => p.filter((e) => e !== email));
  };

  // ✅ REMOVE MEMBERS TAB
  const handleRemoveMember = () => {
    const raw = removeMemberInput.trim();
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
    const notFound = [];
    const toRemove = [];
    const allCurrentMembers = [...orgMembers, ...orgDraftMembers];

    candidates.forEach((email) => {
      if (!emailRegex.test(email)) {
        invalid.push(email);
      } else if (!allCurrentMembers.includes(email)) {
        notFound.push(email);
      } else if (!removedMembers.includes(email)) {
        toRemove.push(email);
      }
    });

    if (invalid.length > 0) {
      toast.error(`Invalid email(s): ${invalid.join(", ")}`);
    }

    if (notFound.length > 0) {
      toast.warning(`Not found in group: ${notFound.join(", ")}`);
    }

    if (toRemove.length > 0) {
      setRemovedMembers((prev) => [...prev, ...toRemove]);
      toast.success(`${toRemove.length} member(s) marked for removal`);
    }

    setRemoveMemberInput("");
  };

  const undoRemoveMember = (email) => {
    setRemovedMembers((prev) => prev.filter((e) => e !== email));
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

      const res = await putOrganizationByEmail(orgSearchEmail, addedMembers);

      console.log("Response:", res);

      toast.success("Changes Request Sent to Admin Successfully", {
        autoClose: 5000,
        style: { whiteSpace: "pre-line" },
      });

      const updated = res?.organization || res?.data || null;
      if (updated) {
        setOrgMembers(updated.members || []);
        setOrgDraftMembers(updated.draftMembers || []);
      }

      setAddedMembers([]);
      setRemovedMembers([]);
    } catch (err) {
      console.error("Error sending change request:", err);
      toast.error("Failed to send change request");
    } finally {
      setSendLoading(false);
    }
  };

  const allCurrentMembers = [...orgMembers, ...orgDraftMembers];
  const finalPreview = [
    ...allCurrentMembers.filter((m) => !removedMembers.includes(m)),
    ...addedMembers,
  ];

  return (
    <>
      <motion.div
        className="bg-white p-6 rounded-xl w-[95%] md:w-[80%] lg:w-[60%] mx-auto shadow-xl mt-6 overflow-y-auto min-h-[75vh] mb-10"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-semibold mb-4">Manage Group Members</h3>

        {/* Search Bar */}
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
            {/* Group Info */}
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

            {/* TABS */}
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={[
                {
                  key: "add",
                  label: `Add Members (${addedMembers.length})`,
                  children: (
                    <div className="space-y-4 mt-4">
                      {/* Add Form */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Add New Member(s)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Enter one or multiple emails (comma/space/semicolon separated)"
                            className="flex-1 p-2.5 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                            value={addMemberInput}
                            onChange={(e) => setAddMemberInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddMember();
                              }
                            }}
                          />
                          <button
                            onClick={handleAddMember}
                            type="button"
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 whitespace-nowrap"
                          >
                            Add
                          </button>
                        </div>
                      </div>

                      {/* Added Members List */}
                      {addedMembers.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <span className="text-green-600 text-lg">+</span>
                            Members to Add ({addedMembers.length})
                          </p>
                          <div className="flex flex-wrap gap-2 p-4 bg-green-50 rounded-lg border border-green-200">
                            {addedMembers.map((m, index) => (
                              <div
                                key={`added-${m}-${index}`}
                                className="flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                              >
                                <span>+</span>
                                <span className="max-w-xs truncate">{m}</span>
                                <button
                                  onClick={() => removeAddedMember(m)}
                                  type="button"
                                  className="ml-1 text-xs hover:text-red-600"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ),
                },
                {
                  key: "remove",
                  label: `Remove Members (${removedMembers.length})`,
                  children: (
                    <div className="space-y-4 mt-4">
                      {/* Current Members Info */}
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm font-semibold text-blue-900 mb-2">
                          Current Members ({allCurrentMembers.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {allCurrentMembers
                            .filter((m) => !removedMembers.includes(m))
                            .map((m, index) => (
                              <span
                                key={`current-${m}-${index}`}
                                className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                              >
                                {m}
                              </span>
                            ))}
                        </div>
                      </div>

                      {/* Remove Form */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Remove Member(s)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Enter emails to remove (comma/space/semicolon separated)"
                            className="flex-1 p-2.5 border rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
                            value={removeMemberInput}
                            onChange={(e) => setRemoveMemberInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleRemoveMember();
                              }
                            }}
                          />
                          <button
                            onClick={handleRemoveMember}
                            type="button"
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 whitespace-nowrap"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Removed Members List */}
                      {removedMembers.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <span className="text-red-600 text-lg">−</span>
                            Members to Remove ({removedMembers.length})
                          </p>
                          <div className="flex flex-wrap gap-2 p-4 bg-red-50 rounded-lg border border-red-200">
                            {removedMembers.map((m, index) => (
                              <div
                                key={`removed-${m}-${index}`}
                                className="flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-red-100 text-red-800 line-through"
                              >
                                <span>−</span>
                                <span className="max-w-xs truncate">{m}</span>
                                <button
                                  onClick={() => undoRemoveMember(m)}
                                  type="button"
                                  className="ml-1 text-xs hover:text-green-600"
                                >
                                  ↻
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ),
                },
              ]}
            />

            {/* Preview Section */}
            <div className="border-t pt-4 bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-gray-900 mb-2">
                Final Members Preview ({finalPreview.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {finalPreview.length > 0 ? (
                  finalPreview.map((m, index) => (
                    <span
                      key={`preview-${m}-${index}`}
                      className="px-3 py-1 rounded-full text-xs bg-gray-200 text-gray-800"
                    >
                      {m}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 italic">No members</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
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