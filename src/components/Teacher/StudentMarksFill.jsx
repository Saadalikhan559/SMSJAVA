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
  const [searchStudentInput, setSearchStudentInput] = useState("");
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [selectedStudentName, setSelectedStudentName] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [loadingStudents, setLoadingStudents] = useState(false);

  const [searchSubjectInput, setSearchSubjectInput] = useState("");
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [selectedSubjectName, setSelectedSubjectName] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");

  const [searchTeacherInput, setSearchTeacherInput] = useState("");
  const [showTeacherDropdown, setShowTeacherDropdown] = useState(false);
  const [selectedTeacherName, setSelectedTeacherName] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState("");



  const {
    register,
    handleSubmit,
    setValue,
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
  const filteredStudents = students.filter((studentObj) =>
    studentObj.student_name.toLowerCase().includes(searchStudentInput.toLowerCase())
  );
  const filteredSubjects = subjects.filter((subjectObj) =>
    subjectObj.subject_name.toLowerCase().includes(searchSubjectInput.toLowerCase())
  );

  const filteredTeachers = teachers.filter((teacherObj) =>
    `${teacherObj.first_name} ${teacherObj.last_name}`
      .toLowerCase()
      .includes(searchTeacherInput.toLowerCase())
  );


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
            {/* Subject */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject *
              </label>

              <input
                type="hidden"
                {...register("subject", { required: "Subject is required" })}
                value={selectedSubjectName ? selectedSubjectId : ""}
              />

              <input
                type="text"
                className="input input-bordered w-full focus:outline-none"
                placeholder="Search Subject..."
                value={searchSubjectInput || selectedSubjectName}
                onChange={(e) => {
                  setSearchSubjectInput(e.target.value);
                  setSelectedSubjectName("");
                  setShowSubjectDropdown(true);
                }}
                onFocus={() => setShowSubjectDropdown(true)}
                autoComplete="off"
              />

              {showSubjectDropdown && (
                <div className="absolute z-10 bg-white dark:bg-gray-700 rounded w-full mt-1 shadow-lg border border-gray-300 dark:border-gray-600">
                  <div className="p-2 sticky top-0 bg-white dark:bg-gray-700">
                    <input
                      type="text"
                      placeholder="Search Subject..."
                      className="input input-bordered w-full focus:outline-none bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                      value={searchSubjectInput}
                      onChange={(e) => setSearchSubjectInput(e.target.value)}
                    />
                  </div>
                  <div className="max-h-40 overflow-y-auto">
                    {filteredSubjects?.length > 0 ? (
                      filteredSubjects.map((subjectObj) => (
                        <p
                          key={subjectObj.id}
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer text-gray-800 dark:text-gray-200"
                          onClick={() => {
                            setSelectedSubjectId(subjectObj.id);
                            setSelectedSubjectName(subjectObj.subject_name);
                            setSearchSubjectInput(subjectObj.subject_name);
                            setShowSubjectDropdown(false);
                            setValue("subject", subjectObj.id);
                          }}
                        >
                          {subjectObj.subject_name}
                        </p>
                      ))
                    ) : (
                      <p className="p-2 text-gray-500 dark:text-gray-400">No subjects found.</p>
                    )}
                  </div>
                </div>
              )}

              {errors.subject && (
                <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
              )}
            </div>


            {/* Teacher */}
            {/* Teacher */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teacher *
              </label>

              <input
                type="hidden"
                {...register("teacher", { required: "Teacher is required" })}
                value={selectedTeacherName ? selectedTeacherId : ""}
              />

              <input
                type="text"
                className="input input-bordered w-full focus:outline-none"
                placeholder="Search Teacher..."
                value={searchTeacherInput || selectedTeacherName}
                onChange={(e) => {
                  setSearchTeacherInput(e.target.value);
                  setSelectedTeacherName("");
                  setShowTeacherDropdown(true);
                }}
                onFocus={() => setShowTeacherDropdown(true)}
                autoComplete="off"
              />

              {showTeacherDropdown && (
                <div className="absolute z-10 bg-white dark:bg-gray-700 rounded w-full mt-1 shadow-lg border border-gray-300 dark:border-gray-600">
                  <div className="p-2 sticky top-0 bg-white dark:bg-gray-700">
                    <input
                      type="text"
                      placeholder="Search Teacher..."
                      className="input input-bordered w-full focus:outline-none bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                      value={searchTeacherInput}
                      onChange={(e) => setSearchTeacherInput(e.target.value)}
                    />
                  </div>
                  <div className="max-h-40 overflow-y-auto">
                    {filteredTeachers?.length > 0 ? (
                      filteredTeachers.map((teacherObj) => (
                        <p
                          key={teacherObj.id}
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer text-gray-800 dark:text-gray-200"
                          onClick={() => {
                            setSelectedTeacherId(teacherObj.id);
                            setSelectedTeacherName(`${teacherObj.first_name} ${teacherObj.last_name}`);
                            setSearchTeacherInput(`${teacherObj.first_name} ${teacherObj.last_name}`);
                            setShowTeacherDropdown(false);
                            setValue("teacher", teacherObj.id);
                          }}
                        >
                          {teacherObj.first_name} {teacherObj.last_name}
                        </p>
                      ))
                    ) : (
                      <p className="p-2 text-gray-500 dark:text-gray-400">No teachers found.</p>
                    )}
                  </div>
                </div>
              )}

              {errors.teacher && (
                <p className="text-red-500 text-sm mt-1">{errors.teacher.message}</p>
              )}
            </div>



            {/* Student */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student *
              </label>
              {/* Hidden input to register student ID */}
              <input
                type="hidden"
                {...register("student", { required: "Student is required" })}
                value={selectedStudentName ? selectedStudentId : ""}
              />

              <input
                type="text"
                className="input input-bordered w-full focus:outline-none"
                placeholder="Search Student..."
                value={searchStudentInput || selectedStudentName}
                onChange={(e) => {
                  setSearchStudentInput(e.target.value);
                  setShowStudentDropdown(true);
                  setSelectedStudentName(""); // clear selected when typing again
                }}
                onFocus={() => setShowStudentDropdown(true)}
                autoComplete="off"
              />

              {showStudentDropdown && (
                <div className="absolute z-10 bg-white dark:bg-gray-700 rounded w-full mt-1 shadow-lg border border-gray-300 dark:border-gray-600">
                  <div className="p-2 sticky top-0 shadow-sm bg-white dark:bg-gray-700">
                    <input
                      type="text"
                      placeholder="Search Student..."
                      className="input input-bordered w-full focus:outline-none bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-500"
                      value={searchStudentInput}
                      onChange={(e) => setSearchStudentInput(e.target.value)}
                    />
                  </div>

                  <div className="max-h-40 overflow-y-auto">
                    {!loadingStudents && filteredStudents.length > 0 ? (
                      filteredStudents.map((studentObj) => (
                        <p
                          key={studentObj.student_id}
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer text-gray-800 dark:text-gray-200"
                          onClick={() => {
                            setSelectedStudentId(studentObj.student_id);
                            setSelectedStudentName(studentObj.student_name);
                            setSearchStudentInput(studentObj.student_name);
                            setShowStudentDropdown(false);
                            setValue("student", studentObj.student_id);
                          }}
                        >
                          {studentObj.student_name}
                        </p>
                      ))
                    ) : (
                      <p className="p-2 text-gray-500 dark:text-gray-400">
                        {loadingStudents ? "Loading students..." : "No students found."}
                      </p>
                    )}
                  </div>
                </div>
              )}
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
