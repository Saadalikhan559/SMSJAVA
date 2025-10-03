import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { allRouterLink } from "../../router/AllRouterLinks";
import { fetchTeachers, saveTeacherAttendance, fetchTeacherAttendanceRecords } from "../../services/api/Api";

const TeacherAttendance = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [savingAll, setSavingAll] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const [teachersData, attendanceRecords] = await Promise.all([
          fetchTeachers(),
          fetchTeacherAttendanceRecords(),
        ]);

        setTeachers(teachersData);

        const today = new Date().toISOString().split("T")[0];
        const initial = {};

        teachersData.forEach((t) => {
          const record = attendanceRecords.find(
            (r) => r.teacher === t.id && r.date === today
          );
          if (record) {
            initial[t.id] = { date: record.date, status: record.status, marked: true };
          } else {
            initial[t.id] = { date: today, status: "", marked: false };
          }
        });

        setAttendance(initial);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError(true);
        setLoading(false);
      }
    };

    getData();
  }, []);

  const handleChange = (id, field, value) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value, marked: false },
    }));
  };

  // single teacher attendance
  const handleSave = async (teacher) => {
    if (!attendance[teacher.id]?.status) {
      setAlertMessage("Please select status before marking Attendance!");
      setShowAlert(true);
      return;
    }

    try {
      await saveTeacherAttendance([teacher], attendance);

      setAttendance((prev) => ({
        ...prev,
        [teacher.id]: { ...prev[teacher.id], marked: true },
      }));

      setAlertMessage(
        `Attendance Marked Successfully for ${teacher.first_name} ${teacher.last_name}`
      );
      setShowAlert(true);
    } catch {
      setAlertMessage("Failed to mark Attendance");
      setShowAlert(true);
    }
  };

  // Multiple teacher attendance
  const handleSaveAll = async () => {
    const unsavedTeachers = teachers.filter(
      (t) => !attendance[t.id]?.marked && attendance[t.id]?.status
    );

    if (unsavedTeachers.length === 0) {
      setAlertMessage("Please select status before marking Attendance!");
      setShowAlert(true);
      return;
    }

    setSavingAll(true);
    try {
      await saveTeacherAttendance(unsavedTeachers, attendance);

      const updated = { ...attendance };
      unsavedTeachers.forEach((t) => {
        updated[t.id] = { ...updated[t.id], marked: true };
      });
      setAttendance(updated);

      setAlertMessage("Attendance Marked Successfully for Selected Teachers!");
      setShowAlert(true);
    } catch {
      setAlertMessage("Failed to Mark Attendance");
      setShowAlert(true);
    } finally {
      setSavingAll(false);
    }
  };

  const filteredTeachers = teachers
    .filter((t) =>
      `${t.first_name} ${t.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      `${a.first_name} ${a.last_name}`.localeCompare(
        `${b.first_name} ${b.last_name}`
      )
    );


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
        <p className="text-lg text-red-400 font-medium">Failed to load data, Try Again</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen mb-20">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 sm:p-6">
        <div className=" flex justify-end">
          <Link
            to={allRouterLink.teacherAttendanceRecord}
            className="font-bold text-xl cursor-pointer hover:underline flex items-center gap-2 textTheme"
          >
            Attendance Record <span>&rarr;</span>
          </Link>
        </div>
        <div className="mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white text-center mb-2">
            <i className="fa-solid fa-clipboard-user w-5"></i> Teacher Attendance
          </h1>
        </div>

        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-4 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.trimStart())}
            className="border px-3 py-2 rounded w-full sm:w-64 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto no-scrollbar max-h-[70vh] rounded-lg mb-20">
          <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700 text-xs sm:text-sm">
            <thead className="bgTheme text-white z-2 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-center text-sm font-semibold">S.NO</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Teacher Name</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Email</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Date</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Status</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher, index) => (
                  <tr
                    key={teacher.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 text-center transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{index + 1}</td>

                    <td className="px-4 py-3 font-bold capitalize text-gray-700 dark:text-gray-300 text-nowrap">
                      {teacher.first_name} {teacher.last_name}
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{teacher.email}</td>
                    <td className="px-4 py-3">
                      <input
                        type="date"
                        value={attendance[teacher.id]?.date || ""}
                        onChange={(e) => handleChange(teacher.id, "date", e.target.value)}
                        max={new Date().toISOString().split("T")[0]}
                        className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 p-1 rounded text-center"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={attendance[teacher.id]?.status || ""}
                        onChange={(e) => handleChange(teacher.id, "status", e.target.value)}
                        className="select select-bordered w-full focus:outline-none text-nowrap border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                      >
                        <option value="">-- Select Status --</option>
                        <option value="absent">Absent</option>
                        <option value="leave">Leave</option>
                        <option value="present">Present</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleSave(teacher)}
                        disabled={attendance[teacher.id]?.marked}
                        className={`btn w-28 ${attendance[teacher.id]?.marked
                          ? "bg-gray-400 textTheme cursor-not-allowed"
                          : "bgTheme text-white"
                          }`}
                      >
                        {attendance[teacher.id]?.marked ? "Marked" : "Save"}
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-6 text-center text-red-600 dark:text-red-400"
                  >
                    No teachers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Save All */}
          <br />
          {filteredTeachers.length > 0 && (
            <div className="flex w-full justify-center mt-4">
              <button
                onClick={handleSaveAll}
                className="btn bgTheme text-white w-40"
              >
                {savingAll && <i className="fa-solid fa-spinner fa-spin mr-2"></i>}
                {savingAll ? " " : "Save All"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Alert Modal */}
      {showAlert && (
        <dialog className="modal modal-open">
          <div className="modal-box bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
            <h3 className="font-bold text-lg">Teacher Attendance</h3>
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
  );
};

export default TeacherAttendance;

