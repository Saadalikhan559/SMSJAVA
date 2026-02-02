// import { useState, useEffect, useContext, useRef } from "react";
// import { useForm, useFieldArray } from "react-hook-form";
// import {
//   fetchSchoolYear,
//   fetchYearLevels,
//   fetchAllTeachers,
//   fetchTerms,
//   fetchStudents1,
// } from "../../services/api/Api";
// import { AuthContext } from "../../context/AuthContext";

// // Constants for entry types
// const ENTRY_TYPES = {
//   SCHOLASTIC: "SCHOLASTIC",
//   NON_SCHOLASTIC: "NON_SCHOLASTIC",
//   PERSONAL_SOCIAL: "PERSONAL_SOCIAL",
// };

// const ENTRY_TYPE_LABELS = {
//   SCHOLASTIC: "Scholastic Evaluation",
//   NON_SCHOLASTIC: "Non-Scholastic Evaluation",
//   PERSONAL_SOCIAL: "Personal & Social Qualities",
// };

// const UnifiedMarksheet = () => {
//   const { axiosInstance } = useContext(AuthContext);

//   // ==================== STATE MANAGEMENT ====================

//   // Common dropdown data
//   const [schoolYears, setSchoolYears] = useState([]);
//   const [yearLevels, setYearLevels] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [terms, setTerms] = useState([]);
//   const [teachers, setTeachers] = useState([]);

//   // Entry type specific data
//   const [examTypes, setExamTypes] = useState([]);
//   const [scholasticSubjects, setScholasticSubjects] = useState([]);
//   const [nonScholasticSubjects, setNonScholasticSubjects] = useState([]);
//   const [personalQualities, setPersonalQualities] = useState([]);

//   // Selected entry type
//   const [selectedEntryType, setSelectedEntryType] = useState(
//     ENTRY_TYPES.SCHOLASTIC
//   );

//   // UI state
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertMessage, setAlertMessage] = useState("");
//   const [alertType, setAlertType] = useState("success");
//   const [selectedClassId, setSelectedClassId] = useState(null);
//   const [loadingStudents, setLoadingStudents] = useState(false);
//   const [loadingData, setLoadingData] = useState(false);

//   // Student dropdown state
//   const [searchStudentInput, setSearchStudentInput] = useState("");
//   const [showStudentDropdown, setShowStudentDropdown] = useState(false);
//   const [selectedStudentName, setSelectedStudentName] = useState("");
//   const [selectedStudentId, setSelectedStudentId] = useState("");

//   const studentDropdownRef = useRef(null);

//   // ==================== FORM SETUP ====================

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     reset,
//     watch,
//     control,
//     formState: { errors, isSubmitting },
//   } = useForm({
//     defaultValues: {
//       school_year: "",
//       year_level: "",
//       student: "",
//       term: "",
//       exam_type: "", // ⭐ Moved to common fields
//       entry_type: ENTRY_TYPES.SCHOLASTIC,
//       entries: [],
//     },
//   });

//   const { fields, append, remove, replace } = useFieldArray({
//     control,
//     name: "entries",
//   });

//   // Watch form values
//   const watchedEntryType = watch("entry_type");
//   const watchedYearLevel = watch("year_level");
//   const watchedTerm = watch("term");
//   const watchedExamType = watch("exam_type"); // ⭐ Watch exam type

//   // ==================== DATA FETCHING ====================

//   const fetchSchoolYears = async () => {
//     try {
//       const data = await fetchSchoolYear();
//       setSchoolYears(data);
//     } catch (err) {
//       console.error("Failed to load school years:", err);
//     }
//   };

//   const fetchYearLevelsData = async () => {
//     try {
//       const data = await fetchYearLevels();
//       setYearLevels(data);
//     } catch (err) {
//       console.error("Failed to load year levels:", err);
//     }
//   };

//   const fetchTermsData = async () => {
//     try {
//       const data = await fetchTerms();
//       setTerms(data);
//     } catch (err) {
//       console.error("Failed to load terms:", err);
//     }
//   };

//   const fetchTeachersData = async () => {
//     try {
//       const data = await fetchAllTeachers();
//       setTeachers(data);
//     } catch (err) {
//       console.error("Failed to load teachers:", err);
//     }
//   };

//   const fetchExamTypes = async () => {
//     try {
//       const response = await axiosInstance.get("/d/Exam-Type/");
//       setExamTypes(response.data);
//     } catch (err) {
//       console.error("Failed to load exam types:", err);
//     }
//   };

//   const fetchScholasticSubjects = async (yearLevelId) => {
//     if (!yearLevelId) return;
//     setLoadingData(true);
//     try {
//       const response = await axiosInstance.get(
//         `/d/subject/?core_subject=true&year_level=${yearLevelId}`
//       );
//       setScholasticSubjects(response.data);
//     } catch (err) {
//       console.error("Failed to load scholastic subjects:", err);
//       setScholasticSubjects([]);
//     } finally {
//       setLoadingData(false);
//     }
//   };

//   const fetchNonScholasticSubjects = async () => {
//     try {
//       const response = await axiosInstance.get(
//         `/d/subject/?department=Non-Scholastic`
//       );
//       setNonScholasticSubjects(response.data);
//     } catch (err) {
//       console.error("Failed to load non-scholastic subjects:", err);
//     }
//   };


//   const fetchPersonalQualities = async () => {
//     try {
//       const response = await axiosInstance.get("/d/personal-social-quality/");
//       setPersonalQualities(response.data);
//     } catch (err) {
//       console.error("Failed to load personal qualities:", err);
//     }
//   };

//   const fetchStudents = async (classId) => {
//     if (!classId) {
//       setStudents([]);
//       return;
//     }
//     setLoadingStudents(true);
//     try {
//       const data = await fetchStudents1(classId);
//       setStudents(data);
//     } catch (err) {
//       console.error("Failed to load students:", err);
//       setStudents([]);
//     } finally {
//       setLoadingStudents(false);
//     }
//   };

//   // ==================== INITIAL LOAD ====================

//   useEffect(() => {
//     fetchSchoolYears();
//     fetchYearLevelsData();
//     fetchTermsData();
//     fetchTeachersData();
//     fetchExamTypes();
//     fetchNonScholasticSubjects();
//     fetchPersonalQualities();
//   }, []);

//   // ==================== DYNAMIC ENTRIES BASED ON TYPE ====================

//   useEffect(() => {
//     // Clear entries when entry type changes
//     replace([]);

//     if (
//       selectedEntryType === ENTRY_TYPES.SCHOLASTIC &&
//       scholasticSubjects.length > 0
//     ) {
//       const newEntries = scholasticSubjects.map((subject) => ({
//         subject_id: subject.id,
//         subject_name: subject.subject_name,
//         teacher_id: "",
//         marks: "",
//       }));
//       replace(newEntries);
//     } else if (
//       selectedEntryType === ENTRY_TYPES.NON_SCHOLASTIC &&
//       nonScholasticSubjects.length > 0
//     ) {
//       const newEntries = nonScholasticSubjects.map((subject) => ({
//         subject_id: subject.id,
//         subject_name: subject.subject_name,
//         grade: "",
//       }));
//       replace(newEntries);
//     } else if (
//       selectedEntryType === ENTRY_TYPES.PERSONAL_SOCIAL &&
//       personalQualities.length > 0
//     ) {
//       const newEntries = personalQualities.map((quality) => ({
//         quality_id: quality.id,
//         quality_name: quality.quality_name,
//         description: quality.description,
//         grade: "",
//       }));
//       replace(newEntries);
//     }
//   }, [
//     selectedEntryType,
//     scholasticSubjects,
//     nonScholasticSubjects,
//     personalQualities,
//     replace,
//   ]);

