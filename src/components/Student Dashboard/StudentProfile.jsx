// import React, { useState, useEffect, useContext } from "react";
// import { useForm } from "react-hook-form";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faUser,
//   faSignature,
//   faEnvelope,
//   faVenusMars,
//   faCamera,
//   faIdCard,
//   faChild,
//   faWeight,
//   faRulerVertical,
//   faUsers,
//   faPrayingHands,
// } from "@fortawesome/free-solid-svg-icons";
// import { constants } from "../../global/constants";
// import { AuthContext } from "../../context/AuthContext";

// const StudentProfile = () => {
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
//   } = useForm();

//   useEffect(() => {
//     const fetchStudentData = async () => {
//       try {
//         setLoading(true);
//         const response = await axiosInstance.get(
//           `/s/students/student_my_profile/`
//         );
//         setProfileData(response.data);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching student data:", err);
//         setError(err.response?.data?.message || err.message);
//         setLoading(false);
//       }
//     };

//     fetchStudentData();
//   }, [axiosInstance]);

//   const onSubmit = async (data) => {
//     try {
//       const formData = new FormData();
//       formData.append("first_name", data.first_name);
//       formData.append("middle_name", data.middle_name || "");
//       formData.append("last_name", data.last_name);
//       formData.append("email", data.email);
//       formData.append("father_name", data.father_name);
//       formData.append("mother_name", data.mother_name);
//       formData.append("date_of_birth", data.date_of_birth);
//       formData.append("gender", data.gender);
//       formData.append("religion", data.religion);
//       formData.append("category", data.category);
//       formData.append("height", data.height);
//       formData.append("weight", data.weight);
//       formData.append("blood_group", data.blood_group);
//       formData.append("number_of_siblings", data.number_of_siblings);

//       if (removeImage) {
//         formData.append("user_profile", "");
//       } else if (imagePreview && typeof imagePreview !== "string") {
//         formData.append("user_profile", imagePreview);
//       }

//       if (imagePreview && typeof imagePreview !== "string") {
//         formData.append("user_profile", imagePreview);
//       }

//       const response = await axiosInstance.put(
//         `/s/students/student_my_profile/`,
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
//       console.error("Error updating student data:", err);
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
//     <div className="p-6 bg-gray-100 min-h-screen mb-24 md:mb-10">
//       <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md shadow-top-bottom overflow-hidden px-4 sm:px-6 lg:px-8 py-8 m-2.5">
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
//               Student Profile
//             </h1>
//             <p className="text-sm sm:text-base text-gray-600">
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
//                   <FontAwesomeIcon icon={faUser} className="w-4 h-4 mr-2" />
//                   Father's Name
//                 </label>
//                 <input
//                   type="text"
//                   value={profileData.father_name || "Not provided"}
//                   className="input input-bordered w-full text-sm"
//                   readOnly
//                 />
//               </div>

//               <div className="flex flex-col gap-1">
//                 <label className="text-sm font-semibold text-gray-500">
//                   <FontAwesomeIcon icon={faUser} className="w-4 h-4 mr-2" />
//                   Mother's Name
//                 </label>
//                 <input
//                   type="text"
//                   value={profileData.mother_name || "Not provided"}
//                   className="input input-bordered w-full text-sm"
//                   readOnly
//                 />
//               </div>
//             </div>

//             {/* Column 2 */}
//             <div className="space-y-6">
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

//               <div className="flex flex-col gap-1">
//                 <label className="text-sm font-semibold text-gray-500">
//                   <FontAwesomeIcon
//                     icon={faPrayingHands}
//                     className="w-4 h-4 mr-2"
//                   />
//                   Religion
//                 </label>
//                 <input
//                   type="text"
//                   value={profileData.religion || "Not provided"}
//                   className="input input-bordered w-full text-sm"
//                   readOnly
//                 />
//               </div>

//               <div className="flex flex-col gap-1">
//                 <label className="text-sm font-semibold text-gray-500">
//                   <FontAwesomeIcon icon={faIdCard} className="w-4 h-4 mr-2" />
//                   Category
//                 </label>
//                 <input
//                   type="text"
//                   value={profileData.category || "Not provided"}
//                   className="input input-bordered w-full text-sm"
//                   readOnly
//                 />
//               </div>

//               <div className="flex flex-col gap-1">
//                 <label className="text-sm font-semibold text-gray-500">
//                   <FontAwesomeIcon
//                     icon={faRulerVertical}
//                     className="w-4 h-4 mr-2"
//                   />
//                   Height (ft)
//                 </label>
//                 <input
//                   type="text"
//                   value={profileData.height || "Not provided"}
//                   className="input input-bordered w-full text-sm"
//                   readOnly
//                 />
//               </div>

