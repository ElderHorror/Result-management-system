import React from 'react';
import { FaBell, FaEnvelope, FaSearch } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";

const Header = () => {
  return (
    <header className="bg-white shadow p-4 w-full flex flex-col md:flex-row justify-between items-center px-4 md:px-10 
      fixed md:relative top-0 left-0 z-50 md:static">
      
      <img src="/chrisland logo.svg" alt="Chrisland University Logo" className="h-12 w-auto" />
      
      <div className="flex items-center md:justify-between w-full gap-3 md:w-[75%] mt-4 md:mt-0">
        {/* Search bar */}
        <div className="flex items-center w-full md:w-[60%] relative">
          <input 
            type="text" 
            placeholder="Search..." 
            className="flex-grow p-2 focus:outline-none rounded-3xl pl-4 bg-gray-200"
          />
          <span className="absolute right-0 top-0 px-4 py-2 text-gray-600">
            <FaSearch size={20} />
          </span>
        </div>
        
        {/* Notification and settings icons */}
        <div className="flex space-x-2 md:space-x-4">
          <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
            <IoSettingsSharp size={20} className="text-gray-600" />
          </button>
          <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
            <FaBell size={20} className="text-gray-600" />
          </button>
          <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
            <FaEnvelope size={20} className="text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
