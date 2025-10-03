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
  const [Disable, setDisable] = useState(true);
  const [AddField, setAddField] = useState(0);
  const [selectedTeacherName, setSelectedTeacherName] = useState("");
  const [showTeacherDropdown, setShowTeacherDropdown] = useState(false);
  const [searchTeacherInput, setSearchTeacherInput] = useState("");
  const [showGuardianDropdown, setShowGuardianDropdown] = useState(false);
  const [selectedGuardianName, setSelectedGuardianName] = useState("");
  const [searchGuardianInput, setSearchGuardianInput] = useState("");
  const [showOfficeStaffDropdown, setShowOfficeStaffDropdown] = useState(false);
  const [selectedOfficeStaffName, setSelectedOfficeStaffName] = useState("");
  const [searchOfficeStaffInput, setSearchOfficeStaffInput] = useState("");
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [selectedStudentName, setSelectedStudentName] = useState("");
  const [searchStudentInput, setSearchStudentInput] = useState("");

  const [loadingDocumentTypes, setLoadingDocumentTypes] = useState(false);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [loadingGuardians, setLoadingGuardians] = useState(false);
  const [loadingOfficeStaff, setLoadingOfficeStaff] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [docTypeErrors, setDocTypeErrors] = useState([]);

  const [role, setRole] = useState("");

  const [formData, setFormData] = useState({
    student: "",
    teacher: "",
    guardian: "",
    office_staff: "",
    year_level: "",
  });
  const filteredTeachers = teachers.filter((teacher) =>
    `${teacher.first_name} ${teacher.last_name}`
      .toLowerCase()
      .includes(searchTeacherInput.toLowerCase())
  );
  const filteredGuardians = guardians.filter((guardian) =>
    `${guardian.first_name} ${guardian.last_name}`
      .toLowerCase()
      .includes(searchGuardianInput.toLowerCase())
  );
  const filteredOfficeStaff = officeStaff.filter((staff) =>
    `${staff.first_name} ${staff.last_name}`
      .toLowerCase()
      .includes(searchOfficeStaffInput.toLowerCase())
  );
  const filteredStudents = students.filter((studentObj) =>
    studentObj.student_name
      .toLowerCase()
      .includes(searchStudentInput.toLowerCase())
  );

  // Dynamic fields for document uploads
  const [uploadFields, setUploadFields] = useState([
    { files: null, document_types: "", identities: "" },
  ]);
  const [identityErrors, setIdentityErrors] = useState([]);
  //  validation
  const validateIdentity = (identity, docTypeId) => {
    if (!docTypeId || !identity) return "";

    const selectedDoc = documentType.find(
      (doc) => doc.id.toString() === docTypeId.toString()
    );
    if (!selectedDoc) return "";

    const name = selectedDoc.name.trim().toLowerCase();

    // Aadhaar
    if (name === "aadhaar") {
      const aadhaarRegex = /^\d{12}$/;
      return aadhaarRegex.test(identity)
        ? ""
        : "Aadhaar must be 12 digits (e.g. 123456789012)";
    }

    // Passport
    else if (name === "passport") {
      const passportRegex = /^[A-Z]{1}[0-9]{7}$/;
      return passportRegex.test(identity)
        ? ""
        : "Passport format: 1 letter + 7 digits (e.g. K1234567)";
    }

    // Birth Certificate
    else if (name === "birth certificate") {
      const bcRegex = /^BRN-\d{4}-\d{3,}$/;
      return bcRegex.test(identity)
        ? ""
        : "Birth Certificate format: BRN-YYYY-XXX (e.g. BRN-2021-000123)";
    }

    // Transfer Certificate
    else if (name === "transfer certificate") {
      const tcRegex = /^TC-\d{4}-\d{3,}$/;
      return tcRegex.test(identity)
        ? ""
        : "Transfer Certificate format: TC-YYYY-XXX (e.g. TC-2022-00123)";
    }

    // Bonafide Certificate
    else if (name === "bonafide certificate") {
      const bonafideRegex = /^BONAFIDE-\d{4}-\d{3,}$/;
      return bonafideRegex.test(identity)
        ? ""
        : "Bonafide format: BONAFIDE-YYYY-XXX (e.g. BONAFIDE-2023-001)";
    }

    // PAN Card
    else if (name === "pan card") {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      return panRegex.test(identity)
        ? ""
        : "PAN format: 5 letters + 4 digits + 1 letter (e.g. ABCDE1234F)";
    }

    // Driving License
    else if (name === "driving license") {
      const dlRegex = /^[A-Z]{2}[ -]?\d{2}[ -]?\d{2,4}[ -]?\d{6,7}$/;
      return dlRegex.test(identity)
        ? ""
        : "Driving License: 2 letters (State) + 2 digits (RTO) + Year + Number. Example: MH12 2011 0012345 or DL-01-2017-001234";
    }

    // Caste Certificate
    else if (name === "caste certificate") {
      const casteRegex = /^CASTE-\d{4}-\d{3,}$/;
      return casteRegex.test(identity)
        ? ""
        : "Caste Certificate format: CASTE-YYYY-XXX (e.g. CASTE-2023-001)";
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
      const allStudentsByClass = await fetchStudentYearLevelByClass(
        yearLevelID
      );
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

  console.log(formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "year_level") {
      setFormData((prev) => ({ ...prev, [name]: value, student: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddField = () => {
    setAddField(AddField + 1);
    setUploadFields([
      ...uploadFields,
      { files: null, document_types: "", identities: "" },
    ]);
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

    const newErrors = [...identityErrors];
    const newDocErrors = [...docTypeErrors];

    if (name === "document_types") {
      if (!value) {
        newDocErrors[index] = "Please select a document type";
      } else {
        newDocErrors[index] = "";
      }
    }

    if (name === "document_types" || name === "identities") {
      newErrors[index] = validateIdentity(
        newFields[index].identities,
        newFields[index].document_types
      );
    }

    setIdentityErrors(newErrors);
    setDocTypeErrors(newDocErrors);
  };

  const getAvailableDocumentTypes = (currentIndex) => {
    const selectedDocTypes = uploadFields
      .map((field, idx) => (idx !== currentIndex ? field.document_types : null))
      .filter(Boolean);
    return documentType.filter(
      (doc) => !selectedDocTypes.includes(doc.id.toString())
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      for (const [index, field] of uploadFields.entries()) {
        if (!field.files || !field.document_types) {
          setAlertMessage(
            "Please select file and document type for all fields"
          );
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
        if (formData.student)
          formDataToSend.append("student", formData.student);
        if (formData.teacher)
          formDataToSend.append("teacher", formData.teacher);
        if (formData.guardian)
          formDataToSend.append("guardian", formData.guardian);
        if (formData.office_staff)
          formDataToSend.append("office_staff", formData.office_staff);
        if (field.identities)
          formDataToSend.append("identities", field.identities);

        await axios.post(`${constants.baseUrl}/d/Document/`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setAlertMessage("Documents uploaded successfully!");
      setShowAlert(true);
      setUploadFields([{ files: null, document_types: "", identities: "" }]);
      setFormData({
        student: "",
        teacher: "",
        guardian: "",
        office_staff: "",
        year_level: "",
      });
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
      const selected = yearLevel.find(
        (yl) => yl.id === parseInt(formData.year_level)
      );
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
    <div className="min-h-screen p-5 bg-gray-50 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-7xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md my-5"
      >
        {/* Steps */}
        <ul className="steps mb-6 w-full">
          <li className={`step ${step >= 0 ? "step-primary" : ""}`}>Role</li>
          <li className={`step ${step >= 1 ? "step-primary" : ""}`}>
            Fill Form
          </li>
        </ul>

        {/* Custom theme for steps */}
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

        {/* STEP 0 */}
        {/* STEP 0 */}
        {step === 0 && (
          <div className="w-full max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
              Select Role For Upload Documents<i className="fa-solid fa-cloud-upload-alt ml-2"></i>
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Role */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <i className="fa-solid fa-user-shield text-sm"></i> Role
                  </span>
                </label>
                <select
                  className="select select-bordered w-full bg-white dark:bg-gray-700 dark:text-gray-200 focus:outline-none cursor-pointer"
                  value={role}
                  onChange={handleRoleChange}
                >
                  <option value="">
                    {loadingRoles ? "Loading roles..." : "Select Role"}
                  </option>
                  {filteredRoles.map((roleItem) => (
                    <option key={roleItem.id} value={roleItem.name}>
                      {roleItem.name.charAt(0).toUpperCase() +
                        roleItem.name.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Class for Student */}
              {role === constants.roles.student && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-700 dark:text-gray-300 flex items-center gap-1">
                      <i className="fa-solid fa-graduation-cap text-sm"></i>{" "}
                      Class <span className="text-error">*</span>
                    </span>
                  </label>
                  <select
                    name="year_level"
                    className="select select-bordered w-full bg-white dark:bg-gray-700 dark:text-gray-200 focus:outline-none cursor-pointer"
                    required
                    value={formData.year_level}
                    onChange={handleChange}
                  >
                    <option value="">
                      {yearLevel.length === 0
                        ? "Loading classes..."
                        : "Select Class"}
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
        {/* STEP 1 */}
        {step === 1 && (
          <div className="w-full max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
              Upload your documents{" "}
              <i className="fa-solid fa-cloud-upload-alt ml-2"></i>
            </h1>

            {uploadFields.map((field, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center w-full"
              >
                {/* File Upload */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-gray-700 dark:text-gray-300 flex items-center gap-1">
                      <i className="fa-solid fa-file-upload text-sm"></i>{" "}
                      Document Upload
                      <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="file"
                    name="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="file-input file-input-bordered w-full bg-white dark:bg-gray-700 dark:text-gray-200 focus:outline-none"
                    required
                    onChange={(e) => handleFileChange(e, index)}
                  />
                </div>

                {/* Document Type */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-gray-700 dark:text-gray-300 flex items-center gap-1 pt-6">
                      <i className="fa-solid fa-file text-sm"></i> Document Type
                      <span className="text-error">*</span>
                    </span>
                  </label>
                  <select
                    name="document_types"
                    className="select select-bordered w-full bg-white dark:bg-gray-700 dark:text-gray-200 focus:outline-none cursor-pointer"
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
                  <div className="h-5">
                    <span className="text-red-500 text-sm leading-tight">
                      {docTypeErrors[index] || ""}
                    </span>
                  </div>
                </div>

                {/* Identity */}
                <div className="form-control w-full pt-6">
                  <label className="label">
                    <span className="label-text text-gray-700 dark:text-gray-300 flex items-center gap-1">
                      <i className="fa-solid fa-id-card text-sm"></i> Identity
                    </span>
                  </label>
                  <input
                    type="text"
                    name="identities"
                    className="input input-bordered w-full bg-white dark:bg-gray-700 dark:text-gray-200 focus:outline-none"
                    value={field.identities}
                    onChange={(e) => handleUploadChange(e, index)}
                    placeholder="Enter identity ID"
                  />
                  <div className="h-5">
                    <span className="text-red-500 text-sm leading-tight">
                      {identityErrors[index] || ""}
                    </span>
                  </div>
                </div>

                {/* Add/Remove */}
                <div className="form-control w-full flex items-end pt-6">
                  {index === 0 ? (
                    <button
                      type="button"
                      className={`btn bgTheme text-white w-full md:w-32 ${
                        AddField === 3
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-purple-700"
                      }`}
                      onClick={handleAddField}
                      disabled={AddField === 3}
                    >
                      <i className="fa-solid fa-plus mr-1"></i> Add
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-error w-full md:w-32"
                      onClick={() => {
                        setUploadFields(
                          uploadFields.filter((_, i) => i !== index)
                        ),
                          setAddField(AddField - 1);
                      }}
                    >
                      <i className="fa-solid fa-trash mr-1"></i> Remove
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Role-based dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {role === constants.roles.student && (
                <div className="form-control relative">
                  <label className="label">
                    <span className="label-text text-gray-700 dark:text-gray-300 flex items-center gap-1">
                      <i className="fa-solid fa-user-graduate text-sm"></i>{" "}
                      Student
                    </span>
                  </label>

                  <div
                    className="input input-bordered w-full flex items-center justify-between cursor-pointer bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600"
                    onClick={() => setShowStudentDropdown(!showStudentDropdown)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        setShowStudentDropdown(!showStudentDropdown);
                    }}
                  >
                    {selectedStudentName ||
                      (loadingStudents
                        ? "Loading students..."
                        : "Select Student")}
                    <i
                      className={`fa-solid fa-chevron-${
                        showStudentDropdown ? "up" : "down"
                      } ml-2`}
                    ></i>
                  </div>

                  {showStudentDropdown && (
                    <div className="absolute z-10 bg-white dark:bg-gray-700 rounded w-full mt-1 shadow-lg border border-gray-300 dark:border-gray-600">
                      <div className="p-2 sticky top-0 shadow-sm bg-white dark:bg-gray-700">
                        <input
                          type="text"
                          placeholder="Search Student..."
                          className="input input-bordered w-full focus:outline-none bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-500"
                          value={searchStudentInput}
                          onChange={(e) =>
                            setSearchStudentInput(e.target.value)
                          }
                        />
                      </div>

                      <div className="max-h-40 overflow-y-auto">
                        {!loadingStudents && filteredStudents.length > 0 ? (
                          filteredStudents.map((studentObj) => (
                            <p
                              key={studentObj.student_id}
                              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer text-gray-800 dark:text-gray-200"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  student: studentObj.student_id.toString(),
                                }));
                                setSelectedStudentName(studentObj.student_name);
                                setSearchStudentInput("");
                                setShowStudentDropdown(false);
                                setDisable(false);
                              }}
                            >
                              {studentObj.student_name}
                            </p>
                          ))
                        ) : (
                          <p className="p-2 text-gray-500 dark:text-gray-400">
                            {loadingStudents
                              ? "Loading students..."
                              : "No students found."}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {role === constants.roles.teacher && (
                <div className="form-control relative">
                  <label className="label">
                    <span className="label-text text-gray-700 dark:text-gray-300 flex items-center gap-1">
                      <i className="fa-solid fa-chalkboard-teacher text-sm"></i>{" "}
                      Teacher
                    </span>
                  </label>

                  <div
                    className="input input-bordered w-full flex items-center justify-between cursor-pointer bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600"
                    onClick={() => setShowTeacherDropdown(!showTeacherDropdown)}
                  >
                    {selectedTeacherName || "Select Teacher"}
                    <i
                      className={`fa-solid fa-chevron-${
                        showTeacherDropdown ? "up" : "down"
                      } ml-2`}
                    ></i>
                  </div>

                  {showTeacherDropdown && (
                    <div className="absolute z-10 bg-white dark:bg-gray-700 rounded w-full mt-1 shadow-lg border border-gray-300 dark:border-gray-600">
                      <div className="p-2 sticky top-0 shadow-sm bg-white dark:bg-gray-700">
                        <input
                          type="text"
                          placeholder="Search Teacher..."
                          className="input input-bordered w-full focus:outline-none bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-500"
                          value={searchTeacherInput}
                          onChange={(e) =>
                            setSearchTeacherInput(e.target.value)
                          }
                        />
                      </div>

                      <div className="max-h-40 overflow-y-auto">
                        {!loadingTeachers &&
                          filteredTeachers.map((teacher) => (
                            <p
                              key={teacher.id}
                              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer text-gray-800 dark:text-gray-200"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  teacher: teacher.id.toString(),
                                }));
                                setSelectedTeacherName(
                                  `${teacher.first_name} ${teacher.last_name}`
                                );
                                setSearchTeacherInput("");
                                setShowTeacherDropdown(false);
                                setDisable(false);
                              }}
                            >
                              {teacher.first_name} {teacher.last_name}
                            </p>
                          ))}

                        {filteredTeachers.length === 0 && (
                          <p className="p-2 text-gray-500 dark:text-gray-400">
                            No teachers found.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {role === constants.roles.guardian && (
                <div className="form-control relative">
                  <label className="label">
                    <span className="label-text text-gray-700 dark:text-gray-300 flex items-center gap-1">
                      <i className="fa-solid fa-user-shield text-sm"></i>{" "}
                      Guardian
                    </span>
                  </label>

                  <div
                    className="input input-bordered w-full flex items-center justify-between cursor-pointer bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600"
                    onClick={() =>
                      setShowGuardianDropdown(!showGuardianDropdown)
                    }
                  >
                    {selectedGuardianName || "Select Guardian"}
                    <i
                      className={`fa-solid fa-chevron-${
                        showGuardianDropdown ? "up" : "down"
                      } ml-2`}
                    ></i>
                  </div>

                  {showGuardianDropdown && (
                    <div className="absolute z-10 bg-white dark:bg-gray-700 rounded w-full mt-1 shadow-lg border border-gray-300 dark:border-gray-600">
                      <div className="p-2 sticky top-0 shadow-sm bg-white dark:bg-gray-700">
                        <input
                          type="text"
                          placeholder="Search Guardian..."
                          className="input input-bordered w-full focus:outline-none bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-500"
                          value={searchGuardianInput}
                          onChange={(e) =>
                            setSearchGuardianInput(e.target.value)
                          }
                        />
                      </div>

                      <div className="max-h-40 overflow-y-auto">
                        {!loadingGuardians &&
                          filteredGuardians.map((guardian) => (
                            <p
                              key={guardian.id}
                              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer text-gray-800 dark:text-gray-200"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  guardian: guardian.id.toString(),
                                }));
                                setSelectedGuardianName(
                                  `${guardian.first_name} ${guardian.last_name}`
                                );
                                setSearchGuardianInput("");
                                setShowGuardianDropdown(false);
                                setDisable(false);
                              }}
                            >
                              {guardian.first_name} {guardian.last_name}
                            </p>
                          ))}

                        {filteredGuardians.length === 0 && (
                          <p className="p-2 text-gray-500 dark:text-gray-400">
                            No guardians found.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {role === constants.roles.officeStaff && (
                <div className="form-control relative">
                  <label className="label">
                    <span className="label-text text-gray-700 dark:text-gray-300 flex items-center gap-1">
                      <i className="fa-solid fa-briefcase text-sm"></i> Office
                      Staff
                    </span>
                  </label>

                  <div
                    className="input input-bordered w-full flex items-center justify-between cursor-pointer bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600"
                    onClick={() =>
                      setShowOfficeStaffDropdown(!showOfficeStaffDropdown)
                    }
                  >
                    {selectedOfficeStaffName || "Select Office Staff"}
                    <i
                      className={`fa-solid fa-chevron-${
                        showOfficeStaffDropdown ? "up" : "down"
                      } ml-2`}
                    ></i>
                  </div>

                  {showOfficeStaffDropdown && (
                    <div className="absolute z-10 bg-white dark:bg-gray-700 rounded w-full mt-1 shadow-lg border border-gray-300 dark:border-gray-600">
                      <div className="p-2 sticky top-0 shadow-sm bg-white dark:bg-gray-700">
                        <input
                          type="text"
                          placeholder="Search Office Staff..."
                          className="input input-bordered w-full focus:outline-none bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-500"
                          value={searchOfficeStaffInput}
                          onChange={(e) =>
                            setSearchOfficeStaffInput(e.target.value)
                          }
                        />
                      </div>

                      <div className="max-h-40 overflow-y-auto">
                        {!loadingOfficeStaff &&
                          filteredOfficeStaff.map((staff) => (
                            <p
                              key={staff.id}
                              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer text-gray-800 dark:text-gray-200"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  office_staff: staff.id.toString(),
                                }));
                                setSelectedOfficeStaffName(
                                  `${staff.first_name} ${staff.last_name}`
                                );
                                setSearchOfficeStaffInput("");
                                setShowOfficeStaffDropdown(false);
                                setDisable(false);
                              }}
                            >
                              {staff.first_name} {staff.last_name}
                            </p>
                          ))}

                        {filteredOfficeStaff.length === 0 && (
                          <p className="p-2 text-gray-500 dark:text-gray-400">
                            No office staff found.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col ju md:flex-row items-center md:items-stretch gap-4 p-6">
          {step === 0 && (
            <div className="flex-1 flex justify-end">
              <button
                type="button"
                onClick={next}
                className={`btn bgTheme text-white w-40 ${
                  role.length === 0 ||
                  (role === constants.roles.student && !formData.year_level)
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-purple-700"
                }`}
                disabled={
                  role.length === 0 ||
                  (role === constants.roles.student && !formData.year_level)
                }
              >
                Next
              </button>
            </div>
          )}
          {step === 1 && (
            <div className="flex-1 flex justify-end gap-4">
              <button
                type="button"
                onClick={prev}
                className="btn bgTheme w-auto md:w-32 text-white  hover:bg-purple-700 flex items-center justify-center"
              >
                <i className="fa-solid fa-arrow-left mr-2"></i> Back
              </button>

              <button
                type="submit"
                className={`btn bgTheme text-white w-auto md:w-36  ${
                  Disable
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-purple-700"
                }`}
                disabled={Disable}
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-cloud-upload-alt mr-2"></i> Upload
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </form>

      {/* Modal */}
      {showAlert && (
        <dialog className="modal modal-open">
          <div className="modal-box bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100">
            <h3 className="font-bold text-lg">Document Upload</h3>
            <p className="py-4">
              {alertMessage.split("\n").map((line, idx) => (
                <span key={idx}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
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
