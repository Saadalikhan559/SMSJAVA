import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchClassAttendance } from '../../services/api/Api';

const FullAttendance = () => {
  const { className } = useParams();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nameFilter, setNameFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [page, setPage] = useState(0);

  const columnsPerPage = 7;

  const formatInputDate = (inputDate) => {
    if (!inputDate) return '';
    const dateObj = new Date(inputDate);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear().toString().slice(2);
    const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
    return `${day}/${month}/${year} (${weekday})`;
  };

useEffect(() => {
  fetchClassAttendance(className)
    .then((data) => {
      console.log("Class attendance data:", data);
      setData(data);
      setFilteredData(data);
      setLoading(false);
    })
    .catch((error) => {
      setError(error.message);
      setLoading(false);
    });
}, [className]);


  const getAllHeaders = () => {
    const headersSet = new Set();
    data.forEach((item) => {
      Object.keys(item).forEach((key) => headersSet.add(key));
    });
    const allHeaders = Array.from(headersSet);
    const studentKey = allHeaders.find((h) => h.toLowerCase().includes('student'));
    const dateHeaders = allHeaders.filter((h) => h !== studentKey).sort();
    return [studentKey, ...dateHeaders];
  };

  const allHeaders = getAllHeaders();
  const studentKey = allHeaders[0];
  const dateHeaders = allHeaders.slice(1);

  const totalPages = Math.ceil(dateHeaders.length / columnsPerPage);
  const currentPageDates = dateHeaders.slice(
    page * columnsPerPage,
    page * columnsPerPage + columnsPerPage
  );

  let headers = [studentKey];
  const formattedDate = formatInputDate(dateFilter);
  if (dateFilter) {
    const matchedDate = dateHeaders.find((date) => date === formattedDate);
    if (matchedDate) {
      headers.push(matchedDate);
    }
  } else {
    headers = [studentKey, ...currentPageDates];
  }

  useEffect(() => {
    const formattedDate = formatInputDate(dateFilter);
    const filtered = data.filter((item) => {
      const name = item[studentKey]?.toLowerCase() || '';
      const matchesName = name.includes(nameFilter.toLowerCase());

      const matchesDate = dateFilter
        ? item[formattedDate] !== null &&
          item[formattedDate] !== undefined &&
          item[formattedDate] !== ''
        : true;

      return matchesName && matchesDate;
    });
    setFilteredData(filtered);
  }, [nameFilter, dateFilter, data, studentKey]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <i className="fa-solid fa-spinner fa-spin mr-2 text-4xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center justify-center text-red-600">
          <p className="text-black text-2xl">
            <i className="fa-solid fa-chalkboard-user ml-2" />
            Attendance Table
          </p>
          <p className="text-xl">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      <div
        className={`bg-white p-6 rounded-lg shadow-lg mx-auto ${
          dateFilter ? 'max-w-fit' : 'max-w-screen'
        }`}
      >
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          <i className="fa-solid fa-chalkboard-user ml-2" />
          Attendance Table
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Name:</label>
            <input
              type="text"
              placeholder="Enter student name"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="border rounded px-3 py-2 text-sm w-56"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Date:</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border rounded px-3 py-2 text-sm w-56"
            />
          </div>
        </div>

        {/* Table */}
        <div
          className={`overflow-x-auto ${
            dateFilter ? 'flex justify-center' : ''
          }`}
        >
          <table
            className={`${
              dateFilter ? 'w-auto' : 'min-w-full'
            } table-auto rounded-lg overflow-hidden`}
          >
            <thead className="bgTheme text-white">
              <tr>
                {headers.map((header, index) => (
                  <th key={index} className="px-4 py-3 text-left whitespace-nowrap font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={headers.length} className="text-center py-6 text-gray-500">
                    Attendance Not found.
                  </td>
                </tr>
              ) : (
                filteredData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-blue-50 transition">
                    {headers.map((header, i) => (
                      <td key={i} className="px-4 py-3 text-center text-sm text-gray-700">
                        {item[header] || '--'}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!dateFilter && (
          <div className="flex justify-center mt-4 gap-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              disabled={page === 0}
              className="bg-blue-600 text-white text-sm px-4 py-2 rounded disabled:bg-gray-300"
            >
              <i className="fa-solid fa-arrow-left mr-1" /> Previous
            </button>
            <span className="px-4 py-1 text-sm text-gray-700">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
              disabled={page >= totalPages - 1}
              className="bg-blue-600 text-white text-sm px-4 py-2 rounded disabled:bg-gray-300"
            >
              Next <i className="fa-solid fa-arrow-right ml-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FullAttendance;