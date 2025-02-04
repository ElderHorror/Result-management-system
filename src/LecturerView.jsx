import React from "react";
import SideBar from "./Component/SideBar";
import Header from "./Component/Header";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import StudentView from "./Sections/SchoolView"; // Import the modified StudentView component

// Sample lecturer data with the required fields
const lecturerData = [
  {
    lecturerName: "Dr. John Doe",
    courseCode: "CSC101",
    courseTitle: "Introduction to Programming",
    resultsSubmitted: "Yes",
  },
  {
    lecturerName: "Prof. Jane Smith",
    courseCode: "CSC201",
    courseTitle: "Data Structures",
    resultsSubmitted: "No",
  },
  {
    lecturerName: "Dr. Emeka Nwankwo",
    courseCode: "CYB101",
    courseTitle: "Cyber Security Fundamentals",
    resultsSubmitted: "Yes",
  },
  // Add more lecturer data as needed
];

// Define the column configuration for lecturers
const lecturerColumns = [
  { header: "Lecturer Name", key: "lecturerName" },
  { header: "Course Code", key: "courseCode" },
  { header: "Course Title", key: "courseTitle" },
  {
    header: "Results Submitted",
    key: "resultsSubmitted",
    format: (value) => (
      <span className={value === "Yes" ? "text-green-600" : "text-red-600"}>
        {value}
      </span>
    ),
  },
  {
    header: "Action",
    key: "action",
    render: (item, handleEdit) => (
      <button
        className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={() => handleEdit(item)} // Pass the item to the edit handler
      >
        Edit
      </button>
    ),
  },
];

// Handle Add button click
const handleAdd = (newLecturer) => {
  console.log("New Lecturer Data:", newLecturer);
  // Add logic to update the data (e.g., state or API call)
};

// Handle Edit button click
const handleEdit = (updatedLecturer) => {
  console.log("Updated Lecturer Data:", updatedLecturer);
  // Add logic to update the data (e.g., state or API call)
};

const LecturerView = () => {
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
            <Link to="/lecturer" className="flex flex-row gap-1 text-purple-700">
              <IoIosArrowForward size={23} className="pt-1" />
              Lecturers
            </Link>
          </div>
          {/* Use the StudentView component with the updated lecturer data and columns */}
          <StudentView
            data={lecturerData}
            columns={lecturerColumns}
            title="Lecturer Details"
            count="Number of Lecturers"
            onAdd={handleAdd} // Pass the Add handler
            onEdit={handleEdit} // Pass the Edit handler
          />
        </main>
      </div>
    </div>
  );
};

export default LecturerView;