import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useBatchAccess } from "../utils/BatchAccessContext";

function Sidebar({ isActive, closeSidebar }) {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);
  const [activeItem, setActiveItem] = useState("");
  const { isEnabled, isLocked, isHidden, accessMap } = useBatchAccess();

  useEffect(() => {
    switch (location.pathname) {
      case "/":
        setActiveItem("Home");
        break;
      case "/exams":
        setActiveItem("Exam");
        break;
      case "/schedule":
        setActiveItem("schedule");
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
      case "/analytics":
        setActiveItem("analytics");
        break;
      case "/accuracyMatrix":
        setActiveItem("accuracyMatrix");
        break;
      case "/doubts":
        setActiveItem("doubts");
        break;
      case "/practice":
        setActiveItem("practice");
        break;
      default:
        setActiveItem("");
        break;
    }
  }, [location.pathname]);

  const toggleMenu = (menuId) => {
    setOpenMenu((prev) => (prev === menuId ? null : menuId));
  };

  // Lock icon style
  const lockIcon = (
    <i
      className="ph ph-lock position-absolute top-50 end-0 translate-middle-y"
      style={{ fontSize: "18px", color: "#B0B0B0" }}
    />
  );

  // Renders a sidebar item in one of 3 states:
  //  enabled → clickable <Link>
  //  locked  → <p> with lock icon (visible but not navigable)
  //  hidden  → null (completely removed)
  const SidebarItem = ({
    featureKey,
    activeKey,
    icon,
    label,
    to,
    children,
  }) => {
    // While accessMap not loaded, show locked
    const vis =
      accessMap !== null
        ? isEnabled(featureKey)
          ? "enabled"
          : isHidden(featureKey)
            ? "hidden"
            : "locked"
        : "locked";

    if (vis === "hidden") return null;

    const isActive = activeItem === activeKey;

    if (vis === "locked") {
      return (
        <li className={`sidebar-menu__item ${isActive ? "activePage" : ""}`}>
          <p
            className="sidebar-menu__link d-flex align-items-center position-relative"
            style={{ cursor: "default" }}
          >
            <span className="icon d-flex align-items-center">
              <i className={`ph ${icon}`} />
            </span>
            <span className="text">{label}</span>
            {lockIcon}
          </p>
        </li>
      );
    }

    // enabled
    if (children) {
      // For dropdown items (Exam)
      return (
        <li
          className={`sidebar-menu__item has-dropdown ${isActive ? "activePage" : ""}`}
          onClick={() => toggleMenu(featureKey + "Menu")}
        >
          {children}
        </li>
      );
    }

    return (
      <li className={`sidebar-menu__item ${isActive ? "activePage" : ""}`}>
        <Link to={to} className="sidebar-menu__link d-flex align-items-center">
          <span className="icon d-flex align-items-center">
            <i className={`ph ${icon}`} />
          </span>
          <span className="text">{label}</span>
        </Link>
      </li>
    );
  };

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
          to="/"
          className="sidebar__logo text-center p-10 position-sticky inset-block-start-0 bg-white w-100 z-1 pb-5"
        >
          <h2>AIM4RANK</h2>
        </Link>

        <div className="sidebar-menu-wrapper overflow-y-auto scroll-sm">
          <div className="p-20 pt-10">
            <ul className="sidebar-menu">
              {/* ── Dashboard — always accessible ── */}
              <li
                className={`sidebar-menu__item ${activeItem === "Home" ? "activePage" : ""}`}
              >
                <Link to="/" className="sidebar-menu__link">
                  <span className="icon d-flex align-items-center">
                    <i className="ph ph-squares-four" />
                  </span>
                  <span className="text">Dashboard</span>
                </Link>
              </li>

              {/* ── Syllabus ── */}
              <SidebarItem
                featureKey="syllabus"
                activeKey="Syllabus"
                icon="ph-books"
                label="Syllabus"
                to="/syllabus"
              />

              {/* ── Topic & Weightage ── */}
              <SidebarItem
                featureKey="weightage"
                activeKey="weightage"
                icon="ph-chart-pie-slice"
                label="Topic & Weightage"
                to="/weightage"
              />

              {/* ── Schedule ── */}
              <SidebarItem
                featureKey="schedule"
                activeKey="schedule"
                icon="ph-calendar-dots"
                label="Schedule"
                to="/schedule"
              />

              {/* ── Exam / Quiz (dropdown) ── */}
              {!isHidden("exams") && (
                <li
                  className={`sidebar-menu__item ${isEnabled("exams") ? "has-dropdown" : ""} ${activeItem === "Exam" ? "activePage" : ""}`}
                  onClick={
                    isEnabled("exams")
                      ? () => toggleMenu("examMenu")
                      : undefined
                  }
                >
                  <p
                    className="sidebar-menu__link d-flex align-items-center position-relative"
                    style={isLocked("exams") ? { cursor: "default" } : {}}
                  >
                    <span className="icon d-flex align-items-center">
                      <i className="ph ph-clipboard-text" />
                    </span>
                    <span className="text">Exam / Quiz</span>
                    {isLocked("exams") && lockIcon}
                  </p>
                  {isEnabled("exams") && (
                    <ul
                      className="sidebar-submenu"
                      style={{
                        display:
                          openMenu === "examMenu" || activeItem === "Exam"
                            ? "block"
                            : "none",
                      }}
                    >
                      <li
                        className={`sidebar-submenu__item ${window.location.hash === "#current" ? "activePage" : ""}`}
                      >
                        <Link
                          to="/exams#current"
                          className="sidebar-submenu__link"
                        >
                          Current Exam / Quiz
                        </Link>
                      </li>
                      <li
                        className={`sidebar-submenu__item ${window.location.hash === "#completed" ? "activePage" : ""}`}
                      >
                        <Link
                          to="/exams#completed"
                          className="sidebar-submenu__link"
                        >
                          Completed Exam / Quiz
                        </Link>
                      </li>
                      <li
                        className={`sidebar-submenu__item ${window.location.hash === "#upcoming" ? "activePage" : ""}`}
                      >
                        <Link
                          to="/exams#upcoming"
                          className="sidebar-submenu__link"
                        >
                          Upcoming Exam / Quiz
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              )}

              {/* ── Accuracy Matrix ── */}
              <SidebarItem
                featureKey="accuracy_matrix"
                activeKey="accuracyMatrix"
                icon="ph-trophy"
                label="Accuracy Matrix"
                to="/accuracyMatrix"
              />

              {/* ── Analytics ── */}
              <SidebarItem
                featureKey="analytics"
                activeKey="analytics"
                icon="ph-chart-bar"
                label="Analytics"
                to="/analytics"
              />

              {/* ── Training ── */}
              <SidebarItem
                featureKey="training"
                activeKey="training"
                icon="ph-users"
                label="Training"
                to="/mentors"
              />

              {/* ── Materials & Solutions ── */}
              <SidebarItem
                featureKey="solutions"
                activeKey="solutions"
                icon="ph-folder-open"
                label="Materials & Solutions"
                to="/solutions"
              />

              {/* ── Practice ── */}
              <SidebarItem
                featureKey="practice"
                activeKey="practice"
                icon="ph-barbell"
                label="Practice"
                to="/practice"
              />

              {/* ── Doubts ── */}
              <SidebarItem
                featureKey="doubts"
                activeKey="doubts"
                icon="ph-seal-question"
                label="Doubts"
                to="/doubts"
              />

              {/* ── Settings divider ── */}
              <li className="sidebar-menu__item">
                <span className="text-gray-300 text-sm px-20 pt-20 fw-semibold border-top border-gray-100 d-block text-uppercase">
                  Settings
                </span>
              </li>

              {/* ── Profile — always accessible ── */}
              <li
                className={`sidebar-menu__item ${activeItem === "profile" ? "activePage" : ""} mb-18`}
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
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
