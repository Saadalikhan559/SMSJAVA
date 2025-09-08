import React, { useEffect, useState } from "react";
import { fetchAdmissionDetails, fetchYearLevels } from "../../services/api/Api";
import { Link } from "react-router-dom";
import { allRouterLink } from "../../router/AllRouterLinks";
import { Loader } from "../../global/Loader";

export const AdmissionDetails = () => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState("");
  const [yearLevels, setYearLevels] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [error, setError] = useState(false);

  const getAdmissionDetails = async () => {
    try {
      const data = await fetchAdmissionDetails();
      setDetails(data);
      setLoading(false);
    } catch (error) {
      console.log("failed to fetch admission details", error);
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAdmissionDetails();
  }, []);

  
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
        <p className="text-lg text-red-400 font-medium">
          Failed to load data, Try Again
        </p>
      </div>
    );
  }

  if (!details) {
    return <div className="p-4 text-center">No admission records found</div>;
  }


  const filterData = details.filter((detail) =>
    detail.year_level.toLowerCase().includes(selectedClass.toLowerCase())
  );
  const filterBysearch = filterData.filter((detail) =>
    detail.student_input.first_name
      .toLowerCase()
      .includes(searchInput.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl  mx-auto bg-white shadow-lg rounded-lg p-6">
           <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-4">
           <i className="fa-solid fa-clipboard-list w-5"></i>  Admission Details
          </h1>
        </div>
        <div className="w-full px-5 ">
          <div className="flex flex-wrap justify-between items-end gap-4 mb-4 w-full border-b pb-4">
         <div className="flex flex-col w-full sm:w-xs">
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
         <div className="flex flex-col w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search Student Name..."
            className="input input-bordered w-full sm:max-w-xs focus:outline-none"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
         </div> </div>
        </div>
     
         

        {filterData.length === 0 ? (
          <p className="text-gray-600">No admission records found.</p>
        ) : (
          <div className="overflow-x-auto max-h-[70vh] rounded-lg">
            <div className="inline-block min-w-full align-middle rounded-lg">
              <div className="shadow-sm ring-1 ring-black ring-opacity-5 rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bgTheme text-white z-2 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                        Student Name
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                        Parent/Guardian
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                        Date of Birth
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                        Gender
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                        Class
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                        Admission Date
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className=" divide-gray-200 bg-white">
                    {filterBysearch.map((detail) => (
                      <tr key={detail.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                          {detail.student_input.first_name}{" "}
                          {detail.student_input.last_name}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                          {detail.guardian_input.first_name}{" "}
                          {detail.guardian_input.last_name} (
                          {detail.guardian_type || "N/A"})
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                          {detail.student_input.date_of_birth}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                          {detail.student_input.gender}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                          {detail.year_level}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                          {detail.admission_date}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <Link
                              to={allRouterLink.editAddmisionDetails.replace(
                                ":id",
                                detail.id
                              )}
                              className="inline-flex items-center px-3 py-1 border border-yellow-300 rounded-md shadow-sm text-sm font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                            >
                              Edit
                            </Link>
                            <Link
                              to={allRouterLink.addmissionDetailsById.replace(
                                ":id",
                                detail.id
                              )}
                              className="inline-flex items-center px-3 py-1 border border-[#5E35B1] rounded-md shadow-sm text-sm font-medium textTheme bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5E35B1]"
                            >
                              More
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
