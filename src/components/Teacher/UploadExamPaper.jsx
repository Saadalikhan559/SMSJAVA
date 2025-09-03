import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  fetchExamType,
  fetchYearLevels,
  fetchSubjects,
  fetchTerms,
  fetchAllTeachers,
} from "../../services/api/Api";
import { useNavigate } from "react-router-dom";
import { allRouterLink } from "../../router/AllRouterLinks";
import axios from "axios";
import { constants } from "../../global/constants";

const UploadExamPaper = () => {
  const navigate = useNavigate();

  const [examType, setExamType] = useState([]);
  const [className1, setClassName] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [terms, setTerms] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
      if (!accessToken) return;
      const obj = await fetchExamType(accessToken);
      if (obj) setExamType(obj);
    } catch (err) {
      console.error("Failed to load exam types:", err);
      throw err;
    }
  };

  const getClassName = async () => {
    try {
      const ClassName = await fetchYearLevels();
      setClassName(ClassName);
    } catch (err) {
      console.error("Failed to load classes:", err);
      throw err;
    }
  };

  const getSubjects = async () => {
    try {
      const obj = await fetchSubjects();
      setSubjects(obj);
    } catch (err) {
      console.error("Failed to load subjects:", err);
      throw err;
    }
  };

  const getTerms = async () => {
    try {
      const obj = await fetchTerms();
      setTerms(obj);
    } catch (err) {
      console.error("Failed to load terms:", err);
      throw err;
    }
  };

  const getTeachers = async () => {
    try {
      const obj = await fetchAllTeachers();
      setTeachers(obj);
    } catch (err) {
      console.error("Failed to load teachers:", err);
      throw err;
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        if (accessToken) await getExamType();
        await getClassName();
        await getSubjects();
        await getTerms();
        await getTeachers();
        setError(false);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [accessToken]);

  const handleNavigate = () => {
    navigate(allRouterLink.UpdateExamPaper);
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
      const response = await axios.post(
        `${BASE_URL}/d/Exam-Paper/create_exampaper/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        alert("ExamPaper submitted successfully");
        window.location.reload();
      } else {
        throw new Error(response.data.message || "Failed to create exam schedule");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`Error: ${error.response?.data?.paper_code || error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce [animation-delay:-0.2s]"></div>
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce [animation-delay:-0.4s]"></div>
        </div>
        <p className="mt-2 text-gray-500 text-sm">Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
        <i className="fa-solid fa-triangle-exclamation text-5xl text-red-400 mb-4"></i>
        <p className="text-lg text-red-400 font-medium">Failed to load data, Try Again</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5 bg-gray-50">
      <div className="w-full max-w-7xl mx-auto p-6 bg-base-100 rounded-box my-5 shadow-sm">
        <button
          className="font-bold text-xl cursor-pointer hover:underline flex items-center gap-2 textTheme"
          onClick={handleNavigate}
        >
          Update Exam Paper <span>&rarr;</span>
        </button>

        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className="text-3xl font-bold text-center mb-8">
            Upload Exam Paper <i className="fa-solid fa-file-upload ml-2"></i>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Exam Type */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Exam Type <span className="text-error">*</span></span>
              </label>
            <select
  className={`select select-bordered w-full ${errors.exam_type ? "select-error" : ""}`}
  {...register("exam_type", { required: "Exam type is required" })}
>
  <option value="">Select Exam Type</option> {/* always visible */}
  {examType.length === 0 ? (
    <option disabled>Loading...</option>
  ) : (
    examType.map((item) => (
      <option key={item.id} value={item.id}>{item.name}</option>
    ))
  )}
</select>

              {errors.exam_type && <label className="label"><span className="label-text-alt text-error">{errors.exam_type.message}</span></label>}
            </div>

            {/* Year Level */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Year Level <span className="text-error">*</span></span>
              </label>
              <select
                className={`select select-bordered w-full ${errors.year_level ? "select-error" : ""}`}
                {...register("year_level", { required: "Year level is required" })}
              >
                {className1.length === 0 ? (
                  <option>Loading...</option>
                ) : (
                  <>
                    <option value="">Select Year Level</option>
                    {className1.map((item) => (
                      <option key={item.id} value={item.id}>{item.level_name}</option>
                    ))}
                  </>
                )}
              </select>
              {errors.year_level && <label className="label"><span className="label-text-alt text-error">{errors.year_level.message}</span></label>}
            </div>

            {/* Term */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Term <span className="text-error">*</span></span>
              </label>
             <select
  className={`select select-bordered w-full ${errors.term ? "select-error" : ""}`}
  {...register("term", { required: "Term is required" })}
>
  <option value="">Select Term</option> 
  {terms.length === 0 ? (
    <option disabled>Loading...</option>
  ) : (
    terms.map((item) => (
      <option key={item.id} value={item.id}>{item.year}</option>
    ))
  )}
</select>

              {errors.term && <label className="label"><span className="label-text-alt text-error">{errors.term.message}</span></label>}
            </div>

            {/* Subject */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Subject <span className="text-error">*</span></span>
              </label>
              <select
                className={`select select-bordered w-full ${errors.subject ? "select-error" : ""}`}
                {...register("subject", { required: "Subject is required" })}
              >
                {subjects.length === 0 ? (
                  
                  <option>Loading...</option>
                ) : (
                  <>
                    <option value="">Select Subject</option>
                    {subjects.map((item) => (
                      <option key={item.id} value={item.id}>{item.subject_name}</option>
                    ))}
                  </>
                )}
              </select>
              {errors.subject && <label className="label"><span className="label-text-alt text-error">{errors.subject.message}</span></label>}
            </div>

            {/* Teacher */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Teacher <span className="text-error">*</span></span>
              </label>
              <select
                className={`select select-bordered w-full ${errors.teacher ? "select-error" : ""}`}
                {...register("teacher", { required: "Teacher is required" })}
              >
                {teachers.length === 0 ? (
                  <option>Loading...</option>
                ) : (
                  <>
                    <option value="">Select Teacher</option>
                    {teachers.map((item) => (
                      <option key={item.id} value={item.id}>{item.first_name} {item.last_name}</option>
                    ))}
                  </>
                )}
              </select>
              {errors.teacher && <label className="label"><span className="label-text-alt text-error">{errors.teacher.message}</span></label>}
            </div>

            {/* Total Marks */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Total Marks <span className="text-error">*</span></span>
              </label>
              <input
                type="number"
                className={`input input-bordered w-full ${errors.total_marks ? "input-error" : ""}`}
                placeholder="Enter total marks"
                {...register("total_marks", { required: "Total marks is required", min: { value: 1, message: "Marks must be positive" } })}
              />
              {errors.total_marks && <label className="label"><span className="label-text-alt text-error">{errors.total_marks.message}</span></label>}
            </div>

            {/* Paper Code */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Paper Code <span className="text-error">*</span></span>
              </label>
              <input
                type="text"
                className={`input input-bordered w-full ${errors.paper_code ? "input-error" : ""}`}
                placeholder="Enter paper code"
                {...register("paper_code", { required: "Paper code is required", pattern: { value: /^[a-zA-Z0-9-]+$/, message: "Only letters, numbers and hyphens allowed" } })}
              />
              {errors.paper_code && <label className="label"><span className="label-text-alt text-error">{errors.paper_code.message}</span></label>}
            </div>

            {/* File Upload */}
            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text">Exam Paper File <span className="text-error">*</span></span>
              </label>
              <input
                type="file"
                className={`file-input file-input-bordered w-full ${errors.uploaded_file ? "file-input-error" : ""}`}
                accept=".pdf,.doc,.docx"
                {...register("uploaded_file", {
                  required: "File is required",
                  validate: {
                    fileSize: (files) => files[0]?.size <= 5 * 1024 * 1024 || "File size must be less than 5MB",
                    fileType: (files) => ["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(files[0]?.type) || "Only PDF and Word documents are allowed"
                  }
                })}
              />
              {errors.uploaded_file && <label className="label"><span className="label-text-alt text-error">{errors.uploaded_file.message}</span></label>}
            </div>
          </div>

          <div className="flex justify-center mt-10">
            <button type="submit" className="btn bgTheme text-white w-52" disabled={isSubmitting}>
              {isSubmitting ? <i className="fa-solid fa-spinner fa-spin mr-2" /> : <i className="fa-solid fa-upload mr-2" />}
              {isSubmitting ? "Uploading..." : "Upload Paper"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadExamPaper;
