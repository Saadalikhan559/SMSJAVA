import React, { useEffect, useState } from "react";
import { fetchSchoolIncome, fetchSchoolYear, fetchIncomeCategories } from "../../services/api/Api"; 
import { constants } from "../../global/constants";
const BASE_URL = constants.baseUrl;

export const SchoolIncome = () => {
    const [incomeDetails, setIncomeDetails] = useState([]);
    const [schoolYears, setSchoolYears] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [selectedMonth, setSelectedMonth] = useState("All");
    const [selectedYear, setSelectedYear] = useState("All");
    const [selectedCategory, setSelectedCategory] = useState("All");

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

                // categories state me set
                setCategories(categoryData);

                // sort school years latest first
                const sortedYears = [...schoolYearData].sort((a, b) => b.id - a.id);
                setSchoolYears(sortedYears);

                // Default latest year is selected
                if (selectedYear === "All" && sortedYears.length > 0) {
                    setSelectedYear(sortedYears[0].id);
                }
            } catch (err) {
                console.error("Failed to fetch data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedMonth, selectedYear, selectedCategory]);

    const months = ["All",
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
                 <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-4">
             <i className="fa-solid fa-money-bill-wave"></i> School Income Records
          </h1>
        </div>
       
               
                {/* Loader */}
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
                    <div className="border-b pb-4 mb-2">
                        {/* Filters */}
                        <div className=" flex gap-4 flex-wrap">
                            {/* Month filter */}
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

                            {/* Year filter */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1">
                                    Select Year:
                                </label>
                                <select
                                    value={selectedYear || ""}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    className="select select-bordered w-full focus:outline-none"
                                >
                                    {schoolYears.map((y) => (
                                        <option key={y.id} value={y.id}>
                                            {y.year_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Category filter */}
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
                            {/* Reset button */}
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
                        </div> </div>
  
                        {/* Table */}
                        <div className="w-full overflow-x-auto">
                            <div className="inline-block min-w-full align-middle">
                                <div className=" shadow-sm rounded-lg max-h-[70vh]">
                                    <table className="min-w-full divide-y divide-gray-300">
                                        <thead className="bgTheme text-white z-10 sticky top-0">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-sm font-semibold">Month</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold">Amount</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold">Income Date</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold">Description</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold">School Year</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold">Payment Method</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold">Attachment</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white">
                                            {filteredData.length > 0 ? (
                                                filteredData.map((record, index) => {
                                                    const yearName =
                                                        schoolYears.find((y) => y.id === record.school_year)?.year_name ||
                                                        record.school_year;
                                                    return (
                                                        <tr key={index} className="hover:bg-gray-50">
                                                            <td className="px-4 py-3 text-sm text-gray-700">{record.month}</td>
                                                            <td className="px-4 py-3 text-sm text-gray-700">₹{record.amount}</td>
                                                            <td className="px-4 py-3 text-sm text-gray-700">{record.income_date}</td>
                                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                                {categories.find((c) => c.id === record.category)?.name || record.category}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-gray-700">{record.description}</td>
                                                            <td className="px-4 py-3 text-sm text-gray-700">{yearName}</td>
                                                            <td className="px-4 py-3 text-sm text-gray-700 capitalize">
                                                                {record.payment_method}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-blue-600">
                                                                {record.attachment ? (
                                                                    <a href={`${BASE_URL}${record.attachment}`} target="_blank" rel="noopener noreferrer">View</a>
                                                                ) : (
                                                                    "-"
                                                                )}
                                                            </td>
                                                            <td>
                                                                <span
                                                                    className={`inline-flex items-center px-3 py-1  rounded-md shadow-sm text-sm font-medium ${record.status === "confirmed"
                                                                        ? "bg-green-100 text-green-800"
                                                                        : "bg-red-100 text-red-600"
                                                                        }`}
                                                                >
                                                                    {record.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="9"
                                                        className="px-4 py-6 text-center text-gray-500 text-sm"
                                                    >
                                                        No records found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
