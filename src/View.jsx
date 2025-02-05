import React, { useEffect, useState } from "react";
import SideBar from "./Component/SideBar";
import Header from "./Component/Header";
import { IoIosArrowForward } from "react-icons/io";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import StudentView from "./Sections/SchoolView";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const View = () => {
  const location = useLocation();
  const { source, level } = location.state || {}; // Get the source and level from state
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let collectionName = "";
        switch (source) {
          case "student":
            collectionName = "students";
            break;
          case "course":
            collectionName = "courses";
            break;
          case "result":
            collectionName = "results";
            break;
          default:
            collectionName = "students"; // Default to students
        }

        const querySnapshot = await getDocs(collection(db, collectionName));
        const fetchedData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter data based on level (if applicable)
        if (source === "student" && level) {
          const filteredData = fetchedData.filter(
            (item) => item.level.toString() === level
          );
          setData(filteredData);
        } else {
          setData(fetchedData);
        }

        setLoading(false);
      } catch (err) {
        setError("Error fetching data");
        console.error("Error fetching data: ", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [source, level]);

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
            <Link to="/student" className="flex flex-row gap-1 text-purple-700">
              <IoIosArrowForward size={23} className="pt-1" />
              {source === "student" ? "Student Details" : source === "course" ? "Course Details" : "Result Details"}
            </Link>
          </div>
          <StudentView
            data={data}
            title={source === "student" ? "Student Details" : source === "course" ? "Course Details" : "Result Details"}
            count={`Number of ${source === "student" ? "Students" : source === "course" ? "Courses" : "Results"}`}
          />
        </main>
      </div>
    </div>
  );
};

export default View;