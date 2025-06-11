import React, { useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { allRouterLink } from "../router/AllRouterLinks";
import { constants } from "../global/constants";
import { AuthContext } from "../context/AuthContext";

export const Sidebar = () => {
  const { isAuthenticated } = useContext(AuthContext);

  const drawerRef = useRef(null);
  const navigate = useNavigate();
  const role = localStorage.getItem("userRole");

  const handleNavigation = (e, path) => {
    e.preventDefault();
    closeDrawer();
    navigate(path);
  };

  const closeDrawer = () => {
    if (drawerRef.current) {
      drawerRef.current.checked = false;
    }
  };

  return (
    <div className="drawer z-5">
      <input
        ref={drawerRef}
        id="my-drawer"
        type="checkbox"
        className="drawer-toggle"
      />
      <div className="drawer-content"></div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-65 p-4">
          {role === `${constants.roles.director}` && isAuthenticated && (
            <li>
              <Link
                onClick={(e) =>
                  handleNavigation(e, allRouterLink.admissionForm)
                }
              >
                <i className="fa-solid fa-file-circle-plus mr-2"></i> Admission
                Form
              </Link>
            </li>
          )}
          {role !== `${constants.roles.student}` && isAuthenticated && (
            <li
              onClick={(e) => handleNavigation(e, allRouterLink.documentUpload)}
            >
              <Link>
                <i className="fa-solid fa-upload mr-2"></i> Upload Documents
              </Link>
            </li>
          )}
          {role === `${constants.roles.director}` && isAuthenticated && (
            <li>
              <Link
                onClick={(e) =>
                  handleNavigation(e, allRouterLink.subjectAssignment)
                }
              >
                <i className="fa-solid fa-book-open-reader mr-2"></i> Assign
                Subjects
              </Link>
            </li>
          )}
          {role === `${constants.roles.teacher}` && isAuthenticated && (
            <li>
              <Link to={`${allRouterLink.attendance}`}>
                <i className="fa-solid fa-book mr-2"></i> Attendance
              </Link>
            </li>
          )}

          {isAuthenticated && (
            <li>
              <Link to={`${allRouterLink.admissionFees}`}>
                <i className="fa-solid fa-money-bill-wave mr-2"></i> Fees Portal
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};
