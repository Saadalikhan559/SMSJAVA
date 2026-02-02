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
//   faCalendarDay,
// } from "@fortawesome/free-solid-svg-icons";
// import { constants } from "../../global/constants";
// import { AuthContext } from "../../context/AuthContext";

// const DirectorProfile = () => {
//   const { axiosInstance } = useContext(AuthContext);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [profileData, setProfileData] = useState(null);
//   const [directorFullName, setDirectorFullName] = useState("");
//   const [removeImage, setRemoveImage] = useState(false);

//   const BASE_URL = constants.baseUrl;

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm();

//   // Remove button handler
//   const handleRemoveImage = () => {
//     setImagePreview(null);
//     setRemoveImage(true);
//   };

//   useEffect(() => {
//     const fetchDirectorData = async () => {
//       try {
//         setLoading(true);
//         const response = await axiosInstance.get(
//           `/d/director/director_my_profile/`
//         );

//         const data = response.data;
//         const fullName = `${data.first_name} ${data.middle_name} ${data.last_name}`;

//         localStorage.setItem("user_name", fullName);
//         setDirectorFullName(fullName);

//         setProfileData(data);
//       } catch (err) {
//         console.error("Error fetching director data:", err);
//         setError(err.message || "Failed to fetch director data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDirectorData();
//   }, [axiosInstance]);

//   const onSubmit = async (data) => {
//     try {
//       const formData = new FormData();

//       // Append all fields from the form
//       formData.append("user", profileData.user); 
//       formData.append("first_name", data.first_name);
//       formData.append("middle_name", data.middle_name || "");
//       formData.append("last_name", data.last_name);
//       formData.append("email", data.email);
//       formData.append("phone_no", data.phone_no);
//       formData.append("gender", data.gender);
//       formData.append("qualification", data.qualification || "");
// formData.append("aadhar_no", data.aadhar_no || "");
// formData.append("pan_no", data.pan_no || "");


//       // if (removeImage) {
//       //   formData.append("user_profile", "");
//       // } else if (imagePreview && typeof imagePreview !== "string") {
//       //   formData.append("user_profile", imagePreview);
//       // }

//       if (removeImage) {
//   formData.append("user_profile", "");
// } else if (imagePreview && typeof imagePreview !== "string") {
//   formData.append("user_profile", imagePreview);
// }


//       const response = await axiosInstance.put(
//         `/d/director/director_my_profile/`,
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
//       console.error("Error updating director data:", err);
//       setError(err.response?.data?.message || err.message);
//     }
//   };

//   // const handleEditClick = () => {
//   //   reset(profileData);
//   //   setIsDialogOpen(true);
//   //   if (profileData?.user_profile) {
//   //     setImagePreview(`${BASE_URL}${profileData.user_profile}`);
//   //   }
//   // };

//   const handleEditClick = () => {
//   // reset({
//   //   ...profileData,
//   //   phone_no: profileData.phone_no?.toString() || "",
//   // });
//   reset({
//   ...profileData,
//   phone_no: profileData.phone_no?.toString() || "",
//   qualification: profileData.qualification || "",
//   aadhar_no: profileData.aadhar_no || "",
//   pan_no: profileData.pan_no || "",
// });

//   setIsDialogOpen(true);
//   if (profileData?.user_profile) {
//     setImagePreview(`${BASE_URL}${profileData.user_profile}`);
//   }
// };


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
//         <p className="text-lg text-red-400 font-medium">
//           Failed to load data, Try Again
//         </p>
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
//     <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen mb-24 md:mb-10">
//       <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden px-4 sm:px-6 lg:px-8 py-8 m-2.5">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-8">
//           {/* Profile Image */}
//           <div className="flex-shrink-0">
//             <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
//               {profileData.user_profile ? (
//                 <img
//                   src={`${BASE_URL}${profileData.user_profile}`}
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
//             <h1 className="text-2xl font-bold textTheme uppercase">
//               Director Profile
//             </h1>
//             <p className="text-gray-600 dark:text-gray-300">
//               Manage your account information and settings
//             </p>
//           </div>
//         </div>

//         {/* Profile Info */}
//         <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Column 1 */}
//             <div className="space-y-6">
//               {[
//                 {
//                   label: "First Name",
//                   icon: faUser,
//                   value: profileData.first_name,
//                 },
//                 {
//                   label: "Last Name",
//                   icon: faSignature,
//                   value: profileData.last_name,
//                 },
//                 {
//                   label: "Phone Number",
//                   icon: faPhone,
//                   value: profileData.phone_no,
//                 },
//               ].map(({ label, icon, value }, idx) => (
//                 <div key={idx} className="flex flex-col gap-1">
//                   <label className="text-sm font-semibold text-gray-500 dark:text-gray-300">
//                     <FontAwesomeIcon icon={icon} className="w-4 h-4 mr-2" />
//                     {label}
//                   </label>
//                   <input
//                     type="text"
//                     value={value || "Not provided"}
//                     className="input input-bordered w-full text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
//                     readOnly
//                   />
//                 </div>
//               ))}
//             </div>

