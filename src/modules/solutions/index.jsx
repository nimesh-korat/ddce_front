import React, { useState } from "react";
import Sidebar from "../../common/sidebar";
import Header from "../../common/header/Header";
import { Link } from "react-router-dom";

function Solutions() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarActive((prevState) => !prevState);
  };

  const closeSidebar = () => {
    setIsSidebarActive(false);
  };

  const solutions = [
    {
      title: "CLASSICAL MECHANICS SET 1",
      description:
        "Linear motion, velocity, acceleration, force, Newton’s laws of motion, linear momentum and impulse of force.",
      downloadFile: "./assets/solutions/cms3.pdf",
    },
    {
      title: "CLASSICAL MECHANICS SET 2",
      description:
        "Circular motion, angular velocity, angular acceleration, centripetal and centrifugal force.",
      downloadFile: "./assets/solutions/cms3.pdf",
    },
    {
      title: "CLASSICAL MECHANICS SET 3",
      description: "Work, energy, kinetic energy, potential energy, power.",
      downloadFile: "./assets/solutions/cms3.pdf",
    },
  ];

  const handleDownload = (fileUrl, fileName) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", fileName); // Forces download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                  to="/"
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
                  Solutions
                </span>
              </li>
            </ul>
          </div>
          <div className="container-fluid dashboard-content">
            <div className="row g-2">
              <div className="col-lg-12">
                <div className="card border border-gray-100">
                  <div className="card-header border-bottom border-gray-100 flex-between gap-8">
                    <h6 className="mb-0">Solutions</h6>
                  </div>
                  <div className="card-body">
                    <div className="row g-2">
                      {solutions.map((item, index) => (
                        <div className="col-lg-6" key={index}>
                          <div className="payment-method payment-method-two form-check form-radio d-flex align-items-center justify-content-between mb-16 rounded-16 bg-main-50 p-20 cursor-pointer position-relative transition-2">
                            <div className="flex-align align-items-start gap-16">
                              <div>
                                <h6 className="title mb-0">{item.title}</h6>
                                <span className="d-block">
                                  {item.description}
                                </span>
                                <div className="text-13 flex-align gap-8 mt-12 pt-12 border-top border-gray-100">
                                  <button
                                    onClick={() =>
                                      handleDownload(
                                        item.downloadFile,
                                        `${item.title}.pdf`
                                      )
                                    }
                                    className="text-gray-900 hover-text-main-600 btn btn-link p-0"
                                  >
                                    <span>Download Now</span> 
                                    <i className="ph ph-download-simple ms-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                            <label
                              className="position-absolute inset-block-start-0 inset-inline-start-0 w-100 h-100 cursor-pointer"
                              htmlFor="visaCard"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Solutions;
