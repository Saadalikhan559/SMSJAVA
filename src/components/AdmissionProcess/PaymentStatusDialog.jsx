import React from "react";

const PaymentStatusDialog = ({ paymentStatus, onClose }) => {
  if (!paymentStatus) return null;

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      const options = { year: "numeric", month: "long", day: "numeric" };
      return date.toLocaleDateString("en-US", options);
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 px-4 sm:px-6 md:px-8">
      <div className="bg-white w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl p-4 sm:p-6 rounded-lg overflow-y-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-green-600">
            Payment Successful!
          </h2>
        </div>

        <div className="space-y-4">
          {/* Receipt Details */}
          <div>
            <h3 className="font-semibold">Receipt Details</h3>
            <p>Receipt Number: {paymentStatus.fee_record.receipt_number}</p>
            <p>Payment Date: {formatDate(paymentStatus.fee_record.payment_date)}</p>
          </div>

          {/* Student Information */}
          <div>
            <h3 className="font-semibold">Student Information</h3>
            <p>Student Name: {paymentStatus.fee_record.student.name}</p>
            <p>Month: {paymentStatus.fee_record.month}</p>
          </div>

          {/* Payment Details */}
          <div>
            <h3 className="font-semibold">Payment Details</h3>
            <p>Payment Mode: {paymentStatus.fee_record.payment_mode}</p>
          </div>

          {/* Fees Breakdown */}
          <div>
            <h3 className="font-semibold">Fees Breakdown</h3>
            {paymentStatus.fee_record.year_level_fees_grouped?.map((group, index) => (
              <div key={index} className="ml-4 mt-2">
                <p className="font-medium">{group.year_level}</p>
                <ul className="list-disc ml-6">
                  {group.fees?.map((fee, feeIndex) => (
                    <li key={feeIndex}>
                      {fee.fee_type}: ₹{fee.amount}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Payment Summary */}
          <div>
            <h3 className="font-semibold">Payment Summary</h3>
            <p>Total Amount: ₹{paymentStatus.fee_record.total_amount}</p>
            <p className="text-green-600">Paid Amount: ₹{paymentStatus.fee_record.paid_amount}</p>
            <p className="text-red-600">Due Amount: ₹{paymentStatus.fee_record.due_amount}</p>
            {paymentStatus.fee_record.late_fee &&
              parseFloat(paymentStatus.fee_record.late_fee) > 0 && (
                <p>Late Fee: ₹{paymentStatus.fee_record.late_fee}</p>
              )}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="btn text-white bgTheme">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatusDialog;