//             {/* Column 2 */}
//             <div className="space-y-6">
//               {[
//                 {
//                   label: "Middle Name",
//                   icon: faSignature,
//                   value: profileData.middle_name,
//                 },
//                 { label: "Email", icon: faEnvelope, value: profileData.email },
//                 {
//                   label: "Gender",
//                   icon: faVenusMars,
//                   value: profileData.gender,
//                 },
//                 {
//                   label: "Date Joined",
//                   icon: faCalendarDay,
//                   value: profileData.date_joined,
//                 },
//               ].map(
//                 ({ label, icon, value }, idx) =>
//                   value && (
//                     <div key={idx} className="flex flex-col gap-1">
//                       <label className="text-sm font-semibold text-gray-500 dark:text-gray-300">
//                         <FontAwesomeIcon icon={icon} className="w-4 h-4 mr-2" />
//                         {label}
//                       </label>
//                       <input
//                         type="text"
//                         value={value}
//                         className="input input-bordered w-full text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
//                         readOnly
//                       />
//                     </div>
//                   )
//               )}
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex justify-end gap-4 mt-8">
//             <button
//               className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
//               onClick={() => window.history.back()}
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleEditClick}
//               className="btn bgTheme text-white"
//             >
//               <i class="fa-solid fa-pen-to-square"></i>
//               Update
//             </button>
//           </div>
//         </div>

//         {/* Dialog */}
//         {isDialogOpen && (
//           <div className="fixed inset-0  bg-opacity-30 dark:bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//               <div className="p-6">
//                 <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
//                   Update Director Profile
//                 </h2>

//                 <form onSubmit={handleSubmit(onSubmit)}>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {/* Column 1 - Profile Image */}
//                     <div className="space-y-4">
//                       <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 border-b pb-2 border-gray-200 dark:border-gray-700">
//                         Profile Image
//                       </h3>

//                       <div className="flex flex-col items-center space-y-4">
//                         <div className="relative group">
//                           <div className="h-32 w-32 rounded-full bg-gray-100 dark:bg-gray-600 overflow-hidden shadow-md border-2 border-gray-300 dark:border-gray-500 hover:border-blue-400 transition-all duration-200">
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
//                               <div className="h-full w-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
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
//                             Change
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
//                               className="inline-flex items-center px-3 py-1 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900 hover:bg-red-100 dark:hover:bg-red-800"
//                             >
//                               <span className="mr-2">X</span>Remove
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     </div>

//                     {/* Column 2 - Form Fields */}
//                     <div className="space-y-4">
//                       <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 border-b pb-2 border-gray-200 dark:border-gray-700">
//                         Personal Information
//                       </h3>

//                       {/* Input fields */}
//                       {[
//                         {
//                           name: "first_name",
//                           label: "First Name",
//                           required: true,
//                         },
//                         { name: "middle_name", label: "Middle Name" },
//                         {
//                           name: "last_name",
//                           label: "Last Name",
//                           required: true,
//                         },
//                         {
//                           name: "email",
//                           label: "Email",
//                           type: "email",
//                           required: true,
//                         },
//                         {
//                           name: "phone_no",
//                           label: "Phone Number",
//                           type: "text",
//                           required: true,
//                         },
//                       ].map((field) => (
//                         <div key={field.name} className="flex flex-col gap-1">
//                           <label className="text-sm font-semibold text-gray-500 dark:text-gray-400">
//                             {field.label}
//                           </label>

//                           <input
//                             type={field.type || "text"}
//                             {...register(field.name, {
//                               required: field.required
//                                 ? `${field.label} is required`
//                                 : false,

//                               // Apply validation rules based on field type
//                               ...(field.name === "phone_no"
//                                 ? {
//                                     pattern: {
//                                       value: /^\+?[0-9]{10}$/,
//                                       message:
//                                         "Phone number must be exactly 10 digits",
//                                     },
//                                   }
//                                 : [
//                                     "first_name",
//                                     "middle_name",
//                                     "last_name",
//                                   ].includes(field.name)
//                                 ? {
//                                     maxLength: {
//                                       value: 20,
//                                       message: `${field.label} cannot exceed 20 characters`,
//                                     },
//                                     pattern: {
//                                       value: /^[A-Za-z\s]*$/,
//                                       message: `${field.label} should only contain letters`,
//                                     },
//                                   }
//                                 : field.name === "email"
//                                 ? {
//                                     maxLength: {
//                                       value: 40,
//                                       message:
//                                         "Email cannot exceed 40 characters",
//                                     },
//                                     pattern: {
//                                       value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//                                       message:
//                                         "Please enter a valid email address",
//                                     },
//                                   }
//                                 : {}),
//                             })}
//                             // Input restrictions
//                             onInput={(e) => {
//                               if (
//                                 field.name === "phone_no" &&
//                                 e.target.value.length > 10
//                               ) {
//                                 e.target.value = e.target.value.slice(0, 10);
//                               }

//                               if (
//                                 [
//                                   "first_name",
//                                   "middle_name",
//                                   "last_name",
//                                 ].includes(field.name) &&
//                                 e.target.value.length > 50
//                               ) {
//                                 e.target.value = e.target.value.slice(0, 50);
//                               }

