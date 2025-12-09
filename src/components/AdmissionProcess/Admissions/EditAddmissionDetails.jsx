// import React, { useEffect, useRef, useState } from "react";
// import { useForm } from "react-hook-form";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   fetchAdmissionDetailsById,
//   fetchCity,
//   fetchCountry,
//   fetchGuardianType,
//   fetchSchoolYear,
//   fetchState,
//   fetchYearLevels,
//   handleEditAdmissionForm,
// } from "../../../services/api/Api";
// import { constants } from "../../../global/constants";
// import AdmissionEditedSuccessfully from "../../Modals/AdmissionEditedSuccessfully";

// export const EditAddmissionDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [yearLevel, setYearLevel] = useState([]);
//   const [schoolYears, setSchoolYear] = useState([]);
//   const [guardianTypes, setGuardianType] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(false);
//   const [selectedGuardianType, setSelectedGuardianType] = useState("");
//   const [country, setCountry] = useState([]);
//   const [state, setState] = useState([]);
//   const [city, setCity] = useState([]);
//   const [formData, setFormData] = useState(null);
//   const [isRTE, setIsRTE] = useState(false);
//   const [rteNumber, setRteNumber] = useState("");
//   const [showEditSuccessModal, setShowEditSuccessModal] = useState(false);
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertMessage, setAlertMessage] = useState("");
//   const formRef = useRef(null);

//   const [showCityDropdown, setShowCityDropdown] = useState(false);
//   const [selectedCityName, setSelectedCityName] = useState("");
//   const [citySearchInput, setCitySearchInput] = useState("");

//   const [showStateDropdown, setShowStateDropdown] = useState(false);
//   const [selectedStateName, setSelectedStateName] = useState("");
//   const [stateSearchInput, setStateSearchInput] = useState("");

//   const [showCountryDropdown, setShowCountryDropdown] = useState(false);
//   const [selectedCountryName, setSelectedCountryName] = useState("");
//   const [countrySearchInput, setCountrySearchInput] = useState("");




//   const {
//     register,
//     watch,
//     handleSubmit,
//     formState: { errors },
//     setValue,
//     resetField,
//     trigger,
//   } = useForm({
//     mode: "onChange",
//     defaultValues: {
//       "student": {
//         "father_name": "",
//         "mother_name": "",
//         "date_of_birth": "",
//         "religion": "",
//         "category": "",
//         "height": 0,
//         "weight": 0,
//         "blood_group": "",
//         "number_of_siblings": 0,
//         "roll_number": "",
//         "classes": "",
//         "user_fields": {
//           "first_name": "",
//           "middle_name": "",
//           "last_name": "",
//           "email": "",
//           "password": "",
//           "phone_no": "",
//           "gender": "",
//           "qualification": "",
//           "aadhar_no": "",
//           "pan_no": "",
//           "active": true,
//           "roles": ["student"]
//         }
//       },
//       "guardian": {
//         "annual_income": 0,
//         "means_of_livelihood": "",
//         "occupation": "",
//         "designation": "",
//         "user_fields": {
//           "first_name": "",
//           "middle_name": "",
//           "last_name": "",
//           "email": "",
//           "password": "",
//           "phone_no": "",
//           "qualification": "",
//           "gender": "",
//           "aadhar_no": "",
//           "pan_no": "",
//           "active": true,
//           "roles": ["guardian"]
//         }
//       }
//     }
//   });

//   const handleGuardianTypeChange = (e) => {
//     setSelectedGuardianType(e.target.value);
//     setValue("guardian_type_input", e.target.value);
//   };

//   const handleRTECheckboxChange = (e) => {
//     const isChecked = e.target.checked;
//     setIsRTE(isChecked);
//     setValue("is_rte", isChecked);

//     // Clear RTE number field when unchecked
//     if (!isChecked) {
//       resetField("rte_number");
//       setRteNumber("");
//     }
//   };

//   const handleRTENumberChange = (e) => {
//     setRteNumber(e.target.value);
//     setValue("rte_number", e.target.value);
//   };

//   const getYearLevels = async () => {
//     try {
//       const yearLevels = await fetchYearLevels();
//       setYearLevel(yearLevels);
//     } catch (err) {
//       console.log("Failed to load year levels. Please try again.");
//     }
//   };

//   const getSchoolYears = async () => {
//     try {
//       const schoolYears = await fetchSchoolYear();
//       setSchoolYear(schoolYears);
//     } catch (err) {
//       console.log("Failed to load school years. Please try again.");
//     }
//   };

//   const getGuardianType = async () => {
//     try {
//       const guardianType = await fetchGuardianType();
//       setGuardianType(guardianType);
//     } catch (error) {
//       console.log("Failed to load guardian type. Please try again.");
//     }
//   };

//   const getCountry = async () => {
//     try {
//       const countryList = await fetchCountry();
//       setCountry(countryList);
//     } catch (err) {
//       console.log("Failed to load countries. Please try again.");
//     }
//   };

//   const getState = async () => {
//     try {
//       const stateList = await fetchState();
//       setState(stateList);
//     } catch (err) {
//       console.log("Failed to load states. Please try again.");
//     }
//   };

//   const getCity = async () => {
//     try {
//       const cityList = await fetchCity();
//       setCity(cityList);
//     } catch (err) {
//       console.log("Failed to load cities. Please try again.");
//     }
//   };

//   const getAdmissionData = async () => {
//     try {
//       const response = await fetchAdmissionDetailsById(id);
//       if (!response) {
//         throw new Error("No response received from API");
//       }

//       const countries = await fetchCountry();
//       const states = await fetchState();
//       const cities = await fetchCity();

//       const countryObj = countries.find(
//         (c) => c.name === response.address.country_name
//       );
//       const stateObj = states.find(
//         (s) => s.name === response.address.state_name
//       );
//       const cityObj = cities.find((c) => c.name === response.address.city_name);

//       const transformedData = {
//         ...response,
//         student: response.student_input,
//         guardian: response.guardian_input,
//         address: {
//           ...response.address,
//           country: countryObj?.id || null,
//           state: stateObj?.id || null,
//           city: cityObj?.id || null,
//           country_name: response.address.country_name,
//           state_name: response.address.state_name,
//           city_name: response.address.city_name,
//         },
//         banking_detail: response.banking_detail,
//         guardian_type: response.guardian_type,
//       };

//       setFormData(transformedData);
//       setSelectedGuardianType(response.guardian_type || "");
//       setIsRTE(response.is_rte || false);
//       setRteNumber(response.rte_number || "");

//       // Set form values
//       // if (response.student_input) {
//       //   Object.entries(response.student_input).forEach(([key, value]) => {
//       //     if (value !== null) {
//       //       setValue(`student.${key}`, value);
//       //     }
//       //   });
//       // }

//       if (response.student_input) {
//   const s = response.student_input;

//   setValue("student.father_name", s.father_name || "");
//   setValue("student.mother_name", s.mother_name || "");
//   setValue("student.date_of_birth", s.date_of_birth || "");
//   setValue("student.religion", s.religion || "");
//   setValue("student.category", s.category || "");
//   setValue("student.height", s.height || 0);
//   setValue("student.weight", s.weight || 0);
//   setValue("student.blood_group", s.blood_group || "");
//   setValue("student.number_of_siblings", s.number_of_siblings || 0);

//   setValue("student.user_fields.first_name", s.first_name || "");
//   setValue("student.user_fields.middle_name", s.middle_name || "");
//   setValue("student.user_fields.last_name", s.last_name || "");
//   setValue("student.user_fields.email", s.email || "");
//   setValue("student.user_fields.gender", s.gender || "");
//    if (typeof s.is_active !== "undefined" && s.is_active !== null) {
//     setValue("student.is_active", s.is_active ? "true" : "false", {
//       shouldValidate: false,
//     });
//   }
//   // qualification, aadhar_no, pan_no agar response me ho to yahan set karo
// }

//       // if (response.guardian_input) {
//       //   Object.entries(response.guardian_input).forEach(([key, value]) => {
//       //     if (value !== null) {
//       //       setValue(`guardian.${key}`, value);
//       //     }
//       //   });
//       // }

//       if (response.guardian_input) {
//   const g = response.guardian_input;

//   setValue("guardian.annual_income", g.annual_income || 0);
//   setValue("guardian.means_of_livelihood", g.means_of_livelihood || "");
//   setValue("guardian.occupation", g.occupation || "");
//   setValue("guardian.designation", g.designation || "");

//   setValue("guardian.user_fields.first_name", g.first_name || "");
//   setValue("guardian.user_fields.middle_name", g.middle_name || "");
//   setValue("guardian.user_fields.last_name", g.last_name || "");
//   setValue("guardian.user_fields.email", g.email || "");
//   setValue("guardian.user_fields.phone_no", g.phone_no || "");
//   setValue("guardian.user_fields.qualification", g.qualification || "");
//   setValue("guardian.user_fields.gender", g.gender || "");
// }
//       if (response.address) {
//         Object.entries(response.address).forEach(([key, value]) => {
//           if (value !== null) {
//             const formKey =
//               key === "area_code"
//                 ? "area_code"
//                 : key === "house_no"
//                   ? "house_no"
//                   : key === "ward_no"
//                     ? "ward_no"
//                     : key === "zone_no"
//                       ? "zone_no"
//                       : key;
//             setValue(`address_input.${formKey}`, value);
//           }
//         });

//         if (countryObj) {
//           setValue("address_input.country", countryObj.id);
//           setSelectedCountryName(countryObj.name);
//         }

//         if (stateObj) {
//           setValue("address_input.state", stateObj.id);
//           setSelectedStateName(stateObj.name);
//         }

//         if (cityObj) {
//           setValue("address_input.city", cityObj.id);
//           setSelectedCityName(cityObj.name);
//         }
//       }



//       if (response.banking_detail) {
//         Object.entries(response.banking_detail).forEach(([key, value]) => {
//           if (value !== null) {
//             setValue(`banking_detail_input.${key}`, value);
//           }
//         });
//       }

//       // Set other fields
//       if (response.year_level) setValue("year_level", response.year_level);
//       if (response.school_year) setValue("school_year", response.school_year);
//       if (response.admission_date)
//         setValue("admission_date", response.admission_date);
//       if (response.previous_school_name)
//         setValue("previous_school_name", response.previous_school_name);
//       if (response.previous_standard_studied)
//         setValue(
//           "previous_standard_studied",
//           response.previous_standard_studied
//         );
//       if (response.tc_letter) setValue("tc_letter", response.tc_letter);
//       if (response.emergency_contact_no)
//         setValue("emergency_contact_no", response.emergency_contact_no);
//       if (response.entire_road_distance_from_home_to_school)
//         setValue(
//           "entire_road_distance_from_home_to_school",
//           response.entire_road_distance_from_home_to_school
//         );
//       if (response.obtain_marks)
//         setValue("obtain_marks", response.obtain_marks);
//       if (response.total_marks) setValue("total_marks", response.total_marks);
//       if (response.is_rte) setValue("is_rte", response.is_rte);
//       if (response.rte_number) setValue("rte_number", response.rte_number);
//       if (response.student_input.gender)
//         setValue("student.gender", response.student_input.gender);
//       // if (response.guardian_type) {
//       //   setValue("guardian_type_input", response.guardian_type);
//       //   setSelectedGuardianType(response.guardian_type.id);
//       // }
//       if (response.guardian_type) {
//   // assume response.guardian_type string hai e.g. "Father"
//   setValue("guardian_type_input", response.guardian_type);
//   setSelectedGuardianType(response.guardian_type);
// }
//     } catch (error) {
//       console.error("Error fetching admission details:", error);
//     }
//   };

//   useEffect(() => {
//     getYearLevels();
//     getSchoolYears();
//     getGuardianType();
//     getCountry();
//     getState();
//     getCity();
//     getAdmissionData();
//   }, [id]);

//   const handleCloseOnly = () => {
//     setShowEditSuccessModal(false);
//   };

//   const handleCloseAndNavigate = () => {
//     setShowEditSuccessModal(false);
//     navigate("/addmissionDetails");
//   };

//   // const onSubmit = async (data) => {
//   //   setLoading(true);
//   //   console.log(data);

