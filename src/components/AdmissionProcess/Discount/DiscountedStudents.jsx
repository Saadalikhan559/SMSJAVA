// import React, { useEffect, useState, useContext } from "react";
// import { fetchYearLevels } from "../../../services/api/Api";
// import { Link } from "react-router-dom";
// import { allRouterLink } from "../../../router/AllRouterLinks";
// import { AuthContext } from "../../../context/AuthContext";

// const DiscountedStudents = () => {
//   const { axiosInstance } = useContext(AuthContext);

//   const [students, setStudents] = useState([]);
//   const [editingStudent, setEditingStudent] = useState(null);
//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);
//   const [selectedClass, setSelectedClass] = useState("");
//   const [yearLevels, setYearLevels] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [formData, setFormData] = useState({
//     student_name: "",
//     admission_fee_discount: "",
//     tuition_fee_discount: "",
//     admission_fee: "",
//     tuition_fee: "",
//     discount_reason: "",
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);

//   const getYearLevels = async () => {
//     try {
//       const data = await fetchYearLevels();
//       setYearLevels(data);
//     } catch (err) {
//       console.error("Error fetching year levels:", err);
//     }
//   };

//   useEffect(() => {
//     getYearLevels();
//     loadDiscounts();
//   }, []);

//   const loadDiscounts = async () => {
//     setLoading(true);
//     setError(false);
//     try {
//       const { data } = await axiosInstance.get("/d/fee-discounts/");
//       const sortedData = [...data].sort((a, b) =>
//         a.student_name.localeCompare(b.student_name)
//       );
//       setStudents(sortedData);
//     } catch (err) {
//       console.error("Error fetching students:", err);
//       setError(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axiosInstance.delete(`/d/fee-discounts/${id}/`);
//       setStudents(students.filter((s) => s.id !== id));
//     } catch (err) {
//       console.error("Error deleting student:", err);
//     }
//   };

//   const confirmDelete = async () => {
//     if (!deleteId) return;
//     try {
//       await axiosInstance.delete(`/d/fee-discounts/${deleteId}/`);
//       setStudents(students.filter((s) => s.id !== deleteId));
//     } catch (err) {
//       console.error("Error deleting student:", err);
//     } finally {
//       setConfirmOpen(false);
//       setDeleteId(null);
//     }
//   };

//   const filteredStudents = students.filter((s) =>
//     s.year_level.toLowerCase().includes(selectedClass.toLowerCase())
//   );
//   const filteredBysearch = filteredStudents.filter((s) =>
//     s.student_name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const openDeleteModal = (id) => {
//     setDeleteId(id);
//     setConfirmOpen(true);
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
//         <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 sm:p-6">
//           <div className="mb-1">
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white text-center mb-1">
//               Discounted Students
//             </h1>
//           </div>

//           <div className="p-2">
//             <div className="flex flex-wrap justify-between items-end gap-4 mb-2 w-full border-b border-gray-300 dark:border-gray-600 pb-4">
//               <div className="flex flex-wrap items-end gap-4 w-full sm:w-auto">
//                 <div className="w-full sm:w-xs">
//                   <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
//                     Select Class
//                   </label>
//                   <select
//                     className="select select-bordered w-full focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
//                     value={selectedClass}
//                     onChange={(e) => setSelectedClass(e.target.value)}
//                   >
//                     <option value="">All Classes</option>
//                     {yearLevels.map((level) => (
//                       <option key={level.id} value={level.level_name}>
//                         {level.level_name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <button
//                   className="btn bgTheme text-white w-24"
//                   onClick={() => setSelectedClass("")}
//                 >
//                   Reset
//                 </button>
//               </div>

//               <input
//                 type="text"
//                 placeholder="Search Student"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value.trimStart())}
//                 className="border px-3 py-2 rounded w-full sm:w-64 dark:bg-gray-700 dark:text-white dark:border-gray-600"
//               />
//             </div>

