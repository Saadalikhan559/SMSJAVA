import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchStudentYearLevelByClass } from "../../services/api/Api";

const AllStudentsPerClass = () => {
  const { levelName } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('level name', levelName);
  
  const getStudents = async () => {
    try {
      const data = await fetchStudentYearLevelByClass(levelName);
      setStudents(data);
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Failed to fetch students.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStudents();
  }, [levelName]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <i className="fa-solid fa-spinner fa-spin text-4xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5 bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-screen-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          <i className="fa-solid fa-graduation-cap mr-2"></i> Students in {levelName}
        </h1>

        {error && (
          <div className="text-red-600 text-center mb-4 font-medium">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bgTheme text-white">
              <tr>
                <th scope="col" className="px-4 py-3 text-left">S.NO</th>
                <th scope="col" className="px-4 py-3 text-left">Student Name</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="2" className="text-center py-6 text-gray-500">
                    No students found.
                  </td>
                </tr>
              ) : (
                students.map((record, index) => (
                  <tr key={record.id || index} className="hover:bg-blue-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">
                      {record.student_name || "Unnamed"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllStudentsPerClass;
