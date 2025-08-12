import React from "react";

const LoginModal = ({ onClose }) => {
  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-md w-[95%] max-w-6xl p-6 border border-gray-200 h-[50%]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-center text-gray-700 text-9xl font-medium animate-bounce">
            Welcome!
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
