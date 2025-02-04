import React, { useState } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa'; // Import the Plus and Search icons

export default function StudentView({ data, title, count }) {
  const [searchMatric, setSearchMatric] = useState('');
  const [searchName, setSearchName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [selectedStudent, setSelectedStudent] = useState(null); // State to store selected row data

  const handleSearchMatric = () => {
    // Implement search logic for matric number
    console.log('Searching for matric number:', searchMatric);
  };

  const handleSearchName = () => {
    // Implement search logic for student name
    console.log('Searching for student name:', searchName);
  };

  // Function to open the modal and set the selected student data
  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  // Function to handle form submission (save changes)
  const handleSaveChanges = (updatedStudent) => {
    console.log('Updated Student Data:', updatedStudent);
    // Here, you can implement logic to update the data in your state or backend
    setIsModalOpen(false); // Close the modal after saving
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
              <th className="border border-gray-300 px-4 py-2">Matric No</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Department</th>
              <th className="border border-gray-300 px-4 py-2">CGPA</th>
              <th className="border border-gray-300 px-4 py-2">Suspended</th>
              <th className="border border-gray-300 px-4 py-2">Year of Entry</th>
              <th className="border border-gray-300 px-4 py-2">Mode of Entry</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="text-center hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{item.matricNo}</td>
                <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                <td className="border border-gray-300 px-4 py-2">{item.department}</td>
                <td className="border border-gray-300 px-4 py-2">{item.cgpa}</td>
                <td className={`border border-gray-300 px-4 py-2 ${item.suspended === 'YES' ? 'text-green-600' : 'text-red-600'}`}>
                  {item.suspended}
                </td>
                <td className="border border-gray-300 px-4 py-2">{item.yearOfEntry}</td>
                <td className="border border-gray-300 px-4 py-2">{item.modeOfEntry}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onClick={() => handleEditClick(item)} // Pass the selected row data
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
                <div>
                  <label className="block text-sm font-medium text-gray-700">Matric No</label>
                  <input
                    type="text"
                    value={selectedStudent.matricNo}
                    onChange={(e) =>
                      setSelectedStudent({ ...selectedStudent, matricNo: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={selectedStudent.name}
                    onChange={(e) =>
                      setSelectedStudent({ ...selectedStudent, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <input
                    type="text"
                    value={selectedStudent.department}
                    onChange={(e) =>
                      setSelectedStudent({ ...selectedStudent, department: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">CGPA</label>
                  <input
                    type="text"
                    value={selectedStudent.cgpa}
                    onChange={(e) =>
                      setSelectedStudent({ ...selectedStudent, cgpa: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Suspended</label>
                  <select
                    value={selectedStudent.suspended}
                    onChange={(e) =>
                      setSelectedStudent({ ...selectedStudent, suspended: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="YES">YES</option>
                    <option value="NO">NO</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Year of Entry</label>
                  <input
                    type="text"
                    value={selectedStudent.yearOfEntry}
                    onChange={(e) =>
                      setSelectedStudent({ ...selectedStudent, yearOfEntry: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mode of Entry</label>
                  <input
                    type="text"
                    value={selectedStudent.modeOfEntry}
                    onChange={(e) =>
                      setSelectedStudent({ ...selectedStudent, modeOfEntry: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
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