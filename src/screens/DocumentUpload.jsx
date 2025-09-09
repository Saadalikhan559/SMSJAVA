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

  // FORM DATA & DROPDOWN STATES
  const [allRoles, setAllRoles] = useState([]);
  const [documentType, setDocumentType] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [guardians, setGuardians] = useState([]);
  const [officeStaff, setOfficeStaff] = useState([]);
  const [yearLevel, setYearLevel] = useState([]);
  const [yearLevelID, setYearLevelID] = useState("");

  const [loadingRoles, setLoadingRoles] = useState(false);
  const [loadingDocumentTypes, setLoadingDocumentTypes] = useState(false);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [loadingGuardians, setLoadingGuardians] = useState(false);
  const [loadingOfficeStaff, setLoadingOfficeStaff] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [role, setRole] = useState("");

  const [formData, setFormData] = useState({
    student: "",
    teacher: "",
    guardian: "",
    office_staff: "",
    year_level: "",
  });

  // Dynamic fields for document uploads
  const [uploadFields, setUploadFields] = useState([
    { files: null, document_types: "", identities: "" },
  ]);
  const [identityErrors, setIdentityErrors] = useState([]);

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

  // --- API FETCH FUNCTIONS ---
  const getRoles = async () => {
    setLoadingRoles(true);
    try {
      const roles = await fetchRoles();
      setAllRoles(roles);
    } catch {
      console.log("Failed to load roles");
    } finally {
      setLoadingRoles(false);
    }
  };

  const getDocumentTypes = async () => {
    setLoadingDocumentTypes(true);
    try {
      const docType = await fetchDocumentType();
      setDocumentType(docType);
    } catch (error) {
      console.log("Failed to load document types");
    } finally {
      setLoadingDocumentTypes(false);
    }
  };

  const getTeachers = async () => {
    setLoadingTeachers(true);
    try {
      const allTeachers = await fetchTeachers();
      setTeachers(allTeachers);
    } catch {
      console.log("Failed to load teachers");
    } finally {
      setLoadingTeachers(false);
    }
  };

  const getGuardians = async () => {
    setLoadingGuardians(true);
    try {
      const allGuardians = await fetchGuardians();
      setGuardians(allGuardians);
    } catch {
      console.log("Failed to load guardians");
    } finally {
      setLoadingGuardians(false);
    }
  };

  const getOfficeStaff = async () => {
    setLoadingOfficeStaff(true);
    try {
      const allStaff = await fetchOfficeStaff();
      setOfficeStaff(allStaff);
    } catch {
      console.log("Failed to load office staff");
    } finally {
      setLoadingOfficeStaff(false);
    }
  };

  const getYearLevels = async () => {
    try {
      const yl = await fetchYearLevels();
      setYearLevel(yl);
    } catch {
      console.log("Failed to load year levels");
    }
  };

  const getStudentsYearLevel = async () => {
    if (!yearLevelID) return;
    setLoadingStudents(true);
    try {
      const allStudentsByClass = await fetchStudentYearLevelByClass(yearLevelID);
      setStudents(allStudentsByClass);
    } catch {
      console.log("Failed to load students");
    } finally {
      setLoadingStudents(false);
    }
  };

  // --- HANDLERS ---
  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
    setFormData({
      student: "",
      teacher: "",
      guardian: "",
      office_staff: "",
      year_level: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "year_level") {
      setFormData((prev) => ({ ...prev, [name]: value, student: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddField = () => {
    setUploadFields([...uploadFields, { files: null, document_types: "", identities: "" }]);
    setIdentityErrors([...identityErrors, ""]);
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

    if (name === "document_types" || name === "identities") {
      const newErrors = [...identityErrors];
      newErrors[index] = validateIdentity(newFields[index].identities, newFields[index].document_types);
      setIdentityErrors(newErrors);
    }
  };

  const getAvailableDocumentTypes = (currentIndex) => {
    const selectedDocTypes = uploadFields
      .map((field, idx) => (idx !== currentIndex ? field.document_types : null))
      .filter(Boolean);
    return documentType.filter((doc) => !selectedDocTypes.includes(doc.id.toString()));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      for (const [index, field] of uploadFields.entries()) {
        if (!field.files || !field.document_types) {
          setAlertMessage("Please select file and document type for all fields");
          setShowAlert(true);
          setLoading(false);
          return;
        }
        if (identityErrors[index]) {
          setAlertMessage("Please fix identity errors before uploading");
          setShowAlert(true);
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

      setAlertMessage("Documents uploaded successfully!");
      setShowAlert(true);
      setUploadFields([{ files: null, document_types: "", identities: "" }]);
      setFormData({ student: "", teacher: "", guardian: "", office_staff: "", year_level: "" });
      setRole("");
      setStep(0);
    } catch {
      setAlertMessage("Upload failed");
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  // --- SIDE EFFECTS ---
  useEffect(() => {
    getRoles();
    getDocumentTypes();
    getTeachers();
    getGuardians();
    getOfficeStaff();
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

  const filteredRoles = allRoles.filter(
    (role) =>
      role.name === constants.roles.teacher ||
      role.name === constants.roles.officeStaff ||
      role.name === constants.roles.student ||
      role.name === constants.roles.guardian
  );

  // --- RENDER ---
  return (
    <div className="min-h-screen p-5 bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-7xl mx-auto p-6 bg-base-100 rounded-box my-5 shadow-sm focus:outline-none"

      >
        <ul className="steps mb-6 w-full">
          <li className={`step ${step >= 0 ? "step-primary" : ""}`}>Role</li>
          <li className={`step ${step >= 1 ? "step-primary" : ""}`}>Fill Form</li>
        </ul>

        <style>
          {`
          
          .steps .step.step-primary::before,
          .steps .step.step-primary:before {
            background-color: #6d28d9 !important; 
            border-color: #6d28d9 !important;
            color: #ffffff !important; 
          }

          .steps .step.step-primary {
            color: #6d28d9 !important;
          }

          .steps .step.step-primary::after {
            border-color: #6d28d9 !important;
          }
        `}
        </style>
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
                  className="select select-bordered w-full focus:outline-none cursor-pointer"
                  value={role}
                  onChange={handleRoleChange}
                >
                  <option value="">
                    {loadingRoles ? "Loading roles..." : "Select Role"}
                  </option>

                  {filteredRoles.map((roleItem) => (
                    <option key={roleItem.id} value={roleItem.name}>
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
                    <option value="">
                      {yearLevel.length === 0 ? "Loading classes..." : "Select Class"}
                    </option>

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
                className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center w-full"
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
                <div className="form-control w-full pt-6">
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
                    style={{ marginBottom: "0" }} // extra tweak
                  />
                  <span className="text-red-500 text-sm mt-1 block min-h-[1.25rem]">
                    {identityErrors[index]}
                  </span>
                </div>

                {/* Add/Remove Button */}
                <div className="form-control w-full flex items-end pt-6">
                  {index === 0 ? (
                    <button
                      type="button"
                      className="btn bgTheme text-white w-full"
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


            {/* Select Student/Teacher/Guardian/Office Staff */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {role === constants.roles.student && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-1">
                      <i className="fa-solid fa-user-graduate text-sm"></i> Student
                    </span>
                  </label>
                  <select
                    name="student"
                    className="select select-bordered w-full focus:outline-none cursor-pointer"
                    value={formData.student}
                    onChange={handleChange}
                  >
                    <option value="">
                      {loadingStudents ? "Loading students..." : "Select Student"}
                    </option>
                    {!loadingStudents &&
                      students.map((studentObj) => (
                        <option key={studentObj.student_id} value={studentObj.student_id}>
                          {studentObj.student_name}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {role === constants.roles.teacher && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-1">
                      <i className="fa-solid fa-chalkboard-teacher text-sm"></i> Teacher
                    </span>
                  </label>
                  <select
                    name="teacher"
                    className="select select-bordered w-full focus:outline-none cursor-pointer"
                    value={formData.teacher}
                    onChange={handleChange}
                  >
                    <option value="">
                      {loadingTeachers ? "Loading teachers..." : "Select Teacher"}
                    </option>
                    {!loadingTeachers &&
                      teachers.map((teacher) => (
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
                    <option value="">
                      {loadingGuardians ? "Loading guardians..." : "Select Guardian"}
                    </option>
                    {!loadingGuardians &&
                      guardians.map((guardian) => (
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
                      <i className="fa-solid fa-briefcase text-sm"></i> Office Staff

                    </span>
                  </label>
                  <select
                    name="office_staff"
                    className="select select-bordered w-full focus:outline-none cursor-pointer"
                    value={formData.office_staff}
                    onChange={handleChange}
                  >
                    <option value="">
                      {loadingOfficeStaff ? "Loading office staff..." : "Select Office Staff"}
                    </option>
                    {!loadingOfficeStaff &&
                      officeStaff.map((staff) => (
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

        {/* NAVIGATION BUTTONS */}

        <div className="flex flex-col md:flex-row items-center md:items-stretch gap-4 p-6">
          {/* Back button - Only for step > 0 */}
          {step > 0 && (
            <button
              type="button"
              onClick={prev}
              className="btn bgTheme text-white w-40 hover:bg-blue-700 flex items-center justify-center"
            >
              <i className="fa-solid fa-arrow-left mr-2"></i> Back
            </button>
          )}
          {/* Next button - Only for step 0 */}
          {step === 0 && (
            <div className="flex-1 flex justify-end">
              <button
                type="button"
                onClick={next}
                className={`bgTheme text-white px-4 py-2 rounded-lg shadow w-40 ${role.length === 0 || (role === constants.roles.student && !formData.year_level)
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-700"
                  }`}
                disabled={role.length === 0 || (role === constants.roles.student && !formData.year_level)}
              >
                Next
              </button>
            </div>
          )}

          {/* Upload button - Only for step 1 */}
          {step === 1 && (
            <div className="flex-1 flex justify-end md:justify-end">
              <button type="submit" className="btn bgTheme text-white w-40">
                {loading ? (
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                ) : (
                  <i className="fa-solid fa-cloud-upload-alt ml-2"></i>
                )}
                {loading ? "" : "Upload"}
              </button>
            </div>
          )}
        </div>

      </form>
      {showAlert && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Document Upload</h3>
            <p className="py-4">{alertMessage.split("\n").map((line, idx) => (
              <span key={idx}>
                {line}
                <br />
              </span>
            ))}</p>
            <div className="modal-action">
              <button
                className="btn bgTheme text-white w-30"
                onClick={() => setShowAlert(false)}
              >
                OK
              </button>
            </div>
          </div>
        </dialog>
      )}

    </div>
  );
};


