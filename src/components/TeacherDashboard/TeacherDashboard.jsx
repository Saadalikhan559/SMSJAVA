import { Link, useNavigate } from 'react-router-dom'
import React, { useContext, useEffect, useState } from "react";
import { fetchTeacherDashboard } from "../../services/api/Api";
import { AuthContext } from "../../context/AuthContext";

export const TeacherDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userID } = useContext(AuthContext);

  const navigate = useNavigate();

  const getTeacherDashboardData = async () => {
    try {
      const data = await fetchTeacherDashboard(userID);
      setDashboardData(data);
      setLoading(false);
    } catch (error) {
      console.log("failed to fetch teacher dashboard data", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getTeacherDashboardData();
  }, []);

 if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <i className="fa-solid fa-spinner fa-spin mr-2 text-4xl" />
            </div>
        );
    }

  if (!dashboardData) {
    return <div className="p-4 text-center">Failed to load dashboard data</div>;
  }

  const handleShowAttendance = (className) => {
    navigate(`/fullAttendance/${className}`);
  };

  return (
    <div className="p-4 space-y-6">
      <h3 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
        {dashboardData.teacher_name}'s Dashboard
      </h3>

      <div className="text-center mb-6">
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          Total Assigned Classes: {dashboardData.total_assigned_classes}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardData.class_summary && dashboardData.class_summary.length > 0 ? (
          dashboardData.class_summary.map((detail, idx) => (
            <div
              key={idx}
              className="border rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-xl borderTheme bg-white"
            >
              {/* Header */}
              <div className="p-4 bgTheme text-white">
                <h2 className="text-xl font-bold truncate">{detail.level_name}</h2>
              </div>

              {/* Detail Section */}
              <div className="p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Class:</span>
                  <span className="text-gray-800 font-semibold">
                    {detail.level_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Classroom:</span>
                  <span className="text-gray-800 font-semibold">
                    {detail.room_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">
                    Student Count:
                  </span>
                  <span className="text-gray-800 font-semibold">
                    {detail.total_students}
                  </span>
                </div>
                <span className='flex justify-center'>
                  <button
                    type="button"
                    className="w-full font-semibold px-4 py-2 shadow-md rounded-md btn-theme"
                    onClick={() => handleShowAttendance(detail.level_name)}
                  >
                    <i className="fa-solid fa-chalkboard-user mr-2" />
                    Full Attendance for {detail.level_name}
                  </button>
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center col-span-full text-gray-500">
            No class details available.
          </div>
        )}
      </div>
    </div>
  );
};
