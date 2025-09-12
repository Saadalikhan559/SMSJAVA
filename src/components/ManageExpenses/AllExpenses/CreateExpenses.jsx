import React, { useContext, useEffect, useRef, useState } from "react";
import { SuccessModal } from "../../Modals/SuccessModal";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../../context/AuthContext";
import { fetchSchoolYear } from "../../../services/api/Api";
import { constants } from "../../../global/constants";
import { allRouterLink } from "../../../router/AllRouterLinks";
import { useNavigate } from "react-router-dom";

export const CreateExpenses = () => {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState([]);
  const [apiError, setApiError] = useState("");
  const [error, setError] = useState("");
  const modalRef = useRef();
  const [schoolYear, setSchoolYear] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const { axiosInstance } = useContext(AuthContext);
  const navigate = useNavigate();

  const paymentModes = ["Cash", "Cheque", "Online"];
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const getExpenseCategory = async () => {
    try {
      setError("");
      const response = await axiosInstance.get("/d/Expense-Category/");
      setCategory(response.data);
    } catch (err) {
      console.error("Cannot get the category:", err);
      setError("Failed to load categories. Please try again later.");
    }
  };

  const getSchoolYearLevel = async () => {
    try {
      const response = await fetchSchoolYear();
      setSchoolYear(response);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    getSchoolYearLevel();
    getExpenseCategory();
  }, []);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setApiError("");

      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key !== "attachment") {
          formData.append(key, data[key]);
        }
      });

      if (selectedFile) {
        formData.append("attachment", selectedFile);
      }

      if (data.payment_method) {
        formData.set("payment_method", data.payment_method.toLowerCase());
      }

      if (data.payment_method.toLowerCase() === "online") {
        const orderResponse = await axiosInstance.post(
          `/d/School-Expense/initiate-expense-payment/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const {
          id: order_id,
          amount,
          currency,
          expense_id,
          razorpay_key,
          razorpay_order_id,
        } = orderResponse.data;

        const options = {
          key: razorpay_key,
          amount: amount * 100,
          currency,
          name: "School Expense",
          description: data.description,
          order_id: razorpay_order_id,
          handler: async function (response) {
            await axiosInstance.post(
              `/d/School-Expense/confirm-expense-payment/`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                expense_id: expense_id,
              }
            );

            modalRef.current?.show();
          },
          prefill: {
            name: data.name || "Test User",
            email: data.email || "test@example.com",
            contact: data.contact || "9876543210",
          },
          theme: { color: constants.bgTheme },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        const response = await axiosInstance.post(
          `/d/School-Expense/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200 || response.status === 201) {
          modalRef.current?.show();
        }
      }
    } catch (error) {
      if (error.response?.data) {
        const errors = error.response.data;
        if (errors.non_field_errors) {
          setApiError(errors.non_field_errors.join(" "));
        } else {
          const fieldErrors = Object.entries(errors)
            .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
            .join(" | ");
          setApiError(fieldErrors);
        }
      } else {
        setApiError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };
  const handleNavigation = () => {
    navigate(`${allRouterLink.viewAllExpenses}`);
  };
  return (
    <div className="min-h-screen p-5 bg-gray-50">
      <div className="w-full max-w-7xl mx-auto p-6 bg-base-100 rounded-box my-5 shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8">
          Create Expense
          <i className="fa-solid fa-receipt ml-2"></i>
        </h1>

        {/* Display API error message */}
        {apiError && (
          <div className="border border-error/50 rounded-lg p-4 mb-6 bg-white">
            <div className="flex items-center text-error">
              <i className="fa-solid fa-circle-exclamation mr-2"></i>
              <span className="font-medium">{apiError}</span>
            </div>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* School Year Selection */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1">
                  <i className="fa-solid fa-calendar-days text-sm"></i>
                  School Year <span className="text-error">*</span>
                </span>
              </label>
              <select
                className="select select-bordered w-full focus:outline-none"
                {...register("school_year", {
                  required: "School Year is required",
                })}
              >
                <option value="">Select School Year</option>
                {schoolYear?.map(
                  (year) =>
                    year && (
                      <option key={year.id} value={year.id}>
                        {year.year_name}
                      </option>
                    )
                )}
              </select>
              {errors.school_year && (
                <p className="text-error text-sm mt-1">
                  {errors.school_year.message}
                </p>
              )}
            </div>

            {/* Category Selection */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1">
                  <i className="fa-solid fa-tags text-sm"></i>
                  Category <span className="text-error">*</span>
                </span>
              </label>
              <select
                className="select select-bordered w-full focus:outline-none"
                {...register("category", { required: "Category is required" })}
              >
                <option value="">Select Category</option>
                {category?.map(
                  (cat) =>
                    cat && (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    )
                )}
              </select>
              {errors.category && (
                <p className="text-error text-sm mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Amount Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1">
                  <i className="fa-solid fa-money-bill-wave text-sm"></i>
                  Amount <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="number"
                min={0}
                placeholder="Enter Amount e.g: 15000"
                className="input input-bordered w-full focus:outline-none"
                {...register("amount", {
                  required: "Amount salary is required",
                  min: { value: 0, message: "Salary must be positive" },
                })}
              />
              {errors.amount && (
                <p className="text-error text-sm mt-1">
                  {errors.amount.message}
                </p>
              )}
            </div>

            {/* Attachments */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1">
                  <i className="fa-solid fa-paperclip text-sm"></i>
                  Attachments <span className="text-error"></span>
                </span>
              </label>

              {!selectedFile ? (
                <input
                  type="file"
                  className="file-input file-input-bordered w-full focus:outline-none"
                  onChange={handleFileChange}
                />
              ) : (
                <div className="file-input file-input-bordered w-full flex items-center justify-between">
                  <span className="text-sm text-gray-700 truncate px-3">
                    {selectedFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="btn btn-xs text-red-700 bg-red-50 hover:bg-red-100 border border-red-300 rounded-md"
                  >
                    <span>Remove</span>
                  </button>
                </div>
              )}

              {errors.attachment && (
                <p className="text-error text-sm mt-1">
                  {errors.attachment.message}
                </p>
              )}
            </div>

            {/* Expense Date Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1">
                  <i className="fa-solid fa-calendar-day text-sm"></i>
                  Expense Date <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="date"
                className="input input-bordered w-full focus:outline-none"
                {...register("expense_date", {
                  required: "Expense Date is required",
                })}
              />
              {errors.expense_date && (
                <p className="text-error text-sm mt-1">
                  {errors.expense_date.message}
                </p>
              )}
            </div>

            {/* Payment method */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1">
                  <i className="fa-solid fa-credit-card text-sm"></i>
                  Payment Method <span className="text-error">*</span>
                </span>
              </label>
              <select
                className="select select-bordered w-full focus:outline-none"
                {...register("payment_method", {
                  required: "Payment method is required",
                })}
              >
                <option value="">Select Payment Mode</option>
                {paymentModes?.map(
                  (modes, idx) =>
                    modes && (
                      <option key={idx} value={modes}>
                        {modes}
                      </option>
                    )
                )}
              </select>
              {errors.payment_method && (
                <p className="text-error text-sm mt-1">
                  {errors.payment_method.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {/* Description Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1">
                  <i className="fa-solid fa-align-left text-sm"></i>
                  Description <span className="text-error"></span>
                </span>
              </label>
              <textarea
                placeholder="Enter your category description"
                className="textarea textarea-bordered w-full focus:outline-none"
                rows={5}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-error text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-center pt-6 gap-4">
            <button
              type="submit"
              className="btn bgTheme text-white w-full md:w-40"
            >
              {loading ? (
                <i className="fa-solid fa-spinner fa-spin mr-2"></i>
              ) : (
                <i className="fa-solid fa-wand-magic-sparkles mr-2"></i>
              )}
              {loading ? "" : "Create"}
            </button>
          </div>
        </form>
      </div>
      <SuccessModal
        ref={modalRef}
        navigateTo={handleNavigation}
        buttonText="Continue"
        message="Successfully paid the salary!"
      />
    </div>
  );
};
