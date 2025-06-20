import React, { createContext, useState, useEffect, useMemo } from "react";
import axios from "axios";
import { constants } from "../global/constants";

const BASE_URL = constants.baseUrl;

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [teacherID, setTeacherID] = useState("");
  const [authTokens, setAuthTokens] = useState(
    () => JSON.parse(localStorage.getItem("authTokens")) || null
  );
  const [userRole, setUserRole] = useState(
    () => localStorage.getItem("userRole") || ""
  );
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("user")) || null
  );

  const [loading, setLoading] = useState(true);

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
  }, [authTokens, BASE_URL]);

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

      setTeacherID(data.teacher_id);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const LogoutUser = async () => {
    setAuthTokens(null);
    setUserRole("");
    localStorage.removeItem("authTokens");
    localStorage.removeItem("userRole");
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
            Authorization: `Bearer ${authTokens.access}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  // Set loading to false after initial render
  useEffect(() => {
    setLoading(false);
  }, []);


  const contextValue = useMemo(
    () => ({
      authTokens,
      isAuthenticated: !!authTokens?.access,
      userRole,
      loading,
      axiosInstance,
      LoginUser,
      LogoutUser,
      RegisterUser,
      ResetPassword,
      ChangePassword,
      teacherID
    }),
    [authTokens, userRole, loading, axiosInstance, teacherID ]

  );

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};