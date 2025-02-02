import React, { useState, useEffect } from 'react';
import SideBar from './Component/SideBar';
import Header from './Component/Header';
import { IoIosArrowForward } from "react-icons/io";
import { Link } from 'react-router-dom';
import { db } from '../firebaseConfig';  // Ensure Firebase config is imported
import { collection, getDocs, query, where } from "firebase/firestore";
import StudentLevels from './Sections/SchoolLevel';

const CourseApp = () => {
  const [courseData, setCourseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [semester, setSemester] = useState("1st Semester"); // Track semester state
  const [level, setLevel] = useState("100"); // Track level state (default to 100)

  // Fetch courses based on selected semester and level
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courseCollection = collection(db, "courses");
        const semesterQuery = query(courseCollection, 
          where("semester", "==", semester), 
          where("level", "==", level)  // Filter by level
        );
        const courseSnapshot = await getDocs(semesterQuery);

        const courseList = [];
        courseSnapshot.docs.forEach(doc => {
          courseList.push(doc.data());
        });

        setCourseData(courseList);
      } catch (err) {
        setError('Error fetching course data');
        console.error("Error fetching courses: ", err);
      }
      setLoading(false);
    };

    fetchCourses();
  }, [semester, level]);  // Fetch courses whenever semester or level changes

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
            <Link to="/course" className="flex flex-row gap-1 text-purple-700">
              <IoIosArrowForward size={23} className="pt-1" />
              Student Courses
            </Link>
          </div>

          {/* Semester Selection */}
          <div className="px-10 py-4">
            <button
              onClick={() => setSemester("1st Semester")}
              className={`px-4 py-2 rounded-md ${semester === "1st Semester" ? "bg-purple-700 text-white" : "bg-gray-300"}`}
            >
              1st Semester
            </button>
            <button
              onClick={() => setSemester("2nd Semester")}
              className={`px-4 py-2 rounded-md ${semester === "2nd Semester" ? "bg-purple-700 text-white" : "bg-gray-300"}`}
            >
              2nd Semester
            </button>
          </div>

          {/* Level Selection */}
          <div className="px-10 py-4">
            <button
              onClick={() => setLevel("100")}
              className={`px-4 py-2 rounded-md ${level === "100" ? "bg-purple-700 text-white" : "bg-gray-300"}`}
            >
              100 Level
            </button>
            <button
              onClick={() => setLevel("200")}
              className={`px-4 py-2 rounded-md ${level === "200" ? "bg-purple-700 text-white" : "bg-gray-300"}`}
            >
              200 Level
            </button>
            <button
              onClick={() => setLevel("300")}
              className={`px-4 py-2 rounded-md ${level === "300" ? "bg-purple-700 text-white" : "bg-gray-300"}`}
            >
              300 Level
            </button>
            <button
              onClick={() => setLevel("400")}
              className={`px-4 py-2 rounded-md ${level === "400" ? "bg-purple-700 text-white" : "bg-gray-300"}`}
            >
              400 Level
            </button>
          </div>

          {/* Display Courses for the Selected Semester and Level */}
          <div className="px-10 py-4">
            <h2 className="text-xl font-medium">Courses in {semester} - Level {level}</h2>
            <ul className="mt-4">
              {courseData.length > 0 ? (
                courseData.map((course, index) => (
                  <li key={index} className="py-2">{course.course_name}</li>
                ))
              ) : (
                <li>No courses available for this semester and level.</li>
              )}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CourseApp;
