import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import OTPInput from "react-otp-input";
import { useMutation } from "@tanstack/react-query";
import {
  resendMobileOtp,
  signup1,
  smsOtpVerification,
} from "../../../apis/apis";
import { toast } from "react-toastify";

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

function Step1({ onNext }) {
  const [otpSent, setOtpSent] = useState(false);
  const [Phone_OTP, setPhone_OTP] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState(null);
  const [timer, setTimer] = useState(90); // 180 seconds for the timer
  const [isResendEnabled, setIsResendEnabled] = useState(false); // To control "Resend OTP" button visibility

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const signup1Query = useMutation({
    mutationFn: signup1,
    onError: (error) => {
      toast.error(error.response.data.message);
    },
    onSuccess: (data) => {
      toast.success(data.message);
      setOtpSent(true);
      startTimer(); // Start timer on successful OTP send
    },
  });

  const smsOtpVerificationQuery = useMutation({
    mutationFn: smsOtpVerification,
    onError: (error) => {
      toast.error(error.response.data.message);
    },
    onSuccess: (data) => {
      toast.success(data.message);

      onNext(formData.Phone_Number);
    },
  });

  const smsResendQuery = useMutation({
    mutationFn: resendMobileOtp,
    onError: (error) => {
      toast.error(error.response.data.message);
    },
    onSuccess: (data) => {
      toast.success(data.message);
      startTimer(); // Start timer on successful OTP resend
    },
  });

  const onSubmit = (data) => {
    setFormData(data);
    signup1Query.mutate(data);
  };

  const handleOtpVerification = () => {
    if (Phone_OTP.length === 6 && formData.Phone_Number) {
      smsOtpVerificationQuery.mutate({
        Phone_OTP,
        Phone_Number: formData.Phone_Number,
      }); // Pass phone number to the parent (Signup)
    }
  };

  const handleSmsOtpResend = () => {
    if (formData.Phone_Number) {
      smsResendQuery.mutate({
        Phone_Number: formData.Phone_Number,
      }); // Pass phone number to the parent (Signup)
    }
  };

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

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Name Input */}
        <div className="mb-16">
          <label htmlFor="name" className="form-label mb-8 h6">
            Name
          </label>
          <div className="position-relative d-flex align-items-center">
            <input
              type="text"
              className="form-control py-11 ps-40"
              id="Name"
              placeholder="Enter Name"
              {...register("Name")}
            />
            <span className="position-absolute top-50 translate-middle-y ms-16 text-gray-600 d-flex">
              <i className="ph ph-user" />
            </span>
          </div>
          {/* Error message directly under input */}
          {errors.Name && (
            <span className="text-danger mt-2" style={{ fontSize: "12px" }}>
              {errors.Name?.message}
            </span>
          )}
        </div>

        {/* Email Input */}
        <div className="mb-16">
          <label htmlFor="email" className="form-label mb-8 h6">
            Email
          </label>
          <div className="position-relative  d-flex align-items-center">
            <input
              type="email"
              className="form-control py-11 ps-40"
              id="Email_Id"
              placeholder="Enter Email"
              {...register("Email_Id")}
            />
            <span className="position-absolute top-50 translate-middle-y ms-16 text-gray-600 d-flex">
              <i className="ph ph-envelope" />
            </span>
          </div>
          {/* Error message directly under input */}
          {errors.Email_Id && (
            <span className="text-danger mt-2" style={{ fontSize: "12px" }}>
              {errors.Email_Id?.message}
            </span>
          )}
        </div>

        {/* Password Input */}
        <div className="mb-16">
          <label htmlFor="Password" className="form-label mb-8 h6">
            Password
          </label>
          <div className="position-relative  d-flex align-items-center">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control py-11 ps-40 pe-40"
              id="Password"
              placeholder="Enter Password"
              {...register("Password")} // Ensure this matches the validation schema
            />
            <span className="position-absolute top-50 translate-middle-y ms-16 text-gray-600 d-flex">
              <i className="ph ph-lock" />
            </span>
            <span
              className="position-absolute top-50 translate-middle-y me-16 text-gray-600 d-flex cursor-pointer"
              style={{ right: "16px" }}
              onClick={() => setShowPassword(!showPassword)}
            >
              <i className={showPassword ? "ph ph-eye" : "ph ph-eye-slash"} />
            </span>
          </div>
          {/* Error message directly under input */}
          {errors.Password && (
            <span className="text-danger mt-2" style={{ fontSize: "12px" }}>
              {errors.Password?.message}
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
            <span className="text-danger mt-2" style={{ fontSize: "12px" }}>
              {errors.confirmPassword?.message}
            </span>
          )}
        </div>

        {/* Phone Number Input */}
        <div className="mb-16">
          <label htmlFor="Phone_Number" className="form-label mb-8 h6">
            Phone Number
          </label>
          <div className="position-relative  d-flex align-items-center">
            <input
              type="tel"
              className="form-control py-11 ps-40"
              id="Phone_Number"
              placeholder="Enter Phone Number"
              {...register("Phone_Number")}
            />
            <span className="position-absolute top-50 translate-middle-y ms-16 text-gray-600 d-flex">
              <i className="ph ph-phone" />
            </span>
            {!otpSent ? (
              <button
                type="submit"
                className="position-absolute top-50 inset-inline-end-0 me-16 translate-middle-y text-primary"
              >
                Send OTP
              </button>
            ) : timer > 0 ? (
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
                    setTimer(180);
                    setIsResendEnabled(false);
                    handleSmsOtpResend();
                  }}
                >
                  Resend OTP
                </button>
              )
            )}
          </div>
          {/* Error message directly under input */}
          {errors.Phone_Number && (
            <span className="text-danger mt-2" style={{ fontSize: "12px" }}>
              {errors.Phone_Number?.message}
            </span>
          )}
        </div>

        {/* OTP Input */}
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
            <div className="mb-32  w-100">
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
        <div className="mb-32 d-flex flex-wrap gap-8 justify-content-end w-100">
          <button
            type="submit"
            disabled
            className="btn btn-main rounded-pill ms-auto"
          >
            Register
          </button>
        </div>
      </form>
    </>
  );
}

export default Step1;
