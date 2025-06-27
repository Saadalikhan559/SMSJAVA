import { useContext, useEffect, useState } from "react";
import { fetchAllTeacherAssignments } from "../../services/api/Api";
import { AuthContext } from "../../context/AuthContext";
export const AllTeacherAssignments = () => {
  const [teacherAssignments, setTeacherAssignment] = useState([]);
  const [loading, setLoading] = useState(true);
    const {authTokens} = useContext(AuthContext);
    const accessToken = authTokens.access;
  
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
  useEffect(() => {
    getAllTeacherAssignment();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-3">
      {/* CARD  */}
      {teacherAssignments.length > 0 ? (
        teacherAssignments.map((data) => (
          <div
            key={data.teacher_id}
            className={`border rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-xl borderTheme bg-white'}`}
          >
            <div className="p-4 bgTheme text-white">
              <h2 className="text-xl font-bold truncate">
                {data.teacher_name}
              </h2>
            </div>
            {/* Periods Summary */}
            <div className="p-4 borderTheme-b">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Periods Assigned:</span>
                <span className={`font-bold`}>
                  {data.total_assigned_periods} / {data.max_periods_allowed}
                </span>
              </div>
              <progress
                className="progress progress-primary w-56"
                value={data.total_assigned_periods}
                max={data.max_periods_allowed}
              />
            </div>
            {/* Assignments */}
            {data.assignments.length > 0 ? (
              data.assignments.map((assignment, idx) => (
                <div className="p-4" key={idx}>
                  <div className="mb-4 last:mb-0">
                    <h3 className="font-bold text-gray-700 mb-2 flex items-center">
                      <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded mr-2">
                        {assignment.year_level_name}
                      </span>
                    </h3>
                    <ul className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {assignment.periods.map((period, idx) => (
                        <li className="bg-gray-100 p-3 rounded-md border border-gray-200 flex justify-between text-purple-600" key={idx}>
                          <div>
                            <div className="font-medium text-gray-800">
                              {period.subject_name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {period.period_name}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold">
                              {period.start_time} - {period.end_time}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4">
                <div className="mb-4 last:mb-0">
                  <ul className="space-y-2 max-h-50 overflow-y-auto pr-1">
                    <li className="bg-gray-100 p-3 rounded-md border border-gray-200 flex justify-between text-purple-600">
                      <div>
                        <div className="font-medium text-gray-800">
                          No current assignments
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="col-span-full text-center py-10">
          {!loading && "No assignments found"}
        </div>
      )}

      {/* {CARD ENDS} */}
    </div>
  );
};