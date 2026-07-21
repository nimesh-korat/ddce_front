import React, { useState } from "react";
import AdminSidebar from "../../common/AdminSidebar";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  getDoodles,
  createDoodle,
  updateDoodle,
  deleteDoodle,
  assignDoodle,
  removeAssignment,
  getAllBatch,
  getAllPhase,
} from "../../apis/apis";

function DoodleAdmin() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const qc = useQueryClient();

  // ── Form state ───────────────────────────────────────────
  const [form, setForm] = useState({
    title: "",
    start_date: "",
    end_date: "",
    is_featured: 1,
    image: null,
  });
  const [editId, setEditId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [assignForm, setAssignForm] = useState(null); // { doodle_id }

  const { data: doodlesData, isLoading } = useQuery({
    queryKey: ["doodles"],
    queryFn: getDoodles,
    staleTime: 0,
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

  const doodles = doodlesData?.data || [];
  const batches = batchData || [];
  const phases = phaseData || [];

  const invalidate = () => qc.invalidateQueries(["doodles"]);

  const createMut = useMutation({
    mutationFn: (fd) => createDoodle(fd),
    onSuccess: () => {
      toast.success("Doodle created!");
      invalidate();
      resetForm();
    },
    onError: (e) => toast.error(e?.response?.data?.message || "Failed"),
  });
  const updateMut = useMutation({
    mutationFn: ({ id, fd }) => updateDoodle(id, fd),
    onSuccess: () => {
      toast.success("Doodle updated!");
      invalidate();
      resetForm();
    },
    onError: (e) => toast.error(e?.response?.data?.message || "Failed"),
  });
  const deleteMut = useMutation({
    mutationFn: (id) => deleteDoodle(id),
    onSuccess: () => {
      toast.success("Deleted!");
      invalidate();
    },
    onError: (e) => toast.error(e?.response?.data?.message || "Failed"),
  });
  const assignMut = useMutation({
    mutationFn: (data) => assignDoodle(data),
    onSuccess: () => {
      toast.success("Assigned!");
      invalidate();
    },
    onError: (e) =>
      toast.error(e?.response?.data?.message || "Already assigned or error"),
  });
  const removeMut = useMutation({
    mutationFn: (id) => removeAssignment(id),
    onSuccess: () => {
      toast.success("Removed!");
      invalidate();
    },
    onError: (e) => toast.error(e?.response?.data?.message || "Failed"),
  });

  const resetForm = () => {
    setForm({
      title: "",
      start_date: "",
      end_date: "",
      is_featured: 1,
      image: null,
    });
    setEditId(null);
    setPreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((f) => ({ ...f, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.start_date || !form.end_date)
      return toast.error("Title, start date and end date are required");
    if (!editId && !form.image) return toast.error("Image is required");

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("start_date", form.start_date);
    fd.append("end_date", form.end_date);
    fd.append("is_featured", form.is_featured);
    if (form.image) fd.append("image", form.image);

    if (editId) updateMut.mutate({ id: editId, fd });
    else createMut.mutate(fd);
  };

  const handleEdit = (d) => {
    setEditId(d.id);
    setForm({
      title: d.title,
      start_date: d.start_date?.slice(0, 16) || "",
      end_date: d.end_date?.slice(0, 16) || "",
      is_featured: d.is_featured,
      image: null,
    });
    setPreview(d.image_url);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (d) => {
    Swal.fire({
      title: `Delete "${d.title}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete",
    }).then((r) => {
      if (r.isConfirmed) deleteMut.mutate(d.id);
    });
  };

  const now = new Date();
  const isActive = (d) =>
    d.is_featured === 1 &&
    new Date(d.start_date) <= now &&
    new Date(d.end_date) >= now;

  const fmtDate = (d) =>
    d
      ? new Date(d).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : "—";

  return (
    <>
      <AdminSidebar
        isActive={isSidebarActive}
        closeSidebar={() => setIsSidebarActive(false)}
      />
      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={() => setIsSidebarActive((p) => !p)} />
        <div className="dashboard-body">
          <div className="breadcrumb mb-24">
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
                <span className="text-gray-500 d-flex">
                  <i className="ph ph-caret-right" />
                </span>
              </li>
              <li>
                <span className="text-main-600 fw-normal text-15">
                  Doodle / Occasions
                </span>
              </li>
            </ul>
          </div>

          <div className="row g-20">
            {/* ── LEFT: Form ── */}
            <div className="col-lg-4">
              <div className="card position-sticky" style={{ top: "20px" }}>
                <div className="card-body p-20">
                  <h6 className="fw-semibold text-main-600 mb-16 flex-align gap-8">
                    <i className="ph ph-paint-brush" />
                    {editId ? "Edit Doodle" : "Add Doodle"}
                  </h6>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-12">
                      <label className="form-label fw-medium text-13 mb-6">
                        Title <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Diwali 2025"
                        value={form.title}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, title: e.target.value }))
                        }
                        required
                      />
                    </div>

                    <div className="mb-12">
                      <label className="form-label fw-medium text-13 mb-6">
                        Image{" "}
                        {editId && (
                          <span className="text-gray-400 fw-normal text-12">
                            (leave empty to keep existing)
                          </span>
                        )}
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      {preview && (
                        <img
                          src={preview}
                          alt="preview"
                          className="mt-10 rounded-8 w-100"
                          style={{
                            maxHeight: "160px",
                            objectFit: "contain",
                            background: "#f8fafc",
                          }}
                        />
                      )}
                    </div>

                    <div className="mb-12">
                      <label className="form-label fw-medium text-13 mb-6">
                        Start Date & Time <span className="text-danger">*</span>
                      </label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={form.start_date}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, start_date: e.target.value }))
                        }
                        required
                      />
                    </div>

                    <div className="mb-12">
                      <label className="form-label fw-medium text-13 mb-6">
                        End Date & Time <span className="text-danger">*</span>
                      </label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={form.end_date}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, end_date: e.target.value }))
                        }
                        required
                      />
                    </div>

                    <div className="mb-16">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="isFeatured"
                          checked={form.is_featured === 1}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              is_featured: e.target.checked ? 1 : 0,
                            }))
                          }
                        />
                        <label
                          className="form-check-label text-13 fw-medium"
                          htmlFor="isFeatured"
                        >
                          Featured (show to students)
                        </label>
                      </div>
                    </div>

                    <div className="flex-align gap-8">
                      <button
                        type="submit"
                        className="btn btn-main rounded-pill py-9 flex-grow-1"
                        disabled={createMut.isPending || updateMut.isPending}
                      >
                        {createMut.isPending || updateMut.isPending ? (
                          <span className="spinner-border spinner-border-sm" />
                        ) : editId ? (
                          "Update"
                        ) : (
                          "Create Doodle"
                        )}
                      </button>
                      {editId && (
                        <button
                          type="button"
                          className="btn btn-outline-secondary rounded-pill py-9 px-16"
                          onClick={resetForm}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Doodle List ── */}
            <div className="col-lg-8">
              {isLoading && (
                <div className="text-center py-32">
                  <span className="spinner-border text-main-600" />
                </div>
              )}

              {!isLoading && doodles.length === 0 && (
                <div className="card">
                  <div className="card-body text-center py-48">
                    <i className="ph ph-paint-brush text-64 text-gray-300 d-block mb-16" />
                    <p className="text-gray-500">
                      No doodles yet. Create one on the left.
                    </p>
                  </div>
                </div>
              )}

              <div className="d-flex flex-column gap-16">
                {doodles.map((d) => (
                  <div
                    key={d.id}
                    className={`card border-2 ${isActive(d) ? "border-success-200" : "border-gray-100"}`}
                  >
                    <div className="card-body p-16">
                      <div className="row g-16 align-items-start">
                        {/* Image */}
                        <div className="col-auto">
                          {d.image_url ? (
                            <img
                              src={d.image_url}
                              alt={d.title}
                              style={{
                                width: "80px",
                                height: "80px",
                                objectFit: "contain",
                                borderRadius: "10px",
                                background: "#f8fafc",
                                border: "1px solid #e2e8f0",
                              }}
                            />
                          ) : (
                            <div className="w-80 h-80 rounded-10 bg-gray-50 flex-center">
                              <i className="ph ph-image text-32 text-gray-300" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="col">
                          <div className="flex-between gap-8 mb-6">
                            <h6 className="fw-semibold text-gray-800 mb-0">
                              {d.title}
                            </h6>
                            <div className="flex-align gap-6">
                              {isActive(d) ? (
                                <span className="text-12 bg-success-50 text-success-700 py-2 px-10 rounded-pill fw-semibold">
                                  🟢 Live
                                </span>
                              ) : d.is_featured === 0 ? (
                                <span className="text-12 bg-warning-50 text-warning-700 py-2 px-10 rounded-pill fw-semibold">
                                  Hidden
                                </span>
                              ) : (
                                <span className="text-12 bg-gray-50 text-gray-500 py-2 px-10 rounded-pill fw-semibold">
                                  Inactive
                                </span>
                              )}
                              <button
                                className="btn btn-sm btn-outline-info-600 rounded-pill"
                                onClick={() => handleEdit(d)}
                                title="Edit"
                              >
                                <i className="ph ph-pencil text-12" />
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger rounded-pill"
                                onClick={() => handleDelete(d)}
                                title="Delete"
                              >
                                <i className="ph ph-trash text-12" />
                              </button>
                            </div>
                          </div>
                          <div className="flex-align gap-12 flex-wrap mb-10">
                            <span className="text-12 text-gray-500 flex-align gap-4">
                              <i className="ph ph-calendar-check text-main-600" />
                              From: {fmtDate(d.start_date)}
                            </span>
                            <span className="text-12 text-gray-500 flex-align gap-4">
                              <i className="ph ph-calendar-x text-danger-600" />
                              To: {fmtDate(d.end_date)}
                            </span>
                          </div>

                          {/* Assignments */}
                          <div className="mt-8">
                            <div className="flex-between mb-6">
                              <span className="text-12 fw-semibold text-gray-600">
                                Batch Assignments{" "}
                                <span className="text-gray-400 fw-normal">
                                  ({d.assignments?.length || 0})
                                </span>
                              </span>
                              <button
                                className="btn btn-sm btn-outline-main rounded-pill flex-align gap-4 text-12"
                                onClick={() =>
                                  setAssignForm(
                                    assignForm?.doodle_id === d.id
                                      ? null
                                      : {
                                          doodle_id: d.id,
                                          tbl_batch: "",
                                          tbl_phase: "",
                                        },
                                  )
                                }
                              >
                                <i className="ph ph-plus text-11" /> Assign
                                Batch
                              </button>
                            </div>

                            {/* Inline assign form */}
                            {assignForm?.doodle_id === d.id && (
                              <div className="p-12 bg-main-50 rounded-8 mb-8">
                                <div className="row g-8 align-items-end">
                                  <div className="col-5">
                                    <select
                                      className="form-select form-select-sm"
                                      value={assignForm.tbl_batch}
                                      onChange={(e) =>
                                        setAssignForm((f) => ({
                                          ...f,
                                          tbl_batch: e.target.value,
                                        }))
                                      }
                                    >
                                      <option value="">All Batches</option>
                                      {batches.map((b) => (
                                        <option key={b.id} value={b.id}>
                                          {b.batch_title}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="col-4">
                                    <select
                                      className="form-select form-select-sm"
                                      value={assignForm.tbl_phase}
                                      onChange={(e) =>
                                        setAssignForm((f) => ({
                                          ...f,
                                          tbl_phase: e.target.value,
                                        }))
                                      }
                                    >
                                      <option value="">All Phases</option>
                                      {phases.map((p) => (
                                        <option key={p.Id} value={p.Id}>
                                          {p.title}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="col-3 flex-align gap-6">
                                    <button
                                      className="btn btn-sm btn-success rounded-pill"
                                      onClick={() => {
                                        assignMut.mutate({
                                          doodle_id: d.id,
                                          tbl_batch:
                                            assignForm.tbl_batch || null,
                                          tbl_phase:
                                            assignForm.tbl_phase || null,
                                        });
                                        setAssignForm(null);
                                      }}
                                    >
                                      <i className="ph ph-floppy-disk" />
                                    </button>
                                    <button
                                      className="btn btn-sm btn-outline-secondary rounded-pill"
                                      onClick={() => setAssignForm(null)}
                                    >
                                      <i className="ph ph-x" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Assignment tags */}
                            {d.assignments?.length > 0 ? (
                              <div className="flex-align gap-6 flex-wrap">
                                {d.assignments.map((a) => (
                                  <span
                                    key={a.id}
                                    className="text-12 bg-gray-50 text-gray-600 py-3 px-10 rounded-pill flex-align gap-6 border border-gray-100"
                                  >
                                    <i className="ph ph-users-three text-main-600 text-11" />
                                    {a.batch_title || "All Batches"}
                                    {a.phase_title
                                      ? ` · ${a.phase_title}`
                                      : " · All Phases"}
                                    <button
                                      onClick={() => removeMut.mutate(a.id)}
                                      className="ms-2"
                                      style={{
                                        background: "none",
                                        border: "none",
                                        padding: 0,
                                        cursor: "pointer",
                                        color: "#ef4444",
                                        lineHeight: 1,
                                      }}
                                    >
                                      <i className="ph ph-x text-10" />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-12 text-gray-400 mb-0">
                                No assignments — assign to batches above
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default DoodleAdmin;
