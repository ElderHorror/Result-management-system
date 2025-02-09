import React, { useState, useRef, useEffect } from "react";
import SideBar from "./Component/SideBar";
import Header from "./Component/Header";
import Section from "./Component/Section";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaArrowRight } from "react-icons/fa";

const App = () => {
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const contentRef = useRef(null);

  // Reset scroll position when step changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [currentStep]);

  const steps = [
    {
      title: "Step 1: Add Courses",
      description: [
        "Go to the Courses tab, select any level, and click on the Add button. Input all courses, units, and related data. This data will automatically link to the Results database for score input.",
        "Go to the <strong>Courses</strong> tab",
        "Select any level <strong>View</strong> tab",
        "Click on the <strong>Add</strong> button",
        "Input all courses, units, and courses-related data.",
        "This data will automatically link to the <strong>Results</strong> database for score input",
        "Proceed to add course",
        "The course added will reflect in the table",
      ],
      images: [
        "../public/courses/coursesFilled.png",
        "../../public/courses/course-direction.png",
        "../../public/courses/course_view.png",
        "../../public/courses/add_modal.png",
        "../../public/courses/extended_add_modal.png",
        "../../public/courses/filled_add_modal.png",
        "../../public/courses/save_modal.png",
        "../../public/courses/filled_table.png",
      ],
    },
    {
      title: "Step 2: Add Lecturers",
      description: [
        "Return to the Homepage",
        "Go to the Lecturers tab",
        "Select the corresponding level view tab",
        "Click on the add button",
        "Input all lecturers teaching each course. Specify the level they are teaching.",
        "Ensure this data is accurate",
        "Proceed to add Lecturer",
        "This data updates the table and the Lecturer data is then added",
      ],
      images: [
        "../../public/lecturer/homepage.png",
        "../../public/lecturer/lecturer_tab.png",
        "../../public/lecturer/level_view.png",
        "../../public/lecturer/add_modal.png",
        "../../public/lecturer/extened_add_modal.png",
        "../../public/lecturer/filled_extended_add_modal.png",
        "../../public/lecturer/add_lecturer.png",
        "../../public/lecturer/filled_table.png",
      ],
    },
    {
      title: "Step 3: Add Students",
      description: [
        "Return to the Homepage",
        "Go to the Students tab",
        "Select the corresponding level view tab",
        "Click on the add button",
        "Input student details like name, matric number, department, and year of entry.",
        "Ensure this data is accurate, Especially the Year of Entry as this also affects the Results filter",
        "Proceed to add Student",
        "This data updates the table and the Students data is then added",
      ],
      images: [
        "../../public/students/homepage.png",
        "../../public/students/students_tab.png",
        "../../public/students/student_view.png",
        "../../public/students/add_modal.png",
        "../../public/students/extended_add_modal.png",
        "../../public/students/filled_extended_add_modal.png",
        "../../public/students/add_student.png",
        "../../public/students/filled_table.png",
      ],
    },
    {
      title: "Step 4: Input Results",
      description: [
        "Return to the Homepage",
        "Go to the Results tab",
        "Select the corresponding level view tab",
        "Click on the edit button",
        "Input student scores for each course.",
        "Proceed to save student scores for each course.",
        "The system will automatically calculate TNU, TCP, GPA, and CGPA.",
        "To move over to the next Session, Click the promote button",
        "This data updates the table and the Students data is then moved to the next level",
      ],
      images: [
        "../../public/results/homepage.png",
        "../../public/results/results_tab.png",
        "../../public/results/result_view.png",
        "../../public/results/edit_results.png",
        "../../public/results/fill_table.png",
        "../../public/results/save_results.png",
        "../../public/results/filled_table.png",
        "../../public/results/promote_students.png",
        "../../public/results/next_level.png",
      ],
    },
  ];

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsTutorialOpen(false); // Close modal after last step
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      setIsTutorialOpen(false); // Close modal if on the first step
    }
  };

  return (
    <div>
      <div className="flex sm:h-screen md:h-screen bg-gray-200 font-poppins">
        <SideBar />
        <main className="flex-1 flex flex-col">
          <Header />
          <h1 className="px-10 text-2xl font-medium pt-[170px] md:pt-4">
            Admin Dashboard
          </h1>
          <div className="flex flex-row gap-1 px-10 pt-2 pb-8 text-base text-gray-700">
            <Link to="/">Home</Link>
            <Link to="/" className="flex flex-row gap-1 text-purple-700">
              <IoIosArrowForward size={23} className="pt-1" />
              Admin
            </Link>
          </div>
          {/* Get Started Button */}
          <div className="px-10 mb-6">
            <button
              onClick={() => {
                setIsTutorialOpen(true);
                setCurrentStep(1); // Reset to first step
              }}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300"
            >
              Get Started
            </button>
          </div>
          <Section />
        </main>
      </div>

      {/* Tutorial Popup Modal */}
      {isTutorialOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-3xl w-full mx-4 overflow-y-auto max-h-[90vh] font-inter">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">How to Use the Site</h2>
              <button
                onClick={() => setIsTutorialOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Progress Indicator */}
            <div className="mb-6">
              <p className="text-gray-600">
                Step {currentStep} of {steps.length}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-purple-600 h-2.5 rounded-full"
                  style={{ width: `${(currentStep / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Tutorial Content */}
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <FaCheckCircle className="text-purple-600" />{" "}
                  {steps[currentStep - 1].title}
                </h3>

                {/* Scrollable Content for All Steps */}
                <div
                  className="overflow-y-auto max-h-[50vh] w-full px-4"
                  ref={contentRef}
                >
                  {steps[currentStep - 1].description.map((desc, index) => (
                    <div key={index} className="mb-8">
                      <p
                        className="text-gray-700 text-center text-lg leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: desc }}
                      />
                      {steps[currentStep - 1].images[index] && (
                        <img
                          src={steps[currentStep - 1].images[index]}
                          alt={`Step ${currentStep} - ${index + 1}`}
                          className="rounded-lg mb-6 w-full max-w-2xl mx-auto shadow-lg"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between">
              <button
                onClick={handlePrevStep}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition duration-300"
              >
                Prev
              </button>
              <button
                onClick={handleNextStep}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition duration-300 flex items-center gap-2"
              >
                {currentStep === steps.length ? "Finish" : "Next"}
                {currentStep < steps.length && <FaArrowRight />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;