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
  const [formErrors, setFormErrors] = useState({});


  const [formData, setFormData] = useState({
    admission_fee_discount: "",
    tuition_fee_discount: "",
    discount_reason: "",
    student_id: "",
    is_allowed: true,
  });

  const [btnDisabled, setBtnDisabled] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const [searchStudentInput, setSearchStudentInput] = useState("");
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [selectedStudentName, setSelectedStudentName] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");

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
      const sortedData = (data || []).sort((a, b) =>
        a.student_name.localeCompare(b.student_name, "en", { sensitivity: "base" })
      );
      setStudents(sortedData);
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
    setSelectedStudentId("");
    setSelectedStudentName("");
    setSearchStudentInput("");
  }, [classId]);

  // Sync selected student to formData
  useEffect(() => {
    setFormData((prev) => ({ ...prev, student_id: selectedStudentId }));
  }, [selectedStudentId]);

  useEffect(() => {
    const hasValidDiscount =
      parseFloat(formData.admission_fee_discount) > 0 ||
      parseFloat(formData.tuition_fee_discount) > 0;

    const isValid = formData.student_id && hasValidDiscount;
    setBtnDisabled(!isValid);
  }, [formData]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};

    if (!classId) errors.classId = "Class is required.";
    if (!selectedStudentId) errors.student_id = "Student is required.";

    const admission = parseFloat(formData.admission_fee_discount || 0);
    const tuition = parseFloat(formData.tuition_fee_discount || 0);

    if (admission <= 0 && tuition <= 0) {
      errors.discount = "At least one discount amount must be greater than 0.";
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return; // Stop if errors

    setIsSubmitting(true);

    try {
      const payload = { ...formData, is_allowed: true };
      await axiosInstance.post("/d/fee-discounts/", payload);

      setAlertTitle("Success");
      setAlertMessage("Discount created successfully!");
      setShowAlert(true);

      // Reset fields
      setFormData({
        admission_fee_discount: "",
        tuition_fee_discount: "",
        discount_reason: "",
        student_id: "",
        is_allowed: true,
      });
      setSelectedStudentId("");
      setSelectedStudentName("");
      setSearchStudentInput("");
      setClassId("");
      setStudents([]);
      setFormErrors({});
    } catch (err) {
      setAlertTitle("Error");
      console.log("error", err.response?.data);
      setAlertMessage(err.response?.data?.student_id || "Something went wrong");
      setShowAlert(true);
    } finally {
      setIsSubmitting(false);
    }
  };


  const filteredStudents = students.filter((studentObj) =>
    studentObj.student_name
      .toLowerCase()
      .includes(searchStudentInput.toLowerCase())
  );

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
    <div className="min-h-screen p-5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 mb-24 md:mb-10">
      <div className="w-full max-w-7xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg my-5">
        <h1 className="text-3xl font-bold text-center mb-8">
          Create Discount
          <i className="fa-solid fa-indian-rupee-sign ml-2"></i>
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Class Dropdown */}
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
              </select> {formErrors.classId && (
                <p className="text-sm text-red-500 mt-1">{formErrors.classId}</p>
              )}
            </div>

            {/* Student Dropdown/Search */}
            <div className="relative">
              <label className="label-text flex items-center gap-1">
                Student <span className="text-error">*</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full focus:outline-none  dark:bg-gray-700 dark:text-white dark:border-gray-600"
                placeholder="Search Student..."
                value={searchStudentInput || selectedStudentName}
                onChange={(e) => {
                  setSearchStudentInput(e.target.value);
                  setShowStudentDropdown(true);
                  setSelectedStudentName("");
                }}
                onFocus={() => setShowStudentDropdown(true)}
                autoComplete="off"
              />

              {showStudentDropdown && (
                <div className="absolute z-10 bg-white dark:bg-gray-700 rounded w-full mt-1 shadow-lg border border-gray-300 dark:border-gray-600">
                  <div className="p-2 sticky top-0 shadow-sm bg-white dark:bg-gray-700">
                    {/* <input
                      type="text"
                      placeholder="Search Student..."
                      className="input input-bordered w-full focus:outline-none bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-500"
                      value={searchStudentInput}
                      onChange={(e) => setSearchStudentInput(e.target.value)}
                    /> */}
                  </div>

                  <div className="max-h-40 overflow-y-auto">
                    {!loadingStudents && filteredStudents.length > 0 ? (
                      filteredStudents.map((studentObj) => (
                        <p
                          key={studentObj.student_id}
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer text-gray-800 dark:text-gray-200 capitalize"
                          onClick={() => {
                            setSelectedStudentId(studentObj.student_id);
                            setSelectedStudentName(studentObj.student_name);
                            setSearchStudentInput(studentObj.student_name);
                            setShowStudentDropdown(false);
                          }}
                        >
                          {studentObj.student_name}
                        </p>
                      ))
                    ) : (
                      <p className="p-2 text-gray-500 dark:text-gray-400">
                        {loadingStudents
                          ? "Loading students..."
                          : "No students found."}
                      </p>
                    )}
                  </div>

                </div>
              )}  {formErrors.student_id && (
                <p className="text-sm text-red-500 mt-1">{formErrors.student_id}</p>
              )}
            </div>
          </div>

          {/* Fee Discounts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1">
                  <i className="fa-solid fa-tag text-sm"></i>
                  Admission Fee Discount (₹)
                </span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="input input-bordered w-full focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                placeholder="e.g. 100"
                value={formData.admission_fee_discount}
                onChange={(e) =>
                  handleChange("admission_fee_discount", e.target.value)
                }
              /> {formErrors.discount && (
                <p className="text-sm text-red-500 mt-1 col-span-2">{formErrors.discount}</p>
              )}

            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1">
                  <i className="fa-solid fa-tags text-sm"></i>
                  Tuition Fee Discount (₹)
                </span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="input input-bordered w-full focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                placeholder="e.g. 500"
                value={formData.tuition_fee_discount}
                onChange={(e) =>
                  handleChange("tuition_fee_discount", e.target.value)
                }
              />  {formErrors.discount && (
                <p className="text-sm text-red-500 mt-1 col-span-2">{formErrors.discount}</p>
              )}

            </div>
          </div>

          {/* Discount Reason */}
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
              onChange={(e) =>
                handleChange("discount_reason", e.target.value)
              }
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              className="btn btn-primary w-full md:w-52 bgTheme text-white"

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