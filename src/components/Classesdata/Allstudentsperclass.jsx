import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { fetchStudentYearLevelByClass } from "../../services/api/Api";
import { Link } from "react-router-dom";

const AllStudentsPerClass = () => {
  const { id } = useParams();
  const location = useLocation();

  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const levelName = location.state?.level_name || "Unknown";

  const getStudents = async () => {
    try {
      const data = await fetchStudentYearLevelByClass(id);
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
  }, [id]);

  const filteredStudents = students.filter((student) =>
    student.student_name?.toLowerCase().includes(searchTerm.toLowerCase())

  );

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


        <div className="mb-4">
          <input
            type="text"
            placeholder="Search Student Name "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"

          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bgTheme text-white">
              <tr>
                <th scope="col" className="px-4 py-3 text-left">S.NO</th>
                <th scope="col" className="px-4 py-3 text-left">Student Name</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="2" className="text-center py-6 text-red-500">
                    No students found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((record, index) => (
                  <tr key={record.id || index} className="hover:bg-blue-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/Studentdetails/${record.student_id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {record.student_name || "Unnamed"}
                      </Link>
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