//   // ==================== EVENT HANDLERS ====================

//   const handleEntryTypeChange = (type) => {
//     setSelectedEntryType(type);
//     setValue("entry_type", type);
//     // Clear exam type when switching away from scholastic
//     if (type !== ENTRY_TYPES.SCHOLASTIC) {
//       setValue("exam_type", "");
//     }
//   };

//   const handleClassChange = (e) => {
//     const classId = e.target.value;
//     setSelectedClassId(classId);
//     setSelectedStudentId("");
//     setSelectedStudentName("");
//     setValue("student", "");
//     replace([]);

//     if (classId) {
//       fetchStudents(classId);
//       if (selectedEntryType === ENTRY_TYPES.SCHOLASTIC) {
//         fetchScholasticSubjects(classId);
//       }
//     } else {
//       setStudents([]);
//       setScholasticSubjects([]);
//     }
//   };

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         studentDropdownRef.current &&
//         !studentDropdownRef.current.contains(event.target)
//       ) {
//         setShowStudentDropdown(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Filter students for search
//   const filteredStudents = students
//     .filter((student) =>
//       student.student_name
//         .toLowerCase()
//         .includes(searchStudentInput.toLowerCase())
//     )
//     .sort((a, b) => a.student_name.localeCompare(b.student_name));

//   // ==================== FORM SUBMISSION ====================

//   // const onSubmit = async (data) => {
//   //   try {
//   //     // const basePayload = {
//   //     //   student: parseInt(selectedStudentId),
//   //     //   school_year: parseInt(data.school_year),
//   //     //   year_level: parseInt(data.year_level),
//   //     //   term: parseInt(data.term),
//   //     //   entry_type: selectedEntryType,
//   //     // };

//   //     const basePayload = {
//   //       student: parseInt(selectedStudentId),

//   //       school_year_id: parseInt(data.school_year),
//   //       year_level_id: parseInt(data.year_level),
//   //       term_id: parseInt(data.term),

//   //       entry_type: selectedEntryType,
//   //     };


//   //     let payloads = [];

//   //     if (selectedEntryType === ENTRY_TYPES.SCHOLASTIC) {
//   //       // ⭐ Use the single exam_type for all entries
//   //       const selectedExamType = parseInt(data.exam_type);

//   //       payloads = data.entries
//   //         .filter((entry) => entry.marks)
//   //         .map((entry) => ({
//   //           ...basePayload,
//   //           exam_type: selectedExamType, // ⭐ Same exam type for all
//   //           subject: parseInt(entry.subject_id),
//   //           marks: parseInt(entry.marks),
//   //           grade: null,
//   //           personal_quality: null,
//   //         }));
//   //     } else if (selectedEntryType === ENTRY_TYPES.NON_SCHOLASTIC) {
//   //       payloads = data.entries
//   //         .filter((entry) => entry.grade && entry.grade.trim() !== "")
//   //         .map((entry) => ({
//   //           ...basePayload,
//   //           subject: parseInt(entry.subject_id),
//   //           grade: entry.grade.trim(),
//   //           exam_type: null,
//   //           marks: null,
//   //           personal_quality: null,
//   //         }));
//   //     } else if (selectedEntryType === ENTRY_TYPES.PERSONAL_SOCIAL) {
//   //       payloads = data.entries
//   //         .filter((entry) => entry.grade && entry.grade.trim() !== "")
//   //         .map((entry) => ({
//   //           ...basePayload,
//   //           personal_quality: parseInt(entry.quality_id),
//   //           grade: entry.grade.trim(),
//   //           exam_type: null,
//   //           subject: null,
//   //           marks: null,
//   //         }));
//   //     }

//   //     if (payloads.length === 0) {
//   //       setAlertType("error");
//   //       setAlertMessage(
//   //         "Please fill in at least one entry before submitting."
//   //       );
//   //       setShowAlert(true);
//   //       return;
//   //     }

//   //     // Submit all payloads
//   //     const promises = payloads.map((payload) =>
//   //       axiosInstance.post("/d/Student-Marks/create_marks/", payload)
//   //     );

//   //     await Promise.all(promises);

//   //     setAlertType("success");
//   //     setAlertMessage(
//   //       `${ENTRY_TYPE_LABELS[selectedEntryType]} submitted successfully! ${payloads.length} entries saved.`
//   //     );
//   //     setShowAlert(true);

//   //     // Reset form
//   //     reset();
//   //     setSelectedStudentId("");
//   //     setSelectedStudentName("");
//   //     replace([]);
//   //   } catch (error) {
//   //     console.error("Submission error:", error);
//   //     const errorMsg =
//   //       error.response?.data?.error ||
//   //       error.response?.data?.message ||
//   //       "An error occurred during submission.";
//   //     setAlertType("error");
//   //     setAlertMessage(errorMsg);
//   //     setShowAlert(true);
//   //   }
//   // };


//   // ==================== FORM SUBMISSION ====================

// const onSubmit = async (data) => {
//   try {
//     // Validation checks
//     if (!selectedStudentId) {
//       setAlertType("error");
//       setAlertMessage("Please select a student.");
//       setShowAlert(true);
//       return;
//     }

//     if (!data.school_year) {
//       setAlertType("error");
//       setAlertMessage("Please select a school year.");
//       setShowAlert(true);
//       return;
//     }

//     if (!data.year_level) {
//       setAlertType("error");
//       setAlertMessage("Please select a year level.");
//       setShowAlert(true);
//       return;
//     }

//     if (!data.term) {
//       setAlertType("error");
//       setAlertMessage("Please select a term.");
//       setShowAlert(true);
//       return;
//     }

//     // ✅ CORRECT PAYLOAD - Use field names without _id suffix
//     const basePayload = {
//       student: parseInt(selectedStudentId),
//       school_year: parseInt(data.school_year),
//       year_level: parseInt(data.year_level),
//       term: parseInt(data.term),
//     };

//     console.log("🚀 Base Payload:", basePayload);

//     let payloads = [];

//     if (selectedEntryType === ENTRY_TYPES.SCHOLASTIC) {
//       if (!data.exam_type) {
//         setAlertType("error");
//         setAlertMessage("Please select an exam type for scholastic evaluation.");
//         setShowAlert(true);
//         return;
//       }

//       payloads = data.entries
//         .filter((entry) => entry.marks !== "" && entry.marks !== null)
//         .map((entry) => ({
//           ...basePayload,
//           exam_type: parseInt(data.exam_type),
//           subject: parseInt(entry.subject_id),
//           marks: parseInt(entry.marks),
//           teacher: entry.teacher_id ? parseInt(entry.teacher_id) : null,
//           grade: null,
//           personal_quality: null,
//         }));

//     } else if (selectedEntryType === ENTRY_TYPES.NON_SCHOLASTIC) {
//       payloads = data.entries
//         .filter((entry) => entry.grade && entry.grade.trim() !== "")
//         .map((entry) => ({
//           ...basePayload,
//           subject: parseInt(entry.subject_id),
//           grade: entry.grade.trim().toUpperCase(),
//           exam_type: null,
//           marks: null,
//           personal_quality: null,
//         }));

