import React, { useState } from "react";
import Footer from "../../common/footer";
import Header from "../../common/header/Header";
import AdminSidebar from "../../common/AdminSidebar";
import { Link, useNavigate } from "react-router-dom";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { adminAddTest } from "../../apis/apis";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

// Validation Schema
const schema = yup.object().shape({
  test_name: yup
    .string()
    .trim()
    .required("Test title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must not exceed 50 characters"),
  test_desc: yup
    .string()
    .trim()
    .required("Description is required")
    .min(5, "Description must be at least 5 characters")
    .max(500, "Description must not exceed 150 characters"),
  test_duration: yup
    .number()
    .integer("Duration must be an integer")
    .min(1, "Duration must be at least 1 minute")
    .max(210, "Duration must not exceed 210 minutes")
    .typeError("Duration must be a number")
    .required("Duration is required")
    .positive("Duration must be greater than zero"),
  test_start_date: yup
    .date()
    .typeError("Start date is required")
    .min(
      new Date(new Date().setHours(0, 0, 0, 0)),
      "Start date cannot be in the past"
    ),
  test_end_date: yup
    .date()
    .typeError("End date is required")
    .min(yup.ref("test_start_date"), "End date must be after start date")
    .test(
      "min-time-difference",
      "End date must be at least 1 hour after the start date",
      function (value) {
        const { test_start_date } = this.parent;
        if (test_start_date && value) {
          const differenceInHours =
            (value - new Date(test_start_date)) / 1000 / 60 / 60;
          return differenceInHours >= 1; // Ensure the difference is at least 1 hour
        }
        return true;
      }
    )
    .test(
      "duration-check",
      "End date must be greater than or equal to the duration from start date",
      function (value) {
        const { test_start_date, test_duration } = this.parent;
        if (test_start_date && value && test_duration) {
          const startDate = new Date(test_start_date);
          const endDate = new Date(value);
          const differenceInMinutes = (endDate - startDate) / 1000 / 60; // Convert milliseconds to minutes
          return differenceInMinutes >= test_duration; // Ensure end date is greater than or equal to duration
        }
        return true; // Pass if dates are not set yet
      }
    ),
  test_difficulty: yup.string().required("Difficulty is required"),
  test_neg_marks: yup
    .number()
    .integer("Negative marks must be an integer")
    .min(0, "Negative marks must be at least 0")
    .max(2, "Negative marks must not exceed 2")
    .typeError("Negative marks must be a number")
    .required("Negative marks are required"),
});

