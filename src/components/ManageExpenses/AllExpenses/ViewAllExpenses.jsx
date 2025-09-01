import React, { useEffect, useState } from "react";
import {
  fetchExpenseCategory,
  fetchSchoolExpense,
  fetchSchoolYear,
} from "../../../services/api/Api";

export const ViewAllExpenses = () => {
  const [schoolExpense, setSchoolExpense] = useState([]);
  const [loading, setLoading] = useState(false);
  const [schoolYear, setSchoolYear] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectedSchoolYear, setSelectedSchoolYear] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [error, setError] = useState(""); 

  const access = JSON.parse(localStorage.getItem("authTokens"))?.access;

  const getSchoolYear = async () => {
    try {
      setError("");
      const response = await fetchSchoolYear();
      setSchoolYear(response);
    } catch (err) {
      console.error("Cannot get the school year:", err);
      setError("Failed to load school years. Please try again later.");
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

  const getSchoolExpense = async () => {
    setLoading(true);
    try {
      setError("");
      const response = await fetchSchoolExpense(
        access,
        selectedSchoolYear,
        selectedCategory
      );
      setSchoolExpense(response);
    } catch (err) {
      console.error("Cannot get the school salary expense:", err);
      setError("Failed to load expenses. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSchoolYear();
    getExpenseCategory();
  }, []);

  useEffect(() => {
    if (access) {
      getSchoolExpense();
    }
  }, [selectedSchoolYear, selectedCategory, access]);


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce [animation-delay:-0.2s]"></div>
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce [animation-delay:-0.4s]"></div>
        </div>
        <p className="mt-2 text-gray-500 text-sm">Loading data...</p>
      </div>
    );
  }


  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
        <i className="fa-solid fa-triangle-exclamation text-5xl text-red-400 mb-4"></i>
        <p className="text-lg text-red-400 font-medium">Failed to load data, Try Again</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-2">
          <i className="fa-solid fa-money-bill-wave mr-2"></i> Total Expenses
        </h2>

        {/* Filters */}
        <div className="mb-4 flex gap-4">
          {/* School Year Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Select School Year</span>
            </label>
            <select
              value={selectedSchoolYear}
              onChange={(e) => setSelectedSchoolYear(e.target.value)}
              className="select select-bordered w-full focus:outline-none"
            >
              <option value="">Select School Year</option>
              {schoolYear.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.year_name}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Select Category</span>
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
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bgTheme text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Category</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Description</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Expense Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Payment Method</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Attachment</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Created At</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Created By</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Approved By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {schoolExpense.length > 0 ? (
                schoolExpense.map((expense) => (
                  <tr key={expense.id}>
                    <td className="px-4 py-3 text-sm text-gray-700">{expense.category_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{expense.amount}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 truncate max-w-xs">
                      {expense.description}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{expense.expense_date}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{expense.payment_method}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 truncate max-w-xs">{expense.attachment}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{expense.status}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{expense.created_at}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{expense.created_by_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{expense.approved_by_name}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="px-4 py-12 text-center text-gray-500">
                    <i className="fa-solid fa-inbox text-4xl mb-2 text-gray-400"></i>
                    <p>No expenses found for the selected criteria</p>
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
