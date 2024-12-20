import React from "react";
import Sidebar from "../../common/sidebar";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";

function Resources() {
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
          <div className="breadcrumb-with-buttons mb-24 flex-between flex-wrap gap-8">
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
                    Files &amp; Resources
                  </span>
                </li>
              </ul>
            </div>
            {/* Breadcrumb End */}
            {/* Breadcrumb Right Start */}
            <div className="flex-align gap-8 flex-wrap">
              <div className="position-relative text-gray-500 flex-align gap-4 text-13">
                <span className="text-inherit">Sort by: </span>
                <div className="flex-align text-gray-500 text-13 border border-gray-100 rounded-4 ps-20 focus-border-main-600 bg-white">
                  <span className="text-lg">
                    <i className="ph ph-funnel-simple" />
                  </span>
                  <select className="form-control ps-8 pe-20 py-16 border-0 text-inherit rounded-4 text-center">
                    <option value={1} selected>
                      Popular
                    </option>
                    <option value={1}>Latest</option>
                    <option value={1}>Trending</option>
                    <option value={1}>Matches</option>
                  </select>
                </div>
              </div>
              <div className="flex-align text-gray-500 text-13 border border-gray-100 rounded-4 ps-20 focus-border-main-600 bg-white">
                <span className="text-lg">
                  <i className="ph ph-layout" />
                </span>
                <select
                  className="form-control ps-8 pe-20 py-16 border-0 text-inherit rounded-4 text-center"
                  id="exportOptions"
                >
                  <option value selected disabled>
                    Export
                  </option>
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                </select>
              </div>
            </div>
            {/* Breadcrumb Right End */}
          </div>
          {/* Card Start */}
          <div className="card">
            {/* Card Header Start */}
            <div className="card-header border-bottom border-gray-100">
              <div className="flex-between flex-wrap gap-8">
                <form action="/#" className="w-350 d-sm-block d-none">
                  <div className="position-relative">
                    <button
                      type="submit"
                      className="input-icon text-xl d-flex text-gray-100 pointer-event-none"
                    >
                      <i className="ph ph-magnifying-glass" />
                    </button>
                    <input
                      type="text"
                      className="form-control ps-40 h-40 border-transparent focus-border-main-600 bg-main-50 rounded-pill placeholder-15"
                      placeholder="Search..."
                    />
                  </div>
                </form>
                <div className="flex-align gap-8 flex-wrap">
                  <div className="position-relative text-gray-500 flex-align gap-4 text-13">
                    <span className="text-inherit">Sort by: </span>
                    <div className="position-relative">
                      <div className="flex-align gap-8">
                        <button
                          type="button"
                          className="list-view-btn text-gray-200 text-2xl"
                        >
                          <i className="ph ph-rows" />
                        </button>
                        <button
                          type="button"
                          className="grid-view-btn active text-gray-200 text-2xl"
                        >
                          <i className="ph ph-squares-four" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <label
                    htmlFor="upload"
                    className="btn btn-main text-sm btn-sm px-24 py-12 d-flex align-items-center gap-8"
                  >
                    <i className="ph ph-upload-simple d-flex text-xl" />
                    Upload File
                  </label>
                  <input type="file" accept="image/*" id="upload" hidden />
                </div>
              </div>
            </div>
            {/* Card Header End */}
            <div className="card-body p-0">
              {/* Grid View Start */}
              <div className="grid-view py-20">
                <div className="resource-item-wrapper px-24">
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox1"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox1">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon1.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Assignments
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox2"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox2">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon1.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Design &amp; Art
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox3"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox3">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon1.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Assignments
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox4"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox4">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon1.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Development
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox5"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox5">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon1.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Payments
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox6"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox6">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon1.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Content
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox7"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox7">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon1.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Assignments
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox8"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox8">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon1.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Maths
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox9"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox9">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon1.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Content
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox10"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox10">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon1.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Video
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox11"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox11">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon1.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Invoices
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox12"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox12">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon1.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Presentation
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                </div>
                <div className="resource-item-wrapper px-24">
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox13"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox13">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon1.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Design &amp; Art
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox14"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox14">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon1.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Presentation
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox15"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox15">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon1.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Assignments
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox16"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox16">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon1.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Payments
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox17"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox17">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon1.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Invoices
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox18"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox18">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon1.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Assignments
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox19"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox19">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon1.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Payments
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox20"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox20">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon1.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Content
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox21"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox21">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon1.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Assignments
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox22"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox22">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon1.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Development
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox23"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox23">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon1.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Video
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox24"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox24">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon1.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Maths
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                </div>
                <div className="resource-item-wrapper px-24">
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox25"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox25">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon2.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Design &amp; Art
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox26"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox26">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon3.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Articles.pdf
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox27"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox27">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon3.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Payment.xls
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox28"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox28">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon4.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Brief.doc
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox29"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox29">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon3.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Articles.pdf
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox30"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox30">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon4.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Lession.doc
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox31"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox31">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon2.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Revenue.xls
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox32"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox32">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon4.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Class 1st.doc
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox33"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox33">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon4.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Lession.doc
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox34"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox34">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon2.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Budget.xls
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox35"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox35">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon4.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Class 1st.doc
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox36"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox36">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon2.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Design &amp; Art
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                </div>
                <div className="resource-item-wrapper px-24">
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox37"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox37">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon4.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Brief.doc
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item fixed-width">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox38"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox38">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon2.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Revenue.xls
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox39"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox39">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon4.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Class 1st.doc
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox40"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox40">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon4.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Lession.doc
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox41"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox41">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon3.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Articles.pdf
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox42"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox42">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon2.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Design &amp; Art
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox43"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox43">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon2.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Budget.xls
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox44"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox44">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon2.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Design &amp; Art
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox45"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox45">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon3.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Payment.xls
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox46"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox46">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon4.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Class 1st.doc
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox47"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox47">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon4.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Lession.doc
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox48"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox48">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon2.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Revenue.xls
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                </div>
                <div className="resource-item-wrapper px-24">
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox49"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox49">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon4.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Brief.doc
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox50"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox50">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon3.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Articles.pdf
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox51"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox51">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon2.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Design &amp; Art
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                  <div className="resource-item">
                    <div className="form-check">
                      <input
                        className="form-check-input border-gray-200 rounded-4"
                        id="checkbox52"
                        type="checkbox"
                      />
                    </div>
                    <label htmlFor="checkbox52">
                      <span className="d-block mb-16">
                        <img src="assets/images/icons/file-icon2.png" alt="" />
                      </span>
                      <span className="d-block text-gray-400 text-15">
                        Budget.xls
                      </span>
                      <span className="d-block text-gray-200 text-15">
                        32 Files
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              {/* Grid View End */}
              {/* List View Start */}
              <div className="list-view d-none">
                <div className="card-body p-0 overflow-x-auto scroll-sm scroll-sm-horizontal">
                  <table
                    id="studentTable"
                    className="table table-striped style-three w-100"
                  >
                    <thead>
                      <tr>
                        <th className="fixed-width">
                          <div className="form-check">
                            <input
                              className="form-check-input border-gray-200 rounded-4"
                              type="checkbox"
                              id="selectAll"
                            />
                          </div>
                        </th>
                        <th className="h6 text-gray-300">Name</th>
                        <th className="h6 text-gray-300">Updated By</th>
                        <th className="h6 text-gray-300">Size</th>
                        <th className="h6 text-gray-300">Total Files</th>
                        <th className="h6 text-gray-300">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="fixed-width">
                          <div className="form-check">
                            <input
                              className="form-check-input border-gray-200 rounded-4"
                              type="checkbox"
                            />
                          </div>
                        </td>
                        <td>
                          <div className="flex-align gap-8">
                            <img
                              src="assets/images/icons/file-icon-sm1.png"
                              alt=""
                              className
                            />
                            <span className="h6 mb-0 fw-medium text-gray-300">
                              Web Development
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="h6 mb-0 fw-medium text-gray-300">
                            Yesterday by Mir Hossain
                          </span>
                        </td>
                        <td>
                          <span className="h6 mb-0 fw-medium text-gray-300">
                            72MB
                          </span>
                        </td>
                        <td>
                          <span className="h6 mb-0 fw-medium text-gray-300">
                            10 Files
                          </span>
                        </td>
                        <td>
                          <span className="text-13 py-2 px-8 bg-success-50 text-success-600 d-inline-flex align-items-center gap-8 rounded-pill">
                            <span className="w-6 h-6 bg-success-600 rounded-circle flex-shrink-0" />
                            Received
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="fixed-width">
                          <div className="form-check">
                            <input
                              className="form-check-input border-gray-200 rounded-4"
                              type="checkbox"
                            />
                          </div>
                        </td>
                        <td>
                          <div className="flex-align gap-8">
                            <img
                              src="assets/images/icons/file-icon-sm1.png"
                              alt=""
                              className
                            />
                            <span className="h6 mb-0 fw-medium text-gray-300">
                              Web Development
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="h6 mb-0 fw-medium text-gray-300">
                            Yesterday by Mir Hossain
                          </span>
                        </td>
                        <td>
                          <span className="h6 mb-0 fw-medium text-gray-300">
                            72MB
                          </span>
                        </td>
                        <td>
                          <span className="h6 mb-0 fw-medium text-gray-300">
                            10 Files
                          </span>
                        </td>
                        <td>
                          <span className="text-13 py-2 px-8 bg-success-50 text-success-600 d-inline-flex align-items-center gap-8 rounded-pill">
                            <span className="w-6 h-6 bg-success-600 rounded-circle flex-shrink-0" />
                            Received
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="fixed-width">
                          <div className="form-check">
                            <input
                              className="form-check-input border-gray-200 rounded-4"
                              type="checkbox"
                            />
                          </div>
                        </td>
                        <td>
                          <div className="flex-align gap-8">
                            <img
                              src="assets/images/icons/file-icon-sm1.png"
                              alt=""
                              className
                            />
                            <span className="h6 mb-0 fw-medium text-gray-300">
                              Web Development
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="h6 mb-0 fw-medium text-gray-300">
                            Yesterday by Mir Hossain
                          </span>
                        </td>
                        <td>
                          <span className="h6 mb-0 fw-medium text-gray-300">
                            72MB
                          </span>
                        </td>
                        <td>
                          <span className="h6 mb-0 fw-medium text-gray-300">
                            10 Files
                          </span>
                        </td>
                        <td>
                          <span className="text-13 py-2 px-8 bg-success-50 text-success-600 d-inline-flex align-items-center gap-8 rounded-pill">
                            <span className="w-6 h-6 bg-success-600 rounded-circle flex-shrink-0" />
                            Received
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="fixed-width">
                          <div className="form-check">
                            <input
                              className="form-check-input border-gray-200 rounded-4"
                              type="checkbox"
                            />
                          </div>
                        </td>
                        <td>
                          <div className="flex-align gap-8">
                            <img
                              src="assets/images/icons/file-icon-sm4.png"
                              alt=""
                              className
                            />
                            <span className="h6 mb-0 fw-medium text-gray-300">
                              Web Development
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="h6 mb-0 fw-medium text-gray-300">
                            Yesterday by Mir Hossain
                          </span>
                        </td>
                        <td>
                          <span className="h6 mb-0 fw-medium text-gray-300">
                            72MB
                          </span>
                        </td>
                        <td>
                          <span className="h6 mb-0 fw-medium text-gray-300">
                            10 Files
                          </span>
                        </td>
                        <td>
                          <span className="text-13 py-2 px-8 bg-success-50 text-success-600 d-inline-flex align-items-center gap-8 rounded-pill">
                            <span className="w-6 h-6 bg-success-600 rounded-circle flex-shrink-0" />
                            Received
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="fixed-width">
                          <div className="form-check">
                            <input
                              className="form-check-input border-gray-200 rounded-4"
                              type="checkbox"
                            />
                          </div>
                        </td>
                        <td>
                          <div className="flex-align gap-8">
                            <img
                              src="assets/images/icons/file-icon-sm3.png"
                              alt=""
                              className
                            />
                            <span className="h6 mb-0 fw-medium text-gray-300">
                              Web Development
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="h6 mb-0 fw-medium text-gray-300">
                            Yesterday by Mir Hossain
                          </span>
                        </td>
                        <td>
                          <span className="h6 mb-0 fw-medium text-gray-300">
                            72MB
                          </span>
                        </td>
                        <td>
                          <span className="h6 mb-0 fw-medium text-gray-300">
                            10 Files
                          </span>
                        </td>
                        <td>
                          <span className="text-13 py-2 px-8 bg-success-50 text-success-600 d-inline-flex align-items-center gap-8 rounded-pill">
                            <span className="w-6 h-6 bg-success-600 rounded-circle flex-shrink-0" />
                            Received
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="fixed-width">
                          <div className="form-check">
                            <input
                              className="form-check-input border-gray-200 rounded-4"
                              type="checkbox"
                            />
                          </div>
                        </td>
                        <td>
                          <div className="flex-align gap-8">
                            <img
                              src="assets/images/icons/file-icon-sm1.png"
                              alt=""
                              className
                            />
                            <span className="h6 mb-0 fw-medium text-gray-300">
                              Web Development
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="h6 mb-0 fw-medium text-gray-300">
                            Yesterday by Mir Hossain
                          </span>
                        </td>
                        <td>
                          <span className="h6 mb-0 fw-medium text-gray-300">
                            72MB
                          </span>
                        </td>
                        <td>
                          <span className="h6 mb-0 fw-medium text-gray-300">
                            10 Files
                          </span>
                        </td>
                        <td>
                          <span className="text-13 py-2 px-8 bg-warning-50 text-warning-600 d-inline-flex align-items-center gap-8 rounded-pill">
                            <span className="w-6 h-6 bg-warning-600 rounded-circle flex-shrink-0" />
                            Pending
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="fixed-width">
                          <div className="form-check">
                            <input
                              className="form-check-input border-gray-200 rounded-4"
                              type="checkbox"
                            />
                          </div>
                        </td>
                        <td>
                          <div className="flex-align gap-8">
                            <img
                              src="assets/images/icons/file-icon-sm4.png"
                              alt=""
                              className
                            />
                            <span className="h6 mb-0 fw-medium text-gray-300">
                              Presentation
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="h6 mb-0 fw-medium text-gray-300">
                            Yesterday by Mir Hossain
                          </span>
                        </td>
                        <td>
                          <span className="h6 mb-0 fw-medium text-gray-300">
                            72MB
                          </span>
                        </td>
                        <td>
                          <span className="h6 mb-0 fw-medium text-gray-300">
                            10 Files
                          </span>
                        </td>
                        <td>
                          <span className="text-13 py-2 px-8 bg-success-50 text-success-600 d-inline-flex align-items-center gap-8 rounded-pill">
                            <span className="w-6 h-6 bg-success-600 rounded-circle flex-shrink-0" />
                            Received
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="fixed-width">
                          <div className="form-check">
                            <input
                              className="form-check-input border-gray-200 rounded-4"
                              type="checkbox"
                            />
                          </div>
                        </td>
                        <td>
                          <div className="flex-align gap-8">
                            <img
                              src="assets/images/icons/file-icon-sm3.png"
                              alt=""
                              className
                            />
                            <span className="h6 mb-0 fw-medium text-gray-300">
                              Payment Details
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="h6 mb-0 fw-medium text-gray-300">
                            Yesterday by Mir Hossain
                          </span>
                        </td>
                        <td>
                          <span className="h6 mb-0 fw-medium text-gray-300">
                            72MB
                          </span>
                        </td>
                        <td>
                          <span className="h6 mb-0 fw-medium text-gray-300">
                            10 Files
                          </span>
                        </td>
                        <td>
                          <span className="text-13 py-2 px-8 bg-success-50 text-success-600 d-inline-flex align-items-center gap-8 rounded-pill">
                            <span className="w-6 h-6 bg-success-600 rounded-circle flex-shrink-0" />
                            Received
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="fixed-width">
                          <div className="form-check">
                            <input
                              className="form-check-input border-gray-200 rounded-4"
                              type="checkbox"
                            />
                          </div>
                        </td>
                        <td>
                          <div className="flex-align gap-8">
                            <img
                              src="assets/images/icons/file-icon-sm2.png"
                              alt=""
                              className
                            />
                            <span className="h6 mb-0 fw-medium text-gray-300">
                              Revenue Card
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="h6 mb-0 fw-medium text-gray-300">
                            Yesterday by Mir Hossain
                          </span>
                        </td>
                        <td>
                          <span className="h6 mb-0 fw-medium text-gray-300">
                            72MB
                          </span>
                        </td>
                        <td>
                          <span className="h6 mb-0 fw-medium text-gray-300">
                            10 Files
                          </span>
                        </td>
                        <td>
                          <span className="text-13 py-2 px-8 bg-danger-50 text-danger-600 d-inline-flex align-items-center gap-8 rounded-pill">
                            <span className="w-6 h-6 bg-danger-600 rounded-circle flex-shrink-0" />
                            Declined
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="fixed-width">
                          <div className="form-check">
                            <input
                              className="form-check-input border-gray-200 rounded-4"
                              type="checkbox"
                            />
                          </div>
                        </td>
                        <td>
                          <div className="flex-align gap-8">
                            <img
                              src="assets/images/icons/file-icon-sm4.png"
                              alt=""
                              className
                            />
                            <span className="h6 mb-0 fw-medium text-gray-300">
                              Invoices
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="h6 mb-0 fw-medium text-gray-300">
                            Yesterday by Mir Hossain
                          </span>
                        </td>
                        <td>
                          <span className="h6 mb-0 fw-medium text-gray-300">
                            72MB
                          </span>
                        </td>
                        <td>
                          <span className="h6 mb-0 fw-medium text-gray-300">
                            10 Files
                          </span>
                        </td>
                        <td>
                          <span className="text-13 py-2 px-8 bg-warning-50 text-warning-600 d-inline-flex align-items-center gap-8 rounded-pill">
                            <span className="w-6 h-6 bg-warning-600 rounded-circle flex-shrink-0" />
                            Pending
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              {/* List View End */}
            </div>
            <div className="card-footer border-top border-gray-100">
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
                  className="btn btn-main rounded-pill py-9 flex-align gap-4"
                >
                  Next
                  <span className="d-flex text-xl">
                    <i className="ph ph-arrow-right" />
                  </span>
                </a>
              </div>
            </div>
          </div>
          {/* Card End */}
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Resources;
