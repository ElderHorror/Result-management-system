import React, { useState } from "react";
import { MdSubject, MdOutlineGroups } from "react-icons/md";
import { TbAlertSquareRoundedFilled } from "react-icons/tb";
import { RiExchangeBoxFill } from "react-icons/ri";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import { Link } from "react-router-dom";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { SiGoogleclassroom } from "react-icons/si";
import { FiMenu } from "react-icons/fi";

const SideBar = ({ isOpen, toggleSidebar }) => {
  // State to manage dropdown visibility
  const [openDropdown, setOpenDropdown] = useState(null);

  // Function to toggle dropdown
  const toggleDropdown = (dropdown) => {
    setOpenDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 bg-[#441752] text-white p-2 rounded shadow-lg z-50"
        onClick={toggleSidebar}
      >
        <FiMenu size={24} />
      </button>

      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-gradient-to-b from-black to-[#2A004E] text-white flex flex-col transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-50 shadow-lg md:shadow-none`}
      >
        {/* Close Button for Mobile */}
        <button
          className="absolute top-4 right-4 md:hidden text-white text-xl"
          onClick={toggleSidebar}
        >
          ✖
        </button>

        {/* Sidebar Content */}
        <nav className="flex flex-col p-4 space-y-2 flex-grow overflow-y-auto">
          <h2 className="text-sm text-gray-400 font-bold">MAIN CATEGORY</h2>
          <ul>
            <Link to="/">
              <li className="flex items-center hover:bg-[#441752] p-3 rounded cursor-pointer">
                <MdOutlineDashboardCustomize size={20} />
                <span className="px-4">Dashboard</span>
              </li>
            </Link>
          </ul>

          <h2 className="text-sm text-gray-400 font-bold mt-4">APPEARANCE</h2>
          <ul className="space-y-2">
            {/* Level Dropdown */}
            <li>
              <div
                className="hover:bg-[#441752] p-3 rounded flex items-center cursor-pointer"
                onClick={() => toggleDropdown("level")}
              >
                <SiGoogleclassroom size={20} />
                <span className="px-4">Lecturer</span>
                {openDropdown === "level" ? (
                  <IoIosArrowDown className="ml-auto" />
                ) : (
                  <IoIosArrowForward className="ml-auto" />
                )}
              </div>
              {openDropdown === "level" && (
                <ul className="pl-8 mt-2 space-y-2">
                  {[100, 200, 300, 400].map((level) => (
                    
                    <li
                      key={level}
                      className="hover:bg-[#441752] p-2 rounded cursor-pointer"
                    >
                      {level}
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* Courses Dropdown */}
            <li>
              <div
                className="hover:bg-[#441752] p-3 rounded flex items-center cursor-pointer"
                onClick={() => toggleDropdown("courses")}
              >
                <MdSubject size={20} />
                <span className="px-4">Courses</span>
                {openDropdown === "courses" ? (
                  <IoIosArrowDown className="ml-auto" />
                ) : (
                  <IoIosArrowForward className="ml-auto" />
                )}
              </div>
              {openDropdown === "courses" && (
                <ul className="pl-8 mt-2 space-y-2">
                  {[100, 200, 300, 400].map((course) => (
                    <li
                      key={course}
                      className="hover:bg-[#441752] p-2 rounded cursor-pointer"
                    >
                      {course}
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* Students Dropdown */}
            <li>
              <div
                className="hover:bg-[#441752] p-3 rounded flex items-center cursor-pointer"
                onClick={() => toggleDropdown("students")}
              >
                <MdOutlineGroups size={20} />
                <span className="px-4">Students</span>
                {openDropdown === "students" ? (
                  <IoIosArrowDown className="ml-auto" />
                ) : (
                  <IoIosArrowForward className="ml-auto" />
                )}
              </div>
              {openDropdown === "students" && (
                <ul className="pl-8 mt-2 space-y-2">
                  {[100, 200, 300, 400].map((student) => (
                    <li
                      key={student}
                      className="hover:bg-[#441752] p-2 rounded cursor-pointer"
                    >
                      {student}
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* Results Dropdown */}
            <li>
              <div
                className="hover:bg-[#441752] p-3 rounded flex items-center cursor-pointer"
                onClick={() => toggleDropdown("results")}
              >
                <TbAlertSquareRoundedFilled size={20} />
                <span className="px-4">Results</span>
                {openDropdown === "results" ? (
                  <IoIosArrowDown className="ml-auto" />
                ) : (
                  <IoIosArrowForward className="ml-auto" />
                )}
              </div>
              {openDropdown === "results" && (
                <ul className="pl-8 mt-2 space-y-2">
                  {[100, 200, 300, 400].map((result) => (
                    <li
                      key={result}
                      className="hover:bg-[#441752] p-2 rounded cursor-pointer"
                    >
                      {result}
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* Change Password (No Dropdown) */}
            {/* <li className="hover:bg-[#441752] p-3 rounded flex items-center cursor-pointer">
              <RiExchangeBoxFill size={20} />
              <span className="px-4">Change Password</span>
            </li> */}
          </ul>
        </nav>

        {/* Sign Out Button (Always at the Bottom) */}
        <div className="p-4 mt-auto">
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
