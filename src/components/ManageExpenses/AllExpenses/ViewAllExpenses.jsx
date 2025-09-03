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
  // Tabs + Edit/Delete form state
  const [activeTab, setActiveTab] = useState("Add");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editCategoryName, setEditCategoryName] = useState("");
  const [deleteCategoryId, setDeleteCategoryId] = useState("");

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
    setActiveTab("Add"); // default to Add tab
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
         <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-4">
          <i className="fa-solid fa-money-bill-wave mr-2"></i> Total Expenses
          </h1>
        </div>


        {/* Filters */}
        <div className="flex flex-col gap-2 md:flex-row mb-6 border-b pb-2">
          {/* School Year Filter */}
          <div className="form-control md:w-1/3">
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
          <div className="form-control md:w-1/3">
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
              Category
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
                    <td className="px-4 py-3 text-sm text-gray-700 text-nowrap">
                      {expense.category_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {expense.amount}
                    </td>
                    <td
                      className="px-4 py-3 text-sm text-gray-700 truncate max-w-xs"
                      title={expense.description}
                    >
                      {expense.description}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {expense.expense_date}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {expense.payment_method}
                    </td>
                    <td
                      className="px-4 py-3 text-sm text-gray-700 truncate max-w-xs"
                      title={expense.attachment}
                    >
                      {expense.attachment}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 text-sm font-medium rounded-md shadow-sm border
              ${
                expense.status === "pending"
                  ? "text-yellow-700 bg-yellow-50 border-yellow-300"
                  : "text-green-700 bg-green-50 border-green-300"
              }`}
                      >
                        {expense.status}
                      </span>
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

      {/* Category Modal with Tabs */}

      {showAddCategoryModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Manage Category</h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b mb-4">
              {["Add", "Edit", "Delete"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setApiError("");
                  }}
                  className={`px-4 py-2 -mb-px font-medium ${
                    activeTab === tab
                      ? "border-b-2 border-blue-600 text-blue-700"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* ADD TAB */}
            {activeTab === "Add" && (
              <form onSubmit={handleSubmit}>
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
                  {apiError && (
                    <p className="text-sm text-red-500 mt-1">{apiError}</p>
                  )}
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn px-4 py-2 border bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn px-4 py-2 bgTheme text-white rounded-md"
                  >
                    Add Category
                  </button>
                </div>
              </form>
            )}

            {/* EDIT TAB */}
            {activeTab === "Edit" && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!editCategoryId)
                    return setApiError("Please select a category");
                  if (!editCategoryName.trim())
                    return setApiError("New category name is required");
                  try {
                    setLoading(true);
                    const res = await axios.patch(
                      `${constants.baseUrl}/d/Expense-Category/${editCategoryId}/`,
                      { name: editCategoryName },
                      {
                        headers: {
                          Authorization: `Bearer ${access}`,
                          "Content-Type": "application/json",
                        },
                      }
                    );
                    if (res.status === 200) {
                      setApiError("");
                      setEditCategoryId("");
                      setEditCategoryName("");
                      closeModal();
                      getExpenseCategory();
                      if (selectedCategory === String(editCategoryId))
                        setSelectedCategory("");
                    }
                  } catch (err) {
                    setApiError(
                      err.response?.data?.detail || "Something went wrong"
                    );
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Category
                  </label>
                  <select
                    value={editCategoryId}
                    onChange={(e) => setEditCategoryId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                  >
                    <option value="">Choose category</option>
                    {category.map((cate) => (
                      <option key={cate.id} value={cate.id}>
                        {cate.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Category Name
                  </label>
                  <input
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                    placeholder="Enter new name"
                  />
                </div>
                {apiError && (
                  <p className="text-sm text-red-500 -mt-2 mb-2">{apiError}</p>
                )}
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn px-4 py-2 border bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className=" btn px-4 py-2 text-yellow-700  hover:bg-yellow-100 bg-yellow-50 border-yellow-300 border  text-white rounded-md"
                  >
                    Update
                  </button>
                </div>
              </form>
            )}

            {/* DELETE TAB */}
            {activeTab === "Delete" && (
              
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!deleteCategoryId)
                    return setApiError("Please select a category to delete");
                  try {
                    setLoading(true);
                    await axios.delete(
                      `${constants.baseUrl}/d/Expense-Category/${deleteCategoryId}/`,
                      { headers: { Authorization: `Bearer ${access}` } }
                    );
                    setApiError("");
                    setDeleteCategoryId("");
                    closeModal();
                    getExpenseCategory();
                    if (selectedCategory === String(deleteCategoryId))
                      setSelectedCategory("");
                  } catch (err) {
                    setApiError(
                      err.response?.data?.detail || "Something went wrong"
                    );
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Category to Delete
                  </label>
                  <select
                    value={deleteCategoryId}
                    onChange={(e) => setDeleteCategoryId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                  >
                    <option value="">Choose category</option>
                    {category.map((cate) => (
                      <option key={cate.id} value={cate.id}>
                        {cate.name}
                      </option>
                    ))}
                  </select>
                </div>
                {apiError && (
                  <p className="text-sm text-red-500 -mt-2 mb-2">{apiError}</p>
                )}
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className=" btn px-4 py-2 border bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className=" btn px-4 py-2 text-red-700 bg-red-50 hover:bg-red-100 border rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