//   //   const payload = {
//   //     student: {
//   //       first_name: data.student.first_name || "",
//   //       middle_name: data.student.middle_name || "",
//   //       last_name: data.student.last_name || "",
//   //       email: data.student.email || "",
//   //       is_active: data.is_active === "true",
//   //       father_name: data.student.father_name || "",
//   //       mother_name: data.student.mother_name || "",
//   //       date_of_birth: data.student.date_of_birth || null,
//   //       gender: data.student.gender || "",
//   //       religion: data.student.religion || "",
//   //       category: data.student.category || null,
//   //       height: parseFloat(data.student.height) || null,
//   //       weight: parseFloat(data.student.weight) || null,
//   //       blood_group: data.student.blood_group || "",
//   //       number_of_siblings: data.student.number_of_siblings || 0,
//   //     },
//   //     guardian: {
//   //       first_name: data.guardian.first_name || "",
//   //       middle_name: data.guardian.middle_name || "",
//   //       last_name: data.guardian.last_name || "",
//   //       email: data.guardian.email || "",
//   //       phone_no: data.guardian.phone_no || "",
//   //       annual_income: parseFloat(data.guardian.annual_income) || null,
//   //       means_of_livelihood: data.guardian.means_of_livelihood || null,
//   //       qualification: data.guardian.qualification || "",
//   //       occupation: data.guardian.occupation || "",
//   //       designation: data.guardian.designation || "",
//   //     },
//   //     address_input: {
//   //       house_no: parseInt(data.address_input.house_no) || null,
//   //       habitation: data.address_input.habitation || "",
//   //       ward_no: parseInt(data.address_input.ward_no) || null,
//   //       zone_no: parseInt(data.address_input.zone_no) || null,
//   //       block: data.address_input.block || "",
//   //       district: data.address_input.district || "",
//   //       division: data.address_input.division || "",
//   //       area_code: parseInt(data.address_input.area_code) || null,
//   //       country: data.address_input.country || null,
//   //       state: data.address_input.state || null,
//   //       city: data.address_input.city || null,
//   //       address_line: data.address_input.address_line || "",
//   //     },
//   //     banking_detail_input: {
//   //       account_no: data.banking_detail_input.account_no || null,
//   //       ifsc_code: data.banking_detail_input.ifsc_code || "",
//   //       holder_name: data.banking_detail_input.holder_name || "",
//   //     },
//   //     guardian_type_input: data.guardian_type_input || null,
//   //     year_level: data.year_level || null,
//   //     school_year: data.school_year || null,
//   //     admission_date: data.admission_date || null,
//   //     previous_school_name: data.previous_school_name || "",
//   //     previous_standard_studied: data.previous_standard_studied || "",
//   //     tc_letter: data.tc_letter || "",
//   //     emergency_contact_no: data.emergency_contact_no || "",
//   //     entire_road_distance_from_home_to_school:
//   //       data.entire_road_distance_from_home_to_school || "",
//   //     obtain_marks: parseFloat(data.obtain_marks) || null,
//   //     total_marks: parseFloat(data.total_marks) || null,
//   //     is_rte: data.is_rte || false,
//   //     rte_number: data.is_rte ? data.rte_number : "",
//   //   };

//   //   const submitFormData = new FormData();

//   //   Object.entries(payload).forEach(([key, value]) => {
//   //     if (
//   //       typeof value === "object" &&
//   //       value !== null &&
//   //       !(value instanceof File)
//   //     ) {
//   //       Object.entries(value).forEach(([subKey, subValue]) => {
//   //         submitFormData.append(
//   //           `${key}[${subKey}]`,
//   //           subValue !== null ? subValue : ""
//   //         );
//   //       });
//   //     } else {
//   //       submitFormData.append(key, value !== null ? value : "");
//   //     }
//   //   });

//   //   try {
//   //     await handleEditAdmissionForm(submitFormData, id);
//   //     setShowEditSuccessModal(true);
//   //   } catch (error) {
//   //     console.error("Update error:", error.response?.data || error.message);
//   //     alert(
//   //       `Failed to update the form: ${error.response?.data?.message || error.message
//   //       }`
//   //     );
//   //     setShowAlert(true);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const onSubmit = async (data) => {
//   setLoading(true);
//   console.log("Edit form submit data:", data);

//   try {
// const payload = {
//   // ---------- STUDENT ----------
//   student: {
//     first_name: data.student.user_fields.first_name?.trim() || "",
//     middle_name: data.student.user_fields.middle_name?.trim() || "",
//     last_name: data.student.user_fields.last_name?.trim() || "",
//     email: data.student.user_fields.email?.trim() || "",
//     is_active: data.student.is_active === "true",

//     father_name: data.student.father_name?.trim() || "",
//     mother_name: data.student.mother_name?.trim() || "",
//     date_of_birth: data.student.date_of_birth || null,
//     gender: data.student.user_fields.gender || "",
//     religion: data.student.religion?.trim() || "",
//     category: data.student.category || null,

//     height:
//       data.student.height !== "" &&
//       data.student.height !== null &&
//       data.student.height !== undefined
//         ? parseFloat(data.student.height)
//         : null,

//     weight:
//       data.student.weight !== "" &&
//       data.student.weight !== null &&
//       data.student.weight !== undefined
//         ? parseFloat(data.student.weight)
//         : null,

//     blood_group: data.student.blood_group || "",
//     number_of_siblings:
//       data.student.number_of_siblings !== "" &&
//       data.student.number_of_siblings !== null &&
//       data.student.number_of_siblings !== undefined
//         ? Number(data.student.number_of_siblings)
//         : 0,
//   },

//   // ---------- GUARDIAN ----------
//   guardian: {
//     first_name: data.guardian.user_fields.first_name?.trim() || "",
//     middle_name: data.guardian.user_fields.middle_name?.trim() || "",
//     last_name: data.guardian.user_fields.last_name?.trim() || "",
//     email: data.guardian.user_fields.email?.trim() || "",
//     phone_no: data.guardian.user_fields.phone_no?.trim() || "",

//     annual_income:
//       data.guardian.annual_income !== "" &&
//       data.guardian.annual_income !== null &&
//       data.guardian.annual_income !== undefined
//         ? parseFloat(data.guardian.annual_income)
//         : null,

//     means_of_livelihood: data.guardian.means_of_livelihood || null,
//     qualification: data.guardian.user_fields.qualification?.trim() || "",
//     occupation: data.guardian.occupation?.trim() || "",
//     designation: data.guardian.designation?.trim() || "",
//   },

//   // ...baaki payload jaisa tumne likha hai
// };

//     // ---------- previous_percentage (AdmissionForm jaisa) ----------
//     const obtain = Number(payload.obtain_marks || 0);
//     const total = Number(payload.total_marks || 0);
//     payload.previous_percentage =
//       obtain && total ? (obtain / total) * 100 : null;

//     // ---------- FormData banana (tumhaare existing code ke hisaab se) ----------
//     const submitFormData = new FormData();

//     Object.entries(payload).forEach(([key, value]) => {
//       if (
//         value &&
//         typeof value === "object" &&
//         !(value instanceof File)
//       ) {
//         Object.entries(value).forEach(([subKey, subValue]) => {
//           submitFormData.append(
//             `${key}[${subKey}]`,
//             subValue !== null && subValue !== undefined ? subValue : ""
//           );
//         });
//       } else {
//         submitFormData.append(
//           key,
//           value !== null && value !== undefined ? value : ""
//         );
//       }
//     });

//     await handleEditAdmissionForm(submitFormData, id);
//     setShowEditSuccessModal(true);
//   } catch (error) {
//     console.error("Update error:", error.response?.data || error.message);
//     setAlertMessage(
//       `Failed to update the form: ${
//         error.response?.data?.message || error.message
//       }`
//     );
//     setShowAlert(true);
//   } finally {
//     setLoading(false);
//   }
// };

//   const filteredCities = city
//     .filter((c) =>
//       c.name.toLowerCase().includes(citySearchInput.toLowerCase())
//     )
//     .sort((a, b) => a.name.localeCompare(b.name));

//   const filteredStates = state
//     .filter((s) =>
//       s.name.toLowerCase().includes(stateSearchInput.toLowerCase())
//     )
//     .sort((a, b) => a.name.localeCompare(b.name));


//   const filteredCountries = country
//     .filter((c) =>
//       c.name.toLowerCase().includes(countrySearchInput.toLowerCase())
//     )
//     .sort((a, b) => a.name.localeCompare(b.name));


//   if (!formData) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen">
//         <div className="flex space-x-2">
//           <div className="w-3 h-3 bgTheme rounded-full animate-bounce"></div>
//           <div className="w-3 h-3 bgTheme rounded-full animate-bounce [animation-delay:-0.2s]"></div>
//           <div className="w-3 h-3 bgTheme rounded-full animate-bounce [animation-delay:-0.4s]"></div>
//         </div>
//         <p className="mt-2 text-gray-500 text-sm">
//           Loading admission details...
//         </p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
//         <i className="fa-solid fa-triangle-exclamation text-5xl text-red-400 mb-4"></i>
//         <p className="text-lg text-red-400 font-medium">
//           Failed to load data, Try Again
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="mb-24 md:mb-10">
//       <style>{constants.hideEdgeRevealStyle}</style>
//       <form
//         className="w-full max-w-7xl mx-auto p-6 bg-base-100 rounded-box my-5 shadow-sm focus:outline-none mb-10"
//         onSubmit={handleSubmit(onSubmit)}
//       >
//         <h1 className="text-3xl font-bold text-center mb-8">
//           Edit Student Details{" "}
//           <i className="fa-solid fa-pen-to-square ml-2"></i>
//         </h1>

//         {/* Student Information Section */}
//         <div className="bg-base-200 p-6 rounded-box mb-6">
//           <h2 className="text-2xl font-bold mb-4">Student Information</h2>
//           <div className="grid grid-cols-1 md:grid-cols-1 mb-3">
//             <div className="form-control">
//               <label className="label cursor-pointer">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-child-reaching text-sm"></i>
//                   Is RTE Student?
//                 </span>
//                 <input
//                   type="checkbox"
//                   {...register("is_rte")}
//                   onChange={handleRTECheckboxChange}
//                   checked={isRTE}
//                   className="checkbox checkbox-primary"
//                 />
//               </label>
//             </div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-user text-sm"></i>
//                   First Name <span className="text-error">*</span>
//                 </span>
//               </label>

//               <input
//                 type="text"
//                 {...register("student.user_fields.first_name", {
//                   required: "First name is required",
//                   maxLength: {
//                     value: 100,
//                     message: "First name cannot exceed 100 characters",
//                   },
//                 })}
//                 placeholder="First Name"
//                 className={`input input-bordered w-full focus:outline-none ${errors.student?.user_fields?.first_name ? "input-error" : ""
//                   }`}
//               />

//               {errors.student?.user_fields?.first_name && (
//                 <span className="text-error text-sm">
//                   {errors.student.user_fields.first_name.message}
//                 </span>
//               )}
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-user-pen text-sm"></i>
//                   Middle Name
//                 </span>
//               </label>

//               <input
//                 type="text"
//                 {...register("student.user_fields.middle_name", {
//                   maxLength: {
//                     value: 100,
//                     message: "Middle name cannot exceed 100 characters",
//                   },
//                 })}
//                 placeholder="Middle Name"
//                 className={`input input-bordered w-full focus:outline-none ${errors.student?.user_fields?.middle_name ? "input-error" : ""
//                   }`}
//               />

//               {errors.student?.user_fields?.middle_name && (
//                 <span className="text-error text-sm">
//                   {errors.student.user_fields.middle_name.message}
//                 </span>
//               )}
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-user-tag text-sm"></i>
//                   Last Name <span className="text-error">*</span>
//                 </span>
//               </label>

//               <input
//                 type="text"
//                 {...register("student.user_fields.last_name", {
//                   required: "Last name is required",
//                   maxLength: {
//                     value: 100,
//                     message: "Last name cannot exceed 100 characters",
//                   },
//                 })}
//                 placeholder="Last Name"
//                 className={`input input-bordered w-full focus:outline-none ${errors.student?.user_fields?.last_name ? "input-error" : ""
//                   }`}
//               />

//               {errors.student?.user_fields?.last_name && (
//                 <span className="text-error text-sm">
//                   {errors.student.user_fields.last_name.message}
//                 </span>
//               )}
//             </div>

//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-envelope text-sm"></i>
//                   Email <span className="text-error">*</span>
//                 </span>
//               </label>

//               <input
//                 type="email"
//                 {...register("student.user_fields.email", {
//                   required: "Email is required",
//                   pattern: {
//                     value: /^\S+@\S+\.\S+$/,
//                     message: "Invalid email format",
//                   },
//                 })}
//                 placeholder="student@example.com"
//                 className={`input input-bordered w-full focus:outline-none ${errors.student?.user_fields?.email ? "input-error" : ""
//                   }`}
//               />

//               {errors.student?.user_fields?.email && (
//                 <span className="text-error text-sm">
//                   {errors.student.user_fields.email.message}
//                 </span>
//               )}
//             </div>

//           <div className="form-control">
//   <label className="label">
//     <span className="label-text flex items-center gap-2">
//       Status <span className="text-error">*</span>
//     </span>
//   </label>

//   {/* 1) Hidden input: react-hook-form yahi se value lega */}
//   <input
//     type="hidden"
//     {...register("student.is_active", {
//       required: "Status is required",
//     })}
//   />

//   {/* 2) Sirf dikhane ke liye disabled select */}
//   <select
//     value={watch("student.is_active") || ""}   // value react-hook-form se aa rahi hai
//     className={`select select-bordered w-full focus:outline-none ${
//       errors.student?.is_active ? "select-error" : ""
//     }`}
//     disabled
//   >
//     <option value="">Select Status</option>
//     <option value="true">Active</option>
//     <option value="false">InActive</option>
//   </select>

//   {errors.student?.is_active && (
//     <span className="text-error text-sm">
//       {errors.student.is_active.message}
//     </span>
//   )}
// </div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-calendar-days text-sm"></i>
//                   Date of Birth <span className="text-error">*</span>
//                 </span>
//               </label>
//               <input
//                 type="date"
//                 {...register("student.date_of_birth", {
//                   required: "Date of birth is required",
//                   validate: {
//                     notFuture: (value) => {
//                       const selectedDate = new Date(value);
//                       const today = new Date();
//                       today.setHours(0, 0, 0, 0);
//                       return (
//                         selectedDate <= today ||
//                         "Date of birth cannot be in the future"
//                       );
//                     },
//                   },
//                 })}
//                 max={new Date().toISOString().split("T")[0]}
//                 className={`input input-bordered w-full focus:outline-none ${errors.student?.date_of_birth ? "input-error" : ""
//                   }`}
//               />
//               {errors.student?.date_of_birth && (
//                 <span className="text-error text-sm">
//                   {errors.student.date_of_birth.message}
//                 </span>
//               )}
//             </div>
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-venus-mars text-sm"></i>
//                   Gender <span className="text-error">*</span>
//                 </span>
//               </label>

//               <select
//                 {...register("student.user_fields.gender", {
//                   required: "Gender is required",
//                 })}
//                 className={`select select-bordered w-full focus:outline-none cursor-pointer ${errors.student?.user_fields?.gender ? "select-error" : ""
//                   }`}
//               >
//                 <option value="">Select Gender</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//                 <option value="Other">Other</option>
//               </select>

//               {errors.student?.user_fields?.gender && (
//                 <span className="text-error text-sm">
//                   {errors.student.user_fields.gender.message}
//                 </span>
//               )}
//             </div>

//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-user text-sm"></i>
//                   Father's Name <span className="text-error">*</span>
//                 </span>
//               </label>
//               <input
//                 type="text"
//                 {...register("student.father_name", {
//                   required: "Father's name is required",
//                   maxLength: {
//                     value: 100,
//                     message: "Father's name cannot exceed 100 characters",
//                   },
//                 })}
//                 placeholder="Father's Name"
//                 className={`input input-bordered w-full focus:outline-none ${errors.student?.father_name ? "input-error" : ""
//                   }`}
//               />
//               {errors.student?.father_name && (
//                 <span className="text-error text-sm">
//                   {errors.student.father_name.message}
//                 </span>
//               )}
//             </div>
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-user text-sm"></i>
//                   Mother's Name <span className="text-error">*</span>
//                 </span>
//               </label>
//               <input
//                 type="text"
//                 {...register("student.mother_name", {
//                   required: "Mother's name is required",
//                   maxLength: {
//                     value: 100,
//                     message: "Mother's name cannot exceed 100 characters",
//                   },
//                 })}
//                 placeholder="Mother's Name"
//                 className={`input input-bordered w-full focus:outline-none ${errors.student?.mother_name ? "input-error" : ""
//                   }`}
//               />
//               {errors.student?.mother_name && (
//                 <span className="text-error text-sm">
//                   {errors.student.mother_name.message}
//                 </span>
//               )}
//             </div>
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-hands-praying text-sm"></i>
//                   Religion <span className="text-error">*</span>
//                 </span>
//               </label>
//               <input
//                 type="text"
//                 {...register("student.religion", {
//                   required: "Religion is required",
//                   maxLength: {
//                     value: 100,
//                     message: "Religion cannot exceed 100 characters",
//                   },
//                 })}
//                 placeholder="Religion"
//                 className={`input input-bordered w-full focus:outline-none ${errors.student?.religion ? "input-error" : ""
//                   }`}
//               />
//               {errors.student?.religion && (
//                 <span className="text-error text-sm">
//                   {errors.student.religion.message}
//                 </span>
//               )}
//             </div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-tag text-sm"></i>
//                   Category <span className="text-error">*</span>
//                 </span>
//               </label>
//               <select
//                 {...register("student.category", {
//                   required: "Category is required",
//                 })}
//                 className={`select select-bordered w-full focus:outline-none cursor-pointer ${errors.student?.category ? "select-error" : ""
//                   }`}
//               >
//                 <option value="">Select Category</option>
//                 <option value="GEN">General</option>
//                 <option value="OBC">Other Backward Class</option>
//                 <option value="SC">Scheduled Caste</option>
//                 <option value="ST">Scheduled Tribe</option>
//               </select>
//               {errors.student?.category && (
//                 <span className="text-error text-sm">
//                   {errors.student.category.message}
//                 </span>
//               )}
//             </div>
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-ruler-vertical text-sm"></i>
//                   Height (cm)
//                 </span>
//               </label>
//               <input
//                 type="number"
//                 {...register("student.height", {
//                   min: { value: 0, message: "Height must be positive" },
//                 })}
//                 placeholder="Height"
//                 className={`input input-bordered w-full focus:outline-none ${errors.student?.height ? "input-error" : ""
//                   }`}
//               />
//               {errors.student?.height && (
//                 <span className="text-error text-sm">
//                   {errors.student.height.message}
//                 </span>
//               )}
//             </div>
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-weight-scale text-sm"></i>
//                   Weight (kg)
//                 </span>
//               </label>
//               <input
//                 type="number"
//                 {...register("student.weight", {
//                   min: { value: 0, message: "Weight must be positive" },
//                 })}
//                 placeholder="Weight"
//                 className={`input input-bordered w-full focus:outline-none ${errors.student?.weight ? "input-error" : ""
//                   }`}
//               />
//               {errors.student?.weight && (
//                 <span className="text-error text-sm">
//                   {errors.student.weight.message}
//                 </span>
//               )}
//             </div>
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-heart-pulse text-sm"></i>
//                   Blood Group
//                 </span>
//               </label>
//               <select
//                 {...register("student.blood_group")}
//                 className="select select-bordered w-full focus:outline-none cursor-pointer"
//               >
//                 <option value="">Select Blood Group</option>
//                 <option value="A+">A+</option>
//                 <option value="A-">A-</option>
//                 <option value="B+">B+</option>
//                 <option value="B-">B-</option>
//                 <option value="O+">O+</option>
//                 <option value="O-">O-</option>
//                 <option value="AB+">AB+</option>
//                 <option value="AB-">AB-</option>
//               </select>
//             </div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-people-group text-sm"></i>
//                   Number of Siblings
//                 </span>
//               </label>
//               <input
//                 type="number"
//                 {...register("student.number_of_siblings", {
//                   min: {
//                     value: 0,
//                     message: "Number of siblings cannot be negative",
//                   },
//                 })}
//                 placeholder="Number of Siblings"
//                 className={`input input-bordered w-full focus:outline-none ${errors.student?.number_of_siblings ? "input-error" : ""
//                   }`}
//               />
//               {errors.student?.number_of_siblings && (
//                 <span className="text-error text-sm">
//                   {errors.student.number_of_siblings.message}
//                 </span>
//               )}
//             </div>
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-people-group text-sm"></i>
//                   RTE Number
//                 </span>
//               </label>
//               <input
//                 type="text"
//                 {...register("rte_number", {
//                   required: isRTE
//                     ? "RTE number is required for RTE students"
//                     : false,
//                   maxLength: {
//                     value: 10,
//                     message: "RTE number cannot exceed 10 characters",
//                   },
//                 })}
//                 placeholder="RTE Number"
//                 className={`input input-bordered w-full focus:outline-none ${errors.rte_number ? "input-error" : ""
//                   } ${!isRTE ? "input-disabled bg-gray-200 cursor-not-allowed" : ""
//                   }`}
//                 value={rteNumber}
//                 onChange={handleRTENumberChange}
//                 disabled={!isRTE}
//               />
//               {errors.rte_number && (
//                 <span className="text-error text-sm">
//                   {errors.rte_number.message}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Guardian Information Section */}
//         <div className="bg-base-200 p-6 rounded-box mb-6">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
//             <h2 className="text-2xl font-bold whitespace-nowrap">
//               Guardian Information
//             </h2>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-user text-sm"></i>
//                   First Name <span className="text-error">*</span>
//                 </span>
//               </label>

//               <input
//                 type="text"
//                 {...register("guardian.user_fields.first_name", {
//                   required: "First name is required",
//                   maxLength: {
//                     value: 100,
//                     message: "First name cannot exceed 100 characters",
//                   },
//                 })}
//                 placeholder="First Name"
//                 className={`input input-bordered w-full focus:outline-none ${errors.guardian?.user_fields?.first_name ? "input-error" : ""
//                   }`}
//               />

//               {errors.guardian?.user_fields?.first_name && (
//                 <span className="text-error text-sm">
//                   {errors.guardian.user_fields.first_name.message}
//                 </span>
//               )}
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-user-pen text-sm"></i>
//                   Middle Name
//                 </span>
//               </label>

//               <input
//                 type="text"
//                 {...register("guardian.user_fields.middle_name", {
//                   maxLength: {
//                     value: 100,
//                     message: "Middle name cannot exceed 100 characters",
//                   },
//                 })}
//                 placeholder="Middle Name"
//                 className={`input input-bordered w-full focus:outline-none ${errors.guardian?.user_fields?.middle_name ? "input-error" : ""
//                   }`}
//               />

//               {errors.guardian?.user_fields?.middle_name && (
//                 <span className="text-error text-sm">
//                   {errors.guardian.user_fields.middle_name.message}
//                 </span>
//               )}
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-user-tag text-sm"></i>
//                   Last Name <span className="text-error">*</span>
//                 </span>
//               </label>

//               <input
//                 type="text"
//                 {...register("guardian.user_fields.last_name", {
//                   required: "Last name is required",
//                   maxLength: {
//                     value: 100,
//                     message: "Last name cannot exceed 100 characters",
//                   },
//                 })}
//                 placeholder="Last Name"
//                 className={`input input-bordered w-full focus:outline-none ${errors.guardian?.user_fields?.last_name ? "input-error" : ""
//                   }`}
//               />

//               {errors.guardian?.user_fields?.last_name && (
//                 <span className="text-error text-sm">
//                   {errors.guardian.user_fields.last_name.message}
//                 </span>
//               )}
//             </div>

//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-envelope text-sm"></i>
//                   Email <span className="text-error">*</span>
//                 </span>
//               </label>

//               <input
//                 type="email"
//                 {...register("guardian.user_fields.email", {
//                   required: "Email is required",
//                   pattern: {
//                     value: /^\S+@\S+\.\S+$/,
//                     message: "Invalid email format",
//                   },
//                 })}
//                 placeholder="guardian@example.com"
//                 className={`input input-bordered w-full focus:outline-none ${errors.guardian?.user_fields?.email ? "input-error" : ""
//                   }`}
//               />

