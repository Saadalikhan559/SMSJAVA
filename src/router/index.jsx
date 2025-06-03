import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { routes } from "./routes";
import { PrivateRoute } from "../protectedRoutes/PrivateRoute";
import { NotFound } from "../components/NotFound";
import StudentProfile from "../components/Student Dashboard/StudentProfile";
import TeacherProfile from "../components/TeacherDashboard/TeacherProfile";
import Guardian from "../components/GuardianDashboard/Guardian";
import OfficestaffProfile from "../components/OfficestaffDashboard/OfficestaffProfile";
import DirectorProfile from "../components/DirectorDashboard/DirectorProfile";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                route.protected ? (
                  <PrivateRoute>{route.element}</PrivateRoute>
                ) : (
                  route.element
                )
              }
            />
          ))}
          <Route path="*" element={<NotFound />} />
          <Route path="StudentProfile" element={<StudentProfile/>}/>
          <Route path="TeacherProfile" element={<TeacherProfile/>}/> 
          <Route path="GuardianProfile" element={<Guardian/>}/> 
          <Route path="OfficeStaffProfile" element={<OfficestaffProfile/>}/> 
          <Route path="DirectorProfile" element={<DirectorProfile/>}/> 
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
