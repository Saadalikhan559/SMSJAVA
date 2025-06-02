import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import image from "../../assets/auth-hero.png";
import { AuthContext } from "../../context/AuthContext";
import { fetchRoles } from "../../services/api/Api";
import { constants } from "../../global/constants";
import { allRouterLink } from "../../router/AllRouterLinks";

export const Register = () => {
  const { RegisterUser, userRole } = useContext(AuthContext);
  const navigate = useNavigate();

  const [allRoles, setAllRoles] = useState([]);
  const [error, setError] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [showPassword, setShowPassword] = useState(true);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const userData = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      role: roleId,
    };

    try {
      const isSuccess = await RegisterUser(userData);
      if (isSuccess) {
        setRegistrationSuccess(true);
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getRoles = async () => {
      try {
        const roles = await fetchRoles();
        setAllRoles(roles);
      } catch (err) {
        console.log("Failed to load roles. Please try again.");
      }
    };
    getRoles();
  }, []);

  const filteredRoles = allRoles.filter((role) => {
    return role.name === "teacher" || role.name === "office staff";
  });

  return (
    <>
      <style>{constants.hideEdgeRevealStyle}</style>

      <div className="min-h-screen flex flex-col md:flex-row">
        <div className="hidden md:block md:w-2/3 formBgColor">
          <img
            src={image}
            alt="Authentication"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full md:w-1/2 lg:w-1/3 flex items-center justify-center p-4">
          <form className="w-full max-w-md space-y-4" onSubmit={handleSubmit}>
            <h1 className="text-3xl font-bold text-center mb-6">
              Create an Account
            </h1>

            {error && (
              <div className="text-red-500 text-center font-medium">
                {error}
              </div>
            )}

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
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-user-tag text-sm"></i>
                  Last Name
                </span>
              </label>
              <input
                type="text"
                placeholder="Last Name"
                className="input input-bordered w-full focus:outline-none"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

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
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-user-shield text-sm"></i>
                  Role
                </span>
              </label>
              <select
                className="select select-bordered w-full focus:outline-none cursor-pointer"
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                required
              >
                <option value="">Select Role</option>
                {filteredRoles.map((roleItem) => (
                  <option key={roleItem.id} value={roleItem.id}>
                    {roleItem.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control w-full relative">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-lock text-sm"></i> Password
                </span>
              </label>
              <input
                type={showPassword ? "password" : "text"}
                placeholder="Enter your password"
                className="input w-full pr-10 focus:outline-none"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="passwordEyes text-gray-500"
                onClick={handleShowPassword}
              >
                <i
                  className={`fa-solid ${
                    showPassword ? "fa-eye-slash" : "fa-eye"
                  }`}
                ></i>
              </button>
            </div>

            <div className="form-control w-full mt-6">
              <button type="submit" className="btn btn-primary w-full">
                {loading ? (
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                ) : (
                  <i className="fa-solid fa-user-plus mr-2"></i>
                )}
                {loading ? " " : "Register"}
              </button>
            </div>

            <div className="text-center mt-4">
              Already have an account?{" "}
              <Link
                to={allRouterLink.loginUser}
                className="text-blue-600 hover:underline"
              >
                Login here
              </Link>
            </div>
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
                onClick={() => navigate(allRouterLink.loginUser)}
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