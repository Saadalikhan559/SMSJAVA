import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchTeachers,
  fetchOfficeStaff,
  editOfficeStaffdetails,
  editTeachersdetails,
} from "../../services/api/Api";
import UpdateSuccessful from "../Modals/UpdateModal";

const UpdateStaffDetails = () => {
  const { id, type } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    phone_no: "",
    gender: "",
    aadhar_no: "",
    pan_no: "",
    qualification: "",
    category: "",
    user_profile: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [UpdateModal, setUpdateModal] = useState(false);

  const fetchStaff = async () => {
    try {
      let data;
      if (type === "teacher") {
        data = await fetchTeachers(id);
      } else if (type === "office") {
        data = await fetchOfficeStaff(id);
      } else {
        setError("Invalid staff type.");
        return;
      }

      setFormData({
        first_name: data.first_name || "",
        middle_name: data.middle_name || "",
        last_name: data.last_name || "",
        email: data.email || "",
        phone_no: data.phone_no || "",
        gender: data.gender || "",
        aadhar_no: data.aadhar_no || "",
        pan_no: data.pan_no || "",
        qualification: data.qualification || "",
        category: data.category || "",
        user_profile: null,
      });
    } catch (err) {
      setError("Failed to load staff data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
    console.log("Fetching for id:", id, "type:", type);
  }, [id, type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      user_profile: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formPayload = new FormData();

    for (const key in formData) {
      if (formData[key] !== null) {
        formPayload.append(key, formData[key]);
      }
    }

    try {
      if (type === "teacher") {
        await editTeachersdetails(id, formPayload);
      } else if (type === "office") {
        await editOfficeStaffdetails(id, formPayload);
      } else {
        setError("Invalid staff type.");
        return;
      }
      setUpdateModal(true)
    } catch (err) {
      console.error("Submit error:", err);
      setError("Failed to update staff details.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <i className="fa-solid fa-spinner fa-spin mr-2 text-4xl" />
      </div>
    );
  }

  return (
    <>
  <div className="p-6 bg-gray-100 min-h-screen">
    <div className="max-w-7xl mx-auto bg-white p-8 rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-8 text-center">
        <i className="fa-solid fa-pen-to-square mr-2"></i> Update Staff Details
      </h1>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          encType="multipart/form-data"
        >
          {[
            "first_name",
            "middle_name",
            "last_name",
            "email",
            "phone_no",
            "gender",
            "aadhar_no",
            "pan_no",
            "qualification",
            "category",
          ].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={field
                .replace(/_/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())}
              className="input input-bordered w-full focus:outline-none"
            />
          ))}

          <div className="md:col-span-2 lg:col-span-3">
            <label className="block mb-2 font-medium">Update Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input file-input-bordered w-full focus:outline-none"
            />
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center mt-6">
            <button type="submit" className="btn bgTheme text-white">
              <i className="fa-solid fa-floppy-disk mr-2"></i> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>

  {UpdateModal && (
    <UpdateSuccessful
      handleCloseOnly={() => setUpdateModal(false)}
      handleCloseAndNavigate={() => navigate(`/staffDetail/${type}/${id}`)}
    />
  )}
</>
  );
};

export default UpdateStaffDetails;
