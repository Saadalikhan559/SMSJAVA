// // import React from 'react'

// // const ViewClassesFees = () => {
// //   return (
// //     <div>

// //     </div>
// //   )
// // }

// // export default ViewClassesFees


// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "../../context/AuthContext";

// const ViewClassesFees = () => {
//   const { axiosInstance } = useContext(AuthContext);

//   const [feesData, setFeesData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);

//   useEffect(() => {
//     fetchFees();
//   }, []);

//   const fetchFees = async () => {
//     setLoading(true);
//     setError(false);
//     try {
//       const { data } = await axiosInstance.get("/d/year-level-fee/");
//       setFeesData(data);
//     } catch (err) {
//       console.error("Error fetching fees data:", err);
//       setError(true);
//     } finally {
//       setLoading(false);
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
//         <p className="mt-2 text-gray-500 text-sm">Loading fees data...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
//         <i className="fa-solid fa-triangle-exclamation text-5xl text-red-400 mb-4"></i>
//         <p className="text-lg text-red-400 font-medium">Failed to load fees, Try Again</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
//       <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 sm:p-6">
//         <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white text-center mb-4">
//           <i className="fa-solid fa-money-bill ml-2"></i> Classes Fees
//         </h1>

//         <div className="w-full overflow-x-auto max-h-[70vh] no-scrollbar rounded-lg">
//           <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600 text-xs sm:text-sm">
//             <thead className="bgTheme text-white sticky top-0 z-10">
//               <tr>
//                 <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">S.No</th>
//                 <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Class</th>
//                 <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Admission Fee</th>
//                 <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Exam Fee</th>
//                 <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Transport Fee</th>
//                 <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Tuition Fee</th>
//                 <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Actions</th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
//               {feesData.length > 0 ? (
//                 feesData.map((item, index) => {
//                   const admissionFee = item.fees.find((f) => f.fee_type === "Admission Fee")?.amount || "-";
//                   const examFee = item.fees.find((f) => f.fee_type === "Exam Fee")?.amount || "-";
//                   const transportFee = item.fees.find((f) => f.fee_type === "Transport Fee")?.amount || "-";
//                   const tuitionFee = item.fees.find((f) => f.fee_type === "Tuition Fee")?.amount || "-";

//                   return (
//                     <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
//                       <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{index + 1}</td>
//                       <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{item.year_level}</td>
//                       <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 text-center">₹{admissionFee}</td>
//                       <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 text-center">₹{examFee}</td>
//                       <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 text-center">₹{transportFee}</td>
//                       <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 text-center">₹{tuitionFee}</td>
//                       <td className="px-4 py-3 flex gap-3">
//                         <button
//                           className="inline-flex items-center px-3 py-1 border border-blue-300 rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 text-sm font-medium"
//                           onClick={() => console.log("Edit", item.id)}
//                         >
//                           Edit
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })
//               ) : (
//                 <tr>
//                   <td colSpan="7" className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
//                     No fees data found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewClassesFees;


// import React, { useEffect, useState, useContext } from "react";
// import { AuthContext } from "../../context/AuthContext";

// const ViewClassesFees = () => {
//     const { axiosInstance } = useContext(AuthContext);

//     const [feesData, setFeesData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(false);

//     const [showModal, setShowModal] = useState(false);
//     const [selectedClass, setSelectedClass] = useState(null);
//     const [selectedFeeType, setSelectedFeeType] = useState("");
//     const [amount, setAmount] = useState("");

//     useEffect(() => {
//         fetchFees();
//     }, []);

//     const fetchFees = async () => {
//         setLoading(true);
//         setError(false);
//         try {
//             const { data } = await axiosInstance.get("/d/year-level-fee/");
//             setFeesData(data);
//         } catch (err) {
//             console.error("Error fetching fees data:", err);
//             setError(true);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleEdit = (item) => {
//         setSelectedClass(item);
//         // default select first fee type
//         if (item.fees.length > 0) {
//             setSelectedFeeType(item.fees[0].fee_type);
//             setAmount(item.fees[0].amount);
//         }
//         setShowModal(true);
//     };

//     const handleFeeTypeChange = (e) => {
//         const feeType = e.target.value;
//         setSelectedFeeType(feeType);
//         const feeObj = selectedClass.fees.find((f) => f.fee_type === feeType);
//         setAmount(feeObj ? feeObj.amount : "");
//     };

//     const handleSave = async () => {
//         try {
//             const feeObj = selectedClass.fees.find(f => f.fee_type === selectedFeeType);
//             if (!feeObj) return alert("Fee type not found!");

//             // Update backend
//             await axiosInstance.post(`/d/fee/${feeObj.id}/`, {
//                 amount: amount,
//                 final_amount: amount
//             });

