import React, { use, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Loader } from "../../../global/Loader";
import axios from "axios";
import { constants } from "../../../global/constants";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchSchoolYear } from "../../../services/api/Api";
import { Error } from "../../../global/Error";
import { allRouterLink } from "../../../router/AllRouterLinks";
import { SuccessModal } from "../../Modals/SuccessModal";

export const PaySalaryExpense = () => {
  const { id } = useParams();
  const role = localStorage.getItem("userRole");
  const authTokens = JSON.parse(localStorage.getItem("authTokens"));
  const access = authTokens.access;
  const modalRef = useRef();
  const [apiError, setApiError] = useState("");
  const [pageLoading, setPageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [schoolYear, setSchoolYear] = useState([]);
  const navigate = useNavigate();

  const location = useLocation();
  const preSelectedMonth = location.state?.selectedMonth || ""; // get month
  const paymentModes = ["cash", "cheque", "online"];

  const getSchoolYearLevel = async () => {
    try {
      const response = await fetchSchoolYear();
      setSchoolYear(response);
    } catch (error) {
      setError(error);
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      month: preSelectedMonth, // <-- preselect month
    },
  });

  const fetchSingleSalaryData = async () => {
    try {
      setPageLoading(true);
      const response = await axios.get(
        `${constants.baseUrl}/d/Employee/get_emp/?id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );
      if (response.data) {
        setValue("user", response.data.id);
        setValue("name", response.data.name);
        setValue("base_salary", response.data.base_salary);
      }
    } catch (error) {
      setError(error?.response?.message || "Failed to fetch salary data");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchSingleSalaryData();
  }, [id]);

  useEffect(() => {
    getSchoolYearLevel();
  }, []);

  const handleNavigation = () => {
    navigate(`${allRouterLink.viewSalaryExpense}`);
  };

  useEffect(() => {
    const baseSalary = Number(watch("base_salary") || 0);
    const deductions = Number(watch("deductions") || 0);

    // Ensure deductions are not greater than baseSalary
    const validDeductions = deductions > baseSalary ? baseSalary : deductions;

    // Update fields
    setValue("deductions", validDeductions);
    setValue("gross_amount", baseSalary);
    setValue("net_amount", baseSalary - validDeductions);
  }, [watch("base_salary"), watch("deductions")]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setApiError("");
      if (data.payment_method.toLowerCase() === "online") {
        const orderResponse = await axios.post(
          `${constants.baseUrl}/d/Employee-salary/initiate-salary-payment/`,
          data,
          {
            headers: {
              Authorization: `Bearer ${access}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const {
          id: order_id,
          net_amount,
          amount,
          currency,
          salary_id,
          razorpay_key,
          razorpay_order_id,
        } = orderResponse.data;

        const options = {
          key: razorpay_key,
          amount: net_amount,
          currency,
          name: "Salary Expense",
          description: data.description,
          order_id: razorpay_order_id,
          handler: async function (response) {
            await axios.post(
              `${constants.baseUrl}/d/Employee-salary/confirm-salary-payment/`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                salary_id: salary_id,
              },
              {
                headers: {
                  Authorization: `Bearer ${access}`,
                  "Content-Type": "application/json",
                },
              }
            );

            modalRef.current?.show();
          },
          prefill: {
            name: data.name,
            email: data.email,
            contact: data.contact,
          },
          theme: { color: constants.bgTheme },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        const response = await axios.post(
          `${constants.baseUrl}/d/Employee-salary/`,
          data,
          {
            headers: {
              Authorization: `Bearer ${access}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status == 201) {
          modalRef.current.show();
        }
      }
    } catch (error) {
      if (error.response?.data) {
        const errors = error.response.data;

        if (errors.non_field_errors) {
          setApiError(errors.non_field_errors.join(" "));
        } else {
          const fieldErrors = Object.entries(errors)
            .map(([field, messages]) => ` ${messages.join(", ")}`)
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

  if (pageLoading) {
    return <Loader />;
  }

  if (error) {
    return <Error />;
  }

  return (
    <div className="min-h-screen p-5 bg-gray-50 mb-24 md:mb-10">
      <div className="w-full max-w-7xl mx-auto p-6 bg-base-100 rounded-box my-5 shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8">
          Pay Salary
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
            {/* Employee Name  */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1">
                  <i className="fa-solid fa-user-tag text-sm"></i>
                  Employee Name
                </span>
              </label>
              <input
                disabled={true}
                type="text"
                className="input input-bordered w-full focus:outline-none"
                {...register("name")}
              />
            </div>

            {/* School Year */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1">
                  <i className="fa-solid fa-graduation-cap text-sm"></i>
                  School Year <span className="text-error">*</span>
                </span>
              </label>
              <select
                className="select select-bordered w-full focus:outline-none"
                {...register("school_year", {
                  required: "School Year is required",
                })}
              >
                <option value="">Select School year</option>
                {schoolYear.map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.year_name}
                  </option>
                ))}
              </select>
              {errors.school_year && (
                <p className="text-error text-sm mt-1">
                  {errors.school_year.message}
                </p>
              )}
            </div>
            {/* Month */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1">
                  <i className="fa-solid fa-calendar text-sm"></i>
                  Month
                </span>
              </label>
              <input
                type="text"
                disabled
                className="input input-bordered w-full focus:outline-none"
                value={watch("month") || ""}
                {...register("month")}
              />
            </div>

            {/* Gross Amount Selection */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1">
                  <i className="fa-solid fa-sack-dollar text-sm"></i>
                  Gross Amount <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="number"
                min={0}
                disabled
                className="input input-bordered w-full focus:outline-none"
                {...register("base_salary")}
              />
            </div>

            {/* Deductions */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1">
                  <i className="fa-solid fa-minus-circle text-sm"></i>
                  Deductions
                </span>
              </label>
              <input
                placeholder="Enter deduction amount: e.g :150 "
                type="number"
                min={0}
                max={watch("base_salary")}
                className="input input-bordered w-full focus:outline-none"
                {...register("deductions")}
              />
            </div>

            {/* Net Amount */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1">
                  <i className="fa-solid fa-money-bill text-sm"></i>
                  Net Amount <span className="text-error">*</span>
                </span>
              </label>
              <input
                disabled
                type="number"
                className="input input-bordered w-full focus:outline-none"
                {...register("net_amount")}
              />
            </div>

            {/* Payment Date */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1">
                  <i className="fa-solid fa-calendar-day text-sm"></i>
                  Payment Date <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="date"
                className="input input-bordered w-full focus:outline-none"
                {...register("payment_date", {
                  required: "Payment Date is required",
                  validate: (value) => {
                    const selectedDate = new Date(value);
                    const today = new Date();
                    return (
                      selectedDate <= today ||
                      "Payment date cannot be in the future"
                    );
                  },
                })}
              />
              {errors.payment_date && (
                <p className="text-error text-sm mt-1">
                  {errors.payment_date.message}
                </p>
              )}
            </div>

            {/* Payment Method */}
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
                  required: "Payment Method is required",
                })}
              >
                <option value="">Select Payment Method</option>
                {paymentModes.map((modes, idx) => (
                  <option key={idx} value={modes}>
                    {modes}
                  </option>
                ))}
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
              {loading ? "" : "Pay"}
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