//               {errors.guardian?.user_fields?.email && (
//                 <span className="text-error text-sm">
//                   {errors.guardian.user_fields.email.message}
//                 </span>
//               )}
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-user-shield text-sm"></i>
//                   Guardian Type <span className="text-error">*</span>
//                 </span>
//               </label>
//               <select
//                 {...register("guardian_type_input", {
//                   required: "Guardian type is required",
//                 })}
//                 className={`select select-bordered w-full focus:outline-none cursor-pointer ${errors.guardian_type_input ? "select-error" : ""
//                   }`}
//                 value={selectedGuardianType}
//                 onChange={handleGuardianTypeChange}
//               >
//                 <option value="">Select Guardian Type</option>
//                 {guardianTypes.map((guardianTy) => (
//                   <option value={guardianTy.name} key={guardianTy.id}>
//                     {guardianTy.name}
//                   </option>
//                 ))}
//               </select>
//               {errors.guardian_type_input && (
//                 <span className="text-error text-sm">
//                   {errors.guardian_type_input.message}
//                 </span>
//               )}
//             </div>
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-phone text-sm"></i>
//                   Phone Number <span className="text-error">*</span>
//                 </span>
//               </label>

//               <input
//                 type="tel"
//               {...register("guardian.user_fields.phone_no", {
//   required: "Phone number is required",
//   pattern: {
//     value: /^[6789]\d{9}$/,
//     message:
//       "Phone number must start with 6, 7, 8, or 9 and be exactly 10 digits",
//   },
//   minLength: { value: 10, message: "Phone number must be exactly 10 digits" },
//   maxLength: { value: 10, message: "Phone number must be exactly 10 digits" },
// })}
// onInput={(e) => {
//   e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
// }}
//                 placeholder="Phone Number"
//                 className={`input input-bordered w-full focus:outline-none ${errors.guardian?.user_fields?.phone_no ? "input-error" : ""
//                   }`}
//               />

//               {errors.guardian?.user_fields?.phone_no && (
//                 <span className="text-error text-sm">
//                   {errors.guardian.user_fields.phone_no.message}
//                 </span>
//               )}
//             </div>

//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-money-bill-wave text-sm"></i>
//                   Annual Income <span className="text-error">*</span>
//                 </span>
//               </label>
//               <input
//                 type="number"
//                 {...register("guardian.annual_income", {
//                   required: "Annual income is required",
//                   min: {
//                     value: 0,
//                     message: "Annual income cannot be negative",
//                   },
//                 })}
//                 placeholder="Annual Income"
//                 className={`input input-bordered w-full focus:outline-none ${errors.guardian?.annual_income ? "input-error" : ""
//                   }`}
//               />
//               {errors.guardian?.annual_income && (
//                 <span className="text-error text-sm">
//                   {errors.guardian.annual_income.message}
//                 </span>
//               )}
//             </div>
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-briefcase text-sm"></i>
//                   Means of Livelihood
//                 </span>
//               </label>
//               <select
//                 {...register("guardian.means_of_livelihood")}
//                 className="select select-bordered w-full focus:outline-none cursor-pointer"
//               >
//                 <option value="">Select</option>
//                 <option value="Govt">Government</option>
//                 <option value="Non-Govt">Non-Government</option>
//               </select>
//             </div>
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-graduation-cap text-sm"></i>
//                   Qualification <span className="text-error">*</span>
//                 </span>
//               </label>

//               <input
//                 type="text"
//                 {...register("guardian.user_fields.qualification", {
//                   required: "Qualification is required",
//                   maxLength: {
//                     value: 300,
//                     message: "Qualification cannot exceed 300 characters",
//                   },
//                 })}
//                 placeholder="Qualification"
//                 className={`input input-bordered w-full focus:outline-none ${errors.guardian?.user_fields?.qualification ? "input-error" : ""
//                   }`}
//               />

//               {errors.guardian?.user_fields?.qualification && (
//                 <span className="text-error text-sm">
//                   {errors.guardian.user_fields.qualification.message}
//                 </span>
//               )}
//             </div>

//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-briefcase text-sm"></i>
//                   Occupation <span className="text-error">*</span>
//                 </span>
//               </label>
//               <input
//                 type="text"
//                 {...register("guardian.occupation", {
//                   required: "Occupation is required",
//                   maxLength: {
//                     value: 300,
//                     message: "Occupation cannot exceed 300 characters",
//                   },
//                 })}
//                 placeholder="Occupation"
//                 className={`input input-bordered w-full focus:outline-none ${errors.guardian?.occupation ? "input-error" : ""
//                   }`}
//               />
//               {errors.guardian?.occupation && (
//                 <span className="text-error text-sm">
//                   {errors.guardian.occupation.message}
//                 </span>
//               )}
//             </div>
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-id-card text-sm"></i>
//                   Designation
//                 </span>
//               </label>
//               <input
//                 type="text"
//                 {...register("guardian.designation", {
//                   maxLength: {
//                     value: 300,
//                     message: "Designation cannot exceed 300 characters",
//                   },
//                 })}
//                 placeholder="Designation"
//                 className="input input-bordered w-full focus:outline-none"
//               />
//               {errors.guardian?.designation && (
//                 <span className="text-error text-sm">
//                   {errors.guardian.designation.message}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Academic Information Section */}
//         <div className="bg-base-200 p-6 rounded-box mb-6">
//           <h2 className="text-2xl font-bold mb-4">Academic Information</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-graduation-cap text-sm"></i>
//                   Year Level <span className="text-error">*</span>
//                 </span>
//               </label>
//               <select
//                 {...register("year_level", {
//                   required: "Year level is required",
//                 })}
//                 className={`select select-bordered w-full focus:outline-none cursor-pointer ${errors.year_level ? "select-error" : ""
//                   }`}
//               >
//                 <option value="">Select Year Level</option>
//                 {yearLevel.map((yearlev) => (
//                   <option value={yearlev.level_name} key={yearlev.id}>
//                     {yearlev.level_name}
//                   </option>
//                 ))}
//               </select>
//               {errors.year_level && (
//                 <span className="text-error text-sm">
//                   {errors.year_level.message}
//                 </span>
//               )}
//             </div>
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-calendar text-sm"></i>
//                   School Year <span className="text-error">*</span>
//                 </span>
//               </label>
//               <select
//                 {...register("school_year", {
//                   required: "School year is required",
//                 })}
//                 className={`select select-bordered w-full focus:outline-none cursor-pointer ${errors.school_year ? "select-error" : ""
//                   }`}
//               >
//                 <option value="">Select School Year</option>
//                 {schoolYears.map((schoolYear) => (
//                   <option value={schoolYear.year_name} key={schoolYear.id}>
//                     {schoolYear.year_name}
//                   </option>
//                 ))}
//               </select>
//               {errors.school_year && (
//                 <span className="text-error text-sm">
//                   {errors.school_year.message}
//                 </span>
//               )}
//             </div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-school text-sm"></i>
//                   Previous School Name <span className="text-error">*</span>
//                 </span>
//               </label>
//               <input
//                 type="text"
//                 {...register("previous_school_name", {
//                   required: "Previous school name is required",
//                   maxLength: {
//                     value: 200,
//                     message: "School name cannot exceed 200 characters",
//                   },
//                 })}
//                 placeholder="Previous School Name"
//                 className={`input input-bordered w-full focus:outline-none ${errors.previous_school_name ? "input-error" : ""
//                   }`}
//               />
//               {errors.previous_school_name && (
//                 <span className="text-error text-sm">
//                   {errors.previous_school_name.message}
//                 </span>
//               )}
//             </div>
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-book text-sm"></i>
//                   Previous Class/Grade <span className="text-error">*</span>
//                 </span>
//               </label>
//               <input
//                 type="text"
//                 {...register("previous_standard_studied", {
//                   required: "Previous class/grade is required",
//                   maxLength: {
//                     value: 200,
//                     message: "Class/grade cannot exceed 200 characters",
//                   },
//                 })}
//                 placeholder="Previous Class/Grade"
//                 className={`input input-bordered w-full focus:outline-none ${errors.previous_standard_studied ? "input-error" : ""
//                   }`}
//               />
//               {errors.previous_standard_studied && (
//                 <span className="text-error text-sm">
//                   {errors.previous_standard_studied.message}
//                 </span>
//               )}
//             </div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-calendar-check text-sm"></i>
//                   Admission Date <span className="text-error">*</span>
//                 </span>
//               </label>
//               <input
//                 type="date"
//                 {...register("admission_date", {
//                   required: "Admission date is required",
//                 })}
//                 className={`input input-bordered w-full focus:outline-none ${errors.admission_date ? "input-error" : ""
//                   }`}
//               />
//               {errors.admission_date && (
//                 <span className="text-error text-sm">
//                   {errors.admission_date.message}
//                 </span>
//               )}
//             </div>
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-file text-sm"></i>
//                   TC Letter <span className="text-error">*</span>
//                 </span>
//               </label>
//               <select
//                 {...register("tc_letter", {
//                   required: "TC letter status is required",
//                 })}
//                 className={`select select-bordered w-full focus:outline-none cursor-pointer ${errors.tc_letter ? "select-error" : ""
//                   }`}
//               >
//                 <option value="">Select</option>
//                 <option value="yes">Yes</option>
//                 <option value="no">No</option>
//                 <option value="not_applicable">Not applicable</option>
//               </select>
//               {errors.tc_letter && (
//                 <span className="text-error text-sm">
//                   {errors.tc_letter.message}
//                 </span>
//               )}
//             </div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-phone text-sm"></i>
//                   Emergency Contact <span className="text-error">*</span>
//                 </span>
//               </label>
//               <input
//                 type="tel"
//                 {...register("emergency_contact_no", {
//                   required: "Emergency contact is required",
//                   pattern: {
//                     value: /^\+?\d{10,15}$/,
//                     message: "Invalid phone number format",
//                   },
//                   maxLength: {
//                     value: 100,
//                     message: "Emergency contact cannot exceed 100 characters",
//                   },
//                 })}
//                 placeholder="Emergency Contact"
//                 className={`input input-bordered w-full focus:outline-none ${errors.emergencey_contact_no ? "input-error" : ""
//                   }`}
//               />
//               {errors.emergency_contact_no && (
//                 <span className="text-error text-sm">
//                   {errors.emergency_contact_no.message}
//                 </span>
//               )}
//             </div>
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-road text-sm"></i>
//                   Distance to School (km) <span className="text-error">*</span>
//                 </span>
//               </label>
//               <input
//                 type="number"
//                 {...register("entire_road_distance_from_home_to_school", {
//                   required: "Distance is required",
//                   min: { value: 0, message: "Distance cannot be negative" },
//                   maxLength: {
//                     value: 100,
//                     message: "Distance cannot exceed 100 characters",
//                   },
//                 })}
//                 placeholder="Distance in km"
//                 className={`input input-bordered w-full focus:outline-none ${errors.entire_road_distance_from_home_to_school
//                   ? "input-error"
//                   : ""
//                   }`}
//               />
//               {errors.entire_road_distance_from_home_to_school && (
//                 <span className="text-error text-sm">
//                   {errors.entire_road_distance_from_home_to_school.message}
//                 </span>
//               )}
//             </div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-marker text-sm"></i>
//                   Marks Obtained <span className="text-error">*</span>
//                 </span>
//               </label>
//               <input
//                 type="number"
//                 {...register("obtain_marks", {
//                   required: "Marks obtained is required",
//                   min: { value: 0, message: "Marks cannot be negative" },
//                 })}
//                 placeholder="Marks Obtained"
//                 className={`input input-bordered w-full focus:outline-none ${errors.obtain_marks ? "input-error" : ""
//                   }`}
//               />
//               {errors.obtain_marks && (
//                 <span className="text-error text-sm">
//                   {errors.obtain_marks.message}
//                 </span>
//               )}
//             </div>
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-chart-simple text-sm"></i>
//                   Total Marks <span className="text-error">*</span>
//                 </span>
//               </label>
//               <input
//                 type="number"
//                 {...register("total_marks", {
//                   required: "Total marks is required",
//                   min: { value: 0, message: "Total marks cannot be negative" },
//                 })}
//                 placeholder="Total Marks"
//                 className={`input input-bordered w-full focus:outline-none ${errors.total_marks ? "input-error" : ""
//                   }`}
//               />
//               {errors.total_marks && (
//                 <span className="text-error text-sm">
//                   {errors.total_marks.message}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Address Information Section */}
//         <div className="bg-base-200 p-6 rounded-box mb-6">
//           <h2 className="text-2xl font-bold mb-4">Residential Address</h2>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-home text-sm"></i>
//                   House Number
//                 </span>
//               </label>
//               <input
//                 type="number"
//                 {...register("address_input.house_no", {
//                   min: { value: -2147483648, message: "Invalid house number" },
//                   max: { value: 2147483647, message: "Invalid house number" },
//                 })}
//                 placeholder="House Number"
//                 className={`input input-bordered w-full focus:outline-none ${errors.address_input?.house_no ? "input-error" : ""
//                   }`}
//               />
//               {errors.address_input?.house_no && (
//                 <span className="text-error text-sm">
//                   {errors.address_input.house_no.message}
//                 </span>
//               )}
//             </div>
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-map-location text-sm"></i>
//                   Habitation <span className="text-error">*</span>
//                 </span>
//               </label>
//               <input
//                 type="text"
//                 {...register("address_input.habitation", {
//                   required: "Habitation is required",
//                   maxLength: {
//                     value: 100,
//                     message: "Habitation cannot exceed 100 characters",
//                   },
//                 })}
//                 placeholder="Habitation"
//                 className={`input input-bordered w-full focus:outline-none ${errors.address_input?.habitation ? "input-error" : ""
//                   }`}
//               />
//               {errors.address_input?.habitation && (
//                 <span className="text-error text-sm">
//                   {errors.address_input.habitation.message}
//                 </span>
//               )}
//             </div>
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-map text-sm"></i>
//                   Ward Number
//                 </span>
//               </label>
//               <input
//                 type="number"
//                 {...register("address_input.ward_no", {
//                   min: { value: -2147483648, message: "Invalid ward number" },
//                   max: { value: 2147483647, message: "Invalid ward number" },
//                 })}
//                 placeholder="Ward Number"
//                 className={`input input-bordered w-full focus:outline-none ${errors.address_input?.ward_no ? "input-error" : ""
//                   }`}
//               />
//               {errors.address_input?.ward_no && (
//                 <span className="text-error text-sm">
//                   {errors.address_input.ward_no.message}
//                 </span>
//               )}
//             </div>
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-map-pin text-sm"></i>
//                   Zone
//                 </span>
//               </label>
//               <input
//                 type="number"
//                 {...register("address_input.zone_no", {
//                   min: { value: -2147483648, message: "Invalid zone number" },
//                   max: { value: 2147483647, message: "Invalid zone number" },
//                 })}
//                 placeholder="Zone"
//                 className={`input input-bordered w-full focus:outline-none ${errors.address_input?.zone_no ? "input-error" : ""
//                   }`}
//               />
//               {errors.address_input?.zone_no && (
//                 <span className="text-error text-sm">
//                   {errors.address_input.zone_no.message}
//                 </span>
//               )}
//             </div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-building text-sm"></i>
//                   Block
//                 </span>
//               </label>
//               <input
//                 type="text"
//                 {...register("address_input.block", {
//                   maxLength: {
//                     value: 100,
//                     message: "Block cannot exceed 100 characters",
//                   },
//                 })}
//                 placeholder="Block"
//                 className={`input input-bordered w-full focus:outline-none ${errors.address_input?.block ? "input-error" : ""
//                   }`}
//               />
//               {errors.address_input?.block && (
//                 <span className="text-error text-sm">
//                   {errors.address_input.block.message}
//                 </span>
//               )}
//             </div>
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-map text-sm"></i>
//                   District
//                 </span>
//               </label>
//               <input
//                 type="text"
//                 {...register("address_input.district", {
//                   maxLength: {
//                     value: 100,
//                     message: "District cannot exceed 100 characters",
//                   },
//                 })}
//                 placeholder="District"
//                 className={`input input-bordered w-full focus:outline-none ${errors.address_input?.district ? "input-error" : ""
//                   }`}
//               />
//               {errors.address_input?.district && (
//                 <span className="text-error text-sm">
//                   {errors.address_input.district.message}
//                 </span>
//               )}
//             </div>
//             <div className="form-control relative">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-city text-sm"></i>
//                   City <span className="text-error">*</span>
//                 </span>
//               </label>

