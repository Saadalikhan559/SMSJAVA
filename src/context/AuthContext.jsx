import React, { createContext, useState, useEffect, useMemo } from "react";
import { constants } from "../global/constants";
import axios from "axios";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const BASE_URL = constants.baseUrl;

  const RegisterUser = async (usersDetails) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/users/`,
        usersDetails
      );
      if (response.status === 201) {
        return response.message;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      RegisterUser,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
