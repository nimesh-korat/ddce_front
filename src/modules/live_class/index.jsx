import React from "react";
import Sidebar from "../../common/sidebar";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";

function LiveClass() {
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
                  Course Details
                </span>
              </li>
            </ul>
          </div>
          {/* Breadcrumb End */}
          <div className="row gy-4">
            <div className="col-md-8">
              <div className="rounded-16 overflow-hidden position-relative">
                <span className="live-badge text-white bg-danger-600 rounded-8 text-15 px-32 py-10 position-absolute inset-block-start-0 inset-inline-start-0 z-1 ms-24 mt-24">
                  Live
                </span>
                <video
                  id="player"
                  className="player"
                  playsInline
                  controls
                  data-poster="assets/images/thumbs/live-class.png"
                >
                  <source
                    src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4"
                    type="video/mp4"
                  />
                  <source src="/path/to/video.webm" type="video/webm" />
                </video>
              </div>
              {/* Course Card Start */}
              <div className="card mt-24">
                <div className="card-body">
                  <div className="pb-24 flex-between gap-4 flex-wrap">
                    <h5 className="mb-12 fw-bold">Questions (85)</h5>
                    <a
                      href="/#"
                      className="btn btn-outline-gray text-gray-500 text-13 py-8 px-8 rounded-4"
                    >
                      See All
                    </a>
                  </div>
                  <ul className="comment-list">
                    <li>
                      <div className="d-flex align-items-start gap-8 flex-xs-row flex-column">
                        <img
                          src="assets/images/thumbs/mentor-img1.png"
                          alt=""
                          className="w-48 h-48 rounded-circle object-fit-cover flex-shrink-0"
                        />
                        <div>
                          <div className="flex-align flex-wrap gap-8">
                            <h6 className="text-15 fw-bold mb-0">Amir Hamja</h6>
                            <span className="py-0 px-8 bg-main-50 text-main-600 rounded-4 text-15 fw-medium h5 mb-0 fw-bold">
                              You
                            </span>
                            <span className="text-gray-300 text-13">
                              8:00PM
                            </span>
                          </div>
                          <p className="text-15 text-gray-600 mt-8">
                            Fringilla justo mauris cursus arcu sit urna. Nullam
                            eu non bibendum quam mi dolor nisi orci?
                          </p>
                        </div>
                      </div>
                      <ul className="sub-comment-list mt-24">
                        <li>
                          <div className="d-flex align-items-start gap-8 flex-xs-row flex-column">
                            <img
                              src="assets/images/thumbs/mentor-img2.png"
                              alt=""
                              className="w-48 h-48 rounded-circle object-fit-cover flex-shrink-0"
                            />
                            <div>
                              <div className="flex-align flex-wrap gap-8">
                                <h6 className="text-15 fw-bold mb-0">
                                  Selina Eyvi
                                </h6>
                                <span className="py-0 px-8 bg-main-50 text-main-600 rounded-4 text-15 fw-medium h5 mb-0 fw-bold">
                                  Mentor
                                </span>
                                <span className="text-gray-300 text-13">
                                  8:10PM
                                </span>
                              </div>
                              <p className="text-15 text-gray-600 mt-8">
                                Justo gravida eget id massa volutpat. Volutpat
                                vehicula tortor fusce sed pellentesque id
                                sagittis eu commodo. Ut ultrices neque faucibus
                                morbi rhoncus. Volutpat vehicula tortor fusce
                                sed pellentesque id sagittis eu commodo
                              </p>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </li>
                  </ul>
                  <form action="/#" className="position-relative mt-44">
                    <input
                      type="text"
                      className="form-control bg-main-50 border-0 py-18 pe-54"
                      placeholder="Drop your questions here..."
                    />
                    <button
                      type="submit"
                      className="w-40 h-40 flex-center rounded-8 bg-white text-main-600 hover-bg-main-600 hover-text-white transition-1 position-absolute inset-inline-end-0 top-50 translate-middle-y me-8"
                    >
                      <i className="ph ph-paper-plane-tilt" />
                    </button>
                  </form>
                </div>
              </div>
              {/* Course Card End */}
            </div>
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <div className="flex-between flex-wrap mb-12">
                    <h5 className="mb-0 fw-bold">Your Lesson</h5>
                    <span className="text-13">3/35</span>
                  </div>
                  <div className="flex-align gap-8 mb-12">
                    <span className="text-main-600 flex-shrink-0 text-13 fw-medium">
                      32%
                    </span>
                    <div
                      className="progress w-100  bg-main-100 rounded-pill h-4"
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
                  <ul className="lesson-list">
                    <li className="lesson-list__item d-flex align-items-start gap-16 active">
                      <span className="circle w-16 h-16 flex-center rounded-circle text-main-100 text-13 flex-shrink-0">
                        <i className="ph-fill ph-check-circle" />
                      </span>
                      <div>
                        <a
                          href="/#"
                          className="text-13 text-heading d-block text-gray-600 fw-medium hover-text-main-600"
                        >
                          Intro
                          <span className="text-13 text-heading d-block text-gray-600 fw-medium">
                            Last access: 12Jan 24. 8:00PM
                          </span>
                        </a>
                      </div>
                    </li>
                    <li className="lesson-list__item d-flex align-items-start gap-16 active">
                      <span className="circle w-16 h-16 flex-center rounded-circle text-main-100 text-13 flex-shrink-0">
                        <i className="ph-fill ph-check-circle" />
                      </span>
                      <div>
                        <a
                          href="/#"
                          className="text-13 text-heading d-block text-gray-600 fw-medium hover-text-main-600"
                        >
                          What is Digital Marketing?
                          <span className="text-13 text-heading d-block text-gray-600 fw-medium">
                            Last access: 12Jan 24. 8:00PM
                          </span>
                        </a>
                      </div>
                    </li>
                    <li className="lesson-list__item d-flex align-items-start gap-16">
                      <span className="circle w-16 h-16 flex-center rounded-circle text-main-100 text-13 flex-shrink-0">
                        <i className="ph-fill ph-check-circle" />
                      </span>
                      <div>
                        <a
                          href="/#"
                          className="text-13 text-heading d-block text-gray-600 fw-medium hover-text-main-600"
                        >
                          Digital Marketing Fundamental
                          <span className="text-13 text-heading d-block text-gray-600 fw-medium">
                            Locked
                          </span>
                        </a>
                      </div>
                    </li>
                    <li className="lesson-list__item d-flex align-items-start gap-16">
                      <span className="circle w-16 h-16 flex-center rounded-circle text-main-100 text-13 flex-shrink-0">
                        <i className="ph-fill ph-check-circle" />
                      </span>
                      <div>
                        <a
                          href="/#"
                          className="text-13 text-heading d-block text-gray-600 fw-medium hover-text-main-600"
                        >
                          Digital Marketing Fundamental
                          <span className="text-13 text-heading d-block text-gray-600 fw-medium">
                            Locked
                          </span>
                        </a>
                      </div>
                    </li>
                    <li className="lesson-list__item d-flex align-items-start gap-16">
                      <span className="circle w-16 h-16 flex-center rounded-circle text-main-100 text-13 flex-shrink-0">
                        <i className="ph-fill ph-check-circle" />
                      </span>
                      <div>
                        <a
                          href="/#"
                          className="text-13 text-heading d-block text-gray-600 fw-medium hover-text-main-600"
                        >
                          Digital Marketing Fundamental
                          <span className="text-13 text-heading d-block text-gray-600 fw-medium">
                            Locked
                          </span>
                        </a>
                      </div>
                    </li>
                    <li className="lesson-list__item d-flex align-items-start gap-16">
                      <span className="circle w-16 h-16 flex-center rounded-circle text-main-100 text-13 flex-shrink-0">
                        <i className="ph-fill ph-check-circle" />
                      </span>
                      <div>
                        <a
                          href="/#"
                          className="text-13 text-heading d-block text-gray-600 fw-medium hover-text-main-600"
                        >
                          Digital Marketing Fundamental
                          <span className="text-13 text-heading d-block text-gray-600 fw-medium">
                            Locked
                          </span>
                        </a>
                      </div>
                    </li>
                    <li className="lesson-list__item d-flex align-items-start gap-16">
                      <span className="circle w-16 h-16 flex-center rounded-circle text-main-100 text-13 flex-shrink-0">
                        <i className="ph-fill ph-check-circle" />
                      </span>
                      <div>
                        <a
                          href="/#"
                          className="text-13 text-heading d-block text-gray-600 fw-medium hover-text-main-600"
                        >
                          Digital Marketing Fundamental
                          <span className="text-13 text-heading d-block text-gray-600 fw-medium">
                            Locked
                          </span>
                        </a>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default LiveClass;
