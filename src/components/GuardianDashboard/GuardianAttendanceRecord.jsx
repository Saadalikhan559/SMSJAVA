import React from "react";
import ReactApexChart from "react-apexcharts";

const GuardianAttendanceRecord = () => {
  // Define a color palette with enough distinct colors
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

  // Define Tailwind colors
  const colorPrimary = "#6e00ff"; // purple-600
  const colorSecondary = "#ffd24d"; // peach-100 

  // Static payload data
  const attendanceData = {
    guardian_id: 1,
    total_children: 2,
    children: [
      {
        student_name: "Noore Nabi",
        class_name: "Nursery",
        monthly_summary: {
          present: 8,
          absent: 1,
          leave: 1,
          total_days: 13,
          percentage: "61.5%",
        },
        yearly_summary: {
          present: 10,
          absent: 1,
          leave: 1,
          total_days: 15,
          percentage: "66.7%",
        },
      },
      {
        student_name: "Shad Khan",
        class_name: "Nursery",
        monthly_summary: {
          present: 1,
          absent: 5,
          leave: 1,
          total_days: 10,
          percentage: "10.0%",
        },
        yearly_summary: {
          present: 3,
          absent: 5,
          leave: 1,
          total_days: 12,
          percentage: "25.0%",
        },
      }
    ],
  };

  // Prepare monthly data for charts
  const monthlySeries = attendanceData.children.map((child) => ({
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
      text: "Monthly Attendance Summary",
      align: "center",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
        color: colorPalette[0],
      },
    },
  };

  // Prepare yearly data for charts
  const yearlySeries = attendanceData.children.map((child) => ({
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
      text: "Yearly Attendance Summary",
      align: "center",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
        color: colorPalette[0],
      },
    },
  };

  // Prepare percentage data for radial charts
  const percentageSeries = attendanceData.children.map((child) => ({
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
    colors: [colorPrimary, colorSecondary], // Using only the two colors
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

  return (
    <div className="p-4">
      <span
        className="font-bold text-2xl flex pt-5 justify-center gap-1"
        style={{ color: colorPalette[0] }}
      >
        <i className="fa-solid fa-square-poll-vertical flex pt-1" /> Attendance
        Record
      </span>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <ReactApexChart
            options={{
              ...monthlyOptions,
              colors: colorPalette.slice(0, attendanceData.children.length * 3),
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
              colors: colorPalette.slice(0, attendanceData.children.length * 3),
            }}
            series={yearlySeries}
            type="bar"
            height={350}
          />
        </div>

        <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {attendanceData.children.map((child, index) => (
              <div key={index} className="p-4">
                <span
                  className="font-bold text-xl flex pt-5 justify-center gap-1 mb-4"
                  style={{ color: colorPrimary }}
                >
                  <i class="fa-solid fa-gauge flex pt-1"></i> Average
                </span>

                <h3
                  className="text-lg font-semibold text-center mb-4"
                  style={{ color: colorPrimary }}
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
    </div>
  );
};

export default GuardianAttendanceRecord;
