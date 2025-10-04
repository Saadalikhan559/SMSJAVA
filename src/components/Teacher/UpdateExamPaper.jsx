import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import {
  fetchYearLevels,
  fetchSubjects,
  fetchTerms,
  fetchAllTeachers,
} from "../../services/api/Api";
import { useNavigate } from "react-router-dom";
import { allRouterLink } from "../../router/AllRouterLinks";
import { AuthContext } from "../../context/AuthContext";

const UpdateExamPaper = () => {
  const navigate = useNavigate();
  const { axiosInstance } = useContext(AuthContext); 

  const [examType, setExamType] = useState([]);
  const [className1, setClassName] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [terms, setTerms] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
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

  // ExamType fetch
  const getExamType = async () => {
    try {
      const response = await axiosInstance.get("/d/Exam-Type/");
      setExamType(response.data);
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
    getExamType();
    getClassName();
    getSubjects();
    getTerms();
    getTeachers();
  }, []);

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
      const response = await axiosInstance.put(
        "/d/Exam-Paper/update_exampaper/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setAlertMessage("Exam Paper updated successfully!");
        setShowAlert(true);
        reset();
      } else {
        throw new Error(
          response.data.message || "Failed to update exam schedule"
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setAlertMessage(
        `Error: ${error.response?.data?.paper_code || error.message}`
      );
      setShowAlert(true);
    }
  };

return (
  <div className="min-h-screen p-5 bg-gray-50 dark:bg-gray-900 mb-10">
    <div className="w-full max-w-7xl mx-auto p-6 bg-base-100 dark:bg-gray-800 rounded-box my-5 shadow-sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-3xl font-bold text-center mb-8 dark:text-white">
          Update Exam Paper <i className="fa-solid fa-pen-nib ml-2"></i>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {[
            { label: "Exam Type", name: "exam_type", data: examType, key: "name", error: errors.exam_type },
            { label: "Year Level", name: "year_level", data: className1, key: "level_name", error: errors.year_level },
            { label: "Term", name: "term", data: terms, key: "year", error: errors.term },
            { label: "Subject", name: "subject", data: subjects, key: "subject_name", error: errors.subject },
            {
              label: "Teacher",
              name: "teacher",
              data: teachers,
              render: (t) => `${t.first_name} ${t.last_name}`,
              error: errors.teacher,
            },
          ].map(({ label, name, data, key, error, render }) => (
            <div className="form-control" key={name}>
              <label className="label">
                <span className="label-text dark:text-gray-200">
                  {label} <span className="text-error">*</span>
                </span>
              </label>
              <select
                className="select select-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                {...register(name, { required: `${label} is required` })}
              >
                <option value="">Select {label}</option>
                {data?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {render ? render(item) : item[key]}
                  </option>
                ))}
              </select>
              {error && <p className="text-error text-sm mt-1">{error.message}</p>}
            </div>
          ))}

          {/* Total Marks */}
          <div className="form-control">
            <label className="label">
              <span className="label-text dark:text-gray-200">
                Total Marks <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="number"
              className="input input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter total marks"
              {...register("total_marks", {
                required: "Total marks is required",
                min: { value: 1, message: "Marks must be positive" },
              })}
            />
            {errors.total_marks && <p className="text-error text-sm mt-1">{errors.total_marks.message}</p>}
          </div>

          {/* Paper Code */}
          <div className="form-control">
            <label className="label">
              <span className="label-text dark:text-gray-200">
                Paper Code <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter paper code"
              {...register("paper_code", {
                required: "Paper code is required",
                pattern: {
                  value: /^[a-zA-Z0-9-]+$/,
                  message: "Only letters, numbers and hyphens allowed",
                },
              })}
            />
            {errors.paper_code && <p className="text-error text-sm mt-1">{errors.paper_code.message}</p>}
          </div>

          {/* File Upload */}
          <div className="form-control md:col-span-2">
            <label className="label">
              <span className="label-text dark:text-gray-200">
                Exam Paper File <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="file"
              className="file-input file-input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              accept=".pdf,.doc,.docx"
              {...register("uploaded_file", {
                required: "File is required",
                validate: {
                  fileSize: (files) =>
                    files[0]?.size <= 5 * 1024 * 1024 || "File size must be less than 5MB",
                  fileType: (files) =>
                    [
                      "application/pdf",
                      "application/msword",
                      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    ].includes(files[0]?.type) || "Only PDF and Word documents are allowed",
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

    {showAlert && (
      <dialog className="modal modal-open">
        <div className="modal-box dark:bg-gray-800 dark:text-white">
          <h3 className="font-bold text-lg">Update Exam Paper</h3>
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

export default UpdateExamPaper;
