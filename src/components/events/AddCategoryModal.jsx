import { motion } from "framer-motion";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { createCategory } from "../../Redux/API/API";
import { DatePicker, Select, TimePicker } from "antd";
import dayjs from "dayjs";
import { toast } from "react-toastify";


const AddCategoryModal = ({ isOpen, onClose, onCategoryCreated }) => {
  const [categoryCode, setCategoryCode] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [date, setDate] = useState('');
  const [winnerTotal, setWinnerTotal] = useState('');
  const [standBy, setStandBy] = useState('');
  const [gender, setGender] = useState('');
  const [startTime, setStartTime] = useState('');
  const [cutOffTime, setCutOffTime] = useState('');
   const [errors, setErrors] = useState({});

  const dispatch = useDispatch();

  const resetFormFields = () => {
    setCategoryName("");
    setCategoryCode("");
    setDate("");
    setWinnerTotal("");
    setStandBy("");
    setGender("");
    setStartTime("");
    setCutOffTime("");
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!categoryName.trim()) newErrors.categoryName = "Category name is required";
    if (!categoryCode.trim()) newErrors.categoryCode = "Category code is required";
    if (!date) newErrors.date = "Date is required";
    if (!winnerTotal.trim()) newErrors.winnerTotal = "Winners total is required";
    if (!standBy.trim()) newErrors.standBy = "StandBy winner total is required";
    if (!gender) newErrors.gender = "Gender is required";
    if (!startTime) newErrors.startTime = "Start time is required";
    if (!cutOffTime) newErrors.cutOffTime = "Cut off time is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    const data = {
      category_name: categoryName,
      category_code: categoryCode,
      date,
      winner_total: winnerTotal,
      standbywinner_total: standBy,
      gender: gender,
      start_time: startTime,
      cutoff_time: cutOffTime,
      status: true
    };
    
    try {
      const response = await dispatch(createCategory(data));
      console.log(response, 'category created')
      if (response.payload.status === 201) {
      toast.success(response?.payload?.data?.message)

        // alert("Category created successfully");
        
        // Pass the newly created category back to the parent component
        if (onCategoryCreated && response.payload.data) {
          onCategoryCreated(response?.payload?.data?.data);
        }
        
        handleModalClose();
      }
    } catch (error) {
            toast.error(response?.payload?.data?.message)

    }

  };

  const handleModalClose = () => {
    resetFormFields();
    onClose();
  };

  if (!isOpen) return null;

  const clearError = (field) => {
  setErrors((prev) => ({ ...prev, [field]: undefined }));
};

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-40"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        className="bg-white p-6 rounded-xl w-full max-w-xl shadow-xl"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Create Category
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-900">
              Category name
            </label>
            <input
              type="text"
              placeholder="Category name"
              className="w-full mt-1 p-2 border rounded-md text-gray-600"
              value={categoryName}
              onChange={(e) => {setCategoryName(e.target.value);clearError("categoryName");}}
            />
            {errors.categoryName && (
              <div className="text-red-500 text-xs mt-1">{errors.categoryName}</div>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-900">
              Category code
            </label>
            <input
              type="text"
              placeholder="Category code"
              className="w-full mt-1 p-2 border rounded-md text-gray-600"
              value={categoryCode}
              onChange={(e) => {setCategoryCode(e.target.value); clearError("categoryCode");}}
            />
            {errors.categoryCode && (
              <div className="text-red-500 text-xs mt-1">{errors.categoryCode}</div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-900">
                Date
              </label>
              <div className="relative mt-1 text-gray-900">
              <DatePicker value={date} onChange={(date) => {setDate(date);  clearError("date");}} className="w-full p-2 pr-10 border rounded-md text-gray-600" disabledDate={(current) => {
    // Disable dates before today
    return current && current < dayjs().startOf('day');
  }}/>
              </div>
              {errors.date && (
                <div className="text-red-500 text-xs mt-1">{errors.date}</div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-900">
                Winners Total
              </label>
              <div className="relative mt-1">
                <input
                  type="number"
                  className="w-full p-2 pr-10 border rounded-md text-gray-600"
                  value={winnerTotal}
                  onChange={(e) => {setWinnerTotal(e.target.value); clearError("winnerTotal");}}
                  min={1}
                />
              </div>
              {errors.winnerTotal && (
                <div className="text-red-500 text-xs mt-1">{errors.winnerTotal}</div>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-900">
              StandBy Winner Total
            </label>
            <input
              type="number"
              placeholder="StandBy Winner Total"
              className="w-full mt-1 p-2 border rounded-md text-gray-500"
              value={standBy}
              min={1}
              onChange={(e) => {setStandBy(e.target.value); clearError("standBy");}}
            />
             {errors.standBy && (
              <div className="text-red-500 text-xs mt-1">{errors.standBy}</div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-900">
              Gender
            </label>
            <Select
    placeholder="Select gender"
    value={gender || undefined}
    onChange={(value) => {setGender(value); clearError("gender");}}
    allowClear
    className="w-full"
    dropdownClassName="custom-dropdown"
    style={{
      height: '38px',
      borderRadius: '6px',
    }}
  >
    <Select.Option value="male">Male</Select.Option>
    <Select.Option value="female">Female</Select.Option>
    <Select.Option value="other">Other</Select.Option>
  </Select>
  {errors.gender && (
              <div className="text-red-500 text-xs mt-1">{errors.gender}</div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-900">
              Start Time
            </label>
           <TimePicker use12Hours format="h:mm A"  value={startTime} onChange={(time) => {setStartTime(time); clearError("startTime");}} className="w-full p-2 pr-10 border rounded-md text-gray-600" />
 {errors.startTime && (
              <div className="text-red-500 text-xs mt-1">{errors.startTime}</div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-900">
              Cut Off Time
            </label>
            <TimePicker use12Hours format="h:mm A"  value={cutOffTime} onChange={(time) => {setCutOffTime(time); clearError("cutOffTime");}} className="w-full p-2 pr-10 border rounded-md text-gray-600" />
{errors.cutOffTime && (
              <div className="text-red-500 text-xs mt-1">{errors.cutOffTime}</div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={handleModalClose}
              className="px-4 py-2 rounded-md border text-gray-700"
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleSubmit}
            >
              Create Category
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AddCategoryModal;