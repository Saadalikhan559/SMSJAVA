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
    joining_date: "",
    is_active: true,
    user_profile: null,

    banking_data: {
      account_no: "",
      ifsc_code: "",
      holder_name: "",
    },

    address_data: {
      house_no: "",
      habitation: "",
      ward_no: "",
      zone_no: "",
      block: "",
      district: "",
      division: "",
      area_code: "",
      address_line: "",
      country_name: "",
      state_name: "",
      city_name: "",
    },
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
        joining_date: data.joining_date || "",
        is_active: data.is_active ?? true,
        user_profile: null,

        banking_data: {
          account_no: data.banking_data?.account_no || "",
          ifsc_code: data.banking_data?.ifsc_code || "",
          holder_name: data.banking_data?.holder_name || "",
        },

        address_data: {
          house_no: data.address_data?.house_no || "",
          habitation: data.address_data?.habitation || "",
          ward_no: data.address_data?.ward_no || "",
          zone_no: data.address_data?.zone_no || "",
          block: data.address_data?.block || "",
          district: data.address_data?.district || "",
          division: data.address_data?.division || "",
          area_code: data.address_data?.area_code || "",
          address_line: data.address_data?.address_line || "",
          country_name: data.address_data?.country_name || "",
          state_name: data.address_data?.state_name || "",
          city_name: data.address_data?.city_name || "",
        },
      });

    } catch (err) {
      setError("Failed to load staff data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [id, type]);

const handleChange = (e) => {
  const { name, value } = e.target;

  if (name.startsWith("banking_data.")) {
    const key = name.split(".")[1];
    setFormData((prev) => ({
      ...prev,
      banking_data: {
        ...prev.banking_data,
        [key]: value,
      },
    }));
  } else if (name.startsWith("address_data.")) {
    const key = name.split(".")[1];
    setFormData((prev) => ({
      ...prev,
      address_data: {
        ...prev.address_data,
        [key]: value,
      },
    }));
  } else {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
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

  // Flat fields
  for (const key of [
    "first_name",
    "middle_name",
    "last_name",
    "email",
    "phone_no",
    "gender",
    "adhaar_no",
    "pan_no",
    "qualification",
    "joining_date",
  ]) {
    formPayload.append(key, formData[key] || "");
  }

  // Boolean field (convert to string)
  formPayload.append("is_active", formData.is_active ? "true" : "false");

  // Profile image
  if (formData.user_profile) {
    formPayload.append("user_profile", formData.user_profile);
  }

  // Append nested data as JSON strings
  formPayload.append("banking_data", JSON.stringify(formData.banking_data));
  formPayload.append("address_data", JSON.stringify(formData.address_data));

  try {
    if (type === "teacher") {
      await editTeachersdetails(id, formPayload);
    } else if (type === "office") {
      await editOfficeStaffdetails(id, formPayload);
    } else {
      setError("Invalid staff type.");
      return;
    }
    setUpdateModal(true);
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
    <div className="mb-24 md:mb-10">
      <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow dark:shadow-gray-700">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">
            <i className="fa-solid fa-pen-to-square mr-2"></i>{" "}
            {type?.toLowerCase() === "teacher" ? "Update Teacher Details" : "Update Staff Details"}
          </h1>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            encType="multipart/form-data"
          >
            {/* Top-level Fields */}
            {[
              "first_name",
              "middle_name",
              "last_name",
              "email",
              "phone_no",
              "gender",
              "adhaar_no",
              "pan_no",
              "qualification",
              "joining_date",
            ].map((field) => (
              <div className="flex flex-col" key={field}>
                <label className="label text-gray-700 dark:text-gray-300">
                  {field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={field.replace(/_/g, " ")}
                  className="input input-bordered w-full focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
            ))}

            {/* Banking Fields */}
            {[
              "account_no",
              "ifsc_code",
              "holder_name",
            ].map((field) => (
              <div className="flex flex-col" key={`banking_data.${field}`}>
                <label className="label text-gray-700 dark:text-gray-300">
                  {field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </label>
                <input
                  type="text"
                  name={`banking_data.${field}`}
                  value={formData.banking_data[field]}
                  onChange={handleChange}
                  placeholder={field.replace(/_/g, " ")}
                  className="input input-bordered w-full focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
            ))}

            {/* Address Fields */}
            {[
              "house_no",
              "habitation",
              "ward_no",
              "zone_no",
              "block",
              "district",
              "division",
              "area_code",
              "address_line",
              "country_name",
              "state_name",
              "city_name",
            ].map((field) => (
              <div className="flex flex-col" key={`address_data.${field}`}>
                <label className="label text-gray-700 dark:text-gray-300">
                  {field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </label>
                <input
                  type="text"
                  name={`address_data.${field}`}
                  value={formData.address_data[field]}
                  onChange={handleChange}
                  placeholder={field.replace(/_/g, " ")}
                  className="input input-bordered w-full focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
            ))}

            {/* Profile Picture */}
            <div className="md:col-span-2 lg:col-span-3 flex flex-col">
              <label className="label text-gray-700 dark:text-gray-300">Update Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input file-input-bordered w-full focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>

            {/* Submit Button */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center mt-6">
              <button type="submit" className="btn bgTheme text-white w-52">
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
    </div>
  );
};

export default UpdateStaffDetails;
