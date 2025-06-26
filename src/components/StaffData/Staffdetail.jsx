import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Staffdetail = () => {
    const { id } = useParams();
    const [staff, setstaff] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

        getStudent();
    }, [id]);

    if (loading) {
        return <div className="p-4 text-center">Loading Staff Member details...</div>;
    }

    if (!student) {
        return <div className="p-4 text-center text-red-500">Staff Member not found.</div>;
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-0 ">
                <div className="bgTheme text-white px-4 py-2 rounded-t-md">
                    <h2 className="text-3xl font-semibold">
                        Staff Member Profile - {student.first_name} {student.last_name}
                    </h2>
                </div>

                <div className="p-6">
                    <div className="mt-6 ">
                        <strong>Profile Picture:</strong>
                        <div className="mt-2 ">
                            {student.user_profile ? (
                                <img
                                    src={student.user_profile}
                                    alt="Profile"
                                    className="w-24 h-24 object-cover rounded-full border"
                                />
                            ) : (
                                <span className="italic text-gray-400">No profile picture</span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-dm text-gray-700">
                        <div><strong>Full Name:</strong><br />{`${student.first_name} ${student.middle_name} ${student.last_name}`.replace(/\s+/g, ' ').trim()}</div>
                        <div><strong>Email:</strong> <br />{student.phone_no}</div>
                        <div><strong>Date of Birth:</strong><br /> {student.gender}</div>
                        <div><strong>Gender:</strong> <br />{student.aadhar_no}</div>
                        <div><strong>Blood Group:</strong><br /> {student.pan_no}</div>
                        <div><strong>Religion:</strong><br /> {student.qualification}</div>
                        <div><strong>Category:</strong><br /> {student.email}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Staffdetail;

