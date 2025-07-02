import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchStudentById } from "../../services/api/Api";
import { updateStudentById } from "../../services/api/Api";


const UpdateStudentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchStudentById(id);
                console.log(data);
                
                setStudent(data);
            } catch (err) {
                setError("Failed to load student data.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudent((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateStudentById(id, student);
            alert("Profile updated successfully.");
            navigate(`/studentDetails/${id}`);
        } catch (err) {
            alert("Failed to update student detail.");
        }
    };

    if (loading) 
        return <div className="p-4 text-center">Loading Student Profile ...</div>;
    if (error) 
        return <div className="text-red-500 text-center">{error}</div>;
    if (!student)
         return <div className="text-center">Student not found.</div>;

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
                <h1 className="text-3xl font-bold mb-8 text-center"><i class="fa-solid fa-pen-to-square"></i> Update Student Details</h1>
       
                <div className="bg-base-200 p-6 rounded-box mb-6">
                <form onSubmit={handleSubmit} 
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                   
                    <input type="text" name="first_name"
                     value={student.first_name || ""}
                     onChange={handleChange}
                      placeholder="First Name" 
                      className="input input-bordered focus:outline-none" />

                    <input type="text" name="middle_name" 
                    value={student.middle_name || ""}
                     onChange={handleChange} 
                     placeholder="Middle Name" 
                     className="input input-bordered focus:outline-none" />

                    <input type="text" name="last_name" 
                    value={student.last_name || ""}
                     onChange={handleChange} 
                     placeholder="Last Name"
                      className="input input-bordered focus:outline-none" />

                    <input type="email" name="email"
                     value={student.email || ""} 
                     onChange={handleChange} 
                     placeholder="Email" 
                     className="input input-bordered focus:outline-none" />

                    <input type="date" name="date_of_birth"
                     value={student.date_of_birth || ""} 
                     onChange={handleChange}
                      className="input input-bordered focus:outline-none" />

                    <input type="text" name="gender"
                     value={student.gender || ""} 
                     onChange={handleChange}
                      placeholder="Gender" 
                      className="input input-bordered focus:outline-none" />

                    <input type="text" name="blood_group"
                     value={student.blood_group || ""} 
                     onChange={handleChange}
                      placeholder="Blood Group" 
                      className="input input-bordered focus:outline-none" />

                    <input type="text" name="religion"
                     value={student.religion || ""} 
                     onChange={handleChange}
                      placeholder="Religion"
                       className="input input-bordered focus:outline-none" />

                    <input type="text" name="category"
                     value={student.category || ""}
                      onChange={handleChange}
                       placeholder="Category" 
                       className="input input-bordered focus:outline-none" />

                    <input type="number" name="height" 
                    value={student.height || ""}
                     onChange={handleChange} 
                     placeholder="Height (cm)" 
                     className="input input-bordered focus:outline-none" />

                    <input type="number" name="weight"
                     value={student.weight || ""}
                      onChange={handleChange}
                       placeholder="Weight (kg)"
                        className="input input-bordered focus:outline-none" />

                    <input type="number" name="number_of_siblings"
                     value={student.number_of_siblings || ""} 
                     onChange={handleChange}
                      placeholder="Number of Siblings" 
                      className="input input-bordered focus:outline-none" />

                    <input type="text" name="father_name"
                     value={student.father_name || ""} 
                     onChange={handleChange} 
                     placeholder="Father's Name" 
                     className="input input-bordered focus:outline-none" />

                    <input type="text" name="mother_name"
                     value={student.mother_name || ""}
                      onChange={handleChange} 
                      placeholder="Mother's Name" 
                      className="input input-bordered focus:outline-none" />

                    <div className="col-span-2 text-center mt-6">
                        <button type="submit" className="btn btn-primary"><i className="fa-solid fa-floppy-disk mr-2"></i>Save Changes</button>
                    </div>
                </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateStudentDetail;
