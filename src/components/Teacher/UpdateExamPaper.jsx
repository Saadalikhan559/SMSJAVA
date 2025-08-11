import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  fetchExamType,
  fetchYearLevels,
  fetchSubjects,
  fetchTerms,
  fetchAllTeachers,
} from "../../services/api/Api";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { allRouterLink } from "../../router/AllRouterLinks";
import { constants } from "../../global/constants";

const UpdateExamPaper = () => {
  const navigate = useNavigate();

  const [examType, setExamType] = useState([]);
  const [className1, setClassName] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [terms, setTerms] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [accessToken, setAccessToken] = useState("");

  const BASE_URL = constants.baseUrl;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      exam_type: "",
      term: "",
      subject: "",
      year_level: "",
      total_marks: "",
      paper_code: "",
      teacher: "",
      uploaded_file: null,
    },
  });

  useEffect(() => {
    const tokenData = localStorage.getItem("authTokens");
    if (tokenData) {
      try {
        const tokens = JSON.parse(tokenData);
        if (tokens?.access && tokens.access !== accessToken) {
          setAccessToken(tokens.access);
        }
      } catch (error) {
        console.error("Error parsing auth tokens:", error);
      }
    }
  }, []);

  const getExamType = async () => {
    try {
      if (!accessToken) {
        console.error("No access token available");
        return;
      }

      const obj = await fetchExamType(accessToken);
      if (obj) {
        setExamType(obj);
      } else {
        console.error("Received empty response from fetchExamType");
      }
    } catch (err) {
      console.error("Failed to load exam types:", err);
    }
  };

  // Fetch all classes
  const getClassName = async () => {
    try {
      const ClassName = await fetchYearLevels();
      setClassName(ClassName);
    } catch (err) {
      console.log("Failed to load classes. Please try again." + err);
    }
  };

  // Fetch Subjects
  const getsubjects = async () => {
    try {
      const obj = await fetchSubjects();
      setSubjects(obj);
    } catch (err) {
      console.log("Failed to load classes. Please try again." + err);
    }
  };

  // Fetch terms
  const getTerms = async () => {
    try {
      const obj = await fetchTerms();
      setTerms(obj);
    } catch (err) {
      console.log("Failed to load classes. Please try again." + err);
    }
  };

  // Fetch terms
  const getTeachers = async () => {
    try {
      const obj = await fetchAllTeachers();
      setTeachers(obj);
    } catch (err) {
      console.log("Failed to load classes. Please try again." + err);
    }
  };

  useEffect(() => {
    if (accessToken) {
      // Only call getExamType if we have a token
      getExamType();
    }
    getClassName();
    getsubjects();
    getTerms();
    getTeachers();
  }, [accessToken]);

  const handleNavigate = () => {
    navigate(allRouterLink.UploadExamPaper);
  };

  const onSubmit = async (data) => {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append("exam_type", data.exam_type);
    formData.append("term", data.term);
    formData.append("subject", data.subject);
    formData.append("year_level", data.year_level);
    formData.append("total_marks", data.total_marks);
    formData.append("paper_code", data.paper_code);
    formData.append("teacher", data.teacher);
    formData.append("uploaded_file", data.uploaded_file[0]);

    try {
      if (!accessToken) return;
      // Replace with your actual API call
      const response = await axios.put(
        `${BASE_URL}/d/Exam-Paper/update_exampaper/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("Form submitted:", formData);
      if (response.status === 200 || response.status === 201) {
        console.error("ExamPaper submitted successfully");
        alert(`ExamPaper Updated successfully`);
        // window.location.reload();
      } else {
        throw new Error(
          response.data.message || "Failed to create exam schedule"
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`Error: ${error.response.data.paper_code}`);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-base-100 rounded-box my-5 shadow-sm">
      <button
        className="font-bold text-xl cursor-pointer hover:underline flex items-center gap-2 text-blue-600"
        onClick={handleNavigate}
      >
        Create Exam Paper <span>&rarr;</span>
      </button>

      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-3xl font-bold text-center mb-8">
          Update Exam Paper <i className="fa-solid fa-pen-nib ml-2"></i>
        </h1>

        {/* Error and Success messages would go here */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Exam Type */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Exam Type <span className="text-error">*</span>
              </span>
            </label>
            <select
              className={`select select-bordered w-full ${
                errors.exam_type ? "select-error" : ""
              }`}
              {...register("exam_type", { required: "Exam type is required" })}
            >
              <option value="">Select Exam Type</option>
              {examType?.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
            {errors.exam_type && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.exam_type.message}
                </span>
              </label>
            )}
          </div>

          {/* Year Level */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Year Level <span className="text-error">*</span>
              </span>
            </label>
            <select
              className={`select select-bordered w-full ${
                errors.year_level ? "select-error" : ""
              }`}
              {...register("year_level", {
                required: "Year level is required",
              })}
            >
              <option value="">Select Year Level</option>
              {className1?.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.level_name}
                </option>
              ))}
            </select>
            {errors.year_level && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.year_level.message}
                </span>
              </label>
            )}
          </div>

          {/* Term */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Term <span className="text-error">*</span>
              </span>
            </label>
            <select
              className={`select select-bordered w-full ${
                errors.term ? "select-error" : ""
              }`}
              {...register("term", { required: "Term is required" })}
            >
              <option value="">Select Term</option>
              {terms?.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.year}
                </option>
              ))}
            </select>
            {errors.term && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.term.message}
                </span>
              </label>
            )}
          </div>

          {/* Subject */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Subject <span className="text-error">*</span>
              </span>
            </label>
            <select
              className={`select select-bordered w-full ${
                errors.subject ? "select-error" : ""
              }`}
              {...register("subject", { required: "Subject is required" })}
            >
              <option value="">Select Subject</option>
              {subjects?.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.subject_name}
                </option>
              ))}
            </select>
            {errors.subject && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.subject.message}
                </span>
              </label>
            )}
          </div>

          {/* Total Marks */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Total Marks <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="number"
              className={`input input-bordered w-full ${
                errors.total_marks ? "input-error" : ""
              }`}
              placeholder="Enter total marks"
              {...register("total_marks", {
                required: "Total marks is required",
                min: { value: 1, message: "Marks must be positive" },
              })}
            />
            {errors.total_marks && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.total_marks.message}
                </span>
              </label>
            )}
          </div>

          {/* Paper Code */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Paper Code <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="text"
              className={`input input-bordered w-full ${
                errors.paper_code ? "input-error" : ""
              }`}
              placeholder="Enter paper code"
              {...register("paper_code", {
                required: "Paper code is required",
                pattern: {
                  value: /^[a-zA-Z0-9-]+$/,
                  message: "Only letters, numbers and hyphens allowed",
                },
              })}
            />
            {errors.paper_code && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.paper_code.message}
                </span>
              </label>
            )}
          </div>

          {/* Teacher */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Teacher <span className="text-error">*</span>
              </span>
            </label>
            <select
              className={`select select-bordered w-full ${
                errors.teacher ? "select-error" : ""
              }`}
              {...register("teacher", { required: "Teacher is required" })}
            >
              <option value="">Select Teacher</option>
              {teachers?.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.first_name} {student.last_name}
                </option>
              ))}
            </select>
            {errors.teacher && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.teacher.message}
                </span>
              </label>
            )}
          </div>

          {/* File Upload */}
          <div className="form-control md:col-span-2">
            <label className="label">
              <span className="label-text">
                Exam Paper File <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="file"
              className={`file-input file-input-bordered w-full ${
                errors.uploaded_file ? "file-input-error" : ""
              }`}
              accept=".pdf,.doc,.docx"
              {...register("uploaded_file", {
                required: "File is required",
                validate: {
                  fileSize: (files) =>
                    files[0]?.size <= 5 * 1024 * 1024 ||
                    "File size must be less than 5MB",
                  fileType: (files) =>
                    [
                      "application/pdf",
                      "application/msword",
                      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    ].includes(files[0]?.type) ||
                    "Only PDF and Word documents are allowed",
                },
              })}
            />
            {errors.uploaded_file && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.uploaded_file.message}
                </span>
              </label>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-10">
          <button
            type="submit"
            className="btn btn-primary w-52"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <i className="fa-solid fa-spinner fa-spin mr-2" />
            ) : (
              <i className="fa-solid fa-upload mr-2" />
            )}
            {isSubmitting ? "Updating..." : "Update Paper"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateExamPaper;
