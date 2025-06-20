import React, { useEffect, useState } from "react";
import { fetchTeacherDashboard } from "../../services/api/Api";


export const TeacherDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getGuardianDashboardData = async () => {
    try {
      const data = await fetchTeacherDashboard();
      setDashboardData(data);
      setLoading(false);
    } catch (error) {
      console.log("failed to fetch teacher dashboard data", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getGuardianDashboardData();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading dashboard...</div>;
  }

  if (!dashboardData) {
    return <div className="p-4 text-center">Failed to load dashboard data</div>;
  }
  return (
    <div className="p-4 space-y-6">
      <h3 className="text-3xl font-bold text-center text-gray-800">
        {dashboardData.teacher}'s Dashboard
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardData.class_details && dashboardData.class_details.length > 0 ? (
          dashboardData.class_details.map((detail, idx) => (
            <div
              key={idx}
              className="border rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-xl borderTheme bg-white"
            >
              {/* Header */}
              <div className="p-4 bgTheme text-white">
                <h2 className="text-xl font-bold truncate">{detail.subject}</h2>
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
                  <span className="font-medium text-gray-600">
                    Class Period:
                  </span>
                  <span className="text-gray-800 font-semibold">
                    {detail.class_period}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Classroom:</span>
                  <span className="text-gray-800 font-semibold">
                    {detail.classroom}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">
                    Student Count:
                  </span>
                  <span className="text-gray-800 font-semibold">
                    {detail.student_count}
                  </span>
                </div>
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
