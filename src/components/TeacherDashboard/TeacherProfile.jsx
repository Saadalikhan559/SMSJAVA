// import React, { useState, useEffect, useContext } from "react";
// import { useForm } from "react-hook-form";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faUser,
//   faSignature,
//   faEnvelope,
//   faPhone,
//   faVenusMars,
//   faCamera,
//   faIdCard,
//   faGraduationCap,
//   faCalendarDay,
// } from "@fortawesome/free-solid-svg-icons";
// import { constants } from "../../global/constants";
// import { AuthContext } from "../../context/AuthContext";

// const TeacherProfile = () => {
//   const { axiosInstance } = useContext(AuthContext);

//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [profileData, setProfileData] = useState(null);
//   const [removeImage, setRemoveImage] = useState(false);

//   const BASE_URL = constants.baseUrl;

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm({ mode: "onChange" });

//   useEffect(() => {
//     const fetchTeacherData = async () => {
//       try {
//         setLoading(true);
//         const response = await axiosInstance.get(
//           `/t/teacher/teacher_my_profile/`
//         );
//         setProfileData(response.data);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching teacher data:", err);
//         setError(err.response?.data?.detail || err.message);
//         setLoading(false);
//       }
//     };

//     fetchTeacherData();
//   }, [axiosInstance]);

//   const onSubmit = async (data) => {
//     try {
//       const formData = new FormData();
//       formData.append("first_name", data.first_name);
//       formData.append("last_name", data.last_name);
//       formData.append("email", data.email);
//       formData.append("phone_no", data.phone_no);
//       formData.append("gender", data.gender);
//       formData.append("aadhar_no", data.aadhar_no);
//       formData.append("pan_no", data.pan_no);
//       formData.append("qualification", data.qualification);
//       formData.append("middle_name", data.middle_name || "");

//       if (removeImage) {
//         formData.append("user_profile", "");
//       } else if (imagePreview && typeof imagePreview !== "string") {
//         formData.append("user_profile", imagePreview);
//       }
//       if (imagePreview && typeof imagePreview !== "string") {
//         formData.append("user_profile", imagePreview);
//       }

//       const response = await axiosInstance.put(
//         `/t/teacher/teacher_my_profile/`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       setProfileData(response.data);
//       setIsDialogOpen(false);
//       setImagePreview(null);
//       window.location.reload();
//     } catch (err) {
//       console.error("Error updating teacher data:", err);
//       setError(err.message);
//     }
//   };

//   const handleEditClick = () => {
//     reset(profileData);
//     setIsDialogOpen(true);
//     if (profileData?.user_profile) {
//       setImagePreview(`${BASE_URL}${profileData.user_profile}`);
//     }
//   };

//   const handleRemoveImage = () => {
//     setImagePreview(null);
//     setRemoveImage(true);
//   };

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

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
//         <i className="fa-solid fa-triangle-exclamation text-5xl text-red-400 mb-4"></i>
//         <p className="text-lg text-red-400 font-medium">Failed to load data, Try Again</p>
//       </div>
//     );
//   }


//   if (!profileData) {
//     return (
//       <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md shadow-top-bottom overflow-hidden px-4 sm:px-6 lg:px-8 py-8 m-2.5">
//         <div className="text-center text-gray-500">
//           <p>No profile data available</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
//       <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md shadow-top-bottom overflow-hidden px-4 sm:px-6 lg:px-8 py-8 m-2.5">
//         {/* Header with image and titles */}
//         <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-8">
//           {/* Profile Image */}
//           <div className="flex-shrink-0">
//             <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
//               {profileData.user_profile ? (
//                 <img
//                   src={
//                     profileData.user_profile
//                       ? `${BASE_URL}${profileData.user_profile}`
//                       : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
//                   }
//                   alt="Profile"
//                   className="h-full w-full object-cover"
//                 />
//               ) : (
//                 <FontAwesomeIcon
//                   icon={faUser}
//                   className="h-12 w-12 text-gray-400"
//                 />
//               )}
//             </div>
//           </div>

//           {/* Title and Subtitle */}
//           <div className="text-center md:text-left">
//             <h1 className="text-xl sm:text-2xl font-bold textTheme uppercase">
//               Teacher Profile
//             </h1>
//             <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
//               Manage your account information and settings
//             </p>
//           </div>
//         </div>

