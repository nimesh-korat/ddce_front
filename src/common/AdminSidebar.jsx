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
          <img
            className="w-100 text-center"
            src="./assets/images/logo/logo4.png"
            alt=""
            style={{ width: "100px", height: "70px", objectFit: "contain" }}
          />
        </Link>
        <div className="sidebar-menu-wrapper overflow-y-auto scroll-sm">
          <div className="p-20 pt-10">
            <ul className="sidebar-menu">
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
              {/* <li
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
                    <i className="ph ph-graduation-cap" />
                  </span>
                  <span className="text">Schedule</span>

                  <i
                    className="ph ph-lock position-absolute top-50 end-0 translate-middle-y"
                    style={{
                      fontSize: "18px",
                      color: "#B0B0B0",
                    }}
                  />
                </p>

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
              </li>

              <li className="sidebar-menu__item">
                <p className="sidebar-menu__link d-flex align-items-center position-relative">
                  <span className="icon d-flex align-items-center">
                    <i className="ph ph-clipboard-text" />
                  </span>
                  <span className="text">Exam / Quiz</span>

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
                    <i className="ph ph-bookmarks" />
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
                    <i className="ph ph-chats-teardrop" />
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
                    <i className="ph ph-calendar-dots" />
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
              <li className="sidebar-menu__item ">
                <p
                  to="/library"
                  className="sidebar-menu__link d-flex align-items-center position-relative"
                >
                  <span className="icon d-flex align-items-center">
                    <i className="ph ph-books" />
                  </span>
                  <span className="text">Syllabus</span>
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
                    <i className="ph ph-coins" />
                  </span>
                  <span className="text">Topic & Weightage</span>
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
                    <i className="ph ph-coins" />
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
                    <i className="ph ph-coins" />
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
                className="sidebar-menu__item has-dropdown position-relative"
                onClick={() => toggleMenu("menu3")}
              >
                <p className="sidebar-menu__link">
                  <span className="icon d-flex align-items-center">
                    <i className="ph ph-gear" />
                  </span>
                  <span className="text">Account Settings</span>
                </p>
                <ul
                  className="sidebar-submenu"
                  id="authencation"
                  style={{ display: openMenu === "menu3" ? "block" : "none" }}
                >
                  <li className="sidebar-submenu__item">
                    <p to="/signin" className="sidebar-submenu__link">
                      Change Password
                    </p>
                  </li>
                  <li className="sidebar-submenu__item">
                    <p to="/signup" className="sidebar-submenu__link">
                      Logout
                    </p>
                  </li>
                  <li className="sidebar-submenu__item">
                    <p to="/forget_password" className="sidebar-submenu__link">
                      Forgot Password
                    </p>
                  </li>
                  <li className="sidebar-submenu__item">
                    <p to="/reset_password" className="sidebar-submenu__link">
                      Reset Password
                    </p>
                  </li>
                  <li className="sidebar-submenu__item">
                    <p to="/verify_email" className="sidebar-submenu__link">
                      Verify Email
                    </p>
                  </li>
                  <li className="sidebar-submenu__item">
                    <p
                      to="/two_step_verification"
                      className="sidebar-submenu__link"
                    >
                      Two Step Verification
                    </p>
                  </li>
                </ul>
              </li> */}
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

export default AdminSidebar;
