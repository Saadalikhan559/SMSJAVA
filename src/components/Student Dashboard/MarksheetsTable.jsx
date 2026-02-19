import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { allRouterLink } from "../../router/AllRouterLinks";
import { constants } from "../../global/constants";

const MarksheetsTable = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [yearLevels, setYearLevels] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [marksheet, setMarksheet] = useState([]);
  const { axiosInstance } = useContext(AuthContext);
  const userRole = localStorage.getItem("userRole");
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reopenDate, setReopenDate] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [schoolYears, setSchoolYears] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ✅ Toast notification state
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // ✅ Show toast function
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  // Fetch marksheets
  const getMarksheet = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await axiosInstance.get(`/d/report-cards/`);
      setMarksheet(response.data || []);
    } catch (err) {
      console.error("Failed to load marksheet:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Fetch classes
  const getYearLevels = async () => {
    try {
      const response = await axiosInstance.get("/d/year-levels/");
      setYearLevels(response.data || []);
    } catch (err) {
      console.error("Error fetching year levels:", err);
    }
  };

  const getSchoolYears = async () => {
    try {
      const response = await axiosInstance.get("/d/school-years/");
      setSchoolYears(response.data || []);
    } catch (err) {
      console.error("Error fetching school years:", err);
    }
  };

  useEffect(() => {
    getYearLevels();
    getMarksheet();
    getSchoolYears();
  }, []);

  // Filters
  const filteredData = marksheet.filter((detail) => {
    const classMatch =
      selectedClass === "" ||
      (detail.class &&
        detail.class.toLowerCase().includes(selectedClass.toLowerCase()));

    const nameMatch =
      searchInput === "" ||
      (detail.student_name &&
        detail.student_name.toLowerCase().includes(searchInput.toLowerCase()));

    return classMatch && nameMatch;
  });

  const handleBulkReopenDate = async () => {
    if (!reopenDate || !selectedYear || selectedLevels.length === 0) {
      showToast("Please fill all fields", "error");
      return;
    }

    const payload = {
      school_reopen_date: reopenDate,
      year_id: Number(selectedYear),
      level_ids: selectedLevels,
    };

    try {
      setSubmitting(true);

      await axiosInstance.put(
        "/d/report-cards/bulk-update-school-reopen-date/",
        payload
      );

      setIsModalOpen(false);
      setReopenDate("");
      setSelectedYear("");
      setSelectedLevels([]);

      showToast("Reopening date updated successfully", "success");
      getMarksheet();
    } catch (err) {
      console.error("Bulk reopen date failed:", err);
      showToast("Failed to update reopening date", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const allLevelIds = yearLevels.map((l) => l.id);

  const isAllSelected =
    selectedLevels.length === allLevelIds.length && allLevelIds.length > 0;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedLevels([]);
    } else {
      setSelectedLevels(allLevelIds);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce [animation-delay:-0.2s]"></div>
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce [animation-delay:-0.4s]"></div>
        </div>
        <p className="mt-2 text-gray-500 dark:text-gray-300 text-sm">
          Loading data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
        <i className="fa-solid fa-triangle-exclamation text-5xl text-red-400 mb-4"></i>
        <p className="text-lg text-red-400 font-medium">
          Failed to load data, Try Again
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen mb-24 md:mb-10">
      {/* ✅ Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-5 right-5 z-[100] px-6 py-3 rounded-lg shadow-lg text-white flex items-center gap-2 animate-fade-in ${toast.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
        >
          <i
            className={`fa-solid ${toast.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"
              }`}
          ></i>
          <span>{toast.message}</span>
          <button
            onClick={() => setToast({ show: false, message: "", type: "" })}
            className="ml-2 hover:opacity-80"
          >
            ✕
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white text-center mb-4">
          Marksheets <i className="fa-solid fa-address-card ml-2"></i>
        </h1>

        <div className="flex flex-wrap justify-between items-end gap-4 mb-4 w-full border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="w-full sm:w-xs">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select Class:
            </label>
            <select
              className="select select-bordered w-full focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">All Classes</option>
              {yearLevels.map((level) => (
                <option key={level.id} value={level.level_name}>
                  {level.level_name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <div className="flex flex-col w-full sm:w-auto">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search Name:
              </label>

              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Search Student Name..."
                  className="border px-3 py-2 rounded w-full sm:w-64 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value.trimStart())}
                />

                <button
                  className="btn bgTheme text-white whitespace-nowrap"
                  onClick={() => setIsModalOpen(true)}
                >
                  Assign Reopening Date
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto max-h-[70vh] rounded-lg">
          <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
            <thead className="bgTheme text-white sticky top-0 z-2">
              <tr>
                <th className="px-4 py-3 text-left text-nowrap text-sm font-semibold">
                  Student Name
                </th>
                <th className="px-4 py-3 text-left text-nowrap text-sm font-semibold">
                  Father's Name
                </th>
                <th className="px-4 py-3 text-left text-nowrap text-sm font-semibold">
                  Date of Birth
                </th>
                <th className="px-4 py-3 text-left text-nowrap text-sm font-semibold">
                  Contact Number
                </th>
                <th className="px-4 py-3 text-left text-nowrap text-sm font-semibold">
                  Class
                </th>
                <th className="px-4 py-3 text-left text-nowrap text-sm font-semibold">
                  Academic Year
                </th>
                <th className="px-4 py-3 text-center text-nowrap text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-6 text-gray-500 dark:text-gray-300"
                  >
                    No marksheet data available
                  </td>
                </tr>
              ) : (
                filteredData.map((detail) => (
                  <tr
                    key={detail.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="whitespace-nowrap text-nowrap px-4 py-3 text-sm font-bold text-gray-900 dark:text-gray-200">
                      {detail.student_name || "—"}
                    </td>
                    <td className="whitespace-nowrap text-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
                      {detail.father_name || "—"}
                    </td>
                    <td className="whitespace-nowrap text-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
                      {detail.date_of_birth || "—"}
                    </td>
                    <td className="whitespace-nowrap text-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
                      {detail.contact_number || "—"}
                    </td>
                    <td className="whitespace-nowrap text-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
                      {detail.class || "—"}
                    </td>
                    <td className="whitespace-nowrap text-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
                      {detail.academic_year || "—"}
                    </td>
                    <td className="whitespace-nowrap text-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
                      <div className="flex items-center space-x-2 justify-center">
                        <Link
                          to={`/Marksheet/${detail.id}`}
                          className="inline-flex items-center px-3 py-1 border border-[#5E35B1] rounded-md shadow-sm text-sm font-medium textTheme bg-blue-50 hover:bg-blue-100"
                        >
                          View
                        </Link>

                        <Link
                          to={`/update-marksheet/${detail.id}`}
                          className="inline-flex items-center px-3 py-1 border border-yellow-300 rounded-md shadow-sm text-sm font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Reopening Date Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                    Assign School Reopening Date
                  </h2>
                  <button
                    className="text-gray-400 hover:text-red-500"
                    onClick={() => setIsModalOpen(false)}
                  >
                    ✕
                  </button>
                </div>

                <div className="mb-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Assign Reopening Date
                  </label>
                  <input
                    type="date"
                    className="input input-bordered w-full mt-1 dark:bg-gray-700 dark:text-white"
                    value={reopenDate}
                    onChange={(e) => setReopenDate(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Academic Year
                  </label>
                  <select
                    className="select select-bordered w-full mt-1 dark:bg-gray-700 dark:text-white"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    <option value="">Select Year</option>
                    {schoolYears.map((year) => (
                      <option key={year.id} value={year.id}>
                        {year.year_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Classes
                    </label>
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      className="text-xs font-semibold textTheme hover:underline"
                    >
                      {isAllSelected ? "Deselect All" : "Select All"}
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {yearLevels.map((level) => (
                      <label
                        key={level.id}
                        className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                      >
                        <input
                          type="checkbox"
                          checked={selectedLevels.includes(level.id)}
                          onChange={() => {
                            setSelectedLevels((prev) =>
                              prev.includes(level.id)
                                ? prev.filter((x) => x !== level.id)
                                : [...prev, level.id]
                            );
                          }}
                        />
                        {level.level_name}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    className="btn btn-outline"
                    onClick={() => setIsModalOpen(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn bgTheme text-white"
                    disabled={submitting}
                    onClick={handleBulkReopenDate}
                  >
                    {submitting ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ✅ Delete Confirmation Modal */}
          {deleteModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-sm p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <i className="fa-solid fa-trash text-red-500"></i>
                  </div>
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                    Delete Marksheet
                  </h2>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                  Are you sure you want to delete this marksheet? This action
                  cannot be undone.
                </p>

                <div className="flex justify-end gap-2">
                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      setDeleteModalOpen(false);
                      setDeleteId(null);
                    }}
                    disabled={deleting}
                  >
                    Cancel
                  </button>

                  <button
                    className="btn bg-red-500 hover:bg-red-600 text-white"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {deleting ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarksheetsTable;
