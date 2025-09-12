import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { constants } from "../../global/constants";

const DirectorMarkHolidays = () => {
  const { axiosInstance } = useContext(AuthContext);
  const BASE_URL = constants.baseUrl;

  
  const [formData, setFormData] = useState({
    title: "",
    start_date: "",
    end_date: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loder, setLoder] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError("");
      try {

        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (err) {
        setError("Failed to load initial data. Try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [BASE_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoder(true);
    setError("");
    setSuccess("");

    try {
      if (!formData.title || !formData.start_date) {
        throw new Error("Please fill all required fields");
      }

      const payload = {
        title: formData.title,
        start_date: formData.start_date,
        end_date: formData.end_date || formData.start_date,
      };

      const response = await axiosInstance.post("/a/attendance/mark-holidays/",   payload);

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed to mark holiday");
      }

      setModalMessage("Holiday marked & notifications sent successfully!");
      setShowModal(true);
      setFormData({ title: "", start_date: "", end_date: "" });
    } catch (err) {
      setModalMessage(err.response?.data?.message || err.message || "An error occurred");
      setShowModal(true);
    } finally {
      setLoder(false);
    }
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

  // Full-page error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
        <i className="fa-solid fa-triangle-exclamation text-5xl text-red-400 mb-4"></i>
        <p className="text-lg text-red-400 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5 bg-gray-50">
      <div className="w-full max-w-7xl mx-auto p-6 bg-base-100 rounded-box my-5 shadow-sm">
        <form onSubmit={handleSubmit}>
          <h1 className="text-3xl font-bold text-center mb-8">
          <i className="fa-solid fa-calendar-day ml-2"></i>  Mark Holidays 
          </h1>

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
            <button
              type="submit"
              className="btn text-white bgTheme w-52"
              disabled={loder}
            >
              {loder ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin mr-2" />
                </>
              ) : (
                <>
                  <i className="fa-solid fa-calendar-plus mr-2" />
                  Mark Holiday
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      {/* Modal */}
      {showModal && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Mark Holidays </h3>
            <p className="py-4 whitespace-pre-line">{modalMessage}</p>
            <div className="modal-action">
              <button
                className="btn bgTheme text-white w-32"
                onClick={() => setShowModal(false)}
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

export default DirectorMarkHolidays;
