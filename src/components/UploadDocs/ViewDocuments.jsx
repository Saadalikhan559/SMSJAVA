import React, { useEffect, useState } from "react";
import { fetchViewDocuments } from "../../services/api/Api";
import { Link } from "react-router-dom";
import { constants } from "../../global/constants";

export const ViewDocuments = () => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState("All"); 
  const [selectedClass, setSelectedClass] = useState("All"); 

  const getViewDocuments = async () => {
    try {
      const data = await fetchViewDocuments();
      setDetails(data);
      setLoading(false);
    } catch (error) {
      console.log("Failed to fetch documents", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getViewDocuments();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading documents...</div>;
  }

  if (!details || details.length === 0) {
    return <div className="p-4 text-center">No documents available.</div>;
  }

  const allDocTypes = [
    ...new Set(details.flatMap((d) => d.document_types_read.map((dt) => dt.name.toLowerCase())))
  ];

  const getRole = (doc) => {
    if (doc.student_id) return "Student";
    if (doc.guardian_id) return "Guardian";
    if (doc.office_staff_id) return "Office Staff";
    if (doc.teacher_id) return "Teacher";
    return "Unknown";
  };

  const grouped = {};
  details.forEach((doc) => {
    const role = getRole(doc);
    const name = doc.student_name || doc.guardian_name || doc.office_staff_name || doc.teacher_name;
    const yearLevel = doc.year_level || "N/A";
    const key = `${role}-${name}-${yearLevel}`;

    if (!grouped[key]) {
      grouped[key] = { name, role, yearLevel, docs: {} };
    }

    doc.document_types_read.forEach((dt) => {
      const type = dt.name.toLowerCase();
      grouped[key].docs[type] = doc.files.map((file) =>
        file.file.replace("http://localhost:8000", `${constants.baseUrl}`)
      );
    });
  });

  const allClasses = [
    "All",
    ...new Set(details.filter((d) => d.student_id && d.year_level).map((d) => d.year_level))
  ];

  // ✅ Filtering logic
  const filteredData = Object.values(grouped).filter((p) => {
    const roleMatch = selectedRole === "All" || p.role === selectedRole;
    const classMatch =
      selectedRole === "Student"
        ? selectedClass === "All" || p.yearLevel === selectedClass
        : true;
    return roleMatch && classMatch;
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-2">
          <i className="fa-solid fa-folder-open"></i> Uploaded Documents
        </h2>

        {/* 🔹 Filters */}
        <div className="mb-4 flex gap-4">
          {/* Role filter */}
          <div>
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setSelectedClass("All"); // reset class when role changes
              }}
              className="border p-2 rounded"
            >
              <option value="Select Role">Select Role</option>
              <option value="Student">Student</option>
              <option value="Guardian">Guardian</option>
              <option value="Office Staff">Office Staff</option>
              <option value="Teacher">Teacher</option>
            </select>
          </div>

          {/* Class filter only for Students */}
          {selectedRole === "Student" && (
            <div>
              <label className="mr-2 font-medium">Filter by Class:</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="border p-2 rounded"
              >
                {allClasses.map((cls, idx) => (
                  <option key={idx} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* 🔹 Table */}
        <div className="w-full overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bgTheme text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Role</th>
                    {selectedRole === "Student" && (
                      <th className="px-4 py-3 text-left text-sm font-semibold">Class</th>
                    )}
                    {allDocTypes.map((type) => (
                      <th
                        key={type}
                        className="px-4 py-3 text-left text-sm font-semibold text-nowrap"
                      >
                        {type}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredData.map((person, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700">{person.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{person.role}</td>
                      {selectedRole === "Student" && (
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {person.yearLevel || "-"}
                        </td>
                      )}
                      {allDocTypes.map((type) => (
                        <td key={type} className="px-4 py-3 text-sm text-blue-700">
                          {person.docs[type] ? (
                            person.docs[type].map((url, i) => (
                              <div key={i} className="max-w-[150px] truncate">
                                <Link
                                  to={url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="underline text-blue-600 hover:text-blue-800 truncate block"
                                  title={url.split("/").pop()}
                                >
                                  {url.split("/").pop()}
                                </Link>
                              </div>
                            ))
                          ) : (
                            "-"
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
