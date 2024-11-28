import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Preloader from "../../utils/Preloader";
const validationSchema = yup.object().shape({
  Name: yup
    .string()
    .matches(/^[A-Za-z\s]+$/, "Name must contain only letters and spaces")
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name cannot exceed 50 characters")
    .required("Name is required"),
  Email_Id: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  Password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
      "Password must include uppercase, lowercase, number, and special character"
    )
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("Password"), null], "Passwords must match")
    .required("Please confirm your password"),
  Phone_Number: yup
    .string()
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number")
    .required("Phone number is required"),
});

function ResetPassword() {
  const location = useLocation();
  const phone = location.state?.phone;
  return (
    <>
      <Preloader />
      <div className="side-overlay" />
      <section className="auth d-flex">
        <div className="auth-left bg-main-50 flex-center p-24">
          <img src="assets/images/thumbs/auth-img3.png" alt="a" />
        </div>
        <div className="auth-right py-40 px-24 flex-center flex-column">
          <div className="auth-right__inner mx-auto w-100">
            <Link to="/#" className="auth-right__logo">
              <img src="assets/images/logo/logo.png" alt="a" />
            </Link>
            <h2 className="mb-8">Reset Password</h2>
            <p className="text-gray-600 text-15 mb-32">
              For Mobile No. <span className="fw-medium">{phone}</span>
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
