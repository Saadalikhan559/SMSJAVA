import React, { useEffect, useState } from "react";
import {
  fetchExpenseCategory,
  fetchSchoolExpense,
  fetchSchoolYear,
} from "../../../services/api/Api";

export const ViewAllExpenses = () => {
  const [schoolExpense, setSchoolExpense] = useState([]);
  const [schoolYear, setSchoolYear] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectedSchoolYear, setSelectedSchoolYear] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const access = JSON.parse(localStorage.getItem("authTokens")).access;

  const getSchoolYear = async () => {
    try {
      const response = await fetchSchoolYear();
      setSchoolYear(response);
    } catch (error) {
      console.log("Cannot get the school year", error.meesage);
    }
  };

  const getExpenseCategory = async () => {
    try {
      const response = await fetchExpenseCategory(access);
      setCategory(response);
    } catch (error) {
      console.log("Cannot get the category", error.meesage);
    }
  };

  const getSchoolExpense = async () => {
    try {
      const response = await fetchSchoolExpense(
        access,
        selectedSchoolYear,
        selectedCategory
      );
      setSchoolExpense(response);
    } catch (error) {
      console.log("Cannot get the school salary expense", error.meesage);
    }
  };

  useEffect(() => {
    getSchoolYear();
    getExpenseCategory();
  }, []);
  useEffect(() => {
    getSchoolExpense();
  }, [selectedSchoolYear, selectedCategory]);


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-2">
          <i className="fa-solid fa-money-bill-wave mr-2"></i> Total Expenses
        </h2>

        {/* Filters */}
        <div className="mb-4 flex gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-1">
                Select School Year:
              </span>
            </label>
            <select
              value={selectedSchoolYear}
              onChange={(e) => setSelectedSchoolYear(e.target.value)}
              className="select select-bordered w-full focus:outline-none"
            >
              <option value="">Select School Year: </option>
              {schoolYear.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.year_name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-1">
                Select Category
              </span>
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="select select-bordered w-full focus:outline-none"
            >
              <option value="">Category</option>
              {category.map((cate) => (
                <option key={cate.id} value={cate.id}>
                  {cate.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow-sm rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bgTheme text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                      Category name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                      Expense Date
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                      Payment Method
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                      Attachment
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                      Created At
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                      Created By
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                      Approved By Name
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {schoolExpense.length > 0 ? (
                    schoolExpense.map((expense) => (
                      <tr key={expense.id}>
                        <td className="px-4 py-3 text-sm text-gray-700 text-nowrap">
                          {expense.category_name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-nowrap">
                          {expense.amount}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 truncate max-w-xs text-nowrap">
                          {expense.description}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-nowrap">
                          {expense.expense_date}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-nowrap">
                          {expense.payment_method}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 truncate max-w-xs text-nowrap">
                          {expense.attachment}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-nowrap">
                          {expense.status}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-nowrap">
                          {expense.created_at}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-nowrap">
                          {expense.created_by_name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-nowrap">
                          {expense.approved_by_name}
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
                          <p>No expenses found for the selected criteria</p>
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
