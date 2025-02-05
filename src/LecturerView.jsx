import React, { useState, useEffect } from "react";
import SideBar from "./Component/SideBar";
import Header from "./Component/Header";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import LecturerViewTable from "./Sections/LecturerViewTable";

const LecturerView = () => {
  const [lecturers, setLecturers] = useState([]); // State to hold lecturers data

  // Fetch lecturers data from Firebase
  useEffect(() => {
    const lecturersRef = collection(db, "lecturers");

    const unsubscribe = onSnapshot(lecturersRef, (snapshot) => {
      const lecturerList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLecturers(lecturerList);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // Define the column configuration for lecturers
  const lecturerColumns = [
    { header: "Lecturer Name", key: "lecturer_name" },
    { header: "Course Code", key: "course_code" },
    { header: "Course Title", key: "course_name" },
    { header: "Level", key: "level" },
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
      render: (item) => (
        <button
          className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={() => handleEdit(item)}
        >
          Edit
        </button>
      ),
    },
  ];

  // Handle Add button click
  const handleAdd = async (newLecturer) => {
    try {
      await addDoc(collection(db, "lecturers"), newLecturer);
      console.log("Lecturer added:", newLecturer);
    } catch (error) {
      console.error("Error adding lecturer:", error);
    }
  };

  // Handle Edit button click
  const handleEdit = async (updatedLecturer) => {
    try {
      const lecturerRef = doc(db, "lecturers", updatedLecturer.id);
      await updateDoc(lecturerRef, updatedLecturer);
      console.log("Lecturer updated:", updatedLecturer);
    } catch (error) {
      console.error("Error updating lecturer:", error);
    }
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

          {/* Pass real-time Firebase data */}
          <LecturerViewTable
            data={lecturers}
            columns={lecturerColumns}
            title="Lecturer Details"
            count={lecturers.length} // Pass the dynamic count
            onAdd={handleAdd}
            onEdit={handleEdit}
          />
        </main>
      </div>
    </div>
  );
};

export default LecturerView;
