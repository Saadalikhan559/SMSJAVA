import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchStudentYearLevelByClass } from "../../services/api/Api";
import axios from "axios";
import { constants } from "../../global/constants";

export const ClassStudent = () => {
  const { classLevel, Year_level_id } = useParams();
  const [classStudent, setClassStudent] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [attendanceDate, setAttendanceDate] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState("present");
  const [individualDates, setIndividualDates] = useState({});
  const [individualStatuses, setIndividualStatuses] = useState({});
  const [teacherID, setTeacherID] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const year_level_id = Year_level_id;
  const BASE_URL = constants.baseUrl;

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const token = localStorage.getItem("teacher_id");
    setTeacherID(token);
  }, []);

  const getClassStudents = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchStudentYearLevelByClass(year_level_id);
      setClassStudent(data);
      const initialDates = {};
      const initialStatuses = {};
      data.forEach((student) => {
        initialDates[student.student_id] = "";
        initialStatuses[student.student_id] = "present";
      });
      setIndividualDates(initialDates);
      setIndividualStatuses(initialStatuses);
    } catch (err) {
      console.error("Failed to fetch students", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getClassStudents();
  }, [classLevel]);

  const handleStudentSelect = (studentId, isChecked) => {
    if (isChecked) {
      setSelectedStudents([...selectedStudents, studentId]);
    } else {
      setSelectedStudents(
        selectedStudents.filter((student_id) => student_id !== studentId)
      );
    }
  };

  const handleBulkAttendance = () => {
    if (selectedStudents.length >= 2) {
      setShowModal(true);
    }
  };

  const handleIndividualDateChange = (studentId, date) => {
    setIndividualDates((prev) => ({
      ...prev,
      [studentId]: date,
    }));
  };

  const handleIndividualStatusChange = (studentId, status) => {
    setIndividualStatuses((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const submitBulkAttendance = async () => {
    try {
      if (!attendanceDate) {
        alert("Please select a date");
        return;
      }
      if (!teacherID || !year_level_id) return;

      const payload = { teacher_id: teacherID, marked_at: attendanceDate, year_level_id };

      if (attendanceStatus === "present") payload.P = selectedStudents;
      else if (attendanceStatus === "absent") payload.A = selectedStudents;
      else if (attendanceStatus === "leave") payload.L = selectedStudents;

      await axios.post(`${BASE_URL}/a/multiple-attendance/`, payload);

      setSelectedStudents([]);
      setShowModal(false);
      setAttendanceDate("");
      setAttendanceStatus("present");

      document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
        checkbox.checked = false;
      });

      alert("Attendance marked successfully!");
      window.location.reload();
    } catch (err) {
      console.error("Error submitting bulk attendance:", err);
      alert(err.response?.data?.error || "An error occurred");
    }
  };

  const submitIndividualAttendance = async (studentId) => {
    try {
      if (!individualDates[studentId]) {
        alert("Please select a date");
        return;
      }
      if (!teacherID) return;

      const payload = { teacher_id: teacherID, marked_at: individualDates[studentId], year_level_id };
      const status = individualStatuses[studentId];
      if (status === "present") payload.P = [studentId];
      else if (status === "absent") payload.A = [studentId];
      else if (status === "leave") payload.L = [studentId];

      await axios.post(`${BASE_URL}/a/multiple-attendance/`, payload);

      alert("Attendance marked successfully!");
      window.location.reload();
    } catch (err) {
      console.error("Error submitting individual attendance:", err);
      alert(err.response?.data?.error || "An error occurred");
    }
  };

  // Loader UI
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

  // Error UI
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
        <i className="fa-solid fa-triangle-exclamation text-5xl text-red-400 mb-4"></i>
        <p className="text-lg text-red-400 font-medium">
          Failed to load data, Try Again
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-2">
          Students in {classLevel}{" "}
          <i className="fa-solid fa-clipboard-user ml-2"></i>
        </h2>

        {selectedStudents.length >= 2 && (
          <button
            onClick={handleBulkAttendance}
            className="mb-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-300"
          >
            Mark Attendance for Selected ({selectedStudents.length})
          </button>
        )}

        {classStudent.length === 0 ? (
          <p className="text-gray-600">No students found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-300 rounded-lg overflow-hidden">
              <thead className="bgTheme text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Select</th>
                  <th className="px-4 py-3 text-left">Student Name</th>
                  <th className="px-4 py-3 text-left">Level</th>
                  <th className="px-4 py-3 text-left">Academic Year</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Attendance</th>
                  <th className="px-4 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {classStudent.map((student) => (
                  <tr key={student.id}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="border border-gray-300 rounded-md px-2 py-1 w-full"
                        onChange={(e) =>
                          handleStudentSelect(student.student_id, e.target.checked)
                        }
                      />
                    </td>
                    <td className="px-4 py-3">{student.student_name}</td>
                    <td className="px-4 py-3">{student.level_name}</td>
                    <td className="px-4 py-3">{student.year_name}</td>
                    <td className="px-4 py-3">
                      <input
                        type="date"
                        value={individualDates[student.student_id] || ""}
                        onChange={(e) =>
                          handleIndividualDateChange(student.student_id, e.target.value)
                        }
                        className="border border-gray-300 rounded-md px-2 py-1 w-full"
                        max={getTodayDate()}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={individualStatuses[student.student_id] || "present"}
                        onChange={(e) =>
                          handleIndividualStatusChange(student.student_id, e.target.value)
                        }
                        className="border border-gray-300 rounded-md px-2 py-1 w-full"
                      >
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="leave">Leave</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => submitIndividualAttendance(student.student_id)}
                        className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
                        disabled={!individualDates[student.student_id]}
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm  flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              Mark Attendance for {selectedStudents.length} Students
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                required
                max={getTodayDate()}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={attendanceStatus}
                onChange={(e) => setAttendanceStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="leave">Leave</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={submitBulkAttendance}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                disabled={!attendanceDate}
              >
                Mark Attendance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