//               <div className="flex flex-col gap-1">
//                 <label className="text-sm font-semibold text-gray-500">
//                   <FontAwesomeIcon icon={faWeight} className="w-4 h-4 mr-2" />
//                   Weight (kg)
//                 </label>
//                 <input
//                   type="text"
//                   value={profileData.weight || "Not provided"}
//                   className="input input-bordered w-full text-sm"
//                   readOnly
//                 />
//               </div>

//               <div className="flex flex-col gap-1">
//                 <label className="text-sm font-semibold text-gray-500">
//                   <FontAwesomeIcon icon={faChild} className="w-4 h-4 mr-2" />
//                   Blood Group
//                 </label>
//                 <input
//                   type="text"
//                   value={profileData.blood_group || "Not provided"}
//                   className="input input-bordered w-full text-sm"
//                   readOnly
//                 />
//               </div>

//               <div className="flex flex-col gap-1">
//                 <label className="text-sm font-semibold text-gray-500">
//                   <FontAwesomeIcon icon={faUsers} className="w-4 h-4 mr-2" />
//                   Number of Siblings
//                 </label>
//                 <input
//                   type="text"
//                   value={profileData.number_of_siblings || "Not provided"}
//                   className="input input-bordered w-full text-sm"
//                   readOnly
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Buttons section */}
//           <div className="flex justify-end gap-4 mt-8">
//             <button
//               className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
//               onClick={() => window.history.back()}
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleEditClick}
//               className="btn bgTheme text-white"
//             >
//               <i className="fa-solid fa-pen-to-square"></i>Update
//             </button>
//           </div>
//         </div>

//         {/* Dialog Box */}
//         {isDialogOpen && (
//           <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//               <div className="p-6">
//                 <h2 className="text-xl font-bold textTheme mb-4">
//                   Update Student Profile
//                 </h2>

//                 <form onSubmit={handleSubmit(onSubmit)}>
//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//                     {/* Column 1 - Profile Image */}
//                     <div className="space-y-4">
//                       <h3 className="text-md font-semibold text-gray-700 border-b pb-2">
//                         Profile Image
//                       </h3>

//                       <div className="flex flex-col items-center space-y-4">
//                         <div className="relative group">
//                           <div className="h-32 w-32 rounded-full bg-gray-100 overflow-hidden shadow-md border-2 border-gray-300 hover:border-blue-400 transition-all duration-200">
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
//                               <div className="h-full w-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-100 to-gray-200">
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
//                           <label className="btn bgTheme text-white text-nowrap">
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
//                               className="inline-flex items-center px-3 py-1 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100"
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
//                       <h3 className="text-md font-semibold text-gray-700 border-b pb-2">
//                         Personal Information
//                       </h3>

//                       <div className="flex flex-col gap-1">
//                         <label className="text-sm font-semibold text-gray-500">
//                           First Name
//                         </label>
//                         <input
//                           type="text"
//                           {...register("first_name", {
//                             required: "First name is required",
//                           })}
//                           className="input input-bordered w-full text-sm"
//                         />
//                         {errors.first_name && (
//                           <p className="text-red-500 text-xs mt-1">
//                             {errors.first_name.message}
//                           </p>
//                         )}
//                       </div>

//                       <div className="flex flex-col gap-1">
//                         <label className="text-sm font-semibold text-gray-500">
//                           Middle Name
//                         </label>
//                         <input
//                           type="text"
//                           {...register("middle_name")}
//                           className="input input-bordered w-full text-sm"
//                         />
//                       </div>

//                       <div className="flex flex-col gap-1">
//                         <label className="text-sm font-semibold text-gray-500">
//                           Last Name
//                         </label>
//                         <input
//                           type="text"
//                           {...register("last_name", {
//                             required: "Last name is required",
//                           })}
//                           className="input input-bordered w-full text-sm"
//                         />
//                         {errors.last_name && (
//                           <p className="text-red-500 text-xs mt-1">
//                             {errors.last_name.message}
//                           </p>
//                         )}
//                       </div>

//                       <div className="flex flex-col gap-1">
//                         <label className="text-sm font-semibold text-gray-500">
//                           Father's Name
//                         </label>
//                         <input
//                           type="text"
//                           {...register("father_name", {
//                             required: "Father's name is required",
//                           })}
//                           className="input input-bordered w-full text-sm"
//                         />
//                         {errors.father_name && (
//                           <p className="text-red-500 text-xs mt-1">
//                             {errors.father_name.message}
//                           </p>
//                         )}
//                       </div>

