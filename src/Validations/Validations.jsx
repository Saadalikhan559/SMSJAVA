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
    if (!emailRegex.test(email)) return "Enter a valid email address";
    return "";
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

// ------------------------------------------- Student Profile Photo-------------------------------------------------------
export const validprofilephoto = (profile_photo) => {
    if (!profile_photo) return "Student Profile Photo is required"
    return ""
}

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
    if (!gender) return "Gender is required"
    return ""
}

// ------------------------------------------- Student enrolment date-------------------------------------------------------
export const validenrolmentdate = (enrolment_date) => {
    if (!enrolment_date) return "date is required"
    return ""
}

// ----------------------------------------------Guardian Information-------------------------------------------------
// -------------------------------------------Guardian Father Name-------------------------------------------------------
export const validGuardianFatherName = (guardian_Father_name) => {
    if (!guardian_Father_name) return "Father's name is required";
    if (guardian_Father_name.length < 3) return "Father's name must be at least 3 characters";
    if (guardian_Father_name.length > 50) return "Father's name must be less than 50 characters";
    const firstNameRegex = /^[A-Za-z]+(?:[\s'-][A-Za-z]+)*$/;
    if (!firstNameRegex.test(guardian_Father_name)) return "Name can only contain letters, spaces, apostrophes, or hyphens";
    return "";
};


// -------------------------------------------Guardian Mother Name-------------------------------------------------------
export const validGuardianMotherName = (guardian_mother_name) => {
    if (!guardian_mother_name) return "Mother's name is required";
    if (guardian_mother_name.length < 3) return "Mother's name must be at least 3 characters";
    if (guardian_mother_name.length > 50) return "Mother's name must be less than 50 characters";
    const middlenameRegex = /^[A-Za-z]+(?:[\s'-][A-Za-z]+)*$/;
    if (!middlenameRegex.test(guardian_mother_name)) return "Name can only contain letters, spaces, apostrophes, or hyphens";
    return "";
};

// ------------------------------------------- Religion-------------------------------------------------------
export const validReligion = (Religion) => {
    if (!Religion) return "Religion is required"
    return ""
}

// ------------------------------------------- Category-------------------------------------------------------
export const validCategory = (Category) => {
    if (!Category) return "Category is required"
    return ""
}


// -------------------------------------------Guardian First Name-------------------------------------------------------
export const validGuardianFirstName = (guardian_First_name) => {
    if (!guardian_First_name) return "Guardian's First name is required";
    if (guardian_First_name.length < 3) return "Guardian's First name must be at least 3 characters";
    if (guardian_First_name.length > 50) return "Guardian's First name must be less than 50 characters";
    const firstNameRegex = /^[A-Za-z]+(?:[\s'-][A-Za-z]+)*$/;
    if (!firstNameRegex.test(guardian_First_name)) return "Name can only contain letters, spaces, apostrophes, or hyphens";
    return "";
};


// -------------------------------------------Guardian Middle Name-------------------------------------------------------
export const validGuardianMiddleName = (guardian_Middle_name) => {
    if (!guardian_Middle_name) return "Guardian's name is required";
    if (guardian_Middle_name.length < 3) return "Guardian's name must be at least 3 characters";
    if (guardian_Middle_name.length > 50) return "Guardian's name must be less than 50 characters";
    const firstNameRegex = /^[A-Za-z]+(?:[\s'-][A-Za-z]+)*$/;
    if (!firstNameRegex.test(guardian_Middle_name)) return "Name can only contain letters, spaces, apostrophes, or hyphens";
    return "";
};





// -------------------------------------------Guardian last Name-------------------------------------------------------
export const validGuardianlastName = (guardian_last_name) => {
    if (!guardian_last_name) return "Guardian's Last name is required";
    if (guardian_last_name.length < 3) return "Guardian's Last name must be at least 3 characters";
    if (guardian_last_name > 50) return "Guardian's Last name must be less than 50 characters";
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

// -------------------------------------------Guardian Type -------------------------------------------------------
export const ValidGuardianType = (GuardianType) => {
    if (!GuardianType) return "Guardian Type is required"
    return ""
}

// -------------------------------------------Guardian Mobile Number-------------------------------------------------------
export const validMobileNumber = (guardian_phone_no) => {
    if (!guardian_phone_no) return "Mobile number is required";
    
    return "";
};

// -------------------------------------------Guardian Profile Photo -------------------------------------------------------
export const ValidGuardianPhoto = (GuardianPhoto) => {
    if (!GuardianPhoto) return "Guardian Profile Photo is required"
    return ""
}
// -------------------------------------------Means of Livelihood -------------------------------------------------------
export const ValidLivelihood = (Livelihood) => {
    if (!Livelihood) return "Means of Livelihood is required"
    return ""
}


// ----------------------------------------------Academic Information-------------------------------------------------

// -------------------------------------------------Year level-----------------------------------------------------------

export const validyearlevel = (year_level) => {
    if (!year_level) return "Year level is required"
    return ""
}

// -------------------------------------------------school year-----------------------------------------------------------

export const validschoolyear = (school_year) => {
    if (!school_year) return "School Year is required"
    return ""
}

// -------------------------------------------------Admission Date-----------------------------------------------------------

export const validAdmissiondate = (Admission_date) => {
    if (!Admission_date) return "Admission Date is required"
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
    if (!tc_letter) return "TC letter is required"
    return ""
}
// -------------------------------------------Emergency Mobile Number-------------------------------------------------------
export const validEmergencyNumber = (Emergency_Number) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!Emergency_Number) return "Emergency Contact number is required";
    if (!mobileRegex.test(Emergency_Number)) return "Enter a valid 10-digit Indian mobile number starting with 6-9";
    return "";
};
// -------------------------------------------------House Number-----------------------------------------------------------

export const validHouseNumber = (House_Number) => {
    if (!House_Number) return "House Number is required"
    return ""
}
// -------------------------------------------------Habitation-----------------------------------------------------------

export const validHabitation = (Habitation) => {
    if (!Habitation) return "Habitation is required"
    return ""
}
// -------------------------------------------------Ward Number-----------------------------------------------------------



export const validBlock = (Block) => {
    if (!Block) return "Block is required"
    return ""
}
// -------------------------------------------------District-----------------------------------------------------------

export const validDistrict = (District) => {
    if (!District) return "District is required"
    return ""
}

// -------------------------------------------------Division-----------------------------------------------------------

export const validDivision = (Division) => {
    if (!Division) return "Division is required"
    return ""
}
// -------------------------------------------------State-----------------------------------------------------------

export const validState = (State) => {
    if (!State) return "State is required"
    return ""
}
// -------------------------------------------------Pin Code-----------------------------------------------------------

export const validPinCode = (Pin_Code) => {
    if (!Pin_Code) return "Pin Code is required"
    if (Pin_Code.length < 6) return "Enter a 6 digits valid Pin Code";

    return ""
}

// -------------------------------------------Account Holder Name-------------------------------------------------------
export const validAccountHolderName = (Account_Holder_Name) => {
    if (!Account_Holder_Name) return "Account Holder name is required";
    if (Account_Holder_Name.length < 3) return "Account Holder name must be at least 3 characters";
    if (Account_Holder_Name.length > 50) return "Account Holder name must be less than 50 characters";
    const AccountnameRegex = /^[A-Za-z]+(?:[\s'-][A-Za-z]+)*$/;
    if (!AccountnameRegex.test(Account_Holder_Name)) return "Name can only contain letters, spaces, apostrophes, or hyphens";
    return "";
};

// -------------------------------------------------Account Number-----------------------------------------------------------

export const validAccountNumber = (Account_Number) => {
    if (!Account_Number) return "Account Number is required"
    return ""
}

// -------------------------------------------------Bank Name-----------------------------------------------------------

export const validBankName = (Bank_Name) => {
    if (!Bank_Name) return "Bank Name is required"
    return ""
}

// -------------------------------------------------IFSC Code-----------------------------------------------------------

export const validIFSCcode = (IFSC_code) => {
    if (!IFSC_code) return "IFSC Code is required"
    return ""
}



// -------------------------------------------------Reset Password-----------------------------------------------------------
// -------------------------------------------------Email-----------------------------------------------------------

export const validResetEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return ("Enter a valid email address");
    return "";
}

// -------------------------------------------------Otp-----------------------------------------------------------

export const validOtp =(otp)=>{
    if (!otp) return "OTP is required";
    return "";

}



// ------------------------------------------------------------new password------------------------------------------------------

export const validNewPassword = (newpassword) => {
    // const passwordRegex = /^(?=.*[A-Za-z])(?=.\d)(?=.[@$!%#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!newpassword) return "New password is required."
    // if (!passwordRegex.test(newpassword)) return "Password must be at least 8 characters, include one letter, one number, and one special character"
    
    if (newpassword.length<8) return "Password must be at least 8 characters"

    return ""
};



// ------------------------------------------------------confirm password------------------------------------------------------------

export const validConfirmPassword = (newPassword, confirmPassword) => {
  if (!confirmPassword) return "Confirm password is required.";
  if ( newPassword !== confirmPassword) return "Passwords do not match.";
  return "";
};    


// -------------------------------------------------Forget Password-----------------------------------------------------------
// -------------------------------------------------Email-----------------------------------------------------------

export const validForgetEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return ("Enter a valid email address");
    return "";
}
