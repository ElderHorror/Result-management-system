import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig"; // Adjust the path to your Firebase config
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import SideBar from "./Component/SideBar";
import Header from "./Component/Header";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import StudentLevels from "./Sections/SchoolLevel";

const ResultApp = () => {
  const [studentData, setStudentData] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "students"), orderBy("level", "asc"));

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

      const handleLevelSelect = (level) => {
        sessionStorage.setItem("selectedLevel", level);
      };
      

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
          <Link to="/" className="flex flex-row gap-1 hover:text-purple-400">Home</Link>
          <Link to="/" className="flex flex-row gap-1 hover:text-purple-400">
            <IoIosArrowForward size={23} className="pt-1" />
            Admin
          </Link>
          <Link to="/student" className="flex flex-row gap-1 text-purple-700">
            <IoIosArrowForward size={23} className="pt-1" />
            Student Result
          </Link>
        </div>

        {/* Pass summarized data */}
        <StudentLevels
          data={studentData}
          title="Student Result"
          count="Number of Student Results"
          view="/ResultView"
          
        />
      </main>
    </div>
  );
};

export default ResultApp;
