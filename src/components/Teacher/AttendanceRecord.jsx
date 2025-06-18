import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import axios from 'axios';

const AttendanceRecord = () => {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [className, setClassName] = useState('');
  const [classes, setClasses] = useState([]);
  const [chartData, setChartData] = useState({
    series: [{ name: 'Attendance %', data: [] }],
    options: {
      chart: { type: 'bar', height: 350 },
      xaxis: { categories: [] },
      yaxis: {
        title: { text: '' },
        labels: { formatter: (val) => ` ${val}% ` }
      },
      tooltip: {
        y: { formatter: (val) => ` ${val}% ` }
      }
    }
  });

  // Fetch data
  const fetchData = async () => {
    try {
      // const response = await axios.get('https://mocki.io/v1/7f971d95-e78b-43e8-a026-8746ea05d27f');

      const response = await axios.get('https://8c1zb9f3-8000.inc1.devtunnels.ms/a/director-dashboard/');
      const classData = response.data.class_wise_attendance || [];



      setClasses([...new Set(classData.map(item => item.class_name))]);

      // Filter data
      const filtered = classData.filter(item => {
        const matchesMonth = month ? item.month === month : true;
        const matchesYear = year ? item.year === year.toString() : true;
        const matchesClass = className ? item.class_name === className : true;
        return matchesMonth && matchesYear && matchesClass;
      });

      const categories = filtered.map(item => item.class_name);
      const percentageValues = filtered.map(item =>
        parseFloat(item.percentage.replace('%', '')) || 0
      );

      setChartData(prev => ({
        ...prev,
        series: [{ name: 'Attendance %', data: percentageValues }],
        options: {
          ...prev.options,
          xaxis: { categories },
        }
      }));
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [month, year, className]);

  return (
    <>
      <span className='font-bold text-2xl flex pt-5 justify-center gap-1'>
        <i className="fa-solid fa-square-poll-vertical flex pt-1" /> Attendance Record
      </span>

      <div className='flex flex-wrap justify-center gap-4 p-4'>
        <select value={month} onChange={(e) => setMonth(e.target.value)} className="select select-bordered focus:outline-none">
          <option value="">All Months</option>
          {[
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ].map((Months) => (
            <option key={Months} value={Months}>{Months}</option>
          ))}
        </select>

        <select value={year} onChange={(e) => setYear(e.target.value)} className="select select-bordered focus:outline-none">
          <option value="">All Years</option>
          {[2015,2016,2017,2018,2019,2020,2021,2022, 2023, 2024, 2025].map(years => (
            <option key={years} value={years}>{years}</option>
          ))}
        </select>

        <select value={className} onChange={(e) => setClassName(e.target.value)} className="select select-bordered focus:outline-none">
          <option value="">All Classes</option>
          {classes.map((classname, id) => (
            <option key={id} value={classname}>{classname}</option>
          ))}
        </select>
      </div>

      <div className="p-4 flex justify-center">
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={450}
          width={1000}
        />
      </div>
    </>
  );
};

export default AttendanceRecord;


