import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { signup2 } from "../../../apis/apis";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

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
    control,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // Options for branch and semester
  const branchOptions = [
    { value: "aeronautical_engineering", label: "Aeronautical Engineering" },
    { value: "architecture", label: "Architecture" },
    {
      value: "architectural_assistantship",
      label: "Architectural Assistantship",
    },
    {
      value: "ai_ml",
      label: "Artificial Intelligence (AI) & Machine Learning",
    },
    { value: "automobile_engineering", label: "Automobile Engineering" },
    { value: "automation_robotics", label: "Automation & Robotics" },
    { value: "bio_medical_engineering", label: "Bio-Medical Engineering" },
    { value: "cadcam", label: "CADCAM" },
    { value: "ceramic_technology", label: "Ceramic Technology" },
    { value: "chemical_engineering", label: "Chemical Technology" },
    { value: "civil_engineering", label: "Civil Engineering" },
    { value: "cloud_computing", label: "Cloud Computing & Big Data" },
    { value: "computer_engineering", label: "Computer Engineering" },
    {
      value: "computer_aided_costume_design_dress_making",
      label: "Computer Aided Costume Design & Dress Making",
    },
    { value: "computer_science", label: "Computer Science & Engineering" },
    { value: "electrical_engineering", label: "Electrical Engineering" },
    {
      value: "electronics_communication",
      label: "Electronics & Communication Engineering",
    },
    {
      value: "envirenvirenvirenvironmental_engineering",
      label: "Environmental Engineering",
    },
    { value: "fabrication_technology", label: "Fabrication Technology" },
    { value: "gaming_animation", label: "Gaming & Animation" },
    { value: "ict", label: "Information & Communication Technology" },
    { value: "information_technology", label: "Information Technology" },
    {
      value: "instrumentation_control",
      label: "Instrumentation & Control Engineering",
    },
    { value: "mechanical_cadcam", label: "Mechanical Engg (CAD/CAM)" },
    { value: "mechanical_engineering", label: "Mechanical Engineering" },
    { value: "mechatronics", label: "Mechatronics" },
    { value: "metallurgy", label: "Metallurgy" },
    { value: "mining_engineering", label: "Mining Engineering" },
    { value: "petro_chemical", label: "Petro Chemical Engineering" },
    {
      value: "plastic_engineering",
      label: "Plastic Engineering",
    },
    { value: "power_electronics", label: "Power Electronics" },
    { value: "printing_technology", label: "Printing Technology" },
    { value: "renewable_energy", label: "Renewable Energy" },
    { value: "textile_chemistry", label: "Textile Chemistry" },
    { value: "textile_design", label: "Textile Design" },
    {
      value: "textile_manufacturing",
      label: "Textile MaTextile Manufacturing Technology",
    },
    { value: "textile_processing", label: "Textile Processing Technology" },
    { value: "textile_technology", label: "Textile Technology" },
  ];

  const semesterOptions = [
    { value: 1, label: "1st Semester" },
    { value: 2, label: "2nd Semester" },
    { value: 3, label: "3rd Semester" },
    { value: 4, label: "4th Semester" },
    { value: 5, label: "5th Semester" },
    { value: 6, label: "6th Semester" },
  ];

  const signup2Query = useMutation({
    mutationFn: signup2,
    onSuccess: (data) => {
      toast.success(data.message, {
        onClose: () => navigate("/signin"),
      });
    },
    onError: (error) => {
      console.log(error.response.data.message);

      toast.error(error.response.data.message);
    },
  });

  const onSubmit = (data) => {
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
              placeholder="Enter College Name"
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
              placeholder="Enter Enrollment Number"
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
        <div className="mb-16 position-relative">
          <label htmlFor="Branch_Name" className="form-label mb-8 h6">
            Branch
          </label>
          <div className="position-relative">
            <span
              className="position-absolute ms-16 text-gray-600 d-flex"
              style={{
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
              }}
            >
              <i className="ph ph-git-branch" style={{ fontSize: "20px" }} />
            </span>

            {/* Use Controller for react-select */}
            <Controller
              name="Branch_Name"
              control={control}
              rules={{ required: "Branch selection is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={branchOptions}
                  placeholder="Select Branch"
                  className="text-black w-100"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      paddingLeft: "30px", // Adjust padding to make space for the icon
                      borderColor: state.isFocused
                        ? "#80bdff"
                        : base.borderColor,
                      boxShadow: state.isFocused
                        ? "0 0 0 0.2rem rgba(0, 123, 255, 0.25)"
                        : base.boxShadow,
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 12, // Ensure the dropdown is above other elements
                    }),
                  }}
                  value={branchOptions.find(
                    (option) => option.value === field.value
                  )}
                  onChange={(selectedOption) =>
                    field.onChange(selectedOption.value)
                  } // Transform the value
                />
              )}
            />
          </div>
          {errors.Branch_Name && (
            <span className="text-danger mt-2" style={{ fontSize: "12px" }}>
              {errors.Branch_Name?.message}
            </span>
          )}
        </div>
        {/* Semester Selection */}
        <div className="mb-16 position-relative">
          <label htmlFor="Semester" className="form-label mb-8 h6">
            Semester
          </label>
          <div className="position-relative">
            <span
              className="position-absolute ms-16 text-gray-600 d-flex"
              style={{ top: "50%", transform: "translateY(-50%)", zIndex: 10 }}
            >
              <i className="ph ph-list-numbers" style={{ fontSize: "20px" }} />
            </span>

            {/* Use Controller for react-select */}
            <Controller
              name="Semester"
              control={control}
              rules={{ required: "Semester selection is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={semesterOptions}
                  placeholder="Select Semester"
                  className="react-select-container"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      paddingLeft: "30px",
                      borderColor: state.isFocused
                        ? "#80bdff"
                        : base.borderColor,
                      boxShadow: state.isFocused
                        ? "0 0 0 0.2rem rgba(0, 123, 255, 0.25)"
                        : base.boxShadow,
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 12, // Ensure the dropdown is above other elements
                    }),
                  }}
                  value={semesterOptions.find(
                    (option) => option.value === field.value
                  )}
                  onChange={(selectedOption) =>
                    field.onChange(selectedOption.value)
                  } // Transform the value
                />
              )}
            />
          </div>
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
