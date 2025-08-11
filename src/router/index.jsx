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

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login page outside MainLayout */}
        <Route path="/" element={<Login />} />
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