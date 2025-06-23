import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { fetchAttendanceData } from '../../services/api/Api';
import { Link } from 'react-router-dom'


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

  const getData = async () => {
    const AttendanceData = await fetchAttendanceData();

    setClasses([...new Set(AttendanceData.map(item => item.class_name))]);

    const filtered = AttendanceData.filter(item => {
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
  };

  useEffect(() => {
    getData();
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
          ].map((month) => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>

        <select value={year} onChange={(e) => setYear(e.target.value)} className="select select-bordered focus:outline-none">
          <option value="">All Years</option>
          {[2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025].map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <select value={className} onChange={(e) => setClassName(e.target.value)} className="select select-bordered focus:outline-none">
          <option value="">All Classes</option>
          {classes.map((cls, idx) => (
            <option key={idx} value={cls}>{cls}</option>
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
      <Link to="/fullAttendance">
      <span className='flex justify-center'>
      <button type="submit" className="btn btn-primary "><i className="fa-solid fa-chalkboard-user"/>Get Full Attendance</button>
      </span></Link>
      
    </>
  );
};

export default AttendanceRecord;


