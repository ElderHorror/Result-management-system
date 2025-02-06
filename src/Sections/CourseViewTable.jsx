import React, { useState, useEffect } from "react";
import { FaPlus, FaSearch, FaEdit } from "react-icons/fa";
import Modal from "./Modal";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebaseConfig"; // Import Firebase instance

export default function CourseView({ title }) {
  const [courses, setCourses] = useState([]);
  const [searchCode, setSearchCode] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedLevel, setSelectedLevel] = useState(
    sessionStorage.getItem("selectedLevel") || "100" // Default to 100 if nothing is stored
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newCourse, setNewCourse] = useState({
    course_code: "",
    course_name: "",
    level: selectedLevel,
    department: "",
    units: "",
    semester: "",
  });

  const columns = [
    { key: "course_code", header: "Course Code" },
    { key: "course_name", header: "Course Title" },
    { key: "level", header: "Level" },
    { key: "department", header: "Department" },
    { key: "units", header: "Credit Units" },
    { key: "semester", header: "Semester" },
    { key: "actions", header: "Actions" }, // Added an edit button column
  ];

  useEffect(() => {
    let q;

    if (selectedLevel === "all") {
      q = query(collection(db, "courses"), orderBy("course_code", "asc")); // Fetch all courses
    } else {
      q = query(
        collection(db, "courses"),
        where("level", "==", selectedLevel),
        orderBy("course_code", "asc")
      );
    }

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const courseList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCourses(courseList);
    });

    return () => unsubscribe();
  }, [selectedLevel]); // Re-run when selectedLevel changes
  // Re-run when selectedLevel changes

  const handleSearch = () => {
    const filtered = courses.filter(
      (course) =>
        course.code.includes(searchCode) &&
        course.title.toLowerCase().includes(searchTitle.toLowerCase())
    );
    setCourses(filtered);
  };

  const handleAdd = () => {
    setNewCourse({
      code: "",
      title: "",
      level: selectedLevel,
      department: "",
      credit_units: "",
      semester: "",
    });
    setIsAddModalOpen(true);
  };

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setIsEditModalOpen(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "courses"), newCourse);
      setCourses((prevCourses) => [
        ...prevCourses,
        { id: docRef.id, ...newCourse },
      ]);
      setIsAddModalOpen(false);
      setNewCourse({});
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCourse) {
        await updateDoc(doc(db, "courses", selectedCourse.id), selectedCourse);
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course.id === selectedCourse.id ? selectedCourse : course
          )
        );
      }
      setIsEditModalOpen(false);
      setSelectedCourse(null);
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  return (
    <div className="flex flex-col h-[80%] bg-gray-200 px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        <div className="flex gap-4">
          <div>
            <label className="text-gray-700 font-bold">Level:</label>
            <select
              className="px-2 py-1 border rounded-lg"
              value={selectedLevel}
              onChange={(e) => {
                const newLevel = e.target.value;
                setSelectedLevel(newLevel);
                sessionStorage.setItem("selectedLevel", newLevel); // Store selection
              }}
            >
              <option value="all">All Courses</option>
              {[100, 200, 300, 400].map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Course Code"
              className="pl-10 pr-2 py-1 border rounded-lg"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
            />
            <FaSearch
              className="absolute left-3 top-2 text-gray-500 cursor-pointer"
              onClick={handleSearch}
            />
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Course Title"
              className="pl-10 pr-2 py-1 border rounded-lg"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
            />
            <FaSearch
              className="absolute left-3 top-2 text-gray-500 cursor-pointer"
              onClick={handleSearch}
            />
          </div>
        </div>

        <button
          className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600"
          onClick={handleAdd}
        >
          <FaPlus />
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <h2 className="text-2xl font-bold text-center mb-4">{title}</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              {columns.map((col) => (
                <th key={col.key} className="border px-4 py-2">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="text-center hover:bg-gray-100">
                {columns.map((col) => (
                  <td key={col.key} className="border px-4 py-2">
                    {col.key === "actions" ? (
                      <FaEdit
                        className="text-blue-500 cursor-pointer"
                        onClick={() => handleEdit(course)}
                      />
                    ) : (
                      course[col.key]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Course Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Add Course</h2>
        <form onSubmit={handleAddSubmit}>
          {columns.map((col) => (
            <div key={col.key} className="mb-4">
              <label>{col.header}</label>
              {col.key === "semester" ? (
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={newCourse[col.key] || ""}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, [col.key]: e.target.value })
                  }
                >
                  <option value="">Select Semester</option>
                  <option value="First">First</option>
                  <option value="Second">Second</option>
                </select>
              ) : (
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={newCourse[col.key] || ""}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, [col.key]: e.target.value })
                  }
                />
              )}
            </div>
          ))}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Add Course
          </button>
        </form>
      </Modal>

      {/* Edit Course Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Edit Course</h2>
        {selectedCourse ? (
          <form onSubmit={handleEditSubmit}>
            {columns.map((col) => (
              <div key={col.key} className="mb-4">
                <label>{col.header}</label>
                {col.key === "semester" ? (
                  <select
                    className="w-full px-3 py-2 border rounded-lg"
                    value={selectedCourse[col.key] || ""}
                    onChange={(e) =>
                      setSelectedCourse({
                        ...selectedCourse,
                        [col.key]: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Semester</option>
                    <option value="First">First</option>
                    <option value="Second">Second</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg"
                    value={selectedCourse[col.key] || ""}
                    onChange={(e) =>
                      setSelectedCourse({
                        ...selectedCourse,
                        [col.key]: e.target.value,
                      })
                    }
                  />
                )}
              </div>
            ))}
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              Update Course
            </button>
          </form>
        ) : (
          <p className="text-gray-500">No course selected.</p>
        )}
      </Modal>
    </div>
  );
}
