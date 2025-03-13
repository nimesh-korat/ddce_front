import React, { useState } from "react";
import Preloader from "../../utils/preloader/Preloader";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import {
  resetPasswordOtpVerification,
  sendResetPasswordOtp,
} from "../../apis/apis";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import OTPInput from "react-otp-input";
import UnityLogo from "../../utils/UnityLogo";
const validationSchema = yup.object().shape({
  Phone: yup
    .string()
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number")
    .required("Phone number is required"),
});

function ForgetPassword() {
  const navigate = useNavigate();
  const [otpSent, setOtpSent] = useState(false);
  const [Phone_OTP, setPhone_OTP] = useState("");
  const [phone, setPhone] = useState("");
  const [timer, setTimer] = useState(90); // 90 seconds for the timer
  const [isResendEnabled, setIsResendEnabled] = useState(false); // To control "Resend OTP" button visibility
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
      toast.success(data.message);
      setOtpSent(true);
      startTimer(); // Start timer on successful OTP send
    },
  });

  // Start countdown timer when OTP is sent
  const startTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsResendEnabled(true); // Enable resend OTP button after timer reaches 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000); // Update timer every second
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemaining = seconds % 60;
    return `${minutes}:${secondsRemaining < 10 ? "0" : ""}${secondsRemaining}`;
  };

  const onSubmit = (data) => {
    setPhone(data.Phone); // Save the phone number
    sendOtpQuery.mutate({ ...data, method: "phone" });
  };

  const resetPasswordOtpQuery = useMutation({
    mutationFn: resetPasswordOtpVerification,
    onError: (error) => {
      toast.error(error.response.data.message);
    },
    onSuccess: (data) => {
      toast.success(data.message, {
        onClose: () => {
          navigate("/reset_password", { state: { phone } });
        },
      });
    },
  });

  const handleOtpVerification = () => {
    if (Phone_OTP.length === 6) {
      console.log("Phone_OTP:", Phone_OTP, "Phone:", phone);

      resetPasswordOtpQuery.mutate({
        otp: Phone_OTP,
        Phone: phone, // Include the phone number
      });
    } else {
      toast.error("Please enter a valid 6-digit OTP.");
    }
  };

  return (
    <>
      {resetPasswordOtpQuery.isLoading && <Preloader />}
      <div className="side-overlay" />
      <section className="auth d-flex">
        <div className="auth-left bg-main-50 flex-center p-24">
          <img src="assets/images/thumbs/auth-img3.png" alt="a" />
        </div>
        <div className="auth-right py-40 px-24 flex-center flex-column">
          <div className="auth-right__inner mx-auto w-100">
            <Link to="/" className="auth-right__logo">
              {/* <img src="assets/images/logo/logo.png" alt="a" /> */}
              <UnityLogo />
            </Link>
            <h2 className="mb-8">Forgot Password?</h2>
            <p className="text-gray-600 text-15 mb-32">
              Lost your password? Please enter your phone number. You will
              receive an OTP to create a new password via SMS.
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
                    placeholder="Enter phone number"
                    {...register("Phone")}
                  />
                  <span className="position-absolute top-50 translate-middle-y ms-16 text-gray-600 d-flex">
                    <i className="ph ph-phone" />
                  </span>
                  {otpSent && timer > 0 ? (
                    <div
                      className="position-absolute top-50 inset-inline-end-0 me-16 translate-middle-y text-primary"
                      style={{ right: "16px" }}
                    >
                      {formatTime(timer)} {/* Show the countdown timer */}
                    </div>
                  ) : (
                    isResendEnabled && (
                      <button
                        type="button"
                        className="position-absolute top-50 inset-inline-end-0 me-16 translate-middle-y text-primary"
                        onClick={() => {
                          // Trigger resend OTP logic here
                          setTimer(90);
                          setIsResendEnabled(false);
                        }}
                      >
                        Resend OTP
                      </button>
                    )
                  )}
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
                {otpSent && (
                  <>
                    <div className="mb-16">
                      <label htmlFor="otp-input" className="form-label mb-8 h6">
                        Verify Phone Number
                      </label>
                      <OTPInput
                        id="otp-input"
                        className="form-control"
                        value={Phone_OTP}
                        inputType="number"
                        onChange={setPhone_OTP}
                        numInputs={6}
                        renderSeparator={<span>-</span>}
                        inputStyle={{
                          borderRadius: "8px",
                          fontWeight: "400",
                          outline: "none",
                          width: "100%",
                          padding: "13px 16px",
                          border: "1px solid var(--gray-100)",
                          lineHeight: "1 ",
                        }}
                        renderInput={(props) => <input {...props} />}
                      />
                    </div>
                    <div className="mb-32 d-flex flex-wrap gap-8 justify-content-end w-100">
                      <button
                        onClick={handleOtpVerification}
                        type="button"
                        className="btn btn-main rounded-pill "
                        disabled={Phone_OTP.length !== 6}
                      >
                        Verify OTP
                      </button>
                    </div>
                  </>
                )}
              </div>
              {!otpSent && (
                <button
                  type="submit"
                  className="btn btn-main rounded-pill w-100"
                >
                  Send OTP
                </button>
              )}
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
