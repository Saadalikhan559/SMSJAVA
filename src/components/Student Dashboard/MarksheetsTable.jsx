// import React, { useEffect, useState, useContext } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { AuthContext } from "../../context/AuthContext";
// import { allRouterLink } from "../../router/AllRouterLinks";
// import { constants } from "../../global/constants";

// const MarksheetsTable = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);
//   const [selectedClass, setSelectedClass] = useState("");
//   const [yearLevels, setYearLevels] = useState([]);
//   const [searchInput, setSearchInput] = useState("");
//   const [marksheet, setMarksheet] = useState([]);
//   const { axiosInstance } = useContext(AuthContext);
//   const userRole = localStorage.getItem("userRole");
//   const navigate = useNavigate();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [reopenDate, setReopenDate] = useState("");
//   const [selectedYear, setSelectedYear] = useState("");
//   const [selectedLevels, setSelectedLevels] = useState([]);
//   const [submitting, setSubmitting] = useState(false);
//   const [schoolYears, setSchoolYears] = useState([]);
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);




//   // Fetch marksheets
//   const getMarksheet = async () => {
//     setLoading(true);
//     setError(false);
//     try {
//       const response = await axiosInstance.get(`/d/report-cards/`);
//       setMarksheet(response.data || []);
//     } catch (err) {
//       console.error("Failed to load marksheet:", err);
//       setError(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch classes
//   const getYearLevels = async () => {
//     try {
//       const response = await axiosInstance.get("/d/year-levels/");
//       setYearLevels(response.data || []);
//     } catch (err) {
//       console.error("Error fetching year levels:", err);
//     }
//   };

//   const getSchoolYears = async () => {
//     try {
//       const response = await axiosInstance.get("/d/school-years/");
//       setSchoolYears(response.data || []);
//     } catch (err) {
//       console.error("Error fetching school years:", err);
//     }
//   };


//   useEffect(() => {
//     getYearLevels();
//     getMarksheet();
//     getSchoolYears();
//   }, []);

//   // Filters
//   const filteredData = marksheet.filter((detail) => {
//     const classMatch =
//       selectedClass === "" ||
//       (detail.class &&
//         detail.class.toLowerCase().includes(selectedClass.toLowerCase()));

//     const nameMatch =
//       searchInput === "" ||
//       (detail.student_name &&
//         detail.student_name.toLowerCase().includes(searchInput.toLowerCase()));

//     return classMatch && nameMatch;
//   });


//   const handleBulkReopenDate = async () => {
//     if (!reopenDate || !selectedYear || selectedLevels.length === 0) {
//       alert("Please fill all fields");
//       return;
//     }

//     const payload = {
//       school_reopen_date: reopenDate,
//       year_id: Number(selectedYear),
//       level_ids: selectedLevels,
//     };

//     try {
//       setSubmitting(true);

//       await axiosInstance.put(
//         "/d/report-cards/bulk-update-school-reopen-date/",
//         payload
//       );

//       setIsModalOpen(false);
//       setReopenDate("");
//       setSelectedYear("");
//       setSelectedLevels([]);

//       getMarksheet(); // refresh table
//     } catch (err) {
//       console.error("Bulk reopen date failed:", err);
//       alert("Failed to update reopening date");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const allLevelIds = yearLevels.map((l) => l.id);

//   const isAllSelected =
//     selectedLevels.length === allLevelIds.length &&
//     allLevelIds.length > 0;

//   const toggleSelectAll = () => {
//     if (isAllSelected) {
//       setSelectedLevels([]);
//     } else {
//       setSelectedLevels(allLevelIds);
//     }
//   };

// const handleDelete = async () => {
//   try {
//     await axiosInstance.delete(`/d/report-cards/${deleteId}/`);

//     setMarksheet((prev) =>
//       prev.filter((item) => item.id !== deleteId)
//     );

//     setDeleteModalOpen(false);
//     setDeleteId(null);

//   } catch (err) {
//     console.error("Delete failed:", err);
//     alert("Delete failed");
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
//         <p className="mt-2 text-gray-500 dark:text-gray-300 text-sm">
//           Loading data...
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
//     <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen mb-24 md:mb-10">
//       <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-10">
//         <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white text-center mb-4">
//           Marksheets <i className="fa-solid fa-address-card ml-2"></i>
//         </h1>

//         <div className="flex flex-wrap justify-between items-end gap-4 mb-4 w-full border-b border-gray-200 dark:border-gray-700 pb-4">
//           <div className="w-full sm:w-xs">
//             <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Select Class:
//             </label>
//             <select
//               className="select select-bordered w-full focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
//               value={selectedClass}
//               onChange={(e) => setSelectedClass(e.target.value)}
//             >
//               <option value="">All Classes</option>
//               {yearLevels.map((level) => (
//                 <option key={level.id} value={level.level_name}>
//                   {level.level_name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="flex justify-end gap-2">
//             <div className="flex flex-col w-full sm:w-auto">
//               <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Search Name:
//               </label>

