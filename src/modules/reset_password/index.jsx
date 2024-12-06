import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Preloader from "../../utils/Preloader";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../../apis/apis";
import { toast } from "react-toastify";
const validationSchema = yup.object().shape({
  newPassword: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
      "Password must include uppercase, lowercase, number, and special character"
    )
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Passwords must match")
    .required("Please confirm your password"),
});

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  //eslint-disable-next-line
  const [formData, setFormData] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const resetPasswordQuery = useMutation({
    mutationFn: resetPassword,
    onError: (error) => {
      toast.error(error.response.data.message);
    },
    onSuccess: (data) => {
      toast.success(data.message, {
        onClose: () => navigate("/signin"),
      });
    },
  });

  const onSubmit = (data) => {
    setFormData(data);
    resetPasswordQuery.mutate({ ...data, Phone: phone });
  };

  return (
    <>
      {resetPasswordQuery.isLoading && <Preloader />}
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
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Password Input */}
              <div className="mb-16">
                <label htmlFor="newPassword" className="form-label mb-8 h6">
                  Password
                </label>
                <div className="position-relative  d-flex align-items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control py-11 ps-40 pe-40"
                    id="newPassword"
                    placeholder="Enter Password"
                    {...register("newPassword")} // Ensure this matches the validation schema
                  />
                  <span className="position-absolute top-50 translate-middle-y ms-16 text-gray-600 d-flex">
                    <i className="ph ph-lock" />
                  </span>
                  <span
                    className="position-absolute top-50 translate-middle-y me-16 text-gray-600 d-flex cursor-pointer"
                    style={{ right: "16px" }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i
                      className={showPassword ? "ph ph-eye" : "ph ph-eye-slash"}
                    />
                  </span>
                </div>
                {/* Error message directly under input */}
                {errors.newPassword && (
                  <span
                    className="text-danger mt-2"
                    style={{ fontSize: "12px" }}
                  >
                    {errors.newPassword?.message}
                  </span>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="mb-16">
                <label htmlFor="confirmPassword" className="form-label mb-8 h6">
                  Confirm Password
                </label>
                <div className="position-relative d-flex align-items-center">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-control py-11 ps-40 pe-40"
                    id="confirmPassword"
                    placeholder="Confirm Password"
                    {...register("confirmPassword")} // Ensure this matches the validation schema
                  />
                  <span className="position-absolute top-50 translate-middle-y ms-16 text-gray-600 d-flex">
                    <i className="ph ph-lock" />
                  </span>
                  <span
                    className="position-absolute top-50 translate-middle-y me-16 text-gray-600 d-flex cursor-pointer"
                    style={{ right: "16px" }}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <i
                      className={
                        showConfirmPassword ? "ph ph-eye" : "ph ph-eye-slash"
                      }
                    />
                  </span>
                </div>
                {/* Error message directly under input */}
                {errors.confirmPassword && (
                  <span
                    className="text-danger mt-2"
                    style={{ fontSize: "12px" }}
                  >
                    {errors.confirmPassword?.message}
                  </span>
                )}
              </div>
              <button type="submit" className="btn btn-main rounded-pill w-100">
                Set New Password
              </button>
              <Link
                to={"/signin"}
                className="mt-24 text-main-600 flex-align gap-8 justify-content-center"
              >
                <i className="ph ph-arrow-left d-flex" /> Back To Login
              </Link>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default ResetPassword;
