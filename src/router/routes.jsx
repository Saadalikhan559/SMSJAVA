import { AdmissionFees } from "../components/AdmissionProcess/AdmissionFees";
import { AdmissionForm } from "../components/AdmissionProcess/AdmissionForm";
import { NotFound } from "../components/NotFound";
import { Attendance } from "../components/Teacher/Attendance";
import { Unauthorized } from "../components/Unauthorized";
import { constants } from "../global/constants";
import { AllTeacherAssignments } from "../screens/Assignments/AllTeacherAssignments";
import { SubjectAssignments } from "../screens/Assignments/SubjectAssignments";
import { Login } from "../screens/Auth/Login";
import { Register } from "../screens/Auth/Register";
import { DocumentUpload } from "../screens/DocumentUpload";
import { HomeScreen } from "../screens/HomeScreen";
import { allRouterLink } from "./AllRouterLinks";

export const routes = [
  {
    path: allRouterLink.homeScreen,
    element: <HomeScreen />,
    protected: false,
  },
  {
    path: allRouterLink.registerUser,
    element: <Register />,
    protected: true,
    allowedRoles: [constants.roles.director],
  },
  {
    path: allRouterLink.loginUser,
    element: <Login />,
    protected: false,
  },
  {
    path: allRouterLink.admissionForm,
    element: <AdmissionForm />,
    protected: true,
    allowedRoles: [constants.roles.director, constants.roles.officeStaff]
  },
  {
    path: allRouterLink.admissionFees,
    element: <AdmissionFees />,
    protected: true,
    allowedRoles: [constants.roles.director, constants.roles.officeStaff]
  },
  {
    path: allRouterLink.documentUpload,
    element: <DocumentUpload />,
    protected: true,
    allowedRoles: [constants.roles.director, constants.roles.officeStaff, constants.roles.teacher]
  },
  {
    path: allRouterLink.subjectAssignment,
    element: <SubjectAssignments />,
    protected: true,
    allowedRoles: [constants.roles.director]
  },
  {
    path: allRouterLink.allTeacherAssignment,
    element: <AllTeacherAssignments />,
    protected: true,
    allowedRoles: [constants.roles.director]
  },
  {
    path: allRouterLink.attendance,
    element: <Attendance />,
    protected: true,
    allowedRoles: [constants.roles.teacher]
  },
  {
    path: allRouterLink.unAuthorized,
    element: <Unauthorized />,
    protected: false,
  },
  {
    path: allRouterLink.notFound,
    element: <NotFound />,
    protected: false,
  },
];
