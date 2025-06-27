import Chart from "react-apexcharts";
import React, { useCallback, useEffect, useState } from "react";
import { fetchFeeDashboard, fetchFeeDashboardByMonth } from "../../services/api/Api";

const FeeDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");

  const height = 400;
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (selectedMonth === "") {
        response = await fetchFeeDashboard();
      } else {
        response = await fetchFeeDashboardByMonth(selectedMonth);
      }
      setDashboardData(response);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setError("Failed to load data");
      setDashboardData(null);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  if (loading) {
    return <div className="p-4 text-center">Loading dashboard...</div>;
  }

  if (error || !dashboardData) {
    return <div className="p-4 text-center">Failed to load dashboard data</div>;
  }

  // Get the appropriate summary based on month selection
  const getSummaryData = () => {
    if (selectedMonth === "") {
      return dashboardData.overall_summary;
    }
    return dashboardData.monthly_summary.find(month => month.month === selectedMonth) || {};
  };

  const currentSummary = getSummaryData();
  const paymentModes = dashboardData.payment_mode_distribution || [];

  const renderDonutChart = (labels, series, colors) => (
    <Chart
      height={height}
      type="donut"
      width="100%"
      options={{
        labels,
        colors,
        legend: {
          position: "bottom",
          fontSize: "14px",
          fontWeight: 600,
          markers: {
            width: 12,
            height: 12,
            radius: 6,
          },
        },
        dataLabels: {
          enabled: true,
          formatter: (val) => `${Math.round(val)}%`,
          style: {
            fontSize: "12px",
            fontWeight: "bold",
            colors: ["#fff"]
          },
        },
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                name: {
                  show: true,
                  fontSize: "14px",
                  color: "#666",
                },
                value: {
                  show: true,
                  fontSize: "22px",
                  fontWeight: "bold",
                  color: "#333",
                  formatter: (val) => `${val.toLocaleString()}`,
                },
                total: {
                  show: true,
                  label: "Total",
                  color: "#666",
                  formatter: (w) => {
                    const sum = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                    return `${sum.toLocaleString()}`;
                  },
                },
              },
            },
          },
        },
        tooltip: {
          enabled: true,
          y: {
            formatter: (val) => `$${val.toLocaleString()}`,
          },
        },
      }}
      series={series}
    />
  );

  return (
    <div className="p-4 space-y-6">
      <h3 className="text-3xl font-bold text-center text-gray-800">
        Fee Dashboard
      </h3>
      
      {/* Month Filter */}
      <div className="flex justify-end mb-4">
        <select
          value={selectedMonth}
          onChange={handleMonthChange}
          className="border border-gray-300 rounded px-4 py-2"
        >
          <option value="">All Months</option>
          {months.map((month) => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      </div>

      {/* OVERALL AND MONTHLY SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-xl borderTheme bg-white">
          <div className="p-4 bgTheme text-white text-center">
            <h2 className="text-xl font-bold">
              {selectedMonth ? `${selectedMonth} Summary` : "Overall Summary"}
            </h2>
          </div>
          <div className="p-4">
            {renderDonutChart(
              ["Paid Amount", "Due Amount"],
              [currentSummary.paid_amount || 0, currentSummary.due_amount || 0],
              ["#6e00ff", "violet"]
            )}
          </div>
        </div>

        <div className="border rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-xl borderTheme bg-white">
          <div className="p-4 bgTheme text-white text-center">
            <h2 className="text-xl font-bold">Payment Mode Distribution</h2>
          </div>
          <div className="p-4">
            {renderDonutChart(
              paymentModes.map(mode => mode.payment_mode),
              paymentModes.map(mode => mode.count),
              ["#6e00ff", "violet", "#FF8042"]
            )}
          </div>
        </div>
      </div>

      {/* ADDITIONAL DATA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-xl borderTheme bg-white">
          <div className="p-4 bgTheme text-white text-center">
            <h2 className="text-xl font-bold">Detailed Summary</h2>
          </div>
          <div className="p-4 grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
              <p className="text-2xl font-bold">₹{currentSummary.total_amount?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Late Fees</h3>
              <p className="text-2xl font-bold text-orange-600">₹{currentSummary.late_fee?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Paid Percentage</h3>
              <p className="text-2xl font-bold text-green-600">{currentSummary.paid_percent?.toFixed(2) || 0}%</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Due Percentage</h3>
              <p className="text-2xl font-bold text-red-600">{currentSummary.due_percent?.toFixed(2) || 0}%</p>
            </div>
          </div>
        </div>

        <div className="border rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-xl borderTheme bg-white">
          <div className="p-4 bgTheme text-white text-center">
            <h2 className="text-xl font-bold">Overdue Accounts</h2>
          </div>
          <div className="p-4">
            {dashboardData.top_defaulters?.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {dashboardData.top_defaulters.map((defaulter, index) => (
                  <li key={index} className="py-3">
                    <div className="flex justify-between">
                      <span className="font-medium">{defaulter.name}</span>
                      <span className="text-red-600">{defaulter.amount_due?.toLocaleString()}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">No Overdue Accounts found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeDashboard;