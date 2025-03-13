import React, { useState } from "react";
import AdminSidebar from "../../common/AdminSidebar";
import Header from "../../common/header/Header";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { addSession } from "../../apis/apis";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

// Validation Schema
const schema = yup.object().shape({
  description: yup
    .string()
    .trim()
    .required("Description is required")
    .min(5, "Invalid description")
    .max(500, "Description must not exceed 100 characters"),
  for_who: yup.string().required("Default batch is required"),
  link: yup.string().required("Batch is required"),
});

function AddSession() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [descriptionLength, setDescriptionLength] = useState(0);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarActive((prevState) => !prevState);
  };

  const closeSidebar = () => {
    setIsSidebarActive(false);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const addQuizMutation = useMutation({
    mutationFn: (data) => addSession(data),
    onSuccess: (data) => {
      toast.success("Session created successfully!", {
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
    addQuizMutation.mutate(data);
  };

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
                    Add Session
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="container-fluid dashboard-content">
            <div className="card">
              <div className="card-header border-bottom border-gray-100 flex-align gap-8">
                <h5 className="mb-0">Session Details</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row gy-20">
                    <div className="col-xxl-12 col-md-12 col-sm-12">
                      <div className="row g-20">
                        <div className="col-sm-6">
                          <label className="h5 mb-8 fw-semibold font-heading">
                            Title
                          </label>
                          <input
                            type="text"
                            className="form-control py-11"
                            placeholder="Session Title/Description"
                            maxLength={50}
                            {...register("description")}
                            onChange={(e) =>
                              setDescriptionLength(e.target.value.length)
                            }
                          />
                          <div className="text-gray-500 text-13 mt-1">
                            {descriptionLength}/50 characters
                          </div>
                          <small className="text-danger">
                            {errors.description?.message}
                          </small>
                        </div>
                        <div className="col-sm-6">
                          <label className="h5 mb-8 fw-semibold font-heading">
                            For Who?
                          </label>
                          <select
                            className="form-control form-control-select"
                            {...register("for_who")}
                          >
                            <option value={""}>Select any one</option>
                            <option value={"Online"}>Online Student</option>
                            <option value={"Offline"}>Offline Student</option>
                            <option value={"Both"}>Both</option>
                          </select>
                          <small className="text-danger">
                            {errors.for_who?.message}
                          </small>
                        </div>

                        <div className="col-sm-12">
                          <label className="h5 mb-8 fw-semibold font-heading">
                            Session Link/Url
                          </label>
                          <input
                            type="text"
                            className="form-control py-11"
                            placeholder="Session Title/Description"
                            maxLength={100}
                            {...register("link")}
                          />
                          <small className="text-danger">
                            {errors.link?.message}
                          </small>
                        </div>
                      </div>
                    </div>
                    <div className="flex-align justify-content-end gap-8">
                      <button
                        type="submit"
                        className="btn btn-main rounded-pill py-9"
                      >
                        Add Session
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddSession;
