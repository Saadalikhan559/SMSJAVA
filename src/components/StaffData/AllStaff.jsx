import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchOfficeStaff, fetchTeachers } from "../../services/api/Api";

const AllStaff = () => {
  const [officestaff, setofficestaff] = useState([]);
  const [teachers, setteachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getofficestaff = async () => {
    setLoading(true);
    try {
      const data = await fetchOfficeStaff();
      setofficestaff(data);
      console.log(data);

    } catch (err) {
      setError("Failed to fetch office staff. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getteachers = async () => {
    setLoading(true);
    try {
      const data = await fetchTeachers();
      setteachers(data);
      console.log(data);

    } catch (err) {
      setError("Failed to fetch teachers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getofficestaff();
    getteachers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <i className="fa-solid fa-spinner fa-spin mr-2 text-4xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5 bg-gray-50">
      {error && (
        <div className="text-red-600 text-center mb-4 font-medium">{error}</div>
      )}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Teachers Section */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-lg max-h-[80vh] overflow-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            <i className="fa-solid fa-person-chalkboard mr-2"></i> Teachers
          </h1>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bgTheme text-white">
                <tr>
                  <th className="px-6 py-3 text-left">S.NO</th>
                  <th className="px-6 py-3 text-left">Name</th>
                </tr>
              </thead>
              <tbody>
                {teachers.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="text-center py-6 text-red-600">
                      No data found.
                    </td>
                  </tr>
                ) : (
                  teachers.map((record, index) => (
                    <tr key={record.id || index} className="hover:bg-blue-50">
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4">
                        <Link
                          to={`/staffDetail/teacher/${record.id}`} // lowercase "staffdetail"
                          state={{ level_name: record.level_name }}
                          className="text-blue-600 hover:underline"
                        >
                          {[record.first_name, record.middle_name, record.last_name]
                            .filter(Boolean)
                            .join(" ")}
                        </Link>

                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Office Staff Section */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-lg max-h-[80vh] overflow-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            <i className="fa-solid fa-clipboard-user mr-2"></i> Office Staff
          </h1>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bgTheme text-white">
                <tr>
                  <th className="px-6 py-3 text-left">S.NO</th>
                  <th className="px-6 py-3 text-left">Name</th>
                </tr>
              </thead>
              <tbody>
                {officestaff.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="text-center py-6 text-gray-500">
                      No data found.
                    </td>
                  </tr>
                ) : (
                  officestaff.map((record, index) => (
                    <tr key={record.id || index} className="hover:bg-blue-50">
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4">
                        <Link
                          to={`/staffDetail/office/${record.id}`}
                          state={{ level_name: record.level_name }}
                          className="text-blue-600 hover:underline"
                        >
                          {[record.first_name, record.middle_name, record.last_name]
                            .filter(Boolean)
                            .join(" ")}
                        </Link>

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
  );
};

export default AllStaff;