//                       <div className="flex flex-col gap-1">
//                         <label className="text-sm font-semibold text-gray-500">
//                           Mother's Name
//                         </label>
//                         <input
//                           type="text"
//                           {...register("mother_name", {
//                             required: "Mother's name is required",
//                           })}
//                           className="input input-bordered w-full text-sm"
//                         />
//                         {errors.mother_name && (
//                           <p className="text-red-500 text-xs mt-1">
//                             {errors.mother_name.message}
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     {/* Column 3 - Additional Info */}
//                     <div className="space-y-4">
//                       <h3 className="text-md font-semibold text-gray-700 border-b pb-2">
//                         Additional Information
//                       </h3>

//                       <div className="flex flex-col gap-1">
//                         <label className="text-sm font-semibold text-gray-500">
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
//                           className="input input-bordered w-full text-sm"
//                         />
//                         {errors.email && (
//                           <p className="text-red-500 text-xs mt-1">
//                             {errors.email.message}
//                           </p>
//                         )}
//                       </div>

//                       <div className="flex flex-col gap-1">
//                         <label className="text-sm font-semibold text-gray-500">
//                           Date of Birth
//                         </label>
//                         <input
//                           type="date"
//                           {...register("date_of_birth", {
//                             required: "Date of birth is required",
//                           })}
//                           className="input input-bordered w-full text-sm"
//                         />
//                         {errors.date_of_birth && (
//                           <p className="text-red-500 text-xs mt-1">
//                             {errors.date_of_birth.message}
//                           </p>
//                         )}
//                       </div>

//                       <div className="flex flex-col gap-1">
//                         <label className="text-sm font-semibold text-gray-500">
//                           Gender
//                         </label>
//                         <select
//                           {...register("gender", {
//                             required: "Gender is required",
//                           })}
//                           className="select select-bordered w-full text-sm"
//                         >
//                           <option value="">Select Gender</option>
//                           <option value="male">Male</option>
//                           <option value="female">Female</option>
//                           <option value="other">Other</option>
//                         </select>
//                         {errors.gender && (
//                           <p className="text-red-500 text-xs mt-1">
//                             {errors.gender.message}
//                           </p>
//                         )}
//                       </div>

//                       <div className="flex flex-col gap-1">
//                         <label className="text-sm font-semibold text-gray-500">
//                           Religion
//                         </label>
//                         <input
//                           type="text"
//                           {...register("religion", {
//                             required: "Religion is required",
//                           })}
//                           className="input input-bordered w-full text-sm"
//                         />
//                         {errors.religion && (
//                           <p className="text-red-500 text-xs mt-1">
//                             {errors.religion.message}
//                           </p>
//                         )}
//                       </div>

//                       <div className="flex flex-col gap-1">
//                         <label className="text-sm font-semibold text-gray-500">
//                           Category
//                         </label>
//                         <input
//                           type="text"
//                           {...register("category", {
//                             required: "Category is required",
//                           })}
//                           className="input input-bordered w-full text-sm"
//                         />
//                         {errors.category && (
//                           <p className="text-red-500 text-xs mt-1">
//                             {errors.category.message}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                     {/* Column 3 - Additional Info */}
//                     <div className="space-y-4">
//                       <h3 className="text-md font-semibold text-gray-700 border-b pb-2">
//                         Additional Information
//                       </h3>
//                       <div className="flex flex-col gap-1">
//                         <label className="text-sm font-semibold text-gray-500">
//                           Height (ft)
//                         </label>
//                         <input
//                           type="number"
//                           step="0.1"
//                           {...register("height", {
//                             required: "Height is required",
//                           })}
//                           className="input input-bordered w-full text-sm"
//                         />
//                         {errors.height && (
//                           <p className="text-red-500 text-xs mt-1">
//                             {errors.height.message}
//                           </p>
//                         )}
//                       </div>

//                       <div className="flex flex-col gap-1">
//                         <label className="text-sm font-semibold text-gray-500">
//                           Weight (kg)
//                         </label>
//                         <input
//                           type="number"
//                           step="0.1"
//                           {...register("weight", {
//                             required: "Weight is required",
//                           })}
//                           className="input input-bordered w-full text-sm"
//                         />
//                         {errors.weight && (
//                           <p className="text-red-500 text-xs mt-1">
//                             {errors.weight.message}
//                           </p>
//                         )}
//                       </div>

