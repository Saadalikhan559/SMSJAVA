import React, { useEffect, useState } from "react";
import {
  fetchSchoolIncome,
  fetchSchoolYear,
  fetchIncomeCategories,
  deleteSchoolIncome,
} from "../../services/api/Api";
import { constants } from "../../global/constants";
import { allRouterLink } from "../../router/AllRouterLinks";
import { Link } from "react-router-dom";

const BASE_URL = constants.baseUrl;

export const SchoolIncome = () => {
  const [incomeDetails, setIncomeDetails] = useState([]);
  const [schoolYears, setSchoolYears] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Delete states
  const [deleteId, setDeleteId] = useState(null);

  // Filters
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const months = [
    "All",
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const filters = {};
        if (selectedYear !== "All") filters.school_year = selectedYear;
        if (selectedMonth !== "All") filters.month = selectedMonth;
        if (selectedCategory !== "All") filters.category = selectedCategory;

        const [incomeData, schoolYearData, categoryData] = await Promise.all([
          fetchSchoolIncome(filters),
          fetchSchoolYear(),
          fetchIncomeCategories(),
        ]);

        setIncomeDetails(Array.isArray(incomeData) ? incomeData : []);

        const sortedYears = [...schoolYearData].sort((a, b) => b.id - a.id);
        setSchoolYears(sortedYears);

        setCategories(categoryData);
      } catch (err) {
        console.error("Failed to fetch:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth, selectedYear, selectedCategory]);

  // Delete confirm
  const confirmDelete = async (id) => {
    try {
      await deleteSchoolIncome(id);
      setIncomeDetails((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to delete:", err);
    } finally {
      setDeleteId(null);
    }
  };

  // Filtered data
  const filteredData = incomeDetails.filter((d) => {
    const matchMonth = selectedMonth === "All" || d.month === selectedMonth;
    const matchYear =
      selectedYear === "All" ||
      d.school_year.toString() === selectedYear.toString();
    const matchCategory =
      selectedCategory === "All" ||
      d.category.toString() === selectedCategory.toString();

    return matchMonth && matchYear && matchCategory;
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
         <div className="mb-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-1">
           <i className="fa-solid fa-money-bill-wave"></i> School Income Records
          </h1>  </div>
       
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bgTheme rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bgTheme rounded-full animate-bounce [animation-delay:-0.2s]"></div>
              <div className="w-3 h-3 bgTheme rounded-full animate-bounce [animation-delay:-0.4s]"></div>
            </div>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="mb-4 flex gap-4 flex-wrap border-b pb-2">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Select Month:
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="select select-bordered w-full focus:outline-none"
                >
                  {months.map((m, idx) => (
                    <option key={idx} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Select Year:
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="select select-bordered w-full focus:outline-none"
                >
                  <option value="All">All</option>
                  {schoolYears.map((y) => (
                    <option key={y.id} value={y.id}>
                      {y.year_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Select Category:
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="select select-bordered w-full focus:outline-none"
                >
                  <option value="All">All</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <button
                  onClick={() => {
                    setSelectedMonth("All");
                    setSelectedYear("All");
                    setSelectedCategory("All");
                  }}
                  className="btn bgTheme text-white mt-6"
                >
                  Reset Filters
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="w-full overflow-x-auto no-scrollbar max-h-[70vh] rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bgTheme text-white z-2 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Month
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Income Date
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      School Year
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Payment Method
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Attachment
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredData.length > 0 ? (
                    filteredData.map((record, index) => {
                      const yearName =
                        schoolYears.find((y) => y.id === record.school_year)
                          ?.year_name || record.school_year;
                      const categoryName =
                        categories.find((c) => c.id === record.category)?.name ||
                        record.category;

                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {record.month}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            ₹{record.amount}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {record.income_date}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {categoryName}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {record.description}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {yearName}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 capitalize">
                            {record.payment_method}
                          </td>
                          <td className="px-4 py-3 text-sm text-blue-600">
                            {record.attachment ? (
                              <a
                                href={`${BASE_URL}${record.attachment}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td>
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-md shadow-sm text-sm font-medium ${
                                record.status === "confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-600"
                              }`}
                            >
                              {record.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 flex gap-2">
                            <Link
                              to={allRouterLink.editIncom.replace(
                                ":id",
                                record.id
                              )}
                              className="px-3 py-1 border border-yellow-300 rounded-md shadow-sm text-sm font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => confirmDelete(record.id)}
                              className="px-3 py-1 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="10"
                        className="px-4 py-6 text-center text-gray-500 text-sm"
                      >
                        No records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};