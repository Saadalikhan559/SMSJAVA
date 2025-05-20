import { AdmissionForm } from "../components/AdmissionProcess/AdmissionForm";
import { NotFound } from "../components/NotFound";
import { Unauthorized } from "../components/Unauthorized";
import { constants } from "../global/constants";
import { Login } from "../screens/Auth/Login";
import { Register } from "../screens/Auth/Register";
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
