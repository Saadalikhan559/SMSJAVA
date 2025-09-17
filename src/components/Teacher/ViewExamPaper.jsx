import { useState, useEffect, useContext } from "react";
import { constants } from "../../global/constants";
import axios from "axios";
import { fetchYearLevels } from "../../services/api/Api";
import { AuthContext } from "../../context/AuthContext";

const ViewExamPaper = () => {
  const [examPaper, setExamPaper] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [yearLevels, setYearLevels] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { axiosInstance } = useContext(AuthContext);

  const getYearLevels = async () => {
    try {
      const data = await fetchYearLevels();
      setYearLevels(data);
    } catch (err) {
      console.error("Error fetching year levels:", err);
    }
  };

  useEffect(() => {
    getYearLevels();
  }, []);

  const fetchExamPaper = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await axiosInstance.get(`/d/Exam-Paper/get_exampaper/`);
      setExamPaper(response.data);
    } catch (err) {
      console.error("Failed to fetch exam papers:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExamPaper();
  }, []);

  const filterData = examPaper.filter((detail) =>
    detail.year_level_name.toLowerCase()
     .includes(selectedClass.toLowerCase())
  );
  const filterBySearch = filterData.filter((detail) =>
    detail.subject_name.toLowerCase()
    .includes(searchInput.toLowerCase())
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
        <p className="text-lg text-red-400 font-medium">
          Failed to load data, Try Again
        </p>
      </div>
    );
  }

return (
  <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
    <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white text-center mb-6">
        Examination Papers
      </h1>

      <div className="flex flex-wrap justify-between items-end gap-4 mb-4 w-full border-b pb-4 dark:border-gray-700">
        {/* Select Class */}
        <div className="flex flex-col w-full sm:w-xs">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Select Class:
          </label>
          <select
            className="select select-bordered w-full focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">All Classes</option>
            {yearLevels.map((level) => (
              <option key={level.id} value={level.level_name}>
                {level.level_name}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div className="flex flex-col w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search Subject Name..."
            className="border px-3 py-2 rounded w-full sm:w-64 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto no-scrollbar rounded-lg max-h-[70vh]">
        <div className="inline-block min-w-full align-middle">
          <div className="shadow-sm ring-1 ring-black ring-opacity-5 dark:ring-white/10">
            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
              <thead className="bgTheme text-white sticky top-0 z-10">
                <tr>
                  {[
                    "Subject",
                    "Class",
                    "Exam Type",
                    "Teacher",
                    "Total Marks",
                    "Paper Code",
                    "Academic Year",
                    "Actions",
                  ].map((title) => (
                    <th
                      key={title}
                      className="px-4 py-3 text-left text-sm font-semibold text-nowrap"
                    >
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                {filterBySearch.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-4 py-6 text-center text-gray-600 dark:text-gray-400"
                    >
                      No Examination Papers found.
                    </td>
                  </tr>
                ) : (
                  filterBySearch.map((paper) => (
                    <tr key={paper.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                        {paper.subject_name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 capitalize">
                        {paper.year_level_name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                        {paper.exam_name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 capitalize">
                        {paper.teacher_name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                        {paper.total_marks}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                        {paper.paper_code}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                        {paper.year}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <a
                          href={paper.uploaded_file.replace(
                            "http://localhost:8000",
                            constants.baseUrl
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-500 hover:underline"
                        >
                          View Paper
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
);

};

export default ViewExamPaper;

