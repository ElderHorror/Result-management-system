import React, { useState, useEffect } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import Modal from "./Modal";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig"; // Import Firebase instance

export default function StudentView({ title, onAdd, onEdit }) {
  const [students, setStudents] = useState([]);
  const [searchMatric, setSearchMatric] = useState("");
  const [searchName, setSearchName] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("100");
  const [selectedDepartment, setSelectedDepartment] = useState("Computer Science");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newStudent, setNewStudent] = useState({});

  const columns = [
    { key: "name", header: "Student Name" },
    { key: "department", header: "Department" },
    { key: "level", header: "Level" },
    { key: "matric_number", header: "Matric Number" },
    { key: "modeOfEntry", header: "Mode of Entry" },
    { key: "suspended", header: "Suspended" },
    { key: "cgpa", header: "CGPA" },
  ];

  // Fetch data from Firestore
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const q = query(
          collection(db, "students"),
          where("level", "==", selectedLevel),
          where("department", "==", selectedDepartment)
        );

        const querySnapshot = await getDocs(q);
        const studentList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setStudents(studentList);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, [selectedLevel, selectedDepartment]);

  const handleSearch = () => {
    const filtered = students.filter(
      (student) =>
        student.matricNumber.includes(searchMatric) &&
        student.name.toLowerCase().includes(searchName.toLowerCase())
    );
    setStudents(filtered);
  };

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    onAdd(newStudent);
    setIsAddModalOpen(false);
    setNewStudent({});
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onEdit(selectedStudent);
    setIsEditModalOpen(false);
    setSelectedStudent(null);
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
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              {[100, 200, 300, 400].map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-gray-700 font-bold">Department:</label>
            <select
              className="px-2 py-1 border rounded-lg"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="Computer Science">Computer Science</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="Cyber Security">Cyber Security</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Matric Number"
              className="pl-10 pr-2 py-1 border rounded-lg"
              value={searchMatric}
              onChange={(e) => setSearchMatric(e.target.value)}
            />
            <FaSearch
              className="absolute left-3 top-2 text-gray-500 cursor-pointer"
              onClick={handleSearch}
            />
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Student Name"
              className="pl-10 pr-2 py-1 border rounded-lg"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
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
            {students.map((student) => (
              <tr
                key={student.id}
                className="text-center hover:bg-gray-100 cursor-pointer"
                onClick={() => handleEdit(student)}
              >
                {columns.map((col) => (
                  <td key={col.key} className="border px-4 py-2">
                    {student[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Add Student</h2>
        <form onSubmit={handleAddSubmit}>
          {columns.map((col) => (
            <div key={col.key} className="mb-4">
              <label>{col.header}</label>
              {col.key === "modeOfEntry" ? (
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={newStudent[col.key] || ""}
                  onChange={(e) => setNewStudent({ ...newStudent, [col.key]: e.target.value })}
                >
                  <option value="">Select Mode of Entry</option>
                  <option value="JUPEB">JUPEB</option>
                  <option value="UTME/DE">UTME/DE</option>
                  <option value="CEDLEB">CEDLEB</option>
                </select>
              ) : col.key === "suspended" ? (
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={newStudent[col.key] || ""}
                  onChange={(e) => setNewStudent({ ...newStudent, [col.key]: e.target.value })}
                >
                  <option value="">Select Status</option>
                  <option value="YES">YES</option>
                  <option value="NO">NO</option>
                </select>
              ) : (
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={newStudent[col.key] || ""}
                  onChange={(e) => setNewStudent({ ...newStudent, [col.key]: e.target.value })}
                />
              )}
            </div>
          ))}
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            Add Student
          </button>
        </form>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Edit Student</h2>
        <form onSubmit={handleEditSubmit}>
          {columns.map((col) => (
            <div key={col.key} className="mb-4">
              <label>{col.header}</label>
              {col.key === "modeOfEntry" ? (
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={selectedStudent?.[col.key] || ""}
                  onChange={(e) => setSelectedStudent({ ...selectedStudent, [col.key]: e.target.value })}
                >
                  <option value="">Select Mode of Entry</option>
                  <option value="JUPEB">JUPEB</option>
                  <option value="UTME/DE">UTME/DE</option>
                  <option value="CEDLEB">CEDLEB</option>
                </select>
              ) : col.key === "suspended" ? (
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={selectedStudent?.[col.key] || ""}
                  onChange={(e) => setSelectedStudent({ ...selectedStudent, [col.key]: e.target.value })}
                >
                  <option value="">Select Status</option>
                  <option value="YES">YES</option>
                  <option value="NO">NO</option>
                </select>
              ) : (
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={selectedStudent?.[col.key] || ""}
                  onChange={(e) => setSelectedStudent({ ...selectedStudent, [col.key]: e.target.value })}
                />
              )}
            </div>
          ))}
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            Save Changes
          </button>
        </form>
      </Modal>
    </div>
  );
}