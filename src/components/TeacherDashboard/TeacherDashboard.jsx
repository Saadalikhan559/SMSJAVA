import React from "react";
import { Link } from 'react-router-dom'


const payload = {
  teacher: "Saqib Ali",
  total_classes: 2,
  class_details: [
    {
      class_period: "Physics - A101",
      subject: "Physics",
      classroom: "101",
      student_count: 2,
      level_name: "Class-3",
    },
    {
      class_period: "Algebra - B202",
      subject: "Algebra",
      classroom: "101",
      student_count: 4,
      level_name: "Class-12",
    },
  ],
};

export const TeacherDashboard = () => {
  return (
    <div className="p-4 space-y-6">
      <h3 className="text-3xl font-bold text-center text-gray-800">
        {payload.teacher}'s Dashboard
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {payload.class_details && payload.class_details.length > 0 ? (
          payload.class_details.map((detail, idx) => (
            <div
              key={idx}
              className="border rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-xl borderTheme bg-white"
            >
              {/* Header */}
              <div className="p-4 bgTheme text-white">
                <h2 className="text-xl font-bold truncate">{detail.subject}</h2>
              </div>

              {/* Detail Section */}
              <div className="p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Class:</span>
                  <span className="text-gray-800 font-semibold">
                    {detail.level_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">
                    Class Period:
                  </span>
                  <span className="text-gray-800 font-semibold">
                    {detail.class_period}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Classroom:</span>
                  <span className="text-gray-800 font-semibold">
                    {detail.classroom}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">
                    Student Count:
                  </span>
                  <span className="text-gray-800 font-semibold">
                    {detail.student_count}
                  </span>
                </div>
                <Link to="/fullAttendance">
                      <span className='flex justify-center'>
                      <button type="submit" className="btn btn-primary w-full "><i class="fa-solid fa-chalkboard-user"/>Full Attendance {detail.level_name}</button>
                      </span>
                 </Link>
              </div>
               
            </div>
          ))
        ) : (
          <div className="text-center col-span-full text-gray-500">
            No class details available.
          </div>
        )}
      </div>
    </div>
  );
};
