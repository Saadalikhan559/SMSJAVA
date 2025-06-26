import React, { useEffect, useState } from "react";
import { fetchYearLevels, fetchFeeSummary } from "../../services/api/Api";

const FeeSummaryTable = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [yearLevels, setYearLevels] = useState([]);
    const [error, setError] = useState(null);

    const getYearLevels = async () => {
        try {
            const data = await fetchYearLevels();
            setYearLevels(data);
        } catch (err) {
            console.error("Error fetching year levels:", err);
        }
    };

    const getFeeData = async () => {
        setLoading(true);
        setError(null);
        setStudents([]);

        try {
            const response = await fetchFeeSummary({ selectedMonth, selectedClass });

            if (response.status === 200) {
                const data = response.data;

                if (data && typeof data === "object" && data.detail === "No records found.") {
                    setError("No records found.");
                    setStudents([]);
                } else if (Array.isArray(data)) {
                    setStudents(data);
                } else {
                    setError("Unexpected response from server.");
                }
            } else {
                setError("Unexpected status from server.");
            }
        } catch (err) {
            console.error("Error fetching fee records:", err);

            if (err.response) {
                if (err.response.status === 404) {
                    setError("No data found (404 Not Found).");
                } else {
                    setError(`Server error: ${err.response.status} ${err.response.statusText}`);
                }
            } else {
                setError("Network error. Please check your connection.");
            }

            setStudents([]);
        }

        setLoading(false);
    };

    useEffect(() => {
        getYearLevels();
    }, []);

    useEffect(() => {
        getFeeData();
    }, [selectedMonth, selectedClass]);

    const resetFilters = () => {
        setSelectedMonth("");
        setSelectedClass("");
    };

    if (loading) {
        return (
            <div className='flex items-center justify-center h-screen'><i className="fa-solid fa-spinner fa-spin mr-2 text-4xl" /></div>
        );
    }

    return (
        <div className="min-h-screen p-5 bg-gray-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-screen mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
                  <i class="fa-solid fa-graduation-cap"></i>  Student Fee Record
                </h1>


                {/* Filter Section */}
                <div className="flex flex-wrap justify-center gap-4 mb-6">
                    {/* Month Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Month:</label>
                        <select
                            className="border rounded px-3 py-2 text-sm"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                        >
                            <option value="">All Months</option>
                            {[
                                "January", "February", "March", "April", "May", "June",
                                "July", "August", "September", "October", "November", "December"
                            ].map((month) => (
                                <option key={month} value={month}>{month}</option>
                            ))}
                        </select>
                    </div>

                    {/* Class Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Class:</label>
                        <select
                            className="border rounded px-3 py-2 text-sm"
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                        >
                            <option value="">All Classes</option>
                            {/* {yearLevels.map((level) => (
                                <option key={level.id} value={level.id}>{level.level_name}</option>
                            ))} */}
                            {yearLevels.map((level) => (
                                <option key={level.id} value={level.id}>{level.level_name}</option> // <--- Focus here
                            ))}
                        </select>
                    </div>

                    {/* Reset Button */}
                    <button
                        onClick={resetFilters}
                        className="bg-gray-200 hover:bg-gray-300 text-sm px-4 py-2 rounded mt-6"
                    >
                        Reset Filters
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="text-red-600 text-center mb-4 font-medium">
                        {error}
                    </div>
                )}

                {/* Table Section */}
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border border-gray-300 rounded-lg overflow-hidden">
                        <thead className="bgTheme text-white">
                            <tr>
                                <th className="px-4 py-3 text-left">S.No</th>
                                <th className="px-4 py-3 text-left">Student Name</th>
                                <th className="px-4 py-3 text-left">Class</th>
                                <th className="px-4 py-3 text-left">Month</th>
                                <th className="px-4 py-3 text-left">Total Amount</th>
                                <th className="px-4 py-3 text-left">Paid Amount</th>
                                <th className="px-4 py-3 text-left">Due Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-6 text-gray-500">No data found.</td>
                                </tr>
                            ) : (
                                students.map((record, index) => (
                                    <tr key={record.student_id || index} className="hover:bg-blue-50">
                                        <td className="px-4 py-3">{index + 1}</td>
                                        <td className="px-4 py-3">{record.student_name}</td>
                                        <td className="px-4 py-3">{record.year_level}</td>
                                        <td className="px-4 py-3">{record.month}</td>
                                        <td className="px-4 py-3">₹{record.total_amount}</td>
                                        <td className="px-4 py-3">₹{record.paid_amount}</td>
                                        <td className="px-4 py-3">₹{record.due_amount}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FeeSummaryTable;
