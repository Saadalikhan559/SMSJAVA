import { useState, useEffect, useContext } from "react";
import { constants } from "../../global/constants";
import { fetchYearLevels } from "../../services/api/Api";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { allRouterLink } from "../../router/AllRouterLinks";

const ViewExamPaper = () => {
  const { axiosInstance } = useContext(AuthContext);

  const [examPaper, setExamPaper] = useState([]);
  const [yearLevels, setYearLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [fileErrorModal, setFileErrorModal] = useState(false);

  // Fetch year levels
  const getYearLevels = async () => {
    try {
      const data = await fetchYearLevels();
      setYearLevels(data);
    } catch (err) {
      console.error("Error fetching year levels:", err);
    }
  };

  // Fetch exam papers
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
    getYearLevels();
    fetchExamPaper();
  }, []);

  // Prepare unique teacher and year lists for dropdowns
  const teacherList = [...new Set(examPaper.map((p) => p.teacher_name))];
  const yearList = [...new Set(examPaper.map((p) => p.year))];

  // Reset all filters
  const resetFilters = () => {
    setSelectedClass("");
    setSelectedTeacher("");
    setSelectedYear("");
    setSearchInput("");
  };

  // Filter and sort data
  const filteredData = examPaper
    .filter((paper) =>
      paper.year_level_name.toLowerCase().includes(selectedClass.toLowerCase()) &&
      paper.teacher_name.toLowerCase().includes(selectedTeacher.toLowerCase()) &&
      paper.year.toString().includes(selectedYear.toString()) &&
      paper.subject_name.toLowerCase().includes(searchInput.toLowerCase())
    )
    .sort((a, b) => a.subject_name.localeCompare(b.subject_name));

  // Handle View Paper click
  const handleViewPaper = async (filePath) => {
    if (!filePath) {
      setFileErrorModal(true);
      return;
    }

    const url = filePath.replace("http://localhost:8000", constants.baseUrl);

    try {
      await axiosInstance.get(url, { responseType: "blob" });
      window.open(url, "_blank")
    } catch (err) {
      setFileErrorModal(true);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
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
    <div className="min-h-screen p-5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="bg-white dark:bg-gray-800 max-w-7xl p-6 rounded-lg shadow-lg mx-auto">
        <Link
          to={`${allRouterLink.UpdateExamPaper}`}
          className="font-bold text-xl justify-end cursor-pointer hover:underline flex items-center gap-2 textTheme dark:text-blue-400"
        >
          Update Exam Paper <span>&rarr;</span>
        </Link>

        {/* Title */}
        <div className="mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-4">
            <i className="fa-solid fa-file-lines mr-2"></i> Examination Papers
          </h1>
        </div>

        {/* Filter Section */}
        <div className="w-full px-5">
          <div className="flex flex-wrap justify-between items-end gap-4 mb-6 w-full border-b border-gray-300 dark:border-gray-700 pb-4">
            <div className="flex flex-wrap items-end gap-4 w-full sm:w-auto">
              {/* Class Filter */}
              <div className="flex flex-col w-full sm:w-auto">
                <label className="text-sm font-medium mb-1">Class:</label>
                <select
                  className="select select-bordered w-full focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
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

              {/* Teacher Filter */}
              <div className="flex flex-col w-full sm:w-auto">
                <label className="text-sm font-medium mb-1">Teacher:</label>
                <select
                  className="select select-bordered w-full focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                >
                  <option value="">All Teachers</option>
                  {teacherList.map((teacher, index) => (
                    <option key={index} value={teacher}>{teacher}</option>
                  ))}
                </select>
              </div>

              {/* Academic Year Filter */}
              <div className="flex flex-col w-full sm:w-auto">
                <label className="text-sm font-medium mb-1">Academic Year:</label>
                <select
                  className="select select-bordered w-full focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <option value="">All Years</option>
                  {yearList.map((year, index) => (
                    <option key={index} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Reset Button */}
              <div className="mt-1 w-full sm:w-auto">
                <button
                  onClick={resetFilters}
                  className="btn bgTheme text-white"
                >
                  Reset Filters
                </button>
              </div>
            </div>

            {/* Right Side: Search */}
            <div className="flex items-end gap-2 w-full sm:w-auto justify-end">
              <div className="flex flex-col w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search by Subject"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value.trimStart())}
                  className="border px-3 py-2 rounded w-full sm:w-64 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto rounded-lg no-scrollbar max-h-[70vh]">
          <table className="min-w-full table-auto divide-y divide-gray-300 dark:divide-gray-700">
            <thead className="bgTheme text-white sticky top-0 z-2">
              <tr>
                <th className="px-4 py-3 text-left whitespace-nowrap">Subject</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">Class</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">Exam Type</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">Teacher</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">Total Marks</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">Paper Code</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">Academic Year</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-500 dark:text-gray-400">No Examination Papers found.</td>
                </tr>
              ) : (
                filteredData.map((paper) => (
                  <tr key={paper.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">{paper.subject_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 capitalize">{paper.year_level_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{paper.exam_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 capitalize">{paper.teacher_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{paper.total_marks}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{paper.paper_code}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{paper.year}</td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-500 hover:underline"
                        onClick={() => handleViewPaper(paper.uploaded_file)}
                      >
                        View Paper
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/*  Modal */}
      {fileErrorModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <h2 className="text-lg font-bold mb-4">File Not Found</h2>
            <p className="mb-4">Sorry, this exam paper is not available.</p>
            <button
              className="btn bgTheme text-white"
              onClick={() => setFileErrorModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewExamPaper;

