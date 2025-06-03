import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faVenusMars,
  faIdCard,
  faGraduationCap,
  faPhone,
  faSignature,
} from "@fortawesome/free-solid-svg-icons";

function TeacherProfile() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Static teacher payload
  const [profileData, setProfileData] = useState({
    id: 1,
    phone_no: "65661147566",
    gender: "female",
    adhaar_no: 2365646445,
    pan_no: 546546,
    qualification: "B.tech",
    first_name: "fk",
    middle_name: "",
    last_name: "Khan",
    email: "fatima19@gmail.com",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // In a real app, you would send this to an API
    setProfileData(data);
    setIsDialogOpen(false);
  };

  const handleEditClick = () => {
    reset(profileData);
    setIsDialogOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md shadow-top-bottom overflow-hidden px-4 sm:px-6 lg:px-8 py-8 m-2.5">
      {/* Header with image and titles */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-8">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
            <img
              src="https://hopkinsrp.org/wp-content/uploads/2019/03/IMG_9136-900x563.jpg"
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Title and Subtitle */}
        <div className="text-center md:text-left">
          <h1 className="text-xl sm:text-2xl font-bold text-[#167bff] uppercase">
            Teacher Profile
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Manage your account information and settings
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        {/* Grid container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1 */}
          <div className="space-y-6">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-500">
                <FontAwesomeIcon icon={faUser} className="w-4 h-4 mr-2" />
                First Name
              </label>
              <input
                type="text"
                value={profileData.first_name}
                className="input input-bordered w-full text-sm"
                readOnly
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-500">
                <FontAwesomeIcon icon={faSignature} className="w-4 h-4 mr-2" />
                Middle Name
              </label>
              <input
                type="text"
                value={profileData.middle_name || "N/A"}
                className="input input-bordered w-full text-sm"
                readOnly
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-500">
                <FontAwesomeIcon icon={faSignature} className="w-4 h-4 mr-2" />
                Last Name
              </label>
              <input
                type="text"
                value={profileData.last_name}
                className="input input-bordered w-full text-sm"
                readOnly
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-500">
                <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 mr-2" />
                Email
              </label>
              <input
                type="text"
                value={profileData.email}
                className="input input-bordered w-full text-sm"
                readOnly
              />
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-6">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-500">
                <FontAwesomeIcon icon={faPhone} className="w-4 h-4 mr-2" />
                Phone Number
              </label>
              <input
                type="text"
                value={profileData.phone_no}
                className="input input-bordered w-full text-sm"
                readOnly
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-500">
                <FontAwesomeIcon icon={faVenusMars} className="w-4 h-4 mr-2" />
                Gender
              </label>
              <input
                type="text"
                value={profileData.gender}
                className="input input-bordered w-full text-sm"
                readOnly
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-500">
                <FontAwesomeIcon icon={faIdCard} className="w-4 h-4 mr-2" />
                Aadhaar Number
              </label>
              <input
                type="text"
                value={profileData.adhaar_no}
                className="input input-bordered w-full text-sm"
                readOnly
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-500">
                <FontAwesomeIcon icon={faIdCard} className="w-4 h-4 mr-2" />
                PAN Number
              </label>
              <input
                type="text"
                value={profileData.pan_no}
                className="input input-bordered w-full text-sm"
                readOnly
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-500">
                <FontAwesomeIcon
                  icon={faGraduationCap}
                  className="w-4 h-4 mr-2"
                />
                Qualification
              </label>
              <input
                type="text"
                value={profileData.qualification}
                className="input input-bordered w-full text-sm"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Buttons section */}
        <div className="flex justify-end gap-4 mt-8">
          <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <span className="mr-1">X</span> Cancel
          </button>
          <button
            onClick={handleEditClick}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <span className="mr-2 text-lg leading-none">↑</span> Update
          </button>
        </div>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl">
            {" "}
            {/* Increased max width */}
            <div className="p-6">
              <h2 className="text-xl font-bold text-[#167bff] mb-4">
                Update Profile
              </h2>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {" "}
                  {/* 3-column grid */}
                  {/* Column 1 - Personal Info */}
                  <div className="space-y-4">
                    <h3 className="text-md font-semibold text-gray-700 border-b pb-2">
                      Personal Information
                    </h3>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-500">
                        First Name
                      </label>
                      <input
                        type="text"
                        {...register("first_name", {
                          required: "First name is required",
                        })}
                        className="input input-bordered w-full text-sm"
                      />
                      {errors.first_name && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.first_name.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-500">
                        Middle Name
                      </label>
                      <input
                        type="text"
                        {...register("middle_name")}
                        className="input input-bordered w-full text-sm"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-500">
                        Last Name
                      </label>
                      <input
                        type="text"
                        {...register("last_name", {
                          required: "Last name is required",
                        })}
                        className="input input-bordered w-full text-sm"
                      />
                      {errors.last_name && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.last_name.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-500">
                        Gender
                      </label>
                      <select
                        {...register("gender", {
                          required: "Gender is required",
                        })}
                        className="select select-bordered w-full text-sm"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.gender && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.gender.message}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Column 2 - Contact Info */}
                  <div className="space-y-4">
                    <h3 className="text-md font-semibold text-gray-700 border-b pb-2">
                      Contact Information
                    </h3>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-500">
                        Email
                      </label>
                      <input
                        type="email"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                          },
                        })}
                        className="input input-bordered w-full text-sm"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-500">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        {...register("phone_no", {
                          required: "Phone number is required",
                        })}
                        className="input input-bordered w-full text-sm"
                      />
                      {errors.phone_no && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.phone_no.message}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Column 3 - Professional Info */}
                  <div className="space-y-4">
                    <h3 className="text-md font-semibold text-gray-700 border-b pb-2">
                      Professional Information
                    </h3>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-500">
                        Qualification
                      </label>
                      <input
                        type="text"
                        {...register("qualification", {
                          required: "Qualification is required",
                        })}
                        className="input input-bordered w-full text-sm"
                      />
                      {errors.qualification && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.qualification.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-500">
                        Aadhaar Number
                      </label>
                      <input
                        type="number"
                        {...register("adhaar_no", {
                          required: "Aadhaar number is required",
                        })}
                        className="input input-bordered w-full text-sm"
                      />
                      {errors.adhaar_no && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.adhaar_no.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-500">
                        PAN Number
                      </label>
                      <input
                        type="number"
                        {...register("pan_no", {
                          required: "PAN number is required",
                        })}
                        className="input input-bordered w-full text-sm"
                      />
                      {errors.pan_no && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.pan_no.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Buttons - Full width below columns */}
                <div className="flex justify-end gap-4 mt-6 border-t pt-4">
                  <button
                    type="button"
                    onClick={() => setIsDialogOpen(false)}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherProfile;
