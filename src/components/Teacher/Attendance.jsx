import React, { useEffect, useState } from "react";
import { fetchAllTeacherClasses } from "../../services/api/Api";
import { useNavigate } from "react-router-dom";

export const Attendance = () => {
  const navigate = useNavigate();
  const [classList, setClassList] = useState([]);
  const [teacherID, setTeacherID] = useState(null);



  useEffect(() => {
    const token = localStorage.getItem("teacher_id");
    setTeacherID(token);
  }, []);

  const getAllTeacherStudents = async () => {
    if (!teacherID) return; 
    
    try {
      const data = await fetchAllTeacherClasses(teacherID);
      setClassList(data);
    } catch (error) {
      console.log("failed to get all teacher students", error);
    }
  };

  useEffect(() => {
    getAllTeacherStudents();
  }, [teacherID]); 


  const handleNavigate = (className) => {
    navigate(`/classStudents/${className}`);
  };
  
  return (
    <div className="p-6">
      <h2 className="text-4xl font-semibold mb-6 text-center">Attendance <i className="fa-solid fa-clipboard-user ml-2"></i></h2>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {classList.map((classItem) => (
          <div
            key={classItem.id}
            className="card bg-base-50 shadow-md hover:shadow-lg transition duration-300"
          >
            <div className="card-body flex flex-col justify-between">
              <h1 className="card-title text-xl font-medium">
                {classItem.name} <i className="fa-solid fa-chalkboard"></i>
              </h1>
              <button
                className="btn btn-primary btn-sm w-fit mt-4"
                onClick={() => handleNavigate(classItem.name)}
              >
                Mark Attendance
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
