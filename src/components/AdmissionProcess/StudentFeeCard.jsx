import { useEffect, useState } from "react";
import { fetchStudentFee } from "../../services/api/Api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useParams } from "react-router-dom";

export const StudentFeeCard = () => {
  const [details, setDetails] = useState(null);
  const [filteredSummary, setFilteredSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allFeeTypes, setAllFeeTypes] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const { student_id } = useParams();

  const getStudentFeeDetails = async () => {
    if (!student_id) {
      console.warn("student_id is missing from URL");
      return;
    }

    setLoading(true);
    try {
      const data = await fetchStudentFee(student_id);
      console.log("Student Fee Data:", data);

      if (
        !data ||
        !Array.isArray(data.monthly_summary) ||
        data.monthly_summary.length === 0
      ) {
        setDetails(null);
        setFilteredSummary([]);
        setAllFeeTypes([]);
        return;
      }

      setDetails(data);

      const uniqueTypes = new Set();
      data.monthly_summary.forEach((item) => {
        item.fee_type?.forEach((f) => uniqueTypes.add(f.type));
      });
      setAllFeeTypes([...uniqueTypes]);
      setFilteredSummary(data.monthly_summary);
    } catch (error) {
      console.error("Failed to fetch student fee data", error.response?.data || error);
      setDetails(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (student_id) {
      getStudentFeeDetails();
    }
  }, [student_id]);

  useEffect(() => {
    if (!details) return;
    let filtered = [...details.monthly_summary];
    if (selectedMonth) {
      filtered = filtered.filter((item) =>
        item.month.toLowerCase().includes(selectedMonth.toLowerCase())
      );
    }
    if (selectedYear) {
      filtered = filtered.filter((item) => item.year === selectedYear);
    }
    setFilteredSummary(filtered);
  }, [selectedMonth, selectedYear, details]);

  const exportPDF = () => {
    if (!details || !filteredSummary) return;

    const doc = new jsPDF("portrait", "pt", "A3");
    const margin = 40;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(30, 64, 175);
    doc.text(`${details.student_name}'s Fee Report`, margin, 50);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text(`Class: ${details.year_level}`, margin, 70);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, 85);

    const headers = [["Month", ...allFeeTypes, "Total Amount", "Dues"]];
    const data = filteredSummary.map((item) => {
      const row = [item.month];
      allFeeTypes.forEach((type) => {
        const fee = item.fee_type.find((f) => f.type === type)?.amount || 0;
        row.push(`₹ ${fee.toFixed(2)}`);
      });
      row.push(`₹ ${item.total_amount.toFixed(2)}`);
      row.push(`₹ ${item.due_amount.toFixed(2)}`);
      return row;
    });

    const totalRow = ["Total"];
    allFeeTypes.forEach((type) => {
      const sum = filteredSummary.reduce(
        (acc, i) => acc + (i.fee_type.find((f) => f.type === type)?.amount || 0),
        0
      );
      totalRow.push(`₹ ${sum.toFixed(2)}`);
    });
    totalRow.push(`₹ ${filteredSummary.reduce((sum, i) => sum + i.total_amount, 0).toFixed(2)}`);
    totalRow.push(`₹ ${filteredSummary.reduce((sum, i) => sum + i.due_amount, 0).toFixed(2)}`);
    data.push(totalRow);

    autoTable(doc, {
      startY: 100,
      head: headers,
      body: data,
      styles: {
        font: "helvetica",
        fontSize: 10,
        halign: "center",
        valign: "middle",
        cellPadding: { top: 8, bottom: 8, left: 14, right: 14 },
        textColor: [33, 37, 41],
      },
      headStyles: {
        fillColor: [30, 64, 175],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 11,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      margin: { left: margin, right: margin },
    });

    doc.save(`${details.student_name}_fee_report.pdf`);
  };

if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <i className="fa-solid fa-spinner fa-spin mr-2 text-4xl" />
            </div>
        );
    }

  if (!details) {
    return (
      <div className="p-4 text-center text-red-600 font-medium">
        No fee data available for this student.
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5 bg-gray-50">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          <i className="fa-solid fa-money-check-alt mr-2"></i>{" "}
          {details.student_name}'s Fee Report Card
        </h1>

        <div className="flex gap-4 justify-center mb-6 flex-wrap">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">All Months</option>
            {[...new Set(details.monthly_summary.map((item) => item.month))].map((month, idx) => (
              <option key={idx} value={month}>
                {month}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">All Years</option>
            {[...new Set(details.monthly_summary.map((item) => item.year).filter(Boolean))].map(
              (year, idx) => (
                <option key={idx} value={year}>
                  {year}
                </option>
              )
            )}
          </select>

          <button
            onClick={exportPDF}
            className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium px-4 py-2 rounded border border-blue-300"
          >
            <i className="fa-solid fa-download mr-2" /> Download Report
          </button>
        </div>

        {filteredSummary.length === 0 ? (
          <div className="text-center text-gray-600">No fee records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1200px] table-auto border border-gray-300 rounded-lg overflow-hidden">
              <thead className="bgTheme text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Month</th>
                  {allFeeTypes.map((type, i) => (
                    <th key={i} className="px-4 py-3 text-left text-sm font-semibold">
                      {type}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left text-sm font-semibold">Total</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Dues</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSummary.map((item, index) => (
                  <tr key={index} className="hover:bg-blue-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{item.month}</td>
                    {allFeeTypes.map((type, i) => {
                      const amount = item.fee_type.find((f) => f.type === type)?.amount || 0;
                      return (
                        <td key={i} className="px-4 py-3 text-sm text-gray-500">
                          ₹{amount.toFixed(2)}
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 text-sm text-gray-500">
                      ₹{item.total_amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-red-600 font-medium">
                      ₹{item.due_amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};




// import { useEffect, useState } from "react";
// import { fetchStudentFee, fetchUnpaidFees, fetchYearLevels } from "../../services/api/Api";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import { useParams } from "react-router-dom";
// import { constants } from "../../global/constants";

// const StudentFeeAndUnpaidSummary = ({ userRole, yearLevelID, studentID, userID }) => {
//   // -------- Student Fee Card States --------
//   const [details, setDetails] = useState(null);
//   const [filteredSummary, setFilteredSummary] = useState([]);
//   const [loadingStudent, setLoadingStudent] = useState(true);
//   const [allFeeTypes, setAllFeeTypes] = useState([]);
//   const [selectedMonthFee, setSelectedMonthFee] = useState("");
//   const [selectedYearFee, setSelectedYearFee] = useState("");
//   const { student_id } = useParams();

//   // -------- Unpaid Fees States --------
//   const [unpaidFees, setUnpaidFees] = useState([]);
//   const [loadingUnpaid, setLoadingUnpaid] = useState(false);
//   const [error, setError] = useState(null);
//   const [selectedMonthUnpaid, setSelectedMonthUnpaid] = useState("");
//   const [selectedClass, setSelectedClass] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [yearLevels, setYearLevels] = useState([]);

//   // ============================
//   // Fetch Student Fee Details
//   // ============================
//   const getStudentFeeDetails = async () => {
//     if (!student_id) return;
//     setLoadingStudent(true);
//     try {
//       const data = await fetchStudentFee(student_id);
//       if (!data?.monthly_summary?.length) {
//         setDetails(null);
//         setFilteredSummary([]);
//         setAllFeeTypes([]);
//         return;
//       }
//       setDetails(data);
//       const uniqueTypes = new Set();
//       data.monthly_summary.forEach((item) => {
//         item.fee_type?.forEach((f) => uniqueTypes.add(f.type));
//       });
//       setAllFeeTypes([...uniqueTypes]);
//       setFilteredSummary(data.monthly_summary);
//     } catch (error) {
//       console.error("Failed to fetch student fee data", error);
//       setDetails(null);
//     } finally {
//       setLoadingStudent(false);
//     }
//   };

//   useEffect(() => {
//     if (student_id) getStudentFeeDetails();
//   }, [student_id]);

//   useEffect(() => {
//     if (!details) return;
//     let filtered = [...details.monthly_summary];
//     if (selectedMonthFee) {
//       filtered = filtered.filter((item) =>
//         item.month.toLowerCase().includes(selectedMonthFee.toLowerCase())
//       );
//     }
//     if (selectedYearFee) {
//       filtered = filtered.filter((item) => item.year === selectedYearFee);
//     }
//     setFilteredSummary(filtered);
//   }, [selectedMonthFee, selectedYearFee, details]);

//   const exportPDF = () => {
//     if (!details || !filteredSummary) return;
//     const doc = new jsPDF("portrait", "pt", "A3");
//     const margin = 40;
//     doc.setFont("helvetica", "bold").setFontSize(22).setTextColor(30, 64, 175);
//     doc.text(`${details.student_name}'s Fee Report`, margin, 50);
//     doc.setFont("helvetica", "normal").setFontSize(12).setTextColor(60, 60, 60);
//     doc.text(`Class: ${details.year_level}`, margin, 70);
//     doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, 85);

//     const headers = [["Month", ...allFeeTypes, "Total Amount", "Dues"]];
//     const data = filteredSummary.map((item) => {
//       const row = [item.month];
//       allFeeTypes.forEach((type) => {
//         const fee = item.fee_type.find((f) => f.type === type)?.amount || 0;
//         row.push(`₹ ${fee.toFixed(2)}`);
//       });
//       row.push(`₹ ${item.total_amount.toFixed(2)}`);
//       row.push(`₹ ${item.due_amount.toFixed(2)}`);
//       return row;
//     });

//     const totalRow = ["Total"];
//     allFeeTypes.forEach((type) => {
//       const sum = filteredSummary.reduce(
//         (acc, i) => acc + (i.fee_type.find((f) => f.type === type)?.amount || 0),
//         0
//       );
//       totalRow.push(`₹ ${sum.toFixed(2)}`);
//     });
//     totalRow.push(`₹ ${filteredSummary.reduce((sum, i) => sum + i.total_amount, 0).toFixed(2)}`);
//     totalRow.push(`₹ ${filteredSummary.reduce((sum, i) => sum + i.due_amount, 0).toFixed(2)}`);
//     data.push(totalRow);

//     autoTable(doc, {
//       startY: 100,
//       head: headers,
//       body: data,
//       styles: { font: "helvetica", fontSize: 10, halign: "center", valign: "middle" },
//       headStyles: { fillColor: [30, 64, 175], textColor: [255, 255, 255] },
//       alternateRowStyles: { fillColor: [248, 250, 252] },
//       margin: { left: margin, right: margin },
//     });

//     doc.save(`${details.student_name}_fee_report.pdf`);
//   };

//   // ============================
//   // Fetch Unpaid Fees
//   // ============================
//   const getYearLevels = async () => {
//     try {
//       const data = await fetchYearLevels();
//       setYearLevels(data);
//     } catch (err) {
//       console.error("Error fetching year levels:", err);
//     }
//   };

//   const loadUnpaidFees = async () => {
//     try {
//       setLoadingUnpaid(true);
//       let params = { role: userRole, month: selectedMonthUnpaid };
//       if (userRole === constants.roles.director || userRole === constants.roles.officeStaff) {
//         params.class_id = selectedClass || "";
//       } else if (userRole === constants.roles.teacher) {
//         params.class_id = yearLevelID || "";
//       } else if (userRole === constants.roles.guardian) {
//         params.student_id = studentID || "";
//       } else if (userRole === constants.roles.student) {
//         params.student_id = userID || "";
//       }
//       const data = await fetchUnpaidFees(params);
//       setUnpaidFees(data || []);
//       setError(null);
//     } catch (err) {
//       setError("Failed to load unpaid fees");
//     } finally {
//       setLoadingUnpaid(false);
//     }
//   };

//   useEffect(() => {
//     getYearLevels();
//   }, []);

//   useEffect(() => {
//     loadUnpaidFees();
//   }, [selectedMonthUnpaid, selectedClass]);

//   const filteredFees = unpaidFees.filter((item) =>
//     item.student?.name?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // ============================
//   // Render
//   // ============================
//   if (loadingStudent || loadingUnpaid) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <i className="fa-solid fa-spinner fa-spin mr-2 text-4xl" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen p-5 bg-gray-50 space-y-10">
//       {/* --------- Top Half: Student Fee Card --------- */}
//       <div className="bg-white shadow-lg rounded-lg p-6">
//         {details ? (
//           <>
//             <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
//               {details.student_name}'s Fee Report Card
//             </h1>
//             {/* Filters */}
//             <div className="flex gap-4 justify-center mb-6 flex-wrap">
//               <select value={selectedMonthFee} onChange={(e) => setSelectedMonthFee(e.target.value)} className="border rounded px-3 py-2">
//                 <option value="">All Months</option>
//                 {[...new Set(details.monthly_summary.map((i) => i.month))].map((m, idx) => (
//                   <option key={idx} value={m}>{m}</option>
//                 ))}
//               </select>
//               <select value={selectedYearFee} onChange={(e) => setSelectedYearFee(e.target.value)} className="border rounded px-3 py-2">
//                 <option value="">All Years</option>
//                 {[...new Set(details.monthly_summary.map((i) => i.year).filter(Boolean))].map((y, idx) => (
//                   <option key={idx} value={y}>{y}</option>
//                 ))}
//               </select>
//               <button onClick={exportPDF} className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium px-4 py-2 rounded border">
//                 <i className="fa-solid fa-download mr-2" /> Download Report
//               </button>
//             </div>
//             {/* Table */}
//             <div className="overflow-x-auto">
//               <table className="min-w-[1200px] table-auto border border-gray-300">
//                 <thead className="bgTheme text-white">
//                   <tr>
//                     <th className="px-4 py-3">Month</th>
//                     {allFeeTypes.map((type, i) => <th key={i} className="px-4 py-3">{type}</th>)}
//                     <th className="px-4 py-3">Total</th>
//                     <th className="px-4 py-3">Dues</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredSummary.map((item, idx) => (
//                     <tr key={idx} className="hover:bg-blue-50">
//                       <td className="px-4 py-3">{item.month}</td>
//                       {allFeeTypes.map((type, i) => (
//                         <td key={i} className="px-4 py-3">₹{(item.fee_type.find(f => f.type === type)?.amount || 0).toFixed(2)}</td>
//                       ))}
//                       <td className="px-4 py-3">₹{item.total_amount.toFixed(2)}</td>
//                       <td className="px-4 py-3 text-red-600">₹{item.due_amount.toFixed(2)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </>
//         ) : (
//           <div className="p-4 text-center text-red-600 font-medium">No fee data available for this student.</div>
//         )}
//       </div>

//       {/* --------- Bottom Half: Unpaid Fees Summary --------- */}
//       <div className="bg-white p-6 rounded-lg shadow-lg">
//         <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
//           Unpaid Accounts Summary
//         </h1>
//         {/* Filters */}
//         <div className="flex flex-wrap justify-center items-end gap-4 mb-6">
//           <div>
//             <label className="text-sm font-medium mb-1">Filter by Month:</label>
//             <select className="border rounded px-3 py-2 text-sm" value={selectedMonthUnpaid} onChange={(e) => setSelectedMonthUnpaid(e.target.value)}>
//               <option value="">All Months</option>
//               {[
//                 "January","February","March","April","May","June",
//                 "July","August","September","October","November","December"
//               ].map((m) => <option key={m} value={m}>{m}</option>)}
//             </select>
//           </div>
//           {(userRole === constants.roles.director || userRole === constants.roles.officeStaff) && (
//             <div>
//               <label className="text-sm font-medium mb-1">Filter by Class:</label>
//               <select className="border rounded px-3 py-2 text-sm" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
//                 <option value="">All Classes</option>
//                 {yearLevels.map((lvl) => <option key={lvl.id} value={lvl.id}>{lvl.level_name}</option>)}
//               </select>
//             </div>
//           )}
//           <div>
//             <label className="text-sm font-medium mb-1">Search Student:</label>
//             <input type="text" placeholder="Enter student name" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border rounded px-3 py-2 text-sm" />
//           </div>
//           <button onClick={() => { setSelectedMonthUnpaid(""); setSelectedClass(""); setSearchTerm(""); }} className="bg-gray-200 px-4 py-2 rounded">
//             Reset Filters
//           </button>
//         </div>
//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="min-w-full table-auto border border-gray-300">
//             <thead className="bgTheme text-white">
//               <tr>
//                 <th className="px-4 py-3">S.No</th>
//                 <th className="px-4 py-3">Student Name</th>
//                 <th className="px-4 py-3">Class</th>
//                 <th className="px-4 py-3">Month</th>
//                 <th className="px-4 py-3">Fee Type</th>
//                 <th className="px-4 py-3">Total Amount</th>
//                 <th className="px-4 py-3">Paid Amount</th>
//                 <th className="px-4 py-3">Due Amount</th>
//                 <th className="px-4 py-3">Payment Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredFees.length === 0 ? (
//                 <tr><td colSpan="9" className="text-center py-6 text-gray-500">No data found.</td></tr>
//               ) : (
//                 filteredFees.map((item, index) =>
//                   item.year_level_fees_grouped?.flatMap((group) =>
//                     group.fees?.map((fee) => (
//                       <tr key={`${item.id}-${group.year_level}-${fee.id}`} className="hover:bg-blue-50">
//                         <td className="px-4 py-3">{index + 1}</td>
//                         <td className="px-4 py-3">{item.student?.name}</td>
//                         <td className="px-4 py-3">{group.year_level}</td>
//                         <td className="px-4 py-3">{item.month}</td>
//                         <td className="px-4 py-3">{fee.fee_type}</td>
//                         <td className="px-4 py-3">₹{fee.amount}</td>
//                         <td className="px-4 py-3">₹{item.paid_amount}</td>
//                         <td className="px-4 py-3">₹{item.due_amount}</td>
//                         <td className="px-4 py-3">{item.payment_status}</td>
//                       </tr>
//                     ))
//                   )
//                 )
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentFeeAndUnpaidSummary;
