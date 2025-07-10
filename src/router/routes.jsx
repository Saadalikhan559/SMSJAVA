import { AdmissionDetails } from "../components/AdmissionProcess/AdmissionDetails";
import { AdmissionFees } from "../components/AdmissionProcess/AdmissionFees";
import { AdmissionForm } from "../components/AdmissionProcess/AdmissionForm";
import { EditAddmissionDetails } from "../components/AdmissionProcess/Admissions/EditAddmissionDetails";
import { SingleAdmissionDetails } from "../components/AdmissionProcess/Admissions/SingleAdmissionDetails";
import FeeSummaryTable from "../components/AdmissionProcess/FeeSummaryTable";
import { ClassStudent } from "../components/ClassStudents/ClassStudent";
import { DirectorDashboard } from "../components/DirectorDashboard/DirectorDashboard";
import DirectorProfile from "../components/DirectorDashboard/DirectorProfile";
import GuardianAttendanceRecord from "../components/GuardianDashboard/GuardianAttendanceRecord";
import StudentAttendance from "../components/GuardianDashboard/StudentAttendance";
import { GuardianDashboard } from "../components/GuardianDashboard/GuardianDashboard";
import GuardianProfile from "../components/GuardianDashboard/GuardianProfile";
import { NotFound } from "../components/NotFound";
import { OfficeStaffDashboard } from "../components/OfficestaffDashboard/OfficeStaffDashboard";
import OfficestaffProfile from "../components/OfficestaffDashboard/OfficestaffProfile";
import StudentProfile from "../components/Student Dashboard/StudentProfile";
import { Attendance } from "../components/Teacher/Attendance";
import AttendanceRecord from "../components/Teacher/AttendanceRecord";
import FullAttendance from "../components/Teacher/FullAttendance";
import { TeacherDashboard } from "../components/TeacherDashboard/TeacherDashboard";
import TeacherProfile from "../components/TeacherDashboard/TeacherProfile";
import { Unauthorized } from "../components/Unauthorized";
import { ViewDocuments } from "../components/UploadDocs/ViewDocuments";
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
import Allclasses from "../components/Classesdata/Allclasses";
import Allstudentsperclass from "../components/Classesdata/Allstudentsperclass";
import StudentDetails from "../components/Classesdata/StudentDetails";
import UpdateStudentDetail from "../components/Classesdata/UpdateStudentDetail";
import FeeDashboard from "../components/AdmissionProcess/FeeDashboard";
import AllStaff from "../components/StaffData/AllStaff";
import Staffdetail from "../components/StaffData/Staffdetail";
import DirectorMarkHolidays from "../components/DirectorDashboard/DirectorMarkHolidays";
import UpdateStaffdetails from "../components/StaffData/UpdateStaffdetails";
import { StudentDashboard } from "../components/Student Dashboard/StudentDashboard";
import { StudentFeeCard } from "../components/AdmissionProcess/StudentFeeCard";
import MyAttendance from "../components/Student Dashboard/MyAttendance";

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
    allowedRoles: [constants.roles.director, constants.roles.officeStaff],
  },
  {
    path: allRouterLink.addmissionDetails,
    element: <AdmissionDetails />,
    protected: true,
    allowedRoles: [constants.roles.director, constants.roles.officeStaff],
  },
  {
    path: allRouterLink.addmissionDetailsById,
    element: <SingleAdmissionDetails />,
    protected: true,
    allowedRoles: [constants.roles.director, constants.roles.officeStaff],
  },
  {
    path: allRouterLink.editAddmisionDetails,
    element: <EditAddmissionDetails />,
    protected: true,
    allowedRoles: [constants.roles.director, constants.roles.officeStaff],
  },
  {
    path: allRouterLink.admissionFees,
    element: <AdmissionFees />,
    protected: true,
    allowedRoles: [
      constants.roles.director,
      constants.roles.officeStaff,
      constants.roles.student,
      constants.roles.teacher,
      constants.roles.guardian,
    ],
  },
  {
    path: allRouterLink.studentFeeCard,
    element: <StudentFeeCard />,
    protected: true,
    allowedRoles: [
      // constants.roles.director,
      // constants.roles.officeStaff,
      constants.roles.student,
      // constants.roles.teacher,
      constants.roles.guardian,
    ],
  },
  {
    path: allRouterLink.documentUpload,
    element: <DocumentUpload />,
    protected: true,
    allowedRoles: [
      constants.roles.director,
      constants.roles.officeStaff,
      constants.roles.teacher,
    ],
  },
  {
    path: allRouterLink.viewDocuments,
    element: <ViewDocuments />,
    protected: true,
    allowedRoles: [
      constants.roles.director,
      constants.roles.officeStaff,
      constants.roles.teacher,
    ],
  },
  {
    path: allRouterLink.subjectAssignment,
    element: <SubjectAssignments />,
    protected: true,
    allowedRoles: [constants.roles.director],
  },
  {
    path: allRouterLink.allTeacherAssignment,
    element: <AllTeacherAssignments />,
    protected: true,
    allowedRoles: [constants.roles.director],
  },
  {
    path: allRouterLink.attendance,
    element: <Attendance />,
    protected: true,
    allowedRoles: [constants.roles.teacher],
  },
  {
    path: allRouterLink.classStudents,
    element: <ClassStudent />,
    protected: true,
    allowedRoles: [constants.roles.teacher],
  },
  // PROFILES
  {
    path: allRouterLink.directorProfile,
    element: <DirectorProfile />,
    protected: true,
    allowedRoles: [constants.roles.director],
  },
  {
    path: allRouterLink.directorMarkHolidays,
    element: <DirectorMarkHolidays />,
    protected: true,
    allowedRoles: [constants.roles.director],
  },
  {
    path: allRouterLink.officeStaffProfile,
    element: <OfficestaffProfile />,
    protected: true,
    allowedRoles: [constants.roles.officeStaff],
  },
  {
    path: allRouterLink.teacherProfile,
    element: <TeacherProfile />,
    protected: true,
    allowedRoles: [constants.roles.teacher],
  },
  {
    path: allRouterLink.guardianProfile,
    element: <GuardianProfile />,
    protected: true,
    allowedRoles: [constants.roles.guardian],
  },
  {
    path: allRouterLink.guardianAttendanceRecord,
    element: <GuardianAttendanceRecord />,
    protected: true,
    allowedRoles: [constants.roles.guardian],
  },
  {
    path: allRouterLink.studentAttendance,
    element: <StudentAttendance />,
    protected: true,
    allowedRoles: [constants.roles.guardian],
  },
  {
    path: allRouterLink.studentProfile,
    element: <StudentProfile />,
    protected: true,
    allowedRoles: [constants.roles.student],
  },
  // DASHBOARD
  {
    path: allRouterLink.teacherDashboard,
    element: <TeacherDashboard />,
    protected: true,
    allowedRoles: [constants.roles.teacher],
  },
  {
    path: allRouterLink.guardianDashboard,
    element: <GuardianDashboard />,
    protected: true,
    allowedRoles: [constants.roles.guardian],
  },
  {
    path: allRouterLink.studentDashboard,
    element: <StudentDashboard />,
    protected: true,
    allowedRoles: [constants.roles.student],
  },
  {
    path: allRouterLink.officeStaffDashboard,
    element: <OfficeStaffDashboard />,
    protected: true,
    allowedRoles: [constants.roles.officeStaff],
  },
  {
    path: allRouterLink.directorDashboard,
    element: <DirectorDashboard />,
    protected: true,
    allowedRoles: [constants.roles.director],
  },
  // Attendance Record

  {
    path: allRouterLink.attendanceRecord,
    element: <AttendanceRecord />,
    protected: false,
  },
  {
    path: allRouterLink.feeSummary,
    element: <FeeSummaryTable />,
    protected: true,
    allowedRoles: [constants.roles.director, constants.roles.officeStaff],
  },
  {
    path: allRouterLink.feeDashboard,
    element: <FeeDashboard />,
    protected: true,
    allowedRoles: [constants.roles.director, constants.roles.officeStaff],
  },
  {
    path: allRouterLink.fullAttendance,
    element: <FullAttendance />,
    protected: false,
  },
  {
    path: allRouterLink.allClasses,
    element: <Allclasses />,
    protected: false,
  },
  {
    path: allRouterLink.allStudentsperClass,
    element: <Allstudentsperclass />,
    protected: false,
  },
  {
    path: allRouterLink.studentDetails,
    element: <StudentDetails />,
    protected: false,
  },
  {
    path: allRouterLink.updateStudentdetail,
    element: <UpdateStudentDetail />,
    protected: false,
  },
  {
    path: allRouterLink.allStaffMembers,
    element: <AllStaff />,
    protected: false,
  },
  {
    path: allRouterLink.staffDetail,
    element: <Staffdetail />,
    protected: false,
  },
  {
    path: allRouterLink.updateStaffDetails,
    element: <UpdateStaffdetails />,
    protected: false,
  },
  {
    path: allRouterLink.myAttendance,
    element: <MyAttendance />,
    protected: true,
    allowedRoles: [constants.roles.student],
  },

  // include all routes before this please

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
