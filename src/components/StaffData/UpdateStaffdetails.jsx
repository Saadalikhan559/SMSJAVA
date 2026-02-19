// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   fetchTeachers,
//   fetchOfficeStaff,
//   editOfficeStaffdetails,
//   editTeachersdetails,
//   fetchCountry,
//   fetchState,
//   fetchCity,
// } from "../../services/api/Api";
// import { useForm } from "react-hook-form";
// import UpdateSuccessful from "../Modals/UpdateModal";
// import { useContext } from "react";
// import { AuthContext } from "../../context/AuthContext";


// const UpdateStaffDetails = () => {
//   const { id, type } = useParams();
//   const navigate = useNavigate();
//   const { authTokens } = useContext(AuthContext);

//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [updateModal, setUpdateModal] = useState(false);
//   const [formErrors, setFormErrors] = useState([]);
//   const [submitting, setSubmitting] = useState(false);
//   const [showCountryDropdown, setShowCountryDropdown] = useState(false);
//   const [showStateDropdown, setShowStateDropdown] = useState(false);
//   const [showCityDropdown, setShowCityDropdown] = useState(false);

//   // const { register, handleSubmit, setValue, watch, formState: { errors }, trigger } = useForm({
//   //   mode: "onChange",
//   //   reValidateMode: "onChange"
//   // });

//   const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
//     mode: "onChange", // important for live validation
//     reValidateMode: "onChange"
//   });


//   const countryVal = watch("address_data.country");
//   const stateVal = watch("address_data.state");
//   const cityVal = watch("address_data.city");

//   const validationRules = {
//     first_name: { pattern: /^[A-Za-z]{2,30}$/, message: "First name must be 2-30 letters" },
//     middle_name: { pattern: /^[A-Za-z]{0,30}$/, message: "Middle name must be letters only" },
//     last_name: { pattern: /^[A-Za-z]{2,30}$/, message: "Last name must be 2-30 letters" },
//     email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" },
//     phone_no: { pattern: /^[6-9][0-9]{9}$/, message: "Phone number must be 10 digits starting with 6-9" },
//     adhaar_no: { pattern: /^[2-9][0-9]{11}$/, message: "Aadhaar must be 12 digits starting with 2-9" },
//     pan_no: { pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, message: "Invalid PAN format" },
//     qualification: { pattern: /^[A-Za-z0-9\s\-,.]{2,50}$/, message: "Invalid qualification" },
//     account_no: { pattern: /^[0-9]{9,18}$/, message: "Account number must be 9-18 digits" },
//     ifsc_code: { pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/, message: "Invalid IFSC code" },
//     holder_name: { pattern: /^[A-Za-z ]{2,50}$/, message: "Holder name must be letters only" },
//     house_no: { pattern: /^[A-Za-z0-9\-\/ ]{1,10}$/, message: "Invalid house number" },
//     habitation: { pattern: /^[A-Za-z0-9 ]{1,50}$/, message: "Invalid habitation" },
//     ward_no: { pattern: /^[0-9]{1,5}$/, message: "Invalid ward number" },
//     zone_no: { pattern: /^[0-9]{1,5}$/, message: "Invalid zone number" },
//     block: { pattern: /^[A-Za-z0-9 ]{0,50}$/, message: "Invalid block" },
//     district: { pattern: /^[A-Za-z ]{1,50}$/, message: "Invalid district" },
//     division: { pattern: /^[A-Za-z ]{0,50}$/, message: "Invalid division" },
//     area_code: { pattern: /^[0-9]{3,10}$/, message: "Invalid area code" },
//     address_line: { pattern: /^[A-Za-z0-9,.\-\/ ]{0,100}$/, message: "Invalid address line" },
//   };

//   const handleInputChange = async (fieldName) => {
//     await trigger(fieldName);
//   };

//   useEffect(() => {
//     const fetchAll = async () => {
//       try {
//         const [c, s, ci] = await Promise.all([fetchCountry(), fetchState(), fetchCity()]);
//         setCountries(c);
//         setStates(s);
//         setCities(ci);

//         const data = type === "teacher" ? await fetchTeachers(id) : await fetchOfficeStaff(id);

//         // Prefill top-level fields
//         setValue("first_name", data.first_name || "");
//         setValue("middle_name", data.middle_name || "");
//         setValue("last_name", data.last_name || "");
//         setValue("email", data.email || "");
//         setValue("phone_no", data.phone_no || "");
//         setValue("gender", data.gender || "");
//         setValue("aadhar_no", data.aadhar_no || "");
//         setValue("pan_no", data.pan_no || "");
//         setValue("qualification", data.qualification || "");
//         setValue("joining_date", data.joining_date || "");

//         setValue("banking_data.account_no", data.banking_data?.account_no || "");
//         setValue("banking_data.ifsc_code", data.banking_data?.ifsc_code || "");
//         setValue("banking_data.holder_name", data.banking_data?.holder_name || "");

//         setValue("address_data.house_no", data.address_data?.house_no || "");
//         setValue("address_data.habitation", data.address_data?.habitation || "");
//         setValue("address_data.ward_no", data.address_data?.ward_no || "");
//         setValue("address_data.zone_no", data.address_data?.zone_no || "");
//         setValue("address_data.block", data.address_data?.block || "");
//         setValue("address_data.district", data.address_data?.district || "");
//         setValue("address_data.division", data.address_data?.division || "");
//         setValue("address_data.area_code", data.address_data?.area_code || "");
//         setValue("address_data.address_line", data.address_data?.address_line || "");

//         const countryId = c.find(cn => cn.name === data.address_data?.country_name)?.id;
//         const stateId = s.find(st => st.name === data.address_data?.state_name)?.id;
//         const cityId = ci.find(ct => ct.name === data.address_data?.city_name)?.id;

//         setValue("address_data.country", countryId || "");
//         setValue("address_data.state", stateId || "");
//         setValue("address_data.city", cityId || "");

//       } catch (err) {
//         setError(err.message || "Failed to fetch staff details");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAll();
//   }, [id, type, setValue]);

//   // const onSubmit = async (formData) => {
//   //   try {
//   //     setSubmitting(true);
//   //     const payload = new FormData();
//   //     const mapNested = (prefix, data) => {
//   //       Object.entries(data).forEach(([k, v]) => {
//   //         if (v !== null && v !== undefined) {
//   //           payload.append(`${prefix}.${k}`, v.toString());
//   //         }
//   //       });
//   //     };

//   //     Object.entries(formData).forEach(([key, value]) => {
//   //       if (typeof value !== "object" && value !== null && value !== undefined) {
//   //         payload.append(key, value.toString());
//   //       }
//   //     });

//   //     if (formData.user_profile && formData.user_profile[0]) {
//   //       payload.append("user_profile", formData.user_profile[0]);
//   //     }

//   //     if (formData.banking_data) {
//   //       mapNested("banking_detail_input", formData.banking_data);
//   //     }

//   //     if (formData.address_data) {
//   //       mapNested("address_input", formData.address_data);
//   //     }

//   //     // if (type === "teacher") {
//   //     //   await editTeachersdetails(id, payload);
//   //     // } else {
//   //     //   await editOfficeStaffdetails(id, payload);
//   //     // }

//   //     if (type === "teacher") {
//   //       await editTeachersdetails(id, payload, authTokens);
//   //     } else {
//   //       await editOfficeStaffdetails(id, payload, authTokens);
//   //     }


//   //     setUpdateModal(true);
//   //     setFormErrors([]);
//   //   }
//   //   catch (err) {
//   //     console.error("Update error:", err);

//   //     let backendErrors = [];

//   //     // Use err.response.data if available, otherwise err itself
//   //     const data = (err?.response?.data) ? err.response.data : err;

//   //     const parseErrors = (obj) => {
//   //       let result = [];
//   //       if (!obj) return result;

//   //       if (typeof obj === "string") {
//   //         result.push(obj);
//   //       } else if (Array.isArray(obj)) {
//   //         obj.forEach(msg => result.push(msg));
//   //       } else if (typeof obj === "object") {
//   //         Object.values(obj).forEach(val => {
//   //           result = result.concat(parseErrors(val));
//   //         });
//   //       }
//   //       return result;
//   //     };

//   //     backendErrors = parseErrors(data);

//   //     // Fallback
//   //     if (backendErrors.length === 0) {
//   //       backendErrors.push("An unexpected error occurred. Please try again.");
//   //     }
//   //     console.log("Final backend errors to display:", backendErrors);
//   //     setFormErrors(backendErrors);
//   //   } finally {
//   //     setSubmitting(false);
//   //   }





//   // };


// const onSubmit = async (formData) => {
//   try {
//     setSubmitting(true);
//     const payload = new FormData();

//     // top-level fields
//     Object.entries(formData).forEach(([key, value]) => {
//       if (
//         key !== "address_data" &&
//         key !== "banking_data" &&
//         key !== "user_profile" &&
//         value !== null &&
//         value !== undefined
//       ) {
//         payload.append(key, value.toString());
//       }
//     });

//     // ✅ SEND NESTED OBJECTS AS JSON
//     if (formData.address_data) {
//       payload.append("address_data", JSON.stringify(formData.address_data));
//     }

//     if (formData.banking_data) {
//       payload.append("banking_data", JSON.stringify(formData.banking_data));
//     }

//     if (formData.user_profile?.[0]) {
//       payload.append("user_profile", formData.user_profile[0]);
//     }

//     if (type === "teacher") {
//       await editTeachersdetails(id, payload, authTokens);
//     } else {
//       await editOfficeStaffdetails(id, payload, authTokens);
//     }

//     setUpdateModal(true);
//     setFormErrors([]);
//   } catch (err) {
//     console.error("Update error:", err);
//     setFormErrors(["Update failed"]);
//   } finally {
//     setSubmitting(false);
//   }
// };



//   if (loading) return <div className="flex flex-col items-center justify-center min-h-screen">
//     <div className="flex space-x-2">
//       <div className="w-3 h-3 bgTheme rounded-full animate-bounce"></div>
//       <div className="w-3 h-3 bgTheme rounded-full animate-bounce [animation-delay:-0.2s]"></div>
//       <div className="w-3 h-3 bgTheme rounded-full animate-bounce [animation-delay:-0.4s]"></div>
//     </div>
//     <p className="mt-2 text-gray-500 text-sm">Loading data...</p>
//   </div>
//   if (error) return <div className="text-center text-red-500 mt-10"><p>{error}</p></div>;

//   const maxDate = new Date().toISOString().split("T")[0];

//   return (
//     <div className="mb-24 md:mb-10">
//       <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
//         <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow dark:shadow-gray-700">
//           <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">
//             {type?.toLowerCase() === "teacher" ? "Update Teacher Details" : "Update Staff Details"}
//           </h1>

//           <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" encType="multipart/form-data">

//             {/* Top-level Fields */}
//             <div className="flex flex-col">
//               <div className="flex items-center gap-1">
//                 <label className="label text-gray-700 dark:text-gray-300">First Name</label>
//                 <span className="text-error">*</span>
//               </div>
//               <input
//                 type="text"
//                 {...register("first_name", {
//                   required: "First Name is required",
//                   pattern: {
//                     value: validationRules.first_name.pattern,
//                     message: validationRules.first_name.message
//                   }
//                 })}
//                 className="input input-bordered w-full"
//               />
//               {errors.first_name && <span className="text-error text-sm mt-1">{errors.first_name.message}</span>}
//             </div>

//             <div className="flex flex-col">
//               <label className="label text-gray-700 dark:text-gray-300">Middle Name</label>
//               <input
//                 type="text"
//                 {...register("middle_name", {
//                   pattern: {
//                     value: validationRules.middle_name.pattern,
//                     message: validationRules.middle_name.message
//                   }
//                 })}
//                 className="input input-bordered w-full"
//               />
//               {errors.middle_name && <span className="text-error text-sm mt-1">{errors.middle_name.message}</span>}
//             </div>

//             <div className="flex flex-col">
//               <div className="flex items-center gap-1">
//                 <label className="label text-gray-700 dark:text-gray-300">Last Name</label>
//                 <span className="text-error">*</span>
//               </div>
//               <input
//                 type="text"
//                 {...register("last_name", {
//                   required: "Last Name is required",
//                   pattern: {
//                     value: validationRules.last_name.pattern,
//                     message: validationRules.last_name.message
//                   }
//                 })}
//                 className="input input-bordered w-full"
//               />
//               {errors.last_name && <span className="text-error text-sm mt-1">{errors.last_name.message}</span>}
//             </div>

//             <div className="flex flex-col">
//               <div className="flex items-center gap-1">
//                 <label className="label text-gray-700 dark:text-gray-300">Email</label>
//                 <span className="text-error">*</span>
//               </div>
//               <input
//                 type="email"
//                 {...register("email", {
//                   required: "Email is required",
//                   pattern: {
//                     value: validationRules.email.pattern,
//                     message: validationRules.email.message
//                   }
//                 })}
//                 className="input input-bordered w-full"
//               />
//               {errors.email && <span className="text-error text-sm mt-1">{errors.email.message}</span>}
//             </div>

//             <div className="flex flex-col">
//               <div className="flex items-center gap-1">
//                 <label className="label text-gray-700 dark:text-gray-300">Phone No</label>
//                 <span className="text-error">*</span>
//               </div>
//               <input
//                 type="text"
//                 {...register("phone_no", {
//                   required: "Phone No is required",
//                   pattern: {
//                     value: validationRules.phone_no.pattern,
//                     message: validationRules.phone_no.message
//                   }
//                 })}
//                 className="input input-bordered w-full"
//               />
//               {errors.phone_no && <span className="text-error text-sm mt-1">{errors.phone_no.message}</span>}
//             </div>

//             <div className="flex flex-col">
//               <div className="flex items-center gap-1">
//                 <label className="label text-gray-700 dark:text-gray-300">Gender</label>
//                 <span className="text-error">*</span>
//               </div>
//               <select {...register("gender", { required: "Gender is required" })}>
//                 <option value="">Select Gender</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//               </select>

//               {errors.gender && <span className="text-error text-sm mt-1">{errors.gender.message}</span>}
//             </div>

//             <div className="flex flex-col">
//               <div className="flex items-center gap-1">
//                 <label className="label text-gray-700 dark:text-gray-300">Aadhaar No</label>
//                 <span className="text-error">*</span>
//               </div>
//               <input
//                 type="text"
//                 {...register("aadhar_no", {
//                   required: "Aadhaar No is required",
//                   pattern: {
//                     value: validationRules.adhaar_no.pattern,
//                     message: validationRules.adhaar_no.message
//                   }
//                 })}
//                 className="input input-bordered w-full"
//               />
//               {errors.adhaar_no && <span className="text-error text-sm mt-1">{errors.adhaar_no.message}</span>}
//             </div>

//             <div className="flex flex-col">
//               <div className="flex items-center gap-1">
//                 <label className="label text-gray-700 dark:text-gray-300">PAN No</label>
//                 <span className="text-error">*</span>
//               </div>
//               <input
//                 type="text"
//                 {...register("pan_no", {
//                   required: "PAN No is required",
//                   pattern: {
//                     value: validationRules.pan_no.pattern,
//                     message: validationRules.pan_no.message
//                   }
//                 })}
//                 className="input input-bordered w-full"
//               />
//               {errors.pan_no && <span className="text-error text-sm mt-1">{errors.pan_no.message}</span>}
//             </div>

//             <div className="flex flex-col">
//               <div className="flex items-center gap-1">
//                 <label className="label text-gray-700 dark:text-gray-300">Qualification</label>
//                 <span className="text-error">*</span>
//               </div>
//               <input
//                 type="text"
//                 {...register("qualification", {
//                   required: "Qualification is required",
//                   pattern: {
//                     value: validationRules.qualification.pattern,
//                     message: validationRules.qualification.message
//                   }
//                 })}
//                 className="input input-bordered w-full"
//               />
//               {errors.qualification && <span className="text-error text-sm mt-1">{errors.qualification.message}</span>}
//             </div>

//             <div className="flex flex-col">
//               <div className="flex items-center gap-1">
//                 <label className="label text-gray-700 dark:text-gray-300">Joining Date</label>
//                 <span className="text-error">*</span>
//               </div>
//               <input
//                 type="date"
//                 max={maxDate}
//                 {...register("joining_date", { required: "Joining Date is required" })}
//                 className="input input-bordered w-full"
//               />
//               {errors.joining_date && <span className="text-error text-sm mt-1">{errors.joining_date.message}</span>}
//             </div>

//             {/* Banking Fields */}
//             <div className="flex flex-col">
//               <div className="flex items-center gap-1">
//                 <label className="label text-gray-700 dark:text-gray-300">Account No</label>
//                 <span className="text-error">*</span>
//               </div>
//               <input
//                 type="text"
//                 {...register("banking_data.account_no", {
//                   required: "Account No is required",
//                   pattern: {
//                     value: validationRules.account_no.pattern,
//                     message: validationRules.account_no.message
//                   }
//                 })}
//                 className="input input-bordered w-full"
//               />
//               {errors.banking_data?.account_no && <span className="text-error text-sm mt-1">{errors.banking_data.account_no.message}</span>}
//             </div>

//             <div className="flex flex-col">
//               <div className="flex items-center gap-1">
//                 <label className="label text-gray-700 dark:text-gray-300">IFSC Code</label>
//                 <span className="text-error">*</span>
//               </div>
//               <input
//                 type="text"
//                 {...register("banking_data.ifsc_code", {
//                   required: "IFSC Code is required",
//                   pattern: {
//                     value: validationRules.ifsc_code.pattern,
//                     message: validationRules.ifsc_code.message
//                   }
//                 })}
//                 className="input input-bordered w-full"
//               />
//               {errors.banking_data?.ifsc_code && <span className="text-error text-sm mt-1">{errors.banking_data.ifsc_code.message}</span>}
//             </div>

//             <div className="flex flex-col">
//               <div className="flex items-center gap-1">
//                 <label className="label text-gray-700 dark:text-gray-300">Holder Name</label>
//                 <span className="text-error">*</span>
//               </div>
//               <input
//                 type="text"
//                 {...register("banking_data.holder_name", {
//                   required: "Holder Name is required",
//                   pattern: {
//                     value: validationRules.holder_name.pattern,
//                     message: validationRules.holder_name.message
//                   }
//                 })}
//                 className="input input-bordered w-full"
//               />
//               {errors.banking_data?.holder_name && <span className="text-error text-sm mt-1">{errors.banking_data.holder_name.message}</span>}
//             </div>

//             {/* Address Fields */}
//             <div className="flex flex-col">
//               <div className="flex items-center gap-1">
//                 <label className="label text-gray-700 dark:text-gray-300">House No</label>
//               </div>
//               <input
//                 type="text"
//                 {...register("address_data.house_no", {
//                   pattern: {
//                     value: validationRules.house_no.pattern,
//                     message: validationRules.house_no.message
//                   }
//                 })}
//                 className="input input-bordered w-full"
//               />
//               {errors.address_data?.house_no && <span className="text-error text-sm mt-1">{errors.address_data.house_no.message}</span>}
//             </div>

//             <div className="flex flex-col">
//               <div className="flex items-center gap-1">
//                 <label className="label text-gray-700 dark:text-gray-300">Habitation</label>
//               </div>
//               <input
//                 type="text"
//                 {...register("address_data.habitation", {
//                   pattern: {
//                     value: validationRules.habitation.pattern,
//                     message: validationRules.habitation.message
//                   }
//                 })}
//                 className="input input-bordered w-full"
//               />
//               {errors.address_data?.habitation && <span className="text-error text-sm mt-1">{errors.address_data.habitation.message}</span>}
//             </div>

//             <div className="flex flex-col">
//               <label className="label text-gray-700 dark:text-gray-300">Ward No</label>
//               <input
//                 type="text"
//                 {...register("address_data.ward_no", {
//                   pattern: {
//                     value: validationRules.ward_no.pattern,
//                     message: validationRules.ward_no.message
//                   }
//                 })}
//                 className="input input-bordered w-full"
//               />
//               {errors.address_data?.ward_no && <span className="text-error text-sm mt-1">{errors.address_data.ward_no.message}</span>}
//             </div>

//             <div className="flex flex-col">
//               <label className="label text-gray-700 dark:text-gray-300">Zone No</label>
//               <input
//                 type="text"
//                 {...register("address_data.zone_no", {
//                   pattern: {
//                     value: validationRules.zone_no.pattern,
//                     message: validationRules.zone_no.message
//                   }
//                 })}
//                 className="input input-bordered w-full"
//               />
//               {errors.address_data?.zone_no && <span className="text-error text-sm mt-1">{errors.address_data.zone_no.message}</span>}
//             </div>

//             <div className="flex flex-col">
//               <label className="label text-gray-700 dark:text-gray-300">Block</label>
//               <input
//                 type="text"
//                 {...register("address_data.block", {
//                   pattern: {
//                     value: validationRules.block.pattern,
//                     message: validationRules.block.message
//                   }
//                 })}
//                 className="input input-bordered w-full"
//               />
//               {errors.address_data?.block && <span className="text-error text-sm mt-1">{errors.address_data.block.message}</span>}
//             </div>

//             <div className="flex flex-col">
//               <label className="label text-gray-700 dark:text-gray-300">District</label>
//               <input
//                 type="text"
//                 {...register("address_data.district", {
//                   pattern: {
//                     value: validationRules.district.pattern,
//                     message: validationRules.district.message
//                   }
//                 })}
//                 className="input input-bordered w-full"
//               />
//               {errors.address_data?.district && <span className="text-error text-sm mt-1">{errors.address_data.district.message}</span>}
//             </div>

//             <div className="flex flex-col">
//               <label className="label text-gray-700 dark:text-gray-300">Division</label>
//               <input
//                 type="text"
//                 {...register("address_data.division", {
//                   pattern: {
//                     value: validationRules.division.pattern,
//                     message: validationRules.division.message
//                   }
//                 })}
//                 className="input input-bordered w-full"
//               />
//               {errors.address_data?.division && <span className="text-error text-sm mt-1">{errors.address_data.division.message}</span>}
//             </div>

//             <div className="flex flex-col">
//               <div className="flex items-center gap-1">
//                 <label className="label text-gray-700 dark:text-gray-300">Area Code</label>
//                 <span className="text-error">*</span>
//               </div>
//               <input
//                 type="text"
//                 {...register("address_data.area_code", {
//                   pattern: {
//                     value: validationRules.area_code.pattern,
//                     message: validationRules.area_code.message
//                   }
//                 })}
//                 className="input input-bordered w-full"
//               />
//               {errors.address_data?.area_code && <span className="text-error text-sm mt-1">{errors.address_data.area_code.message}</span>}
//             </div>

//             <div className="flex flex-col">
//               <div className="flex items-center gap-1">
//                 <label className="label text-gray-700 dark:text-gray-300">Address Line</label>
//                 <span className="text-error">*</span>
//               </div>
//               <input
//                 type="text"
//                 {...register("address_data.address_line", {
//                   required: "Address Line is required",
//                   pattern: {
//                     value: validationRules.address_line.pattern,
//                     message: validationRules.address_line.message,
//                   },
//                 })}
//                 className="input input-bordered w-full"
//               />
//               {errors.address_data?.address_line && (
//                 <span className="text-error text-sm mt-1">
//                   {errors.address_data.address_line.message}
//                 </span>
//               )}
//             </div>

//             {/* Country, State, City */}
//             {/* COUNTRY */}
//             <div className="flex flex-col">
//               <div className="flex items-center gap-1">
//                 <label className="label text-gray-700 dark:text-gray-300">Country</label>
//                 <span className="text-error">*</span>
//               </div>
//               <select
//                 {...register("address_data.country", { required: "Country is required" })}
//                 className="input input-bordered w-full cursor-pointer font-normal text-gray-700 dark:text-gray-300"
//                 value={countryVal || ""}
//                 onChange={(e) => {
//                   const val = parseInt(e.target.value);
//                   setValue("address_data.country", val, { shouldValidate: true });
//                   trigger("address_data.country");
//                 }}
//               >
//                 <option value="">Select Country</option>
//                 {[...countries]
//                   .sort((a, b) => a.name.localeCompare(b.name))
//                   .map((c) => (
//                     <option key={c.id} value={c.id}>
//                       {c.name}
//                     </option>
//                   ))}
//               </select>
//               {errors.address_data?.country && (
//                 <span className="text-error text-sm mt-1">{errors.address_data.country.message}</span>
//               )}
//             </div>

//             {/* STATE */}
//             <div className="flex flex-col">
//               <div className="flex items-center gap-1">
//                 <label className="label text-gray-700 dark:text-gray-300">State</label>
//                 <span className="text-error">*</span>
//               </div>
//               <select
//                 {...register("address_data.state", { required: "State is required" })}
//                 className="input input-bordered w-full cursor-pointer font-normal text-gray-700 dark:text-gray-300"
//                 value={stateVal || ""}
//                 onChange={(e) => {
//                   const val = parseInt(e.target.value);
//                   setValue("address_data.state", val, { shouldValidate: true });
//                   trigger("address_data.state");
//                 }}
//               >
//                 <option value="">Select State</option>
//                 {[...states]
//                   .sort((a, b) => a.name.localeCompare(b.name))
//                   .map((s) => (
//                     <option key={s.id} value={s.id}>
//                       {s.name}
//                     </option>
//                   ))}
//               </select>
//               {errors.address_data?.state && (
//                 <span className="text-error text-sm mt-1">{errors.address_data.state.message}</span>
//               )}
//             </div>

//             {/* CITY */}
//             <div className="flex flex-col">
//               <div className="flex items-center gap-1">
//                 <label className="label text-gray-700 dark:text-gray-300">City</label>
//                 <span className="text-error">*</span>
//               </div>
//               <select
//                 {...register("address_data.city", { required: "City is required" })}
//                 className="input input-bordered w-full cursor-pointer font-normal text-gray-700 dark:text-gray-300"
//                 value={cityVal || ""}
//                 onChange={(e) => {
//                   const val = parseInt(e.target.value);
//                   setValue("address_data.city", val, { shouldValidate: true });
//                   trigger("address_data.city");
//                 }}
//               >
//                 <option value="">Select City</option>
//                 {[...cities]
//                   .sort((a, b) => a.name.localeCompare(b.name))
//                   .map((c) => (
//                     <option key={c.id} value={c.id}>
//                       {c.name}
//                     </option>
//                   ))}
//               </select>
//               {errors.address_data?.city && (
//                 <span className="text-error text-sm mt-1">{errors.address_data.city.message}</span>
//               )}
//             </div>


//             {/* Profile Picture */}
//             <div className="md:col-span-2 lg:col-span-3 flex flex-col">
//               <label className="label text-gray-700 dark:text-gray-300">Profile Picture</label>
//               <input
//                 type="file"
//                 {...register("user_profile")}
//                 className="file-input file-input-bordered w-full"
//               />
//             </div>

//             <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center mt-6">
//               {/* <button type="submit" className="btn bgTheme text-white w-52">Save Changes</button> */}
//               <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-6 flex justify-center">
//                 <button
//                   type="submit"
//                   className="btn bgTheme btn-primary w-52 flex justify-center items-center text-white"
//                   disabled={submitting}
//                 >
//                   {submitting ? (
//                     <i className="fa-solid fa-spinner fa-spin mr-2"></i>
//                   ) : (
//                     <></>
//                   )}
//                   {submitting ? "" : "Save Changes"}
//                 </button>
//               </div>

//             </div>
//           </form>

//         </div>
//       </div>

//       {updateModal && (
//         <UpdateSuccessful
//           handleCloseOnly={() => setUpdateModal(false)}
//           handleCloseAndNavigate={() => navigate(`/staffDetail/${type}/${id}`)}
//         />
//       )}

//       {/* Error Modal */}
//       {formErrors.length > 0 && (
//         <dialog className="modal modal-open">
//           <div className="modal-box bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100">
//             <h3 className="font-bold text-lg">Update Failed</h3>
//             <div className="py-4">
//               {formErrors.map((err, idx) => (
//                 <p key={idx} className="text-sm">
//                   {err}
//                 </p>
//               ))}
//             </div>
//             <div className="modal-action">
//               <button
//                 className="btn bgTheme text-white w-30"
//                 onClick={() => setFormErrors([])}
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

// export default UpdateStaffDetails;




// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   fetchTeachers,
//   fetchOfficeStaff,
//   editOfficeStaffdetails,
//   editTeachersdetails,
//   fetchCountry,
//   fetchState,
//   fetchCity,
// } from "../../services/api/Api";
// import { useForm } from "react-hook-form";
// import UpdateSuccessful from "../Modals/UpdateModal";
// import { useContext } from "react";
// import { AuthContext } from "../../context/AuthContext";


// const UpdateStaffDetails = () => {
//   const { id, type } = useParams();
//   const navigate = useNavigate();
//   const { authTokens } = useContext(AuthContext);

//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [updateModal, setUpdateModal] = useState(false);
//   const [formErrors, setFormErrors] = useState([]);
//   const [submitting, setSubmitting] = useState(false);

//   const { register, handleSubmit, setValue, watch, formState: { errors }, trigger } = useForm({
//     mode: "onChange",
//     reValidateMode: "onChange"
//   });

