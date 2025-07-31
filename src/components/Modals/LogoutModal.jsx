import React from "react";

const LogoutModal = ({ show, onConfirm, onClose }) => {
    return (
        <div
            className={`fixed inset-0 flex items-center justify-center z-50 ${show ? "" : "hidden"
                }`}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-md w-[90%] max-w-md p-6 border border-gray-200"
                onClick={(e) => e.stopPropagation()}
            >
                <p className="text-center text-gray-700 mb-6">
                    Are you sure you want to logout?
                </p>
                <div className="flex justify-between space-x-4">
                    <button
                        className="flex-1 py-2 border borderTheme text-blue-500 rounded-md hover:bg-blue-50"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="flex-1 py-2 bgTheme text-white rounded-md relative"
                        onClick={onConfirm}
                    >
                        Logout
                        <i className="fa-solid fa-arrow-right-from-bracket absolute right-12 top-[23px] transform -translate-y-1/2 text-white"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;
