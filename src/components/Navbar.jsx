import React from "react";

export const Navbar = () => {
  return (
    <>
      <div className="navbar bg-base-100 shadow-sm">
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
          <span className="nexus-logo text-2xl">SMS</span>
        </div>
        <div className="flex-none">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-48 md:w-auto ml-2"
          />
          <button className="btn btn-ghost btn-circle">
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />{" "}
              </svg>
              {/* <span className="badge badge-xs badge-primary indicator-item"></span> */}
            </div>
          </button>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
              <span className="hidden md:block">User</span>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <a>
                  {" "}
                  <i className="fa-solid fa-user"></i> Profile
                </a>
              </li>
              <li>
                <a>
                  {" "}
                  <i className="fa-solid fa-gear"></i> Settings
                </a>
              </li>
              <li>
                <a className="text-orange-600">
                  {" "}
                  <i className="fa-solid fa-arrow-right-from-bracket"></i>Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