//   const countryVal = watch("address_data.country");
//   const stateVal = watch("address_data.state");
//   const cityVal = watch("address_data.city");

//   const validationRules = {
//     first_name: { pattern: /^[A-Za-z]{2,30}$/, message: "First name must be 2-30 letters" },
//     middle_name: { pattern: /^[A-Za-z]{0,30}$/, message: "Middle name must be letters only" },
//     last_name: { pattern: /^[A-Za-z]{2,30}$/, message: "Last name must be 2-30 letters" },
//     email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" },
//     phone_no: { pattern: /^[6-9][0-9]{9}$/, message: "Phone number must be 10 digits starting with 6-9" },
//     aadhar_no: { pattern: /^[2-9][0-9]{11}$/, message: "Aadhaar must be 12 digits starting with 2-9" },
//     pan_no: { pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, message: "Invalid PAN format" },
//     qualification: { pattern: /^[A-Za-z0-9\s\-,.]{2,50}$/, message: "Invalid qualification" },
//     account_no: { pattern: /^[0-9]{9,18}$/, message: "Account number must be 9-18 digits" },
//     ifsc_code: { pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/, message: "Invalid IFSC code" },
//     holder_name: { pattern: /^[A-Za-z ]{2,50}$/, message: "Holder name must be letters only" },
//     house_no: { pattern: /^[A-Za-z0-9\-\/ ]{1,10}$/, message: "Invalid house number" },
//     habitation: { pattern: /^[A-Za-z0-9 ]{1,50}$/, message: "Invalid habitation" },
//     ward_no: { pattern: /^[0-9]{1,5}$/, message: "Invalid ward number" },
//     zone_no: { pattern: /^[0-9]{1,5}$/, message: "Invalid zone number" },
//     block: { pattern: /^[A-Za-z0-9 ]{0,50}$/, message: "Invalid block" },
//     district: { pattern: /^[A-Za-z ]{1,50}$/, message: "Invalid district" },
//     division: { pattern: /^[A-Za-z ]{0,50}$/, message: "Invalid division" },
//     area_code: { pattern: /^[0-9]{3,10}$/, message: "Invalid area code" },
//     address_line: { pattern: /^[A-Za-z0-9,.\-\/ ]{0,100}$/, message: "Invalid address line" },
//   };

//   useEffect(() => {
//     const fetchAll = async () => {
//       try {
//         const [c, s, ci] = await Promise.all([fetchCountry(), fetchState(), fetchCity()]);
//         setCountries(c);
//         setStates(s);
//         setCities(ci);

//         const data = type === "teacher" ? await fetchTeachers(id) : await fetchOfficeStaff(id);

//         // Prefill top-level fields
//         setValue("first_name", data.first_name || "");
//         setValue("middle_name", data.middle_name || "");
//         setValue("last_name", data.last_name || "");
//         setValue("email", data.email || "");
//         setValue("phone_no", data.phone_no || "");
//         setValue("gender", data.gender || "");
//         setValue("aadhar_no", data.aadhar_no || "");
//         setValue("pan_no", data.pan_no || "");
//         setValue("qualification", data.qualification || "");
//         setValue("joining_date", data.joining_date || "");

//         setValue("banking_data.account_no", data.banking_data?.account_no || "");
//         setValue("banking_data.ifsc_code", data.banking_data?.ifsc_code || "");
//         setValue("banking_data.holder_name", data.banking_data?.holder_name || "");

//         setValue("address_data.house_no", data.address_data?.house_no || "");
//         setValue("address_data.habitation", data.address_data?.habitation || "");
//         setValue("address_data.ward_no", data.address_data?.ward_no || "");
//         setValue("address_data.zone_no", data.address_data?.zone_no || "");
//         setValue("address_data.block", data.address_data?.block || "");
//         setValue("address_data.district", data.address_data?.district || "");
//         setValue("address_data.division", data.address_data?.division || "");
//         setValue("address_data.area_code", data.address_data?.area_code || "");
//         setValue("address_data.address_line", data.address_data?.address_line || "");

//         const countryId = c.find(cn => cn.name === data.address_data?.country_name)?.id;
//         const stateId = s.find(st => st.name === data.address_data?.state_name)?.id;
//         const cityId = ci.find(ct => ct.name === data.address_data?.city_name)?.id;

//         setValue("address_data.country", countryId || "");
//         setValue("address_data.state", stateId || "");
//         setValue("address_data.city", cityId || "");

//       } catch (err) {
//         setError(err.message || "Failed to fetch staff details");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAll();
//   }, [id, type, setValue]);

// const onSubmit = async (formData) => {
//   try {
//     setSubmitting(true);

//     const payload = {
//       first_name: formData.first_name,
//       middle_name: formData.middle_name,
//       last_name: formData.last_name,
//       email: formData.email,
//       phone_no: formData.phone_no,
//       gender: formData.gender,
//       aadhar_no: formData.aadhar_no,
//       pan_no: formData.pan_no,
//       qualification: formData.qualification,
//       joining_date: formData.joining_date,

//       address_data: {
//         house_no: formData.address_data.house_no,
//         habitation: formData.address_data.habitation,
//         ward_no: formData.address_data.ward_no,
//         zone_no: formData.address_data.zone_no,
//         block: formData.address_data.block,
//         district: formData.address_data.district,
//         division: formData.address_data.division,
//         area_code: formData.address_data.area_code,
//         address_line: formData.address_data.address_line,

//         country_name: countries.find(c => c.id === formData.address_data.country)?.name,
//         state_name: states.find(s => s.id === formData.address_data.state)?.name,
//         city_name: cities.find(c => c.id === formData.address_data.city)?.name
//       },

//       banking_data: {
//         account_no: formData.banking_data.account_no,
//         ifsc_code: formData.banking_data.ifsc_code,
//         holder_name: formData.banking_data.holder_name
//       }
//     };

//     console.log("🔥 FINAL JSON PAYLOAD:", payload);

//     if (type === "teacher") {
//       await editTeachersdetails(id, payload, authTokens);
//     } else {
//       await editOfficeStaffdetails(id, payload, authTokens);
//     }

//     setUpdateModal(true);
//   } catch (err) {
//     console.error("❌ UPDATE FAILED", err?.response?.data || err);
//   } finally {
//     setSubmitting(false);
//   }
// };



//   if (loading) return <div className="flex flex-col items-center justify-center min-h-screen">
//     <div className="flex space-x-2">
//       <div className="w-3 h-3 bgTheme rounded-full animate-bounce"></div>
//       <div className="w-3 h-3 bgTheme rounded-full animate-bounce [animation-delay:-0.2s]"></div>
//       <div className="w-3 h-3 bgTheme rounded-full animate-bounce [animation-delay:-0.4s]"></div>
//     </div>
//     <p className="mt-2 text-gray-500 text-sm">Loading data...</p>
//   </div>
//   if (error) return <div className="text-center text-red-500 mt-10"><p>{error}</p></div>;

//   const maxDate = new Date().toISOString().split("T")[0];

//   return (
//     <div className="mb-24 md:mb-10">
//       <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
//         <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow dark:shadow-gray-700">
//           <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">
//             {type?.toLowerCase() === "teacher" ? "Update Teacher Details" : "Update Staff Details"}
//           </h1>

//           <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" encType="multipart/form-data">

//             {/* First Name */}
//             <div className="flex flex-col">
//               <div className="flex items-center gap-1">
//                 <label className="label text-gray-700 dark:text-gray-300">First Name</label>
//                 <span className="text-error">*</span>
//               </div>
//               <input
//                 type="text"
//                 {...register("first_name", {
//                   required: "First Name is required",
//                   pattern: {
//                     value: validationRules.first_name.pattern,
//                     message: validationRules.first_name.message
//                   }
//                 })}
//                 className="input input-bordered w-full"
//               />
//               {errors.first_name && <span className="text-error text-sm mt-1">{errors.first_name.message}</span>}
//             </div>

//             {/* Middle Name */}
//             <div className="flex flex-col">
//               <label className="label text-gray-700 dark:text-gray-300">Middle Name</label>
//               <input
//                 type="text"
//                 {...register("middle_name", {
//                   pattern: {
//                     value: validationRules.middle_name.pattern,
//                     message: validationRules.middle_name.message
//                   }
//                 })}
//                 className="input input-bordered w-full"
//               />
//               {errors.middle_name && <span className="text-error text-sm mt-1">{errors.middle_name.message}</span>}
//             </div>

//             {/* Last Name */}
//             <div className="flex flex-col">
//               <div className="flex items-center gap-1">
//                 <label className="label text-gray-700 dark:text-gray-300">Last Name</label>
//                 <span className="text-error">*</span>
//               </div>
//               <input
//                 type="text"
//                 {...register("last_name", {
//                   required: "Last Name is required",
//                   pattern: {
//                     value: validationRules.last_name.pattern,
//                     message: validationRules.last_name.message
//                   }
//                 })}
//                 className="input input-bordered w-full"
//               />
//               {errors.last_name && <span className="text-error text-sm mt-1">{errors.last_name.message}</span>}
//             </div>

//             {/* Email */}
//             <div className="flex flex-col">
//               <div className="flex items-center gap-1">
//                 <label className="label text-gray-700 dark:text-gray-300">Email</label>
//                 <span className="text-error">*</span>
//               </div>
//               <input
//                 type="email"
//                 {...register("email", {
//                   required: "Email is required",
//                   pattern: {
//                     value: validationRules.email.pattern,
//                     message: validationRules.email.message
//                   }
//                 })}
//                 className="input input-bordered w-full"
//               />
//               {errors.email && <span className="text-error text-sm mt-1">{errors.email.message}</span>}
//             </div>

//             {/* Phone No */}
//             <div className="flex flex-col">
//               <div className="flex items-center gap-1">
//                 <label className="label text-gray-700 dark:text-gray-300">Phone No</label>
//                 <span className="text-error">*</span>
//               </div>
//               <input
//                 type="text"
//                 {...register("phone_no", {
//                   required: "Phone No is required",
//                   pattern: {
//                     value: validationRules.phone_no.pattern,
//                     message: validationRules.phone_no.message
//                   }
//                 })}
//                 className="input input-bordered w-full"
//               />
//               {errors.phone_no && <span className="text-error text-sm mt-1">{errors.phone_no.message}</span>}
//             </div>

//             {/* Gender */}
//             <div className="flex flex-col">
//               <div className="flex items-center gap-1">
//                 <label className="label text-gray-700 dark:text-gray-300">Gender</label>
//                 <span className="text-error">*</span>
//               </div>
//               <select
//                 {...register("gender", { required: "Gender is required" })}
//                 className="input input-bordered w-full cursor-pointer font-normal text-gray-700 dark:text-gray-300"
//               >
//                 <option value="">Select Gender</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//               </select>
//               {errors.gender && <span className="text-error text-sm mt-1">{errors.gender.message}</span>}
//             </div>

//             {/* Aadhaar No */}
//             <div className="flex flex-col">
//               <div className="flex items-center gap-1">
//                 <label className="label text-gray-700 dark:text-gray-300">Aadhaar No</label>
//                 <span className="text-error">*</span>
//               </div>
//               <input
//                 type="text"
//                 {...register("aadhar_no", {
//                   required: "Aadhaar No is required",
//                   pattern: {
//                     value: validationRules.aadhar_no.pattern,
//                     message: validationRules.aadhar_no.message
//                   }
//                 })}
//                 className="input input-bordered w-full"
//               />
//               {errors.aadhar_no && <span className="text-error text-sm mt-1">{errors.aadhar_no.message}</span>}
//             </div>

//             {/* PAN No */}
//             <div className="flex flex-col">
//               <div className="flex items-center gap-1">
//                 <label className="label text-gray-700 dark:text-gray-300">PAN No</label>
//                 <span className="text-error">*</span>
//               </div>
//               <input
//                 type="text"
//                 {...register("pan_no", {
//                   required: "PAN No is required",
//                   pattern: {
//                     value: validationRules.pan_no.pattern,
//                     message: validationRules.pan_no.message
//                   }
//                 })}
//                 className="input input-bordered w-full"
//               />
//               {errors.pan_no && <span className="text-error text-sm mt-1">{errors.pan_no.message}</span>}
//             </div>

//             {/* Qualification */}
//             <div className="flex flex-col">
//               <div className="flex items-center gap-1">
//                 <label className="label text-gray-700 dark:text-gray-300">Qualification</label>
//                 <span className="text-error">*</span>
//               </div>
//               <input
//                 type="text"
//                 {...register("qualification", {
//                   required: "Qualification is required",
//                   pattern: {
//                     value: validationRules.qualification.pattern,
//                     message: validationRules.qualification.message
//                   }
//                 })}
//                 className="input input-bordered w-full"
//               />
//               {errors.qualification && <span className="text-error text-sm mt-1">{errors.qualification.message}</span>}
//             </div>

//             {/* Joining Date */}
//             <div className="flex flex-col">
//               <div className="flex items-center gap-1">
//                 <label className="label text-gray-700 dark:text-gray-300">Joining Date</label>
//                 <span className="text-error">*</span>
//               </div>
//               <input
//                 type="date"
//                 max={maxDate}
//                 {...register("joining_date", { required: "Joining Date is required" })}
//                 className="input input-bordered w-full"
//               />
//               {errors.joining_date && <span className="text-error text-sm mt-1">{errors.joining_date.message}</span>}
//             </div>

//             {/* Account No */}
//             <div className="flex flex-col">
//               <div className="flex items-center gap-1">
//                 <label className="label text-gray-700 dark:text-gray-300">Account No</label>
//                 <span className="text-error">*</span>
//               </div>
//               <input
//                 type="text"
//                 {...register("banking_data.account_no", {
//                   required: "Account No is required",
//                   pattern: {
//                     value: validationRules.account_no.pattern,
//                     message: validationRules.account_no.message
//                   }
//                 })}
//                 className="input input-bordered w-full"
//               />
//               {errors.banking_data?.account_no && <span className="text-error text-sm mt-1">{errors.banking_data.account_no.message}</span>}
//             </div>

//             {/* IFSC Code */}
//             <div className="flex flex-col">
//               <div className="flex items-center gap-1">
//                 <label className="label text-gray-700 dark:text-gray-300">IFSC Code</label>
//                 <span className="text-error">*</span>
//               </div>
//               <input
//                 type="text"
//                 {...register("banking_data.ifsc_code", {
//                   required: "IFSC Code is required",
//                   pattern: {
//                     value: validationRules.ifsc_code.pattern,
//                     message: validationRules.ifsc_code.message
//                   }
//                 })}
//                 className="input input-bordered w-full"
//               />
//               {errors.banking_data?.ifsc_code && <span className="text-error text-sm mt-1">{errors.banking_data.ifsc_code.message}</span>}
//             </div>

