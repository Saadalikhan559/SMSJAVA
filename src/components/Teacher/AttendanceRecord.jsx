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
      xaxis: { categories: [],
        // title: { text: 'Classes' },
       },
      yaxis: {
        // title: { text: 'Attendance %' },
        labels: { formatter: (val) => ` ${val}% ` }
      },
      tooltip: {
        y: { formatter: (val) => ` ${val}% ` }
      }
    }
  });

  const getData = async () => {
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
      options: {
        ...prev.options,
        xaxis: { categories },
      }
    }));
  };

  useEffect(() => {
    getData();
  }, [selectedDate]);

  const handleReset = () => {
    setSelectedDate('');
  };

  return (
    <>
    <div className="min-h-screen p-5 bg-gray-50">
      <div className="w-full max-w-7xl mx-auto p-6 bg-base-100 rounded-box my-5 shadow-lg">
      <span className='font-bold text-2xl flex pt-5 justify-center gap-1'>
        <i className="fa-solid fa-square-poll-vertical flex pt-1" /> Attendance Record
      </span>

      <div className="flex flex-wrap justify-center gap-4 p-4 border-b pb-4 ">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="input input-bordered focus:outline-none"
        />
        <button onClick={handleReset} className="bgTheme text-white text-sm px-5 py-2 rounded font-semibold h-10 w-full sm:w-auto" disabled={!selectedDate}>
          Reset
        </button>
      </div>

      <div className="flex justify-center gap-10 font-semibold text-lg mb-4 mt-2">
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

