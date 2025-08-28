  import { useRef, useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { constants } from "../global/constants";
import { allRouterLink } from "../router/AllRouterLinks";
import LogoutModal from "../components/Modals/LogoutModal";

export const Navbar = () => {
  const { LogoutUser, userRole, isAuthenticated, userName, userProfile } =
    useContext(AuthContext);
  const navigate = useNavigate();

  const [profileImageError, setProfileImageError] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const logoutDialogRef = useRef(null);

  const defaultProfileImage =
    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";

  const handleImageError = () => {
    setProfileImageError(true);
  };

  const handleLogout = async () => {
    try {
      await LogoutUser();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setShowLogoutModal(false);
    }
  };

  const handleModalClose = () => {
    setShowLogoutModal(false);
  };

  useEffect(() => {
    if (showLogoutModal && logoutDialogRef.current) {
      logoutDialogRef.current.showModal();
    }
  }, [showLogoutModal]);

  const getProfileRoute = (role) => {
    switch (role) {
      case constants.roles.officeStaff:
        return allRouterLink.officeStaffProfile;
      case constants.roles.teacher:
        return allRouterLink.teacherProfile;
      case constants.roles.director:
        return allRouterLink.directorProfile;
      case constants.roles.student:
        return allRouterLink.studentProfile;
      case constants.roles.guardian:
        return allRouterLink.guardianProfile;
      default:
        return allRouterLink.notFound;
    }
  };

  return (
    <>
      <div className="navbar bg-base-100 shadow-sm sticky top-0 z-5 flex flex-wrap md:flex-nowrap py-0">
        <div className="flex-1 flex items-center">
          {isAuthenticated && (
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
          )}
          <span className="nexus-logo text-xl md:text-2xl ml-2">SMS</span>
        </div>

        <div className="flex-none flex items-center">
          {isAuthenticated ? (
            <>
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost avatar flex items-center"
                >
                  <div className="w-8 md:w-10 rounded-full">
                    <img
                      alt="User profile"
                      src={
                        profileImageError || !userProfile
                          ? defaultProfileImage
                          : userProfile
                      }
                      onError={handleImageError}
                    />
                  </div>
                  <span className="hidden md:block ml-2">{userName}</span>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow"
                >
                  <li>
                    <Link to={getProfileRoute(userRole)}>
                      <i className="fa-solid fa-user"></i> Profile
                    </Link>
                  </li>
                  <li>
                    <Link to={allRouterLink.changePassword}>
                      <i className="fa-solid fa-lock"></i> Change Password
                    </Link>
                  </li>

                  
                  <li>
                    <Link to={allRouterLink.viewDocuments || "/view-documents"}>
                      <i className="fa-solid fa-folder-open"></i> View Documents
                    </Link>
                  </li>

                  {userRole === constants.roles.director && (
                    <>
                      <li>
                        <Link to={allRouterLink.registerUser}>
                          <i className="fa-solid fa-user-plus"></i> Create User
                        </Link>
                      </li>
                      <li>
                        <Link to={allRouterLink.allTeacherAssignment}>
                          <i className="fa-solid fa-book"></i> Teacher
                          Assignments
                        </Link>
                      </li>
                    </>
                  )}

                  {userRole === constants.roles.teacher && (
                    <li>
                      <Link to={allRouterLink.attendance}>
                        <i className="fa-solid fa-book"></i> Attendance
                      </Link>
                    </li>
                  )}
                  <li onClick={() => setShowLogoutModal(true)}>
                    <a className="text-orange-600 cursor-pointer">
                      <i className="fa-solid fa-arrow-right-from-bracket"></i>{" "}
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="btn btn-primary btn-sm md:btn-md text-white normal-case"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Logout Modal */}
      <LogoutModal
        show={showLogoutModal}
        onConfirm={handleLogout}
        onClose={handleModalClose}
      />
    </>
  );
};
