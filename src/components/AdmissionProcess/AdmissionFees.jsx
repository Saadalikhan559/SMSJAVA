import React, { useState } from 'react';

export const AdmissionFees = () => {
  const [formData, setFormData] = useState({
    student: '',
    year_level: '',
    month: '',
    fee_types: [],
    paid_amount: '',
    payment_mode: '',
    signature: ''
  });
  const [loading, setLoading] = useState(false);

  // Sample data - replace with your actual data
  const students = [
    { id: 1, first_name: 'John', last_name: 'Doe', level: { id: 5 } },
    { id: 2, first_name: 'Jane', last_name: 'Smith', level: { id: 3 } }
  ];

  const yearLevels = [
    { id: 1, name: 'Grade 1' },
    { id: 2, name: 'Grade 2' },
    { id: 3, name: 'Grade 3' },
    { id: 4, name: 'Grade 4' },
    { id: 5, name: 'Grade 5' }
  ];

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const paymentModes = ['Cash', 'Check', 'Online', 'Bank Transfer'];

  const feeTypes = [
    { id: 1, name: 'Admission Fee', amount: '2000.00', term: 1 },
    { id: 2, name: 'Tuition Fee', amount: '800.00', term: 1 },
    { id: 3, name: 'Library Fee', amount: '200.00', term: 1 },
    { id: 4, name: 'Sports Fee', amount: '150.00', term: 1 }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeeTypeChange = (e, fee) => {
    const isChecked = e.target.checked;
    setFormData(prev => {
      let updatedFeeTypes;
      if (isChecked) {
        updatedFeeTypes = [...prev.fee_types, fee];
      } else {
        updatedFeeTypes = prev.fee_types.filter(f => f.id !== fee.id);
      }
      
      return {
        ...prev,
        fee_types: updatedFeeTypes
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Prepare payload
    const payload = {
      ...formData,
      fee_types: formData.fee_types.map(fee => ({
        id: fee.id,
        name: fee.name,
        amount: fee.amount,
        term: fee.term
      }))
    };
    
    console.log('Submitting fees:', payload);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert('Fees submitted successfully!');
    }, 1500);
  };

  return (
    <form
      className="w-full max-w-6xl mx-auto p-6 bg-base-100 rounded-box my-5 shadow-sm focus:outline-none"
      onSubmit={handleSubmit}
    >
      <h1 className="text-3xl font-bold text-center mb-8">
        Admission Fees Payment
        <i className="fa-solid fa-money-bill-wave ml-2"></i>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Student Selection */}
        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center gap-1">
              <i className="fa-solid fa-user-graduate text-sm"></i>
              Student <span className="text-error">*</span>
            </span>
          </label>
          <select
            name="student"
            className="select select-bordered w-full focus:outline-none"
            required
            onChange={handleChange}
            value={formData.student}
          >
            <option value="">Select Student</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.first_name} {student.last_name}
              </option>
            ))}
          </select>
        </div>

        {/* Year Level Selection */}
        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center gap-2">
              <i className="fa-solid fa-graduation-cap text-sm"></i>
              Year Level <span className="text-error">*</span>
            </span>
          </label>
          <select
            name="year_level"
            className="select select-bordered w-full focus:outline-none"
            required
            onChange={handleChange}
            value={formData.year_level}
          >
            <option value="">Select Year Level</option>
            {yearLevels.map(level => (
              <option key={level.id} value={level.id}>
                {level.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Month Selection */}
        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center gap-2">
              <i className="fa-solid fa-calendar text-sm"></i>
              Month <span className="text-error">*</span>
            </span>
          </label>
          <select
            name="month"
            className="select select-bordered w-full focus:outline-none"
            required
            onChange={handleChange}
            value={formData.month}
          >
            <option value="">Select Month</option>
            {months.map(month => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Mode Selection */}
        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center gap-2">
              <i className="fa-solid fa-credit-card text-sm"></i>
              Payment Mode <span className="text-error">*</span>
            </span>
          </label>
          <select
            name="payment_mode"
            className="select select-bordered w-full focus:outline-none"
            required
            onChange={handleChange}
            value={formData.payment_mode}
          >
            <option value="">Select Payment Mode</option>
            {paymentModes.map(mode => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Fee Types Selection */}
      <div className="mt-6">
        <label className="label">
          <span className="label-text flex items-center gap-2">
            <i className="fa-solid fa-list text-sm"></i>
            Fee Types <span className="text-error">*</span>
          </span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {feeTypes.map(fee => (
            <div key={fee.id} className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">
                  {fee.name} - ${fee.amount}
                </span>
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={formData.fee_types.some(f => f.id === fee.id)}
                  onChange={(e) => handleFeeTypeChange(e, fee)}
                />
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Paid Amount (manual input) */}
        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center gap-2">
              <i className="fa-solid fa-calculator text-sm"></i>
              Paid Amount <span className="text-error">*</span>
            </span>
          </label>
          <input
            type="number"
            name="paid_amount"
            className="input input-bordered w-full focus:outline-none"
            required
            onChange={handleChange}
            value={formData.paid_amount}
            placeholder="Enter paid amount"
            step="0.01"
            min="0"
          />
        </div>

        {/* Signature */}
        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center gap-2">
              <i className="fa-solid fa-signature text-sm"></i>
              Signature <span className="text-error">*</span>
            </span>
          </label>
          <input
            type="text"
            name="signature"
            className="input input-bordered w-full focus:outline-none"
            required
            onChange={handleChange}
            value={formData.signature}
            placeholder="Enter your name as signature"
          />
        </div>
      </div>

      {/* Submit Button centered */}
      <div className="flex justify-center mt-10">
        <button type="submit" className="btn btn-primary w-52">
          {loading ? (
            <i className="fa-solid fa-spinner fa-spin mr-2"></i>
          ) : (
            <i className="fa-solid fa-money-bill-wave ml-2"></i>
          )}
          {loading ? "Processing..." : "Submit Payment"}
        </button>
      </div>
    </form>
  );
};