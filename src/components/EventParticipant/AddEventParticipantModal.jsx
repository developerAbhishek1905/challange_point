import { useEffect, useState } from "react";
import { Upload as LucideUpload } from "lucide-react";
import { useDispatch } from "react-redux";
import { createParticipant, createResult, EventCategoryList, updateParticipant } from "../../Redux/API/API";
import { useLocation, useParams } from "react-router-dom";
import { Button, Input, InputNumber, Select, Tabs, TimePicker, Upload } from "antd";
import { Image as AntImage } from "antd";
import { XCircle } from "lucide-react";
import { Countries } from "../common/Countries";
import { toast } from "react-toastify";
import dayjs from "dayjs";


const { TabPane } = Tabs;

export default function AddEventParticipantModal({ onClose, participant = null, isEdit = false, onUpdate  }) {
  const [eventDetails, setEventDetails] = useState([]);
  const [firstCategory, setFirstCategory] = useState('');
  const [activeTab, setActiveTab] = useState("1");


  const [firstName,setFirstName] = useState('')
  const [lastName,setLastName] = useState('')
  const [gender,setGender] = useState('')
  const [nationality,setNationality] = useState('')
  const [idNumber,setIDNumber] = useState('')
  const [email,setEmail] = useState('')
  const [phoneNumber,setPhoneNumber] = useState('')
  const [categoryId,setCategoryId] = useState('')
  const [bibNumber,setBibNumber] = useState('')
  const [wave,setWave] = useState('')
  const [registrationId,setRegistrationId] = useState('')
  const [file,setFile] = useState(null)
  // const [eventId, setEventId] = useState('');
const [loading, setLoading] = useState(false);


  const [selectedEventId, setSelectedEventId] = useState(null); // Track selected event
const [categoriesForEvent, setCategoriesForEvent] = useState([]); // Categories of selected event

const [previewImage, setPreviewImage] = useState(null);
const [fileList, setFileList] = useState([]);

const [isResultDeclared, setIsResultDeclared] = useState(false);

const [resultTIme,setResultTime] = useState('');
const [rank, setResultRank] = useState('')
const [remark, setResultRemark] = useState('');
const [resultStatus, setResultStatus] = useState('');


  const { eventName } = useParams();
  const {categoryName} = useParams();
  const dispatch = useDispatch();

  const location = useLocation();
const passedData = location.state || {};

const {
  eventId: passedEventId,
  eventName: passedEventName,
  categoryId: passedCategoryId,
  categoryName: passedCategoryName,
} = passedData;
console.log(passedData,'location data')

 const getCategoriesList = async () => {
  try {
    const response = await dispatch(EventCategoryList({ eventName }));
    console.log(response, 'evCategoryAllResponse');

    const eventList = response?.payload?.data?.data || [];
    setEventDetails(eventList);

    if (eventList.length === 1) {
      const event = eventList[0];
      setSelectedEventId(event._id);
      setCategoriesForEvent(event.category_id || []);

       // Match categoryName from params
      const matchedCategory = event.category_id.find(
        (cat) => cat.category_name.toLowerCase() === categoryName?.toLowerCase()
      );

      if (matchedCategory) {
        setCategoryId(matchedCategory._id);
        setIsResultDeclared(matchedCategory?.is_result_declared || false);
      }
    }

    // setFirstCategory(eventList?.[0]?.category_id?.[0]?._id);
  } catch (error) {
    console.log(error);
  }
};

  useEffect(() => {
    getCategoriesList();
    if (passedEventId) setSelectedEventId(passedEventId);
  if (passedCategoryId) setCategoryId(passedCategoryId);
  }, [eventName]);

useEffect(() => {
  return () => {
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }
  };
}, [previewImage]);

