import React, { useEffect, useState } from "react";
import {
  fetchDocumentType,
  fetchGuardians,
  fetchOfficeStaff,
  fetchRoles,
  fetchStudentYearLevelByClass,
  fetchTeachers,
  fetchYearLevels,
} from "../services/api/Api";
import { constants } from "../global/constants";
import axios from "axios";

export const DocumentUpload = () => {
  // STEPS LOGIC
  const [step, setStep] = useState(0);
  const next = () => setStep((prev) => Math.min(prev + 1, 1));
  const prev = () => setStep((prev) => Math.max(prev - 1, 0));
  // STEPS ENDS

  const [allRoles, setAllRoles] = useState([]);
  const [documentType, setDocumentType] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [guardians, setGuardians] = useState([]);
  const [officeStaff, setOfficeStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [role, setRole] = useState("");
  const [yearLevel, setYearLevel] = useState([]);
  const [yearLevelName, setYearLevelName] = useState("");

  const [formData, setFormData] = useState({
    file: "",
    document_type: "",
    student: "",
    teacher: "",
    guardian: "",
    office_staff: "",
    year_level: "",
  });

  // API fetch functions
  const getYearLevels = async () => {
    try {
      const yearLevels = await fetchYearLevels();
      setYearLevel(yearLevels);
    } catch (err) {
      console.log("Failed to load year levels. Please try again.");
    }
  };

  const getRoles = async () => {
    try {
      const roles = await fetchRoles();
      setAllRoles(roles);
    } catch {
      console.log("Failed to load roles. Please try again.");
    }
  };

  const filteredRoles = allRoles.filter(
    (role) =>
      role.name === `${constants.roles.teacher}` ||
      role.name === `${constants.roles.officeStaff}` ||
      role.name === `${constants.roles.student}` ||
      role.name === `${constants.roles.guardian}`
  );

  const getDocumentTypes = async () => {
    try {
      const docType = await fetchDocumentType();
      setDocumentType(docType);
    } catch (error) {
      console.error("Failed to load document types:", error);
    }
  };

  const getStudentsYearLevel = async () => {
    if (!formData.year_level) return;

    try {
      setLoadingStudents(true);
      const allStudents = await fetchStudentYearLevelByClass(yearLevelName);
      setStudents(allStudents);
    } catch (error) {
      console.error("Failed to load students:", error);
    } finally {
      setLoadingStudents(false);
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

  // HANDLING CHANGES
  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Reset student when year level changes
    if (name === "year_level") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        student: "",
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);

    // Reset year level and student when role changes
    if (selectedRole !== constants.roles.student) {
      setFormData((prev) => ({
        ...prev,
        year_level: "",
        student: "",
      }));
    }
  };

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

    // Append role-specific fields
    if (formData.student) formDataToSend.append("student", formData.student);
    if (formData.teacher) formDataToSend.append("teacher", formData.teacher);
    if (formData.guardian) formDataToSend.append("guardian", formData.guardian);
    if (formData.office_staff)
      formDataToSend.append("office_staff", formData.office_staff);

    try {
      const response = await axios.post(
        `${constants.baseUrl}/d/Document/`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert("Document uploaded successfully!");
        // Reset form after successful upload
        setFormData({
          file: "",
          document_type: "",
          student: "",
          teacher: "",
          guardian: "",
          office_staff: "",
          year_level: "",
        });
        setRole("");
        setStep(0);
      }
    } catch (error) {
      console.error("Upload failed:", error.response?.data || error.message);
      alert(`Upload failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // SIDE EFFECTS
  useEffect(() => {
    getDocumentTypes();
    getTeachers();
    getGuardians();
    getOfficeStaff();
    getRoles();
    getYearLevels();
    
  }, []);

useEffect(() => {
  if (formData.year_level && yearLevel.length > 0) {
    const selected = yearLevel.find(
      (yl) => yl.id === parseInt(formData.year_level)
    );
    if (selected) {
      setYearLevelName(selected.level_name);
    }
  }
}, [formData.year_level, yearLevel]);


useEffect(() => {
  if (yearLevelName) {
    getStudentsYearLevel();
  }
}, [yearLevelName]);

  return (
    <form
      onSubmit={handleSubmit}
      className=" w-full max-w-6xl mx-auto p-6 bg-base-100 rounded-box my-5 shadow-sm focus:outline-none"
    >
      <ul className="steps mb-6 w-full">
        <li className={`step ${step >= 0 ? "step-primary" : ""}`}>Role</li>
        <li className={`step ${step >= 1 ? "step-primary" : ""}`}>Fill Form</li>
      </ul>

      {/* STEP 1 */}
      {step === 0 && (
        <div className="w-full max-w-6xl mx-auto p-6">
          <h1 className="text-3xl font-bold text-center mb-8">
            Select Role
            <i className="fa-solid fa-cloud-upload-alt ml-2"></i>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Select Role */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-user-shield text-sm"></i> Role
                </span>
              </label>
              <select
                className="select select-bordered w-full focus:outline-none cursor-pointer"
                value={role}
                onChange={handleRoleChange}
              >
                <option value="">Select Role</option>
                {filteredRoles.map((roleItem) => (
                  <option key={roleItem.id} value={roleItem.name}>
                    {roleItem.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Year level */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-graduation-cap text-sm"></i>
                  Student Year Level <span className="text-error">*</span>
                </span>
              </label>
              <select
                name="year_level"
                className="select select-bordered w-full focus:outline-none"
                required
                value={formData.year_level}
                onChange={handleChange}
                disabled={role !== constants.roles.student}
              >
                <option value="">Select Year Level</option>
                {yearLevel.map((yearlev) => (
                  <option value={yearlev.id} key={yearlev.id}>
                    {yearlev.level_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 1 && (
        <div className="w-full max-w-6xl mx-auto p-6">
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
                value={formData.document_type}
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
                value={formData.student}
                onChange={handleChange}
                disabled={role !== constants.roles.student || loadingStudents}
              >
                <option value="">Select Student</option>
                {loadingStudents ? (
                  <option disabled>Loading students...</option>
                ) : students.length === 0 ? (
                  <option disabled>No students found</option>
                ) : (
                  students.map((studentObj) => (
                    <option key={studentObj.id} value={studentObj.student.id}>
                      {studentObj.student.first_name}{" "}
                      {studentObj.student.last_name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Teacher Role Selection */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-chalkboard-user text-sm"></i>
                  Teacher
                </span>
              </label>
              <select
                name="teacher"
                className="select select-bordered w-full focus:outline-none"
                value={formData.teacher}
                onChange={handleChange}
                disabled={role !== constants.roles.teacher}
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
            {/* Guardian Role Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-user-shield text-sm"></i>
                  Guardian
                </span>
              </label>
              <select
                name="guardian"
                className="select select-bordered w-full focus:outline-none"
                value={formData.guardian}
                onChange={handleChange}
                disabled={role !== constants.roles.guardian}
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
                  <i className="fa-solid fa-briefcase text-sm"></i>
                  Office Staff
                </span>
              </label>
              <select
                name="office_staff"
                className="select select-bordered w-full focus:outline-none"
                value={formData.office_staff}
                onChange={handleChange}
                disabled={role !== constants.roles.officeStaff}
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
        </div>
      )}

      {/* Fixed button container */}
      <div className="flex justify-between gap-4 p-6">
        <button
          type="button"
          onClick={prev}
          disabled={step === 0}
          className="btn btn-outline"
        >
          Back
        </button>
        {step === 0 ? (
          <button
            type="button"
            onClick={next}
            className="btn btn-primary"
            disabled={
              role.length === 0 ||
              (role === constants.roles.student && !formData.year_level)
            }
          >
            Next
          </button>
        ) : (
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <i className="fa-solid fa-spinner fa-spin mr-2"></i>
            ) : (
              <i className="fa-solid fa-cloud-upload-alt ml-2"></i>
            )}
            {loading ? " " : "Upload"}
          </button>
        )}
      </div>
    </form>
  );
};
