import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import image from "../../assets/auth-hero.png";
import { AuthContext } from "../../context/AuthContext";
import { constants } from "../../global/constants";

export const ChangePassword = () => {
  const { ChangePassword } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [changePassword, setChangePassword] = useState("");
  const [confirmChangePassword, setConfirmChangePassword] = useState("");
  const [error, setError] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (changePassword !== confirmChangePassword) {
      setError("New password and confirm password do not match");
      return;
    }
    setLoading(true);

    const userData = {
      email,
      current_password: currentPassword,
      change_password: changePassword,
      confirm_password: confirmChangePassword,
    };

    try {
      const response = await ChangePassword(userData);
      if (response.status === 200 || response.status === 201) {
        alert("Password changed successfully!");
        navigate("/");
      } else {
        setError(response.data?.message || "Failed to change password");
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
            <h1 className="text-3xl font-bold text-center mb-6">Change Password</h1>

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

            {/* Current Password */}
            <div className="form-control w-full relative">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-lock text-sm"></i> Current Password
                </span>
              </label>
              <input
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Enter current password"
                className="input w-full pr-10 focus:outline-none"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <button
                type="button"
                className="passwordEyes text-gray-500"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                <i
                  className={`fa-solid ${
                    showCurrentPassword ? "fa-eye-slash" : "fa-eye"
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
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                className="input w-full pr-10 focus:outline-none"
                required
                value={changePassword}
                onChange={(e) => setChangePassword(e.target.value)}
              />
              <button
                type="button"
                className="passwordEyes text-gray-500"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                <i
                  className={`fa-solid ${
                    showNewPassword ? "fa-eye-slash" : "fa-eye"
                  }`}
                ></i>
              </button>
            </div>

            {/* Confirm New Password */}
            <div className="form-control w-full relative">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <i className="fa-solid fa-lock text-sm"></i> Confirm New Password
                </span>
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                className="input w-full pr-10 focus:outline-none"
                required
                value={confirmChangePassword}
                onChange={(e) => setConfirmChangePassword(e.target.value)}
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
                  <i className="fa-solid fa-key mr-2"></i>
                )}
                {loading ? "Processing..." : "Change Password"}
              </button>
            </div>

            {/* Back to Login Link */}
            <div className="text-center mt-4">
              <Link
                to="/login"
                className="text-sm text-blue-600 hover:underline hover:text-blue-800 font-medium"
              >
                <i className="fa-solid fa-arrow-left mr-2"></i>
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};