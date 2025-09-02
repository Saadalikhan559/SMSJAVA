import React, { useEffect, useState } from "react";
import {
  fetchExpenseCategory,
  fetchSchoolExpense,
  fetchSchoolYear,
} from "../../../services/api/Api";
import { Loader } from "../../../global/Loader";
import axios from "axios";
import { constants } from "../../../global/constants";
import { Error } from "../../../global/Error";

export const ViewAllExpenses = () => {
  const [schoolExpense, setSchoolExpense] = useState([]);
  const [loading, setLoading] = useState(false);
  const [schoolYear, setSchoolYear] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectedSchoolYear, setSelectedSchoolYear] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [error, setError] = useState("");
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [addCategory, setAddCategory] = useState("");
  const [apiError, setApiError] = useState("");

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

  const handleAddCategoryClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowAddCategoryModal(true);
  };

  const closeModal = () => {
    setShowAddCategoryModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!addCategory.trim()) {
      setApiError("Category name is required");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${constants.baseUrl}/d/Expense-Category/`,
        { name: addCategory },
        {
          headers: {
            Authorization: `Bearer ${access}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        setAddCategory(""); 
        setApiError("");
        closeModal();
        getExpenseCategory(); 
      }
    } catch (error) {
      console.error(error);
      setApiError(error.response?.data?.detail || "Something went wrong");
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

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-2">
          <i className="fa-solid fa-money-bill-wave mr-2"></i> Total Expenses
        </h2>

        {/* Filters */}
        <div className="mb-4 flex flex-col gap-4 md:flex-row">
          {/* School Year Filter */}
          <div className="form-control w-full md:w-1/3">
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
          <div className="form-control w-full md:w-1/3">
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

          {/* Add Category */}
          <div className="form-control w-full md:w-1/3">
            <label className="label">
              <span className="label-text">Actions</span>
            </label>
            <button
              onClick={handleAddCategoryClick}
              className="btn bgTheme text-white flex items-center justify-center md:justify-start text-nowrap"
            >
              <i className="fa-solid fa-plus mr-1"></i> Add Category
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bgTheme text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                  Category
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
                  Approved By
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {schoolExpense.length > 0 ? (
                schoolExpense.map((expense) => (
                  <tr key={expense.id}>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {expense.category_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {expense.amount}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 truncate max-w-xs">
                      {expense.description}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {expense.expense_date}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {expense.payment_method}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 truncate max-w-xs">
                      {expense.attachment}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {expense.status}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {expense.created_at}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {expense.created_by_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
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
                    <i className="fa-solid fa-inbox text-4xl mb-2 text-gray-400"></i>
                    <p>No expenses found for the selected criteria</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 z-50 bg-black/30 backdrop-blur-sm">
          <form
            className="bg-white rounded-lg p-6 w-full max-w-md"
            onSubmit={handleSubmit}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Add New Category</h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Name
              </label>
              <input
                value={addCategory}
                onChange={(e) => setAddCategory(e.target.value)}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                placeholder="Enter category name"
              />
              {apiError && <p className="text-sm text-red-500 mt-1">{apiError}</p>}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bgTheme text-white rounded-md text-nowrap"
                type="submit"
              >
                Add Category
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
