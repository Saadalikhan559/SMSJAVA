export const PaymentStatusDialogOffline = ({ paymentStatus, onClose }) => {
  if (!paymentStatus) return null;

  // Function to format date without date-fns
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString; // Return original if invalid date
      }
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    } catch (e) {
      return dateString; // Return original if parsing fails
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 px-80">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-green-600">Payment Receipt</h2>
          <button
            onClick={onClose}
            className="btn btn-circle btn-sm"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Receipt Header */}
          <div>
            <h3 className="font-semibold">Receipt Details</h3>
            <div className="flex justify-between items-center">
              <p>Receipt Number: {paymentStatus.receipt_number}</p>
            </div>
            <p>Payment Date: {formatDate(paymentStatus.payment_date)}</p>
          </div>

          {/* Student Information */}
          <div>
            <h3 className="font-semibold">Student Information</h3>
            <p>Student Name: {paymentStatus.student.name}</p>
          </div>

          {/* Payment Details */}
          <div>
            <h3 className="font-semibold">Payment Details</h3>
            <p>Payment Mode: {paymentStatus.payment_mode}</p>
            {paymentStatus.payment_mode === "Cheque" && (
              <p>Cheque Status: {paymentStatus.is_cheque_cleared ? "Cleared" : "Not Cleared"}</p>
            )}
            <p>Month: {paymentStatus.month}</p>
          </div>

          {/* Fees Breakdown */}
          <div>
            <h3 className="font-semibold">Fees Breakdown</h3>
            {paymentStatus.year_level_fees_grouped?.map((group, index) => (
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
            <p>Total Amount: ₹{paymentStatus.total_amount}</p>
            <p className="text-green-600">Paid Amount: ₹{paymentStatus.paid_amount}</p>
            <p className="text-red-600">Due Amount: ₹{paymentStatus.due_amount}</p>
            {paymentStatus.late_fee && parseFloat(paymentStatus.late_fee) > 0 && (
              <p>Late Fee: ₹{paymentStatus.late_fee}</p>
            )}
          </div>

        </div>

        {/* Print/Close Buttons */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="btn btn-primary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatusDialogOffline;