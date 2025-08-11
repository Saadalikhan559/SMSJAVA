import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchOfficeStaff, fetchTeachers } from "../../services/api/Api";
import { constants } from "../../global/constants";

const BASE_URL = constants.baseUrl;

const Staffdetail = () => {
  const { id, type } = useParams();
  const [staffData, setStaffData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getStaff = async () => {
    try {
      if (type === "teacher") {
        const teacher = await fetchTeachers(id);
        setStaffData(teacher);
      } else if (type === "office") {
        const office = await fetchOfficeStaff(id);
        setStaffData(office);
      } else {
        setError("Invalid staff type.");
      }
    } catch (error) {
      console.error("Error loading staff data", error);
      setError("Failed to load staff data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStaff();
  }, [id, type]);

  if (loading) {
    return <div className="p-4 text-center">Loading staff details...</div>;
  }

  if (error || !staffData) {
    return (
      <div className="p-4 text-center text-red-500">
        {error || "Staff not found."}
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="p-6 bg-gray-100 w-3xl">
        <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg">
          <div className="bgTheme text-white px-4 py-2 rounded-t-md">
            <h2 className="text-3xl font-semibold">
              Staff Profile - {staffData.first_name} {staffData.last_name}
            </h2>
          </div>

          <div className="p-6">
            <div className="mt-6">
              <div className="mt-2">
                {staffData.user_profile ? (
                  <img
                    src={`${BASE_URL}${staffData.user_profile.startsWith("/") ? "" : "/"
                      }${staffData.user_profile}`}
                    alt="Profile"
                    className="w-24 h-24 object-cover border rounded-full"
                  />
                ) : (
                  <span className="italic text-gray-400">No profile picture</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-dm text-gray-700 mt-6">
              <div>
                <strong>Full Name:</strong><br />
                {`${staffData.first_name} ${staffData.middle_name} ${staffData.last_name}`
                  .replace(/\s+/g, " ")
                  .trim()}
              </div>
              <div><strong>Email:</strong><br />{staffData.email || "N/A"}</div>
              <div><strong>Phone:</strong><br />{staffData.phone_no || "N/A"}</div>
              <div><strong>Gender:</strong><br />{staffData.gender || "N/A"}</div>
              <div><strong>Aadhar No:</strong><br />{staffData.aadhar_no || "N/A"}</div>
              <div><strong>PAN No:</strong><br />{staffData.pan_no || "N/A"}</div>
              <div><strong>Qualification:</strong><br />{staffData.qualification || "N/A"}</div>
              <div><strong>Category:</strong><br />{staffData.category || "N/A"}</div>
            </div>

            <div className="flex justify-center p-8 gap-4">
              <Link to={`/staffdetail/update/${type}/${id}`}>
                <button type="button" className="btn btn-primary">
                  <i className="fa-solid fa-pen-to-square"></i> Update Profile
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Staffdetail;