//         <div className="border-t border-gray-200 pt-6">
//           {/* Grid container */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Column 1 */}
//             <div className="space-y-6">
//               <div className="flex flex-col gap-1">
//                 <label className="text-sm font-semibold text-gray-500">
//                   <FontAwesomeIcon icon={faUser} className="w-4 h-4 mr-2" />
//                   First Name
//                 </label>
//                 <input
//                   type="text"
//                   value={profileData.first_name || "Not provided"}
//                   className="input input-bordered w-full text-sm"
//                   readOnly
//                 />
//               </div>

//               <div className="flex flex-col gap-1">
//                 <label className="text-sm font-semibold text-gray-500">
//                   <FontAwesomeIcon icon={faSignature} className="w-4 h-4 mr-2" />
//                   Middle Name
//                 </label>
//                 <input
//                   type="text"
//                   value={profileData.middle_name || "Not provided"}
//                   className="input input-bordered w-full text-sm"
//                   readOnly
//                 />
//               </div>

//               <div className="flex flex-col gap-1">
//                 <label className="text-sm font-semibold text-gray-500">
//                   <FontAwesomeIcon icon={faSignature} className="w-4 h-4 mr-2" />
//                   Last Name
//                 </label>
//                 <input
//                   type="text"
//                   value={profileData.last_name || "Not provided"}
//                   className="input input-bordered w-full text-sm"
//                   readOnly
//                 />
//               </div>

//               <div className="flex flex-col gap-1">
//                 <label className="text-sm font-semibold text-gray-500">
//                   <FontAwesomeIcon icon={faVenusMars} className="w-4 h-4 mr-2" />
//                   Gender
//                 </label>
//                 <input
//                   type="text"
//                   value={profileData.gender || "Not provided"}
//                   className="input input-bordered w-full text-sm"
//                   readOnly
//                 />
//               </div>


//             </div>

//             {/* Column 2 */}
//             <div className="space-y-6">
//               <div className="flex flex-col gap-1">
//                 <label className="text-sm font-semibold text-gray-500">
//                   <FontAwesomeIcon icon={faPhone} className="w-4 h-4 mr-2" />
//                   Phone Number
//                 </label>
//                 <input
//                   type="text"
//                   value={profileData.phone_no || "Not provided"}
//                   className="input input-bordered w-full text-sm"
//                   readOnly
//                 />
//               </div>
//               <div className="flex flex-col gap-1">
//                 <label className="text-sm font-semibold text-gray-500">
//                   <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 mr-2" />
//                   Email
//                 </label>
//                 <input
//                   type="text"
//                   value={profileData.email || "Not provided"}
//                   className="input input-bordered w-full text-sm"
//                   readOnly
//                 />
//               </div>


//               <div className="flex flex-col gap-1">
//                 <label className="text-sm font-semibold text-gray-500">
//                   <FontAwesomeIcon icon={faIdCard} className="w-4 h-4 mr-2" />
//                   Aadhaar Number
//                 </label>
//                 <input
//                   type="text"
//                   value={profileData.aadhar_no || "Not provided"}
//                   className="input input-bordered w-full text-sm"
//                   readOnly
//                 />
//               </div>

//               <div className="flex flex-col gap-1">
//                 <label className="text-sm font-semibold text-gray-500">
//                   <FontAwesomeIcon icon={faIdCard} className="w-4 h-4 mr-2" />
//                   PAN Number
//                 </label>
//                 <input
//                   type="text"
//                   value={profileData.pan_no || "Not provided"}
//                   className="input input-bordered w-full text-sm"
//                   readOnly
//                 />
//               </div>

//               <div className="flex flex-col gap-1">
//                 <label className="text-sm font-semibold text-gray-500">
//                   <FontAwesomeIcon
//                     icon={faGraduationCap}
//                     className="w-4 h-4 mr-2"
//                   />
//                   Qualification
//                 </label>
//                 <input
//                   type="text"
//                   value={profileData.qualification || "Not provided"}
//                   className="input input-bordered w-full text-sm"
//                   readOnly
//                 />
//               </div>

