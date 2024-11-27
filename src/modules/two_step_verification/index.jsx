import React from "react";

function TwoStepVerification() {
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
          <img src="assets/images/thumbs/auth-img5.png" alt="" />
        </div>
        <div className="auth-right py-40 px-24 flex-center flex-column">
          <div className="auth-right__inner mx-auto w-100">
            <a href="index.html" className="auth-right__logo">
              <img src="assets/images/logo/logo.png" alt="" />
            </a>
            <h2 className="mb-8">Two-Step Varification</h2>
            <p className="text-gray-600 text-15 mb-32">
              We sent a verification code to your mobile. Enter the code from
              the mobile in the field below.
              <span className="fw-medium d-block"> ***123</span>
            </p>
            <form action="#">
              <div className="mb-32">
                <label className="form-label mb-8 h6">
                  Type your 6 digit security code
                </label>
                <div className="squire-input-wrapper flex-align">
                  <input
                    type="text"
                    className="squire-input form-control text-center p-6"
                    maxLength={1}
                    defaultValue={0}
                  />
                  <input
                    type="text"
                    className="squire-input form-control text-center p-6"
                    maxLength={1}
                    defaultValue={0}
                  />
                  <input
                    type="text"
                    className="squire-input form-control text-center p-6"
                    maxLength={1}
                    defaultValue={0}
                  />
                  <input
                    type="text"
                    className="squire-input form-control text-center p-6"
                    maxLength={1}
                    defaultValue={0}
                  />
                  <input
                    type="text"
                    className="squire-input form-control text-center p-6"
                    maxLength={1}
                    defaultValue={0}
                  />
                  <input
                    type="text"
                    className="squire-input form-control text-center p-6"
                    maxLength={1}
                    defaultValue={0}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-main rounded-pill w-100">
                Verify Now
              </button>
            </form>
            <p className="mt-24 text-gray-600 text-center">
              Didn't get the mail?
              <a
                href="forgot-password.html"
                className="text-main-600 hover-text-decoration-underline"
              >
                Resend
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default TwoStepVerification;
