
import React, { useEffect, useState } from "react";
import { fetchPeriodsByYearLevel } from "../../services/api/Api";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const PeriodAssignment = () => {
  const { year_level_id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const levelName = location.state?.level_name || "Selected Class";

  const [assignedPeriods, setAssignedPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getPeriods = async () => {
      if (!year_level_id) return;

      setLoading(true);
      setError("");
      try {
        const data = await fetchPeriodsByYearLevel(year_level_id);
        setAssignedPeriods(data.assigned_periods || []);
      } catch (err) {
        console.error("Failed to fetch periods:", err);
        setAssignedPeriods([]);
        setError("Failed to fetch assigned periods. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getPeriods();
  }, [year_level_id]);

  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce [animation-delay:-0.2s]"></div>
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce [animation-delay:-0.4s]"></div>
        </div>
        <p className="mt-2 text-gray-500 text-sm">Loading assigned periods...</p>
      </div>
    );
  }

  // Full-page error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
        <i className="fa-solid fa-triangle-exclamation text-5xl text-red-400 mb-4"></i>
        <p className="text-lg text-red-400 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5 bg-gray-50">
      <div className="bg-white max-w-7xl p-6 rounded-lg shadow-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            <i className="fa-solid fa-table-list mr-2"></i>
            Assigned Periods - {levelName}
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded shadow-sm bgTheme text-white"
          >
            ← Back
          </button>
        </div>

        {assignedPeriods.length === 0 ? (
          <div className="text-center text-red-600 py-10">
            No periods assigned for this year level.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-300 rounded-lg overflow-hidden">
              <thead className="bgTheme text-white text-left">
                <tr>
                  <th className="px-4 py-3">S.No</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Teacher</th>
                  <th className="px-4 py-3">Start Time</th>
                  <th className="px-4 py-3">End Time</th>
                </tr>
              </thead>
              <tbody>
                {assignedPeriods.map((period, index) => (
                  <tr key={index} className="hover:bg-gray-50  text-left">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{period.subject}</td>
                    <td className="px-4 py-3">{period.teacher}</td>
                    <td className="px-4 py-3">{period.start_time}</td>
                    <td className="px-4 py-3">{period.end_time}</td>
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

export default PeriodAssignment;
