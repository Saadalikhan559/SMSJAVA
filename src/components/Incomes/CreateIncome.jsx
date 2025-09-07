import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { createSchoolIncome, fetchSchoolYear, fetchIncomeCategories } from "../../services/api/Api";
import { SuccessModal } from "../Modals/SuccessModal";

const CreateIncome = () => {
  const [schoolYears, setSchoolYears] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  const getSchoolYears = async () => {
    try {
      const res = await fetchSchoolYear();
      setSchoolYears(res);
    } catch (err) {
      console.error(err);
      alert("Failed to load school years");
    }
  };

  const getCategories = async () => {
    try {
      const res = await fetchIncomeCategories();
      setCategories(res);
    } catch (err) {
      console.error(err);
      alert("Failed to load income categories");
    }
  };

  useEffect(() => {
    getSchoolYears();
    getCategories();
  }, []);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("month", data.month);
    formData.append("amount", data.amount);
    formData.append("income_date", data.income_date);
    formData.append("category", parseInt(data.category));
    formData.append("description", data.description || "");
    formData.append("school_year", parseInt(data.school_year));
    formData.append("payment_method", data.payment_method);
    formData.append("status", data.status);

    if (data.attachment && data.attachment[0]) {
      formData.append("attachment", data.attachment[0]);
    }

    try {
      setLoading(true);
      await createSchoolIncome(formData);
      modalRef.current.show();
      reset();
    } catch (error) {
      console.error(error);
      alert("Failed to create income. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-5 bg-gray-50">
      <div className="w-full max-w-7xl mx-auto p-6 bg-base-100 rounded-box my-5 shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8">
          Add School Income <i className="fa-solid fa-sack-dollar ml-2"></i>
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Month */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1">
                  <i className="fa-solid fa-calendar-days text-sm"></i>
                  Month <span className="text-error">*</span>
                </span>
              </label>
              <select
                {...register("month", { required: "Month is required" })}
                className="select select-bordered w-full focus:outline-none"
              >
                <option value="">Select Month</option>
                {months.map((m, idx) => (
                  <option key={idx} value={m}>{m}</option>
                ))}
              </select>
              {errors.month && <p className="text-error text-sm mt-1">{errors.month.message}</p>}
            </div>

            {/* Amount */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1">
                  <i className="fa-solid fa-sack-dollar text-sm"></i>
                  Amount <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="number"
                placeholder="Enter amount"
                {...register("amount", {
                  required: "Amount is required",
                  min: { value: 1, message: "Amount must be greater than 0" },
                })}
                className="input input-bordered w-full focus:outline-none"
              />
              {errors.amount && <p className="text-error text-sm mt-1">{errors.amount.message}</p>}
            </div>

            {/* Income Date */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1">
                  <i className="fa-solid fa-calendar-days text-sm"></i>
                  Income Date <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="date"
                {...register("income_date", { required: "Income date is required" })}
                className="input input-bordered w-full focus:outline-none"
              />
              {errors.income_date && <p className="text-error text-sm mt-1">{errors.income_date.message}</p>}
            </div>

            {/* Category */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1">
                  <i className="fa-solid fa-list text-sm"></i>
                  Category <span className="text-error">*</span>
                </span>
              </label>
              <select
                {...register("category", { required: "Category is required" })}
                className="select select-bordered w-full focus:outline-none"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.category && <p className="text-error text-sm mt-1">{errors.category.message}</p>}
            </div>

            {/* Description */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1">
                  <i className="fa-solid fa-pen text-sm"></i>
                  Description
                </span>
              </label>
              <input
                type="text"
                placeholder="Description"
                {...register("description")}
                className="input input-bordered w-full focus:outline-none"
              />
            </div>

            {/* School Year */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1">
                  <i className="fa-solid fa-school text-sm"></i>
                  School Year <span className="text-error">*</span>
                </span>
              </label>
              <select
                {...register("school_year", { required: "School year is required" })}
                className="select select-bordered w-full focus:outline-none"
              >
                <option value="">Select School Year</option>
                {schoolYears.map((year) => (
                  <option key={year.id} value={year.id}>{year.year_name}</option>
                ))}
              </select>
              {errors.school_year && <p className="text-error text-sm mt-1">{errors.school_year.message}</p>}
            </div>

            {/* Payment Method */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1">
                  <i className="fa-solid fa-credit-card text-sm"></i>
                  Payment Method <span className="text-error">*</span>
                </span>
              </label>
              <select
                {...register("payment_method", { required: "Payment method is required" })}
                className="select select-bordered w-full focus:outline-none"
              >
                <option value="cash">Cash</option>
                <option value="bank">Bank</option>
                <option value="online">Online</option>
              </select>
              {errors.payment_method && <p className="text-error text-sm mt-1">{errors.payment_method.message}</p>}
            </div>

            {/* Status */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1">
                  <i className="fa-solid fa-circle-check text-sm"></i>
                  Status <span className="text-error">*</span>
                </span>
              </label>
              <select
                {...register("status", { required: "Status is required" })}
                className="select select-bordered w-full focus:outline-none"
              >
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
              </select>
              {errors.status && <p className="text-error text-sm mt-1">{errors.status.message}</p>}
            </div>

            {/* Attachment */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1">
                  <i className="fa-solid fa-paperclip text-sm"></i>
                  Attachment
                </span>
              </label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                {...register("attachment")}
                className="file-input file-input-bordered w-full focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              className="btn bgTheme text-white w-52"
              disabled={loading}
            >
              {loading ? <i className="fa-solid fa-spinner fa-spin mr-2"></i> :
                         <i className="fa-solid fa-save mr-2"></i>}
              {loading ? "Saving..." : "Save Income"}
            </button>
          </div>
        </form>
      </div>
      <SuccessModal ref={modalRef} />
    </div>
  );
};

export default CreateIncome;
