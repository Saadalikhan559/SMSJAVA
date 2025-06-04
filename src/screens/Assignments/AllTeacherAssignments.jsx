import { useEffect, useState } from "react";
import { fetchAllTeacherAssignments } from "../../services/api/Api";
export const AllTeacherAssignments = () => {
  const [teacherAssignments, setTeacherAssignment] = useState([]);

  let dummyData = [
    {
        "teacher_id": 1,
        "teacher_name": "Maisara Waseem",
        "total_assigned_periods": 3,
        "max_periods_allowed": 6,
        "assignments": [
            {
                "year_level_id": 2,
                "year_level_name": "Nursery",
                "periods": [
                    {
                        "period_id": 1,
                        "period_name": "Maths Period",
                        "start_time": "08:45",
                        "end_time": "09:30",
                        "subject_id": 3,
                        "subject_name": "Maths"
                    },
                    {
                        "period_id": 4,
                        "period_name": "Science - English",
                        "start_time": "08:45",
                        "end_time": "09:30",
                        "subject_id": 1,
                        "subject_name": "Science"
                    },
                    {
                        "period_id": 5,
                        "period_name": "English - English",
                        "start_time": "08:45",
                        "end_time": "09:30",
                        "subject_id": 2,
                        "subject_name": "English"
                    }
                ]
            }
        ]
    },
    {
        "teacher_id": 2,
        "teacher_name": "Mariya Khan",
        "total_assigned_periods": 1,
        "max_periods_allowed": 6,
        "assignments": []
    },
    {
        "teacher_id": 3,
        "teacher_name": "Moosa Alam",
        "total_assigned_periods": 3,
        "max_periods_allowed": 6,
        "assignments": [
            {
                "year_level_id": 2,
                "year_level_name": "Nursery",
                "periods": [
                    {
                        "period_id": 6,
                        "period_name": "Science - English",
                        "start_time": "08:45",
                        "end_time": "09:30",
                        "subject_id": 1,
                        "subject_name": "Science"
                    },
                    {
                        "period_id": 7,
                        "period_name": "English - English",
                        "start_time": "08:45",
                        "end_time": "09:30",
                        "subject_id": 2,
                        "subject_name": "English"
                    },
                    {
                        "period_id": 8,
                        "period_name": "Social Science - Social Science",
                        "start_time": "09:30",
                        "end_time": "10:15",
                        "subject_id": 4,
                        "subject_name": "Social Science"
                    }
                ]
            },
            {
                "year_level_id": 4,
                "year_level_name": "KG-2",
                "periods": [
                                      {
                        "period_id": 6,
                        "period_name": "Science - English",
                        "start_time": "08:45",
                        "end_time": "09:30",
                        "subject_id": 1,
                        "subject_name": "Science"
                    },
                    {
                        "period_id": 7,
                        "period_name": "English - English",
                        "start_time": "08:45",
                        "end_time": "09:30",
                        "subject_id": 2,
                        "subject_name": "English"
                    }
                ]
            }
        ]
    },
    {
        "teacher_id": 4,
        "teacher_name": "Imad Khan",
        "total_assigned_periods": 1,
        "max_periods_allowed": 6,
        "assignments": []
    },
    {
        "teacher_id": 5,
        "teacher_name": "Ibrahim Khan",
        "total_assigned_periods": 1,
        "max_periods_allowed": 6,
        "assignments": [
            {
                "year_level_id": 13,
                "year_level_name": "Class-9",
                "periods": [
                    {
                        "period_id": 10,
                        "period_name": "English - English",
                        "start_time": "08:45",
                        "end_time": "09:30",
                        "subject_id": 2,
                        "subject_name": "English"
                    }
                ]
            }
        ]
    },
    {
        "teacher_id": 6,
        "teacher_name": "Faiza Alam",
        "total_assigned_periods": 2,
        "max_periods_allowed": 6,
        "assignments": [
            {
                "year_level_id": 1,
                "year_level_name": "Pre-Nursery",
                "periods": [
                    {
                        "period_id": 9,
                        "period_name": "Social Science - Social Science",
                        "start_time": "09:30",
                        "end_time": "10:15",
                        "subject_id": 4,
                        "subject_name": "Social Science"
                    },
                    {
                        "period_id": 11,
                        "period_name": "Science - Maths",
                        "start_time": "07:15",
                        "end_time": "08:00",
                        "subject_id": 1,
                        "subject_name": "Science"
                    }
                ]
            },
            {
                "year_level_id": 4,
                "year_level_name": "KG-2",
                "periods": []
            }
        ]
    }
];
  const getAllTeacherAssignment = async () => {
    try {
      const allAssignments = await fetchAllTeacherAssignments();
      setTeacherAssignment(allAssignments);
    } catch (error) {
      console.log("Failed to load teacher. Please try again.");
    }
  };
  useEffect(() => {
    getAllTeacherAssignment();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-3">
      {/* CARD  */}
      {dummyData.length > 0 ? (
        dummyData.map((data) => (
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
        <div>No assignments found</div>
      )}

      {/* {CARD ENDS} */}
    </div>
  );
};