useEffect(() => {
  if (isEdit && participant) {
    setFirstName(participant.first_name || '');
    setLastName(participant.last_name || '');
    setGender(participant.gender || '');
    setNationality(participant.nationality || '');
    setIDNumber(participant.id_number || '');
    setEmail(participant.email || '');
    setPhoneNumber(participant.phone_number || '');
    setCategoryId(participant.category.category_name || '');
    setBibNumber(participant.bib_number || '');
    setWave(participant.wave || '');
    setRegistrationId(participant.registration_id || '');
    setSelectedEventId(participant.event_id || '');

    if (participant.file) {
      const existingImage = `${participant.file}`;
      setPreviewImage(existingImage);
      setFileList([
        {
          uid: '-1',
          name: 'profile.jpg',
          status: 'done',
          url: existingImage,
        },
      ]);
    }

     setResultRemark(participant?.result?.remark || '');
    setResultRank(participant?.result?.ranking || '');
    setResultStatus(participant?.result?.status || '');
    setResultTime(participant?.result?.resultTime ? dayjs(participant.result.resultTime) : null);

  }
}, [isEdit, participant]);

const handleSubmit =async() =>{
     setLoading(true); // Start loader

  const formData = new FormData();
  formData.append('first_name', firstName);
  formData.append('last_name', lastName);
  formData.append('gender', gender);
  formData.append('nationality', nationality);
  formData.append('id_number', idNumber);
  formData.append('email', email);
  formData.append('phone_number', phoneNumber);
  formData.append('category_id', categoryId);
  formData.append('bib_number', bibNumber);
  formData.append('wave', wave);
  formData.append('registration_id', registrationId);
  formData.append('event_id', selectedEventId);

 if (resultTIme) {
  formData.append('resultTime', resultTIme.toISOString()); // to send proper datetime format
}
  formData.append('ranking', rank);
  formData.append('status', resultStatus);
  formData.append('remark', remark);


  if (file) {
    formData.append('file', file);
  }



   // ✅ LOG FORM DATA
  console.log('📝 FormData Contents:');
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }

  try {
   
     const response = await dispatch(createParticipant(formData));
      console.log(response,'create partcipant response')
      if(response.payload?.status === 200){
        toast.success(response?.payload?.data?.message)
      if (onUpdate) onUpdate(); // Optional callback

      }
    

    console.log(response);

  } catch (error) {
   toast.error('failed to create participant')
  } finally {
     setLoading(false);

    onClose();
  }

   // ✅ Only call createResult if any of the result fields have data
//   if (resultTIme || rank || status || remark) {
//     const data = {
//       resultTime: resultTIme,
//       ranking: rank,
//       status: status,
//       remark: remark,
//       event_id: selectedEventId,
//       category_id: categoryId,
//     };

//     try {
//       const response = await dispatch(createResult(data));
//       console.log(response);
//     } catch (error) {
//       console.log(error);
//     }finally{
//       onClose();
//     }

// }
}


const handleEdit = async() =>{
     setLoading(true); // Start loader

  
  const formData = new FormData();
  formData.append('first_name', firstName);
  formData.append('last_name', lastName);
  formData.append('gender', gender);
  formData.append('nationality', nationality);
  formData.append('id_number', idNumber);
  formData.append('email', email);
  formData.append('phone_number', phoneNumber);
  formData.append('category_id', categoryId);
  formData.append('bib_number', bibNumber);
  formData.append('wave', wave);
  formData.append('registration_id', registrationId);
  formData.append('event_id', selectedEventId);
  if (file) {
    formData.append('file', file);
  }
  formData.append('resultTime', resultTIme ? resultTIme.toISOString() : '');

  formData.append('ranking', rank || '');
  formData.append('status', resultStatus || '');
  formData.append('remark', remark || '');

    try {
    const response = await dispatch(updateParticipant({ participantId: participant._id, formData }));
    if (response?.payload?.data?.status === true) {
      toast.success(response?.payload?.data?.message);
      if (onUpdate) onUpdate(); // Optional callback
    } else {
      toast.error(response?.payload?.data?.message);
    }

    console.log(response,'update response');
  } catch (error) {
    toast.error("Error updating participant.");
    console.error(error);
  } finally {
     setLoading(false); // Start loader

    onClose();
  }



}


  const cancel = () => onClose();

  const inputClass = "w-full border border-gray-200 rounded-md px-4 py-2 text-sm bg-gray-50 text-gray-700";
  const labelClass = "text-xs text-gray-500 mb-1";

  const events = eventDetails.map((events)=>({
    label: events.event_name,
   value: events._id,

  }))

  // When event is selected, update the categories
