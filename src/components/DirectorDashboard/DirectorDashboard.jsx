import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import {
  fetchDirectorDashboard,
  fetchIncomeDistributionDashboard,
  fetchStudentCategoryDashboard,
} from "../../services/api/Api";

export const DirectorDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [studentCategoryDashboardData, setStudentCategoryDashboardData] =
    useState(null);
  const [incomeDistributionData, setIncomeDistributionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const height = 400;

  const loadAllDashboardData = async () => {
    try {
      const [directorRes, studentCatRes, incomeDistRes] = await Promise.all([
        fetchDirectorDashboard(),
        fetchStudentCategoryDashboard(),
        fetchIncomeDistributionDashboard(),
      ]);

      setDashboardData(directorRes);
      setStudentCategoryDashboardData(studentCatRes);
      setIncomeDistributionData(incomeDistRes);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllDashboardData();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading dashboard...</div>;
  }

  if (
    !dashboardData ||
    !studentCategoryDashboardData ||
    !incomeDistributionData
  ) {
    return <div className="p-4 text-center">Failed to load dashboard data</div>;
  }

  const studentCategoryLabel = studentCategoryDashboardData.map(
    (item) => item.category_name
  );
  const studentCategorySeries = studentCategoryDashboardData.map(
    (item) => item.count
  );

  const incomeDistributionLabel = incomeDistributionData.map(
    (item) => item.income_range
  );
  const incomeDistributionSeries = incomeDistributionData.map(
    (item) => item.count
  );

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
                  height={height}
                  type="pie"
                  width="100%"
                  options={{
                    labels: ["Male", "Female"],
                    colors: ["#6e00ff", "#FFBB28"], // #FFD700 is gold
                    legend: { position: "bottom" },
                  }}
                  series={[data.count.male, data.count.female]}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* CATEGORY AND INCOME DISTRIBUTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-xl borderTheme bg-white">
          <div className="p-4 bgTheme text-white text-center">
            <h2 className="text-xl font-bold">Student Category</h2>
          </div>
          <div className="p-4">
            <Chart
              height={height}
              type="pie"
              width="100%"
              options={{
                labels: studentCategoryLabel,
                colors: ["#6e00ff", "#E65C00", "#00C49F", "#FFBB28"],
                legend: { position: "bottom" },
              }}
              series={studentCategorySeries}
            />
          </div>
        </div>

        <div className="border rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-xl borderTheme bg-white">
          <div className="p-4 bgTheme text-white text-center">
            <h2 className="text-xl font-bold">Income Category</h2>
          </div>
          <div className="p-4">
            <Chart
              type="bar"
              height={height}
              options={{
                chart: { toolbar: { show: false } },
                xaxis: {
                  categories: incomeDistributionLabel,
                  title: {
                    text: "Income Range",
                    style: {
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#333",
                    },
                  },
                },
                yaxis: {
                  title: {
                    text: "Number of Students",
                    style: {
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#333",
                    },
                  },
                },
                colors: ["#E65C00"],
                plotOptions: {
                  bar: {
                    borderRadius: 6,
                    columnWidth: "50%",
                  },
                },
                legend: { show: false }, // no legend for single series
              }}
              series={[
                {
                  name: "Students",
                  data: incomeDistributionSeries,
                },
              ]}
            />
          </div>
        </div>
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
              height={height}
              options={{
                chart: { toolbar: { show: false } },
                xaxis: {
                  categories: Object.keys(dashboardData.class_strength || {}),
                  title: {
                    text: "Class",
                    style: {
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#333",
                    },
                  },
                },
                yaxis: {
                  title: {
                    text: "Number of Student",
                    style: {
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#333",
                    },
                  },
                },
                colors: ["#E65C00"],
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
            <h2 className="text-xl font-bold">Student Admission Per Year</h2>
          </div>
          <div className="p-4">
            <Chart
              type="line"
              height={height}
              options={{
                chart: { toolbar: { show: false } },
                stroke: {
                  curve: "straight",
                  width: 5,
                },
                xaxis: {
                  categories: Object.keys(
                    dashboardData.students_per_year || {}
                  ),
                  title: {
                    text: "Year",
                    style: {
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#333",
                    },
                  },
                },
                yaxis: {
                  title: {
                    text: "Number of Admissions",
                    style: {
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#333",
                    },
                  },
                },
                title: {
                  text: "Yearly Admissions",
                  align: "left",
                },
                colors: ["#E65C00"],
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
<<<<<<< HEAD
=======

>>>>>>> b88f1f1ee5dba5e9ca2dea8e007b96d7edc42a2d
