// import React, { useRef } from "react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas-pro";

// const PaymentStatusDialogOffline = ({ paymentStatus, onClose }) => {
//   if (!paymentStatus) return null;

//    const printRef = useRef();

//   const formatDate = (dateString) => {
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return dateString;
//       const options = { year: "numeric", month: "short", day: "numeric" };
//       return date.toLocaleDateString("en-US", options);
//     } catch {
//       return dateString;
//     }
//   };

//   const handlePrint = () => {
//     const originalContents = document.body.innerHTML;
//     const printContents = printRef.current.innerHTML;

//     document.body.innerHTML = printContents;
//     window.print();
//     document.body.innerHTML = originalContents;
//     window.location.reload();
//   };
// console.log(paymentStatus);

// // const month = paymentStatus.month.map()


//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-2">
//       <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 w-full max-w-md p-4 rounded-lg shadow-lg border border-gray-300 dark:border-gray-600">

//         {/* Header */}
//         <div className="flex justify-between items-center border-b dark:border-gray-600 pb-2 mb-3">
//           <h2 className="text-lg font-bold text-green-600 dark:text-green-400">Payment Receipt</h2>
//           <button onClick={onClose} className="btn btn-circle btn-xs bg-gray-200 dark:bg-gray-700 dark:text-white">
//             ✕
//           </button>
//         </div>

//         {/* Receipt Content */}
//         <div ref={printRef} className="space-y-3 text-sm">
//           {/* Receipt Details */}
//           <div>
//             <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm">Receipt Details</h3>
//             <div className="grid grid-cols-2 gap-1 text-xs">
//               <p><strong>No:</strong> {paymentStatus.receipt_number}</p>
//               <p><strong>Date:</strong> {formatDate(paymentStatus.payment_date)}</p>
//               <p><strong>Month:</strong> {paymentStatus.months}</p>
//               <p><strong>Mode:</strong> {paymentStatus.payment_mode}</p>
//               {paymentStatus.payment_mode === "Cheque" && (
//                 <p>
//                   <strong>Cheque:</strong>{" "}
//                   {paymentStatus.is_cheque_cleared ? "Cleared" : "Pending"}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Student Info */}
//           <div>
//             <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm">Student</h3>
//             <p className="text-xs">{paymentStatus.student.name}</p>
//           </div>
//           <div>
//             <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm">Received by</h3>
//             <p className="text-xs">{paymentStatus.received_by}</p>
//           </div>
//           <div>
//             <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm">remarks</h3>
//             <p className="text-xs">{paymentStatus.remarks}</p>
//           </div>

//           {/* Fee Breakdown */}
//           {/* <div>
//             <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm">Fees</h3>
//             {paymentStatus.year_level_fees_grouped?.map((group, index) => (
//               <div key={index} className="mt-1">
//                 <p className="font-medium text-xs">{group.year_level}</p>
//                 <ul className="list-disc ml-4 text-xs text-gray-700 dark:text-gray-300">
//                   {group.fees?.map((fee, feeIndex) => (
//                     <li key={feeIndex}>
//                       {fee.fee_type}: ₹{fee.amount}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div> */}

//           {/* Summary */}
//           <div className="border-t dark:border-gray-600 pt-2">
//             <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm">Summary</h3>
//             <p className="text-xs"><strong>Total:</strong> ₹{paymentStatus.total_amount}</p>
//             <p className="text-xs text-green-600 dark:text-green-400">
//               <strong>Paid:</strong> ₹{paymentStatus.paid_amount}
//             </p>
//             {/* <p className="text-xs text-red-600 dark:text-red-400">
//               <strong>Due:</strong> ₹{paymentStatus.due_amount}
//             </p> */}
//             {paymentStatus.late_fee &&
//               parseFloat(paymentStatus.late_fee) > 0 && (
//                 <p className="text-xs"><strong>Late Fee:</strong> ₹{paymentStatus.late_fee}</p>
//               )}
//           </div>
//         </div>
                
//         {/* Buttons */}
//         <div className="mt-4 flex justify-end gap-2">
//           <button
//             onClick={handlePrint}
//             className="btn bgTheme text-white btn-sm hover:opacity-90"
//           >
//             Download
//           </button>
//           <button
//             onClick={onClose}
//             className="btn bg-gray-300 dark:bg-gray-600 dark:text-white btn-sm"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentStatusDialogOffline;



