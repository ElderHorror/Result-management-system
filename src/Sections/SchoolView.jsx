import React, { useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import Modal from "./Modal";

export default function StudentView({ data, columns, title, count, onAdd, onEdit }) {
  const [searchMatric, setSearchMatric] = useState("");
  const [searchName, setSearchName] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newItem, setNewItem] = useState({});

  const filteredColumns = columns.filter(col => col.key !== 'id');

  const handleSearchMatric = () => {
    console.log("Searching for matric number:", searchMatric);
  };

  const handleSearchName = () => {
    console.log("Searching for student name:", searchName);
  };

  const handleAdd = () => setIsAddModalOpen(true);
  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedItem(null);
    setNewItem({});
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    onAdd(newItem);
    handleCloseModals();
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onEdit(selectedItem);
    handleCloseModals();
  };

  return (
    <div className="flex flex-col h-[80%] bg-gray-200 px-4 sm:px-6 lg:px-8 py-6">
      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        {/* ... (keep your existing dropdowns and search bars) */}

        <button
          className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={handleAdd}
        >
          <FaPlus className="w-5 h-5" />
        </button>
      </div>

      {/* Table Section */}
      <div className="w-full p-6 bg-white rounded-lg shadow-md overflow-x-auto">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">{title}</h2>
        
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              {filteredColumns.map((col) => (
                <th key={col.key} className="border border-gray-300 px-4 py-2">
                  {col.header}
                </th>
              ))}
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="text-center hover:bg-gray-100">
                {filteredColumns.map((col) => (
                  <td key={col.key} className="border border-gray-300 px-4 py-2">
                    {col.format ? col.format(item[col.key]) : item[col.key] || "-"}
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

      {/* Modals */}
      <Modal isOpen={isAddModalOpen} onClose={handleCloseModals}>
        <h2 className="text-xl font-bold mb-4">Add New</h2>
        <form onSubmit={handleAddSubmit} className="space-y-4">
          {filteredColumns.map((col) => (
            <div key={col.key} className="mb-4">
              <label className="block text-gray-700">{col.header}</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                value={newItem[col.key] || ""}
                onChange={(e) => setNewItem({ ...newItem, [col.key]: e.target.value })}
              />
            </div>
          ))}
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Add
          </button>
        </form>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={handleCloseModals}>
        <h2 className="text-xl font-bold mb-4">Edit</h2>
        <form onSubmit={handleEditSubmit} className="space-y-4">
          {filteredColumns.map((col) => (
            <div key={col.key} className="mb-4">
              <label className="block text-gray-700">{col.header}</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                value={selectedItem?.[col.key] || ""}
                onChange={(e) => setSelectedItem({ ...selectedItem, [col.key]: e.target.value })}
              />
            </div>
          ))}
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Save Changes
          </button>
        </form>
      </Modal>
    </div>
  );
};