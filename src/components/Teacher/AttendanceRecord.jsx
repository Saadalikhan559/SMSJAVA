import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { fetchAttendanceData } from '../../services/api/Api';

const AttendanceRecord = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [overallAttendance, setOverallAttendance] = useState({
    present: 0,
    total: 0,
    percentage: '0%'
  });
  const [chartData, setChartData] = useState({
    series: [{ name: 'Attendance %', data: [] }],
    options: {
      chart: { type: 'bar', height: 350 },
      xaxis: { categories: [] },
      yaxis: {
        labels: { formatter: (val) => ` ${val}% ` }
      },
      tooltip: {
        y: { formatter: (val) => ` ${val}% ` }
      }
    }
  });

  // Loader & Error state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchAttendanceData(selectedDate);

      if (!data) {
        setOverallAttendance({ present: 0, total: 0, percentage: '0%' });
        setChartData(prev => ({
          ...prev,
          series: [{ name: 'Attendance %', data: [] }],
          options: { ...prev.options, xaxis: { categories: [] } }
        }));
        return;
      }

      // overall attendance
      setOverallAttendance(data.overall_attendance || { present: 0, total: 0, percentage: '0%' });

      // class wise data for chart
      const classWise = data.class_wise_attendance || [];
      const categories = classWise.map(item => item.class_name);
      const percentageValues = classWise.map(item => parseFloat(item.percentage.replace('%', '')) || 0);

      setChartData(prev => ({
        ...prev,
        series: [{ name: 'Attendance %', data: percentageValues }],
        options: { ...prev.options, xaxis: { categories } }
      }));
    } catch (err) {
      setError('Failed to load data. Try again');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [selectedDate]);

  const handleReset = () => {
    setSelectedDate('');
  };


  // Loader UI
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce [animation-delay:-0.2s]"></div>
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce [animation-delay:-0.4s]"></div>
        </div>
        <p className="mt-2 text-gray-500 text-sm">Loading data...</p>
      </div>
    );
  }


  // Error UI
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
        <i className="fa-solid fa-triangle-exclamation text-5xl text-red-400 mb-4"></i>
        <p className="text-lg text-red-400 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen p-5 bg-gray-50">
        <div className="w-full max-w-7xl mx-auto p-6 bg-base-100 rounded-box my-5 shadow-lg">
          <span className='font-bold text-2xl flex pt-5 justify-center gap-1'>
            <i className="fa-solid fa-square-poll-vertical flex pt-1" /> Attendance Record
          </span>

          <div className="flex flex-wrap justify-center gap-4 p-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input input-bordered focus:outline-none"
            />
            <button onClick={handleReset} className="btn" disabled={!selectedDate}>
              Reset
            </button>
          </div>

          <div className="flex justify-center gap-10 font-semibold text-lg mb-4">
            <div>Total Present Students: {overallAttendance.present}</div>
            <div>Total Students: {overallAttendance.total}</div>
            <div>Overall Attendance: {overallAttendance.percentage}</div>
          </div>

          <div className="p-4 flex justify-center">
            <Chart
              options={chartData.options}
              series={chartData.series}
              type="bar"
              height={500}
              width={1200}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AttendanceRecord;