// import React, { useRef } from "react";

// const PaymentStatusDialogOffline = ({ paymentStatus, onClose }) => {
//   const printRef = useRef();

//   // Debug log
//   console.log("PaymentStatusDialogOffline received:", paymentStatus);

//   // Early return if no data
//   if (!paymentStatus) {
//     console.log("No paymentStatus data");
//     return null;
//   }

//   const formatDate = (dateString) => {
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return dateString || "N/A";
//       const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
//       return date.toLocaleDateString("en-IN", options);
//     } catch {
//       return dateString || "N/A";
//     }
//   };

//   const handlePrint = () => {
//     const originalContents = document.body.innerHTML;
//     const printContents = printRef.current.innerHTML;

//     document.body.innerHTML = printContents;
//     window.print();
//     document.body.innerHTML = originalContents;
//     window.location.reload();
//   };

//   // Safe data extraction with fallbacks
//   const receiptNumber = paymentStatus.receipt_number || `RCP-${Date.now()}`;
//   const paymentDate = paymentStatus.payment_date || new Date().toISOString();
//   const months = paymentStatus.months || "N/A";
//   const paymentMode = paymentStatus.payment_mode || "CASH";
//   const isChequeCleared = paymentStatus.is_cheque_cleared;
  
//   // Safe student access
//   const studentName = paymentStatus.student?.name || paymentStatus.student_name || "N/A";
//   const scholarNumber = paymentStatus.student?.scholar_number || paymentStatus.scholar_number || "";
  
//   const receivedBy = paymentStatus.received_by || "Office Staff";
//   const remarks = paymentStatus.remarks || "N/A";
  
//   // Amount fields
//   const totalAmount = paymentStatus.total_amount || paymentStatus.total_amount_paid || 0;
//   const paidAmount = paymentStatus.paid_amount || paymentStatus.total_amount_paid || 0;
//   const lateFee = paymentStatus.late_fee || 0;
  
//   // Fee data
//   const feeData = paymentStatus.data || [];
//   const message = paymentStatus.message || "Payment successful";

//   // Month number to name mapping
//   const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//                       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-2">
//       <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 w-full max-w-md p-4 rounded-lg shadow-lg border border-gray-300 dark:border-gray-600">

//         {/* Header */}
//         <div className="flex justify-between items-center border-b dark:border-gray-600 pb-2 mb-3">
//           <div className="flex items-center gap-2">
//             <i className="fa-solid fa-circle-check text-green-500 text-xl"></i>
//             <h2 className="text-lg font-bold text-green-600 dark:text-green-400">Payment Receipt</h2>
//           </div>
//           <button onClick={onClose} className="btn btn-circle btn-xs bg-gray-200 dark:bg-gray-700 dark:text-white">
//             ✕
//           </button>
//         </div>

//         {/* Success Message */}
//         <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-2 mb-3">
//           <p className="text-green-700 dark:text-green-400 text-xs text-center font-medium">
//             ✓ {message}
//           </p>
//         </div>

//         {/* Receipt Content */}
//         <div ref={printRef} className="space-y-3 text-sm">
//           {/* Receipt Details */}
//           <div>
//             <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm mb-1">
//               <i className="fa-solid fa-receipt mr-1 text-purple-500"></i>
//               Receipt Details
//             </h3>
//             <div className="grid grid-cols-2 gap-1 text-xs bg-gray-50 dark:bg-gray-700 p-2 rounded">
//               <p><strong>No:</strong> {receiptNumber}</p>
//               <p><strong>Date:</strong> {formatDate(paymentDate)}</p>
//               <p><strong>Month:</strong> {months}</p>
//               <p>
//                 <strong>Mode:</strong>{" "}
//                 <span className={`badge badge-sm ${
//                   paymentMode === "CASH" ? "badge-success" : 
//                   paymentMode === "CHEQUE" ? "badge-warning" : "badge-info"
//                 } text-white`}>
//                   {paymentMode}
//                 </span>
//               </p>
//               {paymentMode === "CHEQUE" && (
//                 <p className="col-span-2">
//                   <strong>Cheque Status:</strong>{" "}
//                   <span className={`badge badge-sm ${isChequeCleared ? "badge-success" : "badge-warning"} text-white`}>
//                     {isChequeCleared ? "Cleared" : "Pending"}
//                   </span>
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Student Info */}
//           <div>
//             <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm mb-1">
//               <i className="fa-solid fa-user-graduate mr-1 text-blue-500"></i>
//               Student
//             </h3>
//             <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-xs">
//               <p className="font-medium">{studentName}</p>
//               {scholarNumber && <p className="text-gray-500">Scholar No: {scholarNumber}</p>}
//             </div>
//           </div>

