import React from "react";

function ForgetPassword() {
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
            <h2 className="mb-8">Forgot Password?</h2>
            <p className="text-gray-600 text-15 mb-32">
              Lost your password? Please enter your email address. You will
              receive a link to create a new password via email.
            </p>
            <form action="#">
              <div className="mb-24">
                <label htmlFor="email" className="form-label mb-8 h6">
                  Email
                </label>
                <div className="position-relative">
                  <input
                    type="email"
                    className="form-control py-11 ps-40"
                    id="email"
                    placeholder="Type your email address"
                  />
                  <span className="position-absolute top-50 translate-middle-y ms-16 text-gray-600 d-flex">
                    <i className="ph ph-envelope" />
                  </span>
                </div>
              </div>
              <button type="submit" className="btn btn-main rounded-pill w-100">
                Send Reset Link
              </button>
              <a
                href="sign-in.html"
                className="my-32 text-main-600 flex-align gap-8 justify-content-center"
              >
                <i className="ph ph-arrow-left d-flex" /> Back To Login
              </a>
              <ul className="flex-align gap-10 flex-wrap justify-content-center">
                <li>
                  <a
                    href="https://www.facebook.com"
                    className="w-38 h-38 flex-center rounded-6 text-facebook-600 bg-facebook-50 hover-bg-facebook-600 hover-text-white text-lg"
                  >
                    <i className="ph-fill ph-facebook-logo" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.twitter.com"
                    className="w-38 h-38 flex-center rounded-6 text-twitter-600 bg-twitter-50 hover-bg-twitter-600 hover-text-white text-lg"
                  >
                    <i className="ph-fill ph-twitter-logo" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.google.com"
                    className="w-38 h-38 flex-center rounded-6 text-google-600 bg-google-50 hover-bg-google-600 hover-text-white text-lg"
                  >
                    <i className="ph ph-google-logo" />
                  </a>
                </li>
              </ul>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default ForgetPassword;