//                       <div className="flex flex-col gap-1">
//                         <label className="text-sm font-semibold text-gray-500">
//                           Blood Group
//                         </label>
//                         <input
//                           type="text"
//                           {...register("blood_group", {
//                             required: "Blood group is required",
//                           })}
//                           className="input input-bordered w-full text-sm"
//                         />
//                         {errors.blood_group && (
//                           <p className="text-red-500 text-xs mt-1">
//                             {errors.blood_group.message}
//                           </p>
//                         )}
//                       </div>

//                       <div className="flex flex-col gap-1">
//                         <label className="text-sm font-semibold text-gray-500">
//                           Number of Siblings
//                         </label>
//                         <input
//                           type="number"
//                           {...register("number_of_siblings", {
//                             required: "Number of siblings is required",
//                           })}
//                           className="input input-bordered w-full text-sm"
//                         />
//                         {errors.number_of_siblings && (
//                           <p className="text-red-500 text-xs mt-1">
//                             {errors.number_of_siblings.message}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex justify-end gap-4 mt-6">
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setIsDialogOpen(false);
//                         setImagePreview(null);
//                       }}
//                       className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
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

// export default StudentProfile;





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

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);

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
        const response = await axiosInstance.get(
          `/s/students/student_my_profile/`
        );
        setProfileData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching student data:", err);
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [axiosInstance]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("first_name", data.first_name);
      formData.append("middle_name", data.middle_name || "");
      formData.append("last_name", data.last_name);
      formData.append("email", data.email);
      formData.append("father_name", data.father_name);
      formData.append("mother_name", data.mother_name);
      formData.append("date_of_birth", data.date_of_birth);
      formData.append("gender", data.gender);
      formData.append("religion", data.religion);
      formData.append("category", data.category);
      formData.append("height", data.height);
      formData.append("weight", data.weight);
      formData.append("blood_group", data.blood_group);
      formData.append("number_of_siblings", data.number_of_siblings);

      if (removeImage) {
        formData.append("user_profile", "");
      } else if (imagePreview && typeof imagePreview !== "string") {
        formData.append("user_profile", imagePreview);
      }

      const response = await axiosInstance.put(
        `/s/students/student_my_profile/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProfileData(response.data);
      setIsDialogOpen(false);
      setImagePreview(null);
      window.location.reload();
    } catch (err) {
      console.error("Error updating student data:", err);
      setError(err.message);
    }
  };

  const handleEditClick = () => {
    reset(profileData);
    setIsDialogOpen(true);
    if (profileData?.user_profile) {
      setImagePreview(`${BASE_URL}${profileData.user_profile}`);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setRemoveImage(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce [animation-delay:-0.2s]"></div>
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce [animation-delay:-0.4s]"></div>
        </div>
        <p className="mt-2 text-gray-400 text-sm">Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-gray-900 text-gray-200">
        <i className="fa-solid fa-triangle-exclamation text-5xl text-red-400 mb-4"></i>
        <p className="text-lg text-red-400 font-medium">Failed to load data, Try Again</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="max-w-7xl mx-auto bg-gray-800 rounded-xl shadow-md overflow-hidden px-4 sm:px-6 lg:px-8 py-8 m-2.5">
        <div className="text-center text-gray-400">
          <p>No profile data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen mb-24 md:mb-10 text-gray-200">
      <div className="max-w-7xl mx-auto bg-gray-800 rounded-xl shadow-md overflow-hidden px-4 sm:px-6 lg:px-8 py-8 m-2.5">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-8">
          <div className="flex-shrink-0">
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center">
              {profileData.user_profile ? (
                <img
                  src={`${BASE_URL}${profileData.user_profile}`}
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
          <div className="text-center md:text-left">
            <h1 className="text-xl sm:text-2xl font-bold textTheme uppercase">
              Student Profile
            </h1>
            <p className="text-sm sm:text-base text-gray-400">
              Manage your account information and settings
            </p>
          </div>
        </div>

        {/* Profile Grid */}
        <div className="border-t border-gray-700 pt-6">
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
                  <label className="text-sm font-semibold text-gray-400 flex items-center">
                    <FontAwesomeIcon icon={icon} className="w-4 h-4 mr-2" />
                    {label}
                  </label>
                  <input
                    type="text"
                    value={value || "Not provided"}
                    className="input input-bordered w-full text-sm bg-gray-700 text-gray-200 border-gray-600"
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
                  <label className="text-sm font-semibold text-gray-400 flex items-center">
                    <FontAwesomeIcon icon={icon} className="w-4 h-4 mr-2" />
                    {label}
                  </label>
                  <input
                    type="text"
                    value={value || "Not provided"}
                    className="input input-bordered w-full text-sm bg-gray-700 text-gray-200 border-gray-600"
                    readOnly
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-200 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600"
              onClick={() => window.history.back()}
            >
              Cancel
            </button>
            <button
              onClick={handleEditClick}
              className="btn bgTheme text-white"
            >
              <i className="fa-solid fa-pen-to-square mr-2"></i>Update
            </button>
          </div>
        </div>

        {/* Update Dialog */}
        {isDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto text-gray-200">
              <div className="p-6">
                <h2 className="text-xl font-bold textTheme mb-4">
                  Update Student Profile
                </h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Profile Image */}
                    <div className="space-y-4">
                      <h3 className="text-md font-semibold text-gray-200 border-b border-gray-600 pb-2">
                        Profile Image
                      </h3>
                      <div className="flex flex-col items-center space-y-4">
                        <div className="relative group">
                          <div className="h-32 w-32 rounded-full bg-gray-700 overflow-hidden shadow-md border-2 border-gray-600 hover:border-blue-400 transition-all duration-200">
                            {imagePreview ? (
                              typeof imagePreview === "string" ? (
                                <img
                                  src={imagePreview}
                                  alt="Profile Preview"
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <img
                                  src={URL.createObjectURL(imagePreview)}
                                  alt="Profile Preview"
                                  className="h-full w-full object-cover"
                                />
                              )
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-700 to-gray-600">
                                <FontAwesomeIcon
                                  icon={faUser}
                                  size="3x"
                                  className="opacity-70"
                                />
                              </div>
                            )}
                          </div>
                          <label className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer">
                            <div className="   bg-opacity-50 rounded-full p-2">
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
                          <label className="btn bgTheme text-white text-nowrap">
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
                          {imagePreview && (
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="inline-flex items-center px-3 py-1 border border-red-600 rounded-md shadow-sm text-sm font-medium text-red-400 bg-red-800 hover:bg-red-700"
                            >
                              <span className="mr-2">X</span>
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Personal Info */}
                    <div className="space-y-4">
                      <h3 className="text-md font-semibold text-gray-200 border-b border-gray-600 pb-2">
                        Personal Information
                      </h3>
                      {[
                        ["first_name", "First Name", "text"],
                        ["middle_name", "Middle Name", "text"],
                        ["last_name", "Last Name", "text"],
                        ["father_name", "Father's Name", "text"],
                        ["mother_name", "Mother's Name", "text"],
                      ].map(([field, label, type], i) => (
                        <div className="flex flex-col gap-1" key={i}>
                          <label className="text-sm font-semibold text-gray-400">
                            {label}
                          </label>
                          <input
                            type={type}
                            {...register(field, {
                              required:
                                field === "middle_name"
                                  ? false
                                  : `${label} is required`,
                            })}
                            className="input input-bordered w-full text-sm bg-gray-700 text-gray-200 border-gray-600"
                          />
                          {errors[field] && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors[field]?.message}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Additional Info */}
                    <div className="space-y-4 col-span-2">
                      <h3 className="text-md font-semibold text-gray-200 border-b border-gray-600 pb-2">
                        Additional Information
                      </h3>
                      {[
                        ["email", "Email", "email"],
                        ["date_of_birth", "Date of Birth", "date"],
                        ["gender", "Gender", "select"],
                        ["religion", "Religion", "text"],
                        ["category", "Category", "text"],
                        ["height", "Height (ft)", "number"],
                        ["weight", "Weight (kg)", "number"],
                        ["blood_group", "Blood Group", "text"],
                        ["number_of_siblings", "Number of Siblings", "number"],
                      ].map(([field, label, type], i) => (
                        <div className="flex flex-col gap-1" key={i}>
                          <label className="text-sm font-semibold text-gray-400">
                            {label}
                          </label>
                          {type === "select" ? (
                            <select
                              {...register(field)}
                              className="input input-bordered w-full text-sm bg-gray-700 text-gray-200 border-gray-600"
                            >
                              <option value="">Select</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          ) : (
                            <input
                              type={type}
                              {...register(field)}
                              className="input input-bordered w-full text-sm bg-gray-700 text-gray-200 border-gray-600"
                            />
                          )}
                          {errors[field] && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors[field]?.message}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Form Buttons */}
                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsDialogOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-200 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn bgTheme text-white"
                    >
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

export default StudentProfile;