//           {/* Fee Breakdown */}
//           {feeData.length > 0 && (
//             <div>
//               <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm mb-1">
//                 <i className="fa-solid fa-list mr-1 text-orange-500"></i>
//                 Fee Breakdown
//               </h3>
//               <div className="bg-gray-50 dark:bg-gray-700 rounded overflow-hidden">
//                 <table className="w-full text-xs">
//                   <thead className="bg-gray-200 dark:bg-gray-600">
//                     <tr>
//                       <th className="text-left p-2">Fee Type</th>
//                       <th className="text-center p-2">Month</th>
//                       <th className="text-center p-2">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {feeData.map((fee, index) => (
//                       <tr key={index} className="border-b border-gray-200 dark:border-gray-600">
//                         <td className="p-2">{fee.fee_type?.replace(/_/g, ' ') || `Fee ${index + 1}`}</td>
//                         <td className="p-2 text-center">{monthNames[fee.month] || fee.month}</td>
//                         <td className="p-2 text-center">
//                           <span className="badge badge-success badge-xs text-white">{fee.status}</span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {/* Received By & Remarks */}
//           <div className="grid grid-cols-2 gap-2">
//             <div>
//               <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm">Received by</h3>
//               <p className="text-xs bg-gray-50 dark:bg-gray-700 p-2 rounded">{receivedBy}</p>
//             </div>
//             <div>
//               <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm">Remarks</h3>
//               <p className="text-xs bg-gray-50 dark:bg-gray-700 p-2 rounded">{remarks}</p>
//             </div>
//           </div>

//           {/* Summary */}
//           <div className="border-t dark:border-gray-600 pt-2">
//             <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm mb-1">
//               <i className="fa-solid fa-calculator mr-1 text-green-500"></i>
//               Summary
//             </h3>
//             <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-lg">
//               <div className="flex justify-between items-center">
//                 <span className="font-medium">Total Paid:</span>
//                 <span className="text-xl font-bold">
//                   ₹{parseFloat(paidAmount).toLocaleString('en-IN', {
//                     minimumFractionDigits: 2,
//                     maximumFractionDigits: 2
//                   })}
//                 </span>
//               </div>
//             </div>
//             {parseFloat(lateFee) > 0 && (
//               <p className="text-xs mt-1 text-orange-500">
//                 <strong>Late Fee Included:</strong> ₹{lateFee}
//               </p>
//             )}
//           </div>

//           {/* Footer */}
//           <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-2 border-t">
//             <p>Thank you for your payment!</p>
//           </div>
//         </div>
                
//         {/* Buttons */}
//         <div className="mt-4 flex justify-end gap-2">
//           <button
//             onClick={handlePrint}
//             className="btn bgTheme text-white btn-sm hover:opacity-90"
//           >
//             <i className="fa-solid fa-print mr-1"></i>
//             Print
//           </button>
//           <button
//             onClick={onClose}
//             className="btn bg-gray-300 dark:bg-gray-600 dark:text-white btn-sm"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentStatusDialogOffline;




import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

const PaymentStatusDialogOffline = ({ paymentStatus, onClose }) => {
  const printRef = useRef();

  if (!paymentStatus) return null;

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  // ───────── PDF DOWNLOAD ─────────
  const handleDownload = async () => {
    const element = printRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`receipt-${receiptNumber}.pdf`);
  };

  // ───────── SAFE DATA ─────────
  const receiptNumber = paymentStatus.receipt_number || `RCP-${Date.now()}`;
  const paymentDate = paymentStatus.payment_date || new Date().toISOString();
  const months = paymentStatus.months || "N/A";
  const paymentMode = paymentStatus.payment_mode || "CASH";
  const isChequeCleared = paymentStatus.is_cheque_cleared;

  const studentName =
    paymentStatus.student?.name || paymentStatus.student_name || "N/A";
  const scholarNumber =
    paymentStatus.student?.scholar_number ||
    paymentStatus.scholar_number ||
    "";

  const receivedBy = paymentStatus.received_by || "Office Staff";
  const remarks = paymentStatus.remarks || "N/A";

  const paidAmount =
    paymentStatus.paid_amount || paymentStatus.total_amount_paid || 0;
  const lateFee = paymentStatus.late_fee || 0;

  const feeData = paymentStatus.data || [];
  const message = paymentStatus.message || "Payment successful";

  const monthNames = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-2">
      <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 w-full max-w-md p-4 rounded-lg shadow-lg border border-gray-300 dark:border-gray-600">

        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2 mb-3">
          <h2 className="text-lg font-bold text-green-600">
            Payment Receipt
          </h2>
          <button
            onClick={onClose}
            className="btn btn-circle btn-xs bg-gray-200"
          >
            ✕
          </button>
        </div>

        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-3">
          <p className="text-green-700 text-xs text-center font-medium">
            ✓ {message}
          </p>
        </div>

        {/* Printable Content */}
        <div ref={printRef} className="space-y-3 text-sm">

          {/* Receipt Details */}
          <div>
            <h3 className="font-semibold text-sm mb-1">Receipt Details</h3>
            <div className="grid grid-cols-2 gap-1 text-xs bg-gray-50 p-2 rounded">
              <p><strong>No:</strong> {receiptNumber}</p>
              <p><strong>Date:</strong> {formatDate(paymentDate)}</p>
              <p><strong>Month:</strong> {months}</p>
              <p>
                <strong>Mode:</strong>{" "}
                <span className="badge badge-sm badge-success text-white">
                  {paymentMode}
                </span>
              </p>
              {paymentMode === "CHEQUE" && (
                <p className="col-span-2">
                  <strong>Cheque Status:</strong>{" "}
                  <span
                    className={`badge badge-sm ${
                      isChequeCleared
                        ? "badge-success"
                        : "badge-warning"
                    } text-white`}
                  >
                    {isChequeCleared ? "Cleared" : "Pending"}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Student */}
          <div>
            <h3 className="font-semibold text-sm mb-1">Student</h3>
            <div className="bg-gray-50 p-2 rounded text-xs">
              <p className="font-medium">{studentName}</p>
              {scholarNumber && (
                <p className="text-gray-500">
                  Scholar No: {scholarNumber}
                </p>
              )}
            </div>
          </div>

          {/* Fee Breakdown */}
          {feeData.length > 0 && (
            <div>
              <h3 className="font-semibold text-sm mb-1">Fee Breakdown</h3>
              <div className="bg-gray-50 rounded overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="text-left p-2">Fee Type</th>
                      <th className="text-center p-2">Month</th>
                      <th className="text-center p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feeData.map((fee, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">
                          {fee.fee_type?.replace(/_/g, " ") ||
                            `Fee ${index + 1}`}
                        </td>
                        <td className="p-2 text-center">
                          {monthNames[fee.month] || fee.month}
                        </td>
                        <td className="p-2 text-center">
                          <span className="badge badge-success badge-xs text-white">
                            {fee.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="border-t pt-2">
            <h3 className="font-semibold text-sm mb-1">Summary</h3>
            <div className="bg-green-600 text-white p-3 rounded-lg flex justify-between">
              <span>Total Paid</span>
              <span className="text-lg font-bold">
                ₹{Number(paidAmount).toFixed(2)}
              </span>
            </div>
            {lateFee > 0 && (
              <p className="text-xs mt-1 text-orange-500">
                Late Fee Included: ₹{lateFee}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 pt-2 border-t">
            Thank you for your payment!
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={handleDownload}
            className="btn bgTheme text-white btn-sm"
          >
            Download PDF
          </button>
          <button
            onClick={onClose}
            className="btn bg-gray-300 btn-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatusDialogOffline;
