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
  getSubjects,
  getAdminMaterials,
  assignMaterialToBatch,
  updateMaterialAssignment,
  removeMaterialAssignment,
  getAllBatch,
  getAllPhase,
} from "../../apis/apis";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Preloader from "../../utils/preloader/Preloader";
import MaterialModal from "./components/MaterialModal";

// ── Searchable Select ─────────────────────────────────────────
function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  labelKey = "label",
  valueKey = "value",
}) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const ref = React.useRef(null);
  const filtered = options.filter((o) =>
    String(o[labelKey] || "")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const selected = options.find((o) => String(o[valueKey]) === String(value));
  React.useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} style={{ position: "relative", minWidth: "160px" }}>
      <div
        onClick={() => {
          setOpen((o) => !o);
          setSearch("");
        }}
        className="form-control form-control-sm d-flex align-items-center justify-content-between"
        style={{
          cursor: "pointer",
          userSelect: "none",
          minHeight: "32px",
          fontSize: "13px",
        }}
      >
        <span className={selected ? "text-gray-800" : "text-gray-400"}>
          {selected ? selected[labelKey] : placeholder}
        </span>
        <i
          className={`ph ph-caret-${open ? "up" : "down"} text-gray-400 text-11 ms-6`}
        />
      </div>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            minWidth: "180px",
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            zIndex: 9999,
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "6px", borderBottom: "1px solid #f1f5f9" }}>
            <div className="position-relative">
              <i
                className="ph ph-magnifying-glass position-absolute text-gray-400"
                style={{
                  top: "50%",
                  left: "7px",
                  transform: "translateY(-50%)",
                  fontSize: "12px",
                  pointerEvents: "none",
                }}
              />
              <input
                autoFocus
                type="text"
                className="form-control form-control-sm"
                style={{ paddingLeft: "26px", fontSize: "12px" }}
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div style={{ maxHeight: "180px", overflowY: "auto" }}>
            <div
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              style={{
                padding: "7px 12px",
                fontSize: "13px",
                cursor: "pointer",
                color: "#94a3b8",
                fontStyle: "italic",
                background: !value ? "#f8fafc" : "transparent",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f8fafc")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = !value
                  ? "#f8fafc"
                  : "transparent")
              }
            >
              {placeholder}
            </div>
            {filtered.length === 0 && (
              <div
                style={{
                  padding: "10px 12px",
                  fontSize: "12px",
                  color: "#94a3b8",
                  textAlign: "center",
                }}
              >
                No results
              </div>
            )}
            {filtered.map((o) => (
              <div
                key={o[valueKey]}
                onClick={() => {
                  onChange(String(o[valueKey]));
                  setOpen(false);
                  setSearch("");
                }}
                style={{
                  padding: "7px 12px",
                  fontSize: "13px",
                  cursor: "pointer",
                  background:
                    String(o[valueKey]) === String(value)
                      ? "#ede9fe"
                      : "transparent",
                  color:
                    String(o[valueKey]) === String(value)
                      ? "#6366f1"
                      : "#374151",
                  fontWeight: String(o[valueKey]) === String(value) ? 600 : 400,
                }}
                onMouseEnter={(e) => {
                  if (String(o[valueKey]) !== String(value))
                    e.currentTarget.style.background = "#f8fafc";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    String(o[valueKey]) === String(value)
                      ? "#ede9fe"
                      : "transparent";
                }}
              >
                {o[labelKey]}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AdminMaterials() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [assignOpen, setAssignOpen] = useState(null); // material id with open assign panel
  const [assignForm, setAssignForm] = useState({
    tbl_batch: "",
    tbl_phase: "",
  });
  const queryClient = useQueryClient();

  const toggleSidebar = () => setIsSidebarActive((p) => !p);
  const closeSidebar = () => setIsSidebarActive(false);

  const { data: materialsData, isLoading } = useQuery({
    queryKey: ["adminMaterials"],
    queryFn: getAdminMaterials,
    staleTime: 2 * 60 * 1000,
  });

  const { data: batchData } = useQuery({
    queryKey: ["allBatch"],
    queryFn: getAllBatch,
    staleTime: 5 * 60 * 1000,
  });
  const { data: phaseData } = useQuery({
    queryKey: ["allPhase"],
    queryFn: getAllPhase,
    staleTime: 5 * 60 * 1000,
  });
  const batches = batchData || [];
  const phases = phaseData || [];

  const assignMutation = useMutation({
    mutationFn: (data) => assignMaterialToBatch(data),
    onSuccess: () => {
      toast.success("Assigned!");
      queryClient.invalidateQueries(["adminMaterials"]);
      setAssignForm({ tbl_batch: "", tbl_phase: "" });
    },
    onError: (e) =>
      toast.error(e?.response?.data?.message || "Failed to assign"),
  });

  const toggleVisibleMutation = useMutation({
    mutationFn: ({ id, ...data }) => updateMaterialAssignment(id, data),
    onSuccess: () => {
      toast.success("Updated!");
      queryClient.invalidateQueries(["adminMaterials"]);
    },
    onError: () => toast.error("Failed to update"),
  });

  const removeAssignMutation = useMutation({
    mutationFn: (id) => removeMaterialAssignment(id),
    onSuccess: () => {
      toast.success("Removed!");
      queryClient.invalidateQueries(["adminMaterials"]);
    },
    onError: () => toast.error("Failed to remove"),
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
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {materials.map((m, i) => (
                          <React.Fragment key={m.id}>
                            <tr>
                              <td className="text-13 text-gray-600 py-12 px-20">
                                {i + 1}
                              </td>

                              {/* Title + type */}
                              <td
                                className="py-12"
                                style={{ maxWidth: "260px" }}
                              >
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

                              {/* Actions */}
                              <td className="py-12 text-center">
                                <div className="flex-align gap-8 justify-content-center">
                                  <button
                                    onClick={() => {
                                      setAssignOpen(
                                        assignOpen === m.id ? null : m.id,
                                      );
                                      setAssignForm({
                                        tbl_batch: "",
                                        tbl_phase: "",
                                      });
                                    }}
                                    className={`btn btn-sm rounded-pill ${assignOpen === m.id ? "btn-main" : "btn-main"}`}
                                    title="Manage Batches"
                                  >
                                    <i className="ph ph-users-three text-14" />
                                  </button>
                                  <button
                                    onClick={() => handleOpenEdit(m)}
                                    className="btn btn-sm btn-info rounded-pill"
                                    title="Edit"
                                  >
                                    <i className="ph ph-pencil text-14" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(m.id, m.title)}
                                    className="btn btn-sm btn-danger rounded-pill"
                                    disabled={deleteMutation.isPending}
                                    title="Delete"
                                  >
                                    <i className="ph ph-trash text-14" />
                                  </button>
                                </div>
                              </td>
                            </tr>

                            {/* Inline batch assignment panel */}
                            {assignOpen === m.id && (
                              <tr>
                                <td colSpan={7} className="p-0">
                                  <div className="bg-gray-50 border-top border-bottom border-gray-100 px-20 py-16">
                                    <p className="text-13 fw-semibold text-gray-600 mb-12">
                                      <i className="ph ph-users-three me-6 text-main-600" />
                                      Batch Assignments —{" "}
                                      <span className="text-main-600">
                                        {m.title}
                                      </span>
                                    </p>

                                    {/* Assign form */}
                                    <div className="flex-align gap-10 flex-wrap mb-16">
                                      <SearchableSelect
                                        options={batches.map((b) => ({
                                          label: b.batch_title,
                                          value: b.id,
                                        }))}
                                        value={assignForm.tbl_batch}
                                        onChange={(v) =>
                                          setAssignForm((f) => ({
                                            ...f,
                                            tbl_batch: v,
                                          }))
                                        }
                                        placeholder="Select Batch *"
                                      />
                                      <SearchableSelect
                                        options={phases.map((p) => ({
                                          label: p.title,
                                          value: p.Id,
                                        }))}
                                        value={assignForm.tbl_phase}
                                        onChange={(v) =>
                                          setAssignForm((f) => ({
                                            ...f,
                                            tbl_phase: v,
                                          }))
                                        }
                                        placeholder="All Phases"
                                      />
                                      <button
                                        className="btn btn-sm btn-main rounded-pill flex-align gap-6"
                                        disabled={
                                          !assignForm.tbl_batch ||
                                          assignMutation.isPending
                                        }
                                        onClick={() =>
                                          assignMutation.mutate({
                                            material_id: m.id,
                                            tbl_batch: assignForm.tbl_batch,
                                            tbl_phase:
                                              assignForm.tbl_phase || null,
                                          })
                                        }
                                      >
                                        <i className="ph ph-plus text-12" />{" "}
                                        Assign
                                      </button>
                                    </div>

                                    {/* Existing assignments */}
                                    {m.assignments?.length === 0 ? (
                                      <p className="text-13 text-gray-400 mb-0">
                                        No batches assigned yet.
                                      </p>
                                    ) : (
                                      <div className="table-responsive">
                                        <table className="table table-sm mb-0 bg-white rounded-8 overflow-hidden">
                                          <thead className="bg-gray-100">
                                            <tr>
                                              <th className="text-12 text-gray-500 fw-medium py-8 px-12">
                                                Batch
                                              </th>
                                              <th className="text-12 text-gray-500 fw-medium py-8">
                                                Phase
                                              </th>
                                              <th className="text-12 text-gray-500 fw-medium py-8 text-center">
                                                Material
                                              </th>
                                              <th className="text-12 text-gray-500 fw-medium py-8 text-center">
                                                Solution
                                              </th>
                                              <th className="text-12 text-gray-500 fw-medium py-8 text-center">
                                                Remove
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {m.assignments.map((a) => (
                                              <tr key={a.assignment_id}>
                                                <td className="text-13 fw-medium text-gray-700 py-8 px-12">
                                                  {a.batch_title}
                                                </td>
                                                <td className="text-13 text-gray-500 py-8">
                                                  {a.phase_title ||
                                                    "All Phases"}
                                                </td>
                                                <td className="py-8 text-center">
                                                  <label
                                                    className="d-flex align-items-center justify-content-center gap-6 mb-0"
                                                    style={{
                                                      cursor: "pointer",
                                                    }}
                                                  >
                                                    <div
                                                      style={{
                                                        width: "36px",
                                                        height: "20px",
                                                        borderRadius: "10px",
                                                        position: "relative",
                                                        background: a.is_visible
                                                          ? "#22c55e"
                                                          : "#e2e8f0",
                                                        transition:
                                                          "background 0.2s",
                                                        flexShrink: 0,
                                                      }}
                                                      onClick={() =>
                                                        toggleVisibleMutation.mutate(
                                                          {
                                                            id: a.assignment_id,
                                                            is_visible:
                                                              a.is_visible
                                                                ? 0
                                                                : 1,
                                                          },
                                                        )
                                                      }
                                                    >
                                                      <div
                                                        style={{
                                                          width: "14px",
                                                          height: "14px",
                                                          borderRadius: "50%",
                                                          background: "#fff",
                                                          position: "absolute",
                                                          top: "3px",
                                                          left: a.is_visible
                                                            ? "19px"
                                                            : "3px",
                                                          transition:
                                                            "left 0.2s",
                                                          boxShadow:
                                                            "0 1px 3px rgba(0,0,0,0.2)",
                                                        }}
                                                      />
                                                    </div>
                                                    <span
                                                      className="text-12"
                                                      style={{
                                                        color: a.is_visible
                                                          ? "#166534"
                                                          : "#94a3b8",
                                                      }}
                                                    >
                                                      {a.is_visible
                                                        ? "Visible"
                                                        : "Hidden"}
                                                    </span>
                                                  </label>
                                                </td>
                                                <td className="py-8 text-center">
                                                  {m.solution_url ? (
                                                    <label
                                                      className="d-flex align-items-center justify-content-center gap-6 mb-0"
                                                      style={{
                                                        cursor: "pointer",
                                                      }}
                                                    >
                                                      <div
                                                        style={{
                                                          width: "36px",
                                                          height: "20px",
                                                          borderRadius: "10px",
                                                          position: "relative",
                                                          background:
                                                            a.solution_visible
                                                              ? "#6366f1"
                                                              : "#e2e8f0",
                                                          transition:
                                                            "background 0.2s",
                                                          flexShrink: 0,
                                                        }}
                                                        onClick={() =>
                                                          toggleVisibleMutation.mutate(
                                                            {
                                                              id: a.assignment_id,
                                                              solution_visible:
                                                                a.solution_visible
                                                                  ? 0
                                                                  : 1,
                                                            },
                                                          )
                                                        }
                                                      >
                                                        <div
                                                          style={{
                                                            width: "14px",
                                                            height: "14px",
                                                            borderRadius: "50%",
                                                            background: "#fff",
                                                            position:
                                                              "absolute",
                                                            top: "3px",
                                                            left: a.solution_visible
                                                              ? "19px"
                                                              : "3px",
                                                            transition:
                                                              "left 0.2s",
                                                            boxShadow:
                                                              "0 1px 3px rgba(0,0,0,0.2)",
                                                          }}
                                                        />
                                                      </div>
                                                      <span
                                                        className="text-12"
                                                        style={{
                                                          color:
                                                            a.solution_visible
                                                              ? "#4338ca"
                                                              : "#94a3b8",
                                                        }}
                                                      >
                                                        {a.solution_visible
                                                          ? "Visible"
                                                          : "Hidden"}
                                                      </span>
                                                    </label>
                                                  ) : (
                                                    <span className="text-12 text-gray-300">
                                                      No solution
                                                    </span>
                                                  )}
                                                </td>
                                                <td className="py-8 text-center">
                                                  <button
                                                    className="btn btn-sm btn-danger rounded-pill"
                                                    onClick={() =>
                                                      removeAssignMutation.mutate(
                                                        a.assignment_id,
                                                      )
                                                    }
                                                  >
                                                    <i className="ph ph-trash text-12" />
                                                  </button>
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
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
