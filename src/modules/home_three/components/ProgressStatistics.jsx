import React from "react";
import { Link } from "react-router-dom";

function ProgressStatistics() {
  return (
    <>
      <div className="col-xxl-3 col-sm-6">
        {/* Progress Bar Start */}
        <div className="card h-100 ">
          <div className="card-header border-bottom border-gray-100 flex-between flex-wrap gap-8">
            <h5 className="mb-0">Progress Statistics</h5>
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
                          <Link
                            to={"#"}
                            className="py-6 text-15 px-8 hover-bg-gray-50 text-gray-300 w-100 rounded-8 fw-normal text-xs d-block text-start"
                          >
                            <span className="text">
                              <i className="ph ph-user me-4" /> View
                            </span>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* remove position relative and lock-overlay div when unlocks */}
          <div className="card-body position-relative">
            <div className="lock-overlay active">
              <i className="ph-fill ph-lock" />
            </div>

            <div className="content">
              {/* Your actual content */}
              <div>
                <span className="text-gray-200 text-lg mb-12 mt-10 d-block text-center">
                  Total activity
                </span>
                <h1 className="text-48 fw-medium mb-12 text-center">0%</h1>

                <div className="flex-between flex-wrap">
                  <div className="d-flex gap-8 mt-12 flex-column w-50-perc pe-8">
                    <div
                      className="progress w-100 bg-main-100 rounded-pill h-4"
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
                    <span className="text-neutral-600 flex-shrink-0 text-13 fw-medium">
                      0%
                    </span>
                  </div>
                  <div className="d-flex gap-8 mt-12 flex-column w-50-perc ps-8">
                    <div
                      className="progress w-100 bg-main-two-100 rounded-pill h-4"
                      role="progressbar"
                      aria-label="Basic example"
                      aria-valuenow={80}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className="progress-bar bg-main-two-600 rounded-pill"
                        style={{ width: "80%" }}
                      />
                    </div>
                    <span className="text-neutral-600 flex-shrink-0 text-13 fw-medium">
                      0%
                    </span>
                  </div>
                </div>

                <div className="mt-20">
                  <div className="bg-primary-50 rounded-16 p-12 flex-between flex-wrap gap-8 mb-16">
                    <div className="flex-align gap-16">
                      <span className="w-48 h-48 rounded-8 flex-center text-xl bg-primary-600 text-white">
                        <i className="ph ph-calendar-dots" />
                      </span>
                      <h2 className="mb-0 fw-medium text-primary-600">25</h2>
                    </div>
                    <span className="px-16 py-4 rounded-pill bg-white border border-primary-600 text-primary-600 fw-medium">
                      In Progress
                    </span>
                  </div>

                  <div className="bg-success-50 rounded-16 p-12 flex-between flex-wrap gap-8 mb-0">
                    <div className="flex-align gap-16">
                      <span className="w-48 h-48 rounded-8 flex-center text-xl bg-success-600 text-white">
                        <i className="ph ph-calendar-dots" />
                      </span>
                      <h2 className="mb-0 fw-medium text-success-600">12</h2>
                    </div>
                    <span className="px-16 py-4 rounded-pill bg-white border border-success-600 text-success-600 fw-medium">
                      Completed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <img
            className="card-body"
            src="assets/images/thumbs/progress_state.png"
            alt=""
          /> */}
        </div>
        {/* Progress bar end */}
      </div>
    </>
  );
}

export default ProgressStatistics;
