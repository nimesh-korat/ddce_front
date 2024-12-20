import React, { useContext, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import Select from "react-select";
import UserContext from "../../../utils/UserContex";
import { updateAcademicDetails } from "../../../apis/apis";

// Validation schema
const validationSchema = yup.object().shape({
  Enrollment_No: yup
    .string()
    .matches(/^\d{1,15}$/, "Enrollment number must be up to 15 digits")
    .min(12, "Enrollment number must be at least 12 characters")
    .max(15, "Enrollment number cannot exceed 15 characters"),
  College_Name: yup
    .string()
    .max(100, "College name cannot exceed 100 characters"),
  Branch_Name: yup.string().max(70, "Branch name cannot exceed 70 characters"),
  Semester: yup.number().typeError("Semester must be a number"),
});

// Options for branch and semester
const branchOptions = [
  { value: "aeronautical_engineering", label: "Aeronautical Engineering" },
  { value: "architecture", label: "Architecture" },
  {
    value: "ai_ml",
    label: "Artificial Intelligence (AI) & Machine Learning",
  },
  { value: "automobile_engineering", label: "Automobile Engineering" },
  { value: "automation_robotics", label: "Automation & Robotics" },
  { value: "bio_medical_engineering", label: "Bio-Medical Engineering" },
  { value: "cadcam", label: "CADCAM" },
  { value: "ceramic_technology", label: "Ceramic Technology" },
  { value: "civil_engineering", label: "Civil Engineering" },
  { value: "cloud_computing", label: "Cloud Computing & Big Data" },
  { value: "computer_engineering", label: "Computer Engineering" },
  { value: "computer_science", label: "Computer Science & Engineering" },
  { value: "electrical_engineering", label: "Electrical Engineering" },
  {
    value: "electronics_communication",
    label: "Electronics & Communication Engineering",
  },
  { value: "environmental_engineering", label: "Environmental Engineering" },
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
    label: "Plastic Engineering (Sandwitch Pattern)",
  },
  { value: "power_electronics", label: "Power Electronics" },
  { value: "printing_technology", label: "Printing Technology" },
  { value: "renewable_energy", label: "Renewable Energy" },
  { value: "textile_chemistry", label: "Textile Chemistry" },
  { value: "textile_design", label: "Textile Design" },
  {
    value: "textile_manufacturing",
    label: "Textile Manufacturing Technology",
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

function AcademicDetails({ data }) {
  const { user, setUser } = useContext(UserContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    defaultValues: {
      Enrollment_No: data?.Enrollment_No || "",
      College_Name: data?.College_Name || "",
      Branch_Name: data?.Branch_Name || "", // Only the value of the branch is used
      Semester: data?.Semester || "", // Only the value of the semester is used
    },
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (data) {
      reset({
        Enrollment_No: data?.Enrollment_No || "",
        College_Name: data?.College_Name || "",
        Branch_Name: data?.Branch_Name || "",
        Semester: data?.Semester || "",
      });
    }
  }, [data, reset]);

  const updateProfileMutation = useMutation({
    mutationFn: (formData) => updateAcademicDetails(formData),
    onSuccess: () => {
      toast.success("Academic Details Updated!", {
        autoClose: 1500,
      });
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    },
    onError: () => {
      toast.error("Error updating academic details!", {
        autoClose: 1500,
      });
    },
  });

  const onSubmit = (formData) => {
    updateProfileMutation.mutate({ ...formData, Id: user?.Id });
  };

  return (
    <div
      className="tab-pane fade"
      id="pills-profile"
      role="tabpanel"
      aria-labelledby="pills-profile-tab"
      tabIndex={0}
    >
      <div className="card mt-24">
        <div className="card-header border-bottom">
          <h4 className="mb-4">Academic Details</h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row gy-4">
              <div className="col-sm-6 col-xs-6">
                <label htmlFor="enrollment" className="form-label mb-8 h6">
                  Enrollment Number
                </label>
                <input
                  type="number"
                  className="form-control py-11"
                  id="enrollment"
                  placeholder="Enter Enrollment Number"
                  {...register("Enrollment_No")}
                />
                {errors.Enrollment_No && (
                  <span className="text-danger">
                    {errors.Enrollment_No.message}
                  </span>
                )}
              </div>
              <div className="col-sm-6 col-xs-6">
                <label htmlFor="college_name" className="form-label mb-8 h6">
                  College Name
                </label>
                <input
                  type="text"
                  className="form-control py-11"
                  id="college_name"
                  placeholder="Enter College Name"
                  {...register("College_Name")}
                />
                {errors.College_Name && (
                  <span className="text-danger">
                    {errors.College_Name.message}
                  </span>
                )}
              </div>
              <div className="col-sm-6 col-xs-6">
                <label htmlFor="branch" className="form-label mb-8 h6">
                  Branch Name
                </label>
                <Controller
                  name="Branch_Name"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={branchOptions}
                      placeholder="Select Branch"
                      className="react-select-container"
                      classNamePrefix="react-select"
                      menuPortalTarget={document.body}
                      styles={{
                        menu: (provided) => ({ ...provided, zIndex: 10 }),
                      }}
                      // Ensure value is set to the full option object
                      value={
                        branchOptions.find(
                          (option) => option.value === field.value
                        ) || null
                      }
                      onChange={(selectedOption) => {
                        field.onChange(selectedOption?.value); // Update form state with the selected value's `value`
                      }}
                    />
                  )}
                />
                {errors.Branch_Name && (
                  <span className="text-danger">
                    {errors.Branch_Name.message}
                  </span>
                )}
              </div>

              <div className="col-sm-6 col-xs-6">
                <label htmlFor="semester" className="form-label mb-8 h6">
                  Semester
                </label>
                <Controller
                  name="Semester"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={semesterOptions}
                      placeholder="Select Semester"
                      className="react-select-container"
                      classNamePrefix="react-select"
                      menuPortalTarget={document.body}
                      styles={{
                        menu: (provided) => ({ ...provided, zIndex: 10 }),
                      }}
                      // Ensure value is set to the full option object
                      value={
                        semesterOptions.find(
                          (option) => option.value === field.value
                        ) || null
                      }
                      onChange={(selectedOption) => {
                        field.onChange(selectedOption?.value); // Update form state with the selected value's `value`
                      }}
                    />
                  )}
                />
                {errors.Semester && (
                  <span className="text-danger">{errors.Semester.message}</span>
                )}
              </div>
              <div className="col-12">
                <div className="flex-align justify-content-end gap-8">
                  <button
                    type="submit"
                    className="btn btn-main rounded-pill py-9"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AcademicDetails;
