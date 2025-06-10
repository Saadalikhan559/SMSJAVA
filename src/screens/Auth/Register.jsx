import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form"; // Missing import
import image from "../../assets/auth-hero.png";
import { AuthContext } from "../../context/AuthContext";
import { fetchRoles } from "../../services/api/Api";
import { constants } from "../../global/constants";
import { validfirstname, validlastname, validregisteremail, validregisterpassword, validregisterrole } from "../../Validations/Validations";

export const Register = () => {
  const { RegisterUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [allRoles, setAllRoles] = useState([]);
  const [error, setError] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const getRoles = async () => {
    try {
      const roles = await fetchRoles();
      setAllRoles(roles);
    } catch {
      console.log("Failed to load roles. Please try again.");
    }
  };

  useEffect(() => {
    getRoles();
  }, []);

  const filteredRoles = allRoles.filter(
    (role) =>
      role.name === `${constants.roles.teacher}` ||
      role.name === `${constants.roles.officeStaff}`
  );

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const onSubmit = async (data) => { // Changed from handleSubmit to onSubmit to avoid naming conflict
    setError("");
    setLoading(true);

    const userData = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password,
      role: data.roleId,
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
    <>
      <style>{constants.hideEdgeRevealStyle}</style>


      <div className="min-h-screen flex flex-col md:flex-row">
        <div className="hidden md:block md:w-2/3 formBgColor">
          <img src={image} alt="Authentication" className="w-full h-full object-cover" />
        </div>
        <div className="w-full md:w-1/2 lg:w-1/3 flex items-center justify-center p-4">
          <form className="w-full max-w-md space-y-1" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-3xl font-bold text-center mb-6">Create an Account</h1>
            {error && (
              <div className="text-red-500 text-center font-medium">
                {error}
              </div>
            )}

            {/* First Name */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-user text-sm"></i>
                  First Name
                </span>
              </label>
              <input
                type="text"
                placeholder="First Name"
                className="input input-bordered w-full focus:outline-none"
                {...register("firstName", {
                  validate: (value) => {
                    const msg = validfirstname(value);
                    return msg === "" || msg;
                  },
                })}
              />
              {errors.firstName && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.firstName.message || errors.firstName}
                </span>
              )}
            </div>

            {/* Last Name */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-user text-sm"></i>
                  Last Name
                </span>
              </label>
              <input
                type="text"
                placeholder="Last Name"
                className="input input-bordered w-full focus:outline-none"
                {...register("lastName", {
                  validate: (value) => {
                    const msg = validlastname(value);
                    return msg === "" || msg;
                  },
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
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-envelope text-sm"></i>
                  Email
                </span>
              </label>
              <input
                type="email"
                placeholder="example@gmail.com"
                className="input input-bordered w-full focus:outline-none"
                {...register("email", {
                  validate: (value) => {
                    const msg = validregisteremail(value);
                    return msg === "" || msg;
                  },
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
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-user-shield text-sm"></i>
                  Role
                </span>
              </label>
              <select
                className="select select-bordered w-full focus:outline-none"
                {...register("roleId", {
                  validate: (value) => {
                    const msg = validregisterrole(value);
                    return msg === "" || msg;
                  },
                })}
              >
                <option value="">Select Role</option>
                {filteredRoles.map((roleItem) => (
                  <option key={roleItem.id} value={roleItem.id}>
                    {roleItem.name}
                  </option>
                ))}
              </select>
              {errors.roleId && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.roleId.message || errors.roleId}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="form-control w-full relative">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-lock text-sm"></i>
                  Password
                </span>
                <div className="group relative ml-2 cursor-pointer">
                  <i className="fa-solid fa-circle-info text-sm"></i>
                  <div className="absolute left-1/2 -translate-x-1/2 -top-10 w-auto p-2 text-xs text-white bg-gray-800 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    Password must be at least 8 characters, include one letter, one number, and one special character
                  </div>
                </div>
              </label>
              <input
                type={showPassword ? "password" : "text"}
                placeholder="Enter your password"
                className="input input-bordered w-full pr-10 focus:outline-none"
                {...register("password", {
                  validate: (value) => {
                    const msg = validregisterpassword(value);
                    return msg === "" || msg;
                  },
                })}
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-500"
                onClick={toggleShowPassword}
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
              <button type="submit" className="btn btn-primary w-full">
                {loading ? (
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                ) : (
                  <i className="fa-solid fa-right-to-bracket mr-2"></i>
                )}
                {loading ? " " : "Register"}
              </button>
            </div>

            {/* Redirect */}
            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 font-semibold">
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {registrationSuccess && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Registration Successful!</h3>
            <p className="py-4">Your account has been created successfully.</p>
            <div className="modal-action">
              <button
                onClick={() => navigate("/login")}
                className="btn btn-primary"
              >
                Continue to Login
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};