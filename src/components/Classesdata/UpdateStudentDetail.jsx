// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { fetchStudentById, updateStudentById } from "../../services/api/Api";
// import UpdateSuccessful from "../Modals/UpdateModal";
// import { useForm } from "react-hook-form";

// const UpdateStudentDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [UpdateModal, setUpdateModal] = useState(false);
//   const [updatedStudentId, setUpdatedStudentId] = useState(null);

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//   } = useForm({
//     mode: "onChange",
//     reValidateMode: "onChange",
//   });

//   const fetchStudent = async () => {
//     try {
//       const data = await fetchStudentById(id);
//       const { classes, ...rest } = data;
//       for (const key in rest) {
//         if (rest[key] !== null && rest[key] !== undefined) {
//           setValue(key, rest[key]);
//         }
//       }

//       // Ensure student stays active
//       setValue("is_active", data.is_active ?? true);
//       setValue("status", data.status ?? "active");
//     } catch (err) {
//       setError("Failed to load student data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStudent();
//   }, [id]);

//   const onSubmit = async (formData) => {
//     const payload = new FormData();

//     // ----------------- Directly append each field -----------------
//     if (formData.first_name) payload.append("first_name", formData.first_name);
//     if (formData.middle_name) payload.append("middle_name", formData.middle_name);
//     if (formData.last_name) payload.append("last_name", formData.last_name);
//     if (formData.email) payload.append("email", formData.email);
//     if (formData.date_of_birth) payload.append("date_of_birth", formData.date_of_birth);
//     if (formData.gender) payload.append("gender", formData.gender);
//     if (formData.height) payload.append("height", formData.height);
//     if (formData.weight) payload.append("weight", formData.weight);
//     if (formData.number_of_siblings !== undefined && formData.number_of_siblings !== "") {
//       payload.append("number_of_siblings", formData.number_of_siblings);
//     }
//     if (formData.father_name) payload.append("father_name", formData.father_name);
//     if (formData.mother_name) payload.append("mother_name", formData.mother_name);
//     if (formData.user_profile) payload.append("user_profile", formData.user_profile);

//     // ----------------- Ensure student remains active -----------------
//     payload.append("is_active", formData.is_active ?? true);
//     payload.append("status", formData.status ?? "active");

//     try {
//       const response = await updateStudentById(id, payload);

//       if (response && response.id) {
//         setUpdatedStudentId(response.id);
//         setUpdateModal(true);
//       } else {
//         setError("Failed to update student details.");
//       }
//     } catch (err) {
//       setError("Failed to update student details.");
//     }
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

//   return (
//     <>
//       <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen mb-24 md:mb-10">
//         <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
//           <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-gray-100">
//             <i className="fa-solid fa-pen-to-square mr-2"></i> Update Student Details
//           </h1>

//           <form
//             onSubmit={handleSubmit(onSubmit)}
//             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
//             encType="multipart/form-data"
//           >
//             {/* ------------------- ALL INPUTS ------------------- */}
//             {/* First Name */}
//             <div>
//               <label className="label">First Name</label>
//               <input
//                 type="text"
//                 placeholder="Enter First Name"
//                 {...register("first_name", {
//                   required: "First name is required",
//                   pattern: {
//                     value: /^[A-Za-z]+$/,
//                     message: "Only alphabets are allowed (A-Z)",
//                   },
//                 })}
//                 className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//               />
//               {errors.first_name && (
//                 <span className="text-red-400 text-sm mt-1">{errors.first_name.message}</span>
//               )}
//             </div>

//             {/* Middle Name */}
//             <div>
//               <label className="label">Middle Name</label>
//               <input
//                 type="text"
//                 placeholder="Enter Middle Name"
//                 {...register("middle_name", {
//                   pattern: {
//                     value: /^[A-Za-z]+$/,
//                     message: "Only alphabets are allowed (no spaces)",
//                   },
//                 })}
//                 onKeyDown={(e) => {
//                   if (e.key === " ") e.preventDefault();
//                 }}
//                 className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//               />
//               {errors.middle_name && (
//                 <span className="text-red-400 text-sm mt-0">{errors.middle_name.message}</span>
//               )}
//             </div>

