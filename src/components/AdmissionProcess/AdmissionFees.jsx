import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { constants } from "../../global/constants";
import PaymentStatusDialog from "./PaymentStatusDialog";
import PaymentStatusDialogOffline from "./PaymentStatusDialogOffline";
import { fetchStudents1 } from "../../services/api/Api";

export const AdmissionFees = () => {
  const [students, setStudents] = useState([]);
  const [availableFees, setAvailableFees] = useState([]);
  const [selectedFeeIds, setSelectedFeeIds] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showPaymentDialog1, setShowPaymentDialog1] = useState(false);
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFees, setIsLoadingFees] = useState(false);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [apiError, setApiError] = useState("");

  const authTokens = JSON.parse(localStorage.getItem("authTokens"));
  const accessToken = authTokens?.access;

  const BASE_URL = constants.baseUrl;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      student_id: "",
      month: "",
      paid_amount: "",
      payment_mode: "",
      remarks: "",
      received_by: "",
    },
  });

  const selectedStudentId = watch("student_id");
  const selectedMonth = watch("month");

  // Fetch all classes
  const getClasses = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/d/year-levels/`);
      setClasses(response.data);
    } catch (err) {
      console.log("Failed to load classes. Please try again." + err);
      setApiError("Failed to load classes");
    }
  };

  // Fetch available fees for a student with proper error handling
  const fetchAvailableFees = async (studentId, month) => {
    if (!studentId || !month) {
      console.log("Student ID or Month missing");
      setAvailableFees([]);
      return [];
    }

    if (!accessToken) {
      console.error("Access token not available");
      setApiError("Authentication required. Please login again.");
      setAvailableFees([]);
      return [];
    }

    try {
      setIsLoadingFees(true);
      setApiError("");

      console.log("Fetching fees for:", { studentId, month });

      const response = await axios.get(
        `${BASE_URL}/d/fee-record/fee-preview/?student_id=${studentId}&month=${month}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      setAvailableFees(response.data);
      return response.data;
    } catch (error) {
      console.error("Fee fetch error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
      });

      let errorMessage = "Failed to load fees";

      if (error.response) {
        // Server responded with error status
        if (error.response.status === 401) {
          errorMessage = "Authentication failed. Please login again.";
        } else if (error.response.status === 404) {
          errorMessage = "No fees found for selected student and month";
        } else if (error.response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else if (error.response.data?.detail) {
          errorMessage = error.response.data.detail;
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "Network error. Please check your connection.";
      } else {
        // Something else happened
        errorMessage = error.message;
      }

      setApiError(errorMessage);
      setAvailableFees([]);
      return [];
    } finally {
      setIsLoadingFees(false);
    }
  };

  // Fetch students for selected class
  const getStudents = async (classId) => {
    try {
      setIsLoading(true);
      setApiError("");
      const Students = await fetchStudents1(classId);
      setStudents(Students);
    } catch (err) {
      console.log("Failed to load students. Please try again." + err);
      setApiError("Failed to load students");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getClasses();
  }, []);

  // Handle class selection
  const handleClassChange = (e) => {
    const classId = e.target.value;
    setSelectedClassId(classId);
    reset({
      student_id: "",
      month: "",
      paid_amount: "",
      payment_mode: "",
      remarks: "",
      received_by: "",
    });
    setSelectedFeeIds([]);
    setSelectedStudent(null);
    setAvailableFees([]);
    setAvailableMonths([]);
    setApiError("");
  };

  // When class is selected, fetch students
  useEffect(() => {
    if (selectedClassId) {
      getStudents(selectedClassId);
    } else {
      setStudents([]);
    }
  }, [selectedClassId]);

  // When student or month changes, fetch available fees
  useEffect(() => {
    if (selectedStudentId && selectedMonth) {
      const student = students.find(
        (s) => s.student_id === parseInt(selectedStudentId)
      );
      setSelectedStudent(student);

      // Fetch student's available fees
      const fetchStudentData = async () => {
        await fetchAvailableFees(selectedStudentId, selectedMonth);
      };

      fetchStudentData();
    } else {
      setSelectedStudent(null);
      setAvailableFees([]);
      setSelectedFeeIds([]);
      setAvailableMonths([]);
    }
  }, [selectedStudentId, selectedMonth, students]);

  // When fee selection changes, update the total amount
  useEffect(() => {
    if (selectedFeeIds.length > 0 && availableFees.length > 0) {
      let totalAmount = 0;
      let lateFeeAmount = 0;

      availableFees.forEach((yearLevel) => {
        yearLevel.fees.forEach((fee) => {
          if (selectedFeeIds.includes(fee.id)) {
            totalAmount += parseFloat(fee.final_amount);
            // Add late fee if it exists for this fee
            if (fee.late_fee) {
              lateFeeAmount += parseFloat(fee.late_fee);
            }
          }
        });
      });

      // Add late fee to total amount
      totalAmount += lateFeeAmount;

      setValue("paid_amount", totalAmount.toFixed(2));
    } else {
      setValue("paid_amount", "0.00");
    }
  }, [selectedFeeIds, availableFees, setValue]);

  const role = localStorage.getItem("userRole");

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const allMonths = [
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

  const paymentModes =
    role === constants.roles.officeStaff || constants.roles.director
      ? ["Cash", "Cheque", "Online"]
      : ["Online"];

  const displayRazorpay = async (payload) => {
    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error("Razorpay SDK failed to load");
      }

      const orderResponse = await axios.post(
        `${BASE_URL}/d/fee-record/initiate-payment/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

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
        received_by,
        payment_mode,
        paid_amount,
      } = payload;

      const options = {
        key: "rzp_test_4h2aRSAPbYw3f8",
        amount: orderAmount,
        currency: currency,
        name: "Course Payment",
        description: `receipt_number: ${receipt_number}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            const verificationResponse = await axios.post(
              `${BASE_URL}/d/fee-record/confirm-payment/`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature_id: response.razorpay_signature,
                student_id: parseInt(student_id),
                month,
                year_level_fees,
                received_by,
                payment_mode,
                paid_amount,
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );

            if (verificationResponse.data) {
              setPaymentStatus(verificationResponse.data);
              setShowPaymentDialog(true);
            } else {
              setPaymentStatus("Payment verification failed");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            setPaymentStatus("Payment verification failed");
          }
        },
        prefill: {
          name: selectedStudent ? `${selectedStudent.student_name}` : "",
          email: selectedStudent?.email || "",
        },
        notes: {
          address: "Course Purchase",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
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
    if (selectedFeeIds.length === 0) {
      alert("Please select at least one fee to pay");
      return;
    }

    const payload = {
      ...data,
      student_id: parseInt(data.student_id),
      paid_amount: parseFloat(data.paid_amount).toFixed(2),
      year_level_fees: selectedFeeIds,
      payment_mode: data.payment_mode,
      is_cheque_cleared: data.payment_mode === "Cheque" ? false : true,
    };

    try {
      if (payload.payment_mode === "Online") {
        await displayRazorpay(payload);
      } else if (
        payload.payment_mode === "Cash" ||
        payload.payment_mode === "Cheque"
      ) {
        const response = await axios.post(
          `${BASE_URL}/d/fee-record/`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
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

  // Handle fee selection
  const handleFeeSelection = (feeId, isSelected) => {
    if (isSelected) {
      setSelectedFeeIds((prev) => [...prev, feeId]);
    } else {
      setSelectedFeeIds((prev) => prev.filter((id) => id !== feeId));
    }
  };

  // Calculate total amount including late fees
  const calculateTotalAmount = () => {
    let total = 0;
    let lateFeeTotal = 0;

    availableFees.forEach((yearLevel) => {
      yearLevel.fees.forEach((fee) => {
        if (selectedFeeIds.includes(fee.id)) {
          total += parseFloat(fee.final_amount);
          if (fee.late_fee) {
            lateFeeTotal += parseFloat(fee.late_fee);
          }
        }
      });
    });

    return {
      baseAmount: total,
      lateFee: lateFeeTotal,
      totalAmount: total + lateFeeTotal,
    };
  };

  const totalAmount = calculateTotalAmount();

  // Retry fetching fees
  const handleRetry = () => {
    if (selectedStudentId && selectedMonth) {
      fetchAvailableFees(selectedStudentId, selectedMonth);
    }
  };

  return (
    <>
      <form
        className="w-full max-w-6xl mx-auto p-6 bg-base-100 rounded-box my-5 shadow-sm focus:outline-none"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-3xl font-bold text-center mb-8">
          Fee Payment
          <i className="fa-solid fa-money-bill-wave ml-2"></i>
        </h1>

        {/* Error Display */}
        {apiError && (
          <div className="alert alert-error mb-6">
            <div className="flex-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="w-6 h-6 mx-2 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                ></path>
              </svg>
              <label>{apiError}</label>
            </div>
            <button
              type="button"
              onClick={handleRetry}
              className="btn btn-sm btn-ghost"
            >
              Retry
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Class Selection */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-1">
                <i className="fa-solid fa-school text-sm"></i>
                Class <span className="text-error">*</span>
              </span>
            </label>
            <select
              className="select select-bordered w-full focus:outline-none"
              onChange={handleClassChange}
              value={selectedClassId || ""}
            >
              <option value="">Select Class</option>
              {classes?.map((classItem) => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.level_name}
                </option>
              ))}
            </select>
          </div>

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
              value={selectedStudentId || ""}
              disabled={!selectedClassId}
            >
              <option value="">Select Student</option>
              {isLoading ? (
                <option value="" disabled>
                  Loading students...
                </option>
              ) : (
                students?.map((student) => (
                  <option key={student.student_id} value={student.student_id}>
                    {student.student_name} - {student.student_email}
                  </option>
                ))
              )}
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
              <span className="label-text flex items-center gap-1">
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
              disabled={!selectedStudentId}
            >
              <option value="">Select Month</option>
              {allMonths.map((month) => (
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

        {/* Loading State */}
        {isLoadingFees && (
          <div className="flex justify-center my-6">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <span className="ml-3 text-lg">Loading fees data...</span>
          </div>
        )}

        {/* Available Fees Display */}
        {availableFees.length > 0 && selectedStudent && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">
              Available Fees for {selectedStudent.student_name}
            </h2>

            {availableFees.map((yearLevel) => (
              <div key={yearLevel.id} className="mb-6">
                <h3 className="text-lg font-medium mb-3">
                  {yearLevel.year_level} Fees
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {yearLevel.fees.map((fee) => (
                    <div key={fee.id} className="card bg-base-200 shadow-sm">
                      <div className="card-body p-4">
                        <div className="form-control">
                          <label className="label cursor-pointer justify-start gap-4">
                            {fee.final_amount > 0 ? (
                              // Fee is payable - show checkbox
                              <input
                                type="checkbox"
                                checked={selectedFeeIds.includes(fee.id)}
                                onChange={(e) =>
                                  handleFeeSelection(fee.id, e.target.checked)
                                }
                                className="checkbox checkbox-primary"
                              />
                            ) : (
                              // Fee is already paid or zero - show appropriate indicator
                              <div className="w-6 h-6 flex items-center justify-center">
                                {fee.final_amount === 0 ? (
                                  <i className="fa-solid fa-check text-success text-lg"></i>
                                ) : (
                                  <i className="fa-solid fa-check-double text-success text-lg"></i>
                                )}
                              </div>
                            )}
                            <div>
                              <h3 className="card-title text-lg font-bold">
                                {fee.fee_type}
                              </h3>
                              <p className>
                                {fee.final_amount > 0 ? (
                                  `₹${fee.final_amount}`
                                ) : fee.final_amount === 0 ? (
                                  "No Fee"
                                ) : (
                                  <span className="text-success">
                                    Already Paid
                                  </span>
                                )}
                              </p>
                              {fee.late_fee && fee.final_amount > 0 && (
                                <p className="text-sm text-warning mt-1">
                                  Late Fee: ₹{fee.late_fee}
                                </p>
                              )}
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Total Amount Summary */}
            {selectedFeeIds.length > 0 && (
              <div className="bg-base-300 p-4 rounded-lg mt-6">
                <h3 className="text-lg font-semibold mb-2">Payment Summary</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>Base Amount:</div>
                  <div className="text-right">
                    ₹{totalAmount.baseAmount.toFixed(2)}
                  </div>

                  {totalAmount.lateFee > 0 && (
                    <>
                      <div>Late Fee:</div>
                      <div className="text-right text-warning">
                        ₹{totalAmount.lateFee.toFixed(2)}
                      </div>
                    </>
                  )}

                  <div className="font-bold mt-2 border-t pt-2">
                    Total Amount:
                  </div>
                  <div className="text-right font-bold mt-2 border-t pt-2">
                    ₹{totalAmount.totalAmount.toFixed(2)}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* No Fees Message */}
        {!isLoadingFees &&
          availableFees.length === 0 &&
          selectedStudentId &&
          selectedMonth && (
            <div className="alert alert-info mt-6">
              <div className="flex-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="w-6 h-6 mx-2 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <label>No fees found for the selected student and month</label>
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
              disabled={selectedFeeIds.length === 0}
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
              placeholder="Amount will auto-calculate"
              step="0.01"
              readOnly
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
                Remarks <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="text"
              className={`input w-full focus:outline-none ${
                errors.remarks ? "input-error" : "input-bordered"
              }`}
              {...register("remarks", {
                required: "Remarks are required",
              })}
              placeholder="Enter any remarks"
              disabled={selectedFeeIds.length === 0}
            />
            {errors.remarks && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.remarks.message}
                </span>
              </label>
            )}
          </div>

          {/* Signature */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <i className="fa-solid fa-signature text-sm"></i>
                Received By <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="text"
              className={`input w-full focus:outline-none ${
                errors.received_by ? "input-error" : "input-bordered"
              }`}
              {...register("received_by", {
                required: "Signature is required",
              })}
              placeholder="Enter your name as signature"
              disabled={selectedFeeIds.length === 0}
            />
            {errors.received_by && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.received_by.message}
                </span>
              </label>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-10">
          <button
            type="submit"
            className="btn bgTheme text-white w-52"
            disabled={isSubmitting || selectedFeeIds.length === 0}
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

      {/* Payment Status Dialogs */}
      {showPaymentDialog && paymentStatus && (
        <PaymentStatusDialog
          paymentStatus={paymentStatus}
          onClose={() => {
            setShowPaymentDialog(false);
            setPaymentStatus(null);
            window.location.reload();
          }}
        />
      )}

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
