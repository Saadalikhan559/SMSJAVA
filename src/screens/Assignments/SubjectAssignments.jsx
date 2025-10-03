import React, { useContext, useEffect, useRef, useState } from "react";
import {
  fetchPeriods,
  fetchSubjects,
  fetchTeachers,
  fetchYearLevels,
} from "../../services/api/Api";
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
  const { axiosInstance } = useContext(AuthContext);
  const [teachers, setTeachers] = useState([]);
  const [yearLevels, setYearLevels] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [periods, setPeriods] = useState([]);

  const [subject_ids, setSubjectIds] = useState([]);
  const [period_ids, setPeriodIds] = useState([]);

  const [subjectSearch, setSubjectSearch] = useState("");

  const [isSubjectOpen, setIsSubjectOpen] = useState(false);
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);
  const subjectRef = useRef(null);
  const periodRef = useRef(null);

  // Loader states
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [loadingYearLevels, setLoadingYearLevels] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingPeriods, setLoadingPeriods] = useState(false);

  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Filtering functions
const filterTeachers = () => {
  return teachers.filter((t) =>
    `${t.first_name} ${t.middle_name || ""} ${t.last_name}`
      .toLowerCase()
      .includes(teacherSearch.toLowerCase())
  );
};

const filterYearLevels = () => {
  return yearLevels.filter((y) =>
    y.level_name.toLowerCase().includes(yearLevelSearch.toLowerCase())
  );
};

const filterSubjects = () => {
  return subjects.filter((s) =>
    s.subject_name.toLowerCase().includes(subjectSearch.toLowerCase())
  );
};

