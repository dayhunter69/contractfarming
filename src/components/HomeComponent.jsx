import React from 'react';
import p4pBanner from '../assets/P4P-Banner.png';
const HomeComponent = () => {
  return (
    <img src={p4pBanner} alt="p4p" />
    // <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
    //   <div className="text-center">
    //     <h1 className="text-5xl font-bold mb-4">
    //       Welcome to Shreenagar Agritech's Contract Farming
    //     </h1>
    //     <p className="text-xl mb-8">कुखुरा पालनको लागि साझेदारी</p>
    //     <div className="space-x-4">
    //       <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition duration-300">
    //         Get Started
    //       </button>
    //       <button className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition duration-300">
    //         Learn More
    //       </button>
    //     </div>
    //   </div>
    // </div>
  );
};

export default HomeComponent;
