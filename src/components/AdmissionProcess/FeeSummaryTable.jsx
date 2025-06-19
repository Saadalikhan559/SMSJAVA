import React, { useEffect, useState } from "react";
import { fetchYearLevels, fetchFeeSummary } from "../../services/api/Api";

const FeeSummaryTable = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [yearLevels, setYearLevels] = useState([]);
    const [error, setError] = useState(null);

    // Fetch year levels
    // useEffect(() => {
    //     const getYearLevels = async () => {
    //         try {
    //             const response = await fetchYearLevels();
    //             setYearLevels(response.data);
    //             console.log(response);
                
    //         } catch (err) {
    //             console.error("Error fetching year levels:", err);
    //         }
    //     };
    //     getYearLevels();
    // }, []);

    // Fetch student fee data dynamically
    useEffect(() => {
        const getFeeData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetchFeeSummary({ selectedMonth, selectedClass });

                if (response.status === 200) {
                    setStudents(response.data);
                    console.log(response);
                    
                } else {
                    setError("Unexpected response from server.");
                }
            } catch (err) {
                console.error("Error fetching fee records:", err);
                setError("Failed to load student fee records. Please try again.");
            }

            setLoading(false);
        };

        getFeeData();
    }, [selectedMonth, selectedClass]);

    const resetFilters = () => {
        setSelectedMonth("");
        setSelectedClass("");
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-xl"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-5 bg-gray-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-screen mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
                    Student Fee Record
                    <i className="fa-solid fa-cloud ml-2 text-blue-500"></i>
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
                            {yearLevels.map((level) => (
                                <option key={level.id} value={level.id}>{level.level_name}</option>
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
                <div className="overflow-x-auto rounded-lg shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left font-semibold text-gray-700 border border-gray-200">S.No</th>
                                <th className="p-3 text-left font-semibold text-gray-700 border border-gray-200">Student Name</th>
                                <th className="p-3 text-left font-semibold text-gray-700 border border-gray-200">Year Level</th>
                                <th className="p-3 text-left font-semibold text-gray-700 border border-gray-200">Month</th>
                                <th className="p-3 text-left font-semibold text-gray-700 border border-gray-200">Total Amount</th>
                                <th className="p-3 text-left font-semibold text-gray-700 border border-gray-200">Paid Amount</th>
                                <th className="p-3 text-left font-semibold text-gray-700 border border-gray-200">Due Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-6 text-gray-500">No data found.</td>
                                </tr>
                            ) : (
                                students.map((record) => (
                                    <tr key={record.student_id} className="hover:bg-blue-50">
                                        <td className="p-3 border border-gray-200">{record.id}</td>
                                        <td className="p-3 border border-gray-200">{record.student_name}</td>
                                        <td className="p-3 border border-gray-200">{record.year_level}</td>
                                        <td className="p-3 border border-gray-200">{record.month}</td>
                                        <td className="p-3 border border-gray-200">₹{record.total_amount}</td>
                                        <td className="p-3 border border-gray-200">₹{record.paid_amount}</td>
                                        <td className="p-3 border border-gray-200">₹{record.due_amount}</td>
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

