import React, { useEffect, useState } from "react";
import SideBar from "./Component/SideBar";
import Header from "./Component/Header";
import { IoIosArrowForward } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import StudentView from "./Sections/SchoolView";
import { db } from "../firebaseConfig";
import { collection, getDocs, doc, updateDoc, addDoc } from "firebase/firestore";

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
];

const View = () => {
  const location = useLocation();
  const { source, level } = location.state || {};
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
            collectionName = "students";
        }

        const querySnapshot = await getDocs(collection(db, collectionName));
        const fetchedData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

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

  const handleAdd = async (newItem) => {
    try {
      const collectionName = source === "student" ? "students" : source === "course" ? "courses" : "results";
      const docRef = await addDoc(collection(db, collectionName), newItem);
      setData(prev => [...prev, { id: docRef.id, ...newItem }]);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleEdit = async (updatedItem) => {
    try {
      const collectionName = source === "student" ? "students" : source === "course" ? "courses" : "results";
      const docRef = doc(db, collectionName, updatedItem.id);
      await updateDoc(docRef, updatedItem);
      setData(prev => 
        prev.map(item => item.id === updatedItem.id ? updatedItem : item)
      );
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

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
            columns={columns}
            title={source === "student" ? "Student Details" : source === "course" ? "Course Details" : "Result Details"}
            count={`Number of ${source === "student" ? "Students" : source === "course" ? "Courses" : "Results"}`}
            onAdd={handleAdd}
            onEdit={handleEdit}
          />
        </main>
      </div>
    </div>
  );
};

export default View;