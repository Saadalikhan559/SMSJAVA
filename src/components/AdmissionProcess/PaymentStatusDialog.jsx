import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

const PaymentStatusDialog = ({ paymentStatus, onClose }) => {
  if (!paymentStatus) return null;

  const printRef = useRef();

  const feeRecords = paymentStatus.fee_records || [];

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

  const calculateTotals = () => {
    let total = 0;
    let months = new Set();
    feeRecords.forEach((record) => {
      total += parseFloat(record.paid_amount || 0);
      months.add(record.month);
    });
    return {
      total,
      months: Array.from(months).join(", "),
    };
  };

  const { total, months } = calculateTotals();

  const handlePrint = async () => {
    const input = printRef.current;
    if (!input) return;

    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`receipt-${Date.now()}.pdf`);
  };
  // Utility to group records by month
  const groupByMonth = (records) => {
    const grouped = {};
    records.forEach((record) => {
      const month = record.month;
      if (!grouped[month]) {
        grouped[month] = [];
      }
      grouped[month].push(record);
    });
    return grouped;
  };

  const groupedRecords = groupByMonth(feeRecords);

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
              <p><strong>No:</strong> RZP-{Date.now()}</p>
              <p><strong>Date:</strong> {formatDate(new Date())}</p>
              <p><strong>Months:</strong> {months}</p>
              <p><strong>Mode:</strong> Online (Razorpay)</p>
            </div>
          </div>

          {/* Student Info */}
          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm mb-1">Student</h3>
            <p className="text-xs">{paymentStatus?.summary?.student_name || "Unknown"}</p>
          </div>

          {/* Fees Breakdown */}
          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm mb-1">Fees Breakdown</h3>
            {Object.entries(groupedRecords).map(([month, records]) => {
              const subtotal = records.reduce((sum, r) => sum + parseFloat(r.paid_amount || 0), 0);

              return (
                <div key={month} className="border-b last:border-0 pb-2 mb-2">
                  <p className="text-xs font-semibold mb-1"> <strong>Month:</strong> {month}</p>
                  <ul className="list-none ml-5 text-xs text-gray-800 dark:text-gray-100">
                    {records.map((rec, idx) => (
                      <li key={idx}>
                        {rec.fee_types?.join(", ")}: ₹{parseFloat(rec.paid_amount).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-1 text-xs font-medium text-green-600 dark:text-green-400">
                    Subtotal: ₹{subtotal.toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>


          {/* Summary */}
          <div className="border-t dark:border-gray-600 pt-2">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm mb-1">Summary</h3>
            <p className="text-xs text-green-600 dark:text-green-400">
              <strong>Total Paid:</strong> ₹{total.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={handlePrint} className="btn btn-sm bgTheme text-white hover:opacity-90">
            Download
          </button>
          <button onClick={onClose} className="btn btn-sm bg-gray-300 dark:bg-gray-600 dark:text-white">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatusDialog;
