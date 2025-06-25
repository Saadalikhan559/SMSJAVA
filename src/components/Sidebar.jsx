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
    <div className="drawer z-50">
      <input
        ref={drawerRef}
        id="my-drawer"
        type="checkbox"
        className="drawer-toggle"
      />
      <div className="drawer-content"></div>

      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>

        <div className="min-h-full w-72 bg-white shadow-lg p-4 border-r">
          <nav className="space-y-6">
            {/* Dashboard / Home */}
            {isAuthenticated && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                  Home
                </h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      onClick={(e) => {
                        e.preventDefault();
                        let dashboardPath = "/";
                        if (role === constants.roles.director) {
                          dashboardPath = allRouterLink.directorDashboard;
                        } else if (role === constants.roles.officeStaff) {
                          dashboardPath = allRouterLink.officeStaffDashboard;
                        } else if (
                          role === constants.roles.guardian ||
                          role === constants.roles.student
                        ) {
                          dashboardPath = allRouterLink.guardianDashboard;
                        } else if (role === constants.roles.teacher) {
                          dashboardPath = allRouterLink.teacherDashboard;
                        }
                        handleNavigation(e, dashboardPath);
                      }}
                      className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-100 transition text-gray-800"
                    >
                      <i className="fa-solid fa-house w-5"></i> Dashboard
                    </Link>
                  </li>
                  <div>
               
                <ul className="space-y-1">
                  <li>
                    <Link
                      onClick={(e) =>
                        handleNavigation(e, allRouterLink.allClasses)
                      }
                      className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-100 transition text-gray-800"
                    >
                      <i className="fa-solid fa-graduation-cap"></i>{" "}
                      All Classes
                    </Link>
                  </li>
                </ul>
              </div>
                </ul>
              </div>
            )}

            {/* Admissions */}
            {(role === constants.roles.director ||
              role === constants.roles.officeStaff) &&
              isAuthenticated && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                    Admissions
                  </h3>
                  <ul className="space-y-1">
                    <li>
                      <Link
                        onClick={(e) =>
                          handleNavigation(e, allRouterLink.admissionForm)
                        }
                        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-100 transition text-gray-800"
                      >
                        <i className="fa-solid fa-user-graduate w-5"></i>{" "}
                        Admission Form
                      </Link>
                    </li>
                    <li>
                      <Link
                        onClick={(e) =>
                          handleNavigation(e, allRouterLink.addmissionDetails)
                        }
                        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-100 transition text-gray-800"
                      >
                        <i className="fa-solid fa-clipboard-list w-5"></i>{" "}
                        Admission Details
                      </Link>
                    </li>
                  </ul>
                </div>
              )}

            {/* Documents */}
            {role !== constants.roles.student && isAuthenticated && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                  Documents
                </h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      onClick={(e) =>
                        handleNavigation(e, allRouterLink.documentUpload)
                      }
                      className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-100 transition text-gray-800"
                    >
                      <i className="fa-solid fa-file-arrow-up w-5"></i> Upload
                      Documents
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={(e) =>
                        handleNavigation(e, allRouterLink.viewDocuments)
                      }
                      className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-100 transition text-gray-800"
                    >
                      <i className="fa-solid fa-file-circle-check w-5"></i> View
                      Documents
                    </Link>
                  </li>
                </ul>
              </div>
            )}

            {/* Management */}
            {role === constants.roles.director && isAuthenticated && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                  Management
                </h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      onClick={(e) =>
                        handleNavigation(e, allRouterLink.subjectAssignment)
                      }
                      className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-100 transition text-gray-800"
                    >
                      <i className="fa-solid fa-tasks w-5"></i> Assign Subjects
                    </Link>
                  </li>
                </ul>
              </div>
            )}

            {/* Teaching */}
            {role === constants.roles.teacher && isAuthenticated && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                  Teaching
                </h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      onClick={(e) =>
                        handleNavigation(e, allRouterLink.attendance)
                      }
                      className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-100 transition text-gray-800"
                    >
                      <i className="fa-solid fa-clipboard-user w-5"></i>{" "}
                      Attendance
                    </Link>
                  </li>
                </ul>
              </div>
            )}

            {/* Fees */}
            {isAuthenticated && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                  Fees
                </h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      onClick={(e) =>
                        handleNavigation(e, allRouterLink.admissionFees)
                      }
                      className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-100 transition text-gray-800"
                    >
                      <i className="fa-solid fa-money-bill-wave w-5"></i> Fee
                      Submission
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={(e) =>
                        handleNavigation(e, allRouterLink.feeSummary)
                      }
                      className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-100 transition text-gray-800"
                    >
                      <i className="fa-solid fa-envelope w-5"></i> Fee Record
                    </Link>
                  </li>
                </ul>
              </div>
            )}


            {/* Reports */}
            {isAuthenticated && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                  Reports
                </h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      onClick={(e) =>
                        handleNavigation(e, allRouterLink.attendanceRecord)
                      }
                      className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-100 transition text-gray-800"
                    >
                      <i className="fa-solid fa-square-poll-vertical w-5"></i>{" "}
                      Attendance Record
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};
