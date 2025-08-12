import React, { useState } from "react";

const ViewAllocatedClass = () => {
  // Static payload data
  const allocatedClasses = [
    {
      id: 18,
      teacher_name: "ibrahim khan",
      year_level_name: "Class 1",
    },
    {
      id: 22,
      teacher_name: "ibrahim khan",
      year_level_name: "Class 12",
    },
    {
      id: 23,
      teacher_name: "noor khan",
      year_level_name: "Class 11",
    },
    {
      id: 19,
      teacher_name: "abuqata khan",
      year_level_name: "UKG",
    },
    {
      id: 20,
      teacher_name: "arsalan khan",
      year_level_name: "Class 2",
    },
    {
      id: 21,
      teacher_name: "arsalan khan",
      year_level_name: "Class 3",
    },
    {
      id: 25,
      teacher_name: "saba khan",
      year_level_name: "Nursery",
    },
    {
      id: 24,
      teacher_name: "kulsoom ali",
      year_level_name: "Class 1",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");

  const filteredClasses = allocatedClasses.filter(
    (classItem) =>
      classItem.teacher_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.year_level_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        {/* Heading + Search Bar in same line */}
        <div className="flex items-center justify-between mb-6 border-b pb-2">
          <h2 className="text-3xl font-semibold text-gray-800">
            Allocated Classes <i className="fa-solid fa-landmark"></i>
          </h2>

          {/* Search Bar */}
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
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500  sm:text-sm"
              placeholder="Search by teacher or class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bgTheme text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                      Teacher
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                      Class
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredClasses.length > 0 ? (
                    filteredClasses.map((classItem) => (
                      <tr key={classItem.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-700 text-nowrap capitalize">
                          {classItem.teacher_name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-nowrap capitalize">
                          {classItem.year_level_name}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-4 py-6 text-center text-sm text-gray-500"
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
      </div>
    </div>
  );
};

export default ViewAllocatedClass;
