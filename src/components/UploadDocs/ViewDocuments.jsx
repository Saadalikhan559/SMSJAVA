import React, { useEffect, useState } from "react";
import { fetchViewDocuments } from "../../services/api/Api";
import { Link } from "react-router-dom";
import { constants } from "../../global/constants";
import { Loader } from "../../global/Loader";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
const BASE_URL = constants.baseUrl;


export const ViewDocuments = () => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedClass, setSelectedClass] = useState("All");
  const [teacherClasses, setTeacherClasses] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [viewOption, setViewOption] = useState("my"); // 'my' or 'assigned'
  const { axiosInstance } = useContext(AuthContext);


  // Logged-in user info
  const studentId = localStorage.getItem("studentId");
  const guardianId = localStorage.getItem("guardianId");
  const teacherId = localStorage.getItem("teacherId");
  const officeStaffId = localStorage.getItem("officeStaffId");
  const userRole = localStorage.getItem("userRole");




  const fetchTeacherYearLevel = async (teacherId) => {
    try {
      const response = await axiosInstance.get("/t/teacheryearlevel/");
      return response.data;
    } catch (error) {
      console.error("Error fetching teacher year level:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docs = await fetchViewDocuments();
        setDetails(docs);

        if (userRole === "teacher") {
          const classes = await fetchTeacherYearLevel(teacherId);
          setTeacherClasses(classes.map(c => c.year_level_name));
        }

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(true);
        setLoading(false);
      }
    };

    fetchData();
  }, [teacherId, userRole]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce [animation-delay:-0.2s]"></div>
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce [animation-delay:-0.4s]"></div>
        </div>
        <p className="mt-2 text-gray-500 text-sm">Loading documents...</p>
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

  if (!details || details.length === 0) {
    return <div className="p-4 text-center">No documents available.</div>;
  }

  const allDocTypes = [...new Set(details.flatMap(d => d.document_types_read.map(dt => dt.name.toLowerCase())))];

  const getRole = (doc) => {
    if (doc.student_id) return "Student";
    if (doc.guardian_id) return "Guardian";
    if (doc.office_staff_id) return "Office Staff";
    if (doc.teacher_id) return "Teacher";
    return "Unknown";
  };

  const grouped = {};
  details.forEach(doc => {
    const role = getRole(doc);
    const name = doc.student_name || doc.guardian_name || doc.office_staff_name || doc.teacher_name;
    const yearLevel = doc.year_level || "N/A";
    const key = `${role}-${name}-${yearLevel}`;

    if (!grouped[key]) grouped[key] = { name, role, yearLevel, docs: {} };

    doc.document_types_read.forEach(dt => {
      const type = dt.name.toLowerCase();
      grouped[key].docs[type] = doc.files.map(file =>
        file.file.replace("http://localhost:8000", `${constants.baseUrl}`)
      );
    });
  });

  const allClasses = ["All", ...new Set(details.filter(d => d.student_id && d.year_level).map(d => d.year_level))];

  // Filter data
  const filteredData = Object.values(grouped).filter(person => {
    if (userRole === "student") {
      return person.role === "Student" && details.some(d =>
        d.student_id && d.student_id.toString() === studentId && (d.student_name === person.name)
      );
    }

    if (userRole === "guardian") {
      return person.role === "Guardian" && details.some(d =>
        d.guardian_id && d.guardian_id.toString() === guardianId && (d.guardian_name === person.name)
      );
    }

    if (userRole === "teacher") {
      if (viewOption === "my") {
        return person.role === "Teacher" && details.some(d =>
          d.teacher_id && d.teacher_id.toString() === teacherId && (d.teacher_name === person.name)
        );
      } else if (viewOption === "assigned") {
        return person.role === "Student" && teacherClasses.includes(person.yearLevel);
      }
    }

    if (userRole === "officestaff") {
      return person.role === "Office Staff" && details.some(d =>
        d.office_staff_id && d.office_staff_id.toString() === officeStaffId && (d.office_staff_name === person.name)
      );
    }


    // Director/Admin
    const roleMatch = selectedRole === "All" || person.role === selectedRole;
    const classMatch = selectedRole === "Student" ? selectedClass === "All" || person.yearLevel === selectedClass : true;
    return roleMatch && classMatch;
  });
  console.log(filteredData);

  const filterBysearch = filteredData.filter((detail) =>
  (detail.name || "").toLowerCase().includes(searchInput.toLowerCase())
);


  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <div className="mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 text-center mb-4">
            <i className="fa-solid fa-folder-open"></i> Uploaded Documents
          </h1>
        </div>

        {/* Teacher options */}
        {userRole === "teacher" && (
          <div className="mb-4 flex gap-4 items-center border-b dark:border-gray-700 pb-2">
            <div>
              <select
                value={viewOption}
                onChange={(e) => setViewOption(e.target.value)}
                className="border p-2 rounded bg-white dark:bg-gray-700 dark:text-gray-200 focus:outline-none"
              >
                <option value="my">My Documents</option>
                <option value="assigned">Assigned Class Documents</option>
              </select>
            </div>
          </div>
        )}

        {/* Admin filters */}
        {userRole !== "student" &&
          userRole !== "guardian" &&
          userRole !== "teacher" &&
          userRole !== "officestaff" && (
            <div className="mb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b dark:border-gray-700 pb-4">
              {/* Role Selector */}
              <div className="flex flex-col w-full sm:w-1/4">
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-1">Select Role:</label>
                <select
                  value={selectedRole}
                  onChange={(e) => {
                    setSelectedRole(e.target.value);
                    setSelectedClass("All");
                  }}
                  className="select select-bordered w-full bg-white dark:bg-gray-700 dark:text-gray-200 focus:outline-none"
                >
                  <option value="All">Select Role</option>
                  <option value="Student">Student</option>
                  <option value="Guardian">Guardian</option>
                  <option value="Office Staff">Office Staff</option>
                  <option value="Teacher">Teacher</option>
                </select>
              </div>

              {/* Class Selector (only for Students) */}
              {selectedRole === "Student" && (
                <div className="flex flex-col w-full sm:w-1/4">
                  <label className="text-sm text-gray-700 dark:text-gray-300 mb-1">Select Class:</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="select select-bordered w-full bg-white dark:bg-gray-700 dark:text-gray-200 focus:outline-none"
                  >
                    {allClasses.map((cls, idx) => (
                      <option key={idx} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Search Input */}
              <div className="flex flex-col w-full sm:w-auto">
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-1">Search Name:</label>
                <input
                  type="text"
                  placeholder="Search Name..."
                  className="input input-bordered w-full focus:outline-none dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
            </div>

          )}

        {/* Table */}
        <div className="w-full overflow-x-auto rounded-lg no-scrollbar max-h-[70vh]">
          <div className="inline-block min-w-full align-middle">
            <div className="shadow-sm rounded-lg">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                <thead className="bgTheme text-white sticky top-0 z-2">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Role</th>
                    {userRole !== "student" && selectedRole === "Student" && (
                      <th className="px-4 py-3 text-left text-sm font-semibold">Class</th>
                    )}
                    {allDocTypes.map((type) => (
                      <th
                        key={type}
                        className="px-4 py-3 text-left text-sm font-semibold text-nowrap capitalize"
                      >
                        {type}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                  {[...filterBysearch]
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((person, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                      >
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 text-nowrap">
                          {person.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 text-nowrap">
                          {person.role}
                        </td>

                        {userRole !== "student" && selectedRole === "Student" && (
                          <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 text-nowrap">
                            {person.yearLevel || "-"}
                          </td>
                        )}

                        {allDocTypes.map((type) => (
                          <td
                            key={type}
                            className="px-4 py-3 text-sm text-blue-600 dark:text-blue-400"
                          >
                            {person.docs[type] && person.docs[type].length > 0 ? (
                              person.docs[type].map((url, i) => (
                                <div key={i}>
                                  <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline textTheme hover:text-blue-800 dark:hover:text-blue-200"
                                  >
                                    View
                                  </a>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-700 dark:text-gray-200 text-nowrap">Not Available</p>

                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                </tbody>

              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
