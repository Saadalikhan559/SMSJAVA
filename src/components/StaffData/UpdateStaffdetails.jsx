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
    adhaar_no: "",
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
        adhaar_no: data.adhaar_no || "",
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
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce [animation-delay:-0.2s]"></div>
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce [animation-delay:-0.4s]"></div>
        </div>
        <p className="mt-2 text-gray-500 text-sm">Loading data...</p>
      </div>
    );
  }


  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
        <i className="fa-solid fa-triangle-exclamation text-5xl text-red-400 mb-4"></i>
        <p className="text-lg text-red-400 font-medium">Failed to load data, Try Again</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">
            <i className="fa-solid fa-pen-to-square mr-2"></i> Update Staff Details
          </h1>

          {error && (
            <div className="text-red-500 text-center mb-4">{error}</div>
          )}

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
              "adhaar_no",
              "pan_no",
              ...(type === "teacher" ? ["qualification"] : []),
            ].map((field) => (
              <div key={field} className="flex flex-col">
                <label
                  htmlFor={field}
                  className="label-text flex items-center gap-2"
                >
                  {field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </label>
                <input
                  id={field}
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="input input-bordered w-full focus:outline-none dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                />
              </div>
            ))}


            <div className="md:col-span-2 lg:col-span-3">
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                Update Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input file-input-bordered w-full focus:outline-none dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
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
