import React, { useEffect, useState } from "react";
import { fetchAllTeacherClasses } from "../../services/api/Api";
import { useNavigate } from "react-router-dom";

export const Attendance = () => {
  const navigate = useNavigate();
  const [classList, setClassList] = useState([]);
  const [teacherID, setTeacherID] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("teacher_id");
    setTeacherID(token);
  }, []);

  const getAllTeacherStudents = async () => {
    if (!teacherID) return;
    setLoading(true);
    setError(false);

    try {
      const data = await fetchAllTeacherClasses(teacherID);
      setClassList(data);
    } catch (err) {
      console.log("failed to get all teacher students", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllTeacherStudents();
  }, [teacherID]);

  const handleNavigate = (className, yearLevelId) => {
    navigate(`/classStudents/${className}/${yearLevelId}`);
  };

  const handleShowAttendance = (className) => {
    navigate(`/fullAttendance/${className}`);
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

  // Main content
  return (
    <div className="p-6">
      <h2 className="text-4xl font-semibold mb-6 text-center">
        Attendance <i className="fa-solid fa-clipboard-user ml-2"></i>
      </h2>
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {classList.map((classItem) => (
          <div
            key={classItem.teacher_year_level_id}
            className="relative group bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-blue-200/50"
          >
            <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-[#5E35B1] via-[#684d9e] to-[#5424b4]"></div>
            <div className="p-6">
              <div className="flex items-start mb-5">
                <div className="p-3 rounded-xl bg-blue-100/50 textTheme group-hover:bg-blue-200/70 transition-colors duration-300">
                  <i className="fa-solid fa-chalkboard-user text-xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 ml-4 mt-1">
                  {classItem.year_level_name}
                </h3>
              </div>
              <div className="flex gap-4 mb-6 text-sm">
                <span className="px-3 py-1.5 bg-blue-50 textTheme rounded-full flex items-center">
                  <i className="fa-solid fa-users mr-2"></i>
                  students
                </span>
                <span className="px-3 py-1.5 bg-purple-50 textTheme rounded-full flex items-center">
                  <i className="fa-solid fa-calendar-day mr-2"></i>
                  Mon/Wed/Fri
                </span>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() =>
                    handleNavigate(
                      classItem.year_level_name,
                      classItem.year_level_id
                    )
                  }
                  className="w-full py-3 px-4 bg-gradient-to-r from-[#5E35B1] to-[#4314a1] hover:from-[#4614aa] hover:[#5E35B1] text-white rounded-xl font-medium flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-100"
                >
                  <i className="fa-solid fa-pen-clip mr-3"></i>
                  Take Attendance
                  <i className="fa-solid fa-arrow-right ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                </button>

                <button
                  onClick={() => handleShowAttendance(classItem.year_level_name)}
                  className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-xl font-medium flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:shadow-green-100"
                >
                  <i className="fa-solid fa-list-check mr-3"></i>
                  Show Attendance
                  <i className="fa-solid fa-arrow-right ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                </button>
              </div>
            </div>
            <div className="absolute -bottom-5 -right-5 w-20 h-20 bg-blue-300/10 rounded-full group-hover:bg-blue-400/20 transition-all duration-500"></div>
            <div className="absolute -top-5 -left-5 w-16 h-16 bg-purple-300/10 rounded-full group-hover:bg-purple-400/20 transition-all duration-700"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
