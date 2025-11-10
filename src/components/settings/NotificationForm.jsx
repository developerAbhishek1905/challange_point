import { useState } from "react";
import { postPullNotification } from "../../utils/api";
import { toast } from "react-toastify";

const NotificationForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // ✅ Call your API
      const response = await postPullNotification(formData);

      if (response?.success || response?.status === 200) {
        toast.success("Notification sent successfully!");
        setFormData({ title: "", description: "" });
      } else {
        toast.error("Failed to send notification!");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white shadow-lg rounded-xl p-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        Send Notification
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            name="title"
            placeholder="Enter notification title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Enter notification message"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          } text-white font-semibold rounded-md transition duration-200`}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default NotificationForm;
