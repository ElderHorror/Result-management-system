import React, { useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa"; // Import the Plus and Search icons
import Modal from "./Modal"; // Import the Modal component

export default function StudentView({ data, columns, title, count, onAdd, onEdit }) {
  const [searchMatric, setSearchMatric] = useState("");
  const [searchName, setSearchName] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // State for Add modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for Edit modal
  const [selectedStudent, setSelectedStudent] = useState(null); // State to store selected student for editing
  const [newStudent, setNewStudent] = useState({}); // State to store new student data

  const handleSearchMatric = () => {
    // Implement search logic for matric number
    console.log("Searching for matric number:", searchMatric);
  };

  const handleSearchName = () => {
    // Implement search logic for student name
    console.log("Searching for student name:", searchName);
  };

  const handleAdd = () => {
    setIsAddModalOpen(true); // Open the Add modal
  };

  const handleEdit = (student) => {
    setSelectedStudent(student); // Set the selected student
    setIsEditModalOpen(true); // Open the Edit modal
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false); // Close the Add modal
    setNewStudent({}); // Reset new student data
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false); // Close the Edit modal
    setSelectedStudent(null); // Reset selected student
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    onAdd(newStudent); // Pass the new student data to the parent component
    handleCloseAddModal(); // Close the modal
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onEdit(selectedStudent); // Pass the updated student data to the parent component
    handleCloseEditModal(); // Close the modal
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
          onClick={handleAdd} // Open the Add modal
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
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="text-center hover:bg-gray-100">
                {columns.map((column) => (
                  <td key={column.key} className="border border-gray-300 px-4 py-2">
                    {column.render
                      ? column.render(item, () => handleEdit(item)) // Pass handleEdit to the render function
                      : column.format
                      ? column.format(item[column.key])
                      : item[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} onClose={handleCloseAddModal}>
        <h2 className="text-xl font-bold mb-4">Add Student</h2>
        <form onSubmit={handleAddSubmit} className="space-y-4">
          {columns.map((column) => (
            <div key={column.key} className="mb-4">
              <label className="block text-gray-700">{column.header}</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                placeholder={`Enter ${column.header}`}
                value={newStudent[column.key] || ""}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, [column.key]: e.target.value })
                }
              />
            </div>
          ))}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Add Student
          </button>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={handleCloseEditModal}>
        <h2 className="text-xl font-bold mb-4">Edit Student</h2>
        <form onSubmit={handleEditSubmit} className="space-y-4">
          {columns.map((column) => (
            <div key={column.key} className="mb-4">
              <label className="block text-gray-700">{column.header}</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                value={selectedStudent?.[column.key] || ""}
                onChange={(e) =>
                  setSelectedStudent({
                    ...selectedStudent,
                    [column.key]: e.target.value,
                  })
                }
              />
            </div>
          ))}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Save Changes
          </button>
        </form>
      </Modal>
    </div>
  );
}