//             {/* Holder Name */}
//             <div className="flex flex-col">
//               <div className="flex items-center gap-1">
//                 <label className="label text-gray-700 dark:text-gray-300">Holder Name</label>
//                 <span className="text-error">*</span>
//               </div>
//               <input
//                 type="text"
//                 {...register("banking_data.holder_name", {
//                   required: "Holder Name is required",
//                   pattern: {
//                     value: validationRules.holder_name.pattern,
//                     message: validationRules.holder_name.message
//                   }
//                 })}
//                 className="input input-bordered w-full"
//               />
//               {errors.banking_data?.holder_name && <span className="text-error text-sm mt-1">{errors.banking_data.holder_name.message}</span>}
//             </div>

//             {/* House No */}
//             <div className="flex flex-col">
//               <label className="label text-gray-700 dark:text-gray-300">House No</label>
//               <input
//                 type="text"
//                 {...register("address_data.house_no", {
//                   pattern: {
//                     value: validationRules.house_no.pattern,
//                     message: validationRules.house_no.message
//                   }
//                 })}
//                 className="input input-bordered w-full"
//               />
//               {errors.address_data?.house_no && <span className="text-error text-sm mt-1">{errors.address_data.house_no.message}</span>}
//             </div>

//             {/* Habitation */}
//             <div className="flex flex-col">
//               <label className="label text-gray-700 dark:text-gray-300">Habitation</label>
//               <input
//                 type="text"
//                 {...register("address_data.habitation", {
//                   pattern: {
//                     value: validationRules.habitation.pattern,
//                     message: validationRules.habitation.message
//                   }
//                 })}
//                 className="input input-bordered w-full"
//               />
//               {errors.address_data?.habitation && <span className="text-error text-sm mt-1">{errors.address_data.habitation.message}</span>}
//             </div>

//             {/* Ward No */}
//             <div className="flex flex-col">
//               <label className="label text-gray-700 dark:text-gray-300">Ward No</label>
//               <input
//                 type="text"
//                 {...register("address_data.ward_no", {
//                   pattern: {
//                     value: validationRules.ward_no.pattern,
//                     message: validationRules.ward_no.message
//                   }
//                 })}
//                 className="input input-bordered w-full"
//               />
//               {errors.address_data?.ward_no && <span className="text-error text-sm mt-1">{errors.address_data.ward_no.message}</span>}
//             </div>

//             {/* Zone No */}
//             <div className="flex flex-col">
//               <label className="label text-gray-700 dark:text-gray-300">Zone No</label>
//               <input
//                 type="text"
//                 {...register("address_data.zone_no", {
//                   pattern: {
//                     value: validationRules.zone_no.pattern,
//                     message: validationRules.zone_no.message
//                   }
//                 })}
//                 className="input input-bordered w-full"
//               />
//               {errors.address_data?.zone_no && <span className="text-error text-sm mt-1">{errors.address_data.zone_no.message}</span>}
//             </div>

//             {/* Block */}
//             <div className="flex flex-col">
//               <label className="label text-gray-700 dark:text-gray-300">Block</label>
//               <input
//                 type="text"
//                 {...register("address_data.block", {
//                   pattern: {
//                     value: validationRules.block.pattern,
//                     message: validationRules.block.message
//                   }
//                 })}
//                 className="input input-bordered w-full"
//               />
//               {errors.address_data?.block && <span className="text-error text-sm mt-1">{errors.address_data.block.message}</span>}
//             </div>

//             {/* District */}
//             <div className="flex flex-col">
//               <label className="label text-gray-700 dark:text-gray-300">District</label>
//               <input
//                 type="text"
//                 {...register("address_data.district", {
//                   pattern: {
//                     value: validationRules.district.pattern,
//                     message: validationRules.district.message
//                   }
//                 })}
//                 className="input input-bordered w-full"
//               />
//               {errors.address_data?.district && <span className="text-error text-sm mt-1">{errors.address_data.district.message}</span>}
//             </div>

//             {/* Division */}
//             <div className="flex flex-col">
//               <label className="label text-gray-700 dark:text-gray-300">Division</label>
//               <input
//                 type="text"
//                 {...register("address_data.division", {
//                   pattern: {
//                     value: validationRules.division.pattern,
//                     message: validationRules.division.message
//                   }
//                 })}
//                 className="input input-bordered w-full"
//               />
//               {errors.address_data?.division && <span className="text-error text-sm mt-1">{errors.address_data.division.message}</span>}
//             </div>

//             {/* Area Code */}
//             <div className="flex flex-col">
//               <div className="flex items-center gap-1">
//                 <label className="label text-gray-700 dark:text-gray-300">Area Code</label>
//                 <span className="text-error">*</span>
//               </div>
//               <input
//                 type="text"
//                 {...register("address_data.area_code", {
//                   required: "Area Code is required",
//                   pattern: {
//                     value: validationRules.area_code.pattern,
//                     message: validationRules.area_code.message
//                   }
//                 })}
//                 className="input input-bordered w-full"
//               />
//               {errors.address_data?.area_code && <span className="text-error text-sm mt-1">{errors.address_data.area_code.message}</span>}
//             </div>

//             {/* Address Line */}
//             <div className="flex flex-col">
//               <div className="flex items-center gap-1">
//                 <label className="label text-gray-700 dark:text-gray-300">Address Line</label>
//                 <span className="text-error">*</span>
//               </div>
//               <input
//                 type="text"
//                 {...register("address_data.address_line", {
//                   required: "Address Line is required",
//                   pattern: {
//                     value: validationRules.address_line.pattern,
//                     message: validationRules.address_line.message,
//                   },
//                 })}
//                 className="input input-bordered w-full"
//               />
//               {errors.address_data?.address_line && (
//                 <span className="text-error text-sm mt-1">
//                   {errors.address_data.address_line.message}
//                 </span>
//               )}
//             </div>

//             {/* Country */}
//             <div className="flex flex-col">
//               <div className="flex items-center gap-1">
//                 <label className="label text-gray-700 dark:text-gray-300">Country</label>
//                 <span className="text-error">*</span>
//               </div>
//               <select
//                 {...register("address_data.country", { required: "Country is required" })}
//                 className="input input-bordered w-full cursor-pointer font-normal text-gray-700 dark:text-gray-300"
//                 value={countryVal || ""}
//                 onChange={(e) => {
//                   const val = e.target.value ? parseInt(e.target.value) : "";
//                   setValue("address_data.country", val, { shouldValidate: true });
//                   trigger("address_data.country");
//                 }}
//               >
//                 <option value="">Select Country</option>
//                 {[...countries]
//                   .sort((a, b) => a.name.localeCompare(b.name))
//                   .map((c) => (
//                     <option key={c.id} value={c.id}>
//                       {c.name}
//                     </option>
//                   ))}
//               </select>
//               {errors.address_data?.country && (
//                 <span className="text-error text-sm mt-1">{errors.address_data.country.message}</span>
//               )}
//             </div>

//             {/* State */}
//             <div className="flex flex-col">
//               <div className="flex items-center gap-1">
//                 <label className="label text-gray-700 dark:text-gray-300">State</label>
//                 <span className="text-error">*</span>
//               </div>
//               <select
//                 {...register("address_data.state", { required: "State is required" })}
//                 className="input input-bordered w-full cursor-pointer font-normal text-gray-700 dark:text-gray-300"
//                 value={stateVal || ""}
//                 onChange={(e) => {
//                   const val = e.target.value ? parseInt(e.target.value) : "";
//                   setValue("address_data.state", val, { shouldValidate: true });
//                   trigger("address_data.state");
//                 }}
//               >
//                 <option value="">Select State</option>
//                 {[...states]
//                   .sort((a, b) => a.name.localeCompare(b.name))
//                   .map((s) => (
//                     <option key={s.id} value={s.id}>
//                       {s.name}
//                     </option>
//                   ))}
//               </select>
//               {errors.address_data?.state && (
//                 <span className="text-error text-sm mt-1">{errors.address_data.state.message}</span>
//               )}
//             </div>

//             {/* City */}
//             <div className="flex flex-col">
//               <div className="flex items-center gap-1">
//                 <label className="label text-gray-700 dark:text-gray-300">City</label>
//                 <span className="text-error">*</span>
//               </div>
//               <select
//                 {...register("address_data.city", { required: "City is required" })}
//                 className="input input-bordered w-full cursor-pointer font-normal text-gray-700 dark:text-gray-300"
//                 value={cityVal || ""}
//                 onChange={(e) => {
//                   const val = e.target.value ? parseInt(e.target.value) : "";
//                   setValue("address_data.city", val, { shouldValidate: true });
//                   trigger("address_data.city");
//                 }}
//               >
//                 <option value="">Select City</option>
//                 {[...cities]
//                   .sort((a, b) => a.name.localeCompare(b.name))
//                   .map((c) => (
//                     <option key={c.id} value={c.id}>
//                       {c.name}
//                     </option>
//                   ))}
//               </select>
//               {errors.address_data?.city && (
//                 <span className="text-error text-sm mt-1">{errors.address_data.city.message}</span>
//               )}
//             </div>

//             {/* Profile Picture */}
//             <div className="md:col-span-2 lg:col-span-3 flex flex-col">
//               <label className="label text-gray-700 dark:text-gray-300">Profile Picture</label>
//               <input
//                 type="file"
//                 {...register("user_profile")}
//                 className="file-input file-input-bordered w-full"
//               />
//             </div>

//             {/* Submit Button */}
//             <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-6 flex justify-center">
//               <button
//                 type="submit"
//                 className="btn bgTheme btn-primary w-52 flex justify-center items-center text-white"
//                 disabled={submitting}
//               >
//                 {submitting && <i className="fa-solid fa-spinner fa-spin mr-2"></i>}
//                 {submitting ? "Updating..." : "Save Changes"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>

//       {/* Update Success Modal */}
//       {updateModal && (
//         <UpdateSuccessful
//           handleCloseOnly={() => setUpdateModal(false)}
//           handleCloseAndNavigate={() => navigate(`/staffDetail/${type}/${id}`)}
//         />
//       )}

//       {/* Error Modal */}
//       {formErrors.length > 0 && (
//         <dialog className="modal modal-open">
//           <div className="modal-box bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100">
//             <h3 className="font-bold text-lg">Update Failed</h3>
//             <div className="py-4">
//               {formErrors.map((err, idx) => (
//                 <p key={idx} className="text-sm">
//                   {err}
//                 </p>
//               ))}
//             </div>
//             <div className="modal-action">
//               <button
//                 className="btn bgTheme text-white w-30"
//                 onClick={() => setFormErrors([])}
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

// export default UpdateStaffDetails;





// import React, { useEffect, useState, useCallback, useRef, useContext } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useForm } from "react-hook-form";
// import {
//   fetchTeachers,
//   fetchOfficeStaff,
//   editOfficeStaffdetails,
//   editTeachersdetails,
//   fetchCountry,
//   fetchState,
//   fetchCity,
// } from "../../services/api/Api";
// import { AuthContext } from "../../context/AuthContext";
// import { constants } from "../../global/constants";

// const UpdateStaffDetails = () => {
//   // ============ HOOKS & PARAMS ============
//   const { id, type } = useParams();
//   const navigate = useNavigate();
//   const { authTokens } = useContext(AuthContext);

//   // ============ BASE URLs ============
//   const BASE_URL = constants.baseUrl;
//   const JAVA_BASE_URL = constants.JAVA_BASE_URL;

//   // ============ STATES ============
//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [updateModal, setUpdateModal] = useState(false);
//   const [formErrors, setFormErrors] = useState([]);
//   const [submitting, setSubmitting] = useState(false);
//   const [staffData, setStaffData] = useState(null);
//   const [userId, setUserId] = useState(null);

//   // ============ IMAGE STATES ============
//   const [javaImageUrl, setJavaImageUrl] = useState("");
//   const [imagePreview, setImagePreview] = useState(null);
//   const [removeImage, setRemoveImage] = useState(false);
//   const javaBlobUrlRef = useRef("");

//   // ============ FORM SETUP ============
//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//   } = useForm({
//     mode: "onChange",
//     reValidateMode: "onChange",
//   });

//   // ============ VALIDATION RULES ============
//   const validationRules = {
//     first_name: { pattern: /^[A-Za-z]{2,30}$/, message: "First name must be 2-30 letters" },
//     middle_name: { pattern: /^[A-Za-z]{0,30}$/, message: "Middle name must be letters only" },
//     last_name: { pattern: /^[A-Za-z]{2,30}$/, message: "Last name must be 2-30 letters" },
//     email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" },
//     phone_no: { pattern: /^[6-9][0-9]{9}$/, message: "Phone must be 10 digits starting with 6-9" },
//     aadhar_no: { pattern: /^[2-9][0-9]{11}$/, message: "Aadhaar must be 12 digits starting with 2-9" },
//     pan_no: { pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, message: "Invalid PAN format" },
//     qualification: { pattern: /^[A-Za-z0-9\s\-,.]{2,50}$/, message: "Invalid qualification" },
//     account_no: { pattern: /^[0-9]{9,18}$/, message: "Account number must be 9-18 digits" },
//     ifsc_code: { pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/, message: "Invalid IFSC code" },
//     holder_name: { pattern: /^[A-Za-z ]{2,50}$/, message: "Holder name must be letters only" },
//     house_no: { pattern: /^[A-Za-z0-9\-\/ ]{1,10}$/, message: "Invalid house number" },
//     habitation: { pattern: /^[A-Za-z0-9 ]{1,50}$/, message: "Invalid habitation" },
//     ward_no: { pattern: /^[0-9]{1,5}$/, message: "Invalid ward number" },
//     zone_no: { pattern: /^[0-9]{1,5}$/, message: "Invalid zone number" },
//     block: { pattern: /^[A-Za-z0-9 ]{0,50}$/, message: "Invalid block" },
//     district: { pattern: /^[A-Za-z ]{1,50}$/, message: "Invalid district" },
//     division: { pattern: /^[A-Za-z ]{0,50}$/, message: "Invalid division" },
//     area_code: { pattern: /^[0-9]{3,10}$/, message: "Invalid area code" },
//     address_line: { pattern: /^[A-Za-z0-9,.\-\/ ]{0,100}$/, message: "Invalid address line" },
//   };

//   // ============ CLEANUP BLOB URL ============
//   const cleanupBlobUrl = useCallback((url) => {
//     if (url && url.startsWith("blob:")) {
//       URL.revokeObjectURL(url);
//     }
//   }, []);

//   // ============ FETCH JAVA IMAGE ============
//   const fetchJavaImage = useCallback(async (uid) => {
//     if (!uid) return;

//     try {
//       const res = await axios.get(`${JAVA_BASE_URL}/users/getUserImage/${uid}`);
//       const imagePath = res.data?.imagePath;

