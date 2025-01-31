import React from 'react';

export default function StudentLevels({ data, title, count }) {
  return (
    <div className="flex h-{80%} bg-gray-200 px-4 sm:px-6 lg:px-8">
      <div className="w-full min-w-{100%} p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">{title}</h2>
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
                <td className="border border-gray-300 px-4 py-2">{item.level}</td>
                <td className="border border-gray-300 px-4 py-2">{item.count}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
