import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchStudentById } from "../../services/api/Api";
import { constants } from "../../global/constants";

const BASE_URL = constants.baseUrl;

const StudentDetails = () => {
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    const getStudent = async () => {
        try {
            const data = await fetchStudentById(id);
            setStudent(data);
        } catch (error) {
            console.error("Error loading student data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getStudent();
    }, [id]);

    if (loading) {
        return <div className="p-4 text-center">Loading student details...</div>;
    }

    if (!student) {
        return <div className="p-4 text-center text-red-500">Student not found.</div>;
    }

    return (
        <div className="flex justify-center">
            <div className="p-6 bg-gray-100 w-3xl">
                <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg">
                    <div className="bgTheme text-white px-4 py-2 rounded-t-md">
                        <h2 className="text-3xl font-semibold">
                            Student Profile - {student.first_name} {student.last_name}
                        </h2>
                    </div>

                    <div className="p-6">
                        <div className="mt-6">
                            <div className="mt-2">
                                {student.user_profile ? (
                                    <img
                                        src={`${BASE_URL}${student.user_profile.startsWith("/") ? "" : "/"}${student.user_profile}`}
                                        alt="Profile"
                                        className="w-24 h-24 object-cover border rounded-full"
                                    />
                                ) : (
                                    <span className="italic text-gray-400">No profile picture</span>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-dm text-gray-700 mt-6">
                            <div><strong>Full Name:</strong><br />{`${student.first_name} ${student.middle_name} ${student.last_name}`.replace(/\s+/g, ' ').trim()}</div>
                            <div><strong>Email:</strong><br />{student.email}</div>
                            <div><strong>Date of Birth:</strong><br />{student.date_of_birth}</div>
                            <div><strong>Gender:</strong><br />{student.gender}</div>
                            <div><strong>Blood Group:</strong><br />{student.blood_group}</div>
                            <div><strong>Religion:</strong><br />{student.religion}</div>
                            <div><strong>Category:</strong><br />{student.category}</div>
                            <div><strong>Height:</strong><br />{student.height} cm</div>
                            <div><strong>Weight:</strong><br />{student.weight} kg</div>
                            <div><strong>Number of Siblings:</strong><br />{student.number_of_siblings}</div>
                            <div><strong>Father's Name:</strong><br />{student.father_name}</div>
                            <div><strong>Mother's Name:</strong><br />{student.mother_name}</div>
                        </div>

                        <div className="flex justify-center p-8 gap-4">
                            <Link to={`/updateStudentdetail/${id}`}>
                                <button type="button" className="btn btn-primary">
                                    <i className="fa-solid fa-pen-to-square"></i> Update Profile
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDetails;
