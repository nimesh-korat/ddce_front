import React, { useState } from "react";
import Sidebar from "../../common/sidebar";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";
import StudentTable from "./components/table";
import { Link } from "react-router-dom";
import Preloader from "../../utils/Preloader";

function Students() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarActive((prevState) => !prevState);
  };

  const closeSidebar = () => {
    setIsSidebarActive(false);
  };
  return (
    <>
      <Preloader />
      <Sidebar isActive={isSidebarActive} closeSidebar={closeSidebar} />
      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={toggleSidebar} />
        <div className="dashboard-body">
          <div className="breadcrumb-with-buttons mb-24 flex-between flex-wrap gap-8">
            {/* Breadcrumb Start */}
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
                    Students
                  </span>
                </li>
              </ul>
            </div>
            {/* Breadcrumb End */}
            {/* Breadcrumb Right Start */}
            <div className="flex-align gap-8 flex-wrap">
              <div className="position-relative text-gray-500 flex-align gap-4 text-13">
                <span className="text-inherit">Sort by: </span>
                <div className="flex-align text-gray-500 text-13 border border-gray-100 rounded-4 ps-20 focus-border-main-600 bg-white">
                  <span className="text-lg">
                    <i className="ph ph-funnel-simple" />
                  </span>
                  <select className="form-control ps-8 pe-20 py-16 border-0 text-inherit rounded-4 text-center">
                    <option value={1} selected>
                      Popular
                    </option>
                    <option value={1}>Latest</option>
                    <option value={1}>Trending</option>
                    <option value={1}>Matches</option>
                  </select>
                </div>
              </div>
              <div className="flex-align text-gray-500 text-13 border border-gray-100 rounded-4 ps-20 focus-border-main-600 bg-white">
                <span className="text-lg">
                  <i className="ph ph-layout" />
                </span>
                <select
                  className="form-control ps-8 pe-20 py-16 border-0 text-inherit rounded-4 text-center"
                  id="exportOptions"
                >
                  <option value selected disabled>
                    Export
                  </option>
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                </select>
              </div>
            </div>
            {/* Breadcrumb Right End */}
          </div>
          <StudentTable />
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Students;
