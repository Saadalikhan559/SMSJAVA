// // /------------------------------------Login form validations---------------------------------------------/

// -----------------------------------------Email--------------------------------------------------------------
export const validloginemail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required.";
    if (!emailRegex.test(email)) return "Enter a valid email address.";
    return "";
};

// -------------------------------------------Password----------------------------------------------------------/
export const validloginpassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    return "";
};

// // /------------------------------------Register form validations---------------------------------------------/


// -------------------------------------------First Name----------------------------------------------------------
export const validfirstname = (firstName) => {
    if (!firstName) return "First name is required";
    if (firstName.length < 3) return "First name must be at least 3 characters";
    if (firstName.length > 20) return "First name must be less than 20 characters";
    const firstnameRegex = /^[A-Za-z]+(?:[\s'-][A-Za-z]+)*$/;
    if (!firstnameRegex.test(firstName)) {
        return "First name can only contain letters, spaces, apostrophes, or hyphens";
    }
    return "";
}

// -------------------------------------------------Last Name-------------------------------------------------------
export const validlastname = (lastName) => {
    if (!lastName) return "Last name is required";
    if (lastName.length < 3) return "Last name must be at least 3 characters";
    if (lastName.length > 30) return "Last name must be less than 30 characters";
    const lastnameRegex = /^[A-Za-z]+(?:[\s'-][A-Za-z]+)*$/;
    if (!lastnameRegex.test(lastName)) {
        return "Last name can only contain letters, spaces, apostrophes, or hyphens";
    }
    return "";
}

// --------------------------------------------------Email----------------------------------------------------------
export const validregisteremail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address (e.g., username@example.com).";
    return "";
};

// --------------------------------------------------Role----------------------------------------------------------
export const validregisterrole = (roleId) => {
    if (!roleId) return "Please select a role";
    return ""
};

// -------------------------------------------------Password-----------------------------------------------------------
export const validregisterpassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!password) return "Password is required";
    if (!passwordRegex.test(password)) {
        return "Password must be minimum eight characters, at least one letter, one number and one special character";
    }
    return "";
}


// // /------------------------------------Admission form validations---------------------------------------------/
// ----------------------------------------------Student Information-------------------------------------------------
// -------------------------------------------Student First Name---------------------------------------------------
export const validStudentFirstName = (student_first_name) => {
    if (!student_first_name) return "Student's first name is required";
    if (student_first_name.length < 3) return "First name must be at least 3 characters";
    if (student_first_name.length > 20) return "First name must be less than 20 characters";
    const firstnameRegex = /^[A-Za-z]+(?:[\s'-][A-Za-z]+)*$/;
    if (!firstnameRegex.test(student_first_name)) return "First name can only contain letters, spaces, apostrophes, or hyphens";
    return "";
};

// ----------------------------------------------Student Middle Name---------------------------------------------------

export const validStudentMiddleName = (student_middle_name) => {
    if (!student_middle_name) return "Student's first name is required";
    if (student_middle_name.length < 3) return "First name must be at least 3 characters";
    if (student_middle_name.length > 20) return "First name must be less than 20 characters";
    const middlenameRegex = /^[A-Za-z]+(?:[\s'-][A-Za-z]+)*$/;
    if (!middlenameRegex.test(student_middle_name)) return "First name can only contain letters, spaces, apostrophes, or hyphens";
    return "";
}

// -------------------------------------------Student Last Name----------------------------------------------------
export const validStudentLastName = (student_last_name) => {
    if (!student_last_name) return "Student's last name is required";
    if (student_last_name.length < 3) return "Last name must be at least 3 characters";
    if (student_last_name.length > 30) return "Last name must be less than 30 characters";
    const lastnameRegex = /^[A-Za-z]+(?:[\s'-][A-Za-z]+)*$/;
    if (!lastnameRegex.test(student_last_name)) return "Last name can only contain letters, spaces, apostrophes, or hyphens";
    return "";
};

// -------------------------------------------Student Email---------------------------------------------------------
export const validStudentEmail = (student_email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!student_email) return "Student email is required";
    if (!emailRegex.test(student_email)) return "Enter a valid student email address";
    return "";
};

// -------------------------------------------Student Password------------------------------------------------------
export const validStudentPassword = (student_password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!student_password) return "Student password is required";
    if (!passwordRegex.test(student_password)) return "Password must be at least 8 characters, include one letter, one number, and one special character";
    return "";
};

// ------------------------------------------- Student Date of Birth-------------------------------------------------------
export const validDOB = (student_date_of_birth) => {
    if (!student_date_of_birth) return "Date of Birth is required";
    const dobDate = new Date(student_date_of_birth);
    const now = new Date();
    if (student_date_of_birth >= now) return "Date of Birth must be in the past";
    return "";
};

// ------------------------------------------- Student Gender-------------------------------------------------------
export const validgender = (gender) => {
    if (!gender) return "gender is required"
    return ""
}

// ------------------------------------------- Student enrolment date-------------------------------------------------------
export const validenrolmentdate = (enrolment_date) => {
    if (!enrolment_date) return "date is required"
    return ""
}

// ----------------------------------------------Guardian Information-------------------------------------------------
// -------------------------------------------Guardian First Name-------------------------------------------------------
export const validGuardianFirstName = (guardian_first_name) => {
    if (!guardian_first_name) return "Guardian's name is required";
    if (guardian_first_name.length < 3) return "Guardian's name must be at least 3 characters";
    if (guardian_first_name.length > 50) return "Guardian's name must be less than 50 characters";
    const firstNameRegex = /^[A-Za-z]+(?:[\s'-][A-Za-z]+)*$/;
    if (!firstNameRegex.test(guardian_first_name)) return "Name can only contain letters, spaces, apostrophes, or hyphens";
    return "";
};


// -------------------------------------------Guardian Middle Name-------------------------------------------------------
export const validGuardianMiddlName = (guardian_middle_name) => {
    if (!guardian_middle_name) return "Guardian's name is required";
    if (guardian_middle_name.length < 3) return "Guardian's name must be at least 3 characters";
    if (guardian_middle_name.length > 50) return "Guardian's name must be less than 50 characters";
    const middlenameRegex = /^[A-Za-z]+(?:[\s'-][A-Za-z]+)*$/;
    if (!middlenameRegex.test(guardian_middle_name)) return "Name can only contain letters, spaces, apostrophes, or hyphens";
    return "";
};  


// -------------------------------------------Guardian last Name-------------------------------------------------------
export const validGuardianlastName = (guardian_last_name) => {
    if (!guardian_last_name) return "Guardian's name is required";
    if (guardian_last_name.length < 3) return "Guardian's name must be at least 3 characters";
    if (guardian_last_name > 50) return "Guardian's name must be less than 50 characters";
    const lastnameRegex = /^[A-Za-z]+(?:[\s'-][A-Za-z]+)*$/;
    if (!lastnameRegex.test(guardian_last_name)) return "Name can only contain letters, spaces, apostrophes, or hyphens";
    return "";
};


// -------------------------------------------Guardian Email-------------------------------------------------------
export const validGuardianEmail = (guardian_email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!guardian_email) return "Guardian email is required";
    if (!emailRegex.test(guardian_email)) return "Enter a valid guardian email address";
    return "";
};

// -------------------------------------------Guardian Password----------------------------------------------------
export const validGuardianPassword = (guardian_password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!guardian_password) return "Guardian password is required";
    if (!passwordRegex.test(guardian_password)) return "Password must be at least 8 characters, include one letter, one number, and one special character";
    return "";
};

// -------------------------------------------Guardian Mobile Number-------------------------------------------------------
export const validMobileNumber = (guardian_phone_no) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!guardian_phone_no) return "Mobile number is required";
    if (!mobileRegex.test(guardian_phone_no)) return "Enter a valid 10-digit Indian mobile number starting with 6-9";
    return "";
};


// ----------------------------------------------Academic Information-------------------------------------------------

// -------------------------------------------------Year level-----------------------------------------------------------

export const validyearlevel = (year_level) => {
    if (!year_level) return "year level is required"
    return ""
}

// -------------------------------------------------school year-----------------------------------------------------------

export const validschoolyear = (school_year) => {
    if (!school_year) return "year is required"
    return ""
}

// -------------------------------------------------previous school name-----------------------------------------------------------

export const validschoolname = (previous_school_name) => {
    if (!previous_school_name) return "previous school name is required"
    return ""
}

// -------------------------------------------------previous school name-----------------------------------------------------------

export const validclass = (previous_standard_studied) => {
    if (!previous_standard_studied) return "standard/class is required"
    return ""
}

// -------------------------------------------------Admission date-----------------------------------------------------------

export const validadmissiondate = (admission_date) => {
    if (!admission_date) return "date is required"
    return ""
}

// -------------------------------------------------TC letter-----------------------------------------------------------

export const validtc = (tc_letter) => {
    if (!tc_letter) return "tc letter is required"
    return ""
}


// -----------------------------------------------Change Password validation-------------------------------------------------

// ---------------------------------------------------------current password-----------------------------------------------------------

export const validCurrentPassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!password) return "Current password is required."
    if (!passwordRegex.test(password)) return "Password must be at least 8 characters, include one letter, one number, and one special character"
    return ""
};

// ------------------------------------------------------------new password------------------------------------------------------

export const validNewPassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!password) return "New password is required."
    if (!passwordRegex.test(password)) return "Password must be at least 8 characters, include one letter, one number, and one special character"
    return ""
};

// ------------------------------------------------------confirm password------------------------------------------------------------

export const validConfirmPassword = (newPassword, confirmPassword) => {
  if (!confirmPassword) return "Confirm password is required.";
  if (newPassword !== confirmPassword) return "Passwords do not match.";
  return null;
};



