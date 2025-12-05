// components/ConfirmationModal.jsx

import { Modal } from "antd";
import { TriangleAlert } from "lucide-react";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, description, confirmText }) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={400}
      destroyOnClose
    >
      <div className="flex flex-col items-center">
        <div className="bg-red-100 rounded-full p-2 mb-4">
          <span className="text-red-600 text-2xl"><TriangleAlert/></span>
        </div>
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
