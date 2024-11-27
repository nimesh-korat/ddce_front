import React from "react";
import Sidebar from "../../common/sidebar";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";
import Chart from "../../utils/Charts";

function HomeTwo() {
  const stackedBarChartSeries = [
    {
      name: "Study",
      data: [44, 55, 41, 50, 36, 43, 50, 44, 55, 41, 50, 36],
    },
    {
      name: "Exam",
      data: [26, 23, 20, 40, 32, 27, 30, 26, 23, 20, 40, 32],
    },
  ];

  const stackedBarChartOptions = {
    colors: ["#27CFA7", "#A9ECDC"],
    chart: {
      type: "bar",
      height: 400,
      stacked: true,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: true,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "35%",
        horizontal: false,
        borderRadius: 10,
        borderRadiusApplication: "end", // 'around', 'end'
        borderRadiusWhenStacked: "last", // 'all', 'last'
        dataLabels: {
          total: {
            enabled: false,
            style: {
              fontSize: "13px",
              fontWeight: 900,
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false, // Disable bar labels globally
    },
    grid: {
      show: true,
      borderColor: "#d5dbe7",
      strokeDashArray: 3,
      position: "back",
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return "$" + value + "Hr";
        },
        style: {
          fontSize: "14px",
        },
      },
    },
    legend: {
      show: false,
      position: "top",
      offsetY: 0,
      horizontalAlign: "start",
      markers: {
        // shape: 'circle'
        radius: 50,
      },
    },
    fill: {
      opacity: 1,
    },
  };

  const mostActivityChartOptions = {
    chart: {
      height: 200,
      type: "donut",
    },
    colors: ["#3D7FF9", "#27CFA7", "#FA902F"],
    enabled: true, // Enable data labels
    formatter: function (val, opts) {
      return opts.w.config.series[opts.seriesIndex] + "%";
    },
    dropShadow: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "55%", // Fixed slice width
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            show: false,
          },
        },
      },
    ],
    legend: {
      position: "right",
      offsetY: 0,
      height: 230,
      show: false,
    },
  };

  const mostActivityChartSeries = [65.2, 25, 9.8];

  return (
    <>
      {/*==================== Preloader Start ====================*/}
      <div className="preloader">
        <div className="loader" />
      </div>
      {/*==================== Preloader End ====================*/}

      <Sidebar />
      {/* ============================ Sidebar End  ============================ */}
      <div className="dashboard-main-wrapper">
        <Header />
        <div className="dashboard-body">
          <div className="row gy-4">
            <div className="col-lg-9">
              {/* Grettings Box Start */}
              <div className="grettings-box position-relative rounded-16 bg-main-600 overflow-hidden gap-16 flex-wrap z-1">
                <img
                  src="assets/images/bg/grettings-pattern.png"
                  alt=""
                  className="position-absolute inset-block-start-0 inset-inline-start-0 z-n1 w-100 h-100 opacity-6"
                />
                <div className="row gy-4">
                  <div className="col-sm-7">
                    <div className="grettings-box__content py-xl-4">
                      <h2 className="text-white mb-0">Hello, Mohib! </h2>
                      <p className="text-15 fw-light mt-4 text-white">
                        Let’s learning something today
                      </p>
                      <p className="text-lg fw-light mt-24 text-white">
                        Set your study plan and growth with community
                      </p>
                    </div>
                  </div>
                  <div className="col-sm-5 d-sm-block d-none">
                    <div className="text-center h-100 d-flex justify-content-center align-items-end ">
                      <img src="assets/images/thumbs/gretting-img.png" alt="" />
                    </div>
                  </div>
                </div>
              </div>
              {/* Grettings Box End */}
              {/* Hour Spent Card Start */}
              <div className="card mt-24 overflow-hidden">
                <div className="card-header">
                  <div className="mb-0 flex-between flex-wrap gap-8">
                    <h4 className="mb-0">Hour Spent</h4>
                    <div className="flex-align gap-16 flex-wrap">
                      <div className="flex-align flex-wrap gap-16">
                        <div className="flex-align flex-wrap gap-8">
                          <span className="w-8 h-8 rounded-circle bg-main-two-600" />
                          <span className="text-13 text-gray-600">Study</span>
                        </div>
                        <div className="flex-align flex-wrap gap-8">
                          <span className="w-8 h-8 rounded-circle bg-main-two-200" />
                          <span className="text-13 text-gray-600">Exam</span>
                        </div>
                      </div>
                      <select className="form-select form-control text-13 px-8 pe-24 py-8 rounded-8 w-auto">
                        <option value={1}>Yearly</option>
                        <option value={1}>Monthly</option>
                        <option value={1}>Weekly</option>
                        <option value={1}>Today</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="card-body p-0">
                  <Chart
                    options={stackedBarChartOptions}
                    series={stackedBarChartSeries}
                    type="bar"
                    height={400}
                  />
                </div>
              </div>
              {/* Hour Spent Card End */}
              {/* Table Start */}
              <div className="card mt-24 overflow-hidden">
                <div className="card-header">
                  <div className="mb-0 flex-between flex-wrap gap-8">
                    <h4 className="mb-0">Your Assignments</h4>
                    <a
                      href="student-courses.html"
                      className="text-13 fw-medium text-main-600 hover-text-decoration-underline"
                    >
                      See All
                    </a>
                  </div>
                </div>
                <div className="card-body p-0 overflow-x-auto scroll-sm scroll-sm-horizontal">
                  <table className="table style-two mb-0">
                    <thead>
                      <tr>
                        <th>Course Name</th>
                        <th>Progress</th>
                        <th className="text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div className="flex-align gap-8">
                            <div className="w-40 h-40 rounded-circle bg-main-600 flex-center flex-shrink-0">
                              <img
                                src="assets/images/icons/course-name-icon1.png"
                                alt=""
                              />
                            </div>
                            <div>
                              <h6 className="mb-0">Design Accesibility</h6>
                              <div className="table-list">
                                <span className="text-13 text-gray-600">
                                  Advanced
                                </span>
                                <span className="text-13 text-gray-600">
                                  12 Hours
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="flex-align gap-8 mt-12">
                            <div
                              className="progress w-100px  bg-main-100 rounded-pill h-4"
                              role="progressbar"
                              aria-label="Basic example"
                              aria-valuenow={32}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            >
                              <div
                                className="progress-bar bg-main-600 rounded-pill"
                                style={{ width: "32%" }}
                              />
                            </div>
                            <span className="text-main-600 flex-shrink-0 text-13 fw-medium">
                              32%
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="flex-align justify-content-center gap-16">
                            <span className="text-13 py-2 px-8 bg-warning-50 text-warning-600 d-inline-flex align-items-center gap-8 rounded-pill">
                              <span className="w-6 h-6 bg-warning-600 rounded-circle flex-shrink-0" />
                              In Progress
                            </span>
                            <a
                              href="assignment.html"
                              className="text-gray-900 hover-text-main-600 text-md d-flex"
                            >
                              <i className="ph ph-caret-right" />
                            </a>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="flex-align gap-8">
                            <div className="w-40 h-40 rounded-circle bg-purple-600 flex-center">
                              <img
                                src="assets/images/icons/course-name-icon2.png"
                                alt=""
                              />
                            </div>
                            <div>
                              <h6 className="mb-0">Figma for Beginner</h6>
                              <div className="table-list">
                                <span className="text-13 text-gray-600">
                                  Intermediate
                                </span>
                                <span className="text-13 text-gray-600">
                                  12 Hours
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="flex-align gap-8 mt-12">
                            <div
                              className="progress w-100px  bg-main-100 rounded-pill h-4"
                              role="progressbar"
                              aria-label="Basic example"
                              aria-valuenow={50}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            >
                              <div
                                className="progress-bar bg-main-600 rounded-pill"
                                style={{ width: "50%" }}
                              />
                            </div>
                            <span className="text-main-600 flex-shrink-0 text-13 fw-medium">
                              50%
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="flex-align justify-content-center gap-16">
                            <span className="text-13 py-2 px-8 bg-warning-50 text-warning-600 d-inline-flex align-items-center gap-8 rounded-pill">
                              <span className="w-6 h-6 bg-warning-600 rounded-circle flex-shrink-0" />
                              In Progress
                            </span>
                            <a
                              href="assignment.html"
                              className="text-gray-900 hover-text-main-600 text-md d-flex"
                            >
                              <i className="ph ph-caret-right" />
                            </a>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="flex-align gap-8">
                            <div className="w-40 h-40 rounded-circle bg-warning-600 flex-center">
                              <img
                                src="assets/images/icons/course-name-icon3.png"
                                alt=""
                              />
                            </div>
                            <div>
                              <h6 className="mb-0">Framer Design</h6>
                              <div className="table-list">
                                <span className="text-13 text-gray-600">
                                  Advanced
                                </span>
                                <span className="text-13 text-gray-600">
                                  12 Hours
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="flex-align gap-8 mt-12">
                            <div
                              className="progress w-100px  bg-main-100 rounded-pill h-4"
                              role="progressbar"
                              aria-label="Basic example"
                              aria-valuenow={72}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            >
                              <div
                                className="progress-bar bg-main-600 rounded-pill"
                                style={{ width: "72%" }}
                              />
                            </div>
                            <span className="text-main-600 flex-shrink-0 text-13 fw-medium">
                              72%
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="flex-align justify-content-center gap-16">
                            <span className="text-13 py-2 px-8 bg-warning-50 text-warning-600 d-inline-flex align-items-center gap-8 rounded-pill">
                              <span className="w-6 h-6 bg-warning-600 rounded-circle flex-shrink-0" />
                              In Progress
                            </span>
                            <a
                              href="assignment.html"
                              className="text-gray-900 hover-text-main-600 text-md d-flex"
                            >
                              <i className="ph ph-caret-right" />
                            </a>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="flex-align gap-8">
                            <div className="w-40 h-40 rounded-circle bg-main-two-600 flex-center">
                              <img
                                src="assets/images/icons/course-name-icon4.png"
                                alt=""
                              />
                            </div>
                            <div>
                              <h6 className="mb-0">Frontend Development</h6>
                              <div className="table-list">
                                <span className="text-13 text-gray-600">
                                  Intermediate
                                </span>
                                <span className="text-13 text-gray-600">
                                  12 Hours
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="flex-align gap-8 mt-12">
                            <div
                              className="progress w-100px  bg-main-100 rounded-pill h-4"
                              role="progressbar"
                              aria-label="Basic example"
                              aria-valuenow={100}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            >
                              <div
                                className="progress-bar bg-main-600 rounded-pill"
                                style={{ width: "100%" }}
                              />
                            </div>
                            <span className="text-main-600 flex-shrink-0 text-13 fw-medium">
                              100%
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="flex-align justify-content-center gap-16">
                            <span className="text-13 py-2 px-8 bg-success-50 text-success-600 d-inline-flex align-items-center gap-8 rounded-pill">
                              <span className="w-6 h-6 bg-success-600 rounded-circle flex-shrink-0" />
                              Completed
                            </span>
                            <a
                              href="assignment.html"
                              className="text-gray-900 hover-text-main-600 text-md d-flex"
                            >
                              <i className="ph ph-caret-right" />
                            </a>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="flex-align gap-8">
                            <div className="w-40 h-40 rounded-circle bg-main-600 flex-center flex-shrink-0">
                              <img
                                src="assets/images/icons/course-name-icon1.png"
                                alt=""
                              />
                            </div>
                            <div>
                              <h6 className="mb-0">Design Accesibility</h6>
                              <div className="table-list">
                                <span className="text-13 text-gray-600">
                                  Advanced
                                </span>
                                <span className="text-13 text-gray-600">
                                  12 Hours
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="flex-align gap-8 mt-12">
                            <div
                              className="progress w-100px  bg-main-100 rounded-pill h-4"
                              role="progressbar"
                              aria-label="Basic example"
                              aria-valuenow={32}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            >
                              <div
                                className="progress-bar bg-main-600 rounded-pill"
                                style={{ width: "32%" }}
                              />
                            </div>
                            <span className="text-main-600 flex-shrink-0 text-13 fw-medium">
                              32%
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="flex-align justify-content-center gap-16">
                            <span className="text-13 py-2 px-8 bg-warning-50 text-warning-600 d-inline-flex align-items-center gap-8 rounded-pill">
                              <span className="w-6 h-6 bg-warning-600 rounded-circle flex-shrink-0" />
                              In Progress
                            </span>
                            <a
                              href="assignment.html"
                              className="text-gray-900 hover-text-main-600 text-md d-flex"
                            >
                              <i className="ph ph-caret-right" />
                            </a>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="flex-align gap-8">
                            <div className="w-40 h-40 rounded-circle bg-purple-600 flex-center">
                              <img
                                src="assets/images/icons/course-name-icon2.png"
                                alt=""
                              />
                            </div>
                            <div>
                              <h6 className="mb-0">Figma for Beginner</h6>
                              <div className="table-list">
                                <span className="text-13 text-gray-600">
                                  Intermediate
                                </span>
                                <span className="text-13 text-gray-600">
                                  12 Hours
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="flex-align gap-8 mt-12">
                            <div
                              className="progress w-100px  bg-main-100 rounded-pill h-4"
                              role="progressbar"
                              aria-label="Basic example"
                              aria-valuenow={50}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            >
                              <div
                                className="progress-bar bg-main-600 rounded-pill"
                                style={{ width: "50%" }}
                              />
                            </div>
                            <span className="text-main-600 flex-shrink-0 text-13 fw-medium">
                              50%
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="flex-align justify-content-center gap-16">
                            <span className="text-13 py-2 px-8 bg-warning-50 text-warning-600 d-inline-flex align-items-center gap-8 rounded-pill">
                              <span className="w-6 h-6 bg-warning-600 rounded-circle flex-shrink-0" />
                              In Progress
                            </span>
                            <a
                              href="assignment.html"
                              className="text-gray-900 hover-text-main-600 text-md d-flex"
                            >
                              <i className="ph ph-caret-right" />
                            </a>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="flex-align gap-8">
                            <div className="w-40 h-40 rounded-circle bg-warning-600 flex-center">
                              <img
                                src="assets/images/icons/course-name-icon3.png"
                                alt=""
                              />
                            </div>
                            <div>
                              <h6 className="mb-0">Framer Design</h6>
                              <div className="table-list">
                                <span className="text-13 text-gray-600">
                                  Advanced
                                </span>
                                <span className="text-13 text-gray-600">
                                  12 Hours
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="flex-align gap-8 mt-12">
                            <div
                              className="progress w-100px  bg-main-100 rounded-pill h-4"
                              role="progressbar"
                              aria-label="Basic example"
                              aria-valuenow={72}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            >
                              <div
                                className="progress-bar bg-main-600 rounded-pill"
                                style={{ width: "72%" }}
                              />
                            </div>
                            <span className="text-main-600 flex-shrink-0 text-13 fw-medium">
                              72%
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="flex-align justify-content-center gap-16">
                            <span className="text-13 py-2 px-8 bg-warning-50 text-warning-600 d-inline-flex align-items-center gap-8 rounded-pill">
                              <span className="w-6 h-6 bg-warning-600 rounded-circle flex-shrink-0" />
                              In Progress
                            </span>
                            <a
                              href="assignment.html"
                              className="text-gray-900 hover-text-main-600 text-md d-flex"
                            >
                              <i className="ph ph-caret-right" />
                            </a>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="flex-align gap-8">
                            <div className="w-40 h-40 rounded-circle bg-main-two-600 flex-center">
                              <img
                                src="assets/images/icons/course-name-icon4.png"
                                alt=""
                              />
                            </div>
                            <div>
                              <h6 className="mb-0">Frontend Development</h6>
                              <div className="table-list">
                                <span className="text-13 text-gray-600">
                                  Intermediate
                                </span>
                                <span className="text-13 text-gray-600">
                                  12 Hours
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="flex-align gap-8 mt-12">
                            <div
                              className="progress w-100px  bg-main-100 rounded-pill h-4"
                              role="progressbar"
                              aria-label="Basic example"
                              aria-valuenow={100}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            >
                              <div
                                className="progress-bar bg-main-600 rounded-pill"
                                style={{ width: "100%" }}
                              />
                            </div>
                            <span className="text-main-600 flex-shrink-0 text-13 fw-medium">
                              100%
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="flex-align justify-content-center gap-16">
                            <span className="text-13 py-2 px-8 bg-success-50 text-success-600 d-inline-flex align-items-center gap-8 rounded-pill">
                              <span className="w-6 h-6 bg-success-600 rounded-circle flex-shrink-0" />
                              Completed
                            </span>
                            <a
                              href="assignment.html"
                              className="text-gray-900 hover-text-main-600 text-md d-flex"
                            >
                              <i className="ph ph-caret-right" />
                            </a>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="flex-align gap-8">
                            <div className="w-40 h-40 rounded-circle bg-purple-600 flex-center">
                              <img
                                src="assets/images/icons/course-name-icon2.png"
                                alt=""
                              />
                            </div>
                            <div>
                              <h6 className="mb-0">Figma for Beginner</h6>
                              <div className="table-list">
                                <span className="text-13 text-gray-600">
                                  Intermediate
                                </span>
                                <span className="text-13 text-gray-600">
                                  12 Hours
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="flex-align gap-8 mt-12">
                            <div
                              className="progress w-100px  bg-main-100 rounded-pill h-4"
                              role="progressbar"
                              aria-label="Basic example"
                              aria-valuenow={50}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            >
                              <div
                                className="progress-bar bg-main-600 rounded-pill"
                                style={{ width: "50%" }}
                              />
                            </div>
                            <span className="text-main-600 flex-shrink-0 text-13 fw-medium">
                              50%
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="flex-align justify-content-center gap-16">
                            <span className="text-13 py-2 px-8 bg-warning-50 text-warning-600 d-inline-flex align-items-center gap-8 rounded-pill">
                              <span className="w-6 h-6 bg-warning-600 rounded-circle flex-shrink-0" />
                              In Progress
                            </span>
                            <a
                              href="assignment.html"
                              className="text-gray-900 hover-text-main-600 text-md d-flex"
                            >
                              <i className="ph ph-caret-right" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Table End */}
            </div>
            <div className="col-lg-3">
              {/* Calendar Start */}
              <div className="card">
                <div className="card-body">
                  <div className="calendar">
                    <div className="calendar__header">
                      <button type="button" className="calendar__arrow left">
                        <i className="ph ph-caret-left" />
                      </button>
                      <p className="display h6 mb-0">""</p>
                      <button type="button" className="calendar__arrow right">
                        <i className="ph ph-caret-right" />
                      </button>
                    </div>
                    <div className="calendar__week week">
                      <div className="calendar__week-text">Su</div>
                      <div className="calendar__week-text">Mo</div>
                      <div className="calendar__week-text">Tu</div>
                      <div className="calendar__week-text">We</div>
                      <div className="calendar__week-text">Th</div>
                      <div className="calendar__week-text">Fr</div>
                      <div className="calendar__week-text">Sa</div>
                    </div>
                    <div className="days" />
                  </div>
                  {/* Events start */}
                  <div>
                    <div className="mt-24 mb-24">
                      <div className="flex-align mb-8 gap-16">
                        <span className="text-sm text-gray-300 flex-shrink-0">
                          Today
                        </span>
                        <span className="border border-gray-50 border-dashed flex-grow-1" />
                      </div>
                      <div className="event-item bg-gray-50 rounded-8 p-16">
                        <div className=" flex-between gap-4">
                          <div className="flex-align gap-8">
                            <span className="icon d-flex w-44 h-44 bg-white rounded-8 flex-center text-2xl">
                              <i className="ph ph-squares-four" />
                            </span>
                            <div>
                              <h6 className="mb-2">Element of design test</h6>
                              <span>10:00 - 11:00 AM</span>
                            </div>
                          </div>
                          <div className="dropdown flex-shrink-0">
                            <button
                              className="text-gray-400 text-xl d-flex rounded-4"
                              type="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <i className="ph-fill ph-dots-three-outline" />
                            </button>
                            <div className="dropdown-menu dropdown-menu--md border-0 bg-transparent p-0">
                              <div className="card border border-gray-100 rounded-12 box-shadow-custom">
                                <div className="card-body p-12">
                                  <div className="max-h-200 overflow-y-auto scroll-sm pe-8">
                                    <ul>
                                      <li className="mb-0">
                                        <button
                                          type="button"
                                          className="delete-btn py-6 text-15 px-8 hover-bg-gray-50 text-gray-300 w-100 rounded-8 fw-normal text-xs d-block text-start hover-text-gray-600"
                                        >
                                          <span className="text d-flex align-items-center gap-8">
                                            <i className="ph ph-trash" />
                                            Remove
                                          </span>
                                        </button>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="mt-24">
                      <div className="flex-align mb-8 gap-16">
                        <span className="text-sm text-gray-300 flex-shrink-0">
                          Sat, Aug 24
                        </span>
                        <span className="border border-gray-50 border-dashed flex-grow-1" />
                      </div>
                      <div className="event-item bg-gray-50 rounded-8 p-16">
                        <div className=" flex-between gap-4">
                          <div className="flex-align gap-8">
                            <span className="icon d-flex w-44 h-44 bg-white rounded-8 flex-center text-2xl">
                              <i className="ph ph-magic-wand" />
                            </span>
                            <div>
                              <h6 className="mb-2">Design Principles test</h6>
                              <span>10:00 - 11:00 AM</span>
                            </div>
                          </div>
                          <div className="dropdown flex-shrink-0">
                            <button
                              className="text-gray-400 text-xl d-flex rounded-4"
                              type="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <i className="ph-fill ph-dots-three-outline" />
                            </button>
                            <div className="dropdown-menu dropdown-menu--md border-0 bg-transparent p-0">
                              <div className="card border border-gray-100 rounded-12 box-shadow-custom">
                                <div className="card-body p-12">
                                  <div className="max-h-200 overflow-y-auto scroll-sm pe-8">
                                    <ul>
                                      <li className="mb-0">
                                        <button
                                          type="button"
                                          className="delete-btn py-6 text-15 px-8 hover-bg-gray-50 text-gray-300 w-100 rounded-8 fw-normal text-xs d-block text-start hover-text-gray-600"
                                        >
                                          <span className="text d-flex align-items-center gap-8">
                                            <i className="ph ph-trash" />
                                            Remove
                                          </span>
                                        </button>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="event-item bg-gray-50 rounded-8 p-16 mt-16">
                        <div className=" flex-between gap-4">
                          <div className="flex-align gap-8">
                            <span className="icon d-flex w-44 h-44 bg-white rounded-8 flex-center text-2xl">
                              <i className="ph ph-briefcase" />
                            </span>
                            <div>
                              <h6 className="mb-2">Prepare Job Interview</h6>
                              <span>09:00 - 10:00 AM</span>
                            </div>
                          </div>
                          <div className="dropdown flex-shrink-0">
                            <button
                              className="text-gray-400 text-xl d-flex rounded-4"
                              type="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <i className="ph-fill ph-dots-three-outline" />
                            </button>
                            <div className="dropdown-menu dropdown-menu--md border-0 bg-transparent p-0">
                              <div className="card border border-gray-100 rounded-12 box-shadow-custom">
                                <div className="card-body p-12">
                                  <div className="max-h-200 overflow-y-auto scroll-sm pe-8">
                                    <ul>
                                      <li className="mb-0">
                                        <button
                                          type="button"
                                          className="delete-btn py-6 text-15 px-8 hover-bg-gray-50 text-gray-300 w-100 rounded-8 fw-normal text-xs d-block text-start hover-text-gray-600"
                                        >
                                          <span className="text d-flex align-items-center gap-8">
                                            <i className="ph ph-trash" />
                                            Remove
                                          </span>
                                        </button>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <a href="event.html" className="btn btn-main w-100 mt-24">
                      All Events
                    </a>
                  </div>
                  {/* Events End */}
                </div>
              </div>
              {/* Calendar End */}
              {/* Donut Chart Start */}
              <div className="card mt-24">
                <div className="card-header border-bottom border-gray-100 flex-between gap-8 flex-wrap">
                  <h5 className="mb-0">Most Activity</h5>
                  <div className="dropdown flex-shrink-0">
                    <button
                      className="text-gray-400 text-xl d-flex rounded-4"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="ph-fill ph-dots-three-outline" />
                    </button>
                    <div className="dropdown-menu dropdown-menu--md border-0 bg-transparent p-0">
                      <div className="card border border-gray-100 rounded-12 box-shadow-custom">
                        <div className="card-body p-12">
                          <div className="max-h-200 overflow-y-auto scroll-sm pe-8">
                            <ul>
                              <li className="mb-0">
                                <a
                                  href="students.html"
                                  className="py-6 text-15 px-8 hover-bg-gray-50 text-gray-300 w-100 rounded-8 fw-normal text-xs d-block text-start"
                                >
                                  <span className="text">
                                    <i className="ph ph-user me-4" />
                                    View
                                  </span>
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="flex-center">
                    <div className="w-auto d-inline-block">
                      <Chart
                        options={mostActivityChartOptions}
                        series={mostActivityChartSeries}
                        type="donut"
                      />
                    </div>
                  </div>
                  <div className="flex-between gap-8 flex-wrap mt-24">
                    <div className="flex-align flex-column">
                      <span className="w-12 h-12 bg-white border border-3 border-main-600 rounded-circle" />
                      <span className="text-13 my-4 text-main-600">
                        Mentoring
                      </span>
                      <h6 className="mb-0">65.2%</h6>
                    </div>
                    <div className="flex-align flex-column">
                      <span className="w-12 h-12 bg-white border border-3 border-main-two-600 rounded-circle" />
                      <span className="text-13 my-4 text-main-two-600">
                        Organization
                      </span>
                      <h6 className="mb-0">25.0%</h6>
                    </div>
                    <div className="flex-align flex-column">
                      <span className="w-12 h-12 bg-white border border-3 border-warning-600 rounded-circle" />
                      <span className="text-13 my-4 text-warning-600">
                        Planning
                      </span>
                      <h6 className="mb-0">9.8%</h6>
                    </div>
                  </div>
                </div>
              </div>
              {/* Donut Chart End */}
              {/* Community Groups card Start */}
              <div className="card mt-24">
                <div className="card-body">
                  <div className="mb-20 flex-between flex-wrap gap-8">
                    <h4 className="mb-0">Community Groups</h4>
                    <a
                      href="student-courses.html"
                      className="w-28 h-28 flex-center bg-gray-50 rounded-circle text-gray-600 hover-bg-gray-100"
                    >
                      <i className="ph ph-plus" />
                    </a>
                  </div>
                  <div className="p-xl-4 py-16 px-12 flex-between gap-8 rounded-8 border border-gray-100 hover-border-gray-200 transition-1 mb-16">
                    <div className="flex-align flex-wrap gap-8">
                      <span className="text-main-600 bg-main-50 w-44 h-44 rounded-circle flex-center text-2xl flex-shrink-0">
                        <i className="ph-fill ph-graduation-cap" />
                      </span>
                      <div>
                        <h6 className="mb-0">Design Community, USA</h6>
                        <span className="text-13 text-gray-500 fw-medium">
                          125k Members
                        </span>
                      </div>
                    </div>
                    <a
                      href="assignment.html"
                      className="text-gray-900 hover-text-main-600"
                    >
                      <i className="ph ph-caret-right" />
                    </a>
                  </div>
                  <div className="p-xl-4 py-16 px-12 flex-between gap-8 rounded-8 border border-gray-100 hover-border-gray-200 transition-1 mb-16">
                    <div className="flex-align flex-wrap gap-8">
                      <span className="text-dribble-600 bg-dribble-50 w-44 h-44 rounded-circle flex-center text-2xl flex-shrink-0">
                        <i className="ph ph-dribbble-logo" />
                      </span>
                      <div>
                        <h6 className="mb-0">Dribbble Global Groups</h6>
                        <span className="text-13 text-gray-500 fw-medium">
                          28M Members
                        </span>
                      </div>
                    </div>
                    <a
                      href="assignment.html"
                      className="text-gray-900 hover-text-main-600"
                    >
                      <i className="ph ph-caret-right" />
                    </a>
                  </div>
                  <div className="p-xl-4 py-16 px-12 flex-between gap-8 rounded-8 border border-gray-100 hover-border-gray-200 transition-1">
                    <div className="flex-align flex-wrap gap-8">
                      <span className="text-purple-600 bg-purple-50 w-44 h-44 rounded-circle flex-center text-2xl flex-shrink-0">
                        <i className="ph ph-chart-line-up" />
                      </span>
                      <div>
                        <h6 className="mb-0">Marketing Support Group</h6>
                        <span className="text-13 text-gray-500 fw-medium">
                          125k Members
                        </span>
                      </div>
                    </div>
                    <a
                      href="assignment.html"
                      className="text-gray-900 hover-text-main-600"
                    >
                      <i className="ph ph-caret-right" />
                    </a>
                  </div>
                </div>
              </div>
              {/* Community Groups card End */}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default HomeTwo;
