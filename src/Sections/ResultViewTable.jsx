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
  // Save edited results to Firebase
const saveResults = async () => {
    if (!editingStudent) return;
  
    try {
      const studentRef = doc(db, "students", editingStudent);
  
      // Save results under `results` collection using course_code as the document ID
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
  
      // Update student's document with a reference to results
      await updateDoc(studentRef, { results });
  
      // Check if all results are uploaded (all courses should have results)
      const allResultsUploaded = filteredCourses.every((course) =>
        results.hasOwnProperty(course.course_code)
      );
  
      if (allResultsUploaded) {
        // Update the resultSubmitted field in the lecturerTable
        const lecturerRef = doc(db, "lecturers", studentRef.id);
        await updateDoc(lecturerRef, { resultSubmitted: "Yes" });
      }
  
      // ✅ Automatically update UI (No refresh needed)
      setEditingStudent(null);
    } catch (error) {
      console.error("Error saving results: ", error);
    }
  };
  

  // Function to calculate the GPA for each student
  const calculateGPA = (student) => {
    let totalUnits = 0;
    let totalPoints = 0;

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

      // Multiply points by course unit
      totalUnits += courseUnit;
      totalPoints += points * courseUnit;
    });

    // Calculate GPA
    const GPA = totalUnits > 0 ? totalPoints / totalUnits : 0;

    return { totalUnits, totalPoints, GPA };
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
              <th className="border px-4 py-2">Edit</th> {/* Edit column moved here */}
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => {
              const { totalUnits, totalPoints, GPA } = calculateGPA(student);
              return (
                <tr key={student.id} className="text-center hover:bg-gray-100">
                  <td className="border px-4 py-2">{student.name}</td>
                  <td className="border px-4 py-2">{student.matric_number}</td>
                  <td className="border px-4 py-2">{student.department}</td>
                  <td className="border px-4 py-2">{student.level}</td>
                  {filteredCourses.map((course) => (
                    <td key={course.id} className="border px-4 py-2">
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
                        student.results?.[course.course_code] || "N/A"
                      )}
                    </td>
                  ))}
                  <td className="border px-4 py-2">{totalUnits}</td>
                  <td className="border px-4 py-2">{totalPoints}</td>
                  <td className="border px-4 py-2">{GPA.toFixed(2)}</td>
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
