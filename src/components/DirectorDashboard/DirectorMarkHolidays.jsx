import React, { useState } from "react";
import axios from "axios";
import { constants } from "../../global/constants";
const DirectorMarkHolidays = () => {

  const BASE_URL = constants.baseUrl;

  const [formData, setFormData] = useState({
    title: "",
    start_date: "",
    end_date: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validate form
      if (!formData.title || !formData.start_date) {
        throw new Error("Please fill all required fields");
      }

      // Prepare payload
      const payload = {
        title: formData.title,
        start_date: formData.start_date,
        end_date: formData.end_date || formData.start_date, // If end_date is empty, use start_date
      };

      // Send request using axios
      const response = await axios.post(
        `${BASE_URL}/a/attendance/mark-holidays/`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed to mark holiday");
      }

      setSuccess("Holiday marked successfully!");
      // Reset form
      setFormData({
        title: "",
        start_date: "",
        end_date: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-base-100 rounded-box my-5 shadow-sm">
      <form onSubmit={handleSubmit}>
        <h1 className="text-3xl font-bold text-center mb-8">
          Mark Holidays <i className="fa-solid fa-calendar-day ml-2"></i>
        </h1>

        {error && (
          <div className="alert alert-error mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{success}</span>
          </div>
        )}

        <div className="flex justify-center">
          <div className="grid grid-cols-1 w-full md:w-1/2 gap-6 mt-6">
            {/* Holiday Title */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  Holiday Title <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="text"
                name="title"
                className="input input-bordered w-full"
                placeholder="Enter holiday title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Start Date */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Start Date <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="date"
              name="start_date"
              className="input input-bordered w-full"
              value={formData.start_date}
              onChange={handleChange}
              required
            />
          </div>

          {/* End Date */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">End Date</span>
            </label>
            <input
              type="date"
              name="end_date"
              className="input input-bordered w-full"
              value={formData.end_date}
              onChange={handleChange}
              min={formData.start_date}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-10">
          <button type="submit" className="btn text-white bgTheme w-52" disabled={loading}>
            {loading ? (
              <i className="fa-solid fa-spinner fa-spin mr-2" />
            ) : (
              <i className="fa-solid fa-calendar-plus ml-2" />
            )}
            {loading ? "Processing..." : "Mark Holiday"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DirectorMarkHolidays;