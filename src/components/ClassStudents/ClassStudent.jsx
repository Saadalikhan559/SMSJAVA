import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchStudentYearLevelByClass } from "../../services/api/Api";

const data = [
  {
    id: 1,
    student_name: "Jack Paul",
    level_name: "Nursery",
    year_name: "2025-2026",
  },
  {
    id: 2,
    student_name: "Saklen Khan",
    level_name: "Nursery",
    year_name: "2025-2026",
  },
  {
    id: 3,
    student_name: "Shad Khan",
    level_name: "Nursery",
    year_name: "2025-2026",
  },
];

export const ClassStudent = () => {
  const { classLevel } = useParams();
  const [classStudent, setClassStudent] = useState([]);
  console.log(classLevel, 'classlvel');   

  const getClassStudents = async () => {
    try {
      const data = await fetchStudentYearLevelByClass(classLevel);
      setClassStudent(data);
    } catch (error) {
      console.log("Failed to fetch students", error);
    }
  };

  useEffect(() => {
    getClassStudents();
  }, [classLevel]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-2">
          Students in {classLevel}
        </h2>

        {classStudent.length === 0 ? (
          <p className="text-gray-600">No students found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-300 rounded-lg overflow-hidden">
              <thead className="bgTheme text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Select</th>
                  <th className="px-4 py-3 text-left">Student Name</th>
                  <th className="px-4 py-3 text-left">Level</th>
                  <th className="px-4 py-3 text-left">Academic Year</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {classStudent.map((student) => (
                  <tr key={student.id}>
                    <td className="px-4 py-3">
                      {" "}
                      <input
                        type="checkbox"
                        className="border border-gray-300 rounded-md px-2 py-1 w-full"
                      />
                    </td>
                    <td className="px-4 py-3">{student.student_name}</td>
                    <td className="px-4 py-3">{student.level_name}</td>
                    <td className="px-4 py-3">{student.year_name}</td>
                    <td className="px-4 py-3">
                      <input
                        type="date"
                        className="border border-gray-300 rounded-md px-2 py-1 w-full"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <select className="border border-gray-300 rounded-md px-2 py-1 w-full">
                        <option value="">Select</option>
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="leave">Leave</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
