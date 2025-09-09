import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

const PaymentStatusDialogOffline = ({ paymentStatus, onClose }) => {
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

  const prepareForHtml2Canvas = (element) => {
    const originalColors = new Map();
    element.querySelectorAll("*").forEach((el) => {
      const style = window.getComputedStyle(el);
      if (style.color.includes("oklch(")) {
        originalColors.set(el, el.style.color);
        el.style.color = "#444"; // fallback color
      }
      if (style.backgroundColor.includes("oklch(")) {
        originalColors.set(el, el.style.backgroundColor);
        el.style.backgroundColor = "#fff"; // fallback background
      }
    });
    return originalColors;
  };

  const restoreColors = (originalColors) => {
    originalColors.forEach((color, el) => {
      el.style.color = color;
    });
  };

  const handleDownload = async () => {
    if (!receiptRef.current) return;

    const originalColors = prepareForHtml2Canvas(receiptRef.current);
    try {
      const canvas = await html2canvas(receiptRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`receipt_${paymentStatus.receipt_number}.pdf`);
    } catch (error) {
      console.error("PDF download error:", error);
    } finally {
      restoreColors(originalColors);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-2">
      <div className="bg-white w-full max-w-md p-4 rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2 mb-3">
          <h2 className="text-lg font-bold text-green-600">Payment Receipt</h2>
          <button onClick={onClose} className="btn btn-circle btn-xs">
            ✕
          </button>
        </div>

        {/* Receipt Content */}
        <div ref={receiptRef} className="space-y-3 text-sm">
          {/* Receipt Details */}
          <div>
            <h3 className="font-semibold text-gray-700 text-sm">Receipt Details</h3>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <p>
                <strong>No:</strong> {paymentStatus.receipt_number}
              </p>
              <p>
                <strong>Date:</strong> {formatDate(paymentStatus.payment_date)}
              </p>
              <p>
                <strong>Month:</strong> {paymentStatus.month}
              </p>
              <p>
                <strong>Mode:</strong> {paymentStatus.payment_mode}
              </p>
              {paymentStatus.payment_mode === "Cheque" && (
                <p>
                  <strong>Cheque:</strong> {paymentStatus.is_cheque_cleared ? "Cleared" : "Pending"}
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
            <p className="text-xs">
              <strong>Total:</strong> ₹{paymentStatus.total_amount}
            </p>
            <p className="text-xs text-green-600">
              <strong>Paid:</strong> ₹{paymentStatus.paid_amount}
            </p>
            <p className="text-xs text-red-600">
              <strong>Due:</strong> ₹{paymentStatus.due_amount}
            </p>
            {paymentStatus.late_fee && parseFloat(paymentStatus.late_fee) > 0 && (
              <p className="text-xs">
                <strong>Late Fee:</strong> ₹{paymentStatus.late_fee}
              </p>
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
