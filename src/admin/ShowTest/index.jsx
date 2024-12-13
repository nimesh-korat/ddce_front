import React, { useState } from "react";
import AdminSidebar from "../../common/AdminSidebar";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";
import { Link } from "react-router-dom";
import QuizTab from "./components/quizTab";
import { useQuery } from "@tanstack/react-query";
import { getQuiz } from "../../apis/apis";
import Preloader from "../../utils/Preloader";

function ShowTests() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming"); // State to track active tab
  const [quizes, setquizes] = useState([]);

  const toggleSidebar = () => {
    setIsSidebarActive((prevState) => !prevState);
  };

  const closeSidebar = () => {
    setIsSidebarActive(false);
  };
  const { data: quiz, isLoading } = useQuery({
    queryKey: ["getQuiz"],
    queryFn: getQuiz,
    staleTime: 1 * 60 * 1000,
    cacheTime: 1 * 60 * 1000,
    onError: (error) => {
      console.error("Error fetching notifications:", error.message);
    },
  });

  React.useEffect(() => {
    if (quiz) {
      setquizes(quiz.data);
    }
  }, [quiz]);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <>
      <AdminSidebar isActive={isSidebarActive} closeSidebar={closeSidebar} />
      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={toggleSidebar} />
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
                <span className="text-main-600 fw-normal text-15">
                  Student quizes
                </span>
              </li>
            </ul>
          </div>
          <QuizTab
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            quizes={quizes ? quizes : []}
          />
        </div>
        <Footer />
      </div>
    </>
  );
}

export default ShowTests;
