import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { constants } from "../../global/constants";
import { AuthContext } from "../../context/AuthContext";

// import { fetchAllocatedClasses } from "../../services/api/Api";

const ViewAllocatedClass = () => {
  const { authTokens } = useContext(AuthContext);

  const [allocatedClasses, setAllocatedClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // useEffect(() => {

  //   const loadClasses = async () => {
  //     try {
  //       const data = await fetchAllocatedClasses(authTokens.access);
  //       setAllocatedClasses(data);
  //     }  catch (error) {
  //       console.error(error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };


  //   if (authTokens?.access) {
  //     loadClasses();
  //   }
  // }, [authTokens]);

  const filteredClasses = allocatedClasses.filter(
    (classItem) =>
      classItem.teacher_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.year_level_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">

        <div className="flex items-center justify-between mb-6 border-b pb-2">
          <h2 className="text-3xl font-semibold text-gray-800">
            Allocated Classes <i className="fa-solid fa-landmark"></i>
          </h2>
          <div className="relative w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 sm:text-sm"
              placeholder="Search by teacher or class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}

        <div className="w-full overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bgTheme text-white text-center">
              <tr>
                <th scope="col" className="px-4 py-3">Teacher</th>
                <th scope="col" className="px-4 py-3">Class</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="2"
                    className="text-center py-6 text-gray-500"
                  >
                    Loading allocated classes...
                  </td>
                </tr>
              ) : filteredClasses.length > 0 ? (
                filteredClasses.map((classItem, index) => (
                  <tr key={classItem.id || index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-center text-sm text-gray-700 capitalize">
                      {classItem.teacher_name}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 capitalize">
                      {classItem.year_level_name}
                    </td>
                  </tr>

                ))
              ) : (
                <tr>
                  <td
                    colSpan="2"
                    className="text-center py-6 text-gray-500"
                  >
                    No matching classes found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default ViewAllocatedClass;
