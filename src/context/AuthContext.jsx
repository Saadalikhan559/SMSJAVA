import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useRef,
} from "react";
import axios from "axios";
import { constants } from "../global/constants";

const BASE_URL = constants.baseUrl;

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userID, setUserID] = useState(
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
    () => localStorage.getItem("year_level_id") || ""
  );
  const [stuyearLevelID, setstuYearLevelID] = useState(
    () => localStorage.getItem("stu_year_level_id") || "");
  const [stuyearLevelName, setstuYearLevelName] = useState(
    () => localStorage.getItem("stu_year_level_name") || "");
  const [loading, setLoading] = useState(true);

  // Ref to avoid stale tokens in interceptors
  const authTokensRef = useRef(authTokens);
  useEffect(() => {
    authTokensRef.current = authTokens;
  }, [authTokens]);

  // Flag & queue to handle rotational refresh
  const isRefreshing = useRef(false);
  const failedQueue = useRef([]);

  const processQueue = (error, token = null) => {
    failedQueue.current.forEach((prom) => {
      if (error) prom.reject(error);
      else prom.resolve(token);
    });
    failedQueue.current = [];
  };

  const normalizeProfileUrl = (url) => {
    if (!url) return "";
    if (url.includes(`http://localhost:${constants.PORT}`))
      return url.replace(`http://localhost:${constants.PORT}`, BASE_URL);
    if (!url.startsWith("http") && !url.startsWith("/"))
      return `${BASE_URL}/${url}`;
    if (!url.startsWith("http") && url.startsWith("/"))
      return `${BASE_URL}${url}`;
    return url;
  };

  // Axios instance with interceptors
  const axiosInstance = useMemo(() => {
    const instance = axios.create({ baseURL: BASE_URL });

    instance.interceptors.request.use((config) => {
      if (authTokensRef.current?.access)
        config.headers.Authorization = `Bearer ${authTokensRef.current.access}`;
      return config;
    });

    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          authTokensRef.current?.refresh
        ) {
          if (isRefreshing.current) {
            // Queue the request until refresh is done
            return new Promise((resolve, reject) => {
              failedQueue.current.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return axios(originalRequest);
              })
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          isRefreshing.current = true;

          try {
            const response = await axios.post(`${BASE_URL}/auth/refresh/`, {
              refresh: authTokensRef.current.refresh,
            });

            const newTokens = {
              access: response.data.access,
              refresh: response.data.refresh,
            };

            setAuthTokens(newTokens);
            authTokensRef.current = newTokens;
            localStorage.setItem("authTokens", JSON.stringify(newTokens));

            processQueue(null, newTokens.access);

            originalRequest.headers.Authorization = `Bearer ${newTokens.access}`;
            return axios(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError, null);
            await LogoutUser();
            return Promise.reject(refreshError);
          } finally {
            isRefreshing.current = false;
          }
        }

        return Promise.reject(error);
      }
    );

    return instance;
  }, []);

  const LoginUser = async (userDetails) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/users/login`,
        userDetails,
        {
          headers: { "ngrok-skip-browser-warning": "true" }
        }
      );

      const data = response.data;

      const tokens = {
        access: data["Access Token"],
        refresh: data["Refresh Token"]
      };
      setAuthTokens(tokens);
      authTokensRef.current = tokens;
      localStorage.setItem("authTokens", JSON.stringify(tokens));

      // setUserRole(data.Roles[0]);
      // localStorage.setItem("userRole", data.Roles[0]);

      const role = data.roles?.[0] || "";
setUserRole(role);
localStorage.setItem("roles", role);


      if (data["User ID"]) {
        setUserID(data["User ID"]);
        localStorage.setItem("user_id", data["User ID"]);
      }
      if (data.name) {
        setUserName(data.name);
        localStorage.setItem("user_name", data.name);
      }
      if (data.director_id) localStorage.setItem("director_id", data.director_id);
      if (data.student_id) localStorage.setItem("student_id", data.student_id);
      if (data.year_level?.id) localStorage.setItem("stu_year_level_id", data.year_level.id);
      if (data.year_level?.name) localStorage.setItem("stu_year_level_name", data.year_level.name);

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const LogoutUser = async () => {
    try {
      await axios.post(`${BASE_URL}/users/logout`,
        { refresh_token: authTokens?.refresh },
        { headers: { "ngrok-skip-browser-warning": "true" } }
      );
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setAuthTokens(null);
      authTokensRef.current = null;
      setUserRole("");
      setUserID("");
      setTeacherID("");
      setGuardianID("");
      setUserName("");
      setUserProfile("");
      setStudentID("");
      setYearLevelID("");
      localStorage.clear();
    }
  };

  // Other functions (RegisterUser, ResetPassword, ChangePassword) remain same
  const RegisterUser = async (userDetails) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/users/`,
        userDetails,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access}`,
          },
        }
      );
      if (userRole === constants.roles.director) return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

const ResetPassword = async (userDetails) => {
  try {
    const payload = {
      token: userDetails.otp,
      newPassword: userDetails.newPassword || userDetails.newpassword,
      confirmPassword: userDetails.confirmPassword,
    };

    const response = await axios.post(
      `${BASE_URL}/users/resetPassword`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Reset password error:", error.response ?? error);
    throw error;
  }
};

 const ChangePassword = async (userDetails, id) => {
  try {
    const targetId = id || userID; 
    const response = await axiosInstance.put(
      `/users/changePassword/${targetId}`,
      {
        currentPassword: userDetails.currentPassword,
        newPassword: userDetails.newPassword,
        confirmPassword: userDetails.confirmPassword,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Change password error:", error.response ?? error);
    throw error;
  }
};




  useEffect(() => {
    const currentProfile = localStorage.getItem("user_profile");
    if (currentProfile) {
      const normalizedProfile = normalizeProfileUrl(currentProfile);
      if (normalizedProfile !== currentProfile) {
        setUserProfile(normalizedProfile);
        localStorage.setItem("user_profile", normalizedProfile);
      }
    }
    setLoading(false);
  }, []);

  const contextValue = useMemo(
    () => ({
      authTokens,
      isAuthenticated: !!authTokens?.access,
      userRole,
      userID,
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
      yearLevelID,
      userName,
      userProfile: normalizeProfileUrl(userProfile),
    }),
    [
      authTokens,
      userRole,
      userID,
      loading,
      axiosInstance,
      teacherID,
      guardianID,
      userName,
      userProfile,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
