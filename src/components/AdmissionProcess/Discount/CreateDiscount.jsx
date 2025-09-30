import { useEffect, useState, useContext } from "react";
import { fetchStudents1, fetchYearLevels } from "../../../services/api/Api";
import { AuthContext } from "../../../context/AuthContext";

const CreateDiscount = () => {
  const { axiosInstance } = useContext(AuthContext);

  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");

  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(false);

  const [formData, setFormData] = useState({
    student_id: "",
    admission_fee_discount: "",
    tuition_fee_discount: "",
    discount_reason: "",
    is_allowed: true,
  });

  const [btnDisabled, setBtnDisabled] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    setTimeout(() => setPageLoading(false), 800);
  }, []);

  const loadClasses = async () => {
    if (classes.length > 0) return;
    setLoadingClasses(true);
    try {
      const data = await fetchYearLevels();
      setClasses(data);
      setError(false);
    } catch (err) {
      console.error("Failed to load classes:", err);
      setError(true);
    } finally {
      setLoadingClasses(false);
    }
  };

  const loadStudents = async () => {
    if (!classId) return;
    setLoadingStudents(true);
    try {
      const data = await fetchStudents1(classId);
      setStudents(data || []);
      setError(false);
    } catch (err) {
      console.error("Failed to load students:", err);
      setError(true);
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  useEffect(() => {
    if (classId) loadStudents();
    setFormData((prev) => ({ ...prev, student_id: "" }));
  }, [classId]);

  useEffect(() => {
    const hasFeeValue =
      formData.admission_fee_discount.trim() !== "" ||
      formData.tuition_fee_discount.trim() !== "";
    const allRequiredFields = hasFeeValue && formData.student_id;
    setBtnDisabled(!allRequiredFields);
  }, [formData]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { ...formData, is_allowed: true };
      await axiosInstance.post("/d/fee-discounts/", payload);

      setAlertTitle("Success");
      setAlertMessage("Discount created successfully!");
      setShowAlert(true);

      setFormData({
        student_id: "",
        admission_fee_discount: "",
        tuition_fee_discount: "",
        discount_reason: "",
        is_allowed: true,
      });
      setStudents([]);
      setClassId("");
    } catch (err) {
      setAlertTitle("Error");
      setAlertMessage("Failed to create discount. Try again!");
      setShowAlert(true);
    } finally {
      setIsSubmitting(false);
    }
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

  if (error) {
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
    <div className="min-h-screen p-5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  <div className="w-full max-w-7xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg my-5">
    <h1 className="text-3xl font-bold text-center mb-8">
    Create Discount
    <i class="fa-solid fa-indian-rupee-sign ml-2"></i>
    </h1>

    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Class */}
        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center gap-1">
              <i className="fa-solid fa-school text-sm"></i>
              Class <span className="text-error">*</span>
            </span>
          </label>
          <select
            className="select select-bordered w-full focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            value={classId}
            onFocus={loadClasses}
            onChange={(e) => setClassId(e.target.value)}
          >
            <option value="">
              {loadingClasses ? "Loading classes..." : "Select Class"}
            </option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.level_name}
              </option>
            ))}
          </select>
        </div>

        {/* Student */}
        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center gap-1">
              <i className="fa-solid fa-user-graduate text-sm"></i>
              Student <span className="text-error">*</span>
            </span>
          </label>
          <select
            className="select select-bordered w-full focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            value={formData.student_id}
            onChange={(e) => handleChange("student_id", e.target.value)}
            disabled={!classId}
          >
            <option value="">
              {loadingStudents
                ? "Loading students..."
                : !classId
                  ? "Select a class first"
                  : "Select Student"}
            </option>
            {students.map((std) => (
              <option key={std.student_id} value={std.student_id}>
                {std.student_name} - {std.student_email}
              </option>
            ))}
          </select>
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
            className="input input-bordered w-full focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            placeholder="e.g. 100"
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
            className="input input-bordered w-full focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            placeholder="e.g. 500"
            value={formData.tuition_fee_discount}
            onChange={(e) =>
              handleChange("tuition_fee_discount", e.target.value)
            }
          />
        </div>
      </div>

      {/* Reason */}
      <div className="form-control mt-6">
        <label className="label">
          <span className="label-text flex items-center gap-1">
            <i className="fa-solid fa-comment-dots text-sm"></i>
            Discount Reason
          </span>
        </label>
        <textarea
          className="textarea textarea-bordered w-full focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          placeholder="e.g. Sibling concession"
          rows={3}
          value={formData.discount_reason}
          onChange={(e) => handleChange("discount_reason", e.target.value)}
        ></textarea>
      </div>

      {/* Submit */}
      <div className="flex justify-center pt-6">
        <button
          type="submit"
          className="btn btn-primary w-full md:w-52 bgTheme text-white"
          disabled={btnDisabled}
        >
          {isSubmitting ? (
            <i className="fa-solid fa-spinner fa-spin mr-2"></i>
          ) : (
            <>
              <i className="fa-solid fa-wand-magic-sparkles mr-2"></i>
              Create
            </>
          )}
        </button>
      </div>
    </form>

    {/* Modal */}
    {showAlert && (
      <dialog open className="modal modal-open">
        <div className="modal-box dark:bg-gray-800 dark:text-gray-100">
          <h3 className="font-bold text-lg">{alertTitle}</h3>
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
</div>
  );
};

export default CreateDiscount;
