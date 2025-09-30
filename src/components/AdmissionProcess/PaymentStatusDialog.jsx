import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

const PaymentStatusDialog = ({ paymentStatus, onClose }) => {
  if (!paymentStatus) return null;

    const printRef = useRef();

  const feeRecord = paymentStatus.fee_record || {
    receipt_number: `RZP-${Date.now()}`,
    payment_date: new Date().toISOString(),
    month: paymentStatus.month || "-",
    payment_mode: "Online (Razorpay)",
    student: paymentStatus.student || { name: "Unknown" },
    year_level_fees_grouped: paymentStatus.year_level_fees_grouped || [],
    total_amount: paymentStatus.amount || 0,
    paid_amount: paymentStatus.amount || 0,
    due_amount: 0,
    late_fee: 0,
  };

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

  const handlePrint = () => {
    const originalContents = document.body.innerHTML;
    const printContents = printRef.current.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  console.log(paymentStatus);
  

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-2">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md p-4 rounded-lg shadow-lg border border-gray-300 dark:border-gray-600">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b dark:border-gray-600 pb-2 mb-3">
          <h2 className="text-lg font-bold text-green-600 dark:text-green-400">Payment Successful</h2>
          <button onClick={onClose} className="btn btn-circle btn-xs bg-gray-200 dark:bg-gray-700 dark:text-white">
            ✕
          </button>
        </div>

        {/* Receipt Content */}
        <div ref={printRef} className="space-y-3 text-sm text-gray-800 dark:text-gray-100">
          
          {/* Receipt Details */}
          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm mb-1">Receipt Details</h3>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <p><strong>No:</strong> {feeRecord.receipt_number}</p>
              <p><strong>Date:</strong> {formatDate(feeRecord.payment_date)}</p>
              <p><strong>Month:</strong> {feeRecord.month}</p>
              <p><strong>Mode:</strong> {feeRecord.payment_mode}</p>
            </div>
          </div>

          {/* Student Info */}
          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm mb-1">Student</h3>
            <p className="text-xs">{feeRecord.student?.name}</p>
          </div>

          {/* Fees Breakdown */}
          {/* <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm mb-1">Fees</h3>
            {feeRecord.year_level_fees_grouped?.map((group, index) => (
              <div key={index} className="mt-1">
                <p className="font-medium text-xs">{group.year_level}</p>
                <ul className="list-disc ml-4 text-xs text-gray-700 dark:text-gray-300">
                  {group.fees?.map((fee, feeIndex) => (
                    <li key={feeIndex}>
                      {fee.fee_type}: ₹{fee.amount}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div> */}

          {/* Summary */}
          <div className="border-t dark:border-gray-600 pt-2">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm mb-1">Summary</h3>
            <p className="text-xs"><strong>Total:</strong> ₹{feeRecord.total_amount}</p>
            <p className="text-xs text-green-600 dark:text-green-400">
              <strong>Paid:</strong> ₹{feeRecord.paid_amount}
            </p>
            {/* <p className="text-xs text-red-600 dark:text-red-400">
              <strong>Due:</strong> ₹{feeRecord.due_amount}
            </p> */}
            {feeRecord.late_fee && parseFloat(feeRecord.late_fee) > 0 && (
              <p className="text-xs"><strong>Late Fee:</strong> ₹{feeRecord.late_fee}</p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex justify-end gap-2">
          <button
          onClick={handlePrint}
            className="btn btn-sm bgTheme text-white hover:opacity-90"
          >
            Download
          </button>
          <button
            onClick={onClose}
            className="btn btn-sm bg-gray-300 dark:bg-gray-600 dark:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatusDialog;
