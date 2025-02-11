import React, { useState, useEffect } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
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
import { db } from "../../firebaseConfig";

export default function StudentView({ title }) {
  const [students, setStudents] = useState([]);
  const [searchMatric, setSearchMatric] = useState("");
  const [searchName, setSearchName] = useState("");
  const [selectedLevel, setSelectedLevel] = useState(() => {
    const storedLevel = sessionStorage.getItem("selectedLevel");
    return storedLevel ? storedLevel : "All"; // Ensure level is a number or "All"
  });
  const [selectedDepartment, setSelectedDepartment] = useState(
    sessionStorage.getItem("selectedDepartment") || "All Departments"
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newStudent, setNewStudent] = useState({
    level: 100, // Default to number
    department: "Computer Science",
    modeOfEntry: "UTME",
    suspended: "NO",
    sessionYear: "2023-2024",
  });
  const [yearOfEntry, setYearOfEntry] = useState(() => {
    return sessionStorage.getItem("selectedSession") || "2023-2024";
  });

  const columns = [
    { key: "name", header: "Student Name" },
    { key: "department", header: "Department" },
    { key: "level", header: "Level" },
    { key: "matric_number", header: "Matric Number" },
    { key: "modeOfEntry", header: "Mode of Entry" },
    { key: "suspended", header: "Suspended" },
    { key: "cgpa", header: "CGPA" },
    { key: "sessionYear", header: "Year of Entry" },
  ];

  // Fetch students from Firebase
  useEffect(() => {
    const conditions = [];

    if (selectedLevel !== "All") {
      conditions.push(where("level", "==", selectedLevel)); // Ensure level is a number
    }

    if (selectedDepartment !== "All Departments") {
      conditions.push(where("department", "==", selectedDepartment));
    }

    conditions.push(where("sessionYear", "==", yearOfEntry));
    conditions.push(orderBy("matric_number", "asc"));

    const q = query(collection(db, "students"), ...conditions);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const studentList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Fetched students:", studentList); // Debugging
      setStudents(studentList);
    });

    return () => unsubscribe();
  }, [selectedLevel, selectedDepartment, yearOfEntry]);

  // Handle level change
  const handleLevelChange = (e) => {
    const newLevel = e.target.value === "All" ? "All" : e.target.value; // Convert to number
    setSelectedLevel(newLevel);
    sessionStorage.setItem("selectedLevel", newLevel.toString()); // Store as string
    setSearchMatric("");
    setSearchName("");
  };

  // Handle department change
  const handleDepartmentChange = (e) => {
    const newDepartment = e.target.value;
    setSelectedDepartment(newDepartment);
    sessionStorage.setItem("selectedDepartment", newDepartment);
    setSearchMatric("");
    setSearchName("");
  };

  // Handle session change
  const handleSessionChange = (e) => {
    const newSession = e.target.value;
    setYearOfEntry(newSession);
    sessionStorage.setItem("selectedSession", newSession);
    setSearchMatric("");
    setSearchName("");
  };

  // Handle search
  const handleSearch = () => {
    const filtered = students.filter(
      (student) =>
        student.matric_number.includes(searchMatric) &&
        student.name.toLowerCase().includes(searchName.toLowerCase())
    );
    setStudents(filtered);
  };

  // Handle add student
  const handleAdd = () => {
    setNewStudent({
      level: 100, // Default to number
      department: "Computer Science",
      modeOfEntry: "UTME",
      suspended: "NO",
      sessionYear: yearOfEntry,
    });
    setIsAddModalOpen(true);
  };

  // Handle edit student
  const handleEdit = (student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  // Handle add student submit
  const handleAddSubmit = async (e) => {
    e.preventDefault();

    const studentWithSession = {
      ...newStudent,
      level: Number(newStudent.level), // Ensure level is a number
      sessionYear: yearOfEntry,
      results: {
        [newStudent.level]: {},
      },
      cgpa: 0,
      totalTNU: 0,
      totalTCP: 0,
      carryOver: "No",
      carryOverCourses: [],
    };

    try {
      const docRef = await addDoc(collection(db, "students"), studentWithSession);
      setStudents((prevStudents) => [
        ...prevStudents,
        { id: docRef.id, ...studentWithSession },
      ]);
      setIsAddModalOpen(false);
      setNewStudent({});
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  // Handle edit student submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedStudent = {
        ...selectedStudent,
        level: Number(selectedStudent.level), // Ensure level is a number
      };
      const studentRef = doc(db, "students", updatedStudent.id);
      await updateDoc(studentRef, updatedStudent);
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === updatedStudent.id ? updatedStudent : student
        )
      );
      setIsEditModalOpen(false);
      setSelectedStudent(null);
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  // Filter students based on search inputs
  const filteredStudents = students.filter(
    (student) =>
      student.matric_number.includes(searchMatric) &&
      student.name.toLowerCase().includes(searchName.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[80%] bg-gray-200 px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        <div className="flex gap-4">
          <div>
            <label className="text-gray-700 font-bold">Level:</label>
            <select
              className="px-2 py-1 border rounded-lg"
              value={selectedLevel === "All" ? "All" : selectedLevel.toString()} // Ensure value is a string
              onChange={handleLevelChange}
            >
              <option value="All">All Levels</option>
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
              onChange={handleDepartmentChange}
            >
              <option value="All Departments">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="Cyber Security">Cyber Security</option>
            </select>
          </div>

          <div>
            <label className="text-gray-700 font-bold">Year of Entry:</label>
            <select
              className="px-2 py-1 border rounded-lg"
              value={yearOfEntry}
              onChange={handleSessionChange}
            >
              <option value="2019-2020">2019/2020</option>
              <option value="2020-2021">2020/2021</option>
              <option value="2021-2022">2021/2022</option>
              <option value="2022-2023">2022/2023</option>
              <option value="2023-2024">2023/2024</option>
              <option value="2024-2025">2024/2025</option>
              <option value="2025-2026">2025/2026</option>
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
        {students.length === 0 ? (
          <div className="text-center text-gray-500">
            <p>No students found for:</p>
            <ul className="list-disc inline-block text-left">
              <li>Level: {selectedLevel}</li>
              <li>Department: {selectedDepartment}</li>
              <li>Session: {yearOfEntry}</li>
            </ul>
          </div>
        ) : filteredStudents.length === 0 ? (
          <p className="text-center text-gray-500">
            No students match the search criteria.
          </p>
        ) : (
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
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="text-center hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleEdit(student)}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="border px-4 py-2">
                      {col.key === "cgpa"
                        ? student.cgpa
                          ? Number(student.cgpa).toFixed(2)
                          : "N/A"
                        : student[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Student Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Add Student</h2>
        <form onSubmit={handleAddSubmit}>
          {columns.map((col) => (
            <div key={col.key} className="mb-4">
              <label>{col.header}</label>
              {col.key === "level" ? (
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={newStudent.level || 100} // Default to 100 (number)
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, level: Number(e.target.value) }) // Convert to number
                  }
                >
                  {[100, 200, 300, 400].map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              ) : col.key === "department" ? (
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={newStudent.department || "Computer Science"}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, department: e.target.value })
                  }
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Cyber Security">Cyber Security</option>
                </select>
              ) : col.key === "modeOfEntry" ? (
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={newStudent.modeOfEntry || "UTME"}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, modeOfEntry: e.target.value })
                  }
                >
                  <option value="JUPEB">JUPEB</option>
                  <option value="UTME">UTME</option>
                  <option value="DE">DE</option>
                </select>
              ) : col.key === "suspended" ? (
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={newStudent.suspended || "NO"}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, suspended: e.target.value })
                  }
                >
                  <option value="YES">YES</option>
                  <option value="NO">NO</option>
                </select>
              ) : col.key === "sessionYear" ? (
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={newStudent.sessionYear || yearOfEntry}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, sessionYear: e.target.value })
                  }
                >
                  <option value="2019-2020">2019/2020</option>
                  <option value="2020-2021">2020/2021</option>
                  <option value="2021-2022">2021/2022</option>
                  <option value="2022-2023">2022/2023</option>
                  <option value="2023-2024">2023/2024</option>
                  <option value="2024-2025">2024/2025</option>
                  <option value="2025-2026">2025/2026</option>
                </select>
              ) : (
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={newStudent[col.key] || ""}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, [col.key]: e.target.value })
                  }
                />
              )}
            </div>
          ))}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Add Student
          </button>
        </form>
      </Modal>

      {/* Edit Student Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Edit Student</h2>
        <form onSubmit={handleEditSubmit}>
          {columns.map((col) => (
            <div key={col.key} className="mb-4">
              <label>{col.header}</label>
              {col.key === "level" ? (
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={selectedStudent?.level || 100} // Default to 100 (number)
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      level: Number(e.target.value), // Convert to number
                    })
                  }
                >
                  {[100, 200, 300, 400].map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              ) : col.key === "department" ? (
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={selectedStudent?.department || "Computer Science"}
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      department: e.target.value,
                    })
                  }
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Cyber Security">Cyber Security</option>
                </select>
              ) : col.key === "modeOfEntry" ? (
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={selectedStudent?.modeOfEntry || "UTME"}
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      modeOfEntry: e.target.value,
                    })
                  }
                >
                  <option value="JUPEB">JUPEB</option>
                  <option value="UTME">UTME</option>
                  <option value="DE">DE</option>
                </select>
              ) : col.key === "suspended" ? (
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={selectedStudent?.suspended || "NO"}
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      suspended: e.target.value,
                    })
                  }
                >
                  <option value="YES">YES</option>
                  <option value="NO">NO</option>
                </select>
              ) : col.key === "sessionYear" ? (
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={selectedStudent?.sessionYear || yearOfEntry}
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      sessionYear: e.target.value,
                    })
                  }
                >
                  <option value="2019-2020">2019/2020</option>
                  <option value="2020-2021">2020/2021</option>
                  <option value="2021-2022">2021/2022</option>
                  <option value="2022-2023">2022/2023</option>
                  <option value="2023-2024">2023/2024</option>
                  <option value="2024-2025">2024/2025</option>
                  <option value="2025-2026">2025/2026</option>
                </select>
              ) : (
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={selectedStudent?.[col.key] || ""}
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      [col.key]: e.target.value,
                    })
                  }
                />
              )}
            </div>
          ))}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Save Changes
          </button>
        </form>
      </Modal>
    </div>
  );
}