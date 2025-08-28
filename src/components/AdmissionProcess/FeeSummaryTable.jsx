import React, { useEffect, useState } from "react";
import { fetchYearLevels, fetchFeeSummary } from "../../services/api/Api";
import { allRouterLink } from "../../router/AllRouterLinks";
import { Link } from "react-router-dom";

const FeeSummaryTable = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [yearLevels, setYearLevels] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const getYearLevels = async () => {
    try {
      const data = await fetchYearLevels();
      setYearLevels(data);
    } catch (err) {
      console.error("Error fetching year levels:", err);
    }
  };

  const filteredStudents = students.filter((student) =>
    student.student_name?.toLowerCase().includes(searchTerm.toLowerCase())

  );

  const getFeeData = async () => {
    setLoading(true);
    setError(null);
    setStudents([]);

    try {
      const data = await fetchFeeSummary({ selectedMonth, selectedClass });

      if (
        data &&
        typeof data === "object" &&
        data.detail === "No records found."
      ) {
        setStudents([]);
      } else if (Array.isArray(data)) {
        setStudents(data);
      } else {
        setError("Unexpected response from server.");
      }
    } catch (err) {
      console.error("Error fetching fee records:", err);

      if (err.response) {
        if (err.response.status === 404) {
          setError("No data found (404 Not Found).");
        } else {
          setError(
            `Server error: ${err.response.status} ${err.response.statusText}`
          );
        }
      } else {
        setError("Network error. Please check your connection.");
      }

      setStudents([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    getYearLevels();
  }, []);

  useEffect(() => {
    getFeeData();
  }, [selectedMonth, selectedClass]);

  const resetFilters = () => {
    setSelectedMonth("");
    setSelectedClass("");
    setSearchTerm("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <i className="fa-solid fa-spinner fa-spin mr-2 text-4xl" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center max-w-md p-6 bg-white shadow-lg rounded-lg border border-red-300">
          <i className="fa-solid fa-triangle-exclamation text-4xl text-red-500 mb-4"></i>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-sm text-gray-600">{error}</p>
          <button
            onClick={() => {
              setError(null);
              getFeeData();
            }}
            className="mt-5 px-4 py-2 bgTheme text-white rounded hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen p-5 bg-gray-50">
      <div className="bg-white max-w-7xl p-6 rounded-lg shadow-lg  mx-auto">
        <div className="mb-6">
          <div className="relative mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
              <i className="fa-solid fa-graduation-cap mr-2"></i> Students Fee Record
            </h1>
            <Link
              to={allRouterLink.feeDashboard}
              className="absolute right-0 top-1/2 -translate-y-1/2 bgTheme text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
              Fee Dashboard
            </Link>
          </div>



        </div>

        {/* Filter Section */}
        <div className="w-full max-w-5xl mx-auto">
          <div className="flex flex-wrap justify-center items-end gap-4 mb-6">
            {/* Month Filter */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Filter by Month:
              </label>
              <select
                className="border rounded px-3 py-2 text-sm"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option value="">All Months</option>
                {[
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
                ].map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            {/* Class Filter */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Filter by Class:
              </label>
              <select
                className="border rounded px-3 py-2 text-sm"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">All Classes</option>
                {yearLevels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.level_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Filter */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Search Student by Name:
              </label>
              <input
                type="text"
                placeholder="Enter student name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded px-3 py-2 text-sm w-64 focus:outline-none"
              />
            </div>

            {/* Reset Button */}
            <div className="mt-1">
              <button
                onClick={resetFilters}
                className="bg-gray-200 hover:bg-gray-300 text-sm px-4 py-2 rounded"
              >
                Reset Filters
              </button>
            </div>
          </div>

        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bgTheme text-white">
              <tr>
                <th className="px-4 py-3 text-left whitespace-nowrap">S.No</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">Student Name</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">Class</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">Month</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">Total Amount</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">Paid Amount</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">Due Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">
                    No data found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((record, index) => (
                  <tr key={record.student_id || index} className="hover:bg-blue-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{record.student_name}</td>
                    <td className="px-4 py-3">{record.year_level}</td>
                    <td className="px-4 py-3">{record.month}</td>
                    <td className="px-4 py-3">₹{record.total_amount}</td>
                    <td className="px-4 py-3">₹{record.paid_amount}</td>
                    <td className="px-4 py-3">₹{record.due_amount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FeeSummaryTable;