const filterPeriods = () => {
  return periods.filter((p) =>
    p.name.toLowerCase().includes(periodSearch.toLowerCase())
  );
};


  useEffect(() => {
    const preloadData = async () => {
      try {
        setLoadingTeachers(true);
        setLoadingYearLevels(true);
        setLoadingSubjects(true);
        setLoadingPeriods(true);

        const [teachersData, yearLevelsData, subjectsData, periodsData] =
          await Promise.all([
            fetchTeachers(),
            fetchYearLevels(),
            fetchSubjects(),
            fetchPeriods(),
          ]);

        setTeachers(teachersData);
        setYearLevels(yearLevelsData);
        setSubjects(subjectsData);
        setPeriods(periodsData);
      } catch (err) {
        setPageError(true);
      } finally {
        setLoadingTeachers(false);
        setLoadingYearLevels(false);
        setLoadingSubjects(false);
        setLoadingPeriods(false);
        setPageLoading(false);
      }
    };
    preloadData();
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
    if (index > -1) current.splice(index, 1);
    else current.push(numericId);

    setState(current);
    clearErrors(name);
    clearErrors("api");
  };

  const handleSubmitForm = async (data) => {
    if (subject_ids.length === 0) {
      setError("subject_ids", {
        message: "Please select at least one subject.",
      });
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

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post(
        `/t/teacher/assign-teacher-details/`,
        finalPayload
      );

      if (response.status === 200 || response.status === 201) {
        setAlertMessage("Subjects assigned successfully!");
        setShowAlert(true);
      }
    } catch (error) {
      const res = error.response?.data;
      let errMsg = "Something went wrong. Try again.";

      if (res?.error) errMsg = res.error;
      else if (res?.detail) errMsg = res.detail;
      else if (res && typeof res === "object") {
        Object.keys(res).forEach((key) => {
          const val = res[key];
          if (Array.isArray(val)) errMsg = val[0];
          else if (typeof val === "string") errMsg = val;
        });
      }
      setAlertMessage(errMsg);
      setShowAlert(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNavigate = () => {
    navigate(allRouterLink.allTeacherAssignment);
  };

  if (pageLoading) {
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

  if (pageError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
        <i className="fa-solid fa-triangle-exclamation text-5xl text-red-400 mb-4"></i>
        <p className="text-lg text-red-400 font-medium">
          Failed to load data, Try Again
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5 bg-gray-50 dark:bg-gray-900 mb-20">
      <div className="w-full max-w-7xl mx-auto p-6 bg-base-100 dark:bg-gray-800 rounded-box my-5 shadow-sm">
        <div className=" flex justify-end">
          <button
            className="font-bold text-xl cursor-pointer hover:underline flex items-center gap-2 textTheme"
            onClick={handleNavigate}
          >
            Teacher Assignments <span>&rarr;</span>
          </button>
        </div>

        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
            Assign Subjects <i className="fa-solid fa-book ml-2" />
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Teacher Dropdown */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-700 dark:text-gray-200">
                  Teacher <span className="text-error">*</span>
                </span>
              </label>
              <select
                {...register("teacher_id", { required: "Teacher is required" })}
                className="select select-bordered w-full focus:outline-none dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              >
                <option value="">
                  {loadingTeachers ? "Loading teachers..." : "Select Teacher"}
                </option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.first_name} {t.middle_name} {t.last_name}
                  </option>
                ))}
              </select>
              {errors.teacher_id && (
                <p className="text-red-500">{errors.teacher_id.message}</p>
              )}
            </div>

            {/* Year Level Dropdown */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-700 dark:text-gray-200">
                  Year Level <span className="text-error">*</span>
                </span>
              </label>
              <select
                {...register("yearlevel_id", {
                  required: "Year level is required",
                })}
                className="select select-bordered w-full focus:outline-none dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              >
                <option value="">
                  {loadingYearLevels
                    ? "Loading year levels..."
                    : "Select Year Level"}
                </option>
                {yearLevels.map((y) => (
                  <option key={y.id} value={y.id}>
                    {y.level_name}
                  </option>
                ))}
              </select>
              {errors.yearlevel_id && (
                <p className="text-red-500">{errors.yearlevel_id.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Subjects Dropdown */}
            <div className="form-control relative" ref={subjectRef}>
              <label className="label">
                <span className="label-text text-gray-700 dark:text-gray-200">
                  Subjects <span className="text-error">*</span>
                </span>
              </label>
              <div>
                <div
                  className="select select-bordered w-full cursor-pointer focus:outline-none dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                  onClick={() => setIsSubjectOpen(!isSubjectOpen)}
                >
                  {subject_ids.length > 0
                    ? `${subject_ids.length} selected`
                    : loadingSubjects
                    ? "Loading subjects..."
                    : "Select Subjects"}
                </div>
                {isSubjectOpen && (
                  <div className="absolute z-10 w-full bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-md shadow max-h-60 overflow-y-auto">
                    {/* Search Bar */}
                    <div className="p-2 sticky top-0 bg-white dark:bg-gray-700">
                      <input
                        type="text"
                        value={subjectSearch}
                        onChange={(e) => setSubjectSearch(e.target.value)}
                        placeholder="Search subjects..."
                        className="input input-bordered w-full focus:outline-none dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 z-5"
                      />
                    </div>

                    {/* Filtered Subjects */}
                    {subjects
                      .filter((s) =>
                        s.subject_name
                          .toLowerCase()
                          .includes(subjectSearch.toLowerCase())
                      )
                      .map((s) => (
                        <label
                          key={s.id}
                          className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          <input
                            type="checkbox"
                            className="checkbox checkbox-primary mr-2"
                            checked={subject_ids.includes(s.id)}
                            onChange={() =>
                              handleMultiSelect("subject_ids", s.id)
                            }
                          />
                          {s.subject_name} ({s.department})
                        </label>
                      ))}

                    {/* No results */}
                    {subjects.filter((s) =>
                      s.subject_name
                        .toLowerCase()
                        .includes(subjectSearch.toLowerCase())
                    ).length === 0 && (
                      <p className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                        No subjects found
                      </p>
                    )}
                  </div>
                )}
              </div>
              {errors.subject_ids && (
                <p className="text-red-500 mt-1">
                  {errors.subject_ids.message}
                </p>
              )}
            </div>

            {/* Periods Dropdown */}
            <div className="form-control relative" ref={periodRef}>
              <label className="label">
                <span className="label-text text-gray-700 dark:text-gray-200">
                  Periods <span className="text-error">*</span>
                </span>
              </label>
              <div>
                <div
                  className="select select-bordered w-full cursor-pointer focus:outline-none dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                  onClick={() => setIsPeriodOpen(!isPeriodOpen)}
                >
                  {period_ids.length > 0
                    ? `${period_ids.length} selected`
                    : loadingPeriods
                    ? "Loading periods..."
                    : "Select Periods"}
                </div>
                {isPeriodOpen && (
                  <div className="absolute z-10 w-full bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-md shadow max-h-60 overflow-y-auto">
                    {periods.map((p) => (
                      <label
                        key={p.id}
                        className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
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
              {errors.period_ids && (
                <p className="text-red-500 mt-1">{errors.period_ids.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-center mt-10">
            <button
              type="submit"
              className="btn text-white bgTheme w-52"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <i className="fa-solid fa-spinner fa-spin mr-2" />
              ) : (
                <i className="fa-solid fa-book ml-2" />
              )}
              {isSubmitting ? "" : "Assign"}
            </button>
          </div>
        </form>

        {showAlert && (
          <dialog className="modal modal-open">
            <div className="modal-box bg-white dark:bg-gray-800">
              <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">
                Subject Assignment
              </h3>
              <p className="py-4 text-gray-700 dark:text-gray-200">
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
    </div>
  );
};