function CreateTest() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // Store the image file
  const [startDate, setStartDate] = useState(""); // Store the selected start date
  const [descriptionLength, setDescriptionLength] = useState(0); // Track character count
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const toggleSidebar = () => {
    setIsSidebarActive((prevState) => !prevState);
  };

  const closeSidebar = () => {
    setIsSidebarActive(false);
  };

  const addQuizMutation = useMutation({
    mutationFn: (data) => adminAddTest(data),
    onSuccess: (data) => {
      toast.success("Test created successfully!", {
        autoClose: 1000,
        onClose: () => navigate("/admin/showTests"),
      });
      reset();
    },
    onError: (error) => {
      toast.error("Something went wrong!");
      console.log("Error:", error);
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();

    // Append all form data fields, including the image file
    Object.keys(data).forEach((key) => {
      if (key === "test_start_date") {
        console.log("Start Date:", data[key]);
      }
      // Skip appending image file as it is handled separately
      if (key !== "test_img_path") {
        formData.append(key, data[key]);
      }
    });

    // Append the selected image to FormData
    if (selectedImage) {
      formData.append("test_img_path", selectedImage);
    } else {
      // Handle case when image is not selected
      toast.error("Please upload a test thumbnail image.");
      return;
    }
    console.log("Form Data:", formData); // Debug log to check what is being sent

    // Send the form data
    addQuizMutation.mutate(formData);
  };

  const todayDate = new Date().toISOString().slice(0, 16); // Get current date in "YYYY-MM-DDTHH:MM" format

  return (
    <>
      <AdminSidebar isActive={isSidebarActive} closeSidebar={closeSidebar} />
      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={toggleSidebar} />
        <div className="dashboard-body">
          <div className="breadcrumb-with-buttons mb-24 flex-between flex-wrap gap-8">
            <div className="breadcrumb mb-24">
              <ul className="flex-align gap-4">
                <li>
                  <Link
                    to={"/admin"}
                    className="text-gray-200 fw-normal text-15 hover-text-main-600"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <span className="text-gray-500 fw-normal d-flex">
                    <i className="ph ph-caret-right" />
                  </span>
                </li>
                <li>
                  <span className="text-main-600 fw-normal text-15">
                    Create Test
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="card">
            <div className="card-header border-bottom border-gray-100 flex-align gap-8">
              <h5 className="mb-0">Test Details</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row gy-20">
                  <div className="col-xxl-3 col-md-4 col-sm-5">
                    <label className="h5 fw-semibold font-heading mb-0">
                      Thumbnail Image
                    </label>
                    <FilePond
                      name="test_img_path"
                      credits={false}
                      maxFiles={1}
                      labelIdle="Add Thumbnail Image"
                      acceptedFileTypes={["image/*"]}
                      onupdatefiles={(fileItems) => {
                        setSelectedImage(fileItems[0]?.file || null);
                      }}
                      required
                    />
                  </div>
                  <div className="col-xxl-9 col-md-8 col-sm-7">
                    <div className="row g-20">
                      <div className="col-sm-6">
                        <label className="h5 mb-8 fw-semibold font-heading">
                          Title
                        </label>
                        <input
                          type="text"
                          className="form-control py-11"
                          placeholder="Test Name"
                          maxLength={100}
                          {...register("test_name")}
                        />
                        <small className="text-danger">
                          {errors.test_name?.message}
                        </small>
                      </div>
                      <div className="col-sm-6">
                        <label className="h5 mb-8 fw-semibold font-heading">
                          Duration (in minutes)
                        </label>
                        <input
                          type="number"
                          className="form-control py-11"
                          maxLength={3}
                          placeholder="e.g. 120"
                          {...register("test_duration")}
                        />
                        <small className="text-danger">
                          {errors.test_duration?.message}
                        </small>
                      </div>
                      <div className="col-sm-12">
                        <label className="h5 mb-8 fw-semibold font-heading">
                          Description
                        </label>
                        <textarea
                          className="form-control py-11"
                          placeholder="Test Description"
                          rows={4}
                          maxLength={500}
                          {...register("test_desc")}
                          onChange={(e) =>
                            setDescriptionLength(e.target.value.length)
                          }
                        />
                        <div className="text-gray-500 text-13 mt-1">
                          {descriptionLength}/500 characters
                        </div>
                        <small className="text-danger">
                          {errors.test_desc?.message}
                        </small>
                      </div>
                      <div className="col-sm-6">
                        <label className="h5 mb-8 fw-semibold font-heading">
                          Start Date
                        </label>
                        <input
                          type="datetime-local"
                          className="form-control py-11"
                          min={todayDate}
                          {...register("test_start_date")}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                        <small className="text-danger">
                          {errors.test_start_date?.message}
                        </small>
                      </div>
                      <div className="col-sm-6">
                        <label className="h5 mb-8 fw-semibold font-heading">
                          End Date
                        </label>
                        <input
                          type="datetime-local"
                          className="form-control py-11"
                          min={startDate || todayDate}
                          {...register("test_end_date")}
                        />
                        <small className="text-danger">
                          {errors.test_end_date?.message}
                        </small>
                      </div>
                      <div className="col-sm-6">
                        <label className="h5 mb-8 fw-semibold font-heading">
                          Difficulty
                        </label>
                        <select
                          className="form-select py-9"
                          {...register("test_difficulty")}
                        >
                          <option value="">Select Difficulty</option>
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                          <option value="Time Consuming">Time Consuming</option>
                        </select>
                        <small className="text-danger">
                          {errors.test_difficulty?.message}
                        </small>
                      </div>
                      <div className="col-sm-6">
                        <label className="h5 mb-8 fw-semibold font-heading">
                          Negative Marks
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          placeholder="e.g. 0.5"
                          className="form-control py-11"
                          {...register("test_neg_marks")}
                        />
                        <small className="text-danger">
                          {errors.test_neg_marks?.message}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="flex-align justify-content-end gap-8">
                    <button
                      type="submit"
                      className="btn btn-main rounded-pill py-9"
                    >
                      Create Test
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default CreateTest;