//             {/* Last Name */}
//             <div>
//               <label className="label">Last Name</label>
//               <input
//                 type="text"
//                 placeholder="Enter Last Name"
//                 {...register("last_name", {
//                   required: "Last name is required",
//                   pattern: {
//                     value: /^[A-Za-z]+$/,
//                     message: "Only alphabets are allowed (A-Z)",
//                   },
//                 })}
//                 className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//               />
//               {errors.last_name && (
//                 <span className="text-red-400 text-sm mt-0">{errors.last_name.message}</span>
//               )}
//             </div>

//             {/* Email */}
//             <div>
//               <label className="label">Email</label>
//               <input
//                 type="email"
//                 placeholder="Enter Email"
//                 {...register("email", {
//                   required: "Email is required",
//                   pattern: {
//                     value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//                     message: "Invalid email format",
//                   },
//                 })}
//                 className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//               />
//               {errors.email && (
//                 <span className="text-red-400 text-sm mt-0">{errors.email.message}</span>
//               )}
//             </div>

//             {/* Date of Birth */}
//             <div>
//               <label className="label">Date of Birth</label>
//               <input
//                 type="date"
//                 {...register("date_of_birth", {
//                   required: "Date of birth is required",
//                   validate: (value) =>
//                     new Date(value) <= new Date() || "Future dates are not allowed",
//                 })}
//                 className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//               />
//               {errors.date_of_birth && (
//                 <span className="text-red-400 text-sm mt-0">{errors.date_of_birth.message}</span>
//               )}
//             </div>

//             {/* Gender */}
//             <div>
//               <label className="label">Gender</label>
//               <select
//                 {...register("gender", { required: "Gender is required" })}
//                 className="select select-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//               >
//                 <option value="">Select Gender</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//                 <option value="Other">Other</option>
//               </select>
//               {errors.gender && (
//                 <span className="text-red-400 text-sm mt-0">{errors.gender.message}</span>
//               )}
//             </div>

//             {/* Height */}
//             <div>
//               <label className="label">Height (cm)</label>
//               <input
//                 type="number"
//                 placeholder="Enter Height"
//                 {...register("height", {
//                   min: { value: 30, message: "Height must be above 30cm" },
//                   max: { value: 250, message: "Height must be below 250cm" },
//                 })}
//                 min={30}
//                 max={250}
//                 onInput={(e) => {
//                   const val = parseInt(e.target.value);
//                   if (val < 30) e.target.value = 30;
//                   if (val > 250) e.target.value = 250;
//                 }}
//                 className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//               />
//               {errors.height && (
//                 <span className="text-red-400 text-sm mt-0">{errors.height.message}</span>
//               )}
//             </div>

//             {/* Weight */}
//             <div>
//               <label className="label">Weight (kg)</label>
//               <input
//                 type="number"
//                 placeholder="Enter Weight"
//                 {...register("weight", {
//                   min: { value: 5, message: "Weight must be above 5kg" },
//                   max: { value: 200, message: "Weight must be below 200kg" },
//                 })}
//                 min={5}
//                 max={200}
//                 onInput={(e) => {
//                   const val = parseInt(e.target.value);
//                   if (val < 5) e.target.value = 5;
//                   if (val > 200) e.target.value = 200;
//                 }}
//                 className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//               />
//               {errors.weight && (
//                 <span className="text-red-400 text-sm mt-0">{errors.weight.message}</span>
//               )}
//             </div>

//             {/* Number of Siblings */}
//             <div>
//               <label className="label">Number of Siblings</label>
//               <input
//                 type="number"
//                 placeholder="Enter Number Of Siblings"
//                 {...register("number_of_siblings", {
//                   validate: (value) => {
//                     if (value === "" || value === undefined) return true;
//                     if (parseInt(value) < 0) return "Cannot be negative";
//                     if (parseInt(value) > 10) return "Maximum 10 siblings allowed";
//                     return true;
//                   },
//                 })}
//                 min={0}
//                 max={10}
//                 onKeyDown={(e) => {
//                   const currentValue = parseInt(e.target.value) || 0;
//                   if (
//                     (e.key === "ArrowDown" && currentValue <= 0) ||
//                     (e.key === "ArrowUp" && currentValue >= 10)
//                   ) {
//                     e.preventDefault();
//                   }
//                 }}
//                 className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//               />
//               {errors.number_of_siblings && (
//                 <span className="text-red-400 text-sm mt-0.5">{errors.number_of_siblings.message}</span>
//               )}
//             </div>

