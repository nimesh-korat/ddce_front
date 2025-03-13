import React, { useState } from "react";
import AdminSidebar from "../../common/AdminSidebar";
import Header from "../../common/header/Header";
import { Link } from "react-router-dom";
import Footer from "../../common/footer";

function ViewQuizQuestions() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarActive((prevState) => !prevState);
  };

  const closeSidebar = () => {
    setIsSidebarActive(false);
  };

  return (
    <>
      <AdminSidebar isActive={isSidebarActive} closeSidebar={closeSidebar} />
      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={toggleSidebar} />
        <div className="dashboard-body">
          <div className="breadcrumb-with-buttons mb-24 flex-between flex-wrap gap-8">
            <div className="breadcrumb mb-24">
              <ul className="flex-align gap-4">
                <li>
                  <Link
                    to={"/admin"}
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
                    Show Quiz Questions
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="container-fluid dashboard-content"></div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default ViewQuizQuestions;
