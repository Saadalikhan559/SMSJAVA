import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { fetchAllTeacherAssignments } from "../../services/api/Api";
import { fetchSubAssignments } from "../../services/api/Api";

const yearLevelMap = {
  1: "Nursery",
  2: "LKG",
  3: "UKG",
  4: "Class 1",
  5: "Class 2",
  6: "Class 3",
  7: "Class 4",
  8: "Class 5",
  9: "Class 6",
  10: "Class 7",
  11: "Class 8",
  12: "Class 9",
  13: "Class 10",
  14: "Class 11",
  15: "Class 12",
};


export const AllTeacherAssignments = () => {
  const [teacherAssignments, setTeacherAssignment] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authTokens } = useContext(AuthContext);
  const accessToken = authTokens.access;
  const [searchInput, setSearchInput] = useState("");

  // Substitute assignments
  const [subAssignments, setSubAssignments] = useState([]);
  const [subLoading, setSubLoading] = useState(true);

  // Tabs
  const [activeTab, setActiveTab] = useState("teachers");


  //  Fetch Teacher Assignments

  const getAllTeacherAssignment = async () => {
    try {
      setLoading(true);
      const allAssignments = await fetchAllTeacherAssignments(accessToken);
      setTeacherAssignment(allAssignments);
    } catch (error) {
      console.log("Failed to load teacher. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  //  Fetch Substitute Assignments

  const getSubAssignments = async () => {
    try {
      setSubLoading(true);
      const res = await fetchSubAssignments();
      setSubAssignments(res);
    } catch (err) {
      console.error("Error fetching substitute assignments:", err);
    } finally {
      setSubLoading(false);
    }
  };

  useEffect(() => {
    getAllTeacherAssignment();
    getSubAssignments();
  }, []);

  const filteredData = teacherAssignments.filter((assignment) =>
    assignment.teacher_name.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="p-4">
      {/* Tabs  */}
      <div className="flex justify-center border-b mb-6">
        <button
          className={`px-6 py-2 font-semibold ${activeTab === "teachers"
            ? "border-b-2 border-blue-600 text-blue-600"
            : "text-gray-600"
            }`}
          onClick={() => setActiveTab("teachers")}
        >
          Teacher Assignments
        </button>
        <button
          className={`px-6 py-2 font-semibold ${activeTab === "substitutes"
            ? "border-b-2 border-blue-600 text-blue-600"
            : "text-gray-600"
            }`}
          onClick={() => setActiveTab("substitutes")}
        >
          Substitute Assignments
        </button>
      </div>

      {/* Teacher Assignments  */}
      {activeTab === "teachers" && (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Teacher Assignments
            </h2>
            <input
              type="text"
              placeholder="Search Teacher..."
              className="input input-bordered w-full sm:max-w-xs focus:outline-none"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-40">
              <i className="fa-solid fa-spinner fa-spin mr-2 text-2xl" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.length > 0 ? (
                filteredData.map((data) => (
                  <div
                    key={data.teacher_id}
                    className="border rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-xl bg-white"
                  >
                    <div className="p-4 bgTheme text-white">
                      <h2 className="text-xl font-bold truncate capitalize">
                        {data.teacher_name}
                      </h2>
                    </div>
                    <div className="p-4 border-b">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Periods Assigned:</span>
                        <span className="font-bold">
                          {data.total_assigned_periods} /{" "}
                          {data.max_periods_allowed}
                        </span>
                      </div>
                      <progress
                        className="progress progress-primary w-full"
                        value={data.total_assigned_periods}
                        max={data.max_periods_allowed}
                      />
                    </div>

                    {data.assignments.length > 0 ? (
                      data.assignments.map((assignment, idx) => (
                        <div className="p-4" key={idx}>
                          <h3 className="font-bold text-gray-700 mb-2 flex items-center">
                            <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded mr-2">
                              {assignment.year_level_name}
                            </span>
                          </h3>
                          <ul className="space-y-2 max-h-60 overflow-y-auto pr-1">
                            {assignment.periods.map((period, idx) => (
                              <li
                                className="bg-gray-100 p-3 rounded-md border border-gray-200 flex justify-between"
                                key={idx}
                              >
                                <div>
                                  <div className="font-medium text-gray-800">
                                    {period.subject_name}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {period.period_name}
                                  </div>
                                </div>
                                <div className="text-right text-sm font-semibold text-purple-600">
                                  {period.start_time} - {period.end_time}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-gray-600">
                        No current assignments
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  No assignments found
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Substitute Assignments  */}

      {activeTab === "substitutes" && (
        <div className="p-4">
          <h2 className="text-2xl font-semibold text-gray-800">
              Substitute Assignments
            </h2><br/>
          {subLoading ? (
            <div className="flex items-center justify-center h-40">
              <i className="fa-solid fa-spinner fa-spin mr-2 text-2xl" />
            </div>
          ) : subAssignments.length === 0 ? (
            <div className="col-span-full text-center py-10">
              No substitute assignments found.
            </div>
          ) : (
            <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
              <table className="min-w-full table-fixed text-sm text-left text-gray-700">
                <thead className="bgTheme text-white text-sm uppercase tracking-wide">
                  <tr>
                    <th className="px-6 py-3 w-[20%]">Date</th>
                    <th className="px-6 py-3 w-[20%]">Absent Teacher</th>
                    <th className="px-6 py-3 w-[20%]">Class</th>
                    <th className="px-6 py-3 w-[20%]">Period</th>
                    <th className="px-6 py-3 w-[20%]">Substitute Teacher</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {subAssignments.map((a) => (
                    <tr
                      key={a.id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-3 text-nowrap">{a.date}</td>

                      <td className="px-6 py-3 capitalize text-nowrap">{a.absent_teacher_name}</td>

                      <td className="px-6 py-3 text-nowrap">
                        {yearLevelMap[a.year_level] || `Class ${a.year_level}`}
                      </td>

                      <td className="px-6 py-3 text-nowrap capitalize">{a.period}</td>

                      <td className="px-6 py-3 capitalize text-nowrap">{a.substitute_teacher_name}</td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};