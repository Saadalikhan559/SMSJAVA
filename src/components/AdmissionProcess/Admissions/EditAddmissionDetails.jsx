import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchAdmissionDetailsById,
  fetchCity,
  fetchCountry,
  fetchGuardianType,
  fetchSchoolYear,
  fetchState,
  fetchYearLevels,
  handleEditAdmissionForm,
} from "../../../services/api/Api";
import { constants } from "../../../global/constants";

export const EditAddmissionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [yearLevel, setYearLevel] = useState([]);
  const [schoolYears, setSchoolYear] = useState([]);
  const [guardianTypes, setGuardianType] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGuardianType, setSelectedGuardianType] = useState("");
  const [country, setCountry] = useState([]);
  const [state, setState] = useState([]);
  const [city, setCity] = useState([]);
  const [formData, setFormData] = useState(null);
  const [isRTE, setIsRTE] = useState(false);
  const [rteNumber, setRteNumber] = useState("");
  const formRef = useRef(null);

  const handleGuardianTypeChange = (e) => {
    setSelectedGuardianType(e.target.value);
  };

  const handleRTECheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setIsRTE(isChecked);
    if (!isChecked) {
      setRteNumber("");
    }
  };

  const handleRTENumberChange = (e) => {
    setRteNumber(e.target.value);
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

  const getAdmissionData = async () => {
    try {
      const response = await fetchAdmissionDetailsById(id);
      if (!response) {
        throw new Error("No response received from API");
      }

      const countries = await fetchCountry();
      const states = await fetchState();
      const cities = await fetchCity();

      const countryObj = countries.find(
        (c) => c.name === response.address.country_name
      );
      const stateObj = states.find(
        (s) => s.name === response.address.state_name
      );
      const cityObj = cities.find((c) => c.name === response.address.city_name);

      const transformedData = {
        ...response,
        student: response.student_input,
        guardian: response.guardian_input,
        address: {
          ...response.address,
          country: countryObj?.id || null,
          state: stateObj?.id || null,
          city: cityObj?.id || null,
          country_name: response.address.country_name,
          state_name: response.address.state_name,
          city_name: response.address.city_name,
        },
        banking_detail: response.banking_detail,
        guardian_type: response.guardian_type,
      };

      setFormData(transformedData);
      setSelectedGuardianType(response.guardian_type || "");
      setIsRTE(response.is_rte || false);
      setRteNumber(response.rte_number || "");
    } catch (error) {
      console.error("Error fetching admission details:", error);
    }
  };

  useEffect(() => {
    getYearLevels();
    getSchoolYears();
    getGuardianType();
    getCountry();
    getState();
    getCity();
    getAdmissionData();
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(formRef.current);

    const payload = {
      student: {
        first_name: formData.get("student_first_name") || "",
        middle_name: formData.get("student_middle_name") || "",
        last_name: formData.get("student_last_name") || "",
        email: formData.get("student_email") || "",
        father_name: formData.get("student_father_name") || "",
        mother_name: formData.get("student_mother_name") || "",
        date_of_birth: formData.get("student_date_of_birth") || null,
        gender: formData.get("student_gender") || "",
        religion: formData.get("student_religion") || "",
        category: formData.get("student_category") || null,
        height: parseFloat(formData.get("student_height")) || null,
        weight: parseFloat(formData.get("student_weight")) || null,
        blood_group: formData.get("student_blood_group") || "",
        number_of_siblings: formData.get("student_number_of_siblings") || 0,
      },
      guardian: {
        first_name: formData.get("guardian_first_name") || "",
        middle_name: formData.get("guardian_middle_name") || "",
        last_name: formData.get("guardian_last_name") || "",
        email: formData.get("guardian_email") || "",
        phone_no: formData.get("guardian_phone_no") || "",
        annual_income:
          parseFloat(formData.get("guardian_annual_income")) || null,
        means_of_livelihood:
          formData.get("guardian_means_of_livelihood") || null,
        qualification: formData.get("guardian_qualification") || "",
        occupation: formData.get("guardian_occupation") || "",
        designation: formData.get("guardian_designation") || "",
      },
      address_input: {
        house_no:
          parseInt(formData.get("student_address_house_number")) || null,
        habitation: formData.get("student_address_habitation") || "",
        ward_no: parseInt(formData.get("student_address_ward_no")) || null,
        zone_no: parseInt(formData.get("student_address_zone")) || null,
        block: formData.get("student_address_block") || "",
        district: formData.get("student_address_district") || "",
        division: formData.get("student_address_division") || "",
        area_code: parseInt(formData.get("student_address_pin_code")) || null,
        country: formData.get("student_address_country") || null,
        state: formData.get("student_address_state") || null,
        city: formData.get("student_address_city") || null,
        address_line: formData.get("student_address_address_line") || "",
      },
      banking_detail_input: {
        account_no: formData.get("student_banking_account_no") || null,
        ifsc_code: formData.get("student_banking_ifsc_code") || "",
        holder_name: formData.get("student_banking_holder_name") || "",
      },
      guardian_type_input: selectedGuardianType || null,
      year_level: formData.get("year_level") || null,
      school_year: formData.get("school_year") || null,
      admission_date: formData.get("admission_date") || null,
      previous_school_name: formData.get("previous_school_name") || "",
      previous_standard_studied:
        formData.get("previous_standard_studied") || "",
      tc_letter: formData.get("tc_letter") || "",
      emergency_contact_no: formData.get("emergency_contact_no") || "",
      entire_road_distance_from_home_to_school:
        formData.get("entire_road_distance_from_home_to_school") || "",
      obtain_marks: parseFloat(formData.get("obtain_marks")) || null,
      total_marks: parseFloat(formData.get("total_marks")) || null,
      is_rte: isRTE,
      rte_number: isRTE ? rteNumber : "",
    };

    const submitFormData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (
        typeof value === "object" &&
        value !== null &&
        !(value instanceof File)
      ) {
        Object.entries(value).forEach(([subKey, subValue]) => {
          submitFormData.append(
            `${key}[${subKey}]`,
            subValue !== null ? subValue : ""
          );
        });
      } else {
        submitFormData.append(key, value !== null ? value : "");
      }
    });

    if (formData.get("student_user_profile")) {
      submitFormData.append(
        "student[user_profile]",
        formData.get("student_user_profile")
      );
    }
    if (formData.get("guardian_user_profile")) {
      submitFormData.append(
        "guardian[user_profile]",
        formData.get("guardian_user_profile")
      );
    }

    try {
      await handleEditAdmissionForm(submitFormData, id);
      navigate("/addmissionDetails");
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message);
      alert(
        `Failed to update the form: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  if (!formData) {
    return (
      <div className="text-center py-10">Loading admission details...</div>
    );
  }

  return (
    <>
      <style>{constants.hideEdgeRevealStyle}</style>
      <form
        ref={formRef}
        className="w-full max-w-6xl mx-auto p-6 bg-base-100 rounded-box my-5 shadow-sm focus:outline-none"
        onSubmit={onSubmit}
      >
        <h1 className="text-3xl font-bold text-center mb-8">
          Edit Admission Details{" "}
          <i className="fa-solid fa-pen-to-square ml-2"></i>
        </h1>

        {/* Student Information Section */}
        <div className="bg-base-200 p-6 rounded-box mb-6">
          <h2 className="text-2xl font-bold mb-4">Student Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-1 mb-3">
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-child-reaching text-sm"></i>
                  Is RTE Student?
                </span>
                <input
                  type="checkbox"
                  onChange={handleRTECheckboxChange}
                  checked={isRTE}
                  className="checkbox checkbox-primary"
                  name="is_rte"
                />
              </label>
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
                name="student_first_name"
                placeholder="First Name"
                className="input input-bordered w-full focus:outline-none"
                defaultValue={formData.student?.first_name}
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
                defaultValue={formData.student?.middle_name}
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
                defaultValue={formData.student?.last_name}
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
                defaultValue={formData.student?.email}
              />
            </div>
          </div>
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
                defaultValue={formData.student?.date_of_birth}
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
                defaultValue={formData.student?.gender}
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
                defaultValue={formData.student?.father_name}
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
                defaultValue={formData.student?.mother_name}
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
                defaultValue={formData.student?.religion}
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
                defaultValue={formData.student?.category}
              >
                <option value="">Select Category</option>
                <option value="GEN">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
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
                defaultValue={formData.student?.height}
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
                defaultValue={formData.student?.weight}
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
                defaultValue={formData.student?.blood_group}
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
                defaultValue={formData.student?.number_of_siblings}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-people-group text-sm"></i>
                  RTE Number
                </span>
              </label>
              <input
                type="text"
                name="rte_number"
                placeholder="RTE Number"
                className={`input input-bordered w-full focus:outline-none ${
                  !isRTE ? "input-disabled bg-gray-200 cursor-not-allowed" : ""
                }`}
                value={rteNumber}
                onChange={handleRTENumberChange}
                disabled={!isRTE}
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
                defaultValue={formData.guardian?.first_name}
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
                defaultValue={formData.guardian?.middle_name}
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
                defaultValue={formData.guardian?.last_name}
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
                defaultValue={formData.guardian?.email}
              />
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
                defaultValue={formData.guardian?.phone_no}
              />
            </div>
          </div>
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
                defaultValue={formData.guardian?.annual_income}
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
                defaultValue={formData.guardian?.means_of_livelihood}
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
                defaultValue={formData.guardian?.qualification}
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
                defaultValue={formData.guardian?.occupation}
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
                defaultValue={formData.guardian?.designation}
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
                defaultValue={formData.year_level}
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
                defaultValue={formData.school_year}
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
                defaultValue={formData.previous_school_name}
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
                defaultValue={formData.previous_standard_studied}
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
                defaultValue={formData.admission_date}
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
                defaultValue={formData.tc_letter}
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
                name="emergency_contact_no"
                placeholder="Emergency Contact"
                className="input input-bordered w-full focus:outline-none"
                defaultValue={formData.emergency_contact_no}
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
                type="text"
                name="entire_road_distance_from_home_to_school"
                placeholder="Distance in km"
                className="input input-bordered w-full focus:outline-none"
                defaultValue={formData.entire_road_distance_from_home_to_school}
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
                defaultValue={formData.obtain_marks}
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
                defaultValue={formData.total_marks}
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
                defaultValue={formData.address?.house_no}
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
                defaultValue={formData.address?.habitation}
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
                defaultValue={formData.address?.ward_no}
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
                defaultValue={formData.address?.zone_no}
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
                defaultValue={formData.address?.block}
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
                defaultValue={formData.address?.district}
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
                defaultValue={formData.address?.city}
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
                defaultValue={formData.address?.division}
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
                defaultValue={formData.address?.state}
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
                defaultValue={formData.address?.country}
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
                defaultValue={formData.address?.area_code}
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
                defaultValue={formData.address?.address_line}
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
                defaultValue={formData.banking_detail?.holder_name}
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
                defaultValue={formData.banking_detail?.account_no}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
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
                defaultValue={formData.banking_detail?.ifsc_code}
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
              <i className="fa-solid fa-floppy-disk mr-2"></i>
            )}
            {loading ? "" : "Update"}
          </button>
        </div>
      </form>
    </>
  );
};