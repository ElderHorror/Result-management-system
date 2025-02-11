import React, { useState } from "react";
import SideBar from "./Component/SideBar";
import Header from "./Component/Header";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import StudentView from "./Sections/SchoolView"; // Import the modified StudentView component

// Sample student data with the required fields
const initialStudentData = [
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

// Define the column configuration
const columns = [
  { header: "Matric No", key: "matricNo" },
  { header: "Name", key: "name" },
  { header: "Department", key: "department" },
  { header: "CGPA", key: "cgpa" },
  {
    header: "Suspended",
    key: "suspended",
    format: (value) => (
      <span className={value === "YES" ? "text-green-600" : "text-red-600"}>
        {value}
      </span>
    ),
  },
  { header: "Year of Entry", key: "yearOfEntry" },
  { header: "Mode of Entry", key: "modeOfEntry" },
  {
    header: "Action",
    key: "action",
    render: (item, handleEdit) => (
      <button
        className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={() => handleEdit(item)} // Pass the item to the handleEdit function
      >
        Edit
      </button>
    ),
  },
];

const View = () => {
  const [studentData, setStudentData] = useState(initialStudentData);

  // Function to handle adding a new student
  const onAdd = (newStudent) => {
    setStudentData([...studentData, newStudent]); // Add the new student to the data
  };

  // Function to handle editing a student
  const onEdit = (updatedStudent) => {
    const updatedData = studentData.map((student) =>
      student.matricNo === updatedStudent.matricNo ? updatedStudent : student
    );
    setStudentData(updatedData); // Update the student data
  };

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
            <Link to="/" className="flex flex-row gap-1 hover:text-purple-400">
                        <p>Home</p>
                      </Link>
            <Link to="/" className="flex flex-row gap-1 hover:text-purple-400">
              <IoIosArrowForward size={23} className="pt-1" />
              Admin
            </Link>
            <Link to="/student" className="flex flex-row gap-1 text-purple-700">
              <IoIosArrowForward size={23} className="pt-1" />
              Students
            </Link>
          </div>
          {/* Use the StudentView component with the updated student data and columns */}
          <StudentView
            data={studentData}
            columns={columns}
            title="Student Details"
            count="Number of Students"
            onAdd={onAdd} // Pass the onAdd function as a prop
            onEdit={onEdit} // Pass the onEdit function as a prop
          />
        </main>
      </div>
    </div>
  );
};

export default View;