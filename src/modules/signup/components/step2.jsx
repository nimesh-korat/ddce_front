import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { signup2 } from "../../../apis/apis";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Validation schema using yup
const validationSchema = yup.object().shape({
  College_Name: yup
    .string()
    .min(3, "College name must be at least 3 characters")
    .max(100, "College name cannot exceed 100 characters")
    .required("College name is required"),
  Enrollment_No: yup
    .string()
    .matches(/^[0-9]+$/, "Enrollment number must be a number")
    .min(6, "Enrollment number must be at least 6 digits")
    .max(15, "Enrollment number cannot exceed 15 digits")
    .required("Enrollment number is required"),
  Branch_Name: yup.string().required("Branch selection is required"),
  Semester: yup
    .string()
    .matches(/^[1-8]$/, "Select a valid semester")
    .required("Semester selection is required"),
});

function Step2({ phoneNumber }) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const signup2Query = useMutation({
    mutationFn: signup2,
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
    console.log("Step 2 Data:", data);
    console.log("Phone Number:", phoneNumber);
    signup2Query.mutate({ ...data, Phone_Number: phoneNumber });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* College Name Input */}
        <div className="mb-16">
          <label htmlFor="College_Name" className="form-label mb-8 h6">
            College Name
          </label>
          <div className="position-relative d-flex align-items-center">
            <input
              type="text"
              className="form-control py-11 ps-40"
              id="College_Name"
              placeholder="Type your college name"
              {...register("College_Name")}
            />
            <span className="position-absolute ms-16 text-gray-600 d-flex">
              <i
                className="ph ph-graduation-cap"
                style={{ fontSize: "20px" }}
              />
            </span>
          </div>
          {/* Error message directly under input */}
          {errors.College_Name && (
            <span className="text-danger mt-2" style={{ fontSize: "12px" }}>
              {errors.College_Name?.message}
            </span>
          )}
        </div>

        {/* Enrollment Number Input */}
        <div className="mb-16">
          <label htmlFor="Enrollment_No" className="form-label mb-8 h6">
            Enrollment Number
          </label>
          <div className="position-relative d-flex align-items-center">
            <input
              type="text"
              className="form-control py-11 ps-40"
              id="Enrollment_No"
              placeholder="Type your enrollment number"
              {...register("Enrollment_No")}
            />
            <span className="position-absolute ms-16 text-gray-600 d-flex">
              <i
                className="ph ph-identification-card"
                style={{ fontSize: "20px" }}
              />
            </span>
          </div>
          {/* Error message directly under input */}
          {errors.Enrollment_No && (
            <span className="text-danger mt-2" style={{ fontSize: "12px" }}>
              {errors.Enrollment_No?.message}
            </span>
          )}
        </div>

        {/* Branch Selection */}
        <div className="mb-16">
          <label htmlFor="Branch_Name" className="form-label mb-8 h6">
            Branch
          </label>
          <div className="position-relative d-flex align-items-center">
            <select
              className="form-control py-11 ps-40 text-black"
              id="Branch_Name"
              {...register("Branch_Name")}
            >
              <option value="">Select Your Branch</option>
              <option value="it">Information Technology</option>
              <option value="ce">Computer Engineering</option>
              <option value="cs">Computer Science</option>
            </select>
            <span className="position-absolute ms-16 text-gray-600 d-flex">
              <i className="ph ph-git-branch" style={{ fontSize: "20px" }} />
            </span>
          </div>
          {/* Error message directly under input */}
          {errors.Branch_Name && (
            <span className="text-danger mt-2" style={{ fontSize: "12px" }}>
              {errors.Branch_Name?.message}
            </span>
          )}
        </div>

        {/* Semester Selection */}
        <div className="mb-16">
          <label htmlFor="Semester" className="form-label mb-8 h6">
            Semester
          </label>
          <div className="position-relative d-flex align-items-center">
            <select
              className="form-control py-11 ps-40"
              id="Semester"
              {...register("Semester")}
            >
              <option value="">Select Your Semester</option>
              <option value="1">1st Semester</option>
              <option value="2">2nd Semester</option>
              <option value="3">3rd Semester</option>
              <option value="4">4th Semester</option>
              <option value="5">5th Semester</option>
              <option value="6">6th Semester</option>
              <option value="7">7th Semester</option>
              <option value="8">8th Semester</option>
            </select>
            <span className="position-absolute ms-16 text-gray-600 d-flex">
              <i className="ph ph-list-numbers" style={{ fontSize: "20px" }} />
            </span>
          </div>
          {/* Error message directly under input */}
          {errors.Semester && (
            <span className="text-danger mt-2" style={{ fontSize: "12px" }}>
              {errors.Semester?.message}
            </span>
          )}
        </div>

        {/* Register Button */}
        <div className="mb-32 d-flex flex-wrap gap-8 justify-content-end w-100">
          <button type="submit" className="btn btn-main rounded-pill ms-auto">
            Register
          </button>
        </div>
      </form>
    </>
  );
}

export default Step2;
