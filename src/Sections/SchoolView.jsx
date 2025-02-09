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
    return sessionStorage.getItem("selectedLevel") || "All"; // Default to "All"
  });
  const [selectedDepartment, setSelectedDepartment] = useState(
    "All Departments"
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newStudent, setNewStudent] = useState({
    level: "100", // Default level
    department: "Computer Science", // Default department
    modeOfEntry: "UTME", // Default mode of entry
    suspended: "NO", // Default suspended status
    sessionYear: "2023-2024", // Default session year
  });
  const [yearOfEntry, setYearOfEntry] = useState(() => {
    return sessionStorage.getItem("selectedSession") || "2023-2024"; // Default session
  });

  const columns = [
    { key: "name", header: "Student Name" },
    { key: "department", header: "Department" },
    { key: "level", header: "Level" },
    { key: "matric_number", header: "Matric Number" },
    { key: "modeOfEntry", header: "Mode of Entry" },
    { key: "suspended", header: "Suspended" },
    { key: "cgpa", header: "CGPA" }, // CGPA will be pulled from Firestore
    { key: "sessionYear", header: "Year of Entry" },
  ];

  // Fetch students from Firebase
  useEffect(() => {
    // Construct the Firestore query dynamically based on filters
    const conditions = [];

    if (selectedLevel !== "All") {
      conditions.push(where("level", "==", selectedLevel));
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
      setStudents(studentList);
    });

    return () => unsubscribe();
  }, [selectedLevel, selectedDepartment, yearOfEntry]);

  const handleLevelChange = (e) => {
    setSelectedLevel(e.target.value);
    sessionStorage.setItem("selectedLevel", e.target.value);
    setSearchMatric(""); // Reset search input
    setSearchName(""); // Reset search input
  };

  const handleSessionChange = (e) => {
    setYearOfEntry(e.target.value);
    sessionStorage.setItem("selectedSession", e.target.value);
    setSearchMatric(""); // Reset search input
    setSearchName(""); // Reset search input
  };

  const handleSearch = () => {
    const filtered = students.filter(
      (student) =>
        student.matric_number.includes(searchMatric) &&
        student.name.toLowerCase().includes(searchName.toLowerCase())
    );
    setStudents(filtered);
  };

  const handleAdd = () => {
    // Reset newStudent to default values when opening the add modal
    setNewStudent({
      level: "100", // Default level
      department: "Computer Science", // Default department
      modeOfEntry: "UTME", // Default mode of entry
      suspended: "NO", // Default suspended status
      sessionYear: yearOfEntry, // Default session year
    });
    setIsAddModalOpen(true);
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    // Initialize the `results` field based on the student's level
    const initialResults = {
      [newStudent.level]: {}, // Initialize an empty object for the student's level
    };

    const studentWithSession = {
      ...newStudent,
      sessionYear: yearOfEntry,
      results: initialResults, // Add the initialized `results` field
      cgpa: 0, // Initialize CGPA to 0
      totalTNU: 0, // Initialize total TNU to 0
      totalTCP: 0, // Initialize total TCP to 0
      carryOver: "No", // Initialize carryOver status to "No"
      carryOverCourses: [], // Initialize carryOver courses as an empty array
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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const studentRef = doc(db, "students", selectedStudent.id);
    await updateDoc(studentRef, selectedStudent);
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === selectedStudent.id ? selectedStudent : student
      )
    );
    setIsEditModalOpen(false);
    setSelectedStudent(null);
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
              value={selectedLevel}
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
              onChange={(e) => setSelectedDepartment(e.target.value)}
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

        {/* <div className="flex gap-4">
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
        </div> */}

        <button
          className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600"
          onClick={handleAdd}
        >
          <FaPlus />
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <h2 className="text-2xl font-bold text-center mb-4">{title}</h2>
        {students.length === 0 ? ( // Check if students array is empty
          <p className="text-center text-gray-500">
            No students found for the selected filters.
          </p>
        ) : filteredStudents.length === 0 ? ( // Check if filtered students array is empty
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
                          : "N/A" // Display CGPA from Firestore
                        : student[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Add Student</h2>
        <form onSubmit={handleAddSubmit}>
          {columns.map((col) => (
            <div key={col.key} className="mb-4">
              <label>{col.header}</label>
              {col.key === "level" ? (
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={newStudent[col.key] || "100"} // Default to "100"
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, [col.key]: e.target.value })
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
                  value={newStudent[col.key] || "Computer Science"} // Default to "Computer Science"
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, [col.key]: e.target.value })
                  }
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Software Engineering">
                    Software Engineering
                  </option>
                  <option value="Cyber Security">Cyber Security</option>
                </select>
              ) : col.key === "modeOfEntry" ? (
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={newStudent[col.key] || "UTME"} // Default to "UTME"
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, [col.key]: e.target.value })
                  }
                >
                  <option value="JUPEB">JUPEB</option>
                  <option value="UTME">UTME</option>
                  <option value="DE">DE</option>
                </select>
              ) : col.key === "suspended" ? (
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={newStudent[col.key] || "NO"} // Default to "NO"
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, [col.key]: e.target.value })
                  }
                >
                  <option value="YES">YES</option>
                  <option value="NO">NO</option>
                </select>
              ) : col.key === "sessionYear" ? (
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={newStudent[col.key] || yearOfEntry} // Default to current session
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, [col.key]: e.target.value })
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

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Edit Student</h2>
        <form onSubmit={handleEditSubmit}>
          {columns.map((col) => (
            <div key={col.key} className="mb-4">
              <label>{col.header}</label>
              {col.key === "level" ? (
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={selectedStudent?.[col.key] || "100"} // Default to "100"
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      [col.key]: e.target.value,
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
                  value={selectedStudent?.[col.key] || "Computer Science"} // Default to "Computer Science"
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      [col.key]: e.target.value,
                    })
                  }
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Software Engineering">
                    Software Engineering
                  </option>
                  <option value="Cyber Security">Cyber Security</option>
                </select>
              ) : col.key === "modeOfEntry" ? (
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={selectedStudent?.[col.key] || "UTME"} // Default to "UTME"
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      [col.key]: e.target.value,
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
                  value={selectedStudent?.[col.key] || "NO"} // Default to "NO"
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      [col.key]: e.target.value,
                    })
                  }
                >
                  <option value="YES">YES</option>
                  <option value="NO">NO</option>
                </select>
              ) : col.key === "sessionYear" ? (
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={selectedStudent?.[col.key] || yearOfEntry} // Default to current session
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      [col.key]: e.target.value,
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