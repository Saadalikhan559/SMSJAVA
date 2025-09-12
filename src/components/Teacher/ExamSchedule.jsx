import { useState, useEffect, useContext } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  fetchYearLevels,
  fetchSchoolYear,
  fetchSubjects,
} from "../../services/api/Api";
import { useNavigate } from "react-router-dom";
import { allRouterLink } from "../../router/AllRouterLinks";
import { AuthContext } from "../../context/AuthContext";

const ExamSchedule = () => {
  const [className1, setClassName] = useState([]);
  const [schoolYear, setSchoolYear] = useState([]);
  const [examType, setExamType] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const navigate = useNavigate();
  const { axiosInstance } = useContext(AuthContext);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      class_name: "",
      school_year: "",
      exam_type: "",
      papers: [
        {
          subject_id: "",
          exam_date: "",
          start_time: "",
          end_time: "",
        },
      ],
    },
  });

  const fetchExamType = async () => {
    try {
      const response = await axiosInstance.get("/d/Exam-Type/");
      return response.data;
    } catch (err) {
      console.error("Failed to fetch exam types:", err);
      throw err;
    }
  };

  const getClassName = async () => {
    try {
      const ClassName = await fetchYearLevels();
      setClassName(ClassName);
    } catch (err) {
      console.log("Failed to load classes. Please try again." + err);
    }
  };

  const getSchool_year = async () => {
    try {
      const obj = await fetchSchoolYear();
      setSchoolYear(obj);
    } catch (err) {
      console.log("Failed to load school year. Please try again." + err);
    }
  };

  const getExamType = async () => {
    try {
      const obj = await fetchExamType();
      if (obj) {
        setExamType(obj);
      }
    } catch (err) {
      console.error("Failed to load exam types:", err);
    }
  };

  const getsubjects = async () => {
    try {
      const obj = await fetchSubjects();
      setSubjects(obj);
    } catch (err) {
      console.log("Failed to load subjects. Please try again." + err);
    }
  };

  useEffect(() => {
    getClassName();
    getSchool_year();
    getExamType();
    getsubjects();
  }, []);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "papers",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleNavigate = () => {
    navigate(allRouterLink.UpdateExamSchedule);
  };

  const onSubmit = async (data) => {
    try {
      setError("");
      setSuccess("");

      const payload = {
        class_name: Number(data.class_name),
        school_year: Number(data.school_year),
        exam_type: Number(data.exam_type),
        papers: data.papers.map((paper) => ({
          subject_id: Number(paper.subject_id),
          exam_date: paper.exam_date,
          start_time: paper.start_time,
          end_time: paper.end_time,
        })),
      };

      const response = await axiosInstance.post(
        "/d/Exam-Schedule/create_timetable/",
        payload
      );

      if (response.status === 200 || response.status === 201) {
        setSuccess("Exam schedule created successfully!");
        reset();
      } else {
        throw new Error(
          response.data.message || "Failed to create exam schedule"
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.[0] ||
          err.response?.data?.message ||
          "Failed to create exam schedule"
      );
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="w-full max-w-7xl mx-auto p-6 bg-base-100 rounded-box my-5 shadow-sm">
        <button
          className="font-bold text-xl cursor-pointer hover:underline flex items-center gap-2 textTheme"
          onClick={handleNavigate}
        >
          Update Exam Schedule <span>&rarr;</span>
        </button>

        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className="text-3xl font-bold text-center mb-8">
            Create Exam Schedule <i className="fa-solid fa-calendar-day ml-2"></i>
          </h1>

          {error && (
            <div className="alert alert-error mb-6">
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success mb-6">
              <span>{success}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Class *</span>
              </label>
              <select
                className={`select select-bordered w-full ${
                  errors.class_name ? "select-error" : ""
                }`}
                {...register("class_name", { required: "Class is required" })}
              >
                <option value="">Select Class</option>
                {className1?.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.level_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">School Year *</span>
              </label>
              <select
                className={`select select-bordered w-full ${
                  errors.school_year ? "select-error" : ""
                }`}
                {...register("school_year", { required: "School year is required" })}
              >
                <option value="">Select Year</option>
                {schoolYear?.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.year_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Exam Type *</span>
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
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Exam Papers</h2>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6 bg-base-200 p-4 rounded-lg"
              >
                <div className="form-control">
                  <label className="label">Subject *</label>
                  <select
                    className="select select-bordered w-full"
                    {...register(`papers.${index}.subject_id`, {
                      required: "Subject is required",
                    })}
                  >
                    <option value="">Select Subject</option>
                    {subjects?.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.subject_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">Exam Date *</label>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    {...register(`papers.${index}.exam_date`, {
                      required: "Exam date is required",
                    })}
                  />
                </div>

                <div className="form-control">
                  <label className="label">Start Time *</label>
                  <input
                    type="time"
                    className="input input-bordered w-full"
                    {...register(`papers.${index}.start_time`, {
                      required: "Start time is required",
                    })}
                  />
                </div>

                <div className="form-control">
                  <label className="label">End Time *</label>
                  <input
                    type="time"
                    className="input input-bordered w-full"
                    {...register(`papers.${index}.end_time`, {
                      required: "End time is required",
                      validate: (value) => {
                        const startTime = watch(`papers.${index}.start_time`);
                        return (
                          value > startTime || "End time must be after start time"
                        );
                      },
                    })}
                  />
                </div>

                <div className="form-control md:col-span-4 flex justify-end">
                  <button
                    type="button"
                    className="btn btn-error btn-sm"
                    onClick={() => remove(index)}
                    disabled={fields.length <= 1}
                  >
                    <i className="fa-solid fa-trash mr-1"></i> Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-4">
              <button
                type="button"
                className="btn bgTheme text-white"
                onClick={() =>
                  append({
                    subject_id: "",
                    exam_date: "",
                    start_time: "",
                    end_time: "",
                  })
                }
              >
                <i className="fa-solid fa-plus mr-2"></i> Add Another Paper
              </button>
            </div>
          </div>

          <div className="flex justify-center mt-10">
            <button
              type="submit"
              className="btn bgTheme text-white w-52"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <i className="fa-solid fa-spinner fa-spin mr-2" />
              ) : (
                "Create Schedule"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExamSchedule;
