import React, { useState } from 'react';
import { MdSubject, MdOutlineGroups } from "react-icons/md";
import { TbAlertSquareRoundedFilled } from "react-icons/tb";
import { RiExchangeBoxFill } from "react-icons/ri";
import { IoIosArrowForward } from "react-icons/io";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { SiGoogleclassroom } from "react-icons/si";
import { FiMenu } from "react-icons/fi";

const SideBar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden fixed top-4 left-4 bg-[#441752] text-white p-2 rounded shadow-lg z-50"
        onClick={toggleSidebar}
      >
        <FiMenu size={24} />
      </button>

      <aside className={`fixed md:static top-0 left-0 h-full w-64 bg-gradient-to-b from-black to-[#2A004E] text-white flex flex-col transform ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 ease-in-out z-50 shadow-lg md:shadow-none`}>      
        {/* Close Button for Mobile */}
        <button 
          className="absolute top-4 right-4 md:hidden text-white text-xl" 
          onClick={toggleSidebar}
        >
          ✖
        </button>
        
        <nav className="flex flex-col p-4 space-y-2 flex-grow">
          <h2 className="text-sm text-gray-400 font-bold">MAIN CATEGORY</h2>
          <ul>
            <li className="flex items-center hover:bg-[#441752] p-3 rounded cursor-pointer">
              <MdOutlineDashboardCustomize size={20} />
              <span className="px-4">Dashboard</span>
            </li>
          </ul>
          
          <h2 className="text-sm text-gray-400 font-bold mt-4">APPEARANCE</h2>
          <ul className="space-y-2">
            <li className="hover:bg-[#441752] p-3 rounded flex items-center cursor-pointer">
              <SiGoogleclassroom size={20} />
              <span className="px-4">Level</span>
              <IoIosArrowForward className="ml-auto" />
            </li>
            <li className="hover:bg-[#441752] p-3 rounded flex items-center cursor-pointer">
              <MdSubject size={20} />
              <span className="px-4">Courses</span>
              <IoIosArrowForward className="ml-auto" />
            </li>
            <li className="hover:bg-[#441752] p-3 rounded flex items-center cursor-pointer">
              <MdOutlineGroups size={20} />
              <span className="px-4">Students</span>
              <IoIosArrowForward className="ml-auto" />
            </li>
            <li className="hover:bg-[#441752] p-3 rounded flex items-center cursor-pointer">
              <TbAlertSquareRoundedFilled size={20} />
              <span className="px-4">Results</span>
              <IoIosArrowForward className="ml-auto" />
            </li>
            <li className="hover:bg-[#441752] p-3 rounded flex items-center cursor-pointer">
              <RiExchangeBoxFill size={20} />
              <span className="px-4">Change Password</span>
            </li>
          </ul>
        </nav>
        
        {/* Sign Out Button */}
        <div className="p-4">
          <button className="hover:bg-[#441752] p-3 rounded flex items-center w-full cursor-pointer">
            <FiLogOut size={20} />
            <span className="px-4">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default SideBar;