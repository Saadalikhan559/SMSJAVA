import React, { useEffect, useState } from "react";
import { fetchTeacherAttendanceRecords } from "../../services/api/Api";
import { updateTeacherAttendance } from "../../services/api/Api";

const TeacherAttendanceRecord = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchDate, setSearchDate] = useState("");
  const [searchName, setSearchName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTeacherAttendanceRecords();
        setRecords(data);
        setSearchDate(today);
      } catch (err) {
        console.error(err);
        setError("Failed to load attendance records");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [today]);

  const filteredRecords = records.filter((r) => {
    const matchesDate = searchDate ? r.date === searchDate : true;
    const matchesName = searchName
      ? r.teacher_name.toLowerCase().includes(searchName.toLowerCase())
      : true;
    return matchesDate && matchesName;
  });

  const openModal = (record) => {
    setSelectedRecord(record);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedRecord(null);
  };

  const handleStatusChange = (e) => {
    setSelectedRecord({ ...selectedRecord, status: e.target.value });
  };

  const updateStatus = async () => {
    if (!selectedRecord) return;
    setUpdating(true);
    try {
      await updateTeacherAttendance(selectedRecord.id, selectedRecord);

      setRecords((prev) =>
        prev.map((r) =>
          r.id === selectedRecord.id ? { ...r, status: selectedRecord.status } : r
        )
      );
      setAlertMessage("Attendance updated successfully!");
      setShowAlert(true);
      closeModal();
    } catch (err) {
      console.error(err);
      setAlertMessage("Failed to update attendance");
      setShowAlert(true);
    } finally {
      setUpdating(false);
    }
  };

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
        <p className="text-lg text-red-400 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-4 sm:p-6">
        <div className="mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-2">
            <i className="fa-solid fa-clipboard-list w-5"></i> Attendance Records
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b pb-2">
          <div className="flex flex-col justify-between sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">

            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="border px-3 py-2 rounded w-full sm:w-64"
            />

          </div>
          <input
            type="text"
            placeholder="Enter teacher name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="border px-3 py-2 rounded w-full sm:w-64"
          />

        </div>

        <div className="w-full overflow-x-auto no-scrollbar max-h-[70vh] rounded-lg">
          <table className="min-w-full divide-y divide-gray-300 text-xs sm:text-sm">
            <thead className="bgTheme text-white z-2 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-center text-sm font-semibold">Teacher Name</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Date</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Status</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-gray-200 bg-white">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 text-center">
                    <td className="px-4 py-3 font-bold capitalize text-gray-700">
                      {record.teacher_name}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{record.date}</td>
                    <td className="px-4 py-3 capitalize">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-md shadow-sm text-sm font-medium
                        ${record.status.toLowerCase() === "present"
                            ? "bg-green-100 text-green-800"
                            : record.status.toLowerCase() === "leave"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-600"
                          }`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openModal(record)}
                        className="inline-flex items-center px-3 py-1 border border-yellow-300 rounded-md shadow-sm text-sm font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"

                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-6 text-center text-sm text-gray-500">
                    No records found {searchDate ? `for ${searchDate}` : ""}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50" onClick={closeModal} />
          <div className="relative bg-white rounded-lg p-6 w-11/12 sm:w-96 z-10">
            <h3 className="text-lg font-semibold mb-4">Edit Attendance</h3>
            <p className="mb-2 font-medium capitalize">{selectedRecord.teacher_name}</p>
            <p className="mb-4 text-gray-500">{selectedRecord.date}</p>
            <select
              value={selectedRecord.status}
              onChange={handleStatusChange}
              className="w-full border px-3 py-2 rounded mb-4"
            >
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="leave">Leave</option>
            </select>
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={updateStatus}
                className="btn bgTheme text-white w-28"
              >
                {updating ? <i className="fa-solid fa-spinner fa-spin mr-2"></i> : null}
                {updating ? " " : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAlert && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Teacher Attendance</h3>
            <p className="py-4 capitalize">{alertMessage}</p>
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

export default TeacherAttendanceRecord;
