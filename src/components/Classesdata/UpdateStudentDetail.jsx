import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchStudentById, updateStudentById } from "../../services/api/Api";

const UpdateStudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    date_of_birth: "",
    gender: "",
    blood_group: "",
    religion: "",
    category: "",
    height: "",
    weight: "",
    number_of_siblings: "",
    father_name: "",
    mother_name: "",
    user_profile: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudent = async () => {
    try {
      const data = await fetchStudentById(id);
      const { classes, ...rest } = data;
      setFormData({
        ...rest,
        user_profile: null,
      });
    } catch (err) {
      setError("Failed to load student data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      user_profile: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== "") {
        payload.append(key, formData[key]);
      }
    }

    try {
      await updateStudentById(id, payload);
      alert("Student profile updated successfully.");
      navigate(`/studentDetails/${id}`);
    } catch (err) {
      setError("Failed to update student details.");
    }
  };

  if (loading) return <div className="p-4 text-center">Loading student data...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  const fields = [
    "first_name",
    "middle_name",
    "last_name",
    "email",
    "date_of_birth",
    "gender",
    "blood_group",
    "religion",
    "category",
    "height",
    "weight",
    "number_of_siblings",
    "father_name",
    "mother_name",
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-3xl font-bold mb-8 text-center">
          <i className="fa-solid fa-pen-to-square mr-2"></i> Update Student Details
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          encType="multipart/form-data"
        >
          {fields.map((field) => (
            <input
              key={field}
              type={field === "email" ? "email" : field === "date_of_birth" ? "date" : "text"}
              name={field}
              value={formData[field] || ""}
              onChange={handleChange}
              placeholder={field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              className="input input-bordered focus:outline-none"
            />
          ))}

          <div className="md:col-span-2">
            <label className="block mb-2 font-medium">Upload Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input file-input-bordered w-full focus:outline-none"
            />
          </div>

          <div className="col-span-2 text-center mt-6">
            <button type="submit" className="btn btn-primary">
              <i className="fa-solid fa-floppy-disk mr-2"></i> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStudentDetail;
