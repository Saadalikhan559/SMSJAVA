import React, { useEffect, useState } from "react";
import { fetchAdmissionDetails, fetchYearLevels } from "../../services/api/Api";
import { Link } from "react-router-dom";
import { allRouterLink } from "../../router/AllRouterLinks";


export const AdmissionDetails = () => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState("");
  const [yearLevels, setYearLevels] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [error, setError] = useState(false);

  const getAdmissionDetails = async () => {
    try {
      const data = await fetchAdmissionDetails();
      setDetails(data);
      setLoading(false);
    } catch (error) {
      console.log("failed to fetch admission details", error);
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAdmissionDetails();
  }, []);
  const getYearLevels = async () => {
    try {
      const data = await fetchYearLevels();
      setYearLevels(data);
    } catch (err) {
      console.error("Error fetching year levels:", err);
    }
  };

  useEffect(() => {
    getYearLevels();
  }, []);

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
        <p className="text-lg text-red-400 font-medium">
          Failed to load data, Try Again
        </p>
      </div>
    );
  }

  if (!details) {
    return <div className="p-4 text-center">No admission records found</div>;
  }

  const filterData = details.filter((detail) => {
    const matchesClass = detail.year_level
      .toLowerCase()
      .includes(selectedClass.toLowerCase());

    const matchesDate = selectedDate
      ? detail.admission_date === selectedDate
      : true;

    return matchesClass && matchesDate;
  });


  const filterBysearch = filterData.filter((detail) => {
    const search = searchInput.toLowerCase();
    const studentName = `${detail.student_input.first_name} ${detail.student_input.last_name}`.toLowerCase();
    const guardianName = `${detail.guardian_input.first_name} ${detail.guardian_input.last_name}`.toLowerCase();
    return studentName.includes(search) || guardianName.includes(search);
  });

  const resetFilters = () => {
    setSelectedMonth("");
    setSelectedClass("");
    setSearchTerm("");
  };

  const sortedData = [...filterBysearch].sort((a, b) => {
    const nameA = `${a.student_input.first_name} ${a.student_input.last_name}`.toLowerCase();
    const nameB = `${b.student_input.first_name} ${b.student_input.last_name}`.toLowerCase();
    return nameA.localeCompare(nameB);
  });
  console.log(sortedData);

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen mb-24 md:mb-10">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 text-center mb-4  border-gray-200 dark:border-gray-700">
            <i className="fa-solid fa-clipboard-list w-5"></i> Student Details
          </h1>
        </div>
        <div className="w-full px-5">
          <div className="flex flex-wrap justify-between items-end gap-4 mb-6 w-full border-b border-gray-300 dark:border-gray-700 pb-4">

            {/* Left Side: Filters */}
            <div className="flex flex-wrap items-end gap-4 w-full sm:w-auto">
              {/* Class Filter */}
              <div className="flex flex-col w-full sm:w-auto">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Search By Class:
                </label>
                <select
                  className="select select-bordered w-full focus:outline-none dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
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

              {/* Date Filter */}
              <div className="flex flex-col w-full sm:w-auto">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Search By Date:
                </label>
                <input
                  type="date"
                  className="input input-bordered w-full focus:outline-none dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              {/* Reset Button */}
              <div className="mt-1 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setSelectedClass("");
                    setSelectedDate("");
                    setSearchInput("");
                  }}
                  className="btn bgTheme text-white"
                >
                  Reset Filters
                </button>
              </div>
            </div>

            {/* Right Side: Search */}
            <div className="flex items-end gap-2 w-full sm:w-auto justify-end">
              <div className="flex flex-col w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Student Name or Guardian Name"
                  className="input input-bordered w-full sm:w-64 focus:outline-none dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value.trimStart())}
                />
              </div>
            </div>
          </div>
        </div>
        {filterData.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No admission records found.</p>
        ) : (
          <div className="overflow-x-auto no-scrollbar max-h-[70vh] rounded-lg">
            <div className="inline-block min-w-full align-middle rounded-lg">
              <div className="shadow-sm ring-1 ring-black ring-opacity-5 rounded-lg">
                <table className="min-w-full  divide-gray-300 dark:divide-gray-700">
                  <thead className="bgTheme text-white z-2 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Student Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Parent/Guardian</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Date of Birth</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Gender</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Class</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">RTE</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Admission Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                    {sortedData.length > 0 ? (
                      sortedData.map((detail) => (
                        <tr key={detail.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                          <td className="whitespace-nowrap text-nowrap font-bold px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                            {detail.student_input.first_name} {detail.student_input.last_name}
                          </td>
                          <td className="whitespace-nowrap text-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
                            {detail.guardian_input.first_name} {detail.guardian_input.last_name} ({detail.guardian_type || "N/A"})
                          </td>
                          <td className="whitespace-nowrap text-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
                            {detail.student_input.date_of_birth}
                          </td>
                          <td className="whitespace-nowrap text-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
                            {detail.student_input.gender}
                          </td>
                          <td className="whitespace-nowrap text-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
                            {detail.year_level}
                          </td>
                          <td className="whitespace-nowrap text-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
                            {detail.is_rte ? "Yes" : "No"}
                          </td>
                          <td className="whitespace-nowrap text-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
                            {new Date(detail.admission_date)
                              .toLocaleDateString("en-GB")
                              .replaceAll("/", "-")}
                          </td>
                          <td className="whitespace-nowrap text-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
                            {detail.student_input.is_active ? "Active" : "InActive"}
                          </td>
                          <td className="whitespace-nowrap text-nowrap px-4 py-3 text-sm">
                            <div className="flex space-x-2">
                              <Link
                                to={allRouterLink.editAddmisionDetails.replace(":id", detail.id)}
                                className="inline-flex items-center px-3 py-1 border border-yellow-300 rounded-md shadow-sm text-sm font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100"
                              >
                                Edit
                              </Link>
                              <Link
                                to={allRouterLink.addmissionDetailsById.replace(":id", detail.id)}
                                className="inline-flex items-center px-3 py-1 border border-[#5E35B1] rounded-md shadow-sm text-sm font-medium textTheme bg-blue-50 hover:bg-blue-100"
                              >
                                View
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="9"
                          className="text-center py-6 text-gray-500 dark:text-gray-400"
                        >
                          No data found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
