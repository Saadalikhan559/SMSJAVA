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
  const [yearLevelID, setYearLevelID] = useState("");

  // Dynamic fields for document uploads
  const [uploadFields, setUploadFields] = useState([
    { files: null, document_types: "", identities: "" },
  ]);

  const [identityErrors, setIdentityErrors] = useState([]); // ✅ NEW STATE

  const [formData, setFormData] = useState({
    student: "",
    teacher: "",
    guardian: "",
    office_staff: "",
    year_level: "",
  });

  // ✅ VALIDATION FUNCTION
  const validateIdentity = (identity, docTypeId) => {
    if (!docTypeId || !identity) return "";

    const selectedDoc = documentType.find(
      (doc) => doc.id.toString() === docTypeId.toString()
    );
    if (!selectedDoc) return "";

    const name = selectedDoc.name.toLowerCase();

    if (name.includes("aadhaar")) {
      const aadhaarRegex = /^\d{12}$/;
      return aadhaarRegex.test(identity)
        ? ""
        : "Aadhaar must be 12 digits (e.g. 123456789012)";
    }

    if (name.includes("passport")) {
      const passportRegex = /^[A-Z]{1}[0-9]{7}$/;
      return passportRegex.test(identity)
        ? ""
        : "Passport format: 1 letter + 7 digits (e.g. K1234567)";
    }

    if (name.includes("birth certificate")) {
      const bcRegex = /^BRN-\d{4}-\d{3,}$/;
      return bcRegex.test(identity)
        ? ""
        : "Birth Certificate format: BRN-YYYY-XXX (e.g. BRN-2021-000123)";
    }

    if (name.includes("transfer certificate")) {
      const tcRegex = /^TC-\d{4}-\d{3,}$/;
      return tcRegex.test(identity)
        ? ""
        : "Transfer Certificate format: TC-YYYY-XXX (e.g. TC-2022-00123)";
    }

    if (name.includes("caste certificate")) {
      const ccRegex = /^CC-\d{4}-\d{3,}$/;
      return ccRegex.test(identity)
        ? ""
        : "Caste Certificate format: CC-YYYY-XXX (e.g. CC-2020-0456)";
    }

    return "";
  };

  // API fetch functions (unchanged)
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
      role.name === constants.roles.teacher ||
      role.name === constants.roles.officeStaff ||
      role.name === constants.roles.student ||
      role.name === constants.roles.guardian
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
      const allStudentsByClass = await fetchStudentYearLevelByClass(yearLevelID);
      setStudents(allStudentsByClass);
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

  const handleAddField = () => {
    setUploadFields([...uploadFields, { files: null, document_types: "", identities: "" }]);
    setIdentityErrors([...identityErrors, ""]); // ✅ maintain error array length
  };

  const handleFileChange = (e, index) => {
    const newFields = [...uploadFields];
    newFields[index].files = e.target.files[0];
    setUploadFields(newFields);
  };

  const handleUploadChange = (e, index) => {
    const { name, value } = e.target;
    const newFields = [...uploadFields];
    newFields[index][name] = value;
    setUploadFields(newFields);

    // ✅ validate immediately if identity/doc type changes
    if (name === "document_types" || name === "identities") {
      const newErrors = [...identityErrors];
      newErrors[index] = validateIdentity(
        newFields[index].identities,
        newFields[index].document_types
      );
      setIdentityErrors(newErrors);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
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
    if (selectedRole !== constants.roles.student) {
      setFormData((prev) => ({
        ...prev,
        year_level: "",
        student: "",
      }));
    }
  };

  const getAvailableDocumentTypes = (currentIndex) => {
    const selectedDocTypes = uploadFields
      .map((field, index) => (index !== currentIndex ? field.document_types : null))
      .filter((type) => type);
    return documentType.filter((doc) => !selectedDocTypes.includes(doc.id.toString()));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      for (const [index, field] of uploadFields.entries()) {
        if (!field.files || !field.document_types) {
          alert("Please select a file and document type for all fields");
          setLoading(false);
          return;
        }

        // ✅ prevent submit if identity invalid
        if (identityErrors[index]) {
          alert("Please fix identity errors before uploading.");
          setLoading(false);
          return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append("files", field.files);
        formDataToSend.append("document_types", field.document_types);

        if (formData.student) formDataToSend.append("student", formData.student);
        if (formData.teacher) formDataToSend.append("teacher", formData.teacher);
        if (formData.guardian) formDataToSend.append("guardian", formData.guardian);
        if (formData.office_staff) formDataToSend.append("office_staff", formData.office_staff);
        if (field.identities) formDataToSend.append("identities", field.identities);

        await axios.post(`${constants.baseUrl}/d/Document/`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      alert("All documents uploaded successfully!");
      setUploadFields([{ file: null, document_type: "" }]);
      setFormData({
        student: "",
        teacher: "",
        guardian: "",
        office_staff: "",
        year_level: "",
      });
      setRole("");
      setStep(0);
    } catch (error) {
      alert("Upload failed");
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
      const selected = yearLevel.find((yl) => yl.id === parseInt(formData.year_level));
      if (selected) setYearLevelID(selected.id);
    }
  }, [formData.year_level, yearLevel]);

  useEffect(() => {
    if (yearLevelID) getStudentsYearLevel();
  }, [yearLevelID]);

  return (
   
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-7xl  mx-auto p-6 bg-base-100 rounded-box my-5 shadow-sm focus:outline-none"
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
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1">
                  <i className="fa-solid fa-user-shield text-sm"></i> Role
                </span>
              </label>
              <select
                className="select select-bordered  w-full focus:outline-none cursor-pointer"
                value={role}
                onChange={handleRoleChange}
              >
                <option  value="">Select Role</option>
                {filteredRoles.map((roleItem) => (
                  <option  key={roleItem.id} value={roleItem.name}>
                    {roleItem.name}
                  </option>
                ))}
              </select>
            </div>

            {role === constants.roles.student && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-1">
                    <i className="fa-solid fa-graduation-cap text-sm"></i> Class{" "}
                    <span className="text-error">*</span>
                  </span>
                </label>
                <select
                  name="year_level"
                  className="select select-bordered w-full focus:outline-none cursor-pointer"
                  required
                  value={formData.year_level}
                  onChange={handleChange}
                >
                  <option value="">Class</option>
                  {yearLevel.map((yearlev) => (
                    <option value={yearlev.id} key={yearlev.id}>
                      {yearlev.level_name}
                    </option>
                  ))}
                </select>
              </div>
            )}
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
          {uploadFields.map((field, index) => (
           <div
  key={index}
  className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start mt-6 w-full"
>
  {/* Document Upload */}
  <div className="form-control w-full">
    <label className="label">
      <span className="label-text flex items-center gap-1">
        <i className="fa-solid fa-file-upload text-sm"></i> Document Upload
        <span className="text-error">*</span>
      </span>
    </label>
    <input
      type="file"
      name="file"
      className="file-input file-input-bordered w-full focus:outline-none"
      required
      onChange={(e) => handleFileChange(e, index)}
    />
  </div>

  {/* Document Type */}
  <div className="form-control w-full">
    <label className="label">
      <span className="label-text flex items-center gap-1">
        <i className="fa-solid fa-file text-sm"></i> Document Type
        <span className="text-error">*</span>
      </span>
    </label>
    <select
      name="document_types"
      className="select select-bordered w-full focus:outline-none cursor-pointer"
      required
      value={field.document_types}
      onChange={(e) => handleUploadChange(e, index)}
    >
      <option value="">Select Document Type</option>
      {getAvailableDocumentTypes(index).map((doc) => (
        <option key={doc.id} value={doc.id}>
          {doc.name}
        </option>
      ))}
    </select>
  </div>

  {/* Identity */}
  <div className="form-control w-full">
    <label className="label">
      <span className="label-text flex items-center gap-1">
        <i className="fa-solid fa-id-card text-sm"></i> Identity
      </span>
    </label>
    <input
      type="text"
      name="identities"
      className="input input-bordered w-full focus:outline-none"
      value={field.identities}
      onChange={(e) => handleUploadChange(e, index)}
      placeholder="Enter identity ID"
    />
    <span className="text-red-500 text-sm mt-1 block min-h-[1.25rem]">
      {identityErrors[index]}
    </span>
  </div>

  {/* Add/Remove Button */}
{/* Add/Remove Button */}
<div className="form-control w-full flex flex-col mt-auto">
  {index === 0 ? (
    <button
      type="button"
      className="btn btn-primary w-full"
      onClick={handleAddField}
    >
      <i className="fa-solid fa-plus mr-1"></i> Add
    </button>
  ) : (
    <button
      type="button"
      className="btn btn-error w-full"
      onClick={() =>
        setUploadFields(uploadFields.filter((_, i) => i !== index))
      }
    >
      <i className="fa-solid fa-trash mr-1"></i> Remove
    </button>
  )}
</div>


</div>

          ))}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {role === constants.roles.student && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-1">
                    <i className="fa-solid fa-user-graduate text-sm"></i>{" "}
                    Student
                  </span>
                </label>
                <select
                  name="student"
                  className="select select-bordered w-full focus:outline-none cursor-pointer"
                  value={formData.student}
                  onChange={handleChange}
                >
                  <option value="">Select Student</option>
                  {loadingStudents ? (
                    <option disabled>Loading students...</option>
                  ) : students.length === 0 ? (
                    <option disabled>No students found</option>
                  ) : (
                    students.map((studentObj) => (
                      <option key={studentObj.student_id} value={studentObj.student_id}>
                        {studentObj.student_name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            )}

            {role === constants.roles.teacher && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-1">
                    <i className="fa-solid fa-chalkboard-teacher text-sm"></i>{" "}
                    Teacher
                  </span>
                </label>
                <select
                  name="teacher"
                  className="select select-bordered w-full focus:outline-none cursor-pointer"
                  value={formData.teacher}
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
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {role === constants.roles.guardian && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-1">
                    <i className="fa-solid fa-user-shield text-sm"></i> Guardian
                  </span>
                </label>
                <select
                  name="guardian"
                  className="select select-bordered w-full focus:outline-none cursor-pointer"
                  value={formData.guardian}
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
            )}

            {role === constants.roles.officeStaff && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-1">
                    <i className="fa-solid fa-briefcase text-sm"></i> Office
                    Staff
                  </span>
                </label>
                <select
                  name="office_staff"
                  className="select select-bordered w-full focus:outline-none cursor-pointer"
                  value={formData.office_staff}
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
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-center md:items-stretch justify-between gap-4 p-6">
        <button
          type="button"
          onClick={prev}
          disabled={step === 0}
          // className="btn btn-primry w-40"
          className="bgTheme text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 w-40"
    
        >
          Back
        </button>
        {step === 0 ? (
          <button
            type="button"
            onClick={next}
            // className="btn btn-primary w-40"
          className="bgTheme text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 w-40"
            disabled={
              role.length === 0 ||
              (role === constants.roles.student && !formData.year_level)
            }
          >
            Next
          </button>
        ) : (
          <button type="submit" className="btn btn-primary w-40">
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
