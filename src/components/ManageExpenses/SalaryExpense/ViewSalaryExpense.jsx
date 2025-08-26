import React, { useEffect, useState } from "react";
import { fetchSchoolExpense, fetchSchoolYear } from "../../../services/api/Api";

export const ViewSalaryExpense = () => {
  const [schoolExpense, setSchoolExpense] = useState([]);
  const [schoolYear, setSchoolYear] = useState([]);
  const [selectedSchoolYear, setSelectedSchoolYear] = useState("");
  const access = JSON.parse(localStorage.getItem("authTokens")).access;

  const getSchoolYear = async () => {
    try {
      const response = await fetchSchoolYear();
      setSchoolYear(response);
    } catch (error) {
      console.log("Cannot get the school year", error.meesage);
    }
  };

  const getSchoolExpense = async () => {
    try {
      const response = await fetchSchoolExpense(
        access,
        selectedSchoolYear,
        "1"
      );
      setSchoolExpense(response);
    } catch (error) {
      console.log("Cannot get the school salary expense", error.meesage);
    }
  };

  useEffect(() => {
    getSchoolYear();
    getSchoolExpense();
  }, []);
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-2">
          <i className="fa-solid fa-folder-open"></i> Salary Expense
        </h2>

        {/* Filters */}
        <div className="mb-4 flex gap-4">
          <div>
            <label className="mr-2 font-medium">School Year:</label>
            <select
              value={selectedSchoolYear}
              onChange={(e) => setSelectedSchoolYear(e.target.value)}
              className="border p-2 rounded"
            >
              {schoolYear.map((cls, idx) => (
                <option key={idx} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        {/* <div className="w-full overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow-sm rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bgTheme text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Role
                    </th>
                    {userRole === "admin" && selectedRole === "Student" && (
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Class
                      </th>
                    )}
                    {allDocTypes.map((type) => (
                      <th
                        key={type}
                        className="px-4 py-3 text-left text-sm font-semibold text-nowrap"
                      >
                        {type}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredData.map((person, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {person.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {person.role}
                      </td>
                      {userRole === "admin" && selectedRole === "Student" && (
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {person.yearLevel || "-"}
                        </td>
                      )}
                      {allDocTypes.map((type) => (
                        <td
                          key={type}
                          className="px-4 py-3 text-sm text-blue-700"
                        >
                          {person.docs[type]?.map((url, i) => (
                            <div key={i} className="max-w-[150px] truncate">
                              <Link
                                to={url}
                                target="_blank"
                                rel="noreferrer"
                                className="underline textTheme hover:text-blue-800 truncate block"
                                title={url.split("/").pop()}
                              >
                                {url.split("/").pop()}
                              </Link>
                            </div>
                          )) || "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};
