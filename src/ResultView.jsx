import React from "react";
import SideBar from "./Component/SideBar";
import Header from "./Component/Header";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import StudentView from "./Sections/SchoolView"; // Import the modified StudentView component

// Sample result data with the required fields
const resultData = [
  {
    studentName: "Chinedu Okoro",
    matricNumber: "swe/2021/001",
    department: "Software Engineering",
    cgpa: 4.5,
  },
  {
    studentName: "Aisha Bello",
    matricNumber: "csc/2020/045",
    department: "Computer Science",
    cgpa: 3.8,
  },
  {
    studentName: "Emeka Nwankwo",
    matricNumber: "cyb/2022/012",
    department: "Cyber Security",
    cgpa: 4.2,
  },
  // Add more result data as needed
];

// Define the column configuration for results
const resultColumns = [
  { header: "Student Name", key: "studentName" },
  { header: "Matric Number", key: "matricNumber" },
  { header: "Department", key: "department" },
  { header: "CGPA", key: "cgpa" },
  {
    header: "Action",
    key: "action",
    render: (item, handleEdit) => (
      <button
        className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={() => handleEdit(item)} // Pass the item to the edit handler
      >
        View Result
      </button>
    ),
  },
];

// Handle Add button click
const handleAdd = (newResult) => {
  console.log("New Result Data:", newResult);
  // Add logic to update the data (e.g., state or API call)
};

// Handle Edit button click
const handleEdit = (updatedResult) => {
  console.log("Updated Result Data:", updatedResult);
  // Add logic to update the data (e.g., state or API call)
};

const ResultView = () => {
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
            <Link to="/result" className="flex flex-row gap-1 text-purple-700">
              <IoIosArrowForward size={23} className="pt-1" />
              Results
            </Link>
          </div>
          {/* Use the StudentView component with the updated result data and columns */}
          <StudentView
            data={resultData}
            columns={resultColumns}
            title="Result Details"
            count="Number of Results"
            onAdd={handleAdd} // Pass the Add handler
            onEdit={handleEdit} // Pass the Edit handler
          />
        </main>
      </div>
    </div>
  );
};

export default ResultView;