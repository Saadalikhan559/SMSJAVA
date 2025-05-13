import { AdmissionForm } from "../components/AdmissionProcess/AdmissionForm";
import { NotFound } from "../components/NotFound";
import { Login } from "../screens/Auth/Login";
import { Register } from "../screens/Auth/Register";
import { HomeScreen } from "../screens/HomeScreen";
import { allRouterLink } from "./AllRouterLinks";

export const routes = [
  {
    path: allRouterLink.homeScreen,
    element: <HomeScreen />,
  },
  {
    path: allRouterLink.registerUser,
    element: <Register />,
  },
  {
    path: allRouterLink.loginUser,
    element: <Login />,
  },
  {
    path: allRouterLink.admissionForm,
    element: <AdmissionForm />,
  },
  {
    path: "*",
    element: <NotFound />,
  }
];
