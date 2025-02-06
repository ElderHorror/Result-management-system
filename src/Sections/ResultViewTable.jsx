import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig"; // Adjust path if needed
import {
  collection,
  onSnapshot,
  setDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

const ResultViewTable = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const storedLevel = sessionStorage.getItem("selectedLevel") || "All"; // Get stored level
  const [filterLevel, setFilterLevel] = useState(storedLevel);
  const [filterSemester, setFilterSemester] = useState("All");
  const [results, setResults] = useState({});
  const [editingStudent, setEditingStudent] = useState(null);

  // Fetch courses from Firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "courses"), (snapshot) => {
      const courseList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCourses(courseList);
    });

    return () => unsubscribe();
  }, []);

  // Fetch students from Firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "students"), (snapshot) => {
      const studentList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentList);
    });

    return () => unsubscribe();
  }, []);

  // Filter courses based on selected level & semester
  const filteredCourses = courses.filter(
    (course) =>
      (filterLevel === "All" || course.level === filterLevel) &&
      (filterSemester === "All" || course.semester === filterSemester)
  );

  // Filter students based on selected level & semester
  const filteredStudents = students.filter(
    (student) =>
      (filterLevel === "All" || student.level === filterLevel) &&
      (filterSemester === "All" || student.semester === filterSemester)
  );

  // Handle editing student
  const handleEditClick = (student) => {
    setEditingStudent(student.id);
    setResults(student.results || {});
  };

  // Handle result input change (only while editing)
  const handleResultChange = (courseCode, value) => {
    setResults((prevResults) => ({
      ...prevResults,
      [courseCode]: value,
    }));
  };

  // Save edited results to Firebase
  const saveResults = async () => {
    if (!editingStudent) return;

    try {
      const studentRef = doc(db, "students", editingStudent);

      for (const courseCode in results) {
        const resultRef = doc(
          db,
          "students",
          editingStudent,
          "results",
          courseCode
        );
        await setDoc(
          resultRef,
          { score: results[courseCode] },
          { merge: true }
        );
      }

      const { totalUnits, totalPoints, GPA, failedCourses } = calculateGPA({
        results,
      });

      await updateDoc(studentRef, {
        results,
        cgpa: GPA.toFixed(2), // Store the calculated GPA
        carryOver: failedCourses.length > 0 ? "Yes" : "No", // Update carryover status
      });

      setEditingStudent(null);
    } catch (error) {
      console.error("Error saving results: ", error);
    }
  };

  // Function to calculate the GPA and carryover courses for each student
  const calculateGPA = (student) => {
    let totalUnits = 0;
    let totalPoints = 0;
    let failedCourses = [];
    
    filteredCourses.forEach((course) => {
      const score = student.results?.[course.course_code];
      const courseUnit = Number(course.units);

      // Calculate points based on score
      let points = 0;
      if (score >= 70) {
        points = 5;
      } else if (score >= 60) {
        points = 4;
      } else if (score >= 50) {
        points = 3;
      } else if (score >= 45) {
        points = 2;
      } else if (score >= 40) {
        points = 1;
      } 
      // Consider marks below 40 as failed
      else {
        points = 0;
        failedCourses.push(course.course_code); // Store the course code of the failed course
      }

      totalUnits += courseUnit;
      totalPoints += points * courseUnit;
    });

    const GPA = totalUnits > 0 ? totalPoints / totalUnits : 0;

    return { totalUnits, totalPoints, GPA, failedCourses };
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Student Results</h2>

      {/* Filter Dropdowns */}
      <div className="mb-4">
        <label className="mr-2">Level:</label>
        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="All">All Levels</option>
          <option value="100">100</option>
          <option value="200">200</option>
          <option value="300">300</option>
          <option value="400">400</option>
        </select>

        <label className="ml-4 mr-2">Semester:</label>
        <select
          value={filterSemester}
          onChange={(e) => setFilterSemester(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="All">All Semesters</option>
          <option value="1">1st Semester</option>
          <option value="2">2nd Semester</option>
        </select>
      </div>

      {/* Result Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Student Name</th>
              <th className="border px-4 py-2">Matric Number</th>
              <th className="border px-4 py-2">Department</th>
              <th className="border px-4 py-2">Level</th>
              {filteredCourses.map((course) => (
                <th key={course.id} className="border px-4 py-2">
                  {course.course_code}
                </th>
              ))}
              <th className="border px-4 py-2">TNU</th>
              <th className="border px-4 py-2">TCP</th>
              <th className="border px-4 py-2">GPA</th>
              <th className="border px-4 py-2">Carry Over</th> {/* New Carry Over column */}
              <th className="border px-4 py-2">Edit</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => {
              const { totalUnits, totalPoints, GPA, failedCourses } = calculateGPA(student);
              return (
                <tr key={student.id} className="text-center hover:bg-gray-100">
                  <td className="border px-4 py-2">{student.name}</td>
                  <td className="border px-4 py-2">{student.matric_number}</td>
                  <td className="border px-4 py-2">{student.department}</td>
                  <td className="border px-4 py-2">{student.level}</td>
                  {filteredCourses.map((course) => {
                    const score = student.results?.[course.course_code] || 0;
                    const isFailed = score < 40;
                    return (
                      <td key={course.id} className={`border px-4 py-2 ${isFailed ? 'bg-red-500 text-white' : ''}`}>
                        {editingStudent === student.id ? (
                          <input
                            type="number"
                            value={results[course.course_code] || ""}
                            onChange={(e) =>
                              handleResultChange(course.course_code, e.target.value)
                            }
                            className="w-20 border rounded p-1"
                          />
                        ) : (
                          score || "N/A"
                        )}
                      </td>
                    );
                  })}
                  <td className="border px-4 py-2">{totalUnits}</td>
                  <td className="border px-4 py-2">{totalPoints}</td>
                  <td className="border px-4 py-2">{GPA.toFixed(2)}</td>
                  <td className="border px-4 py-2">
                    {failedCourses.length > 0 ? failedCourses.join(', ') : "None"}
                  </td>
                  <td className="border px-4 py-2">
                    {editingStudent === student.id ? (
                      <button
                        onClick={saveResults}
                        className="bg-green-500 text-white py-1 px-4 rounded"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEditClick(student)}
                        className="bg-blue-500 text-white py-1 px-4 rounded"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultViewTable;
