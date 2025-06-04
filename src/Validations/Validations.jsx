import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import image from "../../assets/auth-hero.png";
import { AuthContext } from "../../context/AuthContext";
import { fetchRoles } from "../../services/api/Api";
import { constants } from "../../global/constants";
import {validfirstname,validlastname,validregisteremail,validregisterpassword} from "../../Validations/Validations";

export const Register = () => {
    const { RegisterUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [allRoles, setAllRoles] = useState([]);
    const [error, setError] = useState("");
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [roleId, setRoleId] = useState(""); // no default, user must pick

    const [showPassword, setShowPassword] = useState(true);

    const [firstnameError, setFirstnameError] = useState("");
    const [lastnameError, setLastnameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    // Fetch roles on mount
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

    // Only allow teacher and office staff roles
    const filteredRoles = allRoles.filter(
        (role) => role.name === "teacher" || role.name === "office staff"
    );

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset errors & error state
        setFirstnameError("");
        setLastnameError("");
        setEmailError("");
        setPasswordError("");
        setError("");
        setLoading(true);

        // Validation checks
        const firstNameMsg = validfirstname(firstName);
        const lastNameMsg = validlastname(lastName);
        const emailMsg = validregisteremail(email);
        const passwordMsg = validregisterpassword(password);

        let valid = true;

        if (firstNameMsg) {
            setFirstnameError(firstNameMsg);
            valid = false;
        }
        if (lastNameMsg) {
            setLastnameError(lastNameMsg);
            valid = false;
        }
        if (emailMsg) {
            setEmailError(emailMsg);
            valid = false;
        }
        if (passwordMsg) {
            setPasswordError(passwordMsg);
            valid = false;
        }

        if (!roleId) {
            setError("Please select a role.");
            valid = false;
        }

        if (!valid) {
            setLoading(false);
            return;
        }

        const userData = {
            first_name: firstName,
            last_name: lastName,
            email,
            password,
            role: roleId,
        };

        try {
            const isSuccess = await RegisterUser(userData);
            if (isSuccess) {
                setRegistrationSuccess(true);
                console.log("success");

            } else {
                setError("Registration failed. Please try again.");
            }
        } catch (err) {
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
                            <div className="text-red-500 text-center font-medium">{error}</div>
                        )}

                        {/* First Name */}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text flex items-center gap-2">
                                    <i className="fa-solid fa-user text-sm"></i> First Name
                                </span>
                            </label>
                            <input
                                type="text"
                                placeholder="First Name"
                                className="input input-bordered w-full focus:outline-none"
                                value={firstName}
                                onChange={(e) => {
                                    setFirstName(e.target.value);
                                    setFirstnameError(validfirstname(e.target.value) || "");
                                }}
                            />
                            {firstnameError && (
                                <span className="text-red-500 text-sm mt-1">{firstnameError}</span>
                            )}
                        </div>

                        {/* Last Name */}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text flex items-center gap-2">
                                    <i className="fa-solid fa-user text-sm"></i> Last Name
                                </span>
                            </label>
                            <input
                                type="text"
                                placeholder="Last Name"
                                className="input input-bordered w-full focus:outline-none"
                                value={lastName}
                                onChange={(e) => {
                                    setLastName(e.target.value);
                                    setLastnameError(validlastname(e.target.value) || "");
                                }}
                            />
                            {lastnameError && (
                                <span className="text-red-500 text-sm mt-1">{lastnameError}</span>
                            )}
                        </div>

                        {/* Email */}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text flex items-center gap-2">
                                    <i className="fa-solid fa-envelope text-sm"></i> Email
                                </span>
                            </label>
                            <input
                                type="email"
                                placeholder="example@gmail.com"
                                className="input input-bordered w-full focus:outline-none"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setEmailError(validregisteremail(e.target.value) || "");
                                }}
                            />
                            {emailError && (
                                <span className="text-red-500 text-sm mt-1">{emailError}</span>
                            )}
                        </div>

                        {/* Role */}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text flex items-center gap-2">
                                    <i className="fa-solid fa-user-shield text-sm"></i> Role
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

                        {/* Password */}
                        <div className="form-control w-full relative">
                            <label className="label">
                                <span className="label-text flex items-center gap-2">
                                    <i className="fa-solid fa-lock text-sm"></i> Password
                                </span>
                            </label>
                            <input
                                type={showPassword ? "password" : "text"}
                                placeholder="Enter your password"
                                className="input input-bordered w-full pr-10 focus:outline-none"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setPasswordError(validregisterpassword(e.target.value) || "");
                                }}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-9 text-gray-500 passwordEyes"
                                onClick={handleShowPassword}
                            >
                                <i
                                    className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"
                                        }`}
                                ></i>
                            </button>
                            {passwordError && (
                                <span className="text-red-500 text-sm mt-1">{passwordError}</span>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="form-control w-full mt-6">
                            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                                {loading ? (
                                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                                ) : (
                                    <>
                                        <i className="fa-solid fa-user-plus mr-2"></i> Register
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Redirect to Login */}
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
