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

export const fetchGuardianType = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/s/guardian-types/`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch guardian type:", err);
    throw err;
  }
};

export const fetchDocumentType = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/d/DocumentType/`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch document type:", err);
    throw err;
  }
};

export const fetchStudents = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/s/students/`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch students:", err);
    throw err;
  }
};

export const fetchStudentYearLevel = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/s/studentYearLevel/`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch all students:", err);
    throw err;
  }
};

export const fetchStudentYearLevelByClass = async (classLevel) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/s/studentyearlevels/?search=${classLevel}`
    );
    return response.data;
  } catch (err) {
    console.error("Failed to fetch students:", err);
    throw err;
  }
};

export const fetchTeachers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/t/teacher/`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch teachers:", err);
    throw err;
  }
};

export const fetchGuardians = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/s/guardian/`);
    return response.data.results;
  } catch (err) {
    console.error("Failed to fetch guardians:", err);
    throw err;
  }
};

export const fetchOfficeStaff = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/d/officestaff/`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch office Staff:", err);
    throw err;
  }
};

export const fetchPeriods = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/d/Period/`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch periods:", err);
    throw err;
  }
};

export const fetchSubjects = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/d/subject/`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch subjects:", err);
    throw err;
  }
};

export const fetchAllTeacherAssignments = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/t/teacher/all-teacher-assignments/`
    );
    return response.data;
  } catch (err) {
    console.error("Failed to all teacher assignments:", err);
    throw err;
  }
};

export const fetchAllTeacherClasses = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/a/teacher-classes/${id}/`);
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch all teacher classes:", err);
    throw err;
  }
};

export const fetchCountry = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/d/country/`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch country:", err);
    throw err;
  }
};

export const fetchState = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/d/states/`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch state:", err);
    throw err;
  }
};

export const fetchCity = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/d/city/`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch city:", err);
    throw err;
  }
};

// DASHBOARD

// Director Dashboard
export const fetchDirectorDashboard = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/d/director-dashboard/`);
    return response.data;
  } catch (err) {
    console.error("Failed to director Dashboard:", err);
    throw err;
  }
};

// Office Staff Dashboard

export const fetchOfficeStaffDashboard = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/d/office-staff-dashboard/13/`);
    return response.data;
  } catch (err) {
    console.error("Failed to officeStaff Dashboard:", err);
    throw err;
  }
};

// Guardian Dashboard

export const fetchGuardianDashboard = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/d/guardian-dashboard/4/`);
    return response.data;
  } catch (err) {
    console.error("Failed to officeStaff Dashboard:", err);
    throw err;
  }
};

// Teacher Dashboard

export const fetchTeacherDashboard = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/d/teacher-dashboard/1/`);
    return response.data;
  } catch (err) {
    console.error("Failed to officeStaff Dashboard:", err);
    throw err;
  }
};



// POST APIS

export const handleAdmissionForm = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/d/admission/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.status === 200 || response.status === 201) {
      alert("successfully submitted the form");
    }

    return response.data;
  } catch (err) {
    console.error("Failed:", err);
    throw err;
  }
};

export const fetchStudents1 = async () => {
  const BASE_URL1 = constants.baseUrl1;
  try {
    const response = await axios.get(`${BASE_URL1}/s/students/`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch roles:", err);
    throw err;
  }
};
export const fetchyearLevelData = async () => {
  const BASE_URL1 = constants.baseUrl1;
  try {
    const response = await axios.get(`${BASE_URL1}/d/year-level-fee/`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch roles:", err);
    throw err;
  }
};




export const fetchAttendanceData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/a/director-dashboard/`);
    return response.data.class_wise_attendance || [];
  } catch (error) {
    console.error('Failed to fetch attendance data:', error);
    return [];
  }
};






