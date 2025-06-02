import React, { useEffect, useState } from "react";
import {
  fetchDocumentType,
  fetchGuardians,
  fetchOfficeStaff,
  fetchStudents,
  fetchStudentYearLevel,
  fetchTeachers,
} from "../services/api/Api";
import { constants } from "../global/constants";
import axios from "axios";

export const DocumentUpload = () => {
  const [documentType, setDocumentType] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [guardians, setGuardians] = useState([]);
  const [officeStaff, setOfficeStaff] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    file: "",
    document_type: "",
    student: "",
    teacher: "",
    guardian: "",
    office_staff: "",
  });

  // Fixed file change handler
  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  // API fetch functions
  const getDocumentTypes = async () => {
    try {
      const docType = await fetchDocumentType();
      setDocumentType(docType);
    } catch (error) {
      console.error("Failed to load document types:", error);
    }
  };

  // Add error handling for all fetch functions
  const getStudentsYearLevel = async () => {
    try {
      const allStudents = await fetchStudentYearLevel();
      setStudents(allStudents);
    } catch (error) {
      console.error("Failed to load students:", error);
    }
  };
  const getTeachers = async () => {
    try {
      const allTeachers = await fetchTeachers();
      setTeachers(allTeachers);
    } catch (error) {
      console.log("Failed to load teacher. Please try again.");
    }
  };
  const getGuardians = async () => {
    try {
      const allGuardians = await fetchGuardians();
      setGuardians(allGuardians);
    } catch (error) {
      console.log("Failed to load guardians. Please try again.");
    }
  };
  const getOfficeStaff = async () => {
    try {
      const allOfficeStaff = await fetchOfficeStaff();
      setOfficeStaff(allOfficeStaff);
    } catch (error) {
      console.log("Failed to load office staff. Please try again.");
    }
  };

  useEffect(() => {
    getDocumentTypes();
    getStudentsYearLevel();
    getTeachers();
    getGuardians();
    getOfficeStaff();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file || !formData.document_type) {
      alert("Please select a file and document type");
      return;
    }
    setLoading(true);

    const formDataToSend = new FormData();
    
    formDataToSend.append("file", formData.file);
    formDataToSend.append("document_type", formData.document_type);
    
    // Only append if value exists
    if (formData.student) formDataToSend.append("student", formData.student);
    if (formData.teacher) formDataToSend.append("teacher", formData.teacher);
    if (formData.guardian) formDataToSend.append("guardian", formData.guardian);
    if (formData.office_staff) formDataToSend.append("office_staff", formData.office_staff);

    try {
      const response = await axios.post(
        `${constants.baseUrl}/d/Document/`, 
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      
      if (response.status === 200 || response.status === 201) {
        alert('Document uploaded successfully!');
      }
    } catch (error) {
      console.error("Upload failed:", error.response?.data || error.message);
      alert(`Upload failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <form
      className="w-full max-w-6xl mx-auto p-6 bg-base-100 rounded-box my-5 shadow-sm focus:outline-none"
      onSubmit={handleSubmit}
    >
      <h1 className="text-3xl font-bold text-center mb-8">
        Upload your documents
        <i className="fa-solid fa-cloud-upload-alt ml-2"></i>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Document Upload Field */}
        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center gap-1">
              <i className="fa-solid fa-file-upload text-sm"></i>
              Document Upload <span className="text-error">*</span>
            </span>
          </label>
          <input
            type="file"
            name="document_file"
            className="file-input file-input-bordered w-full focus:outline-none"
            required
            onChange={handleFileChange}
          />
        </div>

        {/* Document Type Selection */}
        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center gap-2">
              <i className="fa-solid fa-file-lines text-sm"></i>
              Document Type <span className="text-error">*</span>
            </span>
          </label>
          <select
            name="document_type"
            className="select select-bordered w-full focus:outline-none"
            required
            onChange={handleChange}
          >
            <option value="">Select Document Type</option>
            {documentType.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Student Role Field */}
        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center gap-2">
              <i className="fa-solid fa-user-graduate text-sm"></i>
              Student
            </span>
          </label>
          <select
            name="student"
            className="select select-bordered w-full focus:outline-none"
            onChange={handleChange}
            value={formData.student}
          >
            <option value="">Select Student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.first_name} {student.last_name}
              </option>
            ))}
          </select>
        </div>

        {/* Teacher Role Selection */}
        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center gap-2">
              <i className="fa-solid fa-file-lines text-sm"></i>
              Teacher
            </span>
          </label>
          <select
            name="teacher"
            className="select select-bordered w-full focus:outline-none"
            onChange={handleChange}
          >
            <option value="">Select Teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.first_name} {teacher.last_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Gaurdian Role Field */}
        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center gap-2">
              <i className="fa-solid fa-file-lines text-sm"></i>
              Guardian
            </span>
          </label>
          <select
            name="guardian"
            className="select select-bordered w-full focus:outline-none"
            onChange={handleChange}
          >
            <option value="">Select Guardian</option>
            {guardians.map((guardian) => (
              <option key={guardian.id} value={guardian.id}>
                {guardian.first_name} {guardian.last_name}
              </option>
            ))}
          </select>
        </div>

        {/* Office Role Selection */}
        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center gap-2">
              <i className="fa-solid fa-file-lines text-sm"></i>
              Office Staff
            </span>
          </label>
          <select
            name="office_staff"
            className="select select-bordered w-full focus:outline-none"
            onChange={handleChange}
          >
            <option value="">Select Office Staff</option>
            {officeStaff.map((staff) => (
              <option key={staff.id} value={staff.id}>
                {staff.first_name} {staff.last_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Submit Button centered */}
      <div className="flex justify-center mt-10">
        <button type="submit" className="btn btn-primary w-52">
          {loading ? (
            <i className="fa-solid fa-spinner fa-spin mr-2"></i>
          ) : (
            <i className="fa-solid fa-cloud-upload-alt ml-2"></i>
          )}
          {loading ? " " : "Upload"}
        </button>
      </div>
    </form>
  );
};
