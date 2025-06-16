import React from 'react'

const PaymentStatusDialog = ({ paymentStatus, onClose }) => {
  if (!paymentStatus) return null;

  console.log(paymentStatus);
  return (
    <div className="fixed inset-0 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4 text-green-600">
          Payment Successful!
        </h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Receipt Details</h3>
            <p>Receipt Number: {paymentStatus.fee_record.receipt_number}</p>
            <p>Student: {paymentStatus.fee_record.student.name}</p>
            <p>Month: {paymentStatus.fee_record.month}</p>
            <p>Total Amount: ₹{paymentStatus.fee_record.total_amount}</p>
            <p>Paid Amount: ₹{paymentStatus.fee_record.paid_amount}</p>
            <p>Due Amount: {paymentStatus.fee_record.due_amount}</p>
            <p>Payment Mode: {paymentStatus.fee_record.payment_mode}</p>
            <p>Payment Date: {paymentStatus.fee_record.payment_date}</p>
          </div>

          <div>
            <h3 className="font-semibold">Fees Breakdown</h3>
            {paymentStatus.fee_record.year_level_fees_grouped.map((group, index) => (
              <div key={index} className="ml-4 mt-2">
                <p className="font-medium">{group.year_level}</p>
                <ul className="list-disc ml-6">
                  {group.fees.map((fee, feeIndex) => (
                    <li key={feeIndex}>
                      {fee.fee_type}: ₹{fee.amount}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
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

export default PaymentStatusDialog