//       if (!imagePath) {
//         cleanupBlobUrl(javaBlobUrlRef.current);
//         javaBlobUrlRef.current = "";
//         setJavaImageUrl("");
//         return;
//       }

//       const tokens = JSON.parse(localStorage.getItem("authTokens"));
//       const accessToken = tokens?.access;
//       if (!accessToken) return;

//       const imageResponse = await axios.get(imagePath, {
//         responseType: "blob",
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "ngrok-skip-browser-warning": "true",
//         },
//       });

//       cleanupBlobUrl(javaBlobUrlRef.current);
//       const newBlobUrl = URL.createObjectURL(imageResponse.data);
//       javaBlobUrlRef.current = newBlobUrl;
//       setJavaImageUrl(newBlobUrl);
//     } catch (err) {
//       console.error("Failed to fetch Java image:", err);
//       cleanupBlobUrl(javaBlobUrlRef.current);
//       javaBlobUrlRef.current = "";
//       setJavaImageUrl("");
//     }
//   }, [JAVA_BASE_URL, cleanupBlobUrl]);

//   // ============ FETCH ALL DATA ON MOUNT ============
//   useEffect(() => {
//     const fetchAllData = async () => {
//       try {
//         const [countriesData, statesData, citiesData] = await Promise.all([
//           fetchCountry(),
//           fetchState(),
//           fetchCity(),
//         ]);

//         setCountries(countriesData || []);
//         setStates(statesData || []);
//         setCities(citiesData || []);

//         // Fetch staff data
//         const data = type === "teacher"
//           ? await fetchTeachers(id)
//           : await fetchOfficeStaff(id);

//         setStaffData(data);
//         setUserId(data.user);

//         // Prefill form fields
//         setValue("first_name", data.first_name || "");
//         setValue("middle_name", data.middle_name || "");
//         setValue("last_name", data.last_name || "");
//         setValue("email", data.email || "");
//         setValue("phone_no", data.phone_no || "");
//         setValue("gender", data.gender || "");
//         setValue("aadhar_no", data.aadhar_no || "");
//         setValue("pan_no", data.pan_no || "");
//         setValue("qualification", data.qualification || "");
//         setValue("joining_date", data.joining_date || "");

//         setValue("banking_data.account_no", data.banking_data?.account_no || "");
//         setValue("banking_data.ifsc_code", data.banking_data?.ifsc_code || "");
//         setValue("banking_data.holder_name", data.banking_data?.holder_name || "");

//         setValue("address_data.house_no", data.address_data?.house_no || "");
//         setValue("address_data.habitation", data.address_data?.habitation || "");
//         setValue("address_data.ward_no", data.address_data?.ward_no || "");
//         setValue("address_data.zone_no", data.address_data?.zone_no || "");
//         setValue("address_data.block", data.address_data?.block || "");
//         setValue("address_data.district", data.address_data?.district || "");
//         setValue("address_data.division", data.address_data?.division || "");
//         setValue("address_data.area_code", data.address_data?.area_code || "");
//         setValue("address_data.address_line", data.address_data?.address_line || "");

//         // Find and set Country/State/City IDs
//         const countryId = countriesData?.find((c) => c.name === data.address_data?.country_name)?.id;
//         const stateId = statesData?.find((s) => s.name === data.address_data?.state_name)?.id;
//         const cityId = citiesData?.find((c) => c.name === data.address_data?.city_name)?.id;

//         setValue("address_data.country", countryId || "");
//         setValue("address_data.state", stateId || "");
//         setValue("address_data.city", cityId || "");

//       } catch (err) {
//         console.error("Fetch error:", err);
//         setError(err.message || "Failed to fetch staff details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllData();
//   }, [id, type, setValue]);

//   // ============ FETCH JAVA IMAGE WHEN USER ID CHANGES ============
//   useEffect(() => {
//     if (userId) {
//       fetchJavaImage(userId);
//     }

//     return () => {
//       cleanupBlobUrl(javaBlobUrlRef.current);
//     };
//   }, [userId, fetchJavaImage, cleanupBlobUrl]);

//   // ============ IMAGE PRIORITY ============
//   let profilePicUrl = null;
//   if (javaImageUrl) {
//     profilePicUrl = javaImageUrl;
//   } else if (staffData?.user_profile) {
//     profilePicUrl = staffData.user_profile.startsWith("http")
//       ? staffData.user_profile
//       : `${BASE_URL}${staffData.user_profile}`;
//   }

//   // ============ HANDLE IMAGE CHANGE ============
//   const handleImageChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       setImagePreview(e.target.files[0]);
//       setRemoveImage(false);
//     }
//   };

//   // ============ HANDLE REMOVE IMAGE ============
//   const handleRemoveImage = () => {
//     setImagePreview(null);
//     setRemoveImage(true);
//   };

//   // ============ FORM SUBMIT ============
//   const onSubmit = async (formData) => {
//   setSubmitting(true);
//   setError(null);
//   setFormErrors([]);
  
//   // ✅ Create FormData exactly like student update
//   const payload = new FormData();
  
//   // Send user ID in payload
//   payload.append("user", userId);
  
//   // Append all basic fields
//   if (formData.first_name) payload.append("first_name", formData.first_name);
//   if (formData.middle_name) payload.append("middle_name", formData.middle_name);
//   if (formData.last_name) payload.append("last_name", formData.last_name);
//   if (formData.email) payload.append("email", formData.email);
//   if (formData.phone_no) payload.append("phone_no", formData.phone_no);
//   if (formData.gender) payload.append("gender", formData.gender);
//   if (formData.aadhar_no) payload.append("aadhar_no", formData.aadhar_no);
//   if (formData.pan_no) payload.append("pan_no", formData.pan_no);
//   if (formData.qualification) payload.append("qualification", formData.qualification);
//   if (formData.joining_date) payload.append("joining_date", formData.joining_date);
  
//   // Handle image upload/removal - exactly like student
//   if (removeImage) {
//     payload.append("user_profile", "");
//   } else if (imagePreview && typeof imagePreview !== "string") {
//     payload.append("user_profile", imagePreview);
//   }
  
//   // Get country/state/city names
//   const countryId = formData.address_data.country;
//   const stateId = formData.address_data.state;
//   const cityId = formData.address_data.city;
  
//   const countryName = countries.find((c) =>
//     c.id === countryId || c.id === parseInt(countryId) || String(c.id) === String(countryId)
//   )?.name || "";
  
//   const stateName = states.find((s) =>
//     s.id === stateId || s.id === parseInt(stateId) || String(s.id) === String(stateId)
//   )?.name || "";
  
//   const cityName = cities.find((c) =>
//     c.id === cityId || c.id === parseInt(cityId) || String(c.id) === String(cityId)
//   )?.name || "";
  
//   // Create nested objects
//   const address_data = {
//     house_no: formData.address_data.house_no || "",
//     habitation: formData.address_data.habitation || "",
//     ward_no: formData.address_data.ward_no || "",
//     zone_no: formData.address_data.zone_no || "",
//     block: formData.address_data.block || "",
//     district: formData.address_data.district || "",
//     division: formData.address_data.division || "",
//     area_code: formData.address_data.area_code || "",
//     address_line: formData.address_data.address_line || "",
//     country_name: countryName,
//     state_name: stateName,
//     city_name: cityName,
//   };
  
//   const banking_data = {
//     account_no: formData.banking_data.account_no || "",
//     ifsc_code: formData.banking_data.ifsc_code || "",
//     holder_name: formData.banking_data.holder_name || "",
//   };
  
//   // Append nested objects as JSON strings
//   payload.append("address_data", JSON.stringify(address_data));
//   payload.append("banking_data", JSON.stringify(banking_data));
  
//   try {
//     // Use userId for update API - NO authTokens needed (like student)
//     const response = type === "teacher"
//       ? await editTeachersdetails(userId, payload)
//       : await editOfficeStaffdetails(userId, payload);
    
//     // Check if response exists (successful update)
//     if (response) {
//       // Use the original id from params for navigation
//       setUpdatedStudentId(id);
//       setUpdateModal(true);
      
//       // Re-fetch updated data
//       const updatedData = type === "teacher"
//         ? await fetchTeachers(id)
//         : await fetchOfficeStaff(id);
      
//       setStaffData(updatedData);
      
//       // Re-fetch Java image for display
//       if (updatedData.user) {
//         await fetchJavaImage(updatedData.user);
//       }
      
//       setImagePreview(null);
//       setRemoveImage(false);
      
//       // Auto navigate after 2 seconds
//       setTimeout(() => {
//         navigate(`/staffDetail/${type}/${id}`);
//       }, 2000);
//     }
//   } catch (err) {
//     console.error("Update error:", err);
    
//     // Better error handling
//     const errorMessage = err?.message || err?.detail || "Failed to update details. Please try again.";
//     setFormErrors([errorMessage]);
    
//     // Scroll to top to show error
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   } finally {
//     setSubmitting(false);
//   }
// };

//   // ============ LOADING STATE ============
//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen">
//         <div className="flex space-x-2">
//           <div className="w-3 h-3 bgTheme rounded-full animate-bounce"></div>
//           <div className="w-3 h-3 bgTheme rounded-full animate-bounce [animation-delay:-0.2s]"></div>
//           <div className="w-3 h-3 bgTheme rounded-full animate-bounce [animation-delay:-0.4s]"></div>
//         </div>
//         <p className="mt-2 text-gray-500 text-sm">Loading data...</p>
//       </div>
//     );
//   }

//   // ============ ERROR STATE ============
//   if (error && !staffData) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
//         <i className="fa-solid fa-triangle-exclamation text-5xl text-red-400 mb-4"></i>
//         <p className="text-lg text-red-400 font-medium">{error}</p>
//         <button
//           onClick={() => window.location.reload()}
//           className="btn bgTheme text-white mt-4"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   const maxDate = new Date().toISOString().split("T")[0];

//   // ============ MAIN UI ============
//   return (
//     <div className="mb-24 md:mb-10">
//       <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
//         <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow dark:shadow-gray-700">

//           {/* Error Messages */}
//           {formErrors.length > 0 && (
//             <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
//               <div className="flex items-start">
//                 <i className="fa-solid fa-triangle-exclamation mr-2 mt-1"></i>
//                 <div>
//                   {formErrors.map((err, idx) => (
//                     <p key={idx} className="text-sm">{err}</p>
//                   ))}
//                 </div>
//                 <button
//                   onClick={() => setFormErrors([])}
//                   className="ml-auto text-red-700 hover:text-red-900"
//                 >
//                   <i className="fa-solid fa-xmark"></i>
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Success Message */}
//           {updateModal && (
//             <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
//               <i className="fa-solid fa-check-circle mr-2"></i>
//               <span>Profile updated successfully! Redirecting...</span>
//             </div>
//           )}

//           {/* ========== PROFILE PICTURE SECTION ========== */}
//           <div className="flex flex-col items-center mb-8">
//             <div className="h-32 w-32 rounded-full bg-gray-100 dark:bg-gray-600 overflow-hidden shadow-md border-2 border-gray-300 mb-4">
//               {imagePreview ? (
//                 <ImagePreviewFromFile file={imagePreview} />
//               ) : profilePicUrl ? (
//                 <img
//                   src={profilePicUrl}
//                   alt="Profile"
//                   className="h-full w-full object-cover"
//                   onError={() => {
//                     cleanupBlobUrl(javaBlobUrlRef.current);
//                     javaBlobUrlRef.current = "";
//                     setJavaImageUrl("");
//                   }}
//                 />
//               ) : (
//                 <div className="h-full w-full flex items-center justify-center text-gray-400">
//                   <i className="fa-solid fa-user text-5xl"></i>
//                 </div>
//               )}
//             </div>

//             <div className="flex gap-2">
//               <label className="btn bgTheme text-white btn-sm cursor-pointer">
//                 <i className="fa-solid fa-camera mr-2"></i>
//                 {imagePreview || profilePicUrl ? "Change Photo" : "Upload Photo"}
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageChange}
//                   className="hidden"
//                   disabled={submitting}
//                 />
//               </label>

//               {(imagePreview || profilePicUrl) && (
//                 <button
//                   type="button"
//                   onClick={handleRemoveImage}
//                   className="btn btn-sm btn-error text-white"
//                   disabled={submitting}
//                 >
//                   <i className="fa-solid fa-trash mr-2"></i>
//                   Remove
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* ========== TITLE ========== */}
//           <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">
//             {type?.toLowerCase() === "teacher" ? "Update Teacher Details" : "Update Staff Details"}
//           </h1>

//           {/* ========== FORM ========== */}
//           <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

//             {/* First Name */}
//             <div className="flex flex-col">
//               <label className="label text-gray-700 dark:text-gray-300">
//                 First Name <span className="text-error">*</span>
//               </label>
//               <input
//                 type="text"
//                 {...register("first_name", {
//                   required: "First Name is required",
//                   pattern: { value: validationRules.first_name.pattern, message: validationRules.first_name.message },
//                 })}
//                 className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//                 disabled={submitting}
//               />
//               {errors.first_name && <span className="text-error text-sm mt-1">{errors.first_name.message}</span>}
//             </div>

//             {/* Middle Name */}
//             <div className="flex flex-col">
//               <label className="label text-gray-700 dark:text-gray-300">Middle Name</label>
//               <input
//                 type="text"
//                 {...register("middle_name", {
//                   pattern: { value: validationRules.middle_name.pattern, message: validationRules.middle_name.message },
//                 })}
//                 className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//                 disabled={submitting}
//               />
//               {errors.middle_name && <span className="text-error text-sm mt-1">{errors.middle_name.message}</span>}
//             </div>

//             {/* Last Name */}
//             <div className="flex flex-col">
//               <label className="label text-gray-700 dark:text-gray-300">
//                 Last Name <span className="text-error">*</span>
//               </label>
//               <input
//                 type="text"
//                 {...register("last_name", {
//                   required: "Last Name is required",
//                   pattern: { value: validationRules.last_name.pattern, message: validationRules.last_name.message },
//                 })}
//                 className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//                 disabled={submitting}
//               />
//               {errors.last_name && <span className="text-error text-sm mt-1">{errors.last_name.message}</span>}
//             </div>

//             {/* Email */}
//             <div className="flex flex-col">
//               <label className="label text-gray-700 dark:text-gray-300">
//                 Email <span className="text-error">*</span>
//               </label>
//               <input
//                 type="email"
//                 {...register("email", {
//                   required: "Email is required",
//                   pattern: { value: validationRules.email.pattern, message: validationRules.email.message },
//                 })}
//                 className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//                 disabled={submitting}
//               />
//               {errors.email && <span className="text-error text-sm mt-1">{errors.email.message}</span>}
//             </div>