//                               if (
//                                 field.name === "email" &&
//                                 e.target.value.length > 100
//                               ) {
//                                 e.target.value = e.target.value.slice(0, 100);
//                               }
//                             }}
//                             onKeyDown={(e) => {
//                               // Allow only digits for phone_no
//                               if (
//                                 field.name === "phone_no" &&
//                                 !/[0-9]|Backspace|ArrowLeft|ArrowRight|Delete|Tab/.test(
//                                   e.key
//                                 )
//                               ) {
//                                 e.preventDefault();
//                               }

//                               // Allow only letters & spaces for names
//                               if (
//                                 [
//                                   "first_name",
//                                   "middle_name",
//                                   "last_name",
//                                 ].includes(field.name) &&
//                                 !/[A-Za-z\s]|Backspace|ArrowLeft|ArrowRight|Delete|Tab/.test(
//                                   e.key
//                                 )
//                               ) {
//                                 e.preventDefault();
//                               }
//                             }}
//                             className="input input-bordered w-full text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
//                           />

//                           {errors[field.name] && (
//                             <p className="text-red-500 text-xs mt-1">
//                               {errors[field.name]?.message}
//                             </p>
//                           )}
//                         </div>
//                       ))}

//                       <div className="flex flex-col gap-1">
//                         <label className="text-sm font-semibold text-gray-500 dark:text-gray-400">
//                           Gender
//                         </label>
//                         <select
//                           {...register("gender", {
//                             required: "Gender is required",
//                           })}
//                           className="select select-bordered w-full text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
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
//                     <button type="submit" className="btn bgTheme text-white">
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

// export default DirectorProfile;



// import React, { useState, useEffect, useContext } from "react";
// import { useForm } from "react-hook-form";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faUser,
//   faCamera,
// } from "@fortawesome/free-solid-svg-icons";
// import { constants } from "../../global/constants";
// import { AuthContext } from "../../context/AuthContext";
// import axios from "axios";

// const DirectorProfile = () => {
//   const { axiosInstance } = useContext(AuthContext);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [imagePreview, setImagePreview] = useState(null);
//   const [userImageUrl, setUserImageUrl] = useState("");
//   const [imageLoading, setImageLoading] = useState(false);

//   const [profileData, setProfileData] = useState(null);

//   const BASE_URL = constants.baseUrl;
//   const JAVA_BASE_URL = constants.JAVA_BASE_URL;

//   const { register, handleSubmit, reset, formState: { errors } } = useForm();

//   /* ================= FETCH PROFILE ================= */
//   useEffect(() => {
//     const fetchDirectorData = async () => {
//       try {
//         setLoading(true);
//         const response = await axiosInstance.get(`/d/director/director_my_profile/`);
//         setProfileData(response.data);
//       } catch (err) {
//         setError("Failed to fetch director data");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDirectorData();
//   }, [axiosInstance]);

//   /* ================= 🔥 FETCH IMAGE (FIXED) ================= */
//   useEffect(() => {
//     if (!profileData?.user) return;

//     const fetchUserImage = async () => {
//       setImageLoading(true);

//       try {
//         // Get image path from API
//         const res = await axios.get(
//           `${JAVA_BASE_URL}/users/getUserImage/${profileData.user}`
//         );

//         const imagePath = res.data?.imagePath;
//         console.log("Image Path:", imagePath);

//         if (!imagePath) {
//           setUserImageUrl("");
//           setImageLoading(false);
//           return;
//         }

//         // 🔥 Get token (YOUR METHOD)
//         const tokens = JSON.parse(localStorage.getItem("authTokens"));
//         const accessToken = tokens?.access;

//         if (!accessToken) {
//           console.error("No access token found");
//           setUserImageUrl("");
//           setImageLoading(false);
//           return;
//         }

//         console.log("Token found, fetching image...");

//         // Fetch image with auth
//         const imageResponse = await axios.get(imagePath, {
//           responseType: 'blob',
//           headers: {
//             "Authorization": `Bearer ${accessToken}`,
//             "ngrok-skip-browser-warning": "true",
//           },
//         });

//         // Create blob URL
//         const blobUrl = URL.createObjectURL(imageResponse.data);
//         console.log("✅ Image loaded successfully:", blobUrl);
//         setUserImageUrl(blobUrl);

//       } catch (err) {
//         console.error("❌ Image fetch failed:", err.response?.data || err);
//         setUserImageUrl("");
//       } finally {
//         setImageLoading(false);
//       }
//     };

//     fetchUserImage();
//   }, [profileData?.user, JAVA_BASE_URL]);

//   /* ================= CLEANUP BLOB URL ================= */
//   useEffect(() => {
//     return () => {
//       if (userImageUrl && userImageUrl.startsWith('blob:')) {
//         URL.revokeObjectURL(userImageUrl);
//       }
//     };
//   }, [userImageUrl]);

//   /* ================= HANDLERS ================= */
//   const handleEditClick = () => {
//     reset({
//       ...profileData,
//       phone_no: profileData.phone_no?.toString() || "",
//       qualification: profileData.qualification || "",
//       aadhar_no: profileData.aadhar_no || "",
//       pan_no: profileData.pan_no || "",
//     });
//     setIsDialogOpen(true);
//     setImagePreview(null);
//   };

