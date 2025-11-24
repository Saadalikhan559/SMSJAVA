import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import image from "../../assets/auth-hero.png";
import { AuthContext } from "../../context/AuthContext";
import { fetchRoles } from "../../services/api/Api";
import { constants } from "../../global/constants";
import {
  validfirstname,
  validlastname,
  validregisteremail,
  validregisterpassword,
  validregisterrole,
} from "../../Validations/Validations";

export const Register = () => {
  const { RegisterUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [allRoles, setAllRoles] = useState([]);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const getRoles = async () => {
      try {
        const roles = await fetchRoles();
        setAllRoles(roles);
      } catch {
        console.log("Failed to load roles. Please try again.");
      }
    };
    getRoles();
  }, []);

  // const filteredRoles = allRoles.filter(
  //   roleItem => roleItem.roleName === "teacher"
  //     || roleItem.roleName === "office_staff"
  // );


  const filteredRoles = allRoles.filter(
  roleItem => roleItem.name === "teacher" || roleItem.name === "office_staff"
);


  const onSubmit = async (data) => {
    setError("");
    setLoading(true);

    // const userData = {
    //   first_name: data.firstName,
    //   last_name: data.lastName,
    //   email: data.email,
    //   password: data.password,
    //   role: data.roleId,
    // };


    const userData = {
      firstName: data.firstName,
      middleName: data.middleName || "",
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      phoneNo: data.phoneNo,
      qualification: data.qualification,
      gender: data.gender,
      aadharNo: data.aadharNo,
      panNo: data.panNo,
      roles: [{ name: data.role }],
    };



    try {
      const isSuccess = await RegisterUser(userData);
      if (isSuccess) {
        setRegistrationSuccess(true);
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-24 md:mb-10">
      <style>{constants.hideEdgeRevealStyle}</style>

      <div className="min-h-screen flex flex-col md:flex-row">
        <div className="hidden md:block md:w-2/3 formBgColor">
          <img src={image} alt="Authentication" className="w-full h-full object-cover" />
        </div>

        <div className="w-full md:w-1/2 lg:w-1/3 flex items-center justify-center p-4">
          <form className="w-full max-w-md space-y-2" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-3xl font-bold text-center mb-6">Create an Account</h1>

            {error && <div className="text-red-500 text-center font-medium">{error}</div>}

            {/* First Name */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">First Name</span>
              </label>
              <input
                type="text"
                placeholder="First Name"
                autoComplete="on"
                className="input input-bordered w-full focus:outline-none"
                {...register("firstName", {
                  validate: (val) => validfirstname(val) === "" || validfirstname(val),
                })}
              />
              {errors.firstName && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.firstName.message || errors.firstName}
                </span>
              )}
            </div>

            {/* Middle Name */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Middle Name (Optional)</span>
              </label>
              <input
                type="text"
                placeholder="Middle Name"
                autoComplete="on"
                className="input input-bordered w-full focus:outline-none"
                {...register("middleName")}
              />
            </div>

            {/* Last Name */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Last Name</span>
              </label>
              <input
                type="text"
                placeholder="Last Name"
                autoComplete="on"
                className="input input-bordered w-full focus:outline-none"
                {...register("lastName", {
                  validate: (val) => validlastname(val) === "" || validlastname(val),
                })}
              />
              {errors.lastName && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.lastName.message || errors.lastName}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="example@gmail.com"
                autoComplete="on"
                className="input input-bordered w-full focus:outline-none"
                {...register("email", {
                  validate: (val) => validregisteremail(val) === "" || validregisteremail(val),
                })}
              />
              {errors.email && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.email.message || errors.email}
                </span>
              )}
            </div>

            {/* Role */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Role</span>
              </label>
              {/* <select
                className="select select-bordered w-full focus:outline-none"
                {...register("roleId", {
                  validate: (val) => validregisterrole(val) === "" || validregisterrole(val),
                })}
              >
                <option value="">Select Role</option>
                {filteredRoles.map((roleItem) => (
                  <option key={roleItem.id} value={roleItem.id}>
                    {roleItem.name}
                  </option>
                ))}
              </select> */}
              <select
                {...register("role", { required: "Please select a role" })}
                className="select select-bordered w-full focus:outline-none capitalize"
              >
                <option value="">Select Role</option>
                {/* {filteredRoles.map(roleItem => (
                  <option className="capitalize" key={roleItem.id} value={roleItem.roleName}>
                    {roleItem.roleName.replace("_", " ")}
                  </option>
                ))} */}
                {filteredRoles.map(roleItem => (
  <option className="capitalize" key={roleItem.id} value={roleItem.name}>
    {roleItem.name.replace("_", " ")}
  </option>
))}

              </select>
{/* 
              {errors.roleId && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.roleId.message || errors.roleId}
                </span>
              )} */}
              {errors.role && (
  <span className="text-red-500 text-sm mt-1">
    {errors.role.message || errors.role}
  </span>
)}

            </div>

            {/* Phone Number */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Phone Number</span>
              </label>
              <input
                type="text"
                placeholder="Enter 10-digit phone number"
                autoComplete="on"
                className="input input-bordered w-full focus:outline-none"
                {...register("phoneNo", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Enter a valid 10-digit phone number",
                  },
                })}
              />
              {errors.phoneNo && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.phoneNo.message}
                </span>
              )}
            </div>

            {/* Qualification */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Qualification</span>
              </label>
              <input
                type="text"
                placeholder="Enter your qualification"
                autoComplete="on"
                className="input input-bordered w-full focus:outline-none"
                {...register("qualification", {
                  required: "Qualification is required",
                })}
              />
              {errors.qualification && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.qualification.message}
                </span>
              )}
            </div>

            {/* Gender */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Gender</span>
              </label>
              <select
                {...register("gender", { required: "Please select your gender" })}
                className="select select-bordered w-full focus:outline-none"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.gender.message}
                </span>
              )}
            </div>

            {/* Aadhar Number */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Aadhar Number</span>
              </label>
              <input
                type="text"
                placeholder="Enter 12-digit Aadhar number"
                autoComplete="on"
                className="input input-bordered w-full focus:outline-none"
                {...register("aadharNo", {
                  required: "Aadhar number is required",
                  pattern: {
                    value: /^[0-9]{12}$/,
                    message: "Enter a valid 12-digit Aadhar number",
                  },
                })}
              />
              {errors.aadharNo && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.aadharNo.message}
                </span>
              )}
            </div>

            {/* PAN Number */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">PAN Number</span>
              </label>
              <input
                type="text"
                placeholder="Enter PAN number (e.g., ABCDE1234F)"
                autoComplete="on"
                className="input input-bordered w-full focus:outline-none uppercase"
                {...register("panNo", {
                  required: "PAN number is required",
                  pattern: {
                    value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                    message: "Enter a valid PAN number",
                  },
                })}
              />
              {errors.panNo && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.panNo.message}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="form-control w-full relative">
              <label className="label">
                <span className="label-text">Password</span>
                <div className="group relative ml-2 cursor-pointer">
                  <div className="relative group inline-block">
                    <i className="fa-solid fa-circle-info text-sm cursor-pointer"></i>
                    <div className="absolute left-1/2 -translate-x-1/2 -top-8 whitespace-nowrap bg-gray-800 text-white text-xs px-3 py-1 rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 z-10">
                      Password must be at least 8 characters, include one letter, one number, and one special character
                    </div>
                  </div>
                </div>
              </label>
              <input
                type={showPassword ? "password" : "text"}
                placeholder="Enter your password"
                autoComplete="on"
                className="input input-bordered w-full focus:outline-none"
                {...register("password", {
                  validate: (val) => validregisterpassword(val) === "" || validregisterpassword(val),
                })}
              />
              <button
                type="button"
                className="passwordEyes text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
              {errors.password && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.password.message || errors.password}
                </span>
              )}
            </div>

            {/* Submit */}
            <div className="form-control w-full mt-6">
              <button type="submit" className="btn text-white bgTheme w-full">
                {loading ? (
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                ) : (
                  <i className="fa-solid fa-right-to-bracket mr-2"></i>
                )}
                {loading ? "" : "Register"}
              </button>
            </div>

            {/* Redirect */}
            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <Link to="/login" className="textTheme font-semibold">
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {/* Success Modal */}
      {registrationSuccess && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Registration Successful!</h3>
            <p className="py-4">Your account has been created successfully.</p>
            <div className="modal-action">
              <button
                onClick={() => window.location.reload()}
                className="btn bgTheme text-white"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
