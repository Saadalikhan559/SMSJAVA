import { useState, useEffect } from "react";
import { constants } from '../../global/constants';
import axios from "axios";
import { fetchYearLevels } from "../../services/api/Api";

const ViewExamPaper = () => {
  const [accessToken, setAccessToken] = useState("");
  const [examPaper, setExamPaper] = useState([]);
   const [selectedClass, setSelectedClass] = useState("");
  const [yearLevels, setYearLevels] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  

  const BASE_URL = constants.baseUrl;


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

 const filterData = examPaper.filter((detail) =>
    detail.year_level_name.toLowerCase()
      .includes(selectedClass.toLowerCase()) 
  );
 const filterBySearch = filterData.filter((detail) =>
    detail.subject_name.toLowerCase()
      .includes(searchInput.toLowerCase()) 
  );


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
        <div className="mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-4">
            Examination Papers
          </h1>
        </div>
       
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
            className="border px-3 py-2 rounded w-full sm:w-64"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
              </div>
           
            
         
        </div>
       

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
                </thead> {filterData.length === 0 ? (
          <p className="text-gray-600">No Examination Papers found.</p>
        ) : ( <tbody className="divide-y divide-gray-200 bg-white">
                  
                  {filterBySearch.map((paper) => (
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
                </tbody>)}
               
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewExamPaper;