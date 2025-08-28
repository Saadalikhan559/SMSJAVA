import { useState, useEffect } from "react";
import { constants } from '../../global/constants';
import axios from "axios";

const ViewExamPaper = () => {
  const [accessToken, setAccessToken] = useState("");
  const [examPaper, setExamPaper] = useState([]);

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
  }, []);

  const fetchExamPaper = async () => {
    if (!accessToken) {
      console.log("Access token not available yet");
      return;
    }

    try {
      const response = await axios.get(
        `${BASE_URL}/d/Exam-Paper/get_exampaper/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken.trim()}`, 
          },
        }
      );
      setExamPaper(response.data); 
    } catch (err) {
      console.error("Failed to fetch timetable:", err);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchExamPaper();
    }
  }, [accessToken]);

  // Static payload data
  const ExamPapers = examPaper;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-2">
          Examination Papers
        </h2>

        <div className="w-full overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bgTheme text-white">
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
                  {ExamPapers.map((paper) => (
                    <tr key={paper.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 text-nowrap capitalize">
                        {paper.subject_name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 text-nowrap capitalize">
                        {paper.year_level_name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 text-nowrap">
                        {paper.exam_name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 text-nowrap capitalize">
                        {paper.teacher_name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 text-nowrap">
                        {paper.total_marks}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 text-nowrap">
                        {paper.paper_code}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 text-nowrap">
                        {paper.year}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 text-nowrap">
                        <a 
                          href={`${BASE_URL}${paper.uploaded_file}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          View Paper
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewExamPaper;