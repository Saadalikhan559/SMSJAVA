import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPeriodsByYearLevel } from "../../services/api/Api";

const PeriodAssignment = () => {
  const { year_level_id } = useParams();
  const [className, setClassName] = useState("");
  const [assignedPeriods, setAssignedPeriods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!year_level_id) {
      console.warn("year_level_id is missing from URL");
      return;
    }

    const getPeriods = async () => {
      setLoading(true);
      try {
        const data = await fetchPeriodsByYearLevel(year_level_id);
        setClassName(data.class || "");
        setAssignedPeriods(data.assigned_periods || []);
      } catch (error) {
        console.error("Failed to fetch periods:", error);
        setAssignedPeriods([]);
      } finally {
        setLoading(false);
      }
    };

    getPeriods();
  }, [year_level_id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <i className="fa-solid fa-spinner fa-spin text-3xl text-blue-600" />
      </div>
    );
  }

  if (assignedPeriods.length === 0) {
    return (
      <div className="text-center text-gray-600 p-4">
        No periods assigned for this year level.
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Assigned Periods - {className}
        </h1>

        <table className="w-full border border-gray-300 rounded">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-2 px-4 text-left">Subject</th>
              <th className="py-2 px-4 text-left">Teacher</th>
              <th className="py-2 px-4 text-left">Start Time</th>
              <th className="py-2 px-4 text-left">End Time</th>
            </tr>
          </thead>
          <tbody>
            {assignedPeriods.map((period, index) => (
              <tr key={index} className="border-t">
                <td className="py-2 px-4">{period.subject}</td>
                <td className="py-2 px-4">{period.teacher}</td>
                <td className="py-2 px-4">{period.start_time}</td>
                <td className="py-2 px-4">{period.end_time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PeriodAssignment;
