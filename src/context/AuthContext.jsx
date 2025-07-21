import React, { createContext, useState, useEffect, useMemo } from "react";
import axios from "axios";
import { constants } from "../global/constants";

const BASE_URL = constants.baseUrl;

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userID, setUSerID] = useState(
    () => localStorage.getItem("user_id") || ""
  );
  const [teacherID, setTeacherID] = useState(
    () => localStorage.getItem("teacher_id") || ""
  );
  const [guardianID, setGuardianID] = useState(
    () => localStorage.getItem("guardian_id") || ""
  );
  const [userName, setUserName] = useState(
    () => localStorage.getItem("user_name") || ""
  );
  const [userProfile, setUserProfile] = useState(
    () => localStorage.getItem("user_profile") || ""
  );
  const [authTokens, setAuthTokens] = useState(
    () => JSON.parse(localStorage.getItem("authTokens")) || null
  );
  const [userRole, setUserRole] = useState(
    () => localStorage.getItem("userRole") || ""
  );
  const [studentID, setStudentID] = useState(
    () => localStorage.getItem("student_id") || ""
  );
  const [yearLevelID, setYearLevelID] = useState(
    () => localStorage.getItem("year_level_id") || "");



  const [loading, setLoading] = useState(true);

  // Function to normalize profile URL by replacing localhost with BASE_URL
  const normalizeProfileUrl = (url) => {
    if (!url) return "";

    // Replace localhost URL with BASE_URL if found
    if (url.includes(`http://localhost:${constants.PORT}`)) {
      return url.replace(`http://localhost:${constants.PORT}`, BASE_URL);
    }

    // Handle case where URL might be just a path
    if (!url.startsWith("http") && !url.startsWith("/")) {
      return `${BASE_URL}/${url}`;
    }

    // Handle case where URL is a path starting with slash
    if (!url.startsWith("http") && url.startsWith("/")) {
      return `${BASE_URL}${url}`;
    }

    return url;
  };

  const axiosInstance = useMemo(() => {
    const instance = axios.create({ baseURL: BASE_URL });

    instance.interceptors.request.use((config) => {
      if (authTokens?.access) {
        config.headers.Authorization = `Bearer ${authTokens.access}`;
      }
      return config;
    });

    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          authTokens?.refresh
        ) {
          originalRequest._retry = true;
          try {
            const response = await axios.post(
              `${BASE_URL}/auth/refresh/`,
              {
                refresh: authTokens.refresh,
              }
            );
            const newTokens = {
              ...authTokens,
              access: response.data.access,
            };
            setAuthTokens(newTokens);
            localStorage.setItem("authTokens", JSON.stringify(newTokens));
            originalRequest.headers.Authorization = `Bearer ${newTokens.access}`;
            return instance(originalRequest);
          } catch (refreshError) {
            await LogoutUser();
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
    return instance;
  }, [authTokens]);

  const RegisterUser = async (userDetails) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/users/`,
        userDetails,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access}`,
          },
        }
      );
      if (userRole === constants.roles.director) {
        return response.data;
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const LoginUser = async (userDetails) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login/`, userDetails);
      const data = response.data;

      if (!data["Access Token"] || !data["Refresh Token"] || !data.Roles) {
        throw new Error("Invalid login response structure");
      }

      const tokens = {
        access: data["Access Token"],
        refresh: data["Refresh Token"],
      };

      setAuthTokens(tokens);
      localStorage.setItem("authTokens", JSON.stringify(tokens));

      const role = data.Roles[0];
      setUserRole(role);
      localStorage.setItem("userRole", role);

      // Set user ID from response
      if (data["User ID"]) {
        localStorage.setItem("user_id", data["User ID"]);
        setUSerID(data["User ID"]);
      }

      if (data.teacher_id) {
        localStorage.setItem("teacher_id", data.teacher_id);
        setTeacherID(data.teacher_id);
      }

      if (data.guardian_id) {
        localStorage.setItem("guardian_id", data.guardian_id);
        setGuardianID(data.guardian_id);
        localStorage.setItem("student_id", data.student_id)
        setStudentID(data.student_id)
      }

      if (data.student_id) {
        localStorage.setItem("student_id", data.student_id);
        setStudentID(data.student_id);
      }

      if (data.students && Array.isArray(data.students)) {
        localStorage.setItem("guardian_students", JSON.stringify(data.students));
      }
      if (data.year_level_id) {
        localStorage.setItem("year_level_id", data.year_level_id);
        setYearLevelID(data.year_level_id);
      }


      if (data.name) {
        localStorage.setItem("user_name", data.name);
        setUserName(data.name);
      }

      if (data.user_profile) {
        const normalizedProfile = normalizeProfileUrl(data.user_profile);
        localStorage.setItem("user_profile", normalizedProfile);
        setUserProfile(normalizedProfile);
      }

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };
  const LogoutUser = async () => {
    setAuthTokens(null);
    setUserRole("");
    setUSerID("");
    setTeacherID("");
    setGuardianID("");
    setUserName("");
    setUserProfile("");
    setStudentID("");
    setYearLevelID("");
    localStorage.removeItem("authTokens");
    localStorage.removeItem("userRole");
    localStorage.removeItem("user_id");
    localStorage.removeItem("teacher_id");
    localStorage.removeItem("guardian_id");
    localStorage.removeItem("student_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_profile");
    localStorage.removeItem("rzp_stored_checkout_id");
    localStorage.removeItem("rzp_device_id");
    localStorage.removeItem("rzp_checkout_anon_id");
    localStorage.removeItem("year_level_id");

  };

  const ResetPassword = async (userDetails) => {
    try {
      return await axios.post(`${BASE_URL}/auth/reset_password/`, userDetails);
    } catch (error) {
      console.log(error);
    }
  };

  const ChangePassword = async (userDetails) => {
    try {
      return await axios.post(
        `${BASE_URL}/auth/change_password/`,
        userDetails,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authTokens.access}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Normalize any existing profile URL on initial load
    const currentProfile = localStorage.getItem("user_profile");
    if (currentProfile) {
      const normalizedProfile = normalizeProfileUrl(currentProfile);
      if (normalizedProfile !== currentProfile) {
        localStorage.setItem("user_profile", normalizedProfile);
        setUserProfile(normalizedProfile);
      }
    }
    setLoading(false);
  }, []);

  const contextValue = useMemo(
    () => ({
      authTokens,
      isAuthenticated: !!authTokens?.access,
      userRole,
      userID, // Add this line
      loading,
      axiosInstance,
      LoginUser,
      LogoutUser,
      RegisterUser,
      ResetPassword,
      ChangePassword,
      teacherID,
      guardianID,
      studentID,
      userName,
      yearLevelID,
      userProfile: normalizeProfileUrl(userProfile)
    }),
    [authTokens, userRole, userID, loading, axiosInstance, teacherID, guardianID, userName, userProfile]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};