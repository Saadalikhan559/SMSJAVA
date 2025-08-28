import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
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
import AdmissionEditedSuccessfully from "../../Modals/AdmissionEditedSuccessfully";

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
  const [showEditSuccessModal, setShowEditSuccessModal] = useState(false);
  const formRef = useRef(null);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
    resetField,
    trigger,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      student: {
        first_name: "",
        middle_name: "",
        last_name: "",
        email: "",
        father_name: "",
        mother_name: "",
        date_of_birth: "",
        gender: "male",
        religion: "",
        category: null,
        height: null,
        weight: null,
        blood_group: "",
        number_of_siblings: "",
      },
      guardian: {
        first_name: "",
        middle_name: "",
        last_name: "",
        email: "",
        phone_no: "",
        annual_income: "",
        means_of_livelihood: "",
        qualification: "",
        occupation: "",
        designation: "",
      },
      address_input: {
        house_no: "",
        habitation: "",
        ward_no: "",
        zone_no: "",
        block: "",
        district: "",
        division: "",
        area_code: "",
        country: "",
        state: "",
        city: "",
        address_line: "",
      },
      banking_detail_input: {
        account_no: "",
        ifsc_code: "",
        holder_name: "",
      },
      guardian_type_input: null,
      year_level: "",
      school_year: "",
      admission_date: "",
      previous_school_name: "",
      previous_standard_studied: "",
      tc_letter: "",
      emergency_contact_no: "",
      entire_road_distance_from_home_to_school: "",
      obtain_marks: "",
      total_marks: "",
      is_rte: false,
      rte_number: "",
    },
  });

  const handleGuardianTypeChange = (e) => {
    setSelectedGuardianType(e.target.value);
    setValue("guardian_type_input", e.target.value);
  };

  const handleRTECheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setIsRTE(isChecked);
    setValue("is_rte", isChecked);

    // Clear RTE number field when unchecked
    if (!isChecked) {
      resetField("rte_number");
      setRteNumber("");
    }
  };

  const handleRTENumberChange = (e) => {
    setRteNumber(e.target.value);
    setValue("rte_number", e.target.value);
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

      // Set form values
      if (response.student_input) {
        Object.entries(response.student_input).forEach(([key, value]) => {
          if (value !== null) {
            setValue(`student.${key}`, value);
          }
        });
      }

      if (response.guardian_input) {
        Object.entries(response.guardian_input).forEach(([key, value]) => {
          if (value !== null) {
            setValue(`guardian.${key}`, value);
          }
        });
      }

      if (response.address) {
        Object.entries(response.address).forEach(([key, value]) => {
          if (value !== null) {
            // Map the address fields correctly
            const formKey = key === 'area_code' ? 'area_code' :
              key === 'house_no' ? 'house_no' :
                key === 'ward_no' ? 'ward_no' :
                  key === 'zone_no' ? 'zone_no' : key;
            setValue(`address_input.${formKey}`, value);
          }
        });

        // Set the country, state, city IDs
        if (countryObj) setValue("address_input.country", countryObj.id);
        if (stateObj) setValue("address_input.state", stateObj.id);
        if (cityObj) setValue("address_input.city", cityObj.id);
      }

      if (response.banking_detail) {
        Object.entries(response.banking_detail).forEach(([key, value]) => {
          if (value !== null) {
            setValue(`banking_detail_input.${key}`, value);
          }
        });
      }

      // Set other fields
      if (response.year_level) setValue("year_level", response.year_level);
      if (response.school_year) setValue("school_year", response.school_year);
      if (response.admission_date) setValue("admission_date", response.admission_date);
      if (response.previous_school_name) setValue("previous_school_name", response.previous_school_name);
      if (response.previous_standard_studied) setValue("previous_standard_studied", response.previous_standard_studied);
      if (response.tc_letter) setValue("tc_letter", response.tc_letter);
      if (response.emergency_contact_no) setValue("emergency_contact_no", response.emergency_contact_no);
      if (response.entire_road_distance_from_home_to_school) setValue("entire_road_distance_from_home_to_school", response.entire_road_distance_from_home_to_school);
      if (response.obtain_marks) setValue("obtain_marks", response.obtain_marks);
      if (response.total_marks) setValue("total_marks", response.total_marks);
      if (response.is_rte) setValue("is_rte", response.is_rte);
      if (response.rte_number) setValue("rte_number", response.rte_number);
      if (response.student_input.gender) setValue("student.gender", response.student_input.gender.toLowerCase())
      if (response.guardian_type) {setValue("guardian_type_input", response.guardian_type.id); setSelectedGuardianType(response.guardian_type.id);}



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

  const handleCloseOnly = () => {
    setShowEditSuccessModal(false);
  };

  const handleCloseAndNavigate = () => {
    setShowEditSuccessModal(false);
    navigate("/addmissionDetails");
  };


  const onSubmit = async (data) => {
    setLoading(true);

    const payload = {
      student: {
        first_name: data.student.first_name || "",
        middle_name: data.student.middle_name || "",
        last_name: data.student.last_name || "",
        email: data.student.email || "",
        father_name: data.student.father_name || "",
        mother_name: data.student.mother_name || "",
        date_of_birth: data.student.date_of_birth || null,
        gender: data.student.gender || "",
        religion: data.student.religion || "",
        category: data.student.category || null,
        height: parseFloat(data.student.height) || null,
        weight: parseFloat(data.student.weight) || null,
        blood_group: data.student.blood_group || "",
        number_of_siblings: data.student.number_of_siblings || 0,
      },
      guardian: {
        first_name: data.guardian.first_name || "",
        middle_name: data.guardian.middle_name || "",
        last_name: data.guardian.last_name || "",
        email: data.guardian.email || "",
        phone_no: data.guardian.phone_no || "",
        annual_income: parseFloat(data.guardian.annual_income) || null,
        means_of_livelihood: data.guardian.means_of_livelihood || null,
        qualification: data.guardian.qualification || "",
        occupation: data.guardian.occupation || "",
        designation: data.guardian.designation || "",
      },
      address_input: {
        house_no: parseInt(data.address_input.house_no) || null,
        habitation: data.address_input.habitation || "",
        ward_no: parseInt(data.address_input.ward_no) || null,
        zone_no: parseInt(data.address_input.zone_no) || null,
        block: data.address_input.block || "",
        district: data.address_input.district || "",
        division: data.address_input.division || "",
        area_code: parseInt(data.address_input.area_code) || null,
        country: data.address_input.country || null,
        state: data.address_input.state || null,
        city: data.address_input.city || null,
        address_line: data.address_input.address_line || "",
      },
      banking_detail_input: {
        account_no: data.banking_detail_input.account_no || null,
        ifsc_code: data.banking_detail_input.ifsc_code || "",
        holder_name: data.banking_detail_input.holder_name || "",
      },
      guardian_type_input: data.guardian_type_input || null,
      year_level: data.year_level || null,
      school_year: data.school_year || null,
      admission_date: data.admission_date || null,
      previous_school_name: data.previous_school_name || "",
      previous_standard_studied: data.previous_standard_studied || "",
      tc_letter: data.tc_letter || "",
      emergency_contact_no: data.emergency_contact_no || "",
      entire_road_distance_from_home_to_school: data.entire_road_distance_from_home_to_school || "",
      obtain_marks: parseFloat(data.obtain_marks) || null,
      total_marks: parseFloat(data.total_marks) || null,
      is_rte: data.is_rte || false,
      rte_number: data.is_rte ? data.rte_number : "",
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

    // Handle file uploads if needed
    // if (data.student_user_profile) {
    //   submitFormData.append(
    //     "student[user_profile]",
    //     data.student_user_profile[0]
    //   );
    // }
    // if (data.guardian_user_profile) {
    //   submitFormData.append(
    //     "guardian[user_profile]",
    //     data.guardian_user_profile[0]
    //   );
    // }

    try {
      await handleEditAdmissionForm(submitFormData, id);
      setShowEditSuccessModal(true);
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message);
      alert(
        `Failed to update the form: ${error.response?.data?.message || error.message
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
        className="w-full max-w-7xl mx-auto p-6 bg-base-100 rounded-box my-5 shadow-sm focus:outline-none"
        onSubmit={handleSubmit(onSubmit)}
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
                  {...register("is_rte")}
                  onChange={handleRTECheckboxChange}
                  checked={isRTE}
                  className="checkbox checkbox-primary"
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
                {...register("student.first_name", {
                  required: "First name is required",
                  maxLength: {
                    value: 100,
                    message: "First name cannot exceed 100 characters",
                  },
                })}
                placeholder="First Name"
                className={`input input-bordered w-full focus:outline-none ${errors.student?.first_name ? "input-error" : ""
                  }`}
              />
              {errors.student?.first_name && (
                <span className="text-error text-sm">
                  {errors.student.first_name.message}
                </span>
              )}
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
                {...register("student.middle_name", {
                  maxLength: {
                    value: 100,
                    message: "Middle name cannot exceed 100 characters",
                  },
                })}
                placeholder="Middle Name"
                className="input input-bordered w-full focus:outline-none"
              />
              {errors.student?.middle_name && (
                <span className="text-error text-sm">
                  {errors.student.middle_name.message}
                </span>
              )}
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
                {...register("student.last_name", {
                  required: "Last name is required",
                  maxLength: {
                    value: 100,
                    message: "Last name cannot exceed 100 characters",
                  },
                })}
                placeholder="Last Name"
                className={`input input-bordered w-full focus:outline-none ${errors.student?.last_name ? "input-error" : ""
                  }`}
              />
              {errors.student?.last_name && (
                <span className="text-error text-sm">
                  {errors.student.last_name.message}
                </span>
              )}
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
                {...register("student.email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Invalid email format",
                  },
                })}
                placeholder="student@example.com"
                className={`input input-bordered w-full focus:outline-none ${errors.student?.email ? "input-error" : ""
                  }`}
              />
              {errors.student?.email && (
                <span className="text-error text-sm">
                  {errors.student.email.message}
                </span>
              )}
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
                {...register("student.date_of_birth", {
                  required: "Date of birth is required",
                })}
                className={`input input-bordered w-full focus:outline-none ${errors.student?.date_of_birth ? "input-error" : ""
                  }`}
              />
              {errors.student?.date_of_birth && (
                <span className="text-error text-sm">
                  {errors.student.date_of_birth.message}
                </span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-venus-mars text-sm"></i>
                  Gender <span className="text-error">*</span>
                </span>
              </label>
              <select
                {...register("student.gender", {
                  required: "Gender is required",
                })}
                className={`select select-bordered w-full focus:outline-none cursor-pointer ${errors.student?.gender ? "select-error" : ""
                  }`}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.student?.gender && (
                <span className="text-error text-sm">
                  {errors.student.gender.message}
                </span>
              )}
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
                {...register("student.father_name", {
                  required: "Father's name is required",
                  maxLength: {
                    value: 100,
                    message: "Father's name cannot exceed 100 characters",
                  },
                })}
                placeholder="Father's Name"
                className={`input input-bordered w-full focus:outline-none ${errors.student?.father_name ? "input-error" : ""
                  }`}
              />
              {errors.student?.father_name && (
                <span className="text-error text-sm">
                  {errors.student.father_name.message}
                </span>
              )}
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
                {...register("student.mother_name", {
                  required: "Mother's name is required",
                  maxLength: {
                    value: 100,
                    message: "Mother's name cannot exceed 100 characters",
                  },
                })}
                placeholder="Mother's Name"
                className={`input input-bordered w-full focus:outline-none ${errors.student?.mother_name ? "input-error" : ""
                  }`}
              />
              {errors.student?.mother_name && (
                <span className="text-error text-sm">
                  {errors.student.mother_name.message}
                </span>
              )}
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
                {...register("student.religion", {
                  required: "Religion is required",
                  maxLength: {
                    value: 100,
                    message: "Religion cannot exceed 100 characters",
                  },
                })}
                placeholder="Religion"
                className={`input input-bordered w-full focus:outline-none ${errors.student?.religion ? "input-error" : ""
                  }`}
              />
              {errors.student?.religion && (
                <span className="text-error text-sm">
                  {errors.student.religion.message}
                </span>
              )}
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
                {...register("student.category", {
                  required: "Category is required",
                })}
                className={`select select-bordered w-full focus:outline-none cursor-pointer ${errors.student?.category ? "select-error" : ""
                  }`}
              >
                <option value="">Select Category</option>
                <option value="GEN">General</option>
                <option value="OBC">Other Backward Class</option>
                <option value="SC">Scheduled Caste</option>
                <option value="ST">Scheduled Tribe</option>
              </select>
              {errors.student?.category && (
                <span className="text-error text-sm">
                  {errors.student.category.message}
                </span>
              )}
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
                {...register("student.height", {
                  min: { value: 0, message: "Height must be positive" },
                })}
                placeholder="Height"
                className={`input input-bordered w-full focus:outline-none ${errors.student?.height ? "input-error" : ""
                  }`}
              />
              {errors.student?.height && (
                <span className="text-error text-sm">
                  {errors.student.height.message}
                </span>
              )}
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
                {...register("student.weight", {
                  min: { value: 0, message: "Weight must be positive" },
                })}
                placeholder="Weight"
                className={`input input-bordered w-full focus:outline-none ${errors.student?.weight ? "input-error" : ""
                  }`}
              />
              {errors.student?.weight && (
                <span className="text-error text-sm">
                  {errors.student.weight.message}
                </span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-heart-pulse text-sm"></i>
                  Blood Group
                </span>
              </label>
              <select
                {...register("student.blood_group")}
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
                {...register("student.number_of_siblings", {
                  min: {
                    value: 0,
                    message: "Number of siblings cannot be negative",
                  },
                })}
                placeholder="Number of Siblings"
                className={`input input-bordered w-full focus:outline-none ${errors.student?.number_of_siblings ? "input-error" : ""
                  }`}
              />
              {errors.student?.number_of_siblings && (
                <span className="text-error text-sm">
                  {errors.student.number_of_siblings.message}
                </span>
              )}
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
                {...register("rte_number", {
                  required: isRTE
                    ? "RTE number is required for RTE students"
                    : false,
                  maxLength: {
                    value: 10,
                    message: "RTE number cannot exceed 10 characters",
                  },
                })}
                placeholder="RTE Number"
                className={`input input-bordered w-full focus:outline-none ${errors.rte_number ? "input-error" : ""
                  } ${!isRTE ? "input-disabled bg-gray-200 cursor-not-allowed" : ""}`}
                value={rteNumber}
                onChange={handleRTENumberChange}
                disabled={!isRTE}
              />
              {errors.rte_number && (
                <span className="text-error text-sm">
                  {errors.rte_number.message}
                </span>
              )}
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
                {...register("guardian.first_name", {
                  required: "First name is required",
                  maxLength: {
                    value: 100,
                    message: "First name cannot exceed 100 characters",
                  },
                })}
                placeholder="First Name"
                className={`input input-bordered w-full focus:outline-none ${errors.guardian?.first_name ? "input-error" : ""
                  }`}
              />
              {errors.guardian?.first_name && (
                <span className="text-error text-sm">
                  {errors.guardian.first_name.message}
                </span>
              )}
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
                {...register("guardian.middle_name", {
                  maxLength: {
                    value: 100,
                    message: "Middle name cannot exceed 100 characters",
                  },
                })}
                placeholder="Middle Name"
                className="input input-bordered w-full focus:outline-none"
              />
              {errors.guardian?.middle_name && (
                <span className="text-error text-sm">
                  {errors.guardian.middle_name.message}
                </span>
              )}
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
                {...register("guardian.last_name", {
                  required: "Last name is required",
                  maxLength: {
                    value: 100,
                    message: "Last name cannot exceed 100 characters",
                  },
                })}
                placeholder="Last Name"
                className={`input input-bordered w-full focus:outline-none ${errors.guardian?.last_name ? "input-error" : ""
                  }`}
              />
              {errors.guardian?.last_name && (
                <span className="text-error text-sm">
                  {errors.guardian.last_name.message}
                </span>
              )}
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
                {...register("guardian.email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Invalid email format",
                  },
                })}
                placeholder="guardian@example.com"
                className={`input input-bordered w-full focus:outline-none ${errors.guardian?.email ? "input-error" : ""
                  }`}
              />
              {errors.guardian?.email && (
                <span className="text-error text-sm">
                  {errors.guardian.email.message}
                </span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-user-shield text-sm"></i>
                  Guardian Type <span className="text-error">*</span>
                </span>
              </label>
              <select
                {...register("guardian_type_input", {
                  required: "Guardian type is required",
                })}
                className={`select select-bordered w-full focus:outline-none cursor-pointer ${errors.guardian_type_input ? "select-error" : ""
                  }`}
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
              {errors.guardian_type_input && (
                <span className="text-error text-sm">
                  {errors.guardian_type_input.message}
                </span>
              )}
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
                {...register("guardian.phone_no", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^\+?\d{10,15}$/,
                    message: "Invalid phone number format",
                  },
                  maxLength: {
                    value: 50,
                    message: "Phone number cannot exceed 50 characters",
                  },
                })}
                placeholder="Phone Number"
                className={`input input-bordered w-full focus:outline-none ${errors.guardian?.phone_no ? "input-error" : ""
                  }`}
              />
              {errors.guardian?.phone_no && (
                <span className="text-error text-sm">
                  {errors.guardian.phone_no.message}
                </span>
              )}
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
                {...register("guardian.annual_income", {
                  required: "Annual income is required",
                  min: {
                    value: 0,
                    message: "Annual income cannot be negative",
                  },
                })}
                placeholder="Annual Income"
                className={`input input-bordered w-full focus:outline-none ${errors.guardian?.annual_income ? "input-error" : ""
                  }`}
              />
              {errors.guardian?.annual_income && (
                <span className="text-error text-sm">
                  {errors.guardian.annual_income.message}
                </span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-briefcase text-sm"></i>
                  Means of Livelihood
                </span>
              </label>
              <select
                {...register("guardian.means_of_livelihood")}
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
                {...register("guardian.qualification", {
                  required: "Qualification is required",
                  maxLength: {
                    value: 300,
                    message: "Qualification cannot exceed 300 characters",
                  },
                })}
                placeholder="Qualification"
                className={`input input-bordered w-full focus:outline-none ${errors.guardian?.qualification ? "input-error" : ""
                  }`}
              />
              {errors.guardian?.qualification && (
                <span className="text-error text-sm">
                  {errors.guardian.qualification.message}
                </span>
              )}
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
                {...register("guardian.occupation", {
                  required: "Occupation is required",
                  maxLength: {
                    value: 300,
                    message: "Occupation cannot exceed 300 characters",
                  },
                })}
                placeholder="Occupation"
                className={`input input-bordered w-full focus:outline-none ${errors.guardian?.occupation ? "input-error" : ""
                  }`}
              />
              {errors.guardian?.occupation && (
                <span className="text-error text-sm">
                  {errors.guardian.occupation.message}
                </span>
              )}
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
                {...register("guardian.designation", {
                  maxLength: {
                    value: 300,
                    message: "Designation cannot exceed 300 characters",
                  },
                })}
                placeholder="Designation"
                className="input input-bordered w-full focus:outline-none"
              />
              {errors.guardian?.designation && (
                <span className="text-error text-sm">
                  {errors.guardian.designation.message}
                </span>
              )}
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
                {...register("year_level", {
                  required: "Year level is required",
                })}
                className={`select select-bordered w-full focus:outline-none cursor-pointer ${errors.year_level ? "select-error" : ""
                  }`}
              >
                <option value="">Select Year Level</option>
                {yearLevel.map((yearlev) => (
                  <option value={yearlev.level_name} key={yearlev.id}>
                    {yearlev.level_name}
                  </option>
                ))}
              </select>
              {errors.year_level && (
                <span className="text-error text-sm">
                  {errors.year_level.message}
                </span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-calendar text-sm"></i>
                  School Year <span className="text-error">*</span>
                </span>
              </label>
              <select
                {...register("school_year", {
                  required: "School year is required",
                })}
                className={`select select-bordered w-full focus:outline-none cursor-pointer ${errors.school_year ? "select-error" : ""
                  }`}
              >
                <option value="">Select School Year</option>
                {schoolYears.map((schoolYear) => (
                  <option value={schoolYear.year_name} key={schoolYear.id}>
                    {schoolYear.year_name}
                  </option>
                ))}
              </select>
              {errors.school_year && (
                <span className="text-error text-sm">
                  {errors.school_year.message}
                </span>
              )}
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
                {...register("previous_school_name", {
                  required: "Previous school name is required",
                  maxLength: {
                    value: 200,
                    message: "School name cannot exceed 200 characters",
                  },
                })}
                placeholder="Previous School Name"
                className={`input input-bordered w-full focus:outline-none ${errors.previous_school_name ? "input-error" : ""
                  }`}
              />
              {errors.previous_school_name && (
                <span className="text-error text-sm">
                  {errors.previous_school_name.message}
                </span>
              )}
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
                {...register("previous_standard_studied", {
                  required: "Previous class/grade is required",
                  maxLength: {
                    value: 200,
                    message: "Class/grade cannot exceed 200 characters",
                  },
                })}
                placeholder="Previous Class/Grade"
                className={`input input-bordered w-full focus:outline-none ${errors.previous_standard_studied ? "input-error" : ""
                  }`}
              />
              {errors.previous_standard_studied && (
                <span className="text-error text-sm">
                  {errors.previous_standard_studied.message}
                </span>
              )}
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
                {...register("admission_date", {
                  required: "Admission date is required",
                })}
                className={`input input-bordered w-full focus:outline-none ${errors.admission_date ? "input-error" : ""
                  }`}
              />
              {errors.admission_date && (
                <span className="text-error text-sm">
                  {errors.admission_date.message}
                </span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-file text-sm"></i>
                  TC Letter <span className="text-error">*</span>
                </span>
              </label>
              <select
                {...register("tc_letter", {
                  required: "TC letter status is required",
                })}
                className={`select select-bordered w-full focus:outline-none cursor-pointer ${errors.tc_letter ? "select-error" : ""
                  }`}
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="not_applicable">Not applicable</option>
              </select>
              {errors.tc_letter && (
                <span className="text-error text-sm">
                  {errors.tc_letter.message}
                </span>
              )}
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
                {...register("emergency_contact_no", {
                  required: "Emergency contact is required",
                  pattern: {
                    value: /^\+?\d{10,15}$/,
                    message: "Invalid phone number format",
                  },
                  maxLength: {
                    value: 100,
                    message: "Emergency contact cannot exceed 100 characters",
                  },
                })}
                placeholder="Emergency Contact"
                className={`input input-bordered w-full focus:outline-none ${errors.emergence_contact_no ? "input-error" : ""
                  }`}
              />
              {errors.emergency_contact_no && (
                <span className="text-error text-sm">
                  {errors.emergency_contact_no.message}
                </span>
              )}
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
                {...register("entire_road_distance_from_home_to_school", {
                  required: "Distance is required",
                  min: { value: 0, message: "Distance cannot be negative" },
                  maxLength: {
                    value: 100,
                    message: "Distance cannot exceed 100 characters",
                  },
                })}
                placeholder="Distance in km"
                className={`input input-bordered w-full focus:outline-none ${errors.entire_road_distance_from_home_to_school
                  ? "input-error"
                  : ""
                  }`}
              />
              {errors.entire_road_distance_from_home_to_school && (
                <span className="text-error text-sm">
                  {errors.entire_road_distance_from_home_to_school.message}
                </span>
              )}
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
                {...register("obtain_marks", {
                  required: "Marks obtained is required",
                  min: { value: 0, message: "Marks cannot be negative" },
                })}
                placeholder="Marks Obtained"
                className={`input input-bordered w-full focus:outline-none ${errors.obtain_marks ? "input-error" : ""
                  }`}
              />
              {errors.obtain_marks && (
                <span className="text-error text-sm">
                  {errors.obtain_marks.message}
                </span>
              )}
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
                {...register("total_marks", {
                  required: "Total marks is required",
                  min: { value: 0, message: "Total marks cannot be negative" },
                })}
                placeholder="Total Marks"
                className={`input input-bordered w-full focus:outline-none ${errors.total_marks ? "input-error" : ""
                  }`}
              />
              {errors.total_marks && (
                <span className="text-error text-sm">
                  {errors.total_marks.message}
                </span>
              )}
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
                type="number"
                {...register("address_input.house_no", {
                  min: { value: -2147483648, message: "Invalid house number" },
                  max: { value: 2147483647, message: "Invalid house number" },
                })}
                placeholder="House Number"
                className={`input input-bordered w-full focus:outline-none ${errors.address_input?.house_no ? "input-error" : ""
                  }`}
              />
              {errors.address_input?.house_no && (
                <span className="text-error text-sm">
                  {errors.address_input.house_no.message}
                </span>
              )}
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
                {...register("address_input.habitation", {
                  required: "Habitation is required",
                  maxLength: {
                    value: 100,
                    message: "Habitation cannot exceed 100 characters",
                  },
                })}
                placeholder="Habitation"
                className={`input input-bordered w-full focus:outline-none ${errors.address_input?.habitation ? "input-error" : ""
                  }`}
              />
              {errors.address_input?.habitation && (
                <span className="text-error text-sm">
                  {errors.address_input.habitation.message}
                </span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-map text-sm"></i>
                  Ward Number
                </span>
              </label>
              <input
                type="number"
                {...register("address_input.ward_no", {
                  min: { value: -2147483648, message: "Invalid ward number" },
                  max: { value: 2147483647, message: "Invalid ward number" },
                })}
                placeholder="Ward Number"
                className={`input input-bordered w-full focus:outline-none ${errors.address_input?.ward_no ? "input-error" : ""
                  }`}
              />
              {errors.address_input?.ward_no && (
                <span className="text-error text-sm">
                  {errors.address_input.ward_no.message}
                </span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-map-pin text-sm"></i>
                  Zone
                </span>
              </label>
              <input
                type="number"
                {...register("address_input.zone_no", {
                  min: { value: -2147483648, message: "Invalid zone number" },
                  max: { value: 2147483647, message: "Invalid zone number" },
                })}
                placeholder="Zone"
                className={`input input-bordered w-full focus:outline-none ${errors.address_input?.zone_no ? "input-error" : ""
                  }`}
              />
              {errors.address_input?.zone_no && (
                <span className="text-error text-sm">
                  {errors.address_input.zone_no.message}
                </span>
              )}
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
                {...register("address_input.block", {
                  maxLength: {
                    value: 100,
                    message: "Block cannot exceed 100 characters",
                  },
                })}
                placeholder="Block"
                className={`input input-bordered w-full focus:outline-none ${errors.address_input?.block ? "input-error" : ""
                  }`}
              />
              {errors.address_input?.block && (
                <span className="text-error text-sm">
                  {errors.address_input.block.message}
                </span>
              )}
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
                {...register("address_input.district", {
                  maxLength: {
                    value: 100,
                    message: "District cannot exceed 100 characters",
                  },
                })}
                placeholder="District"
                className={`input input-bordered w-full focus:outline-none ${errors.address_input?.district ? "input-error" : ""
                  }`}
              />
              {errors.address_input?.district && (
                <span className="text-error text-sm">
                  {errors.address_input.district.message}
                </span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-city text-sm"></i>
                  City <span className="text-error">*</span>
                </span>
              </label>
              <select
                {...register("address_input.city", {
                  required: "City is required",
                })}
                className={`select select-bordered w-full focus:outline-none ${errors.address_input?.city ? "select-error" : ""
                  }`}
              >
                <option value="">Select City</option>
                {city.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
              {errors.address_input?.city && (
                <span className="text-error text-sm">
                  {errors.address_input.city.message}
                </span>
              )}
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
                {...register("address_input.division", {
                  maxLength: {
                    value: 100,
                    message: "Division cannot exceed 100 characters",
                  },
                })}
                placeholder="Division"
                className={`input input-bordered w-full focus:outline-none ${errors.address_input?.division ? "input-error" : ""
                  }`}
              />
              {errors.address_input?.division && (
                <span className="text-error text-sm">
                  {errors.address_input.division.message}
                </span>
              )}
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
                {...register("address_input.state", {
                  required: "State is required",
                })}
                className={`select select-bordered w-full focus:outline-none ${errors.address_input?.state ? "select-error" : ""
                  }`}
              >
                <option value="">Select State</option>
                {state.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
              {errors.address_input?.state && (
                <span className="text-error text-sm">
                  {errors.address_input.state.message}
                </span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-globe text-sm"></i>
                  Country <span className="text-error">*</span>
                </span>
              </label>
              <select
                {...register("address_input.country", {
                  required: "Country is required",
                })}
                className={`select select-bordered w-full focus:outline-none ${errors.address_input?.country ? "select-error" : ""
                  }`}
              >
                <option value="">Select Country</option>
                {country.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
              {errors.address_input?.country && (
                <span className="text-error text-sm">
                  {errors.address_input.country.message}
                </span>
              )}
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
                {...register("address_input.area_code", {
                  required: "Pin code is required",
                  min: { value: -2147483648, message: "Invalid pin code" },
                  max: { value: 2147483647, message: "Invalid pin code" },
                })}
                placeholder="Pin Code"
                className={`input input-bordered w-full focus:outline-none ${errors.address_input?.area_code ? "input-error" : ""
                  }`}
              />
              {errors.address_input?.area_code && (
                <span className="text-error text-sm">
                  {errors.address_input.area_code.message}
                </span>
              )}
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
                {...register("address_input.address_line", {
                  maxLength: {
                    value: 250,
                    message: "Address line cannot exceed 250 characters",
                  },
                })}
                placeholder="Full Address"
                className="textarea textarea-bordered w-full focus:outline-none"
              ></textarea>
              {errors.address_input?.address_line && (
                <span className="text-error text-sm">
                  {errors.address_input.address_line.message}
                </span>
              )}
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
                {...register("banking_detail_input.holder_name", {
                  required: "Account holder name is required",
                  maxLength: {
                    value: 255,
                    message: "Holder name cannot exceed 255 characters",
                  },
                })}
                placeholder="Full Name as in Bank"
                className={`input input-bordered w-full focus:outline-none ${errors.banking_detail_input?.holder_name ? "input-error" : ""
                  }`}
              />
              {errors.banking_detail_input?.holder_name && (
                <span className="text-error text-sm">
                  {errors.banking_detail_input.holder_name.message}
                </span>
              )}
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
                {...register("banking_detail_input.account_no", {
                  required: "Account number is required",
                })}
                placeholder="Account Number"
                className={`input input-bordered w-full focus:outline-none ${errors.banking_detail_input?.account_no ? "input-error" : ""
                  }`}
              />
              {errors.banking_detail_input?.account_no && (
                <span className="text-error text-sm">
                  {errors.banking_detail_input.account_no.message}
                </span>
              )}
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
                {...register("banking_detail_input.ifsc_code", {
                  required: "IFSC code is required",
                  maxLength: {
                    value: 225,
                    message: "IFSC code cannot exceed 225 characters",
                  },
                  pattern: {
                    // value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                    message: "Invalid IFSC code format",
                  },
                })}
                placeholder="eg: SBIN0001234"
                className={`input input-bordered w-full focus:outline-none ${errors.banking_detail_input?.ifsc_code ? "input-error" : ""
                  }`}
              />
              {errors.banking_detail_input?.ifsc_code && (
                <span className="text-error text-sm">
                  {errors.banking_detail_input.ifsc_code.message}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-10">
          <button
            type="submit"
            className="btn bgTheme text-white w-40"
            disabled={loading}
          >
            {loading ? (
              <i className="fa-solid fa-spinner fa-spin mr-2"></i>
            ) : (
              <i className="fa-solid fa-floppy-disk mr-2"></i>
            )}
            {loading ? "" : "Update"}
          </button>
        </div>
      </form>
      {showEditSuccessModal && (
        <AdmissionEditedSuccessfully
          handleCloseOnly={handleCloseOnly}
          handleCloseAndNavigate={handleCloseAndNavigate}
        />
      )}
    </>
  );
};