//               <div
//                 className="input input-bordered w-full flex items-center justify-between cursor-pointer"
//                 onClick={() => setShowCityDropdown(!showCityDropdown)}
//               >
//                 {selectedCityName || "Select City"}
//                 <i
//                   className={`fa-solid fa-chevron-${showCityDropdown ? "up" : "down"} ml-2`}
//                 ></i>
//               </div>

//               {showCityDropdown && (
//                 <div className="absolute z-10 bg-white dark:bg-[#242627] rounded w-full mt-1 shadow-lg border border-gray-300 dark:border-gray-600">
//                   <div className="p-2 sticky top-0 shadow-sm bg-white dark:bg-[#242627]">
//                     <input
//                       type="text"
//                       placeholder="Search City..."
//                       className="input input-bordered w-full focus:outline-none bg-white dark:bg-[#242627] text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-500"
//                       value={citySearchInput}
//                       onChange={(e) => setCitySearchInput(e.target.value)}
//                     />
//                   </div>

//                   <div className="max-h-40 overflow-y-auto">
//                     {filteredCities.length > 0 ? (
//                       filteredCities.map(
//                         (city) =>
//                           city && (
//                             <p
//                               key={city.id}
//                               className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer text-gray-800 dark:text-gray-200 capitalize"
//                               onClick={() => {
//                                 setValue("address_input.city", city.id.toString(), {
//                                   shouldValidate: true,
//                                 });
//                                 setSelectedCityName(city.name);
//                                 setCitySearchInput("");
//                                 setShowCityDropdown(false);
//                               }}
//                             >
//                               {city.name}
//                             </p>
//                           )
//                       )
//                     ) : (
//                       <p className="p-2 text-gray-500 dark:text-gray-400">No cities found</p>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {errors.address_input?.city && (
//                 <span className="text-error text-sm">{errors.address_input.city.message}</span>
//               )}
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-map-signs text-sm"></i>
//                   Division
//                 </span>
//               </label>
//               <input
//                 type="text"
//                 {...register("address_input.division", {
//                   maxLength: {
//                     value: 100,
//                     message: "Division cannot exceed 100 characters",
//                   },
//                 })}
//                 placeholder="Division"
//                 className={`input input-bordered w-full focus:outline-none ${errors.address_input?.division ? "input-error" : ""
//                   }`}
//               />
//               {errors.address_input?.division && (
//                 <span className="text-error text-sm">
//                   {errors.address_input.division.message}
//                 </span>
//               )}
//             </div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//             <div className="form-control relative">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-flag text-sm"></i>
//                   State <span className="text-error">*</span>
//                 </span>
//               </label>

//               <div
//                 className="input input-bordered w-full flex items-center justify-between cursor-pointer"
//                 onClick={() => setShowStateDropdown(!showStateDropdown)}
//               >
//                 {selectedStateName || "Select State"}
//                 <i
//                   className={`fa-solid fa-chevron-${showStateDropdown ? "up" : "down"} ml-2`}
//                 ></i>
//               </div>

//               {showStateDropdown && (
//                 <div className="absolute z-10 bg-white dark:bg-[#242627] rounded w-full mt-1 shadow-lg border border-gray-300 dark:border-gray-600">
//                   <div className="p-2 sticky top-0 shadow-sm bg-white dark:bg-[#242627]">
//                     <input
//                       type="text"
//                       placeholder="Search State..."
//                       className="input input-bordered w-full focus:outline-none bg-white dark:bg-[#242627] text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-500"
//                       value={stateSearchInput}
//                       onChange={(e) => setStateSearchInput(e.target.value)}
//                     />
//                   </div>

//                   <div className="max-h-40 overflow-y-auto">
//                     {filteredStates.length > 0 ? (
//                       filteredStates.map((state) => (
//                         <p
//                           key={state.id}
//                           className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer text-gray-800 dark:text-gray-200 capitalize"
//                           onClick={() => {
//                             setValue("address_input.state", state.id.toString(), {
//                               shouldValidate: true,
//                             });
//                             setSelectedStateName(state.name);
//                             setStateSearchInput("");
//                             setShowStateDropdown(false);
//                           }}
//                         >
//                           {state.name}
//                         </p>
//                       ))
//                     ) : (
//                       <p className="p-2 text-gray-500 dark:text-gray-400">No states found</p>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {errors.address_input?.state && (
//                 <span className="text-error text-sm">{errors.address_input.state.message}</span>
//               )}
//             </div>

//             <div className="form-control relative">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-globe text-sm"></i>
//                   Country <span className="text-error">*</span>
//                 </span>
//               </label>

//               <div
//                 className="input input-bordered w-full flex items-center justify-between cursor-pointer "
//                 onClick={() => setShowCountryDropdown(!showCountryDropdown)}
//               >
//                 {selectedCountryName || "Select Country"}
//                 <i
//                   className={`fa-solid fa-chevron-${showCountryDropdown ? "up" : "down"} ml-2`}
//                 ></i>
//               </div>

//               {showCountryDropdown && (
//                 <div className="absolute z-10 bg-white dark:bg-[#242627] rounded w-full mt-1 shadow-lg border border-gray-300 dark:border-gray-600">
//                   <div className="p-2 sticky top-0 shadow-sm">
//                     <input
//                       type="text"
//                       placeholder="Search Country..."
//                       className="input input-bordered w-full focus:outline-none bg-white dark:bg-[#242627] text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-500"
//                       value={countrySearchInput}
//                       onChange={(e) => setCountrySearchInput(e.target.value)}
//                     />
//                   </div>

//                   <div className="max-h-40 overflow-y-auto">
//                     {filteredCountries.length > 0 ? (
//                       filteredCountries.map((country) => (
//                         <p
//                           key={country.id}
//                           className="p-2 cursor-pointer capitalize"
//                           onClick={() => {
//                             setValue("address_input.country", country.id.toString(), {
//                               shouldValidate: true,
//                             });
//                             setSelectedCountryName(country.name);
//                             setCountrySearchInput("");
//                             setShowCountryDropdown(false);
//                           }}
//                         >
//                           {country.name}
//                         </p>
//                       ))
//                     ) : (
//                       <p className="p-2 text-gray-500 dark:text-gray-400">No countries found</p>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {errors.address_input?.country && (
//                 <span className="text-error text-sm">{errors.address_input.country.message}</span>
//               )}
//             </div>

