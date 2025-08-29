import React, { useContext, useEffect, useRef, useState } from "react";
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
import { AuthContext } from "../../context/AuthContext";
import { useForm } from "react-hook-form";

export const SubjectAssignments = () => {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const { authTokens } = useContext(AuthContext);

  const [teachers, setTeachers] = useState([]);
  const [yearLevel, setYearLevel] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [periods, setPeriods] = useState([]);

  const [subject_ids, setSubjectIds] = useState([]);
  const [period_ids, setPeriodIds] = useState([]);

  const [isSubjectOpen, setIsSubjectOpen] = useState(false);
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);
  const subjectRef = useRef(null);
  const periodRef = useRef(null);

  const [loading, setLoading] = useState(true);
    const [error, setErrorState] = useState(false); 


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await fetchTeachers().then(setTeachers);
        await fetchYearLevels().then(setYearLevel);
        await fetchSubjects().then(setSubjects);
        await fetchPeriods().then(setPeriods);
      } catch (err) {
        setErrorState(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
    const setState = name === "subject_ids" ? setSubjectIds : setPeriodIds;
    const current = name === "subject_ids" ? [...subject_ids] : [...period_ids];

    const numericId = Number(id);
    const index = current.indexOf(numericId);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(numericId);
    }
    setState(current);
    clearErrors(name);
    clearErrors("api");
  };

  const handleSubmitForm = async (data) => {
    if (subject_ids.length === 0) {
      setError("subject_ids", { message: "Please select at least one subject." });
      return;
    }

    if (period_ids.length === 0) {
      setError("period_ids", { message: "Please select at least one period." });
      return;
    }

    const finalPayload = {
      ...data,
      subject_ids,
      period_ids,
    };

    setLoading(true);
    try {
      const response = await axios.post(
        `${constants.baseUrl}/t/teacher/assign-teacher-details/`,
        finalPayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert("Subjects assigned successfully!");
      }
    } catch (error) {
      const res = error.response?.data;

      if (res?.error) {
        setError("api", { message: res.error });
      } else if (res?.detail) {
        setError("api", { message: res.detail });
      } else if (res && typeof res === "object") {
        Object.keys(res).forEach((key) => {
          const val = res[key];
          if (Array.isArray(val)) {
            setError(key, { message: val[0] });
          } else if (typeof val === "string") {
            setError(key, { message: val });
          }
        });
      } else {
        setError("api", { message: "Something went wrong. Try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = () => {
    navigate(allRouterLink.allTeacherAssignment);
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
        Teacher Assignments <span>&rarr;</span>
      </button>

      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <h1 className="text-3xl font-bold text-center mb-6">
          Assign Subjects <i className="fa-solid fa-book ml-2" />
        </h1>

        {errors.api && (
          <p className="text-red-600 text-center mb-4 font-medium">{errors.api.message}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Teacher <span className="text-error">*</span></span>
            </label>
            <select
              {...register("teacher_id", { required: "Teacher is required" })}
              className="select select-bordered w-full focus:outline-none"
              onChange={(e) => {
                clearErrors(["teacher_id", "api"]);
                register("teacher_id").onChange(e);
              }}
            >
              <option value="">Select Teacher</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.first_name} {t.middle_name} {t.last_name}
                </option>
              ))}
            </select>
            {errors.teacher_id && <p className="text-red-500">{errors.teacher_id.message}</p>}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Year Level <span className="text-error">*</span></span>
            </label>
            <select
              {...register("yearlevel_id", { required: "Year level is required" })}
              className="select select-bordered w-full focus:outline-none"
              onChange={(e) => {
                clearErrors(["yearlevel_id", "api"]);
                register("yearlevel_id").onChange(e);
              }}
            >
              <option value="">Select Year Level</option>
              {yearLevel.map((y) => (
                <option key={y.id} value={y.id}>{y.level_name}</option>
              ))}
            </select>
            {errors.yearlevel_id && <p className="text-red-500">{errors.yearlevel_id.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="form-control" ref={subjectRef}>
            <label className="label">
              <span className="label-text">Subjects <span className="text-error">*</span></span>
            </label>
            <div className="relative">
              <div
                className="select select-bordered w-full cursor-pointer focus:outline-none"
                onClick={() => setIsSubjectOpen(!isSubjectOpen)}
              >
                {subject_ids.length > 0 ? `${subject_ids.length} selected` : "Select Subjects"}
              </div>
              {isSubjectOpen && (
                <div className="absolute z-10 w-full bg-white border rounded-md shadow max-h-60 overflow-y-auto">
                  {subjects.map((s) => (
                    <label key={s.id} className="flex items-center p-3 hover:bg-gray-100">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary mr-2"
                        checked={subject_ids.includes(s.id)}
                        onChange={() => handleMultiSelect("subject_ids", s.id)}
                      />
                      {s.subject_name} ({s.department})
                    </label>
                  ))}
                </div>
              )}
            </div>
            {errors.subject_ids && <p className="text-red-500 mt-1">{errors.subject_ids.message}</p>}
          </div>

          <div className="form-control" ref={periodRef}>
            <label className="label">
              <span className="label-text">Periods <span className="text-error">*</span></span>
            </label>
            <div className="relative">
              <div
                className="select select-bordered w-full cursor-pointer focus:outline-none"
                onClick={() => setIsPeriodOpen(!isPeriodOpen)}
              >
                {period_ids.length > 0 ? `${period_ids.length} selected` : "Select Periods"}
              </div>
              {isPeriodOpen && (
                <div className="absolute z-10 w-full bg-white border rounded-md shadow max-h-60 overflow-y-auto">
                  {periods.map((p) => (
                    <label key={p.id} className="flex items-center p-3 hover:bg-gray-100">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary mr-2"
                        checked={period_ids.includes(p.id)}
                        onChange={() => handleMultiSelect("period_ids", p.id)}
                      />
                      {p.name} | {p.start_period_time} - {p.end_period_time}
                    </label>
                  ))}
                </div>
              )}
            </div>
            {errors.period_ids && <p className="text-red-500 mt-1">{errors.period_ids.message}</p>}
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <button type="submit" className="btn text-white bgTheme w-52">
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
    </div>
  );
};
