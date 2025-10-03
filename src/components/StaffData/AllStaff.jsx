import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchOfficeStaff, fetchTeachers } from "../../services/api/Api";

const AllStaff = () => {
  const [officestaff, setofficestaff] = useState([]);
  const [teachers, setteachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teacherSearch, setTeacherSearch] = useState("");
  const [staffSearch, setStaffSearch] = useState("");
  const [activeTab, setActiveTab] = useState("teachers");

  // Helper function to get full name for sorting
  const getFullName = (record) => {
    return [record.first_name, record.middle_name, record.last_name]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
  };

  // Helper function to sort alphabetically by name
  const sortByName = (a, b) => {
    return getFullName(a).localeCompare(getFullName(b));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [teacherData, officeData] = await Promise.all([
          fetchTeachers(),
          fetchOfficeStaff(),
        ]);
        
        // Sort both arrays alphabetically by name
        const sortedTeachers = teacherData.sort(sortByName);
        const sortedOfficeStaff = officeData.sort(sortByName);

        setteachers(sortedTeachers);
        setofficestaff(sortedOfficeStaff);
      } catch (err) {
        setError("Failed to fetch staff data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredTeachers = teachers.filter((teacher) =>
    getFullName(teacher).includes(teacherSearch.toLowerCase())
  );

  const filteredOfficeStaff = officestaff.filter((staff) =>
    getFullName(staff).includes(staffSearch.toLowerCase())
  );

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

  return (
    <div className="min-h-screen p-5 bg-gray-50 dark:bg-gray-900">
      {error && (
        <div className="text-red-600 text-center mb-4 font-medium dark:text-red-400">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        {/* Tabs */}
        <div className="flex gap-4 ">
          <button
            onClick={() => setActiveTab("teachers")}
            className={`px-6 py-2 font-semibold rounded-t-lg border-b-2 ${activeTab === "teachers"
              ? "border-[#5E35B1] textTheme"
              : "border-transparent text-gray-600 hover:text-[#5E35B1] dark:text-gray-300 dark:hover:text-[#9575cd]"
              }`}
          >
            <i className="fa-solid fa-person-chalkboard mr-2 text-3xl"></i> Teachers
          </button>
          <button
            onClick={() => setActiveTab("staff")}
            className={`px-6 py-2 font-semibold rounded-t-lg border-b-2 ${activeTab === "staff"
              ? "border-[#5E35B1] textTheme"
              : "border-transparent text-gray-600 hover:text-[#5E35B1] dark:text-gray-300 dark:hover:text-[#9575cd]"
              }`}
          >
            <i className="fa-solid fa-clipboard-user mr-2 text-3xl"></i> Office Staff
          </button>
        </div>

        {/* Teachers Tab */}
        {activeTab === "teachers" && (
          <>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 text-center mb-4">
              <i className="fa-solid fa-person-chalkboard mr-2 text-3xl"></i> Teachers
            </h1>
            <div className="flex justify-end mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
              <input
                type="text"
                placeholder="Search Teacher Name"
                value={teacherSearch}
                onChange={(e) => setTeacherSearch(e.target.value)}
                className="border px-3 py-2 rounded w-full sm:w-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0b0b0c] focus:border-[#0f0f10]"
              />
            </div>
            <div className="w-full overflow-x-auto max-h-[70vh] rounded-lg">
              <table className="min-w-full table-auto  rounded-lg">
                <thead className="bgTheme text-white text-center sticky top-0 z--10">
                  <tr>
                    <th className="px-4 py-3">S.NO</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Joined Date</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                  {filteredTeachers.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-6 text-red-600 dark:text-red-400">
                        No data found.
                      </td>
                    </tr>
                  ) : (
                    filteredTeachers.map((record, index) => (
                      <tr
                        key={record.id || index}
                        className="hover:bg-gray-100 dark:hover:bg-gray-700 text-center"
                      >
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{index + 1}</td>
                        <td className="px-4 py-3 capitalize dark:text-gray-100">
                          <Link
                            to={`/staffDetail/teacher/${record.id}`}
                            state={{ level_name: record.level_name }}
                            className="textTheme hover:underline"
                          >
                            {[record.first_name, record.middle_name, record.last_name].filter(Boolean).join(" ")}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{record.joining_date}</td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{record.is_active === true ? "Active" : "InActive"} </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Office Staff Tab */}
        {activeTab === "staff" && (
          <>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 text-center mb-4">
              <i className="fa-solid fa-clipboard-user mr-2 text-3xl"></i> Office Staff
            </h1>
            <div className="flex justify-end mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
              <input
                type="text"
                placeholder="Search Staff Member Name"
                value={staffSearch}
                onChange={(e) => setStaffSearch(e.target.value)}
                className="border px-3 py-2 rounded w-full sm:w-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#211f23] focus:border-[#252426]"
              />
            </div>
            <div className="w-full overflow-x-auto max-h-[70vh] rounded-lg">
              <table className="min-w-full table-auto  rounded-lg">
                <thead className="bgTheme text-white text-center sticky top-0 z--10">
                  <tr>
                    <th className="px-4 py-3">S.NO</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Joined Date</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                  {filteredOfficeStaff.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-6 text-red-600 dark:text-red-400">
                        No data found.
                      </td>
                    </tr>
                  ) : (
                    filteredOfficeStaff.map((record, index) => (
                      <tr
                        key={record.id || index}
                        className="hover:bg-gray-100 dark:hover:bg-gray-700 text-center"
                      >
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{index + 1}</td>
                        <td className="px-4 py-3 capitalize dark:text-gray-100 ">
                          <Link
                            to={`/staffDetail/office/${record.id}`}
                            state={{ level_name: record.level_name }}
                            className="textTheme hover:underline"
                          >
                            {[record.first_name, record.middle_name, record.last_name].filter(Boolean).join(" ")}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{record.date_joined}</td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{record.is_active === true ? "Active" : "InActive"} </td>
                      </tr>
                    ))
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

export default AllStaff;