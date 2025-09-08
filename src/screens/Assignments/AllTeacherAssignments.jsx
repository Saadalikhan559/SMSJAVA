import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { fetchAllTeacherAssignments, fetchSubAssignments } from "../../services/api/Api";

const yearLevelMap = {

  1:"Pre Nursery",
  2: "Nursery",
  3: "LKG",
  4: "UKG",
  5: "Class 1",
  6: "Class 2",
  7: "Class 3",
  8: "Class 4",
  9: "Class 5",
  10: "Class 6",
  11: "Class 7",
  12: "Class 8",
  13: "Class 9",
  14: "Class 10",
  15: "Class 11",
  16: "Class 12",
};

export const AllTeacherAssignments = () => {
  const { authTokens } = useContext(AuthContext);
  const accessToken = authTokens.access;

  const [teacherAssignments, setTeacherAssignment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const [subAssignments, setSubAssignments] = useState([]);
  const [subLoading, setSubLoading] = useState(true);
  const [subError, setSubError] = useState(false);

  const [activeTab, setActiveTab] = useState("teachers");

  const getAllTeacherAssignment = async () => {
    try {
      setLoading(true);
      setError(false);
      const allAssignments = await fetchAllTeacherAssignments(accessToken);
      setTeacherAssignment(allAssignments);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const getSubAssignments = async () => {
    try {
      setSubLoading(true);
      setSubError(false);
      const res = await fetchSubAssignments();
      setSubAssignments(res);
    } catch {
      setSubError(true);
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

  const Loader = ({ text = "Loading data..." }) => (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex space-x-2">
        <div className="w-3 h-3 bgTheme rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bgTheme rounded-full animate-bounce [animation-delay:-0.2s]"></div>
        <div className="w-3 h-3 bgTheme rounded-full animate-bounce [animation-delay:-0.4s]"></div>
      </div>
      <p className="mt-2 text-gray-500 text-sm">{text}</p>
    </div>
  );

  const ErrorMessage = ({ text = "Failed to load data, Try Again" }) => (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <i className="fa-solid fa-triangle-exclamation text-5xl text-red-400 mb-4"></i>
      <p className="text-lg text-red-400 font-medium">{text}</p>
    </div>
  );

  return (
    <div className="min-h-screen p-5 bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {/* Tabs styled like AllStaff */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("teachers")}
            className={`px-6 py-2 font-semibold rounded-t-lg border-b-2 ${
              activeTab === "teachers"
                ? "border-[#5E35B1] textTheme"
                : "border-transparent text-gray-600 hover:text-[#5E35B1]"
            }`}
          >
            <i className="fa-solid fa-person-chalkboard mr-2 text-3xl"></i> Teacher Assignments
          </button>
          <button
            onClick={() => setActiveTab("substitutes")}
            className={`px-6 py-2 font-semibold rounded-t-lg border-b-2 ${
              activeTab === "substitutes"
                ? "border-[#5E35B1] textTheme"
                : "border-transparent text-gray-600 hover:text-[#5E35B1]"
            }`}
          >
            <i className="fa-solid fa-user-clock mr-2 text-3xl"></i> Substitute Assignments
          </button>
        </div>

        {/* Teacher Assignments */}
        {activeTab === "teachers" && (
          <>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 text-center mb-6">
              <i className="fa-solid fa-person-chalkboard mr-2 text-3xl"></i> Teacher Assignments
            </h2>

            <input
              type="text"
              placeholder="Search Teacher..."
              className="border px-3 py-2 rounded w-full sm:w-64"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          {loading ? (
            <Loader text="Loading teacher assignments..." />
          ) : error ? (
            <ErrorMessage text="Failed to load teacher assignments, Try Again" />
          ) : filteredData.length === 0 ? (
            <ErrorMessage text="No assignments found" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.map((data) => (
                <div
                  key={data.teacher_id}
                  className="border rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-xl bg-white"
                >
                  <div className="p-4 bgTheme text-white flex justify-between items-center">
                    <h2 className="text-xl font-bold truncate capitalize">{data.teacher_name}</h2>
                    <span className="text-sm bg-white textTheme px-2 py-1 rounded font-semibold capitalize">
                      {data.assignments.length > 0 ? data.assignments[0].year_level_name : ""}
                    </span>
                  </div>

                  <div className="p-4 border-b">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Periods Assigned:</span>
                      <span className="font-bold">{data.total_assigned_periods} / {data.max_periods_allowed}</span>
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
                        <ul className="space-y-2 max-h-60 overflow-y-auto pr-1">
                          {assignment.periods.map((period, idx2) => (
                            <li
                              className="bg-gray-100 p-3 rounded-md border border-gray-200 flex justify-between"
                              key={idx2}
                            >
                              <div>
                                <div className="font-medium text-gray-800">{period.subject_name}</div>
                                <div className="text-sm text-gray-600">{period.period_name}</div>
                                <div className="text-sm text-gray-600 capitalize">{period.year_level_name}</div>

                              </div>
                              <div className="text-right text-sm font-semibold text-purple-600">
                                {period.start_time} - {period.end_time}
                              </div>
                            </li>
                          ))}
                        </ul>
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
                            <span className="bg-blue-100 textTheme text-xs px-2 py-1 rounded mr-2">
                              {assignment.year_level_name}
                            </span>
                          </h3>
                          <ul className="space-y-2 max-h-60 overflow-y-auto pr-1">
                            {assignment.periods.map((period, idx2) => (
                              <li
                                className="bg-gray-100 p-3 rounded-md border border-gray-200 flex justify-between"
                                key={idx2}
                              >
                                <div>
                                  <div className="font-medium text-gray-800">{period.subject_name}</div>
                                  <div className="text-sm text-gray-600">{period.period_name}</div>
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
                      <ErrorMessage text="No current assignments" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Substitute Assignments */}
        {activeTab === "substitutes" && (
          <>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 text-center mb-6">
              <i className="fa-solid fa-user-clock mr-2 text-3xl"></i> Substitute Assignments
            </h2>
            {subLoading ? (
              <Loader text="Loading substitute assignments..." />
            ) : subError ? (
              <ErrorMessage text="Failed to load substitute assignments, Try Again" />
            ) : subAssignments.length === 0 ? (
              <ErrorMessage text="No substitute assignments found" />
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
                  <tbody className="divide-gray-200 bg-white">
                    {subAssignments.map((a) => (
                      <tr key={a.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-3 text-nowrap">{a.date}</td>
                        <td className="px-6 py-3 capitalize text-nowrap">{a.absent_teacher_name}</td>
                        <td className="px-6 py-3 text-nowrap">{yearLevelMap[a.year_level] || `Class ${a.year_level}`}</td>
                        <td className="px-6 py-3 text-nowrap capitalize">{a.period}</td>
                        <td className="px-6 py-3 capitalize text-nowrap">{a.substitute_teacher_name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