//             <div className="w-full overflow-x-auto max-h-[70vh] no-scrollbar rounded-lg">
//               <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600 text-xs sm:text-sm">
//                 <thead className="bgTheme text-white z-2 sticky top-0">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Student Name</th>
//                     <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Scholar No</th>
//                     <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Year Level</th>
//                     <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Admission Fee Discount</th>
//                     <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Admission Fee</th>
//                     <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Tuition Fee Discount</th>
//                     <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Tuition Fee</th>
//                     <th className="px-4 py-3 text-center text-sm font-semibold text-nowrap">Reason</th>
//                     <th className="px-18 py-3 text-center text-sm font-semibold pl-22 text-nowrap">Actions</th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
//                   {filteredBysearch.length > 0 ? (
//                     filteredBysearch.map((s) => (
//                       <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
//                         <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200  capitalize text-nowrap">{s.student_name}</td>
//                         <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 capitalize text-nowrap">{s.scholar_no}</td>
//                         <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 text-nowrap text-center">{s.year_level}</td>
//                         <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 text-nowrap text-center">₹{s.admission_fee_discount}</td>
//                         <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 text-nowrap text-center">₹{s.admission_fee}</td>
//                         <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 text-nowrap text-center">₹{s.tuition_fee_discount}</td>
//                         <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 text-nowrap text-center">₹{s.tuition_fee}</td>
//                         <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 text-nowrap text-center">{s.discount_reason || "-"}</td>
//                         <td className="px-13 py-3 text-sm text-gray-500 dark:text-gray-300 flex gap-3">
//                           <Link
//                             to={`${allRouterLink.editStudentDiscount}/${s.id}`}
//                             className="inline-flex items-center px-3 py-1 border border-yellow-300 rounded-md shadow-sm text-sm font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
//                           >
//                             Edit
//                           </Link>
//                           <button
//                             className="inline-flex items-center px-3 py-1 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//                             onClick={() => openDeleteModal(s.id)}
//                           >
//                             Delete
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="9" className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
//                         No students found
//                       </td>
//                     </tr>
//                   )}

//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         {confirmOpen && (
//           <dialog className="modal modal-open">
//             <div className="modal-box dark:bg-gray-800 dark:text-white">
//               <h3 className="font-bold text-lg">Confirm Delete</h3>
//               <p className="py-4">Are you sure you want to delete ?</p>
//               <div className="modal-action">
//                 <button className="btn bgTheme text-white" onClick={confirmDelete}>Continue</button>
//                 <button className="btn btn-outline" onClick={() => setConfirmOpen(false)}>Cancel</button>
//               </div>
//             </div>
//           </dialog>
//         )}
//       </div>
//     </>
//   );
// };

// export default DiscountedStudents;







import React, { useEffect, useState, useContext } from "react";
import { fetchYearLevels } from "../../../services/api/Api";
import { Link } from "react-router-dom";
import { allRouterLink } from "../../../router/AllRouterLinks";
import { AuthContext } from "../../../context/AuthContext";
import { constants } from "../../../global/constants";