//               {/* Row for input + button */}
//               <div className="flex gap-2 items-center">
//                 <input
//                   type="text"
//                   placeholder="Search Student Name..."
//                   className="border px-3 py-2 rounded w-full sm:w-64 dark:bg-gray-700 dark:text-white dark:border-gray-600"
//                   value={searchInput}
//                   onChange={(e) => setSearchInput(e.target.value.trimStart())}
//                 />

//                 {/* <button className="btn bgTheme text-white whitespace-nowrap">
//                   Re-opening date
//                 </button> */}
//                 <button
//                   className="btn bgTheme text-white whitespace-nowrap"
//                   onClick={() => setIsModalOpen(true)}
//                 >
//                   Assign Reopening Date
//                 </button>

//               </div>
//             </div>
//           </div>

//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto max-h-[70vh] rounded-lg">
//           <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
//             <thead className="bgTheme text-white sticky top-0 z-2">
//               <tr>
//                 <th className="px-4 py-3 text-left text-nowrap text-sm font-semibold">
//                   Student Name
//                 </th>
//                 <th className="px-4 py-3 text-left text-nowrap text-sm font-semibold">
//                   Father's Name
//                 </th>
//                 <th className="px-4 py-3 text-left text-nowrap text-sm font-semibold">
//                   Date of Birth
//                 </th>
//                 <th className="px-4 py-3 text-left text-nowrap text-sm font-semibold">
//                   Contact Number
//                 </th>
//                 <th className="px-4 py-3 text-left text-nowrap text-sm font-semibold">
//                   Class
//                 </th>
//                 <th className="px-4 py-3 text-left text-nowrap text-sm font-semibold">
//                   Academic Year
//                 </th>
//                 <th className="px-4 py-3 text-center text-nowrap text-sm font-semibold">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
//               {filteredData.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan="7"
//                     className="text-center py-6 text-gray-500 dark:text-gray-300"
//                   >
//                     No marksheet data available
//                   </td>
//                 </tr>
//               ) : (
//                 filteredData.map((detail) => (
//                   <tr
//                     key={detail.id}
//                     className="hover:bg-gray-50 dark:hover:bg-gray-700"
//                   >
//                     <td className="whitespace-nowrap text-nowrap px-4 py-3 text-sm font-bold text-gray-900 dark:text-gray-200">
//                       {detail.student_name || "—"}
//                     </td>
//                     <td className="whitespace-nowrap text-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
//                       {detail.father_name || "—"}
//                     </td>
//                     <td className="whitespace-nowrap text-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
//                       {detail.date_of_birth || "—"}
//                     </td>
//                     <td className="whitespace-nowrap text-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
//                       {detail.contact_number || "—"}
//                     </td>
//                     <td className="whitespace-nowrap text-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
//                       {detail.class || "—"}
//                     </td>
//                     <td className="whitespace-nowrap text-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
//                       {detail.academic_year || "—"}
//                     </td>
//                     <td className="whitespace-nowrap text-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
//                       <div className="flex items-center space-x-2">
//                         <Link
//                           to={`/Marksheet/${detail.id}`}
//                           className="inline-flex items-center px-3 py-1 border border-[#5E35B1] rounded-md shadow-sm text-sm font-medium textTheme bg-blue-50 hover:bg-blue-100"
//                         >
//                           View
//                         </Link>

//                         {/* ✅ FIXED: Use hardcoded path or safe fallback */}
//                         <Link
//                           to={`/update-marksheet/${detail.id}`}
//                           className="inline-flex items-center px-3 py-1 border border-yellow-300 rounded-md shadow-sm text-sm font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
//                         >
//                           Edit
//                         </Link>

//                         <button
//                           className="inline-flex items-center px-3 py-1 shadow-sm text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-300 rounded-md"
//                         onClick={() => {
//   setDeleteId(detail.id);
//   setDeleteModalOpen(true);
// }}
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//           {isModalOpen && (
//             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//               <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6 shadow-xl">

//                 {/* Header */}
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-lg font-bold text-gray-800 dark:text-white">
//                     Assign School Reopening Date
//                   </h2>
//                   <button
//                     className="text-gray-400 hover:text-red-500"
//                     onClick={() => setIsModalOpen(false)}
//                   >
//                     ✕
//                   </button>
//                 </div>

//                 {/* Re-opening Date */}
//                 <div className="mb-3">
//                   <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                     Assign Reopening Date
//                   </label>
//                   <input
//                     type="date"
//                     className="input input-bordered w-full mt-1 dark:bg-gray-700 dark:text-white"
//                     value={reopenDate}
//                     onChange={(e) => setReopenDate(e.target.value)}
//                   />
//                 </div>

