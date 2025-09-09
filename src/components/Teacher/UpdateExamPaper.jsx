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
    if (!accessToken) return;
    try {
      const obj = await fetchExamType(accessToken);
      if (obj) setExamType(obj);
    } catch (err) {
      console.error("Failed to load exam types:", err);
    }
  };

  const getClassName = async () => {
    try {
      const ClassName = await fetchYearLevels();
      setClassName(ClassName);
    } catch (err) {
      console.log("Failed to load classes:", err);
    }
  };

  const getSubjects = async () => {
    try {
      const obj = await fetchSubjects();
      setSubjects(obj);
    } catch (err) {
      console.log("Failed to load subjects:", err);
    }
  };

  const getTerms = async () => {
    try {
      const obj = await fetchTerms();
      setTerms(obj);
    } catch (err) {
      console.log("Failed to load terms:", err);
    }
  };

  const getTeachers = async () => {
    try {
      const obj = await fetchAllTeachers();
      setTeachers(obj);
    } catch (err) {
      console.log("Failed to load teachers:", err);
    }
  };

  useEffect(() => {
    if (accessToken) getExamType();
    getClassName();
    getSubjects();
    getTerms();
    getTeachers();
  }, [accessToken]);

  const handleNavigate = () => {
    navigate(allRouterLink.UploadExamPaper);
  };

  const onSubmit = async (data) => {
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

      if (response.status === 200 || response.status === 201) {
        alert("ExamPaper updated successfully");
      } else {
        throw new Error(
          response.data.message || "Failed to update exam schedule"
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`Error: ${error.response?.data?.paper_code || error.message}`);
    }
  };

  return (
    <div className="min-h-screen p-5 bg-gray-50">
      <div className="w-full max-w-7xl mx-auto p-6 bg-base-100 rounded-box my-5 shadow-sm">
        <button
          className="font-bold text-xl cursor-pointer hover:underline flex items-center gap-2 textTheme"
          onClick={handleNavigate}
        >
          Create Exam Paper <span>&rarr;</span>
        </button>

        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className="text-3xl font-bold text-center mb-8">
            Update Exam Paper <i className="fa-solid fa-pen-nib ml-2"></i>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Exam Type */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  Exam Type <span className="text-error">*</span>
                </span>
              </label>
              <select
                className="select select-bordered w-full"
                {...register("exam_type", { required: "Exam type is required" })}
              >
                <option value="">Select Exam Type</option>
                {examType?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              {errors.exam_type && (
                <p className="text-error text-sm mt-1">{errors.exam_type.message}</p>
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
                className="select select-bordered w-full"
                {...register("year_level", { required: "Year level is required" })}
              >
                <option value="">Select Year Level</option>
                {className1?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.level_name}
                  </option>
                ))}
              </select>
              {errors.year_level && (
                <p className="text-error text-sm mt-1">{errors.year_level.message}</p>
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
                className="select select-bordered w-full"
                {...register("term", { required: "Term is required" })}
              >
                <option value="">Select Term</option>
                {terms?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.year}
                  </option>
                ))}
              </select>
              {errors.term && (
                <p className="text-error text-sm mt-1">{errors.term.message}</p>
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
                className="select select-bordered w-full"
                {...register("subject", { required: "Subject is required" })}
              >
                <option value="">Select Subject</option>
                {subjects?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.subject_name}
                  </option>
                ))}
              </select>
              {errors.subject && (
                <p className="text-error text-sm mt-1">{errors.subject.message}</p>
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
                className="input input-bordered w-full"
                placeholder="Enter total marks"
                {...register("total_marks", {
                  required: "Total marks is required",
                  min: { value: 1, message: "Marks must be positive" },
                })}
              />
              {errors.total_marks && (
                <p className="text-error text-sm mt-1">{errors.total_marks.message}</p>
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
                className="input input-bordered w-full"
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
                <p className="text-error text-sm mt-1">{errors.paper_code.message}</p>
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
                className="select select-bordered w-full"
                {...register("teacher", { required: "Teacher is required" })}
              >
                <option value="">Select Teacher</option>
                {teachers?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.first_name} {item.last_name}
                  </option>
                ))}
              </select>
              {errors.teacher && (
                <p className="text-error text-sm mt-1">{errors.teacher.message}</p>
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
                className="file-input file-input-bordered w-full"
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
                <p className="text-error text-sm mt-1">{errors.uploaded_file.message}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-10">
            <button
              type="submit"
              className="btn bgTheme text-white w-52"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <i className="fa-solid fa-spinner fa-spin mr-2" />
              ) : (
                <i className="fa-solid fa-upload mr-2" />
              )}
              {isSubmitting ? " " : "Update Paper"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateExamPaper;

