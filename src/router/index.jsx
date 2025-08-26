// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { MainLayout } from "../layouts/MainLayout";
// import { routes } from "./routes";
// import { ProtectedRoute } from "../protectedRoutes/Protected";
// import { NotFound } from "../components/NotFound";
// import { allRouterLink } from "./AllRouterLinks";

// export default function AppRouter() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route element={<MainLayout />}>
//           {routes.map((route) => (
//             <Route
//               key={route.path}
//               path={route.path}
//               element={
//                 route.protected ? (
//                   <ProtectedRoute allowedRoles={route.allowedRoles}>
//                     {route.element}
//                   </ProtectedRoute>
//                 ) : (
//                   route.element
//                 )
//               }
//             />
//           ))}
//         </Route>
//         <Route path={allRouterLink.notFound} element={<NotFound />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }


import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { routes } from "./routes";
import { ProtectedRoute } from "../protectedRoutes/Protected";
import { NotFound } from "../components/NotFound";
import { allRouterLink } from "./AllRouterLinks";
import { Login } from "../screens/Auth/Login";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { StudentDashboard } from "../components/Student Dashboard/StudentDashboard";
import { DirectorDashboard } from "../components/DirectorDashboard/DirectorDashboard";
import { OfficeStaffDashboard } from "../components/OfficestaffDashboard/OfficeStaffDashboard";
import { GuardianDashboard } from "../components/GuardianDashboard/GuardianDashboard";
import { TeacherDashboard } from "../components/TeacherDashboard/TeacherDashboard";

export default function AppRouter() {
  const { isAuthenticated, userRole } = useContext(AuthContext);
  
  const rolesPath ={
   element: userRole == "student" && <StudentDashboard /> ,
   element: userRole == "director" && <DirectorDashboard /> ,
   element: userRole == "office staff" && <OfficeStaffDashboard /> ,
   element: userRole == "guardian" && <GuardianDashboard /> ,
   element: userRole == "teacher" && <TeacherDashboard /> 
  }
    
  
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Login page outside MainLayout */}
      { !isAuthenticated ?   <Route path="/" element={<Login />} /> :
      <Route element={<MainLayout />}>
      <Route path="/" element={rolesPath.element} />
      </Route>
      
      }
        <Route path="/login" element={<Login />} />
        
        {/* All authenticated routes */}
        <Route element={<MainLayout />}>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                route.protected ? (
                  <ProtectedRoute allowedRoles={route.allowedRoles}>
                    {route.element}
                  </ProtectedRoute>
                ) : (
                  route.element
                )
              }
            />
          ))}
        </Route>
        <Route path={allRouterLink.notFound} element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}