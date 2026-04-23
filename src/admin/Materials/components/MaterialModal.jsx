import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  title: yup
    .string()
    .trim()
    .required("Title is required")
    .min(3, "Title too short")
    .max(255, "Title too long"),
  description: yup.string().trim().max(1000, "Too long"),
  material_type: yup.string().trim().max(100, "Too long"),
});

function MaterialModal({ material, subjects, onClose, onSubmit, isLoading }) {
  const isEditing = Boolean(material);
  const [materialFile, setMaterialFile] = useState(null);
  const [solutionFile, setSolutionFile] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: material?.title || "",
      description: material?.description || "",
      material_type: material?.material_type || "",
      subject_id: material?.subject_id || "",
    },
  });

  useEffect(() => {
    reset({
      title: material?.title || "",
      description: material?.description || "",
      material_type: material?.material_type || "",
      subject_id: material?.subject_id || "",
    });
    setMaterialFile(null);
    setSolutionFile(null);
  }, [material, reset]);

  const onFormSubmit = (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description || "");
    formData.append("material_type", data.material_type || "");
    formData.append("subject_id", data.subject_id || "");
    if (materialFile) formData.append("material_file", materialFile);
    if (solutionFile) formData.append("solution_file", solutionFile);
    onSubmit(formData, isEditing ? material.id : null);
  };

  return (
    <div
      className="modal d-flex align-items-center justify-content-center"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
    >
      <div
        className="bg-white rounded-12 shadow-lg w-100"
        style={{ maxWidth: "580px", maxHeight: "92vh", overflowY: "auto" }}
      >
        {/* Header */}
        <div className="flex-between p-20 border-bottom border-gray-100">
          <h5 className="fw-semibold mb-0">
            {isEditing ? "Edit Material" : "Add New Material"}
          </h5>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm text-gray-500 p-4"
          >
            <i className="ph ph-x text-20" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="p-20">
          {/* Title */}
          <div className="mb-16">
            <label className="form-label fw-medium text-14 text-gray-700 mb-6">
              Title <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${errors.title ? "is-invalid" : ""}`}
              placeholder="e.g. MATHEMATICS - INTEGRATION SET 1"
              {...register("title")}
            />
            {errors.title && (
              <div className="invalid-feedback">{errors.title.message}</div>
            )}
          </div>

          {/* Material Type */}
          <div className="mb-16">
            <label className="form-label fw-medium text-14 text-gray-700 mb-6">
              Material Type / Category
              <span className="text-gray-400 fw-normal ms-4 text-13">
                (e.g. MATHEMATICS, PHYSICS)
              </span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. MATHEMATICS"
              {...register("material_type")}
            />
          </div>

          {/* Description */}
          <div className="mb-16">
            <label className="form-label fw-medium text-14 text-gray-700 mb-6">
              Description / Topics Covered
            </label>
            <textarea
              rows={3}
              className="form-control"
              placeholder="Briefly describe the topics covered in this material..."
              {...register("description")}
            />
          </div>

          {/* Subject */}
          <div className="mb-16">
            <label className="form-label fw-medium text-14 text-gray-700 mb-6">
              Subject
            </label>
            <select className="form-control" {...register("subject_id")}>
              <option value="">— Select Subject (optional) —</option>
              {subjects.map((s) => (
                <option key={s.Id} value={s.Id}>
                  {s.Sub_Name}
                </option>
              ))}
            </select>
          </div>

          {/* Divider */}
          <div className="border-top border-gray-100 my-20" />

          {/* Material PDF Upload */}
          <div className="mb-16">
            <label className="form-label fw-medium text-14 text-gray-700 mb-6">
              <i className="ph ph-file-pdf me-6 text-danger-600" />
              Material PDF
              {isEditing && material?.file_url && (
                <span className="ms-8 text-12 text-success-600 fw-normal">
                  <i className="ph ph-check-circle me-4" />
                  Already uploaded — upload new to replace
                </span>
              )}
              {isEditing && !material?.file_url && (
                <span className="ms-8 text-12 text-warning-600 fw-normal">
                  Not uploaded yet
                </span>
              )}
            </label>
            <input
              type="file"
              className="form-control"
              accept=".pdf"
              onChange={(e) => setMaterialFile(e.target.files[0] || null)}
            />
            {materialFile && (
              <p className="text-12 text-success-600 mt-4">
                <i className="ph ph-check-circle me-4" />
                {materialFile.name}
              </p>
            )}
          </div>

          {/* Solution PDF Upload */}
          <div className="mb-16">
            <label className="form-label fw-medium text-14 text-gray-700 mb-6">
              <i className="ph ph-file-pdf me-6 text-main-600" />
              Solution PDF
              <span className="text-gray-400 fw-normal ms-4 text-13">
                (can be uploaded later)
              </span>
              {isEditing && material?.solution_url && (
                <span className="ms-8 text-12 text-success-600 fw-normal">
                  <i className="ph ph-check-circle me-4" />
                  Already uploaded — upload new to replace
                </span>
              )}
            </label>
            <input
              type="file"
              className="form-control"
              accept=".pdf"
              onChange={(e) => setSolutionFile(e.target.files[0] || null)}
            />
            {solutionFile && (
              <p className="text-12 text-success-600 mt-4">
                <i className="ph ph-check-circle me-4" />
                {solutionFile.name}
              </p>
            )}
            <p className="text-12 text-gray-400 mt-6">
              <i className="ph ph-info me-4" />
              Solution visibility is controlled separately via the toggle in the
              table. Uploading the solution here does NOT automatically show it
              to students.
            </p>
          </div>

          {/* Footer */}
          <div className="flex-align gap-12 justify-content-end mt-20 pt-16 border-top border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary rounded-pill py-9 px-20"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-main rounded-pill py-9 px-24"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-6" />
                  Saving...
                </>
              ) : isEditing ? (
                "Update Material"
              ) : (
                "Add Material"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MaterialModal;
