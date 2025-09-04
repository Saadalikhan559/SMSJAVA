import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchOfficeStaff, fetchTeachers } from "../../services/api/Api";
import { Loader } from "../../global/Loader";

const AllStaff = () => {
  const [officestaff, setofficestaff] = useState([]);
  const [teachers, setteachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teacherSearch, setTeacherSearch] = useState("");
  const [staffSearch, setStaffSearch] = useState("");
  const [activeTab, setActiveTab] = useState("teachers");

  const getofficestaff = async () => {
    setLoading(true);
    try {
      const data = await fetchOfficeStaff();
      setofficestaff(data);
    } catch (err) {
      setError("Failed to fetch office staff. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getteachers = async () => {
    setLoading(true);
    try {
      const data = await fetchTeachers();
      setteachers(data);
    } catch (err) {
      setError("Failed to fetch teachers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filteredTeachers = teachers.filter((teacher) => {
    const fullName = [teacher.first_name, teacher.middle_name, teacher.last_name]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return fullName.includes(teacherSearch.toLowerCase());
  });

  const filteredOfficeStaff = officestaff.filter((staff) => {
    const fullName = [staff.first_name, staff.middle_name, staff.last_name]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return fullName.includes(staffSearch.toLowerCase());
  });

  useEffect(() => {
    getofficestaff();
    getteachers();
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

  return (
    <div className="min-h-screen p-5 bg-gray-50 ">
      {error && (
        <div className="text-red-600 text-center mb-4 font-medium">{error}</div>
      )}

      {/* tab */}

      

      {/* Content */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="">
        <button
          onClick={() => setActiveTab("teachers")}
          className={`px-6 py-2 font-semibold rounded-t-lg border-b-2 ${activeTab === "teachers"
            ? "border-[#5E35B1] textTheme"
            : "border-transparent text-gray-600 hover:text-[#5E35B1]"
            }`}
        >
          <i className="fa-solid fa-person-chalkboard mr-2 text-3xl"></i> Teachers
        </button>
        <button
          onClick={() => setActiveTab("staff")}
          className={`px-6 py-2 font-semibold rounded-t-lg border-b-2 ${activeTab === "staff"
            ? "border-[#5E35B1] textTheme"
            : "border-transparent text-gray-600 hover:text-[#5E35B1]"
            }`}
        >
          <i className="fa-solid fa-clipboard-user mr-2 text-3xl"></i> Office Staff
        </button>
      </div>
        {activeTab === "teachers" && (
          <>
            <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-4">
            <i className="fa-solid fa-person-chalkboard mr-2 text-3xl"></i> Teachers
          </h1>
        </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-4 mb-6 border-b pb-2">
              <input
                type="text"
                placeholder="Search Teacher Name"
                value={teacherSearch}
                onChange={(e) => setTeacherSearch(e.target.value)}
                className="border px-3 py-2 rounded w-full sm:w-64"


              />
            </div>
            <table className="min-w-full table-auto border border-gray-300 rounded-lg overflow-hidden">
              <thead className="bgTheme text-white text-center">
                <tr>
                  <th className="px-4 py-3">S.NO</th>
                  <th className="px-4 py-3">Name</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachers.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="text-center py-6 text-red-600">
                      No data found.
                    </td>
                  </tr>
                ) : (
                  filteredTeachers.map((record, index) => (
                    <tr
                      key={record.id || index}
                      className="hover:bg-gray-50 text-center"
                    >
                      <td className="px-4 py-3 text-gray-700">{index + 1}.</td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/staffDetail/teacher/${record.id}`}
                          state={{ level_name: record.level_name }}
                          className="textTheme hover:underline"
                        >
                          {[record.first_name, record.middle_name, record.last_name]
                            .filter(Boolean)
                            .join(" ")}
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </>
        )}

        {activeTab === "staff" && (
          <>
          <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-4">
           <i className="fa-solid fa-clipboard-user mr-2 text-3xl"></i> Office Staff
          </h1>
        </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-4 mb-6 border-b pb-2">

              
              <input
                type="text"
                placeholder="Search Staff Member Name"
                value={staffSearch}
                onChange={(e) => setStaffSearch(e.target.value)}
                className="border px-3 py-2 rounded w-full sm:w-64"


                />
              </div>
              <table className="min-w-full table-auto border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bgTheme text-white text-center">

                  <tr>
                    <th className="px-4 py-3">S.NO</th>
                    <th className="px-4 py-3">Name</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeachers.length === 0 ? (
                    <tr>
                      <td colSpan="2" className="text-center py-6 text-red-600">
                        No data found.
                      </td>
                    </tr>
                  ) : (
                    filteredTeachers.map((record, index) => (
                      <tr
                        key={record.id || index}
                        className="hover:bg-gray-50 text-center"
                      >
                        <td className="px-4 py-3 text-gray-700">{index + 1}.</td>
                        <td className="px-4 py-3">
                          <Link
                            to={`/staffDetail/teacher/${record.id}`}
                            state={{ level_name: record.level_name }}
                            className="textTheme hover:underline"
                          >
                            {[record.first_name, record.middle_name, record.last_name]
                              .filter(Boolean)
                              .join(" ")}
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </>
          )}

          {/* {activeTab === "staff" && (
            <>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b pb-2">

                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 flex items-center gap-2">

                  <i className="fa-solid fa-clipboard-user mr-2 text-3xl"></i> Office Staff
                </h2><br />
                <input
                  type="text"
                  placeholder="Search Staff Member Name"
                  value={staffSearch}
                  onChange={(e) => setStaffSearch(e.target.value)}
                  className="border px-3 py-2 rounded w-full sm:w-64"


                />
              </div>
              <table className="min-w-full table-auto border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bgTheme text-white text-center"> */}

        {activeTab === "staff" && (
          <>
          <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-4">
           <i className="fa-solid fa-clipboard-user mr-2 text-3xl"></i> Office Staff
          </h1>
        </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-4 mb-6 border-b pb-2">

              
              <input
                type="text"
                placeholder="Search Staff Member Name"
                value={staffSearch}
                onChange={(e) => setStaffSearch(e.target.value)}
                className="border px-3 py-2 rounded w-full sm:w-64"


              />
            </div>
            <table className="min-w-full table-auto border border-gray-300 rounded-lg overflow-hidden">
              <thead className="bgTheme text-white text-center">
                <tr>
                  <th className="px-4 py-3">S.NO</th>
                  <th className="px-4 py-3">Name</th>
                </tr>
              </thead>
              <tbody>
                {/* {filteredOfficeStaff.length === 0 ? (

                  <tr>
                    <th className="px-4 py-3">S.NO</th>
                    <th className="px-4 py-3">Name</th>
                  </tr>
                </thead>
                <tbody> */}
                  {filteredOfficeStaff.length === 0 ? (
                    <tr>
                      <td colSpan="2" className="text-center py-6 text-red-600">
                        No data found.
                      </td>
                    </tr>
                  ) : (
                    filteredOfficeStaff.map((record, index) => (
                      <tr
                        key={record.id || index}
                        className="hover:bg-gray-50 text-center"
                      >
                        <td className="px-4 py-3 text-gray-700">{index + 1}.</td>
                        <td className="px-4 py-3">
                          <Link
                            to={`/staffDetail/office/${record.id}`}
                            state={{ level_name: record.level_name }}
                            className="textTheme hover:underline"
                          >
                            {[record.first_name, record.middle_name, record.last_name]
                              .filter(Boolean)
                              .join(" ")}
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    
  );
};

export default AllStaff;
