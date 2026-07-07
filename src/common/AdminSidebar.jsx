import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

// remove position-relative from parent class when unlocks

function AdminSidebar({ isActive, closeSidebar }) {
  const location = useLocation();
  // eslint-disable-next-line
  const [openMenu, setOpenMenu] = useState(null);
  const [activeItem, setActiveItem] = useState("");

  useEffect(() => {
    switch (location.pathname) {
      case "/admin/dashboard":
        setActiveItem("Dashboard");
        break;
      case "/admin/materials":
        setActiveItem("Materials");
        break;
      case "/admin/addQuestion":
        setActiveItem("Add Questions");
        break;
      case "/admin/showQuestions":
        setActiveItem("Show Questions");
        break;
      case "/admin/createTest":
        setActiveItem("Add Test");
        break;
      case "/admin/showTests":
        setActiveItem("Show Test");
        break;
      case "/admin/addSession":
        setActiveItem("Add Session");
        break;
      case "/admin/showSession":
        setActiveItem("Show Session");
        break;
      case "/admin/viewGivenExamData":
        setActiveItem("Given Exam Data");
        break;
      case "/admin/viewStudentWiseGivenExamData":
        setActiveItem("Student Wise Given Exam Data");
        break;
      case "/admin/assignPractice":
        setActiveItem("Assign Practice");
        break;
      case "/admin/practiceAssignments":
        setActiveItem("Practice Assignments");
        break;
      case "/admin/batchAccess":
        setActiveItem("Batch Access");
        break;
      case "/admin/studentAnswers":
        setActiveItem("Student Answers");
        break;

      default:
        setActiveItem("");
        break;
    }
  }, [location.pathname]);

  //eslint-disable-next-line
  const toggleMenu = (menuId) => {
    setOpenMenu((prevMenu) => (prevMenu === menuId ? null : menuId));
  };

  return (
    <>
      <div
        className={`side-overlay ${isActive ? "show" : ""}`}
        onClick={closeSidebar}
      />
      <aside className={`sidebar ${isActive ? "active" : ""}`}>
        {/* sidebar close btn */}
        <button
          type="button"
          className="sidebar-close-btn text-gray-500 hover-text-white hover-bg-main-600 text-md w-24 h-24 border border-gray-100 hover-border-main-600 d-xl-none d-flex flex-center rounded-circle position-absolute"
        >
          <i className="ph ph-x" />
        </button>
        {/* sidebar close btn */}
        <Link
          to="/"
          className="sidebar__logo text-center p-10 position-sticky inset-block-start-0 bg-white w-100 z-1 pb-5"
        >
          {/* <img src="assets/images/logo/logo.png" alt="Logo" /> */}
          <h2>AIM4RANK</h2>
        </Link>
        <div className="sidebar-menu-wrapper overflow-y-auto scroll-sm">
          <div className="p-20 pt-10">
            <ul className="sidebar-menu">
              <li
                className={`sidebar-menu__item ${
                  activeItem === "Dashboard" ? "activePage" : ""
                } `}
              >
                <Link to="/admin/dashboard" className="sidebar-menu__link ">
                  <span className="icon d-flex align-items-center">
                    <i className="ph ph-squares-four" />
                  </span>
                  <span className="text">Dashboard</span>
                </Link>
              </li>
              <li
                className={`sidebar-menu__item ${
                  activeItem === "Materials" ? "activePage" : ""
                } `}
              >
                <Link to="/admin/materials" className="sidebar-menu__link ">
                  <span className="icon d-flex align-items-center">
                    <i className="ph ph-files" />
                  </span>
                  <span className="text">Materials</span>
                </Link>
              </li>
              <li
                className={`sidebar-menu__item ${
                  activeItem === "Add Questions" ? "activePage" : ""
                } `}
              >
                <Link to="/admin/addQuestion" className="sidebar-menu__link ">
                  <span className="icon d-flex align-items-center">
                    <i className="ph ph-question-mark" />
                  </span>
                  <span className="text">Add Question</span>
                </Link>
              </li>
              <li
                className={`sidebar-menu__item ${
                  activeItem === "Show Questions" ? "activePage" : ""
                } `}
              >
                <Link to="/admin/showQuestions" className="sidebar-menu__link ">
                  <span className="icon d-flex align-items-center">
                    <i className="ph ph-list-bullets" />
                  </span>
                  <span className="text">Show Questions</span>
                </Link>
              </li>
              <li
                className={`sidebar-menu__item ${
                  activeItem === "Add Test" ? "activePage" : ""
                } `}
              >
                <Link to="/admin/createTest" className="sidebar-menu__link ">
                  <span className="icon d-flex align-items-center">
                    <i className="ph ph-article-ny-times" />
                  </span>
                  <span className="text">Create Quiz</span>
                </Link>
              </li>
              <li
                className={`sidebar-menu__item ${
                  activeItem === "Show Test" ? "activePage" : ""
                } `}
              >
                <Link to="/admin/showTests" className="sidebar-menu__link ">
                  <span className="icon d-flex align-items-center">
                    <i className="ph ph-blueprint" />
                  </span>
                  <span className="text">Show Quiz</span>
                </Link>
              </li>
              <li
                className={`sidebar-menu__item ${
                  activeItem === "Add Session" ? "activePage" : ""
                } `}
              >
                <Link to="/admin/addSession" className="sidebar-menu__link ">
                  <span className="icon d-flex align-items-center">
                    <i className="ph ph-blueprint" />
                  </span>
                  <span className="text">Add Session</span>
                </Link>
              </li>
              <li
                className={`sidebar-menu__item ${
                  activeItem === "Show Session" ? "activePage" : ""
                } `}
              >
                <Link to="/admin/showSession" className="sidebar-menu__link ">
                  <span className="icon d-flex align-items-center">
                    <i className="ph ph-blueprint" />
                  </span>
                  <span className="text">Show Session</span>
                </Link>
              </li>
              <li
                className={`sidebar-menu__item ${
                  activeItem === "Given Exam Data" ? "activePage" : ""
                } `}
              >
                <Link
                  to="/admin/viewGivenExamData"
                  className="sidebar-menu__link "
                >
                  <span className="icon d-flex align-items-center">
                    <i className="ph ph-blueprint" />
                  </span>
                  <span className="text">Given Exam Data</span>
                </Link>
              </li>
              <li
                className={`sidebar-menu__item ${
                  activeItem === "Student Wise Given Exam Data"
                    ? "activePage"
                    : ""
                } `}
              >
                <Link
                  to="/admin/viewStudentWiseGivenExamData"
                  className="sidebar-menu__link "
                >
                  <span className="icon d-flex align-items-center">
                    <i className="ph ph-blueprint" />
                  </span>
                  <span className="text">Student Wise Given Exam Data</span>
                </Link>
              </li>
              <li
                className={`sidebar-menu__item ${
                  activeItem === "Student Answers" ? "activePage" : ""
                } `}
              >
                <Link
                  to="/admin/studentAnswers"
                  className="sidebar-menu__link "
                >
                  <span className="icon d-flex align-items-center">
                    <i className="ph ph-table" />
                  </span>
                  <span className="text">Student Answers</span>
                </Link>
              </li>

              {/* Practice — Admin */}
              <li
                className={`sidebar-menu__item ${
                  activeItem === "Assign Practice" ? "activePage" : ""
                } `}
              >
                <Link
                  to="/admin/assignPractice"
                  className="sidebar-menu__link "
                >
                  <span className="icon d-flex align-items-center">
                    <i className="ph ph-barbell" />
                  </span>
                  <span className="text">Manage Practice</span>
                </Link>
              </li>
              <li
                className={`sidebar-menu__item ${
                  activeItem === "Practice Assignments" ? "activePage" : ""
                } `}
              >
                <Link
                  to="/admin/practiceAssignments"
                  className="sidebar-menu__link "
                >
                  <span className="icon d-flex align-items-center">
                    <i className="ph ph-clipboard-text" />
                  </span>
                  <span className="text">Practice Assignments</span>
                </Link>
              </li>
              <li
                className={`sidebar-menu__item ${
                  activeItem === "Batch Access" ? "activePage" : ""
                } `}
              >
                <Link to="/admin/batchAccess" className="sidebar-menu__link ">
                  <span className="icon d-flex align-items-center">
                    <i className="ph ph-shield-check" />
                  </span>
                  <span className="text">Batch Access</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
