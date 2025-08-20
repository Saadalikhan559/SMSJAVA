import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMarksheets } from "../../services/api/Api";

const MarksheetsTable = () => {
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [marksheet, setMarksheet] = useState([]);

  useEffect(() => {
    const tokenData = localStorage.getItem("authTokens");
    if (tokenData) {
      try {
        const tokens = JSON.parse(tokenData);
        if (tokens?.access && tokens.access !== accessToken) {
          setAccessToken(tokens.access);
        }
      } catch (error) {
        console.error("Error parsing auth tokens:", error);
        setLoading(false); // Set loading to false if there's an error
      }
    } else {
      setLoading(false); // Set loading to false if no token data
    }
  }, []);

  const getMarksheet = async () => {
    try {
      if (!accessToken) {
        throw new Error("No access token available");
      }

      const obj = await fetchMarksheets(accessToken);
      if (obj && obj.length > 0) {
        setMarksheet(obj);
      } else {
        throw new Error("Received empty response from fetchMarksheet");
      }
    } catch (err) {
      console.error("Failed to load marksheet:", err);
    } finally {
      setLoading(false); // Always set loading to false when the operation is complete
    }
  };

  useEffect(() => {
    if (accessToken) {
      getMarksheet();
    }
  }, [accessToken]);

  const staticPayload = marksheet;

  if (loading) {
    return <div className="p-4 text-center">Loading marksheets...</div>;
  }

  if (!staticPayload || staticPayload.length === 0) {
    return <div className="p-4 text-center">No marksheet data available</div>;
  }

  const filterData = staticPayload.filter((detail) =>
    detail.student_name.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        {/* Search Input */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 border-b pb-2 gap-4">
          <h2 className="text-3xl font-semibold text-gray-800">
            Marksheets <i className="fa-solid fa-address-card ml-2"></i>
          </h2>
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
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bgTheme text-white">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-sm font-semibold text-nowrap"
                      >
                        Student Name
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-sm font-semibold text-nowrap"
                      >
                        Father's Name
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-sm font-semibold text-nowrap"
                      >
                        Date of Birth
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-sm font-semibold text-nowrap"
                      >
                        Contact Number
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-sm font-semibold text-nowrap"
                      >
                        Class
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-sm font-semibold text-nowrap"
                      >
                        Academic Year
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-sm font-semibold text-nowrap"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filterData.map((detail) => (
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