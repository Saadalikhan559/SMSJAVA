import Lottie from "lottie-react";
import schoolboyAnimation from "../../assets/backtoschool.json";

const LoginModal = ({ onClose }) => {
  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl p-8 max-w-3xl w-full mx-4 flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* <div className="flex justify-center items-center min-h-[200px] w-full">
          {/* <div className="text-center">
            {/* <h1 className="textTheme text-5xl  font-medium animate-pulse">
              Welcome!
            </h1> */}
            {/* <p className="mt-4 text-xl text-gray-600">
              To Our Vibrant Learning Community
            </p> */}
          {/* </div> */} 
        {/* </div> */} 
        
        <div className="mt-16 w-full max-w-md flex justify-center">
          <Lottie
            animationData={schoolboyAnimation}
            loop={true}
            className="schoolBoyAnimation animate-bounce"
          />  <h1 className="textTheme text-7xl  font-medium animate-pulse">
              Welcome!
            </h1>
        </div>     
        <div className="mb-8 text-center max-w-2xl">
          {/* <p className="text-lg text-gray-700">
            We're thrilled to have you here! Get ready for an exciting 
            journey of discovery, growth, and achievement.
          </p> */}
          <p className=" text-gray-600">
            Our doors are always open to curious minds and passionate learners.
          </p>
          <button 
            className="mt-6 px-6 py-2 btn bgTheme btn-primary w-full"
            onClick={onClose}
          >
            Let's Begin
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;