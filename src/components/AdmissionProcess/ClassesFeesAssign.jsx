import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { allRouterLink } from "../../router/AllRouterLinks";

const ClassesFeesAssign = () => {
    const navigate = useNavigate();
    const [yearLevels, setYearLevels] = useState([]);
    const [selectedYearLevel, setSelectedYearLevel] = useState("");
    const [selectedFeeType, setSelectedFeeType] = useState("");
    const [amount, setAmount] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const feeTypeOptions = [
        { id: 1, name: "Admission Fee" },
        { id: 2, name: "Exam Fee" },
        { id: 3, name: "Transport Fee" },
        { id: 4, name: "Tuition Fee" },
    ];

    const classSeries = [
        "Pre Nursery",
        "Nursery",
        "LKG",
        "UKG",
        "class 1",
        "class 2",
        "class 3",
        "class 4",
        "class 5",
        "class 6",
        "class 7",
        "class 8",
        "class 9",
        "class 10",
        "class 11",
        "class 12",
    ];

    // Fetch year levels 
    useEffect(() => {
        axios
            .get("https://smsproject1.pythonanywhere.com/d/year-level-fee/")
            .then((res) => setYearLevels(res.data))
            .catch((err) => console.error(err));
    }, []);
    const sortedYearLevels = yearLevels.sort(
        (a, b) => classSeries.indexOf(a.year_level) - classSeries.indexOf(b.year_level)
    );

    const handleNavigate = () => {
        navigate(allRouterLink.viewClassesFees);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedYearLevel || !selectedFeeType || !amount) {
            alert("All fields are required!");
            return;
        }

        const yearLevelId = parseInt(selectedYearLevel);
        const feeTypeId = parseInt(selectedFeeType);

        //  if fee already exists for this class
        const existingYear = yearLevels.find((y) => y.id === yearLevelId);
        const feeExists = existingYear?.fees.some((f) => f.fee_type === feeTypeOptions.find(ft => ft.id === feeTypeId)?.name);

        if (feeExists) {
            setAlertMessage("This fee type already exists for the selected class!");
            setShowAlert(true);
            return;
        }

        const payload = {
            year_level: yearLevelId,
            fee_type: feeTypeId,
            amount: amount,
        };

        setIsSubmitting(true);
        try {
            await axios.post(
                "https://smsproject1.pythonanywhere.com/d/year-level-fee/",
                payload
            );
            setAlertMessage("Fee assigned successfully!");
            setShowAlert(true);
            setAmount("");
            setSelectedYearLevel("");
            setSelectedFeeType("");
            const res = await axios.get("https://smsproject1.pythonanywhere.com/d/year-level-fee/");
            setYearLevels(res.data);
        } catch (error) {
            console.error(error);
            setAlertMessage("Failed to assign fee!");
            setShowAlert(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen p-5 bg-gray-50 dark:bg-gray-900">
            <div className="w-full max-w-7xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md my-8">
                <div className=" flex justify-end">
                    <button
                        className="font-bold text-xl cursor-pointer hover:underline flex items-center gap-2 textTheme"
                        onClick={handleNavigate}
                    >
                        View Fee Structure <span>&rarr;</span>
                    </button>
                </div>
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white border-b border-gray-900 dark:border-gray-700 pb-4">
                    Assign Class Fee
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex gap-4">
                        {/* Class Dropdown */}
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Class *
                            </label>
                            <select
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                value={selectedYearLevel}
                                onChange={(e) => setSelectedYearLevel(e.target.value)}
                            >
                                <option value="">Select Class</option>
                                {sortedYearLevels.map((year) => (
                                    <option key={year.id} value={year.id}>
                                        {year.year_level}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Fee Type Dropdown */}
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Fee Type *
                            </label>
                            <select
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                value={selectedFeeType}
                                onChange={(e) => setSelectedFeeType(e.target.value)}
                            >
                                <option value="">Select Fee Type</option>
                                {feeTypeOptions.map((ft) => (
                                    <option key={ft.id} value={ft.id}>
                                        {ft.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Amount Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Amount *
                        </label>
                        <input
                            type="number"
                            placeholder="Enter Amount"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn bgTheme text-white w-40"
                        >
                            {isSubmitting ? (
                                <i className="fa-solid fa-spinner fa-spin"></i>
                            ) : (
                                "Assign Fee"
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Alert Modal */}
            {showAlert && (
                <dialog open className="modal modal-open">
                    <div className="modal-box dark:bg-gray-800 dark:text-gray-100">
                        <h3 className="font-bold text-lg">Notification</h3>
                        <p className="py-4">{alertMessage}</p>
                        <div className="modal-action">
                            <button
                                className="btn bgTheme text-white w-24"
                                onClick={() => setShowAlert(false)}
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    );
};

export default ClassesFeesAssign;
