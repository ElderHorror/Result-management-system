import React, { useState, useEffect } from "react";
import SideBar from "./Component/SideBar";
import Header from "./Component/Header";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import StudentLevels from "./Sections/SchoolLevel";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Import Firebase instance


const CourseApp = () => {
  const [studentData, setStudentData] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "courses"), orderBy("level", "asc"));

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
      <main className="flex-1 flex flex-col">
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
            Student Courses
          </Link>
        </div>
        <StudentLevels
          data={studentData}
          title="Student Courses"
          count="Number of Courses"
          view="/CourseView"
        />
      </main>
    </div>
  );
};

export default CourseApp;
