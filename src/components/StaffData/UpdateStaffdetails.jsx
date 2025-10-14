import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchTeachers,
  fetchOfficeStaff,
  editOfficeStaffdetails,
  editTeachersdetails,
} from "../../services/api/Api";
import UpdateSuccessful from "../Modals/UpdateModal";
import { useForm } from "react-hook-form";

const UpdateStaffDetails = () => {
  const { id, type } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [UpdateModal, setUpdateModal] = useState(false);
  const [profileFile, setProfileFile] = useState(null);
  const [apiErrors, setApiErrors] = useState({});

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onChange" });

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

      Object.keys(data).forEach((key) => {
        if (key === "banking_data" || key === "address_data") {
          if (data[key] !== null) {
            Object.keys(data[key]).forEach((subKey) => {
              setValue(`${key}.${subKey}`, data[key][subKey]);
            });
          }
        } else if (data[key] !== null && data[key] !== undefined) {
          setValue(key, data[key]);
        }
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

  const onSubmit = async (formData) => {
    const payload = new FormData();

    if (formData.is_active === "true") {
      formData.is_active = true;
    } else if (formData.is_active === "false") {
      formData.is_active = false;
    }

    if (formData.banking_data) {
      payload.append("banking_data", JSON.stringify(formData.banking_data));
    }
    if (formData.address_data) {
      payload.append("address_data", JSON.stringify(formData.address_data));
    }

    for (const key in formData) {
      if (
        key !== "user_profile" &&
        key !== "banking_data" &&
        key !== "address_data" &&
        formData[key] !== null &&
        formData[key] !== ""
      ) {
        payload.append(key, formData[key]);
      }
    }

    // File append
    if (profileFile) {
      payload.append("user_profile", profileFile);
    }

    try {
      if (type === "teacher") {
        await editTeachersdetails(id, payload);
      } else if (type === "office") {
        await editOfficeStaffdetails(id, payload);
      }
      setUpdateModal(true);
      setApiErrors({});
    } catch (err) {
      console.error("Failed to update staff details:", err);

      if (err.response && err.response.data) {
        setApiErrors(err.response.data);
      } else if (err.pan_no) {
        setApiErrors({ pan_no: err.pan_no });
      } else if (err.adhaar_no) {
        setApiErrors({ adhaar_no: err.adhaar_no });
      } else {
        setError("Failed to update staff details.");
      }
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
      <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen mb-24 md:mb-10">
        <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">
            <i className="fa-solid fa-pen-to-square mr-2"></i>{" "}
            {type?.toLowerCase() === "teacher" ? "Update Teacher Details" : "Update Staff Details"}
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            encType="multipart/form-data"
          >
            {/* First Name */}
            <div>
              <label className="label">First Name</label>
              <input
                type="text"
                placeholder="Enter First Name"
                {...register("first_name", { required: "First Name is required" })}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />
              {errors.first_name && <span className="text-error text-sm">{errors.first_name.message}</span>}
            </div>

            {/* Middle Name */}
            <div>
              <label className="label">Middle Name</label>
              <input
                type="text"
                placeholder="Enter Middle Name"
                {...register("middle_name")}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="label">Last Name</label>
              <input
                type="text"
                placeholder="Enter Last Name"
                {...register("last_name", { required: "Last Name is required" })}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />
              {errors.last_name && <span className="text-error text-sm">{errors.last_name.message}</span>}
            </div>

            {/* Email */}
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                placeholder="Enter Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" },
                })}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />
              {errors.email && <span className="text-error text-sm">{errors.email.message}</span>}
            </div>

            {/* Phone */}
            <div>
              <label className="label">Phone Number</label>
              <input
                type="tel"
                placeholder="Phone Number"
                {...register("phone_no", {
                  required: "Phone number is required",
                  pattern: { value: /^\d{10}$/, message: "Phone number must be exactly 10 digits" },
                  maxLength: { value: 10, message: "Phone number cannot exceed 10 digits" },
                })}
                className={`input input-bordered w-full  dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:outline-none ${errors.phone_no ? "input-error" : ""}`}
              />
              {errors.phone_no && <span className="text-error text-sm">{errors.phone_no.message}</span>}
            </div>

            {/* Status */}
            <div>
              <label className="label">Status</label>
              <select
                {...register("is_active", { required: "Status is required" })}
                className="select select-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                disabled={true}
              >
                <option value="">Select Status</option>
                <option value="true">Active</option>
                <option value="false">InActive</option>
              </select>
              {errors.is_active && <span className="text-error text-sm">{errors.is_active.message}</span>}
            </div>

            {/* Gender */}
            <div>
              <label className="label">Gender</label>
              <select
                {...register("gender", { required: "Gender is required" })}
                className="select select-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              >
                <option value="">Select Gender</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <span className="text-error text-sm">{errors.gender.message}</span>}
            </div>

            {/* Aadhaar */}
            <div>
              <label className="label">Aadhaar Number</label>
              <input
                type="text"
                placeholder="Enter Aadhaar Number"
                {...register("adhaar_no", {
                  pattern: { value: /^\d{12}$/, message: "Aadhaar must be 12 digits" },
                })}
                className={`input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 ${errors.adhaar_no || apiErrors.adhaar_no ? "input-error" : ""}`}
              />
              {errors.adhaar_no && <span className="text-error text-sm">{errors.adhaar_no.message}</span>}
              {apiErrors.adhaar_no &&
                apiErrors.adhaar_no.map((msg, idx) => (
                  <span key={idx} className="text-error text-sm">{msg}</span>
                ))}
            </div>

            {/* PAN */}
            <div>
              <label className="label">PAN Number</label>
              <input
                type="text"
                placeholder="Enter PAN Number"
                {...register("pan_no", {
                  pattern: {
                    value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                    message: "PAN format: 5 letters + 4 digits + 1 letter",
                  },
                })}
                className={`input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 ${errors.pan_no || apiErrors.pan_no ? "input-error" : ""}`}
              />
              {errors.pan_no && <span className="text-error text-sm">{errors.pan_no.message}</span>}
              {apiErrors.pan_no &&
                apiErrors.pan_no.map((msg, idx) => (
                  <span key={idx} className="text-error text-sm">{msg}</span>
                ))}
            </div>

            {/* Account Number */}
            <div>
              <label className="label">Account Number</label>
              <input
                type="text"
                {...register("banking_data.account_no")}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />
            </div>
            {/* IFSC Code */}
            <div>
              <label className="label">IFSC Code</label>
              <input
                type="text"
                {...register("banking_data.ifsc_code")}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />
            </div>
            {/* Account Holder Name */}
            <div>
              <label className="label">Account Holder Name</label>
              <input
                type="text"
                {...register("banking_data.holder_name")}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />
            </div>
              {/* House No */}
            <div>
              <label className="label">House No</label>
              <input
                type="text"
                {...register("address_data.house_no")}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />
            </div>
            {/* Habitation */}
            <div>
              <label className="label">Habitation</label>
              <input
                type="text"
                {...register("address_data.habitation")}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />
            </div>
            {/* Ward No */}
            <div>
              <label className="label">Ward No</label>
              <input
                type="text"
                {...register("address_data.ward_no")}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />
            </div>
            {/* Zone No */}
            <div>
              <label className="label">Zone No</label>
              <input
                type="text"
                {...register("address_data.zone_no")}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />
            </div>
            {/* Block */}
            <div>
              <label className="label">Block</label>
              <input
                type="text"
                {...register("address_data.block")}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />
            </div>
            {/* District */}
            <div>
              <label className="label">District</label>
              <input
                type="text"
                {...register("address_data.district")}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />
            </div>
            {/* Division */}
            <div>
              <label className="label">Division</label>
              <input
                type="text"
                {...register("address_data.division")}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />
            </div>
            {/* Area Code */}
            <div>
              <label className="label">Area Code</label>
              <input
                type="text"
                {...register("address_data.area_code")}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />
            </div>
            {/* Address Line */}
            <div>
              <label className="label">Address Line</label>
              <input
                type="text"
                {...register("address_data.address_line")}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />
            </div>
            {/* Country */}
            <div>
              <label className="label">Country</label>
              <input
                type="text"
                {...register("address_data.country_name")}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />
            </div>
            {/* State */}
            <div>
              <label className="label">State</label>
              <input
                type="text"
                {...register("address_data.state_name")}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />
            </div>
            {/* City */}
            <div>
              <label className="label">City</label>
              <input
                type="text"
                {...register("address_data.city_name")}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />
            </div>

            {/* Profile Picture */}
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                Update Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfileFile(e.target.files[0] || null)}
                className="file-input file-input-bordered w-full focus:outline-none dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />
            </div>

            {/* Submit */}
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

