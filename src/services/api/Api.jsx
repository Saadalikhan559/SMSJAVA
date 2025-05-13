import axios from "axios";
import { constants } from "../../global/constants";

const BASE_URL = constants.baseUrl;

export const fetchRoles = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/d/roles/`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch roles:", err);
    throw err; 
  }
};

export const fetchYearLevels = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/d/year-levels/`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch roles:", err);
    throw err;
  }
}; 

export const fetchSchoolYear = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/d/school-years/`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch roles:", err);
    throw err;
  }
}; 

export const handleAdmissionForm = async (userData) => {

  try {
    const response = await axios.post(`${BASE_URL}/d/admission/`, userData);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch roles:", err);
    throw err;
  }
}; 

