import React, { useState } from "react";
import Sidebar from "../../common/sidebar";
import Header from "../../common/header/Header";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSyllabusWithPaper } from "../../apis/apis";
import Preloader from "../../utils/Preloader";
import SubjectWeightage from "./components/SubjectWeightage";

function Weightage() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarActive((prevState) => !prevState);
  };

  const closeSidebar = () => {
    setIsSidebarActive(false);
  };

  // Fetch the syllabus data using react-query
  const { data, isLoading } = useQuery({
    queryKey: ["syllabusWithPaper"],
    queryFn: getSyllabusWithPaper,
  });

  if (isLoading) {
    return <Preloader />;
  }

  const radialBarOptions = {
    chart: {
      height: 250,
      type: "pie",
    },
    dataLabels: {
      enabled: false,
      style: {
        fontSize: "14px",
        fontWeight: "600",
        colors: ["#fff"],
      },
      formatter: (val) => `${val}%`,
    },
    legend: {
      show: true,
      position: "bottom",
      fontSize: "14px",
      fontWeight: "500",
      labels: {
        colors: "#333",
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} Weightage`, // Show weightage in tooltip
      },
    },
    stroke: {
      width: 1, // Add stroke to make it sharper
      colors: ["#fff"], // White stroke around the pie slices
    },
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
            <SubjectWeightage data={data} radialBarOptions={radialBarOptions} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Weightage;
