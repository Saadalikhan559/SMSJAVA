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

  const getPeriods = async () => {
    if (!year_level_id) return;

    setLoading(true);
    try {
      const data = await fetchPeriodsByYearLevel(year_level_id);
      setAssignedPeriods(data.assigned_periods || []);
    } catch (error) {
      console.error("Failed to fetch periods:", error);
      setAssignedPeriods([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPeriods();
  }, [year_level_id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <i className="fa-solid fa-spinner fa-spin text-4xl text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5 bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-screen-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            <i className="fa-solid fa-table-list mr-2"></i>
            Assigned Periods - {levelName}
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded shadow-sm"
          >
            ← Back
          </button>
        </div>

        {assignedPeriods.length === 0 ? (
          <div className="text-center text-gray-600 py-10">
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
                  <tr key={index} className="hover:bg-blue-50 border-t text-left">
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
