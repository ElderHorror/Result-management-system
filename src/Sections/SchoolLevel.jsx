import React, { useState } from "react";
import { FaPlus } from "react-icons/fa"; // Import the Plus icon
import { Link } from "react-router-dom";

export default function StudentLevels({ data, title, count, view }) {
  // State to manage the selected session
  const [selectedSession, setSelectedSession] = useState(() => {
    return sessionStorage.getItem("selectedSession") || "2024-2025"; // Default session
  });

  // Function to handle session change
  const handleSessionChange = (e) => {
    const newSession = e.target.value;
    setSelectedSession(newSession);
    sessionStorage.setItem("selectedSession", newSession); // Save to sessionStorage
  };

  return (
    <div className="flex flex-col h-[80%] bg-gray-200 px-4 sm:px-10 lg:px-8">
      {/* Dropdown Section (Session and Semester) */}
      <div className="w-full px-1 mb-6">
        <div className="flex flex-row items-center justify-between">
          {/* Session and Semester Dropdowns (Far Left) */}
          <div className="flex items-center gap-4">
            {/* Session Label and Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-bold">Session:</span>
              <select
                className="px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={selectedSession} // Use state value
                onChange={handleSessionChange} // Handle change
              >
                {Array.from({ length: 7 }, (_, i) => {
                  const startYear = 2018 + i;
                  const endYear = startYear + 1;
                  return (
                    <option key={startYear} value={`${startYear}-${endYear}`}>
                      {startYear}/{endYear}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Semester Label and Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-bold">Semester:</span>
              <select
                className="px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                defaultValue="1" // Default selected semester
              >
                <option value="1st">1st</option>
                <option value="2nd">2nd</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section (Title and Table) */}
      <div className="w-full p-6 bg-white rounded-lg shadow-md">
        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          {title}
        </h2>

        {/* Table */}
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Level</th>
              <th className="border border-gray-300 px-4 py-2">{count}</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="text-center hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">
                  {item.level}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.count}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <Link
                    to={view}
                    onClick={() => {
                      sessionStorage.setItem("selectedLevel", item.level); // Store level in sessionStorage
                      sessionStorage.setItem(
                        "selectedSession",
                        selectedSession
                      ); // Store selected session
                    }}
                    className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
