import React from "react";
import Sidebar from "../../common/sidebar";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";

function Messages() {
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
                <span className="text-main-600 fw-normal text-15">Message</span>
              </li>
            </ul>
          </div>
          {/* Breadcrumb End */}
          <div className="chart-wrapper d-flex flex-wrap gap-24">
            {/* chat sidebar Start */}
            <div className="card chat-list">
              <div className="card-header py-16 border-bottom border-gray-100">
                <form action="#" className="position-relative">
                  <button
                    type="submit"
                    className="input-icon text-xl d-flex text-gray-600 pointer-event-none"
                  >
                    <i className="ph ph-magnifying-glass" />
                  </button>
                  <input
                    type="text"
                    className="form-control ps-44 h-44 border-gray-100 focus-border-main-600 rounded-pill placeholder-15"
                    placeholder="Search here..."
                  />
                </form>
              </div>
              <div className="card-body p-0">
                <div className="chat-list-wrapper p-24 overflow-y-auto scroll-sm">
                  <div className="chat-list__item flex-between gap-8 cursor-pointer">
                    <div className="d-flex align-items-start gap-16">
                      <div className="position-relative flex-shrink-0">
                        <img
                          src="assets/images/thumbs/avatar-img1.png"
                          alt=""
                          className="w-44 h-44 rounded-circle object-fit-cover flex-shrink-0"
                        />
                        <span className="activation-badge w-12 h-12 border-2 position-absolute inset-block-end-0 inset-inline-end-0" />
                      </div>
                      <div className="d-flex flex-column">
                        <h6 className="text-line-1 text-15 text-gray-400 fw-bold mb-0">
                          Kate Morrison
                        </h6>
                        <span className="text-line-1 text-13 text-gray-200">
                          You: I will send you...
                        </span>
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
                                    className="delete-item-btn py-6 text-15 px-8 hover-bg-gray-50 text-gray-300 w-100 rounded-8 fw-normal text-xs d-block text-start"
                                  >
                                    <span className="text">
                                      <i className="ph ph-user me-4" /> Profile
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
                  <div className="chat-list__item flex-between gap-8 cursor-pointer">
                    <div className="d-flex align-items-start gap-16">
                      <div className="position-relative flex-shrink-0">
                        <img
                          src="assets/images/thumbs/avatar-img2.png"
                          alt=""
                          className="w-44 h-44 rounded-circle object-fit-cover flex-shrink-0"
                        />
                        <span className="activation-badge w-12 h-12 border-2 position-absolute inset-block-end-0 inset-inline-end-0" />
                      </div>
                      <div className="d-flex flex-column">
                        <h6 className="text-line-1 text-15 text-gray-400 fw-bold mb-0">
                          Kate Morrison
                        </h6>
                        <span className="text-line-1 text-13 text-gray-200">
                          You: I will send you...
                        </span>
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
                                    className="delete-item-btn py-6 text-15 px-8 hover-bg-gray-50 text-gray-300 w-100 rounded-8 fw-normal text-xs d-block text-start"
                                  >
                                    <span className="text">
                                      <i className="ph ph-user me-4" /> Profile
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
                  <div className="chat-list__item flex-between gap-8 cursor-pointer">
                    <div className="d-flex align-items-start gap-16">
                      <div className="position-relative flex-shrink-0">
                        <img
                          src="assets/images/thumbs/avatar-img3.png"
                          alt=""
                          className="w-44 h-44 rounded-circle object-fit-cover flex-shrink-0"
                        />
                        <span className="activation-badge w-12 h-12 border-2 position-absolute inset-block-end-0 inset-inline-end-0" />
                      </div>
                      <div className="d-flex flex-column">
                        <h6 className="text-line-1 text-15 text-gray-400 fw-bold mb-0">
                          Kate Morrison
                        </h6>
                        <span className="text-line-1 text-13 text-gray-200">
                          You: I will send you...
                        </span>
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
                                    className="delete-item-btn py-6 text-15 px-8 hover-bg-gray-50 text-gray-300 w-100 rounded-8 fw-normal text-xs d-block text-start"
                                  >
                                    <span className="text">
                                      <i className="ph ph-user me-4" /> Profile
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
                  <div className="chat-list__item flex-between gap-8 cursor-pointer">
                    <div className="d-flex align-items-start gap-16">
                      <div className="position-relative flex-shrink-0">
                        <img
                          src="assets/images/thumbs/avatar-img4.png"
                          alt=""
                          className="w-44 h-44 rounded-circle object-fit-cover flex-shrink-0"
                        />
                        <span className="activation-badge w-12 h-12 border-2 position-absolute inset-block-end-0 inset-inline-end-0" />
                      </div>
                      <div className="d-flex flex-column">
                        <h6 className="text-line-1 text-15 text-gray-400 fw-bold mb-0">
                          Kate Morrison
                        </h6>
                        <span className="text-line-1 text-13 text-gray-200">
                          You: I will send you...
                        </span>
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
                                    className="delete-item-btn py-6 text-15 px-8 hover-bg-gray-50 text-gray-300 w-100 rounded-8 fw-normal text-xs d-block text-start"
                                  >
                                    <span className="text">
                                      <i className="ph ph-user me-4" /> Profile
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
                  <div className="chat-list__item flex-between gap-8 cursor-pointer">
                    <div className="d-flex align-items-start gap-16">
                      <div className="position-relative flex-shrink-0">
                        <img
                          src="assets/images/thumbs/avatar-img5.png"
                          alt=""
                          className="w-44 h-44 rounded-circle object-fit-cover flex-shrink-0"
                        />
                        <span className="activation-badge w-12 h-12 border-2 position-absolute inset-block-end-0 inset-inline-end-0" />
                      </div>
                      <div className="d-flex flex-column">
                        <h6 className="text-line-1 text-15 text-gray-400 fw-bold mb-0">
                          Kate Morrison
                        </h6>
                        <span className="text-line-1 text-13 text-gray-200">
                          You: I will send you...
                        </span>
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
                                    className="delete-item-btn py-6 text-15 px-8 hover-bg-gray-50 text-gray-300 w-100 rounded-8 fw-normal text-xs d-block text-start"
                                  >
                                    <span className="text">
                                      <i className="ph ph-user me-4" /> Profile
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
                  <div className="chat-list__item flex-between gap-8 cursor-pointer">
                    <div className="d-flex align-items-start gap-16">
                      <div className="position-relative flex-shrink-0">
                        <img
                          src="assets/images/thumbs/avatar-img6.png"
                          alt=""
                          className="w-44 h-44 rounded-circle object-fit-cover flex-shrink-0"
                        />
                        <span className="activation-badge w-12 h-12 border-2 position-absolute inset-block-end-0 inset-inline-end-0" />
                      </div>
                      <div className="d-flex flex-column">
                        <h6 className="text-line-1 text-15 text-gray-400 fw-bold mb-0">
                          Kate Morrison
                        </h6>
                        <span className="text-line-1 text-13 text-gray-200">
                          You: I will send you...
                        </span>
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
                                    className="delete-item-btn py-6 text-15 px-8 hover-bg-gray-50 text-gray-300 w-100 rounded-8 fw-normal text-xs d-block text-start"
                                  >
                                    <span className="text">
                                      <i className="ph ph-user me-4" /> Profile
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
                  <div className="chat-list__item flex-between gap-8 cursor-pointer">
                    <div className="d-flex align-items-start gap-16">
                      <div className="position-relative flex-shrink-0">
                        <img
                          src="assets/images/thumbs/avatar-img7.png"
                          alt=""
                          className="w-44 h-44 rounded-circle object-fit-cover flex-shrink-0"
                        />
                        <span className="activation-badge w-12 h-12 border-2 position-absolute inset-block-end-0 inset-inline-end-0" />
                      </div>
                      <div className="d-flex flex-column">
                        <h6 className="text-line-1 text-15 text-gray-400 fw-bold mb-0">
                          Kate Morrison
                        </h6>
                        <span className="text-line-1 text-13 text-gray-200">
                          You: I will send you...
                        </span>
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
                                    className="delete-item-btn py-6 text-15 px-8 hover-bg-gray-50 text-gray-300 w-100 rounded-8 fw-normal text-xs d-block text-start"
                                  >
                                    <span className="text">
                                      <i className="ph ph-user me-4" /> Profile
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
                  <div className="chat-list__item flex-between gap-8 cursor-pointer">
                    <div className="d-flex align-items-start gap-16">
                      <div className="position-relative flex-shrink-0">
                        <img
                          src="assets/images/thumbs/avatar-img8.png"
                          alt=""
                          className="w-44 h-44 rounded-circle object-fit-cover flex-shrink-0"
                        />
                        <span className="activation-badge w-12 h-12 border-2 position-absolute inset-block-end-0 inset-inline-end-0" />
                      </div>
                      <div className="d-flex flex-column">
                        <h6 className="text-line-1 text-15 text-gray-400 fw-bold mb-0">
                          Kate Morrison
                        </h6>
                        <span className="text-line-1 text-13 text-gray-200">
                          You: I will send you...
                        </span>
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
                                    className="delete-item-btn py-6 text-15 px-8 hover-bg-gray-50 text-gray-300 w-100 rounded-8 fw-normal text-xs d-block text-start"
                                  >
                                    <span className="text">
                                      <i className="ph ph-user me-4" /> Profile
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
                  <div className="chat-list__item flex-between gap-8 cursor-pointer">
                    <div className="d-flex align-items-start gap-16">
                      <div className="position-relative flex-shrink-0">
                        <img
                          src="assets/images/thumbs/avatar-img9.png"
                          alt=""
                          className="w-44 h-44 rounded-circle object-fit-cover flex-shrink-0"
                        />
                        <span className="activation-badge w-12 h-12 border-2 position-absolute inset-block-end-0 inset-inline-end-0" />
                      </div>
                      <div className="d-flex flex-column">
                        <h6 className="text-line-1 text-15 text-gray-400 fw-bold mb-0">
                          Kate Morrison
                        </h6>
                        <span className="text-line-1 text-13 text-gray-200">
                          You: I will send you...
                        </span>
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
                                    className="delete-item-btn py-6 text-15 px-8 hover-bg-gray-50 text-gray-300 w-100 rounded-8 fw-normal text-xs d-block text-start"
                                  >
                                    <span className="text">
                                      <i className="ph ph-user me-4" /> Profile
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
                  <div className="chat-list__item flex-between gap-8 cursor-pointer">
                    <div className="d-flex align-items-start gap-16">
                      <div className="position-relative flex-shrink-0">
                        <img
                          src="assets/images/thumbs/avatar-img10.png"
                          alt=""
                          className="w-44 h-44 rounded-circle object-fit-cover flex-shrink-0"
                        />
                        <span className="activation-badge w-12 h-12 border-2 position-absolute inset-block-end-0 inset-inline-end-0" />
                      </div>
                      <div className="d-flex flex-column">
                        <h6 className="text-line-1 text-15 text-gray-400 fw-bold mb-0">
                          Kate Morrison
                        </h6>
                        <span className="text-line-1 text-13 text-gray-200">
                          You: I will send you...
                        </span>
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
                                    className="delete-item-btn py-6 text-15 px-8 hover-bg-gray-50 text-gray-300 w-100 rounded-8 fw-normal text-xs d-block text-start"
                                  >
                                    <span className="text">
                                      <i className="ph ph-user me-4" /> Profile
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
            {/* chat sidebar End */}
            {/* chat sidebar Start */}
            <div className="card chat-box">
              <div className="card-header py-16 border-bottom border-gray-100">
                <div className="chat-list__item flex-between gap-8 cursor-pointer">
                  <div className="d-flex align-items-start gap-16">
                    <div className="position-relative flex-shrink-0">
                      <img
                        src="assets/images/thumbs/avatar-img1.png"
                        alt="a"
                        className="w-40 h-40 rounded-circle object-fit-cover flex-shrink-0"
                      />
                      <span className="activation-badge w-12 h-12 border-2 position-absolute inset-block-end-0 inset-inline-end-0" />
                    </div>
                    <div className="d-flex flex-column">
                      <h6 className="text-line-1 text-15 text-gray-400 fw-bold mb-0">
                        Kate Morrison
                      </h6>
                      <span className="text-line-1 text-13 text-gray-200">
                        Online
                      </span>
                    </div>
                  </div>
                  <div className="flex-align gap-16">
                    <button
                      type="button"
                      className="text-main-600 text-xl d-flex"
                    >
                      <i className="ph-fill ph-phone" />
                    </button>
                    <button
                      type="button"
                      className="text-main-600 text-xl d-flex"
                    >
                      <i className="ph-fill ph-video-camera" />
                    </button>
                    <div className="dropdown flex-shrink-0">
                      <button
                        className="text-gray-400 text-xl d-flex rounded-4"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="ph-fill ph-dots-three-outline-vertical" />
                      </button>
                      <div className="dropdown-menu dropdown-menu--md border-0 bg-transparent p-0">
                        <div className="card border border-gray-100 rounded-12 box-shadow-custom">
                          <div className="card-body p-12">
                            <div className="max-h-200 overflow-y-auto scroll-sm pe-8">
                              <ul>
                                <li className="mb-0">
                                  <button
                                    type="button"
                                    className="delete-item-btn py-6 text-15 px-8 hover-bg-gray-50 text-gray-300 w-100 rounded-8 fw-normal text-xs d-block text-start"
                                  >
                                    <span className="text">
                                      <i className="ph ph-x-circle" /> All Clear
                                    </span>
                                  </button>
                                </li>
                                <li className="mb-0">
                                  <button
                                    type="button"
                                    className="delete-item-btn py-6 text-15 px-8 hover-bg-gray-50 text-gray-300 w-100 rounded-8 fw-normal text-xs d-block text-start"
                                  >
                                    <span className="text">
                                      <i className="ph ph-user-minus" /> Block
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
              <div className="card-body p-0">
                <div className="chat-box-item-wrapper overflow-y-auto scroll-sm p-24">
                  <div className="chat-box-item d-flex align-items-end gap-8">
                    <img
                      src="assets/images/thumbs/avatar-img1.png"
                      alt=""
                      className="w-40 h-40 rounded-circle object-fit-cover flex-shrink-0"
                    />
                    <div className="chat-box-item__content">
                      <p className="chat-box-item__text p-16 rounded-16 mb-12">
                        Hello Mac
                      </p>
                      <p className="chat-box-item__text py-16 px-16 px-lg-4">
                        Lorem ipsum dolor sit amet consectetur. Cursus vulputate
                        eget ullamcorper bibendum pulvinar sed at libero.
                        Vulputate amet fermentum sapien amet tempus ac donec.
                      </p>
                      <span className="text-gray-200 text-13 mt-2 d-block">
                        10 min ago
                      </span>
                    </div>
                  </div>
                  <div className="chat-box-item right d-flex align-items-end gap-8">
                    <img
                      src="assets/images/thumbs/avatar-img1.png"
                      alt=""
                      className="w-40 h-40 rounded-circle object-fit-cover flex-shrink-0"
                    />
                    <div className="chat-box-item__content">
                      <p className="chat-box-item__text py-16 px-16 px-lg-4">
                        Lorem ipsum dolor sit amet consect.Cursus vulputate eget
                        ullamcorper bibendum
                      </p>
                      <span className="text-gray-200 text-13 mt-2 d-block">
                        10 min ago
                      </span>
                    </div>
                  </div>
                  <div className="chat-box-item d-flex align-items-end gap-8">
                    <img
                      src="assets/images/thumbs/avatar-img1.png"
                      alt=""
                      className="w-40 h-40 rounded-circle object-fit-cover flex-shrink-0"
                    />
                    <div className="chat-box-item__content">
                      <p className="chat-box-item__text py-16 px-16 px-lg-4">
                        Lorem ipsum dolor sit amet consectetur. Cursus vulputate
                        eget ullamcorper bibendum pulvinar sed at libero.
                      </p>
                      <span className="text-gray-200 text-13 mt-2 d-block">
                        10 min ago
                      </span>
                    </div>
                  </div>
                  <div className="chat-box-item right d-flex align-items-end gap-8">
                    <img
                      src="assets/images/thumbs/avatar-img1.png"
                      alt=""
                      className="w-40 h-40 rounded-circle object-fit-cover flex-shrink-0"
                    />
                    <div className="chat-box-item__content">
                      <p className="chat-box-item__text py-16 px-16 px-lg-4">
                        Lorem ipsum dolor sit amet consect.Cursus vulputate eget
                        ullamcorper bibendum
                      </p>
                      <span className="text-gray-200 text-13 mt-2 d-block">
                        10 min ago
                      </span>
                    </div>
                  </div>
                  <div className="chat-box-item d-flex align-items-end gap-8">
                    <img
                      src="assets/images/thumbs/avatar-img1.png"
                      alt=""
                      className="w-40 h-40 rounded-circle object-fit-cover flex-shrink-0"
                    />
                    <div className="chat-box-item__content">
                      <p className="chat-box-item__text p-16 rounded-16 mb-12">
                        Hello Mac
                      </p>
                      <p className="chat-box-item__text py-16 px-16 px-lg-4">
                        Lorem ipsum dolor sit amet consectetur. Cursus vulputate
                        eget ullamcorper bibendum pulvinar sed at libero.
                        Vulputate amet fermentum sapien amet tempus ac donec.
                      </p>
                      <span className="text-gray-200 text-13 mt-2 d-block">
                        10 min ago
                      </span>
                    </div>
                  </div>
                  <div className="chat-box-item right d-flex align-items-end gap-8">
                    <img
                      src="assets/images/thumbs/avatar-img1.png"
                      alt=""
                      className="w-40 h-40 rounded-circle object-fit-cover flex-shrink-0"
                    />
                    <div className="chat-box-item__content">
                      <p className="chat-box-item__text py-4 px-16 px-lg-4">
                        ...
                      </p>
                      <span className="text-gray-200 text-13 mt-2 d-block">
                        10 min ago
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer border-top border-gray-100">
                <form action="#" className="flex-align gap-8 chat-box-bottom">
                  <label
                    htmlFor="fileUp"
                    className="flex-shrink-0 file-btn w-48 h-48 flex-center bg-main-50 text-24 text-main-600 rounded-circle hover-bg-main-100 transition-2"
                  >
                    <i className="ph ph-plus" />
                  </label>
                  <input
                    type="file"
                    name="fileName"
                    id="fileUp"
                    accept="image/*"
                    hidden
                  />
                  <input
                    type="text"
                    className="form-control h-48 border-transparent px-20 focus-border-main-600 bg-main-50 rounded-pill placeholder-15"
                    placeholder="Type your message..."
                  />
                  <button
                    type="button"
                    className="flex-shrink-0 file-btn w-48 h-48 flex-center bg-main-50 text-24 text-main-600 rounded-circle hover-bg-main-100 transition-2"
                  >
                    <i className="ph-fill ph-microphone" />
                  </button>
                  <button
                    type="submit"
                    className="flex-shrink-0 submit-btn btn btn-main rounded-pill flex-align gap-4 py-15"
                  >
                    Submit
                    <span className="d-flex text-md d-sm-flex d-none">
                      <i className="ph-fill ph-paper-plane-tilt" />
                    </span>
                  </button>
                </form>
              </div>
            </div>
            {/* chat sidebar End */}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Messages;
