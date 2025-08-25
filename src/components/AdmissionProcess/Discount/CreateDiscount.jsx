import { useEffect, useState } from "react";
import {
  createDiscount,
  fetchStudents1,
  fetchYearLevels,
} from "../../../services/api/Api";
import { useNavigate } from "react-router-dom";
import { constants } from "../../../global/constants";

const CreateDiscount = () => {
  const navigation = useNavigate();

  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");
  const access = JSON.parse(localStorage.getItem("authTokens")).access;
  const [fieldDisbaled, setFieldDisabled] = useState(true);
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    student_id: "",
    admission_fee_discount: "",
    tuition_fee_discount: "",
    discount_reason: "",
    is_allowed: true,
  });

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear the error for this specific field when user changes it
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  // Fetch all classes
  const getClasses = async () => {
    try {
      const response = await fetchYearLevels();
      setClasses(response);
    } catch (err) {
      console.log("Failed to load classes. Please try again." + err);
    }
  };

  const getStudents = async (id) => {
    if (!id) return;
    try {
      const Students = await fetchStudents1(id);
      setStudents(Students);
      setFieldDisabled(Students.length === 0);
      if (Students.length === 0) {
        setFormData({
          student_id: "",
          admission_fee_discount: "",
          tuition_fee_discount: "",
          discount_reason: "",
          is_allowed: true,
        });
      }
    } catch (err) {
      console.log("Failed to load school years. Please try again." + err);
    }
  };

  useEffect(() => {
    getClasses();
  }, []);

  useEffect(() => {
    getStudents(classId);
  }, [classId]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      student_id: "",
    }));
  }, [classId]);

  useEffect(() => {
    const hasFeeValue =
      formData.admission_fee_discount.trim() !== "" ||
      formData.tuition_fee_discount.trim() !== "";
    const allRequiredFields = hasFeeValue && formData.student_id;
    setBtnDisabled(!allRequiredFields);
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({}); // clear previous errors

    try {
      const payload = {
        ...formData,
        student_id: formData.student_id,
        admission_fee_discount: formData.admission_fee_discount,
        tuition_fee_discount: formData.tuition_fee_discount,
        is_allowed: true,
      };

      const response = await createDiscount(access, payload);

      // ✅ Success alert
      alert("Discount created successfully!");

      // If success, reset form
      setFormData({
        student_id: "",
        admission_fee_discount: "",
        tuition_fee_discount: "",
        discount_reason: "",
        is_allowed: true,
      });
    } catch (err) {
      setErrors(err);
    } finally {
      setLoading(false);
    }
  };

  // Placeholder functions for the new buttons
  const handleEdit = () => {
    navigation.navigate(`/createDiscount/${id}`)
  };

  const handleRemove = () => {
    alert("Remove functionality would be implemented here");
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-base-100 rounded-box my-5 shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-8">
        Create Discount
        <i className="fa-solid fa-percentage ml-2"></i>
      </h1>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Class Selection */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-1">
                <i className="fa-solid fa-school text-sm"></i>
                Class <span className="text-error">*</span>
              </span>
            </label>
            <select
              className="select select-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
            >
              <option value="">Select Class</option>
              {classes?.map((classItem) => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.level_name}
                </option>
              ))}
            </select>
          </div>

          {/* Student Selection */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-1">
                <i className="fa-solid fa-user-graduate text-sm"></i>
                Student <span className="text-error">*</span>
              </span>
            </label>
            <select
              className="select w-full select-bordered focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={!classId}
              value={formData.student_id}
              onChange={(e) => handleChange("student_id", e.target.value)}
            >
              <option value="">Select Student</option>
              {students.length > 0
                ? students.map((student) => (
                  <option key={student.student_id} value={student.student_id}>
                    {student.student_name} - {student.student_email}
                  </option>
                ))
                : classId && (
                  <option disabled>No students found for this class</option>
                )}
            </select>
            {errors.student_id && (
              <p className="text-error text-sm">{errors.student_id}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. 100.00"
              min={0}
              name="admission_fee_discount"
              value={formData.admission_fee_discount}
              onChange={(e) =>
                handleChange("admission_fee_discount", e.target.value)
              }
              disabled={fieldDisbaled}
            />
            {errors.admission_fee_discount && (
              <p className="text-error text-sm">
                {errors.admission_fee_discount[0]}
              </p>
            )}
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
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. 800.00"
              min={0}
              name="tuition_fee_discount"
              value={formData.tuition_fee_discount}
              onChange={(e) =>
                handleChange("tuition_fee_discount", e.target.value)
              }
              disabled={fieldDisbaled}
            />
            {errors.tuition_fee_discount && (
              <p className="text-error text-sm">
                {errors.tuition_fee_discount[0]}
              </p>
            )}
          </div>
        </div>
        {errors.fee_discount && (
          <p className="text-error text-sm">{errors.fee_discount}</p>
        )}

        {/* Discount Reason */}
        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center gap-1">
              <i className="fa-solid fa-comment-dots text-sm"></i>
              Discount Reason
            </span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g. Sibling concession"
            rows={3}
            name="discount_reason"
            disabled={fieldDisbaled}
            value={formData.discount_reason}
            onChange={(e) => handleChange("discount_reason", e.target.value)}
          ></textarea>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row justify-between pt-6 gap-4">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            {/* Submit Button */}
            <button
              type="submit"
              className="btn bgTheme text-white w-full md:w-40"
              disabled={btnDisabled}
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-wand-magic-sparkles mr-2"></i>
                  Create
                </>
              )}
            </button>
          </div>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        {/* Edit Button */}
            <button
              type="button"
              className="btn btn-info text-white w-full md:w-32"
              onClick={handleEdit}
            >
              <i className="fa-solid fa-pen-to-square mr-2"></i>
              Edit
            </button>
          <button
            type="button"
            className="btn btn-error text-white w-full md:w-32"
            onClick={handleRemove}          >
            <i className="fa-solid fa-trash mr-2"></i>
            Remove
          </button>
          </div>
          
          {/* Remove Button */}

        </div>
      </form>
    </div>
  );
};

export default CreateDiscount;