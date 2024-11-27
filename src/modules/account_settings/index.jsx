import React from "react";
import Sidebar from "../../common/sidebar";
import Footer from "../../common/footer";
import Header from "../../common/header/Header";

function AccountSetting() {
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
                <span className="text-main-600 fw-normal text-15">Setting</span>
              </li>
            </ul>
          </div>
          {/* Breadcrumb End */}
          <div className="card overflow-hidden">
            <div className="card-body p-0">
              <div className="cover-img position-relative">
                <label
                  htmlFor="coverImageUpload"
                  className="btn border-gray-200 text-gray-200 fw-normal hover-bg-gray-400 rounded-pill py-4 px-14 position-absolute inset-block-start-0 inset-inline-end-0 mt-24 me-24"
                >
                  Edit Cover
                </label>
                <div className="avatar-upload">
                  <input
                    type="file"
                    id="coverImageUpload"
                    accept=".png, .jpg, .jpeg"
                  />
                  <div className="avatar-preview">
                    <div
                      id="coverImagePreview"
                      style={{
                        backgroundImage:
                          'url("assets/images/thumbs/setting-cover-img.png")',
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="setting-profile px-24">
                <div className="flex-between">
                  <div className="d-flex align-items-end flex-wrap mb-32 gap-24">
                    <img
                      src="assets/images/thumbs/setting-profile-img.jpg"
                      alt=""
                      className="w-120 h-120 rounded-circle border border-white"
                    />
                    <div>
                      <h4 className="mb-8">Mohid Khan</h4>
                      <div className="setting-profile__infos flex-align flex-wrap gap-16">
                        <div className="flex-align gap-6">
                          <span className="text-gray-600 d-flex text-lg">
                            <i className="ph ph-swatches" />
                          </span>
                          <span className="text-gray-600 d-flex text-15">
                            UX Designer
                          </span>
                        </div>
                        <div className="flex-align gap-6">
                          <span className="text-gray-600 d-flex text-lg">
                            <i className="ph ph-map-pin" />
                          </span>
                          <span className="text-gray-600 d-flex text-15">
                            Sans Fransisco
                          </span>
                        </div>
                        <div className="flex-align gap-6">
                          <span className="text-gray-600 d-flex text-lg">
                            <i className="ph ph-calendar-dots" />
                          </span>
                          <span className="text-gray-600 d-flex text-15">
                            Join August 2024
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <ul
                  className="nav common-tab style-two nav-pills mb-0"
                  id="pills-tab"
                  role="tablist"
                >
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active"
                      id="pills-details-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-details"
                      type="button"
                      role="tab"
                      aria-controls="pills-details"
                      aria-selected="true"
                    >
                      My Details
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="pills-profile-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-profile"
                      type="button"
                      role="tab"
                      aria-controls="pills-profile"
                      aria-selected="false"
                    >
                      Profile
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="pills-password-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-password"
                      type="button"
                      role="tab"
                      aria-controls="pills-password"
                      aria-selected="false"
                    >
                      Password
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="pills-plan-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-plan"
                      type="button"
                      role="tab"
                      aria-controls="pills-plan"
                      aria-selected="false"
                    >
                      Plan
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="pills-billing-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-billing"
                      type="button"
                      role="tab"
                      aria-controls="pills-billing"
                      aria-selected="false"
                    >
                      Billing
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="pills-notification-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-notification"
                      type="button"
                      role="tab"
                      aria-controls="pills-notification"
                      aria-selected="false"
                    >
                      Notification
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="tab-content" id="pills-tabContent">
            {/* My Details Tab start */}
            <div
              className="tab-pane fade show active"
              id="pills-details"
              role="tabpanel"
              aria-labelledby="pills-details-tab"
              tabIndex={0}
            >
              <div className="card mt-24">
                <div className="card-header border-bottom">
                  <h4 className="mb-4">My Details</h4>
                  <p className="text-gray-600 text-15">
                    Please fill full details about yourself
                  </p>
                </div>
                <div className="card-body">
                  <form action="/#">
                    <div className="row gy-4">
                      <div className="col-sm-6 col-xs-6">
                        <label htmlFor="fname" className="form-label mb-8 h6">
                          First Name
                        </label>
                        <input
                          type="text"
                          className="form-control py-11"
                          id="fname"
                          placeholder="Enter First Name"
                        />
                      </div>
                      <div className="col-sm-6 col-xs-6">
                        <label htmlFor="lname" className="form-label mb-8 h6">
                          Last Name
                        </label>
                        <input
                          type="text"
                          className="form-control py-11"
                          id="lname"
                          placeholder="Enter Last Name"
                        />
                      </div>
                      <div className="col-sm-6 col-xs-6">
                        <label htmlFor="email" className="form-label mb-8 h6">
                          Email
                        </label>
                        <input
                          type="email"
                          className="form-control py-11"
                          id="email"
                          placeholder="Enter Email"
                        />
                      </div>
                      <div className="col-sm-6 col-xs-6">
                        <label htmlFor="phone" className="form-label mb-8 h6">
                          Phone Number
                        </label>
                        <input
                          type="number"
                          className="form-control py-11"
                          id="phone"
                          placeholder="Enter Phone Number"
                        />
                      </div>
                      <div className="col-12">
                        <label
                          htmlFor="imageUpload"
                          className="form-label mb-8 h6"
                        >
                          Your Photo
                        </label>
                        <div className="flex-align gap-22">
                          <div className="avatar-upload flex-shrink-0">
                            <input
                              type="file"
                              id="imageUpload"
                              accept=".png, .jpg, .jpeg"
                            />
                            <div className="avatar-preview">
                              <div
                                id="profileImagePreview"
                                style={{
                                  backgroundImage:
                                    'url("assets/images/thumbs/setting-profile-img.jpg")',
                                }}
                              ></div>
                            </div>
                          </div>
                          <div className="avatar-upload-box text-center position-relative flex-grow-1 py-24 px-4 rounded-16 border border-main-300 border-dashed bg-main-50 hover-bg-main-100 hover-border-main-400 transition-2 cursor-pointer">
                            <label
                              htmlFor="imageUpload"
                              className="position-absolute inset-block-start-0 inset-inline-start-0 w-100 h-100 rounded-16 cursor-pointer z-1"
                            />
                            <span className="text-32 icon text-main-600 d-inline-flex">
                              <i className="ph ph-upload" />
                            </span>
                            <span className="text-13 d-block text-gray-400 text my-8">
                              Click to upload or drag and drop
                            </span>
                            <span className="text-13 d-block text-main-600">
                              SVG, PNG, JPEG OR GIF (max 1080px1200px)
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-xs-6">
                        <label htmlFor="role" className="form-label mb-8 h6">
                          Role
                        </label>
                        <input
                          type="text"
                          className="form-control py-11"
                          id="role"
                          placeholder="Enter Role"
                        />
                      </div>
                      <div className="col-sm-6 col-xs-6">
                        <label htmlFor="zip" className="form-label mb-8 h6">
                          ZIP Code
                        </label>
                        <input
                          type="number"
                          className="form-control py-11"
                          id="zip"
                          placeholder="Enter ZIP Code"
                        />
                      </div>
                      <div className="col-12">
                        <div className="editor">
                          <label className="form-label mb-8 h6">Bio</label>
                          <div id="editor">
                            <p>
                              I'm a Product Designer based in Melbourne,
                              Australia. I specialise in UX/UI design, brand
                              strategy, and Webflow development. &nbsp;It has
                              survived not only five centuries, but also the
                              leap into electronic typesetting, remaining
                              essentially unchanged.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="flex-align justify-content-end gap-8">
                          <button
                            type="reset"
                            className="btn btn-outline-main bg-main-100 border-main-100 text-main-600 rounded-pill py-9"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="btn btn-main rounded-pill py-9"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            {/* My Details Tab End */}
            {/* Profile Tab Start */}
            <div
              className="tab-pane fade"
              id="pills-profile"
              role="tabpanel"
              aria-labelledby="pills-profile-tab"
              tabIndex={0}
            >
              <div className="row gy-4">
                <div className="col-lg-6">
                  <div className="card mt-24">
                    <div className="card-body">
                      <h6 className="mb-12">About Me</h6>
                      <p className="text-gray-600 text-15 rounded-8 border border-gray-100 p-16">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Commodo pellentesque massa tellus ac augue. Lectus arcu
                        at in in rhoncus malesuada ipsum turpis.
                      </p>
                    </div>
                  </div>
                  <div className="card mt-24">
                    <div className="card-body">
                      <h6 className="mb-12">Recent Messages</h6>
                      <div className="rounded-8 border border-gray-100 p-16 mb-16">
                        <div className="comments-box__content flex-between gap-8">
                          <div className="flex-align align-items-start gap-12">
                            <img
                              src="assets/images/thumbs/user-img1.png"
                              className="w-32 h-32 rounded-circle object-fit-cover flex-shrink-0"
                              alt="User"
                            />
                            <div>
                              <h6 className="text-lg mb-8">Michel Smith</h6>
                              <p className="text-gray-600 text-15">
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Commodo pellentesque massa
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="flex-shrink-0 fw-bold text-13 text-main-600 flex-align gap-8 hover-text-main-800"
                          >
                            Reply
                            <i className="ph ph-arrow-bend-up-left d-flex text-lg" />
                          </button>
                        </div>
                      </div>
                      <div className="rounded-8 border border-gray-100 p-16 mb-16">
                        <div className="comments-box__content flex-between gap-8">
                          <div className="flex-align align-items-start gap-12">
                            <img
                              src="assets/images/thumbs/user-img5.png"
                              className="w-32 h-32 rounded-circle object-fit-cover flex-shrink-0"
                              alt="User"
                            />
                            <div>
                              <h6 className="text-lg mb-8">Zara Maliha</h6>
                              <p className="text-gray-600 text-15">
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Commodo pellentesque massa
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="flex-shrink-0 fw-bold text-13 text-main-600 flex-align gap-8 hover-text-main-800"
                          >
                            Reply
                            <i className="ph ph-arrow-bend-up-left d-flex text-lg" />
                          </button>
                        </div>
                      </div>
                      <div className="rounded-8 border border-gray-100 p-16 mb-16">
                        <div className="comments-box__content flex-between gap-8">
                          <div className="flex-align align-items-start gap-12">
                            <img
                              src="assets/images/thumbs/user-img3.png"
                              className="w-32 h-32 rounded-circle object-fit-cover flex-shrink-0"
                              alt="User"
                            />
                            <div>
                              <h6 className="text-lg mb-8">Simon Doe</h6>
                              <p className="text-gray-600 text-15">
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Commodo pellentesque massa
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="flex-shrink-0 fw-bold text-13 text-main-600 flex-align gap-8 hover-text-main-800"
                          >
                            Reply
                            <i className="ph ph-arrow-bend-up-left d-flex text-lg" />
                          </button>
                        </div>
                      </div>
                      <div className="rounded-8 border border-gray-100 p-16 mb-16">
                        <div className="comments-box__content flex-between gap-8">
                          <div className="flex-align align-items-start gap-12">
                            <img
                              src="assets/images/thumbs/user-img4.png"
                              className="w-32 h-32 rounded-circle object-fit-cover flex-shrink-0"
                              alt="User"
                            />
                            <div>
                              <h6 className="text-lg mb-8">Elejabeth Jenny</h6>
                              <p className="text-gray-600 text-15">
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Commodo pellentesque massa
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="flex-shrink-0 fw-bold text-13 text-main-600 flex-align gap-8 hover-text-main-800"
                          >
                            Reply
                            <i className="ph ph-arrow-bend-up-left d-flex text-lg" />
                          </button>
                        </div>
                      </div>
                      <div className="rounded-8 border border-gray-100 p-16 mb-16">
                        <div className="flex-between gap-8">
                          <div className="flex-align align-items-start gap-12">
                            <img
                              src="assets/images/thumbs/user-img8.png"
                              className="w-32 h-32 rounded-circle object-fit-cover flex-shrink-0"
                              alt="User"
                            />
                            <div>
                              <h6 className="text-lg mb-8">Ronald Doe</h6>
                              <p className="text-gray-600 text-15">
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Commodo pellentesque massa
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="flex-shrink-0 fw-bold text-13 text-main-600 flex-align gap-8 hover-text-main-800"
                          >
                            Reply
                            <i className="ph ph-arrow-bend-up-left d-flex text-lg" />
                          </button>
                        </div>
                      </div>
                      <a
                        href="/#"
                        className="flex-shrink-0 fw-bold text-13 text-main-600 flex-align gap-8 hover-text-main-800 hover-text-decoration-underline"
                      >
                        View All <i className="ph ph-arrow-right" />
                      </a>
                    </div>
                  </div>
                  <div className="card mt-24">
                    <div className="card-body">
                      <h6 className="mb-12">Social Media</h6>
                      <ul className="flex-align flex-wrap gap-8">
                        <li>
                          <a
                            href="https://www.facebook.com"
                            className="flex-center w-36 h-36 border border-main-600 text-main-600 rounded-circle text-xl hover-bg-main-100 hover-border-main-800"
                          >
                            <i className="ph ph-facebook-logo" />
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://www.google.com"
                            className="flex-center w-36 h-36 border border-main-600 text-main-600 rounded-circle text-xl hover-bg-main-100 hover-border-main-800"
                          >
                            <i className="ph ph-twitter-logo" />
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://www.twitter.com"
                            className="flex-center w-36 h-36 border border-main-600 text-main-600 rounded-circle text-xl hover-bg-main-100 hover-border-main-800"
                          >
                            <i className="ph ph-linkedin-logo" />
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://www.instagram.com"
                            className="flex-center w-36 h-36 border border-main-600 text-main-600 rounded-circle text-xl hover-bg-main-100 hover-border-main-800"
                          >
                            <i className="ph ph-instagram-logo" />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="card mt-24">
                    <div className="card-body">
                      <div className="row gy-4">
                        <div className="col-xxl-4 col-xl-6 col-md-4 col-sm-6">
                          <div className="statistics-card p-xl-4 p-16 flex-align gap-10 rounded-8 bg-main-50">
                            <span className="text-white bg-main-600 w-36 h-36 rounded-circle flex-center text-xl flex-shrink-0">
                              <i className="ph ph-users-three" />
                            </span>
                            <div>
                              <h4 className="mb-0">450k</h4>
                              <span className="fw-medium text-main-600">
                                Followers
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-xxl-4 col-xl-6 col-md-4 col-sm-6">
                          <div className="statistics-card p-xl-4 p-16 flex-align gap-10 rounded-8 bg-info-50">
                            <span className="text-white bg-info-600 w-36 h-36 rounded-circle flex-center text-xl flex-shrink-0">
                              <i className="ph ph-users-three" />
                            </span>
                            <div>
                              <h4 className="mb-0">289k</h4>
                              <span className="fw-medium text-info-600">
                                Following
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-xxl-4 col-xl-6 col-md-4 col-sm-6">
                          <div className="statistics-card p-xl-4 p-16 flex-align gap-10 rounded-8 bg-purple-50">
                            <span className="text-white bg-purple-600 w-36 h-36 rounded-circle flex-center text-xl flex-shrink-0">
                              <i className="ph ph-thumbs-up" />
                            </span>
                            <div>
                              <h4 className="mb-0">1256k</h4>
                              <span className="fw-medium text-purple-600">
                                Likes
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-24">
                        <div className="flex-align gap-8 flex-wrap mb-16">
                          <span className="flex-center w-36 h-36 text-main-600 bg-main-100 rounded-circle text-xl">
                            <i className="ph ph-phone" />
                          </span>
                          <div className="flex-align gap-8 flex-wrap text-gray-600">
                            <span>+00 123 456 789</span>
                            <span>+00 123 456 789</span>
                          </div>
                        </div>
                        <div className="flex-align gap-8 flex-wrap mb-16">
                          <span className="flex-center w-36 h-36 text-main-600 bg-main-100 rounded-circle text-xl">
                            <i className="ph ph-envelope-simple" />
                          </span>
                          <div className="flex-align gap-8 flex-wrap text-gray-600">
                            <span>exampleinfo1@mail.com,</span>
                            <span>exampleinfo2@mail.com</span>
                          </div>
                        </div>
                        <div className="flex-align gap-8 flex-wrap mb-16">
                          <span className="flex-center w-36 h-36 text-main-600 bg-main-100 rounded-circle text-xl">
                            <i className="ph ph-map-pin" />
                          </span>
                          <div className="flex-align gap-8 flex-wrap text-gray-600">
                            <span>
                              Inner Circular Road, New York City, 0123
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card mt-24">
                    <div className="card-body">
                      <h6 className="mb-12">About Me</h6>
                      <div className="recent-post rounded-8 border border-gray-100 p-16 d-flex gap-12 mb-16">
                        <div className="d-inline-flex w-100 max-w-130 flex-shrink-0">
                          <img
                            src="assets/images/thumbs/recent-post-img1.png"
                            alt=""
                            className="rounded-6 cover-img max-w-130"
                          />
                        </div>
                        <div>
                          <p className="text-gray-600 text-line-3">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Commodo pellentesque massa tellus ac augue.
                            Lectus arcu at in in rhoncus malesuada ipsum turpis.
                          </p>
                          <div className="flex-align gap-8 mt-24">
                            <img
                              src="assets/images/thumbs/user-img1.png"
                              alt=""
                              className="w-32 h-32 rounded-circle cover-img"
                            />
                            <span className="text-gray-600 text-13">
                              Michel Bruice
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="recent-post rounded-8 border border-gray-100 p-16 d-flex gap-12 mb-16">
                        <div className="d-inline-flex w-100 max-w-130 flex-shrink-0">
                          <img
                            src="assets/images/thumbs/recent-post-img2.png"
                            alt=""
                            className="rounded-6 cover-img max-w-130"
                          />
                        </div>
                        <div>
                          <p className="text-gray-600 text-line-3">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Commodo pellentesque massa tellus ac augue.
                            Lectus arcu at in in rhoncus malesuada ipsum turpis.
                          </p>
                          <div className="flex-align gap-8 mt-24">
                            <img
                              src="assets/images/thumbs/user-img2.png"
                              alt=""
                              className="w-32 h-32 rounded-circle cover-img"
                            />
                            <span className="text-gray-600 text-13">
                              Sara Smith
                            </span>
                          </div>
                        </div>
                      </div>
                      <h6 className="mb-12 mt-24">Add New Post</h6>
                      <div className="editor style-two">
                        <div id="editorTwo">
                          <p>Write something new...</p>
                        </div>
                      </div>
                      <div className="flex-between flex-wrap gap-8 mt-24">
                        <div className="flex-align flex-wrap gap-8">
                          <button
                            type="button"
                            className="flex-center w-26 h-26 text-gray-600 bg-gray-50 hover-bg-gray-100 rounded-circle text-md"
                          >
                            <i className="ph ph-smiley" />
                          </button>
                          <button
                            type="button"
                            className="flex-center w-26 h-26 text-gray-600 bg-gray-50 hover-bg-gray-100 rounded-circle text-md"
                          >
                            <i className="ph ph-camera" />
                          </button>
                          <button
                            type="button"
                            className="flex-center w-26 h-26 text-gray-600 bg-gray-50 hover-bg-gray-100 rounded-circle text-md"
                          >
                            <i className="ph ph-image" />
                          </button>
                          <button
                            type="button"
                            className="flex-center w-26 h-26 text-gray-600 bg-gray-50 hover-bg-gray-100 rounded-circle text-md"
                          >
                            <i className="ph ph-video-camera" />
                          </button>
                          <button
                            type="button"
                            className="flex-center w-26 h-26 text-gray-600 bg-gray-50 hover-bg-gray-100 rounded-circle text-md"
                          >
                            <i className="ph ph-google-drive-logo" />
                          </button>
                        </div>
                        <button
                          type="submit"
                          className="btn btn-main rounded-pill py-9"
                        >
                          Post Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Profile Tab End */}
            {/* Password Tab Start */}
            <div
              className="tab-pane fade"
              id="pills-password"
              role="tabpanel"
              aria-labelledby="pills-password-tab"
              tabIndex={0}
            >
              <div className="card mt-24">
                <div className="card-header border-bottom">
                  <h4 className="mb-4">Password Settings</h4>
                  <p className="text-gray-600 text-15">
                    Please fill full details about yourself
                  </p>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <form action="/#">
                        <div className="row gy-4">
                          <div className="col-12">
                            <label
                              htmlFor="current-password"
                              className="form-label mb-8 h6"
                            >
                              Current Password
                            </label>
                            <div className="position-relative">
                              <input
                                type="password"
                                className="form-control py-11"
                                id="current-password"
                                placeholder="Enter Current Password"
                              />
                              <span
                                className="toggle-password position-absolute top-50 inset-inline-end-0 me-16 translate-middle-y ph ph-eye-slash"
                                id="#current-password"
                              />
                            </div>
                          </div>
                          <div className="col-12">
                            <label
                              htmlFor="new-password"
                              className="form-label mb-8 h6"
                            >
                              New Password
                            </label>
                            <div className="position-relative">
                              <input
                                type="password"
                                className="form-control py-11"
                                id="new-password"
                                placeholder="Enter New Password"
                              />
                              <span
                                className="toggle-password position-absolute top-50 inset-inline-end-0 me-16 translate-middle-y ph ph-eye-slash"
                                id="#new-password"
                              />
                            </div>
                          </div>
                          <div className="col-12">
                            <label
                              htmlFor="confirm-password"
                              className="form-label mb-8 h6"
                            >
                              Confirm Password
                            </label>
                            <div className="position-relative">
                              <input
                                type="password"
                                className="form-control py-11"
                                id="confirm-password"
                                placeholder="Enter Confirm Password"
                              />
                              <span
                                className="toggle-password position-absolute top-50 inset-inline-end-0 me-16 translate-middle-y ph ph-eye-slash"
                                id="#confirm-password"
                              />
                            </div>
                          </div>
                          <div className="col-12">
                            <label className="form-label mb-8 h6">
                              Password Requirements:
                            </label>
                            <ul className="list-inside">
                              <li className="text-gray-600 mb-4">
                                At least one lowercase character
                              </li>
                              <li className="text-gray-600 mb-4">
                                Minimum 8 characters long - the more, the better
                              </li>
                              <li className="text-gray-300 mb-4">
                                At least one number, symbol, or whitespace
                                character
                              </li>
                            </ul>
                          </div>
                          <div className="col-12">
                            <label className="form-label mb-8 h6">
                              Two-Step Verification
                            </label>
                            <ul>
                              <li className="text-gray-600 mb-4 fw-semibold">
                                Two-factor authentication is not enabled yet.
                              </li>
                              <li className="text-gray-600 mb-4 fw-medium">
                                Two-factor authentication adds a layer of
                                security to your account by requiring more than
                                just a password to log in. Learn more.
                              </li>
                            </ul>
                            <button
                              type="submit"
                              className="btn btn-main rounded-pill py-9 mt-24"
                            >
                              Enable two-factor authentication
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                    <div className="col-12">
                      <div className="flex-align justify-content-end gap-8">
                        <button
                          type="reset"
                          className="btn btn-outline-main bg-main-100 border-main-100 text-main-600 rounded-pill py-9"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn btn-main rounded-pill py-9"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Password Tab End */}
            {/* Plan Tab Start */}
            <div
              className="tab-pane fade"
              id="pills-plan"
              role="tabpanel"
              aria-labelledby="pills-plan-tab"
              tabIndex={0}
            >
              <div className="card mt-24">
                <div className="card-header border-bottom">
                  <h4 className="mb-4">Pricing Breakdown</h4>
                  <p className="text-gray-600 text-15">
                    Creating a detailed pricing plan for your course requries
                    considering various factors.
                  </p>
                </div>
                <div className="card-body">
                  <div className="row gy-4">
                    <div className="col-md-4 col-sm-6">
                      <div className="plan-item rounded-16 border border-gray-100 transition-2 position-relative">
                        <span className="text-2xl d-flex mb-16 text-main-600">
                          <i className="ph ph-package" />
                        </span>
                        <h3 className="mb-4">Basic Plan</h3>
                        <span className="text-gray-600">
                          Perfect plan for students
                        </span>
                        <h2 className="h1 fw-medium text-main mb-32 mt-16 pb-32 border-bottom border-gray-100 d-flex gap-4">
                          $50
                          <span className="text-md text-gray-600">/year</span>
                        </h2>
                        <ul>
                          <li className="flex-align gap-8 text-gray-600 mb-lg-4 mb-20">
                            <span className="text-24 d-flex text-main-600">
                              <i className="ph ph-check-circle" />
                            </span>
                            Intro video the course
                          </li>
                          <li className="flex-align gap-8 text-gray-600 mb-lg-4 mb-20">
                            <span className="text-24 d-flex text-main-600">
                              <i className="ph ph-check-circle" />
                            </span>
                            Interactive quizes
                          </li>
                          <li className="flex-align gap-8 text-gray-600 mb-lg-4 mb-20">
                            <span className="text-24 d-flex text-main-600">
                              <i className="ph ph-check-circle" />
                            </span>
                            Course curriculum
                          </li>
                          <li className="flex-align gap-8 text-gray-600 mb-lg-4 mb-20">
                            <span className="text-24 d-flex text-main-600">
                              <i className="ph ph-check-circle" />
                            </span>
                            Community supports
                          </li>
                          <li className="flex-align gap-8 text-gray-600 mb-lg-4 mb-20">
                            <span className="text-24 d-flex text-main-600">
                              <i className="ph ph-check-circle" />
                            </span>
                            Certificate of completion
                          </li>
                          <li className="flex-align gap-8 text-gray-600 mb-lg-4 mb-20">
                            <span className="text-24 d-flex text-main-600">
                              <i className="ph ph-check-circle" />
                            </span>
                            Sample lesson showcasing
                          </li>
                          <li className="flex-align gap-8 text-gray-600 mb-lg-4">
                            <span className="text-24 d-flex text-main-600">
                              <i className="ph ph-check-circle" />
                            </span>
                            Access to course community
                          </li>
                        </ul>
                        <a
                          href="/#"
                          className="btn btn-outline-main w-100 rounded-pill py-16 border-main-300 text-17 fw-medium mt-32"
                        >
                          Get Started
                        </a>
                      </div>
                    </div>
                    <div className="col-md-4 col-sm-6">
                      <div className="plan-item rounded-16 border border-gray-100 transition-2 position-relative active">
                        <span className="plan-badge py-4 px-16 bg-main-600 text-white position-absolute inset-inline-end-0 inset-block-start-0 mt-8 text-15">
                          Recommended
                        </span>
                        <span className="text-2xl d-flex mb-16 text-main-600">
                          <i className="ph ph-planet" />
                        </span>
                        <h3 className="mb-4">Standard Plan</h3>
                        <span className="text-gray-600">
                          For users who want to do more
                        </span>
                        <h2 className="h1 fw-medium text-main mb-32 mt-16 pb-32 border-bottom border-gray-100 d-flex gap-4">
                          $129
                          <span className="text-md text-gray-600">/year</span>
                        </h2>
                        <ul>
                          <li className="flex-align gap-8 text-gray-600 mb-lg-4 mb-20">
                            <span className="text-24 d-flex text-main-600">
                              <i className="ph ph-check-circle" />
                            </span>
                            Intro video the course
                          </li>
                          <li className="flex-align gap-8 text-gray-600 mb-lg-4 mb-20">
                            <span className="text-24 d-flex text-main-600">
                              <i className="ph ph-check-circle" />
                            </span>
                            Interactive quizes
                          </li>
                          <li className="flex-align gap-8 text-gray-600 mb-lg-4 mb-20">
                            <span className="text-24 d-flex text-main-600">
                              <i className="ph ph-check-circle" />
                            </span>
                            Course curriculum
                          </li>
                          <li className="flex-align gap-8 text-gray-600 mb-lg-4 mb-20">
                            <span className="text-24 d-flex text-main-600">
                              <i className="ph ph-check-circle" />
                            </span>
                            Community supports
                          </li>
                          <li className="flex-align gap-8 text-gray-600 mb-lg-4 mb-20">
                            <span className="text-24 d-flex text-main-600">
                              <i className="ph ph-check-circle" />
                            </span>
                            Certificate of completion
                          </li>
                          <li className="flex-align gap-8 text-gray-600 mb-lg-4 mb-20">
                            <span className="text-24 d-flex text-main-600">
                              <i className="ph ph-check-circle" />
                            </span>
                            Sample lesson showcasing
                          </li>
                          <li className="flex-align gap-8 text-gray-600 mb-lg-4">
                            <span className="text-24 d-flex text-main-600">
                              <i className="ph ph-check-circle" />
                            </span>
                            Access to course community
                          </li>
                        </ul>
                        <a
                          href="/#"
                          className="btn btn-main w-100 rounded-pill py-16 border-main-600 text-17 fw-medium mt-32"
                        >
                          Get Started
                        </a>
                      </div>
                    </div>
                    <div className="col-md-4 col-sm-6">
                      <div className="plan-item rounded-16 border border-gray-100 transition-2 position-relative">
                        <span className="text-2xl d-flex mb-16 text-main-600">
                          <i className="ph ph-trophy" />
                        </span>
                        <h3 className="mb-4">Premium Plan</h3>
                        <span className="text-gray-600">
                          Your entire friends in one place
                        </span>
                        <h2 className="h1 fw-medium text-main mb-32 mt-16 pb-32 border-bottom border-gray-100 d-flex gap-4">
                          $280
                          <span className="text-md text-gray-600">/year</span>
                        </h2>
                        <ul>
                          <li className="flex-align gap-8 text-gray-600 mb-lg-4 mb-20">
                            <span className="text-24 d-flex text-main-600">
                              <i className="ph ph-check-circle" />
                            </span>
                            Intro video the course
                          </li>
                          <li className="flex-align gap-8 text-gray-600 mb-lg-4 mb-20">
                            <span className="text-24 d-flex text-main-600">
                              <i className="ph ph-check-circle" />
                            </span>
                            Interactive quizes
                          </li>
                          <li className="flex-align gap-8 text-gray-600 mb-lg-4 mb-20">
                            <span className="text-24 d-flex text-main-600">
                              <i className="ph ph-check-circle" />
                            </span>
                            Course curriculum
                          </li>
                          <li className="flex-align gap-8 text-gray-600 mb-lg-4 mb-20">
                            <span className="text-24 d-flex text-main-600">
                              <i className="ph ph-check-circle" />
                            </span>
                            Community supports
                          </li>
                          <li className="flex-align gap-8 text-gray-600 mb-lg-4 mb-20">
                            <span className="text-24 d-flex text-main-600">
                              <i className="ph ph-check-circle" />
                            </span>
                            Certificate of completion
                          </li>
                          <li className="flex-align gap-8 text-gray-600 mb-lg-4 mb-20">
                            <span className="text-24 d-flex text-main-600">
                              <i className="ph ph-check-circle" />
                            </span>
                            Sample lesson showcasing
                          </li>
                          <li className="flex-align gap-8 text-gray-600 mb-lg-4">
                            <span className="text-24 d-flex text-main-600">
                              <i className="ph ph-check-circle" />
                            </span>
                            Access to course community
                          </li>
                        </ul>
                        <a
                          href="/#"
                          className="btn btn-outline-main w-100 rounded-pill py-16 border-main-300 text-17 fw-medium mt-32"
                        >
                          Get Started
                        </a>
                      </div>
                    </div>
                    <div className="col-12">
                      <label className="form-label mb-8 h6 mt-32">
                        Terms &amp; Policy
                      </label>
                      <ul className="list-inside">
                        <li className="text-gray-600 mb-4">
                          1. Set up multiple pricing levels with different
                          features and functionalities to maximize revenue
                        </li>
                        <li className="text-gray-600 mb-4">
                          2. Continuously test different price points and
                          discounts to find the sweet spot that resonates with
                          your target audience
                        </li>
                        <li className="text-gray-600 mb-4">
                          3. Price your course based on the perceived value it
                          provides to students, considering factors
                        </li>
                      </ul>
                      <button
                        type="button"
                        className="btn btn-main text-sm btn-sm px-24 rounded-pill py-12 d-flex align-items-center gap-2 mt-24"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                      >
                        <i className="ph ph-plus me-4" />
                        Add New Plan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Plan Tab End */}
            {/* Billing Tab Start */}
            <div
              className="tab-pane fade"
              id="pills-billing"
              role="tabpanel"
              aria-labelledby="pills-billing-tab"
              tabIndex={0}
            >
              {/* Payment Method Start */}
              <div className="card mt-24">
                <div className="card-header border-bottom">
                  <h4 className="mb-4">Payment Method</h4>
                  <p className="text-gray-600 text-15">
                    Update your billing details and address
                  </p>
                </div>
                <div className="card-body">
                  <div className="row gy-4">
                    <div className="col-lg-5">
                      <div className="card border border-gray-100">
                        <div className="card-header border-bottom border-gray-100">
                          <h6 className="mb-0">Contact Email</h6>
                        </div>
                        <div className="card-body">
                          <div className="payment-method payment-method-one form-check form-radio d-flex align-items-center justify-content-between mb-16 rounded-16 bg-main-50 p-20 cursor-pointer position-relative transition-2">
                            <div>
                              <h6 className="title mb-14">
                                Send to my email account
                              </h6>
                              <span className="d-block">
                                exampleinfo@mail.com
                              </span>
                            </div>
                            <label
                              className="position-absolute inset-block-start-0 inset-inline-start-0 w-100 h-100 cursor-pointer"
                              htmlFor="emailOne"
                            />
                            <input
                              className="form-check-input payment-method-one"
                              type="radio"
                              name="emailCheck"
                              id="emailOne"
                            />
                          </div>
                          <div className="payment-method payment-method-one form-check form-radio d-block rounded-16 bg-main-50 p-20 cursor-pointer position-relative transition-2 mt-24">
                            <div className="flex-between  mb-14 gap-4">
                              <h6 className="title mb-0">
                                Send to an alternative email
                              </h6>
                              <input
                                className="form-check-input payment-method-one"
                                type="radio"
                                name="emailCheck"
                                id="emailTwo"
                              />
                            </div>
                            <label
                              className="position-absolute inset-block-start-0 inset-inline-start-0 w-100 h-100 cursor-pointer"
                              htmlFor="emailTwo"
                            />
                            <span className="border-text d-block bg-white border border-main-200 px-20 py-8 rounded-8">
                              exampleinfo@mail.com
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-7">
                      <div className="card border border-gray-100">
                        <div className="card-header border-bottom border-gray-100 flex-between gap-8">
                          <h6 className="mb-0">Card Details</h6>
                          <a
                            href="/#"
                            className="btn btn-outline-main rounded-pill py-6"
                          >
                            Add New Card
                          </a>
                        </div>
                        <div className="card-body">
                          <div className="payment-method payment-method-two form-check form-radio d-flex align-items-center justify-content-between mb-16 rounded-16 bg-main-50 p-20 cursor-pointer position-relative transition-2">
                            <div className="flex-align align-items-start gap-16">
                              <div>
                                <img
                                  src="assets/images/thumbs/payment-method1.png"
                                  alt=""
                                  className="w-54 h-40 rounded-8"
                                />
                              </div>
                              <div>
                                <h6 className="title mb-0">
                                  Visa **** **** 5890
                                </h6>
                                <span className="d-block">
                                  Up to 60 User and 100GB team data
                                </span>
                                <div className="text-13 flex-align gap-8 mt-12 pt-12 border-top border-gray-100">
                                  <span>Set as default</span>
                                  <a href="/#" className="fw-bold">
                                    Edit
                                  </a>
                                </div>
                              </div>
                            </div>
                            <label
                              className="position-absolute inset-block-start-0 inset-inline-start-0 w-100 h-100 cursor-pointer"
                              htmlFor="visaCard"
                            />
                            <input
                              className="form-check-input payment-method-two"
                              type="radio"
                              name="cardDetails"
                              id="visaCard"
                            />
                          </div>
                          <div className="payment-method payment-method-two form-check form-radio d-flex align-items-center justify-content-between rounded-16 bg-main-50 p-20 cursor-pointer position-relative transition-2">
                            <div className="flex-align align-items-start gap-16">
                              <div>
                                <img
                                  src="assets/images/thumbs/payment-method2.png"
                                  alt=""
                                  className="w-54 h-40 rounded-8"
                                />
                              </div>
                              <div>
                                <h6 className="title mb-0">
                                  Mastercard **** **** 1895
                                </h6>
                                <span className="d-block">
                                  Up to 60 User and 100GB team data
                                </span>
                              </div>
                            </div>
                            <label
                              className="position-absolute inset-block-start-0 inset-inline-start-0 w-100 h-100 cursor-pointer"
                              htmlFor="masterCard"
                            />
                            <input
                              className="form-check-input payment-method-two"
                              type="radio"
                              name="cardDetails"
                              id="masterCard"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Payment Method End */}
              {/* Billing history Start */}
              <div className="card mt-24">
                <div className="card-header border-bottom">
                  <div className="flex-between flex-wrap  gap-16">
                    <div>
                      <h4 className="mb-4">Billing History</h4>
                      <p className="text-gray-600 text-15">
                        See the transaction you made
                      </p>
                    </div>
                    <div className="flex-align flex-wrap justify-content-end gap-8">
                      <button
                        type="button"
                        className="toggle-search-btn btn btn-outline-main bg-main-100 border-main-100 text-main-600 rounded-pill py-9"
                      >
                        Add Filter
                      </button>
                      <button
                        type="button"
                        className="btn btn-main rounded-pill py-9"
                      >
                        Download All
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card toggle-search-box border-bottom border-gray-100 rounded-0">
                  <div className="card-body">
                    <form action="/#" className="search-input-form">
                      <div className="search-input">
                        <select className="form-control form-select h6 rounded-4 mb-0 py-6 px-8">
                          <option value selected disabled>
                            Invoice Type
                          </option>
                          <option value>Credit Invoice</option>
                          <option value>Debit Invoice</option>
                          <option value>Mixed Invoice</option>
                          <option value>Commercial Invoice</option>
                        </select>
                      </div>
                      <div className="search-input">
                        <select className="form-control form-select h6 rounded-4 mb-0 py-6 px-8">
                          <option value selected disabled>
                            amount
                          </option>
                          <option value>1</option>
                          <option value>2</option>
                          <option value>3</option>
                        </select>
                      </div>
                      <div className="search-input">
                        <input
                          type="date"
                          className="form-control form-select h6 rounded-4 mb-0 py-6 px-8"
                        />
                      </div>
                      <div className="search-input">
                        <select className="form-control form-select h6 rounded-4 mb-0 py-6 px-8">
                          <option value selected disabled>
                            plan
                          </option>
                          <option value>Basic Plan</option>
                          <option value>Standard Plan</option>
                          <option value>Premium Plan </option>
                        </select>
                      </div>
                      <div className="search-input">
                        <button
                          type="submit"
                          className="btn btn-main rounded-pill py-9 w-100"
                        >
                          Apply Filter
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="card-body p-0 overflow-x-auto">
                  <table
                    id="studentTable"
                    className="table table-lg table-striped w-100"
                  >
                    <thead>
                      <tr>
                        <th className="fixed-width w-40 h-40 ps-20">
                          <div className="form-check">
                            <input
                              className="form-check-input border-gray-200 rounded-4"
                              type="checkbox"
                              id="selectAll"
                            />
                          </div>
                        </th>
                        <th className="h6 text-gray-600">
                          <span className="position-relative">Invoices</span>
                        </th>
                        <th className="h6 text-gray-600 text-center">Amount</th>
                        <th className="h6 text-gray-600 text-center">Dates</th>
                        <th className="h6 text-gray-600 text-center">Status</th>
                        <th className="h6 text-gray-600 text-center">Plan</th>
                        <th className="h6 text-gray-600 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="fixed-width w-40 h-40">
                          <div className="form-check">
                            <input
                              className="form-check-input border-gray-200 rounded-4"
                              type="checkbox"
                            />
                          </div>
                        </td>
                        <td>
                          <div className="flex-align gap-10">
                            <div className="w-32 h-32 bg-gray-50 flex-center rounded-circle p-2">
                              <img
                                src="assets/images/thumbs/invoice-logo1.png"
                                alt=""
                                className
                              />
                            </div>
                            <div>
                              <h6 className="mb-0">Design Accesibility</h6>
                              <span className="text-13 fw-medium text-gray-200">
                                Edmate - #012500
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="text-center">
                          <span className="text-gray-600">$180</span>
                        </td>
                        <td className="text-center">
                          <span className="text-gray-600">06/22/2024</span>
                        </td>
                        <td className="text-center">
                          <span className="text-success-600 bg-success-100 py-2 px-10 rounded-pill">
                            Paid
                          </span>
                        </td>
                        <td className="text-center">
                          <span className="text-gray-600">Basic</span>
                        </td>
                        <td className="text-center">
                          <button
                            type="button"
                            className="btn btn-outline-main bg-main-100 border-main-100 text-main-600 rounded-pill py-12"
                          >
                            Download
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="fixed-width w-40 h-40">
                          <div className="form-check">
                            <input
                              className="form-check-input border-gray-200 rounded-4"
                              type="checkbox"
                            />
                          </div>
                        </td>
                        <td>
                          <div className="flex-align gap-10">
                            <div className="w-32 h-32 bg-gray-50 flex-center rounded-circle p-2">
                              <img
                                src="assets/images/thumbs/invoice-logo2.png"
                                alt=""
                                className
                              />
                            </div>
                            <div>
                              <h6 className="mb-0">Design System</h6>
                              <span className="text-13 fw-medium text-gray-200">
                                Edmate - #012500
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="text-center">
                          <span className="text-gray-600">$250</span>
                        </td>
                        <td className="text-center">
                          <span className="text-gray-600">06/22/2024</span>
                        </td>
                        <td className="text-center">
                          <span className="text-info-600 bg-info-100 py-2 px-10 rounded-pill">
                            Unpaid
                          </span>
                        </td>
                        <td className="text-center">
                          <span className="text-gray-600">Professional</span>
                        </td>
                        <td className="text-center">
                          <button
                            type="button"
                            className="btn btn-outline-main bg-main-100 border-main-100 text-main-600 rounded-pill py-12"
                          >
                            Download
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="fixed-width w-40 h-40">
                          <div className="form-check">
                            <input
                              className="form-check-input border-gray-200 rounded-4"
                              type="checkbox"
                            />
                          </div>
                        </td>
                        <td>
                          <div className="flex-align gap-10">
                            <div className="w-32 h-32 bg-gray-50 flex-center rounded-circle p-2">
                              <img
                                src="assets/images/thumbs/invoice-logo1.png"
                                alt=""
                                className
                              />
                            </div>
                            <div>
                              <h6 className="mb-0">Frondend Develop</h6>
                              <span className="text-13 fw-medium text-gray-200">
                                Edmate - #012500
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="text-center">
                          <span className="text-gray-600">$128</span>
                        </td>
                        <td className="text-center">
                          <span className="text-gray-600">06/22/2024</span>
                        </td>
                        <td className="text-center">
                          <span className="text-success-600 bg-success-100 py-2 px-10 rounded-pill">
                            Paid
                          </span>
                        </td>
                        <td className="text-center">
                          <span className="text-gray-600">Basic</span>
                        </td>
                        <td className="text-center">
                          <button
                            type="button"
                            className="btn btn-outline-main bg-main-100 border-main-100 text-main-600 rounded-pill py-12"
                          >
                            Download
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="fixed-width w-40 h-40">
                          <div className="form-check">
                            <input
                              className="form-check-input border-gray-200 rounded-4"
                              type="checkbox"
                            />
                          </div>
                        </td>
                        <td>
                          <div className="flex-align gap-10">
                            <div className="w-32 h-32 bg-gray-50 flex-center rounded-circle p-2">
                              <img
                                src="assets/images/thumbs/invoice-logo1.png"
                                alt=""
                                className
                              />
                            </div>
                            <div>
                              <h6 className="mb-0">Design Usability</h6>
                              <span className="text-13 fw-medium text-gray-200">
                                Edmate - #012500
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="text-center">
                          <span className="text-gray-600">$132</span>
                        </td>
                        <td className="text-center">
                          <span className="text-gray-600">06/22/2024</span>
                        </td>
                        <td className="text-center">
                          <span className="text-info-600 bg-info-100 py-2 px-10 rounded-pill">
                            Unpaid
                          </span>
                        </td>
                        <td className="text-center">
                          <span className="text-gray-600">Basic</span>
                        </td>
                        <td className="text-center">
                          <button
                            type="button"
                            className="btn btn-outline-main bg-main-100 border-main-100 text-main-600 rounded-pill py-12"
                          >
                            Download
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="fixed-width w-40 h-40">
                          <div className="form-check">
                            <input
                              className="form-check-input border-gray-200 rounded-4"
                              type="checkbox"
                            />
                          </div>
                        </td>
                        <td>
                          <div className="flex-align gap-10">
                            <div className="w-32 h-32 bg-gray-50 flex-center rounded-circle p-2">
                              <img
                                src="assets/images/thumbs/invoice-logo4.png"
                                alt=""
                                className
                              />
                            </div>
                            <div>
                              <h6 className="mb-0">Digital Marketing</h6>
                              <span className="text-13 fw-medium text-gray-200">
                                Edmate - #012500
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="text-center">
                          <span className="text-gray-600">$186</span>
                        </td>
                        <td className="text-center">
                          <span className="text-gray-600">06/22/2024</span>
                        </td>
                        <td className="text-center">
                          <span className="text-success-600 bg-success-100 py-2 px-10 rounded-pill">
                            Paid
                          </span>
                        </td>
                        <td className="text-center">
                          <span className="text-gray-600">Advance</span>
                        </td>
                        <td className="text-center">
                          <button
                            type="button"
                            className="btn btn-outline-main bg-main-100 border-main-100 text-main-600 rounded-pill py-12"
                          >
                            Download
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="card-footer border-top border-gray-100">
                  <div className="flex-align justify-content-end gap-8">
                    <button
                      type="reset"
                      className="btn btn-outline-main bg-main-100 border-main-100 text-main-600 rounded-pill py-9"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-main rounded-pill py-9"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
              {/* Billing history End */}
            </div>
            {/* Billing Tab End */}
            {/* Notification Tab Start */}
            <div
              className="tab-pane fade"
              id="pills-notification"
              role="tabpanel"
              aria-labelledby="pills-notification-tab"
              tabIndex={0}
            >
              <div className="card mt-24">
                <div className="card-header border-bottom">
                  <h4 className="mb-4">Notifiction Settings</h4>
                  <p className="text-gray-600 text-15">
                    We may still send you important notification about your
                    account outside of your notification settings.
                  </p>
                </div>
                <div className="card-body">
                  <div className="pt-24 pb-24 border-bottom border-gray-100">
                    <div className="row gy-4">
                      <div className="col-sm-6 col-xs-6">
                        <h6 className="mb-8">Comments</h6>
                        <p className="max-w-280 text-gray-600 text-13">
                          These are notifications for comments on your posts and
                          replies to your comments
                        </p>
                      </div>
                      <div className="col-sm-6 col-xs-6">
                        <div className="form-switch switch-primary d-flex align-items-center gap-8 mb-16">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="switch1"
                          />
                          <label
                            className="form-check-label line-height-1 fw-medium text-secondary-light"
                            htmlFor="switch1"
                          >
                            Push
                          </label>
                        </div>
                        <div className="form-switch switch-primary d-flex align-items-center gap-8 mb-16">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="switch2"
                            defaultChecked
                          />
                          <label
                            className="form-check-label line-height-1 fw-medium text-secondary-light"
                            htmlFor="switch2"
                          >
                            Email
                          </label>
                        </div>
                        <div className="form-switch switch-primary d-flex align-items-center gap-8 mb-16">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="switch3"
                            defaultChecked
                          />
                          <label
                            className="form-check-label line-height-1 fw-medium text-secondary-light"
                            htmlFor="switch3"
                          >
                            SMS
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-24 pb-24 border-bottom border-gray-100">
                    <div className="row gy-4">
                      <div className="col-sm-6 col-xs-6">
                        <h6 className="mb-8">Tags</h6>
                        <p className="max-w-280 text-gray-600 text-13">
                          These are notifications for when someone tags you in a
                          comment, post or story
                        </p>
                      </div>
                      <div className="col-sm-6 col-xs-6">
                        <div className="form-switch switch-primary d-flex align-items-center gap-8 mb-16">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="switch4"
                            defaultChecked
                          />
                          <label
                            className="form-check-label line-height-1 fw-medium text-secondary-light"
                            htmlFor="switch4"
                          >
                            Push
                          </label>
                        </div>
                        <div className="form-switch switch-primary d-flex align-items-center gap-8 mb-16">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="switch5"
                          />
                          <label
                            className="form-check-label line-height-1 fw-medium text-secondary-light"
                            htmlFor="switch5"
                          >
                            Email
                          </label>
                        </div>
                        <div className="form-switch switch-primary d-flex align-items-center gap-8 mb-16">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="switch6"
                          />
                          <label
                            className="form-check-label line-height-1 fw-medium text-secondary-light"
                            htmlFor="switch6"
                          >
                            SMS
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-24 pb-24 border-bottom border-gray-100">
                    <div className="row gy-4">
                      <div className="col-sm-6 col-xs-6">
                        <h6 className="mb-8">Reminders</h6>
                        <p className="max-w-280 text-gray-600 text-13">
                          These are notifications to reminds you of updates you
                          might have missed.
                        </p>
                      </div>
                      <div className="col-sm-6 col-xs-6">
                        <div className="form-switch switch-primary d-flex align-items-center gap-8 mb-16">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="switch7"
                            defaultChecked
                          />
                          <label
                            className="form-check-label line-height-1 fw-medium text-secondary-light"
                            htmlFor="switch7"
                          >
                            Push
                          </label>
                        </div>
                        <div className="form-switch switch-primary d-flex align-items-center gap-8 mb-16">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="switch8"
                          />
                          <label
                            className="form-check-label line-height-1 fw-medium text-secondary-light"
                            htmlFor="switch8"
                          >
                            Email
                          </label>
                        </div>
                        <div className="form-switch switch-primary d-flex align-items-center gap-8 mb-16">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="switch9"
                            defaultChecked
                          />
                          <label
                            className="form-check-label line-height-1 fw-medium text-secondary-light"
                            htmlFor="switch9"
                          >
                            SMS
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-24 border-bottom border-gray-100">
                    <div className="row gy-4">
                      <div className="col-sm-6 col-xs-6">
                        <h6 className="mb-8">More activity about you</h6>
                        <p className="max-w-280 text-gray-600 text-13">
                          These are notification for posts on your profile,
                          likes and other reactions to your posts, and more.
                        </p>
                      </div>
                      <div className="col-sm-6 col-xs-6">
                        <div className="form-switch switch-primary d-flex align-items-center gap-8 mb-16">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="switch10"
                            defaultChecked
                          />
                          <label
                            className="form-check-label line-height-1 fw-medium text-secondary-light"
                            htmlFor="switch10"
                          >
                            Push
                          </label>
                        </div>
                        <div className="form-switch switch-primary d-flex align-items-center gap-8 mb-16">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="switch11"
                          />
                          <label
                            className="form-check-label line-height-1 fw-medium text-secondary-light"
                            htmlFor="switch11"
                          >
                            Email
                          </label>
                        </div>
                        <div className="form-switch switch-primary d-flex align-items-center gap-8 mb-16">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="switch12"
                            defaultChecked
                          />
                          <label
                            className="form-check-label line-height-1 fw-medium text-secondary-light"
                            htmlFor="switch12"
                          >
                            SMS
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <div className="flex-align justify-content-end gap-8">
                    <button
                      type="reset"
                      className="btn btn-outline-main bg-main-100 border-main-100 text-main-600 rounded-pill py-9"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-main rounded-pill py-9"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Notification Tab End */}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default AccountSetting;
