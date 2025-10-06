import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { constants } from "../../../global/constants";
import axios from "axios";
import { allRouterLink } from "../../../router/AllRouterLinks";
import { Loader } from "../../../global/Loader";

export const EmployeeMonthlySalary = () => {
  const [employeeName, setEmployeeName] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const authTokens = JSON.parse(localStorage.getItem("authTokens"));
  const access = authTokens.access;
  const [employeeDetails, setEmployeeDetails] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [openDropdown, setOpenDropdown] = useState(false);

  const [searchName, setSearchName] = useState("");
  const { id } = useParams();

  const Status = ["approved", "pending", "rejected"];


  const getEmployee = async () => {
    try {
      const response = await axios.get(
        `${constants.baseUrl}/d/Employee/get_emp/?id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );
      setEmployeeName(response.data.name);
    } catch (error) {
      console.log("error", error);
    }
  };

  const getEmployeeDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${constants.baseUrl}/d/Employee-salary/?user=${id}&month=${selectedMonth}`,
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );
      console.log(response.data);
      setEmployeeDetails(response.data);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEmployeeDetails();
  }, [id, selectedMonth]);

  useEffect(() => {
    getEmployee();
  }, []);

  if (loading) {
    return <Loader />;
  }

  const employeeDetailsMap = employeeDetails.reduce((acc, detail) => {
    acc[detail.month] = detail;
    return acc;
  }, {});

  return (
    <div className="p-6 bg-gray-100 min-h-screen mb-24 md:mb-10">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="mb-6 pb-4 border-b">
          {/* Employee Name */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-6">
            {employeeName} Salary Record
          </h1>

          {/* Month Selector */}
          <div className="max-w-xs">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              onChange={(e) => setSelectedMonth(e.target.value)}
              value={selectedMonth}
            >
              <option value={""}>Select Month</option>
              {constants.allMonths.map((month, idx) => (
                <option key={idx} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Display API error message */}
        {apiError && (
          <div className="border border-error/50 rounded-lg p-4 mb-6 bg-white">
            <div className="flex items-center text-error">
              <i className="fa-solid fa-circle-exclamation mr-2"></i>
              <span className="font-medium">{apiError}</span>
            </div>
          </div>
        )}
        {/* Table */}
        <div className="w-full overflow-x-auto no-scrollbar rounded-lg max-h-[70vh]">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bgTheme text-white z-2 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                  Month
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                  Base Salary
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                  Deductions
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                  Net Amount
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                  Payment Method
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                  Payment Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                  Status
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold text-nowrap"
                  width={10}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {constants.allMonths.map((month) => {
                const detail = employeeDetailsMap[month]; // may be undefined if no payment yet
                return (
                  <tr key={month}>
                    <td className="px-4 py-3 text-sm text-gray-700 text-nowrap">
                      {month}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-nowrap">
                      {detail ? detail.gross_amount : ""}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-nowrap">
                      {detail ? detail.deductions : ""}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-nowrap">
                      {detail ? detail.net_amount : ""}
                    </td>
                    <td className="px-10 py-3 text-sm text-gray-700 text-nowrap capitalize">
                      {detail ? detail.payment_method : ""}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-nowrap">
                      {detail ? detail.payment_date : ""}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-nowrap">
                      {detail ? (
                        <span
                          className={`px-2 py-1 text-sm font-medium rounded-md capitalize shadow-sm border ${detail.status === "pending"
                              ? "text-yellow-700 bg-yellow-50 border-yellow-300"
                              : "text-green-700 bg-green-50 border-green-300"
                            }`}
                        >
                          {detail.status}
                        </span>
                      ) : (
                        ""
                      )}
                    </td>

                    {/* Dropdown Actions */}
                    <td className="px-4 py-3 text-sm text-gray-700 text-nowrap">
                      <div className="relative inline-block text-left w-full">
                        <button
                          type="button"
                          className="flex w-full justify-center px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 items-center"
                          onClick={() =>
                            setOpenDropdown((prev) =>
                              prev === month ? null : month
                            )
                          }
                        >
                          Options
                          <i className="fa-solid fa-chevron-down ml-2"></i>
                        </button>

                        {openDropdown === month && (
                          <div
                            className="absolute right-0 mt-2 w-32 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg z-10"
                            role="menu"
                          >
                            <div className="py-1">
                              <Link
                                to={allRouterLink.paySalaryExpense.replace(
                                  ":id",
                                  id
                                )}
                                state={{ selectedMonth: month }}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                Pay
                              </Link>

                              {detail && (
                                <Link
                                  to={allRouterLink.updateSalaryExpense.replace(
                                    ":id",
                                    id
                                  )}
                                  state={{ selectedMonth: month }}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                  role="menuitem"
                                >
                                  Update
                                </Link>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
