import React, { useEffect, useState, useRef } from "react";
import { db } from "../../firebaseConfig"; // Adjust path if needed
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ResultViewTable = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const storedLevel = sessionStorage.getItem("selectedLevel") || "All"; // Get stored level
  const [filterLevel, setFilterLevel] = useState(storedLevel);
  const [filterSemester, setFilterSemester] = useState("All");
  const [filterSession, setFilterSession] = useState(() => {
    return sessionStorage.getItem("selectedSession") || "2023-2024"; // Default session
  });
  const [results, setResults] = useState({});
  const [editingStudent, setEditingStudent] = useState(null);
  const [isPromoting, setIsPromoting] = useState(false); // For promotion loading state
  const [promotionStatus, setPromotionStatus] = useState(""); // For promotion status feedback

  // Create a ref for the table container
  const tableRef = useRef(null);

  // PDF Download Handler
  const handleDownloadPDF = async () => {
    if (!tableRef.current) return;

    try {
      const input = tableRef.current;
      const canvas = await html2canvas(input, {
        scale: 2, // Increase for better resolution
        useCORS: true,
        logging: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape", // Use landscape for wider tables
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 280; // A4 width in mm (landscape)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`results_${filterLevel}_${filterSession}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

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

  // Handle level change
  const handleLevelChange = async (selectedLevel) => {
    setFilterLevel(selectedLevel);
    sessionStorage.setItem("selectedLevel", selectedLevel); // Save selected level
  };

  // Filter courses based on selected level & semester
  const filteredCourses = courses.filter(
    (course) =>
      (filterLevel === "All" || course.level === filterLevel) &&
      (filterSemester === "All" || course.semester === filterSemester)
  );

  // Filter students based on selected level, semester, and session
  const filteredStudents = students.filter(
    (student) =>
      (filterLevel === "All" || student.results?.[filterLevel]) && // Check if student has results for the selected level
      (filterSemester === "All" || student.semester === filterSemester) &&
      student.sessionYear === filterSession // Filter by session
  );

  // Handle editing student
  const handleEditClick = (student) => {
    setEditingStudent(student.id);
    // Load results for the selected level (filterLevel)
    const levelResults = student.results?.[filterLevel] || {};
    setResults(levelResults);
  };

  // Handle result input change (only while editing)
  const handleResultChange = (courseCode, value) => {
    let score = Math.min(100, Math.max(0, Number(value))); // Clamp between 0-100
    if (isNaN(score)) score = "";

    setResults((prevResults) => ({
      ...prevResults,
      [courseCode]: score,
    }));
  };

  // Function to calculate the GPA, TNU, and TCP for the selected level
  const calculateGPA = (results) => {
    let totalUnits = 0;
    let totalPoints = 0;
    let newFailedCourses = []; // Track newly failed courses

    // Check current results
    filteredCourses.forEach((course) => {
      const score = results[course.course_code];
      const courseUnit = Number(course.units); // Get the unit of the course

      // Only calculate if score exists
      if (typeof score === "number") {
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
        } else {
          points = 0;
          newFailedCourses.push(course.course_code); // Add newly failed courses
        }

        totalUnits += courseUnit;
        totalPoints += points * courseUnit;
      }
    });

    const GPA = totalUnits > 0 ? totalPoints / totalUnits : 0;

    return { totalUnits, totalPoints, GPA, newFailedCourses };
  };

  // Function to calculate cumulative TNU, TCP, and CGPA across all levels
  const calculateCumulative = (results, allCourses) => {
    let totalTNU = 0;
    let totalTCP = 0;

    // Iterate through all levels
    Object.values(results || {}).forEach((levelResults) => {
      Object.entries(levelResults).forEach(([courseCode, score]) => {
        const course = allCourses.find((c) => c.course_code === courseCode);
        if (course && typeof score === "number") {
          const units = Number(course.units);
          let points = 0;

          if (score >= 70) points = 5;
          else if (score >= 60) points = 4;
          else if (score >= 50) points = 3;
          else if (score >= 45) points = 2;
          else if (score >= 40) points = 1;

          totalTNU += units;
          totalTCP += points * units;
        }
      });
    });

    const CGPA = totalTNU > 0 ? totalTCP / totalTNU : 0;
    return { totalTNU, totalTCP, CGPA };
  };

  // Save results to Firestore
  const saveResults = async () => {
    if (!editingStudent) return;

    try {
      const studentRef = doc(db, "students", editingStudent);
      const studentDoc = await getDoc(studentRef);
      const studentData = studentDoc.data() || {};

      // Merge the new results with the existing results for the current level
      const updatedResults = {
        ...studentData.results, // Preserve existing results for all levels
        [filterLevel]: {
          ...studentData.results?.[filterLevel], // Preserve existing results for the current level
          ...results, // Add/update the new results
        },
      };

      // Calculate GPA and carryover for the current level
      const { GPA, newFailedCourses } = calculateGPA(results);

      // Merge new failed courses with existing carryover courses
      const existingCarryOver = studentData.carryOverCourses || [];
      const updatedCarryOver = [
        ...new Set([...existingCarryOver, ...newFailedCourses]), // Combine and remove duplicates
      ];

      // Calculate cumulative TNU, TCP, and CGPA across all levels
      const cumulative = calculateCumulative(updatedResults, courses);

      // Update the student's document with the merged results and cumulative values
      await updateDoc(studentRef, {
        results: updatedResults,
        cgpa: GPA.toFixed(2), // Save the calculated GPA for the current level
        carryOver: updatedCarryOver.length > 0 ? "Yes" : "No", // Update carryover status
        carryOverCourses: updatedCarryOver, // Save updated carryover courses
        totalTNU: cumulative.totalTNU, // Save cumulative TNU
        totalTCP: cumulative.totalTCP, // Save cumulative TCP
        CGPA: cumulative.CGPA.toFixed(2), // Save cumulative CGPA
      });

      setEditingStudent(null); // Clear the editing state
    } catch (error) {
      console.error("Error saving results: ", error);
    }
  };

  // Promote all students to the next level
  const promoteAllStudents = async () => {
    setIsPromoting(true);
    try {
      await Promise.all(
        filteredStudents.map(async (student) => {
          const newLevel = (Number(student.level) + 100).toString(); // Increment level by 100
          const studentRef = doc(db, "students", student.id);

          // Preserve existing results and initialize the new level
          const updatedResults = {
            ...student.results, // Keep all existing results
            [newLevel]: student.results[newLevel] || {}, // Initialize next level if it doesn't exist
          };

          // Update the student's level and results
          await updateDoc(studentRef, {
            level: newLevel,
            results: updatedResults,
          });
        })
      );

      setPromotionStatus("Done ✅");
      setTimeout(() => setPromotionStatus(""), 2000); // Reset status after 2 seconds
    } catch (error) {
      console.error("Promotion error:", error);
      setPromotionStatus("Error ❌");
    } finally {
      setIsPromoting(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Student Results</h2>

      {/* Filter Dropdowns and Buttons */}
      <div className="mb-4 flex items-center gap-4 flex-wrap">
        <label className="mr-2">Level:</label>
        <select
          value={filterLevel}
          onChange={(e) => handleLevelChange(e.target.value)}
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

        <label className="ml-4 mr-2">Session:</label>
        <select
          value={filterSession}
          onChange={(e) => setFilterSession(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="2021-2022">2021/2022</option>
          <option value="2022-2023">2022/2023</option>
          <option value="2023-2024">2023/2024</option>
          <option value="2024-2025">2024/2025</option>
        </select>

        {/* Download PDF Button */}
        <button
          onClick={handleDownloadPDF}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          Download PDF
        </button>

        {/* Promote Button */}
        <button
          onClick={promoteAllStudents}
          disabled={isPromoting}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 flex items-center gap-2"
        >
          {isPromoting ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Promoting...
            </>
          ) : (
            promotionStatus || "Promote All Students"
          )}
        </button>
      </div>

      {/* Result Table */}
      <div className="overflow-x-auto" ref={tableRef}>
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
              <th className="border px-4 py-2">CGPA</th>
              <th className="border px-4 py-2">Carry Over</th>
              <th className="border px-4 py-2">Edit</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td
                  colSpan={filteredCourses.length + 10}
                  className="text-center text-gray-500"
                >
                  No students found for the selected filters.
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => {
                // Get results for the selected level
                const levelResults = student.results?.[filterLevel] || {};
                const { totalUnits, totalPoints, GPA } = calculateGPA(levelResults);

                return (
                  <tr key={student.id} className="text-center hover:bg-gray-100">
                    <td className="border px-4 py-2">{student.name}</td>
                    <td className="border px-4 py-2">{student.matric_number}</td>
                    <td className="border px-4 py-2">{student.department}</td>
                    <td className="border px-4 py-2">{student.level}</td>
                    {filteredCourses.map((course) => {
                      const score = levelResults[course.course_code] || "N/A";
                      const isFailed = score < 40; // Check if the score is below passing
                      return (
                        <td
                          key={course.id}
                          className={`border px-4 py-2 ${
                            isFailed ? "bg-red-500 text-white" : ""
                          }`}
                        >
                          {editingStudent === student.id ? (
                            <input
                              type="number"
                              value={results[course.course_code] || ""}
                              onChange={(e) =>
                                handleResultChange(course.course_code, e.target.value)
                              }
                              min="0"
                              max="100"
                              className="w-20 border rounded p-1 text-black"
                            />
                          ) : (
                            score
                          )}
                        </td>
                      );
                    })}
                    <td className="border px-4 py-2">{totalUnits}</td>
                    <td className="border px-4 py-2">{totalPoints}</td>
                    <td className="border px-4 py-2">{GPA.toFixed(2)}</td>
                    <td className="border px-4 py-2">
                      {student.CGPA ? Number(student.CGPA).toFixed(2) : "N/A"}
                    </td>
                    <td className="border px-4 py-2">
                      {student.carryOverCourses && student.carryOverCourses.length > 0
                        ? student.carryOverCourses.join(", ")
                        : "None"}
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
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultViewTable;