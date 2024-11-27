import React from "react";
import Sidebar from "../../common/sidebar";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";

function Mentor() {
  return (
    <>
      {/*==================== Preloader Start ====================*/}
      <div className="preloader">
        <div className="loader" />
      </div>
      {/*==================== Preloader End ====================*/}
      <Sidebar />
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
                <span className="text-main-600 fw-normal text-15">Mentors</span>
              </li>
            </ul>
          </div>
          {/* Breadcrumb End */}
          {/* Recent Mentors Start */}
          <div className="card mt-24">
            <div className="card-body">
              <h4 className="mb-20">Recent Mentors</h4>
              <div className="row g-20">
                <div className="col-xl-3 col-md-4 col-sm-6">
                  <div className="mentor-card rounded-8 overflow-hidden">
                    <div className="mentor-card__cover position-relative">
                      <img
                        src="assets/images/thumbs/mentor-cover-img1.png"
                        alt=""
                        className="cover-img"
                      />
                      <button
                        type="button"
                        className="follow-btn py-2 px-8 flex-align gap-4 text-13 fw-medium text-white border border-white rounded-pill position-absolute inset-block-start-0 inset-inline-end-0 mt-8 me-8 transition-1"
                      >
                        <i className="ph ph-plus d-flex" />
                        <span className="text">Follow</span>
                      </button>
                    </div>
                    <div className="mentor-card__content text-center">
                      <div className="w-56 h-56 rounded-circle overflow-hidden border border-white d-inline-block">
                        <a href="setting.html">
                          <img
                            src="assets/images/thumbs/mentor-img1.png"
                            alt=""
                            className="mentor-card__img cover-img"
                          />
                        </a>
                      </div>
                      <h5 className="mb-0">
                        <a href="setting.html">Maria Prova</a>
                      </h5>
                      <span className="text-13 text-gray-500">
                        Content Writer
                      </span>
                      <p className="mt-20 text-gray-600 text-14 text-line-2">
                        Hi, I am Alex Stanton, A doctoral a Oxford University
                        majoring in UI/UX. I have working for 2 years in a local
                        company..
                      </p>
                      <div className="mentor-card__rating mt-20 border border-gray-100 px-8 py-6 rounded-8 flex-between flex-wrap">
                        <div className="flex-align gap-4">
                          <span className="text-15 fw-normal text-main-600 d-flex">
                            <i className="ph-fill ph-book-open" />
                          </span>
                          <span className="text-13 fw-normal text-gray-600">
                            45 Tasks
                          </span>
                        </div>
                        <div className="flex-align gap-4">
                          <span className="text-15 fw-normal text-warning-600 d-flex">
                            <i className="ph-fill ph-star" />
                          </span>
                          <span className="text-13 fw-normal text-gray-600">
                            4.8
                          </span>
                          <span className="text-13 fw-normal text-gray-600">
                            (750 Reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-md-4 col-sm-6">
                  <div className="mentor-card rounded-8 overflow-hidden">
                    <div className="mentor-card__cover position-relative">
                      <img
                        src="assets/images/thumbs/mentor-cover-img2.png"
                        alt=""
                        className="cover-img"
                      />
                      <button
                        type="button"
                        className="follow-btn py-2 px-8 flex-align gap-4 text-13 fw-medium text-white border border-white rounded-pill position-absolute inset-block-start-0 inset-inline-end-0 mt-8 me-8 transition-1"
                      >
                        <i className="ph ph-plus d-flex" />
                        <span className="text">Follow</span>
                      </button>
                    </div>
                    <div className="mentor-card__content text-center">
                      <div className="w-56 h-56 rounded-circle overflow-hidden border border-white d-inline-block">
                        <a href="setting.html">
                          <img
                            src="assets/images/thumbs/mentor-img2.png"
                            alt=""
                            className="mentor-card__img cover-img"
                          />
                        </a>
                      </div>
                      <h5 className="mb-0">
                        <a href="setting.html">Alex John</a>
                      </h5>
                      <span className="text-13 text-gray-500">
                        Web Developer
                      </span>
                      <p className="mt-20 text-gray-600 text-14 text-line-2">
                        Hi, I am Alex Stanton, A doctoral a Oxford University
                        majoring in UI/UX. I have working for 2 years in a local
                        company..
                      </p>
                      <div className="mentor-card__rating mt-20 border border-gray-100 px-8 py-6 rounded-8 flex-between flex-wrap">
                        <div className="flex-align gap-4">
                          <span className="text-15 fw-normal text-main-600 d-flex">
                            <i className="ph-fill ph-book-open" />
                          </span>
                          <span className="text-13 fw-normal text-gray-600">
                            45 Tasks
                          </span>
                        </div>
                        <div className="flex-align gap-4">
                          <span className="text-15 fw-normal text-warning-600 d-flex">
                            <i className="ph-fill ph-star" />
                          </span>
                          <span className="text-13 fw-normal text-gray-600">
                            4.8
                          </span>
                          <span className="text-13 fw-normal text-gray-600">
                            (750 Reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-md-4 col-sm-6">
                  <div className="mentor-card rounded-8 overflow-hidden">
                    <div className="mentor-card__cover position-relative">
                      <img
                        src="assets/images/thumbs/mentor-cover-img3.png"
                        alt=""
                        className="cover-img"
                      />
                      <button
                        type="button"
                        className="follow-btn py-2 px-8 flex-align gap-4 text-13 fw-medium text-white border border-white rounded-pill position-absolute inset-block-start-0 inset-inline-end-0 mt-8 me-8 transition-1"
                      >
                        <i className="ph ph-plus d-flex" />
                        <span className="text">Follow</span>
                      </button>
                    </div>
                    <div className="mentor-card__content text-center">
                      <div className="w-56 h-56 rounded-circle overflow-hidden border border-white d-inline-block">
                        <a href="setting.html">
                          <img
                            src="assets/images/thumbs/mentor-img3.png"
                            alt=""
                            className="mentor-card__img cover-img"
                          />
                        </a>
                      </div>
                      <h5 className="mb-0">
                        <a href="setting.html">Maria Prova</a>
                      </h5>
                      <span className="text-13 text-gray-500">
                        Front-End Developer
                      </span>
                      <p className="mt-20 text-gray-600 text-14 text-line-2">
                        Hi, I am Alex Stanton, A doctoral a Oxford University
                        majoring in UI/UX. I have working for 2 years in a local
                        company..
                      </p>
                      <div className="mentor-card__rating mt-20 border border-gray-100 px-8 py-6 rounded-8 flex-between flex-wrap">
                        <div className="flex-align gap-4">
                          <span className="text-15 fw-normal text-main-600 d-flex">
                            <i className="ph-fill ph-book-open" />
                          </span>
                          <span className="text-13 fw-normal text-gray-600">
                            45 Tasks
                          </span>
                        </div>
                        <div className="flex-align gap-4">
                          <span className="text-15 fw-normal text-warning-600 d-flex">
                            <i className="ph-fill ph-star" />
                          </span>
                          <span className="text-13 fw-normal text-gray-600">
                            4.8
                          </span>
                          <span className="text-13 fw-normal text-gray-600">
                            (750 Reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-md-4 col-sm-6">
                  <div className="mentor-card rounded-8 overflow-hidden">
                    <div className="mentor-card__cover position-relative">
                      <img
                        src="assets/images/thumbs/mentor-cover-img4.png"
                        alt=""
                        className="cover-img"
                      />
                      <button
                        type="button"
                        className="follow-btn py-2 px-8 flex-align gap-4 text-13 fw-medium text-white border border-white rounded-pill position-absolute inset-block-start-0 inset-inline-end-0 mt-8 me-8 transition-1"
                      >
                        <i className="ph ph-plus d-flex" />
                        <span className="text">Follow</span>
                      </button>
                    </div>
                    <div className="mentor-card__content text-center">
                      <div className="w-56 h-56 rounded-circle overflow-hidden border border-white d-inline-block">
                        <a href="setting.html">
                          <img
                            src="assets/images/thumbs/mentor-img4.png"
                            alt=""
                            className="mentor-card__img cover-img"
                          />
                        </a>
                      </div>
                      <h5 className="mb-0">
                        <a href="setting.html">Hawkins</a>
                      </h5>
                      <span className="text-13 text-gray-500">
                        Graphic Designer
                      </span>
                      <p className="mt-20 text-gray-600 text-14 text-line-2">
                        Hi, I am Alex Stanton, A doctoral a Oxford University
                        majoring in UI/UX. I have working for 2 years in a local
                        company..
                      </p>
                      <div className="mentor-card__rating mt-20 border border-gray-100 px-8 py-6 rounded-8 flex-between flex-wrap">
                        <div className="flex-align gap-4">
                          <span className="text-15 fw-normal text-main-600 d-flex">
                            <i className="ph-fill ph-book-open" />
                          </span>
                          <span className="text-13 fw-normal text-gray-600">
                            45 Tasks
                          </span>
                        </div>
                        <div className="flex-align gap-4">
                          <span className="text-15 fw-normal text-warning-600 d-flex">
                            <i className="ph-fill ph-star" />
                          </span>
                          <span className="text-13 fw-normal text-gray-600">
                            4.8
                          </span>
                          <span className="text-13 fw-normal text-gray-600">
                            (750 Reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Recent Mentors End */}
          {/* All Mentors Start */}
          <div className="card mt-24">
            <div className="card-body">
              <div className="mb-20 flex-between flex-wrap gap-8">
                <h4 className="mb-0">All Mentors</h4>
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
                <div className="col-xl-3 col-md-4 col-sm-6">
                  <div className="mentor-card rounded-8 overflow-hidden">
                    <div className="mentor-card__cover position-relative">
                      <img
                        src="assets/images/thumbs/mentor-cover-img5.png"
                        alt=""
                        className="cover-img"
                      />
                      <button
                        type="button"
                        className="follow-btn py-2 px-8 flex-align gap-4 text-13 fw-medium text-white border border-white rounded-pill position-absolute inset-block-start-0 inset-inline-end-0 mt-8 me-8 transition-1"
                      >
                        <i className="ph ph-plus d-flex" />
                        <span className="text">Follow</span>
                      </button>
                    </div>
                    <div className="mentor-card__content text-center">
                      <div className="w-56 h-56 rounded-circle overflow-hidden border border-white d-inline-block">
                        <a href="setting.html">
                          <img
                            src="assets/images/thumbs/mentor-img5.png"
                            alt=""
                            className="mentor-card__img cover-img"
                          />
                        </a>
                      </div>
                      <h5 className="mb-0">
                        <a href="setting.html">Janny Wilson</a>
                      </h5>
                      <span className="text-13 text-gray-500">
                        Product Designer
                      </span>
                      <p className="mt-20 text-gray-600 text-14 text-line-2">
                        Hi, I am Alex Stanton, A doctoral a Oxford University
                        majoring in UI/UX. I have working for 2 years in a local
                        company..
                      </p>
                      <div className="mentor-card__rating mt-20 border border-gray-100 px-8 py-6 rounded-8 flex-between flex-wrap">
                        <div className="flex-align gap-4">
                          <span className="text-15 fw-normal text-main-600 d-flex">
                            <i className="ph-fill ph-book-open" />
                          </span>
                          <span className="text-13 fw-normal text-gray-600">
                            45 Tasks
                          </span>
                        </div>
                        <div className="flex-align gap-4">
                          <span className="text-15 fw-normal text-warning-600 d-flex">
                            <i className="ph-fill ph-star" />
                          </span>
                          <span className="text-13 fw-normal text-gray-600">
                            4.8
                          </span>
                          <span className="text-13 fw-normal text-gray-600">
                            (750 Reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-md-4 col-sm-6">
                  <div className="mentor-card rounded-8 overflow-hidden">
                    <div className="mentor-card__cover position-relative">
                      <img
                        src="assets/images/thumbs/mentor-cover-img6.png"
                        alt=""
                        className="cover-img"
                      />
                      <button
                        type="button"
                        className="follow-btn py-2 px-8 flex-align gap-4 text-13 fw-medium text-white border border-white rounded-pill position-absolute inset-block-start-0 inset-inline-end-0 mt-8 me-8 transition-1"
                      >
                        <i className="ph ph-plus d-flex" />
                        <span className="text">Follow</span>
                      </button>
                    </div>
                    <div className="mentor-card__content text-center">
                      <div className="w-56 h-56 rounded-circle overflow-hidden border border-white d-inline-block">
                        <a href="setting.html">
                          <img
                            src="assets/images/thumbs/mentor-img6.png"
                            alt=""
                            className="mentor-card__img cover-img"
                          />
                        </a>
                      </div>
                      <h5 className="mb-0">
                        <a href="setting.html">Marry Sara</a>
                      </h5>
                      <span className="text-13 text-gray-500">
                        Digital Marketer
                      </span>
                      <p className="mt-20 text-gray-600 text-14 text-line-2">
                        Hi, I am Alex Stanton, A doctoral a Oxford University
                        majoring in UI/UX. I have working for 2 years in a local
                        company..
                      </p>
                      <div className="mentor-card__rating mt-20 border border-gray-100 px-8 py-6 rounded-8 flex-between flex-wrap">
                        <div className="flex-align gap-4">
                          <span className="text-15 fw-normal text-main-600 d-flex">
                            <i className="ph-fill ph-book-open" />
                          </span>
                          <span className="text-13 fw-normal text-gray-600">
                            45 Tasks
                          </span>
                        </div>
                        <div className="flex-align gap-4">
                          <span className="text-15 fw-normal text-warning-600 d-flex">
                            <i className="ph-fill ph-star" />
                          </span>
                          <span className="text-13 fw-normal text-gray-600">
                            4.8
                          </span>
                          <span className="text-13 fw-normal text-gray-600">
                            (750 Reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-md-4 col-sm-6">
                  <div className="mentor-card rounded-8 overflow-hidden">
                    <div className="mentor-card__cover position-relative">
                      <img
                        src="assets/images/thumbs/mentor-cover-img7.png"
                        alt=""
                        className="cover-img"
                      />
                      <button
                        type="button"
                        className="follow-btn py-2 px-8 flex-align gap-4 text-13 fw-medium text-white border border-white rounded-pill position-absolute inset-block-start-0 inset-inline-end-0 mt-8 me-8 transition-1"
                      >
                        <i className="ph ph-plus d-flex" />
                        <span className="text">Follow</span>
                      </button>
                    </div>
                    <div className="mentor-card__content text-center">
                      <div className="w-56 h-56 rounded-circle overflow-hidden border border-white d-inline-block">
                        <a href="setting.html">
                          <img
                            src="assets/images/thumbs/mentor-img7.png"
                            alt=""
                            className="mentor-card__img cover-img"
                          />
                        </a>
                      </div>
                      <h5 className="mb-0">
                        <a href="setting.html">Simon Doe</a>
                      </h5>
                      <span className="text-13 text-gray-500">
                        Web Developer
                      </span>
                      <p className="mt-20 text-gray-600 text-14 text-line-2">
                        Hi, I am Alex Stanton, A doctoral a Oxford University
                        majoring in UI/UX. I have working for 2 years in a local
                        company..
                      </p>
                      <div className="mentor-card__rating mt-20 border border-gray-100 px-8 py-6 rounded-8 flex-between flex-wrap">
                        <div className="flex-align gap-4">
                          <span className="text-15 fw-normal text-main-600 d-flex">
                            <i className="ph-fill ph-book-open" />
                          </span>
                          <span className="text-13 fw-normal text-gray-600">
                            45 Tasks
                          </span>
                        </div>
                        <div className="flex-align gap-4">
                          <span className="text-15 fw-normal text-warning-600 d-flex">
                            <i className="ph-fill ph-star" />
                          </span>
                          <span className="text-13 fw-normal text-gray-600">
                            4.8
                          </span>
                          <span className="text-13 fw-normal text-gray-600">
                            (750 Reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-md-4 col-sm-6">
                  <div className="mentor-card rounded-8 overflow-hidden">
                    <div className="mentor-card__cover position-relative">
                      <img
                        src="assets/images/thumbs/mentor-cover-img8.png"
                        alt=""
                        className="cover-img"
                      />
                      <button
                        type="button"
                        className="follow-btn py-2 px-8 flex-align gap-4 text-13 fw-medium text-white border border-white rounded-pill position-absolute inset-block-start-0 inset-inline-end-0 mt-8 me-8 transition-1"
                      >
                        <i className="ph ph-plus d-flex" />
                        <span className="text">Follow</span>
                      </button>
                    </div>
                    <div className="mentor-card__content text-center">
                      <div className="w-56 h-56 rounded-circle overflow-hidden border border-white d-inline-block">
                        <a href="setting.html">
                          <img
                            src="assets/images/thumbs/mentor-img8.png"
                            alt=""
                            className="mentor-card__img cover-img"
                          />
                        </a>
                      </div>
                      <h5 className="mb-0">
                        <a href="setting.html">Zara Any</a>
                      </h5>
                      <span className="text-13 text-gray-500">
                        Web Developer
                      </span>
                      <p className="mt-20 text-gray-600 text-14 text-line-2">
                        Hi, I am Alex Stanton, A doctoral a Oxford University
                        majoring in UI/UX. I have working for 2 years in a local
                        company..
                      </p>
                      <div className="mentor-card__rating mt-20 border border-gray-100 px-8 py-6 rounded-8 flex-between flex-wrap">
                        <div className="flex-align gap-4">
                          <span className="text-15 fw-normal text-main-600 d-flex">
                            <i className="ph-fill ph-book-open" />
                          </span>
                          <span className="text-13 fw-normal text-gray-600">
                            45 Tasks
                          </span>
                        </div>
                        <div className="flex-align gap-4">
                          <span className="text-15 fw-normal text-warning-600 d-flex">
                            <i className="ph-fill ph-star" />
                          </span>
                          <span className="text-13 fw-normal text-gray-600">
                            4.8
                          </span>
                          <span className="text-13 fw-normal text-gray-600">
                            (750 Reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-md-4 col-sm-6">
                  <div className="mentor-card rounded-8 overflow-hidden">
                    <div className="mentor-card__cover position-relative">
                      <img
                        src="assets/images/thumbs/mentor-cover-img9.png"
                        alt=""
                        className="cover-img"
                      />
                      <button
                        type="button"
                        className="follow-btn py-2 px-8 flex-align gap-4 text-13 fw-medium text-white border border-white rounded-pill position-absolute inset-block-start-0 inset-inline-end-0 mt-8 me-8 transition-1"
                      >
                        <i className="ph ph-plus d-flex" />
                        <span className="text">Follow</span>
                      </button>
                    </div>
                    <div className="mentor-card__content text-center">
                      <div className="w-56 h-56 rounded-circle overflow-hidden border border-white d-inline-block">
                        <a href="setting.html">
                          <img
                            src="assets/images/thumbs/mentor-img9.png"
                            alt=""
                            className="mentor-card__img cover-img"
                          />
                        </a>
                      </div>
                      <h5 className="mb-0">
                        <a href="setting.html">John Smith</a>
                      </h5>
                      <span className="text-13 text-gray-500">
                        Web Developer
                      </span>
                      <p className="mt-20 text-gray-600 text-14 text-line-2">
                        Hi, I am Alex Stanton, A doctoral a Oxford University
                        majoring in UI/UX. I have working for 2 years in a local
                        company..
                      </p>
                      <div className="mentor-card__rating mt-20 border border-gray-100 px-8 py-6 rounded-8 flex-between flex-wrap">
                        <div className="flex-align gap-4">
                          <span className="text-15 fw-normal text-main-600 d-flex">
                            <i className="ph-fill ph-book-open" />
                          </span>
                          <span className="text-13 fw-normal text-gray-600">
                            45 Tasks
                          </span>
                        </div>
                        <div className="flex-align gap-4">
                          <span className="text-15 fw-normal text-warning-600 d-flex">
                            <i className="ph-fill ph-star" />
                          </span>
                          <span className="text-13 fw-normal text-gray-600">
                            4.8
                          </span>
                          <span className="text-13 fw-normal text-gray-600">
                            (750 Reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-md-4 col-sm-6">
                  <div className="mentor-card rounded-8 overflow-hidden">
                    <div className="mentor-card__cover position-relative">
                      <img
                        src="assets/images/thumbs/mentor-cover-img10.png"
                        alt=""
                        className="cover-img"
                      />
                      <button
                        type="button"
                        className="follow-btn py-2 px-8 flex-align gap-4 text-13 fw-medium text-white border border-white rounded-pill position-absolute inset-block-start-0 inset-inline-end-0 mt-8 me-8 transition-1"
                      >
                        <i className="ph ph-plus d-flex" />
                        <span className="text">Follow</span>
                      </button>
                    </div>
                    <div className="mentor-card__content text-center">
                      <div className="w-56 h-56 rounded-circle overflow-hidden border border-white d-inline-block">
                        <a href="setting.html">
                          <img
                            src="assets/images/thumbs/mentor-img10.png"
                            alt=""
                            className="mentor-card__img cover-img"
                          />
                        </a>
                      </div>
                      <h5 className="mb-0">
                        <a href="setting.html">Michel Bond</a>
                      </h5>
                      <span className="text-13 text-gray-500">Biologist</span>
                      <p className="mt-20 text-gray-600 text-14 text-line-2">
                        Hi, I am Alex Stanton, A doctoral a Oxford University
                        majoring in UI/UX. I have working for 2 years in a local
                        company..
                      </p>
                      <div className="mentor-card__rating mt-20 border border-gray-100 px-8 py-6 rounded-8 flex-between flex-wrap">
                        <div className="flex-align gap-4">
                          <span className="text-15 fw-normal text-main-600 d-flex">
                            <i className="ph-fill ph-book-open" />
                          </span>
                          <span className="text-13 fw-normal text-gray-600">
                            45 Tasks
                          </span>
                        </div>
                        <div className="flex-align gap-4">
                          <span className="text-15 fw-normal text-warning-600 d-flex">
                            <i className="ph-fill ph-star" />
                          </span>
                          <span className="text-13 fw-normal text-gray-600">
                            4.8
                          </span>
                          <span className="text-13 fw-normal text-gray-600">
                            (750 Reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-md-4 col-sm-6">
                  <div className="mentor-card rounded-8 overflow-hidden">
                    <div className="mentor-card__cover position-relative">
                      <img
                        src="assets/images/thumbs/mentor-cover-img11.png"
                        alt=""
                        className="cover-img"
                      />
                      <button
                        type="button"
                        className="follow-btn py-2 px-8 flex-align gap-4 text-13 fw-medium text-white border border-white rounded-pill position-absolute inset-block-start-0 inset-inline-end-0 mt-8 me-8 transition-1"
                      >
                        <i className="ph ph-plus d-flex" />
                        <span className="text">Follow</span>
                      </button>
                    </div>
                    <div className="mentor-card__content text-center">
                      <div className="w-56 h-56 rounded-circle overflow-hidden border border-white d-inline-block">
                        <a href="setting.html">
                          <img
                            src="assets/images/thumbs/mentor-img11.png"
                            alt=""
                            className="mentor-card__img cover-img"
                          />
                        </a>
                      </div>
                      <h5 className="mb-0">
                        <a href="setting.html">Robert Fox</a>
                      </h5>
                      <span className="text-13 text-gray-500">
                        Content Writer
                      </span>
                      <p className="mt-20 text-gray-600 text-14 text-line-2">
                        Hi, I am Alex Stanton, A doctoral a Oxford University
                        majoring in UI/UX. I have working for 2 years in a local
                        company..
                      </p>
                      <div className="mentor-card__rating mt-20 border border-gray-100 px-8 py-6 rounded-8 flex-between flex-wrap">
                        <div className="flex-align gap-4">
                          <span className="text-15 fw-normal text-main-600 d-flex">
                            <i className="ph-fill ph-book-open" />
                          </span>
                          <span className="text-13 fw-normal text-gray-600">
                            45 Tasks
                          </span>
                        </div>
                        <div className="flex-align gap-4">
                          <span className="text-15 fw-normal text-warning-600 d-flex">
                            <i className="ph-fill ph-star" />
                          </span>
                          <span className="text-13 fw-normal text-gray-600">
                            4.8
                          </span>
                          <span className="text-13 fw-normal text-gray-600">
                            (750 Reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-md-4 col-sm-6">
                  <div className="mentor-card rounded-8 overflow-hidden">
                    <div className="mentor-card__cover position-relative">
                      <img
                        src="assets/images/thumbs/mentor-cover-img12.png"
                        alt=""
                        className="cover-img"
                      />
                      <button
                        type="button"
                        className="follow-btn py-2 px-8 flex-align gap-4 text-13 fw-medium text-white border border-white rounded-pill position-absolute inset-block-start-0 inset-inline-end-0 mt-8 me-8 transition-1"
                      >
                        <i className="ph ph-plus d-flex" />
                        <span className="text">Follow</span>
                      </button>
                    </div>
                    <div className="mentor-card__content text-center">
                      <div className="w-56 h-56 rounded-circle overflow-hidden border border-white d-inline-block">
                        <a href="setting.html">
                          <img
                            src="assets/images/thumbs/mentor-img12.png"
                            alt=""
                            className="mentor-card__img cover-img"
                          />
                        </a>
                      </div>
                      <h5 className="mb-0">
                        <a href="setting.html">Jane Cooper</a>
                      </h5>
                      <span className="text-13 text-gray-500">
                        Web Developer
                      </span>
                      <p className="mt-20 text-gray-600 text-14 text-line-2">
                        Hi, I am Alex Stanton, A doctoral a Oxford University
                        majoring in UI/UX. I have working for 2 years in a local
                        company..
                      </p>
                      <div className="mentor-card__rating mt-20 border border-gray-100 px-8 py-6 rounded-8 flex-between flex-wrap">
                        <div className="flex-align gap-4">
                          <span className="text-15 fw-normal text-main-600 d-flex">
                            <i className="ph-fill ph-book-open" />
                          </span>
                          <span className="text-13 fw-normal text-gray-600">
                            45 Tasks
                          </span>
                        </div>
                        <div className="flex-align gap-4">
                          <span className="text-15 fw-normal text-warning-600 d-flex">
                            <i className="ph-fill ph-star" />
                          </span>
                          <span className="text-13 fw-normal text-gray-600">
                            4.8
                          </span>
                          <span className="text-13 fw-normal text-gray-600">
                            (750 Reviews)
                          </span>
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
          {/* All Mentors End */}
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Mentor;
