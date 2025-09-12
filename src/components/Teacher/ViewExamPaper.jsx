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
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-6">
          Examination Papers
        </h1>

        <div className="flex flex-wrap justify-between items-end gap-4 mb-4 w-full border-b pb-4">
          <div className="flex flex-col w-full sm:w-xs">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Select Class:
            </label>
            <select
              className="select select-bordered w-full focus:outline-none"
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

          <div className="flex flex-col w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search Subject Name..."
              className="border px-3 py-2 rounded w-full sm:w-64"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </div>

        <div className="w-full overflow-x-auto no-scrollbar rounded-lg max-h-[70vh]">
          <div className="inline-block min-w-full align-middle">
            <div className="shadow-sm ring-1 ring-black ring-opacity-5">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bgTheme text-white sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                      Subject
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                      Class
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                      Exam Type
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                      Teacher
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                      Total Marks
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                      Paper Code
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                      Academic Year
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white">
                  {filterBySearch.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="px-4 py-6 text-center text-gray-600"
                      >
                        No Examination Papers found.
                      </td>
                    </tr>
                  ) : (
                    filterBySearch.map((paper) => (
                      <tr key={paper.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 capitalize">
                          {paper.subject_name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 capitalize">
                          {paper.year_level_name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {paper.exam_name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 capitalize">
                          {paper.teacher_name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {paper.total_marks}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {paper.paper_code}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {paper.year}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          <a
                            href={paper.uploaded_file.replace(
                              "http://localhost:8000",
                              constants.baseUrl
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline"
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

