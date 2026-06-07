import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function MentorSidebar({ isActive, closeSidebar }) {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("");

  useEffect(() => {
    switch (location.pathname) {
      case "/mentor/dashboard":
        setActiveItem("Dashboard");
        break;
      case "/mentor/addQuestion":
        setActiveItem("Add Questions");
        break;
      case "/mentor/showQuestions":
        setActiveItem("My Questions");
        break;
      case "/mentor/assignPractice":
        setActiveItem("Assign Practice");
        break;
      case "/mentor/myAssignments":
        setActiveItem("My Assignments");
        break;
      default:
        setActiveItem("");
        break;
    }
  }, [location.pathname]);

  return (
    <>
      <div
        className={`side-overlay ${isActive ? "show" : ""}`}
        onClick={closeSidebar}
      />
      <aside className={`sidebar ${isActive ? "active" : ""}`}>
        <button
          type="button"
          className="sidebar-close-btn text-gray-500 hover-text-white hover-bg-main-600 text-md w-24 h-24 border border-gray-100 hover-border-main-600 d-xl-none d-flex flex-center rounded-circle position-absolute"
        >
          <i className="ph ph-x" />
        </button>

        <Link
          to="/mentor/dashboard"
          className="sidebar__logo text-center p-10 position-sticky inset-block-start-0 bg-white w-100 z-1 pb-5"
        >
          <img
            className="w-100 text-center"
            src="../assets/images/logo/logo4.png"
            alt=""
            style={{ width: "100px", height: "70px", objectFit: "contain" }}
          />
        </Link>

        {/* Mentor badge */}
        <div className="px-20 py-8 mb-4">
          <span className="text-12 fw-semibold text-white bg-main-600 rounded-pill px-12 py-4 d-inline-block">
            <i className="ph ph-user-circle me-4" />
            Mentor Portal
          </span>
        </div>

        <div className="sidebar-menu-wrapper overflow-y-auto scroll-sm">
          <div className="p-20 pt-10">
            <ul className="sidebar-menu">
              {/* Dashboard */}
              <li className={`sidebar-menu__item ${activeItem === "Dashboard" ? "activePage" : ""}`}>
                <Link to="/mentor/dashboard" className="sidebar-menu__link">
                  <span className="icon d-flex align-items-center">
                    <i className="ph ph-squares-four" />
                  </span>
                  <span className="text">Dashboard</span>
                </Link>
              </li>

              {/* Divider label */}
              <li className="sidebar-menu__item mt-16 mb-8">
                <span className="text-11 fw-semibold text-gray-400 text-uppercase ps-8 tracking-wide">
                  Questions
                </span>
              </li>

              {/* Add Question */}
              <li className={`sidebar-menu__item ${activeItem === "Add Questions" ? "activePage" : ""}`}>
                <Link to="/mentor/addQuestion" className="sidebar-menu__link">
                  <span className="icon d-flex align-items-center">
                    <i className="ph ph-plus-circle" />
                  </span>
                  <span className="text">Add Question</span>
                </Link>
              </li>

              {/* My Questions */}
              <li className={`sidebar-menu__item ${activeItem === "My Questions" ? "activePage" : ""}`}>
                <Link to="/mentor/showQuestions" className="sidebar-menu__link">
                  <span className="icon d-flex align-items-center">
                    <i className="ph ph-list-bullets" />
                  </span>
                  <span className="text">My Questions</span>
                </Link>
              </li>

              {/* Divider label */}
              <li className="sidebar-menu__item mt-16 mb-8">
                <span className="text-11 fw-semibold text-gray-400 text-uppercase ps-8 tracking-wide">
                  Practice
                </span>
              </li>

              {/* Assign Practice */}
              <li className={`sidebar-menu__item ${activeItem === "Assign Practice" ? "activePage" : ""}`}>
                <Link to="/mentor/assignPractice" className="sidebar-menu__link">
                  <span className="icon d-flex align-items-center">
                    <i className="ph ph-barbell" />
                  </span>
                  <span className="text">Assign Practice</span>
                </Link>
              </li>

              {/* My Assignments */}
              <li className={`sidebar-menu__item ${activeItem === "My Assignments" ? "activePage" : ""}`}>
                <Link to="/mentor/myAssignments" className="sidebar-menu__link">
                  <span className="icon d-flex align-items-center">
                    <i className="ph ph-clipboard-text" />
                  </span>
                  <span className="text">My Assignments</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
}

export default MentorSidebar;
