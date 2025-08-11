import React from "react";

const LoginModal = ({ onClose }) => {
  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-md w-[95%] max-w-6xl p-6 border border-gray-200 "
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-center text-gray-700 mb-6 text-3xl font-medium">
          Welcome!
        </p>
        <div className="flex justify-center">
          <button
            className="py-2 px-8 bgTheme text-white rounded-md hover:bg-blue-600 transition relative"
            onClick={onClose}
          >
            Continue
            <i className="fa-solid fa-right-to-bracket absolute right-3 top-[22px] transform -translate-y-1/2 text-white"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;




