import React, { useState } from "react";
import AdminSidebar from "../../common/AdminSidebar";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminGetMaterials,
  adminAddMaterial,
  adminUpdateMaterial,
  adminDeleteMaterial,
  adminToggleSolutionVisibility,
  getSubjects,
} from "../../apis/apis";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Preloader from "../../utils/preloader/Preloader";
import MaterialModal from "./components/MaterialModal";

function AdminMaterials() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const queryClient = useQueryClient();

  const toggleSidebar = () => setIsSidebarActive((p) => !p);
  const closeSidebar = () => setIsSidebarActive(false);

  const { data: materialsData, isLoading } = useQuery({
    queryKey: ["adminMaterials"],
    queryFn: adminGetMaterials,
    staleTime: 2 * 60 * 1000,
  });

  const { data: subjectsData } = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
    staleTime: 10 * 60 * 1000,
  });

  const materials = materialsData?.data || [];
  const subjects = subjectsData?.data || [];
  // console.log(subjects);

  const addMutation = useMutation({
    mutationFn: (data) => adminAddMaterial(data),
    onSuccess: () => {
      toast.success("Material added successfully!");
      queryClient.invalidateQueries(["adminMaterials"]);
      setShowModal(false);
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to add material"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminUpdateMaterial(id, data),
    onSuccess: () => {
      toast.success("Material updated successfully!");
      queryClient.invalidateQueries(["adminMaterials"]);
      setShowModal(false);
      setEditingMaterial(null);
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to update material"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminDeleteMaterial(id),
    onSuccess: () => {
      toast.success("Material deleted!");
      queryClient.invalidateQueries(["adminMaterials"]);
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to delete"),
  });

  const toggleMutation = useMutation({
    mutationFn: (id) => adminToggleSolutionVisibility(id),
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries(["adminMaterials"]);
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to toggle"),
  });

  const handleOpenAdd = () => {
    setEditingMaterial(null);
    setShowModal(true);
  };

  const handleOpenEdit = (material) => {
    setEditingMaterial(material);
    setShowModal(true);
  };

  const handleDelete = (id, title) => {
    Swal.fire({
      title: "Delete Material?",
      text: `"${title}" will be permanently deleted.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Delete",
    }).then((r) => {
      if (r.isConfirmed) deleteMutation.mutate(id);
    });
  };

  const handleToggle = (material) => {
    if (!material.solution_url && material.solution_visible === 0) {
      toast.warning("Upload a solution PDF first before making it visible.");
      return;
    }
    toggleMutation.mutate(material.id);
  };

  const handleSubmit = (formData, id) => {
    if (id) updateMutation.mutate({ id, data: formData });
    else addMutation.mutate(formData);
  };

  return (
    <>
      <AdminSidebar isActive={isSidebarActive} closeSidebar={closeSidebar} />
      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={toggleSidebar} />
        {isLoading ? (
          <Preloader />
        ) : (
          <div className="dashboard-body">
            {/* Breadcrumb + Add */}
            <div className="breadcrumb-with-buttons mb-24 flex-between flex-wrap gap-8">
              <div className="breadcrumb mb-0">
                <ul className="flex-align gap-4">
                  <li>
                    <Link
                      to="/admin/dashboard"
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
                      Materials & Solutions
                    </span>
                  </li>
                </ul>
              </div>
              <button
                onClick={handleOpenAdd}
                className="btn btn-main rounded-pill py-9 flex-align gap-8"
              >
                <i className="ph ph-plus" />
                Add Material
              </button>
            </div>

            <div className="card border border-gray-100">
              <div className="card-body p-0">
                {materials.length === 0 ? (
                  <div className="text-center py-48">
                    <i className="ph ph-files text-64 text-gray-300 d-block mb-16" />
                    <h5 className="text-gray-500 fw-medium mb-8">
                      No materials yet
                    </h5>
                    <button
                      onClick={handleOpenAdd}
                      className="btn btn-main rounded-pill py-9"
                    >
                      Add First Material
                    </button>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-13 text-gray-500 fw-medium py-14 px-20">
                            #
                          </th>
                          <th className="text-13 text-gray-500 fw-medium py-14">
                            Title / Type
                          </th>
                          <th className="text-13 text-gray-500 fw-medium py-14">
                            Subject
                          </th>
                          <th className="text-13 text-gray-500 fw-medium py-14 text-center">
                            Material
                          </th>
                          <th className="text-13 text-gray-500 fw-medium py-14 text-center">
                            Solution
                          </th>
                          <th className="text-13 text-gray-500 fw-medium py-14 text-center">
                            Show Solution
                          </th>
                          <th className="text-13 text-gray-500 fw-medium py-14 text-center">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {materials.map((m, i) => (
                          <tr key={m.id}>
                            <td className="text-13 text-gray-600 py-12 px-20">
                              {i + 1}
                            </td>

                            {/* Title + type */}
                            <td className="py-12" style={{ maxWidth: "260px" }}>
                              <p className="text-14 fw-semibold text-gray-800 mb-2 text-truncate">
                                {m.title}
                              </p>
                              {m.material_type && (
                                <span className="text-12 bg-main-50 text-main-600 py-2 px-8 rounded-pill">
                                  {m.material_type}
                                </span>
                              )}
                              {m.description && (
                                <p
                                  className="text-12 text-gray-400 mt-4 mb-0"
                                  style={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 1,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                  }}
                                >
                                  {m.description}
                                </p>
                              )}
                            </td>

                            {/* Subject */}
                            <td className="text-13 text-gray-600 py-12">
                              {m.subject_name || "—"}
                            </td>

                            {/* Material file status */}
                            <td className="py-12 text-center">
                              {m.file_url ? (
                                <span className="text-12 py-2 px-10 rounded-pill bg-success-50 text-success-600 fw-medium">
                                  <i className="ph ph-check me-4" />
                                  Uploaded
                                </span>
                              ) : (
                                <span className="text-12 py-2 px-10 rounded-pill bg-warning-50 text-warning-600 fw-medium">
                                  <i className="ph ph-warning me-4" />
                                  Missing
                                </span>
                              )}
                            </td>

                            {/* Solution file status */}
                            <td className="py-12 text-center">
                              {m.solution_url ? (
                                <span className="text-12 py-2 px-10 rounded-pill bg-success-50 text-success-600 fw-medium">
                                  <i className="ph ph-check me-4" />
                                  Uploaded
                                </span>
                              ) : (
                                <span className="text-12 py-2 px-10 rounded-pill bg-gray-50 text-gray-500 fw-medium">
                                  <i className="ph ph-minus me-4" />
                                  Not yet
                                </span>
                              )}
                            </td>

                            {/* Toggle solution visibility */}
                            <td className="py-12 text-center">
                              <div className="d-flex align-items-center justify-content-center gap-8">
                                <div className="form-check form-switch mb-0">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    checked={m.solution_visible === 1}
                                    onChange={() => handleToggle(m)}
                                    disabled={
                                      toggleMutation.isPending ||
                                      !m.solution_url
                                    }
                                    title={
                                      !m.solution_url
                                        ? "Upload solution first"
                                        : m.solution_visible === 1
                                          ? "Click to hide solution"
                                          : "Click to show solution"
                                    }
                                  />
                                </div>
                                <span
                                  className={`text-12 fw-medium ${
                                    m.solution_visible === 1
                                      ? "text-success-600"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {m.solution_visible === 1
                                    ? "Visible"
                                    : "Hidden"}
                                </span>
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="py-12 text-center">
                              <div className="flex-align gap-8 justify-content-center">
                                <button
                                  onClick={() => handleOpenEdit(m)}
                                  className="btn btn-sm btn-outline-info-600 rounded-pill"
                                  title="Edit"
                                >
                                  <i className="ph ph-pencil text-14" />
                                </button>
                                <button
                                  onClick={() => handleDelete(m.id, m.title)}
                                  className="btn btn-sm btn-outline-danger rounded-pill"
                                  disabled={deleteMutation.isPending}
                                  title="Delete"
                                >
                                  <i className="ph ph-trash text-14" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <Footer />
      </div>

      {showModal && (
        <MaterialModal
          material={editingMaterial}
          subjects={subjects}
          onClose={() => {
            setShowModal(false);
            setEditingMaterial(null);
          }}
          onSubmit={handleSubmit}
          isLoading={addMutation.isPending || updateMutation.isPending}
        />
      )}
    </>
  );
}

export default AdminMaterials;
