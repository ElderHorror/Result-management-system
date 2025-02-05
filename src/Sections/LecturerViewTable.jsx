import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit } from "react-icons/fa";
import Modal from "./Modal";
import { collection, onSnapshot, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

const LecturerViewTable = () => {
  const [lecturers, setLecturers] = useState([]);
  const [filteredLecturers, setFilteredLecturers] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLecturer, setSelectedLecturer] = useState(null);
  const [newLecturer, setNewLecturer] = useState({
    lecturer_name: "",
    course_code: "",
    course_name: "",
    level: "100", // Default level set to 100
    resultsSubmitted: "No",
    semester: "1st Semester", // Default semester
  });

  // Filters
  const [filterLevel, setFilterLevel] = useState("All");
  const [filterSemester, setFilterSemester] = useState("All");

  // Define table columns
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
      setFilteredLecturers(lecturerList); // Initialize filteredLecturers with all lecturers
    });

    return () => unsubscribe();
  }, []);

  // Filter lecturers based on level and semester
  useEffect(() => {
    let filteredData = lecturers;

    if (filterLevel !== "All") {
      filteredData = filteredData.filter((lecturer) => lecturer.level === filterLevel);
    }

    if (filterSemester !== "All") {
      filteredData = filteredData.filter((lecturer) => lecturer.semester === filterSemester);
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
        level: "100", // Reset level to default after submission
        resultsSubmitted: "No",
        semester: "1st Semester", // Reset semester
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
          {columns.slice(0, 3).map((col) => (
            <div key={col.key} className="mb-4">
              <label>{col.header}</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                value={newLecturer[col.key]}
                onChange={(e) =>
                  setNewLecturer({ ...newLecturer, [col.key]: e.target.value })
                }
              />
            </div>
          ))}

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

          <div className="mb-4">
            <label>Results Submitted</label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={newLecturer.resultsSubmitted}
              onChange={(e) =>
                setNewLecturer({ ...newLecturer, resultsSubmitted: e.target.value })
              }
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            Add Lecturer
          </button>
        </form>
      </Modal>

      {/* Edit Lecturer Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Edit Lecturer</h2>
        <form onSubmit={handleEditSubmit}>
          {columns.slice(0, 3).map((col) => (
            <div key={col.key} className="mb-4">
              <label>{col.header}</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                value={selectedLecturer?.[col.key] || ""}
                onChange={(e) =>
                  setSelectedLecturer({
                    ...selectedLecturer,
                    [col.key]: e.target.value,
                  })
                }
              />
            </div>
          ))}

          {/* Level Dropdown for Editing */}
          <div className="mb-4">
            <label>Level</label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={selectedLecturer?.level || "100"}
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

          {/* Semester Dropdown for Editing */}
          <div className="mb-4">
            <label>Semester</label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={selectedLecturer?.semester || "1st Semester"}
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

          <div className="mb-4">
            <label>Results Submitted</label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={selectedLecturer?.resultsSubmitted || "No"}
              onChange={(e) =>
                setSelectedLecturer({
                  ...selectedLecturer,
                  resultsSubmitted: e.target.value,
                })
              }
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            Save Changes
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default LecturerViewTable;
