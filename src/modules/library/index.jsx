import React from "react";
import Footer from "../../common/footer";
import Sidebar from "../../common/sidebar";
import Header from "../../common/header/Header";

function Library() {
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
                <span className="text-main-600 fw-normal text-15">Library</span>
              </li>
            </ul>
          </div>
          {/* Breadcrumb End */}
          {/* Recommended Start */}
          <div className="card mt-24">
            <div className="card-body">
              <form action="/#" className="search-input-form">
                <div className="search-input">
                  <select className="form-control form-select h6 rounded-4 mb-0 py-6 px-8">
                    <option value selected disabled>
                      Category
                    </option>
                    <option value>Web Development</option>
                    <option value>Web Design</option>
                    <option value>UX/UI Design</option>
                    <option value>SEO</option>
                    <option value>Content Writing</option>
                    <option value>WordPress Development</option>
                  </select>
                </div>
                <div className="search-input">
                  <select className="form-control form-select h6 rounded-4 mb-0 py-6 px-8">
                    <option value selected disabled>
                      Design Level
                    </option>
                    <option value>Authentication</option>
                    <option value>Meta</option>
                    <option value>System</option>
                  </select>
                </div>
                <div className="search-input">
                  <select className="form-control form-select h6 rounded-4 mb-0 py-6 px-8">
                    <option value selected disabled>
                      Duration
                    </option>
                    <option value>1 Hour</option>
                    <option value>2 Hour</option>
                    <option value>3 Hour</option>
                    <option value>4 Hour</option>
                  </select>
                </div>
                <div className="search-input">
                  <select className="form-control form-select h6 rounded-4 mb-0 py-6 px-8">
                    <option value selected disabled>
                      Type
                    </option>
                    <option value>Authentication</option>
                    <option value>Meta</option>
                    <option value>System</option>
                  </select>
                </div>
                <div className="search-input custom--range range-slider px-8">
                  <div id="slider-range" />
                  <div className="custom--range__content mt-4">
                    <input
                      type="text"
                      className="custom--range__prices text-gray-600 text-13 fw-semibold"
                      id="amount"
                      readOnly
                    />
                  </div>
                </div>
                <div className="search-input">
                  <button
                    type="submit"
                    className="btn btn-main rounded-pill py-9 w-100"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
          {/* Recommended End */}
          {/* Recommended Start */}
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
                        className="bg-main-100 rounded-16 overflow-hidden text-center mb-8 h-164 flex-center"
                      >
                        <img
                          src="assets/images/thumbs/library-img1.png"
                          alt="Course"
                          className="cover-img"
                        />
                      </a>
                      <div className="p-8">
                        <span className="text-13 py-2 px-10 rounded-pill bg-success-50 text-success-600 mb-16">
                          Authetication
                        </span>
                        <h5 className="mb-8">
                          <a
                            href="course-details.html"
                            className="hover-text-main-600"
                          >
                            Security Management
                          </a>
                        </h5>
                        <div className="flex-align gap-8">
                          <div className="flex-align gap-4">
                            <span className="text-sm text-main-600 d-flex">
                              <i className="ph ph-clock" />
                            </span>
                            <span className="text-13 text-gray-600">
                              15 min read
                            </span>
                          </div>
                          <div className="flex-align gap-4">
                            <span className="text-sm text-main-600 d-flex">
                              <i className="ph ph-chats-circle" />
                            </span>
                            <span className="text-13 text-gray-600">15K</span>
                          </div>
                        </div>
                        <div className="flex-align gap-8 flex-wrap mt-20">
                          <img
                            src="assets/images/thumbs/user-img1.png"
                            className="w-28 h-28 rounded-circle object-fit-cover"
                            alt="User"
                          />
                          <div>
                            <span className="text-gray-600 text-13">
                              Writer
                              <a
                                href="profile.html"
                                className="fw-semibold text-gray-700 hover-text-main-600 hover-text-decoration-underline"
                              >
                                Albert James
                              </a>
                            </span>
                          </div>
                        </div>
                        <div className="flex-between gap-4 flex-wrap mt-20">
                          <div className="flex-align gap-4">
                            <span className="text-15 fw-bold text-warning-600 d-flex">
                              <i className="ph-fill ph-star" />
                            </span>
                            <span className="text-13 fw-bold text-gray-600">
                              4.8
                            </span>
                            <span className="text-13 fw-bold text-gray-600">
                              (17k)
                            </span>
                          </div>
                          <a
                            href="course-details.html"
                            className="btn btn-outline-main rounded-pill py-9 flex-align gap-4"
                          >
                            Read Now
                            <span className="d-flex text-xl">
                              <i className="ph ph-arrow-right" />
                            </span>
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
                        className="bg-main-100 rounded-16 overflow-hidden text-center mb-8 h-164 flex-center"
                      >
                        <img
                          src="assets/images/thumbs/library-img2.png"
                          alt="Course"
                          className="cover-img"
                        />
                      </a>
                      <div className="p-8">
                        <span className="text-13 py-2 px-10 rounded-pill bg-main-50 text-main-600 mb-16">
                          Meta
                        </span>
                        <h5 className="mb-8">
                          <a
                            href="course-details.html"
                            className="hover-text-main-600"
                          >
                            Meta Verse Method
                          </a>
                        </h5>
                        <div className="flex-align gap-8">
                          <div className="flex-align gap-4">
                            <span className="text-sm text-main-600 d-flex">
                              <i className="ph ph-clock" />
                            </span>
                            <span className="text-13 text-gray-600">
                              15 min read
                            </span>
                          </div>
                          <div className="flex-align gap-4">
                            <span className="text-sm text-main-600 d-flex">
                              <i className="ph ph-chats-circle" />
                            </span>
                            <span className="text-13 text-gray-600">15K</span>
                          </div>
                        </div>
                        <div className="flex-align gap-8 flex-wrap mt-20">
                          <img
                            src="assets/images/thumbs/user-img2.png"
                            className="w-28 h-28 rounded-circle object-fit-cover"
                            alt="User"
                          />
                          <div>
                            <span className="text-gray-600 text-13">
                              Writer
                              <a
                                href="profile.html"
                                className="fw-semibold text-gray-700 hover-text-main-600 hover-text-decoration-underline"
                              >
                                Rober Fox
                              </a>
                            </span>
                          </div>
                        </div>
                        <div className="flex-between gap-4 flex-wrap mt-20">
                          <div className="flex-align gap-4">
                            <span className="text-15 fw-bold text-warning-600 d-flex">
                              <i className="ph-fill ph-star" />
                            </span>
                            <span className="text-13 fw-bold text-gray-600">
                              4.8
                            </span>
                            <span className="text-13 fw-bold text-gray-600">
                              (17k)
                            </span>
                          </div>
                          <a
                            href="course-details.html"
                            className="btn btn-outline-main rounded-pill py-9 flex-align gap-4"
                          >
                            Read Now
                            <span className="d-flex text-xl">
                              <i className="ph ph-arrow-right" />
                            </span>
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
                        className="bg-main-100 rounded-16 overflow-hidden text-center mb-8 h-164 flex-center"
                      >
                        <img
                          src="assets/images/thumbs/library-img3.png"
                          alt="Course"
                          className="cover-img"
                        />
                      </a>
                      <div className="p-8">
                        <span className="text-13 py-2 px-10 rounded-pill bg-warning-50 text-warning-600 mb-16">
                          System
                        </span>
                        <h5 className="mb-8">
                          <a
                            href="course-details.html"
                            className="hover-text-main-600"
                          >
                            Hook Methodology
                          </a>
                        </h5>
                        <div className="flex-align gap-8">
                          <div className="flex-align gap-4">
                            <span className="text-sm text-main-600 d-flex">
                              <i className="ph ph-clock" />
                            </span>
                            <span className="text-13 text-gray-600">
                              15 min read
                            </span>
                          </div>
                          <div className="flex-align gap-4">
                            <span className="text-sm text-main-600 d-flex">
                              <i className="ph ph-chats-circle" />
                            </span>
                            <span className="text-13 text-gray-600">15K</span>
                          </div>
                        </div>
                        <div className="flex-align gap-8 flex-wrap mt-20">
                          <img
                            src="assets/images/thumbs/user-img3.png"
                            className="w-28 h-28 rounded-circle object-fit-cover"
                            alt="User"
                          />
                          <div>
                            <span className="text-gray-600 text-13">
                              Writer
                              <a
                                href="profile.html"
                                className="fw-semibold text-gray-700 hover-text-main-600 hover-text-decoration-underline"
                              >
                                Sara Wilson
                              </a>
                            </span>
                          </div>
                        </div>
                        <div className="flex-between gap-4 flex-wrap mt-20">
                          <div className="flex-align gap-4">
                            <span className="text-15 fw-bold text-warning-600 d-flex">
                              <i className="ph-fill ph-star" />
                            </span>
                            <span className="text-13 fw-bold text-gray-600">
                              4.8
                            </span>
                            <span className="text-13 fw-bold text-gray-600">
                              (17k)
                            </span>
                          </div>
                          <a
                            href="course-details.html"
                            className="btn btn-outline-main rounded-pill py-9 flex-align gap-4"
                          >
                            Read Now
                            <span className="d-flex text-xl">
                              <i className="ph ph-arrow-right" />
                            </span>
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
                        className="bg-main-100 rounded-16 overflow-hidden text-center mb-8 h-164 flex-center"
                      >
                        <img
                          src="assets/images/thumbs/library-img4.png"
                          alt="Course"
                          className="cover-img"
                        />
                      </a>
                      <div className="p-8">
                        <span className="text-13 py-2 px-10 rounded-pill bg-success-50 text-success-600 mb-16">
                          Authetication
                        </span>
                        <h5 className="mb-8">
                          <a
                            href="course-details.html"
                            className="hover-text-main-600"
                          >
                            Security Management
                          </a>
                        </h5>
                        <div className="flex-align gap-8">
                          <div className="flex-align gap-4">
                            <span className="text-sm text-main-600 d-flex">
                              <i className="ph ph-clock" />
                            </span>
                            <span className="text-13 text-gray-600">
                              15 min read
                            </span>
                          </div>
                          <div className="flex-align gap-4">
                            <span className="text-sm text-main-600 d-flex">
                              <i className="ph ph-chats-circle" />
                            </span>
                            <span className="text-13 text-gray-600">15K</span>
                          </div>
                        </div>
                        <div className="flex-align gap-8 flex-wrap mt-20">
                          <img
                            src="assets/images/thumbs/user-img4.png"
                            className="w-28 h-28 rounded-circle object-fit-cover"
                            alt="User"
                          />
                          <div>
                            <span className="text-gray-600 text-13">
                              Writer
                              <a
                                href="profile.html"
                                className="fw-semibold text-gray-700 hover-text-main-600 hover-text-decoration-underline"
                              >
                                Albert James
                              </a>
                            </span>
                          </div>
                        </div>
                        <div className="flex-between gap-4 flex-wrap mt-20">
                          <div className="flex-align gap-4">
                            <span className="text-15 fw-bold text-warning-600 d-flex">
                              <i className="ph-fill ph-star" />
                            </span>
                            <span className="text-13 fw-bold text-gray-600">
                              4.8
                            </span>
                            <span className="text-13 fw-bold text-gray-600">
                              (17k)
                            </span>
                          </div>
                          <a
                            href="course-details.html"
                            className="btn btn-outline-main rounded-pill py-9 flex-align gap-4"
                          >
                            Read Now
                            <span className="d-flex text-xl">
                              <i className="ph ph-arrow-right" />
                            </span>
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
                        className="bg-main-100 rounded-16 overflow-hidden text-center mb-8 h-164 flex-center"
                      >
                        <img
                          src="assets/images/thumbs/library-img5.png"
                          alt="Course"
                          className="cover-img"
                        />
                      </a>
                      <div className="p-8">
                        <span className="text-13 py-2 px-10 rounded-pill bg-success-50 text-success-600 mb-16">
                          Authetication
                        </span>
                        <h5 className="mb-8">
                          <a
                            href="course-details.html"
                            className="hover-text-main-600"
                          >
                            Data Base System
                          </a>
                        </h5>
                        <div className="flex-align gap-8">
                          <div className="flex-align gap-4">
                            <span className="text-sm text-main-600 d-flex">
                              <i className="ph ph-clock" />
                            </span>
                            <span className="text-13 text-gray-600">
                              15 min read
                            </span>
                          </div>
                          <div className="flex-align gap-4">
                            <span className="text-sm text-main-600 d-flex">
                              <i className="ph ph-chats-circle" />
                            </span>
                            <span className="text-13 text-gray-600">15K</span>
                          </div>
                        </div>
                        <div className="flex-align gap-8 flex-wrap mt-20">
                          <img
                            src="assets/images/thumbs/user-img5.png"
                            className="w-28 h-28 rounded-circle object-fit-cover"
                            alt="User"
                          />
                          <div>
                            <span className="text-gray-600 text-13">
                              Writer
                              <a
                                href="profile.html"
                                className="fw-semibold text-gray-700 hover-text-main-600 hover-text-decoration-underline"
                              >
                                Alizabeth Doe
                              </a>
                            </span>
                          </div>
                        </div>
                        <div className="flex-between gap-4 flex-wrap mt-20">
                          <div className="flex-align gap-4">
                            <span className="text-15 fw-bold text-warning-600 d-flex">
                              <i className="ph-fill ph-star" />
                            </span>
                            <span className="text-13 fw-bold text-gray-600">
                              4.8
                            </span>
                            <span className="text-13 fw-bold text-gray-600">
                              (17k)
                            </span>
                          </div>
                          <a
                            href="course-details.html"
                            className="btn btn-outline-main rounded-pill py-9 flex-align gap-4"
                          >
                            Read Now
                            <span className="d-flex text-xl">
                              <i className="ph ph-arrow-right" />
                            </span>
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
                        className="bg-main-100 rounded-16 overflow-hidden text-center mb-8 h-164 flex-center"
                      >
                        <img
                          src="assets/images/thumbs/library-img6.png"
                          alt="Course"
                          className="cover-img"
                        />
                      </a>
                      <div className="p-8">
                        <span className="text-13 py-2 px-10 rounded-pill bg-main-50 text-main-600 mb-16">
                          Meta
                        </span>
                        <h5 className="mb-8">
                          <a
                            href="course-details.html"
                            className="hover-text-main-600"
                          >
                            Design Volt
                          </a>
                        </h5>
                        <div className="flex-align gap-8">
                          <div className="flex-align gap-4">
                            <span className="text-sm text-main-600 d-flex">
                              <i className="ph ph-clock" />
                            </span>
                            <span className="text-13 text-gray-600">
                              15 min read
                            </span>
                          </div>
                          <div className="flex-align gap-4">
                            <span className="text-sm text-main-600 d-flex">
                              <i className="ph ph-chats-circle" />
                            </span>
                            <span className="text-13 text-gray-600">15K</span>
                          </div>
                        </div>
                        <div className="flex-align gap-8 flex-wrap mt-20">
                          <img
                            src="assets/images/thumbs/user-img6.png"
                            className="w-28 h-28 rounded-circle object-fit-cover"
                            alt="User"
                          />
                          <div>
                            <span className="text-gray-600 text-13">
                              Writer
                              <a
                                href="profile.html"
                                className="fw-semibold text-gray-700 hover-text-main-600 hover-text-decoration-underline"
                              >
                                Ronald Edwads
                              </a>
                            </span>
                          </div>
                        </div>
                        <div className="flex-between gap-4 flex-wrap mt-20">
                          <div className="flex-align gap-4">
                            <span className="text-15 fw-bold text-warning-600 d-flex">
                              <i className="ph-fill ph-star" />
                            </span>
                            <span className="text-13 fw-bold text-gray-600">
                              4.8
                            </span>
                            <span className="text-13 fw-bold text-gray-600">
                              (17k)
                            </span>
                          </div>
                          <a
                            href="course-details.html"
                            className="btn btn-outline-main rounded-pill py-9 flex-align gap-4"
                          >
                            Read Now
                            <span className="d-flex text-xl">
                              <i className="ph ph-arrow-right" />
                            </span>
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
                        className="bg-main-100 rounded-16 overflow-hidden text-center mb-8 h-164 flex-center"
                      >
                        <img
                          src="assets/images/thumbs/library-img7.png"
                          alt="Course"
                          className="cover-img"
                        />
                      </a>
                      <div className="p-8">
                        <span className="text-13 py-2 px-10 rounded-pill bg-warning-50 text-warning-600 mb-16">
                          System
                        </span>
                        <h5 className="mb-8">
                          <a
                            href="course-details.html"
                            className="hover-text-main-600"
                          >
                            Printing Design Theory
                          </a>
                        </h5>
                        <div className="flex-align gap-8">
                          <div className="flex-align gap-4">
                            <span className="text-sm text-main-600 d-flex">
                              <i className="ph ph-clock" />
                            </span>
                            <span className="text-13 text-gray-600">
                              15 min read
                            </span>
                          </div>
                          <div className="flex-align gap-4">
                            <span className="text-sm text-main-600 d-flex">
                              <i className="ph ph-chats-circle" />
                            </span>
                            <span className="text-13 text-gray-600">15K</span>
                          </div>
                        </div>
                        <div className="flex-align gap-8 flex-wrap mt-20">
                          <img
                            src="assets/images/thumbs/user-img7.png"
                            className="w-28 h-28 rounded-circle object-fit-cover"
                            alt="User"
                          />
                          <div>
                            <span className="text-gray-600 text-13">
                              Writer
                              <a
                                href="profile.html"
                                className="fw-semibold text-gray-700 hover-text-main-600 hover-text-decoration-underline"
                              >
                                Esther Howard
                              </a>
                            </span>
                          </div>
                        </div>
                        <div className="flex-between gap-4 flex-wrap mt-20">
                          <div className="flex-align gap-4">
                            <span className="text-15 fw-bold text-warning-600 d-flex">
                              <i className="ph-fill ph-star" />
                            </span>
                            <span className="text-13 fw-bold text-gray-600">
                              4.8
                            </span>
                            <span className="text-13 fw-bold text-gray-600">
                              (17k)
                            </span>
                          </div>
                          <a
                            href="course-details.html"
                            className="btn btn-outline-main rounded-pill py-9 flex-align gap-4"
                          >
                            Read Now
                            <span className="d-flex text-xl">
                              <i className="ph ph-arrow-right" />
                            </span>
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
                        className="bg-main-100 rounded-16 overflow-hidden text-center mb-8 h-164 flex-center"
                      >
                        <img
                          src="assets/images/thumbs/library-img8.png"
                          alt="Course"
                          className="cover-img"
                        />
                      </a>
                      <div className="p-8">
                        <span className="text-13 py-2 px-10 rounded-pill bg-success-50 text-success-600 mb-16">
                          Authetication
                        </span>
                        <h5 className="mb-8">
                          <a
                            href="course-details.html"
                            className="hover-text-main-600"
                          >
                            Digital Marketing
                          </a>
                        </h5>
                        <div className="flex-align gap-8">
                          <div className="flex-align gap-4">
                            <span className="text-sm text-main-600 d-flex">
                              <i className="ph ph-clock" />
                            </span>
                            <span className="text-13 text-gray-600">
                              15 min read
                            </span>
                          </div>
                          <div className="flex-align gap-4">
                            <span className="text-sm text-main-600 d-flex">
                              <i className="ph ph-chats-circle" />
                            </span>
                            <span className="text-13 text-gray-600">15K</span>
                          </div>
                        </div>
                        <div className="flex-align gap-8 flex-wrap mt-20">
                          <img
                            src="assets/images/thumbs/user-img8.png"
                            className="w-28 h-28 rounded-circle object-fit-cover"
                            alt="User"
                          />
                          <div>
                            <span className="text-gray-600 text-13">
                              Writer
                              <a
                                href="profile.html"
                                className="fw-semibold text-gray-700 hover-text-main-600 hover-text-decoration-underline"
                              >
                                Jacob Jones
                              </a>
                            </span>
                          </div>
                        </div>
                        <div className="flex-between gap-4 flex-wrap mt-20">
                          <div className="flex-align gap-4">
                            <span className="text-15 fw-bold text-warning-600 d-flex">
                              <i className="ph-fill ph-star" />
                            </span>
                            <span className="text-13 fw-bold text-gray-600">
                              4.8
                            </span>
                            <span className="text-13 fw-bold text-gray-600">
                              (17k)
                            </span>
                          </div>
                          <a
                            href="course-details.html"
                            className="btn btn-outline-main rounded-pill py-9 flex-align gap-4"
                          >
                            Read Now
                            <span className="d-flex text-xl">
                              <i className="ph ph-arrow-right" />
                            </span>
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
          {/* Recommended End */}
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Library;
