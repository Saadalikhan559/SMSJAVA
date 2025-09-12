import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const TimeTable = () => {
  const [timetable, settimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { axiosInstance } = useContext(AuthContext);

  const fetchtimetable = async () => {
    try {
      setLoading(true);
      setError(false);

      const response = await axiosInstance.get(
        "/d/Exam-Schedule/get_timetable/"
      );
      settimetable(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch timetable:", err);
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchtimetable();
  }, []);

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
        <p className="text-lg text-red-400 font-medium">
          Failed to load data, Try Again
        </p>
      </div>
    );
  }

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
        <div className="mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-4 border-b pb-4">
            Examination Time Table
          </h1>
        </div>

        {timetable.map((classData) => (
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

            <div className="w-full overflow-x-auto rounded-lg no-scrollbar max-h-[70vh]">
  <div className="inline-block min-w-full align-middle">
    <div className="shadow-sm rounded-lg">
      <table className="min-w-full">
        <thead className="bgTheme text-white sticky top-0">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">Subject</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Day</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Start Time</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">End Time</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Duration</th>
          </tr>
        </thead>
        <tbody className=" divide-gray-200 bg-white">
          {timetable.map((classData) =>
            classData.papers.map((paper, index) => {
              const start = new Date(`2000-01-01T${paper.start_time}`);
              const end = new Date(`2000-01-01T${paper.end_time}`);
              const durationMs = end - start;
              const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
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
                    {new Date(paper.exam_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
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
            })
          )}
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
