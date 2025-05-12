  import React, { createContext, useState, useEffect, useMemo } from "react";
  import { constants } from "../global/constants";
import axios from "axios";

  export const AuthContext = createContext(null);

  export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [allRoles, setAllRoles] = useState([]);
    const BASE_URL = constants.baseUrl;

    const RegisterUser = async (usersDetails)=>{
      try {

      const response = await axios.post(`${BASE_URL}/auth/users/`, usersDetails);
      if(response.status === 201){
        return response.message;
      }
      } catch (error) {
        console.log(error);
      }
    }

    const GetRoles = async ()=>{
      try {
        const response = await axios.get(`${BASE_URL}/d/roles/`);
        if(response.status === 200){
          setAllRoles(response.data);
        }
      } catch (error) {
        console.log(error)
      }
    }
    useEffect(()=>{
      GetRoles();
    }, []);

const value = useMemo(
  () => ({
    user,
    loading,
    RegisterUser,
    allRoles
  }),
  [user, loading, allRoles]
);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  };