//             {/* Father Name */}
//             <div>
//               <label className="label">Father Name</label>
//               <input
//                 type="text"
//                 placeholder="Enter Father Name"
//                 {...register("father_name", {
//                   required: "Father name is required",
//                 })}
//                 className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//               />
//               {errors.father_name && (
//                 <span className="text-red-400 text-sm mt-0">{errors.father_name.message}</span>
//               )}
//             </div>

//             {/* Mother Name */}
//             <div>
//               <label className="label">Mother Name</label>
//               <input
//                 type="text"
//                 placeholder="Enter Mother Name"
//                 {...register("mother_name", {
//                   required: "Mother name is required",
//                 })}
//                 className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//               />
//               {errors.mother_name && (
//                 <span className="text-red-400 text-sm mt-0">{errors.mother_name.message}</span>
//               )}
//             </div>

//             {/* Profile Picture */}
//             <div className="md:col-span-2 lg:col-span-3">
//               <label className="label">Upload Profile Picture</label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => setValue("user_profile", e.target.files[0])}
//                 className="file-input file-input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//               />
//             </div>

//             {/* Submit Button */}
//             <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center mt-6">
//               <button type="submit" className="btn bgTheme text-white">
//                 <i className="fa-solid fa-floppy-disk mr-2"></i> Save Changes
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>

//       {/* Update Modal */}
//       {UpdateModal && (
//         <UpdateSuccessful
//           handleCloseOnly={() => setUpdateModal(false)}
//           handleCloseAndNavigate={() => {
//             setUpdateModal(false);
//             if (updatedStudentId) {
//               navigate(`/studentDetails/${updatedStudentId}`);
//             }
//           }}
//         />
//       )}
//     </>
//   );
// };

// export default UpdateStudentDetail;


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchStudentById, updateStudentById } from "../../services/api/Api";
import UpdateSuccessful from "../Modals/UpdateModal";
import { useForm } from "react-hook-form";

const UpdateStudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [UpdateModal, setUpdateModal] = useState(false);
  const [updatedStudentId, setUpdatedStudentId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Add submitting state

  // Image states
  const [imagePreview, setImagePreview] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Store user ID for update API (important!)
  const [userId, setUserId] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const fetchStudent = async () => {
    try {
      const data = await fetchStudentById(id);
      const { classes, ...rest } = data;

      // Store user ID - yeh update API mein use hoga
      setUserId(data.user);

      for (const key in rest) {
        if (rest[key] !== null && rest[key] !== undefined) {
          setValue(key, rest[key]);
        }
      }

      // Set current image if exists (URL already complete hai API se)
      if (data.user_profile) {
        setImagePreview(data.user_profile);
      }

      // Ensure student stays active
      setValue("is_active", data.active ?? true);
      setValue("status", data.status ?? "active");
    } catch (err) {
      setError("Failed to load student data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, [id]);

  // Handle image selection
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImagePreview(file);
      setRemoveImage(false);
    }
  };

  // Handle image removal
  const handleRemoveImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
    setRemoveImage(true);
  };

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    setError(null); // Clear any previous errors
    
    const payload = new FormData();

    // Send user ID in payload
    payload.append("user", userId);

    // Append all fields
    if (formData.first_name) payload.append("first_name", formData.first_name);
    if (formData.middle_name) payload.append("middle_name", formData.middle_name);
    if (formData.last_name) payload.append("last_name", formData.last_name);
    if (formData.email) payload.append("email", formData.email);
    if (formData.date_of_birth) payload.append("date_of_birth", formData.date_of_birth);
    if (formData.gender) payload.append("gender", formData.gender);
    if (formData.height) payload.append("height", formData.height);
    if (formData.weight) payload.append("weight", formData.weight);
    if (formData.number_of_siblings !== undefined && formData.number_of_siblings !== "") {
      payload.append("number_of_siblings", formData.number_of_siblings);
    }
    if (formData.father_name) payload.append("father_name", formData.father_name);
    if (formData.mother_name) payload.append("mother_name", formData.mother_name);

    // Handle image upload/removal
    if (removeImage) {
      payload.append("user_profile", "");
    } else if (selectedFile && selectedFile instanceof File) {
      payload.append("user_profile", selectedFile);
    }

    // Ensure student remains active
    payload.append("is_active", formData.is_active ?? true);
    payload.append("status", formData.status ?? "active");

    try {
      // Use userId for update API (not id from params)
      const response = await updateStudentById(userId, payload);

      // Check if response exists (successful update)
      if (response) {
        // Use the original id from params for navigation
        setUpdatedStudentId(id); 
        setUpdateModal(true);
        
        // Auto navigate after 2 seconds
        setTimeout(() => {
          navigate(`/studentDetails/${id}`);
        }, 2000);
      }
    } catch (err) {
      console.error("Update error:", err);
      
      // Better error handling
      const errorMessage = err?.message || err?.detail || "Failed to update student details. Please try again.";
      setError(errorMessage);
      
      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <>
      <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen mb-24 md:mb-10">
        <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-gray-100">
            <i className="fa-solid fa-pen-to-square mr-2"></i> Update Student Details
          </h1>

          {/* Error Message Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
              <i className="fa-solid fa-triangle-exclamation mr-2"></i>
              <span>{error}</span>
              <button 
                onClick={() => setError(null)} 
                className="ml-auto text-red-700 hover:text-red-900"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          )}

          {/* Success Message */}
          {UpdateModal && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              <i className="fa-solid fa-check-circle mr-2"></i>
              <span>Profile updated successfully! Redirecting...</span>
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            encType="multipart/form-data"
          >
            {/* Profile Picture Section */}
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Profile Picture
              </h3>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Image Preview */}
                <div className="relative group">
                  <div className="h-32 w-32 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden shadow-md border-2 border-gray-300 dark:border-gray-500">
                    {imagePreview ? (
                      typeof imagePreview === "string" ? (
                        <img
                          src={imagePreview}
                          alt="Profile"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <ImagePreviewFromFile file={imagePreview} />
                      )
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400">
                        <i className="fa-solid fa-user text-4xl"></i>
                      </div>
                    )}
                  </div>
                </div>

                {/* Image Controls */}
                <div className="flex flex-col gap-3">
                  <label className="btn bgTheme text-white cursor-pointer">
                    <i className="fa-solid fa-camera mr-2"></i>
                    {imagePreview ? "Change Photo" : "Upload Photo"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={isSubmitting}
                    />
                  </label>

                  {imagePreview && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="btn btn-outline btn-error"
                      disabled={isSubmitting}
                    >
                      <i className="fa-solid fa-trash mr-2"></i>
                      Remove Photo
                    </button>
                  )}

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Allowed formats: JPG, PNG, GIF (Max: 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* First Name */}
              <div>
                <label className="label">First Name</label>
                <input
                  type="text"
                  placeholder="Enter First Name"
                  {...register("first_name", {
                    required: "First name is required",
                    pattern: {
                      value: /^[A-Za-z]+$/,
                      message: "Only alphabets are allowed (A-Z)",
                    },
                  })}
                  className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                  disabled={isSubmitting}
                />
                {errors.first_name && (
                  <span className="text-red-400 text-sm mt-1">
                    {errors.first_name.message}
                  </span>
                )}
              </div>

              {/* Middle Name */}
              <div>
                <label className="label">Middle Name</label>
                <input
                  type="text"
                  placeholder="Enter Middle Name"
                  {...register("middle_name", {
                    pattern: {
                      value: /^[A-Za-z]*$/,
                      message: "Only alphabets are allowed (no spaces)",
                    },
                  })}
                  onKeyDown={(e) => {
                    if (e.key === " ") e.preventDefault();
                  }}
                  className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                  disabled={isSubmitting}
                />
                {errors.middle_name && (
                  <span className="text-red-400 text-sm mt-0">
                    {errors.middle_name.message}
                  </span>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="label">Last Name</label>
                <input
                  type="text"
                  placeholder="Enter Last Name"
                  {...register("last_name", {
                    required: "Last name is required",
                    pattern: {
                      value: /^[A-Za-z]+$/,
                      message: "Only alphabets are allowed (A-Z)",
                    },
                  })}
                  className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                  disabled={isSubmitting}
                />
                {errors.last_name && (
                  <span className="text-red-400 text-sm mt-0">
                    {errors.last_name.message}
                  </span>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  placeholder="Enter Email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format",
                    },
                  })}
                  className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <span className="text-red-400 text-sm mt-0">
                    {errors.email.message}
                  </span>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="label">Date of Birth</label>
                <input
                  type="date"
                  {...register("date_of_birth", {
                    required: "Date of birth is required",
                    validate: (value) =>
                      new Date(value) <= new Date() ||
                      "Future dates are not allowed",
                  })}
                  className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                  disabled={isSubmitting}
                />
                {errors.date_of_birth && (
                  <span className="text-red-400 text-sm mt-0">
                    {errors.date_of_birth.message}
                  </span>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="label">Gender</label>
                <select
                  {...register("gender", { required: "Gender is required" })}
                  className="select select-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                  disabled={isSubmitting}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && (
                  <span className="text-red-400 text-sm mt-0">
                    {errors.gender.message}
                  </span>
                )}
              </div>

              {/* Height */}
              <div>
                <label className="label">Height (cm)</label>
                <input
                  type="number"
                  placeholder="Enter Height"
                  {...register("height", {
                    min: { value: 30, message: "Height must be above 30cm" },
                    max: { value: 250, message: "Height must be below 250cm" },
                  })}
                  min={30}
                  max={250}
                  onInput={(e) => {
                    const val = parseInt(e.target.value);
                    if (val < 30) e.target.value = 30;
                    if (val > 250) e.target.value = 250;
                  }}
                  className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                  disabled={isSubmitting}
                />
                {errors.height && (
                  <span className="text-red-400 text-sm mt-0">
                    {errors.height.message}
                  </span>
                )}
              </div>

              {/* Weight */}
              <div>
                <label className="label">Weight (kg)</label>
                <input
                  type="number"
                  placeholder="Enter Weight"
                  {...register("weight", {
                    min: { value: 5, message: "Weight must be above 5kg" },
                    max: { value: 200, message: "Weight must be below 200kg" },
                  })}
                  min={5}
                  max={200}
                  onInput={(e) => {
                    const val = parseInt(e.target.value);
                    if (val < 5) e.target.value = 5;
                    if (val > 200) e.target.value = 200;
                  }}
                  className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                  disabled={isSubmitting}
                />
                {errors.weight && (
                  <span className="text-red-400 text-sm mt-0">
                    {errors.weight.message}
                  </span>
                )}
              </div>

              {/* Number of Siblings */}
              <div>
                <label className="label">Number of Siblings</label>
                <input
                  type="number"
                  placeholder="Enter Number Of Siblings"
                  {...register("number_of_siblings", {
                    validate: (value) => {
                      if (value === "" || value === undefined) return true;
                      if (parseInt(value) < 0) return "Cannot be negative";
                      if (parseInt(value) > 10)
                        return "Maximum 10 siblings allowed";
                      return true;
                    },
                  })}
                  min={0}
                  max={10}
                  onKeyDown={(e) => {
                    const currentValue = parseInt(e.target.value) || 0;
                    if (
                      (e.key === "ArrowDown" && currentValue <= 0) ||
                      (e.key === "ArrowUp" && currentValue >= 10)
                    ) {
                      e.preventDefault();
                    }
                  }}
                  className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                  disabled={isSubmitting}
                />
                {errors.number_of_siblings && (
                  <span className="text-red-400 text-sm mt-0.5">
                    {errors.number_of_siblings.message}
                  </span>
                )}
              </div>

              {/* Father Name */}
              <div>
                <label className="label">Father Name</label>
                <input
                  type="text"
                  placeholder="Enter Father Name"
                  {...register("father_name", {
                    required: "Father name is required",
                  })}
                  className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                  disabled={isSubmitting}
                />
                {errors.father_name && (
                  <span className="text-red-400 text-sm mt-0">
                    {errors.father_name.message}
                  </span>
                )}
              </div>

              {/* Mother Name */}
              <div>
                <label className="label">Mother Name</label>
                <input
                  type="text"
                  placeholder="Enter Mother Name"
                  {...register("mother_name", {
                    required: "Mother name is required",
                  })}
                  className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                  disabled={isSubmitting}
                />
                {errors.mother_name && (
                  <span className="text-red-400 text-sm mt-0">
                    {errors.mother_name.message}
                  </span>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center mt-6">
              <button 
                type="submit" 
                className="btn bgTheme text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
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
    </>
  );
};

/* Helper Component for File Preview */
const ImagePreviewFromFile = ({ file }) => {
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

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

export default UpdateStudentDetail;