//               {profileData.date_joined && (
//                 <div className="flex flex-col gap-1">
//                   <label className="text-sm font-semibold text-gray-500">
//                     <FontAwesomeIcon
//                       icon={faCalendarDay}
//                       className="w-4 h-4 mr-2"
//                     />
//                     Date Joined
//                   </label>
//                   <input
//                     type="text"
//                     value={profileData.date_joined}
//                     className="input input-bordered w-full text-sm"
//                     readOnly
//                   />
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Buttons section */}
//           <div className="flex justify-end gap-4 mt-8">
//             <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
//               Cancel
//             </button>
//             <button
//               onClick={handleEditClick}
//               className="btn bgTheme text-white"
//             >
//               <i className="fa-solid fa-pen-to-square"></i> Update
//             </button>
//           </div>
//         </div>

//         {/* Dialog Box */}
//         {isDialogOpen && (
//           <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//               <div className="p-6">
//                 <h2 className="text-xl font-bold text-[#167bff] dark:text-blue-400 mb-4">
//                   Update Teacher Profile
//                 </h2>

//                 <form onSubmit={handleSubmit(onSubmit)}>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                     {/* Column 1 - Profile Image */}
//                     <div className="space-y-4">
//                       <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 border-b pb-2">
//                         Profile Image
//                       </h3>

//                       <div className="flex flex-col items-center space-y-4">
//                         <div className="relative group">
//                           <div className="h-32 w-32 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden shadow-md border-2 border-gray-300 dark:border-gray-600 hover:border-blue-400 transition-all duration-200">
//                             {imagePreview ? (
//                               typeof imagePreview === "string" ? (
//                                 <img
//                                   src={imagePreview}
//                                   alt="Profile Preview"
//                                   className="h-full w-full object-cover"
//                                 />
//                               ) : (
//                                 <img
//                                   src={URL.createObjectURL(imagePreview)}
//                                   alt="Profile Preview"
//                                   className="h-full w-full object-cover"
//                                 />
//                               )
//                             ) : (
//                               <div className="h-full w-full flex items-center justify-center text-gray-400 dark:text-gray-300 bg-gradient-to-br from-gray-100 dark:from-gray-700 to-gray-200 dark:to-gray-600">
//                                 <FontAwesomeIcon
//                                   icon={faUser}
//                                   size="3x"
//                                   className="opacity-70"
//                                 />
//                               </div>
//                             )}
//                           </div>
//                           <label className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer">
//                             <div className="bg-black bg-opacity-50 rounded-full p-2">
//                               <FontAwesomeIcon
//                                 icon={faCamera}
//                                 className="text-white text-lg"
//                               />
//                             </div>
//                             <input
//                               className="hidden"
//                               type="file"
//                               accept="image/*"
//                               onChange={(e) => {
//                                 if (e.target.files && e.target.files[0]) {
//                                   setImagePreview(e.target.files[0]);
//                                 }
//                               }}
//                             />
//                           </label>
//                         </div>

//                         <div className="flex gap-2">
//                           <label className="btn bgTheme text-white">
//                             <FontAwesomeIcon icon={faCamera} className="mr-2" />
//                             Photo
//                             <input
//                               className="hidden"
//                               type="file"
//                               accept="image/*"
//                               onChange={(e) => {
//                                 if (e.target.files && e.target.files[0]) {
//                                   setImagePreview(e.target.files[0]);
//                                 }
//                               }}
//                             />
//                           </label>
//                           {imagePreview && (
//                             <button
//                               type="button"
//                               onClick={handleRemoveImage}
//                               className="inline-flex items-center px-3 py-1 border border-red-300 dark:border-red-600 rounded-md shadow-sm text-sm font-medium text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900 hover:bg-red-100 dark:hover:bg-red-800"
//                             >
//                               <span className="mr-2">X</span>
//                               Remove
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     </div>

//                     {/* Column 2 - Personal Info */}
//                     <div className="space-y-4">
//                       <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 border-b pb-2">
//                         Personal Information
//                       </h3>

//                       {/* First Name */}
//                       <div className="flex flex-col gap-1">
//                         <label className="text-sm font-semibold text-gray-500 dark:text-gray-300">
//                           First Name
//                         </label>
//                         <input
//                           type="text"
//                           {...register("first_name", {
//                             required: "First name is required",
//                           })}
//                           className="input input-bordered w-full text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
//                         />
//                         {errors.first_name && (
//                           <p className="text-red-500 text-xs mt-1">
//                             {errors.first_name.message}
//                           </p>
//                         )}
//                       </div>

