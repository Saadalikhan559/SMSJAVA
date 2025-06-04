// SuccessModal.js
import React, { forwardRef, useImperativeHandle, useRef } from "react";

export const SuccessModal = forwardRef((props, ref) => {
  const dialogRef = useRef();

  useImperativeHandle(ref, () => ({
    show: () => dialogRef.current.showModal()
  }));

  return (
    <dialog ref={dialogRef} className="modal modal-bottom sm:modal-middle">
              <div className="modal-box border border-green-500 text-center">
        <h3 className="font-bold text-lg text-green-600">Success!</h3>
        <p className="py-4 text-gray-700">Your action was successful.</p>
        <div className="modal-action justify-center">
          <form method="dialog">
            <button className="btn btn-success">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
});