//     } else if (selectedEntryType === ENTRY_TYPES.PERSONAL_SOCIAL) {
//       payloads = data.entries
//         .filter((entry) => entry.grade && entry.grade.trim() !== "")
//         .map((entry) => ({
//           ...basePayload,
//           personal_quality: parseInt(entry.quality_id),
//           grade: entry.grade.trim().toUpperCase(),
//           exam_type: null,
//           subject: null,
//           marks: null,
//         }));
//     }

//     if (payloads.length === 0) {
//       setAlertType("error");
//       setAlertMessage("Please fill in at least one entry before submitting.");
//       setShowAlert(true);
//       return;
//     }

//     console.log("📦 Final Payloads:", payloads);

//     // Submit all payloads
//     const promises = payloads.map((payload) =>
//       axiosInstance.post("/d/Student-Marks/create_marks/", payload)
//     );

//     await Promise.all(promises);

//     setAlertType("success");
//     setAlertMessage(
//       `${ENTRY_TYPE_LABELS[selectedEntryType]} submitted successfully!\n${payloads.length} entries saved.`
//     );
//     setShowAlert(true);

//     // Reset form
//     reset();
//     setSelectedStudentId("");
//     setSelectedStudentName("");
//     setSearchStudentInput("");
//     replace([]);

//   } catch (error) {
//     console.error("❌ Submission error:", error);
//     console.error("❌ Error response:", error.response?.data);

//     let errorMsg = "An error occurred during submission.";

//     if (error.response?.data) {
//       const errorData = error.response.data;

//       if (typeof errorData === "object" && !Array.isArray(errorData)) {
//         errorMsg = Object.entries(errorData)
//           .map(([field, messages]) => {
//             const msgText = Array.isArray(messages)
//               ? messages.join(", ")
//               : messages;
//             return `${field}: ${msgText}`;
//           })
//           .join("\n");
//       } else if (errorData.error) {
//         errorMsg = errorData.error;
//       } else if (errorData.message) {
//         errorMsg = errorData.message;
//       } else if (typeof errorData === "string") {
//         errorMsg = errorData;
//       }
//     }

//     setAlertType("error");
//     setAlertMessage(errorMsg);
//     setShowAlert(true);
//   }
// };

//   // ==================== RENDER HELPERS ====================

//   {/* ⭐ Entry Type Selector with more bottom margin */ }
//   const renderEntryTypeSelector = () => (
//     <div className="col-span-full mb-10">
//       <label className="block text-2xl font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
//         Evaluation Type
//       </label>
//       <div className="flex flex-wrap gap-2 justify-center">
//         {Object.entries(ENTRY_TYPES).map(([key, value]) => (
//           <button
//             key={key}
//             type="button"
//             onClick={() => handleEntryTypeChange(value)}
//             className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${selectedEntryType === value
//               ? "bgTheme text-white shadow-md"
//               : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
//               }`}
//           >
//             <i
//               className={`fa-solid ${value === ENTRY_TYPES.SCHOLASTIC
//                 ? "fa-book"
//                 : value === ENTRY_TYPES.NON_SCHOLASTIC
//                   ? "fa-palette"
//                   : "fa-heart"
//                 } mr-2`}
//             ></i>
//             {ENTRY_TYPE_LABELS[value]}
//           </button>
//         ))}
//       </div>
//     </div>
//   );

//   // ⭐ Updated Scholastic Entries - Removed exam_type column from table
//   const renderScholasticEntries = () => (
//     <div className="col-span-full mt-6">
//       <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 border-b-2 border-gray-300 dark:border-gray-600 pb-2">
//         <i className="fa-solid fa-book mr-2"></i>
//         Scholastic Evaluation - Subject Marks
//       </h3>

//       {/* ⭐ Show selected exam type badge */}
//       {watchedExamType && (
//         <div className="mb-4 flex items-center gap-2">
//           <span className="text-sm text-gray-600 dark:text-gray-400">
//             Selected Exam:
//           </span>
//           <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
//             {examTypes.find((e) => e.id === parseInt(watchedExamType))?.name ||
//               "Unknown"}
//           </span>
//         </div>
//       )}

