import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import image from "../../assets/auth-hero.png";
import { AuthContext } from "../../context/AuthContext";
import { constants } from "../../global/constants";
import { allRouterLink } from "../../router/AllRouterLinks";
import {
  validloginemail,
  validloginpassword,
} from "../../Validations/Validations";

export const Login = () => {
  const { LoginUser, userRole } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loginTriggered, setLoginTriggered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setFormError("");

    const userData = {
      email: data.email,
      password: data.password,
    };

    try {
      const isSuccess = await LoginUser(userData);
      if (isSuccess) {

        setLoginTriggered(true); 
      } else {
        setFormError("Invalid email or password");
      }
    } catch (err) {
      setFormError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (!loginTriggered || !userRole) return;

  if (userRole === constants.roles.director) {
    navigate(allRouterLink.directorDashboard);
  } else if (userRole === constants.roles.officeStaff) {
    navigate(allRouterLink.officeStaffDashboard);
  } else if (userRole === constants.roles.guardian) {
    navigate(allRouterLink.guardianDashboard);
  } else if (userRole === constants.roles.teacher) {
    navigate(allRouterLink.teacherDashboard);
  }

  // Reset loginTriggered after navigation
  setLoginTriggered(false);
}, [userRole, loginTriggered]);

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
          <form
            className="w-full max-w-md space-y-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

            {formError && (
              <div className="text-red-500 text-center font-medium">
                {formError}
              </div>
            )}

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
                autoComplete="on"
                {...register("email", {
                  validate: (val) => validloginemail(val) || true,
                })}
              />
              {errors.email && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="form-control w-full relative">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-lock text-sm"></i> Password
                </span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="input w-full pr-10 focus:outline-none"
                autoComplete="on"
                {...register("password", {
                  validate: (val) => validloginpassword(val) || true,
                })}
              />
              <button
                type="button"
                className="passwordEyes text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i
                  className={`fa-solid ${
                    showPassword ? "fa-eye" : "fa-eye-slash"
                  }`}
                ></i>
              </button>
              {errors.password && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <div className="form-control w-full mt-6">
              <button type="submit" className="btn btn-primary w-full">
                {loading ? (
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                ) : (
                  <i className="fa-solid fa-right-to-bracket mr-2"></i>
                )}
                {loading ? "" : "Login"}
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="text-center mt-4">
              <Link
                to={`${allRouterLink.forgotPassword}`}
                className="text-sm text-blue-600 hover:underline hover:text-blue-800 font-medium"
              >
                <i className="fa-solid fa-key mr-2"></i>
                Forgot Password
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
