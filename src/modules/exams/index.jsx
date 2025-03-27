import React, { useState, useEffect } from "react";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";
import { Link, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import Preloader from "../../utils/preloader/Preloader";
import Sidebar from "../../common/sidebar";
import { getTestForStudent } from "../../apis/apis";
import StudentQuizTab from "./components/StudentQuizTab";

function Exam() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [activeTab, setActiveTab] = useState("current");
  const [quizes, setQuizes] = useState([]);

  const toggleSidebar = () => {
    setIsSidebarActive((prevState) => !prevState);
  };

  const closeSidebar = () => {
    setIsSidebarActive(false);
  };

  const getQuizMutation = useMutation({
    mutationFn: getTestForStudent,
    onSuccess: (data) => {
      setQuizes(data.data); // Ensure data is an array of quizzes
    },
    onError: (error) => {
      console.error("Error fetching quizzes:", error.message);
    },
  });

  const location = useLocation(); // Get location from react-router

  useEffect(() => {
    getQuizMutation.mutate();

    // Get the initial hash from the location object (e.g., #upcoming, #current, #completed)
    const initialHash = location.hash.replace("#", "");

    // Set activeTab based on the initial hash
    if (["upcoming", "current", "completed"].includes(initialHash)) {
      setActiveTab(initialHash);
    }
    //eslint-disable-next-line
  }, [location.hash]); // Dependency on location.hash

  return (
    <>
      <Sidebar isActive={isSidebarActive} closeSidebar={closeSidebar} />
      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={toggleSidebar} />
        {getQuizMutation.isPending ? (
          <Preloader />
        ) : (
          <div className="dashboard-body">
            {/* Breadcrumb */}
            <div className="breadcrumb mb-24">
              <ul className="flex-align gap-4">
                <li>
                  <Link
                    to={"/"}
                    className="text-gray-200 fw-normal text-15 hover-text-main-600"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <span className="text-gray-500 fw-normal d-flex">
                    <i className="ph ph-caret-right" />
                  </span>
                </li>
                <li>
                  <span className="text-main-600 fw-normal text-15">Exams</span>
                </li>
              </ul>
            </div>
            <StudentQuizTab
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              quizes={quizes ? quizes : []}
            />
          </div>
        )}
        <Footer />
      </div>
    </>
  );
}

export default Exam;
