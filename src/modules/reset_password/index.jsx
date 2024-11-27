import React from "react";

function ResetPassword() {
  return (
    <>
      {/*==================== Preloader Start ====================*/}
      <div className="preloader">
        <div className="loader" />
      </div>
      {/*==================== Preloader End ====================*/}
      {/*==================== Sidebar Overlay End ====================*/}
      <div className="side-overlay" />
      {/*==================== Sidebar Overlay End ====================*/}
      <section className="auth d-flex">
        <div className="auth-left bg-main-50 flex-center p-24">
          <img src="assets/images/thumbs/auth-img3.png" alt="a" />
        </div>
        <div className="auth-right py-40 px-24 flex-center flex-column">
          <div className="auth-right__inner mx-auto w-100">
            <a href="index.html" className="auth-right__logo">
              <img src="assets/images/logo/logo.png" alt="a" />
            </a>
            <h2 className="mb-8">Reset Password</h2>
            <p className="text-gray-600 text-15 mb-32">
              For <span className="fw-medium"> exampleinfo@mail.com</span>
            </p>
            <form action="#">
              <div className="mb-24">
                <label htmlFor="new-password" className="form-label mb-8 h6">
                  New Password
                </label>
                <div className="position-relative">
                  <input
                    type="password"
                    className="form-control py-11 ps-40"
                    id="new-password"
                    placeholder="Enter New Password"
                    defaultValue="password"
                  />
                  <span className="position-absolute top-50 translate-middle-y ms-16 text-gray-600 d-flex">
                    <i className="ph ph-lock" />
                  </span>
                  <span
                    className="toggle-password position-absolute top-50 inset-inline-end-0 me-16 translate-middle-y ph ph-eye-slash"
                    id="#current-password"
                  />
                </div>
              </div>
              <div className="mb-24">
                <label
                  htmlFor="confirm-password"
                  className="form-label mb-8 h6"
                >
                  Confirm Password
                </label>
                <div className="position-relative">
                  <input
                    type="password"
                    className="form-control py-11 ps-40"
                    id="confirm-password"
                    placeholder="Enter Confirm Password"
                    defaultValue="password"
                  />
                  <span className="position-absolute top-50 translate-middle-y ms-16 text-gray-600 d-flex">
                    <i className="ph ph-lock" />
                  </span>
                  <span
                    className="toggle-password position-absolute top-50 inset-inline-end-0 me-16 translate-middle-y ph ph-eye-slash"
                    id="#confirm-password"
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-main rounded-pill w-100">
                Set New Password
              </button>
              <a
                href="sign-in.html"
                className="mt-24 text-main-600 flex-align gap-8 justify-content-center"
              >
                <i className="ph ph-arrow-left d-flex" /> Back To Login
              </a>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default ResetPassword;
