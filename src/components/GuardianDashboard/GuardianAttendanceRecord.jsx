import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { fetchGuardianAttendance } from "../../services/api/Api";

const GuardianAttendanceRecord = () => {
  // Define a color palette with enough distinct colors
  const [guardianList, setGuardianList] = useState(null);
  const [guardianID, setGuardianID] = useState(null);
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1); // Current month
  const [filterYear, setFilterYear] = useState(new Date().getFullYear()); // Current year
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("guardian_id");
    setGuardianID(token);
  }, []);


  const getGuardianAttendance = async () => {
    if (!guardianID) return;

    setIsLoading(true);
    try {
      const data = await fetchGuardianAttendance(
        guardianID,
        filterMonth,
        filterYear
      );
      setGuardianList(data);
    } catch (error) {
      console.log("failed to get guardian attendance", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getGuardianAttendance();
  }, [guardianID, filterMonth, filterYear]);

  const colorPalette = [
    "#6e00ff", // purple-600 (primary)
    "#ffd24d", // peach-100 (secondary)
    "#3b82f6", // blue-500
    "#10b981", // emerald-500
    "#f59e0b", // amber-500
    "#ef4444", // red-500
    "#8b5cf6", // violet-500
    "#ec4899", // pink-500
    "#14b8a6", // teal-500
    "#f97316", // orange-500
  ];

  const colorPrimary = "#6e00ff"; // purple-600
  const colorSecondary = "#ffd24d"; // peach-100

  // Loading UI
  if (!guardianList)
    return (
       <div className="flex items-center justify-center h-screen">
                <i className="fa-solid fa-spinner fa-spin mr-2 text-4xl" />
            </div>
    );

  // Helper function to get month name from number
  const getMonthName = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString("default", { month: "long" });
  };

  // Prepare monthly data for charts
  const monthlySeries = guardianList.children.map((child) => ({
    name: child.student_name,
    data: [
      child.monthly_summary.present,
      child.monthly_summary.absent,
      child.monthly_summary.leave,
    ],
  }));

  const monthlyOptions = {
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      toolbar: {
        show: true,
      },
      zoom: {
        enabled: true,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
            offsetX: -10,
            offsetY: 0,
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 10,
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: "13px",
              fontWeight: 900,
            },
          },
        },
      },
    },
    xaxis: {
      categories: ["Present", "Absent", "Leave"],
    },
    legend: {
      position: "right",
      offsetY: 40,
    },
    fill: {
      opacity: 1,
    },
    colors: colorPalette,
    title: {
      text: `Monthly Attendance Summary (${getMonthName(
        guardianList.filter_month
      )} ${guardianList.filter_year})`,
      align: "center",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
        color: colorPalette[0],
      },
    },
  };

  // Prepare yearly data for charts
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
      text: `Yearly Attendance Summary (${guardianList.filter_year})`,
      align: "center",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
        color: colorPalette[0],
      },
    },
  };

  // Prepare percentage data for radial charts
  const percentageSeries = guardianList.children.map((child) => ({
    name: child.student_name,
    data: [
      parseFloat(child.monthly_summary.percentage),
      parseFloat(child.yearly_summary.percentage),
    ],
  }));

  const percentageOptions = {
    chart: {
      height: 350,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: "22px",
          },
          value: {
            fontSize: "16px",
          },
          total: {
            show: true,
            label: "Average",
            formatter: function (w) {
              const sum = w.globals.series.reduce((a, b) => a + b, 0);
              return (sum / w.globals.series.length).toFixed(1) + "%";
            },
          },
        },
      },
    },
    labels: ["Monthly", "Yearly"],
    colors: [colorPrimary, colorSecondary],
    title: {
      text: "Attendance Percentage",
      align: "center",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
        color: colorPrimary,
      },
    },
  };

  // Generate month options for dropdown
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: getMonthName(i + 1),
  }));

  // Generate year options for dropdown (last 5 years and next 5 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => ({
    value: currentYear - 5 + i,
    label: currentYear - 5 + i,
  }));

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "month") {
      setFilterMonth(parseInt(value));
    } else if (name === "year") {
      setFilterYear(parseInt(value));
    }
  };

  return (
    <div className="p-4">
      <span
        className="font-bold text-2xl flex pt-5 justify-center gap-1 textTheme"
       
      >
        <i className="fa-solid fa-square-poll-vertical flex pt-1" /> Attendance
        Record
      </span>

      {/* Enhanced Filter Controls */}
      {/* <div className="flex flex-wrap justify-center gap-6 my-8">
        <div className="flex flex-col gap-1">
          <label htmlFor="month" className="text-sm font-medium text-gray-600">
            Select Month
          </label>
          <div className="relative">
            <select
              id="month"
              name="month"
              value={filterMonth}
              onChange={handleFilterChange}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm cursor-pointer transition-all duration-200 hover:border-purple-400"
              disabled={isLoading}
            >
              {monthOptions.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="year" className="text-sm font-medium text-gray-600">
            Select Year
          </label>
          <div className="relative">
            <select
              id="year"
              name="year"
              value={filterYear}
              onChange={handleFilterChange}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm cursor-pointer transition-all duration-200 hover:border-purple-400"
              disabled={isLoading}
            >
              {yearOptions.map((year) => (
                <option key={year.value} value={year.value}>
                  {year.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {!isLoading ? (
          <button
            onClick={getGuardianAttendance}
            className="self-end px-4 py-2 bgTheme text-white border-[#5E35B1] rounded-lg hover:bg-[#6e00ff] focus:outline-none focus:ring-2 focus:ring-[#6e00ff] focus:ring-offset-2 shadow-md transition-colors duration-200"
          >
            <i className="fas fa-sync-alt mr-2"></i> Refresh
          </button>
        ) : (
          <button
            disabled
            className="self-end px-4 py-2 bg-[#5E35B1] text-white rounded-lg cursor-not-allowed shadow-md"
          >
            <i className="fas fa-spinner fa-spin mr-2"></i> Loading...
          </button>
        )}
      </div> */}
      {/* Enhanced Filter Controls */}
<div className="flex flex-wrap justify-start gap-6 my-8">
  <div className="flex flex-col gap-1">
    <label htmlFor="month" className="text-sm font-medium text-gray-600">
      Select Month
    </label>
    <div className="relative">
      <select
        id="month"
        name="month"
        value={filterMonth}
        onChange={handleFilterChange}
        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm cursor-pointer transition-all duration-200 hover:border-purple-400"
        disabled={isLoading}
      >
        {monthOptions.map((month) => (
          <option key={month.value} value={month.value}>
            {month.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  </div>

  <div className="flex flex-col gap-1">
    <label htmlFor="year" className="text-sm font-medium text-gray-600">
      Select Year
    </label>
    <div className="relative">
      <select
        id="year"
        name="year"
        value={filterYear}
        onChange={handleFilterChange}
        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm cursor-pointer transition-all duration-200 hover:border-purple-400"
        disabled={isLoading}
      >
        {yearOptions.map((year) => (
          <option key={year.value} value={year.value}>
            {year.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  </div>

  <div className="flex items-end">
    {!isLoading ? (
      <button
        onClick={getGuardianAttendance}
        className="px-4 py-2 bgTheme text-white border-[#5E35B1] rounded-lg hover:bg-[#6e00ff] focus:outline-none focus:ring-2 focus:ring-[#6e00ff] focus:ring-offset-2 shadow-md transition-colors duration-200"
      >
        <i className="fas fa-sync-alt mr-2"></i> Refresh
      </button>
    ) : (
      <button
        disabled
        className="px-4 py-2 bg-[#5E35B1] text-white rounded-lg cursor-not-allowed shadow-md"
      >
        <i className="fas fa-spinner fa-spin mr-2"></i> Loading...
      </button>
    )}
  </div>
</div>


      {isLoading ? (
        // <div className="flex flex-col items-center justify-center py-12">
        //   <div className="relative w-20 h-20 mb-4">
        //     {/* Animated spinner */}
        //     <div className="absolute inset-0 border-4 border-[#6e00ff] border-t-transparent rounded-full animate-spin"></div>
        //     {/* Optional: School/attendance themed icon inside spinner */}
        //     <div className="absolute inset-0 flex items-center justify-center">
        //       <svg
        //         className="w-8 h-8 text-[#6e00ff]"
        //         fill="none"
        //         stroke="currentColor"
        //         viewBox="0 0 24 24"
        //         xmlns="http://www.w3.org/2000/svg"
        //       >
        //         <path
        //           strokeLinecap="round"
        //           strokeLinejoin="round"
        //           strokeWidth="2"
        //           d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        //         ></path>
        //       </svg>
        //     </div>
        //   </div>

        //   {/* Loading text with animated dots */}
        //   {/* <div className="text-center">
        //     <h3 className="text-xl font-semibold text-gray-700 mb-1">
        //       Loading Attendance Data
        //     </h3>
        //     <p className="text-gray-500 flex justify-center items-center">
        //       Please wait
        //       <span className="inline-flex space-x-1 ml-1">
        //         <span
        //           className="animate-bounce"
        //           style={{ animationDelay: "0ms" }}
        //         >
        //           .
        //         </span>
        //         <span
        //           className="animate-bounce"
        //           style={{ animationDelay: "150ms" }}
        //         >
        //           .
        //         </span>
        //         <span
        //           className="animate-bounce"
        //           style={{ animationDelay: "300ms" }}
        //         >
        //           .
        //         </span>
        //       </span>
        //     </p>
        //   </div> */}

        //   {/* Optional progress bar */}
        //   {/* <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5 mt-6">
        //     <div
        //       className="bg-[#6e00ff] h-2.5 rounded-full animate-pulse"
        //       style={{ width: "70%" }}
        //     ></div>
        //   </div> */}
        // </div>
         <div className="flex items-center justify-center h-screen">
                <i className="fa-solid fa-spinner fa-spin mr-2 text-4xl" />
            </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <ReactApexChart
              options={{
                ...monthlyOptions,
                colors: colorPalette.slice(0, guardianList.children.length * 3),
              }}
              series={monthlySeries}
              type="bar"
              height={350}
            />
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <ReactApexChart
              options={{
                ...yearlyOptions,
                colors: colorPalette.slice(0, guardianList.children.length * 3),
              }}
              series={yearlySeries}
              type="bar"
              height={350}
            />
          </div>

          <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {guardianList.children.map((child, index) => (
                <div key={index} className="p-4">
                  <span
                    className="font-bold text-xl flex pt-5 justify-center gap-1 mb-4 textTheme"
                    
                  >
                    <i className="fa-solid fa-gauge flex pt-1"></i> Average
                  </span>

                  <h3
                    className="text-lg font-semibold text-center mb-4 textTheme"
                    
                  >
                    {child.student_name} - {child.class_name}
                  </h3>
                  <ReactApexChart
                    options={{
                      ...percentageOptions,
                      labels: ["Monthly", "Yearly"],
                      title: {
                        text: `${child.student_name}'s Attendance Percentage`,
                        align: "center",
                        style: {
                          fontSize: "16px",
                          fontWeight: "bold",
                          color: colorPrimary,
                        },
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
      )}
    </div>
  );
};

export default GuardianAttendanceRecord;
