import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
import {
  fetchSchoolYear,
  fetchExamType,
  fetchYearLevels,
  fetchSubjects,
  fetchAllTeachers,
  fetchStudents2,
} from "../../services/api/Api";
import { constants } from "../../global/constants";
import axios from "axios";

const StudentMarksFill = () => {
  //   const navigate = useNavigate();
  const [schoolYear, setSchoolYear] = useState([]);
  const [examType1, setExamType] = useState([]);
  const [accessToken, setAccessToken] = useState("");
  const [className, setClassName] = useState([]);
  const [subjects1, setSubjects] = useState([]);
  const [teachers1, setTeachers] = useState([]);
  const [Students, setStudents] = useState([]);

  const BASE_URL = constants.baseUrl;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

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

  // Fetch school_year
  const getSchool_year = async () => {
    try {
      const obj = await fetchSchoolYear();
      setSchoolYear(obj);
    } catch (err) {
      console.log("Failed to load classes. Please try again." + err);
    }
  };

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
  const getTeachers = async () => {
    try {
      const obj = await fetchAllTeachers();
      setTeachers(obj);
    } catch (err) {
      console.log("Failed to load classes. Please try again." + err);
    }
  };

  // Fetch Students
  const getStudents = async () => {
    try {
      const obj = await fetchStudents2();
      setStudents(obj);
    } catch (err) {
      console.log("Failed to load classes. Please try again." + err);
    }
  };

  useEffect(() => {
    getTeachers();
    getsubjects();
    getClassName();
    getSchool_year();
    getStudents();
    if (accessToken) {
      // Only call getExamType if we have a token
      getExamType();
    }
  }, [accessToken]); // Add accessToken as dependency

  // Static data for dropdowns - replace with your actual data sources
  const examType = examType1;

  const className1 = className;

  const schoolYears = schoolYear;

  const subjects = subjects1;

  const teachers = teachers1;

  const students = Students;

  //   const handleNavigate = () => {
  //     navigate(-1);
  //   };

  const onSubmit = async (data) => {
    // Format the data according to the static payload structure
    const payload = {
      school_year_id: parseInt(data.school_year),
      exam_type_id: parseInt(data.exam_type),
      year_level_id: parseInt(data.year_level),
      data: [
        {
          teacher_id: parseInt(data.teacher),
          subject_id: parseInt(data.subject),
          student_marks: [
            {
              student_id: parseInt(data.student),
              marks: parseInt(data.marks),
            },
          ],
        },
      ],
    };

    console.log("Form submitted with payload:", payload);
    try {
      if (!accessToken) return;
      // Replace with your actual API call
      const response = await axios.post(
        `${BASE_URL}/d/Student-Marks/create_marks/`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        console.error("ExamPaper submitted successfully");
        alert(`Student marks filled successfully`);
        window.location.reload();
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-3xl font-bold text-center mb-8">
          Fill Student Marks <i className="fa-solid fa-file-pen ml-2"></i>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* School Year */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                School Year <span className="text-error">*</span>
              </span>
            </label>
            <select
              className={`select select-bordered w-full ${
                errors.school_year ? "select-error" : ""
              }`}
              {...register("school_year", {
                required: "School year is required",
              })}
            >
              <option value="">Select School Year</option>
              {schoolYears?.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.year_name}
                </option>
              ))}
            </select>
            {errors.school_year && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.school_year.message}
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
              {className1?.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.level_name}
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
              {examType?.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
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
              {subjects?.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.subject_name}
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
              {teachers?.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.first_name} {teacher.last_name}
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

          {/* Student */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Student <span className="text-error">*</span>
              </span>
            </label>
            <select
              className={`select select-bordered w-full ${
                errors.student ? "select-error" : ""
              }`}
              {...register("student", { required: "Student is required" })}
            >
              <option value="">Select Student</option>
              {students?.map((student) => (
                <option key={student.student_id} value={student.student_id}>
                  {student.student_name}
                </option>
              ))}
            </select>
            {errors.student && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.student.message}
                </span>
              </label>
            )}
          </div>

          {/* Marks */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Marks <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="number"
              className={`input input-bordered w-full ${
                errors.marks ? "input-error" : ""
              }`}
              placeholder="Enter marks"
              {...register("marks", {
                required: "Marks is required",
                min: { value: 0, message: "Marks cannot be negative" },
                max: { value: 100, message: "Marks cannot exceed 100" },
              })}
            />
            {errors.marks && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.marks.message}
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
              <i className="fa-solid fa-save mr-2" />
            )}
            {isSubmitting ? "Saving..." : "Save Marks"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentMarksFill;