const handleEventChange = (value) => {
  setSelectedEventId(value);
  const selectedEvent = eventDetails.find(event => event._id === value);
  setCategoriesForEvent(selectedEvent?.category_id || []);
   setCategoryId('');
  setIsResultDeclared(false);
};


const handlePreview = (file) => {
  setPreviewImage(URL.createObjectURL(file));
};

const handleChange = ({ fileList: newFileList }) => {
  if (newFileList.length > 0) {
    const newFile = newFileList[0].originFileObj;

    // Always cleanup the old URL
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }

    // Always create a new URL and update state
    const newPreviewUrl = URL.createObjectURL(newFile);
    setFileList(newFileList);
    setFile(newFile);
    setPreviewImage(newPreviewUrl);
  } else {
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }
    setFileList([]);
    setFile(null);
    setPreviewImage(null);
  }
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[600px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">{isEdit && participant?'Edit Participant':'Add Participant'}</h2>

        {/* Ant Design Tabs */}
        <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)} type="line">
          <TabPane tab="Basic Information" key="1">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>First name</label>
                <Input className={inputClass} placeholder="First Name" value={firstName} onChange={(e)=>setFirstName(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Last name</label>
                <Input className={inputClass} placeholder="Last Name" value={lastName} onChange={(e)=>setLastName(e.target.value)}/>
              </div>
              <div>
                <label className={labelClass}>Gender</label>
                 <Select
    placeholder="Select gender"
    value={gender || undefined}
    onChange={(value) => setGender(value)}
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
              </div>
              <div>
                <label className={labelClass}>Nationality</label>
                {/* <Input className={inputClass} placeholder="nationality" value={nationality} onChange={(e)=>setNationality(e.target.value)}/> */}
                  <Select
                    showSearch
                    allowClear
                    placeholder="Select Nationality"
                    optionFilterProp="label"
                    value={nationality || undefined}
                    onChange={(value) => setNationality(value)}
                    options={Countries.map(country => ({
    label: `(${country.countryCode}) ${country.label} `,
    value: country.value,
  }))}
                    className="w-full"
                  />
              </div>
              <div>
                <label className={labelClass}>ID Number</label>
                <InputNumber min={0} className={inputClass} placeholder="Id number" value={idNumber} onChange={(value)=>setIDNumber(value)} />
              </div>
             <div>
  <label className={labelClass}>Email</label>
  <Input className={inputClass} value={email} placeholder="example@gmail.com" onChange={(e)=>setEmail(e.target.value)}/>
</div>
              <div>
                <label className={labelClass}>Phone Number</label>
                <InputNumber className={inputClass} placeholder="999-999-9999" value={phoneNumber} onChange={(value)=>setPhoneNumber(value)}/>
              </div>
            <div>
  <label className={labelClass}>Upload Photo</label>
  <div className="border border-gray-200 rounded-md bg-gray-50 px-4 py-2">
    <Upload
      beforeUpload={() => false}
      onChange={handleChange}
      fileList={fileList}
      accept="image/*"
      showUploadList={false}
    >
      <button
        type="button"
        className=" h-8 flex items-center gap-2 text-sm text-gray-700"
      >
        <LucideUpload size={16} />
        <span>Select Photo</span>
      </button>
    </Upload>
  </div>
  {previewImage && (
  <div className="mt-2 relative inline-block">
    <AntImage
      width={100}
      src={previewImage}
      alt="Preview"
      style={{ borderRadius: "8px", border: "1px solid #ccc" }}
    />
    <button
      type="button"
      onClick={() => {
        if (previewImage) URL.revokeObjectURL(previewImage);
        setPreviewImage(null);
        setFile(null);
        setFileList([]);
      }}
      className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-100"
    >
      <XCircle size={16} className="text-red-500" />
    </button>
  </div>
)}

</div>

            </div>
          </TabPane>

          <TabPane tab="Event Information" key="2">
            <div className="grid grid-cols-2 gap-4">
              <div>
      <label className={labelClass}>Event</label>
     <Input value={passedEventName || eventDetails.find(e => e._id === selectedEventId)?.event_name || ''} disabled />

    </div>
    <div>
      <label className={labelClass}>Category</label>
    <Input
  className={inputClass}
  value={
    passedCategoryName ||
    categoriesForEvent.find((cat) => cat._id === categoryId)?.category_name || ''
  }
  disabled
/>
       
    </div>
              <div>
                <label className={labelClass}>Bib Number</label>
                <Input className={inputClass} placeholder="Bib Number" value={bibNumber} onChange={(e)=>setBibNumber(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Wave</label>
                <Input className={inputClass} placeholder="Wave" value={wave} onChange={(e)=>setWave(e.target.value)}/>
              </div>
              <div>
                <label className={labelClass}>Registration ID</label>
                <Input className={inputClass} placeholder="Registration ID" value={registrationId} onChange={(e)=>setRegistrationId(e.target.value)} />
              </div>
            </div>
          </TabPane>

          {isResultDeclared && (
    <TabPane tab="Performance" key="3">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Result (Time)</label>
            <TimePicker
    value={resultTIme}
    onChange={(time) => setResultTime(time)}
    use12Hours
    format="h:mm:ss.SSS A"
    className={inputClass}
    placeholder="result time"
    showNow={true}
    // showSecond={true}
    showTime={{ format: 'h:mm:ss.SSS A' }}
  />
        </div>
        <div>
          <label className={labelClass}>Ranking</label>
          <InputNumber min={1} className={inputClass} placeholder="Add ranking" value={rank} onChange={(value) => setResultRank(value)}/>
        </div>
        <div>
          <label className={labelClass}>Status</label>
          {/* <input className={inputClass} placeholder="Add status" /> */}
              <Select
    placeholder="Select status"
    value={resultStatus || undefined}
    onChange={(value) => setResultStatus(value)}
    allowClear
    className="w-full"
    style={{
      height: '38px',
      borderRadius: '6px',
    }}
  >
    <Select.Option value="active">Active</Select.Option>
    <Select.Option value="inactive">Inactive</Select.Option>
  </Select>
        </div>
        <div>
          <label className={labelClass}>Remarks</label>
          {/* <input className={inputClass} placeholder="Add remarks" /> */}
          <Input placeholder="add remarks" className="h-9" value={remark} onChange={(e) => setResultRemark(e.target.value)}/>
        </div>
      </div>
    </TabPane>
  )}
        </Tabs>

        {/* Footer Buttons */}
        <div className="flex justify-end space-x-3 mt-4">
          <button onClick={cancel} className="border border-gray-300 text-gray-700 rounded-md px-4 py-2 text-sm">
            Cancel
          </button>
           {activeTab === "1" || (activeTab === "2" && isResultDeclared) ? (
            <button
              onClick={() => {
                const nextKey = (parseInt(activeTab) + 1).toString();
                setActiveTab(nextKey);
              }}
              className="bg-blue-600 text-white rounded-md px-4 py-2 text-sm"
            >
              Next
            </button>
          ) : (
            <button
              onClick={isEdit?handleEdit:handleSubmit}
              disabled={loading}
               className={`rounded-md px-4 py-2 text-sm ${
    loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 text-white"
  }`}
            >
              {loading ? "Processing..." : isEdit && participant ? 'Edit Participant' : 'Add Participant'}

            </button>
          )}
        </div>
      </div>
    </div>
  );
}
