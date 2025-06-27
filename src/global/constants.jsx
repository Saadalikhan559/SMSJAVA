export const constants = {
  isOnline: true,
  isOffline: true,
  // baseUrl: "https://gl8tx74f-8000.inc1.devtunnels.ms",
  baseUrl: "https://gl8tx74f-7000.inc1.devtunnels.ms", //farheen
  // baseUrl: "https://187gwsw1-8000.inc1.devtunnels.ms",
  // baseUrl: "https://187gwsw1-7000.inc1.devtunnels.ms",

  // baseUrl1: "https://187gwsw1-8000.inc1.devtunnels.ms",
    // baseUrl: "https://gl8tx74f-7000.inc1.devtunnels.ms",
    // baseUrl: "https://187gwsw1-8000.inc1.devtunnels.ms",


  //   // baseUrl: "https://gl8tx74f-7000.inc1.devtunnels.ms",
  //   baseUrl: "https://187gwsw1-8000.inc1.devtunnels.ms",

  // baseUrl: "https://8c1zb9f3-8000.inc1.devtunnels.ms",
  // baseUrl: "https://187gwsw1-7000.inc1.devtunnels.ms", //farha
]//   baseUrl: "https://2gqlk571-8000.inc1.devtunnels.ms", //saqib
  // baseUrl: "https://8c1zb9f3-8000.inc1.devtunnels.ms/", // noor 
  // baseUrl: "https://2gqlk571-8000.inc1.devtunnels.ms", //saqib
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
  // roles: {
  //   director: "Director",
  //   officeStaff: "Office staff",
  //   teacher: "Teacher",
  //   student: "Student",
  //   guardian: "Guardain",
  // },
};


const urlParts = constants.baseUrl.split('-');
if (urlParts.length > 1) {
  const portPart = urlParts[1].split('.')[0];
  if (!isNaN(portPart)) {
    constants.PORT = parseInt(portPart, 10);
  }
}