import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAttendance } from '../../services/api/Api';

const StudentAttendance = () => {
  const { student_id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getAttendance = async () => {
      try {
        const res = await fetchAttendance(student_id);
        setData(res);
      } catch (err) {
        setError("Failed to fetch attendance data.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    getAttendance();
  }, [student_id]);

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-screen overflow-x-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          <i className="fa-solid fa-chalkboard-user ml-2" />My Attendance Report
        </h1>

        {loading ? (
          <div className="flex justify-center items-center text-gray-600 py-10">
            Loading Attendance...
          </div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : !data ? (
          <div className="text-center text-gray-600">No data found.</div>
        ) : (
          <table className="min-w-full table-auto rounded-lg overflow-hidden">
            <thead className="bgTheme text-white">
              <tr>
                <th className="px-4 py-3 text-left whitespace-nowrap font-semibold">Name</th>
                <th className="px-4 py-3 text-left whitespace-nowrap font-semibold">Student ID</th>
                <th className="px-4 py-3 text-left whitespace-nowrap font-semibold">Total Days</th>
                <th className="px-4 py-3 text-left whitespace-nowrap font-semibold">Present Days</th>
                <th className="px-4 py-3 text-left whitespace-nowrap font-semibold">Absent Days</th>
                <th className="px-4 py-3 text-left whitespace-nowrap font-semibold">Percentage</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-blue-50 transition">
                <td className="px-4 py-3 text-sm text-center text-gray-700">{data.name || ""}</td>
                <td className="px-4 py-3 text-sm text-center text-gray-700">{data.student_id || ""}</td>
                <td className="px-4 py-3 text-sm text-center text-gray-700">{data.total_days || ""}</td>
                <td className="px-4 py-3 text-sm text-center text-gray-700">{data.present_days || ""}</td>
                <td className="px-4 py-3 text-sm text-center text-gray-700">{data.absent_days || ""}</td>
                <td className="px-4 py-3 text-sm text-center text-gray-700">{data.percentage || ""}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StudentAttendance;