//                       {/* Middle Name */}
//                       <div className="flex flex-col gap-1">
//                         <label className="text-sm font-semibold text-gray-500 dark:text-gray-300">
//                           Middle Name
//                         </label>
//                         <input
//                           type="text"
//                           {...register("middle_name")}
//                           className="input input-bordered w-full text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
//                         />
//                       </div>

//                       {/* Last Name */}
//                       <div className="flex flex-col gap-1">
//                         <label className="text-sm font-semibold text-gray-500 dark:text-gray-300">
//                           Last Name
//                         </label>
//                         <input
//                           type="text"
//                           {...register("last_name", {
//                             required: "Last name is required",
//                           })}
//                           className="input input-bordered w-full text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
//                         />
//                         {errors.last_name && (
//                           <p className="text-red-500 text-xs mt-1">
//                             {errors.last_name.message}
//                           </p>
//                         )}
//                       </div>

//                       {/* Gender */}
//                       <div className="flex flex-col gap-1">
//                         <label className="text-sm font-semibold text-gray-500 dark:text-gray-300">
//                           Gender
//                         </label>
//                         <select
//                           {...register("gender", {
//                             required: "Gender is required",
//                           })}
//                           className="select select-bordered w-full text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
//                         >
//                           <option value="">Select Gender</option>
//                           <option value="Male">Male</option>
//                           <option value="Female">Female</option>
//                           <option value="Other">Other</option>
//                         </select>
//                         {errors.gender && (
//                           <p className="text-red-500 text-xs mt-1">
//                             {errors.gender.message}
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     {/* Column 3 - Contact & Professional Info */}
//                     <div className="space-y-4">
//                       <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 border-b pb-2">
//                         Contact Information
//                       </h3>

//                       {/* Email */}
//                       <div className="flex flex-col gap-1">
//                         <label className="text-sm font-semibold text-gray-500 dark:text-gray-300">
//                           Email
//                         </label>
//                         <input
//                           type="email"
//                           {...register("email", {
//                             required: "Email is required",
//                             pattern: {
//                               value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                               message: "Invalid email address",
//                             },
//                           })}
//                           className="input input-bordered w-full text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
//                         />
//                         {errors.email && (
//                           <p className="text-red-500 text-xs mt-1">
//                             {errors.email.message}
//                           </p>
//                         )}
//                       </div>

//                       {/* Phone */}
//                       <div className="flex flex-col gap-1">
//                         <label className="text-sm font-semibold text-gray-500 dark:text-gray-300">
//                           Phone Number
//                         </label>
//                         <input
//                           type="text"
//                           {...register("phone_no", {
//                             required: "Phone number is required",
//                             pattern: {
//                               value: /^[0-9]*$/,
//                               message: "Only numbers are allowed",
//                             },
//                           })}
//                           onInput={(e) => {
//                             e.target.value = e.target.value.replace(/[^0-9]/g, "");
//                             if (e.target.value.length > 10) {
//                               e.target.value = e.target.value.slice(0, 10);
//                             }
//                           }}
//                           className="input input-bordered w-full text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
//                         />
//                         {errors.phone_no && (
//                           <p className="text-red-500 text-xs mt-1">
//                             {errors.phone_no.message}
//                           </p>
//                         )}
//                       </div>

//                       {/* Professional Information */}
//                       <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 border-b pb-2 mt-4">
//                         Professional Information
//                       </h3>

//                       {/* Qualification */}
//                       <div className="flex flex-col gap-1">
//                         <label className="text-sm font-semibold text-gray-500 dark:text-gray-300">
//                           Qualification
//                         </label>
//                         <input
//                           type="text"
//                           {...register("qualification", {
//                             required: "Qualification is required",
//                           })}
//                           className="input input-bordered w-full text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
//                           disabled={true}
//                         />
//                         {errors.qualification && (
//                           <p className="text-red-500 text-xs mt-1">
//                             {errors.qualification.message}
//                           </p>
//                         )}
//                       </div>

