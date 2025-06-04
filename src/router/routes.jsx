import { AdmissionFees } from "../components/AdmissionProcess/AdmissionFees";
import { AdmissionForm } from "../components/AdmissionProcess/AdmissionForm";
import DirectorProfile from "../components/DirectorDashboard/DirectorProfile";
import GuardianProfile from "../components/GuardianDashboard/GuardianProfile";
import { NotFound } from "../components/NotFound";
import OfficestaffProfile from "../components/OfficestaffDashboard/OfficestaffProfile";
import StudentProfile from "../components/Student Dashboard/StudentProfile";
import { Attendance } from "../components/Teacher/Attendance";
import TeacherProfile from "../components/TeacherDashboard/TeacherProfile";
import { Unauthorized } from "../components/Unauthorized";
import { constants } from "../global/constants";
import { AllTeacherAssignments } from "../screens/Assignments/AllTeacherAssignments";
import { SubjectAssignments } from "../screens/Assignments/SubjectAssignments";
import { ChangePassword } from "../screens/Auth/ChangePassword";
import { ForgotPassword } from "../screens/Auth/ForgotPassword";
import { Login } from "../screens/Auth/Login";
import { Register } from "../screens/Auth/Register";
import { ResetPassword } from "../screens/Auth/ResetPassword";
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
    path: allRouterLink.changePassword,
    element: <ChangePassword />,
    protected: true,
  },
  {
    path: allRouterLink.forgotPassword,
    element: <ForgotPassword />,
    protected: false,
  },
  {
    path: allRouterLink.resetPassword,
    element: <ResetPassword />,
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
  // PROFILES
  {
    path: allRouterLink.directorProfile,
    element: <DirectorProfile />,
    protected: true,
    allowedRoles: [constants.roles.director]
  },
  {
    path: allRouterLink.officeStaffProfile,
    element: <OfficestaffProfile />,
    protected: true,
    allowedRoles: [constants.roles.officeStaff]
  },
  {
    path: allRouterLink.teacherProfile,
    element: <TeacherProfile />,
    protected: true,
    allowedRoles: [constants.roles.teacher]
  },
  {
    path: allRouterLink.guardianProfile,
    element: <GuardianProfile />,
    protected: true,
    allowedRoles: [constants.roles.guardian]
  },
  {
    path: allRouterLink.studentProfile,
    element: <StudentProfile />,
    protected: true,
    allowedRoles: [constants.roles.student]
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
