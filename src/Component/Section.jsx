import React from 'react';
import { SiGoogleclassroom } from "react-icons/si";
import { MdGroups3 } from "react-icons/md";
import { IoIosPaper } from "react-icons/io";
import { FaBook } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Section = () => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-2 gap-4 md:gap-8 mx-4 mx-8 md:mx-10  md:pt-0">
      
      <Link to="/student" className="bg-white shadow p-4 flex items-center h-28">
        <div className="bg-blue-300 rounded-full p-3">
          <MdGroups3 size={30} className="text-blue-600" />
        </div>
        <div className="ml-4">
          <h3 className="text-xl font-normal text-gray-900">500</h3>
          <p className="text-sm text-gray-400">Students</p>
        </div>
      </Link>

      <Link to="/course" className="bg-white shadow p-4 flex items-center h-28">
        <div className="bg-purple-300 rounded-full p-3">
          <FaBook size={30} className="text-purple-600" />
        </div>
        <div className="ml-4">
          <h3 className="text-xl font-normal text-gray-900">61</h3>
          <p className="text-sm text-gray-400">Courses</p>
        </div>
      </Link>

      <Link to="/level" className="bg-white shadow p-4 flex items-center h-28">
        <div className="bg-pink-300 rounded-full p-3">
          <SiGoogleclassroom size={30} className="text-pink-600" />
        </div>
        <div className="ml-4">
          <h3 className="text-xl font-normal text-gray-900">4</h3>
          <p className="text-sm text-gray-400">Level</p>
        </div>
      </Link>

      <Link to="/result" className="bg-white shadow p-4 flex items-center h-28">
        <div className="bg-red-300 rounded-full p-3">
          <IoIosPaper size={30} className="text-red-600" />
        </div>
        <div className="ml-4">
          <h3 className="text-xl font-normal text-gray-900">500</h3>
          <p className="text-sm text-gray-400">Results</p>
        </div>
      </Link>

    </section>
  );
};

export default Section;
