import React, { use, useEffect, useRef, useState } from "react";
import { SuccessModal } from "../../Modals/SuccessModal";
import { useForm } from "react-hook-form";
import { Loader } from "../../../global/Loader";
import axios from "axios";
import { constants } from "../../../global/constants";
import { useParams } from "react-router-dom";
import { fetchSchoolYear } from "../../../services/api/Api";
import { Error } from "../../../global/Error";

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
  } = useForm();

  const fetchSingleSalaryData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${constants.baseUrl}/d/Employee-salary/?school_year_name=${selectedSchoolYear}&month=${selectedMonth}&user=${id}`,
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );

      console.log('response', response.data);
      

      setSalaryData(response.data);

      if (response.data && response.data.length > 0) {
        const salary = response.data[0];

        setValue("user", salary.user);
        setValue("employee_name", salary.employee_name);
        setValue("gross_amount", salary.gross_amount);
        setValue("deductions", salary.deductions);
        setValue("net_amount", salary.net_amount);
        setValue("month", salary.month);
        if (!selectedSchoolYear) {
          setSelectedSchooYear(salary.school_year);
          setValue("school_year", salary.school_year);
        }
        setValue("payment_date", salary.payment_date);
        setValue("payment_method", salary.payment_method);
        setValue("remarks", salary.remarks);
      }
    } catch (error) {
      setError(error?.response?.message || "Failed to fetch salary data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSchoolYear && selectedMonth) {
      fetchSingleSalaryData();
    } else {
      setSalaryData([]);
      setValue("status", "");
      // setValue("employee_name", "");
      setValue("gross_amount", "");
      setValue("deductions", "");
      setValue("net_amount", "");
      setValue("payment_date", "");
      setValue("payment_method", "");
      setValue("paid_by", "");
      setValue("remarks", "");
    }
  }, [id, selectedMonth, selectedSchoolYear]);

  const fetchEmployeeDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${constants.baseUrl}/d/Employee-salary/?user=${id}`,
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );
      const name = response.data[0].employee_name;
      setValue("employee_name", name);
    } catch (error) {
      setError(error?.response?.message || "Failed to fetch employee details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeDetails();
    getSchoolYearLevel();
  }, []);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setApiError("");
      const formData = new formData();
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
                {...register("gross_amount")}
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
                disabled
                type="number"
                min={0}
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
      <SuccessModal ref={modalRef} />
    </div>
  );
};