//             // Update local state for table
//             setFeesData(prev =>
//                 prev.map(cls => {
//                     if (cls.id === selectedClass.id) {
//                         return {
//                             ...cls,
//                             fees: cls.fees.map(f =>
//                                 f.id === feeObj.id ? { ...f, amount: amount, final_amount: amount } : f
//                             )
//                         };
//                     }
//                     return cls;
//                 })
//             );

//             setShowModal(false);
//             alert("Fee updated successfully!");
//         } catch (err) {
//             console.error(err);
//             alert("Failed to update fee.");
//         }
//     };

//     if (loading) {
//         return (
//             <div className="flex flex-col items-center justify-center min-h-screen">
//                 <div className="flex space-x-2">
//                     <div className="w-3 h-3 bgTheme rounded-full animate-bounce"></div>
//                     <div className="w-3 h-3 bgTheme rounded-full animate-bounce [animation-delay:-0.2s]"></div>
//                     <div className="w-3 h-3 bgTheme rounded-full animate-bounce [animation-delay:-0.4s]"></div>
//                 </div>
//                 <p className="mt-2 text-gray-500 text-sm">Loading fees data...</p>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
//                 <i className="fa-solid fa-triangle-exclamation text-5xl text-red-400 mb-4"></i>
//                 <p className="text-lg text-red-400 font-medium">Failed to load fees, Try Again</p>
//             </div>
//         );
//     }

//     return (
//         <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
//             <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 sm:p-6">
//                 <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white text-center mb-4">
//                     <i className="fa-solid fa-money-bill ml-2"></i> Classes Fees
//                 </h1>

//                 <div className="w-full overflow-x-auto max-h-[70vh] no-scrollbar rounded-lg">
//                     <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600 text-xs sm:text-sm">
//                         <thead className="bgTheme text-white sticky top-0 z-10">
//                             <tr>
//                                 <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">S.No</th>
//                                 <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Class</th>
//                                 <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Admission Fee</th>
//                                 <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Exam Fee</th>
//                                 <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Transport Fee</th>
//                                 <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Tuition Fee</th>
//                                 <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Actions</th>
//                             </tr>
//                         </thead>

//                         <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
//                             {feesData.length > 0 ? (
//                                 feesData.map((item, index) => {
//                                     const admissionFee = item.fees.find((f) => f.fee_type === "Admission Fee")?.amount || "-";
//                                     const examFee = item.fees.find((f) => f.fee_type === "Exam Fee")?.amount || "-";
//                                     const transportFee = item.fees.find((f) => f.fee_type === "Transport Fee")?.amount || "-";
//                                     const tuitionFee = item.fees.find((f) => f.fee_type === "Tuition Fee")?.amount || "-";

//                                     return (
//                                         <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
//                                             <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{index + 1}</td>
//                                             <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{item.year_level}</td>
//                                             <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 text-center">₹{admissionFee}</td>
//                                             <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 text-center">₹{examFee}</td>
//                                             <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 text-center">₹{transportFee}</td>
//                                             <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 text-center">₹{tuitionFee}</td>
//                                             <td className="px-4 py-3 flex gap-3">
//                                                 <button
//                                                     className="inline-flex items-center px-3 py-1 border border-blue-300 rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 text-sm font-medium"
//                                                     onClick={() => handleEdit(item)}
//                                                 >
//                                                     Edit
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     );
//                                 })
//                             ) : (
//                                 <tr>
//                                     <td colSpan="7" className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
//                                         No fees data found
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//             {/* Modal */}
//             {showModal && selectedClass && (
                // <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 z-50">
                //     <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
//                         <h2 className="text-lg font-bold mb-4">Edit Fee</h2>
//                         <div className="mb-4">
//                             <label className="block font-medium">Class</label>
//                             <input
//                                 type="text"
//                                 value={selectedClass.year_level}
//                                 disabled
//                                 className="w-full border p-2 rounded bg-gray-100"
//                             />
//                         </div>
//                         <div className="mb-4">
//                             <label className="block font-medium">Fee Type</label>
//                             <select
//                                 value={selectedFeeType}
//                                 onChange={handleFeeTypeChange}
//                                 className="w-full border p-2 rounded"
//                             >
//                                 {selectedClass.fees.map((f) => (
//                                     <option key={f.id} value={f.fee_type}>
//                                         {f.fee_type}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                         <div className="mb-4">
//                             <label className="block font-medium">Amount</label>
//                             <input
//                                 type="number"
//                                 value={amount}
//                                 onChange={(e) => setAmount(e.target.value)}
//                                 className="w-full border p-2 rounded"
//                             />
//                         </div>
//                         <div className="flex justify-end gap-2">
//                             <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">
//                                 Cancel
//                             </button>
//                             <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded">
//                                 Save
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ViewClassesFees;


