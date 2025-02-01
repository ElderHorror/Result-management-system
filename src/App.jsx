// App.jsx
import React from "react";
import SideBar from "./Component/SideBar";
import Header from "./Component/Header";
import Section from "./Component/Section";
import StudentLevels from "./Sections/SchoolLevel";
import { IoIosArrowForward, IoIosPaper } from "react-icons/io";
import { Link } from "react-router-dom";

const App = () => {
  return (
    <div>
      <div className="flex h-full md:h-screen bg-gray-200 font-poppins">
        <SideBar />

        <main className="flex-1 flex flex-col ">
          <Header />
          <h1 className="px-10 text-2xl font-medium pt-[170px] md:pt-4"> Admin Dashboard</h1>
          
          <div className="flex flex-row gap-1 px-10 pt-2 pb-8 text-base text-gray-700">
            <p>Home</p>
            
            <Link to="/" className="flex flex-row gap-1 text-purple-700">
              <IoIosArrowForward size={23} className="pt-1" />
              Admin
            </Link>
          </div>
          <Section />
          {/* < StudentLevels/> */}
        </main>
      </div>
    </div>
  );
};

export default App;
