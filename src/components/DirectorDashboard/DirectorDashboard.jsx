import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { fetchDirectorDashboard } from "../../services/api/Api";

export const DirectorDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getDirectorDashboardData = async () => {
    try {
      const data = await fetchDirectorDashboard();
      setDashboardData(data);
      setLoading(false);
    } catch (error) {
      console.log("failed to fetch director dashboard data", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getDirectorDashboardData();
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
        Director Dashboard
      </h3>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {Object.entries(dashboardData.summary || {}).map(([key, value]) => (
          <div
            key={key}
            className="border rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-xl borderTheme bg-white"
          >
            <div className="p-4 bgTheme text-white text-center">
              <h2 className="text-xl font-bold capitalize">
                {key.replace("_", " ")}
              </h2>
            </div>
            <div className="p-4 text-center text-2xl font-semibold text-gray-800">
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* GENDER DISTRIBUTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {["students", "teachers"].map((role) => {
          const data = dashboardData.gender_distribution?.[role];
          if (!data) return null;
          
          return (
            <div
              key={role}
              className="border rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-xl borderTheme bg-white"
            >
              <div className="p-4 bgTheme text-white text-center">
                <h2 className="text-xl font-bold capitalize">
                  Gender Distribution - {role}
                </h2>
              </div>
              <div className="p-4">
                <Chart
                  type="pie"
                  width="100%"
                  options={{
                    labels: ["Male", "Female"],
                    colors: ["#6e00ff", "gold"],
                    legend: { position: "bottom" },
                  }}
                  series={[data.count.male, data.count.female]}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CLASS STRENGTH */}
        <div className="border rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-xl borderTheme bg-white">
          <div className="p-4 bgTheme text-white text-center">
            <h2 className="text-xl font-bold">Class Strength</h2>
          </div>
          <div className="p-4">
            <Chart
              type="bar"
              height={300}
              options={{
                chart: { toolbar: { show: false } },
                xaxis: {
                  categories: Object.keys(dashboardData.class_strength || {}),
                },
                colors: ["gold"],
                plotOptions: {
                  bar: {
                    borderRadius: 6,
                    columnWidth: "50%",
                  },
                },
              }}
              series={[
                {
                  name: "Students",
                  data: Object.values(dashboardData.class_strength || {}),
                },
              ]}
            />
          </div>
        </div>

        {/* STUDENTS PER YEAR */}
        <div className="border rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-xl borderTheme bg-white">
          <div className="p-4 bgTheme text-white text-center">
            <h2 className="text-xl font-bold">Students Per Year</h2>
          </div>
          <div className="p-4">
            <Chart
              type="bar"
              height={300}
              options={{
                chart: { toolbar: { show: false } },
                xaxis: {
                  categories: Object.keys(dashboardData.students_per_year || {}),
                },
                colors: ["gold"],
                plotOptions: {
                  bar: {
                    borderRadius: 6,
                    columnWidth: "50%",
                  },
                },
              }}
              series={[
                {
                  name: "Students",
                  data: Object.values(dashboardData.students_per_year || {}),
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};












