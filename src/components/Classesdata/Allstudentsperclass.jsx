import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { fetchStudentYearLevelByClass } from "../../services/api/Api";
import { Link } from "react-router-dom";
import { Loader } from "../../global/Loader";

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
        <p className="text-lg text-red-400 font-medium">Failed to load data, Try Again</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5 bg-gray-50">
      <div className="bg-white max-w-7xl p-6 rounded-lg shadow-lg mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center ">
            <i className="fa-solid fa-graduation-cap mr-2"></i> Students in {levelName}
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-4 mb-6 border-b pb-2">
      
         

          {error && (
            <div className="text-red-600 text-center mb-4 font-medium">
              {error}
            </div>
          )}


          <input
            type="text"
            placeholder="Search Student Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-3 py-2 rounded w-full sm:w-64"
          />

        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bgTheme text-white text-center">
              <tr>
                <th scope="col" className="px-4 py-3">S.NO</th>
                <th scope="col" className="px-4 py-3">Student Name</th>
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
                  <tr key={record.id || index} className="hover:bg-gray-50 textTheme text-center">
                    <td className="px-4 py-3 text-gray-700">{index + 1}.</td>
                    <td className="px-4 py-3 capitalize">
                      <Link
                        to={`/Studentdetails/${record.student_id}`}
                        className="textTheme hover:underline"
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


