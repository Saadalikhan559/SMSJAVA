import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faSignature,
  faEnvelope,
  faVenusMars,
  faCamera,
  faIdCard,
  faChild,
  faWeight,
  faRulerVertical,
  faUsers,
  faPrayingHands,
} from "@fortawesome/free-solid-svg-icons";
import { constants } from "../../global/constants";
import { AuthContext } from "../../context/AuthContext";

const StudentProfile = () => {
  const { axiosInstance } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);

  const BASE_URL = constants.baseUrl;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/s/students/student_my_profile/`);
        setProfileData(response.data);
      } catch (err) {
        console.error("Error fetching student data:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [axiosInstance]);


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce [animation-delay:-0.2s]"></div>
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce [animation-delay:-0.4s]"></div>
        </div>
        <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200">
        <i className="fa-solid fa-triangle-exclamation text-5xl text-red-400 mb-4"></i>
        <p className="text-lg text-red-500 font-medium">Failed to load data, Try Again</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden px-4 sm:px-6 lg:px-8 py-8 m-2.5">
        <div className="text-center text-gray-700 dark:text-gray-300">
          <p>No profile data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen mb-24 md:mb-10">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden px-4 sm:px-6 lg:px-8 py-8 m-2.5">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-8">
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
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold textTheme uppercase">Student Profile</h1>
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
                ["First Name", profileData.first_name, faUser],
                ["Middle Name", profileData.middle_name, faSignature],
                ["Last Name", profileData.last_name, faSignature],
                ["Email", profileData.email, faEnvelope],
                ["Father's Name", profileData.father_name, faUser],
                ["Mother's Name", profileData.mother_name, faUser],
              ].map(([label, value, icon], i) => (
                <div className="flex flex-col gap-1" key={i}>
                  <label className="text-sm font-semibold text-gray-500 dark:text-gray-300">
                    <FontAwesomeIcon icon={icon} className="w-4 h-4 mr-2" />
                    {label}
                  </label>
                  <input
                    type="text"
                    value={value || "Not provided"}
                    className="input input-bordered w-full text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                    readOnly
                  />
                </div>
              ))}
            </div>

            {/* Column 2 */}
            <div className="space-y-6">
              {[
                ["Gender", profileData.gender, faVenusMars],
                ["Religion", profileData.religion, faPrayingHands],
                ["Category", profileData.category, faIdCard],
                ["Height (ft)", profileData.height, faRulerVertical],
                ["Weight (kg)", profileData.weight, faWeight],
                ["Blood Group", profileData.blood_group, faChild],
                ["Number of Siblings", profileData.number_of_siblings, faUsers],
              ].map(([label, value, icon], i) => (
                <div className="flex flex-col gap-1" key={i}>
                  <label className="text-sm font-semibold text-gray-500 dark:text-gray-300">
                    <FontAwesomeIcon icon={icon} className="w-4 h-4 mr-2" />
                    {label}
                  </label>
                  <input
                    type="text"
                    value={value || "Not provided"}
                    className="input input-bordered w-full text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                    readOnly
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
