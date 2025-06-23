import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faSignature, 
  faEnvelope, 
  faPhone, 
  faVenusMars,
  faCamera,
  faIdCard,
  faGraduationCap,
  faCalendarDay
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { constants } from '../../global/constants';

const TeacherProfile = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [accessToken, setAccessToken] = useState("");

  const BASE_URL = constants.baseUrl;

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const tokenData = localStorage.getItem("authTokens");
    if (tokenData) {
      try {
        const tokens = JSON.parse(tokenData);
        if (tokens && tokens.access) {
          setAccessToken(tokens.access);
        }
      } catch (error) {
        console.error("Error parsing auth tokens:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    const fetchTeacherData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/t/teacher/teacher_my_profile/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setProfileData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching teacher data:", err);
        setError(err.response?.data?.detail || err.message);
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [accessToken, BASE_URL]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      // Required fields
      formData.append("first_name", data.first_name);
      formData.append("last_name", data.last_name);
      formData.append("email", data.email);
      formData.append("phone_no", data.phone_no);
      formData.append("gender", data.gender);
      formData.append("adhaar_no", data.adhaar_no);
      formData.append("pan_no", data.pan_no);
      formData.append("qualification", data.qualification);

      // Optional fields
      formData.append("middle_name", data.middle_name || "");

      // Append the file if selected
      if (imagePreview && typeof imagePreview !== 'string') {
        formData.append("user_profile", imagePreview);
      }

      const response = await axios.put(
        `${BASE_URL}/t/teacher/teacher_my_profile/`, 
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProfileData(response.data);
      setIsDialogOpen(false);
      setImagePreview(null);
      window.location.reload();
    } catch (err) {
      console.error("Error updating teacher data:", err);
      setError(err.message);
    }
  };

  const handleEditClick = () => {
    reset(profileData);
    setIsDialogOpen(true);
    if (profileData?.user_profile) {
      setImagePreview(`${BASE_URL}${profileData.user_profile}`);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md shadow-top-bottom overflow-hidden px-4 sm:px-6 lg:px-8 py-8 m-2.5">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md shadow-top-bottom overflow-hidden px-4 sm:px-6 lg:px-8 py-8 m-2.5">
        <div className="text-center text-red-500">
          <p>Error loading teacher profile: {error}</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md shadow-top-bottom overflow-hidden px-4 sm:px-6 lg:px-8 py-8 m-2.5">
        <div className="text-center text-gray-500">
          <p>No profile data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md shadow-top-bottom overflow-hidden px-4 sm:px-6 lg:px-8 py-8 m-2.5">
      {/* Header with image and titles */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-8">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
            {profileData.user_profile ? (
              <img
                src={`${BASE_URL}${profileData.user_profile}`}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <FontAwesomeIcon icon={faUser} className="h-12 w-12 text-gray-400" />
            )}
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
                value={profileData.first_name || 'Not provided'}
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
                value={profileData.middle_name || 'Not provided'}
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
                value={profileData.last_name || 'Not provided'}
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
                value={profileData.email || 'Not provided'}
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
                value={profileData.phone_no || 'Not provided'}
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
                value={profileData.gender || 'Not provided'}
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
                value={profileData.adhaar_no || 'Not provided'}
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
                value={profileData.pan_no || 'Not provided'}
                className="input input-bordered w-full text-sm"
                readOnly
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-500">
                <FontAwesomeIcon icon={faGraduationCap} className="w-4 h-4 mr-2" />
                Qualification
              </label>
              <input
                type="text"
                value={profileData.qualification || 'Not provided'}
                className="input input-bordered w-full text-sm"
                readOnly
              />
            </div>

            {profileData.date_joined && (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-500">
                  <FontAwesomeIcon icon={faCalendarDay} className="w-4 h-4 mr-2" />
                  Date Joined
                </label>
                <input
                  type="text"
                  value={profileData.date_joined}
                  className="input input-bordered w-full text-sm"
                  readOnly
                />
              </div>
            )}
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

      {/* Dialog Box */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl">
            <div className="p-6">
              <h2 className="text-xl font-bold text-[#167bff] mb-4">Update Teacher Profile</h2>
              
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Column 1 - Profile Image */}
                  <div className="space-y-4">
                    <h3 className="text-md font-semibold text-gray-700 border-b pb-2">
                      Profile Image
                    </h3>

                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative group">
                        <div className="h-32 w-32 rounded-full bg-gray-100 overflow-hidden shadow-md border-2 border-gray-300 hover:border-blue-400 transition-all duration-200">
                          {imagePreview ? (
                            typeof imagePreview === "string" ? (
                              <img
                                src={imagePreview}
                                alt="Profile Preview"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <img
                                src={URL.createObjectURL(imagePreview)}
                                alt="Profile Preview"
                                className="h-full w-full object-cover"
                              />
                            )
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-100 to-gray-200">
                              <FontAwesomeIcon
                                icon={faUser}
                                size="3x"
                                className="opacity-70"
                              />
                            </div>
                          )}
                        </div>
                        <label className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer">
                          <div className="bg-black bg-opacity-50 rounded-full p-2">
                            <FontAwesomeIcon
                              icon={faCamera}
                              className="text-white text-lg"
                            />
                          </div>
                          <input
                            className="hidden"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setImagePreview(e.target.files[0]);
                              }
                            }}
                          />
                        </label>
                      </div>

                      <div className="flex gap-2">
                        <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center transition-colors">
                          <FontAwesomeIcon icon={faCamera} className="mr-2" />
                          Change Photo
                          <input
                            className="hidden"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setImagePreview(e.target.files[0]);
                              }
                            }}
                          />
                        </label>
                        {imagePreview && (
                          <button
                            type="button"
                            onClick={() => setImagePreview(null)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Column 2 - Personal Info */}
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
                        {...register("first_name", { required: "First name is required" })}
                        className="input input-bordered w-full text-sm"
                      />
                      {errors.first_name && (
                        <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>
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
                        {...register("last_name", { required: "Last name is required" })}
                        className="input input-bordered w-full text-sm"
                      />
                      {errors.last_name && (
                        <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-500">
                        Gender
                      </label>
                      <select
                        {...register("gender", { required: "Gender is required" })}
                        className="select select-bordered w-full text-sm"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.gender && (
                        <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Column 3 - Contact & Professional Info */}
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
                            message: "Invalid email address"
                          }
                        })}
                        className="input input-bordered w-full text-sm"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-500">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        {...register("phone_no", { required: "Phone number is required" })}
                        className="input input-bordered w-full text-sm"
                      />
                      {errors.phone_no && (
                        <p className="text-red-500 text-xs mt-1">{errors.phone_no.message}</p>
                      )}
                    </div>

                    <h3 className="text-md font-semibold text-gray-700 border-b pb-2 mt-4">
                      Professional Information
                    </h3>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-500">
                        Qualification
                      </label>
                      <input
                        type="text"
                        {...register("qualification", { required: "Qualification is required" })}
                        className="input input-bordered w-full text-sm"
                      />
                      {errors.qualification && (
                        <p className="text-red-500 text-xs mt-1">{errors.qualification.message}</p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-500">
                        Aadhaar Number
                      </label>
                      <input
                        type="text"
                        {...register("adhaar_no", { required: "Aadhaar number is required" })}
                        className="input input-bordered w-full text-sm"
                      />
                      {errors.adhaar_no && (
                        <p className="text-red-500 text-xs mt-1">{errors.adhaar_no.message}</p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-500">
                        PAN Number
                      </label>
                      <input
                        type="text"
                        {...register("pan_no", { required: "PAN number is required" })}
                        className="input input-bordered w-full text-sm"
                      />
                      {errors.pan_no && (
                        <p className="text-red-500 text-xs mt-1">{errors.pan_no.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setImagePreview(null);
                    }}
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
};

export default TeacherProfile;