import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig"; // Adjust the path to your Firebase config
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import SideBar from "./Component/SideBar";
import Header from "./Component/Header";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import StudentView from "./Sections/SchoolView"; // Import the modified StudentView component
import ResultsViewTable from "./Sections/ResultViewTable";

const ResultView = () => {
  const [resultData, setResultData] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "results"), orderBy("studentName", "asc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const results = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Store Firestore document ID
        ...doc.data(),
      }));

      setResultData(results);
    });

    return () => unsubscribe();
  }, []);

  // Define the column configuration for results
  const resultColumns = [
    { header: "Student Name", key: "studentName" },
    { header: "Matric Number", key: "matricNumber" },
    { header: "Department", key: "department" },
    { header: "CGPA", key: "cgpa" },
    {
      header: "Action",
      key: "action",
      render: (item) => (
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
    // Logic to add a new result (Firestore write logic can be added here)
  };

  // Handle Edit button click
  const handleEdit = (updatedResult) => {
    console.log("Updated Result Data:", updatedResult);
    // Logic to update result (Firestore update logic can be added here)
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
            <Link to="/result" className="flex flex-row gap-1 text-purple-700">
              <IoIosArrowForward size={23} className="pt-1" />
              Results
            </Link>
          </div>
          {/* Use the StudentView component with the dynamic Firebase data */}
          <ResultsViewTable
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