//             {/* Phone No */}
//             <div className="flex flex-col">
//               <label className="label text-gray-700 dark:text-gray-300">
//                 Phone No <span className="text-error">*</span>
//               </label>
//               <input
//                 type="text"
//                 maxLength={10}
//                 {...register("phone_no", {
//                   required: "Phone No is required",
//                   pattern: { value: validationRules.phone_no.pattern, message: validationRules.phone_no.message },
//                 })}
//                 onKeyDown={(e) => {
//                   if (!/[0-9]|Backspace|ArrowLeft|ArrowRight|Delete|Tab/.test(e.key)) {
//                     e.preventDefault();
//                   }
//                 }}
//                 className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//                 disabled={submitting}
//               />
//               {errors.phone_no && <span className="text-error text-sm mt-1">{errors.phone_no.message}</span>}
//             </div>

//             {/* Gender */}
//             <div className="flex flex-col">
//               <label className="label text-gray-700 dark:text-gray-300">
//                 Gender <span className="text-error">*</span>
//               </label>
//               <select
//                 {...register("gender", { required: "Gender is required" })}
//                 className="select select-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//                 disabled={submitting}
//               >
//                 <option value="">Select Gender</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//               </select>
//               {errors.gender && <span className="text-error text-sm mt-1">{errors.gender.message}</span>}
//             </div>

//             {/* Aadhaar No */}
//             <div className="flex flex-col">
//               <label className="label text-gray-700 dark:text-gray-300">
//                 Aadhaar No <span className="text-error">*</span>
//               </label>
//               <input
//                 type="text"
//                 maxLength={12}
//                 {...register("aadhar_no", {
//                   required: "Aadhaar No is required",
//                   pattern: { value: validationRules.aadhar_no.pattern, message: validationRules.aadhar_no.message },
//                 })}
//                 onKeyDown={(e) => {
//                   if (!/[0-9]|Backspace|ArrowLeft|ArrowRight|Delete|Tab/.test(e.key)) {
//                     e.preventDefault();
//                   }
//                 }}
//                 className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//                 disabled={submitting}
//               />
//               {errors.aadhar_no && <span className="text-error text-sm mt-1">{errors.aadhar_no.message}</span>}
//             </div>

//             {/* PAN No */}
//             <div className="flex flex-col">
//               <label className="label text-gray-700 dark:text-gray-300">
//                 PAN No <span className="text-error">*</span>
//               </label>
//               <input
//                 type="text"
//                 maxLength={10}
//                 {...register("pan_no", {
//                   required: "PAN No is required",
//                   pattern: { value: validationRules.pan_no.pattern, message: validationRules.pan_no.message },
//                 })}
//                 onInput={(e) => {
//                   e.target.value = e.target.value.toUpperCase();
//                 }}
//                 className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//                 disabled={submitting}
//               />
//               {errors.pan_no && <span className="text-error text-sm mt-1">{errors.pan_no.message}</span>}
//             </div>

//             {/* Qualification */}
//             <div className="flex flex-col">
//               <label className="label text-gray-700 dark:text-gray-300">
//                 Qualification <span className="text-error">*</span>
//               </label>
//               <input
//                 type="text"
//                 {...register("qualification", {
//                   required: "Qualification is required",
//                   pattern: { value: validationRules.qualification.pattern, message: validationRules.qualification.message },
//                 })}
//                 className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//                 disabled={submitting}
//               />
//               {errors.qualification && <span className="text-error text-sm mt-1">{errors.qualification.message}</span>}
//             </div>

//             {/* Joining Date */}
//             <div className="flex flex-col">
//               <label className="label text-gray-700 dark:text-gray-300">
//                 Joining Date <span className="text-error">*</span>
//               </label>
//               <input
//                 type="date"
//                 max={maxDate}
//                 {...register("joining_date", { required: "Joining Date is required" })}
//                 className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//                 disabled={submitting}
//               />
//               {errors.joining_date && <span className="text-error text-sm mt-1">{errors.joining_date.message}</span>}
//             </div>

//             {/* ========== BANKING DETAILS ========== */}
//             <div className="col-span-1 md:col-span-2 lg:col-span-3">
//               <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800 dark:text-gray-100">Banking Details</h3>
//               <hr className="mb-4 dark:border-gray-600" />
//             </div>

//             {/* Account No */}
//             <div className="flex flex-col">
//               <label className="label text-gray-700 dark:text-gray-300">
//                 Account No <span className="text-error">*</span>
//               </label>
//               <input
//                 type="text"
//                 maxLength={18}
//                 {...register("banking_data.account_no", {
//                   required: "Account No is required",
//                   pattern: { value: validationRules.account_no.pattern, message: validationRules.account_no.message },
//                 })}
//                 onKeyDown={(e) => {
//                   if (!/[0-9]|Backspace|ArrowLeft|ArrowRight|Delete|Tab/.test(e.key)) {
//                     e.preventDefault();
//                   }
//                 }}
//                 className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//                 disabled={submitting}
//               />
//               {errors.banking_data?.account_no && <span className="text-error text-sm mt-1">{errors.banking_data.account_no.message}</span>}
//             </div>

//             {/* IFSC Code */}
//             <div className="flex flex-col">
//               <label className="label text-gray-700 dark:text-gray-300">
//                 IFSC Code <span className="text-error">*</span>
//               </label>
//               <input
//                 type="text"
//                 maxLength={11}
//                 {...register("banking_data.ifsc_code", {
//                   required: "IFSC Code is required",
//                   pattern: { value: validationRules.ifsc_code.pattern, message: validationRules.ifsc_code.message },
//                 })}
//                 onInput={(e) => {
//                   e.target.value = e.target.value.toUpperCase();
//                 }}
//                 className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//                 disabled={submitting}
//               />
//               {errors.banking_data?.ifsc_code && <span className="text-error text-sm mt-1">{errors.banking_data.ifsc_code.message}</span>}
//             </div>

//             {/* Holder Name */}
//             <div className="flex flex-col">
//               <label className="label text-gray-700 dark:text-gray-300">
//                 Holder Name <span className="text-error">*</span>
//               </label>
//               <input
//                 type="text"
//                 {...register("banking_data.holder_name", {
//                   required: "Holder Name is required",
//                   pattern: { value: validationRules.holder_name.pattern, message: validationRules.holder_name.message },
//                 })}
//                 className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//                 disabled={submitting}
//               />
//               {errors.banking_data?.holder_name && <span className="text-error text-sm mt-1">{errors.banking_data.holder_name.message}</span>}
//             </div>

//             {/* ========== ADDRESS DETAILS ========== */}
//             <div className="col-span-1 md:col-span-2 lg:col-span-3">
//               <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800 dark:text-gray-100">Address Details</h3>
//               <hr className="mb-4 dark:border-gray-600" />
//             </div>

//             {/* House No */}
//             <div className="flex flex-col">
//               <label className="label text-gray-700 dark:text-gray-300">House No</label>
//               <input
//                 type="text"
//                 {...register("address_data.house_no")}
//                 className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//                 disabled={submitting}
//               />
//             </div>

//             {/* Habitation */}
//             <div className="flex flex-col">
//               <label className="label text-gray-700 dark:text-gray-300">Habitation</label>
//               <input
//                 type="text"
//                 {...register("address_data.habitation")}
//                 className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//                 disabled={submitting}
//               />
//             </div>

//             {/* Ward No */}
//             <div className="flex flex-col">
//               <label className="label text-gray-700 dark:text-gray-300">Ward No</label>
//               <input
//                 type="text"
//                 {...register("address_data.ward_no")}
//                 className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//                 disabled={submitting}
//               />
//             </div>

//             {/* Zone No */}
//             <div className="flex flex-col">
//               <label className="label text-gray-700 dark:text-gray-300">Zone No</label>
//               <input
//                 type="text"
//                 {...register("address_data.zone_no")}
//                 className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//                 disabled={submitting}
//               />
//             </div>

//             {/* Block */}
//             <div className="flex flex-col">
//               <label className="label text-gray-700 dark:text-gray-300">Block</label>
//               <input
//                 type="text"
//                 {...register("address_data.block")}
//                 className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//                 disabled={submitting}
//               />
//             </div>

//             {/* District */}
//             <div className="flex flex-col">
//               <label className="label text-gray-700 dark:text-gray-300">District</label>
//               <input
//                 type="text"
//                 {...register("address_data.district")}
//                 className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//                 disabled={submitting}
//               />
//             </div>

//             {/* Division */}
//             <div className="flex flex-col">
//               <label className="label text-gray-700 dark:text-gray-300">Division</label>
//               <input
//                 type="text"
//                 {...register("address_data.division")}
//                 className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//                 disabled={submitting}
//               />
//             </div>

//             {/* Area Code */}
//             <div className="flex flex-col">
//               <label className="label text-gray-700 dark:text-gray-300">
//                 Area Code <span className="text-error">*</span>
//               </label>
//               <input
//                 type="text"
//                 maxLength={10}
//                 {...register("address_data.area_code", {
//                   required: "Area Code is required",
//                   pattern: { value: validationRules.area_code.pattern, message: validationRules.area_code.message },
//                 })}
//                 onKeyDown={(e) => {
//                   if (!/[0-9]|Backspace|ArrowLeft|ArrowRight|Delete|Tab/.test(e.key)) {
//                     e.preventDefault();
//                   }
//                 }}
//                 className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//                 disabled={submitting}
//               />
//               {errors.address_data?.area_code && <span className="text-error text-sm mt-1">{errors.address_data.area_code.message}</span>}
//             </div>

//             {/* Address Line */}
//             <div className="flex flex-col">
//               <label className="label text-gray-700 dark:text-gray-300">
//                 Address Line <span className="text-error">*</span>
//               </label>
//               <input
//                 type="text"
//                 {...register("address_data.address_line", {
//                   required: "Address Line is required",
//                 })}
//                 className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//                 disabled={submitting}
//               />
//               {errors.address_data?.address_line && <span className="text-error text-sm mt-1">{errors.address_data.address_line.message}</span>}
//             </div>

//             {/* Country */}
//             <div className="flex flex-col">
//               <label className="label text-gray-700 dark:text-gray-300">
//                 Country <span className="text-error">*</span>
//               </label>
//               <select
//                 {...register("address_data.country", { required: "Country is required" })}
//                 className="select select-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//                 disabled={submitting}
//               >
//                 <option value="">Select Country</option>
//                 {countries
//                   .sort((a, b) => a.name.localeCompare(b.name))
//                   .map((c) => (
//                     <option key={c.id} value={c.id}>{c.name}</option>
//                   ))}
//               </select>
//               {errors.address_data?.country && <span className="text-error text-sm mt-1">{errors.address_data.country.message}</span>}
//             </div>

//             {/* State */}
//             <div className="flex flex-col">
//               <label className="label text-gray-700 dark:text-gray-300">
//                 State <span className="text-error">*</span>
//               </label>
//               <select
//                 {...register("address_data.state", { required: "State is required" })}
//                 className="select select-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//                 disabled={submitting}
//               >
//                 <option value="">Select State</option>
//                 {states
//                   .sort((a, b) => a.name.localeCompare(b.name))
//                   .map((s) => (
//                     <option key={s.id} value={s.id}>{s.name}</option>
//                   ))}
//               </select>
//               {errors.address_data?.state && <span className="text-error text-sm mt-1">{errors.address_data.state.message}</span>}
//             </div>

//             {/* City */}
//             <div className="flex flex-col">
//               <label className="label text-gray-700 dark:text-gray-300">
//                 City <span className="text-error">*</span>
//               </label>
//               <select
//                 {...register("address_data.city", { required: "City is required" })}
//                 className="select select-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//                 disabled={submitting}
//               >
//                 <option value="">Select City</option>
//                 {cities
//                   .sort((a, b) => a.name.localeCompare(b.name))
//                   .map((c) => (
//                     <option key={c.id} value={c.id}>{c.name}</option>
//                   ))}
//               </select>
//               {errors.address_data?.city && <span className="text-error text-sm mt-1">{errors.address_data.city.message}</span>}
//             </div>

//             {/* Submit Button */}
//             <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-6 flex justify-center">
//               <button
//                 type="submit"
//                 className="btn bgTheme text-white w-52"
//                 disabled={submitting}
//               >
//                 {submitting ? (
//                   <>
//                     <span className="loading loading-spinner loading-sm mr-2"></span>
//                     Updating...
//                   </>
//                 ) : (
//                   <>
//                     <i className="fa-solid fa-floppy-disk mr-2"></i>
//                     Save Changes
//                   </>
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ============ HELPER COMPONENT FOR IMAGE PREVIEW ============
// const ImagePreviewFromFile = ({ file }) => {
//   const [previewUrl, setPreviewUrl] = useState("");

//   useEffect(() => {
//     if (!file) return;

//     const url = URL.createObjectURL(file);
//     setPreviewUrl(url);

//     return () => URL.revokeObjectURL(url);
//   }, [file]);

//   if (!previewUrl) return null;

//   return <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />;
// };

// export default UpdateStaffDetails;








