import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit } from "react-icons/fa";
import Modal from "./Modal";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";

const LecturerViewTable = () => {
  const [lecturers, setLecturers] = useState([]);
  const [courses, setCourses] = useState([]); // New state for courses
  const [filteredLecturers, setFilteredLecturers] = useState([]);
  const storedLevel = sessionStorage.getItem("selectedLevel") || "All";
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLecturer, setSelectedLecturer] = useState(null);
  const [newLecturer, setNewLecturer] = useState({
    lecturer_name: "",
    course_code: "",
    course_name: "",
    level: "100",
    resultsSubmitted: "No",
    semester: "1st Semester",
  });

  const [filterLevel, setFilterLevel] = useState(storedLevel);
  const [filterSemester, setFilterSemester] = useState("All");

  const columns = [
    { key: "lecturer_name", header: "Lecturer Name" },
    { key: "course_code", header: "Course Code" },
    { key: "course_name", header: "Course Title" },
    { key: "level", header: "Level" },
    { key: "semester", header: "Semester" },
    {
      key: "resultsSubmitted",
      header: "Results Submitted",
      render: (value) => (
        <span className={value === "Yes" ? "text-green-600" : "text-red-600"}>
          {value}
        </span>
      ),
    },
    { key: "actions", header: "Actions" },
  ];

  // Fetch lecturers from Firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "lecturers"), (snapshot) => {
      const lecturerList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLecturers(lecturerList);
      setFilteredLecturers(lecturerList);
    });

    return () => unsubscribe();
  }, []);

  // Fetch courses from Firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "courses"), (snapshot) => {
      const courseList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCourses(courseList); // Set courses state with fetched courses
    });

    return () => unsubscribe();
  }, []);

  // Filter lecturers based on level and semester
  useEffect(() => {
    let filteredData = lecturers;

    if (filterLevel !== "All") {
      filteredData = filteredData.filter(
        (lecturer) => lecturer.level === filterLevel
      );
    }

    if (filterSemester !== "All") {
      filteredData = filteredData.filter(
        (lecturer) => lecturer.semester === filterSemester
      );
    }

    setFilteredLecturers(filteredData);
  }, [filterLevel, filterSemester, lecturers]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "lecturers"), newLecturer);
      setIsAddModalOpen(false);
      setNewLecturer({
        lecturer_name: "",
        course_code: "",
        course_name: "",
        level: "100",
        resultsSubmitted: "No",
        semester: "1st Semester",
      });
    } catch (error) {
      console.error("Error adding lecturer:", error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const lecturerRef = doc(db, "lecturers", selectedLecturer.id);
      await updateDoc(lecturerRef, selectedLecturer);
      setIsEditModalOpen(false);
      setSelectedLecturer(null);
    } catch (error) {
      console.error("Error updating lecturer:", error);
    }
  };

  // Function to handle course code selection and update course name
  // Function to handle course code selection and update course name in the edit modal
  const handleCourseCodeChange = (courseCode) => {
    const selectedCourse = courses.find(
      (course) => course.course_code === courseCode
    );
    if (selectedCourse) {
      setSelectedLecturer({
        ...selectedLecturer,
        course_code: selectedCourse.course_code,
        course_name: selectedCourse.course_name,
      });
    }
  };

  // Function to handle course name selection and update course code in the edit modal
  const handleCourseNameChange = (courseName) => {
    const selectedCourse = courses.find(
      (course) => course.course_name === courseName
    );
    if (selectedCourse) {
      setSelectedLecturer({
        ...selectedLecturer,
        course_code: selectedCourse.course_code,
        course_name: selectedCourse.course_name,
      });
    }
  };

  return (
    <div className="flex flex-col h-[80%] bg-gray-200 px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Lecturer Details</h2>
        <button
          className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600"
          onClick={() => setIsAddModalOpen(true)}
        >
          <FaPlus />
        </button>
      </div>

      {/* Filters */}
      <div className="flex mb-6">
        <select
          className="px-3 py-2 border rounded-lg mr-4"
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
        >
          <option value="All">All Levels</option>
          <option value="100">100</option>
          <option value="200">200</option>
          <option value="300">300</option>
          <option value="400">400</option>
        </select>

        <select
          className="px-3 py-2 border rounded-lg"
          value={filterSemester}
          onChange={(e) => setFilterSemester(e.target.value)}
        >
          <option value="All">All Semesters</option>
          <option value="1st Semester">1st Semester</option>
          <option value="2nd Semester">2nd Semester</option>
        </select>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
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
            {filteredLecturers.map((lecturer) => (
              <tr key={lecturer.id} className="text-center hover:bg-gray-100">
                {columns.map((col) => (
                  <td key={col.key} className="border px-4 py-2">
                    {col.key === "actions" ? (
                      <FaEdit
                        className="text-blue-500 cursor-pointer"
                        onClick={() => {
                          setSelectedLecturer(lecturer);
                          setIsEditModalOpen(true);
                        }}
                      />
                    ) : col.render ? (
                      col.render(lecturer[col.key])
                    ) : (
                      lecturer[col.key]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Lecturer Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Add Lecturer</h2>
        <form onSubmit={handleAddSubmit}>
          {/* Lecturer Name */}
          <div className="mb-4">
            <label>Lecturer Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg"
              value={newLecturer.lecturer_name}
              onChange={(e) =>
                setNewLecturer({
                  ...newLecturer,
                  lecturer_name: e.target.value,
                })
              }
            />
          </div>

          {/* Course Code and Course Title Dropdowns */}
          <div className="mb-4">
            <label>Course Code</label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={newLecturer.course_code}
              onChange={(e) => handleCourseCodeChange(e.target.value)}
            >
              <option value="">Select Course Code</option>
              {courses.map((course) => (
                <option key={course.id} value={course.course_code}>
                  {course.course_code}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label>Course Title</label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={newLecturer.course_name}
              onChange={(e) => handleCourseNameChange(e.target.value)}
            >
              <option value="">Select Course Title</option>
              {courses.map((course) => (
                <option key={course.id} value={course.course_name}>
                  {course.course_name}
                </option>
              ))}
            </select>
          </div>

          {/* Level Dropdown */}
          <div className="mb-4">
            <label>Level</label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={newLecturer.level}
              onChange={(e) =>
                setNewLecturer({ ...newLecturer, level: e.target.value })
              }
            >
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="300">300</option>
              <option value="400">400</option>
            </select>
          </div>

          {/* Semester Dropdown */}
          <div className="mb-4">
            <label>Semester</label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={newLecturer.semester}
              onChange={(e) =>
                setNewLecturer({ ...newLecturer, semester: e.target.value })
              }
            >
              <option value="1st Semester">1st Semester</option>
              <option value="2nd Semester">2nd Semester</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg"
          >
            Add Lecturer
          </button>
        </form>
      </Modal>

      {/* Edit Lecturer Modal */}
      {selectedLecturer && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        >
          <h2 className="text-xl font-bold mb-4">Edit Lecturer</h2>
          <form onSubmit={handleEditSubmit}>
            {/* Lecturer Name */}
            <div className="mb-4">
              <label>Lecturer Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                value={selectedLecturer.lecturer_name}
                onChange={(e) =>
                  setSelectedLecturer({
                    ...selectedLecturer,
                    lecturer_name: e.target.value,
                  })
                }
              />
            </div>

            {/* Course Code and Course Title Dropdowns */}
            <div className="mb-4">
              <label>Course Code</label>
              <select
                className="w-full px-3 py-2 border rounded-lg"
                value={selectedLecturer.course_code}
                onChange={(e) => handleCourseCodeChange(e.target.value)}
              >
                <option value="">Select Course Code</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.course_code}>
                    {course.course_code}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label>Course Title</label>
              <select
                className="w-full px-3 py-2 border rounded-lg"
                value={selectedLecturer.course_name}
                onChange={(e) => handleCourseNameChange(e.target.value)}
              >
                <option value="">Select Course Title</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.course_name}>
                    {course.course_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Level Dropdown */}
            <div className="mb-4">
              <label>Level</label>
              <select
                className="w-full px-3 py-2 border rounded-lg"
                value={selectedLecturer.level}
                onChange={(e) =>
                  setSelectedLecturer({
                    ...selectedLecturer,
                    level: e.target.value,
                  })
                }
              >
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="300">300</option>
                <option value="400">400</option>
              </select>
            </div>

            {/* Semester Dropdown */}
            <div className="mb-4">
              <label>Semester</label>
              <select
                className="w-full px-3 py-2 border rounded-lg"
                value={selectedLecturer.semester}
                onChange={(e) =>
                  setSelectedLecturer({
                    ...selectedLecturer,
                    semester: e.target.value,
                  })
                }
              >
                <option value="1st Semester">1st Semester</option>
                <option value="2nd Semester">2nd Semester</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg"
            >
              Update Lecturer
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default LecturerViewTable;
