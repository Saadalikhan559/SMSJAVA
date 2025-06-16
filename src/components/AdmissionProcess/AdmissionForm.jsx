import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  fetchGuardianType,
  fetchSchoolYear,
  fetchYearLevels,
  handleAdmissionForm,
} from "../../services/api/Api";
import { constants } from "../../global/constants";
import {
  validStudentFirstName, validStudentLastName, validStudentEmail, validStudentPassword, validDOB, validgender,
  validGuardianFatherName, validGuardianMotherName, validReligion, validCategory, validGuardianFirstName, validGuardianlastName, validGuardianEmail,
  validGuardianPassword, ValidGuardianType, validMobileNumber, validAdmissiondate, validtc,
  validEmergencyNumber,  validHabitation, validDistrict, validState, validPinCode, validAccountHolderName,
  validAccountNumber, validBankName, validIFSCcode
} from "../../Validations/Validations";


export const AdmissionForm = () => {
  const successModalRef = useRef(null);
  const failureModalRef = useRef(null);
  const navigate = useNavigate();

  const [yearLevel, setYearLevel] = useState([]);
  const [schoolYears, setSchoolYear] = useState([]);
  const [guardianTypes, setGuardianType] = useState([]);
  const [showPassword, setShowPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedGuardianType, setSelectedGuardianType] = useState("");
  const [showGuardianPassword, setShowGuardianPassword] = useState(true);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowGuardianPassword = () => {
    setShowGuardianPassword(!showGuardianPassword);
  };

  const [formData, setFormData] = useState({
    student: {
      first_name: "",
      middle_name: "",
      last_name: "",
      email: "",
      user_profile: null,
      password: "",
      date_of_birth: "",
      gender: "",
      father_name: "",
      mother_name: "",
      religion: "",
      category: "",
      height: "",
      weight: "",
      blood_group: "",
      number_of_siblings: "",
      address: {
        house_number: "",
        habitation: "",
        ward_no: "",
        zone: "",
        block: "",
        district: "",
        division: "",
        state: "",
        pin_code: "",
        address_line: ""
      },
      banking_detail: {
        account_no: "",
        ifsc_code: "",
        holder_name: ""
      }
    },
    guardian: {
      first_name: "",
      middle_name: "",
      last_name: "",
      email: "",
      user_profile: null,
      password: "",
      phone_no: "",
      annual_income: "",
      means_of_livelihood: "",
      qualification: "",
      occupation: "",
      designation: ""
    },
    admission_date: "",
    previous_school_name: "",
    previous_standard_studied: "",
    tc_letter: "",
    year_level: "",
    school_year: "",
    emergency_contact_n0: "",
    entire_road_distance_from_home_to_school: "",
    obtain_marks: "",
    total_marks: "",
    previous_percentage: ""
  });

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (name === "student_user_profile") {
      setFormData(prev => ({
        ...prev,
        student: {
          ...prev.student,
          user_profile: file,
        },
      }));
    } else if (name === "guardian_user_profile") {
      setFormData(prev => ({
        ...prev,
        guardian: {
          ...prev.guardian,
          user_profile: file,
        },
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle student address fields
    if (name.startsWith("student_address_")) {
      const fieldName = name.replace("student_address_", "");
      setFormData(prev => ({
        ...prev,
        student: {
          ...prev.student,
          address: {
            ...prev.student.address,
            [fieldName]: value
          }
        }
      }));
    }
    // Handle student banking fields

    else if (name.startsWith("student_banking_")) {
      const fieldName = name.replace("student_banking_", "");
      setFormData(prev => ({
        ...prev,
        student: {
          ...prev.student,
          banking_detail: {
            ...prev.student.banking_detail,
            [fieldName]: value
          }
        }
      }));
    }
    // Handle student fields

    else if (name.startsWith("student_")) {
      const fieldName = name.replace("student_", "");
      setFormData(prev => ({
        ...prev,
        student: {
          ...prev.student,
          [fieldName]: value,
        },
      }));
    }
    // Handle guardian fields

    else if (name.startsWith("guardian_")) {
      const fieldName = name.replace("guardian_", "");
      setFormData(prev => ({
        ...prev,
        guardian: {
          ...prev.guardian,
          [fieldName]: value,
        },
      }));
    }
    // Handle all other top-level fields

    else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleGuardianTypeChange = (e) => {
    setSelectedGuardianType(e.target.value);
  };

  // API fetch functions remain the same
  // ...


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

  useEffect(() => {
    getYearLevels();
    getSchoolYears();
    getGuardianType();
  }, []);
  const onSubmit = async () => {

    setLoading(true);

    const values = getValues();
    const formDataToSend = new FormData();

    // Merge the form values into formData
    setFormData(prev => ({
      ...prev,
      student: {
        ...prev.student,
        first_name: values.student_first_name,
      },
    }));
    // Append student fields

    Object.entries(formData.student).forEach(([key, value]) => {
      if (key === 'address' || key === 'banking_detail') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          formDataToSend.append(`student.${key}.${subKey}`, subValue);
        });
      } else if (key !== 'user_profile') {
        formDataToSend.append(`student.${key}`, value);
      }
    });

    if (formData.student.user_profile) {
      formDataToSend.append('student.user_profile', formData.student.user_profile);
    }
    // Append guardian fields

    Object.entries(formData.guardian).forEach(([key, value]) => {
      if (key !== 'user_profile') {
        formDataToSend.append(`guardian.${key}`, value);
      }
    });

    if (formData.guardian.user_profile) {
      formDataToSend.append('guardian.user_profile', formData.guardian.user_profile);
    }
    // Append other top-level fields

    const topLevelFields = [
      'admission_date', 'previous_school_name', 'previous_standard_studied',
      'tc_letter', 'year_level', 'school_year', 'emergency_contact_n0',
      'entire_road_distance_from_home_to_school', 'obtain_marks',
      'total_marks', 'previous_percentage'
    ];

    topLevelFields.forEach(field => {
      formDataToSend.append(field, formData[field]);
    });

    formDataToSend.append('guardian_type', selectedGuardianType);

    try {
      await handleAdmissionForm(formDataToSend);

    } catch (error) {
      console.error("Submission error:", error.response?.data || error.message);
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
                  validate: (value) => {
                    const msg = validStudentFirstName(value);
                    return msg === "" || msg;
                  },
                })}
              />
              {errors.student_first_name && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.student_first_name.message || errors.student_first_name}
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
                value={formData.student.middle_name}
                onChange={handleChange}

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
                  validate: (value) => {
                    const msg = validStudentLastName(value);
                    return msg === "" || msg;
                  },
                })}

              />
              {errors.student_last_name && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.student_last_name.message || errors.student_last_name}
                </span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 ">

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
                  validate: (value) => {
                    const msg = validStudentEmail(value);
                    return msg === "" || msg;
                  },
                })}
              />
              {errors.student_email && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.student_email.message || errors.student_email}
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
                      Password must be at least 8 characters, include one letter, one number, and one special character
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
                  validate: (value) => {
                    const msg = validStudentPassword(value);
                    return msg === "" || msg;
                  },
                })}
              />
              {errors.student_password && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.student_password.message || errors.student_password}
                </span>
              )}
              <button
                type="button"
                className="passwordEyes text-gray-500"
                onClick={handleShowPassword}
              >
                <i
                  className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                ></i>
              </button>
            </div>
          </div>


          {/* Student Profile Photo */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1">
                  <i className="fa-solid fa-camera text-sm"></i>
                  Student Profile Photo <span className="text-error"></span>
                </span>
              </label>
              <input
                type="file"
                name="student_user_profile"
                accept="image/*"
                className="file-input file-input-bordered w-full focus:outline-none"
                onChange={handleFileChange}
              />

              {formData.student.user_profile && (
                <div className="mt-2 text-sm">
                  Selected: {formData.student.user_profile.name}
                </div>
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
                className="input input-bordered w-full focus:outline-none scroll-smooth "
                {...register("student_date_of_birth", {
                  validate: (value) => {
                    const msg = validDOB(value);
                    return msg === "" || msg;
                  },
                })}
              />
              {errors.student_date_of_birth && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.student_date_of_birth.message || errors.student_date_of_birth}
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
                {...register("gender", {
                  validate: (value) => {
                    const msg = validgender(value);
                    return msg === "" || msg;
                  },
                })}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.gender.message || errors.gender}
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
                {...register("guardian_Father_name", {
                  validate: (value) => {
                    const msg = validGuardianFatherName(value);
                    return msg === "" || msg;
                  },
                })}


              />
              {errors.guardian_Father_name && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.guardian_Father_name.message || errors.guardian_Father_name}
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
                {...register("guardian_mother_name", {
                  validate: (value) => {
                    const msg = validGuardianMotherName(value);
                    return msg === "" || msg;
                  },
                })}
              />
              {errors.guardian_mother_name && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.guardian_mother_name.message || errors.guardian_mother_name}
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
                {...register("Religion", {
                  validate: (value) => {
                    const msg = validReligion(value);
                    return msg === "" || msg;
                  },
                })}
              />
              {errors.Religion && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.Religion.message || errors.Religion}
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
                 {...register("Category", {
                  validate: (value) => {
                    const msg =  validCategory(value);
                    return msg === "" || msg;
                  },
                })}
              >
                <option value="">Select Category</option>
                <option value="GEN">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
              </select>
               {errors.Category && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.Category.message || errors.Category}
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
                value={formData.student.height}
                onChange={handleChange}
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
                value={formData.student.weight}
                onChange={handleChange}
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
                value={formData.student.blood_group}
                onChange={handleChange}
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
                value={formData.student.number_of_siblings}
                onChange={handleChange}
                min={0}
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
                name="guardian_first_name"
                placeholder="First Name"
                className="input input-bordered w-full focus:outline-none"
                {...register("guardian_First_name", {
                  validate: (value) => {
                    const msg = validGuardianFirstName(value);
                    return msg === "" || msg;
                  },
                })}
              />
              {errors.guardian_First_name && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.guardian_First_name.message || errors.guardian_First_name}
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
                name="guardian_middle_name"
                placeholder="Middle Name"
                className="input input-bordered w-full focus:outline-none"
                value={formData.guardian.middle_name}
                onChange={handleChange}
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
                name="guardian_last_name"
                placeholder="Last Name"
                className="input input-bordered w-full focus:outline-none"
                {...register("guardian_last_name", {
                  validate: (value) => {
                    const msg = validGuardianlastName(value);
                    return msg === "" || msg;
                  },
                })}
              />
              {errors.guardian_last_name && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.guardian_last_name.message || errors.guardian_last_name}
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
                name="guardian_email"
                placeholder="guardian@example.com"
                className="input input-bordered w-full focus:outline-none"
                {...register("guardian_email", {
                  validate: (value) => {
                    const msg = validGuardianEmail(value);
                    return msg === "" || msg;
                  },
                })}
              />
              {errors.guardian_email && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.guardian_email.message || errors.guardian_email}
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
                      Password must be at least 8 characters, include one letter, one number, and one special character
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
                  validate: (value) => {
                    const msg = validGuardianPassword(value);
                    return msg === "" || msg;
                  },
                })}
              />
              {errors.guardian_password && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.guardian_password.message || errors.guardian_password}
                </span>
              )}
              <button
                type="button"
                className="passwordEyes text-gray-500"
                onClick={handleShowGuardianPassword}
              >
                <i
                  className={`fa-solid ${showGuardianPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                ></i>
              </button>
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
                className="select select-bordered w-full focus:outline-none cursor-pointer"
                {...register("GuardianType", {
                  validate: (value) => {
                    const msg = ValidGuardianType(value);
                    return msg === "" || msg;
                  },
                })}
              >
              
              
                <option value="">Select Guardian Type</option>
                {guardianTypes.map((guardianTy) => (
                  <option value={guardianTy.id} key={guardianTy.id}>
                    {guardianTy.name}
                  </option>
                ))}
              </select>
              {errors.GuardianType && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.GuardianType.message || errors.GuardianType}
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
                  validate: (value) => {
                    const msg = validMobileNumber(value);
                    return msg === "" || msg;
                  },
                })}
              />
              {errors.guardian_phone_no && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.guardian_phone_no.message || errors.guardian_phone_no}
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
                  Guardian Profile Photo <span className="text-error"></span>
                </span>
              </label>
              <input
                type="file"
                name="guardian_user_profile"
                accept="image/*"
                className="file-input file-input-bordered w-full focus:outline-none"
                onChange={handleFileChange}
              />

              {formData.guardian.user_profile && (
                <div className="mt-2 text-sm">
                  Selected: {formData.guardian.user_profile.name}
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Annual Income */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-money-bill-wave text-sm"></i>
                  Annual Income
                </span>
              </label>
              <input
                type="text"
                name="guardian_annual_income"
                placeholder="Annual Income"
                className="input input-bordered w-full focus:outline-none"
                value={formData.guardian.annual_income}
                onChange={handleChange}
              />
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
                required
                value={formData.guardian.means_of_livelihood}
                onChange={handleChange}


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
                  Qualification
                </span>
              </label>
              <input
                type="text"
                name="guardian_qualification"
                placeholder="Qualification"
                className="input input-bordered w-full focus:outline-none"
                value={formData.guardian.qualification}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Occupation */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-briefcase text-sm"></i>
                  Occupation
                </span>
              </label>
              <input
                type="text"
                name="guardian_occupation"
                placeholder="Occupation"
                className="input input-bordered w-full focus:outline-none"
                value={formData.guardian.occupation}
                onChange={handleChange}
              />
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
                value={formData.guardian.designation}
                onChange={handleChange}
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
                  Year Level <span className="text-error"></span>
                </span>
              </label>
              <select
                name="year_level"
                className="select select-bordered w-full focus:outline-none cursor-pointer"
                value={formData.year_level}
                onChange={handleChange}
              >
                <option value="">Select Year Level</option>
                {yearLevel.map((yearlev) => (
                  <option value={yearlev.id} key={yearlev.id}>
                    {yearlev.level_name}
                  </option>
                ))}
              </select>

            </div>
            {/* School Year */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-calendar text-sm"></i>
                  School Year <span className="text-error"></span>
                </span>
              </label>
              <select
                name="school_year"
                className="select select-bordered w-full focus:outline-none cursor-pointer"
                value={formData.school_year}
                onChange={handleChange}
              >
                <option value="">Select School Year</option>
                {schoolYears.map((schoolYear) => (
                  <option value={schoolYear.id} key={schoolYear.id}>
                    {schoolYear.year_name}
                  </option>
                ))}
              </select>

            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Previous School Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-school text-sm"></i>
                  Previous School Name
                </span>
              </label>
              <input
                type="text"
                name="previous_school_name"
                placeholder="Previous School Name"
                className="input input-bordered w-full focus:outline-none"
                value={formData.previous_school_name}
                onChange={handleChange}
              />
            </div>

            {/* Previous Class/Grade */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-book text-sm"></i>
                  Previous Class/Grade
                </span>
              </label>
              <input
                type="text"
                name="previous_standard_studied"
                placeholder="Previous Class/Grade"
                className="input input-bordered w-full focus:outline-none"
                value={formData.previous_standard_studied}
                onChange={handleChange}
              />
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
                className="input input-bordered w-full focus:outline-none scroll-smooth"
                {...register("Admission_date", {
                  validate: (value) => {
                    const msg = validAdmissiondate(value);
                    return msg === "" || msg;
                  },
                })}
              />
              {errors.Admission_date && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.Admission_date.message || errors.Admission_date}
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
                  validate: (value) => {
                    const msg = validtc(value);
                    return msg === "" || msg;
                  },
                })}
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="not_applicable">Not applicable</option>
              </select>
              {errors.tc_letter && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.tc_letter.message || errors.tc_letter}
                </span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Emergency Contact */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-phone-emergency text-sm"></i>
                  Emergency Contact <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="tel"
                name="emergency_contact_n0"
                placeholder="Emergency Contact"
                className="input input-bordered w-full focus:outline-none"
                {...register("Emergency_Number", {
                  validate: (value) => {
                    const msg = validEmergencyNumber(value);
                    return msg === "" || msg;
                  },
                })}
              />
              {errors.Emergency_Number && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.Emergency_Number.message || errors.Emergency_Number}
                </span>
              )}
            </div>
            {/* Distance to School */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-road text-sm"></i>
                  Distance to School (km)
                </span>
              </label>
              <input
                type="number"
                name="entire_road_distance_from_home_to_school"
                placeholder="Distance in km"
                className="input input-bordered w-full focus:outline-none"
                value={formData.entire_road_distance_from_home_to_school}
                onChange={handleChange}
                min={0}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Marks Obtained */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-marker text-sm"></i>
                  Marks Obtained
                </span>
              </label>
              <input
                type="number"
                name="obtain_marks"
                placeholder="Marks Obtained"
                className="input input-bordered w-full focus:outline-none"
                value={formData.obtain_marks}
                onChange={handleChange}
              />
            </div>
            {/* Total Marks */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-chart-simple text-sm"></i>
                  Total Marks
                </span>
              </label>
              <input
                type="number"
                name="total_marks"
                placeholder="Total Marks"
                className="input input-bordered w-full focus:outline-none"
                value={formData.total_marks}
                onChange={handleChange}
              />
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
                value={formData.previous_percentage}
                onChange={handleChange}
              />
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
                  House Number <span className="text-error"></span>
                </span>
              </label>
              <input
                type="text"
                name="student_address_house_number"
                placeholder="House Number"
                className="input input-bordered w-full focus:outline-none"
                value={formData.student.address.house_number}
                onChange={handleChange}



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
                {...register("Habitation", {
                  validate: (value) => {
                    const msg = validHabitation(value);
                    return msg === "" || msg;
                  },
                })}
              />
              {errors.Habitation && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.Habitation.message || errors.Habitation}
                </span>
              )}
            </div>
            {/* Ward Number */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-map text-sm"></i>
                  Ward Number <span className="text-error"></span>
                </span>
              </label>
              <input
                type="text"
                name="student_address_ward_no"
                placeholder="Ward Number"
                className="input input-bordered w-full focus:outline-none"
                value={formData.student.address.ward_no}
                onChange={handleChange}
              />

            </div>
            {/* Zone */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-map-pin text-sm"></i>
                  Zone <span className="text-error"></span>
                </span>
              </label>
              <input
                type="text"
                name="student_address_zone"
                placeholder="Zone"
                className="input input-bordered w-full focus:outline-none"
                value={formData.student.address.zone}
                onChange={handleChange}
              />

            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Block */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-building text-sm"></i>
                  Block <span className="text-error"></span>
                </span>
              </label>
              <input
                type="text"
                name="student_address_block"
                placeholder="Block"
                className="input input-bordered w-full focus:outline-none"
                value={formData.student.address.block}
                onChange={handleChange}
              />

            </div>
            {/* District */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-city text-sm"></i>
                  District <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="text"
                name="student_address_district"
                placeholder="District"
                className="input input-bordered w-full focus:outline-none"
                {...register("District", {
                  validate: (value) => {
                    const msg = validDistrict(value);
                    return msg === "" || msg;
                  },
                })}
              />
              {errors.District && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.District.message || errors.District}
                </span>
              )}
            </div>
            {/* Division */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-map-signs text-sm"></i>
                  Division <span className="text-error"></span>
                </span>
              </label>
              <input
                type="text"
                name="student_address_division"
                placeholder="Division"
                className="input input-bordered w-full focus:outline-none"
                value={formData.student.address.division}
                onChange={handleChange}
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
              <input
                type="text"
                name="student_address_state"
                placeholder="State"
                className="input input-bordered w-full focus:outline-none"
                {...register("State", {
                  validate: (value) => {
                    const msg = validState(value);
                    return msg === "" || msg;
                  },
                })}
              />
              {errors.State && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.State.message || errors.State}
                </span>
              )}
            </div>
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
                {...register("Pin_Code", {
                  validate: (value) => {
                    const msg = validPinCode(value);
                    return msg === "" || msg;
                  },
                })}
              />
              {errors.Pin_Code && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.Pin_Code.message || errors.Pin_Code}
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
                value={formData.student.address.address_line}
                onChange={handleChange}
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
                {...register("Account_Holder_Name", {
                  validate: (value) => {
                    const msg = validAccountHolderName(value);
                    return msg === "" || msg;
                  },
                })}
              />
              {errors.Account_Holder_Name && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.Account_Holder_Name.message || errors.Account_Holder_Name}
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
                {...register("Account_Number", {
                  validate: (value) => {
                    const msg = validAccountNumber(value);
                    return msg === "" || msg;
                  },
                })}
              />
              {errors.Account_Number && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.Account_Number.message || errors.Account_Number}
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
                {...register("Bank_Name", {
                  validate: (value) => {
                    const msg = validBankName(value);
                    return msg === "" || msg;
                  },
                })}
              />
              {errors.Bank_Name && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.Bank_Name.message || errors.Bank_Name}
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
                {...register("IFSC_code", {
                  validate: (value) => {
                    const msg = validIFSCcode(value);
                    return msg === "" || msg;
                  },
                })}
              />
              {errors.IFSC_code && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.IFSC_code.message || errors.IFSC_code}
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
