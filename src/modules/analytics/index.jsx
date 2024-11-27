import React from "react";
import Footer from "../../common/footer";
import Sidebar from "../../common/sidebar";
import Header from "../../common/header/Header";

function Analytics() {
  return (
    <>
      {/*==================== Preloader Start ====================*/}
      <div className="preloader">
        <div className="loader" />
      </div>
      {/*==================== Preloader End ====================*/}
      {/*==================== Sidebar Overlay End ====================*/}
      <Sidebar />
      {/* ============================ Sidebar End  ============================ */}
      <div className="dashboard-main-wrapper">
        <Header />
        <div className="dashboard-body">
          {/* Breadcrumb Start */}
          <div className="breadcrumb mb-24">
            <ul className="flex-align gap-4">
              <li>
                <a
                  href="index.html"
                  className="text-gray-200 fw-normal text-15 hover-text-main-600"
                >
                  Home
                </a>
              </li>
              <li>
                <span className="text-gray-500 fw-normal d-flex">
                  <i className="ph ph-caret-right" />
                </span>
              </li>
              <li>
                <span className="text-main-600 fw-normal text-15">
                  Analytics
                </span>
              </li>
            </ul>
          </div>
          {/* Breadcrumb End */}
          <div className="row gy-4">
            <div className="col-lg-9">
              {/* Widgets Start */}
              <div className="row gy-4">
                <div className="col-xl-4 col-sm-6">
                  <div className="card h-100">
                    <div className="card-body pe-0">
                      <div className="flex-align gap-12">
                        <span className="flex-shrink-0 w-56 h-56 flex-center rounded-circle bg-main-600 text-white text-2xl">
                          <i className="ph-fill ph-calendar-dots" />
                        </span>
                        <span className="text-16 text-heading">Time Spend</span>
                      </div>
                      <div className="flex-between align-items-end">
                        <div>
                          <h4 className="mb-4">48:32:18</h4>
                          <div className="flex-align gap-8">
                            <span className="text-danger-600 text-15">
                              <i className="ph ph-arrow-down" />
                            </span>
                            <span className="text-danger-600 text-15">
                              2:25:08
                            </span>
                          </div>
                        </div>
                        <div className="flex-between gap-8">
                          <div
                            id="complete-course1"
                            className="remove-tooltip-title rounded-tooltip-value"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-sm-6">
                  <div className="card h-100">
                    <div className="card-body pe-0">
                      <div className="flex-align gap-12">
                        <span className="flex-shrink-0 w-56 h-56 flex-center rounded-circle bg-main-two-600 text-white text-2xl">
                          <i className="ph-fill ph-trend-up" />
                        </span>
                        <span className="text-16 text-heading">
                          Avg. Activity
                        </span>
                      </div>
                      <div className="flex-between align-items-end">
                        <div>
                          <h4 className="mb-4">75%</h4>
                          <div className="flex-align gap-8">
                            <span className="text-success-600 text-15">
                              <i className="ph ph-arrow-down" />
                            </span>
                            <span className="text-success-600 text-15">8%</span>
                          </div>
                        </div>
                        <div className="flex-between gap-8">
                          <div
                            id="complete-course2"
                            className="remove-tooltip-title rounded-tooltip-value"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-sm-6">
                  <div className="card h-100">
                    <div className="card-body pe-0">
                      <div className="flex-align gap-12">
                        <span className="flex-shrink-0 w-56 h-56 flex-center rounded-circle bg-purple-600 text-white text-2xl">
                          <i className="ph-fill ph-credit-card" />
                        </span>
                        <span className="text-16 text-heading">
                          Money Spent
                        </span>
                      </div>
                      <div className="flex-between align-items-end">
                        <div>
                          <h4 className="mb-4">$580.00</h4>
                          <div className="flex-align gap-8">
                            <span className="text-danger-600 text-15">
                              <i className="ph ph-arrow-down" />
                            </span>
                            <span className="text-danger-600 text-15">
                              $56.45
                            </span>
                          </div>
                        </div>
                        <div className="flex-between gap-8">
                          <div
                            id="complete-course3"
                            className="remove-tooltip-title rounded-tooltip-value"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Widgets End */}
              {/* Top Course Start */}
              <div className="card mt-24">
                <div className="card-body">
                  <div className="mb-20 flex-between flex-wrap gap-8">
                    <h4 className="mb-0">Study Statistics</h4>
                    <div className="flex-align gap-16 flex-wrap">
                      <div className="flex-align flex-wrap gap-16">
                        <div className="flex-align flex-wrap gap-8">
                          <span className="w-8 h-8 rounded-circle bg-main-600" />
                          <span className="text-13 text-gray-600">Study</span>
                        </div>
                        <div className="flex-align flex-wrap gap-8">
                          <span className="w-8 h-8 rounded-circle bg-main-two-600" />
                          <span className="text-13 text-gray-600">Test</span>
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
                  <div
                    id="doubleLineChart"
                    className="tooltip-style y-value-left"
                  />
                </div>
              </div>
              {/* Top Course End */}
              {/* Revenue Generate Start */}
              <div className="card mt-24">
                <div className="card-body">
                  <div className="mb-0 flex-between flex-wrap gap-8">
                    <h4 className="mb-0">Revenue Generate</h4>
                    <div className="flex-align gap-16 flex-wrap">
                      <div className="flex-align flex-wrap gap-16">
                        <div className="flex-align flex-wrap gap-8">
                          <span className="w-8 h-8 rounded-circle bg-main-two-600" />
                          <span className="text-13 text-gray-600">Income</span>
                        </div>
                        <div className="flex-align flex-wrap gap-8">
                          <span className="w-8 h-8 rounded-circle bg-main-two-200" />
                          <span className="text-13 text-gray-600">Expense</span>
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
                  <div
                    id="revenueGenerateChart"
                    className="tooltip-style y-value-left"
                  />
                </div>
              </div>
              {/* Revenue Generate End */}
            </div>
            <div className="col-lg-3">
              {/* Donut Chart Start */}
              <div className="card">
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
                                    <i className="ph ph-user me-4" /> View
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
                    <div
                      id="activityDonutChart"
                      className="w-auto d-inline-block"
                    />
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
              {/* Hour Spent Card Start */}
              <div className="card mt-24 overflow-hidden">
                <div className="card-header pb-8">
                  <div className="flex-between">
                    <h4 className="mb-0">Hour Spent</h4>
                    <select className="form-select form-control text-13 px-8 pe-24 py-8 rounded-8 w-auto">
                      <option value={1}>Yearly</option>
                      <option value={1}>Monthly</option>
                      <option value={1}>Weekly</option>
                      <option value={1}>Today</option>
                    </select>
                  </div>
                  <div className="mb-0 flex-between flex-wrap gap-8 mt-8">
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
                    </div>
                  </div>
                </div>
                <div className="card-body p-0">
                  <div id="stackedColumnChart" />
                </div>
              </div>
              {/* Hour Spent Card End */}
              {/* Hour Spent Card Start */}
              <div className="card mt-24 overflow-hidden">
                <div className="card-body">
                  <h4 className="mb-40">Users by country</h4>
                  <div id="world-map" />
                  <div className="mt-20">
                    <div className="mb-16">
                      <div className="flex-between gap-4 mb-4">
                        <span className="text-13 text-gray-600">New York</span>
                        <span className="text-gray-600 flex-shrink-0 text-13 fw-medium">
                          20%
                        </span>
                      </div>
                      <div
                        className="progress w-100  bg-main-100 rounded-pill h-8"
                        role="progressbar"
                        aria-label="Basic example"
                        aria-valuenow={20}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className="progress-bar bg-main-600 rounded-pill"
                          style={{ width: "20%" }}
                        />
                      </div>
                    </div>
                    <div className="mb-16">
                      <div className="flex-between gap-4 mb-4">
                        <span className="text-13 text-gray-600">
                          San Frncisco
                        </span>
                        <span className="text-gray-600 flex-shrink-0 text-13 fw-medium">
                          40%
                        </span>
                      </div>
                      <div
                        className="progress w-100  bg-warning-50 rounded-pill h-8"
                        role="progressbar"
                        aria-label="Basic example"
                        aria-valuenow={40}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className="progress-bar bg-warning-600 rounded-pill"
                          style={{ width: "40%" }}
                        />
                      </div>
                    </div>
                    <div className="mb-0">
                      <div className="flex-between gap-4 mb-4">
                        <span className="text-13 text-gray-600">
                          Bangladesh
                        </span>
                        <span className="text-gray-600 flex-shrink-0 text-13 fw-medium">
                          50%
                        </span>
                      </div>
                      <div
                        className="progress w-100  bg-success-50 rounded-pill h-8"
                        role="progressbar"
                        aria-label="Basic example"
                        aria-valuenow={50}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className="progress-bar bg-success-600 rounded-pill"
                          style={{ width: "50%" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Hour Spent Card End */}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Analytics;
