import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faSignature,
  faEnvelope,
  faPhone,
  faVenusMars,
  faCamera,
  faCalendarDay,
} from "@fortawesome/free-solid-svg-icons";
import { constants } from "../../global/constants";
import { AuthContext } from "../../context/AuthContext";

const DirectorProfile = () => {
  const { axiosInstance } = useContext(AuthContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [directorFullName, setDirectorFullName] = useState("");
  const [removeImage, setRemoveImage] = useState(false);

  const BASE_URL = constants.baseUrl;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();


  // Remove button handler
  const handleRemoveImage = () => {
    setImagePreview(null);
    setRemoveImage(true);
  };

  useEffect(() => {
    const fetchDirectorData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/d/director/director_my_profile/`
        );

        const data = response.data;
        const fullName = `${data.first_name} ${data.middle_name} ${data.last_name}`;

        localStorage.setItem("user_name", fullName);  // No need for JSON.stringify if you're storing a string
        setDirectorFullName(fullName);

        setProfileData(data);
      } catch (err) {
        console.error("Error fetching director data:", err);
        setError(err.message || "Failed to fetch director data");
      } finally {
        setLoading(false);
      }
    };

    fetchDirectorData();
  }, [axiosInstance]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      // Append all fields from the form
      formData.append("first_name", data.first_name);
      formData.append("middle_name", data.middle_name || "");
      formData.append("last_name", data.last_name);
      formData.append("email", data.email);
      formData.append("phone_no", data.phone_no);
      formData.append("gender", data.gender);

      if (removeImage) {
        formData.append("user_profile", "");
      } else if (imagePreview && typeof imagePreview !== "string") {
        formData.append("user_profile", imagePreview);
      }

      const response = await axiosInstance.put(
        `/d/director/director_my_profile/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProfileData(response.data);
      setIsDialogOpen(false);
      setImagePreview(null);
      window.location.reload();
    } catch (err) {
      console.error("Error updating director data:", err);
      setError(err.response?.data?.message || err.message);
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
  <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
    <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden px-4 sm:px-6 lg:px-8 py-8 m-2.5">
      {/* Header */}
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
              <FontAwesomeIcon
                icon={faUser}
                className="h-12 w-12 text-gray-400"
              />
            )}
          </div>
        </div>

        {/* Title and Subtitle */}
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold textTheme uppercase">
            Director Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your account information and settings
          </p>
        </div>
      </div>

      {/* Profile Info */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1 */}
          <div className="space-y-6">
            {[
              { label: 'First Name', icon: faUser, value: profileData.first_name },
              { label: 'Middle Name', icon: faSignature, value: profileData.middle_name },
              { label: 'Last Name', icon: faSignature, value: profileData.last_name },
            ].map(({ label, icon, value }, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-500 dark:text-gray-300">
                  <FontAwesomeIcon icon={icon} className="w-4 h-4 mr-2" />
                  {label}
                </label>
                <input
                  type="text"
                  value={value || "Not provided"}
                  className="input input-bordered w-full text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  readOnly
                />
              </div>
            ))}
          </div>

          {/* Column 2 */}
          <div className="space-y-6">
            {[
              { label: 'Email', icon: faEnvelope, value: profileData.email },
              { label: 'Phone Number', icon: faPhone, value: profileData.phone_no },
              { label: 'Gender', icon: faVenusMars, value: profileData.gender },
              { label: 'Date Joined', icon: faCalendarDay, value: profileData.date_joined },
            ].map(
              ({ label, icon, value }, idx) =>
                value && (
                  <div key={idx} className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-500 dark:text-gray-300">
                      <FontAwesomeIcon icon={icon} className="w-4 h-4 mr-2" />
                      {label}
                    </label>
                    <input
                      type="text"
                      value={value}
                      className="input input-bordered w-full text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                      readOnly
                    />
                  </div>
                )
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
            onClick={() => window.history.back()}
          >
            Cancel
          </button>
          <button onClick={handleEditClick} className="btn bgTheme text-white">
            <i class="fa-solid fa-pen-to-square"></i>
            Update
          </button>
        </div>
      </div>

      {/* Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transition-all duration-300">
            <div className="p-6">
              <h2 className="text-xl font-bold textTheme mb-4">
                Update Director Profile
              </h2>

              {/* Your Form Code Goes Here (already done in your version) */}
              {/* Be sure to wrap all inputs in dark mode classes like: dark:bg-gray-700, dark:border-gray-600, dark:text-white */}
              {/* You can copy/paste the rest of your dialog JSX here as-is and just apply those dark styles */}

              {/* Buttons */}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setImagePreview(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button type="submit" className="btn bgTheme text-white">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);

};

export default DirectorProfile;
