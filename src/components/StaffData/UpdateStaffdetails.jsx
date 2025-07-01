import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchTeachers,
  fetchOfficeStaff,
  editOfficeStaffdetails,
  editTeachersdetails,
} from "../../services/api/Api";

const UpdateStaffDetails = () => {
  const { id, type } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    phone_no: "",
    gender: "",
    aadhar_no: "",
    pan_no: "",
    qualification: "",
    category: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStaff = async () => {
    try {
      let data;
      if (type === "teacher") {
        data = await fetchTeachers(id);
      } else if (type === "office") {
        data = await fetchOfficeStaff(id);
      } else {
        setError("Invalid staff type.");
        return;
      }

      setFormData({
        first_name: data.first_name || "",
        middle_name: data.middle_name || "",
        last_name: data.last_name || "",
        email: data.email || "",
        phone_no: data.phone_no || "",
        gender: data.gender || "",
        aadhar_no: data.aadhar_no || "",
        pan_no: data.pan_no || "",
        qualification: data.qualification || "",
        category: data.category || "",
      });
    } catch (err) {
      setError("Failed to load staff data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
    console.log("Fetching for id:", id, "type:", type);

  }, [id, type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (type === "teacher") {
        await editTeachersdetails(id, formData);
      } else if (type === "office") {
        await editOfficeStaffdetails(id, formData);
      } else {
        setError("Invalid staff type.");
        return;
      }
      console.log("Navigating to:", `/staffdetail/${id}/${type}`);
      alert("Staff details updated successfully.");
      navigate(`/staffDetail/${type}/${id}`);
    } catch (err) {
      console.error("Submit error:", err);
      setError("Failed to update staff details.");
      console.error("Submit error:", err.response?.data || err.message);

    }
  };


  if (loading) return <div className="p-4 text-center">Loading staff data...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-3xl font-bold mb-8 text-center">
          <i className="fa-solid fa-pen-to-square mr-2"></i> Update Staff Details
        </h1>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <div className="bg-base-200 p-6 rounded-box">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {[
              "first_name",
              "middle_name",
              "last_name",
              "email",
              "phone_no",
              "gender",
              "aadhar_no",
              "pan_no",
              "qualification",
              "category",
            ].map((field) => (
              <input
                key={field}
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                className="input input-bordered focus:outline-none"
              />
            ))}

            <div className="col-span-2 text-center mt-6">
              <button type="submit" className="btn btn-primary">
                <i className="fa-solid fa-floppy-disk mr-2"></i> Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateStaffDetails;
