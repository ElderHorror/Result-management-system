import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { db } from '../../firebaseConfig';
import { collection, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';
import Modal from './Modal'; // Importing the Modal component

export default function StudentView({ title }) {
    const [searchMatric, setSearchMatric] = useState('');
    const [searchName, setSearchName] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [newStudent, setNewStudent] = useState({});
    const [students, setStudents] = useState([]);
    const [columns, setColumns] = useState([]); // Store columns dynamically

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch student data
                const querySnapshot = await getDocs(collection(db, "students"));
                const studentData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setStudents(studentData);

                // Determine the columns from the fetched data
                if (studentData.length > 0) {
                    const firstStudent = studentData[0];
                    const definedOrder = ['name', 'matric_number', 'level', 'department', 'suspended', 'modeOfEntry', ...Object.keys(firstStudent).filter(key => !['id', 'name', 'matric_number', 'level', 'department', 'suspended', 'modeOfEntry'].includes(key))];
                    setColumns(definedOrder.map(key => ({ key, header: key.replace(/_/g, ' ').toUpperCase() })));
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleSearchMatric = () => {
        console.log('Searching for matric number:', searchMatric);
    };

    const handleSearchName = () => {
        console.log('Searching for student name:', searchName);
    };

    const handleAdd = () => {
        setIsAddModalOpen(true);
    };

    const handleEdit = (student) => {
        setSelectedStudent(student);
        setIsEditModalOpen(true);
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
        setNewStudent({});
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedStudent(null);
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "students"), newStudent);
            console.log("Student added successfully!");
            handleCloseAddModal();
        } catch (error) {
            console.error("Error adding student:", error);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const studentRef = doc(db, "students", selectedStudent.id);
            await updateDoc(studentRef, selectedStudent);
            console.log("Student data updated successfully!");
            handleCloseEditModal();
        } catch (error) {
            console.error("Error updating student data:", error);
        }
    };

    return (
        <div className="flex flex-col h-[80%] bg-gray-200 px-4 sm:px-6 lg:px-8 py-6">
            {/* Dropdowns and Search Bars */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
                <div className="relative w-full">
                    <input
                        type="text"
                        placeholder="Search Matric Number"
                        className="pl-10 pr-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                        value={searchMatric}
                        onChange={(e) => setSearchMatric(e.target.value)}
                    />
                    <FaSearch className="absolute left-3 top-2 text-gray-500" />
                </div>
                <div className="relative w-full">
                    <input
                        type="text"
                        placeholder="Search Student Name"
                        className="pl-10 pr-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                    />
                    <FaSearch className="absolute left-3 top-2 text-gray-500" />
                </div>
                <button
                    className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onClick={handleAdd} // Open the Add modal
                    aria-label="Add Student"
                >
                    <FaPlus className="w-5 h-5" />
                </button>
            </div>

            {/* Form Section (Title and Table) */}
            <div className="w-full p-6 bg-white rounded-lg shadow-md overflow-x-auto">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">{title}</h2>
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            {columns.map((column) => (
                                <th key={column.key} className="border border-gray-300 px-4 py-2">
                                    {column.header}
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
                                        {item[column.key] || "-"}
                                    </td>
                                ))}
                                <td className="border border-gray-300 px-4 py-2">
                                    <button
                                        className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        onClick={() => handleEdit(item)}
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Modal */}
            <Modal isOpen={isAddModalOpen} onClose={handleCloseAddModal}>
                <h2 className="text-xl font-bold mb-4">Add Student</h2>
                <form onSubmit={handleAddSubmit}>
                    {columns.map((column) => (
                        <div key={column.key}>
                            <label className="block text-gray-700">{column.header}</label>
                            {column.key === 'suspended' ? (
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    onChange={(e) => setNewStudent({ ...newStudent, [column.key]: e.target.value })}
                                >
                                    <option value="">Select...</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            ) : column.key === 'mode_of_entry' ? (
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    onChange={(e) => setNewStudent({ ...newStudent, [column.key]: e.target.value })}
                                >
                                    <option value="">Select...</option>
                                    <option value="JUPEB">JUPEB</option>
                                    <option value="UTME/DE">UTME/DE</option>
                                    <option value="CEDLEP">CEDLEP</option>
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    placeholder={`Enter ${column.header}`}
                                    onChange={(e) => setNewStudent({ ...newStudent, [column.key]: e.target.value })}
                                />
                            )}
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
                <form onSubmit={handleEditSubmit}>
                    {columns.map((column) => (
                        <div key={column.key}>
                            <label className="block text-gray-700">{column.header}</label>
                            {column.key === 'suspended' ? (
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    value={selectedStudent?.[column.key] || ""}
                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, [column.key]: e.target.value })}
                                >
                                    <option value="">Select...</option>
                                    <option value="Yes">YES</option>
                                    <option value="No">NO</option>
                                </select>
                            ) : column.key === 'modeOfEntry' ? (
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    value={selectedStudent?.[column.key] || ""}
                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, [column.key]: e.target.value })}
                                >
                                    <option value="">Select...</option>
                                    <option value="Jupeb">Jupeb</option>
                                    <option value="UTME/DE">UTME/DE</option>
                                    <option value="CEDLEP">CEDLEP</option>
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    value={selectedStudent?.[column.key] || ""}
                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, [column.key]: e.target.value })}
                                />
                            )}
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
