import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { constants } from "../global/constants";
import { allRouterLink } from "../router/AllRouterLinks";

export const Navbar = () => {
  const { LogoutUser, userRole } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);

  const handleLogout = async () => {
    try {
      await LogoutUser();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };


  const getProfileRoute = (role) => {
    switch (role) {
      case `${constants.roles.officeStaff}`:
        return allRouterLink.officeStaffProfile;
      case `${constants.roles.teacher}`:
        return allRouterLink.teacherProfile;
      case `${constants.roles.director}`:
        return allRouterLink.directorProfile;
      case `${constants.roles.student}`:
        return allRouterLink.studentProfile;
      case `${constants.roles.guardian}`:
        return allRouterLink.guardianProfile;
      // Add other cases as needed
      default:
        return allRouterLink.notFound;
    }
  };

  return (
    <>
      <div className="navbar bg-base-100 shadow-sm sticky top-0 z-1 flex flex-wrap md:flex-nowrap py-0">
        {/* Left section - always visible */}
        <div className="flex-1 flex items-center">
          <label
            htmlFor="my-drawer"
            className="btn btn-ghost btn-circle hover:bg-base-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-5 w-5 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </label>
          <span className="nexus-logo text-xl md:text-2xl ml-2">
            <Link to={allRouterLink.homeScreen}>SMS</Link>
          </span>
        </div>

        {/* Search bar - shown on medium+ screens OR when toggled on mobile */}
        <div
          className={`${
            showSearch ? "flex" : "hidden"
          } md:flex order-last md:order-none w-full md:w-auto bg-base-100 px-4 py-2 md:px-0 md:py-0`}
        >
          <input
            type="text"
            placeholder="Search..."
            className="input input-bordered w-full focus:outline-none"
            autoFocus={showSearch}
          />
          <button
            className="btn btn-ghost md:hidden ml-2"
            onClick={() => setShowSearch(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Right section - icons and avatar */}
        <div className="flex-none flex items-center">
          {/* Search icon - visible only on mobile */}
          <button
            className="btn btn-ghost btn-circle md:hidden"
            onClick={() => setShowSearch(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost avatar flex items-center"
            >
              <div className="w-8 md:w-10 rounded-full">
                <img
                  alt="User profile"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
              <span className="hidden md:block ml-2">User</span>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow"
            >
              {/* Search menu item - visible only on mobile */}
              <li className="md:hidden">
                <a onClick={() => setShowSearch(true)}>
                  <i className="fa-solid fa-search"></i> Search
                </a>
              </li>

              <li>
                <Link to={getProfileRoute(userRole)}>
                  <i className="fa-solid fa-user"></i> Profile
                </Link>
              </li>
              <li>
                <a>
                  <i className="fa-solid fa-gear"></i> Settings
                </a>
              </li>
              {userRole == `${constants.roles.director}` && (
                <li>
                  <Link to={`${allRouterLink.registerUser}`}>
                    <i className="fa-solid fa-user-plus"></i> Create User
                  </Link>
                </li>
              )}
              {userRole == `${constants.roles.director}` && (
                <li>
                  <Link to={`${allRouterLink.allTeacherAssignment}`}>
                    <i className="fa-solid fa-book"></i> Teacher Assignments
                  </Link>
                </li>
              )}
              {/* Attendance */}
              {userRole == `${constants.roles.teacher}` && (
                <li>
                  <Link to={`${allRouterLink.attendance}`}>
                    <i className="fa-solid fa-book"></i> Attendance
                  </Link>
                </li>
              )}
              <li onClick={handleLogout}>
                <a className="text-orange-600">
                  <i className="fa-solid fa-arrow-right-from-bracket"></i>{" "}
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
