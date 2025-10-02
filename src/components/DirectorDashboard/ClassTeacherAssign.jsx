import React, { useContext, useState, useEffect } from "react";
import { fetchTeachers, fetchYearLevels } from "../../services/api/Api";
import axios from "axios";
import { constants } from "../../global/constants";
import { useNavigate } from "react-router-dom";
import { allRouterLink } from "../../router/AllRouterLinks";
import { AuthContext } from "../../context/AuthContext";
import { useForm } from "react-hook-form";

const ClassTeacherAssign = () => {
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
  const [yearLevels, setYearLevels] = useState([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [loadingYearLevels, setLoadingYearLevels] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(false);

  // State for custom teacher dropdown
  const [selectedTeacherName, setSelectedTeacherName] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [showTeacherDropdown, setShowTeacherDropdown] = useState(false);
  const [searchTeacherInput, setSearchTeacherInput] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const preloadData = async () => {
      try {
        await Promise.all([fetchTeachers(), fetchYearLevels()]);
      } catch (err) {
        setPageError(true);
      } finally {
        setPageLoading(false);
      }
    };
    preloadData();
  }, []);

  const loadTeachers = async () => {
    if (teachers.length > 0) return;
    setLoadingTeachers(true);
    try {
      const data = await fetchTeachers();
      setTeachers(data);
    } catch (error) {
      console.error("Failed to load teachers:", error);
    } finally {
      setLoadingTeachers(false);
    }
  };

  const loadYearLevels = async () => {
    if (yearLevels.length > 0) return;
    setLoadingYearLevels(true);
    try {
      const data = await fetchYearLevels();
      setYearLevels(data);
    } catch (error) {
      console.error("Failed to load year levels:", error);
    } finally {
      setLoadingYearLevels(false);
    }
  };

  const filteredTeachers = teachers.filter((teacher) =>
    `${teacher.first_name} ${teacher.last_name}`
      .toLowerCase()
      .includes(searchTeacherInput.toLowerCase())
  );

  const handleSubmitForm = async (data) => {
    const payload = {
      teacher: selectedTeacherId,
      year_level: data.yearlevel_id,
    };

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${constants.baseUrl}/t/teacheryearlevel/`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setAlertMessage("Class teacher assigned successfully!");
        setShowAlert(true);
        window.location.reload();
      }
    } catch (error) {
      const res = error.response?.data;
      let errorMessage = "Failed to assign class teacher";

      if (typeof res === "string") {
        errorMessage = res;
      } else if (res?.error) {
        errorMessage = res.error;
      } else if (res?.detail) {
        errorMessage = res.detail;
      } else if (typeof res === "object") {
        errorMessage = Object.values(res).flat().join(" | ");
      }
      setAlertMessage(errorMessage);
      setShowAlert(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Loading ---
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

  // --- Error ---
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
    <div className="min-h-screen p-5 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-7xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md my-8">
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => navigate(allRouterLink.ViewAllocatedClass)}
            className="flex items-center textTheme hover:text-blue-800 dark:hover:text-blue-400 transition-colors"
          >
            View Allocated Class
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1 transform rotate-180"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white border-b border-gray-900 dark:border-gray-700 pb-4">
              Allocate Teachers{" "}
              <i className="fa-solid fa-square-poll-vertical w-5"></i>
            </h1>
          </div><br />

          <div className="flex space-x-4">
            {/* Teacher Dropdown */}
            <div className="w-1/2 relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Teacher *
              </label>

              <div
                className={`w-full p-3 border rounded-md cursor-pointer bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 flex justify-between items-center`}
                onClick={() => {
                  loadTeachers();
                  setShowTeacherDropdown(!showTeacherDropdown);
                }}
              >
                {selectedTeacherName || "Select Teacher"}
                <i
                  className={`fa-solid fa-chevron-${showTeacherDropdown ? "up" : "down"} ml-2`}
                ></i>
              </div>

              {showTeacherDropdown && (
                <div className="absolute z-10 bg-white dark:bg-gray-700 rounded w-full mt-1 shadow-lg border border-gray-300 dark:border-gray-600">
                  <div className="p-2 sticky top-0 shadow-sm bg-white dark:bg-gray-700">
                    <input
                      type="text"
                      placeholder="Search Teacher..."
                      className="input input-bordered w-full focus:outline-none bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-500"
                      value={searchTeacherInput}
                      onChange={(e) => setSearchTeacherInput(e.target.value)}
                    />
                  </div>

                  <div className="max-h-40 overflow-y-auto">
                    {loadingTeachers && (
                      <p className="p-2 text-gray-500 dark:text-gray-400">
                        Loading teachers...
                      </p>
                    )}
                    {!loadingTeachers &&
                      filteredTeachers.map((teacher) => (
                        <p
                          key={teacher.id}
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer text-gray-800 dark:text-gray-200 capitalize"
                          onClick={() => {
                            const fullName = `${teacher.first_name} ${teacher.last_name}`;
                            setSelectedTeacherName(fullName);
                            setSelectedTeacherId(teacher.id);
                            setSearchTeacherInput("");
                            setShowTeacherDropdown(false);
                            clearErrors(["teacher_id", "api"]);
                          }}
                        >
                          {teacher.first_name} {teacher.last_name}
                        </p>
                      ))}
                    {!loadingTeachers && filteredTeachers.length === 0 && (
                      <p className="p-2 text-gray-500 dark:text-gray-400">
                        No teachers found.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Hidden input for react-hook-form validation
              <input
                type="hidden"
                {...register("teacher_id", {
                  required: "Teacher is required",
                  validate: () => selectedTeacherId !== null || "Teacher is required",
                })}
              /> */}

              {errors.teacher_id && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                  {errors.teacher_id.message}
                </p>
              )}
            </div>

            {/* Year Level */}
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Year Level *
              </label>
              <select
                {...register("yearlevel_id", {
                  required: "Year level is required",
                })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                onFocus={loadYearLevels}
                onChange={() => clearErrors(["yearlevel_id", "api"])}
              >
                <option value="">
                  {loadingYearLevels ? "Loading year levels..." : "Select Year Level"}
                </option>
                {yearLevels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.level_name}
                  </option>
                ))}
              </select>
              {errors.yearlevel_id && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                  {errors.yearlevel_id.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-center mt-10">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn text-white bgTheme w-30 py-3 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                </span>
              ) : (
                "Assign"
              )}
            </button>

          </div>
        </form>
      </div>
      {/* Modal */}
      {showAlert && (
        <dialog open className="modal modal-open">
          <div className="modal-box dark:bg-gray-800 dark:text-gray-100">
            <h3 className="font-bold text-lg">Allocated Teacher</h3>
            <p className="py-4">{alertMessage}</p>
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

export default ClassTeacherAssign;
