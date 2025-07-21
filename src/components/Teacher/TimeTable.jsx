import { useState, useEffect } from "react";
import axios from "axios";
import { constants } from "../../global/constants";

const TimeTable = () => {
  const [accessToken, setAccessToken] = useState("");
  const [timetable, settimetable] = useState([]);

  const BASE_URL = constants.baseUrl;

  useEffect(() => {
    const tokenData = localStorage.getItem("authTokens");

    if (tokenData) {
      try {
        const tokens = JSON.parse(tokenData);
        if (tokens?.access) {
          setAccessToken(tokens.access);
        }
      } catch (error) {
        console.error("Error parsing auth tokens:", error);
      }
    }
  }, []); // Removed accessToken from dependencies to prevent infinite loop

  const fetchtimetable = async () => {
    if (!accessToken) {
      console.log("Access token not available yet");
      return;
    }

    try {
      const response = await axios.get(
        `${BASE_URL}/d/Exam-Schedule/get_timetable/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken.trim()}`, // Added trim() to remove any whitespace
          },
        }
      );
      settimetable(response.data); // Make sure to use response.data
    } catch (err) {
      console.error("Failed to fetch timetable:", err);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchtimetable();
    }
  }, [accessToken]);

  // Static payload data
  const timetableData = timetable;

  console.log(timetableData);

  // Format time to 12-hour format
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-2">
          Examination Time Table
        </h2>

        {timetableData.map((classData) => (
          <div key={classData.id} className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-700">
                Class: {classData.class}
              </h3>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Academic Year:</span>{" "}
                {classData.school_year} |
                <span className="font-medium ml-2">Exam Type:</span>{" "}
                {classData.exam_type}
              </div>
            </div>

            <div className="w-full overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-blue-600 text-white">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                          Subject
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                          Day
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                          Start Time
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                          End Time
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                          Duration
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {classData.papers.map((paper, index) => {
                        const start = new Date(
                          `2000-01-01T${paper.start_time}`
                        );
                        const end = new Date(`2000-01-01T${paper.end_time}`);
                        const durationMs = end - start;
                        const durationHours = Math.floor(
                          durationMs / (1000 * 60 * 60)
                        );
                        const durationMinutes = Math.floor(
                          (durationMs % (1000 * 60 * 60)) / (1000 * 60)
                        );
                        const duration = `${
                          durationHours > 0 ? `${durationHours} hr` : ""
                        } ${
                          durationMinutes > 0 ? `${durationMinutes} min` : ""
                        }`.trim();

                        return (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 text-nowrap capitalize">
                              {paper.subject_name}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700 text-nowrap">
                              {new Date(paper.exam_date).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700 text-nowrap">
                              {paper.day}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700 text-nowrap">
                              {formatTime(paper.start_time)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700 text-nowrap">
                              {formatTime(paper.end_time)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700 text-nowrap">
                              {duration}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeTable;
