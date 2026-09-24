import React, { useState, useContext } from "react";
import UserContext from "../../utils/UserContex";
import Sidebar from "../../common/sidebar";
import Header from "../../common/header/Header";
import { Link } from "react-router-dom";
import SubjectWeightage from "./components/SubjectWeightage";
import TopicWeightage from "./components/TopicWeightage";
import Footer from "../../common/footer";

function Weightage() {
  const { user } = useContext(UserContext);
  const isJEE = user?.exam_type_id === 2;
  const [isSidebarActive, setIsSidebarActive] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarActive((prevState) => !prevState);
  };

  const closeSidebar = () => {
    setIsSidebarActive(false);
  };

  return (
    <>
      <Sidebar isActive={isSidebarActive} closeSidebar={closeSidebar} />
      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={toggleSidebar} />
        <div className="dashboard-body">
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
                  Weightage
                </span>
              </li>
            </ul>
          </div>
          <div className="container-fluid dashboard-content">
            {!isJEE && <SubjectWeightage />}
            <TopicWeightage />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Weightage;
