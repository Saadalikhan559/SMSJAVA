import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import image from "../../assets/auth-hero.png";
import { AuthContext } from "../../context/AuthContext";
import { constants } from "../../global/constants";
import { allRouterLink } from "../../router/AllRouterLinks";

export const ResetPassword = () => {
  const { ResetPassword, LogoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const userData = {
      email,
      otp,
      new_password: newPassword,
      confirm_password: confirmPassword,
    };

    try {
      const response = await ResetPassword(userData);

      if (response.status === 200 || response.status === 201) {
        alert("Successfully changed the password");
        await LogoutUser();
        navigate(`${allRouterLink.loginUser}`);
      } else {
        setError("Invalid email or password");
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
              Reset Password
            </h1>

            {/* Error message */}
            {error && (
              <div className="text-red-500 text-center font-medium">
                {error}
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
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* OTP */}
            <div className="form-control w-full relative">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-key text-sm"></i> OTP
                </span>
              </label>
              <input
                type={showOtp ? "text" : "password"}
                inputMode="numeric"
                placeholder="Enter the OTP"
                className="input input-bordered w-full focus:outline-none pr-10"
                required
                value={otp}
                maxLength={6}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              />
              <button
                type="button"
                className="passwordEyes text-gray-500"
                onClick={() => setShowOtp(!showOtp)}
              >
                <i
                  className={`fa-solid ${
                    showOtp ? "fa-eye-slash" : "fa-eye"
                  }`}
                ></i>
              </button>
            </div>

            {/* New Password */}
            <div className="form-control w-full relative">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-lock text-sm"></i> New Password
                </span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                className="input w-full pr-10 focus:outline-none"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className="passwordEyes text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i
                  className={`fa-solid ${
                    showPassword ? "fa-eye-slash" : "fa-eye"
                  }`}
                ></i>
              </button>
            </div>

            {/* Confirm Password */}
            <div className="form-control w-full relative">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-lock text-sm"></i> Confirm Password
                </span>
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                className="input w-full pr-10 focus:outline-none"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="passwordEyes text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <i
                  className={`fa-solid ${
                    showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                  }`}
                ></i>
              </button>
            </div>

            {/* Submit Button */}
            <div className="form-control w-full mt-6">
              <button type="submit" className="btn btn-primary w-full">
                {loading ? (
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                ) : (
                  <i className="fa-solid fa-right-to-bracket mr-2"></i>
                )}
                {loading ? "Processing..." : "Reset Password"}
              </button>
            </div>

            {/* Change Password Link */}
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