import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { constants } from "../../global/constants";
import PaymentStatusDialog from "./PaymentStatusDialog";
import PaymentStatusDialogOffline from "./PaymentStatusDialogOffline";
import { fetchStudents1, fetchyearLevelData } from "../../services/api/Api";

export const AdmissionFees = () => {
  const [students, setStudents] = useState([]);
  const [yearLevelData, setyearLevelData] = useState([]);
  const [selectedFeeIds, setSelectedFeeIds] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showPaymentDialog1, setShowPaymentDialog1] = useState(false);
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [studentFeeData, setStudentFeeData] = useState([]);
  const [isLoadingFees, setIsLoadingFees] = useState(false);
  const [availableMonths, setAvailableMonths] = useState([]);
  const authTokens = JSON.parse(localStorage.getItem("authTokens"));
  const accessToken = authTokens?.access;

  const BASE_URL = constants.baseUrl;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      student_id: "",
      month: "",
      year_level: "",
      paid_amount: "",
      payment_mode: "",
      remarks: "",
      received_by: "",
    },
  });

  // Fetch all classes
  const getClasses = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/d/year-levels/`);
      setClasses(response.data);
    } catch (err) {
      console.log("Failed to load classes. Please try again." + err);
    }
  };

  // Fetch student-specific fee data with discounts
  const fetchStudentFeeData = async (studentId) => {
    try {
      setIsLoadingFees(true);
      const response = await axios.get(
        `${BASE_URL}/d/fee-record/?student_id=${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      
      // Extract unpaid months from the response
      const unpaidMonths = [...new Set(response.data
        .filter(fee => fee.payment_status === "Unpaid" || fee.payment_status === "unpaid")
        .map(fee => fee.month)
      )];
      
      setAvailableMonths(unpaidMonths);
      return response.data;
    } catch (error) {
      console.log("No fee data found for student:", error);
      setAvailableMonths([]);
      return [];
    } finally {
      setIsLoadingFees(false);
    }
  };

  // Fetch students for selected class
  const getStudents = async (classId) => {
    try {
      setIsLoading(true);
      const Students = await fetchStudents1(classId);
      setStudents(Students);
    } catch (err) {
      console.log("Failed to load students. Please try again." + err);
    } finally {
      setIsLoading(false);
    }
  };

  const getyearLevelData = async (classId) => {
    try {
      const YearLevelData = await fetchyearLevelData(classId);
      setyearLevelData([YearLevelData]);
      reset({
        ...watch(),
        year_level: YearLevelData.year_level,
      });
    } catch (err) {
      setyearLevelData([]);
      console.log("Failed to load school years. Please try again." + err);
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
      year_level: "",
      paid_amount: "",
      payment_mode: "",
      remarks: "",
      received_by: "",
    });
    setSelectedFeeIds([]);
    setSelectedStudent(null);
    setStudentFeeData([]);
    setAvailableMonths([]);
  };

  // When class is selected, fetch year level data
  useEffect(() => {
    if (selectedClassId) {
      getyearLevelData(selectedClassId);
      getStudents(selectedClassId);
    } else {
      setyearLevelData([]);
      setStudents([]);
    }
  }, [selectedClassId]);

  // When student is selected, fetch their fee data
  const selectedStudentId = watch("student_id");
  useEffect(() => {
    if (selectedStudentId) {
      const student = students.find(
        (s) => s.student_id === parseInt(selectedStudentId)
      );
      setSelectedStudent(student);
      
      // Fetch student-specific fee data
      const fetchStudentData = async () => {
        const feeData = await fetchStudentFeeData(selectedStudentId);
        setStudentFeeData(feeData);
      };
      
      fetchStudentData();
    } else {
      setSelectedStudent(null);
      setStudentFeeData([]);
      setSelectedFeeIds([]);
      setAvailableMonths([]);
    }
  }, [selectedStudentId, students]);

  // When month is selected, update selected fees
  const selectedMonth = watch("month");
  useEffect(() => {
    if (selectedMonth && selectedStudentId && studentFeeData.length > 0) {
      // Find fees for the selected month
      const monthFees = studentFeeData.filter(
        fee => fee.month === selectedMonth && 
        (fee.payment_status === "Unpaid" || fee.payment_status === "unpaid")
      );
      
      // Extract fee IDs for the selected month
      const feeIds = monthFees.flatMap(fee => 
        fee.year_level_fees_grouped.flatMap(group => 
          group.fees.map(f => f.id)
        )
      );
      
      setSelectedFeeIds(feeIds);
    } else {
      setSelectedFeeIds([]);
    }
  }, [selectedMonth, selectedStudentId, studentFeeData]);

  // Automatically update paid amount when month/student changes
  useEffect(() => {
    if (selectedMonth && selectedStudentId && studentFeeData.length > 0 && selectedFeeIds.length > 0) {
      // Calculate total amount for selected fees with discounts applied
      const monthFees = studentFeeData.filter(
        fee => fee.month === selectedMonth
      );
      
      let totalAmount = 0;
      
      monthFees.forEach(fee => {
        fee.year_level_fees_grouped.forEach(group => {
          group.fees.forEach(f => {
            if (selectedFeeIds.includes(f.id)) {
              // Add the fee amount (which already includes discount)
              totalAmount += parseFloat(f.amount);
            }
          });
        });
      });
      
      // Add any late fees if applicable
      const lateFee = monthFees[0]?.late_fee || 0;
      totalAmount += parseFloat(lateFee);

      reset({
        ...watch(),
        paid_amount: totalAmount.toFixed(2),
      });
    }
  }, [selectedFeeIds, selectedMonth, selectedStudentId, studentFeeData, reset, watch]);

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

  const selectedFees = yearLevelData.length > 0 ? yearLevelData[0] : null;

  const allMonths = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
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
        payload
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
            }
          );

          if (verificationResponse.data) {
            setPaymentStatus(verificationResponse.data);
            setShowPaymentDialog(true);
          } else {
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
    const payload = {
      ...data,
      student_id: parseInt(data.student_id),
      paid_amount: parseFloat(data.paid_amount).toFixed(2),
      year_level_fees: selectedFeeIds,
      payment_mode: data.payment_mode,
    };

    try {
      if (payload.payment_mode === "Online") {
        await displayRazorpay(payload);
      } else if (
        payload.payment_mode === "Cash" ||
        payload.payment_mode === "Cheque"
      ) {
        const response = await axios.post(`${BASE_URL}/d/fee-record/`, payload);
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
          Fee Payment
          <i className="fa-solid fa-money-bill-wave ml-2"></i>
        </h1>

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
              disabled={!selectedStudentId}
            >
              <option value="">Select Month</option>
              {availableMonths.length > 0 ? (
                availableMonths.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))
              ) : (
                allMonths.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))
              )}
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

        {/* Fee Structure Display with Discounts Applied */}
        {selectedFees && selectedFees.fees && selectedStudent && selectedMonth && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                Fee Structure for {selectedFees.year_level} - {selectedMonth}
              </h2>
              <div className="flex flex-col items-end">
                <div className="badge badge-primary mb-1">
                  Total: ₹
                  {watch("paid_amount")}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {studentFeeData
                .filter(fee => fee.month === selectedMonth)
                .flatMap(fee => fee.year_level_fees_grouped)
                .flatMap(group => group.fees)
                .map((fee) => {
                  const isPaid = !selectedFeeIds.includes(fee.id);
                  
                  return (
                    <div key={fee.id} className="card bg-base-200 shadow-sm">
                      <div className="card-body p-4">
                        <div className="form-control">
                          <label className="label cursor-pointer justify-start gap-4">
                            <input
                              type="checkbox"
                              checked={!isPaid}
                              className="checkbox checkbox-primary"
                              disabled={isPaid}
                              readOnly
                            />
                            <div>
                              <h3 className="card-title text-lg font-bold">
                                {fee.fee_type}
                                {isPaid && <span className="badge badge-success ml-2">Paid</span>}
                                {!isPaid && <span className="badge badge-warning ml-2">Pending</span>}
                              </h3>
                              <p className="text-2xl">₹{fee.amount}</p>
                              {isPaid && (
                                <p className="text-sm text-success">Already paid</p>
                              )}
                              {!isPaid && (
                                <p className="text-sm text-warning">Payment pending</p>
                              )}
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
              disabled={!selectedMonth}
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
                Remarks
              </span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full focus:outline-none"
              {...register("remarks")}
              placeholder="Enter any remarks"
              disabled={!selectedMonth}
            />
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
              disabled={!selectedMonth}
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
            className="btn btn-primary w-52"
            disabled={isSubmitting || !selectedMonth || selectedFeeIds.length === 0}
          >
            {isSubmitting ? (
              <i className="fa-solid fa-spinner fa-spin mr-2"></i>
            ) : (
              <i className="fa-solid fa-money-bill-wave ml-2"></i>
            )}
            {isSubmitting ? "" : "Submit Payment"}
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