import React, { useEffect, useState, useCallback, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import {
  fetchTeachers,
  fetchOfficeStaff,
  editOfficeStaffdetails,
  editTeachersdetails,
  fetchCountry,
  fetchState,
  fetchCity,
} from "../../services/api/Api";
import { AuthContext } from "../../context/AuthContext";
import { constants } from "../../global/constants";

const UpdateStaffDetails = () => {
  // ============ HOOKS & PARAMS ============
  const { id, type } = useParams();
  const navigate = useNavigate();
  const { authTokens } = useContext(AuthContext);

  // ============ BASE URLs ============
  const BASE_URL = constants.baseUrl;
  const JAVA_BASE_URL = constants.JAVA_BASE_URL;

  // ============ STATES ============
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateModal, setUpdateModal] = useState(false);
  const [formErrors, setFormErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [staffData, setStaffData] = useState(null);
  const [userId, setUserId] = useState(null);

  // ============ IMAGE STATES ============
  const [javaImageUrl, setJavaImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const javaBlobUrlRef = useRef("");

  // ============ FORM SETUP ============
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  // ============ VALIDATION RULES ============
  const validationRules = {
    first_name: { pattern: /^[A-Za-z]{2,30}$/, message: "First name must be 2-30 letters" },
    middle_name: { pattern: /^[A-Za-z]{0,30}$/, message: "Middle name must be letters only" },
    last_name: { pattern: /^[A-Za-z]{2,30}$/, message: "Last name must be 2-30 letters" },
    email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" },
    phone_no: { pattern: /^[6-9][0-9]{9}$/, message: "Phone must be 10 digits starting with 6-9" },
    aadhar_no: { pattern: /^[2-9][0-9]{11}$/, message: "Aadhaar must be 12 digits starting with 2-9" },
    pan_no: { pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, message: "Invalid PAN format" },
    qualification: { pattern: /^[A-Za-z0-9\s\-,.]{2,50}$/, message: "Invalid qualification" },
    account_no: { pattern: /^[0-9]{9,18}$/, message: "Account number must be 9-18 digits" },
    ifsc_code: { pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/, message: "Invalid IFSC code" },
    holder_name: { pattern: /^[A-Za-z ]{2,50}$/, message: "Holder name must be letters only" },
    house_no: { pattern: /^[A-Za-z0-9\-\/ ]{1,10}$/, message: "Invalid house number" },
    habitation: { pattern: /^[A-Za-z0-9 ]{1,50}$/, message: "Invalid habitation" },
    ward_no: { pattern: /^[0-9]{1,5}$/, message: "Invalid ward number" },
    zone_no: { pattern: /^[0-9]{1,5}$/, message: "Invalid zone number" },
    block: { pattern: /^[A-Za-z0-9 ]{0,50}$/, message: "Invalid block" },
    district: { pattern: /^[A-Za-z ]{1,50}$/, message: "Invalid district" },
    division: { pattern: /^[A-Za-z ]{0,50}$/, message: "Invalid division" },
    area_code: { pattern: /^[0-9]{3,10}$/, message: "Invalid area code" },
    address_line: { pattern: /^[A-Za-z0-9,.\-\/ ]{0,100}$/, message: "Invalid address line" },
  };

  // ============ CLEANUP BLOB URL ============
  const cleanupBlobUrl = useCallback((url) => {
    if (url && url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  }, []);

  // ============ FETCH JAVA IMAGE ============
  const fetchJavaImage = useCallback(async (uid) => {
    if (!uid) return;

    try {
      const res = await axios.get(`${JAVA_BASE_URL}/users/getUserImage/${uid}`);
      const imagePath = res.data?.imagePath;

      if (!imagePath) {
        cleanupBlobUrl(javaBlobUrlRef.current);
        javaBlobUrlRef.current = "";
        setJavaImageUrl("");
        return;
      }

      const tokens = JSON.parse(localStorage.getItem("authTokens"));
      const accessToken = tokens?.access;
      if (!accessToken) return;

      const imageResponse = await axios.get(imagePath, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "ngrok-skip-browser-warning": "true",
        },
      });

      cleanupBlobUrl(javaBlobUrlRef.current);
      const newBlobUrl = URL.createObjectURL(imageResponse.data);
      javaBlobUrlRef.current = newBlobUrl;
      setJavaImageUrl(newBlobUrl);
    } catch (err) {
      console.error("Failed to fetch Java image:", err);
      cleanupBlobUrl(javaBlobUrlRef.current);
      javaBlobUrlRef.current = "";
      setJavaImageUrl("");
    }
  }, [JAVA_BASE_URL, cleanupBlobUrl]);

  // ============ FETCH ALL DATA ON MOUNT ============
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [countriesData, statesData, citiesData] = await Promise.all([
          fetchCountry(),
          fetchState(),
          fetchCity(),
        ]);

        setCountries(countriesData || []);
        setStates(statesData || []);
        setCities(citiesData || []);

        // Fetch staff data
        const data = type === "teacher"
          ? await fetchTeachers(id)
          : await fetchOfficeStaff(id);

        setStaffData(data);
        setUserId(data.user);

        // Prefill form fields
        setValue("first_name", data.first_name || "");
        setValue("middle_name", data.middle_name || "");
        setValue("last_name", data.last_name || "");
        setValue("email", data.email || "");
        setValue("phone_no", data.phone_no || "");
        setValue("gender", data.gender || "");
        setValue("aadhar_no", data.aadhar_no || "");
        setValue("pan_no", data.pan_no || "");
        setValue("qualification", data.qualification || "");
        setValue("joining_date", data.joining_date || "");

        setValue("banking_data.account_no", data.banking_data?.account_no || "");
        setValue("banking_data.ifsc_code", data.banking_data?.ifsc_code || "");
        setValue("banking_data.holder_name", data.banking_data?.holder_name || "");

        setValue("address_data.house_no", data.address_data?.house_no || "");
        setValue("address_data.habitation", data.address_data?.habitation || "");
        setValue("address_data.ward_no", data.address_data?.ward_no || "");
        setValue("address_data.zone_no", data.address_data?.zone_no || "");
        setValue("address_data.block", data.address_data?.block || "");
        setValue("address_data.district", data.address_data?.district || "");
        setValue("address_data.division", data.address_data?.division || "");
        setValue("address_data.area_code", data.address_data?.area_code || "");
        setValue("address_data.address_line", data.address_data?.address_line || "");

        // Find and set Country/State/City IDs
        const countryId = countriesData?.find((c) => c.name === data.address_data?.country_name)?.id;
        const stateId = statesData?.find((s) => s.name === data.address_data?.state_name)?.id;
        const cityId = citiesData?.find((c) => c.name === data.address_data?.city_name)?.id;

        setValue("address_data.country", countryId || "");
        setValue("address_data.state", stateId || "");
        setValue("address_data.city", cityId || "");

      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to fetch staff details");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [id, type, setValue]);

  // ============ FETCH JAVA IMAGE WHEN USER ID CHANGES ============
  useEffect(() => {
    if (userId) {
      fetchJavaImage(userId);
    }

    return () => {
      cleanupBlobUrl(javaBlobUrlRef.current);
    };
  }, [userId, fetchJavaImage, cleanupBlobUrl]);

  // ============ IMAGE PRIORITY ============
  let profilePicUrl = null;
  if (javaImageUrl) {
    profilePicUrl = javaImageUrl;
  } else if (staffData?.user_profile) {
    profilePicUrl = staffData.user_profile.startsWith("http")
      ? staffData.user_profile
      : `${BASE_URL}${staffData.user_profile}`;
  }

  // ============ HANDLE IMAGE CHANGE ============
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImagePreview(e.target.files[0]);
      setRemoveImage(false);
    }
  };

  // ============ HANDLE REMOVE IMAGE ============
  const handleRemoveImage = () => {
    setImagePreview(null);
    setRemoveImage(true);
  };

  // ============ FORM SUBMIT (FIXED) ============
  // const onSubmit = async (formData) => {
  //   setSubmitting(true);
  //   setError(null);
  //   setFormErrors([]);

  //   const payload = new FormData();

  //   // Send user ID in payload
  //   payload.append("user", userId);

  //   // Append all basic fields (always append, even if empty)
  //   payload.append("first_name", formData.first_name || "");
  //   payload.append("middle_name", formData.middle_name || "");
  //   payload.append("last_name", formData.last_name || "");
  //   payload.append("email", formData.email || "");
  //   payload.append("phone_no", formData.phone_no || "");
  //   payload.append("gender", formData.gender || "");
  //   payload.append("aadhar_no", formData.aadhar_no || "");
  //   payload.append("pan_no", formData.pan_no || "");
  //   payload.append("qualification", formData.qualification || "");
  //   payload.append("joining_date", formData.joining_date || "");

  //   // Handle image upload/removal
  //   if (removeImage) {
  //     payload.append("user_profile", "");
  //   } else if (imagePreview && typeof imagePreview !== "string") {
  //     payload.append("user_profile", imagePreview);
  //   }

  //   // Get country/state/city names
  //   const countryId = formData.address_data?.country;
  //   const stateId = formData.address_data?.state;
  //   const cityId = formData.address_data?.city;

  //   const countryName = countries.find((c) =>
  //     c.id === countryId || c.id === parseInt(countryId) || String(c.id) === String(countryId)
  //   )?.name || "";

  //   const stateName = states.find((s) =>
  //     s.id === stateId || s.id === parseInt(stateId) || String(s.id) === String(stateId)
  //   )?.name || "";

  //   const cityName = cities.find((c) =>
  //     c.id === cityId || c.id === parseInt(cityId) || String(c.id) === String(cityId)
  //   )?.name || "";

  //   // Create nested objects
  //   const address_data = {
  //     house_no: formData.address_data?.house_no || "",
  //     habitation: formData.address_data?.habitation || "",
  //     ward_no: formData.address_data?.ward_no || "",
  //     zone_no: formData.address_data?.zone_no || "",
  //     block: formData.address_data?.block || "",
  //     district: formData.address_data?.district || "",
  //     division: formData.address_data?.division || "",
  //     area_code: formData.address_data?.area_code || "",
  //     address_line: formData.address_data?.address_line || "",
  //     country_name: countryName,
  //     state_name: stateName,
  //     city_name: cityName,
  //   };

  //   const banking_data = {
  //     account_no: formData.banking_data?.account_no || "",
  //     ifsc_code: formData.banking_data?.ifsc_code || "",
  //     holder_name: formData.banking_data?.holder_name || "",
  //   };

  //   // Append nested objects as JSON strings
  //   payload.append("address_data", JSON.stringify(address_data));
  //   payload.append("banking_data", JSON.stringify(banking_data));

  //   // ✅ Debug: Log what's being sent
  //   console.log("=== PAYLOAD DEBUG ===");
  //   for (let [key, value] of payload.entries()) {
  //     if (key === 'user_profile' && value instanceof File) {
  //       console.log(`${key}: File - ${value.name}, Size: ${value.size}`);
  //     } else {
  //       console.log(`${key}:`, value);
  //     }
  //   }
  //   console.log("=== END DEBUG ===");

  //   try {
  //     const response = type === "teacher"
  //       ? await editTeachersdetails(userId, payload)
  //       : await editOfficeStaffdetails(userId, payload);

  //     if (response) {
  //       setUpdateModal(true);

  //       // Re-fetch updated data
  //       const updatedData = type === "teacher"
  //         ? await fetchTeachers(id)
  //         : await fetchOfficeStaff(id);

  //       setStaffData(updatedData);

  //       // Re-fetch Java image
  //       if (updatedData?.user) {
  //         await fetchJavaImage(updatedData.user);
  //       }

  //       setImagePreview(null);
  //       setRemoveImage(false);

  //       // Auto navigate after 2 seconds
  //       setTimeout(() => {
  //         navigate(`/staffDetail/${type}/${id}`);
  //       }, 2000);
  //     }
  //   } catch (err) {
  //     console.error("Update error:", err);

  //     let errorMessage = "Failed to update details. Please try again.";

  //     if (typeof err === 'object') {
  //       if (err.detail) {
  //         errorMessage = err.detail;
  //       } else if (err.message) {
  //         errorMessage = err.message;
  //       } else {
  //         const fieldErrors = Object.entries(err)
  //           .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(", ") : val}`)
  //           .join("; ");
  //         if (fieldErrors) errorMessage = fieldErrors;
  //       }
  //     }

  //     setFormErrors([errorMessage]);
  //     window.scrollTo({ top: 0, behavior: 'smooth' });
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };


  // ============ FORM SUBMIT (FIXED) ============
