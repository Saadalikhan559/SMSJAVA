import React, { useState } from "react";
import { Link } from "react-router-dom";

const TeacherSubstitute = () => {
  // Static payload data
  const teachers = [
    {
      id: 1,
      first_name: "ibrahim",
      last_name: "khan",
      email: "ibrahim@gmail.com",
      phone_no: "985321533",
      year_levels: [
        {
          id: 10,
          level_name: "Class 7",
          periods: [],
        },
        {
          id: 15,
          level_name: "Class 12",
          periods: [
            {
              id: 26,
              name: "Period 1",
              subject: "Mathematics",
            },
          ],
        },
      ],
      attendance: {
        date: "2025-08-11",
        status: "absent",
      },
    },
    {
      id: 5,
      first_name: "abuqata",
      last_name: "khan",
      email: "abuqata@gmail.com",
      phone_no: null,
      year_levels: [
        {
          id: 3,
          level_name: "UKG",
          periods: [],
        },
      ],
      attendance: {
        date: "2025-08-11",
        status: "absent",
      },
    },
    {
      id: 7,
      first_name: "farheen",
      last_name: "khan",
      email: "farheen@gmail.com",
      phone_no: null,
      year_levels: [
        {
          id: 9,
          level_name: "Class 6",
          periods: [],
        },
      ],
      attendance: {
        date: "2025-08-11",
        status: "absent",
      },
    },
    {
      id: 9,
      first_name: "saba",
      last_name: "khan",
      email: "saba@gmail.com",
      phone_no: null,
      year_levels: [
        {
          id: 1,
          level_name: "Nursery",
          periods: [],
        },
      ],
      attendance: {
        date: "2025-08-11",
        status: "absent",
      },
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");

  const filteredTeachers = teachers.filter(
    (teacher) =>
      `${teacher.first_name} ${teacher.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.year_levels.some((level) =>
        level.level_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        {/* Heading + Search Bar in same line */}
        <div className="flex items-center justify-between mb-6 border-b pb-2">
          <h2 className="text-3xl font-semibold text-gray-800">
            Teacher Substitute <i className="fa-solid fa-chalkboard-user"></i>
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
              placeholder="Search by teacher, email or class..."
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
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                      Phone
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                      Classes
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                      Attendance Status
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
                  {filteredTeachers.length > 0 ? (
                    filteredTeachers.map((teacher) => (
                      <tr key={teacher.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-700 text-nowrap capitalize">
                          {teacher.first_name} {teacher.last_name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-nowrap">
                          {teacher.email}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-nowrap">
                          {teacher.phone_no || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {teacher.year_levels.map((level) => (
                            <div key={level.id} className="capitalize">
                              {level.level_name}
                              {level.periods.length > 0 && (
                                <div className="text-xs text-gray-500 ml-2">
                                  {level.periods.map((period) => (
                                    <div key={period.id}>
                                      {period.name}: {period.subject}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-nowrap capitalize">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              teacher.attendance.status === "absent"
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {teacher.attendance.status} (
                            {teacher.attendance.date})
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <Link
                              to={`/Marksheet/${teacher.id}`}
                              className="inline-flex items-center px-3 py-1 border border-yellow-300 rounded-md shadow-sm text-sm font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                            >
                              Assign Substitute
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-4 py-6 text-center text-sm text-gray-500"
                      >
                        No matching teachers found
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

export default TeacherSubstitute;
