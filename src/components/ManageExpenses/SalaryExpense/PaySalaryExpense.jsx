import React, { use, useEffect, useRef, useState } from "react";
import { SuccessModal } from "../../Modals/SuccessModal";
import { useForm } from "react-hook-form";
import { Loader } from "../../../global/Loader";
import axios from "axios";
import { constants } from "../../../global/constants";
import { useParams } from "react-router-dom";
import { fetchSchoolYear } from "../../../services/api/Api";

export const PaySalaryExpense = () => {
  const { id } = useParams();
  const role = localStorage.getItem("userRole");
  const authTokens = JSON.parse(localStorage.getItem("authTokens"));
  const access = authTokens.access;
  const modalRef = useRef();
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [salaryData, setSalaryData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedSchoolYear, setSelectedSchooYear] = useState("");
  const [schoolYear, setSchoolYear] = useState([]);
  const [status, setStatus] = useState([]);

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

  const getSchoolYearLevel = async () => {
    try {
      const response = await fetchSchoolYear();
      setSchoolYear(register);
    } catch (error) {}
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const fetchSingleSalaryData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${constants.baseUrl}/d/Employee-salary/?school_year_name=${selectedSchoolYear}&month=${month}&status=${paid}&user=${id}`,
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );
      setSalaryData(response.data);

      if (response.data && response.data.length > 0) {
        const salary = response.data[0]; // Access the first element of the array
        setValue("user", salary.user);
        setValue("employee_name", salary.employee_name);
        setValue("gross_amount", salary.gross_amount);
        setValue("deductions", salary.deductions);
        setValue("net_amount", salary.net_amount);
        setValue("month", salary.month);
        setValue("school_year", salary.school_year);
        setValue(
          "payment_date",
          salary.payment_date || new Date().toISOString().split("T")[0]
        );
        setValue("payment_method", salary.payment_method);
        setValue("paid_by", salary.paid_by);
        setValue("remarks", salary.remarks);
        setValue("status", salary.status);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentStatus = async () => {
    try {
      const response = await axios.get(
        `${constants.baseUrl}/d/Employee-salary/status=${paid}`,
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );
      setStatus(response.data);
    } catch (error) {}
  };
  useEffect(() => {
    fetchSingleSalaryData();
  }, [id, selectedMonth, selectedSchoolYear, status]);

  useEffect(() => {
    fetchPaymentStatus();
    getSchoolYearLevel();
  }, []);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setApiError("");
      const response = await axios.post(
        `${constants.baseUrl}/d/Employee-salary/`
      );
      if (modalRef.current) {
        modalRef.current.showModal();
      }
    } catch (error) {
      setApiError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Error />;
  }

  console.log("salaryData", salaryData);
  return (
    <div className="min-h-screen p-5 bg-gray-50">
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
                  onChange: (e) => setSelectedSchooYear(e.target.value),
                })}
              >
                <option value="">Select Month</option>
                {schoolYear.map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.name}
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
                  Month <span className="text-error">*</span>
                </span>
              </label>
              <select
                className="select select-bordered w-full focus:outline-none"
                {...register("month", {
                  required: "Month is required",
                  onChange: (e) => setSelectedMonth(e.target.value),
                })}
              >
                <option value="">Select Month</option>
                {allMonths.map((month, idx) => (
                  <option key={idx} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              {errors.month && (
                <p className="text-error text-sm mt-1">
                  {errors.month.message}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1">
                  <i className="fa-solid fa-status text-sm"></i>
                  Status <span className="text-error">*</span>
                </span>
              </label>
              <select
                className="select select-bordered w-full focus:outline-none"
                {...register("status", {
                  required: "Status is required",
                  onChange: (e) => setStatus(e.target.value),
                })}
              >
                <option value="">Select Status</option>
                {status.map((stat) => (
                  <option key={stat.id} value={stat.id}>
                    {stat.status}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="text-error text-sm mt-1">
                  {errors.status.message}
                </p>
              )}
            </div>

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
                {...register("employee_name")}
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
                {...register("gross_amount", {
                  required: "Gross Amount is required",
                  min: { value: 0, message: "Gross Amount must be positive" },
                })}
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
                type="number"
                step="0.01"
                min={0}
                className="input input-bordered w-full focus:outline-none"
                {...register("deductions", {
                  min: { value: 0, message: "Deductions must be positive" },
                })}
              />
              {errors.deductions && (
                <p className="text-error text-sm mt-1">
                  {errors.deductions.message}
                </p>
              )}
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
                type="number"
                step="0.01"
                min={0}
                readOnly
                className="input input-bordered w-full focus:outline-none bg-gray-100"
                {...register("net_amount", {
                  required: "Net Amount is required",
                  min: { value: 0, message: "Net Amount must be positive" },
                })}
              />
              {errors.net_amount && (
                <p className="text-error text-sm mt-1">
                  {errors.net_amount.message}
                </p>
              )}
            </div>

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
                  <option key={idx}>{modes}</option>
                ))}
              </select>
              {errors.payment_method && (
                <p className="text-error text-sm mt-1">
                  {errors.payment_method.message}
                </p>
              )}
            </div>

            {/* Paid By */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1">
                  <i className="fa-solid fa-user-check text-sm"></i>
                  Paid By (User ID) <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="number"
                min={1}
                className="input input-bordered w-full focus:outline-none"
                {...register("paid_by", {
                  required: "Paid By is required",
                  min: { value: 1, message: "Paid By must be positive" },
                })}
              />
              {errors.paid_by && (
                <p className="text-error text-sm mt-1">
                  {errors.paid_by.message}
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