const onSubmit = async (formData) => {
  setSubmitting(true);
  setError(null);
  setFormErrors([]);

  const payload = new FormData();

  // Send user ID in payload
  payload.append("user", userId);

  // Append all basic fields
  payload.append("first_name", formData.first_name || "");
  payload.append("middle_name", formData.middle_name || "");
  payload.append("last_name", formData.last_name || "");
  payload.append("email", formData.email || "");
  payload.append("phone_no", formData.phone_no || "");
  payload.append("gender", formData.gender || "");
  payload.append("aadhar_no", formData.aadhar_no || "");
  payload.append("pan_no", formData.pan_no || "");
  payload.append("qualification", formData.qualification || "");
  payload.append("joining_date", formData.joining_date || "");

  // Handle image upload/removal
  if (removeImage) {
    payload.append("user_profile", "");
  } else if (imagePreview && typeof imagePreview !== "string") {
    payload.append("user_profile", imagePreview);
  }

  // Get country/state/city names
  const countryId = formData.address_data?.country;
  const stateId = formData.address_data?.state;
  const cityId = formData.address_data?.city;

  const countryName = countries.find((c) =>
    c.id === countryId || c.id === parseInt(countryId) || String(c.id) === String(countryId)
  )?.name || "";

  const stateName = states.find((s) =>
    s.id === stateId || s.id === parseInt(stateId) || String(s.id) === String(stateId)
  )?.name || "";

  const cityName = cities.find((c) =>
    c.id === cityId || c.id === parseInt(cityId) || String(c.id) === String(cityId)
  )?.name || "";

  // ✅ FIX: Flatten address_data fields (NOT JSON string)
  payload.append("address_data.house_no", formData.address_data?.house_no || "");
  payload.append("address_data.habitation", formData.address_data?.habitation || "");
  payload.append("address_data.ward_no", formData.address_data?.ward_no || "");
  payload.append("address_data.zone_no", formData.address_data?.zone_no || "");
  payload.append("address_data.block", formData.address_data?.block || "");
  payload.append("address_data.district", formData.address_data?.district || "");
  payload.append("address_data.division", formData.address_data?.division || "");
  payload.append("address_data.area_code", formData.address_data?.area_code || "");
  payload.append("address_data.address_line", formData.address_data?.address_line || "");
  payload.append("address_data.country_name", countryName);
  payload.append("address_data.state_name", stateName);
  payload.append("address_data.city_name", cityName);

  // ✅ FIX: Flatten banking_data fields (NOT JSON string)
  payload.append("banking_data.account_no", formData.banking_data?.account_no || "");
  payload.append("banking_data.ifsc_code", formData.banking_data?.ifsc_code || "");
  payload.append("banking_data.holder_name", formData.banking_data?.holder_name || "");

  // Debug: Log what's being sent
  console.log("=== PAYLOAD DEBUG ===");
  for (let [key, value] of payload.entries()) {
    if (key === 'user_profile' && value instanceof File) {
      console.log(`${key}: File - ${value.name}, Size: ${value.size}`);
    } else {
      console.log(`${key}:`, value);
    }
  }
  console.log("=== END DEBUG ===");

  try {
    const response = type === "teacher"
      ? await editTeachersdetails(userId, payload)
      : await editOfficeStaffdetails(userId, payload);

    if (response) {
      setUpdateModal(true);

      // Re-fetch updated data
      const updatedData = type === "teacher"
        ? await fetchTeachers(id)
        : await fetchOfficeStaff(id);

      setStaffData(updatedData);

      // Re-fetch Java image
      if (updatedData?.user) {
        await fetchJavaImage(updatedData.user);
      }

      setImagePreview(null);
      setRemoveImage(false);

      // Auto navigate after 2 seconds
      setTimeout(() => {
        navigate(`/staffDetail/${type}/${id}`);
      }, 2000);
    }
  } catch (err) {
    console.error("Update error:", err);

    let errorMessage = "Failed to update details. Please try again.";

    if (typeof err === 'object') {
      if (err.detail) {
        errorMessage = err.detail;
      } else if (err.message) {
        errorMessage = err.message;
      } else {
        const fieldErrors = Object.entries(err)
          .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(", ") : val}`)
          .join("; ");
        if (fieldErrors) errorMessage = fieldErrors;
      }
    }

    setFormErrors([errorMessage]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } finally {
    setSubmitting(false);
  }
};  

  // ============ LOADING STATE ============
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

  // ============ ERROR STATE ============
  if (error && !staffData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
        <i className="fa-solid fa-triangle-exclamation text-5xl text-red-400 mb-4"></i>
        <p className="text-lg text-red-400 font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn bgTheme text-white mt-4"
        >
          Retry
        </button>
      </div>
    );
  }

  const maxDate = new Date().toISOString().split("T")[0];

  // ============ MAIN UI ============
  return (
    <div className="mb-24 md:mb-10">
      <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow dark:shadow-gray-700">

          {/* Error Messages */}
          {formErrors.length > 0 && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <div className="flex items-start">
                <i className="fa-solid fa-triangle-exclamation mr-2 mt-1"></i>
                <div>
                  {formErrors.map((err, idx) => (
                    <p key={idx} className="text-sm">{err}</p>
                  ))}
                </div>
                <button
                  onClick={() => setFormErrors([])}
                  className="ml-auto text-red-700 hover:text-red-900"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>
          )}

          {/* Success Message */}
          {updateModal && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              <i className="fa-solid fa-check-circle mr-2"></i>
              <span>Profile updated successfully! Redirecting...</span>
            </div>
          )}

          {/* ========== PROFILE PICTURE SECTION ========== */}
          <div className="flex flex-col items-center mb-8">
            <div className="h-32 w-32 rounded-full bg-gray-100 dark:bg-gray-600 overflow-hidden shadow-md border-2 border-gray-300 mb-4">
              {imagePreview ? (
                <ImagePreviewFromFile file={imagePreview} />
              ) : profilePicUrl ? (
                <img
                  src={profilePicUrl}
                  alt="Profile"
                  className="h-full w-full object-cover"
                  onError={() => {
                    cleanupBlobUrl(javaBlobUrlRef.current);
                    javaBlobUrlRef.current = "";
                    setJavaImageUrl("");
                  }}
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-400">
                  <i className="fa-solid fa-user text-5xl"></i>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <label className="btn bgTheme text-white btn-sm cursor-pointer">
                <i className="fa-solid fa-camera mr-2"></i>
                {imagePreview || profilePicUrl ? "Change Photo" : "Upload Photo"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={submitting}
                />
              </label>

              {(imagePreview || profilePicUrl) && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="btn btn-sm btn-error text-white"
                  disabled={submitting}
                >
                  <i className="fa-solid fa-trash mr-2"></i>
                  Remove
                </button>
              )}
            </div>
          </div>

          {/* ========== TITLE ========== */}
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">
            {type?.toLowerCase() === "teacher" ? "Update Teacher Details" : "Update Staff Details"}
          </h1>

          {/* ========== FORM ========== */}
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* First Name */}
            <div className="flex flex-col">
              <label className="label text-gray-700 dark:text-gray-300">
                First Name <span className="text-error">*</span>
              </label>
              <input
                type="text"
                {...register("first_name", {
                  required: "First Name is required",
                  pattern: { value: validationRules.first_name.pattern, message: validationRules.first_name.message },
                })}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                disabled={submitting}
              />
              {errors.first_name && <span className="text-error text-sm mt-1">{errors.first_name.message}</span>}
            </div>

            {/* Middle Name */}
            <div className="flex flex-col">
              <label className="label text-gray-700 dark:text-gray-300">Middle Name</label>
              <input
                type="text"
                {...register("middle_name", {
                  pattern: { value: validationRules.middle_name.pattern, message: validationRules.middle_name.message },
                })}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                disabled={submitting}
              />
              {errors.middle_name && <span className="text-error text-sm mt-1">{errors.middle_name.message}</span>}
            </div>

            {/* Last Name */}
            <div className="flex flex-col">
              <label className="label text-gray-700 dark:text-gray-300">
                Last Name <span className="text-error">*</span>
              </label>
              <input
                type="text"
                {...register("last_name", {
                  required: "Last Name is required",
                  pattern: { value: validationRules.last_name.pattern, message: validationRules.last_name.message },
                })}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                disabled={submitting}
              />
              {errors.last_name && <span className="text-error text-sm mt-1">{errors.last_name.message}</span>}
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="label text-gray-700 dark:text-gray-300">
                Email <span className="text-error">*</span>
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: validationRules.email.pattern, message: validationRules.email.message },
                })}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                disabled={submitting}
              />
              {errors.email && <span className="text-error text-sm mt-1">{errors.email.message}</span>}
            </div>

            {/* Phone No */}
            <div className="flex flex-col">
              <label className="label text-gray-700 dark:text-gray-300">
                Phone No <span className="text-error">*</span>
              </label>
              <input
                type="text"
                maxLength={10}
                {...register("phone_no", {
                  required: "Phone No is required",
                  pattern: { value: validationRules.phone_no.pattern, message: validationRules.phone_no.message },
                })}
                onKeyDown={(e) => {
                  if (!/[0-9]|Backspace|ArrowLeft|ArrowRight|Delete|Tab/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                disabled={submitting}
              />
              {errors.phone_no && <span className="text-error text-sm mt-1">{errors.phone_no.message}</span>}
            </div>

            {/* Gender */}
            <div className="flex flex-col">
              <label className="label text-gray-700 dark:text-gray-300">
                Gender <span className="text-error">*</span>
              </label>
              <select
                {...register("gender", { required: "Gender is required" })}
                className="select select-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                disabled={submitting}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.gender && <span className="text-error text-sm mt-1">{errors.gender.message}</span>}
            </div>

            {/* Aadhaar No */}
            <div className="flex flex-col">
              <label className="label text-gray-700 dark:text-gray-300">
                Aadhaar No <span className="text-error">*</span>
              </label>
              <input
                type="text"
                maxLength={12}
                {...register("aadhar_no", {
                  required: "Aadhaar No is required",
                  pattern: { value: validationRules.aadhar_no.pattern, message: validationRules.aadhar_no.message },
                })}
                onKeyDown={(e) => {
                  if (!/[0-9]|Backspace|ArrowLeft|ArrowRight|Delete|Tab/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                disabled={submitting}
              />
              {errors.aadhar_no && <span className="text-error text-sm mt-1">{errors.aadhar_no.message}</span>}
            </div>

            {/* PAN No */}
            <div className="flex flex-col">
              <label className="label text-gray-700 dark:text-gray-300">
                PAN No <span className="text-error">*</span>
              </label>
              <input
                type="text"
                maxLength={10}
                {...register("pan_no", {
                  required: "PAN No is required",
                  pattern: { value: validationRules.pan_no.pattern, message: validationRules.pan_no.message },
                })}
                onInput={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                }}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                disabled={submitting}
              />
              {errors.pan_no && <span className="text-error text-sm mt-1">{errors.pan_no.message}</span>}
            </div>

            {/* Qualification */}
            <div className="flex flex-col">
              <label className="label text-gray-700 dark:text-gray-300">
                Qualification <span className="text-error">*</span>
              </label>
              <input
                type="text"
                {...register("qualification", {
                  required: "Qualification is required",
                  pattern: { value: validationRules.qualification.pattern, message: validationRules.qualification.message },
                })}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                disabled={submitting}
              />
              {errors.qualification && <span className="text-error text-sm mt-1">{errors.qualification.message}</span>}
            </div>

            {/* Joining Date */}
            <div className="flex flex-col">
              <label className="label text-gray-700 dark:text-gray-300">
                Joining Date <span className="text-error">*</span>
              </label>
              <input
                type="date"
                max={maxDate}
                {...register("joining_date", { required: "Joining Date is required" })}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                disabled={submitting}
              />
              {errors.joining_date && <span className="text-error text-sm mt-1">{errors.joining_date.message}</span>}
            </div>

            {/* ========== BANKING DETAILS ========== */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800 dark:text-gray-100">Banking Details</h3>
              <hr className="mb-4 dark:border-gray-600" />
            </div>

            {/* Account No */}
            <div className="flex flex-col">
              <label className="label text-gray-700 dark:text-gray-300">
                Account No <span className="text-error">*</span>
              </label>
              <input
                type="text"
                maxLength={18}
                {...register("banking_data.account_no", {
                  required: "Account No is required",
                  pattern: { value: validationRules.account_no.pattern, message: validationRules.account_no.message },
                })}
                onKeyDown={(e) => {
                  if (!/[0-9]|Backspace|ArrowLeft|ArrowRight|Delete|Tab/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                disabled={submitting}
              />
              {errors.banking_data?.account_no && <span className="text-error text-sm mt-1">{errors.banking_data.account_no.message}</span>}
            </div>

            {/* IFSC Code */}
            <div className="flex flex-col">
              <label className="label text-gray-700 dark:text-gray-300">
                IFSC Code <span className="text-error">*</span>
              </label>
              <input
                type="text"
                maxLength={11}
                {...register("banking_data.ifsc_code", {
                  required: "IFSC Code is required",
                  pattern: { value: validationRules.ifsc_code.pattern, message: validationRules.ifsc_code.message },
                })}
                onInput={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                }}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                disabled={submitting}
              />
              {errors.banking_data?.ifsc_code && <span className="text-error text-sm mt-1">{errors.banking_data.ifsc_code.message}</span>}
            </div>

            {/* Holder Name */}
            <div className="flex flex-col">
              <label className="label text-gray-700 dark:text-gray-300">
                Holder Name <span className="text-error">*</span>
              </label>
              <input
                type="text"
                {...register("banking_data.holder_name", {
                  required: "Holder Name is required",
                  pattern: { value: validationRules.holder_name.pattern, message: validationRules.holder_name.message },
                })}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                disabled={submitting}
              />
              {errors.banking_data?.holder_name && <span className="text-error text-sm mt-1">{errors.banking_data.holder_name.message}</span>}
            </div>

            {/* ========== ADDRESS DETAILS ========== */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800 dark:text-gray-100">Address Details</h3>
              <hr className="mb-4 dark:border-gray-600" />
            </div>

            {/* House No */}
            <div className="flex flex-col">
              <label className="label text-gray-700 dark:text-gray-300">House No</label>
              <input
                type="text"
                {...register("address_data.house_no")}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                disabled={submitting}
              />
            </div>

            {/* Habitation */}
            <div className="flex flex-col">
              <label className="label text-gray-700 dark:text-gray-300">Habitation</label>
              <input
                type="text"
                {...register("address_data.habitation")}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                disabled={submitting}
              />
            </div>

            {/* Ward No */}
            <div className="flex flex-col">
              <label className="label text-gray-700 dark:text-gray-300">Ward No</label>
              <input
                type="text"
                {...register("address_data.ward_no")}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                disabled={submitting}
              />
            </div>

            {/* Zone No */}
            <div className="flex flex-col">
              <label className="label text-gray-700 dark:text-gray-300">Zone No</label>
              <input
                type="text"
                {...register("address_data.zone_no")}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                disabled={submitting}
              />
            </div>

            {/* Block */}
            <div className="flex flex-col">
              <label className="label text-gray-700 dark:text-gray-300">Block</label>
              <input
                type="text"
                {...register("address_data.block")}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                disabled={submitting}
              />
            </div>

            {/* District */}
            <div className="flex flex-col">
              <label className="label text-gray-700 dark:text-gray-300">District</label>
              <input
                type="text"
                {...register("address_data.district")}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                disabled={submitting}
              />
            </div>

            {/* Division */}
            <div className="flex flex-col">
              <label className="label text-gray-700 dark:text-gray-300">Division</label>
              <input
                type="text"
                {...register("address_data.division")}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                disabled={submitting}
              />
            </div>

            {/* Area Code */}
            <div className="flex flex-col">
              <label className="label text-gray-700 dark:text-gray-300">
                Area Code <span className="text-error">*</span>
              </label>
              <input
                type="text"
                maxLength={10}
                {...register("address_data.area_code", {
                  required: "Area Code is required",
                  pattern: { value: validationRules.area_code.pattern, message: validationRules.area_code.message },
                })}
                onKeyDown={(e) => {
                  if (!/[0-9]|Backspace|ArrowLeft|ArrowRight|Delete|Tab/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                disabled={submitting}
              />
              {errors.address_data?.area_code && <span className="text-error text-sm mt-1">{errors.address_data.area_code.message}</span>}
            </div>

            {/* Address Line */}
            <div className="flex flex-col">
              <label className="label text-gray-700 dark:text-gray-300">
                Address Line <span className="text-error">*</span>
              </label>
              <input
                type="text"
                {...register("address_data.address_line", {
                  required: "Address Line is required",
                })}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                disabled={submitting}
              />
              {errors.address_data?.address_line && <span className="text-error text-sm mt-1">{errors.address_data.address_line.message}</span>}
            </div>

            {/* Country */}
            <div className="flex flex-col">
              <label className="label text-gray-700 dark:text-gray-300">
                Country <span className="text-error">*</span>
              </label>
              <select
                {...register("address_data.country", { required: "Country is required" })}
                className="select select-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                disabled={submitting}
              >
                <option value="">Select Country</option>
                {countries
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
              </select>
              {errors.address_data?.country && <span className="text-error text-sm mt-1">{errors.address_data.country.message}</span>}
            </div>

            {/* State */}
            <div className="flex flex-col">
              <label className="label text-gray-700 dark:text-gray-300">
                State <span className="text-error">*</span>
              </label>
              <select
                {...register("address_data.state", { required: "State is required" })}
                className="select select-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                disabled={submitting}
              >
                <option value="">Select State</option>
                {states
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
              </select>
              {errors.address_data?.state && <span className="text-error text-sm mt-1">{errors.address_data.state.message}</span>}
            </div>

            {/* City */}
            <div className="flex flex-col">
              <label className="label text-gray-700 dark:text-gray-300">
                City <span className="text-error">*</span>
              </label>
              <select
                {...register("address_data.city", { required: "City is required" })}
                className="select select-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                disabled={submitting}
              >
                <option value="">Select City</option>
                {cities
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
              </select>
              {errors.address_data?.city && <span className="text-error text-sm mt-1">{errors.address_data.city.message}</span>}
            </div>

            {/* Submit Button */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-6 flex justify-center">
              <button
                type="submit"
                className="btn bgTheme text-white w-52"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm mr-2"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-floppy-disk mr-2"></i>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ============ HELPER COMPONENT FOR IMAGE PREVIEW ============
const ImagePreviewFromFile = ({ file }) => {
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!previewUrl) return null;

  return <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />;
};

export default UpdateStaffDetails;