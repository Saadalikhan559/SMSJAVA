import React from "react";

const payload = {
  guardian: "Rakesh Kumar",
  total_children: 2,
  children: [
    {
      student_name: "Aarav Verma",
      class: "Grade 1 (2024-2025)",
    },
    {
      student_name: "Jhon Vick",
      class: "Grade 1 (2024-2025)",
    },
  ],
};

export const GuardianDashboard = () => {
  return (
    <div className="p-4 space-y-6">
      <h3 className="text-3xl font-bold text-center text-gray-800">
        {payload.guardian}'s Dashboard
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {payload.children && payload.children.length > 0 ? (
          payload.children.map((child, idx) => (
            <div
              key={idx}
              className="border rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-xl borderTheme bg-white"
            >
              {/* Header */}
              <div className="p-4 bgTheme text-white">
                <h2 className="text-xl font-bold truncate">
                  {child.student_name}
                </h2>
              </div>

              {/* Child Info */}
              <div className="p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Class:</span>
                  <span className="text-gray-800 font-semibold">{child.class}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center col-span-full text-gray-500">
            No children data available.
          </div>
        )}
      </div>
    </div>
  );
};
