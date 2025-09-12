import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const MarksheetsTable = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [yearLevels, setYearLevels] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [marksheet, setMarksheet] = useState([]);
  const { axiosInstance } = useContext(AuthContext);

  const getMarksheet = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await axiosInstance.get(`/d/report-cards/`);
      if (response.data && response.data.length > 0) {
        setMarksheet(response.data);
      } else {
        throw new Error("Received empty response from API");
      }
    } catch (err) {
      console.error("Failed to load marksheet:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const getYearLevels = async () => {
    try {
      const response = await axiosInstance.get("/d/year-levels/");
      setYearLevels(response.data);
    } catch (err) {
      console.error("Error fetching year levels:", err);
    }
  };

  useEffect(() => {
    getYearLevels();
    getMarksheet();
  }, []);




  const staticPayload = marksheet;

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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
        <i className="fa-solid fa-triangle-exclamation text-5xl text-red-400 mb-4"></i>
        <p className="text-lg text-red-400 font-medium">Failed to load data, Try Again</p>
      </div>
    );
  }

  if (!staticPayload || staticPayload.length === 0) {
    return <div className="p-4 text-center">No marksheet data available</div>;
  }

  const filterData = staticPayload.filter((detail) =>
    detail.standard
.toLowerCase().includes(selectedClass.toLowerCase())
  );
  const filterBysearch = filterData.filter((detail) =>
    detail.student_name.toLowerCase().includes(searchInput.toLowerCase())
  );
  console.log(filterData);
  

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <div className="mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-4">
           Marksheets <i className="fa-solid fa-address-card ml-2"></i>
          </h1>
        </div>
        {/* Search Input */}
        <div className="flex flex-wrap justify-between items-end gap-4 mb-4 w-full border-b pb-4">
          <div className=" w-full  sm:w-xs">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Select Class:
                </label>
                <select
                  className="select select-bordered w-full focus:outline-none"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  <option value="">All Classes</option>
                  {yearLevels.map((level) => (
                    <option key={level.id} value={level.level_name}>
                      {level.level_name}
                    </option>
                  ))}
                </select>
              </div>
          <input
            type="text"
            placeholder="Search Student Name..."
            className="input input-bordered w-full sm:max-w-xs focus:outline-none"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        {filterData.length === 0 ? (
          <p className="text-gray-600">No matching records found.</p>
        ) : (
          <div className="overflow-x-auto max-h-[70vh]">
            <div className="inline-block min-w-full align-middle">
              <div className="shadow-sm ring-1 ring-black ring-opacity-5 rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bgTheme text-white z-2 sticky top-0">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                        Student Name
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                        Father's Name
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                        Date of Birth
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                        Contact Number
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                        Class
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                        Academic Year
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filterBysearch.map((detail) => (
                      <tr key={detail.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                          {detail.student_name}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                          {detail.father_name}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                          {detail.date_of_birth}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                          {detail.contact_number}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                          {detail.standard}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                          {detail.academic_year}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <Link
                              to={`/Marksheet/${detail.id}`}
                              className="inline-flex items-center px-3 py-1 border border-yellow-300 rounded-md shadow-sm text-sm font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                            >
                              View Marksheet
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarksheetsTable;
