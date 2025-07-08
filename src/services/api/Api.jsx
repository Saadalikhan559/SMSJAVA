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
    const response = await axios.get(`${BASE_URL}/s/studentYearLevels/`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch all students:", err);
    throw err;
  }
};

export const fetchStudentYearLevelByClass = async (year_level_id) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/s/studentyearlevels/?level__id=${year_level_id}`
    );
    return response.data;
  } catch (err) {
    console.error("Failed to fetch students:", err);
    throw err;
  }
};

export const fetchTeachers = async (id) => {
  try {
    const res = await axios.get(`${BASE_URL}/t/teacher/${id ? `${id}/` : ""}`);
    return res.data;
  } catch (err) {
    console.error("Failed to fetch teachers:", err);
    throw err;
  }
};

export const fetchOfficeStaff = async (id) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/d/officestaff/${id ? `${id}/` : ""}`
    );
    return res.data;
  } catch (err) {
    console.error("Failed to fetch office staff:", err);
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

export const fetchAllTeacherAssignments = async (accessToken) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/t/teacher/all-teacher-assignments/`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
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
    const response = await axios.get(
      `${BASE_URL}/d/student-category-dashboard/`
    );
    return response.data;
  } catch (err) {
    console.error("Failed to load student category director Dashboard:", err);
    throw err;
  }
};

// Income Distribution Dashboard

export const fetchIncomeDistributionDashboard = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/d/income-distribution-dashboard/`
    );
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

export const getAttendanceByGuardianId = async (guardianId) => {
  try {
    const response = await axios.get(`${BASE_URL}/a/api/report/?guardian_id=${guardianId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    throw error;
  }
};





// Guardian Dashboard

export const fetchStudentDashboard = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/d/student_dashboard/${id}/`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch student Dashboard:", err);
    throw err;
  }
};

// Teacher Dashboard

export const fetchTeacherDashboard = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/d/teacher-dashboard/${id}/`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch Teacher Dashboard:", err);
    throw err;
  }
};

// Fee Dashboard

export const fetchFeeDashboard = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/d/fee-dashboard/`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch fee Dashboard:", err);
    throw err;
  }
};

// Fee Dashboard by month

export const fetchFeeDashboardByMonth = async (month) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/d/fee-dashboard/?month=${month}`
    );
    return response.data;
  } catch (err) {
    console.error("Failed to fetch fee Dashboard by month:", err);
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
    const response = await axios.get(`${BASE_URL}/d/admission/${id}/`);
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
  console.log(classId);
  try {
    const response = await axios.get(
      `${BASE_URL}/s/studentyearlevels/?level__id=${classId}`
    );
    return response.data;
  } catch (err) {
    console.error("Failed to fetch roles:", err);
    throw err;
  }
};


export const fetchyearLevelData = async (classId) => {

  try {
    const response = await axios.get(`${BASE_URL}/d/year-level-fee/${classId}/`);
    return response.data;
  } catch (err) {
    console.log("Failed to load year level data. Please try again." + err);
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

export const fetchAttendanceData = async (date = "") => {
  try {
    const response = await axios.get(
      `${BASE_URL}/a/director-dashboard/?date=${date}`
    );

    return response.data;
  } catch (error) {
    console.error("Failed to fetch attendance data:", error);
    return null;
  }
};


export const fetchAttendance = async (studentId, month, year) => {
  try {
    let url = `${BASE_URL}/a/api/report/`;

    if (studentId) {
      url += `?student_id=${studentId}`;
      if (month) url += `&month=${month}`;
      if (year) url += `&year=${year}`;
    }

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch attendance:", error.response?.data || error.message);
    throw error.response?.data || new Error("Something went wrong.");
  }
};



export const fetchStudentById = async (student_id) => {
  try {
    const response = await axios.get(`${BASE_URL}/s/students/${student_id}/`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch student details:", error);
    throw error;
  }
};

export const fetchStudentFee = async (student_id = 12) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/d/fee-record/student-fee-card/?student_id=${student_id}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch student fees details:", error);
    throw error;
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
    const response = await axios.put(
      `${BASE_URL}/d/admission/${id}/`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          // "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response.status === 200 || response.status === 201) {
      alert("successfully submitted the form");
    }

    return response.data;
  } catch (err) {
    throw err;
  }
};

// Update Student Detail
export const updateStudentById = async (id, updatedData) => {
  try {
    const response = await axios.put(`${BASE_URL}/s/students/${id}/`, updatedData);

    return response.data;
  } catch (error) {
    console.error("Failed to update student profile:", error);
    throw error;
  }
};

// export const editTeachersdetails = async (id, formdata) => {
//   try {
//     const response = await axios.put(`${BASE_URL}/t/teacher/${id}/`, formdata);
//     return response.data;
//   } catch (error) {
//     console.error(
//       "Failed to update teacher details:",
//       error.response?.data || error.message
//     );
//     throw (
//       error.response?.data ||
//       new Error("Something went wrong while updating teacher details.")
//     );
//   }
// };

// export const editOfficeStaffdetails = async (id, formdata) => {
//   try {
//     const response = await axios.put(
//       `${BASE_URL}/d/officestaff/${id}/`,
//       formdata
//     );
//     return response.data;
//   } catch (error) {
//     console.error(
//       "Failed to update office staff details:",
//       error.response?.data || error.message
//     );
//     throw (
//       error.response?.data ||
//       new Error("Something went wrong while updating office staff details.")
//     );
//   }
// };



export const editTeachersdetails = async (id, formdata) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/t/teacher/${id}/`,
      formdata,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Failed to update teacher details:",
      error.response?.data || error.message
    );
    throw (
      error.response?.data ||
      new Error("Something went wrong while updating teacher details.")
    );
  }
};

export const editOfficeStaffdetails = async (id, formdata) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/d/officestaff/${id}/`,
      formdata,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Failed to update office staff details:",
      error.response?.data || error.message
    );
    throw (
      error.response?.data ||
      new Error("Something went wrong while updating office staff details.")
    );
  }
};


export const fetchGuardianAttendance = async (id, month, year) => {
  try {
    const response = await axios.get(`${BASE_URL}/a/guardian/attendance/`, {
      params: {
        guardian_id: id,
        month: month,
        year: year,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch guardian attendance:", err);
    throw err;
  }
};
