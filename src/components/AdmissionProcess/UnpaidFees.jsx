import React, { useEffect, useState, useContext } from "react";
import { fetchYearLevels } from "../../services/api/Api";
import { AuthContext } from "../../context/AuthContext";
import { constants } from "../../global/constants";

const UnpaidFeesList = () => {
  const { userRole, yearLevelID, userID, studentID, axiosInstance } = useContext(AuthContext);

  const [unpaidFees, setUnpaidFees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [yearLevels, setYearLevels] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loder, setLoder] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Fetch year levels (external API, do not change)
  const getYearLevels = async () => {
    try {
      const data = await fetchYearLevels();
      setYearLevels(data);
    } catch (err) {
      console.error("Error fetching year levels:", err);
    }
  };

  // Fetch unpaid fees using axiosInstance
  const loadUnpaidFees = async () => {
    try {
      setLoading(true);

      let endpoint = "";
      let params = {};

      if (userRole === constants.roles.director || userRole === constants.roles.officeStaff) {
        endpoint = "/d/fee-record/overall_unpaid_fees/";
        if (selectedClass) params.class_id = selectedClass;
        if (selectedMonth) params.month = selectedMonth;
      } else if (userRole === constants.roles.teacher) {
        endpoint = "/d/fee-record/overall_unpaid_fees/";
        if (yearLevelID) params.class_id = yearLevelID;
        if (selectedMonth) params.month = selectedMonth;
      } else if (userRole === constants.roles.guardian) {
        endpoint = "/d/fee-record/student_unpaid_fees/";
        if (studentID) params.student_id = studentID;
      } else if (userRole === constants.roles.student) {
        endpoint = "/d/fee-record/student_unpaid_fees/";
        if (userID) params.student_id = userID;
      } else {
        throw new Error("Invalid role provided");
      }

      const response = await axiosInstance.get(endpoint, { params });
      let data = response.data;

      // Filter student if director/officeStaff and studentID is given
      if ((userRole === constants.roles.director || userRole === constants.roles.officeStaff) && studentID) {
        data = data.filter((fee) => fee.student_id === studentID);
      }

      setUnpaidFees(data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching unpaid fees:", err.response?.data || err.message);
      setError("Failed to load unpaid fees");
      setUnpaidFees([]);
    } finally {
      setLoading(false);
    }
  };

  // Send notification using axiosInstance (not external API)
  const handleSendNotifications = async () => {
    try {
      setLoder(true);
      const response = await axiosInstance.get("/d/fee-record/student_unpaid_fees/");
      setNotifications(response.data.notifications || []);
      setModalMessage(" WhatsApp notifications sent successfully!");
      setShowModal(true);
    } catch (err) {
      setModalMessage(" Failed to send notifications!");
      setShowModal(true);
    } finally {
      setLoder(false);
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

  const sortedFees = [...filteredFees].sort((a, b) => {
    const nameA = a.student?.name?.toLowerCase() || "";
    const nameB = b.student?.name?.toLowerCase() || "";
    return nameA.localeCompare(nameB);
  });

  const flattenedFees = sortedFees.flatMap((item) =>
    item.year_level_fees_grouped?.flatMap((group) =>
      group.fees.map((fee) => ({
        ...fee,
        studentName: item.student?.name,
        month: item.month,
        yearLevel: group.year_level,
        paidAmount: item.paid_amount,
        dueAmount: item.due_amount,
      }))
    )
  );


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
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
    <div className="min-h-screen p-5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="bg-white dark:bg-gray-800 max-w-7xl p-6 rounded-lg shadow-lg mx-auto">
        {/* Title */}
        <div className="mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-4">
            <i className="fa-solid fa-graduation-cap mr-2"></i> Overdue Accounts Summary
          </h1>
        </div>

        {/* Filter Section */}
        <div className="w-full px-5">
          <div className="flex flex-wrap justify-between items-end gap-4 mb-6 w-full border-b border-gray-300 dark:border-gray-700 pb-4">
            <div className="flex flex-wrap items-end gap-4 w-full sm:w-auto">
              {/* Month Filter */}
              <div className="flex flex-col w-full sm:w-auto">
                <label className="text-sm font-medium mb-1">Search by Month:</label>
                <select
                  className="select select-bordered w-full focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  <option value="">All Months</option>
                  {[
                    "January", "February", "March", "April", "May", "June", "July",
                    "August", "September", "October", "November", "December",
                  ].map((month) => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>

              {/* Class Filter (Director/Office Staff only) */}
              {(userRole === constants.roles.director || userRole === constants.roles.officeStaff) && (
                <div className="flex flex-col w-full sm:w-auto">
                  <label className="text-sm font-medium mb-1">Search by Class:</label>
                  <select
                    className="select select-bordered w-full focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    <option value="">All Classes</option>
                    {yearLevels.map((level) => (
                      <option key={level.id} value={level.id}>{level.level_name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Reset Button */}
              <div className="mt-1 w-full sm:w-auto">
                <button
                  onClick={resetFilters}
                  className="btn bgTheme text-white"
                >
                  Reset Filters
                </button>
              </div>
            </div>

            {/* Right Side: Search + Notification */}
            <div className="flex items-end gap-2 w-full sm:w-auto justify-end">
              <div className="flex flex-col w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Enter student name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value.trimStart())}
                  className="border px-3 py-2 rounded w-full sm:w-64 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ringTheme focus:outline-none"
                />
              </div>
              <button
                onClick={handleSendNotifications}
                className="btn bgTheme text-white"
              >
                {loder ? (
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                ) : (
                  <>
                    <i className="fa-solid fa-bell mr-2"></i> Reminder
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto rounded-lg no-scrollbar max-h-[70vh]">
          <table className="min-w-full table-auto divide-y divide-gray-300 dark:divide-gray-700">
            <thead className="bgTheme text-white sticky top-0 z-2">
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
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
              {flattenedFees.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-6 text-gray-500 dark:text-gray-400">
                    No data found.
                  </td>
                </tr>
              ) : (
                flattenedFees.map((item, index) => (
                  <tr key={`${item.id}-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 text-nowrap">{item.studentName}</td>
                    <td className="px-4 py-3 text-nowrap">{item.yearLevel}</td>
                    <td className="px-4 py-3">{item.month}</td>
                    <td className="px-4 py-3 text-nowrap">{item.fee_type}</td>
                    <td className="px-4 py-3">₹{item.amount}</td>
                    <td className="px-4 py-3">₹{item.paidAmount}</td>
                    <td className="px-4 py-3">₹{item.dueAmount}</td>
                    <td className={`inline-flex items-center px-3 py-1 rounded-md shadow-sm text-sm font-medium m-2 ${parseFloat(item.dueAmount) === 0
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                      }`}>
                      {parseFloat(item.dueAmount) === 0 ? "Paid" : "Unpaid"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <dialog className="modal modal-open">
          <div className="modal-box dark:bg-gray-800 dark:text-gray-100">
            <h3 className="font-bold text-lg"> Notification</h3>
            <p className="py-4 whitespace-pre-line">{modalMessage}</p>
            <div className="modal-action">
              <button className="btn bgTheme text-white w-32" onClick={() => setShowModal(false)}>OK</button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default UnpaidFeesList;