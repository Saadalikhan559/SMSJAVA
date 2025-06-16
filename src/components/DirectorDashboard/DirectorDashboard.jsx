import React from "react";
import Chart from "react-apexcharts";

const payload = {
  summary: {
    new_admissions: 1,
    students: 1450,
    teachers: 50,
  },
  gender_distribution: {
    students: {
      count: { male: 4, female: 2 },
      percentage: { male: 66.67, female: 33.33 },
    },
    teachers: {
      count: { male: 40, female: 10 },
      percentage: { male: 100.0, female: 0.0 },
    },
  },
  class_strength: {
    "Grade 1": 3,
    "Grade 2": 1,
    "Grade 3": 2,
  },
  students_per_year: {
    "2023-2024": 1,
    "2024-2025": 5,
    "2025-2026": 0,
  },
};

export const DirectorDashboard = () => {
  return (
    <div className="p-4 space-y-6">
      <h3 className="text-3xl font-bold text-center text-gray-800">
        Director Dashboard
      </h3>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {Object.entries(payload.summary).map(([key, value]) => (
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
          const data = payload.gender_distribution[role];
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
                    // colors: ["#6e00ff", "#f97316"],
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
                  categories: Object.keys(payload.class_strength),
                },
                // colors: ["#6e00ff"],
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
                  data: Object.values(payload.class_strength),
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
                  categories: Object.keys(payload.students_per_year),
                },
                // colors: ["#6e00ff"],
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
                  data: Object.values(payload.students_per_year),
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