//                 {/* Academic Year */}
//                 <div className="mb-3">
//                   <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                     Academic Year
//                   </label>
//                   <select
//                     className="select select-bordered w-full mt-1 dark:bg-gray-700 dark:text-white"
//                     value={selectedYear}
//                     onChange={(e) => setSelectedYear(e.target.value)}
//                   >
//                     <option value="">Select Year</option>
//                     {schoolYears.map((year) => (
//                       <option key={year.id} value={year.id}>
//                         {year.year_name}
//                       </option>
//                     ))}

//                   </select>
//                 </div>

//                 {/* Classes with Select All */}
//                 <div className="mb-4">
//                   <div className="flex justify-between items-center mb-1">
//                     <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                       Classes
//                     </label>
//                     <button
//                       type="button"
//                       onClick={toggleSelectAll}
//                       className="text-xs font-semibold textTheme hover:underline"
//                     >
//                       {isAllSelected ? "Deselect All" : "Select All"}
//                     </button>
//                   </div>

//                   <div className="grid grid-cols-3 gap-2 mt-2">
//                     {yearLevels.map((level) => (
//                       <label
//                         key={level.id}
//                         className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
//                       >
//                         <input
//                           type="checkbox"
//                           checked={selectedLevels.includes(level.id)}
//                           onChange={() => {
//                             setSelectedLevels((prev) =>
//                               prev.includes(level.id)
//                                 ? prev.filter((x) => x !== level.id)
//                                 : [...prev, level.id]
//                             );
//                           }}
//                         />
//                         {level.level_name}
//                       </label>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Footer Buttons */}
//                 <div className="flex justify-end gap-2">
//                   <button
//                     className="btn btn-outline"
//                     onClick={() => setIsModalOpen(false)}
//                     disabled={submitting}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     className="btn bgTheme text-white"
//                     disabled={submitting}
//                     onClick={handleBulkReopenDate}
//                   >
//                     {submitting ? "Saving..." : "Save"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//           {deleteModalOpen && (
//   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//     <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-sm p-6 shadow-xl">

//       <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
//         Delete Marksheet
//       </h2>

//       <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
//         Are you sure you want to delete this marksheet?
//       </p>

//       <div className="flex justify-end gap-2">
//         <button
//           className="btn btn-outline"
//           onClick={() => setDeleteModalOpen(false)}
//         >
//           Cancel
//         </button>

//         <button
//           className="btn bgTheme text-white"
//           onClick={handleDelete}
//         >
//           Continue
//         </button>
//       </div>

//     </div>
//   </div>
// )}

//         </div>
//       </div>
//     </div>
//   );
// };

// export default MarksheetsTable;







import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { allRouterLink } from "../../router/AllRouterLinks";
import { constants } from "../../global/constants";

