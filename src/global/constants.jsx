export const constants = {
  isOnline: true,
  isOffline: true,

  // JAVA_BASE_URL: "http://72.61.173.6/sms-java", //JAVA
  JAVA_BASE_URL: "http://72.61.173.6:8082", //JAVA
  // baseUrl: "http://72.61.173.6:8080", //DRF
  // baseUrl: "http://72.61.173.6:8084", //DRF New
  baseUrl: "https://jx8cn3gh-8000.inc1.devtunnels.ms",

  hideEdgeRevealStyle: `
      input[type="password"]::-ms-reveal,   
      input[type="password"]::-ms-clear {
        display: none;
      }
    `,
  roles: {
    director: "director",
    officeStaff: "office staff",
    teacher: "teacher",
    student: "student",
    guardian: "guardian",
  },
  allMonths: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],

  // roles: {
  //   director: "Director",
  //   officeStaff: "Office staff",
  //   teacher: "Teacher",
  //   student: "Student",
  //   guardian: "Guardain",
  // },

  bgTheme: "#5E35B1",
  textTheme: "#5E35B1",
  saffronOrange: "#FF9933",
  usColor: "#5cb7ffd9",
  italianGreen: "#4bcd89d9",
  neutralGrey: "#a6a6a6ff",
  canadaPink: "#ff6c88d9",
  textColor: "#333",
  whiteColor: "#fff",
};

const urlParts = constants.baseUrl.split("-");
if (urlParts.length > 1) {
  const portPart = urlParts[1].split(".")[0];
  if (!isNaN(portPart)) {
    constants.PORT = parseInt(portPart, 10);
  }
}
