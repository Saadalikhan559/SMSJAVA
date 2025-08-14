import { useEffect, useState } from "react";
import {
  createDiscount,
  fetchStudents1,
  fetchYearLevels,
} from "../../../services/api/Api";
import { useForm } from "react-hook-form";

const CreateDiscount = () => {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");
  const access = JSON.parse(localStorage.getItem("authTokens")).access;
  const [fieldDisabled, setFieldDisabled] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      student_id: "",
      admission_fee_discount: "",
      tuition_fee_discount: "",
      discount_reason: "",
      is_allowed: true,
    },
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

  // Fetch students for selected class
  const getStudents = async (id) => {
    if (!id) return;
    try {
      const Students = await fetchStudents1(id);
      setStudents(Students);
      setFieldDisabled(Students.length === 0);
      if (Students.length === 0) {
        reset({
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

  // Fetch fees on student change
  const handleStudentSelect = async (id) => {
    setValue("student_id", id);
    if (!id) {
      setAdmissionFee(0);
      setTuitionFee(0);
      return;
    }
    try {
      const res = await axios.get(`/api/student-fee/${id}`, {
        headers: { Authorization: `Bearer ${access}` },
      });
      setAdmissionFee(res.data.admission_fee || 0);
      setTuitionFee(res.data.tuition_fee || 0);
    } catch (err) {
      console.error("Failed to fetch student fees", err);
    }
  };

  useEffect(() => {
    getClasses();
  }, []);

  useEffect(() => {
    getStudents(classId);
    reset((prev) => ({ ...prev, student_id: "" }));
  }, [classId]);


  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        student_id: parseInt(data.student_id),
        admission_fee_discount: data.admission_fee_discount
          ? parseFloat(data.admission_fee_discount)
          : 0,
        tuition_fee_discount: data.tuition_fee_discount
          ? parseFloat(data.tuition_fee_discount)
          : 0,
      };

      await createDiscount(access, payload);
      reset();
    } catch (error) {
      if (error.response?.data) {
        const backendErrors = error.response.data;
        Object.keys(backendErrors).forEach((field) => {
          setError(field, {
            type: "server",
            message: backendErrors[field][0],
          });
        });
      }
    } finally {
      setLoading(false);
    }
  };

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



  // Button disable condition
  const admissionVal = watch("admission_fee_discount");
  const tuitionVal = watch("tuition_fee_discount");
  const studentVal = watch("student_id");
  const btnDisabled =
    (!admissionVal && !tuitionVal) || !studentVal || loading;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-base-100 rounded-box my-5 shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-8">
        Create Discount
        <i className="fa-solid fa-percentage ml-2"></i>
      </h1>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
              {...register("student_id", {
                required: "Please select a student.",
              })}
              onChange={(e) => handleStudentSelect(e.target.value)}
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
              <p className="text-error text-sm">
                {errors.student_id.message}
              </p>
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
              disabled={fieldDisabled}
              {...register("admission_fee_discount", {
                required: "Admission Fee Discount Should Not be less then Admission Fee."
              })}
            />
            {errors.admission_fee_discount && (
              <p className="text-error text-sm">
                {errors.admission_fee_discount.message}

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
              disabled={fieldDisabled}
              {...register("tuition_fee_discount", {
              })}
            />
            {errors.tuition_fee_discount && (
              <p className="text-error text-sm">
=                {errors.tuition_fee_discount.message}

              </p>
            )}
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
            className="textarea textarea-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g. Sibling concession"
            rows={3}
            disabled={fieldDisabled}
            {...register("discount_reason", {
            })}
          ></textarea>
          {errors.discount_reason && (
            <p className="text-error text-sm">
              {errors.discount_reason.message}
            </p>
          )}

        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            className="btn btn-primary w-full md:w-52"
            disabled={loading || btnDisabled} // dono condition check ho jaye
          >
            {loading ? (
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
    </div>
  );
};

export default CreateDiscount;

