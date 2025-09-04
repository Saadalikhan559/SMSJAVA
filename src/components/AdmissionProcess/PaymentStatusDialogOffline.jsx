// export const PaymentStatusDialogOffline = ({ paymentStatus, onClose }) => {
//   if (!paymentStatus) return null;

//   const formatDate = (dateString) => {
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) {
//         return dateString;
//       }
//       const options = { year: 'numeric', month: 'long', day: 'numeric' };
//       return date.toLocaleDateString('en-US', options);
//     } catch (e) {
//       return dateString;
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 px-4 sm:px-6 md:px-8">
//       <div className="bg-white w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl p-4 sm:p-6 rounded-lg overflow-y-auto max-h-[90vh]">
//         <div className="flex justify-between items-start mb-4">
//           <h2 className="text-xl sm:text-2xl font-bold text-green-600">Payment Receipt</h2>
//         </div>

//         <div className="space-y-4">
//           {/* Receipt Header */}
//           <div>
//             <h3 className="font-semibold">Receipt Details</h3>
//             <div className="flex justify-between items-center">
//               <p>Receipt Number: {paymentStatus.receipt_number}</p>
//             </div>
//             <p>Payment Date: {formatDate(paymentStatus.payment_date)}</p>
//           </div>

//           {/* Student Information */}
//           <div>
//             <h3 className="font-semibold">Student Information</h3>
//             <p>Student Name: {paymentStatus.student.name}</p>
//           </div>

//           {/* Payment Details */}
//           <div>
//             <h3 className="font-semibold">Payment Details</h3>
//             <p>Payment Mode: {paymentStatus.payment_mode}</p>
//             {paymentStatus.payment_mode === "Cheque" && (
//               <p>Cheque Status: {paymentStatus.is_cheque_cleared ? "Cleared" : "Not Cleared"}</p>
//             )}
//             <p>Month: {paymentStatus.month}</p>
//           </div>

//           {/* Fees Breakdown */}
//           <div>
//             <h3 className="font-semibold">Fees Breakdown</h3>
//             {paymentStatus.year_level_fees_grouped?.map((group, index) => (
//               <div key={index} className="ml-4 mt-2">
//                 <p className="font-medium">{group.year_level}</p>
//                 <ul className="list-disc ml-6">
//                   {group.fees?.map((fee, feeIndex) => (
//                     <li key={feeIndex}>
//                       {fee.fee_type}: ₹{fee.amount}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div>

//           {/* Payment Summary */}
//           <div>
//             <h3 className="font-semibold">Payment Summary</h3>
//             <p>Total Amount: ₹{paymentStatus.total_amount}</p>
//             <p className="text-green-600">Paid Amount: ₹{paymentStatus.paid_amount}</p>
//             <p className="text-red-600">Due Amount: ₹{paymentStatus.due_amount}</p>
//             {paymentStatus.late_fee && parseFloat(paymentStatus.late_fee) > 0 && (
//               <p>Late Fee: ₹{paymentStatus.late_fee}</p>
//             )}
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="mt-6 flex justify-end gap-2">
//           <button onClick={onClose} className="btn text-white bgTheme">
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
import html2canvas from "html2canvas";

export const PaymentStatusDialogOffline = ({ paymentStatus, onClose }) => {
  if (!paymentStatus) return null;

  const receiptRef = useRef();

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      const options = { year: "numeric", month: "short", day: "numeric" };
      return date.toLocaleDateString("en-US", options);
    } catch {
      return dateString;
    }
  };

  const handleDownload = async () => {
    const element = receiptRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`receipt_${paymentStatus.receipt_number}.pdf`);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-2">
      <div className="bg-white w-full max-w-md p-4 rounded-lg shadow-lg">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2 mb-3">
          <h2 className="text-lg font-bold text-green-600">Payment Receipt</h2>
          <button onClick={onClose} className="btn btn-circle btn-xs">✕</button>
        </div>

        {/* Receipt Content */}
        <div ref={receiptRef} className="space-y-3 text-sm">
          {/* Receipt Details */}
          <div>
            <h3 className="font-semibold text-gray-700 text-sm">Receipt Details</h3>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <p><strong>No:</strong> {paymentStatus.receipt_number}</p>
              <p><strong>Date:</strong> {formatDate(paymentStatus.payment_date)}</p>
              <p><strong>Month:</strong> {paymentStatus.month}</p>
              <p><strong>Mode:</strong> {paymentStatus.payment_mode}</p>
              {paymentStatus.payment_mode === "Cheque" && (
                <p>
                  <strong>Cheque:</strong>{" "}
                  {paymentStatus.is_cheque_cleared ? "Cleared" : "Pending"}
                </p>
              )}
            </div>
          </div>

          {/* Student Info */}
          <div>
            <h3 className="font-semibold text-gray-700 text-sm">Student</h3>
            <p className="text-xs">{paymentStatus.student.name}</p>
          </div>

          {/* Fees Breakdown */}
          <div>
            <h3 className="font-semibold text-gray-700 text-sm">Fees</h3>
            {paymentStatus.year_level_fees_grouped?.map((group, index) => (
              <div key={index} className="mt-1">
                <p className="font-medium text-xs">{group.year_level}</p>
                <ul className="list-disc ml-4 text-xs text-gray-700">
                  {group.fees?.map((fee, feeIndex) => (
                    <li key={feeIndex}>
                      {fee.fee_type}: ₹{fee.amount}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="border-t pt-2">
            <h3 className="font-semibold text-gray-700 text-sm">Summary</h3>
            <p className="text-xs"><strong>Total:</strong> ₹{paymentStatus.total_amount}</p>
            <p className="text-xs text-green-600">
              <strong>Paid:</strong> ₹{paymentStatus.paid_amount}
            </p>
            <p className="text-xs text-red-600">
              <strong>Due:</strong> ₹{paymentStatus.due_amount}
            </p>
            {paymentStatus.late_fee &&
              parseFloat(paymentStatus.late_fee) > 0 && (
                <p className="text-xs"><strong>Late Fee:</strong> ₹{paymentStatus.late_fee}</p>
              )}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={handleDownload} className="btn bgTheme text-white btn-sm">
            Download
          </button>
          <button onClick={onClose} className="btn bgTheme text-white btn-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatusDialogOffline;