//       {loadingData ? (
//         <div className="flex justify-center py-8">
//           <i className="fa-solid fa-spinner fa-spin text-2xl text-gray-500"></i>
//           <span className="ml-2 text-gray-500">Loading subjects...</span>
//         </div>
//       ) : fields.length > 0 ? (
//         <div className="overflow-x-auto">
//           <table className="table w-full dark:text-gray-200">
//             <thead>
//               <tr className="bg-gray-100 dark:bg-gray-700">
//                 <th className="text-left w-1/12">#</th>
//                 <th className="text-left w-4/12">Subject</th>
//                 <th className="text-left w-4/12">
//                   Teacher <span className="text-error">*</span>
//                 </th>
//                 <th className="text-left w-3/12">
//                   Marks <span className="text-error">*</span>
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {fields.map((field, index) => (
//                 <tr
//                   key={field.id}
//                   className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b dark:border-gray-700"
//                 >
//                   <td className="py-4 text-gray-500 dark:text-gray-400">
//                     {index + 1}
//                   </td>
//                   <td className="py-4">
//                     <p className="font-medium text-gray-800 dark:text-gray-100">
//                       {field.subject_name}
//                     </p>
//                     <input
//                       type="hidden"
//                       {...register(`entries.${index}.subject_id`)}
//                     />
//                   </td>
//                   <td className="py-4">
//                     <select
//                       {...register(`entries.${index}.teacher_id`, {
//                         required: "Teacher is required",
//                       })}
//                       className="select select-bordered w-full focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
//                     >
//                       <option value="">Select Teacher</option>
//                       {teachers.map((teacher) => (
//                         <option key={teacher.id} value={teacher.id}>
//                           {teacher.first_name} {teacher.last_name}
//                         </option>
//                       ))}
//                     </select>
//                     {errors.entries?.[index]?.teacher_id && (
//                       <p className="text-red-500 text-xs mt-1">
//                         {errors.entries[index].teacher_id.message}
//                       </p>
//                     )}
//                   </td>
//                   <td className="py-4">
//                     <input
//                       type="number"
//                       placeholder="0-100"
//                       {...register(`entries.${index}.marks`, {
//                         required: "Marks required",
//                         min: { value: 0, message: "Min 0" },
//                         max: { value: 100, message: "Max 100" },
//                         valueAsNumber: true,
//                       })}
//                       className="input input-bordered w-full focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
//                     />
//                     {errors.entries?.[index]?.marks && (
//                       <p className="text-red-500 text-xs mt-1">
//                         {errors.entries[index].marks.message}
//                       </p>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div className="p-6 text-center text-gray-500 dark:text-gray-400 border-2 border-dashed rounded-lg">
//           <i className="fa-solid fa-info-circle text-2xl mb-2"></i>
//           <p>Please select a Year Level to load subjects.</p>
//         </div>
//       )}
//     </div>
//   );

//   const renderNonScholasticEntries = () => (
//     <div className="col-span-full mt-6">
//       <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 border-b-2 border-gray-300 dark:border-gray-600 pb-2">
//         <i className="fa-solid fa-palette mr-2"></i>
//         Non-Scholastic Evaluation
//       </h3>

//       {fields.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {fields.map((field, index) => (
//             <div
//               key={field.id}
//               className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50 hover:shadow-md transition-shadow"
//             >
//               <div className="mb-3">
//                 <h4 className="font-medium text-gray-800 dark:text-gray-200">
//                   {field.subject_name}
//                 </h4>
//                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                   Non-Scholastic Activity
//                 </p>
//               </div>
//               <input
//                 type="hidden"
//                 {...register(`entries.${index}.subject_id`)}
//               />
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
//                   Grade
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="A, B, C, D, E"
//                   maxLength={2}
//                   {...register(`entries.${index}.grade`)}
//                   className="input input-bordered w-full focus:outline-none dark:bg-gray-600 dark:text-white dark:border-gray-500"
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="p-6 text-center text-gray-500 dark:text-gray-400 border-2 border-dashed rounded-lg">
//           <i className="fa-solid fa-info-circle text-2xl mb-2"></i>
//           <p>No non-scholastic subjects available.</p>
//         </div>
//       )}
//     </div>
//   );

//   const renderPersonalQualityEntries = () => (
//     <div className="col-span-full mt-6">
//       <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 border-b-2 border-gray-300 dark:border-gray-600 pb-2">
//         <i className="fa-solid fa-heart mr-2"></i>
//         Personal & Social Qualities
//       </h3>

//       {fields.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {fields.map((field, index) => (
//             <div
//               key={field.id}
//               className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50 hover:shadow-md transition-shadow"
//             >
//               <div className="mb-3">
//                 <h4 className="font-medium text-gray-800 dark:text-gray-200">
//                   {field.quality_name}
//                 </h4>
//                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                   {field.description || "Personal quality assessment"}
//                 </p>
//               </div>
//               <input
//                 type="hidden"
//                 {...register(`entries.${index}.quality_id`)}
//               />
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
//                   Grade
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="A+, A, B+, B, C"
//                   maxLength={2}
//                   {...register(`entries.${index}.grade`)}
//                   className="input input-bordered w-full focus:outline-none dark:bg-gray-600 dark:text-white dark:border-gray-500"
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="p-6 text-center text-gray-500 dark:text-gray-400 border-2 border-dashed rounded-lg">
//           <i className="fa-solid fa-info-circle text-2xl mb-2"></i>
//           <p>No personal qualities available.</p>
//         </div>
//       )}
//     </div>
//   );

//   // ==================== MAIN RENDER ====================

//   return (
//     <div className="min-h-screen p-5 bg-gray-50 dark:bg-gray-900 mb-24 md:mb-10">
//       <div className="w-full max-w-7xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-box my-5 shadow-sm dark:shadow-gray-700">
//         <form onSubmit={handleSubmit(onSubmit)}>
//           {/* Header */}
//           <div className="text-center mb-8">
//             <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
//               <i className="fa-solid fa-file-lines mr-3"></i>
//               Create Marksheet
//             </h1>
//             <p className="text-gray-500 dark:text-gray-400 mt-2">
//               Manage all types of student evaluations in one place
//             </p>
//           </div>


//           {/* ⭐ Common Fields - Wider Dropdowns */}
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-10">
//             {/* School Year */}
//             <div>
//               <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 School Year <span className="text-error">*</span>
//               </label>
//               <select
//                 {...register("school_year", {
//                   required: "School year is required",
//                 })}
//                 className="select select-bordered w-full focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
//               >
//                 <option value="">Select Year</option>
//                 {schoolYears.map((year) => (
//                   <option key={year.id} value={year.id}>
//                     {year.year_name}
//                   </option>
//                 ))}
//               </select>
//               {errors.school_year && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {errors.school_year.message}
//                 </p>
//               )}
//             </div>

//             {/* Year Level */}
//             <div>
//               <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Year Level <span className="text-error">*</span>
//               </label>
//               <select
//                 {...register("year_level", {
//                   required: "Year level is required",
//                 })}
//                 onChange={handleClassChange}
//                 className="select select-bordered w-full focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
//               >
//                 <option value="">Select Level</option>
//                 {yearLevels.map((level) => (
//                   <option key={level.id} value={level.id}>
//                     {level.level_name}
//                   </option>
//                 ))}
//               </select>
//               {errors.year_level && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {errors.year_level.message}
//                 </p>
//               )}
//             </div>

//             {/* Term */}
//             <div>
//               <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Term <span className="text-error">*</span>
//               </label>
//               <select
//                 {...register("term", {
//                   required: "Term is required",
//                 })}
//                 className="select select-bordered w-full focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
//               >
//                 <option value="">Select Term</option>
//                 {terms.map((term) => (
//                   <option key={term.id} value={term.id}>
//                     Term {term.term_number}
//                   </option>
//                 ))}
//               </select>
//               {errors.term && (
//                 <p className="text-red-500 text-xs mt-1">{errors.term.message}</p>
//               )}
//             </div>

//             {/* Exam Type - Only for Scholastic */}
//             {selectedEntryType === ENTRY_TYPES.SCHOLASTIC && (
//               <div>
//                 <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Exam Type <span className="text-error">*</span>
//                 </label>
//                 <select
//                   {...register("exam_type", {
//                     required:
//                       selectedEntryType === ENTRY_TYPES.SCHOLASTIC
//                         ? "Exam type is required"
//                         : false,
//                   })}
//                   className="select select-bordered w-full focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
//                 >
//                   <option value="">Select Exam</option>
//                   {examTypes.map((type) => (
//                     <option key={type.id} value={type.id}>
//                       {type.name}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.exam_type && (
//                   <p className="text-red-500 text-xs mt-1">
//                     {errors.exam_type.message}
//                   </p>
//                 )}
//               </div>
//             )}

//             {/* Student */}
//             <div className="relative" ref={studentDropdownRef}>
//               <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Student <span className="text-error">*</span>
//               </label>
//               <div
//                 className="input input-bordered w-full flex items-center justify-between cursor-pointer bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600"
//                 onClick={() => setShowStudentDropdown(!showStudentDropdown)}
//               >
//                 {loadingStudents ? (
//                   <span className="text-gray-500 dark:text-gray-400 text-sm">
//                     <i className="fa-solid fa-spinner fa-spin mr-1" />
//                     Loading...
//                   </span>
//                 ) : (
//                   <span
//                     className={`text-sm truncate ${selectedStudentName ? "" : "text-gray-400"
//                       }`}
//                   >
//                     {selectedStudentName || "Select Student"}
//                   </span>
//                 )}
//                 <span className="text-gray-400 text-xs">▾</span>
//               </div>

//               <input
//                 type="hidden"
//                 {...register("student", { required: "Student is required" })}
//                 value={selectedStudentId}
//               />

//               {showStudentDropdown && !loadingStudents && (
//                 <div className="absolute z-50 bg-white dark:bg-gray-700 rounded-lg w-full mt-1 shadow-xl border border-gray-300 dark:border-gray-600 max-h-64 overflow-hidden">
//                   <div className="p-2 sticky top-0 bg-white dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
//                     <input
//                       type="text"
//                       placeholder="Search student..."
//                       className="input input-sm input-bordered w-full focus:outline-none bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100"
//                       value={searchStudentInput}
//                       onChange={(e) => setSearchStudentInput(e.target.value)}
//                       onClick={(e) => e.stopPropagation()}
//                       autoComplete="off"
//                     />
//                   </div>
//                   <div className="max-h-48 overflow-y-auto">
//                     {filteredStudents.length > 0 ? (
//                       filteredStudents.map((student) => (
//                         <div
//                           key={student.id}
//                           className="p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-gray-800 dark:text-gray-200 capitalize border-b border-gray-100 dark:border-gray-600 last:border-b-0"
//                           onClick={() => {
//                             setSelectedStudentId(student.id);
//                             setSelectedStudentName(student.student_name);
//                             setSearchStudentInput("");
//                             setShowStudentDropdown(false);
//                             setValue("student", student.id, {
//                               shouldValidate: true,
//                             });
//                           }}
//                         >
//                           {student.student_name}
//                         </div>
//                       ))
//                     ) : (
//                       <div className="p-3 text-center text-gray-500 dark:text-gray-400 text-sm">
//                         {selectedClassId
//                           ? "No students found"
//                           : "Select year level first"}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
//               {errors.student && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {errors.student.message}
//                 </p>
//               )}
//             </div>
//           </div>
//           {/* Entry Type Selector */}
//           {renderEntryTypeSelector()}


//           {/* Dynamic Entry Forms Based on Type */}
//           {selectedEntryType === ENTRY_TYPES.SCHOLASTIC &&
//             renderScholasticEntries()}
//           {selectedEntryType === ENTRY_TYPES.NON_SCHOLASTIC &&
//             renderNonScholasticEntries()}
//           {selectedEntryType === ENTRY_TYPES.PERSONAL_SOCIAL &&
//             renderPersonalQualityEntries()}

//           {/* Submit Button */}
//           <div className="flex justify-center mt-10">
//             <button
//               type="submit"
//               className="btn bgTheme text-white px-8 py-3 text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
//               disabled={isSubmitting || fields.length === 0}
//             >
//               {isSubmitting ? (
//                 <>
//                   <i className="fa-solid fa-spinner fa-spin mr-2"></i>
//                   Submitting...
//                 </>
//               ) : (
//                 <>
//                   <i className="fa-solid fa-paper-plane mr-2"></i>
//                   Submit {ENTRY_TYPE_LABELS[selectedEntryType]}
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* Alert Modal */}
//       {showAlert && (
//         <dialog className="modal modal-open">
//           <div className="modal-box bg-white dark:bg-gray-800">
//             <div className="text-center">
//               <i
//                 className={`fa-solid ${alertType === "success"
//                   ? "fa-circle-check text-green-500"
//                   : "fa-circle-xmark text-red-500"
//                   } text-5xl mb-4`}
//               ></i>
//               <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">
//                 {alertType === "success" ? "Success!" : "Error"}
//               </h3>
//               <p className="py-4 text-gray-600 dark:text-gray-300 whitespace-pre-line">
//                 {alertMessage}
//               </p>
//             </div>
//             <div className="modal-action justify-center">
//               <button
//                 className="btn bgTheme text-white w-32"
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

// export default UnifiedMarksheet;  







import { useState, useEffect, useContext, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  fetchSchoolYear,
  fetchYearLevels,
  fetchAllTeachers,
  fetchTerms,
  fetchStudents1,
} from "../../services/api/Api";
import { AuthContext } from "../../context/AuthContext";

const ENTRY_TYPES = {
  SCHOLASTIC: "SCHOLASTIC",
  NON_SCHOLASTIC: "NON_SCHOLASTIC",
  PERSONAL_SOCIAL: "PERSONAL_SOCIAL",
};

const ENTRY_TYPE_LABELS = {
  SCHOLASTIC: "Scholastic Evaluation",
  NON_SCHOLASTIC: "Non-Scholastic Evaluation",
  PERSONAL_SOCIAL: "Personal & Social Qualities",
};

const UnifiedMarksheet = () => {
  const { axiosInstance } = useContext(AuthContext);

  // Dropdown data
  const [schoolYears, setSchoolYears] = useState([]);
  const [yearLevels, setYearLevels] = useState([]);
  const [students, setStudents] = useState([]);
  const [terms, setTerms] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
  const [scholasticSubjects, setScholasticSubjects] = useState([]);
  const [nonScholasticSubjects, setNonScholasticSubjects] = useState([]);
  const [personalQualities, setPersonalQualities] = useState([]);

  // Selected entry type
  const [selectedEntryType, setSelectedEntryType] = useState(ENTRY_TYPES.SCHOLASTIC);

  // UI state
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  // Student dropdown state
  const [searchStudentInput, setSearchStudentInput] = useState("");
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [selectedStudentName, setSelectedStudentName] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const studentDropdownRef = useRef(null);

  // Form setup
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      school_year: "",
      year_level: "",
      student: "",
      term: "",
      exam_type: "",
      entry_type: ENTRY_TYPES.SCHOLASTIC,
      entries: [],
    },
  });

  const { fields, replace } = useFieldArray({
    control,
    name: "entries",
  });

  const watchedExamType = watch("exam_type");

  // ==================== HELPER FUNCTION ====================
  // Get the correct student ID from student object
  const getStudentId = (student) => {
    // Try different possible field names
    return student.student_id || student.studentId || student.id;
  };

  // Data fetching functions
  const fetchSchoolYears = async () => {
    try {
      const data = await fetchSchoolYear();
      setSchoolYears(data);
    } catch (err) {
      console.error("Failed to load school years:", err);
    }
  };

  const fetchYearLevelsData = async () => {
    try {
      const data = await fetchYearLevels();
      setYearLevels(data);
    } catch (err) {
      console.error("Failed to load year levels:", err);
    }
  };

  const fetchTermsData = async () => {
    try {
      const data = await fetchTerms();
      setTerms(data);
    } catch (err) {
      console.error("Failed to load terms:", err);
    }
  };

  const fetchTeachersData = async () => {
    try {
      const data = await fetchAllTeachers();
      setTeachers(data);
    } catch (err) {
      console.error("Failed to load teachers:", err);
    }
  };

  const fetchExamTypes = async () => {
    try {
      const response = await axiosInstance.get("/d/Exam-Type/");
      setExamTypes(response.data);
    } catch (err) {
      console.error("Failed to load exam types:", err);
    }
  };

  const fetchScholasticSubjects = async (yearLevelId) => {
    if (!yearLevelId) return;
    setLoadingData(true);
    try {
      const response = await axiosInstance.get(
        `/d/subject/?year_level=${yearLevelId}`
      );
      setScholasticSubjects(response.data);
    } catch (err) {
      console.error("Failed to load scholastic subjects:", err);
      setScholasticSubjects([]);
    } finally {
      setLoadingData(false);
    }
  };

  const fetchNonScholasticSubjects = async () => {
    try {
      const response = await axiosInstance.get(`/d/subject/?department=Non-Scholastic`);
      setNonScholasticSubjects(response.data);
    } catch (err) {
      console.error("Failed to load non-scholastic subjects:", err);
    }
  };

  const fetchPersonalQualities = async () => {
    try {
      const response = await axiosInstance.get("/d/personal-social-quality/");
      setPersonalQualities(response.data);
    } catch (err) {
      console.error("Failed to load personal qualities:", err);
    }
  };

  const fetchStudents = async (classId) => {
    if (!classId) {
      setStudents([]);
      return;
    }
    setLoadingStudents(true);
    try {
      const data = await fetchStudents1(classId);
      
      // 🔍 DEBUG: Check what fields are available
      console.log("📋 Students API Response:", data);
      if (data.length > 0) {
        console.log("📋 First Student Object Keys:", Object.keys(data[0]));
        console.log("📋 First Student Object:", data[0]);
      }
      
      setStudents(data);
    } catch (err) {
      console.error("Failed to load students:", err);
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchSchoolYears();
    fetchYearLevelsData();
    fetchTermsData();
    fetchTeachersData();
    fetchExamTypes();
    fetchNonScholasticSubjects();
    fetchPersonalQualities();
  }, []);

  // Dynamic entries based on type
  useEffect(() => {
    replace([]);

    if (selectedEntryType === ENTRY_TYPES.SCHOLASTIC && scholasticSubjects.length > 0) {
      const newEntries = scholasticSubjects.map((subject) => ({
        subject_id: subject.id,
        subject_name: subject.subject_name,
        teacher_id: "",
        marks: "",
      }));
      replace(newEntries);
    } else if (selectedEntryType === ENTRY_TYPES.NON_SCHOLASTIC && nonScholasticSubjects.length > 0) {
      const newEntries = nonScholasticSubjects.map((subject) => ({
        subject_id: subject.id,
        subject_name: subject.subject_name,
        grade: "",
      }));
      replace(newEntries);
    } else if (selectedEntryType === ENTRY_TYPES.PERSONAL_SOCIAL && personalQualities.length > 0) {
      const newEntries = personalQualities.map((quality) => ({
        quality_id: quality.id,
        quality_name: quality.quality_name,
        description: quality.description,
        grade: "",
      }));
      replace(newEntries);
    }
  }, [selectedEntryType, scholasticSubjects, nonScholasticSubjects, personalQualities, replace]);

  // Event handlers
  const handleEntryTypeChange = (type) => {
    setSelectedEntryType(type);
    setValue("entry_type", type);
    if (type !== ENTRY_TYPES.SCHOLASTIC) {
      setValue("exam_type", "");
    }
  };

  const handleClassChange = (e) => {
    const classId = e.target.value;
    setSelectedClassId(classId);
    setSelectedStudentId(null);
    setSelectedStudentName("");
    setValue("student", "");
    replace([]);

    if (classId) {
      fetchStudents(classId);
      if (selectedEntryType === ENTRY_TYPES.SCHOLASTIC) {
        fetchScholasticSubjects(classId);
      }
    } else {
      setStudents([]);
      setScholasticSubjects([]);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (studentDropdownRef.current && !studentDropdownRef.current.contains(event.target)) {
        setShowStudentDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter students for search
  const filteredStudents = students
    .filter((student) =>
      student.student_name.toLowerCase().includes(searchStudentInput.toLowerCase())
    )
    .sort((a, b) => a.student_name.localeCompare(b.student_name));

  // Form submission
  const onSubmit = async (data) => {
    try {
      // Validation
      if (!selectedStudentId) {
        setAlertType("error");
        setAlertMessage("Please select a student.");
        setShowAlert(true);
        return;
      }

      if (!data.school_year) {
        setAlertType("error");
        setAlertMessage("Please select a school year.");
        setShowAlert(true);
        return;
      }

      if (!data.year_level) {
        setAlertType("error");
        setAlertMessage("Please select a year level.");
        setShowAlert(true);
        return;
      }

      if (!data.term) {
        setAlertType("error");
        setAlertMessage("Please select a term.");
        setShowAlert(true);
        return;
      }

      // 🔍 DEBUG: Log selected student ID
      console.log("🎯 Selected Student ID for submission:", selectedStudentId);

      let payloads = [];

      if (selectedEntryType === ENTRY_TYPES.SCHOLASTIC) {
        if (!data.exam_type) {
          setAlertType("error");
          setAlertMessage("Please select an exam type.");
          setShowAlert(true);
          return;
        }

        const validEntries = data.entries.filter(
          (entry) => entry.marks !== "" && entry.marks !== null && entry.marks !== undefined
        );

        if (validEntries.length === 0) {
          setAlertType("error");
          setAlertMessage("Please enter marks for at least one subject.");
          setShowAlert(true);
          return;
        }

        payloads = validEntries.map((entry) => ({
          student: Number(selectedStudentId),
          school_year: Number(data.school_year),
          year_level: Number(data.year_level),
          term: Number(data.term),
          entry_type: "SCHOLASTIC",
          exam_type: Number(data.exam_type),
          subject: Number(entry.subject_id),
          marks: Number(entry.marks),
          grade: null,
          personal_quality: null,
        }));

      } else if (selectedEntryType === ENTRY_TYPES.NON_SCHOLASTIC) {
        const validEntries = data.entries.filter(
          (entry) => entry.grade && entry.grade.trim() !== ""
        );

        if (validEntries.length === 0) {
          setAlertType("error");
          setAlertMessage("Please enter grade for at least one subject.");
          setShowAlert(true);
          return;
        }

        payloads = validEntries.map((entry) => ({
          student: Number(selectedStudentId),
          school_year: Number(data.school_year),
          year_level: Number(data.year_level),
          term: Number(data.term),
          entry_type: "NON_SCHOLASTIC",
          subject: Number(entry.subject_id),
          grade: entry.grade.trim().toUpperCase(),
          exam_type: null,
          marks: null,
          personal_quality: null,
        }));

      } else if (selectedEntryType === ENTRY_TYPES.PERSONAL_SOCIAL) {
        const validEntries = data.entries.filter(
          (entry) => entry.grade && entry.grade.trim() !== ""
        );

        if (validEntries.length === 0) {
          setAlertType("error");
          setAlertMessage("Please enter grade for at least one quality.");
          setShowAlert(true);
          return;
        }

        payloads = validEntries.map((entry) => ({
          student: Number(selectedStudentId),
          school_year: Number(data.school_year),
          year_level: Number(data.year_level),
          term: Number(data.term),
          entry_type: "PERSONAL_SOCIAL",
          personal_quality: Number(entry.quality_id),
          grade: entry.grade.trim().toUpperCase(),
          exam_type: null,
          subject: null,
          marks: null,
        }));
      }

      // 🔍 DEBUG: Log payloads
      console.log("📦 Payloads to send:", JSON.stringify(payloads, null, 2));

      // Submit all payloads
      const results = [];
      const errorsList = [];

      for (let i = 0; i < payloads.length; i++) {
        try {
          console.log(`📤 Sending payload ${i + 1}:`, payloads[i]);
          const response = await axiosInstance.post("/d/Student-Marks/create_marks/", payloads[i]);
          console.log(`✅ Response ${i + 1}:`, response.data);
          results.push(response.data);
        } catch (err) {
          console.error(`❌ Error for payload ${i + 1}:`, err.response?.data);
          errorsList.push({
            index: i,
            payload: payloads[i],
            error: err.response?.data || err.message,
          });
        }
      }

      if (errorsList.length === 0) {
        setAlertType("success");
        setAlertMessage(
          `${ENTRY_TYPE_LABELS[selectedEntryType]} submitted successfully!\n${results.length} entries saved.`
        );
        setShowAlert(true);

        // Reset form
        reset();
        setSelectedStudentId(null);
        setSelectedStudentName("");
        setSearchStudentInput("");
        replace([]);
      } else if (results.length > 0) {
        setAlertType("warning");
        setAlertMessage(
          `Partially saved: ${results.length} success, ${errorsList.length} failed.`
        );
        setShowAlert(true);
      } else {
        const firstError = errorsList[0]?.error;
        let errorMsg = "Submission failed.";
        
        if (typeof firstError === "object") {
          errorMsg = Object.entries(firstError)
            .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(", ") : val}`)
            .join("\n");
        }
        
        setAlertType("error");
        setAlertMessage(errorMsg);
        setShowAlert(true);
      }

    } catch (error) {
      console.error("Unexpected error:", error);
      setAlertType("error");
      setAlertMessage(error.message || "An unexpected error occurred.");
      setShowAlert(true);
    }
  };

  // Render entry type selector
  const renderEntryTypeSelector = () => (
    <div className="col-span-full mb-10">
      <label className="block text-2xl font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
        Evaluation Type
      </label>
      <div className="flex flex-wrap gap-2 justify-center">
        {Object.entries(ENTRY_TYPES).map(([key, value]) => (
          <button
            key={key}
            type="button"
            onClick={() => handleEntryTypeChange(value)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              selectedEntryType === value
                ? "bgTheme text-white shadow-md"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            <i
              className={`fa-solid ${
                value === ENTRY_TYPES.SCHOLASTIC
                  ? "fa-book"
                  : value === ENTRY_TYPES.NON_SCHOLASTIC
                  ? "fa-palette"
                  : "fa-heart"
              } mr-2`}
            ></i>
            {ENTRY_TYPE_LABELS[value]}
          </button>
        ))}
      </div>
    </div>
  );

  // Render scholastic entries
  const renderScholasticEntries = () => (
    <div className="col-span-full mt-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 border-b-2 border-gray-300 dark:border-gray-600 pb-2">
        <i className="fa-solid fa-book mr-2"></i>
        Scholastic Evaluation - Subject Marks
      </h3>

      {watchedExamType && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Selected Exam:</span>
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
            {examTypes.find((e) => e.id === parseInt(watchedExamType))?.name || "Unknown"}
          </span>
        </div>
      )}

      {loadingData ? (
        <div className="flex justify-center py-8">
          <i className="fa-solid fa-spinner fa-spin text-2xl text-gray-500"></i>
          <span className="ml-2 text-gray-500">Loading subjects...</span>
        </div>
      ) : fields.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table w-full dark:text-gray-200">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="text-left w-1/12">#</th>
                <th className="text-left w-4/12">Subject</th>
                <th className="text-left w-4/12">Teacher <span className="text-error">*</span></th>
                <th className="text-left w-3/12">Marks <span className="text-error">*</span></th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr
                  key={field.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b dark:border-gray-700"
                >
                  <td className="py-4 text-gray-500 dark:text-gray-400">{index + 1}</td>
                  <td className="py-4">
                    <p className="font-medium text-gray-800 dark:text-gray-100">
                      {field.subject_name}
                    </p>
                    <input type="hidden" {...register(`entries.${index}.subject_id`)} />
                  </td>
                  <td className="py-4">
                    <select
                      {...register(`entries.${index}.teacher_id`, {
                        required: "Teacher is required",
                      })}
                      className="select select-bordered w-full focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    >
                      <option value="">Select Teacher</option>
                      {teachers.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.first_name} {teacher.last_name}
                        </option>
                      ))}
                    </select>
                    {errors.entries?.[index]?.teacher_id && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.entries[index].teacher_id.message}
                      </p>
                    )}
                  </td>
                  <td className="py-4">
                    <input
                      type="number"
                      placeholder="0-100"
                      {...register(`entries.${index}.marks`, {
                        required: "Marks required",
                        min: { value: 0, message: "Min 0" },
                        max: { value: 100, message: "Max 100" },
                      })}
                      className="input input-bordered w-full focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                    {errors.entries?.[index]?.marks && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.entries[index].marks.message}
                      </p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-6 text-center text-gray-500 dark:text-gray-400 border-2 border-dashed rounded-lg">
          <i className="fa-solid fa-info-circle text-2xl mb-2"></i>
          <p>Please select a Year Level to load subjects.</p>
        </div>
      )}
    </div>
  );

  // Render non-scholastic entries
  const renderNonScholasticEntries = () => (
    <div className="col-span-full mt-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 border-b-2 border-gray-300 dark:border-gray-600 pb-2">
        <i className="fa-solid fa-palette mr-2"></i>
        Non-Scholastic Evaluation
      </h3>

      {fields.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50 hover:shadow-md transition-shadow"
            >
              <div className="mb-3">
                <h4 className="font-medium text-gray-800 dark:text-gray-200">
                  {field.subject_name}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Non-Scholastic Activity
                </p>
              </div>
              <input type="hidden" {...register(`entries.${index}.subject_id`)} />
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Grade
                </label>
                <input
                  type="text"
                  placeholder="A, B, C, D, E"
                  maxLength={2}
                  {...register(`entries.${index}.grade`)}
                  className="input input-bordered w-full focus:outline-none dark:bg-gray-600 dark:text-white dark:border-gray-500"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 text-center text-gray-500 dark:text-gray-400 border-2 border-dashed rounded-lg">
          <i className="fa-solid fa-info-circle text-2xl mb-2"></i>
          <p>No non-scholastic subjects available.</p>
        </div>
      )}
    </div>
  );

  // Render personal quality entries
  const renderPersonalQualityEntries = () => (
    <div className="col-span-full mt-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 border-b-2 border-gray-300 dark:border-gray-600 pb-2">
        <i className="fa-solid fa-heart mr-2"></i>
        Personal & Social Qualities
      </h3>

      {fields.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50 hover:shadow-md transition-shadow"
            >
              <div className="mb-3">
                <h4 className="font-medium text-gray-800 dark:text-gray-200">
                  {field.quality_name}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {field.description || "Personal quality assessment"}
                </p>
              </div>
              <input type="hidden" {...register(`entries.${index}.quality_id`)} />
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Grade
                </label>
                <input
                  type="text"
                  placeholder="A+, A, B+, B, C"
                  maxLength={2}
                  {...register(`entries.${index}.grade`)}
                  className="input input-bordered w-full focus:outline-none dark:bg-gray-600 dark:text-white dark:border-gray-500"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 text-center text-gray-500 dark:text-gray-400 border-2 border-dashed rounded-lg">
          <i className="fa-solid fa-info-circle text-2xl mb-2"></i>
          <p>No personal qualities available.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen p-5 bg-gray-50 dark:bg-gray-900 mb-24 md:mb-10">
      <div className="w-full max-w-7xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-box my-5 shadow-sm dark:shadow-gray-700">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              <i className="fa-solid fa-file-lines mr-3"></i>
              Create Marksheet
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Manage all types of student evaluations in one place
            </p>
          </div>

          {/* Common Fields */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-10">
            {/* School Year */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                School Year <span className="text-error">*</span>
              </label>
              <select
                {...register("school_year", { required: "School year is required" })}
                className="select select-bordered w-full focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                <option value="">Select Year</option>
                {schoolYears.map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.year_name}
                  </option>
                ))}
              </select>
              {errors.school_year && (
                <p className="text-red-500 text-xs mt-1">{errors.school_year.message}</p>
              )}
            </div>

            {/* Year Level */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Year Level <span className="text-error">*</span>
              </label>
              <select
                {...register("year_level", { required: "Year level is required" })}
                onChange={handleClassChange}
                className="select select-bordered w-full focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                <option value="">Select Level</option>
                {yearLevels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.level_name}
                  </option>
                ))}
              </select>
              {errors.year_level && (
                <p className="text-red-500 text-xs mt-1">{errors.year_level.message}</p>
              )}
            </div>

            {/* Term */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Term <span className="text-error">*</span>
              </label>
              <select
                {...register("term", { required: "Term is required" })}
                className="select select-bordered w-full focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                <option value="">Select Term</option>
                {terms.map((term) => (
                  <option key={term.id} value={term.id}>
                    Term {term.term_number}
                  </option>
                ))}
              </select>
              {errors.term && (
                <p className="text-red-500 text-xs mt-1">{errors.term.message}</p>
              )}
            </div>

            {/* Exam Type - Only for Scholastic */}
            {selectedEntryType === ENTRY_TYPES.SCHOLASTIC && (
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Exam Type <span className="text-error">*</span>
                </label>
                <select
                  {...register("exam_type", {
                    required: selectedEntryType === ENTRY_TYPES.SCHOLASTIC ? "Exam type is required" : false,
                  })}
                  className="select select-bordered w-full focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                >
                  <option value="">Select Exam</option>
                  {examTypes.map((type) => (
                  <option key={type.id} value={type.id} disabled={type.id === 6}>
                      {type.name}
                    </option>
                  ))}
                </select>
                {errors.exam_type && (
                  <p className="text-red-500 text-xs mt-1">{errors.exam_type.message}</p>
                )}
              </div>
            )}

            {/* Student - ⭐ FIXED: Use correct student ID field */}
            <div className="relative" ref={studentDropdownRef}>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Student <span className="text-error">*</span>
              </label>
              <div
                className="input input-bordered w-full flex items-center justify-between cursor-pointer bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600"
                onClick={() => setShowStudentDropdown(!showStudentDropdown)}
              >
                {loadingStudents ? (
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    <i className="fa-solid fa-spinner fa-spin mr-1" />
                    Loading...
                  </span>
                ) : (
                  <span className={`text-sm truncate ${selectedStudentName ? "" : "text-gray-400"}`}>
                    {selectedStudentName || "Select Student"}
                  </span>
                )}
                <span className="text-gray-400 text-xs">▾</span>
              </div>

              <input
                type="hidden"
                {...register("student", { required: "Student is required" })}
                value={selectedStudentId || ""}
              />

              {showStudentDropdown && !loadingStudents && (
                <div className="absolute z-50 bg-white dark:bg-gray-700 rounded-lg w-full mt-1 shadow-xl border border-gray-300 dark:border-gray-600 max-h-64 overflow-hidden">
                  <div className="p-2 sticky top-0 bg-white dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <input
                      type="text"
                      placeholder="Search student..."
                      className="input input-sm input-bordered w-full focus:outline-none bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                      value={searchStudentInput}
                      onChange={(e) => setSearchStudentInput(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      autoComplete="off"
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => {
                        // ⭐ FIX: Get correct student ID
                        const actualStudentId = getStudentId(student);
                        
                        return (
                          <div
                            key={student.id}
                            className="p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-gray-800 dark:text-gray-200 capitalize border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                            onClick={() => {
                              console.log("🎯 Student selected:", student);
                              console.log("🎯 Using student ID:", actualStudentId);
                              
                              setSelectedStudentId(actualStudentId);
                              setSelectedStudentName(student.student_name);
                              setSearchStudentInput("");
                              setShowStudentDropdown(false);
                              setValue("student", actualStudentId, { shouldValidate: true });
                            }}
                          >
                            <div className="flex justify-between items-center">
                              <span>{student.student_name}</span>
                              <span className="text-xs text-gray-400">ID: {actualStudentId}</span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-3 text-center text-gray-500 dark:text-gray-400 text-sm">
                        {selectedClassId ? "No students found" : "Select year level first"}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {errors.student && (
                <p className="text-red-500 text-xs mt-1">{errors.student.message}</p>
              )}
            </div>
          </div>

          {/* Entry Type Selector */}
          {renderEntryTypeSelector()}

          {/* Dynamic Entry Forms */}
          {selectedEntryType === ENTRY_TYPES.SCHOLASTIC && renderScholasticEntries()}
          {selectedEntryType === ENTRY_TYPES.NON_SCHOLASTIC && renderNonScholasticEntries()}
          {selectedEntryType === ENTRY_TYPES.PERSONAL_SOCIAL && renderPersonalQualityEntries()}

          {/* Debug Panel - Remove in Production */}
          <div className="col-span-full mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg">
            <h4 className="font-bold text-yellow-800 dark:text-yellow-200 mb-2">
              🔍 Debug Panel (Remove in Production)
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div className="p-2 bg-white dark:bg-gray-800 rounded">
                <span className="font-medium">Student ID:</span>
                <br />
                <span className={selectedStudentId ? "text-green-600" : "text-red-600"}>
                  {selectedStudentId || "Not Selected"}
                </span>
              </div>
              <div className="p-2 bg-white dark:bg-gray-800 rounded">
                <span className="font-medium">School Year:</span>
                <br />
                <span className={watch("school_year") ? "text-green-600" : "text-red-600"}>
                  {watch("school_year") || "Not Selected"}
                </span>
              </div>
              <div className="p-2 bg-white dark:bg-gray-800 rounded">
                <span className="font-medium">Year Level:</span>
                <br />
                <span className={watch("year_level") ? "text-green-600" : "text-red-600"}>
                  {watch("year_level") || "Not Selected"}
                </span>
              </div>
              <div className="p-2 bg-white dark:bg-gray-800 rounded">
                <span className="font-medium">Term:</span>
                <br />
                <span className={watch("term") ? "text-green-600" : "text-red-600"}>
                  {watch("term") || "Not Selected"}
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-10">
            <button
              type="submit"
              className="btn bgTheme text-white px-8 py-3 text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              disabled={isSubmitting || fields.length === 0}
            >
              {isSubmitting ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                  Submitting...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-paper-plane mr-2"></i>
                  Submit {ENTRY_TYPE_LABELS[selectedEntryType]}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Alert Modal */}
      {showAlert && (
        <dialog className="modal modal-open">
          <div className="modal-box bg-white dark:bg-gray-800">
            <div className="text-center">
              <i
                className={`fa-solid ${
                  alertType === "success"
                    ? "fa-circle-check text-green-500"
                    : alertType === "warning"
                    ? "fa-exclamation-triangle text-yellow-500"
                    : "fa-circle-xmark text-red-500"
                } text-5xl mb-4`}
              ></i>
              <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">
                {alertType === "success" ? "Success!" : alertType === "warning" ? "Warning" : "Error"}
              </h3>
              <p className="py-4 text-gray-600 dark:text-gray-300 whitespace-pre-line">
                {alertMessage}
              </p>
            </div>
            <div className="modal-action justify-center">
              <button
                className="btn bgTheme text-white w-32"
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

export default UnifiedMarksheet;