const DiscountedStudents = () => {
  const { axiosInstance } = useContext(AuthContext);

  const [students, setStudents] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [yearLevels, setYearLevels] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const JAVA_BASE_URL = constants.JAVA_BASE_URL;

  const getYearLevels = async () => {
    try {
      const data = await fetchYearLevels();
      setYearLevels(data);
    } catch (err) {
      console.error("Error fetching year levels:", err);
    }
  };



  const loadDiscounts = async () => {
    setLoading(true);
    setError(false);
    try {
      // const { data } = await axiosInstance.get("/d/appliedfeediscounts/");
      const { data } = await axiosInstance.get(`${JAVA_BASE_URL}/AppliedFeeDiscount/list`);
      const sortedData = [...data].sort((a, b) =>
        (a.student_name || "").localeCompare(b.student_name || "")
      );
      setStudents(sortedData);
    } catch (err) {
      console.error("Error fetching students:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };


    useEffect(() => {
    getYearLevels();
    loadDiscounts();
  }, []);

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await axiosInstance.delete(`/d/fee-discounts/${deleteId}/`);
      setStudents(students.filter((s) => s.id !== deleteId));
    } catch (err) {
      console.error("Error deleting student:", err);
    } finally {
      setConfirmOpen(false);
      setDeleteId(null);
    }
  };



  const filteredStudents = students.filter((s) => {

    if (!selectedClass) return true;
    return (s.year_level || "").toLowerCase().includes(selectedClass.toLowerCase());
  });

  const filteredBySearch = filteredStudents.filter((s) => {
    return (s.student_name || "").toLowerCase().includes(searchTerm.toLowerCase());
  });



  const openDeleteModal = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
        <i className="fa-solid fa-triangle-exclamation text-5xl text-red-400 mb-4"></i>
        <p className="text-lg text-red-400 font-medium">Failed to load data, Try Again</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen mb-24 md:mb-10">
        <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 sm:p-6">
          <div className="mb-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white text-center mb-1">
              Discounted Students
            </h1>
          </div>

          <div className="p-2">
            <div className="flex flex-wrap justify-between items-end gap-4 mb-2 w-full border-b border-gray-300 dark:border-gray-600 pb-4">
              <div className="flex flex-wrap items-end gap-4 w-full sm:w-auto">
                <div className="w-full sm:w-xs">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Select Class
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
                <button
                  className="btn bgTheme text-white w-24"
                  onClick={() => setSelectedClass("")}
                >
                  Reset
                </button>
              </div>

              <input
                type="text"
                placeholder="Search Student"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.trimStart())}
                 className="border px-3 py-2 rounded w-full sm:w-64 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>

            <div className="w-full overflow-x-auto max-h-[70vh] no-scrollbar rounded-lg">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600 text-xs sm:text-sm">
                <thead className="bgTheme text-white sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">Student Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">Fee Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">Discount Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">Discount Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">Discount %</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">Approved By</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">Approved At</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold whitespace-nowrap">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                  {filteredBySearch.length > 0 ? (
                    filteredBySearch.map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-200 capitalize whitespace-nowrap">{s.student_name}</td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-200 whitespace-nowrap">{s.fee_type_name}</td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-200 whitespace-nowrap">{s.discount_name}</td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-200 whitespace-nowrap">₹{s.discount_amount}</td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-200 whitespace-nowrap">{s.discounted_amount_percent}%</td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-200 whitespace-nowrap">{s.approved_by_name}</td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-200 whitespace-nowrap">{new Date(s.approved_at).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-300 flex gap-2 justify-center">
                          <Link
                            to={`${allRouterLink.editStudentDiscount}/${s.id}`}
                            className="px-3 py-1 border border-yellow-300 rounded-md text-yellow-700 bg-yellow-50 hover:bg-yellow-100"
                          >
                            Edit
                          </Link>
                          {/* <button
                            className="px-3 py-1 border border-red-300 rounded-md text-red-700 bg-red-50 hover:bg-red-100"
                            onClick={() => openDeleteModal(s.id)}
                          >
                            Delete
                          </button> */}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                        No students found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>


          </div>
        </div>

        {confirmOpen && (
          <dialog className="modal modal-open">
            <div className="modal-box dark:bg-gray-800 dark:text-white">
              <h3 className="font-bold text-lg">Confirm Delete</h3>
              <p className="py-4">Are you sure you want to delete ?</p>
              <div className="modal-action">
                <button className="btn bgTheme text-white" onClick={confirmDelete}>
                  Continue
                </button>
                <button className="btn btn-outline" onClick={() => setConfirmOpen(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </dialog>
        )}
      </div>
    </>
  );
};

export default DiscountedStudents;
    

