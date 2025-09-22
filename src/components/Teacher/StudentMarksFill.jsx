import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import {
  fetchSchoolYear,
  fetchYearLevels,
  fetchSubjects,
  fetchAllTeachers,
  fetchStudents2,
} from "../../services/api/Api";
import { AuthContext } from "../../context/AuthContext";

const StudentMarksFill = () => {
  const { axiosInstance } = useContext(AuthContext);
  const [schoolYear, setSchoolYear] = useState([]);
  const [examType1, setExamType] = useState([]);
  const [className, setClassName] = useState([]);
  const [subjects1, setSubjects] = useState([]);
  const [teachers1, setTeachers] = useState([]);
  const [Students, setStudents] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // Fetch Exam Types
  const getExamType = async () => {
    try {
      const response = await axiosInstance.get("/d/Exam-Type/");
      setExamType(response.data);
    } catch (err) {
      console.error("Failed to load exam types:", err);
    }
  };

  // Fetch school_year
  const getSchool_year = async () => {
    try {
      const obj = await fetchSchoolYear();
      setSchoolYear(obj);
    } catch (err) {
      console.log("Failed to load school years. Please try again." + err);
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
      console.log("Failed to load subjects. Please try again." + err);
    }
  };

  // Fetch teachers
  const getTeachers = async () => {
    try {
      const obj = await fetchAllTeachers();
      setTeachers(obj);
    } catch (err) {
      console.log("Failed to load teachers. Please try again." + err);
    }
  };

  // Fetch Students
  const getStudents = async () => {
    try {
      const obj = await fetchStudents2();
      setStudents(obj);
    } catch (err) {
      console.log("Failed to load students. Please try again." + err);
    }
  };

  useEffect(() => {
    getTeachers();
    getsubjects();
    getClassName();
    getSchool_year();
    getStudents();
    getExamType();
  }, []);

  // Static data for dropdowns
  const examType = examType1;
  const className1 = className;
  const schoolYears = schoolYear;
  const subjects = subjects1;
  const teachers = teachers1;
  const students = Students;

  const onSubmit = async (data) => {
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

    try {
      const response = await axiosInstance.post(
        "/d/Student-Marks/create_marks/",
        payload
      );

      if (response.status === 200 || response.status === 201) {
        setAlertMessage("Student marks filled successfully!");
        setShowAlert(true);
        reset();
      } else {
        throw new Error("Failed to create exam schedule");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setAlertMessage("Error: Submission failed");
      setShowAlert(true);
    }
  };

  return (
    <div className="min-h-screen p-5 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-7xl mx-auto p-6 bg-base-100 rounded-box my-5 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className="text-3xl font-bold text-center mb-8">
            Fill Student Marks <i className="fa-solid fa-file-pen ml-2"></i>
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* School Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                School Year *
              </label>
              <select
                {...register("school_year", {
                  required: "School year is required",
                })}
                className="select select-bordered w-full focus:outline-none"
              >
                <option value="">Select School Year</option>
                {schoolYears?.map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.year_name}
                  </option>
                ))}
              </select>
              {errors.school_year && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.school_year.message}
                </p>
              )}
            </div>

            {/* Year Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year Level *
              </label>
              <select
                {...register("year_level", {
                  required: "Year level is required",
                })}
                className="select select-bordered w-full focus:outline-none"
              >
                <option value="">Select Year Level</option>
                {className1?.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.level_name}
                  </option>
                ))}
              </select>
              {errors.year_level && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.year_level.message}
                </p>
              )}
            </div>

            {/* Exam Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exam Type *
              </label>
              <select
                {...register("exam_type", { required: "Exam type is required" })}
                className="select select-bordered w-full focus:outline-none"
              >
                <option value="">Select Exam Type</option>
                {examType?.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              {errors.exam_type && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.exam_type.message}
                </p>
              )}
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject *
              </label>
              <select
                {...register("subject", { required: "Subject is required" })}
                className="select select-bordered w-full focus:outline-none"
              >
                <option value="">Select Subject</option>
                {subjects?.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.subject_name}
                  </option>
                ))}
              </select>
              {errors.subject && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.subject.message}
                </p>
              )}
            </div>

            {/* Teacher */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teacher *
              </label>
              <select
                {...register("teacher", { required: "Teacher is required" })}
                className="select select-bordered w-full focus:outline-none"
              >
                <option value="">Select Teacher</option>
                {teachers?.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.first_name} {teacher.last_name}
                  </option>
                ))}
              </select>
              {errors.teacher && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.teacher.message}
                </p>
              )}
            </div>

            {/* Student */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student *
              </label>
              <select
                {...register("student", { required: "Student is required" })}
                className="select select-bordered w-full focus:outline-none"
              >
                <option value="">Select Student</option>
                {students?.map((student) => (
                  <option key={student.student_id} value={student.student_id}>
                    {student.student_name}
                  </option>
                ))}
              </select>
              {errors.student && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.student.message}
                </p>
              )}
            </div>

            {/* Marks */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marks *
              </label>
              <input
                type="number"
                placeholder="Enter marks"
                {...register("marks", {
                  required: "Marks is required",
                  min: { value: 0, message: "Marks cannot be negative" },
                  max: { value: 100, message: "Marks cannot exceed 100" },
                })}
                className="select select-bordered w-full focus:outline-none"
              />
              {errors.marks && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.marks.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-10">
            <button
              type="submit"
              className="btn text-white bgTheme w-52"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <i className="fa-solid fa-spinner fa-spin mr-2" />
              ) : (
                <i className="fa-solid fa-save mr-2" />
              )}
              {isSubmitting ? " " : "Save Marks"}
            </button>
          </div>
        </form>
      </div>
      {/* Modal */}
      {showAlert && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Student Marks</h3>
            <p className="py-4">
              {alertMessage.split("\n").map((line, idx) => <span key={idx}>{line}<br /></span>)}
            </p>
            <div className="modal-action">
              <button className="btn bgTheme text-white w-30" onClick={() => setShowAlert(false)}>OK</button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default StudentMarksFill;
