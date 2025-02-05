import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig"; // Firebase config
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import SideBar from "./Component/SideBar";
import Header from "./Component/Header";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import StudentLevels from "./Sections/SchoolLevel";

const LevelApp = () => {
  const [studentData, setStudentData] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "lecturers"), orderBy("level", "asc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const levelCounts = {};

      querySnapshot.forEach((doc) => {
        const level = doc.data().level;
        levelCounts[level] = (levelCounts[level] || 0) + 1;
      });

      const formattedData = Object.keys(levelCounts).map((level) => ({
        level,
        count: levelCounts[level],
      }));

      setStudentData(formattedData);
    });

    return () => unsubscribe();
  }, []);

  return (
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

        {/* Pass summarized data */}
        <StudentLevels
          data={studentData}
          title="Lecturer Details"
          count="Number of Lecturers"
          view="/LecturerView"
        />
      </main>
    </div>
  );
};

export default LevelApp;
