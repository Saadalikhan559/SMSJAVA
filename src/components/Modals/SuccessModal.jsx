import React, { forwardRef, useImperativeHandle, useState } from "react";

export const SuccessModal = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    show: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }));

  if (!isOpen) return null;

  return (
<div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 backdrop-blur-sm">
  <div className="bg-white rounded-xl p-6 shadow-2xl border border-green-100 text-center w-80 max-w-[85vw] relative overflow-hidden">

    
    <h3 className="font-bold text-xl text-green-800 mb-2 relative">Success!</h3>
    <p className="py-3 text-gray-600 mb-4 relative">Your action was completed successfully.</p>
    
    <div className="mt-2 relative">
      <button
        onClick={() => setIsOpen(false)}
        className="btn btn-success btn-sm text-white rounded-full px-6 hover:shadow-lg"
      >
        Continue
      </button>
    </div>
  </div>
</div>
  );
});
