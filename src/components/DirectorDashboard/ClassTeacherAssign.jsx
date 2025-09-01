import React, { useContext, useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [teachersData, yearLevelsData] = await Promise.all([
          fetchTeachers(),
          fetchYearLevels(),
        ]);
        setTeachers(teachersData);
        setYearLevels(yearLevelsData);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSubmitForm = async (data) => {
    const payload = {
      teacher: data.teacher_id,
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
        alert("Class teacher assigned successfully!");
        window.location.reload();
      }
    } catch (error) {
      const res = error.response?.data;
      if (res?.error) {
        setError("api", { message: res.error });
      } else if (res?.detail) {
        setError("api", { message: res.detail });
      } else {
        setError("api", { message: "Failed to assign class teacher" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-5 bg-gray-50">
    <div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md my-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(allRouterLink.ViewAllocatedClass)}
          className="flex items-center textTheme hover:text-blue-800 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          View Allocated Class
        </button>
      </div>

      <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Class Allocation to Teachers{" "}
            <i className="fa-solid fa-square-poll-vertical w-5"></i>
          </h1>
          <p className="text-gray-600">Select teacher and class to assign</p>
        </div>

        {errors.api && (
          <div className="p-3 bg-red-50 text-red-600 rounded-md text-center">
            {errors.api.message}
          </div>
        )}

        <div className="flex space-x-4">
           <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teacher *
            </label>
            <select
              {...register("teacher_id", { required: "Teacher is required" })}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              disabled={loading}
              onChange={() => clearErrors(["teacher_id", "api"])}
            >
              <option value="">
                {loading ? "Loading teachers..." : "Select Teacher"}
              </option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.first_name} {teacher.last_name}
                </option>
              ))}
            </select>
            {errors.teacher_id && (
              <p className="text-red-500 text-sm mt-1">
                {errors.teacher_id.message}
              </p>
            )}
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year Level *
            </label>
            <select
              {...register("yearlevel_id", {
                required: "Year level is required",
              })}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              disabled={loading}
              onChange={() => clearErrors(["yearlevel_id", "api"])}
            >
              <option value="">
                {loading ? "Loading year levels..." : "Select Year Level"}
              </option>
              {yearLevels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.level_name}
                </option>
              ))}
            </select>
            {errors.yearlevel_id && (
              <p className="text-red-500 text-sm mt-1">
                {errors.yearlevel_id.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <button
            type="submit"
            disabled={isSubmitting || loading}
            className={`btn text-white bgTheme py-3 px-4 rounded-md  font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
              isSubmitting || loading ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center w-30">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                
              </span>
            ) : (
              "Assign Class Teacher"
            )}
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default ClassTeacherAssign;
