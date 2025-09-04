import React, { useEffect, useState } from "react";
import { fetchViewDocuments, fetchTeacherYearLevel } from "../../services/api/Api";
import { Link } from "react-router-dom";
import { constants } from "../../global/constants";

export const ViewDocuments = () => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedClass, setSelectedClass] = useState("All");
  const [teacherClasses, setTeacherClasses] = useState([]);
  const [viewOption, setViewOption] = useState("my"); // 'my' or 'assigned'

  // Logged-in user info
  const studentId = localStorage.getItem("studentId");
  const guardianId = localStorage.getItem("guardianId");
  const teacherId = localStorage.getItem("teacherId");
  const officeStaffId = localStorage.getItem("officeStaffId");
  const userRole = localStorage.getItem("userRole");

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

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl  mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-2">
          <i className="fa-solid fa-folder-open"></i> Uploaded Documents
        </h2>

        {/* Teacher options */}
        {userRole === "teacher" && (
          <div className="mb-4 flex gap-4 items-center">
            <div>
              <select
                value={viewOption}
                onChange={(e) => setViewOption(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="my">My Documents</option>
                <option value="assigned">Assigned Class Documents</option>
              </select>
            </div>
          </div>
        )}

        {/* Admin filters */}
        {userRole !== "student" && userRole !== "guardian" && userRole !== "teacher" && userRole !== "officestaff" && (
          <div className="mb-4 flex gap-4">
            <div>
              <select
                value={selectedRole}
                onChange={e => {
                  setSelectedRole(e.target.value);
                  setSelectedClass("All");
                }}
                className="select select-bordered w-full focus:outline-none"
              >
                <option value="All">Select Role</option>
                <option value="Student">Student</option>
                <option value="Guardian">Guardian</option>
                <option value="Office Staff">Office Staff</option>
                <option value="Teacher">Teacher</option>
              </select>
            </div>
            {selectedRole === "Student" && (
              <div>
                <label className="mr-2 font-medium">Filter by Class:</label>
                <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="border p-2 rounded">
                  {allClasses.map((cls, idx) => <option key={idx} value={cls}>{cls}</option>)}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow-sm rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bgTheme text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Role</th>
                    {userRole !== "student" && selectedRole === "Student" && <th className="px-4 py-3 text-left text-sm font-semibold">Class</th>}
                    {allDocTypes.map(type => (
                      <th key={type} className="px-4 py-3 text-left text-sm font-semibold text-nowrap capitalize">{type}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className=" divide-gray-200 bg-white">
                  {filteredData.map((person, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700 text-nowrap">{person.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 text-nowrap">{person.role}</td>
                      {userRole !== "student" && selectedRole === "Student" && <td className="px-4 py-3 text-sm text-gray-700 text-nowrap">{person.yearLevel || "-"}</td>}
                      {allDocTypes.map(type => (
                        <td key={type} className="px-4 py-3 text-sm text-blue-700">
                          {person.docs[type] ? person.docs[type].map((url, i) => (
                            <div key={i} className="max-w-[150px] truncate">
                              <Link to={url} target="_blank" rel="noreferrer" className="underline textTheme hover:text-blue-800 truncate block" title={url.split("/").pop()}>
                                {url.split("/").pop()}
                              </Link>
                            </div>
                          )) : "-"}
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
