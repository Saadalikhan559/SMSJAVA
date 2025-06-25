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
    } catch {
      console.log("Failed to load teachers.");
    }
  };

  const getYearLevels = async () => {
    try {
      const levels = await fetchYearLevels();
      setYearLevel(levels);
    } catch {
      console.log("Failed to load year levels.");
    }
  };

  const getPeriods = async () => {
    try {
      const periodList = await fetchPeriods();
      setPeriods(periodList);
    } catch {
      console.log("Failed to load periods.");
    }
  };

  const getSubjects = async () => {
    try {
      const subjectList = await fetchSubjects();
      setSubjects(subjectList);
    } catch {
      console.log("Failed to load subjects.");
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

  const handleMultiSelect = (name, id) => {
    const numericId = Number(id);
    setFormData((prev) => {
      const currentValues = [...prev[name]];
      const index = currentValues.indexOf(numericId);

      if (index > -1) {
        currentValues.splice(index, 1);
      } else {
        currentValues.push(numericId);
      }

      return { ...prev, [name]: currentValues };
    });
  };

<<<<<<< HEAD
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const storedTokens = JSON.parse(localStorage.getItem("authTokens"));
    const accessToken = storedTokens?.access;

    if (!accessToken) {
      alert("Token missing! Please login again.");
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("teacher_id", formData.teacher_id);
    formDataToSend.append("yearlevel_id", formData.yearlevel_id);

    formData.subject_ids.forEach((id) =>
      formDataToSend.append("subject_ids", id)
    );
    formData.period_ids.forEach((id) =>
      formDataToSend.append("period_ids", id)
    );

    // For debugging
    console.log("Submitting:", {
      teacher_id: formData.teacher_id,
      yearlevel_id: formData.yearlevel_id,
      subject_ids: formData.subject_ids,
      period_ids: formData.period_ids,
    });

    try {
      const response = await axios.post(
        `${constants.baseUrl}/t/teacher/assign-teacher-details/`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert("Subjects assigned successfully!");
        
      }
    } catch (error) {
      console.error("Submission Error:", error.response?.data || error);
      alert(
        error.response?.data?.error ||
          "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
=======
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
>>>>>>> 429f20f7ce565e49090cc09cf6163d2f218567b0
    }
  } catch (error) {
    alert(error.response?.data?.error || "Failed to assign subjects.");
  } finally {
    setLoading(false);
  }
};

  const handleNavigate = () => {
    navigate(allRouterLink.allTeacherAssignment);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-base-100 rounded-box my-5 shadow-sm">
      <button
        className="font-bold text-xl cursor-pointer hover:underline flex items-center gap-2 text-blue-600"
        onClick={handleNavigate}
      >
        Teacher Assignments <span>&rarr;</span>
      </button>

      <form onSubmit={handleSubmit}>
        <h1 className="text-3xl font-bold text-center mb-8">
          Assign Subjects <i className="fa-solid fa-book ml-2"></i>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Teacher Select */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Teacher <span className="text-error">*</span>
              </span>
            </label>
            <select
              name="teacher_id"
              className="select select-bordered w-full"
              onChange={handleChange}
              value={formData.teacher_id}
            >
              <option value="">Select Teacher</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.first_name} {t.middle_name} {t.last_name}
                </option>
              ))}
            </select>
          </div>

          {/* Year Level Select */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Year Level <span className="text-error">*</span>
              </span>
            </label>
            <select
              name="yearlevel_id"
              className="select select-bordered w-full"
              required
              onChange={handleChange}
              value={formData.yearlevel_id}
            >
              <option value="">Select Year Level</option>
              {yearLevel.map((y) => (
                <option key={y.id} value={y.id}>
                  {y.level_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Subject Multiselect */}
          <div className="form-control" ref={subjectRef}>
            <label className="label">
              <span className="label-text">
                Subjects <span className="text-error">*</span>
              </span>
            </label>
            <div className="relative">
              <div
                className="select select-bordered w-full cursor-pointer"
                onClick={() => setIsSubjectOpen(!isSubjectOpen)}
              >
                {formData.subject_ids.length > 0
                  ? `${formData.subject_ids.length} selected`
                  : "Select Subjects"}
              </div>
              {isSubjectOpen && (
                <div className="absolute z-10 w-full bg-white border rounded-md shadow max-h-60 overflow-y-auto">
                  {subjects.map((s) => (
                    <label
                      key={s.id}
                      className="flex items-center p-3 hover:bg-gray-100"
                    >
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary mr-2"
                        checked={formData.subject_ids.includes(s.id)}
                        onChange={() => handleMultiSelect("subject_ids", s.id)}
                      />
                      {s.subject_name} ({s.department})
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Period Multiselect */}
          <div className="form-control" ref={periodRef}>
            <label className="label">
              <span className="label-text">
                Periods <span className="text-error">*</span>
              </span>
            </label>
            <div className="relative">
              <div
                className="select select-bordered w-full cursor-pointer"
                onClick={() => setIsPeriodOpen(!isPeriodOpen)}
              >
                {formData.period_ids.length > 0
                  ? `${formData.period_ids.length} selected`
                  : "Select Periods"}
              </div>
              {isPeriodOpen && (
                <div className="absolute z-10 w-full bg-white border rounded-md shadow max-h-60 overflow-y-auto">
                  {periods.map((p) => (
                    <label
                      key={p.id}
                      className="flex items-center p-3 hover:bg-gray-100"
                    >
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary mr-2"
                        checked={formData.period_ids.includes(p.id)}
                        onChange={() => handleMultiSelect("period_ids", p.id)}
                      />
                      {p.name} | {p.start_period_time} - {p.end_period_time}
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
              <i className="fa-solid fa-spinner fa-spin mr-2" />
            ) : (
              <i className="fa-solid fa-book ml-2" />
            )}
            {loading ? "" : "Assign"}
          </button>
        </div>
      </form>
    </div>
  );
};
