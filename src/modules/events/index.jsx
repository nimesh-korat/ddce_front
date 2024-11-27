import React from "react";
import Sidebar from "../../common/sidebar";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";

function Events() {
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
                <span className="text-main-600 fw-normal text-15">Events</span>
              </li>
            </ul>
          </div>
          {/* Breadcrumb End */}
          {/* Recommended Start */}
          <div className="card mt-24 bg-transparent">
            <div className="card-body p-0">
              <div id="wrap">
                <div id="calendar" className="position-relative">
                  <button
                    type="button"
                    className="add-event btn btn-main text-sm btn-sm px-24 rounded-pill py-12 d-flex align-items-center gap-2"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                  >
                    <i className="ph ph-plus me-4" />
                    Add Event
                  </button>
                </div>
                <div style={{ clear: "both" }} />
              </div>
            </div>
          </div>
          {/* Recommended End */}
        </div>
        <Footer />
      </div>
      {/* Modal Add Event */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog modal-dialog-centered">
          <div className="modal-content radius-16 bg-base">
            <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Add New Event
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body p-24">
              <form action="#">
                <div className="row">
                  <div className="col-12 mb-20">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Event Title :
                    </label>
                    <input
                      type="text"
                      className="form-control radius-8"
                      placeholder="Enter Event Title "
                    />
                  </div>
                  <div className="col-md-6 mb-20">
                    <label
                      htmlFor="startDate"
                      className="form-label fw-semibold text-primary-light text-sm mb-8"
                    >
                      Start Date
                    </label>
                    <div className=" position-relative">
                      <input
                        className="form-control radius-8 bg-base"
                        id="startDate"
                        type="date"
                      />
                      <span className="position-absolute end-0 top-50 translate-middle-y me-12 line-height-1" />
                    </div>
                  </div>
                  <div className="col-md-6 mb-20">
                    <label
                      htmlFor="endDate"
                      className="form-label fw-semibold text-primary-light text-sm mb-8"
                    >
                      End Date
                    </label>
                    <div className=" position-relative">
                      <input
                        className="form-control radius-8 bg-base"
                        id="endDate"
                        type="date"
                      />
                      <span className="position-absolute end-0 top-50 translate-middle-y me-12 line-height-1" />
                    </div>
                  </div>
                  <div className="col-12 mb-20">
                    <label
                      htmlFor="endDate"
                      className="form-label fw-semibold text-primary-light text-sm mb-8"
                    >
                      Label
                    </label>
                    <div className="d-flex align-items-center flex-wrap gap-28">
                      <div className="form-check form-radio d-flex align-items-center gap-2 mb-0">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="label"
                          id="Personal"
                        />
                        <label
                          className="form-check-label min-width-max-content line-height-1 fw-medium text-secondary-light text-sm d-flex align-items-center gap-1 ps-4"
                          htmlFor="Personal"
                        >
                          <span className="w-8-px h-8-px bg-success-600 rounded-circle" />
                          Personal
                        </label>
                      </div>
                      <div className="form-check form-radio d-flex align-items-center gap-2 mb-0">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="label"
                          id="Business"
                        />
                        <label
                          className="form-check-label min-width-max-content line-height-1 fw-medium text-secondary-light text-sm d-flex align-items-center gap-1 ps-4"
                          htmlFor="Business"
                        >
                          <span className="w-8-px h-8-px bg-primary-600 rounded-circle" />
                          Business
                        </label>
                      </div>
                      <div className="form-check form-radio d-flex align-items-center gap-2 mb-0">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="label"
                          id="Family"
                        />
                        <label
                          className="form-check-label min-width-max-content line-height-1 fw-medium text-secondary-light text-sm d-flex align-items-center gap-1 ps-4"
                          htmlFor="Family"
                        >
                          <span className="w-8-px h-8-px bg-warning-600 rounded-circle" />
                          Family
                        </label>
                      </div>
                      <div className="form-check form-radio d-flex align-items-center gap-2 mb-0">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="label"
                          id="Important"
                        />
                        <label
                          className="form-check-label min-width-max-content line-height-1 fw-medium text-secondary-light text-sm d-flex align-items-center gap-1 ps-4"
                          htmlFor="Important"
                        >
                          <span className="w-8-px h-8-px bg-lilac-600 rounded-circle" />
                          Important
                        </label>
                      </div>
                      <div className="form-check form-radio d-flex align-items-center gap-2 mb-0">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="label"
                          id="Holiday"
                        />
                        <label
                          className="form-check-label min-width-max-content line-height-1 fw-medium text-secondary-light text-sm d-flex align-items-center gap-1 ps-4"
                          htmlFor="Holiday"
                        >
                          <span className="w-8-px h-8-px bg-danger-600 rounded-circle" />
                          Holiday
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 mb-20">
                    <label
                      htmlFor="desc"
                      className="form-label fw-semibold text-primary-light text-sm mb-8"
                    >
                      Description
                    </label>
                    <textarea
                      className="form-control"
                      id="desc"
                      rows={4}
                      cols={50}
                      placeholder="Write some text"
                      defaultValue={""}
                    />
                  </div>
                  <div className="d-flex align-items-center justify-content-center gap-8 mt-24">
                    <button
                      type="reset"
                      className="btn bg-danger-600 hover-bg-danger-800 border-danger-600 hover-border-danger-800 text-md px-24 py-12 radius-8"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn bg-main-600 hover-bg-main-800 border-main-600 hover-border-main-800 text-md px-24 py-12 radius-8"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Events;
