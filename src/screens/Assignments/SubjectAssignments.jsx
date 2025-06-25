import React, { useEffect, useRef, useState } from "react";
import {
  fetchPeriods,
  fetchSubjects,
  fetchTeachers,
  fetchYearLevels,
} from "../../services/api/Api";
import axios from "axios";
import { constants } from "../../global/constants";
import { useNavigate } from "react-router-dom";
import { allRouterLink } from "../../router/AllRouterLinks";

export const SubjectAssignments = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [yearLevel, setYearLevel] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [isSubjectOpen, setIsSubjectOpen] = useState(false);
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);
  const subjectRef = useRef(null);
  const periodRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    yearlevel_id: "",
    teacher_id: "",
    subject_ids: [],
    period_ids: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const getTeachers = async () => {
    try {
      const allTeachers = await fetchTeachers();
      setTeachers(allTeachers);
    } catch (error) {
      console.log("Failed to load teacher. Please try again.");
    }
  };
  const getYearLevels = async () => {
    try {
      const allyearLevels = await fetchYearLevels();
      setYearLevel(allyearLevels);
    } catch (err) {
      console.log("Failed to load year levels. Please try again.");
    }
  };
  const getPeriods = async () => {
    try {
      const allPeriods = await fetchPeriods();
      setPeriods(allPeriods);
    } catch (err) {
      console.log("Failed to load periods. Please try again.");
    }
  };
  const getSubjects = async () => {
    try {
      const allSubjects = await fetchSubjects();
      setSubjects(allSubjects);
    } catch (err) {
      console.log("Failed to load subjects. Please try again.");
    }
  };
  useEffect(() => {
    getTeachers();
    getPeriods();
    getYearLevels();
    getSubjects();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (subjectRef.current && !subjectRef.current.contains(event.target)) {
        setIsSubjectOpen(false);
      }
      if (periodRef.current && !periodRef.current.contains(event.target)) {
        setIsPeriodOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // Handle checkbox changes
  const handleMultiSelect = (name, id) => {
    setFormData((prev) => {
      const currentValues = [...prev[name]];
      const index = currentValues.indexOf(id);

      if (index > -1) {
        // Remove if already selected
        currentValues.splice(index, 1);
      } else {
        // Add if not selected
        currentValues.push(id);
      }

      return { ...prev, [name]: currentValues };
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  // Debug: Log the data being sent
  console.log("Sending:", {
    teacher_id: formData.teacher_id,
    yearlevel_id: formData.yearlevel_id,
    subject_ids: formData.subject_ids,
    period_ids: formData.period_ids,
  });

  try {
    const response = await axios.post(
      `${constants.baseUrl}/t/teacher/assign-teacher-details/`,
      formData, // Send as JSON
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200 || response.status === 201) {
      alert("Subjects assigned successfully!");
    }
  } catch (error) {
    alert(error.response?.data?.error || "Failed to assign subjects.");
  } finally {
    setLoading(false);
  }
};

  const handleNavigate = () => {
    navigate(`${allRouterLink.allTeacherAssignment}`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-base-100 rounded-box my-5 shadow-sm focus:outline-none">
      <button
        className="font-bold text-xl cursor-pointer hover:underline flex items-center gap-2 text-blue-600"
        onClick={() => handleNavigate()}
      >
        Teacher Assignments <span>&rarr;</span>
      </button>

      <form onSubmit={handleSubmit}>
        <h1 className="text-3xl font-bold text-center mb-8">
          Assign Subjects <i className="fa-solid fa-book ml-2"></i>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Select Teacher  */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <i className="fa-solid fa-file-lines text-sm"></i>
                Teacher <span className="text-error">*</span>
              </span>
            </label>
            <select
              name="teacher_id"
              className="select select-bordered w-full focus:outline-none"
              onChange={handleChange}
              value={formData.teacher_id}
            >
              <option value="">Select Teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.first_name} {teacher.middle_name} {teacher.last_name}
                </option>
              ))}
            </select>
          </div>
          {/* Select Year Level*/}
          {/* Year Level */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <i className="fa-solid fa-graduation-cap text-sm"></i>
                Year Level <span className="text-error">*</span>
              </span>
            </label>
            <select
              name="yearlevel_id" // Corrected to match state
              className="select select-bordered w-full focus:outline-none"
              required
              value={formData.yearlevel_id}
              onChange={handleChange}
            >
              <option value="">Select Year Level</option>
              {yearLevel.map((yearlev) => (
                <option value={yearlev.id} key={yearlev.id}>
                  {yearlev.level_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Custom Subjects Dropdown */}
          <div className="form-control" ref={subjectRef}>
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <i className="fa-solid fa-file-lines text-sm"></i>
                Subjects <span className="text-error">*</span>
              </span>
            </label>

            <div className="relative">
              <div
                className="select select-bordered w-full focus:outline-none cursor-pointer flex items-center"
                onClick={() => setIsSubjectOpen(!isSubjectOpen)}
              >
                {formData.subject_ids.length > 0
                  ? `${formData.subject_ids.length} subjects selected`
                  : "Select Subjects"}
              </div>

              {isSubjectOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {subjects.map((subject) => (
                    <label
                      key={subject.id}
                      className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary mr-3"
                        checked={formData.subject_ids.includes(subject.id)}
                        onChange={() =>
                          handleMultiSelect("subject_ids", subject.id)
                        }
                      />
                      <span>
                        {subject.subject_name} ({subject.department})
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Custom Periods Dropdown */}
          <div className="form-control" ref={periodRef}>
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <i className="fa-solid fa-graduation-cap text-sm"></i>
                Periods <span className="text-error">*</span>
              </span>
            </label>

            <div className="relative">
              <div
                className="select select-bordered w-full focus:outline-none cursor-pointer flex items-center"
                onClick={() => setIsPeriodOpen(!isPeriodOpen)}
              >
                {formData.period_ids.length > 0
                  ? `${formData.period_ids.length} periods selected`
                  : "Select Periods"}
              </div>

              {isPeriodOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {periods.map((period) => (
                    <label
                      key={period.id}
                      className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary mr-3"
                        checked={formData.period_ids.includes(period.id)}
                        onChange={() =>
                          handleMultiSelect("period_ids", period.id)
                        }
                      />
                      <span>
                        {period.name} | {period.start_period_time} -{" "}
                        {period.end_period_time}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-10">
          <button type="submit" className="btn btn-primary w-52">
            {loading ? (
              <i className="fa-solid fa-spinner fa-spin mr-2"></i>
            ) : (
              <i className="fa-solid fa-book ml-2"></i>
            )}
            {loading ? " " : "Assign"}
          </button>
        </div>
      </form>
    </div>
  );
};
