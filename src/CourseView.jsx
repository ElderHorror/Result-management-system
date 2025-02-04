import React from "react";
import SideBar from "./Component/SideBar";
import Header from "./Component/Header";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import StudentView from "./Sections/SchoolView"; // Import the modified StudentView component

// Sample course data with the required fields
const courseData = [
  {
    courseTitle: "Introduction to Programming",
    courseCode: "CSC101",
    level: 100,
    units: 3,
    department: "Computer Science",
  },
  {
    courseTitle: "Data Structures",
    courseCode: "CSC201",
    level: 200,
    units: 4,
    department: "Computer Science",
  },
  {
    courseTitle: "Cyber Security Fundamentals",
    courseCode: "CYB101",
    level: 100,
    units: 2,
    department: "Cyber Security",
  },
  // Add more course data as needed
];

// Define the column configuration for courses
const courseColumns = [
  { header: "Course Title", key: "courseTitle" },
  { header: "Course Code", key: "courseCode" },
  { header: "Level", key: "level" },
  { header: "Units", key: "units" },
  { header: "Department", key: "department" },
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
const handleAdd = (newCourse) => {
  console.log("New Course Data:", newCourse);
  // Add logic to update the data (e.g., state or API call)
};

// Handle Edit button click
const handleEdit = (updatedCourse) => {
  console.log("Updated Course Data:", updatedCourse);
  // Add logic to update the data (e.g., state or API call)
};

const CourseView = () => {
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
            <Link to="/course" className="flex flex-row gap-1 text-purple-700">
              <IoIosArrowForward size={23} className="pt-1" />
              Courses
            </Link>
          </div>
          {/* Use the StudentView component with the updated course data and columns */}
          <StudentView
            data={courseData}
            columns={courseColumns}
            title="Course Details"
            count="Number of Courses"
            onAdd={handleAdd} // Pass the Add handler
            onEdit={handleEdit} // Pass the Edit handler
          />
        </main>
      </div>
    </div>
  );
};

export default CourseView;