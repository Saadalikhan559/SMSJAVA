import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import image from "../../assets/auth-hero.png";
import { AuthContext } from "../../context/AuthContext";
import { constants } from "../../global/constants";



export const Login = () => {
  const { LoginUser, userRole, isAuthenticated} = useContext(AuthContext);
  const navigate = useNavigate(); 
  

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(true);

  const handleShowPassword = ()=>{
    setShowPassword(!showPassword);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

  // console.log('authenticity', isAuthenticated);

    const userData = {
      email,
      password,
    };

    try {
      const isSuccess = await LoginUser(userData); 
      if (isSuccess) {
        navigate("/"); 
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
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
          <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

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

          {/* Password */}
          <div className="form-control w-full relative">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <i className="fa-solid fa-lock text-sm"></i> Password
              </span>
            </label>
            <input
              type={`${showPassword===true?"password":"text"}`}
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
              <i className={`fa-solid  ${showPassword===true?"fa-eye-slash":"fa-eye"}`}></i>
            </button>
          </div>

          {/* Submit Button */}
          <div className="form-control w-full mt-6">
            <button type="submit" className="btn btn-primary w-full">
              <i className="fa-solid fa-right-to-bracket mr-2"></i>
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};