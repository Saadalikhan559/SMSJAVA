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



