import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

// remove position-relative from parent class when unlocks

function Sidebar({ isActive, closeSidebar }) {
  const location = useLocation();
  // eslint-disable-next-line
  const [openMenu, setOpenMenu] = useState(null);
  const [activeItem, setActiveItem] = useState("");

  useEffect(() => {
    switch (location.pathname) {
      case "/":
        setActiveItem("Home");
        break;
      case "/exams":
        setActiveItem("Exam");
        break;
      case "/home3":
        setActiveItem("Home3");
        break;
      case "/student_course":
        setActiveItem("student_course");
        break;
      case "/mentor_course":
        setActiveItem("mentor_course");
        break;
      case "/students":
        setActiveItem("Student");
        break;
      case "/syllabus":
        setActiveItem("Syllabus");
        break;
      case "/profile":
        setActiveItem("profile");
        break;
      case "/weightage":
        setActiveItem("weightage");
        break;

      default:
        setActiveItem("");
        break;
    }
  }, [location.pathname]);

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
        <p
          to="/"
          className="sidebar__logo text-center p-10 position-sticky inset-block-start-0 bg-white w-100 z-1 pb-5"
        >
          {/* <img src="assets/images/logo/logo.png" alt="Logo" /> */}
          <h1 className="fw-bold mb-0 mt-0 p-0">Unity</h1>
        </p>
        <div className="sidebar-menu-wrapper overflow-y-auto scroll-sm">
          <div className="p-20 pt-10">
            <ul className="sidebar-menu">
              <li
                className={`sidebar-menu__item  ${
                  activeItem === "Home" ? "activePage" : ""
                }`}
              >
                <Link to="/" className="sidebar-menu__link">
                  <span className="icon d-flex align-items-center">
                    <i className="ph ph-squares-four" />
                  </span>
                  <span className="text">Dashboard</span>
                </Link>
              </li>
              <li
                className={`sidebar-menu__item position-relative ${
                  activeItem === "mentor_course" ||
                  activeItem === "student_course"
                    ? "activePage"
                    : ""
                }`}
                // onClick={() => toggleMenu("menu2")}
              >
                <p className="sidebar-menu__link d-flex align-items-center position-relative">
                  <span className="icon d-flex align-items-center">
                    <i className="ph ph-calendar-dots" />
                  </span>
                  <span className="text">Schedule</span>

                  {/* Lock icon positioned at the far right */}
                  <i
                    className="ph ph-lock position-absolute top-50 end-0 translate-middle-y"
                    style={{
                      fontSize: "18px",
                      color: "#B0B0B0",
                    }}
                  />
                </p>

                {/* Submenu start */}
                <ul
                  className="sidebar-submenu"
                  id="courses"
                  style={{ display: openMenu === "menu2" ? "block" : "none" }}
                >
                  <li
                    className={`sidebar-submenu__item ${
                      activeItem === "student_course" ? "activePage" : ""
                    }`}
                  >
                    <p to="/student_course" className="sidebar-submenu__link">
                      Student Courses
                    </p>
                  </li>
                  <li
                    className={`sidebar-submenu__item ${
                      activeItem === "mentor_course" ? "activePage" : ""
                    }`}
                  >
                    <p to="/mentor_course" className="sidebar-submenu__link">
                      Mentor Courses
                    </p>
                  </li>
                  <li className="sidebar-submenu__item">
                    <p
                      to="/create-course.html"
                      className="sidebar-submenu__link"
                    >
                      Create Course
                    </p>
                  </li>
                </ul>
                {/* Submenu End */}
              </li>
              <li
                className={`sidebar-menu__item has-dropdown  ${
                  activeItem === "Exam" ? "activePage" : ""
                }`}
                onClick={() => toggleMenu("examMenu")}
              >
                <p className="sidebar-menu__link">
                  <span className="icon d-flex align-items-center">
                    <i className="ph ph-clipboard-text" />
                  </span>
                  <span className="text">Exam / Quiz</span>
                </p>
                <ul
                  className="sidebar-submenu"
                  id="examMenu"
                  style={{
                    display:
                      openMenu === "examMenu" || activeItem === "Exam"
                        ? "block "
                        : "none",
                  }}
                >
                  <li
                    className={`sidebar-submenu__item ${
                      window.location.hash === "#upcoming" ? "activePage" : ""
                    }`}
                  >
                    <Link
                      to="/exams#upcoming"
                      className="sidebar-submenu__link"
                    >
                      Upcoming Exam / Quiz
                    </Link>
                  </li>
                  <li
                    className={`sidebar-submenu__item ${
                      window.location.hash === "#current" ? "activePage" : ""
                    }`}
                  >
                    <Link to="/exams#current" className="sidebar-submenu__link">
                      Current Exam / Quiz
                    </Link>
                  </li>
                  <li
                    className={`sidebar-submenu__item ${
                      window.location.hash === "#completed" ? "activePage" : ""
                    }`}
                  >
                    <Link
                      to="/exams#completed"
                      className="sidebar-submenu__link"
                    >
                      Completed Exam / Quiz
                    </Link>
                  </li>
                </ul>
              </li>

              
              <li className="sidebar-menu__item">
                <p
                  to="/mentors"
                  className="sidebar-menu__link  d-flex align-items-center position-relative"
                >
                  <span className="icon d-flex align-items-center">
                    <i className="ph ph-users" />
                  </span>
                  <span className="text">Training</span>
                  <i
                    className="ph ph-lock position-absolute top-50 end-0 translate-middle-y"
                    style={{
                      fontSize: "18px",
                      color: "#B0B0B0",
                    }}
                  />
                </p>
              </li>
              <li className="sidebar-menu__item">
                <p
                  to="/resources"
                  className="sidebar-menu__link   d-flex align-items-center position-relative"
                >
                  <span className="icon d-flex align-items-center">
                    <i className="ph ph-folder-open" />
                  </span>
                  <span className="text">Materials</span>
                  <i
                    className="ph ph-lock position-absolute top-50 end-0 translate-middle-y"
                    style={{
                      fontSize: "18px",
                      color: "#B0B0B0",
                    }}
                  />
                </p>
              </li>
              <li className="sidebar-menu__item ">
                <p
                  to="/messages"
                  className="sidebar-menu__link d-flex align-items-center position-relative"
                >
                  <span className="icon d-flex align-items-center">
                    <i className="ph ph-seal-question" />
                  </span>
                  <span className="text">Doubts</span>
                  <i
                    className="ph ph-lock position-absolute top-50 end-0 translate-middle-y"
                    style={{
                      fontSize: "18px",
                      color: "#B0B0B0",
                    }}
                  />
                </p>
              </li>
              <li className="sidebar-menu__item ">
                <p
                  to="/analytics"
                  className="sidebar-menu__link d-flex align-items-center position-relative"
                >
                  <span className="icon d-flex align-items-center">
                    <i className="ph ph-chart-bar" />
                  </span>
                  <span className="text">Analytics</span>
                  <i
                    className="ph ph-lock position-absolute top-50 end-0 translate-middle-y"
                    style={{
                      fontSize: "18px",
                      color: "#B0B0B0",
                    }}
                  />
                </p>
              </li>
              <li className="sidebar-menu__item">
                <p
                  to="/events"
                  className="sidebar-menu__link  d-flex align-items-center position-relative"
                >
                  <span className="icon d-flex align-items-center">
                    <i className="ph ph-chat-teardrop-dots" />
                  </span>
                  <span className="text">Messages</span>
                  <i
                    className="ph ph-lock position-absolute top-50 end-0 translate-middle-y"
                    style={{
                      fontSize: "18px",
                      color: "#B0B0B0",
                    }}
                  />
                </p>
              </li>
              <li
                className={`sidebar-menu__item  ${
                  activeItem === "Syllabus" ? "activePage" : ""
                }`}
              >
                <Link
                  to="/syllabus"
                  className="sidebar-menu__link d-flex align-items-center"
                >
                  <span className="icon d-flex align-items-center">
                    <i className="ph ph-books" />
                  </span>
                  <span className="text">Syllabus</span>
                </Link>
              </li>
              <li
                className={`sidebar-menu__item  ${
                  activeItem === "weightage" ? "activePage" : ""
                }`}
              >
                <Link
                  to="/weightage"
                  className="sidebar-menu__link d-flex align-items-center position-relative"
                >
                  <span className="icon d-flex align-items-center">
                    <i className="ph ph-chart-pie-slice" />
                  </span>
                  <span className="text">Topic & Weightage</span>
                </Link>
              </li>
              <li
                className={`sidebar-menu__item  ${
                  activeItem === "Student" ? "activePage" : ""
                }`}
              >
                <Link to="/students" className="sidebar-menu__link">
                  <span className="icon d-flex align-items-center">
                    <i className="ph ph-users-three" />
                  </span>
                  <span className="text">Students</span>
                </Link>
              </li>

              <li className="sidebar-menu__item ">
                <p
                  to="/pricing"
                  className="sidebar-menu__link d-flex align-items-center position-relative"
                >
                  <span className="icon d-flex align-items-center">
                    <i className="ph ph-flag-checkered" />
                  </span>
                  <span className="text">Tournaments</span>
                  <i
                    className="ph ph-lock position-absolute top-50 end-0 translate-middle-y"
                    style={{
                      fontSize: "18px",
                      color: "#B0B0B0",
                    }}
                  />
                </p>
              </li>

              <li className="sidebar-menu__item ">
                <p
                  to="/pricing"
                  className="sidebar-menu__link d-flex align-items-center position-relative"
                >
                  <span className="icon d-flex align-items-center">
                    <i className="ph ph-tag" />
                  </span>
                  <span className="text">Pricing</span>
                  <i
                    className="ph ph-lock position-absolute top-50 end-0 translate-middle-y"
                    style={{
                      fontSize: "18px",
                      color: "#B0B0B0",
                    }}
                  />
                </p>
              </li>
              <li className="sidebar-menu__item ">
                <span className="text-gray-300 text-sm px-20 pt-20 fw-semibold border-top border-gray-100 d-block text-uppercase">
                  Settings
                </span>
              </li>

              <li
                className={`sidebar-menu__item  ${
                  activeItem === "profile" ? "activePage" : ""
                }`}
              >
                <Link
                  to="/profile"
                  className="sidebar-menu__link d-flex align-items-center"
                >
                  <span className="icon d-flex align-items-center">
                    <i className="ph ph-user" />
                  </span>
                  <span className="text">Profile</span>
                </Link>
              </li>
            </ul>
          </div>
          {/* <div className="p-20 pt-80">
            <div className="bg-main-50 p-20 pt-0 rounded-16 text-center mt-74">
              <span className="border border-5 bg-white mx-auto border-primary-50 w-114 h-114 rounded-circle flex-center text-success-600 text-2xl translate-n74">
                <img
                  src="assets/images/icons/certificate.png"
                  alt=""
                  className="centerised-img"
                />
              </span>
              <div className="mt-n74 position-relative">
              
                <h5 className="mb-4 mt-22">Get Pro Certificate</h5>
                <p>Explore 400+ courses with lifetime members</p>
                <div>
                  <p
                  to="pricing-plan.html"
                  className="btn btn-main mt-16 rounded-pill"
                >
                  Get Access
                </p>
                </div>
                
              </div>
            </div>
          </div> */}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
