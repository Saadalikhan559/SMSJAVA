import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchStudentYearLevelByClass } from "../../services/api/Api";
import axios from "axios";

export const ClassStudent = () => {
  const { classLevel } = useParams();
  const [classStudent, setClassStudent] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [attendanceDate, setAttendanceDate] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState("present");
  const [individualDates, setIndividualDates] = useState({});
  const [individualStatuses, setIndividualStatuses] = useState({});
  const [teacherID, setTeacherID] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("teacher_id");
    setTeacherID(token);
  }, []);

  const getClassStudents = async () => {
    try {
      const data = await fetchStudentYearLevelByClass(classLevel);
      setClassStudent(data);
      // Initialize individual dates and statuses
      const initialDates = {};
      const initialStatuses = {};
      data.forEach((student) => {
        initialDates[student.id] = "";
        initialStatuses[student.id] = "present";
      });
      setIndividualDates(initialDates);
      setIndividualStatuses(initialStatuses);
    } catch (error) {
      console.log("Failed to fetch students", error);
    }
  };

  useEffect(() => {
    getClassStudents();
  }, [classLevel]);

  const handleStudentSelect = (studentId, isChecked) => {
    if (isChecked) {
      setSelectedStudents([...selectedStudents, studentId]);
    } else {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
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
 
  console.log(selectedStudents);
 const submitBulkAttendance = async () => {
  try {
    if (!attendanceDate) {
      alert("Please select a date");
      return;
    }

    if (!teacherID) return;

    // Prepare the base payload
    const payload = {
      teacher_id: teacherID,
      marked_at: attendanceDate,
    };

    // Use the attendanceStatus from the modal to determine which field to set
    if (attendanceStatus === "present") {
      payload.P = selectedStudents;
    } else if (attendanceStatus === "absent") {
      payload.A = selectedStudents;
    } else if (attendanceStatus === "leave") {
      payload.L = selectedStudents;
    }

    // Make the API call
    const response = await axios.post(
      "https://8c1zb9f3-8000.inc1.devtunnels.ms/a/multiple-attendance/",
      payload
    );

    console.log("Bulk attendance submitted successfully:", response.data);

    // Reset and close
    setSelectedStudents([]);
    setShowModal(false);
    setAttendanceDate("");
    setAttendanceStatus("present");

    // Uncheck all checkboxes
    document
      .querySelectorAll('input[type="checkbox"]')
      .forEach((checkbox) => {
        checkbox.checked = false;
      });

    // Show success message or refresh data
    alert("Attendance marked successfully!");
    window.location.reload();
  } catch (error) {
    console.error("Error submitting bulk attendance:", error);
    alert(error.response?.data?.error || "An error occurred");
  }
};

  const submitIndividualAttendance = async (studentId) => {
    try {
      if (!individualDates[studentId]) {
        alert("Please select a date");
        return;
      }

      if (!teacherID) return;

      // Prepare the base payload
      const payload = {
        teacher_id: teacherID,
        marked_at: individualDates[studentId],
      };

      // Add status-specific fields only if they have values
      const status = individualStatuses[studentId];
      if (status === "present") {
        payload.P = [studentId];
      } else if (status === "absent") {
        payload.A = [studentId];
      } else if (status === "leave") {
        payload.L = [studentId];
      }

      // Make the API call
      const response = await axios.post(
        "https://8c1zb9f3-8000.inc1.devtunnels.ms/a/multiple-attendance/",
        payload
      );

      console.log(
        "Individual attendance submitted successfully:",
        response.data
      );
      alert("Attendance marked successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error submitting individual attendance:", error);
      alert(error.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-2">
          Students in {classLevel}{" "}
          <i className="fa-solid fa-clipboard-user ml-2"></i>
        </h2>

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
                          handleStudentSelect(student.id, e.target.checked)
                        }
                      />
                    </td>
                    <td className="px-4 py-3">{student.student_name}</td>
                    <td className="px-4 py-3">{student.level_name}</td>
                    <td className="px-4 py-3">{student.year_name}</td>
                    <td className="px-4 py-3">
                      <input
                        type="date"
                        value={individualDates[student.id] || ""}
                        onChange={(e) =>
                          handleIndividualDateChange(student.id, e.target.value)
                        }
                        className="border border-gray-300 rounded-md px-2 py-1 w-full"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={individualStatuses[student.id] || "present"}
                        onChange={(e) =>
                          handleIndividualStatusChange(
                            student.id,
                            e.target.value
                          )
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
                        onClick={() => submitIndividualAttendance(student.id)}
                        className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
                        disabled={!individualDates[student.id]}
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

        {selectedStudents.length >= 2 && (
          <button
            onClick={handleBulkAttendance}
            className="mb-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-300"
          >
            Mark Attendance for Selected ({selectedStudents.length})
          </button>
        )}
      </div>

      {/* Custom Modal for Bulk Attendance */}
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
