import React, { useEffect, useState } from "react";
import { fetchYearLevels } from "../../services/api/Api";
import { Link } from "react-router-dom";
import { Loader } from "../../global/Loader";

const Allclasses = () => {
    const [yearLevels, setYearLevels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getYearLevels = async () => {
        setLoading(true);
        try {
            const data = await fetchYearLevels();
            console.log("Fetched year levels:", data);
            setYearLevels(data);
        } catch (err) {
            console.error("Error fetching year levels:", err);
            setError("Failed to fetch year levels. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getYearLevels();
    }, []);

    
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
        <div className="min-h-screen p-5 bg-gray-50">
            <div className="bg-white p-6 max-w-7xl rounded-lg shadow-lg  mx-auto">
                <h1 className="text-3xl font-bold text-center mb-4 text-gray-800 border-b pb-4">
                    <i className="fa-solid fa-graduation-cap mr-2"></i> All Year Levels
                </h1>

                <div className="overflow-x-auto no-scrollbar rounded-lg max-h-[70vh]">
                    <table className="min-w-full table-auto rounded-lg ">
                        <thead className="bgTheme text-white text-center z-2 sticky top-0">
                            <tr>
                                <th scope="col" className="px-4 py-3">S.NO</th>
                                <th scope="col" className="px-4 py-3">Year Level</th>
                            </tr>
                        </thead>
                        <tbody>
                            {yearLevels.length === 0 ? (
                                <tr>
                                    <td colSpan="2" className="text-center py-6 text-gray-500">
                                        No data found.
                                    </td>
                                </tr>
                            ) : (
                                yearLevels.map((record, index) => (
                                    <tr key={record.id || index} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-gray-700 text-center">{index + 1}.</td>
                                        <td className="px-4 py-3 text-center capitalize">
                                            <Link
                                                to={`/allStudentsPerClass/${record.id}`}
                                                state={{ level_name: record.level_name }}
                                                className="textTheme hover:underline"
                                            >
                                                {record.level_name}
                                            </Link>
                                        </td>
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

export default Allclasses;