//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-mailbox text-sm"></i>
//                   Pin Code <span className="text-error">*</span>
//                 </span>
//               </label>
//               <input
//                 type="number"
//                 {...register("address_input.area_code", {
//                   required: "Pin code is required",
//                   min: { value: -2147483648, message: "Invalid pin code" },
//                   max: { value: 2147483647, message: "Invalid pin code" },
//                 })}
//                 placeholder="Pin Code"
//                 className={`input input-bordered w-full focus:outline-none ${errors.address_input?.area_code ? "input-error" : ""
//                   }`}
//               />
//               {errors.address_input?.area_code && (
//                 <span className="text-error text-sm">
//                   {errors.address_input.area_code.message}
//                 </span>
//               )}
//             </div>
//           </div>
//           <div className="grid grid-cols-1 mt-6">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-location-dot text-sm"></i>
//                   Full Address Line
//                 </span>
//               </label>
//               <textarea
//                 {...register("address_input.address_line", {
//                   maxLength: {
//                     value: 250,
//                     message: "Address line cannot exceed 250 characters",
//                   },
//                 })}
//                 placeholder="Full Address"
//                 className="textarea textarea-bordered w-full focus:outline-none"
//               ></textarea>
//               {errors.address_input?.address_line && (
//                 <span className="text-error text-sm">
//                   {errors.address_input.address_line.message}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Bank Details Section */}
//         <div className="bg-base-200 p-6 rounded-box mb-6">
//           <h2 className="text-2xl font-bold mb-4">Bank Account Details</h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Account Holder Name */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-user text-sm"></i>
//                   Account Holder Name <span className="text-error">*</span>
//                 </span>
//               </label>
//               <input
//                 type="text"
//                 {...register("banking_detail_input.holder_name", {
//                   required: "Account holder name is required",
//                   maxLength: {
//                     value: 50,
//                     message: "Holder name cannot exceed 50 characters",
//                   },
//                   validate: (value) => {
//                     if (!value.trim()) return "Account holder name is required";
//                     if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(value))
//                       return "Enter a valid name (alphabets & single spaces only)";
//                     return true;
//                   },
//                 })}
//                 placeholder="Full Name as in Bank"
//                 className={`input input-bordered w-full focus:outline-none ${errors.banking_detail_input?.holder_name ? "input-error" : ""
//                   }`}
//                 onInput={(e) => {
//                   e.target.value = e.target.value
//                     .replace(/[^A-Za-z\s]/g, "")
//                     .replace(/\s+/g, " ")
//                     .replace(/^\s+/g, "");
//                 }}
//               />
//               {errors.banking_detail_input?.holder_name && (
//                 <span className="text-error text-sm">
//                   {errors.banking_detail_input.holder_name.message}
//                 </span>
//               )}
//             </div>
//             {/* Account Number */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-credit-card text-sm"></i>
//                   Account Number <span className="text-error">*</span>
//                 </span>
//               </label>
//               <input
//                 type="text"
//                 {...register("banking_detail_input.account_no", {
//                   required: "Account number is required",
//                   minLength: {
//                     value: 9,
//                     message: "Account number must be at least 9 digits",
//                   },
//                   maxLength: {
//                     value: 18,
//                     message: "Account number cannot exceed 18 digits",
//                   },
//                   validate: (value) => {
//                     if (!/^[0-9]+$/.test(value))
//                       return "Account number must contain digits only";
//                     if (/^0+$/.test(value))
//                       return "Account number cannot be all zeros";
//                     return true;
//                   },
//                 })}
//                 placeholder="Account Number"
//                 className={`input input-bordered w-full focus:outline-none ${errors.banking_detail_input?.account_no ? "input-error" : ""
//                   }`}
//                 onInput={(e) => {
//                   e.target.value = e.target.value.replace(/[^0-9]/g, "");
//                 }}
//               />
//               {errors.banking_detail_input?.account_no && (
//                 <span className="text-error text-sm">
//                   {errors.banking_detail_input.account_no.message}
//                 </span>
//               )}
//             </div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//             {/* IFSC Code */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <i className="fa-solid fa-code text-sm"></i>
//                   IFSC Code <span className="text-error">*</span>
//                 </span>
//               </label>
//               <input
//                 type="text"
//           {...register("banking_detail_input.ifsc_code", {
//   required: "IFSC code is required",
//   pattern: {
//     value: /^[A-Z]{4}[0-9A-Z][A-Z0-9]{6}$/,
//     message:
//       "Invalid IFSC code format (e.g. SBIN0001234 or BARBOBHOPAL)",
//   },
// })}
//                 placeholder="eg: SBIN0001234"
//                 className={`input input-bordered w-full focus:outline-none ${errors.banking_detail_input?.ifsc_code ? "input-error" : ""
//                   }`}
//                 onInput={(e) => {
//                   e.target.value = e.target.value
//                     .toUpperCase()
//                     .replace(/[^A-Z0-9]/g, "");
//                 }}
//               />
//               {errors.banking_detail_input?.ifsc_code && (
//                 <span className="text-error text-sm">
//                   {errors.banking_detail_input.ifsc_code.message}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>
//         {/* Submit Button */}
//         <div className="flex justify-center mt-10">
//           <button
//             type="submit"
//             className="btn bgTheme text-white w-40"
//             disabled={loading}
//           >
//             {loading ? (
//               <i className="fa-solid fa-spinner fa-spin mr-2"></i>
//             ) : (
//               <i className="fa-solid fa-floppy-disk mr-2"></i>
//             )}
//             {loading ? "" : "Update"}
//           </button>
//         </div>
//       </form>
//       {showEditSuccessModal && (
//         <AdmissionEditedSuccessfully
//           handleCloseOnly={handleCloseOnly}
//           handleCloseAndNavigate={handleCloseAndNavigate}
//         />
//       )}
//       {/* Modal */}
//       {showAlert && (
//         <dialog open className="modal modal-open">
//           <div className="modal-box dark:bg-gray-800 dark:text-gray-100">
//             <h3 className="font-bold text-lg">Edit Student Details</h3>
//             <p className="py-4">{alertMessage}</p>
//             <div className="modal-action">
//               <button
//                 className="btn bgTheme text-white w-30"
//                 onClick={() => setShowAlert(false)}
//               >
//                 OK
//               </button>
//             </div>
//           </div>
//         </dialog>
//       )}
//     </div>
//   );
// };



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
  const [loading, setLoading] = useState(false); // submit loader
  const [error, setError] = useState(false);
  const [selectedGuardianType, setSelectedGuardianType] = useState("");
  const [country, setCountry] = useState([]);
  const [state, setState] = useState([]);
  const [city, setCity] = useState([]);
  const [formData, setFormData] = useState(null);
  const [isRTE, setIsRTE] = useState(false);
  const [rteNumber, setRteNumber] = useState("");
  const [showEditSuccessModal, setShowEditSuccessModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const formRef = useRef(null);

  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [selectedCityName, setSelectedCityName] = useState("");
  const [citySearchInput, setCitySearchInput] = useState("");

  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [selectedStateName, setSelectedStateName] = useState("");
  const [stateSearchInput, setStateSearchInput] = useState("");

  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [selectedCountryName, setSelectedCountryName] = useState("");
  const [countrySearchInput, setCountrySearchInput] = useState("");

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
    resetField,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      student: {
        father_name: "",
        mother_name: "",
        date_of_birth: "",
        religion: "",
        category: "",
        height: 0,
        weight: 0,
        blood_group: "",
        number_of_siblings: 0,
        roll_number: "",
        classes: "",
        is_active: "true",
        user_fields: {
          first_name: "",
          middle_name: "",
          last_name: "",
          email: "",
          password: "",
          phone_no: "",
          gender: "",
          qualification: "",
          aadhar_no: "",
          pan_no: "",
          active: true,
          roles: ["student"],
        },
      },
      guardian: {
        annual_income: 0,
        means_of_livelihood: "",
        occupation: "",
        designation: "",
        user_fields: {
          first_name: "",
          middle_name: "",
          last_name: "",
          email: "",
          password: "",
          phone_no: "",
          qualification: "",
          gender: "",
          aadhar_no: "",
          pan_no: "",
          active: true,
          roles: ["guardian"],
        },
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
      guardian_type_input: "",
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
    } catch {
      console.log("Failed to load year levels. Please try again.");
    }
  };

  const getSchoolYears = async () => {
    try {
      const schoolYears = await fetchSchoolYear();
      setSchoolYear(schoolYears);
    } catch {
      console.log("Failed to load school years. Please try again.");
    }
  };

  const getGuardianType = async () => {
    try {
      const guardianType = await fetchGuardianType();
      setGuardianType(guardianType);
    } catch {
      console.log("Failed to load guardian type. Please try again.");
    }
  };

  const getCountry = async () => {
    try {
      const countryList = await fetchCountry();
      setCountry(countryList);
    } catch {
      console.log("Failed to load countries. Please try again.");
    }
  };

  const getState = async () => {
    try {
      const stateList = await fetchState();
      setState(stateList);
    } catch {
      console.log("Failed to load states. Please try again.");
    }
  };

  const getCity = async () => {
    try {
      const cityList = await fetchCity();
      setCity(cityList);
    } catch {
      console.log("Failed to load cities. Please try again.");
    }
  };

  const getAdmissionData = async () => {
    try {
      const response = await fetchAdmissionDetailsById(id);
      if (!response) throw new Error("No response received from API");

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

      // ---- Prefill student ----
      if (response.student_input) {
        const s = response.student_input;

        setValue("student.father_name", s.father_name || "");
        setValue("student.mother_name", s.mother_name || "");
        setValue("student.date_of_birth", s.date_of_birth || "");
        setValue("student.religion", s.religion || "");
        setValue("student.category", s.category || "");
        setValue("student.height", s.height || 0);
        setValue("student.weight", s.weight || 0);
        setValue("student.blood_group", s.blood_group || "");
        setValue("student.number_of_siblings", s.number_of_siblings || 0);

        setValue("student.user_fields.first_name", s.first_name || "");
        setValue("student.user_fields.middle_name", s.middle_name || "");
        setValue("student.user_fields.last_name", s.last_name || "");
        setValue("student.user_fields.email", s.email || "");
        setValue("student.user_fields.gender", s.gender || "");

        if (typeof s.is_active !== "undefined" && s.is_active !== null) {
          setValue("student.is_active", s.is_active ? "true" : "false", {
            shouldValidate: false,
          });
        }
      }

      // ---- Prefill guardian ----
      if (response.guardian_input) {
        const g = response.guardian_input;

        setValue("guardian.annual_income", g.annual_income || 0);
        setValue("guardian.means_of_livelihood", g.means_of_livelihood || "");
        setValue("guardian.occupation", g.occupation || "");
        setValue("guardian.designation", g.designation || "");

        setValue("guardian.user_fields.first_name", g.first_name || "");
        setValue("guardian.user_fields.middle_name", g.middle_name || "");
        setValue("guardian.user_fields.last_name", g.last_name || "");
        setValue("guardian.user_fields.email", g.email || "");
        setValue("guardian.user_fields.phone_no", g.phone_no || "");
        setValue("guardian.user_fields.qualification", g.qualification || "");
        setValue("guardian.user_fields.gender", g.gender || "");
      }

      // ---- Prefill address ----
      if (response.address) {
        Object.entries(response.address).forEach(([key, value]) => {
          if (value !== null) {
            const formKey =
              key === "area_code"
                ? "area_code"
                : key === "house_no"
                ? "house_no"
                : key === "ward_no"
                ? "ward_no"
                : key === "zone_no"
                ? "zone_no"
                : key;
            setValue(`address_input.${formKey}`, value);
          }
        });

        if (countryObj) {
          setValue("address_input.country", countryObj.id);
          setSelectedCountryName(countryObj.name);
        }

        if (stateObj) {
          setValue("address_input.state", stateObj.id);
          setSelectedStateName(stateObj.name);
        }

        if (cityObj) {
          setValue("address_input.city", cityObj.id);
          setSelectedCityName(cityObj.name);
        }
      }

      // ---- Prefill banking ----
      if (response.banking_detail) {
        Object.entries(response.banking_detail).forEach(([key, value]) => {
          if (value !== null) {
            setValue(`banking_detail_input.${key}`, value);
          }
        });
      }

      // ---- Other root fields ----
      if (response.year_level) setValue("year_level", response.year_level);
      if (response.school_year) setValue("school_year", response.school_year);
      if (response.admission_date)
        setValue("admission_date", response.admission_date);
      if (response.previous_school_name)
        setValue("previous_school_name", response.previous_school_name);
      if (response.previous_standard_studied)
        setValue(
          "previous_standard_studied",
          response.previous_standard_studied
        );
      if (response.tc_letter) setValue("tc_letter", response.tc_letter);
      if (response.emergency_contact_no)
        setValue("emergency_contact_no", response.emergency_contact_no);
      if (response.entire_road_distance_from_home_to_school)
        setValue(
          "entire_road_distance_from_home_to_school",
          response.entire_road_distance_from_home_to_school
        );
      if (response.obtain_marks)
        setValue("obtain_marks", response.obtain_marks);
      if (response.total_marks) setValue("total_marks", response.total_marks);
      if (typeof response.is_rte !== "undefined")
        setValue("is_rte", response.is_rte);
      if (response.rte_number) setValue("rte_number", response.rte_number);

      if (response.guardian_type) {
        setValue("guardian_type_input", response.guardian_type);
        setSelectedGuardianType(response.guardian_type);
      }
    } catch (err) {
      console.error("Error fetching admission details:", err);
      setError(true);
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

  // --------- FINAL onSubmit (JSON same as AdmissionForm) ---------
  const onSubmit = async (data) => {
    setLoading(true);
    console.log("Edit form submit data:", data);

    try {
      // classes / scholar / roll
      data.student.roll_number = data.student.roll_number || null;
      data.student.scholar_number = data.student.scholar_number || null;
      data.student.classes = data.year_level || "";

      // status string -> boolean (if present)
      if (typeof data.student.is_active === "string") {
        data.student.is_active = data.student.is_active === "true";
      }

      // student ka phone guardian se
      data.student.user_fields.phone_no =
        data.guardian.user_fields.phone_no || null;

      // previous_percentage
      const obtain = Number(data.obtain_marks || 0);
      const total = Number(data.total_marks || 0);
      data.previous_percentage = total ? (obtain / total) * 100 : 0;

      // RTE
      if (!data.is_rte) {
        data.is_rte = false;
        data.rte_number = "";
      }

      // JSON payload to API
      await handleEditAdmissionForm(data, id);

      setShowEditSuccessModal(true);
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message);
      setAlertMessage(
        `Failed to update the form: ${
          error.response?.data?.message ||
          JSON.stringify(error.response?.data) ||
          error.message
        }`
      );
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const filteredCities = city
    .filter((c) =>
      c.name.toLowerCase().includes(citySearchInput.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const filteredStates = state
    .filter((s) =>
      s.name.toLowerCase().includes(stateSearchInput.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const filteredCountries = country
    .filter((c) =>
      c.name.toLowerCase().includes(countrySearchInput.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  if (!formData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce [animation-delay:-0.2s]"></div>
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce [animation-delay:-0.4s]"></div>
        </div>
        <p className="mt-2 text-gray-500 text-sm">
          Loading admission details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
        <i className="fa-solid fa-triangle-exclamation text-5xl text-red-400 mb-4"></i>
        <p className="text-lg text-red-400 font-medium">
          Failed to load data, Try Again
        </p>
      </div>
    );
  }

  return (
    <div className="mb-24 md:mb-10">
      <style>{constants.hideEdgeRevealStyle}</style>
      <form
        ref={formRef}
        className="w-full max-w-7xl mx-auto p-6 bg-base-100 rounded-box my-5 shadow-sm focus:outline-none mb-10"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-3xl font-bold text-center mb-8">
          Edit Student Details{" "}
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
            {/* Student first / middle / last */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-user text-sm"></i>
                  First Name <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="text"
                {...register("student.user_fields.first_name", {
                  required: "First name is required",
                  maxLength: {
                    value: 100,
                    message: "First name cannot exceed 100 characters",
                  },
                })}
                placeholder="First Name"
                className={`input input-bordered w-full focus:outline-none ${
                  errors.student?.user_fields?.first_name ? "input-error" : ""
                }`}
              />
              {errors.student?.user_fields?.first_name && (
                <span className="text-error text-sm">
                  {errors.student.user_fields.first_name.message}
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
                {...register("student.user_fields.middle_name", {
                  maxLength: {
                    value: 100,
                    message: "Middle name cannot exceed 100 characters",
                  },
                })}
                placeholder="Middle Name"
                className={`input input-bordered w-full focus:outline-none ${
                  errors.student?.user_fields?.middle_name ? "input-error" : ""
                }`}
              />
              {errors.student?.user_fields?.middle_name && (
                <span className="text-error text-sm">
                  {errors.student.user_fields.middle_name.message}
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
                {...register("student.user_fields.last_name", {
                  required: "Last name is required",
                  maxLength: {
                    value: 100,
                    message: "Last name cannot exceed 100 characters",
                  },
                })}
                placeholder="Last Name"
                className={`input input-bordered w-full focus:outline-none ${
                  errors.student?.user_fields?.last_name ? "input-error" : ""
                }`}
              />
              {errors.student?.user_fields?.last_name && (
                <span className="text-error text-sm">
                  {errors.student.user_fields.last_name.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Student email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-envelope text-sm"></i>
                  Email <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="email"
                {...register("student.user_fields.email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Invalid email format",
                  },
                })}
                placeholder="student@example.com"
                className={`input input-bordered w-full focus:outline-none ${
                  errors.student?.user_fields?.email ? "input-error" : ""
                }`}
              />
              {errors.student?.user_fields?.email && (
                <span className="text-error text-sm">
                  {errors.student.user_fields.email.message}
                </span>
              )}
            </div>

            {/* Status - prefilled, disabled */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  Status <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="hidden"
                {...register("student.is_active", {
                  required: "Status is required",
                })}
              />
              <select
                value={watch("student.is_active") || ""}
                className={`select select-bordered w-full focus:outline-none ${
                  errors.student?.is_active ? "select-error" : ""
                }`}
                disabled
              >
                <option value="">Select Status</option>
                <option value="true">Active</option>
                <option value="false">InActive</option>
              </select>
              {errors.student?.is_active && (
                <span className="text-error text-sm">
                  {errors.student.is_active.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* DOB */}
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
                  validate: {
                    notFuture: (value) => {
                      const selectedDate = new Date(value);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return (
                        selectedDate <= today ||
                        "Date of birth cannot be in the future"
                      );
                    },
                  },
                })}
                max={new Date().toISOString().split("T")[0]}
                className={`input input-bordered w-full focus:outline-none ${
                  errors.student?.date_of_birth ? "input-error" : ""
                }`}
              />
              {errors.student?.date_of_birth && (
                <span className="text-error text-sm">
                  {errors.student.date_of_birth.message}
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
                {...register("student.user_fields.gender", {
                  required: "Gender is required",
                })}
                className={`select select-bordered w-full focus:outline-none cursor-pointer ${
                  errors.student?.user_fields?.gender ? "select-error" : ""
                }`}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.student?.user_fields?.gender && (
                <span className="text-error text-sm">
                  {errors.student.user_fields.gender.message}
                </span>
              )}
            </div>
          </div>

          {/* Father/Mother/Religion */}
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
                className={`input input-bordered w-full focus:outline-none ${
                  errors.student?.father_name ? "input-error" : ""
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
                className={`input input-bordered w-full focus:outline-none ${
                  errors.student?.mother_name ? "input-error" : ""
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
                className={`input input-bordered w-full focus:outline-none ${
                  errors.student?.religion ? "input-error" : ""
                }`}
              />
              {errors.student?.religion && (
                <span className="text-error text-sm">
                  {errors.student.religion.message}
                </span>
              )}
            </div>
          </div>

          {/* Category / Height / Weight / Blood */}
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
                className={`select select-bordered w-full focus:outline-none cursor-pointer ${
                  errors.student?.category ? "select-error" : ""
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
                className={`input input-bordered w-full focus:outline-none ${
                  errors.student?.height ? "input-error" : ""
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
                className={`input input-bordered w-full focus:outline-none ${
                  errors.student?.weight ? "input-error" : ""
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

          {/* Siblings & RTE */}
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
                className={`input input-bordered w-full focus:outline-none ${
                  errors.student?.number_of_siblings ? "input-error" : ""
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
                className={`input input-bordered w-full focus:outline-none ${
                  errors.rte_number ? "input-error" : ""
                } ${
                  !isRTE ? "input-disabled bg-gray-200 cursor-not-allowed" : ""
                }`}
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

          {/* Guardian names */}
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
                {...register("guardian.user_fields.first_name", {
                  required: "First name is required",
                  maxLength: {
                    value: 100,
                    message: "First name cannot exceed 100 characters",
                  },
                })}
                placeholder="First Name"
                className={`input input-bordered w-full focus:outline-none ${
                  errors.guardian?.user_fields?.first_name
                    ? "input-error"
                    : ""
                }`}
              />
              {errors.guardian?.user_fields?.first_name && (
                <span className="text-error text-sm">
                  {errors.guardian.user_fields.first_name.message}
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
                {...register("guardian.user_fields.middle_name", {
                  maxLength: {
                    value: 100,
                    message: "Middle name cannot exceed 100 characters",
                  },
                })}
                placeholder="Middle Name"
                className={`input input-bordered w-full focus:outline-none ${
                  errors.guardian?.user_fields?.middle_name
                    ? "input-error"
                    : ""
                }`}
              />
              {errors.guardian?.user_fields?.middle_name && (
                <span className="text-error text-sm">
                  {errors.guardian.user_fields.middle_name.message}
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
                {...register("guardian.user_fields.last_name", {
                  required: "Last name is required",
                  maxLength: {
                    value: 100,
                    message: "Last name cannot exceed 100 characters",
                  },
                })}
                placeholder="Last Name"
                className={`input input-bordered w-full focus:outline-none ${
                  errors.guardian?.user_fields?.last_name
                    ? "input-error"
                    : ""
                }`}
              />
              {errors.guardian?.user_fields?.last_name && (
                <span className="text-error text-sm">
                  {errors.guardian.user_fields.last_name.message}
                </span>
              )}
            </div>
          </div>

          {/* Guardian email / type / phone */}
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
                {...register("guardian.user_fields.email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Invalid email format",
                  },
                })}
                placeholder="guardian@example.com"
                className={`input input-bordered w-full focus:outline-none ${
                  errors.guardian?.user_fields?.email ? "input-error" : ""
                }`}
              />
              {errors.guardian?.user_fields?.email && (
                <span className="text-error text-sm">
                  {errors.guardian.user_fields.email.message}
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
                className={`select select-bordered w-full focus:outline-none cursor-pointer ${
                  errors.guardian_type_input ? "select-error" : ""
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

            <div className="form-control mt-6 md:mt-0">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-phone text-sm"></i>
                  Phone Number <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="tel"
                {...register("guardian.user_fields.phone_no", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[6789]\d{9}$/,
                    message:
                      "Phone number must start with 6, 7, 8, or 9 and be exactly 10 digits",
                  },
                  minLength: {
                    value: 10,
                    message: "Phone number must be exactly 10 digits",
                  },
                  maxLength: {
                    value: 10,
                    message: "Phone number must be exactly 10 digits",
                  },
                })}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
                }}
                placeholder="Phone Number"
                className={`input input-bordered w-full focus:outline-none ${
                  errors.guardian?.user_fields?.phone_no ? "input-error" : ""
                }`}
              />
              {errors.guardian?.user_fields?.phone_no && (
                <span className="text-error text-sm">
                  {errors.guardian.user_fields.phone_no.message}
                </span>
              )}
            </div>
          </div>

          {/* Guardian annual income / livelihood / qualification */}
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
                className={`input input-bordered w-full focus:outline-none ${
                  errors.guardian?.annual_income ? "input-error" : ""
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
                {...register("guardian.user_fields.qualification", {
                  required: "Qualification is required",
                  maxLength: {
                    value: 300,
                    message: "Qualification cannot exceed 300 characters",
                  },
                })}
                placeholder="Qualification"
                className={`input input-bordered w-full focus:outline-none ${
                  errors.guardian?.user_fields?.qualification
                    ? "input-error"
                    : ""
                }`}
              />
              {errors.guardian?.user_fields?.qualification && (
                <span className="text-error text-sm">
                  {errors.guardian.user_fields.qualification.message}
                </span>
              )}
            </div>
          </div>

          {/* Guardian occupation / designation */}
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
                className={`input input-bordered w-full focus:outline-none ${
                  errors.guardian?.occupation ? "input-error" : ""
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
            {/* Year level */}
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
                className={`select select-bordered w-full focus:outline-none cursor-pointer ${
                  errors.year_level ? "select-error" : ""
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

            {/* School year */}
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
                className={`select select-bordered w-full focus:outline-none cursor-pointer ${
                  errors.school_year ? "select-error" : ""
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

          {/* Previous school / class */}
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
                className={`input input-bordered w-full focus:outline-none ${
                  errors.previous_school_name ? "input-error" : ""
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
                className={`input input-bordered w-full focus:outline-none ${
                  errors.previous_standard_studied ? "input-error" : ""
                }`}
              />
              {errors.previous_standard_studied && (
                <span className="text-error text-sm">
                  {errors.previous_standard_studied.message}
                </span>
              )}
            </div>
          </div>

          {/* Admission date / TC */}
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
                className={`input input-bordered w-full focus:outline-none ${
                  errors.admission_date ? "input-error" : ""
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
                className={`select select-bordered w-full focus:outline-none cursor-pointer ${
                  errors.tc_letter ? "select-error" : ""
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

          {/* Emergency / Distance */}
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
                    message:
                      "Emergency contact cannot exceed 100 characters",
                  },
                })}
                placeholder="Emergency Contact"
                className={`input input-bordered w-full focus:outline-none ${
                  errors.emergency_contact_no ? "input-error" : ""
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
                  Distance to School (km){" "}
                  <span className="text-error">*</span>
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
                className={`input input-bordered w-full focus:outline-none ${
                  errors.entire_road_distance_from_home_to_school
                    ? "input-error"
                    : ""
                }`}
              />
              {errors.entire_road_distance_from_home_to_school && (
                <span className="text-error text-sm">
                  {
                    errors.entire_road_distance_from_home_to_school
                      .message
                  }
                </span>
              )}
            </div>
          </div>

          {/* Marks */}
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
                className={`input input-bordered w-full focus:outline-none ${
                  errors.obtain_marks ? "input-error" : ""
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
                className={`input input-bordered w-full focus:outline-none ${
                  errors.total_marks ? "input-error" : ""
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
            {/* House No */}
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
                className={`input input-bordered w-full focus:outline-none ${
                  errors.address_input?.house_no ? "input-error" : ""
                }`}
              />
              {errors.address_input?.house_no && (
                <span className="text-error text-sm">
                  {errors.address_input.house_no.message}
                </span>
              )}
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
                {...register("address_input.habitation", {
                  required: "Habitation is required",
                  maxLength: {
                    value: 100,
                    message: "Habitation cannot exceed 100 characters",
                  },
                })}
                placeholder="Habitation"
                className={`input input-bordered w-full focus:outline-none ${
                  errors.address_input?.habitation ? "input-error" : ""
                }`}
              />
              {errors.address_input?.habitation && (
                <span className="text-error text-sm">
                  {errors.address_input.habitation.message}
                </span>
              )}
            </div>

            {/* Ward No */}
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
                className={`input input-bordered w-full focus:outline-none ${
                  errors.address_input?.ward_no ? "input-error" : ""
                }`}
              />
              {errors.address_input?.ward_no && (
                <span className="text-error text-sm">
                  {errors.address_input.ward_no.message}
                </span>
              )}
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
                type="number"
                {...register("address_input.zone_no", {
                  min: { value: -2147483648, message: "Invalid zone number" },
                  max: { value: 2147483647, message: "Invalid zone number" },
                })}
                placeholder="Zone"
                className={`input input-bordered w-full focus:outline-none ${
                  errors.address_input?.zone_no ? "input-error" : ""
                }`}
              />
              {errors.address_input?.zone_no && (
                <span className="text-error text-sm">
                  {errors.address_input.zone_no.message}
                </span>
              )}
            </div>
          </div>

          {/* Block/District/City/Division */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
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
                {...register("address_input.block", {
                  maxLength: {
                    value: 100,
                    message: "Block cannot exceed 100 characters",
                  },
                })}
                placeholder="Block"
                className={`input input-bordered w-full focus:outline-none ${
                  errors.address_input?.block ? "input-error" : ""
                }`}
              />
              {errors.address_input?.block && (
                <span className="text-error text-sm">
                  {errors.address_input.block.message}
                </span>
              )}
            </div>

            {/* District */}
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
                className={`input input-bordered w-full focus:outline-none ${
                  errors.address_input?.district ? "input-error" : ""
                }`}
              />
              {errors.address_input?.district && (
                <span className="text-error text-sm">
                  {errors.address_input.district.message}
                </span>
              )}
            </div>

            {/* City custom dropdown */}
            <div className="form-control relative">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-city text-sm"></i>
                  City <span className="text-error">*</span>
                </span>
              </label>
              <div
                className="input input-bordered w-full flex items-center justify-between cursor-pointer"
                onClick={() => setShowCityDropdown(!showCityDropdown)}
              >
                {selectedCityName || "Select City"}
                <i
                  className={`fa-solid fa-chevron-${
                    showCityDropdown ? "up" : "down"
                  } ml-2`}
                ></i>
              </div>

              {showCityDropdown && (
                <div className="absolute z-10 bg-white dark:bg-[#242627] rounded w-full mt-1 shadow-lg border border-gray-300 dark:border-gray-600">
                  <div className="p-2 sticky top-0 shadow-sm bg-white dark:bg-[#242627]">
                    <input
                      type="text"
                      placeholder="Search City..."
                      className="input input-bordered w-full focus:outline-none bg-white dark:bg-[#242627] text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-500"
                      value={citySearchInput}
                      onChange={(e) => setCitySearchInput(e.target.value)}
                    />
                  </div>
                  <div className="max-h-40 overflow-y-auto">
                    {filteredCities.length > 0 ? (
                      filteredCities.map(
                        (ct) =>
                          ct && (
                            <p
                              key={ct.id}
                              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer text-gray-800 dark:text-gray-200 capitalize"
                              onClick={() => {
                                setValue(
                                  "address_input.city",
                                  ct.id.toString(),
                                  { shouldValidate: true }
                                );
                                setSelectedCityName(ct.name);
                                setCitySearchInput("");
                                setShowCityDropdown(false);
                              }}
                            >
                              {ct.name}
                            </p>
                          )
                      )
                    ) : (
                      <p className="p-2 text-gray-500 dark:text-gray-400">
                        No cities found
                      </p>
                    )}
                  </div>
                </div>
              )}

              {errors.address_input?.city && (
                <span className="text-error text-sm">
                  {errors.address_input.city.message}
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
                {...register("address_input.division", {
                  maxLength: {
                    value: 100,
                    message: "Division cannot exceed 100 characters",
                  },
                })}
                placeholder="Division"
                className={`input input-bordered w-full focus:outline-none ${
                  errors.address_input?.division ? "input-error" : ""
                }`}
              />
              {errors.address_input?.division && (
                <span className="text-error text-sm">
                  {errors.address_input.division.message}
                </span>
              )}
            </div>
          </div>

          {/* State/Country */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* State */}
            <div className="form-control relative">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-flag text-sm"></i>
                  State <span className="text-error">*</span>
                </span>
              </label>
              <div
                className="input input-bordered w-full flex items-center justify-between cursor-pointer"
                onClick={() => setShowStateDropdown(!showStateDropdown)}
              >
                {selectedStateName || "Select State"}
                <i
                  className={`fa-solid fa-chevron-${
                    showStateDropdown ? "up" : "down"
                  } ml-2`}
                ></i>
              </div>
              {showStateDropdown && (
                <div className="absolute z-10 bg-white dark:bg-[#242627] rounded w-full mt-1 shadow-lg border border-gray-300 dark:border-gray-600">
                  <div className="p-2 sticky top-0 shadow-sm bg-white dark:bg-[#242627]">
                    <input
                      type="text"
                      placeholder="Search State..."
                      className="input input-bordered w-full focus:outline-none bg-white dark:bg-[#242627] text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-500"
                      value={stateSearchInput}
                      onChange={(e) => setStateSearchInput(e.target.value)}
                    />
                  </div>
                  <div className="max-h-40 overflow-y-auto">
                    {filteredStates.length > 0 ? (
                      filteredStates.map((st) => (
                        <p
                          key={st.id}
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer text-gray-800 dark:text-gray-200 capitalize"
                          onClick={() => {
                            setValue(
                              "address_input.state",
                              st.id.toString(),
                              {
                                shouldValidate: true,
                              }
                            );
                            setSelectedStateName(st.name);
                            setStateSearchInput("");
                            setShowStateDropdown(false);
                          }}
                        >
                          {st.name}
                        </p>
                      ))
                    ) : (
                      <p className="p-2 text-gray-500 dark:text-gray-400">
                        No states found
                      </p>
                    )}
                  </div>
                </div>
              )}
              {errors.address_input?.state && (
                <span className="text-error text-sm">
                  {errors.address_input.state.message}
                </span>
              )}
            </div>

            {/* Country */}
            <div className="form-control relative">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-globe text-sm"></i>
                  Country <span className="text-error">*</span>
                </span>
              </label>
              <div
                className="input input-bordered w-full flex items-center justify-between cursor-pointer "
                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
              >
                {selectedCountryName || "Select Country"}
                <i
                  className={`fa-solid fa-chevron-${
                    showCountryDropdown ? "up" : "down"
                  } ml-2`}
                ></i>
              </div>
              {showCountryDropdown && (
                <div className="absolute z-10 bg-white dark:bg-[#242627] rounded w-full mt-1 shadow-lg border border-gray-300 dark:border-gray-600">
                  <div className="p-2 sticky top-0 shadow-sm">
                    <input
                      type="text"
                      placeholder="Search Country..."
                      className="input input-bordered w-full focus:outline-none bg-white dark:bg-[#242627] text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-500"
                      value={countrySearchInput}
                      onChange={(e) => setCountrySearchInput(e.target.value)}
                    />
                  </div>
                  <div className="max-h-40 overflow-y-auto">
                    {filteredCountries.length > 0 ? (
                      filteredCountries.map((ct) => (
                        <p
                          key={ct.id}
                          className="p-2 cursor-pointer capitalize"
                          onClick={() => {
                            setValue(
                              "address_input.country",
                              ct.id.toString(),
                              {
                                shouldValidate: true,
                              }
                            );
                            setSelectedCountryName(ct.name);
                            setCountrySearchInput("");
                            setShowCountryDropdown(false);
                          }}
                        >
                          {ct.name}
                        </p>
                      ))
                    ) : (
                      <p className="p-2 text-gray-500 dark:text-gray-400">
                        No countries found
                      </p>
                    )}
                  </div>
                </div>
              )}
              {errors.address_input?.country && (
                <span className="text-error text-sm">
                  {errors.address_input.country.message}
                </span>
              )}
            </div>
          </div>

          {/* Pincode */}
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
                className={`input input-bordered w-full focus:outline-none ${
                  errors.address_input?.area_code ? "input-error" : ""
                }`}
              />
              {errors.address_input?.area_code && (
                <span className="text-error text-sm">
                  {errors.address_input.area_code.message}
                </span>
              )}
            </div>
          </div>

          {/* Address line */}
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
                {...register("banking_detail_input.holder_name", {
                  required: "Account holder name is required",
                  maxLength: {
                    value: 50,
                    message: "Holder name cannot exceed 50 characters",
                  },
                  validate: (value) => {
                    if (!value.trim())
                      return "Account holder name is required";
                    if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(value))
                      return "Enter a valid name (alphabets & single spaces only)";
                    return true;
                  },
                })}
                placeholder="Full Name as in Bank"
                className={`input input-bordered w-full focus:outline-none ${
                  errors.banking_detail_input?.holder_name
                    ? "input-error"
                    : ""
                }`}
                onInput={(e) => {
                  e.target.value = e.target.value
                    .replace(/[^A-Za-z\s]/g, "")
                    .replace(/\s+/g, " ")
                    .replace(/^\s+/g, "");
                }}
              />
              {errors.banking_detail_input?.holder_name && (
                <span className="text-error text-sm">
                  {errors.banking_detail_input.holder_name.message}
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
                {...register("banking_detail_input.account_no", {
                  required: "Account number is required",
                  minLength: {
                    value: 9,
                    message: "Account number must be at least 9 digits",
                  },
                  maxLength: {
                    value: 18,
                    message: "Account number cannot exceed 18 digits",
                  },
                  validate: (value) => {
                    if (!/^[0-9]+$/.test(value))
                      return "Account number must contain digits only";
                    if (/^0+$/.test(value))
                      return "Account number cannot be all zeros";
                    return true;
                  },
                })}
                placeholder="Account Number"
                className={`input input-bordered w-full focus:outline-none ${
                  errors.banking_detail_input?.account_no
                    ? "input-error"
                    : ""
                }`}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                }}
              />
              {errors.banking_detail_input?.account_no && (
                <span className="text-error text-sm">
                  {errors.banking_detail_input.account_no.message}
                </span>
              )}
            </div>
          </div>

          {/* IFSC */}
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
                  pattern: {
                    value: /^[A-Z]{4}[0-9A-Z][A-Z0-9]{6}$/,
                    message:
                      "Invalid IFSC code format (e.g. SBIN0001234 or BARBOBHOPAL)",
                  },
                })}
                placeholder="eg: SBIN0001234"
                className={`input input-bordered w-full focus:outline-none ${
                  errors.banking_detail_input?.ifsc_code
                    ? "input-error"
                    : ""
                }`}
                onInput={(e) => {
                  e.target.value = e.target.value
                    .toUpperCase()
                    .replace(/[^A-Z0-9]/g, "");
                }}
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

      {showAlert && (
        <dialog open className="modal modal-open">
          <div className="modal-box dark:bg-gray-800 dark:text-gray-100">
            <h3 className="font-bold text-lg">Edit Student Details</h3>
            <p className="py-4">{alertMessage}</p>
            <div className="modal-action">
              <button
                className="btn bgTheme text-white w-30"
                onClick={() => setShowAlert(false)}
              >
                OK
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};