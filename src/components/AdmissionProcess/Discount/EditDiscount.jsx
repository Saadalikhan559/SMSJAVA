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

  const [loading, setLoading] = useState(false);
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
      }
    };
    loadStudent();
  }, [id, token]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateDiscount(token, id, formData);
      setModalOpen(true); 
    } catch (err) {
      console.error("Error updating discount:", err);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    navigate(allRouterLink.discountedStudents); 
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-base-100 rounded-box my-5 shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-8">
        Edit Discount <i className="fa-solid fa-percentage ml-2"></i>
      </h1>

      <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-1">
                <i className="fa-solid fa-user-graduate text-sm"></i>
                Student Name
              </span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Student Name"
              value={formData.student_name}
              disabled
            />
          </div>

          {/* Admission Fee Discount */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-1">
                <i className="fa-solid fa-tag text-sm"></i>
                Admission Fee Discount (₹)
              </span>
            </label>
            <input
              type="number"
              className="input input-bordered w-full"
              placeholder="e.g. 100.00"
              value={formData.admission_fee_discount}
              onChange={(e) =>
                handleChange("admission_fee_discount", e.target.value)
              }
            />
          </div>

          {/* Tuition Fee Discount */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-1">
                <i className="fa-solid fa-tags text-sm"></i>
                Tuition Fee Discount (₹)
              </span>
            </label>
            <input
              type="number"
              className="input input-bordered w-full"
              placeholder="e.g. 800.00"
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
            <span className="label-text flex items-center gap-1">
              <i className="fa-solid fa-comment-dots text-sm"></i>
              Discount Reason
            </span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="e.g. Sibling concession"
            rows={3}
            value={formData.discount_reason}
            onChange={(e) => handleChange("discount_reason", e.target.value)}
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-6">
          <button type="submit" className="btn bgTheme text-white  w-full md:w-52">
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                
              </>
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
    <div className="modal-box">
      <h3 className="font-bold text-lg">Success</h3>
      <p className="py-4">
        Student’s discount record has been successfully updated.
      </p>
      <div className="modal-action">
        <button
          className="btn btn-primary w-25"
          onClick={closeModal}
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

export default EditDiscount;
