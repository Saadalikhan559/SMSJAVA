import React, { useState, useEffect } from "react";
import { fetchAbsentTeachers, assignSubstitute } from "../../services/api/Api";

const YEAR_LEVEL_MAP = {
  "Pre Nursery":1,
  "Nursery": 2,
  "LKG": 3,
  "UKG": 4,
  "class 1": 5,
  "class 2": 6,
  "class 3": 7,
  "class 4": 8,
  "class 5": 9,
  "class 6": 10,
  "class 7": 11,
  "class 8": 12,
  "class 9": 13,
  "class 10": 14,
  "class 11": 15,
  "class 12": 16,
};

const TeacherSubstitute = () => {
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false); // page loader
  const [submitLoading, setSubmitLoading] = useState(false); // modal submit loader
  const [error, setError] = useState(false); // fetch error
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const formatTeachers = (absentTeachers, date) => {
    return absentTeachers.map((item) => ({
      id: item.absent_teacher.id,
      first_name: item.absent_teacher.name.split(" ")[0],
      last_name: item.absent_teacher.name.split(" ")[1] || "",
      email: item.absent_teacher.email,
      phone_no: item.absent_teacher.phone_no || null,
      year_levels: item.periods.map((p) => ({
        id: YEAR_LEVEL_MAP[p.year_level],
        level_name: p.year_level,
        periods: [
          {
            id: p.period_id,
            name: p.period_name,
            subject: p.subject,
            year_level_id: YEAR_LEVEL_MAP[p.year_level],
            same_class_free_teachers: p.same_class_free_teachers.map((ft) => ({
              ...ft,
              selected: false,
            })),
            other_class_free_teachers: p.other_class_free_teachers.map((ft) => ({
              ...ft,
              selected: false,
            })),
            showSameClass: true,
          },
        ],
      })),
      attendance: {
        date,
        status: "absent",
      },
    }));
  };

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        setError(false);
        const absentTeachers = await fetchAbsentTeachers(selectedDate);
        setTeachers(formatTeachers(absentTeachers, selectedDate));
      } catch (err) {
        console.error(err);
        setError(true);
        setTeachers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, [selectedDate]);

  const handleAssign = async (teacherId, period, substitute, closeModal = true) => {
    const payload = {
      absent_teacher: teacherId,
      substitute_teacher: substitute.id,
      period: period.name,
      date: selectedDate,
      year_level: Number(period.year_level_id),
    };

    try {
      await assignSubstitute(payload);
      if (closeModal) {
        setAlertMessage(
          `${substitute.first_name} ${substitute.last_name} assigned for ${period.name}`
        );
        setShowAlert(true);
        setSelectedTeacher(null);
      }
      const updatedTeachers = await fetchAbsentTeachers(selectedDate);
      setTeachers(formatTeachers(updatedTeachers, selectedDate));
    } catch (err) {
      console.error(err.response?.data || err);
      if (closeModal) {
        setAlertMessage(
          `Failed to assign substitute. ${err.response?.data?.detail || ""}`
        );
        setShowAlert(true);
      }
    }
  };

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
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-4 sm:p-6">
         <div className="mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-4">
           <i className="fa-solid fa-chalkboard-user"></i> Teacher Substitute 
          </h1>
        </div>
        <div >
        
          <div className="flex flex-col sm:flex-row items-start sm:items-center  justify-between gap-3 w-full sm:w-auto mb-6 border-b pb-2">

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full sm:w-auto"
            />
            <div className="relative w-full sm:w-72">
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
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-sm"
                placeholder="Search by teacher, email or class..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto rounded-lg">
          <table className="min-w-full divide-y divide-gray-300 text-xs sm:text-sm">
            <thead className="bgTheme text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Teacher</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Classes</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Attendance Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold pl-12">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-4 py-6 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bgTheme rounded-full animate-bounce"></div>
                        <div className="w-3 h-3 bgTheme rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                        <div className="w-3 h-3 bgTheme rounded-full animate-bounce [animation-delay:-0.4s]"></div>
                      </div>
                      <p className="mt-2 text-gray-500 text-sm">Loading data...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700 capitalize font-bold text-nowrap">
                      {teacher.first_name} {teacher.last_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{teacher.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {teacher.year_levels.map((level) =>
                        level.periods.map((period) => (
                          <div key={period.id} className="text-gray-500 ml-2 text-nowrap">
                            {level.level_name}: {period.name} ({period.subject})
                          </div>
                        ))
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 capitalize">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 text-nowrap">
                        {teacher.attendance.status} ({teacher.attendance.date})
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      <button
                        onClick={() => setSelectedTeacher(teacher)}
                        className="inline-flex items-center px-3 py-1 border border-yellow-300 rounded-md shadow-sm text-sm font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100 text-nowrap"
                      >
                        Assign Substitute
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-6 text-center">
                    <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                      <i className="fa-solid fa-triangle-exclamation text-5xl text-red-400 mb-4"></i>
                      <p className="text-lg text-red-400 font-medium">
                        No matching teachers found
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {selectedTeacher && (
          <dialog id="subModal" className="modal modal-open">
            <div className="modal-box w-full sm:max-w-3xl relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 font-bold text-xl"
                onClick={() => setSelectedTeacher(null)}
              >
                ×
              </button>

              <h3 className="font-bold text-lg mb-4">
                Assign Substitute for{" "}
                <span className="capitalize">
                  {selectedTeacher.first_name} {selectedTeacher.last_name}
                </span>
              </h3>

              {selectedTeacher.year_levels.length > 0 ? (
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {selectedTeacher.year_levels.map((level) =>
                    level.periods.map((period) => (
                      <div key={period.id} className="border rounded-md p-3 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-800">
                            {level.level_name} - {period.name} ({period.subject})
                          </p>
                          <label className="text-sm flex items-center gap-2">
                            Show Same Class Teachers
                            <input
                              type="checkbox"
                              checked={period.showSameClass}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                const updatedLevels = selectedTeacher.year_levels.map((lvl) => ({
                                  ...lvl,
                                  periods: lvl.periods.map((p) =>
                                    p.id === period.id ? { ...p, showSameClass: checked } : p
                                  ),
                                }));
                                setSelectedTeacher({
                                  ...selectedTeacher,
                                  year_levels: updatedLevels,
                                });
                              }}
                            />
                          </label>
                        </div>

                        {(period.showSameClass
                          ? period.same_class_free_teachers
                          : period.other_class_free_teachers
                        )?.length > 0 ? (
                          <ul className="mt-2 text-sm text-gray-700 space-y-2">
                            {(period.showSameClass
                              ? period.same_class_free_teachers
                              : period.other_class_free_teachers
                            ).map((ft) => (
                              <li
                                key={ft.id}
                                className="flex items-center justify-between pb-1"
                              >
                                <div>
                                  <span className="capitalize">
                                    {ft.first_name} {ft.last_name}
                                  </span>
                                  <span> ({ft.email})</span>
                                </div>
                                <input
                                  type="checkbox"
                                  checked={ft.selected || false}
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    const updatedLevels = selectedTeacher.year_levels.map((lvl) => ({
                                      ...lvl,
                                      periods: lvl.periods.map((p) =>
                                        p.id === period.id
                                          ? {
                                              ...p,
                                              [period.showSameClass
                                                ? "same_class_free_teachers"
                                                : "other_class_free_teachers"]: p[
                                                period.showSameClass
                                                  ? "same_class_free_teachers"
                                                  : "other_class_free_teachers"
                                              ].map((t) =>
                                                t.id === ft.id ? { ...t, selected: checked } : t
                                              ),
                                            }
                                          : p
                                      ),
                                    }));

                                    setSelectedTeacher({
                                      ...selectedTeacher,
                                      year_levels: updatedLevels,
                                    });
                                  }}
                                />
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500">No free teachers available</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No periods assigned</p>
              )}

              <div className="modal-action">
                <button className="btn" onClick={() => setSelectedTeacher(null)}>
                  Close
                </button>

              <button
                className="btn bgTheme text-white w-30"
                onClick={async () => {
                  const assignments = [];

                  selectedTeacher.year_levels.forEach((level) => {
                    level.periods.forEach((period) => {
                      const source = period.showSameClass
                        ? period.same_class_free_teachers
                        : period.other_class_free_teachers;

                      source.forEach((ft) => {
                        if (ft.selected) {
                          assignments.push({ period, ft });
                        }
                      });
                    });
                  });

                    if (assignments.length === 0) {
                      setAlertMessage("No substitute teacher selected.");
                      setShowAlert(true);
                      return;
                    }

                    setSubmitLoading(true);
                    const results = [];
                    for (const item of assignments) {
                      try {
                        await handleAssign(selectedTeacher.id, item.period, item.ft, false);
                        results.push(
                          `${item.ft.first_name} ${item.ft.last_name} assigned for ${item.period.name}`
                        );
                      } catch (err) {
                        results.push(
                          `Failed to assign ${item.ft.first_name} ${item.ft.last_name} for ${item.period.name}`
                        );
                      }
                    }

                    setAlertMessage(results.join("\n"));
                    setShowAlert(true);
                    setSelectedTeacher(null);
                    setSubmitLoading(false);
                  }}
                >
                  {submitLoading && (
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
                      <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                      <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.4s]"></div>
                    </div>
                  )}
                  {!submitLoading && "Submit"}
                </button>
              </div>
            </div>
          </dialog>
        )}

      {/*  modal */}
      {showAlert && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Assign Substitute</h3>
            <p className="py-4 capitalize">
              {alertMessage.split("\n").map((line, idx) => (
                <span key={idx}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
            <div className="modal-action">
              <button
                className="btn bgTheme text-white w-30"
                onClick={() => setShowAlert(false)}
              >
                OK
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
    </div>
  );
};

export default TeacherSubstitute;
