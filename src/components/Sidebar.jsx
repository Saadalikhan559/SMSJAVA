import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { allRouterLink } from "../router/AllRouterLinks";

export const Sidebar = () => {
  const drawerRef = useRef(null);

  const closeDrawer = (e) => {
    e.preventDefault(); // Prevent the default label behavior
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
          onClick={closeDrawer}
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-75 p-4">
          <li>
            <Link to={allRouterLink.admissionForm} onClick={closeDrawer}>
              Admission Form
            </Link>
          </li>
          <li>
            <a onClick={closeDrawer}>Sidebar Item 2</a>
          </li>
        </ul>
      </div>
    </div>
  );
};