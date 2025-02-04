import React from "react";
import SideBar from "./Component/SideBar";
import Header from "./Component/Header";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import StudentView from "./Sections/SchoolView"; // Import the modified StudentView component

// Sample student data with the required fields
const studentData = [
  {
    matricNo: "swe/2021/001",
    name: "Chinedu Okoro",
    department: "Software Engineering",
    cgpa: 4.5,
    suspended: "NO",
    yearOfEntry: 2021,
    modeOfEntry: "Normal",
  },
  {
    matricNo: "csc/2020/045",
    name: "Aisha Bello",
    department: "Computer Science",
    cgpa: 3.8,
    suspended: "YES",
    yearOfEntry: 2020,
    modeOfEntry: "D.E",
  },
  {
    matricNo: "cyb/2022/012",
    name: "Emeka Nwankwo",
    department: "Cyber Security",
    cgpa: 4.2,
    suspended: "NO",
    yearOfEntry: 2022,
    modeOfEntry: "Jupeb",
  },
  // Add more student data as needed
];

const View = () => {
  return (
    <div>
      <div className="flex h-screen bg-gray-200 font-poppins">
        <SideBar />
        <main className="flex-1 flex flex-col overflow-y-auto">
          <Header />
          <h1 className="px-10 text-2xl font-medium pt-[170px] md:pt-4">
            Admin Dashboard
          </h1>
          <div className="flex flex-row gap-1 px-10 pt-2 pb-8 text-base text-gray-700">
            <p>Home</p>
            <Link to="/" className="flex flex-row gap-1 hover:text-purple-400">
              <IoIosArrowForward size={23} className="pt-1" />
              Admin
            </Link>
            <Link to="/student" className="flex flex-row gap-1 text-purple-700">
              <IoIosArrowForward size={23} className="pt-1" />
              Student Courses
            </Link>
          </div>
          {/* Use the StudentView component with the updated student data */}
          <StudentView
            data={studentData}
            title="Student Details"
            count="Number of Students"
          />
        </main>
      </div>
    </div>
  );
};

export default View;
