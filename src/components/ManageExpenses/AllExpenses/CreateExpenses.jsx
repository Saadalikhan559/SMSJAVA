import React, { useContext, useEffect, useRef, useState } from "react";
import { SuccessModal } from "../../Modals/SuccessModal";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../../context/AuthContext";
import {
  fetchExpenseCategory,
  fetchSchoolYear,
} from "../../../services/api/Api";
import { constants } from "../../../global/constants";
import axios from "axios";
import { Loader } from "../../../global/Loader";
import { Error } from "../../../global/Error";

export const CreateExpenses = () => {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState([]);
  const [apiError, setApiError] = useState("");
  const [error, setError] = useState("");
  const modalRef = useRef();
  const [schoolYear, setSchoolYear] = useState([]);

  const { authTokens } = useContext(AuthContext);
  const access = authTokens.access;

  const paymentModes = ["Cash", "Cheque", "Online"];
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
  }, []);

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
      const response = await axios.post(
        `${constants.baseUrl}/d/School-Expense/`,
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
    } catch (error) {
      setApiError(error.response.data.non_field_errors[0]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-5 bg-gray-50">
      <div className="w-full max-w-7xl mx-auto p-6 bg-base-100 rounded-box my-5 shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8">
          Create Expense
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
      <SuccessModal ref={modalRef} />
    </div>
  );
};
