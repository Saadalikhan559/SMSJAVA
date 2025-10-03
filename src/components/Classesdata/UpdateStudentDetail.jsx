// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { fetchStudentById, updateStudentById } from "../../services/api/Api";
// import UpdateSuccessful from "../Modals/UpdateModal";

// const UpdateStudentDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     first_name: "",
//     middle_name: "",
//     last_name: "",
//     email: "",
//     date_of_birth: "",
//     gender: "",
//     blood_group: "",
//     religion: "",
//     category: "",
//     height: "",
//     weight: "",
//     number_of_siblings: "",
//     father_name: "",
//     mother_name: "",
//     user_profile: null,
//   });

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [UpdateModal, setUpdateModal] = useState(false);


//   const fetchStudent = async () => {
//     try {
//       const data = await fetchStudentById(id);
//       const { classes, ...rest } = data;
//       setFormData({
//         ...rest,
//         user_profile: null,
//       });
//     } catch (err) {
//       setError("Failed to load student data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStudent();
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       user_profile: e.target.files[0],
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const payload = new FormData();
//     for (const key in formData) {
//       if (formData[key] !== null && formData[key] !== "") {
//         payload.append(key, formData[key]);
//       }
//     }

//     try {
//       await updateStudentById(id, payload);
//       setUpdateModal(true);

//     } catch (err) {
//       setError("Failed to update student details.");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen">
//         <div className="flex space-x-2">
//           <div className="w-3 h-3 bgTheme rounded-full animate-bounce"></div>
//           <div className="w-3 h-3 bgTheme rounded-full animate-bounce [animation-delay:-0.2s]"></div>
//           <div className="w-3 h-3 bgTheme rounded-full animate-bounce [animation-delay:-0.4s]"></div>
//         </div>
//         <p className="mt-2 text-gray-500 text-sm">Loading data...</p>
//       </div>
//     );
//   }


//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
//         <i className="fa-solid fa-triangle-exclamation text-5xl text-red-400 mb-4"></i>
//         <p className="text-lg text-red-400 font-medium">Failed to load data, Try Again</p>
//       </div>
//     );
//   }

//   const fields = [
//     "first_name",
//     "middle_name",
//     "last_name",
//     "email",
//     "date_of_birth",
//     "gender",
//     "blood_group",
//     "religion",
//     "category",
//     "height",
//     "weight",
//     "number_of_siblings",
//     "father_name",
//     "mother_name",
//   ];

// return (
//   <>
//     <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
//       <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
//         <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-gray-100">
//           <i className="fa-solid fa-pen-to-square mr-2"></i> Update Student Details
//         </h1>

//         <form
//           onSubmit={handleSubmit}
//           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
//           encType="multipart/form-data"
//         >
//           {fields.map((field) => (
//             <input
//               key={field}
//               type={
//                 field === "email"
//                   ? "email"
//                   : field === "date_of_birth"
//                   ? "date"
//                   : "text"
//               }
//               name={field}
//               value={formData[field] || ""}
//               onChange={handleChange}
//               placeholder={field
//                 .replace(/_/g, " ")
//                 .replace(/\b\w/g, (c) => c.toUpperCase())}
//               className="input input-bordered w-full focus:outline-none dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//             />
//           ))}

//           <div className="md:col-span-2 lg:col-span-3">
//             <label className="block mb-2 font-medium text-gray-900 dark:text-gray-100">
//               Upload Profile Picture
//             </label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleFileChange}
//               className="file-input file-input-bordered w-full focus:outline-none dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//             />
//           </div>

//           <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center mt-6">
//             <button type="submit" className="btn bgTheme text-white">
//               <i className="fa-solid fa-floppy-disk mr-2"></i> Save Changes
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>

//     {UpdateModal && (
//       <UpdateSuccessful
//         handleCloseOnly={() => setUpdateModal(false)}
//         handleCloseAndNavigate={() => navigate(`/studentDetails/${id}`)}
//       />
//     )}
//   </>
// );

// };

// export default UpdateStudentDetail;




import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchStudentById, updateStudentById } from "../../services/api/Api";
import UpdateSuccessful from "../Modals/UpdateModal";

const UpdateStudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    date_of_birth: "",
    gender: "",
    blood_group: "",
    religion: "",
    category: "",
    height: "",
    weight: "",
    number_of_siblings: "",
    father_name: "",
    mother_name: "",
    user_profile: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [UpdateModal, setUpdateModal] = useState(false);

  const fetchStudent = async () => {
    try {
      const data = await fetchStudentById(id);
      const { classes, ...rest } = data;
      setFormData({
        ...rest,
        user_profile: null,
      });
    } catch (err) {
      setError("Failed to load student data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      user_profile: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== "") {
        payload.append(key, formData[key]);
      }
    }

    try {
      await updateStudentById(id, payload);
      setUpdateModal(true);
    } catch (err) {
      setError("Failed to update student details.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce [animation-delay:-0.2s]"></div>
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce [animation-delay:-0.4s]"></div>
        </div>
        <p className="mt-2 text-gray-500 text-sm">Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
        <i className="fa-solid fa-triangle-exclamation text-5xl text-red-400 mb-4"></i>
        <p className="text-lg text-red-400 font-medium">Failed to load data, Try Again</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-gray-100">
            <i className="fa-solid fa-pen-to-square mr-2"></i> Update Student Details
          </h1>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" encType="multipart/form-data">
            
            {/* First Name */}
            <div>
              <label className="block mb-2 font-medium text-gray-900 dark:text-gray-100">First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />
            </div>

            {/* Middle Name */}
            <div>
              <label className="block mb-2 font-medium text-gray-900 dark:text-gray-100">Middle Name</label>
              <input
                type="text"
                name="middle_name"
                value={formData.middle_name}
                onChange={handleChange}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block mb-2 font-medium text-gray-900 dark:text-gray-100">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 font-medium text-gray-900 dark:text-gray-100">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block mb-2 font-medium text-gray-900 dark:text-gray-100">Date of Birth</label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block mb-2 font-medium text-gray-900 dark:text-gray-100">Gender</label>
              <input
                type="text"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />
            </div>

            {/* Blood Group */}
            <div>
              <label className="block mb-2 font-medium text-gray-900 dark:text-gray-100">Blood Group</label>
              <input
                type="text"
                name="blood_group"
                value={formData.blood_group}
                onChange={handleChange}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />
            </div>

            {/* Religion */}
            <div>
              <label className="block mb-2 font-medium text-gray-900 dark:text-gray-100">Religion</label>
              <input
                type="text"
                name="religion"
                value={formData.religion}
                onChange={handleChange}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block mb-2 font-medium text-gray-900 dark:text-gray-100">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />
            </div>

            {/* Height */}
            <div>
              <label className="block mb-2 font-medium text-gray-900 dark:text-gray-100">Height</label>
              <input
                type="text"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />
            </div>

            {/* Weight */}
            <div>
              <label className="block mb-2 font-medium text-gray-900 dark:text-gray-100">Weight</label>
              <input
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />
            </div>

            {/* Number of Siblings */}
            <div>
              <label className="block mb-2 font-medium text-gray-900 dark:text-gray-100">Number of Siblings</label>
              <input
                type="text"
                name="number_of_siblings"
                value={formData.number_of_siblings}
                onChange={handleChange}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />
            </div>

            {/* Father Name */}
            <div>
              <label className="block mb-2 font-medium text-gray-900 dark:text-gray-100">Father Name</label>
              <input
                type="text"
                name="father_name"
                value={formData.father_name}
                onChange={handleChange}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />
            </div>

            {/* Mother Name */}
            <div>
              <label className="block mb-2 font-medium text-gray-900 dark:text-gray-100">Mother Name</label>
              <input
                type="text"
                name="mother_name"
                value={formData.mother_name}
                onChange={handleChange}
                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />
            </div>

            {/* Profile Picture */}
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block mb-2 font-medium text-gray-900 dark:text-gray-100">Upload Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input file-input-bordered w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />
            </div>

            {/* Submit Button */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center mt-6">
              <button type="submit" className="btn bgTheme text-white">
                <i className="fa-solid fa-floppy-disk mr-2"></i> Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      {UpdateModal && (
        <UpdateSuccessful
          handleCloseOnly={() => setUpdateModal(false)}
          handleCloseAndNavigate={() => navigate(`/studentDetails/${id}`)}
        />
      )}
    </>
  );
};

export default UpdateStudentDetail;