import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const ViewClassesFees = () => {
    const { axiosInstance } = useContext(AuthContext);

    const [feesData, setFeesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedFeeType, setSelectedFeeType] = useState("");
    const [amount, setAmount] = useState("");

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    useEffect(() => {
        fetchFees();
    }, []);

    const fetchFees = async () => {
        setLoading(true);
        setError(false);
        try {
            const { data } = await axiosInstance.get("/d/year-level-fee/");
            setFeesData(data);
        } catch (err) {
            console.error("Error fetching fees data:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        setSelectedClass(item);
        if (item.fees.length > 0) {
            setSelectedFeeType(item.fees[0].fee_type);
            setAmount(item.fees[0].amount);
        }
        setShowModal(true);
    };

    const handleFeeTypeChange = (e) => {
        const feeType = e.target.value;
        setSelectedFeeType(feeType);
        const feeObj = selectedClass.fees.find((f) => f.fee_type === feeType);
        setAmount(feeObj ? feeObj.amount : "");
    };

    const handleSave = async () => {
        try {
            const feeObj = selectedClass.fees.find(f => f.fee_type === selectedFeeType);
            if (!feeObj) {
                setAlertMessage("Fee type not found!");
                setShowAlert(true);
                return;
            }

            await axiosInstance.put(`/d/fee/${feeObj.id}/`, {
                amount: amount,
                final_amount: amount
            });

            setFeesData(prev =>
                prev.map(cls => {
                    if (cls.id === selectedClass.id) {
                        return {
                            ...cls,
                            fees: cls.fees.map(f =>
                                f.id === feeObj.id ? { ...f, amount: amount, final_amount: amount } : f
                            )
                        };
                    }
                    return cls;
                })
            );

            setShowModal(false);
            setAlertMessage("Fee updated successfully!");
            setShowAlert(true);
        } catch (err) {
            console.error(err);
            setAlertMessage("Failed to update fee.");
            setShowAlert(true);
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
                <p className="mt-2 text-gray-500 text-sm">Loading fees data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
                <i className="fa-solid fa-triangle-exclamation text-5xl text-red-400 mb-4"></i>
                <p className="text-lg text-red-400 font-medium">Failed to load fees, Try Again</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
            <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 sm:p-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white text-center mb-4">
                    <i className="fa-solid fa-money-bill ml-2"></i> Classes Fees
                </h1>

                <div className="w-full overflow-x-auto max-h-[70vh] no-scrollbar rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600 text-xs sm:text-sm">
                        <thead className="bgTheme text-white sticky top-0 z-1">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">S.No</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Class</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Admission Fee</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Exam Fee</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Transport Fee</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Tuition Fee</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                            {feesData.length > 0 ? (
                                feesData.map((item, index) => {
                                    const admissionFee = item.fees.find((f) => f.fee_type === "Admission Fee")?.amount || "-";
                                    const examFee = item.fees.find((f) => f.fee_type === "Exam Fee")?.amount || "-";
                                    const transportFee = item.fees.find((f) => f.fee_type === "Transport Fee")?.amount || "-";
                                    const tuitionFee = item.fees.find((f) => f.fee_type === "Tuition Fee")?.amount || "-";

                                    return (
                                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{index + 1}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{item.year_level}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 text-center">₹{admissionFee}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 text-center">₹{examFee}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 text-center">₹{transportFee}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 text-center">₹{tuitionFee}</td>
                                            <td className="px-4 py-3 flex gap-3">
                                                <button
                                                    className="inline-flex items-center px-3 py-1 border border-blue-300 rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 text-sm font-medium"
                                                    onClick={() => handleEdit(item)}
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                                        No fees data found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            {showModal && selectedClass && (
                                <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
                        <h2 className="text-lg font-bold mb-4">Edit Fee</h2>
                        <div className="mb-4">
                            <label className="block font-medium">Class</label>
                            <input
                                type="text"
                                value={selectedClass.year_level}
                                disabled
                                className="w-full border p-2 rounded bg-gray-100"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block font-medium">Fee Type</label>
                            <select
                                value={selectedFeeType}
                                onChange={handleFeeTypeChange}
                                className="w-full border p-2 rounded"
                            >
                                {selectedClass.fees.map((f) => (
                                    <option key={f.id} value={f.fee_type}>
                                        {f.fee_type}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block font-medium">Amount</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full border p-2 rounded"
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">
                                Cancel
                            </button>
                            <button onClick={handleSave} className="px-4 py-2 bgTheme text-white rounded">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Alert Modal */}
            {showAlert && (
                <dialog open className="modal modal-open">
                    <div className="modal-box dark:bg-gray-800 dark:text-gray-100">
                        <h3 className="font-bold text-lg">Notification</h3>
                        <p className="py-4">{alertMessage}</p>
                        <div className="modal-action">
                            <button
                                className="btn bgTheme text-white w-24"
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

export default ViewClassesFees;