//   const handleRemoveImage = () => {
//     setImagePreview(null);
//     setUserImageUrl("");
//   };

//   /* ================= SUBMIT ================= */
//   const onSubmit = async (data) => {
//     try {
//       // DRF Profile Update
//       const formData = new FormData();
//       formData.append("user", profileData.user);
//       formData.append("first_name", data.first_name);
//       formData.append("middle_name", data.middle_name || "");
//       formData.append("last_name", data.last_name);
//       formData.append("email", data.email);
//       formData.append("phone_no", data.phone_no);
//       formData.append("gender", data.gender);
//       formData.append("qualification", data.qualification || "");
//       formData.append("aadhar_no", data.aadhar_no || "");
//       formData.append("pan_no", data.pan_no || "");

//       await axiosInstance.put(`/d/director/director_my_profile/`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       // 🔥 Image Upload with correct token
//       if (imagePreview && typeof imagePreview !== "string") {
//         const tokens = JSON.parse(localStorage.getItem("authTokens"));
//         const accessToken = tokens?.access;

//         const imgFormData = new FormData();
//         imgFormData.append("image", imagePreview);

//         try {
//           await axios.put(
//             `${JAVA_BASE_URL}/users/update-image/${profileData.user}`,
//             imgFormData,
//             {
//               headers: {
//                 "Content-Type": "multipart/form-data",
//                 "Authorization": `Bearer ${accessToken}`,
//                 "ngrok-skip-browser-warning": "true",
//               },
//             }
//           );
//         } catch {
//           await axios.post(
//             `${JAVA_BASE_URL}/users/upload-image/${profileData.user}`,
//             imgFormData,
//             {
//               headers: {
//                 "Content-Type": "multipart/form-data",
//                 "Authorization": `Bearer ${accessToken}`,
//                 "ngrok-skip-browser-warning": "true",
//               },
//             }
//           );
//         }

//         // Update preview
//         const newBlobUrl = URL.createObjectURL(imagePreview);
//         setUserImageUrl(newBlobUrl);
//       }

//       setIsDialogOpen(false);
//       setImagePreview(null);
//     } catch (err) {
//       console.error("Update failed:", err);
//       setError("Failed to update profile");
//     }
//   };

//   /* ================= LOADING / ERROR ================= */
//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen">
//         <span className="loading loading-spinner loading-lg"></span>
//         <p>Loading data...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center min-h-screen text-red-500">
//         {error}
//       </div>
//     );
//   }

//   if (!profileData) return null;

//   /* ================= UI ================= */
//   return (
//     <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen mb-24 md:mb-10">
//       <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden px-4 sm:px-6 lg:px-8 py-8 m-2.5">
        
//         {/* Header */}
//         <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-8">
//           <div className="flex-shrink-0">
//             <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
//               {imageLoading ? (
//                 <span className="loading loading-spinner loading-md"></span>
//               ) : userImageUrl ? (
//                 <img
//                   src={userImageUrl}
//                   alt="Profile"
//                   className="h-full w-full object-cover"
//                 />
//               ) : (
//                 <FontAwesomeIcon icon={faUser} className="h-12 w-12 text-gray-400" />
//               )}
//             </div>
//           </div>

//           <div className="text-center md:text-left">
//             <h1 className="text-2xl font-bold textTheme uppercase">
//               Director Profile
//             </h1>
//             <p className="text-gray-600 dark:text-gray-300">
//               Manage your account information and settings
//             </p>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-end gap-4 mt-8">
//           <button onClick={handleEditClick} className="btn bgTheme text-white">
//             <i className="fa-solid fa-pen-to-square"></i>
//             Update
//           </button>
//         </div>

//         {/* ================= DIALOG ================= */}
//         {isDialogOpen && (
//           <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//               <div className="p-6">
//                 <form onSubmit={handleSubmit(onSubmit)}>
                  
//                   {/* IMAGE SECTION */}
//                   <div className="flex flex-col items-center space-y-4">
//                     <div className="h-32 w-32 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
//                       {imagePreview ? (
//                         <img
//                           src={URL.createObjectURL(imagePreview)}
//                           className="h-full w-full object-cover"
//                           alt="Preview"
//                         />
//                       ) : userImageUrl ? (
//                         <img
//                           src={userImageUrl}
//                           className="h-full w-full object-cover"
//                           alt="Profile"
//                         />
//                       ) : (
//                         <FontAwesomeIcon icon={faUser} className="h-16 w-16 text-gray-400" />
//                       )}
//                     </div>

//                     <label className="btn bgTheme text-white cursor-pointer">
//                       <FontAwesomeIcon icon={faCamera} className="mr-2" />
//                       Change
//                       <input
//                         type="file"
//                         accept="image/*"
//                         hidden
//                         onChange={(e) => setImagePreview(e.target.files?.[0] || null)}
//                       />
//                     </label>

//                     {(imagePreview || userImageUrl) && (
//                       <button
//                         type="button"
//                         onClick={handleRemoveImage}
//                         className="text-red-500 text-sm"
//                       >
//                         Remove
//                       </button>
//                     )}
//                   </div>

//                   {/* YOUR EXISTING FORM FIELDS */}
//                   <div className="space-y-4 mt-6">
//                     {/* ... keep all your existing form fields ... */}
//                   </div>

//                   <div className="flex justify-end gap-4 mt-6">
//                     <button type="button" onClick={() => setIsDialogOpen(false)} className="btn">
//                       Cancel
//                     </button>
//                     <button type="submit" className="btn bgTheme text-white">
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

// export default DirectorProfile;




// import React, { useState, useEffect, useContext } from "react";
// import { useForm } from "react-hook-form";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUser, faCamera } from "@fortawesome/free-solid-svg-icons";
// import { constants } from "../../global/constants";
// import { AuthContext } from "../../context/AuthContext";

// const DirectorProfile = () => {
//   const { axiosInstance } = useContext(AuthContext);

//   const JAVA_BASE_URL = constants.JAVA_BASE_URL;

//   const [profileData, setProfileData] = useState(null);
//   const [userImageUrl, setUserImageUrl] = useState("");
//   const [imagePreview, setImagePreview] = useState(null);
//   const [imageLoading, setImageLoading] = useState(false);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm();

//   /* ================= FETCH PROFILE ================= */
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         setLoading(true);
//         const res = await axiosInstance.get(
//           "/d/director/director_my_profile/"
//         );
//         setProfileData(res.data);
//       } catch (err) {
//         setError("Failed to fetch profile");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [axiosInstance]);

//   /* ================= FETCH IMAGE ================= */
//   const fetchUserImage = async () => {
//     if (!profileData?.user) return;

//     setImageLoading(true);
//     try {
//       const res = await axiosInstance.get(
//         `${JAVA_BASE_URL}/users/getUserImage/${profileData.user}`
//       );

//       const imagePath = res.data?.imagePath;
//       if (!imagePath) {
//         setUserImageUrl("");
//         return;
//       }

//       const imageRes = await axiosInstance.get(imagePath, {
//         responseType: "blob",
//       });

//       const blobUrl = URL.createObjectURL(imageRes.data);
//       setUserImageUrl(blobUrl);
//     } catch {
//       setUserImageUrl("");
//     } finally {
//       setImageLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUserImage();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [profileData?.user]);

//   /* ================= CLEANUP ================= */
//   useEffect(() => {
//     return () => {
//       if (userImageUrl?.startsWith("blob:")) {
//         URL.revokeObjectURL(userImageUrl);
//       }
//     };
//   }, [userImageUrl]);

//   /* ================= HANDLERS ================= */
//   const handleEditClick = () => {
//     reset(profileData);
//     setImagePreview(null);
//     setIsDialogOpen(true);
//   };

//   const handleRemoveImage = async () => {
//     try {
//       await axiosInstance.delete(
//         `${JAVA_BASE_URL}/users/delete-image/${profileData.user}`
//       );
//       setImagePreview(null);
//       setUserImageUrl("");
//     } catch {
//       alert("Failed to remove image");
//     }
//   };

//   /* ================= SUBMIT ================= */
//   const onSubmit = async (data) => {
//     try {
//       /* ---------- 1️⃣ IMAGE UPLOAD FIRST ---------- */
//       if (imagePreview && typeof imagePreview !== "string") {
//         const imgForm = new FormData();
//         imgForm.append("image", imagePreview);

//         await axiosInstance.put(
//           `${JAVA_BASE_URL}/users/update-image/${profileData.user}`,
//           imgForm
//         );
//       }

//       /* ---------- 2️⃣ PROFILE UPDATE ---------- */
//       const formData = new FormData();
//       formData.append("user", profileData.user);
//       formData.append("first_name", data.first_name);
//       formData.append("middle_name", data.middle_name || "");
//       formData.append("last_name", data.last_name);
//       formData.append("email", data.email);
//       formData.append("phone_no", data.phone_no);
//       formData.append("gender", data.gender);
//       formData.append("qualification", data.qualification || "");
//       formData.append("aadhar_no", data.aadhar_no || "");
//       formData.append("pan_no", data.pan_no || "");

//       await axiosInstance.put(
//         "/d/director/director_my_profile/",
//         formData
//       );

//       /* ---------- 3️⃣ RE-FETCH IMAGE ---------- */
//       await fetchUserImage();

//       setIsDialogOpen(false);
//       setImagePreview(null);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to update profile");
//     }
//   };

//   /* ================= LOADING / ERROR ================= */
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <span className="loading loading-spinner loading-lg"></span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-red-500 text-center min-h-screen">
//         {error}
//       </div>
//     );
//   }

//   if (!profileData) return null;

//   /* ================= UI ================= */
//   return (
//     <div className="p-6 min-h-screen bg-gray-100">
//       <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-6">
//         <div className="flex items-center gap-4">
//           <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
//             {imageLoading ? (
//               <span className="loading loading-spinner"></span>
//             ) : userImageUrl ? (
//               <img src={userImageUrl} className="h-full w-full object-cover" />
//             ) : (
//               <FontAwesomeIcon icon={faUser} className="text-4xl text-gray-400" />
//             )}
//           </div>

//           <div>
//             <h1 className="text-2xl font-bold">Director Profile</h1>
//             <p className="text-gray-500">{profileData.email}</p>
//           </div>
//         </div>

