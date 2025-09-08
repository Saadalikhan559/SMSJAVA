import React, { forwardRef, useImperativeHandle, useState } from "react";

export const SuccessModal = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    navigateTo,      // Function to execute on continue
    buttonText = "Continue",  // Custom button text
    message = "Your action was completed successfully.", // Custom message
    title = "Success!" // Custom title
  } = props;

  useImperativeHandle(ref, () => ({
    show: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }));

  const handleContinue = () => {
    setIsOpen(false);
    if (navigateTo) {
      navigateTo();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 backdrop-blur-sm">
      <div
        className="bg-white rounded-xl p-6 shadow-2xl border border-green-100 text-center w-[28rem] max-w-md
 relative overflow-hidden"
      >
        <h1 className="font-bold text-green-700 mb-2 relative text-3xl">
          {title}
        </h1>
        <div className="flex justify-center mb-4">
          <i className="fa-solid fa-circle-check text-green-700 text-5xl"></i>
        </div>

        <p className="py-3 text-gray-600 mb-4 relative">
          {message}
        </p>

        <div className="mt-2 relative">
          <button
            onClick={handleContinue}
            className="btn text-green-700 bg-green-50 hover:bg-green-100 border border-green-300 rounded-md w-50"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
});