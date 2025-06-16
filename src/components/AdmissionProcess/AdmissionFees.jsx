import { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { constants } from "../../global/constants";
import PaymentStatusDialog from "./PaymentStatusDialog";
import PaymentStatusDialogOffline from "./PaymentStatusDialogOffline";

export const AdmissionFees = () => {
  const { students, yearLevelData } = useContext(AuthContext);
  const [selectedFeeIds, setSelectedFeeIds] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showPaymentDialog1, setShowPaymentDialog1] = useState(false);

  const BASE_URL = constants.baseUrl1;

  const role = localStorage.getItem("userRole");

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script"); // Creates a new <script> HTML element.
      script.src = "https://checkout.razorpay.com/v1/checkout.js"; // Sets its src attribute to point to Razorpay's checkout SDK.
      script.onload = () => {
        // If the script loads successfully, the Promise resolves with true.
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script); // Adds the script element to the <body> of your HTML document, which triggers the download and execution of the script
    });
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      student_id: "",
      month: "",
      year_level: "",
      paid_amount: "",
      payment_mode: "",
      remarks: "",
      signature: "",
    },
  });

  // Watch the year_level field to react to changes
  const selectedYearLevel = watch("year_level");

  // Clear selected fees when year level changes
  useEffect(() => {
    setSelectedFeeIds([]);
  }, [selectedYearLevel]);

  // Find the selected fees data
  const selectedFees = yearLevelData.find(
    (level) => level.year_level === selectedYearLevel
  );

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Updated payment modes based on role
  const paymentModes =
    role === constants.roles.officeStaff
      ? ["Cash", "Cheque", "Online"]
      : ["Online"];

  const selectedStudentId = watch("student_id");

  useEffect(() => {
    if (selectedStudentId) {
      const student = students.find(
        (s) => s.id === parseInt(selectedStudentId)
      );
      setSelectedStudent(student);
    } else {
      setSelectedStudent(null);
    }
  }, [selectedStudentId, students]);

  // Handle checkbox changes
  const handleFeeSelection = (feeId) => {
    setSelectedFeeIds((prev) => {
      if (prev.includes(feeId)) {
        return prev.filter((id) => id !== feeId);
      } else {
        return [...prev, feeId];
      }
    });
  };

  const displayRazorpay = async (payload) => {
    console.log(payload);
    try {
      // Load Razorpay script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error("Razorpay SDK failed to load");
      }
      // Find the selected student from the form data
      // Create order on your backend
      const orderResponse = await axios.post(
        `${BASE_URL}/d/fee-record/initiate-payment/`,
        payload
      );
      console.log(orderResponse.data);
      const {
        razorpay_order_id: orderId,
        currency,
        receipt_number,
        paid_amount: orderAmount,
      } = orderResponse.data;

      const {
        student_id,
        month,
        year_level_fees,
        signature,
        payment_mode,
        paid_amount,
      } = payload;

      // Razorpay options
      const options = {
        // This options object configures how the Razorpay payment popup will look and behave. It tells Razorpay: What payment to collect (amount, currency, description). How to handle the payment (what happens after success/failure). What user details to pre-fill (optional).
        key: "rzp_test_4h2aRSAPbYw3f8",
        amount: orderAmount,
        currency: currency,
        name: "Course Payment",
        description: `receipt_number: ${receipt_number}`,
        order_id: orderId,
        handler: async function (response) {
          // This function runs after a user completes the payment process with Razorpay and it will give us response
          // Verify payment on your backend
          console.log(response);
          const verificationResponse = await axios.post(
            `${BASE_URL}/d/fee-record/confirm-payment/`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature_id: response.razorpay_signature,
              student_id: parseInt(student_id),
              month,
              year_level_fees,
              signature,
              payment_mode,
              paid_amount,
            }
          );
          console.log(verificationResponse.data);

          if (verificationResponse.data) {
            setPaymentStatus(verificationResponse.data);
            setShowPaymentDialog(true);
          } else {
            setPaymentStatus("Payment verification failed");
          }
        },
        prefill: {
          name: selectedStudent
            ? `${selectedStudent.first_name} ${selectedStudent.last_name}`
            : "",
          email: selectedStudent?.email || "",
        },
        notes: {
          address: "Course Purchase",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options); // This code is responsible for launching the Razorpay payment popup where users can enter their payment details (credit card, UPI, net banking, etc.).
      rzp.open(); // Opens the Razorpay payment modal (a popup window)
    } catch (error) {
      console.error("Payment error:", error);
      if (error.response) {
        const message =
          error.response.data.message ||
          (error.response.data.non_field_errors &&
            error.response.data.non_field_errors[0]) ||
          "Unknown error";
        alert(`Error: ${message}`);
      } else if (error.request) {
        alert("Error: No response from server");
      } else {
        alert(`Error: ${error.message}`);
      }
      setPaymentStatus("Payment failed. Please try again.");
    }
  };

  const onSubmit = async (data) => {
    const { year_level, payment_mode, ...restData } = data;

    const payload = {
      ...restData,
      student_id: parseInt(restData.student_id),
      paid_amount: parseFloat(restData.paid_amount).toFixed(2),
      year_level_fees: selectedFeeIds,
      payment_mode,
    };

    try {
      if (payment_mode === "Online") {
        // 🔁 Only trigger Razorpay flow, do NOT post here
        await displayRazorpay(payload); // Fee-record API will be called *inside* Razorpay handler
      } else if (payment_mode === "Cash" || payment_mode === "Cheque") {
        // 💸 For Cash or Check, call the fee-record endpoint directly
        const response = await axios.post(
          `${BASE_URL}/d/fee-record/`,
          payload
        );
        console.log("Response:", response.data);
        setPaymentStatus(response.data);
        setShowPaymentDialog1(true);
      }
    } catch (error) {
      console.error("Error submitting fees:", error);

      if (error.response) {
        const message =
          error.response.data.message ||
          (error.response.data.non_field_errors &&
            error.response.data.non_field_errors[0]) ||
          "Unknown error";
        alert(`Error: ${message}`);
      } else if (error.request) {
        alert("Error: No response from server");
      } else {
        alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <>
      <form
        className="w-full max-w-6xl mx-auto p-6 bg-base-100 rounded-box my-5 shadow-sm focus:outline-none"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-3xl font-bold text-center mb-8">
          Admission Fee Payment
          <i className="fa-solid fa-money-bill-wave ml-2"></i>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Student Selection */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-1">
                <i className="fa-solid fa-user-graduate text-sm"></i>
                Student <span className="text-error">*</span>
              </span>
            </label>
            <select
              className={`select w-full focus:outline-none ${
                errors.student_id ? "select-error" : "select-bordered"
              }`}
              {...register("student_id", {
                required: "Student selection is required",
              })}
              value={selectedStudentId || ""} // Add this line
            >
              <option value="">Select Student</option>
              {students?.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.first_name} {student.last_name} - {student.email}
                </option>
              ))}
            </select>
            {errors.student_id && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.student_id.message}
                </span>
              </label>
            )}
          </div>

          {/* Month Selection */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <i className="fa-solid fa-calendar text-sm"></i>
                Month <span className="text-error">*</span>
              </span>
            </label>
            <select
              className={`select w-full focus:outline-none ${
                errors.month ? "select-error" : "select-bordered"
              }`}
              {...register("month", {
                required: "Month selection is required",
              })}
            >
              <option value="">Select Month</option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            {errors.month && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.month.message}
                </span>
              </label>
            )}
          </div>
        </div>

        {/* Year Level Selection - Updated with react-hook-form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <i className="fa-solid fa-graduation-cap text-sm"></i>
                Year Level <span className="text-error">*</span>
              </span>
            </label>
            <select
              className={`select w-full focus:outline-none ${
                errors.year_level ? "select-error" : "select-bordered"
              }`}
              {...register("year_level", {
                required: "Year level selection is required",
              })}
            >
              <option value="">Select Year Level</option>
              {yearLevelData.map((level, index) => (
                <option key={index} value={level.year_level}>
                  {level.year_level}
                </option>
              ))}
            </select>
            {errors.year_level && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.year_level.message}
                </span>
              </label>
            )}
          </div>
        </div>

        {/* Updated Year Level Fees Display with checkboxes */}
        {selectedFees && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                Fee Structure for {selectedFees.year_level}
              </h2>
              <div className="badge badge-primary">
                Total: ₹
                {selectedFees.fees
                  .filter((fee) => selectedFeeIds.includes(fee.id))
                  .reduce((sum, fee) => sum + parseFloat(fee.amount), 0)
                  .toFixed(2)}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {selectedFees.fees.map((fee) => (
                <div key={fee.id} className="card bg-base-200 shadow-sm">
                  <div className="card-body p-4">
                    <div className="form-control">
                      <label className="label cursor-pointer justify-start gap-4">
                        <input
                          type="checkbox"
                          checked={selectedFeeIds.includes(fee.id)}
                          onChange={() => handleFeeSelection(fee.id)}
                          className="checkbox checkbox-primary"
                        />
                        <div>
                          <h3 className="card-title text-lg font-bold">
                            {fee.fee_type}
                          </h3>
                          <p className="text-2xl">₹{fee.amount}</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Payment Mode Selection */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <i className="fa-solid fa-credit-card text-sm"></i>
                Payment Mode <span className="text-error">*</span>
              </span>
            </label>
            <select
              className={`select w-full focus:outline-none ${
                errors.payment_mode ? "select-error" : "select-bordered"
              }`}
              {...register("payment_mode", {
                required: "Payment mode is required",
              })}
            >
              <option value="">Select Payment Mode</option>
              {paymentModes.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
            {errors.payment_mode && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.payment_mode.message}
                </span>
              </label>
            )}
          </div>

          {/* Paid Amount */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <i className="fa-solid fa-calculator text-sm"></i>
                Paid Amount <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="number"
              className={`input w-full focus:outline-none ${
                errors.paid_amount ? "input-error" : "input-bordered"
              }`}
              {...register("paid_amount", {
                required: "Amount is required",
                min: { value: 0, message: "Amount must be positive" },
              })}
              placeholder="Enter paid amount"
              step="0.01"
            />
            {errors.paid_amount && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.paid_amount.message}
                </span>
              </label>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Remarks */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <i className="fa-solid fa-comment text-sm"></i>
                Remarks
              </span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full focus:outline-none"
              {...register("remarks")}
              placeholder="Enter any remarks"
            />
          </div>

          {/* Signature */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <i className="fa-solid fa-signature text-sm"></i>
                Signature <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="text"
              className={`input w-full focus:outline-none ${
                errors.signature ? "input-error" : "input-bordered"
              }`}
              {...register("signature", { required: "Signature is required" })}
              placeholder="Enter your name as signature"
            />
            {errors.signature && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.signature.message}
                </span>
              </label>
            )}
          </div>
        </div>

        {/* Submit Button centered */}
        <div className="flex justify-center mt-10">
          <button
            type="submit"
            className="btn btn-primary w-52"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <i className="fa-solid fa-spinner fa-spin mr-2"></i>
            ) : (
              <i className="fa-solid fa-money-bill-wave ml-2"></i>
            )}
            {isSubmitting ? "Processing..." : "Submit Payment"}
          </button>
        </div>
      </form>

      {/* Add this at the bottom */}
      {showPaymentDialog && paymentStatus && (
        <PaymentStatusDialog
          paymentStatus={paymentStatus}
          onClose={() => {
            setShowPaymentDialog(false);
            setPaymentStatus(null); // Reset payment status when closing
            window.location.reload();
          }}
        />
      )}

      {/* Payment Status Dialog - shown for all successful payments */}
      {showPaymentDialog1 && paymentStatus && (
        <PaymentStatusDialogOffline
          paymentStatus={paymentStatus}
          onClose={() => {
            setShowPaymentDialog1(false);
            setPaymentStatus(null);
            window.location.reload();
          }}
        />
      )}
    </>
  );
};