//         <div className="flex justify-end mt-6">
//           <button className="btn bgTheme text-white" onClick={handleEditClick}>
//             Update
//           </button>
//         </div>
//       </div>

//       {/* ================= MODAL ================= */}
//       {isDialogOpen && (
//         <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg w-full max-w-3xl p-6">
//             <form onSubmit={handleSubmit(onSubmit)}>
//               {/* IMAGE */}
//               <div className="flex flex-col items-center gap-4">
//                 <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
//                   {imagePreview ? (
//                     <img
//                       src={URL.createObjectURL(imagePreview)}
//                       className="h-full w-full object-cover"
//                     />
//                   ) : userImageUrl ? (
//                     <img src={userImageUrl} className="h-full w-full object-cover" />
//                   ) : (
//                     <FontAwesomeIcon icon={faUser} className="text-5xl text-gray-400" />
//                   )}
//                 </div>

//                 <label className="btn bgTheme text-white cursor-pointer">
//                   <FontAwesomeIcon icon={faCamera} className="mr-2" />
//                   Change
//                   <input
//                     type="file"
//                     hidden
//                     accept="image/*"
//                     onChange={(e) =>
//                       setImagePreview(e.target.files?.[0] || null)
//                     }
//                   />
//                 </label>

//                 {(imagePreview || userImageUrl) && (
//                   <button
//                     type="button"
//                     className="text-red-500 text-sm"
//                     onClick={handleRemoveImage}
//                   >
//                     Remove Image
//                   </button>
//                 )}
//               </div>

//               {/* FORM FIELDS (keep your existing ones) */}

//               <div className="flex justify-end gap-4 mt-6">
//                 <button
//                   type="button"
//                   onClick={() => setIsDialogOpen(false)}
//                   className="btn"
//                 >
//                   Cancel
//                 </button>
//                 <button type="submit" className="btn bgTheme text-white">
//                   Save Changes
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DirectorProfile;




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
  faGraduationCap,
  faIdCard,
} from "@fortawesome/free-solid-svg-icons";
import { constants } from "../../global/constants";
import { AuthContext } from "../../context/AuthContext";

const DirectorProfile = () => {
  const { axiosInstance } = useContext(AuthContext);

  const JAVA_BASE_URL = constants.JAVA_BASE_URL;

  const [profileData, setProfileData] = useState(null);
  const [userImageUrl, setUserImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [directorFullName, setDirectorFullName] = useState("");
  const [uploadedUserProfile, setUploadedUserProfile] = useState(null);
const [imageRemoved, setImageRemoved] = useState(false);


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/d/director/director_my_profile/");
        setProfileData(res.data);

        const fullName = `${res.data.first_name} ${res.data.middle_name || ""} ${res.data.last_name}`;
        localStorage.setItem("user_name", fullName);
        setDirectorFullName(fullName);
      } catch (err) {
        setError("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [axiosInstance]);

  /* ================= FETCH IMAGE FROM JAVA ================= */
  const fetchUserImage = async () => {
    if (!profileData?.user) return;

    setImageLoading(true);
    try {
      const res = await axiosInstance.get(
        `${JAVA_BASE_URL}/users/getUserImage/${profileData.user}`
      );

      const imagePath = res.data?.imagePath;
      if (!imagePath) {
        setUserImageUrl("");
        return;
      }

      const imageRes = await axiosInstance.get(imagePath, {
        responseType: "blob",
      });

      const blobUrl = URL.createObjectURL(imageRes.data);
      setUserImageUrl(blobUrl);
    } catch {
      setUserImageUrl("");
    } finally {
      setImageLoading(false);
    }
  };

  useEffect(() => {
    fetchUserImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData?.user]);

  /* ================= CLEANUP BLOB URL ================= */
  useEffect(() => {
    return () => {
      if (userImageUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(userImageUrl);
      }
    };
  }, [userImageUrl]);

  /* ================= HANDLERS ================= */
  const handleEditClick = () => {
    reset({
      ...profileData,
      phone_no: profileData.phone_no?.toString() || "",
      qualification: profileData.qualification || "",
      aadhar_no: profileData.aadhar_no || "",
      pan_no: profileData.pan_no || "",
    });
    setImagePreview(null);
    setIsDialogOpen(true);
  };

  // const handleRemoveImage = async () => {
  //   try {
  //     await axiosInstance.delete(
  //       `${JAVA_BASE_URL}/users/deleteImage/${profileData.user}`
  //     );
  //     setImagePreview(null);
  //     setUserImageUrl("");
  //   } catch {
  //     alert("Failed to remove image");
  //   }
  // };
  const handleRemoveImage = async () => {
  try {
    await axiosInstance.delete(
      `${JAVA_BASE_URL}/users/deleteImage/${profileData.user}`
    );

    setImagePreview(null);
    setUserImageUrl("");
    setUploadedUserProfile(null);
    setImageRemoved(true); // 👈 IMPORTANT
  } catch {
    alert("Failed to remove image");
  }
};


  /* ================= SUBMIT ================= */
  const onSubmit = async (data) => {
    try {
      /* ---------- 1️⃣ IMAGE UPLOAD TO JAVA ---------- */
      // if (imagePreview && typeof imagePreview !== "string") {
      //   const imgForm = new FormData();
      //   imgForm.append("image", imagePreview);

      //   await axiosInstance.put(
      //     `${JAVA_BASE_URL}/users/update-image/${profileData.user}`,
      //     imgForm
      //   );
      // }

      let newUserProfilePath = null;

if (imagePreview && typeof imagePreview !== "string") {
  const imgForm = new FormData();
  imgForm.append("image", imagePreview);

  const imgRes = await axiosInstance.put(
    `${JAVA_BASE_URL}/users/update-image/${profileData.user}`,
    imgForm
  );

  // 👇 Java response se path
  newUserProfilePath = imgRes.data?.imagePath || null;

  setUploadedUserProfile(newUserProfilePath);
  setImageRemoved(false); // image upload hua
}


      /* ---------- 2️⃣ PROFILE UPDATE ---------- */
      const formData = new FormData();
      formData.append("user", profileData.user);
      formData.append("first_name", data.first_name);
      formData.append("middle_name", data.middle_name || "");
      formData.append("last_name", data.last_name);
      formData.append("email", data.email);
      formData.append("phone_no", data.phone_no);
      formData.append("gender", data.gender);
      formData.append("qualification", data.qualification || "");
      formData.append("aadhar_no", data.aadhar_no || "");
      formData.append("pan_no", data.pan_no || "");
      formData.append(
  "user_profile",
  imageRemoved
    ? null
    : newUserProfilePath || profileData.user_profile || null
);


      const response = await axiosInstance.put(
        `/d/director/${profileData.id}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProfileData(response.data);
      setImageRemoved(false);
setUploadedUserProfile(null);
setImagePreview(null);


      /* ---------- 3️⃣ RE-FETCH IMAGE ---------- */
      await fetchUserImage();

      setIsDialogOpen(false);
      setImagePreview(null);
    } catch (err) {
      console.error(err);
      setError("Failed to update profile");
    }
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
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden px-4 sm:px-6 lg:px-8 py-8 m-2.5">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-8">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
              {imageLoading ? (
                <span className="loading loading-spinner"></span>
              ) : userImageUrl ? (
                <img
                  src={userImageUrl}
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
                {
                  label: "First Name",
                  icon: faUser,
                  value: profileData.first_name,
                },
                {
                  label: "Last Name",
                  icon: faSignature,
                  value: profileData.last_name,
                },
                {
                  label: "Phone Number",
                  icon: faPhone,
                  value: profileData.phone_no,
                },
                {
                  label: "Qualification",
                  icon: faGraduationCap,
                  value: profileData.qualification,
                },
                {
                  label: "Aadhar No",
                  icon: faIdCard,
                  value: profileData.aadhar_no,
                },
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
                {
                  label: "Middle Name",
                  icon: faSignature,
                  value: profileData.middle_name,
                },
                { label: "Email", icon: faEnvelope, value: profileData.email },
                {
                  label: "Gender",
                  icon: faVenusMars,
                  value: profileData.gender,
                },
                {
                  label: "Date Joined",
                  icon: faCalendarDay,
                  value: profileData.date_joined,
                },
                {
                  label: "PAN No",
                  icon: faIdCard,
                  value: profileData.pan_no,
                },
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
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
              onClick={() => window.history.back()}
            >
              Cancel
            </button>
            <button
              onClick={handleEditClick}
              className="btn bgTheme text-white"
            >
              <i className="fa-solid fa-pen-to-square"></i>
              Update
            </button>
          </div>
        </div>

        {/* ================= DIALOG/MODAL ================= */}
        {isDialogOpen && (
          <div className="fixed inset-0 bg-opacity-30 dark:bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                  Update Director Profile
                </h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Column 1 - Profile Image */}
                    <div className="space-y-4">
                      <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 border-b pb-2 border-gray-200 dark:border-gray-700">
                        Profile Image
                      </h3>

                      <div className="flex flex-col items-center space-y-4">
                        <div className="relative group">
                          <div className="h-32 w-32 rounded-full bg-gray-100 dark:bg-gray-600 overflow-hidden shadow-md border-2 border-gray-300 dark:border-gray-500 hover:border-blue-400 transition-all duration-200">
                            {imagePreview ? (
                              <img
                                src={URL.createObjectURL(imagePreview)}
                                alt="Profile Preview"
                                className="h-full w-full object-cover"
                              />
                            ) : userImageUrl ? (
                              <img
                                src={userImageUrl}
                                alt="Profile"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                                <FontAwesomeIcon
                                  icon={faUser}
                                  size="3x"
                                  className="opacity-70"
                                />
                              </div>
                            )}
                          </div>

                          <label className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer">
                            <div className="bg-black bg-opacity-50 rounded-full p-2">
                              <FontAwesomeIcon
                                icon={faCamera}
                                className="text-white text-lg"
                              />
                            </div>
                            <input
                              className="hidden"
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setImagePreview(e.target.files[0]);
                                }
                              }}
                            />
                          </label>
                        </div>

                        <div className="flex gap-2">
                          <label className="btn bgTheme text-white">
                            <FontAwesomeIcon icon={faCamera} className="mr-2" />
                            Change
                            <input
                              className="hidden"
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setImagePreview(e.target.files[0]);
                                }
                              }}
                            />
                          </label>

                          {(imagePreview || userImageUrl) && (
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="inline-flex items-center px-3 py-1 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900 hover:bg-red-100 dark:hover:bg-red-800"
                            >
                              <span className="mr-2">X</span>Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Column 2 - Form Fields */}
                    <div className="space-y-4">
                      <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 border-b pb-2 border-gray-200 dark:border-gray-700">
                        Personal Information
                      </h3>

                      {/* Input fields */}
                      {[
                        {
                          name: "first_name",
                          label: "First Name",
                          required: true,
                        },
                        { name: "middle_name", label: "Middle Name" },
                        {
                          name: "last_name",
                          label: "Last Name",
                          required: true,
                        },
                        {
                          name: "email",
                          label: "Email",
                          type: "email",
                          required: true,
                        },
                        {
                          name: "phone_no",
                          label: "Phone Number",
                          type: "text",
                          required: true,
                        },
                        {
                          name: "qualification",
                          label: "Qualification",
                          type: "text",
                        },
                        {
                          name: "aadhar_no",
                          label: "Aadhar No",
                          type: "text",
                        },
                        {
                          name: "pan_no",
                          label: "PAN No",
                          type: "text",
                        },
                      ].map((field) => (
                        <div key={field.name} className="flex flex-col gap-1">
                          <label className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                            {field.label}
                            {field.required && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </label>

                          <input
                            type={field.type || "text"}
                            {...register(field.name, {
                              required: field.required
                                ? `${field.label} is required`
                                : false,

                              ...(field.name === "phone_no"
                                ? {
                                    pattern: {
                                      value: /^\+?[0-9]{10}$/,
                                      message:
                                        "Phone number must be exactly 10 digits",
                                    },
                                  }
                                : [
                                    "first_name",
                                    "middle_name",
                                    "last_name",
                                  ].includes(field.name)
                                ? {
                                    maxLength: {
                                      value: 20,
                                      message: `${field.label} cannot exceed 20 characters`,
                                    },
                                    pattern: {
                                      value: /^[A-Za-z\s]*$/,
                                      message: `${field.label} should only contain letters`,
                                    },
                                  }
                                : field.name === "email"
                                ? {
                                    maxLength: {
                                      value: 40,
                                      message:
                                        "Email cannot exceed 40 characters",
                                    },
                                    pattern: {
                                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                      message:
                                        "Please enter a valid email address",
                                    },
                                  }
                                : field.name === "aadhar_no"
                                ? {
                                    pattern: {
                                      value: /^[0-9]{12}$/,
                                      message:
                                        "Aadhar must be exactly 12 digits",
                                    },
                                  }
                                : field.name === "pan_no"
                                ? {
                                    pattern: {
                                      value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                                      message: "Invalid PAN format",
                                    },
                                  }
                                : {}),
                            })}
                            onInput={(e) => {
                              if (
                                field.name === "phone_no" &&
                                e.target.value.length > 10
                              ) {
                                e.target.value = e.target.value.slice(0, 10);
                              }

                              if (
                                field.name === "aadhar_no" &&
                                e.target.value.length > 12
                              ) {
                                e.target.value = e.target.value.slice(0, 12);
                              }

                              if (
                                field.name === "pan_no" &&
                                e.target.value.length > 10
                              ) {
                                e.target.value = e.target.value.slice(0, 10);
                              }

                              if (
                                [
                                  "first_name",
                                  "middle_name",
                                  "last_name",
                                ].includes(field.name) &&
                                e.target.value.length > 50
                              ) {
                                e.target.value = e.target.value.slice(0, 50);
                              }

                              if (
                                field.name === "email" &&
                                e.target.value.length > 100
                              ) {
                                e.target.value = e.target.value.slice(0, 100);
                              }
                            }}
                            onKeyDown={(e) => {
                              if (
                                field.name === "phone_no" &&
                                !/[0-9]|Backspace|ArrowLeft|ArrowRight|Delete|Tab/.test(
                                  e.key
                                )
                              ) {
                                e.preventDefault();
                              }

                              if (
                                field.name === "aadhar_no" &&
                                !/[0-9]|Backspace|ArrowLeft|ArrowRight|Delete|Tab/.test(
                                  e.key
                                )
                              ) {
                                e.preventDefault();
                              }

                              if (
                                [
                                  "first_name",
                                  "middle_name",
                                  "last_name",
                                ].includes(field.name) &&
                                !/[A-Za-z\s]|Backspace|ArrowLeft|ArrowRight|Delete|Tab/.test(
                                  e.key
                                )
                              ) {
                                e.preventDefault();
                              }
                            }}
                            className="input input-bordered w-full text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
                          />

                          {errors[field.name] && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors[field.name]?.message}
                            </p>
                          )}
                        </div>
                      ))}

                      {/* Gender Select */}
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                          Gender <span className="text-red-500">*</span>
                        </label>
                        <select
                          {...register("gender", {
                            required: "Gender is required",
                          })}
                          className="select select-bordered w-full text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        {errors.gender && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.gender.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setIsDialogOpen(false);
                        setImagePreview(null);
                      }}
                      className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn bgTheme text-white">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectorProfile;