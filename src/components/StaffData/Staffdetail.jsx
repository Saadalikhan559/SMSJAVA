import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchOfficeStaff, fetchTeachers } from "../../services/api/Api";

const Staffdetail = () => {
  const { id } = useParams();
  const [staffData, setStaffData] = useState(null);
  const [staffType, setStaffType] = useState(""); // "Teacher" or "Office Staff"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getStaffById = async () => {
    setLoading(true);
    try {
      const officeStaff = await fetchOfficeStaff(id);
      if (officeStaff && officeStaff.id) {
        setStaffData(officeStaff);
        setStaffType("Office Staff");
        return;
      }

      const teacher = await fetchTeachers(id);
      if (teacher && teacher.id) {
        setStaffData(teacher);
        setStaffType("Teacher");
        return;
      }

      setError("Staff member not found.");
    } catch (err) {
      setError("Failed to fetch staff. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStaffById();
  }, [id]);

  if (loading) {
    return <div className="p-4 text-center">Loading Staff Member details...</div>;
  }

  if (error || !staffData) {
    return <div className="p-4 text-center text-red-500">{error || "Staff member not found."}</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-0">
        <div className="bgTheme text-white px-4 py-2 rounded-t-md">
          <h2 className="text-3xl font-semibold">
            {staffType} Profile - {staffData.first_name} {staffData.last_name}
          </h2>
        </div>

        <div className="p-6">
          <p className="text-gray-500 italic mb-4">Type: {staffType}</p>

          <div className="mt-6">
            <strong>Profile Picture:</strong>
            <div className="mt-2">
              {staffData.user_profile ? (
                <img
                  src={staffData.user_profile}
                  alt="Profile"
                  className="w-24 h-24 object-cover rounded-full border"
                />
              ) : (
                <span className="italic text-gray-400">No profile picture</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-dm text-gray-700 mt-6">
            <div><strong>Full Name:</strong><br />{`${staffData.first_name} ${staffData.middle_name} ${staffData.last_name}`.replace(/\s+/g, ' ').trim()}</div>
            <div><strong>Email:</strong><br />{staffData.email || "N/A"}</div>
            <div><strong>Phone:</strong><br />{staffData.phone_no || "N/A"}</div>
            <div><strong>Gender:</strong><br />{staffData.gender || "N/A"}</div>
            <div><strong>Aadhar No:</strong><br />{staffData.aadhar_no || "N/A"}</div>
            <div><strong>PAN No:</strong><br />{staffData.pan_no || "N/A"}</div>
            <div><strong>Qualification:</strong><br />{staffData.qualification || "N/A"}</div>
            <div><strong>Category:</strong><br />{staffData.category || "N/A"}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Staffdetail;








