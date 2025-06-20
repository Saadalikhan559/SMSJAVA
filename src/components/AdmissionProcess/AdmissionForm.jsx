import React, { useEffect, useRef, useState } from "react";
import {
  fetchGuardianType,
  fetchSchoolYear,
  fetchYearLevels,
  fetchCountry,
  fetchState,
  fetchCity,
  handleAdmissionForm,
} from "../../services/api/Api";
import { constants } from "../../global/constants";

export const AdmissionForm = () => {
  const formRef = useRef(null);
  const [yearLevel, setYearLevel] = useState([]);
  const [schoolYears, setSchoolYear] = useState([]);
  const [guardianTypes, setGuardianType] = useState([]);
  const [showPassword, setShowPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedGuardianType, setSelectedGuardianType] = useState("");
  const [showGuardianPassword, setShowGuardianPassword] = useState(true);
  const [country, setCountry] = useState([]);
  const [state, setState] = useState([]);
  const [city, setCity] = useState([]);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowGuardianPassword = () => {
    setShowGuardianPassword(!showGuardianPassword);
  };

  const handleGuardianTypeChange = (e) => {
    setSelectedGuardianType(e.target.value);
  };

  const getYearLevels = async () => {
    try {
      const yearLevels = await fetchYearLevels();
      setYearLevel(yearLevels);
    } catch (err) {
      console.log("Failed to load year levels. Please try again.");
    }
  };

  const getSchoolYears = async () => {
    try {
      const schoolYears = await fetchSchoolYear();
      setSchoolYear(schoolYears);
    } catch (err) {
      console.log("Failed to load school years. Please try again.");
    }
  };

  const getGuardianType = async () => {
    try {
      const guardianType = await fetchGuardianType();
      setGuardianType(guardianType);
    } catch (error) {
      console.log("Failed to load guardian type. Please try again.");
    }
  };

  const getCountry = async () => {
    try {
      const countryList = await fetchCountry();
      setCountry(countryList);
    } catch (err) {
      console.log("Failed to load countries. Please try again.");
    }
  };

  const getState = async () => {
    try {
      const stateList = await fetchState();
      setState(stateList);
    } catch (err) {
      console.log("Failed to load states. Please try again.");
    }
  };

  const getCity = async () => {
    try {
      const cityList = await fetchCity();
      setCity(cityList);
    } catch (err) {
      console.log("Failed to load cities. Please try again.");
    }
  };

  useEffect(() => {
    getYearLevels();
    getSchoolYears();
    getGuardianType();
    getCountry();
    getState();
    getCity();
  }, []);
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(formRef.current);

    // Create a new FormData object and append all fields properly
    const submitFormData = new FormData();

    // Student fields
    submitFormData.append(
      "student[first_name]",
      formData.get("student_first_name") || ""
    );
    submitFormData.append(
      "student[middle_name]",
      formData.get("student_middle_name") || ""
    );
    submitFormData.append(
      "student[last_name]",
      formData.get("student_last_name") || ""
    );
    submitFormData.append(
      "student[email]",
      formData.get("student_email") || ""
    );
    submitFormData.append(
      "student[password]",
      formData.get("student_password") || ""
    );
    submitFormData.append(
      "student[father_name]",
      formData.get("student_father_name") || ""
    );
    submitFormData.append(
      "student[mother_name]",
      formData.get("student_mother_name") || ""
    );
    submitFormData.append(
      "student[date_of_birth]",
      formData.get("student_date_of_birth") || ""
    );
    submitFormData.append(
      "student[gender]",
      formData.get("student_gender") || ""
    );
    submitFormData.append(
      "student[religion]",
      formData.get("student_religion") || ""
    );
    submitFormData.append(
      "student[category]",
      formData.get("student_category") || ""
    );
    submitFormData.append(
      "student[height]",
      formData.get("student_height") || ""
    );
    submitFormData.append(
      "student[weight]",
      formData.get("student_weight") || ""
    );
    submitFormData.append(
      "student[blood_group]",
      formData.get("student_blood_group") || ""
    );
    submitFormData.append(
      "student[number_of_siblings]",
      formData.get("student_number_of_siblings") || ""
    );

    // Guardian fields
    submitFormData.append(
      "guardian[first_name]",
      formData.get("guardian_first_name") || ""
    );
    submitFormData.append(
      "guardian[middle_name]",
      formData.get("guardian_middle_name") || ""
    );
    submitFormData.append(
      "guardian[last_name]",
      formData.get("guardian_last_name") || ""
    );
    submitFormData.append(
      "guardian[password]",
      formData.get("guardian_password") || ""
    );
    submitFormData.append(
      "guardian[email]",
      formData.get("guardian_email") || ""
    );
    submitFormData.append(
      "guardian[phone_no]",
      formData.get("guardian_phone_no") || ""
    );
    submitFormData.append(
      "guardian[annual_income]",
      formData.get("guardian_annual_income") || ""
    );
    submitFormData.append(
      "guardian[means_of_livelihood]",
      formData.get("guardian_means_of_livelihood") || ""
    );
    submitFormData.append(
      "guardian[qualification]",
      formData.get("guardian_qualification") || ""
    );
    submitFormData.append(
      "guardian[occupation]",
      formData.get("guardian_occupation") || ""
    );
    submitFormData.append(
      "guardian[designation]",
      formData.get("guardian_designation") || ""
    );

    // Address fields
    submitFormData.append(
      "address_input[house_no]",
      formData.get("student_address_house_number") || ""
    );
    submitFormData.append(
      "address_input[habitation]",
      formData.get("student_address_habitation") || ""
    );
    submitFormData.append(
      "address_input[word_no]",
      formData.get("student_address_ward_no") || ""
    );
    submitFormData.append(
      "address_input[zone_no]",
      formData.get("student_address_zone") || ""
    );
    submitFormData.append(
      "address_input[block]",
      formData.get("student_address_block") || ""
    );
    submitFormData.append(
      "address_input[district]",
      formData.get("student_address_district") || ""
    );
    submitFormData.append(
      "address_input[division]",
      formData.get("student_address_division") || ""
    );
    submitFormData.append(
      "address_input[area_code]",
      formData.get("student_address_pin_code") || ""
    );
    submitFormData.append(
      "address_input[country]",
      formData.get("student_address_country") || ""
    );
    submitFormData.append(
      "address_input[state]",
      formData.get("student_address_state") || ""
    );
    submitFormData.append(
      "address_input[city]",
      formData.get("student_address_city") || ""
    );
    submitFormData.append(
      "address_input[address_line]",
      formData.get("student_address_address_line") || ""
    );

    // Banking details
    submitFormData.append(
      "banking_detail_input[account_no]",
      formData.get("student_banking_account_no") || ""
    );
    submitFormData.append(
      "banking_detail_input[ifsc_code]",
      formData.get("student_banking_ifsc_code") || ""
    );
    submitFormData.append(
      "banking_detail_input[holder_name]",
      formData.get("student_banking_holder_name") || ""
    );

    // Other fields
    submitFormData.append("guardian_type_input", selectedGuardianType || "");
    submitFormData.append("year_level", formData.get("year_level") || "");
    submitFormData.append("school_year", formData.get("school_year") || "");
    submitFormData.append(
      "previous_school_name",
      formData.get("previous_school_name") || ""
    );
    submitFormData.append(
      "previous_standard_studied",
      formData.get("previous_standard_studied") || ""
    );
    submitFormData.append("tc_letter", formData.get("tc_letter") || "");
    submitFormData.append(
      "emergency_contact_n0",
      formData.get("emergency_contact_n0") || ""
    );
    submitFormData.append(
      "entire_road_distance_from_home_to_school",
      formData.get("entire_road_distance_from_home_to_school") || ""
    );
    submitFormData.append("obtain_marks", formData.get("obtain_marks") || "");
    submitFormData.append("total_marks", formData.get("total_marks") || "");
    submitFormData.append(
      "previous_percentage",
      formData.get("previous_percentage") || ""
    );

    // Append files if they exist
    if (formData.get("student_user_profile")) {
      submitFormData.append(
        "student_user_profile",
        formData.get("student_user_profile")
      );
    }
    if (formData.get("guardian_user_profile")) {
      submitFormData.append(
        "guardian_user_profile",
        formData.get("guardian_user_profile")
      );
    }

    try {
      const response = await handleAdmissionForm(submitFormData);
      console.log("Submission successful:", response);
      alert("Successfully submitted the form");
    } catch (error) {
      console.error("Submission error:", error.response?.data || error.message);
      alert("Failed to submit the form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{constants.hideEdgeRevealStyle}</style>
      <form
        ref={formRef}
        className="w-full max-w-6xl mx-auto p-6 bg-base-100 rounded-box my-5 shadow-sm focus:outline-none"
        onSubmit={onSubmit}
      >
        <h1 className="text-3xl font-bold text-center mb-8">
          Fill your Details <i className="fa-solid fa-graduation-cap ml-2"></i>
        </h1>

        {/* Student Information Section */}
        <div className="bg-base-200 p-6 rounded-box mb-6">
          <h2 className="text-2xl font-bold mb-4">Student Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-user text-sm"></i>
                  First Name <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="text"
                name="student_first_name"
                placeholder="First Name"
                className="input input-bordered w-full focus:outline-none"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-user-pen text-sm"></i>
                  Middle Name
                </span>
              </label>
              <input
                type="text"
                name="student_middle_name"
                placeholder="Middle Name"
                className="input input-bordered w-full focus:outline-none"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-user-tag text-sm"></i>
                  Last Name <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="text"
                name="student_last_name"
                placeholder="Last Name"
                className="input input-bordered w-full focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-envelope text-sm"></i>
                  Email <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="email"
                name="student_email"
                placeholder="student@example.com"
                className="input input-bordered w-full focus:outline-none"
              />
            </div>
            <div className="form-control relative">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-lock text-sm"></i>
                  Password <span className="text-error">*</span>
                </span>
              </label>
              <input
                type={showPassword ? "password" : "text"}
                name="student_password"
                placeholder="Password"
                className="input input-bordered w-full pr-10 focus:outline-none"
              />
              <button
                type="button"
                className="passwordEyes text-gray-500"
                onClick={handleShowPassword}
              >
                <i
                  className={`fa-solid ${
                    showPassword ? "fa-eye-slash" : "fa-eye"
                  }`}
                ></i>
              </button>
            </div>
          </div>
          {/* <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1">
                  <i className="fa-solid fa-camera text-sm"></i>
                  Student Profile Photo
                </span>
              </label>
              <input
                type="file"
                name="student_user_profile"
                accept="image/*"
                className="file-input file-input-bordered w-full focus:outline-none"
              />
            </div>
          </div> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-calendar-days text-sm"></i>
                  Date of Birth <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="date"
                name="student_date_of_birth"
                className="input input-bordered w-full focus:outline-none"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-venus-mars text-sm"></i>
                  Gender <span className="text-error">*</span>
                </span>
              </label>
              <select
                name="student_gender"
                className="select select-bordered w-full focus:outline-none cursor-pointer"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-user text-sm"></i>
                  Father's Name <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="text"
                name="student_father_name"
                placeholder="Father's Name"
                className="input input-bordered w-full focus:outline-none"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-user text-sm"></i>
                  Mother's Name <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="text"
                name="student_mother_name"
                placeholder="Mother's Name"
                className="input input-bordered w-full focus:outline-none"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-hands-praying text-sm"></i>
                  Religion <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="text"
                name="student_religion"
                placeholder="Religion"
                className="input input-bordered w-full focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-tag text-sm"></i>
                  Category <span className="text-error">*</span>
                </span>
              </label>
              <select
                name="student_category"
                className="select select-bordered w-full focus:outline-none cursor-pointer"
              >
                <option value="">Select Category</option>
                <option value="GEN">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">FetchType</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-ruler-vertical text-sm"></i>
                  Height (cm)
                </span>
              </label>
              <input
                type="number"
                name="student_height"
                placeholder="Height"
                className="input input-bordered w-full focus:outline-none"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-weight-scale text-sm"></i>
                  Weight (kg)
                </span>
              </label>
              <input
                type="number"
                name="student_weight"
                placeholder="Weight"
                className="input input-bordered w-full focus:outline-none"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-heart-pulse text-sm"></i>
                  Blood Group
                </span>
              </label>
              <select
                name="student_blood_group"
                className="select select-bordered w-full focus:outline-none cursor-pointer"
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-people-group text-sm"></i>
                  Number of Siblings
                </span>
              </label>
              <input
                type="number"
                name="student_number_of_siblings"
                placeholder="Number of Siblings"
                className="input input-bordered w-full focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Guardian Information Section */}
        <div className="bg-base-200 p-6 rounded-box mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h2 className="text-2xl font-bold whitespace-nowrap">
              Guardian Information
            </h2>
            <div className="form-control w-full md:w-1/3">
              <input
                placeholder="Search guardian..."
                className="input input-bordered w-full focus:outline-none"
                type="text"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-user text-sm"></i>
                  First Name <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="text"
                name="guardian_first_name"
                placeholder="First Name"
                className="input input-bordered w-full focus:outline-none"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-user-pen text-sm"></i>
                  Middle Name
                </span>
              </label>
              <input
                type="text"
                name="guardian_middle_name"
                placeholder="Middle Name"
                className="input input-bordered w-full focus:outline-none"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-user-tag text-sm"></i>
                  Last Name <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="text"
                name="guardian_last_name"
                placeholder="Last Name"
                className="input input-bordered w-full focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-envelope text-sm"></i>
                  Email <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="email"
                name="guardian_email"
                placeholder="guardian@example.com"
                className="input input-bordered w-full focus:outline-none"
              />
            </div>
            <div className="form-control relative">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-lock text-sm"></i>
                  Password <span className="text-error">*</span>
                </span>
              </label>
              <input
                type={showGuardianPassword ? "password" : "text"}
                name="guardian_password"
                placeholder="Password"
                className="input input-bordered w-full pr-10 focus:outline-none"
              />
              <button
                type="button"
                className="passwordEyes text-gray-500"
                onClick={handleShowGuardianPassword}
              >
                <i
                  className={`fa-solid ${
                    showGuardianPassword ? "fa-eye-slash" : "fa-eye"
                  }`}
                ></i>
              </button>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-user-shield text-sm"></i>
                  Guardian Type <span className="text-error">*</span>
                </span>
              </label>
              <select
                name="guardian_type"
                className="select select-bordered w-full focus:outline-none cursor-pointer"
                value={selectedGuardianType}
                onChange={handleGuardianTypeChange}
              >
                <option value="">Select Guardian Type</option>
                {guardianTypes.map((guardianTy) => (
                  <option value={guardianTy.name} key={guardianTy.id}>
                    {guardianTy.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-phone text-sm"></i>
                  Phone Number <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="tel"
                name="guardian_phone_no"
                placeholder="Phone Number"
                className="input input-bordered w-full focus:outline-none"
              />
            </div>
          </div>
          {/* <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1">
                  <i className="fa-solid fa-camera text-sm"></i>
                  Guardian Profile Photo
                </span>
              </label>
              <input
                type="file"
                name="guardian_user_profile"
                accept="image/*"
                className="file-input file-input-bordered w-full focus:outline-none"
              />
            </div>
          </div> */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-money-bill-wave text-sm"></i>
                  Annual Income <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="number"
                name="guardian_annual_income"
                placeholder="Annual Income"
                className="input input-bordered w-full focus:outline-none"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-briefcase text-sm"></i>
                  Means of Livelihood
                </span>
              </label>
              <select
                name="guardian_means_of_livelihood"
                className="select select-bordered w-full focus:outline-none cursor-pointer"
              >
                <option value="">Select</option>
                <option value="Govt">Government</option>
                <option value="Non-Govt">Non-Government</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-graduation-cap text-sm"></i>
                  Qualification <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="text"
                name="guardian_qualification"
                placeholder="Qualification"
                className="input input-bordered w-full focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-briefcase text-sm"></i>
                  Occupation <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="text"
                name="guardian_occupation"
                placeholder="Occupation"
                className="input input-bordered w-full focus:outline-none"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-id-card text-sm"></i>
                  Designation
                </span>
              </label>
              <input
                type="text"
                name="guardian_designation"
                placeholder="Designation"
                className="input input-bordered w-full focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Academic Information Section */}
        <div className="bg-base-200 p-6 rounded-box mb-6">
          <h2 className="text-2xl font-bold mb-4">Academic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-graduation-cap text-sm"></i>
                  Year Level <span className="text-error">*</span>
                </span>
              </label>
              <select
                name="year_level"
                className="select select-bordered w-full focus:outline-none cursor-pointer"
              >
                <option value="">Select Year Level</option>
                {yearLevel.map((yearlev) => (
                  <option value={yearlev.level_name} key={yearlev.id}>
                    {yearlev.level_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-calendar text-sm"></i>
                  School Year <span className="text-error">*</span>
                </span>
              </label>
              <select
                name="school_year"
                className="select select-bordered w-full focus:outline-none cursor-pointer"
              >
                <option value="">Select School Year</option>
                {schoolYears.map((schoolYear) => (
                  <option value={schoolYear.year_name} key={schoolYear.id}>
                    {schoolYear.year_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-school text-sm"></i>
                  Previous School Name <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="text"
                name="previous_school_name"
                placeholder="Previous School Name"
                className="input input-bordered w-full focus:outline-none"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-book text-sm"></i>
                  Previous Class/Grade <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="text"
                name="previous_standard_studied"
                placeholder="Previous Class/Grade"
                className="input input-bordered w-full focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-calendar-check text-sm"></i>
                  Admission Date <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="date"
                name="admission_date"
                className="input input-bordered w-full focus:outline-none"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-file text-sm"></i>
                  TC Letter <span className="text-error">*</span>
                </span>
              </label>
              <select
                name="tc_letter"
                className="select select-bordered w-full focus:outline-none cursor-pointer"
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="not_applicable">Not applicable</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-phone text-sm"></i>
                  Emergency Contact <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="tel"
                name="emergency_contact_n0"
                placeholder="Emergency Contact"
                className="input input-bordered w-full focus:outline-none"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-road text-sm"></i>
                  Distance to School (km) <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="number"
                name="entire_road_distance_from_home_to_school"
                placeholder="Distance in km"
                className="input input-bordered w-full focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-marker text-sm"></i>
                  Marks Obtained <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="number"
                name="obtain_marks"
                placeholder="Marks Obtained"
                className="input input-bordered w-full focus:outline-none"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-chart-simple text-sm"></i>
                  Total Marks <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="number"
                name="total_marks"
                placeholder="Total Marks"
                className="input input-bordered w-full focus:outline-none"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-percent text-sm"></i>
                  Previous Percentage
                </span>
              </label>
              <input
                type="number"
                step="0.01"
                name="previous_percentage"
                placeholder="Percentage"
                className="input input-bordered w-full focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Address Information Section */}
        <div className="bg-base-200 p-6 rounded-box mb-6">
          <h2 className="text-2xl font-bold mb-4">Residential Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-home text-sm"></i>
                  House Number
                </span>
              </label>
              <input
                type="text"
                name="student_address_house_number"
                placeholder="House Number"
                className="input input-bordered w-full focus:outline-none"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-map-location text-sm"></i>
                  Habitation <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="text"
                name="student_address_habitation"
                placeholder="Habitation"
                className="input input-bordered w-full focus:outline-none"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-map text-sm"></i>
                  Ward Number
                </span>
              </label>
              <input
                type="text"
                name="student_address_ward_no"
                placeholder="Ward Number"
                className="input input-bordered w-full focus:outline-none"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-map-pin text-sm"></i>
                  Zone
                </span>
              </label>
              <input
                type="text"
                name="student_address_zone"
                placeholder="Zone"
                className="input input-bordered w-full focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-building text-sm"></i>
                  Block
                </span>
              </label>
              <input
                type="text"
                name="student_address_block"
                placeholder="Block"
                className="input input-bordered w-full focus:outline-none"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-map text-sm"></i>
                  District
                </span>
              </label>
              <input
                type="text"
                name="student_address_district"
                placeholder="District"
                className="input input-bordered w-full focus:outline-none"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-city text-sm"></i>
                  City <span className="text-error">*</span>
                </span>
              </label>
              <select
                name="student_address_city"
                className="select select-bordered w-full focus:outline-none"
              >
                <option value="">Select City</option>
                {city.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-map-signs text-sm"></i>
                  Division
                </span>
              </label>
              <input
                type="text"
                name="student_address_division"
                placeholder="Division"
                className="input input-bordered w-full focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-flag text-sm"></i>
                  State <span className="text-error">*</span>
                </span>
              </label>
              <select
                name="student_address_state"
                className="select select-bordered w-full focus:outline-none"
              >
                <option value="">Select State</option>
                {state.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-globe text-sm"></i>
                  Country <span className="text-error">*</span>
                </span>
              </label>
              <select
                name="student_address_country"
                className="select select-bordered w-full focus:outline-none"
              >
                <option value="">Select Country</option>
                {country.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-mailbox text-sm"></i>
                  Pin Code <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="number"
                name="student_address_pin_code"
                placeholder="Pin Code"
                maxLength={6}
                className="input input-bordered w-full focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 mt-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-location-dot text-sm"></i>
                  Full Address Line
                </span>
              </label>
              <textarea
                name="student_address_address_line"
                placeholder="Full Address"
                className="textarea textarea-bordered w-full focus:outline-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Bank Details Section */}
        <div className="bg-base-200 p-6 rounded-box mb-6">
          <h2 className="text-2xl font-bold mb-4">Bank Account Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-user text-sm"></i>
                  Account Holder Name <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="text"
                name="student_banking_holder_name"
                placeholder="Full Name as in Bank"
                className="input input-bordered w-full focus:outline-none"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-credit-card text-sm"></i>
                  Account Number <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="text"
                name="student_banking_account_no"
                placeholder="Account Number"
                className="input input-bordered w-full focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-building text-sm"></i>
                  Bank Name <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="text"
                name="student_banking_bank_name"
                placeholder="Bank Name"
                className="input input-bordered w-full focus:outline-none"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-code text-sm"></i>
                  IFSC Code <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="text"
                name="student_banking_ifsc_code"
                placeholder="IFSC Code"
                className="input input-bordered w-full focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-10">
          <button type="submit" className="btn btn-primary w-40">
            {loading ? (
              <i className="fa-solid fa-spinner fa-spin mr-2"></i>
            ) : (
              <i className="fa-solid fa-paper-plane mr-2"></i>
            )}
            {loading ? "" : "Register"}
          </button>
        </div>
      </form>
    </>
  );
};
