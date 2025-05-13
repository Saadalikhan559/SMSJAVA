import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { fetchSchoolYear, fetchYearLevels, handleAdmissionForm } from "../../services/api/Api";

export const AdmissionForm = () => {
  const { RegisterUser, allRoles } = useContext(AuthContext);
  const [yearLevel, setYearLevel] = useState([]);
  const [schoolYears, setSchoolYear] = useState([]);
  const [formData, setFormData] = useState({
    student: {
      first_name: "",
      middle_name: "",
      last_name: "",
      password: "",
      email: "",
      classes: [],
      date_of_birth: "",
      gender: "",
      enrolment_date: ""
    },
    guardian: {
      first_name: "",
      middle_name: "",
      last_name: "",
      email: "",
      password: "",
      students: [],
      phone_no: ""
    },
    admission_date: "",
    previous_school_name: "",
    previous_standard_studied: "",
    tc_letter: "",
    year_level: "",
    school_year: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Check if the field belongs to student or guardian
    if (name.startsWith("student_")) {
      const fieldName = name.replace("student_", "");
      setFormData(prev => ({
        ...prev,
        student: {
          ...prev.student,
          [fieldName]: value
        }
      }));
    } else if (name.startsWith("guardian_")) {
      const fieldName = name.replace("guardian_", "");
      setFormData(prev => ({
        ...prev,
        guardian: {
          ...prev.guardian,
          [fieldName]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAdmissionForm(formData);
    console.log(formData);
  };

  const getYearLevels = async () => {
    try {
      const yearLevels = await fetchYearLevels();
      setYearLevel(yearLevels);
    } catch (err) {
      console.log("Failed to load year levels. Please try again.");
    }
  };

  const getSchoolYears = async () => {
    try {
      const schoolYears = await fetchSchoolYear();
      setSchoolYear(schoolYears);
    } catch (err) {
      console.log("Failed to load school years. Please try again.");
    }
  };

  useEffect(() => {
    getYearLevels();
    getSchoolYears();
  }, []);

  return (
    <form
      className="w-full max-w-6xl mx-auto p-6 bg-base-100 rounded-box my-5 shadow-sm"
      onSubmit={handleSubmit}
    >
      <h1 className="text-3xl font-bold text-center mb-8">
        Fill your Details <i className="fa-solid fa-graduation-cap ml-2"></i>
      </h1>

      {/* Student Information Section */}
      <div className="bg-base-200 p-6 rounded-box mb-6">
        <h2 className="text-2xl font-bold mb-4">Student Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* First Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <i className="fa-solid fa-user text-sm"></i>
                First Name <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="text"
              name="student_first_name"
              placeholder="First Name"
              className="input input-bordered w-full"
              required
              value={formData.student.first_name}
              onChange={handleChange}
            />
          </div>

          {/* Middle Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <i className="fa-solid fa-user-pen text-sm"></i>
                Middle Name
              </span>
            </label>
            <input
              type="text"
              name="student_middle_name"
              placeholder="Middle Name"
              className="input input-bordered w-full"
              value={formData.student.middle_name}
              onChange={handleChange}
            />
          </div>

          {/* Last Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <i className="fa-solid fa-user-tag text-sm"></i>
                Last Name <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="text"
              name="student_last_name"
              placeholder="Last Name"
              className="input input-bordered w-full"
              required
              value={formData.student.last_name}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Student Email */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <i className="fa-solid fa-envelope text-sm"></i>
                Email <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="email"
              name="student_email"
              placeholder="student@example.com"
              className="input input-bordered w-full"
              required
              value={formData.student.email}
              onChange={handleChange}
            />
          </div>

          {/* Student Password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <i className="fa-solid fa-lock text-sm"></i>
                Password <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="password"
              name="student_password"
              placeholder="Password"
              className="input input-bordered w-full"
              required
              value={formData.student.password}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Date of Birth */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <i className="fa-solid fa-calendar-days text-sm"></i>
                Date of Birth <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="date"
              name="student_date_of_birth"
              className="input input-bordered w-full"
              required
              value={formData.student.date_of_birth}
              onChange={handleChange}
            />
          </div>

          {/* Gender */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <i className="fa-solid fa-venus-mars text-sm"></i>
                Gender <span className="text-error">*</span>
              </span>
            </label>
            <select
              name="student_gender"
              className="select select-bordered w-full"
              required
              value={formData.student.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Enrolment Date */}
        <div className="form-control mt-6">
          <label className="label">
            <span className="label-text flex items-center gap-2">
              <i className="fa-solid fa-calendar-plus text-sm"></i>
              Enrolment Date <span className="text-error">*</span>
            </span>
          </label>
          <input
            type="date"
            name="student_enrolment_date"
            className="input input-bordered w-full"
            required
            value={formData.student.enrolment_date}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Guardian Information Section */}
      <div className="bg-base-200 p-6 rounded-box mb-6">
        <h2 className="text-2xl font-bold mb-4">Guardian Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* First Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <i className="fa-solid fa-user text-sm"></i>
                First Name <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="text"
              name="guardian_first_name"
              placeholder="First Name"
              className="input input-bordered w-full"
              required
              value={formData.guardian.first_name}
              onChange={handleChange}
            />
          </div>

          {/* Middle Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <i className="fa-solid fa-user-pen text-sm"></i>
                Middle Name
              </span>
            </label>
            <input
              type="text"
              name="guardian_middle_name"
              placeholder="Middle Name"
              className="input input-bordered w-full"
              value={formData.guardian.middle_name}
              onChange={handleChange}
            />
          </div>

          {/* Last Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <i className="fa-solid fa-user-tag text-sm"></i>
                Last Name <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="text"
              name="guardian_last_name"
              placeholder="Last Name"
              className="input input-bordered w-full"
              required
              value={formData.guardian.last_name}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Guardian Email */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <i className="fa-solid fa-envelope text-sm"></i>
                Email <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="email"
              name="guardian_email"
              placeholder="guardian@example.com"
              className="input input-bordered w-full"
              required
              value={formData.guardian.email}
              onChange={handleChange}
            />
          </div>

          {/* Guardian Password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <i className="fa-solid fa-lock text-sm"></i>
                Password <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="password"
              name="guardian_password"
              placeholder="Password"
              className="input input-bordered w-full"
              required
              value={formData.guardian.password}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Guardian Phone Number */}
        <div className="form-control mt-6">
          <label className="label">
            <span className="label-text flex items-center gap-2">
              <i className="fa-solid fa-phone text-sm"></i>
              Phone Number <span className="text-error">*</span>
            </span>
          </label>
          <input
            type="tel"
            name="guardian_phone_no"
            placeholder="Phone Number"
            className="input input-bordered w-full"
            required
            value={formData.guardian.phone_no}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Academic Information Section */}
      <div className="bg-base-200 p-6 rounded-box mb-6">
        <h2 className="text-2xl font-bold mb-4">Academic Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Year Level */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <i className="fa-solid fa-graduation-cap text-sm"></i>
                Year Level <span className="text-error">*</span>
              </span>
            </label>
            <select
              name="year_level"
              className="select select-bordered w-full"
              required
              value={formData.year_level}
              onChange={handleChange}
            >
              <option value="">Select Year Level</option>
              {yearLevel.map((yearlev) => (
                <option
                  value={yearlev.id}
                  key={yearlev.id}
                >
                  {yearlev.level_name}
                </option>
              ))}
            </select>
          </div>

          {/* School Year */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <i className="fa-solid fa-calendar text-sm"></i>
                School Year <span className="text-error">*</span>
              </span>
            </label>
            <select
              name="school_year"
              className="select select-bordered w-full"
              required
              value={formData.school_year}
              onChange={handleChange}
            >
              <option value="">Select School Year</option>
              {schoolYears.map((schoolYear) => (
                <option value={schoolYear.id} key={schoolYear.id}>
                  {schoolYear.year_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Previous School Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <i className="fa-solid fa-school text-sm"></i>
                Previous School Name
              </span>
            </label>
            <input
              type="text"
              name="previous_school_name"
              placeholder="Previous School Name"
              className="input input-bordered w-full"
              value={formData.previous_school_name}
              onChange={handleChange}
            />
          </div>

          {/* Previous Standard Studied */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <i className="fa-solid fa-book text-sm"></i>
                Previous Class/Grade
              </span>
            </label>
            <input
              type="text"
              name="previous_standard_studied"
              placeholder="Previous Class/Grade"
              className="input input-bordered w-full"
              value={formData.previous_standard_studied}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Admission Date */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <i className="fa-solid fa-calendar-check text-sm"></i>
                Admission Date <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="date"
              name="admission_date"
              className="input input-bordered w-full"
              required
              value={formData.admission_date}
              onChange={handleChange}
            />
          </div>

          {/* TC Letter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <i className="fa-solid fa-file text-sm"></i>
                TC Letter
              </span>
            </label>
            <select
              name="tc_letter"
              className="select select-bordered w-full"
              required
              value={formData.tc_letter}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="not_applicable">Not applicable</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center mt-10">
        <button type="submit" className="btn btn-primary px-10 py-3">
          <i className="fa-solid fa-paper-plane mr-2"></i>
          Submit
        </button>
      </div>
    </form>
  );
};