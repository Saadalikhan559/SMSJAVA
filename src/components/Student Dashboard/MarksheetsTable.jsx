import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MarksheetsTable = () => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");

  // Static payload data
  const staticPayload = [
    {
      "id": 47,
      "student_name": "Ayaan Mohammad Sheikh",
      "father_name": "Salman Sheikh",
      "date_of_birth": "2010-03-10",
      "contact_number": "9952115463",
      "standard": "Class 7",
      "academic_year": "2025-2026",
    },
    {
      "id": 48,
      "student_name": "Rahul Sharma",
      "father_name": "Amit Sharma",
      "date_of_birth": "2011-05-15",
      "contact_number": "9876543210",
      "standard": "Class 8",
      "academic_year": "2025-2026",
    }
  ];

  const getMarksheetDetails = async () => {
    try {
      // Simulating API call with static data
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      setDetails(staticPayload);
      setLoading(false);
    } catch (error) {
      console.log("failed to fetch marksheet data", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getMarksheetDetails();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading marksheets...</div>;
  }

  if (!details) {
    return <div className="p-4 text-center">Failed to load data</div>;
  }

  const filterData = details.filter((detail) =>
    detail.student_name.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        {/* Search Input */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 border-b pb-2 gap-4">
          <h2 className="text-3xl font-semibold text-gray-800">
            Marksheets <i class="fa-solid fa-address-card ml-2"></i>
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
          <p className="text-gray-600">No marksheet records found.</p>
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