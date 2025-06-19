import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchStudentYearLevelByClass } from "../../services/api/Api";

export const ClassStudent = () => {
  const { classLevel } = useParams();
  const [classStudent, setClassStudent] = useState([]);

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
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bgTheme text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                        Select
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                        Student Name
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                        Level
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                        Academic Year
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                        Date
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                        Attendance
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {classStudent.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                          <input
                            type="checkbox"
                            className="border border-gray-300 rounded-md px-2 py-1"
                          />
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                          {student.student_name}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                          {student.level_name}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                          {student.year_name}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                          <input
                            type="date"
                            className="border border-gray-300 rounded-md px-2 py-1"
                          />
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                          <select className="border border-gray-300 rounded-md px-2 py-1">
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};