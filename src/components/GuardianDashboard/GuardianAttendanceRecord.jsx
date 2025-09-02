import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { fetchGuardianAttendance } from "../../services/api/Api";

const GuardianAttendanceRecord = () => {
  const [guardianList, setGuardianList] = useState(null);
  const [guardianID, setGuardianID] = useState(null);
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("guardian_id");
    setGuardianID(token);
  }, []);

  const getGuardianAttendance = async () => {
    if (!guardianID) return;

    setIsLoading(true);
    setError(false);
    try {
      const data = await fetchGuardianAttendance(
        guardianID,
        filterMonth,
        filterYear
      );
      setGuardianList(data);
    } catch (error) {
      console.error("Failed to get guardian attendance", error);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getGuardianAttendance();
  }, [guardianID, filterMonth, filterYear]);

  const colorPalette = [
    "#6e00ff", "#ffd24d", "#3b82f6", "#10b981",
    "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899",
    "#14b8a6", "#f97316",
  ];

  const colorPrimary = "#6e00ff";
  const colorSecondary = "#ffd24d";

  // Loader
  if (isLoading && !guardianList) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce [animation-delay:-0.2s]"></div>
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce [animation-delay:-0.4s]"></div>
        </div>
        <p className="mt-2 text-gray-500 text-sm">Loading attendance data...</p>
      </div>
    );
  }

  // Error UI
  if (error || !guardianList) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
        <i className="fa-solid fa-triangle-exclamation text-5xl text-red-400 mb-4"></i>
        <p className="text-lg text-red-400 font-medium">
          Failed to load attendance records. Please try again.
        </p>
        <button
          onClick={getGuardianAttendance}
          className="mt-4 btn bgTheme text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  const getMonthName = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString("default", { month: "long" });
  };

  // Monthly data
  const monthlySeries = guardianList.children.map((child) => ({
    name: child.student_name,
    data: [
      child.monthly_summary.present,
      child.monthly_summary.absent,
      child.monthly_summary.leave,
    ],
  }));

  const monthlyOptions = {
    chart: { type: "bar", stacked: true, height: 350, toolbar: { show: true } },
    plotOptions: { bar: { horizontal: false, borderRadius: 10 } },
    xaxis: { categories: ["Present", "Absent", "Leave"] },
    colors: colorPalette,
    title: {
      text: `Monthly Attendance (${getMonthName(
        guardianList.filter_month
      )} ${guardianList.filter_year})`,
      align: "center",
      style: { fontSize: "16px", fontWeight: "bold", color: colorPalette[0] },
    },
  };

  // Yearly data
  const yearlySeries = guardianList.children.map((child) => ({
    name: child.student_name,
    data: [
      child.yearly_summary.present,
      child.yearly_summary.absent,
      child.yearly_summary.leave,
    ],
  }));

  const yearlyOptions = {
    ...monthlyOptions,
    title: {
      text: `Yearly Attendance (${guardianList.filter_year})`,
      align: "center",
      style: { fontSize: "16px", fontWeight: "bold", color: colorPalette[0] },
    },
  };

  // Percentage data
  const percentageSeries = guardianList.children.map((child) => ({
    name: child.student_name,
    data: [
      parseFloat(child.monthly_summary.percentage),
      parseFloat(child.yearly_summary.percentage),
    ],
  }));

  const percentageOptions = {
    chart: { type: "radialBar", height: 350 },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: { fontSize: "18px" },
          value: { fontSize: "14px" },
          total: {
            show: true,
            label: "Average",
            formatter: (w) => {
              const sum = w.globals.series.reduce((a, b) => a + b, 0);
              return (sum / w.globals.series.length).toFixed(1) + "%";
            },
          },
        },
      },
    },
    colors: [colorPrimary, colorSecondary],
    labels: ["Monthly", "Yearly"],
  };

  // Month & year options
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: getMonthName(i + 1),
  }));

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => ({
    value: currentYear - 5 + i,
    label: currentYear - 5 + i,
  }));

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "month") setFilterMonth(parseInt(value));
    else if (name === "year") setFilterYear(parseInt(value));
  };

  return (
    <div className="p-4">
      <h2 className="font-bold text-2xl flex justify-center items-center gap-2 textTheme">
        <i className="fa-solid fa-square-poll-vertical" /> Attendance Record
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-6 my-8">
        {/* Month */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">Select Month</label>
          <select
            name="month"
            value={filterMonth}
            onChange={handleFilterChange}
            disabled={isLoading}
            className="px-4 py-2 border rounded-lg shadow-sm cursor-pointer focus:ring-2 focus:ring-purple-500"
          >
            {monthOptions.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">Select Year</label>
          <select
            name="year"
            value={filterYear}
            onChange={handleFilterChange}
            disabled={isLoading}
            className="px-4 py-2 border rounded-lg shadow-sm cursor-pointer focus:ring-2 focus:ring-purple-500"
          >
            {yearOptions.map((y) => (
              <option key={y.value} value={y.value}>{y.label}</option>
            ))}
          </select>
        </div>

        {/* Refresh button */}
        <button
          onClick={getGuardianAttendance}
          disabled={isLoading}
          className="self-end px-4 py-2 rounded-lg shadow-md bgTheme text-white flex items-center gap-2"
        >
          {isLoading ? (
            <div className="flex space-x-2">
              <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce"></div>
              <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.2s]"></div>
              <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.4s]"></div>
            </div>
          ) : (
            <>
              <i className="fas fa-sync-alt" /> Refresh
            </>
          )}
        </button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <ReactApexChart
            options={monthlyOptions}
            series={monthlySeries}
            type="bar"
            height={350}
          />
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <ReactApexChart
            options={yearlyOptions}
            series={yearlySeries}
            type="bar"
            height={350}
          />
        </div>

        <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guardianList.children.map((child, index) => (
              <div key={index} className="p-4">
                <h3 className="text-lg font-semibold text-center mb-4 textTheme">
                  {child.student_name} - {child.class_name}
                </h3>
                <ReactApexChart
                  options={{
                    ...percentageOptions,
                    title: {
                      text: `${child.student_name}'s Attendance`,
                      align: "center",
                      style: { fontSize: "16px", fontWeight: "bold", color: colorPrimary },
                    },
                  }}
                  series={[
                    percentageSeries[index].data[0],
                    percentageSeries[index].data[1],
                  ]}
                  type="radialBar"
                  height={300}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuardianAttendanceRecord;
