import React, { useEffect, useState, useContext } from "react";
import { fetchUnpaidFees, fetchYearLevels, sendDueFeeNotifications } from "../../services/api/Api";
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
  const [notifications, setNotifications] = useState([]);
  const [loder, setLoder] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

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

  // Send notification function
  const handleSendNotifications = async () => {
    try {
      setLoder(true);
      const response = await sendDueFeeNotifications();
      setNotifications(response.notifications || []);
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
    <div className="min-h-screen p-5 bg-gray-50">
      <div className="bg-white max-w-7xl p-6 rounded-lg shadow-lg  mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-4">
            <i className="fa-solid fa-graduation-cap mr-2"></i> Unpaid Accounts Summary
          </h1>
        </div>
        {/* Filter Section */}
        <div className="w-full px-5">
          <div className="flex flex-wrap justify-between items-end gap-4 mb-6 w-full border-b pb-4">

            {/* Left Side: Filters + Reset */}
            <div className="flex flex-wrap items-end gap-4 w-full sm:w-auto">
              {/* Month Filter */}
              <div className="flex flex-col w-full sm:w-auto">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Search by Month:
                </label>
                <select
                  className="select select-bordered w-full focus:outline-none"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  <option value="">All Months</option>
                  {[
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                  ].map((month) => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>

              {/* Class Filter (Director/Office Staff only) */}
              {(userRole === constants.roles.director || userRole === constants.roles.officeStaff) && (
                <div className="flex flex-col w-full sm:w-auto">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Search by Class:
                  </label>
                  <select
                    className="select select-bordered w-full focus:outline-none"
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

              {/* Reset Button */}
              <div className="mt-1 w-full sm:w-auto">
                <button
                  onClick={resetFilters}
                  className="bgTheme text-white text-sm px-5 py-2 rounded font-semibold h-10 w-full sm:w-auto"
                >
                  Reset Filters
                </button>
              </div>
            </div>

            {/* Right Side: Search Bar */}
            <div className="flex items-end gap-2 w-full sm:w-auto justify-end">
              <div className="flex flex-col w-full sm:w-auto">
                <label className="text-sm font-medium text-gray-700 mb-1"></label>
                <input
                  type="text"
                  placeholder="Enter student name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border px-3 py-2 rounded w-full sm:w-64"
                />
              </div>
              <button
                onClick={handleSendNotifications}
                className="bgTheme text-white text-sm px-5 py-2 rounded font-semibold h-10 min-w-[120px] flex items-center justify-center"
              >
                {loder  ? (
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
        <div className="overflow-x-auto max-h-[70vh]">
          <table className="min-w-full table-auto  rounded-lg">
            <thead className="bgTheme text-white z-2 sticky top-0">
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
                        <td className="px-4 py-3 text-nowrap">{item.student?.name}</td>
                        <td className="px-4 py-3 text-nowrap">{group.year_level}</td>
                        <td className="px-4 py-3">{item.month}</td>
                        <td className="px-4 py-3 text-nowrap">{fee.fee_type}</td>
                        <td className="px-4 py-3">₹{fee.amount}</td>
                        <td className="px-4 py-3">₹{item.paid_amount}</td>
                        <td className="px-4 py-3">₹{item.due_amount}</td>
                        <td className="inline-flex items-center px-3 py-1 rounded-md shadow-sm text-sm font-medium bg-red-100 text-red-600 m-2">{item.payment_status}</td>
                      </tr>
                    ))
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal */}
      {showModal && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg"> Notification</h3>
            <p className="py-4 whitespace-pre-line">{modalMessage}</p>
            <div className="modal-action">
              <button
                className="btn bgTheme text-white w-32"
                onClick={() => setShowModal(false)}
              >
                OK
              </button>
            </div>
          </div>
        </dialog>
      )}

    </div>
  );
};

export default UnpaidFeesList;








