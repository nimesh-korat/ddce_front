import React from "react";
import Preloader from "../../utils/Preloader";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { sendResetPasswordOtp } from "../../apis/apis";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
const validationSchema = yup.object().shape({
  Phone: yup
    .string()
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number")
    .required("Phone number is required"),
});

function ForgetPassword() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const sendOtpQuery = useMutation({
    mutationFn: sendResetPasswordOtp,
    onError: (error) => {
      toast.error(error.response.data.message);
    },
    onSuccess: (data) => {
      toast.success(data.message, {
        onClose: () => {
          navigate("/"); // Redirect to the home page after successful login
        },
      });
    },
  });

  const onSubmit = (data) => {
    sendOtpQuery.mutate({ ...data, method: "phone" });
  };

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
            <Link to="/" className="auth-right__logo">
              <img src="assets/images/logo/logo.png" alt="a" />
            </Link>
            <h2 className="mb-8">Forgot Password?</h2>
            <p className="text-gray-600 text-15 mb-32">
              Lost your password? Please enter your email address. You will
              receive a link to create a new password via email.
            </p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-24">
                <label htmlFor="email" className="form-label mb-8 h6">
                  Phone Number
                </label>
                <div className="position-relative">
                  <input
                    type="tel"
                    className="form-control py-11 ps-40"
                    id="Phone"
                    placeholder="Type your phone number"
                    {...register("Phone")}
                  />
                  <span className="position-absolute top-50 translate-middle-y ms-16 text-gray-600 d-flex">
                    <i className="ph ph-phone" />
                  </span>
                </div>
                {/* Error message directly under input */}
                {errors.Phone && (
                  <span
                    className="text-danger mt-2"
                    style={{ fontSize: "12px" }}
                  >
                    {errors.Phone?.message}
                  </span>
                )}
              </div>
              <button type="submit" className="btn btn-main rounded-pill w-100">
                Send OTP
              </button>
              <Link
                to="/signin"
                className="my-32 text-main-600 flex-align gap-8 justify-content-center"
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

export default ForgetPassword;
