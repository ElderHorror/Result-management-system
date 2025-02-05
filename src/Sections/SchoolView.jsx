import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { db } from '../../firebaseConfig'; // Adjust the import path as needed
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

export default function StudentView({ data, title, count }) {
  const [searchMatric, setSearchMatric] = useState('');
  const [searchName, setSearchName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);

  // Define fixed column names and their display labels
  const columns = [
    { key: 'matric_number', label: 'Matric No' },
    { key: 'name', label: 'Name' },
    { key: 'department', label: 'Department' },
    { key: 'cgpa', label: 'CGPA' },
    { key: 'suspended', label: 'Suspended' },
    { key: 'yearOfEntry', label: 'Year of Entry' },
    { key: 'modeOfEntry', label: 'Mode of Entry' },
  ];

  // Fetch data from Firebase on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "students"));
        const fetchedData = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Include the document ID for editing
          ...doc.data(),
        }));
        setStudents(fetchedData);
      } catch (err) {
        console.error("Error fetching data: ", err);
      }
    };
    fetchStudents();
  }, []);

  const handleSearchMatric = () => {
    console.log('Searching for matric number:', searchMatric);
  };

  const handleSearchName = () => {
    console.log('Searching for student name:', searchName);
  };

  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const handleSaveChanges = async (updatedStudent) => {
    try {
      const studentRef = doc(db, "students", updatedStudent.id);
      await updateDoc(studentRef, updatedStudent);
      console.log("Student data updated successfully!");
      setIsModalOpen(false);

      // Update local state to reflect changes
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === updatedStudent.id ? updatedStudent : student
        )
      );
    } catch (error) {
      console.error("Error updating student data: ", error);
    }
  };

  return (
    <div className="flex flex-col h-[80%] bg-gray-200 px-4 sm:px-6 lg:px-8 py-6">
      {/* Dropdown, Search Bars, and Add Button Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        {/* Level and Department Dropdowns */}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-gray-700 font-bold">Level:</span>
            <select
              className="px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              defaultValue="100"
            >
              {[100, 200, 300, 400].map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-700 font-bold">Department:</span>
            <select
              className="px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              defaultValue="Computer Science"
            >
              <option value="Computer Science">Computer Science</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="Cyber Security">Cyber Security</option>
            </select>
          </div>
        </div>

        {/* Search Bars */}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Matric Number"
              className="pl-10 pr-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
              value={searchMatric}
              onChange={(e) => setSearchMatric(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-2 text-gray-500" />
          </div>

          <div className="relative w-full">
            <input
              type="text"
              placeholder="Student Name"
              className="pl-10 pr-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-2 text-gray-500" />
          </div>
        </div>

        {/* Plus Button */}
        <button
          className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Add"
        >
          <FaPlus className="w-5 h-5" />
        </button>
      </div>

      {/* Form Section (Title and Table) */}
      <div className="w-full p-6 bg-white rounded-lg shadow-md overflow-x-auto">
        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">{title}</h2>

        {/* Table */}
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              {columns.map((column) => (
                <th key={column.key} className="border border-gray-300 px-4 py-2">
                  {column.label}
                </th>
              ))}
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((item, index) => (
              <tr key={index} className="text-center hover:bg-gray-100">
                {columns.map((column) => (
                  <td key={column.key} className="border border-gray-300 px-4 py-2">
                    {item[column.key] || "-"} {/* Display "-" if the field is missing */}
                  </td>
                ))}
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onClick={() => handleEditClick(item)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Editing */}
      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Student</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveChanges(selectedStudent);
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {columns.map((column) => (
                  <div key={column.key}>
                    <label className="block text-sm font-medium text-gray-700">
                      {column.label}
                    </label>
                    {column.key === "suspended" ? (
                      <select
                        value={selectedStudent[column.key] || ""}
                        onChange={(e) =>
                          setSelectedStudent({ ...selectedStudent, [column.key]: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        <option value="YES">YES</option>
                        <option value="NO">NO</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={selectedStudent[column.key] || ""}
                        onChange={(e) =>
                          setSelectedStudent({ ...selectedStudent, [column.key]: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}