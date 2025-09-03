import React, { useContext, useEffect, useRef, useState } from "react";
import { SuccessModal } from "../../Modals/SuccessModal";
import {
  fetchExpenseCategory,
  fetchSchoolExpense,
  fetchSchoolExpenseById,
  fetchSchoolYear,
} from "../../../services/api/Api";
import { AuthContext } from "../../../context/AuthContext";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { constants } from "../../../global/constants";
import axios from "axios";

export const EditExpenses = () => {
  const userRole = localStorage.getItem("userRole");
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState([]);
  const [schoolExpense, setSchoolExpense] = useState({});
  const [apiError, setApiError] = useState("");
  const [error, setError] = useState("");
  const modalRef = useRef();
  const [schoolYear, setSchoolYear] = useState([]);

  const { authTokens } = useContext(AuthContext);
  const access = authTokens.access;

  const paymentModes = ["Cash", "Cheque", "Online"];
  const Status = ["approved", "pending", "rejected"];
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const getSchoolExpenseById = async () => {
    try {
      setError("");
      const response = await fetchSchoolExpenseById(access, id);
        // console.log("response", response);
      setSchoolExpense(response);
      if (response) {
        setValue("category", response.category);
        setValue("amount", response.amount);
        setValue("description", response.description);
        setValue("expense_date", response.expense_date);
        const paymentMethod = response.payment_method
          ? response.payment_method.charAt(0).toUpperCase() +
            response.payment_method.slice(1).toLowerCase()
          : "";
        setValue("payment_method", paymentMethod);
        // setValue("attachment", response.attachment);
        setValue("school_year", response.school_year);
        setValue("status", response.status);
      }
    } catch (err) {
      setError("Failed to load expenses. Please try again later.");
    }
  };

  const getExpenseCategory = async () => {
    try {
      setError("");
      const response = await fetchExpenseCategory(access);
      setCategory(response);
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
    getSchoolExpenseById(); // Call this function to load expense data
  }, [id]); // Added id as dependency

  const onSubmit = async (data) => {
    try {
        setLoading(true);
        setApiError("");
        const payload = {
          ...data,
          payment_method: data.payment_method
            ? data.payment_method.toLowerCase()
            : "",
        };
        const response = await axios.patch(
          `${constants.baseUrl}/d/School-Expense/${id}/`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );
        if (response.status === 200 || response.status === 201) {
          modalRef.current?.show();
        }
      console.log(data);
    } catch (error) {
      setApiError("There is an issue at the moment please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-5 bg-gray-50">
      <div className="w-full max-w-7xl mx-auto p-6 bg-base-100 rounded-box my-5 shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8">
          Edit Expense
          <i className="fa-solid fa-percentage ml-2"></i>
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
            {/* Category Selection */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1">
                  <i className="fa-solid fa-school text-sm"></i>
                  School Year <span className="text-error">*</span>
                </span>
              </label>
              <select
                className="select select-bordered w-full focus:outline-none"
                {...register("school_year", {
                  required: "Category is required",
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
              {errors.category && (
                <p className="text-error text-sm mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>
            {/* Category Selection */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1">
                  <i className="fa-solid fa-school text-sm"></i>
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
                  <i className="fa-solid fa-school text-sm"></i>
                  Amount <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="number"
                min={0}
                placeholder="Enter Base Salary e.g: 15000"
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

            {/* Description Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1">
                  <i className="fa-solid fa-school text-sm"></i>
                  Description <span className="text-error"></span>
                </span>
              </label>
              <textarea
                type="number"
                placeholder="Enter your category description"
                className="input input-bordered w-full focus:outline-none"
                {...register("description")}
              ></textarea>
              {errors.description && (
                <p className="text-error text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
            {/* Expense Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1">
                  <i className="fa-solid fa-calendar-days text-sm"></i>
                  Expense Date <span className="text-error"></span>
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
                  <i className="fa-solid fa-calendar-days text-sm"></i>
                  Payment Modes <span className="text-error"></span>
                </span>
              </label>
              <select
                className="select select-bordered w-full focus:outline-none"
                {...register("payment_method", {
                  required: "payment_method is required",
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
              {errors.expense_date && (
                <p className="text-error text-sm mt-1">
                  {errors.expense_date.message}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1">
                  <i className="fa-solid fa-calendar-days text-sm"></i>
                  Status <span className="text-error"></span>
                </span>
              </label>
              <select
                disabled={constants.roles.director !== userRole}
                {...register("status")}
                className="select select-bordered w-full focus:outline-none"
              >
                <option value="">Select Status</option>
                {Status?.map(
                  (sta, idx) =>
                    sta && (
                      <option key={idx} value={sta}>
                        {sta}
                      </option>
                    )
                )}
              </select>
              {errors.expense_date && (
                <p className="text-error text-sm mt-1">
                  {errors.expense_date.message}
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
              {loading ? "" : "Update"}
            </button>
          </div>
        </form>
      </div>
      <SuccessModal ref={modalRef} />
    </div>
  );
};
