import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  fetchStudentDashboard,
  fetchPeriodsByYearLevel,
} from "../../services/api/Api";

export const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [assignedPeriods, setAssignedPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userID } = useContext(AuthContext);

  useEffect(() => {
    const getStudentDashboardData = async () => {
      try {
        const data = await fetchStudentDashboard(userID);
        setDashboardData(data);
        const yearLevelId = data?.children?.[0]?.year_level_id;

        if (yearLevelId) {
          const periodData = await fetchPeriodsByYearLevel(yearLevelId);
          setAssignedPeriods(periodData.assigned_periods || []);
        }
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    getStudentDashboardData();
  }, [userID]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <i className="fa-solid fa-spinner fa-spin mr-2 text-4xl" />
      </div>
    );
  }

  const student = dashboardData?.children?.[0];

  if (!student) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        No student data available.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
        Student Dashboard
      </h2>

      <div className="rounded-lg shadow-md border borderTheme bg-white">
        <div className="rounded-t-lg overflow-hidden">
          <div className="p-5 bgTheme text-white flex items-center justify-between">
            <h3 className="text-2xl font-semibold uppercase">
              {student.student_name}
            </h3>
            <p className="text-2xl font-semibold">{student.class}</p>
          </div>

          {/* Daily Class Schedule Heading */}
          <div className="bg-white textTheme px-5 py-2 border-t border-white flex justify-center">
            <h4 className="text-xl font-semibold tracking-wide uppercase">
              Daily Class Schedule
            </h4>
          </div>
        </div>

        {/* Assigned Periods Table */}
        {assignedPeriods.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-gray-100 text-gray-700 text-left">
                <tr>
                  <th className="px-5 py-3 border-b">Period.No</th>
                  <th className="px-5 py-3 border-b">Subject</th>
                  <th className="px-5 py-3 border-b">Teacher</th>
                  <th className="px-5 py-3 border-b">Start Time</th>
                  <th className="px-5 py-3 border-b">End Time</th>
                </tr>
              </thead>
              <tbody>
                {assignedPeriods.map((period, index) => (
                  <tr key={index} className="hover:bg-blue-50 border-b text-gray-800 last:border-b-0">

                    <td className="px-5 py-3">{index + 1}</td>
                    <td className="px-5 py-3">{period.subject}</td>
                    <td className="px-5 py-3">{period.teacher}</td>
                    <td className="px-5 py-3">{period.start_time}</td>
                    <td className="px-5 py-3">{period.end_time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-5 text-center text-gray-500">
            No periods assigned for this class.
          </div>
        )}
      </div>
    </div>
  );
};

