import React from "react";
import { Link } from "react-router-dom";

const classList = [
  { id: 3, name: "3 UKG" },
  { id: 4, name: "4 Class 1" },
  { id: 5, name: "5 Class 2" },
];

export const Attendance = () => {
  return (
    <div className="p-6">
      <h2 className="text-4xl font-semibold mb-4 text-center">Attendance</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {classList.map((classItem) => (
          <div key={classItem.id} className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h1 className="card-title text-lg">
                <Link>{classItem.name}</Link>
              </h1>
              <button className="btn btn-primary btn-sm mt-2">
                Mark Attendance
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};









