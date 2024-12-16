import React, { useState } from "react";
import Sidebar from "../../common/sidebar";
import Header from "../../common/header/Header";
import { Link } from "react-router-dom";
import Chart from "../../utils/Charts";
import { useQuery } from "@tanstack/react-query";
import { getSyllabusWithPaper } from "../../apis/apis";
import Preloader from "../../utils/Preloader";

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
    queryKey: "syllabusWithPaper",
    queryFn: getSyllabusWithPaper,
  });

  if (isLoading) {
    return <Preloader />;
  }

  // Radial bar chart options with a more attractive color palette and hover effects
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
            <div className="row">
              {/* Loop through each paper and create a chart */}
              {data?.success &&
                data.data.map((paper, index) => (
                  <div className="col-sm-12 col-md-6 mb-3" key={paper.PaperId}>
                    <div className="card shadow">
                      <div
                        className="card-header"
                        style={{ fontWeight: "bold" }}
                      >
                        {`${index + 1}.  ${paper.PaperName} - (${paper.Paper})`}
                      </div>
                      <div className="card-body">
                        <Chart
                          options={{
                            ...radialBarOptions,
                            labels: paper.Subjects.map(
                              (subject) => subject.Subject
                            ), // Set labels as subject names
                          }}
                          series={[
                            ...paper.Subjects.map(
                              (subject) => subject.SubjectWeightage
                            ),
                          ]}
                          type="pie"
                          height={250}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Weightage;
