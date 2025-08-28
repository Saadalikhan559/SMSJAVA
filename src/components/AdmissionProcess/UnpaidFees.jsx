import React, { useEffect, useState, useContext } from "react";
import { fetchUnpaidFees, fetchYearLevels } from "../../services/api/Api";
import { AuthContext } from "../../context/AuthContext";
import { constants } from "../../global/constants";

const UnpaidFeesList = () => {
  const { userRole, yearLevelID, userID, studentID } = useContext(AuthContext);
  const [unpaidFees, setUnpaidFees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [yearLevels, setYearLevels] = useState([]);

  // Fetch year levels from backend
  const getYearLevels = async () => {
    try {
      const data = await fetchYearLevels();
      setYearLevels(data);
    } catch (err) {
      console.error("Error fetching year levels:", err);
    }
  };

  // Fetch unpaid fees
  const loadUnpaidFees = async () => {
    try {
      setLoading(true);

      let params = {
        role: userRole,
        month: selectedMonth || "",
        class_id: "",
        student_id: ""
      };

      if (userRole === constants.roles.director || userRole === constants.roles.officeStaff) {
        params.class_id = selectedClass || "";
      } else if (userRole === constants.roles.teacher) {
        params.class_id = yearLevelID || "";
      } else if (userRole === constants.roles.guardian) {
        params.student_id = studentID || "";
      } else if (userRole === constants.roles.student) {
        params.student_id = userID || "";
      }

      const data = await fetchUnpaidFees(params);
      setUnpaidFees(data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching unpaid fees:", err.response?.data || err.message);
      setError("Failed to load unpaid fees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getYearLevels();
  }, []);

  useEffect(() => {
    loadUnpaidFees();
  }, [selectedMonth, selectedClass]);

  const resetFilters = () => {
    setSelectedMonth("");
    setSelectedClass("");
    setSearchTerm("");
  };

  const filteredFees = unpaidFees.filter((item) =>
    item.student?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              loadUnpaidFees();
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-4">
            <i className="fa-solid fa-graduation-cap mr-2"></i> Unpaid Accounts Summary
          </h1>
        </div>

        {/* Filter Section */}
        <div className="w-full max-w-5xl mx-auto">
          <div className="flex flex-wrap justify-center items-end gap-4 mb-6">
            {/* Month Filter (static) */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Filter by Month:</label>
              <select
                className="border rounded px-3 py-2 text-sm"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option value="">All Months</option>
                {[
                  "January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"
                ].map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            {/* Class Filter (Director/Office Staff only) */}
            {(userRole === constants.roles.director || userRole === constants.roles.officeStaff) && (
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Filter by Class:</label>
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
            )}

            {/* Search Filter */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Search Student by Name:</label>
              <input
                type="text"
                placeholder="Enter student name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded px-3 py-2 text-sm w-64"
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
                <th className="px-4 py-3 text-left whitespace-nowrap">Fee Type</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">Total Amount</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">Paid Amount</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">Due Amount</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredFees.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-6 text-gray-500">
                    No data found.
                  </td>
                </tr>
              ) : (
                filteredFees.map((item, index) =>
                  item.year_level_fees_grouped?.map((group) =>
                    group.fees?.map((fee) => (
                      <tr key={`${item.id}-${group.year_level}-${fee.id}`} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{index + 1}</td>
                        <td className="px-4 py-3">{item.student?.name}</td>
                        <td className="px-4 py-3">{group.year_level}</td>
                        <td className="px-4 py-3">{item.month}</td>
                        <td className="px-4 py-3">{fee.fee_type}</td>
                        <td className="px-4 py-3">₹{fee.amount}</td>
                        <td className="px-4 py-3">₹{item.paid_amount}</td>
                        <td className="px-4 py-3">₹{item.due_amount}</td>
                        <td className="px-4 py-3">{item.payment_status}</td>
                      </tr>
                    ))
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UnpaidFeesList;








