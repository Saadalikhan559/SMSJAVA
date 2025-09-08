import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { fetchSchoolIncomeById, fetchSchoolYear, updateSchoolIncome } from "../../services/api/Api";
import { useParams } from "react-router-dom";
import { Loader } from "../../global/Loader";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const categoryMap = {
  1: "Monthly Fees",
  2: "Govt Fund",
  3: "Hostel Rent",
  4: "Canteen Rent",
};

const UpdateIncome = ({ onClose, refreshData }) => {
  const { id } = useParams();
  const incomeId = id;
  const [schoolYears, setSchoolYears] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const selectedCategory = watch("category");

  //  Fetch school years
  useEffect(() => {
    const getSchoolYears = async () => {
      try {
        const res = await fetchSchoolYear();
        setSchoolYears(res);
      } catch (err) {
        console.error("Failed to load school years:", err);
        alert("Failed to load school years");
      }
    };
    getSchoolYears();
  }, []);

  //  Fetch income details
  useEffect(() => {
    const loadIncome = async () => {
      try {
        const res = await fetchSchoolIncomeById(incomeId);
        [
          "month",
          "amount",
          "income_date",
          "category",
          "description",
          "school_year",
          "payment_method",
          "status",
        ].forEach((f) => setValue(f, res[f]));
      } catch (err) {
        console.error("Failed to fetch income:", err);
        alert("Failed to load income data");
      } finally {
        setLoading(false);
      }
    };
    if (incomeId) loadIncome();
  }, [incomeId, setValue]);

  //  Submit handler
  const onSubmit = async (data) => {
    const token = localStorage.getItem("access");
    if (!token) {
      alert("No access token found. Please login.");
      return;
    }

    let payload;

    if (data.attachment && data.attachment[0]) {
      // FormData for attachment
      payload = new FormData();
      payload.append("month", data.month);
      payload.append("income_date", data.income_date);
      payload.append("category", parseInt(data.category));
      payload.append("description", data.description || "");
      payload.append("school_year", parseInt(data.school_year));
      payload.append("payment_method", data.payment_method);
      payload.append("status", data.status);

      if (parseInt(data.category) !== 1) payload.append("amount", data.amount);
      payload.append("attachment", data.attachment[0]);
    } else {
      // JSON payload
      payload = {
        month: data.month,
        income_date: data.income_date,
        category: parseInt(data.category),
        description: data.description || "",
        school_year: parseInt(data.school_year),
        payment_method: data.payment_method,
        status: data.status,
      };
      if (parseInt(data.category) !== 1) payload.amount = data.amount;
    }

    try {
      await updateSchoolIncome(incomeId, payload, token);
      alert("Income updated successfully!");
      refreshData?.();
      onClose?.();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to update income.");
    }
  };

  if (loading) return <Loader/>;

  return (
    <div className="min-h-screen p-5 bg-gray-50">
      <div className="w-full max-w-5xl mx-auto p-6 bg-base-100 rounded-box my-5 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className="text-3xl font-bold text-center mb-8">
            Update School Income <i className="fa-solid fa-sack-dollar ml-2"></i>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Month */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Month *</label>
              <select {...register("month", { required: true })} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none">
                <option value="">Select Month</option>
                {months.map((m, idx) => <option key={idx} value={m}>{m}</option>)}
              </select>
              {errors.month && <p className="text-red-500 text-sm mt-1">Month is required</p>}
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
              <input
                type="number"
                {...register("amount", { required: true, min: 1 })}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none"
                readOnly={parseInt(selectedCategory) === 1}
              />
            </div>

            {/* Income Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Income Date *</label>
              <input
                type="date"
                {...register("income_date", { required: true })}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select {...register("category", { required: true })} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none">
                <option value="">Select Category</option>
                {Object.entries(categoryMap).map(([id, name]) => <option key={id} value={id}>{name}</option>)}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input type="text" {...register("description")} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none" />
            </div>

            {/* School Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">School Year *</label>
              <select {...register("school_year", { required: true })} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none">
                <option value="">Select School Year</option>
                {schoolYears?.map((y) => <option key={y.id} value={y.id}>{y.year_name}</option>)}
              </select>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method *</label>
              <select {...register("payment_method", { required: true })} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none">
                <option value="cash">Cash</option>
                <option value="bank">Bank</option>
                <option value="online">Online</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
              <select {...register("status", { required: true })} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none">
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {/* Attachment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Attachment (optional)</label>
              <input type="file" {...register("attachment")} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none" />
            </div>
          </div>

          <div className="flex justify-center mt-10">
            <button type="submit" className="btn bgTheme text-white w-52" disabled={isSubmitting}>
              {isSubmitting ? <i className="fa-solid fa-spinner fa-spin mr-2"></i> : <i className="fa-solid fa-save mr-2"></i>}
              Update Income
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateIncome;
