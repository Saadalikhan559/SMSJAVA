import React, { useContext, useState } from "react";
import image from "../../assets/auth-hero.png";
import { AuthContext } from "../../context/AuthContext";

export const Register = () => {
  const { RegisterUser, allRoles } = useContext(AuthContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      firstName,
      lastName,
      email,
      password,
      role,
    };
    RegisterUser(userData);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:block md:w-2/3 authBgColor">
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
              className="input input-bordered w-full"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          {/* Last Name */}
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
              className="input input-bordered w-full"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
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
              className="input input-bordered w-full"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Role Dropdown */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <i className="fa-solid fa-user-shield text-sm"></i>
                Role
              </span>
            </label>
            <select
              className="select select-bordered w-full"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Select Role</option>
              {allRoles.map((roleItem) => (
                <option key={roleItem.id} value={roleItem.name}>
                  {roleItem.name}
                </option>
              ))}
            </select>
          </div>

          {/* Password */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <i className="fa-solid fa-lock text-sm"></i>
                Password
              </span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="input input-bordered w-full"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div className="form-control w-full mt-6">
            <button type="submit" className="btn btn-primary w-full">
              <i className="fa-solid fa-user-plus mr-2"></i>
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