const MarksheetsTable = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [yearLevels, setYearLevels] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [marksheet, setMarksheet] = useState([]);
  const { axiosInstance } = useContext(AuthContext);
  const userRole = localStorage.getItem("userRole");
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reopenDate, setReopenDate] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [schoolYears, setSchoolYears] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ✅ Toast notification state
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // ✅ Show toast function
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  // Fetch marksheets
  const getMarksheet = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await axiosInstance.get(`/d/report-cards/`);
      setMarksheet(response.data || []);
    } catch (err) {
      console.error("Failed to load marksheet:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Fetch classes
  const getYearLevels = async () => {
    try {
      const response = await axiosInstance.get("/d/year-levels/");
      setYearLevels(response.data || []);
    } catch (err) {
      console.error("Error fetching year levels:", err);
    }
  };

  const getSchoolYears = async () => {
    try {
      const response = await axiosInstance.get("/d/school-years/");
      setSchoolYears(response.data || []);
    } catch (err) {
      console.error("Error fetching school years:", err);
    }
  };

  useEffect(() => {
    getYearLevels();
    getMarksheet();
    getSchoolYears();
  }, []);

  // Filters
  const filteredData = marksheet.filter((detail) => {
    const classMatch =
      selectedClass === "" ||
      (detail.class &&
        detail.class.toLowerCase().includes(selectedClass.toLowerCase()));

    const nameMatch =
      searchInput === "" ||
      (detail.student_name &&
        detail.student_name.toLowerCase().includes(searchInput.toLowerCase()));

    return classMatch && nameMatch;
  });

  const handleBulkReopenDate = async () => {
    if (!reopenDate || !selectedYear || selectedLevels.length === 0) {
      showToast("Please fill all fields", "error");
      return;
    }

    const payload = {
      school_reopen_date: reopenDate,
      year_id: Number(selectedYear),
      level_ids: selectedLevels,
    };

    try {
      setSubmitting(true);

      await axiosInstance.put(
        "/d/report-cards/bulk-update-school-reopen-date/",
        payload
      );

      setIsModalOpen(false);
      setReopenDate("");
      setSelectedYear("");
      setSelectedLevels([]);

      showToast("Reopening date updated successfully", "success");
      getMarksheet();
    } catch (err) {
      console.error("Bulk reopen date failed:", err);
      showToast("Failed to update reopening date", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const allLevelIds = yearLevels.map((l) => l.id);

  const isAllSelected =
    selectedLevels.length === allLevelIds.length && allLevelIds.length > 0;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedLevels([]);
    } else {
      setSelectedLevels(allLevelIds);
    }
  };

  // ✅ FIXED Delete Function
  // const handleDelete = async () => {
  //   if (!deleteId) return;

  //   setDeleting(true);
  //   try {
  //     const response = await axiosInstance.delete(`/d/report-cards/${deleteId}/`);

  //     // ✅ Check if delete was successful
  //     if (response.status === 200 || response.status === 204) {
  //       // ✅ Remove from local state
  //       setMarksheet((prev) => prev.filter((item) => item.id !== deleteId));
  //       showToast("Marksheet deleted successfully", "success");
  //     } else {
  //       showToast("Delete failed. Please try again.", "error");
  //     }
  //   } catch (err) {
  //     console.error("Delete failed:", err);
      
  //     // ✅ Check if it's actually deleted (some APIs return error but delete works)
  //     if (err.response?.status === 404) {
  //       // Already deleted
  //       setMarksheet((prev) => prev.filter((item) => item.id !== deleteId));
  //       showToast("Marksheet already deleted", "success");
  //     } else {
  //       showToast(
  //         err.response?.data?.message || "Failed to delete marksheet",
  //         "error"
  //       );
  //     }
  //   } finally {
  //     setDeleting(false);
  //     setDeleteModalOpen(false);
  //     setDeleteId(null);
  //   }
  // };

  // ✅ Debug version - Replace your handleDelete with this
// const handleDelete = async () => {
//   if (!deleteId) return;

//   setDeleting(true);
  
//   console.log("=== DELETE DEBUG ===");
//   console.log("Delete ID:", deleteId);
//   console.log("Delete ID Type:", typeof deleteId);
//   console.log("API URL:", `/d/report-cards/${deleteId}/`);
  
//   try {
//     const response = await axiosInstance.delete(`/d/report-cards/${deleteId}/`);
    
//     console.log("Response Status:", response.status);
//     console.log("Response Data:", response.data);
//     console.log("Full Response:", response);
    
//     // Check if truly deleted
//     if (response.status === 200 || response.status === 204) {
//       setMarksheet((prev) => prev.filter((item) => item.id !== deleteId));
//       showToast("Marksheet deleted successfully", "success");
//     }
//   } catch (err) {
//     console.log("=== DELETE ERROR ===");
//     console.log("Error:", err);
//     console.log("Error Response:", err.response);
//     console.log("Error Status:", err.response?.status);
//     console.log("Error Data:", err.response?.data);
    
//     showToast("Failed to delete marksheet", "error");
//   } finally {
//     setDeleting(false);
//     setDeleteModalOpen(false);
//     setDeleteId(null);
//   }
// };


// ✅ Delete with VERIFICATION
const handleDelete = async () => {
  if (!deleteId) return;

  setDeleting(true);

  try {
    // Step 1: Delete request
    const deleteResponse = await axiosInstance.delete(`/d/report-cards/${deleteId}/`);
    console.log("Delete Response:", deleteResponse.data);

    // Step 2: VERIFY - Fetch fresh data from server
    console.log("Verifying deletion...");
    const verifyResponse = await axiosInstance.get(`/d/report-cards/`);
    
    // Step 3: Check if item still exists
    const deletedItem = verifyResponse.data.find(item => item.id === deleteId);
    
    if (deletedItem) {
      // ❌ Item STILL EXISTS in database!
      console.error("❌ DELETE FAILED: Item still exists in database!");
      console.log("Deleted Item found:", deletedItem);
      showToast("Backend error: Item not deleted from database", "error");
    } else {
      // ✅ Item successfully deleted
      console.log("✅ DELETE VERIFIED: Item removed from database");
      setMarksheet(verifyResponse.data || []);
      showToast("Marksheet deleted successfully", "success");
    }

  } catch (err) {
    console.error("Error:", err);
    showToast("Delete failed", "error");
  } finally {
    setDeleting(false);
    setDeleteModalOpen(false);
    setDeleteId(null);
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
        <p className="mt-2 text-gray-500 dark:text-gray-300 text-sm">
          Loading data...
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
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen mb-24 md:mb-10">
      {/* ✅ Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-5 right-5 z-[100] px-6 py-3 rounded-lg shadow-lg text-white flex items-center gap-2 animate-fade-in ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          <i
            className={`fa-solid ${
              toast.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"
            }`}
          ></i>
          <span>{toast.message}</span>
          <button
            onClick={() => setToast({ show: false, message: "", type: "" })}
            className="ml-2 hover:opacity-80"
          >
            ✕
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white text-center mb-4">
          Marksheets <i className="fa-solid fa-address-card ml-2"></i>
        </h1>

        <div className="flex flex-wrap justify-between items-end gap-4 mb-4 w-full border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="w-full sm:w-xs">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select Class:
            </label>
            <select
              className="select select-bordered w-full focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">All Classes</option>
              {yearLevels.map((level) => (
                <option key={level.id} value={level.level_name}>
                  {level.level_name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <div className="flex flex-col w-full sm:w-auto">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search Name:
              </label>

              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Search Student Name..."
                  className="border px-3 py-2 rounded w-full sm:w-64 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value.trimStart())}
                />

                <button
                  className="btn bgTheme text-white whitespace-nowrap"
                  onClick={() => setIsModalOpen(true)}
                >
                  Assign Reopening Date
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto max-h-[70vh] rounded-lg">
          <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
            <thead className="bgTheme text-white sticky top-0 z-2">
              <tr>
                <th className="px-4 py-3 text-left text-nowrap text-sm font-semibold">
                  Student Name
                </th>
                <th className="px-4 py-3 text-left text-nowrap text-sm font-semibold">
                  Father's Name
                </th>
                <th className="px-4 py-3 text-left text-nowrap text-sm font-semibold">
                  Date of Birth
                </th>
                <th className="px-4 py-3 text-left text-nowrap text-sm font-semibold">
                  Contact Number
                </th>
                <th className="px-4 py-3 text-left text-nowrap text-sm font-semibold">
                  Class
                </th>
                <th className="px-4 py-3 text-left text-nowrap text-sm font-semibold">
                  Academic Year
                </th>
                <th className="px-4 py-3 text-center text-nowrap text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-6 text-gray-500 dark:text-gray-300"
                  >
                    No marksheet data available
                  </td>
                </tr>
              ) : (
                filteredData.map((detail) => (
                  <tr
                    key={detail.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="whitespace-nowrap text-nowrap px-4 py-3 text-sm font-bold text-gray-900 dark:text-gray-200">
                      {detail.student_name || "—"}
                    </td>
                    <td className="whitespace-nowrap text-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
                      {detail.father_name || "—"}
                    </td>
                    <td className="whitespace-nowrap text-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
                      {detail.date_of_birth || "—"}
                    </td>
                    <td className="whitespace-nowrap text-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
                      {detail.contact_number || "—"}
                    </td>
                    <td className="whitespace-nowrap text-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
                      {detail.class || "—"}
                    </td>
                    <td className="whitespace-nowrap text-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
                      {detail.academic_year || "—"}
                    </td>
                    <td className="whitespace-nowrap text-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/Marksheet/${detail.id}`}
                          className="inline-flex items-center px-3 py-1 border border-[#5E35B1] rounded-md shadow-sm text-sm font-medium textTheme bg-blue-50 hover:bg-blue-100"
                        >
                          View
                        </Link>

                        <Link
                          to={`/update-marksheet/${detail.id}`}
                          className="inline-flex items-center px-3 py-1 border border-yellow-300 rounded-md shadow-sm text-sm font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                        >
                          Edit
                        </Link>

                        <button
                          className="inline-flex items-center px-3 py-1 shadow-sm text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-300 rounded-md"
                          onClick={() => {
                            setDeleteId(detail.id);
                            setDeleteModalOpen(true);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Reopening Date Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                    Assign School Reopening Date
                  </h2>
                  <button
                    className="text-gray-400 hover:text-red-500"
                    onClick={() => setIsModalOpen(false)}
                  >
                    ✕
                  </button>
                </div>

                <div className="mb-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Assign Reopening Date
                  </label>
                  <input
                    type="date"
                    className="input input-bordered w-full mt-1 dark:bg-gray-700 dark:text-white"
                    value={reopenDate}
                    onChange={(e) => setReopenDate(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Academic Year
                  </label>
                  <select
                    className="select select-bordered w-full mt-1 dark:bg-gray-700 dark:text-white"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    <option value="">Select Year</option>
                    {schoolYears.map((year) => (
                      <option key={year.id} value={year.id}>
                        {year.year_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Classes
                    </label>
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      className="text-xs font-semibold textTheme hover:underline"
                    >
                      {isAllSelected ? "Deselect All" : "Select All"}
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {yearLevels.map((level) => (
                      <label
                        key={level.id}
                        className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                      >
                        <input
                          type="checkbox"
                          checked={selectedLevels.includes(level.id)}
                          onChange={() => {
                            setSelectedLevels((prev) =>
                              prev.includes(level.id)
                                ? prev.filter((x) => x !== level.id)
                                : [...prev, level.id]
                            );
                          }}
                        />
                        {level.level_name}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    className="btn btn-outline"
                    onClick={() => setIsModalOpen(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn bgTheme text-white"
                    disabled={submitting}
                    onClick={handleBulkReopenDate}
                  >
                    {submitting ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ✅ Delete Confirmation Modal */}
          {deleteModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-sm p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <i className="fa-solid fa-trash text-red-500"></i>
                  </div>
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                    Delete Marksheet
                  </h2>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                  Are you sure you want to delete this marksheet? This action
                  cannot be undone.
                </p>

                <div className="flex justify-end gap-2">
                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      setDeleteModalOpen(false);
                      setDeleteId(null);
                    }}
                    disabled={deleting}
                  >
                    Cancel
                  </button>

                  <button
                    className="btn bg-red-500 hover:bg-red-600 text-white"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {deleting ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarksheetsTable;





// import React, { useEffect, useState, useContext } from "react";
// import { Link } from "react-router-dom";
// import { AuthContext } from "../../context/AuthContext";

// const MarksheetsTable = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);
//   const [selectedClass, setSelectedClass] = useState("");
//   const [yearLevels, setYearLevels] = useState([]);
//   const [searchInput, setSearchInput] = useState("");
//   const [marksheet, setMarksheet] = useState([]);
//   const { axiosInstance } = useContext(AuthContext);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [reopenDate, setReopenDate] = useState("");
//   const [selectedYear, setSelectedYear] = useState("");
//   const [selectedLevels, setSelectedLevels] = useState([]);
//   const [submitting, setSubmitting] = useState(false);
//   const [schoolYears, setSchoolYears] = useState([]);
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);
//   const [deleting, setDeleting] = useState(false);
//   const [toast, setToast] = useState({ show: false, message: "", type: "" });

//   const showToast = (message, type = "success") => {
//     setToast({ show: true, message, type });
//     setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
//   };

//   // ✅ Fresh fetch with cache busting
//   const getMarksheet = async () => {
//     setLoading(true);
//     setError(false);
//     try {
//       const timestamp = new Date().getTime();
//       const response = await axiosInstance.get(`/d/report-cards/?t=${timestamp}`);
//       console.log("Fetched marksheets:", response.data.length, "items");
//       setMarksheet(response.data || []);
//     } catch (err) {
//       console.error("Failed to load marksheet:", err);
//       setError(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getYearLevels = async () => {
//     try {
//       const response = await axiosInstance.get("/d/year-levels/");
//       setYearLevels(response.data || []);
//     } catch (err) {
//       console.error("Error fetching year levels:", err);
//     }
//   };

//   const getSchoolYears = async () => {
//     try {
//       const response = await axiosInstance.get("/d/school-years/");
//       setSchoolYears(response.data || []);
//     } catch (err) {
//       console.error("Error fetching school years:", err);
//     }
//   };

//   useEffect(() => {
//     getYearLevels();
//     getMarksheet();
//     getSchoolYears();
//   }, []);

//   const filteredData = marksheet.filter((detail) => {
//     const classMatch = selectedClass === "" || 
//       (detail.class && detail.class.toLowerCase().includes(selectedClass.toLowerCase()));
//     const nameMatch = searchInput === "" || 
//       (detail.student_name && detail.student_name.toLowerCase().includes(searchInput.toLowerCase()));
//     return classMatch && nameMatch;
//   });

//   const handleBulkReopenDate = async () => {
//     if (!reopenDate || !selectedYear || selectedLevels.length === 0) {
//       showToast("Please fill all fields", "error");
//       return;
//     }

//     try {
//       setSubmitting(true);
//       await axiosInstance.put("/d/report-cards/bulk-update-school-reopen-date/", {
//         school_reopen_date: reopenDate,
//         year_id: Number(selectedYear),
//         level_ids: selectedLevels,
//       });
//       setIsModalOpen(false);
//       setReopenDate("");
//       setSelectedYear("");
//       setSelectedLevels([]);
//       showToast("Reopening date updated successfully", "success");
//       getMarksheet();
//     } catch (err) {
//       console.error("Bulk reopen date failed:", err);
//       showToast("Failed to update reopening date", "error");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const allLevelIds = yearLevels.map((l) => l.id);
//   const isAllSelected = selectedLevels.length === allLevelIds.length && allLevelIds.length > 0;
//   const toggleSelectAll = () => setSelectedLevels(isAllSelected ? [] : allLevelIds);

//   // ✅ FINAL DELETE FUNCTION WITH FULL DEBUG
//   const handleDelete = async () => {
//     if (!deleteId) return;

//     setDeleting(true);
//     const idToDelete = deleteId;

//     console.log("\n========================================");
//     console.log("🗑️ DELETE PROCESS STARTED");
//     console.log("========================================");
//     console.log("ID to delete:", idToDelete);
//     console.log("Current marksheet count:", marksheet.length);
//     console.log("IDs before delete:", marksheet.map(m => m.id));

//     try {
//       // STEP 1: Delete
//       console.log("\n--- STEP 1: Sending DELETE request ---");
//       const deleteResponse = await axiosInstance.delete(`/d/report-cards/${idToDelete}/`);
//       console.log("Delete response:", deleteResponse.status, deleteResponse.data);

//       // STEP 2: Wait
//       console.log("\n--- STEP 2: Waiting 500ms ---");
//       await new Promise(resolve => setTimeout(resolve, 500));

//       // STEP 3: Fresh fetch with cache busting
//       console.log("\n--- STEP 3: Fetching fresh data ---");
//       const timestamp = new Date().getTime();
//       const freshResponse = await axiosInstance.get(`/d/report-cards/`, {
//         params: { _t: timestamp },
//         headers: {
//           'Cache-Control': 'no-cache',
//           'Pragma': 'no-cache'
//         }
//       });

//       console.log("Fresh data count:", freshResponse.data.length);
//       console.log("Fresh IDs:", freshResponse.data.map(m => m.id));

//       // STEP 4: Check if deleted
//       const stillExists = freshResponse.data.find(item => item.id === idToDelete);
      
//       console.log("\n--- STEP 4: Verification ---");
//       console.log("Looking for ID:", idToDelete);
//       console.log("Still exists?:", !!stillExists);

//       if (stillExists) {
//         console.log("❌ FAILED: Item still in database");
//         console.log("Item:", stillExists);
//         showToast("Backend bug: Item not deleted", "error");
//       } else {
//         console.log("✅ SUCCESS: Item deleted");
//         showToast("Deleted successfully", "success");
//       }

//       // Update state with fresh data
//       setMarksheet(freshResponse.data || []);
//       console.log("\n========================================");
//       console.log("🏁 DELETE PROCESS COMPLETED");
//       console.log("========================================\n");

//     } catch (err) {
//       console.error("❌ Error:", err);
//       showToast("Delete failed", "error");
//     } finally {
//       setDeleting(false);
//       setDeleteModalOpen(false);
//       setDeleteId(null);
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
//         <p className="mt-2 text-gray-500 dark:text-gray-300 text-sm">Loading data...</p>
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
//     <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen mb-24 md:mb-10">
//       {/* Toast */}
//       {toast.show && (
//         <div className={`fixed top-5 right-5 z-[100] px-6 py-3 rounded-lg shadow-lg text-white flex items-center gap-2 ${
//           toast.type === "success" ? "bg-green-500" : "bg-red-500"
//         }`}>
//           <i className={`fa-solid ${toast.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}`}></i>
//           <span>{toast.message}</span>
//           <button onClick={() => setToast({ show: false, message: "", type: "" })} className="ml-2">✕</button>
//         </div>
//       )}

//       <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-10">
//         <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white text-center mb-4">
//           Marksheets <i className="fa-solid fa-address-card ml-2"></i>
//           {/* Debug info */}
//           <span className="text-sm font-normal text-gray-500 ml-2">
//             (Total: {marksheet.length})
//           </span>
//         </h1>

//         <div className="flex flex-wrap justify-between items-end gap-4 mb-4 w-full border-b border-gray-200 dark:border-gray-700 pb-4">
//           <div className="w-full sm:w-xs">
//             <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Class:</label>
//             <select
//               className="select select-bordered w-full focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
//               value={selectedClass}
//               onChange={(e) => setSelectedClass(e.target.value)}
//             >
//               <option value="">All Classes</option>
//               {yearLevels.map((level) => (
//                 <option key={level.id} value={level.level_name}>{level.level_name}</option>
//               ))}
//             </select>
//           </div>
//           <div className="flex justify-end gap-2">
//             <div className="flex flex-col w-full sm:w-auto">
//               <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search Name:</label>
//               <div className="flex gap-2 items-center">
//                 <input
//                   type="text"
//                   placeholder="Search Student Name..."
//                   className="border px-3 py-2 rounded w-full sm:w-64 dark:bg-gray-700 dark:text-white dark:border-gray-600"
//                   value={searchInput}
//                   onChange={(e) => setSearchInput(e.target.value.trimStart())}
//                 />
                
//                 {/* 🔄 Debug Refresh Button */}
//                 <button 
//                   className="btn btn-info text-white"
//                   onClick={() => {
//                     console.log("Manual refresh triggered");
//                     getMarksheet();
//                   }}
//                 >
//                   🔄
//                 </button>
                
//                 <button className="btn bgTheme text-white whitespace-nowrap" onClick={() => setIsModalOpen(true)}>
//                   Assign Reopening Date
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto max-h-[70vh] rounded-lg">
//           <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
//             <thead className="bgTheme text-white sticky top-0 z-2">
//               <tr>
//                 <th className="px-4 py-3 text-left text-nowrap text-sm font-semibold">ID</th>
//                 <th className="px-4 py-3 text-left text-nowrap text-sm font-semibold">Student Name</th>
//                 <th className="px-4 py-3 text-left text-nowrap text-sm font-semibold">Father's Name</th>
//                 <th className="px-4 py-3 text-left text-nowrap text-sm font-semibold">Date of Birth</th>
//                 <th className="px-4 py-3 text-left text-nowrap text-sm font-semibold">Contact</th>
//                 <th className="px-4 py-3 text-left text-nowrap text-sm font-semibold">Class</th>
//                 <th className="px-4 py-3 text-left text-nowrap text-sm font-semibold">Year</th>
//                 <th className="px-4 py-3 text-center text-nowrap text-sm font-semibold">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
//               {filteredData.length === 0 ? (
//                 <tr>
//                   <td colSpan="8" className="text-center py-6 text-gray-500 dark:text-gray-300">
//                     No marksheet data available
//                   </td>
//                 </tr>
//               ) : (
//                 filteredData.map((detail) => (
//                   <tr key={detail.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
//                     {/* Show ID for debugging */}
//                     <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-400">
//                       #{detail.id}
//                     </td>
//                     <td className="whitespace-nowrap px-4 py-3 text-sm font-bold text-gray-900 dark:text-gray-200">
//                       {detail.student_name || "—"}
//                     </td>
//                     <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
//                       {detail.father_name || "—"}
//                     </td>
//                     <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
//                       {detail.date_of_birth || "—"}
//                     </td>
//                     <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
//                       {detail.contact_number || "—"}
//                     </td>
//                     <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
//                       {detail.class || "—"}
//                     </td>
//                     <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
//                       {detail.academic_year || "—"}
//                     </td>
//                     <td className="whitespace-nowrap px-4 py-3 text-sm">
//                       <div className="flex items-center space-x-2">
//                         <Link
//                           to={`/Marksheet/${detail.id}`}
//                           className="inline-flex items-center px-3 py-1 border border-[#5E35B1] rounded-md text-sm font-medium textTheme bg-blue-50 hover:bg-blue-100"
//                         >
//                           View
//                         </Link>
//                         <Link
//                           to={`/update-marksheet/${detail.id}`}
//                           className="inline-flex items-center px-3 py-1 border border-yellow-300 rounded-md text-sm font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100"
//                         >
//                           Edit
//                         </Link>
//                         <button
//                           className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-300 rounded-md"
//                           onClick={() => {
//                             console.log("Delete clicked for ID:", detail.id);
//                             setDeleteId(detail.id);
//                             setDeleteModalOpen(true);
//                           }}
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>

//           {/* Reopening Date Modal */}
//           {isModalOpen && (
//             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//               <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6 shadow-xl">
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-lg font-bold text-gray-800 dark:text-white">Assign School Reopening Date</h2>
//                   <button className="text-gray-400 hover:text-red-500" onClick={() => setIsModalOpen(false)}>✕</button>
//                 </div>
//                 <div className="mb-3">
//                   <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Reopening Date</label>
//                   <input
//                     type="date"
//                     className="input input-bordered w-full mt-1 dark:bg-gray-700 dark:text-white"
//                     value={reopenDate}
//                     onChange={(e) => setReopenDate(e.target.value)}
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Academic Year</label>
//                   <select
//                     className="select select-bordered w-full mt-1 dark:bg-gray-700 dark:text-white"
//                     value={selectedYear}
//                     onChange={(e) => setSelectedYear(e.target.value)}
//                   >
//                     <option value="">Select Year</option>
//                     {schoolYears.map((year) => (
//                       <option key={year.id} value={year.id}>{year.year_name}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="mb-4">
//                   <div className="flex justify-between items-center mb-1">
//                     <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Classes</label>
//                     <button type="button" onClick={toggleSelectAll} className="text-xs font-semibold textTheme hover:underline">
//                       {isAllSelected ? "Deselect All" : "Select All"}
//                     </button>
//                   </div>
//                   <div className="grid grid-cols-3 gap-2 mt-2">
//                     {yearLevels.map((level) => (
//                       <label key={level.id} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
//                         <input
//                           type="checkbox"
//                           checked={selectedLevels.includes(level.id)}
//                           onChange={() => setSelectedLevels((prev) =>
//                             prev.includes(level.id) ? prev.filter((x) => x !== level.id) : [...prev, level.id]
//                           )}
//                         />
//                         {level.level_name}
//                       </label>
//                     ))}
//                   </div>
//                 </div>
//                 <div className="flex justify-end gap-2">
//                   <button className="btn btn-outline" onClick={() => setIsModalOpen(false)} disabled={submitting}>Cancel</button>
//                   <button className="btn bgTheme text-white" disabled={submitting} onClick={handleBulkReopenDate}>
//                     {submitting ? "Saving..." : "Save"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Delete Modal */}
//           {deleteModalOpen && (
//             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//               <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-sm p-6 shadow-xl">
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
//                     <i className="fa-solid fa-trash text-red-500"></i>
//                   </div>
//                   <div>
//                     <h2 className="text-lg font-bold text-gray-800 dark:text-white">Delete Marksheet</h2>
//                     <p className="text-xs text-gray-400">ID: {deleteId}</p>
//                   </div>
//                 </div>
//                 <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
//                   Are you sure you want to delete this marksheet?
//                 </p>
//                 <div className="flex justify-end gap-2">
//                   <button
//                     className="btn btn-outline"
//                     onClick={() => { setDeleteModalOpen(false); setDeleteId(null); }}
//                     disabled={deleting}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     className="btn bg-red-500 hover:bg-red-600 text-white"
//                     onClick={handleDelete}
//                     disabled={deleting}
//                   >
//                     {deleting ? "Deleting..." : "Delete"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MarksheetsTable;