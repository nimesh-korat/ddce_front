import React from "react";
import Footer from "../../common/footer";
import Sidebar from "../../common/sidebar";
import Header from "../../common/header/Header";

function StudentCourse() {
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
                  Student Courses
                </span>
              </li>
            </ul>
          </div>
          {/* Breadcrumb End */}
          {/* Course Tab Start */}
          <div className="card">
            <div className="card-body">
              <div className="mb-24 flex-between gap-16 flex-wrap-reverse">
                <ul
                  className="nav nav-pills common-tab gap-20"
                  id="pills-tab"
                  role="tablist"
                >
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active"
                      id="pills-onGoing-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-onGoing"
                      type="button"
                      role="tab"
                      aria-controls="pills-onGoing"
                      aria-selected="true"
                    >
                      Ongoing (08)
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="pills-completed-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-completed"
                      type="button"
                      role="tab"
                      aria-controls="pills-completed"
                      aria-selected="false"
                    >
                      Completed (10)
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="pills-saved-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-saved"
                      type="button"
                      role="tab"
                      aria-controls="pills-saved"
                      aria-selected="false"
                    >
                      Saved (12)
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="pills-favourite-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-favourite"
                      type="button"
                      role="tab"
                      aria-controls="pills-favourite"
                      aria-selected="false"
                    >
                      Favorite (25)
                    </button>
                  </li>
                </ul>
                <a
                  href="create-course.html"
                  className="btn btn-main rounded-pill py-7 flex-align gap-4 fw-normal"
                >
                  <span className="d-flex text-md">
                    <i className="ph ph-plus" />
                  </span>
                  Create New Course
                </a>
              </div>
              <div className="tab-content" id="pills-tabContent">
                <div
                  className="tab-pane fade show active"
                  id="pills-onGoing"
                  role="tabpanel"
                  aria-labelledby="pills-onGoing-tab"
                  tabIndex={0}
                >
                  <div className="row g-20">
                    <div className="col-xxl-3 col-lg-4 col-sm-6">
                      <div className="card border border-gray-100">
                        <div className="card-body p-8">
                          <a
                            href="course-details.html"
                            className="bg-main-100 rounded-8 overflow-hidden text-center mb-8 h-164 flex-center p-8"
                          >
                            <img
                              src="assets/images/thumbs/course-img1.png"
                              alt="Course"
                            />
                          </a>
                          <div className="p-8">
                            <span className="text-13 py-2 px-10 rounded-pill bg-success-50 text-success-600 mb-16">
                              Development
                            </span>
                            <h5 className="mb-0">
                              <a
                                href="course-details.html"
                                className="hover-text-main-600"
                              >
                                Full Stack Web Development
                              </a>
                            </h5>
                            <div className="flex-align gap-8 mt-12">
                              <span className="text-main-600 flex-shrink-0 text-13 fw-medium">
                                32%
                              </span>
                              <div
                                className="progress w-100  bg-main-100 rounded-pill h-8"
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
                            </div>
                            <div className="flex-align gap-8 flex-wrap mt-16">
                              <img
                                src="assets/images/thumbs/user-img1.png"
                                className="w-32 h-32 rounded-circle object-fit-cover"
                                alt="User"
                              />
                              <div>
                                <span className="text-gray-600 text-13">
                                  Created by
                                  <a
                                    href="profile.html"
                                    className="fw-semibold text-gray-700 hover-text-main-600 hover-text-decoration-underline"
                                  >
                                    Albert James
                                  </a>
                                </span>
                                <div className="flex-align gap-4">
                                  <span className="text-15 fw-bold text-warning-600 d-flex">
                                    <i className="ph-fill ph-star" />
                                  </span>
                                  <span className="text-13 fw-bold text-gray-600">
                                    4.9
                                  </span>
                                  <span className="text-13 fw-bold text-gray-600">
                                    (12k)
                                  </span>
                                </div>
                              </div>
                            </div>
                            <a
                              href="live-class.html"
                              className="btn btn-outline-main rounded-pill py-9 w-100 mt-24"
                            >
                              Continue Watching
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xxl-3 col-lg-4 col-sm-6">
                      <div className="card border border-gray-100">
                        <div className="card-body p-8">
                          <a
                            href="course-details.html"
                            className="bg-main-100 rounded-8 overflow-hidden text-center mb-8 h-164 flex-center p-8"
                          >
                            <img
                              src="assets/images/thumbs/course-img2.png"
                              alt="Course"
                            />
                          </a>
                          <div className="p-8">
                            <span className="text-13 py-2 px-10 rounded-pill bg-warning-50 text-warning-600 mb-16">
                              Design
                            </span>
                            <h5 className="mb-0">
                              <a
                                href="course-details.html"
                                className="hover-text-main-600"
                              >
                                UI/UX Design Course
                              </a>
                            </h5>
                            <div className="flex-align gap-8 mt-12">
                              <span className="text-main-600 flex-shrink-0 text-13 fw-medium">
                                20%
                              </span>
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
                            <div className="flex-align gap-8 flex-wrap mt-16">
                              <img
                                src="assets/images/thumbs/user-img2.png"
                                className="w-32 h-32 rounded-circle object-fit-cover"
                                alt="User"
                              />
                              <div>
                                <span className="text-gray-600 text-13">
                                  Created by
                                  <a
                                    href="profile.html"
                                    className="fw-semibold text-gray-700 hover-text-main-600 hover-text-decoration-underline"
                                  >
                                    Albert James
                                  </a>
                                </span>
                                <div className="flex-align gap-4">
                                  <span className="text-15 fw-bold text-warning-600 d-flex">
                                    <i className="ph-fill ph-star" />
                                  </span>
                                  <span className="text-13 fw-bold text-gray-600">
                                    4.9
                                  </span>
                                  <span className="text-13 fw-bold text-gray-600">
                                    (12k)
                                  </span>
                                </div>
                              </div>
                            </div>
                            <a
                              href="live-class.html"
                              className="btn btn-outline-main rounded-pill py-9 w-100 mt-24"
                            >
                              Continue Watching
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xxl-3 col-lg-4 col-sm-6">
                      <div className="card border border-gray-100">
                        <div className="card-body p-8">
                          <a
                            href="course-details.html"
                            className="bg-main-100 rounded-8 overflow-hidden text-center mb-8 h-164 flex-center p-8"
                          >
                            <img
                              src="assets/images/thumbs/course-img3.png"
                              alt="Course"
                            />
                          </a>
                          <div className="p-8">
                            <span className="text-13 py-2 px-10 rounded-pill bg-danger-50 text-danger-600 mb-16">
                              Frontend
                            </span>
                            <h5 className="mb-0">
                              <a
                                href="course-details.html"
                                className="hover-text-main-600"
                              >
                                React Native Courese
                              </a>
                            </h5>
                            <div className="flex-align gap-8 mt-12">
                              <span className="text-main-600 flex-shrink-0 text-13 fw-medium">
                                45%
                              </span>
                              <div
                                className="progress w-100  bg-main-100 rounded-pill h-8"
                                role="progressbar"
                                aria-label="Basic example"
                                aria-valuenow={45}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              >
                                <div
                                  className="progress-bar bg-main-600 rounded-pill"
                                  style={{ width: "45%" }}
                                />
                              </div>
                            </div>
                            <div className="flex-align gap-8 flex-wrap mt-16">
                              <img
                                src="assets/images/thumbs/user-img3.png"
                                className="w-32 h-32 rounded-circle object-fit-cover"
                                alt="User"
                              />
                              <div>
                                <span className="text-gray-600 text-13">
                                  Created by
                                  <a
                                    href="profile.html"
                                    className="fw-semibold text-gray-700 hover-text-main-600 hover-text-decoration-underline"
                                  >
                                    Albert James
                                  </a>
                                </span>
                                <div className="flex-align gap-4">
                                  <span className="text-15 fw-bold text-warning-600 d-flex">
                                    <i className="ph-fill ph-star" />
                                  </span>
                                  <span className="text-13 fw-bold text-gray-600">
                                    4.9
                                  </span>
                                  <span className="text-13 fw-bold text-gray-600">
                                    (12k)
                                  </span>
                                </div>
                              </div>
                            </div>
                            <a
                              href="live-class.html"
                              className="btn btn-outline-main rounded-pill py-9 w-100 mt-24"
                            >
                              Continue Watching
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xxl-3 col-lg-4 col-sm-6">
                      <div className="card border border-gray-100">
                        <div className="card-body p-8">
                          <a
                            href="course-details.html"
                            className="bg-main-100 rounded-8 overflow-hidden text-center mb-8 h-164 flex-center p-8"
                          >
                            <img
                              src="assets/images/thumbs/course-img4.png"
                              alt="Course"
                            />
                          </a>
                          <div className="p-8">
                            <span className="text-13 py-2 px-10 rounded-pill bg-info-50 text-info-600 mb-16">
                              Marketing
                            </span>
                            <h5 className="mb-0">
                              <a
                                href="course-details.html"
                                className="hover-text-main-600"
                              >
                                SEO Expert A To Z Course
                              </a>
                            </h5>
                            <div className="flex-align gap-8 mt-12">
                              <span className="text-main-600 flex-shrink-0 text-13 fw-medium">
                                10%
                              </span>
                              <div
                                className="progress w-100  bg-main-100 rounded-pill h-8"
                                role="progressbar"
                                aria-label="Basic example"
                                aria-valuenow={10}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              >
                                <div
                                  className="progress-bar bg-main-600 rounded-pill"
                                  style={{ width: "10%" }}
                                />
                              </div>
                            </div>
                            <div className="flex-align gap-8 flex-wrap mt-16">
                              <img
                                src="assets/images/thumbs/user-img4.png"
                                className="w-32 h-32 rounded-circle object-fit-cover"
                                alt="User"
                              />
                              <div>
                                <span className="text-gray-600 text-13">
                                  Created by
                                  <a
                                    href="profile.html"
                                    className="fw-semibold text-gray-700 hover-text-main-600 hover-text-decoration-underline"
                                  >
                                    Albert James
                                  </a>
                                </span>
                                <div className="flex-align gap-4">
                                  <span className="text-15 fw-bold text-warning-600 d-flex">
                                    <i className="ph-fill ph-star" />
                                  </span>
                                  <span className="text-13 fw-bold text-gray-600">
                                    4.9
                                  </span>
                                  <span className="text-13 fw-bold text-gray-600">
                                    (12k)
                                  </span>
                                </div>
                              </div>
                            </div>
                            <a
                              href="live-class.html"
                              className="btn btn-outline-main rounded-pill py-9 w-100 mt-24"
                            >
                              Continue Watching
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="pills-completed"
                  role="tabpanel"
                  aria-labelledby="pills-completed-tab"
                  tabIndex={0}
                >
                  <div className="row g-20">
                    <div className="col-xxl-3 col-lg-4 col-sm-6">
                      <div className="card border border-gray-100">
                        <div className="card-body p-8">
                          <a
                            href="course-details.html"
                            className="bg-main-100 rounded-8 overflow-hidden text-center mb-8 h-164 flex-center p-8"
                          >
                            <img
                              src="assets/images/thumbs/course-img1.png"
                              alt="Course"
                            />
                          </a>
                          <div className="p-8">
                            <span className="text-13 py-2 px-10 rounded-pill bg-success-50 text-success-600 mb-16">
                              Development
                            </span>
                            <h5 className="mb-0">
                              <a
                                href="course-details.html"
                                className="hover-text-main-600"
                              >
                                Full Stack Web Development
                              </a>
                            </h5>
                            <div className="flex-align gap-8 mt-12">
                              <span className="text-main-600 flex-shrink-0 text-13 fw-medium">
                                32%
                              </span>
                              <div
                                className="progress w-100  bg-main-100 rounded-pill h-8"
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
                            </div>
                            <div className="flex-align gap-8 flex-wrap mt-16">
                              <img
                                src="assets/images/thumbs/user-img1.png"
                                className="w-32 h-32 rounded-circle object-fit-cover"
                                alt="User"
                              />
                              <div>
                                <span className="text-gray-600 text-13">
                                  Created by
                                  <a
                                    href="profile.html"
                                    className="fw-semibold text-gray-700 hover-text-main-600 hover-text-decoration-underline"
                                  >
                                    Albert James
                                  </a>
                                </span>
                                <div className="flex-align gap-4">
                                  <span className="text-15 fw-bold text-warning-600 d-flex">
                                    <i className="ph-fill ph-star" />
                                  </span>
                                  <span className="text-13 fw-bold text-gray-600">
                                    4.9
                                  </span>
                                  <span className="text-13 fw-bold text-gray-600">
                                    (12k)
                                  </span>
                                </div>
                              </div>
                            </div>
                            <a
                              href="live-class.html"
                              className="btn btn-outline-main rounded-pill py-9 w-100 mt-24"
                            >
                              Continue Watching
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xxl-3 col-lg-4 col-sm-6">
                      <div className="card border border-gray-100">
                        <div className="card-body p-8">
                          <a
                            href="course-details.html"
                            className="bg-main-100 rounded-8 overflow-hidden text-center mb-8 h-164 flex-center p-8"
                          >
                            <img
                              src="assets/images/thumbs/course-img2.png"
                              alt="Course"
                            />
                          </a>
                          <div className="p-8">
                            <span className="text-13 py-2 px-10 rounded-pill bg-warning-50 text-warning-600 mb-16">
                              Design
                            </span>
                            <h5 className="mb-0">
                              <a
                                href="course-details.html"
                                className="hover-text-main-600"
                              >
                                UI/UX Design Course
                              </a>
                            </h5>
                            <div className="flex-align gap-8 mt-12">
                              <span className="text-main-600 flex-shrink-0 text-13 fw-medium">
                                20%
                              </span>
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
                            <div className="flex-align gap-8 flex-wrap mt-16">
                              <img
                                src="assets/images/thumbs/user-img2.png"
                                className="w-32 h-32 rounded-circle object-fit-cover"
                                alt="User"
                              />
                              <div>
                                <span className="text-gray-600 text-13">
                                  Created by
                                  <a
                                    href="profile.html"
                                    className="fw-semibold text-gray-700 hover-text-main-600 hover-text-decoration-underline"
                                  >
                                    Albert James
                                  </a>
                                </span>
                                <div className="flex-align gap-4">
                                  <span className="text-15 fw-bold text-warning-600 d-flex">
                                    <i className="ph-fill ph-star" />
                                  </span>
                                  <span className="text-13 fw-bold text-gray-600">
                                    4.9
                                  </span>
                                  <span className="text-13 fw-bold text-gray-600">
                                    (12k)
                                  </span>
                                </div>
                              </div>
                            </div>
                            <a
                              href="live-class.html"
                              className="btn btn-outline-main rounded-pill py-9 w-100 mt-24"
                            >
                              Continue Watching
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xxl-3 col-lg-4 col-sm-6">
                      <div className="card border border-gray-100">
                        <div className="card-body p-8">
                          <a
                            href="course-details.html"
                            className="bg-main-100 rounded-8 overflow-hidden text-center mb-8 h-164 flex-center p-8"
                          >
                            <img
                              src="assets/images/thumbs/course-img3.png"
                              alt="Course"
                            />
                          </a>
                          <div className="p-8">
                            <span className="text-13 py-2 px-10 rounded-pill bg-danger-50 text-danger-600 mb-16">
                              Frontend
                            </span>
                            <h5 className="mb-0">
                              <a
                                href="course-details.html"
                                className="hover-text-main-600"
                              >
                                React Native Courese
                              </a>
                            </h5>
                            <div className="flex-align gap-8 mt-12">
                              <span className="text-main-600 flex-shrink-0 text-13 fw-medium">
                                45%
                              </span>
                              <div
                                className="progress w-100  bg-main-100 rounded-pill h-8"
                                role="progressbar"
                                aria-label="Basic example"
                                aria-valuenow={45}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              >
                                <div
                                  className="progress-bar bg-main-600 rounded-pill"
                                  style={{ width: "45%" }}
                                />
                              </div>
                            </div>
                            <div className="flex-align gap-8 flex-wrap mt-16">
                              <img
                                src="assets/images/thumbs/user-img3.png"
                                className="w-32 h-32 rounded-circle object-fit-cover"
                                alt="User"
                              />
                              <div>
                                <span className="text-gray-600 text-13">
                                  Created by
                                  <a
                                    href="profile.html"
                                    className="fw-semibold text-gray-700 hover-text-main-600 hover-text-decoration-underline"
                                  >
                                    Albert James
                                  </a>
                                </span>
                                <div className="flex-align gap-4">
                                  <span className="text-15 fw-bold text-warning-600 d-flex">
                                    <i className="ph-fill ph-star" />
                                  </span>
                                  <span className="text-13 fw-bold text-gray-600">
                                    4.9
                                  </span>
                                  <span className="text-13 fw-bold text-gray-600">
                                    (12k)
                                  </span>
                                </div>
                              </div>
                            </div>
                            <a
                              href="live-class.html"
                              className="btn btn-outline-main rounded-pill py-9 w-100 mt-24"
                            >
                              Continue Watching
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xxl-3 col-lg-4 col-sm-6">
                      <div className="card border border-gray-100">
                        <div className="card-body p-8">
                          <a
                            href="course-details.html"
                            className="bg-main-100 rounded-8 overflow-hidden text-center mb-8 h-164 flex-center p-8"
                          >
                            <img
                              src="assets/images/thumbs/course-img4.png"
                              alt="Course"
                            />
                          </a>
                          <div className="p-8">
                            <span className="text-13 py-2 px-10 rounded-pill bg-info-50 text-info-600 mb-16">
                              Marketing
                            </span>
                            <h5 className="mb-0">
                              <a
                                href="course-details.html"
                                className="hover-text-main-600"
                              >
                                SEO Expert A To Z Course
                              </a>
                            </h5>
                            <div className="flex-align gap-8 mt-12">
                              <span className="text-main-600 flex-shrink-0 text-13 fw-medium">
                                10%
                              </span>
                              <div
                                className="progress w-100  bg-main-100 rounded-pill h-8"
                                role="progressbar"
                                aria-label="Basic example"
                                aria-valuenow={10}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              >
                                <div
                                  className="progress-bar bg-main-600 rounded-pill"
                                  style={{ width: "10%" }}
                                />
                              </div>
                            </div>
                            <div className="flex-align gap-8 flex-wrap mt-16">
                              <img
                                src="assets/images/thumbs/user-img4.png"
                                className="w-32 h-32 rounded-circle object-fit-cover"
                                alt="User"
                              />
                              <div>
                                <span className="text-gray-600 text-13">
                                  Created by
                                  <a
                                    href="profile.html"
                                    className="fw-semibold text-gray-700 hover-text-main-600 hover-text-decoration-underline"
                                  >
                                    Albert James
                                  </a>
                                </span>
                                <div className="flex-align gap-4">
                                  <span className="text-15 fw-bold text-warning-600 d-flex">
                                    <i className="ph-fill ph-star" />
                                  </span>
                                  <span className="text-13 fw-bold text-gray-600">
                                    4.9
                                  </span>
                                  <span className="text-13 fw-bold text-gray-600">
                                    (12k)
                                  </span>
                                </div>
                              </div>
                            </div>
                            <a
                              href="live-class.html"
                              className="btn btn-outline-main rounded-pill py-9 w-100 mt-24"
                            >
                              Continue Watching
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="pills-saved"
                  role="tabpanel"
                  aria-labelledby="pills-saved-tab"
                  tabIndex={0}
                >
                  <div className="row g-20">
                    <div className="col-xxl-3 col-lg-4 col-sm-6">
                      <div className="card border border-gray-100">
                        <div className="card-body p-8">
                          <a
                            href="course-details.html"
                            className="bg-main-100 rounded-8 overflow-hidden text-center mb-8 h-164 flex-center p-8"
                          >
                            <img
                              src="assets/images/thumbs/course-img1.png"
                              alt="Course"
                            />
                          </a>
                          <div className="p-8">
                            <span className="text-13 py-2 px-10 rounded-pill bg-success-50 text-success-600 mb-16">
                              Development
                            </span>
                            <h5 className="mb-0">
                              <a
                                href="course-details.html"
                                className="hover-text-main-600"
                              >
                                Full Stack Web Development
                              </a>
                            </h5>
                            <div className="flex-align gap-8 mt-12">
                              <span className="text-main-600 flex-shrink-0 text-13 fw-medium">
                                32%
                              </span>
                              <div
                                className="progress w-100  bg-main-100 rounded-pill h-8"
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
                            </div>
                            <div className="flex-align gap-8 flex-wrap mt-16">
                              <img
                                src="assets/images/thumbs/user-img1.png"
                                className="w-32 h-32 rounded-circle object-fit-cover"
                                alt="User"
                              />
                              <div>
                                <span className="text-gray-600 text-13">
                                  Created by
                                  <a
                                    href="profile.html"
                                    className="fw-semibold text-gray-700 hover-text-main-600 hover-text-decoration-underline"
                                  >
                                    Albert James
                                  </a>
                                </span>
                                <div className="flex-align gap-4">
                                  <span className="text-15 fw-bold text-warning-600 d-flex">
                                    <i className="ph-fill ph-star" />
                                  </span>
                                  <span className="text-13 fw-bold text-gray-600">
                                    4.9
                                  </span>
                                  <span className="text-13 fw-bold text-gray-600">
                                    (12k)
                                  </span>
                                </div>
                              </div>
                            </div>
                            <a
                              href="live-class.html"
                              className="btn btn-outline-main rounded-pill py-9 w-100 mt-24"
                            >
                              Continue Watching
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xxl-3 col-lg-4 col-sm-6">
                      <div className="card border border-gray-100">
                        <div className="card-body p-8">
                          <a
                            href="course-details.html"
                            className="bg-main-100 rounded-8 overflow-hidden text-center mb-8 h-164 flex-center p-8"
                          >
                            <img
                              src="assets/images/thumbs/course-img2.png"
                              alt="Course"
                            />
                          </a>
                          <div className="p-8">
                            <span className="text-13 py-2 px-10 rounded-pill bg-warning-50 text-warning-600 mb-16">
                              Design
                            </span>
                            <h5 className="mb-0">
                              <a
                                href="course-details.html"
                                className="hover-text-main-600"
                              >
                                UI/UX Design Course
                              </a>
                            </h5>
                            <div className="flex-align gap-8 mt-12">
                              <span className="text-main-600 flex-shrink-0 text-13 fw-medium">
                                20%
                              </span>
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
                            <div className="flex-align gap-8 flex-wrap mt-16">
                              <img
                                src="assets/images/thumbs/user-img2.png"
                                className="w-32 h-32 rounded-circle object-fit-cover"
                                alt="User"
                              />
                              <div>
                                <span className="text-gray-600 text-13">
                                  Created by
                                  <a
                                    href="profile.html"
                                    className="fw-semibold text-gray-700 hover-text-main-600 hover-text-decoration-underline"
                                  >
                                    Albert James
                                  </a>
                                </span>
                                <div className="flex-align gap-4">
                                  <span className="text-15 fw-bold text-warning-600 d-flex">
                                    <i className="ph-fill ph-star" />
                                  </span>
                                  <span className="text-13 fw-bold text-gray-600">
                                    4.9
                                  </span>
                                  <span className="text-13 fw-bold text-gray-600">
                                    (12k)
                                  </span>
                                </div>
                              </div>
                            </div>
                            <a
                              href="live-class.html"
                              className="btn btn-outline-main rounded-pill py-9 w-100 mt-24"
                            >
                              Continue Watching
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xxl-3 col-lg-4 col-sm-6">
                      <div className="card border border-gray-100">
                        <div className="card-body p-8">
                          <a
                            href="course-details.html"
                            className="bg-main-100 rounded-8 overflow-hidden text-center mb-8 h-164 flex-center p-8"
                          >
                            <img
                              src="assets/images/thumbs/course-img3.png"
                              alt="Course"
                            />
                          </a>
                          <div className="p-8">
                            <span className="text-13 py-2 px-10 rounded-pill bg-danger-50 text-danger-600 mb-16">
                              Frontend
                            </span>
                            <h5 className="mb-0">
                              <a
                                href="course-details.html"
                                className="hover-text-main-600"
                              >
                                React Native Courese
                              </a>
                            </h5>
                            <div className="flex-align gap-8 mt-12">
                              <span className="text-main-600 flex-shrink-0 text-13 fw-medium">
                                45%
                              </span>
                              <div
                                className="progress w-100  bg-main-100 rounded-pill h-8"
                                role="progressbar"
                                aria-label="Basic example"
                                aria-valuenow={45}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              >
                                <div
                                  className="progress-bar bg-main-600 rounded-pill"
                                  style={{ width: "45%" }}
                                />
                              </div>
                            </div>
                            <div className="flex-align gap-8 flex-wrap mt-16">
                              <img
                                src="assets/images/thumbs/user-img3.png"
                                className="w-32 h-32 rounded-circle object-fit-cover"
                                alt="User"
                              />
                              <div>
                                <span className="text-gray-600 text-13">
                                  Created by
                                  <a
                                    href="profile.html"
                                    className="fw-semibold text-gray-700 hover-text-main-600 hover-text-decoration-underline"
                                  >
                                    Albert James
                                  </a>
                                </span>
                                <div className="flex-align gap-4">
                                  <span className="text-15 fw-bold text-warning-600 d-flex">
                                    <i className="ph-fill ph-star" />
                                  </span>
                                  <span className="text-13 fw-bold text-gray-600">
                                    4.9
                                  </span>
                                  <span className="text-13 fw-bold text-gray-600">
                                    (12k)
                                  </span>
                                </div>
                              </div>
                            </div>
                            <a
                              href="live-class.html"
                              className="btn btn-outline-main rounded-pill py-9 w-100 mt-24"
                            >
                              Continue Watching
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xxl-3 col-lg-4 col-sm-6">
                      <div className="card border border-gray-100">
                        <div className="card-body p-8">
                          <a
                            href="course-details.html"
                            className="bg-main-100 rounded-8 overflow-hidden text-center mb-8 h-164 flex-center p-8"
                          >
                            <img
                              src="assets/images/thumbs/course-img4.png"
                              alt="Course"
                            />
                          </a>
                          <div className="p-8">
                            <span className="text-13 py-2 px-10 rounded-pill bg-info-50 text-info-600 mb-16">
                              Marketing
                            </span>
                            <h5 className="mb-0">
                              <a
                                href="course-details.html"
                                className="hover-text-main-600"
                              >
                                SEO Expert A To Z Course
                              </a>
                            </h5>
                            <div className="flex-align gap-8 mt-12">
                              <span className="text-main-600 flex-shrink-0 text-13 fw-medium">
                                10%
                              </span>
                              <div
                                className="progress w-100  bg-main-100 rounded-pill h-8"
                                role="progressbar"
                                aria-label="Basic example"
                                aria-valuenow={10}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              >
                                <div
                                  className="progress-bar bg-main-600 rounded-pill"
                                  style={{ width: "10%" }}
                                />
                              </div>
                            </div>
                            <div className="flex-align gap-8 flex-wrap mt-16">
                              <img
                                src="assets/images/thumbs/user-img4.png"
                                className="w-32 h-32 rounded-circle object-fit-cover"
                                alt="User"
                              />
                              <div>
                                <span className="text-gray-600 text-13">
                                  Created by
                                  <a
                                    href="profile.html"
                                    className="fw-semibold text-gray-700 hover-text-main-600 hover-text-decoration-underline"
                                  >
                                    Albert James
                                  </a>
                                </span>
                                <div className="flex-align gap-4">
                                  <span className="text-15 fw-bold text-warning-600 d-flex">
                                    <i className="ph-fill ph-star" />
                                  </span>
                                  <span className="text-13 fw-bold text-gray-600">
                                    4.9
                                  </span>
                                  <span className="text-13 fw-bold text-gray-600">
                                    (12k)
                                  </span>
                                </div>
                              </div>
                            </div>
                            <a
                              href="live-class.html"
                              className="btn btn-outline-main rounded-pill py-9 w-100 mt-24"
                            >
                              Continue Watching
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="pills-favourite"
                  role="tabpanel"
                  aria-labelledby="pills-favourite-tab"
                  tabIndex={0}
                >
                  <div className="row g-20">
                    <div className="col-xxl-3 col-lg-4 col-sm-6">
                      <div className="card border border-gray-100">
                        <div className="card-body p-8">
                          <a
                            href="course-details.html"
                            className="bg-main-100 rounded-8 overflow-hidden text-center mb-8 h-164 flex-center p-8"
                          >
                            <img
                              src="assets/images/thumbs/course-img1.png"
                              alt="Course"
                            />
                          </a>
                          <div className="p-8">
                            <span className="text-13 py-2 px-10 rounded-pill bg-success-50 text-success-600 mb-16">
                              Development
                            </span>
                            <h5 className="mb-0">
                              <a
                                href="course-details.html"
                                className="hover-text-main-600"
                              >
                                Full Stack Web Development
                              </a>
                            </h5>
                            <div className="flex-align gap-8 mt-12">
                              <span className="text-main-600 flex-shrink-0 text-13 fw-medium">
                                32%
                              </span>
                              <div
                                className="progress w-100  bg-main-100 rounded-pill h-8"
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
                            </div>
                            <div className="flex-align gap-8 flex-wrap mt-16">
                              <img
                                src="assets/images/thumbs/user-img1.png"
                                className="w-32 h-32 rounded-circle object-fit-cover"
                                alt="User"
                              />
                              <div>
                                <span className="text-gray-600 text-13">
                                  Created by
                                  <a
                                    href="profile.html"
                                    className="fw-semibold text-gray-700 hover-text-main-600 hover-text-decoration-underline"
                                  >
                                    Albert James
                                  </a>
                                </span>
                                <div className="flex-align gap-4">
                                  <span className="text-15 fw-bold text-warning-600 d-flex">
                                    <i className="ph-fill ph-star" />
                                  </span>
                                  <span className="text-13 fw-bold text-gray-600">
                                    4.9
                                  </span>
                                  <span className="text-13 fw-bold text-gray-600">
                                    (12k)
                                  </span>
                                </div>
                              </div>
                            </div>
                            <a
                              href="live-class.html"
                              className="btn btn-outline-main rounded-pill py-9 w-100 mt-24"
                            >
                              Continue Watching
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xxl-3 col-lg-4 col-sm-6">
                      <div className="card border border-gray-100">
                        <div className="card-body p-8">
                          <a
                            href="course-details.html"
                            className="bg-main-100 rounded-8 overflow-hidden text-center mb-8 h-164 flex-center p-8"
                          >
                            <img
                              src="assets/images/thumbs/course-img2.png"
                              alt="Course"
                            />
                          </a>
                          <div className="p-8">
                            <span className="text-13 py-2 px-10 rounded-pill bg-warning-50 text-warning-600 mb-16">
                              Design
                            </span>
                            <h5 className="mb-0">
                              <a
                                href="course-details.html"
                                className="hover-text-main-600"
                              >
                                UI/UX Design Course
                              </a>
                            </h5>
                            <div className="flex-align gap-8 mt-12">
                              <span className="text-main-600 flex-shrink-0 text-13 fw-medium">
                                20%
                              </span>
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
                            <div className="flex-align gap-8 flex-wrap mt-16">
                              <img
                                src="assets/images/thumbs/user-img2.png"
                                className="w-32 h-32 rounded-circle object-fit-cover"
                                alt="User"
                              />
                              <div>
                                <span className="text-gray-600 text-13">
                                  Created by
                                  <a
                                    href="profile.html"
                                    className="fw-semibold text-gray-700 hover-text-main-600 hover-text-decoration-underline"
                                  >
                                    Albert James
                                  </a>
                                </span>
                                <div className="flex-align gap-4">
                                  <span className="text-15 fw-bold text-warning-600 d-flex">
                                    <i className="ph-fill ph-star" />
                                  </span>
                                  <span className="text-13 fw-bold text-gray-600">
                                    4.9
                                  </span>
                                  <span className="text-13 fw-bold text-gray-600">
                                    (12k)
                                  </span>
                                </div>
                              </div>
                            </div>
                            <a
                              href="live-class.html"
                              className="btn btn-outline-main rounded-pill py-9 w-100 mt-24"
                            >
                              Continue Watching
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xxl-3 col-lg-4 col-sm-6">
                      <div className="card border border-gray-100">
                        <div className="card-body p-8">
                          <a
                            href="course-details.html"
                            className="bg-main-100 rounded-8 overflow-hidden text-center mb-8 h-164 flex-center p-8"
                          >
                            <img
                              src="assets/images/thumbs/course-img3.png"
                              alt="Course"
                            />
                          </a>
                          <div className="p-8">
                            <span className="text-13 py-2 px-10 rounded-pill bg-danger-50 text-danger-600 mb-16">
                              Frontend
                            </span>
                            <h5 className="mb-0">
                              <a
                                href="course-details.html"
                                className="hover-text-main-600"
                              >
                                React Native Courese
                              </a>
                            </h5>
                            <div className="flex-align gap-8 mt-12">
                              <span className="text-main-600 flex-shrink-0 text-13 fw-medium">
                                45%
                              </span>
                              <div
                                className="progress w-100  bg-main-100 rounded-pill h-8"
                                role="progressbar"
                                aria-label="Basic example"
                                aria-valuenow={45}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              >
                                <div
                                  className="progress-bar bg-main-600 rounded-pill"
                                  style={{ width: "45%" }}
                                />
                              </div>
                            </div>
                            <div className="flex-align gap-8 flex-wrap mt-16">
                              <img
                                src="assets/images/thumbs/user-img3.png"
                                className="w-32 h-32 rounded-circle object-fit-cover"
                                alt="User"
                              />
                              <div>
                                <span className="text-gray-600 text-13">
                                  Created by
                                  <a
                                    href="profile.html"
                                    className="fw-semibold text-gray-700 hover-text-main-600 hover-text-decoration-underline"
                                  >
                                    Albert James
                                  </a>
                                </span>
                                <div className="flex-align gap-4">
                                  <span className="text-15 fw-bold text-warning-600 d-flex">
                                    <i className="ph-fill ph-star" />
                                  </span>
                                  <span className="text-13 fw-bold text-gray-600">
                                    4.9
                                  </span>
                                  <span className="text-13 fw-bold text-gray-600">
                                    (12k)
                                  </span>
                                </div>
                              </div>
                            </div>
                            <a
                              href="live-class.html"
                              className="btn btn-outline-main rounded-pill py-9 w-100 mt-24"
                            >
                              Continue Watching
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xxl-3 col-lg-4 col-sm-6">
                      <div className="card border border-gray-100">
                        <div className="card-body p-8">
                          <a
                            href="course-details.html"
                            className="bg-main-100 rounded-8 overflow-hidden text-center mb-8 h-164 flex-center p-8"
                          >
                            <img
                              src="assets/images/thumbs/course-img4.png"
                              alt="Course"
                            />
                          </a>
                          <div className="p-8">
                            <span className="text-13 py-2 px-10 rounded-pill bg-info-50 text-info-600 mb-16">
                              Marketing
                            </span>
                            <h5 className="mb-0">
                              <a
                                href="course-details.html"
                                className="hover-text-main-600"
                              >
                                SEO Expert A To Z Course
                              </a>
                            </h5>
                            <div className="flex-align gap-8 mt-12">
                              <span className="text-main-600 flex-shrink-0 text-13 fw-medium">
                                10%
                              </span>
                              <div
                                className="progress w-100  bg-main-100 rounded-pill h-8"
                                role="progressbar"
                                aria-label="Basic example"
                                aria-valuenow={10}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              >
                                <div
                                  className="progress-bar bg-main-600 rounded-pill"
                                  style={{ width: "10%" }}
                                />
                              </div>
                            </div>
                            <div className="flex-align gap-8 flex-wrap mt-16">
                              <img
                                src="assets/images/thumbs/user-img4.png"
                                className="w-32 h-32 rounded-circle object-fit-cover"
                                alt="User"
                              />
                              <div>
                                <span className="text-gray-600 text-13">
                                  Created by
                                  <a
                                    href="profile.html"
                                    className="fw-semibold text-gray-700 hover-text-main-600 hover-text-decoration-underline"
                                  >
                                    Albert James
                                  </a>
                                </span>
                                <div className="flex-align gap-4">
                                  <span className="text-15 fw-bold text-warning-600 d-flex">
                                    <i className="ph-fill ph-star" />
                                  </span>
                                  <span className="text-13 fw-bold text-gray-600">
                                    4.9
                                  </span>
                                  <span className="text-13 fw-bold text-gray-600">
                                    (12k)
                                  </span>
                                </div>
                              </div>
                            </div>
                            <a
                              href="live-class.html"
                              className="btn btn-outline-main rounded-pill py-9 w-100 mt-24"
                            >
                              Continue Watching
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Course Tab End */}
          {/* Recommended Course Start */}
          <div className="card mt-24">
            <div className="card-body">
              <div className="mb-20 flex-between flex-wrap gap-8">
                <h4 className="mb-0">Recommended For You</h4>
                <div className="flex-align gap-8 flex-wrap">
                  <div className="flex-align text-gray-500 text-13 border border-gray-100 rounded-4 ps-8 focus-border-main-600">
                    <span className="text-lg">
                      <i className="ph ph-layout" />
                    </span>
                    <select className="form-control px-8 py-12 border-0 text-inherit rounded-4 text-center">
                      <option value={1} selected disabled>
                        Category
                      </option>
                      <option value={1}>Web</option>
                      <option value={1}>Design</option>
                      <option value={1}>App</option>
                      <option value={1}>SEO</option>
                    </select>
                  </div>
                  <div className="position-relative text-gray-500 flex-align gap-4 text-13">
                    <span className="text-inherit">Sort by: </span>
                    <div className="flex-align text-gray-500 text-13 border border-gray-100 rounded-4 ps-8 focus-border-main-600">
                      <span className="text-lg">
                        <i className="ph ph-funnel-simple" />
                      </span>
                      <select className="form-control px-8 py-12 border-0 text-inherit rounded-4 text-center">
                        <option value={1} selected>
                          Popular
                        </option>
                        <option value={1}>Latest</option>
                        <option value={1}>Trending</option>
                        <option value={1}>Matches</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row g-20">
                <div className="col-xxl-3 col-lg-4 col-sm-6">
                  <div className="card border border-gray-100">
                    <div className="card-body p-8">
                      <a
                        href="course-details.html"
                        className="bg-main-100 rounded-8 overflow-hidden text-center mb-8 h-164 flex-center p-8"
                      >
                        <img
                          src="assets/images/thumbs/course-img1.png"
                          alt="Course"
                        />
                      </a>
                      <div className="p-8">
                        <span className="text-13 py-2 px-10 rounded-pill bg-success-50 text-success-600 mb-16">
                          Development
                        </span>
                        <h5 className="mb-0">
                          <a
                            href="course-details.html"
                            className="hover-text-main-600"
                          >
                            Full Stack Web Development
                          </a>
                        </h5>
                        <div className="flex-align gap-8 flex-wrap mt-16">
                          <img
                            src="assets/images/thumbs/user-img1.png"
                            className="w-28 h-28 rounded-circle object-fit-cover"
                            alt="User"
                          />
                          <div>
                            <span className="text-gray-600 text-13">
                              Created by
                              <a
                                href="profile.html"
                                className="fw-semibold text-gray-700 hover-text-main-600 hover-text-decoration-underline"
                              >
                                Albert James
                              </a>
                            </span>
                          </div>
                        </div>
                        <div className="flex-align gap-8 mt-12 pt-12 border-top border-gray-100">
                          <div className="flex-align gap-4">
                            <span className="text-sm text-main-600 d-flex">
                              <i className="ph ph-video-camera" />
                            </span>
                            <span className="text-13 text-gray-600">
                              24 Lesson
                            </span>
                          </div>
                          <div className="flex-align gap-4">
                            <span className="text-sm text-main-600 d-flex">
                              <i className="ph ph-clock" />
                            </span>
                            <span className="text-13 text-gray-600">
                              40 Hours
                            </span>
                          </div>
                        </div>
                        <div className="flex-between gap-4 flex-wrap mt-24">
                          <div className="flex-align gap-4">
                            <span className="text-15 fw-bold text-warning-600 d-flex">
                              <i className="ph-fill ph-star" />
                            </span>
                            <span className="text-13 fw-bold text-gray-600">
                              4.9
                            </span>
                            <span className="text-13 fw-bold text-gray-600">
                              (12k)
                            </span>
                          </div>
                          <a
                            href="course-details.html"
                            className="btn btn-outline-main rounded-pill py-9"
                          >
                            View Details
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-sm-6">
                  <div className="card border border-gray-100">
                    <div className="card-body p-8">
                      <a
                        href="course-details.html"
                        className="bg-main-100 rounded-8 overflow-hidden text-center mb-8 h-164 flex-center p-8"
                      >
                        <img
                          src="assets/images/thumbs/course-img5.png"
                          alt="Course"
                        />
                      </a>
                      <div className="p-8">
                        <span className="text-13 py-2 px-10 rounded-pill bg-warning-50 text-warning-600 mb-16">
                          Design
                        </span>
                        <h5 className="mb-0">
                          <a
                            href="course-details.html"
                            className="hover-text-main-600"
                          >
                            Design System
                          </a>
                        </h5>
                        <div className="flex-align gap-8 flex-wrap mt-16">
                          <img
                            src="assets/images/thumbs/user-img5.png"
                            className="w-28 h-28 rounded-circle object-fit-cover"
                            alt="User"
                          />
                          <div>
                            <span className="text-gray-600 text-13">
                              Created by
                              <a
                                href="profile.html"
                                className="fw-semibold text-gray-700 hover-text-main-600 hover-text-decoration-underline"
                              >
                                Albert James
                              </a>
                            </span>
                          </div>
                        </div>
                        <div className="flex-align gap-8 mt-12 pt-12 border-top border-gray-100">
                          <div className="flex-align gap-4">
                            <span className="text-sm text-main-600 d-flex">
                              <i className="ph ph-video-camera" />
                            </span>
                            <span className="text-13 text-gray-600">
                              24 Lesson
                            </span>
                          </div>
                          <div className="flex-align gap-4">
                            <span className="text-sm text-main-600 d-flex">
                              <i className="ph ph-clock" />
                            </span>
                            <span className="text-13 text-gray-600">
                              40 Hours
                            </span>
                          </div>
                        </div>
                        <div className="flex-between gap-4 flex-wrap mt-24">
                          <div className="flex-align gap-4">
                            <span className="text-15 fw-bold text-warning-600 d-flex">
                              <i className="ph-fill ph-star" />
                            </span>
                            <span className="text-13 fw-bold text-gray-600">
                              4.9
                            </span>
                            <span className="text-13 fw-bold text-gray-600">
                              (12k)
                            </span>
                          </div>
                          <a
                            href="course-details.html"
                            className="btn btn-outline-main rounded-pill py-9"
                          >
                            View Details
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-sm-6">
                  <div className="card border border-gray-100">
                    <div className="card-body p-8">
                      <a
                        href="course-details.html"
                        className="bg-main-100 rounded-8 overflow-hidden text-center mb-8 h-164 flex-center p-8"
                      >
                        <img
                          src="assets/images/thumbs/course-img6.png"
                          alt="Course"
                        />
                      </a>
                      <div className="p-8">
                        <span className="text-13 py-2 px-10 rounded-pill bg-danger-50 text-danger-600 mb-16">
                          Frontend
                        </span>
                        <h5 className="mb-0">
                          <a
                            href="course-details.html"
                            className="hover-text-main-600"
                          >
                            React Native Courese
                          </a>
                        </h5>
                        <div className="flex-align gap-8 flex-wrap mt-16">
                          <img
                            src="assets/images/thumbs/user-img6.png"
                            className="w-28 h-28 rounded-circle object-fit-cover"
                            alt="User"
                          />
                          <div>
                            <span className="text-gray-600 text-13">
                              Created by
                              <a
                                href="profile.html"
                                className="fw-semibold text-gray-700 hover-text-main-600 hover-text-decoration-underline"
                              >
                                Albert James
                              </a>
                            </span>
                          </div>
                        </div>
                        <div className="flex-align gap-8 mt-12 pt-12 border-top border-gray-100">
                          <div className="flex-align gap-4">
                            <span className="text-sm text-main-600 d-flex">
                              <i className="ph ph-video-camera" />
                            </span>
                            <span className="text-13 text-gray-600">
                              24 Lesson
                            </span>
                          </div>
                          <div className="flex-align gap-4">
                            <span className="text-sm text-main-600 d-flex">
                              <i className="ph ph-clock" />
                            </span>
                            <span className="text-13 text-gray-600">
                              40 Hours
                            </span>
                          </div>
                        </div>
                        <div className="flex-between gap-4 flex-wrap mt-24">
                          <div className="flex-align gap-4">
                            <span className="text-15 fw-bold text-warning-600 d-flex">
                              <i className="ph-fill ph-star" />
                            </span>
                            <span className="text-13 fw-bold text-gray-600">
                              4.9
                            </span>
                            <span className="text-13 fw-bold text-gray-600">
                              (12k)
                            </span>
                          </div>
                          <a
                            href="course-details.html"
                            className="btn btn-outline-main rounded-pill py-9"
                          >
                            View Details
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-sm-6">
                  <div className="card border border-gray-100">
                    <div className="card-body p-8">
                      <a
                        href="course-details.html"
                        className="bg-main-100 rounded-8 overflow-hidden text-center mb-8 h-164 flex-center p-8"
                      >
                        <img
                          src="assets/images/thumbs/course-img4.png"
                          alt="Course"
                        />
                      </a>
                      <div className="p-8">
                        <span className="text-13 py-2 px-10 rounded-pill bg-info-50 text-info-600 mb-16">
                          SEO
                        </span>
                        <h5 className="mb-0">
                          <a
                            href="course-details.html"
                            className="hover-text-main-600"
                          >
                            Search Engine Optimization
                          </a>
                        </h5>
                        <div className="flex-align gap-8 flex-wrap mt-16">
                          <img
                            src="assets/images/thumbs/user-img4.png"
                            className="w-28 h-28 rounded-circle object-fit-cover"
                            alt="User"
                          />
                          <div>
                            <span className="text-gray-600 text-13">
                              Created by
                              <a
                                href="profile.html"
                                className="fw-semibold text-gray-700 hover-text-main-600 hover-text-decoration-underline"
                              >
                                Albert James
                              </a>
                            </span>
                          </div>
                        </div>
                        <div className="flex-align gap-8 mt-12 pt-12 border-top border-gray-100">
                          <div className="flex-align gap-4">
                            <span className="text-sm text-main-600 d-flex">
                              <i className="ph ph-video-camera" />
                            </span>
                            <span className="text-13 text-gray-600">
                              24 Lesson
                            </span>
                          </div>
                          <div className="flex-align gap-4">
                            <span className="text-sm text-main-600 d-flex">
                              <i className="ph ph-clock" />
                            </span>
                            <span className="text-13 text-gray-600">
                              40 Hours
                            </span>
                          </div>
                        </div>
                        <div className="flex-between gap-4 flex-wrap mt-24">
                          <div className="flex-align gap-4">
                            <span className="text-15 fw-bold text-warning-600 d-flex">
                              <i className="ph-fill ph-star" />
                            </span>
                            <span className="text-13 fw-bold text-gray-600">
                              4.9
                            </span>
                            <span className="text-13 fw-bold text-gray-600">
                              (12k)
                            </span>
                          </div>
                          <a
                            href="course-details.html"
                            className="btn btn-outline-main rounded-pill py-9"
                          >
                            View Details
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-sm-6">
                  <div className="card border border-gray-100">
                    <div className="card-body p-8">
                      <a
                        href="course-details.html"
                        className="bg-main-100 rounded-8 overflow-hidden text-center mb-8 h-164 flex-center p-8"
                      >
                        <img
                          src="assets/images/thumbs/course-img3.png"
                          alt="Course"
                        />
                      </a>
                      <div className="p-8">
                        <span className="text-13 py-2 px-10 rounded-pill bg-info-50 text-info-600 mb-16">
                          Development
                        </span>
                        <h5 className="mb-0">
                          <a
                            href="course-details.html"
                            className="hover-text-main-600"
                          >
                            React Js
                          </a>
                        </h5>
                        <div className="flex-align gap-8 flex-wrap mt-16">
                          <img
                            src="assets/images/thumbs/user-img3.png"
                            className="w-28 h-28 rounded-circle object-fit-cover"
                            alt="User"
                          />
                          <div>
                            <span className="text-gray-600 text-13">
                              Created by
                              <a
                                href="profile.html"
                                className="fw-semibold text-gray-700 hover-text-main-600 hover-text-decoration-underline"
                              >
                                Albert James
                              </a>
                            </span>
                          </div>
                        </div>
                        <div className="flex-align gap-8 mt-12 pt-12 border-top border-gray-100">
                          <div className="flex-align gap-4">
                            <span className="text-sm text-main-600 d-flex">
                              <i className="ph ph-video-camera" />
                            </span>
                            <span className="text-13 text-gray-600">
                              24 Lesson
                            </span>
                          </div>
                          <div className="flex-align gap-4">
                            <span className="text-sm text-main-600 d-flex">
                              <i className="ph ph-clock" />
                            </span>
                            <span className="text-13 text-gray-600">
                              40 Hours
                            </span>
                          </div>
                        </div>
                        <div className="flex-between gap-4 flex-wrap mt-24">
                          <div className="flex-align gap-4">
                            <span className="text-15 fw-bold text-warning-600 d-flex">
                              <i className="ph-fill ph-star" />
                            </span>
                            <span className="text-13 fw-bold text-gray-600">
                              4.9
                            </span>
                            <span className="text-13 fw-bold text-gray-600">
                              (12k)
                            </span>
                          </div>
                          <a
                            href="course-details.html"
                            className="btn btn-outline-main rounded-pill py-9"
                          >
                            View Details
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-sm-6">
                  <div className="card border border-gray-100">
                    <div className="card-body p-8">
                      <a
                        href="course-details.html"
                        className="bg-main-100 rounded-8 overflow-hidden text-center mb-8 h-164 flex-center p-8"
                      >
                        <img
                          src="assets/images/thumbs/course-img7.png"
                          alt="Course"
                        />
                      </a>
                      <div className="p-8">
                        <span className="text-13 py-2 px-10 rounded-pill bg-warning-50 text-warning-600 mb-16">
                          Codning
                        </span>
                        <h5 className="mb-0">
                          <a
                            href="course-details.html"
                            className="hover-text-main-600"
                          >
                            WordPress Development
                          </a>
                        </h5>
                        <div className="flex-align gap-8 flex-wrap mt-16">
                          <img
                            src="assets/images/thumbs/user-img7.png"
                            className="w-28 h-28 rounded-circle object-fit-cover"
                            alt="User"
                          />
                          <div>
                            <span className="text-gray-600 text-13">
                              Created by
                              <a
                                href="profile.html"
                                className="fw-semibold text-gray-700 hover-text-main-600 hover-text-decoration-underline"
                              >
                                Albert James
                              </a>
                            </span>
                          </div>
                        </div>
                        <div className="flex-align gap-8 mt-12 pt-12 border-top border-gray-100">
                          <div className="flex-align gap-4">
                            <span className="text-sm text-main-600 d-flex">
                              <i className="ph ph-video-camera" />
                            </span>
                            <span className="text-13 text-gray-600">
                              24 Lesson
                            </span>
                          </div>
                          <div className="flex-align gap-4">
                            <span className="text-sm text-main-600 d-flex">
                              <i className="ph ph-clock" />
                            </span>
                            <span className="text-13 text-gray-600">
                              40 Hours
                            </span>
                          </div>
                        </div>
                        <div className="flex-between gap-4 flex-wrap mt-24">
                          <div className="flex-align gap-4">
                            <span className="text-15 fw-bold text-warning-600 d-flex">
                              <i className="ph-fill ph-star" />
                            </span>
                            <span className="text-13 fw-bold text-gray-600">
                              4.9
                            </span>
                            <span className="text-13 fw-bold text-gray-600">
                              (12k)
                            </span>
                          </div>
                          <a
                            href="course-details.html"
                            className="btn btn-outline-main rounded-pill py-9"
                          >
                            View Details
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-sm-6">
                  <div className="card border border-gray-100">
                    <div className="card-body p-8">
                      <a
                        href="course-details.html"
                        className="bg-main-100 rounded-8 overflow-hidden text-center mb-8 h-164 flex-center p-8"
                      >
                        <img
                          src="assets/images/thumbs/course-img8.png"
                          alt="Course"
                        />
                      </a>
                      <div className="p-8">
                        <span className="text-13 py-2 px-10 rounded-pill bg-success-50 text-success-600 mb-16">
                          Writing
                        </span>
                        <h5 className="mb-0">
                          <a
                            href="course-details.html"
                            className="hover-text-main-600"
                          >
                            Content Writing
                          </a>
                        </h5>
                        <div className="flex-align gap-8 flex-wrap mt-16">
                          <img
                            src="assets/images/thumbs/user-img8.png"
                            className="w-28 h-28 rounded-circle object-fit-cover"
                            alt="User"
                          />
                          <div>
                            <span className="text-gray-600 text-13">
                              Created by
                              <a
                                href="profile.html"
                                className="fw-semibold text-gray-700 hover-text-main-600 hover-text-decoration-underline"
                              >
                                Albert James
                              </a>
                            </span>
                          </div>
                        </div>
                        <div className="flex-align gap-8 mt-12 pt-12 border-top border-gray-100">
                          <div className="flex-align gap-4">
                            <span className="text-sm text-main-600 d-flex">
                              <i className="ph ph-video-camera" />
                            </span>
                            <span className="text-13 text-gray-600">
                              24 Lesson
                            </span>
                          </div>
                          <div className="flex-align gap-4">
                            <span className="text-sm text-main-600 d-flex">
                              <i className="ph ph-clock" />
                            </span>
                            <span className="text-13 text-gray-600">
                              40 Hours
                            </span>
                          </div>
                        </div>
                        <div className="flex-between gap-4 flex-wrap mt-24">
                          <div className="flex-align gap-4">
                            <span className="text-15 fw-bold text-warning-600 d-flex">
                              <i className="ph-fill ph-star" />
                            </span>
                            <span className="text-13 fw-bold text-gray-600">
                              4.9
                            </span>
                            <span className="text-13 fw-bold text-gray-600">
                              (12k)
                            </span>
                          </div>
                          <a
                            href="course-details.html"
                            className="btn btn-outline-main rounded-pill py-9"
                          >
                            View Details
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-sm-6">
                  <div className="card border border-gray-100">
                    <div className="card-body p-8">
                      <a
                        href="course-details.html"
                        className="bg-main-100 rounded-8 overflow-hidden text-center mb-8 h-164 flex-center p-8"
                      >
                        <img
                          src="assets/images/thumbs/course-img9.png"
                          alt="Course"
                        />
                      </a>
                      <div className="p-8">
                        <span className="text-13 py-2 px-10 rounded-pill bg-purple-50 text-purple-600 mb-16">
                          AI Solution
                        </span>
                        <h5 className="mb-0">
                          <a
                            href="course-details.html"
                            className="hover-text-main-600"
                          >
                            Artificial Inteligence
                          </a>
                        </h5>
                        <div className="flex-align gap-8 flex-wrap mt-16">
                          <img
                            src="assets/images/thumbs/user-img9.png"
                            className="w-28 h-28 rounded-circle object-fit-cover"
                            alt="User"
                          />
                          <div>
                            <span className="text-gray-600 text-13">
                              Created by
                              <a
                                href="profile.html"
                                className="fw-semibold text-gray-700 hover-text-main-600 hover-text-decoration-underline"
                              >
                                Albert James
                              </a>
                            </span>
                          </div>
                        </div>
                        <div className="flex-align gap-8 mt-12 pt-12 border-top border-gray-100">
                          <div className="flex-align gap-4">
                            <span className="text-sm text-main-600 d-flex">
                              <i className="ph ph-video-camera" />
                            </span>
                            <span className="text-13 text-gray-600">
                              24 Lesson
                            </span>
                          </div>
                          <div className="flex-align gap-4">
                            <span className="text-sm text-main-600 d-flex">
                              <i className="ph ph-clock" />
                            </span>
                            <span className="text-13 text-gray-600">
                              40 Hours
                            </span>
                          </div>
                        </div>
                        <div className="flex-between gap-4 flex-wrap mt-24">
                          <div className="flex-align gap-4">
                            <span className="text-15 fw-bold text-warning-600 d-flex">
                              <i className="ph-fill ph-star" />
                            </span>
                            <span className="text-13 fw-bold text-gray-600">
                              4.9
                            </span>
                            <span className="text-13 fw-bold text-gray-600">
                              (12k)
                            </span>
                          </div>
                          <a
                            href="course-details.html"
                            className="btn btn-outline-main rounded-pill py-9"
                          >
                            View Details
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-between flex-wrap gap-8 mt-20">
                <a
                  href="/#"
                  className="btn btn-outline-gray rounded-pill py-9 flex-align gap-4"
                >
                  <span className="d-flex text-xl">
                    <i className="ph ph-arrow-left" />
                  </span>
                  Previous
                </a>
                <ul className="pagination flex-align flex-wrap">
                  <li className="page-item active">
                    <a
                      className="page-link h-44 w-44 flex-center text-15 rounded-8 fw-medium"
                      href="/#"
                    >
                      1
                    </a>
                  </li>
                  <li className="page-item">
                    <a
                      className="page-link h-44 w-44 flex-center text-15 rounded-8 fw-medium"
                      href="/#"
                    >
                      2
                    </a>
                  </li>
                  <li className="page-item">
                    <a
                      className="page-link h-44 w-44 flex-center text-15 rounded-8 fw-medium"
                      href="/#"
                    >
                      3
                    </a>
                  </li>
                  <li className="page-item">
                    <a
                      className="page-link h-44 w-44 flex-center text-15 rounded-8 fw-medium"
                      href="/#"
                    >
                      ...
                    </a>
                  </li>
                  <li className="page-item">
                    <a
                      className="page-link h-44 w-44 flex-center text-15 rounded-8 fw-medium"
                      href="/#"
                    >
                      8
                    </a>
                  </li>
                  <li className="page-item">
                    <a
                      className="page-link h-44 w-44 flex-center text-15 rounded-8 fw-medium"
                      href="/#"
                    >
                      9
                    </a>
                  </li>
                  <li className="page-item">
                    <a
                      className="page-link h-44 w-44 flex-center text-15 rounded-8 fw-medium"
                      href="/#"
                    >
                      10
                    </a>
                  </li>
                </ul>
                <a
                  href="/#"
                  className="btn btn-outline-main rounded-pill py-9 flex-align gap-4"
                >
                  Next
                  <span className="d-flex text-xl">
                    <i className="ph ph-arrow-right" />
                  </span>
                </a>
              </div>
            </div>
          </div>
          {/* Recommended Course End */}
        </div>
        <Footer />
      </div>
    </>
  );
}

export default StudentCourse;
