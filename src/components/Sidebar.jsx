import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { allRouterLink } from "../router/AllRouterLinks";

export const Sidebar = () => {
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
        <ul className="menu bg-base-200 text-base-content min-h-full w-75 p-4">
          {role === "director" && (
            <li>
              <Link
                onClick={(e) =>
                  handleNavigation(e, allRouterLink.admissionForm)
                }
              >
                Admission Form
              </Link>
            </li>
          )}
          {role !== "student" && (
            <li
              onClick={(e) => handleNavigation(e, allRouterLink.documentUpload)}
            >
              <Link>Upload Documents</Link>
            </li>
          )}

          {role === "director" && (
            <li>
              <Link
                onClick={(e) =>
                  handleNavigation(e, allRouterLink.subjectAssignment)
                }
              >
                Assign Subjects
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};
