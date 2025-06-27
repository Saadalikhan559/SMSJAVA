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

// export const fetchYearLevels = async () => {
//   try {
//     const response = await axios.get(`${BASE_URL}/d/year-levels/`);
//     return response.data;
//   } catch (err) {
//     console.error("Failed to fetch roles:", err);
//     throw err;
//   }
// };

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

export const fetchStudentYearLevelByClass = async (year_level_id) => {
  try {
    const response = await axios.get(

      `${BASE_URL}/s/studentyearlevel/?level__id=${year_level_id}`
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
    console.error("Failed to load director Dashboard:", err);
    throw err;
  }
};

// Student Category Dashboard

export const fetchStudentCategoryDashboard = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/d/student-category-dashboard/`);
    return response.data;
  } catch (err) {
    console.error("Failed to load student category director Dashboard:", err);
    throw err;
  }
};

// Income Distribution Dashboard

export const fetchIncomeDistributionDashboard = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/d/income-distribution-dashboard/`);
    return response.data;
  } catch (err) {
    console.error("Failed to load Income Distribution Dashboard:", err);
    throw err;
  }
};

// Office Staff Dashboard

export const fetchOfficeStaffDashboard = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/d/office-staff-dashboard/`);
    return response.data;
  } catch (err) {
    console.error("Failed to officeStaff Dashboard:", err);
    throw err;
  }
};

// Guardian Dashboard

export const fetchGuardianDashboard = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/d/guardian-dashboard/${id}/`);
    return response.data;
  } catch (err) {
    console.error("Failed to guardian Dashboard:", err);
    throw err;
  }
};

// Teacher Dashboard

export const fetchTeacherDashboard = async () => {
  try {

    const response = await axios.get(`${BASE_URL}/d/teacher-dashboard/${id}/`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch Teacher Dashboard:", err);
    throw err;
  }
};
// admission details get api
export const fetchAdmissionDetails = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/d/admission/`);
    return response.data;
  } catch (err) {
    console.error("Failed to admission details:", err);
    throw err;
  }
};
// admission details get api by id
export const fetchAdmissionDetailsById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/d/admission/${1}/`);
    return response.data;
  } catch (err) {
    console.error("Failed to admission details:", err);
    throw err;
  }
};

// fetch View upload documents api
export const fetchViewDocuments = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/d/Document/`);
    return response.data;
  } catch (err) {
    console.error("Failed to load upload data details:", err);
    throw err;
  }
};

export const fetchStudents1 = async (classId) => {
  console.log(classId)
  try {
    const response = await axios.get(`${BASE_URL}/s/studentyearlevels/?level__id=${classId}`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch roles:", err);
    throw err;
  }
};


export const fetchyearLevelData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/d/year-level-fee/`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch roles:", err);
    throw err;
  }
};

export const fetchYearLevels = async () => {
  try {
    const response = await axios.get(`${constants.baseUrl}/d/year-levels/`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch year levels:", err);
    throw err;
  }
};



export const fetchFeeSummary = ({ selectedMonth, selectedClass }) => {
  // Always use the same base URL for fee summaries.
  // This is crucial for consistent behavior.
  const url = `${constants.baseUrl}/d/fee-record/monthly-summary/`;

  const params = {};

  // Add month parameter if selectedMonth is provided
  if (selectedMonth) {
    params.month = selectedMonth;
  }

  // Add class parameter if selectedClass is provided
  if (selectedClass) {
    // Make sure 'year_level' is the exact parameter name your backend expects for class filtering

    params.year_level = selectedClass;
  }

  // If both selectedMonth and selectedClass are empty, the 'params' object will be empty.
  // Your backend API for '/d/fee-record/monthly-summary/' should then return all records.
  return axios.get(url, { params });
};

export const fetchAttendanceData = async (date = '') => {
  try {
    const url = date
      ? `${BASE_URL}/a/director-dashboard/?date=${date}`
      : `${BASE_URL}/a/director-dashboard/`;

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch attendance data:', error);
    return null;
  }
};





export const fetchAttendance = async (className) => {
  try {
    const response = await axios.get(`${BASE_URL}/a/api/report/?class=${className}`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch students:", err);
    throw err;
  }
};


// POST APIS

export const handleAdmissionForm = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/d/admission/`, formData, {
      headers: {
        "Content-Type": "application/json",
        // "Content-Type": "multipart/form-data",
      },
    });
    if (response.status === 200 || response.status === 201) {
      alert("successfully submitted the form");
    }

    return response.data;
  } catch (err) {
    throw err;
  }
};



// EDIT APIS


export const handleEditAdmissionForm = async (formData, id) => {
  try {
    const response = await axios.put(`${BASE_URL}/d/admission/${id}/`, formData, {
      headers: {
        "Content-Type": "application/json",
        // "Content-Type": "multipart/form-data",
      },
    });
    if (response.status === 200 || response.status === 201) {
      alert("successfully submitted the form");
    }

    return response.data;
  } catch (err) {
    throw err;
  }
};





export const fetchStudentById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/s/students/${1}/`);
      return response.data;
  } catch (error) {
    console.error("Failed to fetch student details:", error);
    throw error;
  }
};

export const fetchGuardianAttendance = async (id, month, year) => {
  try {
    const response = await axios.get(`${BASE_URL}/a/guardian/attendance/`, {
      params: {
        guardian_id: id,
        month: month,
        year: year
      }
    });
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch guardian attendance:", err);
    throw err;
  }
};

