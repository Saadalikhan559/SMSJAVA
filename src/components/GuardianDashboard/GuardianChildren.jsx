import React, { useEffect, useState } from "react";
import { fetchGuardianChildren } from "../../services/api/Api";
import { Link } from "react-router-dom";
import { allRouterLink } from "../../router/AllRouterLinks";

const GuardianChildren = () => {
    const [Children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getGuardianChildren = async () => {
        setLoading(true);
        try {
            const data = await fetchGuardianChildren();
            console.log("Fetched Guardian's Children:", data);
            setChildren(data);
        } catch (err) {
            console.error("Error fetching Guardian's Children:", err);
            setError("Failed to fetch Guardian's Children. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getGuardianChildren();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <i className="fa-solid fa-spinner fa-spin mr-2 text-4xl" />
            </div>
        );
    }

    return (
        <div className="min-h-screen p-5 bg-gray-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-screen-md mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
                    <i className="fa-solid fa-graduation-cap mr-2"></i> Children Name
                </h1>

                {error && (
                    <div className="text-red-600 text-center mb-4 font-medium">
                        {error}
                    </div>
                )}

                <div className="overflow-x-auto text-center">
                    <table className="min-w-full table-auto border border-gray-300 rounded-lg overflow-hidden">
                        <thead className="bgTheme text-white text-center">
                            <tr>
                                <th scope="col" className="px-4 py-3">S.NO</th>
                                <th scope="col" className="px-4 py-3">Student Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Children.length === 0 ? (
                                <tr>
                                    <td colSpan="2" className="text-center py-6 text-gray-500">
                                        No data found.
                                    </td>
                                </tr>
                            ) : (
                                Children.map((record, index) => (
                                    <tr key={record.id || index} className="hover:bg-blue-50 text-center">
                                        <td className="px-4 py-3 text-blue-600">{index + 1}.</td>
                                        <td className="px-4 py-3 text-blue-600 hover:underline">
                                            <Link
                                                to={allRouterLink.studentFeeCard.replace(
                                                    ":student_id",
                                                    record.id
                                                )}
                                            >
                                                {`${record.first_name || ""} ${record.middle_name || ""} ${record.last_name || ""}`.trim()}
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

export default GuardianChildren;