//                       {/* Aadhaar */}
//                       <div className="flex flex-col gap-1">
//                         <label className="text-sm font-semibold text-gray-500 dark:text-gray-300">
//                           Aadhaar Number
//                         </label>
//                         <input
//                           type="text"
//                           {...register("aadhar_no", {
//                             required: "Aadhaar number is required",
//                           })}
//                           className="input input-bordered w-full text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
//                           disabled={true}
//                         />
//                         {errors.aadhar_no && (
//                           <p className="text-red-500 text-xs mt-1">
//                             {errors.aadhar_no.message}
//                           </p>
//                         )}
//                       </div>

//                       {/* PAN */}
//                       <div className="flex flex-col gap-1">
//                         <label className="text-sm font-semibold text-gray-500 dark:text-gray-300">
//                           PAN Number
//                         </label>
//                         <input
//                           type="text"
//                           {...register("pan_no", {
//                             required: "PAN number is required",
//                           })}
//                           className="input input-bordered w-full text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
//                           disabled={true}
//                         />
//                         {errors.pan_no && (
//                           <p className="text-red-500 text-xs mt-1">
//                             {errors.pan_no.message}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Buttons */}
//                   <div className="flex justify-end gap-4 mt-6">
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setIsDialogOpen(false);
//                         setImagePreview(null);
//                       }}
//                       className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       className="btn bgTheme text-white"
//                     >
//                       Save Changes
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TeacherProfile;


import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faSignature,
  faEnvelope,
  faPhone,
  faVenusMars,
  faCamera,
  faIdCard,
  faGraduationCap,
  faCalendarDay,
} from "@fortawesome/free-solid-svg-icons";
import { constants } from "../../global/constants";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const TeacherProfile = () => {
  const { axiosInstance } = useContext(AuthContext);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const [imagePreview, setImagePreview] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [javaImageUrl, setJavaImageUrl] = useState("");

  // Use ref to track blob URLs for cleanup (prevents stale closure issues)
  const javaBlobUrlRef = useRef("");

  const BASE_URL = constants.baseUrl;
  const JAVA_BASE_URL = constants.JAVA_BASE_URL;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  /* ================= CLEANUP BLOB URL HELPER ================= */
  const cleanupBlobUrl = useCallback((url) => {
    if (url && url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  }, []);

  /* ================= FETCH IMAGE (JAVA) ================= */
  // useCallback se wrap kiya taake stable reference rahe
  const fetchJavaImage = useCallback(async (userId) => {
    if (!userId) return;

    try {
      const res = await axios.get(
        `${JAVA_BASE_URL}/users/getUserImage/${userId}`
      );

      const imagePath = res.data?.imagePath;
      if (!imagePath) {
        // Cleanup previous blob before setting empty
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

      // Cleanup previous blob URL using ref (no stale closure)
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

  /* ================= FETCH PROFILE (DRF) ================= */
  const fetchTeacherData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(
        `/t/teacher/teacher_my_profile/`
      );
      setProfileData(response.data);
      return response.data;
    } catch (err) {
      console.error("Error fetching teacher data:", err);
      setError(err.response?.data?.detail || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [axiosInstance]);

  // Initial fetch on mount
  useEffect(() => {
    fetchTeacherData();
  }, [fetchTeacherData]);

  // Fetch Java image when profileData changes
  useEffect(() => {
    if (profileData?.user) {
      fetchJavaImage(profileData.user);
    }

    // Cleanup blob URL on unmount
    return () => {
      cleanupBlobUrl(javaBlobUrlRef.current);
    };
  }, [profileData?.user, fetchJavaImage, cleanupBlobUrl]);

  /* ================= IMAGE PRIORITY ================= */
  let profilePicUrl = null;

  if (javaImageUrl) {
    profilePicUrl = javaImageUrl;
  } else if (profileData?.user_profile) {
    profilePicUrl = `${BASE_URL}${profileData.user_profile}`;
  }

  /* ================= SET PREVIEW ONLY WHEN DIALOG OPENS ================= */
  useEffect(() => {
    if (!isDialogOpen) return;

    if (javaImageUrl) {
      setImagePreview(javaImageUrl);
    } else if (profileData?.user_profile) {
      setImagePreview(`${BASE_URL}${profileData.user_profile}`);
    } else {
      setImagePreview(null);
    }
  }, [isDialogOpen, javaImageUrl, profileData?.user_profile, BASE_URL]);

  /* ================= REMOVE IMAGE ================= */
  const handleRemoveImage = () => {
    setImagePreview(null);
    setRemoveImage(true);
  };

  /* ================= SUBMIT (DRF UPDATE) - COMMENTED OUT ================= */
  /*
  const onSubmit = async (data) => {
    setIsUpdating(true);
    setError(null);
    setSuccessMessage("");

    try {
      const formData = new FormData();
      formData.append("first_name", data.first_name);
      formData.append("last_name", data.last_name);
      formData.append("email", data.email);
      formData.append("phone_no", data.phone_no);
      formData.append("gender", data.gender);
      formData.append("aadhar_no", data.aadhar_no);
      formData.append("pan_no", data.pan_no);
      formData.append("qualification", data.qualification);
      formData.append("middle_name", data.middle_name || "");

      if (removeImage) {
        formData.append("user_profile", "");
      } else if (imagePreview && typeof imagePreview !== "string") {
        formData.append("user_profile", imagePreview);
      }

      const response = await axiosInstance.put(
        `/t/teacher/teacher_my_profile/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Close dialog FIRST
      setIsDialogOpen(false);
      setImagePreview(null);
      setRemoveImage(false);

      // Re-fetch the complete profile data from server
      const freshData = await fetchTeacherData();

      // If fresh fetch failed, use the response data as fallback
      if (!freshData && response.data) {
        setProfileData(response.data);
      }

      // Re-fetch Java image
      const userId = freshData?.user || response.data?.user;
      if (userId && !removeImage) {
        await fetchJavaImage(userId);
      } else if (removeImage) {
        cleanupBlobUrl(javaBlobUrlRef.current);
        javaBlobUrlRef.current = "";
        setJavaImageUrl("");
      }

      // Show success message
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);

    } catch (err) {
      console.error("Error updating teacher data:", err);
      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        (typeof err.response?.data === "object"
          ? Object.entries(err.response.data)
            .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(", ") : val}`)
            .join("; ")
          : "Update failed. Please try again.");
      setError(errorMsg);
    } finally {
      setIsUpdating(false);
    }
  };
  */

  /* ================= EDIT CLICK - COMMENTED OUT ================= */
  /*
  const handleEditClick = () => {
    setRemoveImage(false);
    setError(null);

    reset({
      first_name: profileData.first_name || "",
      middle_name: profileData.middle_name || "",
      last_name: profileData.last_name || "",
      email: profileData.email || "",
      phone_no: profileData.phone_no?.toString() || "",
      gender: profileData.gender || "",
      qualification: profileData.qualification || "",
      aadhar_no: profileData.aadhar_no || "",
      pan_no: profileData.pan_no || "",
    });

    setIsDialogOpen(true);
  };
  */

  /* ================= HANDLE DIALOG CLOSE ================= */
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setImagePreview(null);
    setRemoveImage(false);
    setError(null);
  };

  /* ================= LOADING ================= */
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

  /* ================= ERROR ================= */
  if (error && !profileData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
        <i className="fa-solid fa-triangle-exclamation text-5xl text-red-400 mb-4"></i>
        <p className="text-lg text-red-400 font-medium">Failed to load data, Try Again</p>
        <button
          onClick={() => window.location.reload()}
          className="btn bgTheme text-white mt-4"
        >
          Retry
        </button>
      </div>
    );
  }

  /* ================= NO DATA ================= */
  if (!profileData) {
    return (
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md shadow-top-bottom overflow-hidden px-4 sm:px-6 lg:px-8 py-8 m-2.5">
        <div className="text-center text-gray-500">
          <p>No profile data available</p>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen mb-24 md:mb-10">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md shadow-top-bottom overflow-hidden px-4 sm:px-6 lg:px-8 py-8 m-2.5">

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {successMessage}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Header with image and titles */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-8">
          {/* Profile Image - Now fetched from Java */}
          <div className="flex-shrink-0">
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
              {profilePicUrl ? (
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
                <FontAwesomeIcon
                  icon={faUser}
                  className="h-12 w-12 text-gray-400"
                />
              )}
            </div>
          </div>

          {/* Title and Subtitle */}
          <div className="text-center md:text-left">
            <h1 className="text-xl sm:text-2xl font-bold textTheme uppercase">
              Teacher Profile
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Manage your account information and settings
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          {/* Grid container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1 */}
            <div className="space-y-6">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-500 dark:text-gray-300">
                  <FontAwesomeIcon icon={faUser} className="w-4 h-4 mr-2" />
                  First Name
                </label>
                <input
                  type="text"
                  value={profileData.first_name || "Not provided"}
                  className="input input-bordered w-full text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  readOnly
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-500 dark:text-gray-300">
                  <FontAwesomeIcon icon={faSignature} className="w-4 h-4 mr-2" />
                  Middle Name
                </label>
                <input
                  type="text"
                  value={profileData.middle_name || "Not provided"}
                  className="input input-bordered w-full text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  readOnly
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-500 dark:text-gray-300">
                  <FontAwesomeIcon icon={faSignature} className="w-4 h-4 mr-2" />
                  Last Name
                </label>
                <input
                  type="text"
                  value={profileData.last_name || "Not provided"}
                  className="input input-bordered w-full text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  readOnly
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-500 dark:text-gray-300">
                  <FontAwesomeIcon icon={faVenusMars} className="w-4 h-4 mr-2" />
                  Gender
                </label>
                <input
                  type="text"
                  value={profileData.gender || "Not provided"}
                  className="input input-bordered w-full text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  readOnly
                />
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-6">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-500 dark:text-gray-300">
                  <FontAwesomeIcon icon={faPhone} className="w-4 h-4 mr-2" />
                  Phone Number
                </label>
                <input
                  type="text"
                  value={profileData.phone_no || "Not provided"}
                  className="input input-bordered w-full text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  readOnly
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-500 dark:text-gray-300">
                  <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 mr-2" />
                  Email
                </label>
                <input
                  type="text"
                  value={profileData.email || "Not provided"}
                  className="input input-bordered w-full text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  readOnly
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-500 dark:text-gray-300">
                  <FontAwesomeIcon icon={faIdCard} className="w-4 h-4 mr-2" />
                  Aadhaar Number
                </label>
                <input
                  type="text"
                  value={profileData.aadhar_no || "Not provided"}
                  className="input input-bordered w-full text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  readOnly
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-500 dark:text-gray-300">
                  <FontAwesomeIcon icon={faIdCard} className="w-4 h-4 mr-2" />
                  PAN Number
                </label>
                <input
                  type="text"
                  value={profileData.pan_no || "Not provided"}
                  className="input input-bordered w-full text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  readOnly
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-500 dark:text-gray-300">
                  <FontAwesomeIcon
                    icon={faGraduationCap}
                    className="w-4 h-4 mr-2"
                  />
                  Qualification
                </label>
                <input
                  type="text"
                  value={profileData.qualification || "Not provided"}
                  className="input input-bordered w-full text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  readOnly
                />
              </div>

              {profileData.date_joined && (
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-500 dark:text-gray-300">
                    <FontAwesomeIcon
                      icon={faCalendarDay}
                      className="w-4 h-4 mr-2"
                    />
                    Date Joined
                  </label>
                  <input
                    type="text"
                    value={profileData.date_joined}
                    className="input input-bordered w-full text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    readOnly
                  />
                </div>
              )}
            </div>
          </div>

          {/* Buttons section */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => window.history.back()}
            >
              Cancel
            </button>
            {/* Update button - Commented out for now */}
            {/*
            <button
              onClick={handleEditClick}
              className="btn bgTheme text-white"
            >
              <i className="fa-solid fa-pen-to-square"></i> Update
            </button>
            */}
          </div>
        </div>

        {/* Dialog Box - Commented out for now */}
        {/*
        {isDialogOpen && (
          <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold text-[#167bff] dark:text-blue-400 mb-4">
                  Update Teacher Profile
                </h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                  ... Dialog content ...
                </form>
              </div>
            </div>
          </div>
        )}
        */}
      </div>
    </div>
  );
};

/* ================= HELPER COMPONENT ================= */
// Separate component to handle File object preview with proper cleanup
const ImagePreviewFromFile = ({ file }) => {
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Cleanup blob URL when component unmounts or file changes
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!previewUrl) return null;

  return (
    <img
      src={previewUrl}
      alt="Profile Preview"
      className="h-full w-full object-cover"
    />
  );
};

export default TeacherProfile;