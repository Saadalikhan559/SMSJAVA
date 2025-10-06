import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchDiscounts, updateDiscount } from "../../../services/api/Api";
import { allRouterLink } from "../../../router/AllRouterLinks";

const EditDiscount = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("authTokens"))?.access;

  const [formData, setFormData] = useState({
    student_name: "",
    admission_fee_discount: "",
    tuition_fee_discount: "",
    admission_fee: "",
    tuition_fee: "",
    discount_reason: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch student by ID
  useEffect(() => {
    const loadStudent = async () => {
      try {
        const data = await fetchDiscounts(token);
        const student = data.find((s) => s.id === parseInt(id));
        if (student) setFormData(student);
      } catch (err) {
        console.error("Error fetching student:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    loadStudent();
  }, [id, token]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      await updateDiscount(token, id, formData);
      setModalOpen(true); 
    } catch (err) {
      console.error("Error updating discount:", err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    navigate(allRouterLink.discountedStudents); 
  };

  // Loader for initial fetch
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce [animation-delay:-0.2s]"></div>
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce [animation-delay:-0.4s]"></div>
        </div>
        <p className="mt-2 text-gray-500 text-sm">Loading student data...</p>
      </div>
    );
  }

  // Error UI
  if (error || !formData.student_name) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
        <i className="fa-solid fa-triangle-exclamation text-5xl text-red-400 mb-4"></i>
        <p className="text-lg text-red-400 font-medium">
          Failed to load student data. Try again.
        </p>
      </div>
    );
  }

  return (
   <div className="min-h-screen p-5 bg-gray-50 dark:bg-gray-900 mb-24 md:mb-10">
  <div className="w-full max-w-7xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-box my-5 shadow-lg">
    <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
     <i className="fa-solid fa-percentage ml-2"></i>  Edit Discount 
    </h1>

    <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student Name */}
        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center gap-1 text-gray-700 dark:text-gray-200">
              <i className="fa-solid fa-user-graduate text-sm"></i>
              Student Name
            </span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
            value={formData.student_name}
            disabled
          />
        </div>

        {/* Admission Fee Discount */}
        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center gap-1 text-gray-700 dark:text-gray-200">
              <i className="fa-solid fa-tag text-sm"></i>
              Admission Fee Discount (₹)
            </span>
          </label>
          <input
            type="number"
            className="input input-bordered w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
            value={formData.admission_fee_discount}
            onChange={(e) =>
              handleChange("admission_fee_discount", e.target.value)
            }
          />
        </div>

        {/* Tuition Fee Discount */}
        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center gap-1 text-gray-700 dark:text-gray-200">
              <i className="fa-solid fa-tags text-sm"></i>
              Tuition Fee Discount (₹)
            </span>
          </label>
          <input
            type="number"
            className="input input-bordered w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
            value={formData.tuition_fee_discount}
            onChange={(e) =>
              handleChange("tuition_fee_discount", e.target.value)
            }
          />
        </div>
      </div>

      {/* Discount Reason */}
      <div className="form-control">
        <label className="label">
          <span className="label-text flex items-center gap-1 text-gray-700 dark:text-gray-200">
            <i className="fa-solid fa-comment-dots text-sm"></i>
            Discount Reason
          </span>
        </label>
        <textarea
          className="textarea textarea-bordered w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
          rows={3}
          value={formData.discount_reason}
          onChange={(e) => handleChange("discount_reason", e.target.value)}
        ></textarea>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center pt-6">
        <button
          type="submit"
          className="btn bgTheme text-white w-full md:w-52"
          disabled={submitLoading}
        >
          {submitLoading ? (
            <div className="flex space-x-2 justify-center">
              <i className="fa-solid fa-spinner fa-spin mr-2"></i>
            </div>
          ) : (
            <>
              <i className="fa-solid fa-save mr-2"></i>
              Update
            </>
          )}
        </button>
      </div>
    </form>

    {modalOpen && (
      <dialog className="modal modal-open">
        <div className="modal-box bg-white dark:bg-gray-800 dark:text-white">
          <h3 className="font-bold text-lg">Success</h3>
          <p className="py-4">
            Student’s discount record has been successfully updated.
          </p>
          <div className="modal-action">
            <button className="btn bgTheme text-white w-25" onClick={closeModal}>
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

export default EditDiscount;
