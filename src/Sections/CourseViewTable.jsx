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
  const [selectedSemester, setSelectedSemester] = useState(
    sessionStorage.getItem("selectedSemester") || "First" // Default to "First" if nothing is stored
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newCourse, setNewCourse] = useState({
    course_code: "",
    course_name: "",
    level: selectedLevel,
    department: "All Departments", // Default to first department
    units: "",
    semester: selectedSemester, // Default to selected semester
  });

  // Predefined options for dropdowns
  const departments = ["All Departments", "Computer Science", "Software Engineering", "Cyber Security"];
  const levels = [100, 200, 300, 400];
  const semesters = ["First", "Second"];

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
      // Fetch all courses, filtered by semester
      q = query(
        collection(db, "courses"),
        where("semester", "==", selectedSemester),
        orderBy("course_code", "asc")
      );
    } else {
      // Fetch courses filtered by level and semester
      q = query(
        collection(db, "courses"),
        where("level", "==", selectedLevel),
        where("semester", "==", selectedSemester),
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
  }, [selectedLevel, selectedSemester]); // Re-run when selectedLevel or selectedSemester changes

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
      course_code: "",
      course_name: "",
      level: selectedLevel,
      department: "All Departments", // Default to first department
      units: "",
      semester: selectedSemester, // Default to selected semester
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
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-gray-700 font-bold">Semester:</label>
            <select
              className="px-2 py-1 border rounded-lg"
              value={selectedSemester}
              onChange={(e) => {
                const newSemester = e.target.value;
                setSelectedSemester(newSemester);
                sessionStorage.setItem("selectedSemester", newSemester); // Store selection
              }}
            >
              {semesters.map((semester) => (
                <option key={semester} value={semester}>
                  {semester}
                </option>
              ))}
            </select>
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
          <div className="mb-4">
            <label>Course Code</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg"
              value={newCourse.course_code}
              onChange={(e) =>
                setNewCourse({ ...newCourse, course_code: e.target.value })
              }
            />
          </div>

          <div className="mb-4">
            <label>Course Title</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg"
              value={newCourse.course_name}
              onChange={(e) =>
                setNewCourse({ ...newCourse, course_name: e.target.value })
              }
            />
          </div>

          <div className="mb-4">
            <label>Level</label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={newCourse.level}
              onChange={(e) =>
                setNewCourse({ ...newCourse, level: e.target.value })
              }
            >
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label>Department</label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={newCourse.department}
              onChange={(e) =>
                setNewCourse({ ...newCourse, department: e.target.value })
              }
            >
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label>Credit Units</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg"
              value={newCourse.units}
              onChange={(e) =>
                setNewCourse({ ...newCourse, units: e.target.value })
              }
            />
          </div>

          <div className="mb-4">
            <label>Semester</label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={newCourse.semester}
              onChange={(e) =>
                setNewCourse({ ...newCourse, semester: e.target.value })
              }
            >
              {semesters.map((semester) => (
                <option key={semester} value={semester}>
                  {semester}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            onClick={handleAddSubmit}
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
            <div className="mb-4">
              <label>Course Code</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                value={selectedCourse.course_code}
                onChange={(e) =>
                  setSelectedCourse({
                    ...selectedCourse,
                    course_code: e.target.value,
                  })
                }
              />
            </div>

            <div className="mb-4">
              <label>Course Title</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                value={selectedCourse.course_name}
                onChange={(e) =>
                  setSelectedCourse({
                    ...selectedCourse,
                    course_name: e.target.value,
                  })
                }
              />
            </div>

            <div className="mb-4">
              <label>Level</label>
              <select
                className="w-full px-3 py-2 border rounded-lg"
                value={selectedCourse.level}
                onChange={(e) =>
                  setSelectedCourse({
                    ...selectedCourse,
                    level: e.target.value,
                  })
                }
              >
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label>Department</label>
              <select
                className="w-full px-3 py-2 border rounded-lg"
                value={selectedCourse.department}
                onChange={(e) =>
                  setSelectedCourse({
                    ...selectedCourse,
                    department: e.target.value,
                  })
                }
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label>Credit Units</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                value={selectedCourse.units}
                onChange={(e) =>
                  setSelectedCourse({
                    ...selectedCourse,
                    units: e.target.value,
                  })
                }
              />
            </div>

            <div className="mb-4">
              <label>Semester</label>
              <select
                className="w-full px-3 py-2 border rounded-lg"
                value={selectedCourse.semester}
                onChange={(e) =>
                  setSelectedCourse({
                    ...selectedCourse,
                    semester: e.target.value,
                  })
                }
              >
                {semesters.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              onClick={handleEditSubmit}
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