import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
import {
  validStudentFirstName,
  validStudentLastName,
  validStudentEmail,
  validStudentPassword,
  validDOB,
  validgender,
  validGuardianFatherName,
  validGuardianMotherName,
  validReligion,
  validCategory,
  validGuardianFirstName,
  validGuardianlastName,
  validGuardianEmail,
  validGuardianPassword,
  ValidGuardianType,
  validMobileNumber,
  validadmissiondate,
  validtc,
  validEmergencyNumber,
  validHabitation,
  validDistrict,
  validState,
  validPinCode,
  validAccountHolderName,
  validAccountNumber,
  validBankName,
  validIFSCcode,
} from "../../Validations/Validations";

export const AdmissionForm = () => {
  // const successModalRef = useRef(null);
  // const failureModalRef = useRef(null);
  // const navigate = useNavigate();

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

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
const onSubmit = async (data) => {
  setLoading(true);

  // Construct the data object
  const payload = {
    student_input: {
      first_name: data.student_first_name,
      middle_name: data.student_middle_name || "",
      last_name: data.student_last_name,
      email: data.student_email,
      password: data.student_password,
      father_name: data.student_father_name,
      mother_name: data.student_mother_name,
      date_of_birth: data.student_date_of_birth || null,
      gender: data.student_gender,
      religion: data.student_religion,
      category: data.student_category || null,
      height: data.student_height || null,
      weight: data.student_weight || null,
      blood_group: data.student_blood_group || "",
      number_of_siblings: data.student_number_of_siblings || null,
      classes: [],
    },
    guardian_input: {
      first_name: data.guardian_first_name,
      middle_name: data.guardian_middle_name || "",
      last_name: data.guardian_last_name,
      password: data.guardian_password,
      email: data.guardian_email,
      phone_no: data.guardian_phone_no,
      annual_income: data.guardian_annual_income || null,
      means_of_livelihood: data.guardian_means_of_livelihood || null,
      qualification: data.guardian_qualification,
      occupation: data.guardian_occupation,
      designation: data.guardian_designation || "",
    },
    address_input: {
      house_no: data.student_address_house_number || null,
      habitation: data.student_address_habitation,
      word_no: data.student_address_ward_no || null,
      zone_no: data.student_address_zone || null,
      block: data.student_address_block || "",
      district: data.student_address_district || "",
      division: data.student_address_division || "",
      area_code: data.student_address_pin_code || null,
      country: data.student_address_country || null,
      state: data.student_address_state || null,
      city: data.student_address_city || null,
      address_line: data.student_address_address_line || "",
    },
    banking_detail_input: {
      account_no: data.student_banking_account_no || null,
      ifsc_code: data.student_banking_ifsc_code,
      holder_name: data.student_banking_holder_name,
    },
    guardian_type_input: selectedGuardianType || null,
    year_level: data.year_level || null,
    school_year: data.school_year || null,
    previous_school_name: data.previous_school_name || "",
    previous_standard_studied: data.previous_standard_studied || "",
    tc_letter: data.tc_letter || "",
    emergency_contact_n0: data.emergency_contact_n0 || "",
    entire_road_distance_from_home_to_school: data.entire_road_distance_from_home_to_school || "",
    obtain_marks: data.obtain_marks || null,
    total_marks: data.total_marks || null,
    previous_percentage: data.previous_percentage || null,
  };

  // Create FormData
  const formData = new FormData();

  // Append files if they exist
  if (data.student_user_profile?.[0]) {
    formData.append("student_user_profile", data.student_user_profile[0]);
  }
  if (data.guardian_user_profile?.[0]) {
    formData.append("guardian_user_profile", data.guardian_user_profile[0]);
  }

  // Append all other fields as nested FormData entries
  Object.entries(payload.student_input).forEach(([key, value]) => {
    formData.append(`student_input[${key}]`, value !== null ? value : "");
  });

  Object.entries(payload.guardian_input).forEach(([key, value]) => {
    formData.append(`guardian_input[${key}]`, value !== null ? value : "");
  });

  Object.entries(payload.address_input).forEach(([key, value]) => {
    formData.append(`address_input[${key}]`, value !== null ? value : "");
  });

  Object.entries(payload.banking_detail_input).forEach(([key, value]) => {
    formData.append(`banking_detail_input[${key}]`, value !== null ? value : "");
  });

  // Append remaining fields
  formData.append("guardian_type_input", payload.guardian_type_input || "");
  formData.append("year_level", payload.year_level || "");
  formData.append("school_year", payload.school_year || "");
  formData.append("previous_school_name", payload.previous_school_name);
  formData.append("previous_standard_studied", payload.previous_standard_studied);
  formData.append("tc_letter", payload.tc_letter);
  formData.append("emergency_contact_n0", payload.emergency_contact_n0);
  formData.append(
    "entire_road_distance_from_home_to_school",
    payload.entire_road_distance_from_home_to_school
  );
  formData.append("obtain_marks", payload.obtain_marks || "");
  formData.append("total_marks", payload.total_marks || "");
  formData.append("previous_percentage", payload.previous_percentage || "");



  try {
    const response = await handleAdmissionForm(formData);
    console.log("Submission successful:", response);
    alert('Successfully submitted the form');
  } catch (error) {
    console.error("Submission error:", error.response?.data || error.message);
    alert('Failed to submit the form. Please try again.');
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <style>{constants.hideEdgeRevealStyle}</style>
      <form
        className="w-full max-w-6xl mx-auto p-6 bg-base-100 rounded-box my-5 shadow-sm focus:outline-none"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-3xl font-bold text-center mb-8">
          Fill your Details <i className="fa-solid fa-graduation-cap ml-2"></i>
        </h1>

        {/* Student Information Section */}
        <div className="bg-base-200 p-6 rounded-box mb-6">
          <h2 className="text-2xl font-bold mb-4">Student Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* First Name */}
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
                {...register("student_first_name", {
                  required: "First Name is required",
                  validate: (value) => validStudentFirstName(value) || true,
                })}
              />
              {errors.student_first_name && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.student_first_name.message}
                </span>
              )}
            </div>

            {/* Middle Name */}
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
                {...register("student_middle_name")}
              />
            </div>

            {/* Last Name */}
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
                {...register("student_last_name", {
                  required: "Last Name is required",
                  validate: (value) => validStudentLastName(value) || true,
                })}
              />
              {errors.student_last_name && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.student_last_name.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Email */}
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
                {...register("student_email", {
                  required: "Email is required",
                  validate: (value) => validStudentEmail(value) || true,
                })}
              />
              {errors.student_email && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.student_email.message}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="form-control relative">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-lock text-sm"></i>
                  Password <span className="text-error">*</span>
                </span>
                <div className="group relative ml-2 cursor-pointer">
                  <div className="relative group inline-block">
                    <i className="fa-solid fa-circle-info text-sm cursor-pointer"></i>
                    <div className="absolute left-1/2 -translate-x-1/2 -top-8 whitespace-nowrap bg-gray-800 text-white text-xs px-3 py-1 rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 z-10">
                      Password must be at least 8 characters, include one
                      letter, one number, and one special character
                    </div>
                  </div>
                </div>
              </label>
              <input
                type={showPassword ? "password" : "text"}
                name="student_password"
                placeholder="Password"
                className="input input-bordered w-full pr-10 focus:outline-none"
                {...register("student_password", {
                  required: "Password is required",
                  validate: (value) => validStudentPassword(value) || true,
                })}
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
              {errors.student_password && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.student_password.message}
                </span>
              )}
            </div>
          </div>

          {/* Student Profile Photo */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-6">
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
                {...register("student_user_profile")}
              />
              {errors.student_user_profile && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.student_user_profile.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Date of Birth */}
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
                {...register("student_date_of_birth", {
                  required: "Date of Birth is required",
                  validate: (value) => validDOB(value) || true,
                })}
              />
              {errors.student_date_of_birth && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.student_date_of_birth.message}
                </span>
              )}
            </div>

            {/* Gender */}
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
                {...register("student_gender", {
                  required: "Gender is required",
                  validate: (value) => validgender(value) || true,
                })}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.student_gender && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.student_gender.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Father's Name */}
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
                {...register("student_father_name", {
                  required: "Father's Name is required",
                  validate: (value) => validGuardianFatherName(value) || true,
                })}
              />
              {errors.student_father_name && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.student_father_name.message}
                </span>
              )}
            </div>

            {/* Mother's Name */}
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
                {...register("student_mother_name", {
                  required: "Mother's Name is required",
                  validate: (value) => validGuardianMotherName(value) || true,
                })}
              />
              {errors.student_mother_name && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.student_mother_name.message}
                </span>
              )}
            </div>

            {/* Religion */}
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
                {...register("student_religion", {
                  required: "Religion is required",
                  validate: (value) => validReligion(value) || true,
                })}
              />
              {errors.student_religion && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.student_religion.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
            {/* Category */}
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
                {...register("student_category", {
                  required: "Category is required",
                  validate: (value) => validCategory(value) || true,
                })}
              >
                <option value="">Select Category</option>
                <option value="GEN">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
              </select>
              {errors.student_category && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.student_category.message}
                </span>
              )}
            </div>

            {/* Height */}
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
                {...register("student_height")}
              />
            </div>

            {/* Weight */}
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
                {...register("student_weight")}
              />
            </div>

            {/* Blood Group */}
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
                {...register("student_blood_group")}
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
            {/* Number of Siblings */}
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
                {...register("student_number_of_siblings", { min: 0 })}
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
            {/* Guardian First Name */}
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
                {...register("guardian_first_name", {
                  required: "First Name is required",
                  validate: (value) => validGuardianFirstName(value) || true,
                })}
              />
              {errors.guardian_first_name && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.guardian_first_name.message}
                </span>
              )}
            </div>

            {/* Guardian Middle Name */}
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
                {...register("guardian_middle_name")}
              />
            </div>

            {/* Guardian Last Name */}
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
                {...register("guardian_last_name", {
                  required: "Last Name is required",
                  validate: (value) => validGuardianlastName(value) || true,
                })}
              />
              {errors.guardian_last_name && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.guardian_last_name.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Guardian Email */}
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
                {...register("guardian_email", {
                  required: "Email is required",
                  validate: (value) => validGuardianEmail(value) || true,
                })}
              />
              {errors.guardian_email && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.guardian_email.message}
                </span>
              )}
            </div>

            {/* Guardian Password */}
            <div className="form-control relative">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-lock text-sm"></i>
                  Password <span className="text-error">*</span>
                </span>
                <div className="group relative ml-2 cursor-pointer">
                  <div className="relative group inline-block">
                    <i className="fa-solid fa-circle-info text-sm cursor-pointer"></i>
                    <div className="absolute left-1/2 -translate-x-1/2 -top-8 whitespace-nowrap bg-gray-800 text-white text-xs px-3 py-1 rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 z-10">
                      Password must be at least 8 characters, include one
                      letter, one number, and one special character
                    </div>
                  </div>
                </div>
              </label>
              <input
                type={showGuardianPassword ? "password" : "text"}
                name="guardian_password"
                placeholder="Password"
                className="input input-bordered w-full pr-10 focus:outline-none"
                {...register("guardian_password", {
                  required: "Password is required",
                  validate: (value) => validGuardianPassword(value) || true,
                })}
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
              {errors.guardian_password && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.guardian_password.message}
                </span>
              )}
            </div>

            {/* Guardian Type */}
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
                {...register("guardian_type", {
                  required: "Guardian Type is required",
                  validate: (value) => ValidGuardianType(value) || true,
                })}
                onChange={handleGuardianTypeChange}
              >
                <option value="">Select Guardian Type</option>
                {guardianTypes.map((guardianTy) => (
                  <option value={guardianTy.name} key={guardianTy.id}>
                    {guardianTy.name}
                  </option>
                ))}
              </select>
              {errors.guardian_type && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.guardian_type.message}
                </span>
              )}
            </div>

            {/* Phone Number */}
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
                {...register("guardian_phone_no", {
                  required: "Phone Number is required",
                  validate: (value) => validMobileNumber(value) || true,
                })}
              />
              {errors.guardian_phone_no && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.guardian_phone_no.message}
                </span>
              )}
            </div>
          </div>

          {/* Guardian Profile Photo */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-6">
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
                {...register("guardian_user_profile")}
              />
              {errors.guardian_user_profile && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.guardian_user_profile.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Annual Income */}
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
                {...register("guardian_annual_income", {
                  required: "Annual Income is required",
                  valueAsNumber: true,
                  validate: (value) =>
                    Number.isInteger(Number(value)) ||
                    "A valid integer is required",
                })}
              />
              {errors.guardian_annual_income && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.guardian_annual_income.message}
                </span>
              )}
            </div>

            {/* Means of Livelihood */}
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
                {...register("guardian_means_of_livelihood")}
              >
                <option value="">Select</option>
                <option value="Govt">Government</option>
                <option value="Non-Govt">Non-Government</option>
              </select>
            </div>

            {/* Qualification */}
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
                {...register("guardian_qualification", {
                  required: "Qualification is required",
                })}
              />
              {errors.guardian_qualification && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.guardian_qualification.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Occupation */}
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
                {...register("guardian_occupation", {
                  required: "Occupation is required",
                })}
              />
              {errors.guardian_occupation && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.guardian_occupation.message}
                </span>
              )}
            </div>

            {/* Designation */}
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
                {...register("guardian_designation")}
              />
            </div>
          </div>
        </div>

        {/* Academic Information Section */}
        <div className="bg-base-200 p-6 rounded-box mb-6">
          <h2 className="text-2xl font-bold mb-4">Academic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Year Level */}
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
                {...register("year_level", {
                  required: "Year Level is required",
                })}
              >
                <option value="">Select Year Level</option>
                {yearLevel.map((yearlev) => (
                  <option value={yearlev.level_name} key={yearlev.id}>
                    {yearlev.level_name}
                  </option>
                ))}
              </select>
              {errors.year_level && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.year_level.message}
                </span>
              )}
            </div>

            {/* School Year */}
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
                {...register("school_year", {
                  required: "School Year is required",
                })}
              >
                <option value="">Select School Year</option>
                {schoolYears.map((schoolYear) => (
                  <option value={schoolYear.year_name} key={schoolYear.id}>
                    {schoolYear.year_name}
                  </option>
                ))}
              </select>
              {errors.school_year && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.school_year.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Previous School Name */}
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
                {...register("previous_school_name", {
                  required: "Previous School Name is required",
                })}
              />
              {errors.previous_school_name && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.previous_school_name.message}
                </span>
              )}
            </div>

            {/* Previous Class/Grade */}
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
                {...register("previous_standard_studied", {
                  required: "Previous Class/Grade is required",
                })}
              />
              {errors.previous_standard_studied && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.previous_standard_studied.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Admission Date */}
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
                {...register("admission_date", {
                  required: "Admission Date is required",
                  validate: (value) => validadmissiondate(value) || true,
                })}
              />
              {errors.admission_date && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.admission_date.message}
                </span>
              )}
            </div>

            {/* TC Letter */}
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
                {...register("tc_letter", {
                  required: "TC Letter is required",
                  validate: (value) => validtc(value) || true,
                })}
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="not_applicable">Not applicable</option>
              </select>
              {errors.tc_letter && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.tc_letter.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Emergency Contact */}
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
                {...register("emergency_contact_n0", {
                  required: "Emergency Contact is required",
                  validate: (value) => validEmergencyNumber(value) || true,
                })}
              />
              {errors.emergency_contact_n0 && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.emergency_contact_n0.message}
                </span>
              )}
            </div>

            {/* Distance to School */}
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
                {...register("entire_road_distance_from_home_to_school", {
                  required: "Distance to School is required",
                  valueAsNumber: true,
                  min: { value: 0, message: "Distance cannot be negative" },
                })}
              />
              {errors.entire_road_distance_from_home_to_school && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.entire_road_distance_from_home_to_school.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Marks Obtained */}
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
                {...register("obtain_marks", {
                  required: "Marks Obtained is required",
                  valueAsNumber: true,
                  min: { value: 0, message: "Marks cannot be negative" },
                })}
              />
              {errors.obtain_marks && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.obtain_marks.message}
                </span>
              )}
            </div>

            {/* Total Marks */}
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
                {...register("total_marks", {
                  required: "Total Marks is required",
                  valueAsNumber: true,
                  min: { value: 0, message: "Marks cannot be negative" },
                })}
              />
              {errors.total_marks && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.total_marks.message}
                </span>
              )}
            </div>

            {/* Previous Percentage */}
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
                {...register("previous_percentage", {
                  valueAsNumber: true,
                  min: { value: 0, message: "Percentage cannot be negative" },
                  max: { value: 100, message: "Percentage cannot exceed 100" },
                })}
              />
              {errors.previous_percentage && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.previous_percentage.message}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Address Information Section */}
        <div className="bg-base-200 p-6 rounded-box mb-6">
          <h2 className="text-2xl font-bold mb-4">Residential Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* House Number */}
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
                {...register("student_address_house_number")}
              />
            </div>

            {/* Habitation */}
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
                {...register("student_address_habitation", {
                  required: "Habitation is required",
                  validate: (value) => validHabitation(value) || true,
                })}
              />
              {errors.student_address_habitation && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.student_address_habitation.message}
                </span>
              )}
            </div>

            {/* Ward Number */}
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
                {...register("student_address_ward_no")}
              />
            </div>

            {/* Zone */}
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
                {...register("student_address_zone")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Block */}
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
                {...register("student_address_block")}
              />
            </div>

            {/* City */}
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
                {...register("student_address_city", {
                  required: "City is required",
                })}
              >
                <option value="">Select City</option>
                {city.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
              {errors.student_address_city && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.student_address_city.message}
                </span>
              )}
            </div>

            {/* Division */}
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
                {...register("student_address_division")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* State */}
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
                {...register("student_address_state", {
                  required: "State is required",
                })}
              >
                <option value="">Select State</option>
                {state.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
              {errors.student_address_state && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.student_address_state.message}
                </span>
              )}
            </div>

            {/* Country */}
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
                {...register("student_address_country", {
                  required: "Country is required",
                })}
              >
                <option value="">Select Country</option>
                {country.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
              {errors.student_address_country && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.student_address_country.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Pin Code */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-mailbox text-sm"></i>
                  Pin Code <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="text"
                name="student_address_pin_code"
                placeholder="Pin Code"
                maxLength={6}
                className="input input-bordered w-full focus:outline-none"
                {...register("student_address_pin_code", {
                  required: "Pin Code is required",
                  validate: (value) => validPinCode(value) || true,
                })}
              />
              {errors.student_address_pin_code && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.student_address_pin_code.message}
                </span>
              )}
            </div>
          </div>

          {/* Address Line */}
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
                {...register("student_address_address_line")}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Bank Details Section */}
        <div className="bg-base-200 p-6 rounded-box mb-6">
          <h2 className="text-2xl font-bold mb-4">Bank Account Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Account Holder Name */}
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
                {...register("student_banking_holder_name", {
                  required: "Account Holder Name is required",
                  validate: (value) => validAccountHolderName(value) || true,
                })}
              />
              {errors.student_banking_holder_name && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.student_banking_holder_name.message}
                </span>
              )}
            </div>

            {/* Account Number */}
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
                {...register("student_banking_account_no", {
                  required: "Account Number is required",
                  validate: (value) => validAccountNumber(value) || true,
                })}
              />
              {errors.student_banking_account_no && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.student_banking_account_no.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Bank Name */}
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
                {...register("student_banking_bank_name", {
                  required: "Bank Name is required",
                  validate: (value) => validBankName(value) || true,
                })}
              />
              {errors.student_banking_bank_name && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.student_banking_bank_name.message}
                </span>
              )}
            </div>

            {/* IFSC Code */}
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
                {...register("student_banking_ifsc_code", {
                  required: "IFSC Code is required",
                  validate: (value) => validIFSCcode(value) || true,
                })}
              />
              {errors.student_banking_ifsc_code && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.student_banking_ifsc_code.message}
                </span>
              )}
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
