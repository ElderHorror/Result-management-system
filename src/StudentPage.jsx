import React, { useState, useEffect } from 'react';
import SideBar from './Component/SideBar';
import Header from './Component/Header';
import { IoIosArrowForward } from "react-icons/io";
import { Link } from 'react-router-dom';
import StudentLevels from './Sections/SchoolLevel';
import { db } from '../firebaseConfig';
import { collection, getDocs } from "firebase/firestore";

const StudentApp = () => {
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentCollection = collection(db, "students");
        const studentSnapshot = await getDocs(studentCollection);

        const levelCounts = {};
        studentSnapshot.docs.forEach(doc => {
          const student = doc.data();
          const level = student.level.toString();  // Ensure level is a string
          levelCounts[level] = (levelCounts[level] || 0) + 1;
        });

        const studentLevelsArray = Object.entries(levelCounts).map(([level, count]) => ({
          level, count
        }));

        setStudentData(studentLevelsArray);
        setLoading(false);
      } catch (err) {
        setError('Error fetching data');
        console.error("Error fetching data: ", err);
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <div className="flex h-screen bg-gray-200 font-poppins">
        <SideBar />
        <main className="flex-1 flex flex-col">
          <Header />
          <h1 className="px-10 text-2xl font-medium pt-[170px] md:pt-4"> Admin Dashboard</h1>
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
          <StudentLevels data={studentData} title="Student Levels" count="Number of Students" />
        </main>
      </div>
    </div>
  );
};

export default StudentApp;
