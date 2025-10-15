import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { constants } from "../../../global/constants";
import axios from "axios";
import { allRouterLink } from "../../../router/AllRouterLinks";
import { Loader } from "../../../global/Loader";
import { fetchSchoolYear } from "../../../services/api/Api";

export const EmployeeMonthlySalary = () => {
  const { id } = useParams();
  const authTokens = JSON.parse(localStorage.getItem("authTokens"));
  const access = authTokens?.access;

  const [employeeName, setEmployeeName] = useState("");
  const [employeeDetails, setEmployeeDetails] = useState([]);
  const [schoolYears, setSchoolYears] = useState([]);

  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedSchoolYear, setSelectedSchoolYear] = useState("");
  const [joiningMonth, setJoiningMonth] = useState(null); // 0-indexed
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // Fetch employee info
  const getEmployee = async () => {
    try {
      const response = await axios.get(
        `${constants.baseUrl}/d/Employee/get_emp/?id=${id}`,
        { headers: { Authorization: `Bearer ${access}` } }
      );
      setEmployeeName(response.data.name);
      if (response.data.joining_date) {
        setJoiningMonth(new Date(response.data.joining_date).getMonth());
      }
    } catch (err) {
      console.error(err);
      setApiError("Failed to fetch employee data");
    }
  };

  // Fetch salary details
  const getEmployeeDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${constants.baseUrl}/d/Employee-salary/?user=${id}`,
        { headers: { Authorization: `Bearer ${access}` } }
      );
      setEmployeeDetails(response.data);
    } catch (err) {
      console.error(err);
      setApiError("Failed to fetch salary data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch school years
  const getSchoolYears = async () => {
    try {
      const data = await fetchSchoolYear();
      setSchoolYears(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getEmployee();
    getEmployeeDetails();
    getSchoolYears();
  }, [id]);

  if (loading) return <Loader />;

// Filter months based on joining, selected month & school year & future months
const getFilteredMonths = () => {
  if (!constants.allMonths || joiningMonth === null) return [];

  const today = new Date();
  const currentMonthIndex = today.getMonth(); // 0-indexed
  const currentYear = today.getFullYear();

  return constants.allMonths.filter((month, idx) => {
    // Convert month name to month index
    const monthIndex = idx;

    // Skip months before joining
    if (monthIndex < joiningMonth) return false;

    // Skip future months
    if (monthIndex > currentMonthIndex) return false;

    // Skip if selectedMonth filter is active
    if (selectedMonth && month !== selectedMonth) return false;

    // Skip if selectedSchoolYear filter is active and no record exists
    if (selectedSchoolYear) {
      const hasRecord = employeeDetails.some(
        (detail) =>
          detail.month === month && detail.school_year_name === selectedSchoolYear
      );
      if (!hasRecord) return false;
    }

    return true;
  });
};


  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen mb-24 md:mb-10">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        {/* Header */}
        <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 text-center mb-6">
            {employeeName} Salary Record
          </h1>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-start">
            {/* Month */}
            <select
              className="w-full sm:w-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="">Select Month</option>
              {constants.allMonths.map((month, idx) => (
                <option key={idx} value={month}>
                  {month}
                </option>
              ))}
            </select>

            {/* School Year */}
            <select
              className="w-full sm:w-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              value={selectedSchoolYear}
              onChange={(e) => setSelectedSchoolYear(e.target.value)}
            >
              <option value="">Select School Year</option>
              {schoolYears.map((year) => (
                <option key={year.id} value={year.year_name}>
                  {year.year_name}
                </option>
              ))}
            </select>

            {/* Reset */}
            <button
              className="btn bgTheme text-white w-full sm:w-auto"
              onClick={() => {
                setSelectedMonth("");
                setSelectedSchoolYear("");
              }}
            >
              Reset
            </button>
          </div>
        </div>

        {/* API Error */}
        {apiError && (
          <div className="border border-error/50 rounded-lg p-4 mb-6 bg-white dark:bg-gray-700">
            <div className="flex items-center text-error">
              <i className="fa-solid fa-circle-exclamation mr-2"></i>
              <span className="font-medium">{apiError}</span>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="w-full overflow-x-auto no-scrollbar rounded-lg max-h-[70vh]">
          <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
            <thead className="bgTheme text-white z-2 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Month</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Base Salary</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Deductions</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Net Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Payment Method</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Payment Date</th>
                <th className="px-12 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px- py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
              {getFilteredMonths().length > 0 ? (
                getFilteredMonths().map((month) => {
                  const detail = employeeDetails.find(
                    (d) => d.month === month && (!selectedSchoolYear || d.school_year_name === selectedSchoolYear)
                  );
                  return (
                    <tr key={month}>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{month}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{detail?.gross_amount || ""}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{detail?.deductions || ""}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{detail?.net_amount || ""}</td>
                      <td className="px-10 py-3 text-sm text-gray-700 dark:text-gray-200 capitalize">{detail?.payment_method || ""}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{detail?.payment_date || ""}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                        {detail && (
                          <span
                            className={`inline-flex flex-col items-center px-4 py-1 w-20 rounded-full text-xs font-medium text-nowrap capitalize ${
                              detail.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                            }`}
                          >
                            {detail.status}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                        {!detail || (detail.status !== "paid" && detail.status !== "pending") ? (
                          <Link
                            to={allRouterLink.paySalaryExpense.replace(":id", id)}
                            state={{ selectedMonth: month }}
                            className="inline-flex items-center px-3 py-1 border border-green-300 rounded-md shadow-sm text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100"
                          >
                            Pay
                          </Link>
                        ) : (
                          <Link
                            to={allRouterLink.updateSalaryExpense.replace(":id", id)}
                            state={{ selectedMonth: month }}
                            className="inline-flex items-center px-3 py-1 border border-yellow-300 rounded-md shadow-sm text-sm font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100"
                          >
                            Update
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-500 dark:text-gray-400">
                    No Salary Data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

