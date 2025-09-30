import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

const PaymentStatusDialogOffline = ({ paymentStatus, onClose }) => {
  if (!paymentStatus) return null;

   const printRef = useRef();

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

// const month = paymentStatus.month.map()


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-2">
      <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 w-full max-w-md p-4 rounded-lg shadow-lg border border-gray-300 dark:border-gray-600">

        {/* Header */}
        <div className="flex justify-between items-center border-b dark:border-gray-600 pb-2 mb-3">
          <h2 className="text-lg font-bold text-green-600 dark:text-green-400">Payment Receipt</h2>
          <button onClick={onClose} className="btn btn-circle btn-xs bg-gray-200 dark:bg-gray-700 dark:text-white">
            ✕
          </button>
        </div>

        {/* Receipt Content */}
        <div ref={printRef} className="space-y-3 text-sm">
          {/* Receipt Details */}
          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm">Receipt Details</h3>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <p><strong>No:</strong> {paymentStatus.receipt_number}</p>
              <p><strong>Date:</strong> {formatDate(paymentStatus.payment_date)}</p>
              <p><strong>Month:</strong> {paymentStatus.months}</p>
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
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm">Student</h3>
            <p className="text-xs">{paymentStatus.student.name}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm">Received by</h3>
            <p className="text-xs">{paymentStatus.received_by}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm">remarks</h3>
            <p className="text-xs">{paymentStatus.remarks}</p>
          </div>

          {/* Fee Breakdown */}
          {/* <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm">Fees</h3>
            {paymentStatus.year_level_fees_grouped?.map((group, index) => (
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
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm">Summary</h3>
            <p className="text-xs"><strong>Total:</strong> ₹{paymentStatus.total_amount}</p>
            <p className="text-xs text-green-600 dark:text-green-400">
              <strong>Paid:</strong> ₹{paymentStatus.paid_amount}
            </p>
            {/* <p className="text-xs text-red-600 dark:text-red-400">
              <strong>Due:</strong> ₹{paymentStatus.due_amount}
            </p> */}
            {paymentStatus.late_fee &&
              parseFloat(paymentStatus.late_fee) > 0 && (
                <p className="text-xs"><strong>Late Fee:</strong> ₹{paymentStatus.late_fee}</p>
              )}
          </div>
        </div>
                
        {/* Buttons */}
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={handlePrint}
            className="btn bgTheme text-white btn-sm hover:opacity-90"
          >
            Download
          </button>
          <button
            onClick={onClose}
            className="btn bg-gray-300 dark:bg-gray-600 dark:text-white btn-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatusDialogOffline;
