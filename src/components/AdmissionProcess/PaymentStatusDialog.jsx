import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const PaymentStatusDialog = ({ paymentStatus, onClose }) => {
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
    try {
      const element = receiptRef.current;
      if (!element) return;

      // capture element as canvas
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // extra pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`receipt_${paymentStatus.fee_record.receipt_number}.pdf`);
    } catch (error) {
      console.error("PDF download error:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-2">
      <div className="bg-white w-full max-w-md p-4 rounded-lg shadow-lg">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2 mb-3">
          <h2 className="text-lg font-bold text-green-600">Payment Successful</h2>
          <button onClick={onClose} className="btn btn-circle btn-xs">✕</button>
        </div>

        {/* Receipt Content */}
        <div ref={receiptRef} className="space-y-3 text-sm">

          {/* Receipt Details */}
          <div>
            <h3 className="font-semibold text-gray-700 text-sm">Receipt Details</h3>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <p><strong>No:</strong> {paymentStatus.fee_record.receipt_number}</p>
              <p><strong>Date:</strong> {formatDate(paymentStatus.fee_record.payment_date)}</p>
              <p><strong>Month:</strong> {paymentStatus.fee_record.month}</p>
              <p><strong>Mode:</strong> {paymentStatus.fee_record.payment_mode}</p>
            </div>
          </div>

          {/* Student Info */}
          <div>
            <h3 className="font-semibold text-gray-700 text-sm">Student</h3>
            <p className="text-xs">{paymentStatus.fee_record.student.name}</p>
          </div>

          {/* Fees Breakdown */}
          <div>
            <h3 className="font-semibold text-gray-700 text-sm">Fees</h3>
            {paymentStatus.fee_record.year_level_fees_grouped?.map((group, index) => (
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
            <p className="text-xs"><strong>Total:</strong> ₹{paymentStatus.fee_record.total_amount}</p>
            <p className="text-xs text-green-600">
              <strong>Paid:</strong> ₹{paymentStatus.fee_record.paid_amount}
            </p>
            <p className="text-xs text-red-600">
              <strong>Due:</strong> ₹{paymentStatus.fee_record.due_amount}
            </p>
            {paymentStatus.fee_record.late_fee &&
              parseFloat(paymentStatus.fee_record.late_fee) > 0 && (
                <p className="text-xs"><strong>Late Fee:</strong> ₹{paymentStatus.fee_record.late_fee}</p>
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

export default PaymentStatusDialog;
