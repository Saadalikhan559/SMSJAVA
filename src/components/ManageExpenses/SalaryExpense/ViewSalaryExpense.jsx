import React, { useEffect, useState } from "react";
import { fetchSalaryExpense } from "../../../services/api/Api";
import { Link, useNavigate } from "react-router-dom";
import { allRouterLink } from "../../../router/AllRouterLinks";
import { constants } from "../../../global/constants";
import axios from "axios";

export const ViewSalaryExpense = () => {
  const navigation = useNavigate();
  const [schoolExpense, setSchoolExpense] = useState([]);
  const access = JSON.parse(localStorage.getItem("authTokens")).access;
  const [apiError, setApiError] = useState("");

  const getSchoolExpense = async () => {
    try {
      const response = await fetchSalaryExpense(access);
      setSchoolExpense(response);
    } catch (error) {
      console.log("Cannot get the school salary expense", error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${constants.baseUrl}/d/Employee/get_emp/${id}`
      );
      if (response.status === 200) {
        alert("successfully deleted");
      }
    } catch (err) {
      if (err.response.data) {
        setApiError(err.response.data.error);
      } else {
        setApiError("Something Went Wrong. Try again");
      }
    }
  };

  useEffect(() => {
    getSchoolExpense();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-2">
          <i className="fa-solid fa-money-bill-wave mr-2"></i> Salary
        </h2>

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
        <div className="w-full overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow-sm rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bgTheme text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                      Joining Date
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                      Base Salary
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {schoolExpense.length > 0 ? (
                    schoolExpense.map((expense) => (
                      <tr key={expense.id}>
                        <td className="px-4 py-3 text-sm text-gray-700 text-nowrap">
                          {expense.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-nowrap">
                          {expense.role.map((r) => r)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 truncate max-w-xs text-nowrap">
                          {expense.joining_date}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-nowrap">
                          {expense.base_salary}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <Link
                              to={allRouterLink.editSalaryExpense.replace(
                                ":id",
                                expense.id
                              )}
                              className="inline-flex items-center px-3 py-1 border border-yellow-300 rounded-md shadow-sm text-sm font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                            >
                              Edit
                            </Link>
                            <Link
                              onClick={() => handleDelete(expense.id)}
                              className="inline-flex items-center px-3 py-1 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              Delete
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="10"
                        className="px-4 py-12 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <i className="fa-solid fa-inbox text-4xl mb-2 text-gray-400"></i>
                          <p>No Salary Found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
