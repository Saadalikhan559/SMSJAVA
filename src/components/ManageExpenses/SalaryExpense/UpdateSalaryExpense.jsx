import React, { useEffect, useRef, useState } from "react";
import { SuccessModal } from "../../Modals/SuccessModal";
import { Loader } from "../../../global/Loader";
import { fetchSchoolYear } from "../../../services/api/Api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Error } from "../../../global/Error";
import axios from "axios";
import { constants } from "../../../global/constants";
import { allRouterLink } from "../../../router/AllRouterLinks";

export const UpdateSalaryExpense = () => {
  const { id } = useParams();
  const role = localStorage.getItem("userRole");
  const authTokens = JSON.parse(localStorage.getItem("authTokens"));
  const access = authTokens.access;
  const modalRef = useRef();
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const preSelectedMonth = location.state?.selectedMonth || "";
  const [employeeName, setEmployeeName] = useState("");
  const [objId, setObjId] = useState("");
  const [fetching, setFetching] = useState(false); // page loader
  const [submitting, setSubmitting] = useState(false); // button loader

  const Status = ["paid", "pending"];
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const getEmployeeDetails = async () => {
    try {
      setFetching(true);
      const response = await axios.get(
        `${constants.baseUrl}/d/Employee-salary/?user=${id}&month=${preSelectedMonth}`,
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );

      if (response.data && response.data.length > 0) {
        const details = response.data[0];
        setEmployeeName(details.employee_name);
        setObjId(details.id);
        setValue("status", details.status);
        setValue("payment_date", details.payment_date);
        setValue("remarks", details.remarks || "");
      }
    } catch (error) {
      setError("Failed to load data. Please try again later.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    getEmployeeDetails();
  }, [id]);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      setApiError("");

      const response = await axios.patch(
        `${constants.baseUrl}/d/Employee-salary/${objId}/`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        modalRef.current.show();
        return;
      }
    } catch (error) {
      if (error.response?.data) {
        const errors = error.response.data;

        if (errors.non_field_errors) {
          setApiError(errors.non_field_errors.join(" "));
        } else {
          const fieldErrors = Object.entries(errors)
            .map(([field, messages]) => `${messages.join(", ")}`)
            .join(" | ");
          setApiError(fieldErrors);
        }
      } else {
        setApiError("An unexpected error occurred.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (fetching) {
    return <Loader />;
  }

  if (error) {
    return <Error />;
  }

  const handleNavigation = (id) => {
    navigate(`/employeeMonthySalary/${id}`);
  };

  console.log("id", id);

  return (
    <div className="min-h-screen p-5 bg-gray-50">
      <div className="w-full max-w-7xl mx-auto p-6 bg-base-100 rounded-box my-5 shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8">
          Update Paid Salary
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
              <p className="input input-bordered w-full bg-gray-100">
                {employeeName || "N/A"}
              </p>
            </div>
            {/* Status */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1">
                  <i className="fa-solid fa-circle-check text-sm"></i>
                  Status <span className="text-error"></span>
                </span>
              </label>
              <select
                disabled={constants.roles.director !== role}
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {/* Description Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1">
                  <i className="fa-solid fa-align-left text-sm"></i>
                  Remarks <span className="text-error"></span>
                </span>
              </label>
              <textarea
                placeholder="Enter your category description"
                className="textarea textarea-bordered w-full focus:outline-none"
                rows={5}
                {...register("remarks")}
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
              {submitting ? (
                <i className="fa-solid fa-spinner fa-spin mr-2"></i>
              ) : (
                <i className="fa-solid fa-wand-magic-sparkles mr-2"></i>
              )}
              {submitting ? "" : "Update"}
            </button>
          </div>
        </form>
      </div>
      <SuccessModal
        ref={modalRef}
        navigateTo={() => handleNavigation(id)}
        buttonText="Continue"
        message="Successfully updated!"
      />
    </div>
  );
};
