import React, { useEffect, useState } from 'react';
import SideBar from './Component/SideBar';
import Header from './Component/Header';
import { IoIosArrowForward } from "react-icons/io";
import { Link } from 'react-router-dom';
import StudentLevels from './Sections/SchoolLevel';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebaseConfig'; // Import Firestore instance

const StudentApp = () => {
  const [studentData, setStudentData] = useState([]);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "students"));
        const levelCount = {};

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const level = data.level;

          // Count students per level
          levelCount[level] = (levelCount[level] || 0) + 1;
        });

        // Convert object to array and sort by level
        const sortedData = Object.keys(levelCount)
          .sort((a, b) => parseInt(a) - parseInt(b))
          .map(level => ({
            level,
            count: levelCount[level]
          }));

        setStudentData(sortedData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchStudentData();
  }, []);

  return (
    <div className="flex h-screen bg-gray-200 font-poppins">
      <SideBar />
      <main className="flex-1 flex flex-col">
        <Header />
        <h1 className="px-10 text-2xl font-medium pt-[170px] md:pt-4">Admin Dashboard</h1>
        <div className="flex flex-row gap-1 px-10 pt-2 pb-8 text-base text-gray-700">
          <p>Home</p>
          <Link to="/" className="flex flex-row gap-1 hover:text-purple-400">
            <IoIosArrowForward size={23} className="pt-1" />
            Admin
          </Link>
          <Link to="/student" className="flex flex-row gap-1 text-purple-700">
            <IoIosArrowForward size={23} className="pt-1" />
            Student Level
          </Link>
        </div>
        <StudentLevels data={studentData} title="Student Levels" count="Number of Students" view="/view" />
      </main>
    </div>
  );
};

export default StudentApp;
