import React, { useState } from "react";
import AdminSidebar from "../../common/AdminSidebar";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  getStudNotifies,
  createStudNotify,
  updateStudNotify,
  deleteStudNotify,
  getAllBatch,
  getAllPhase,
} from "../../apis/apis";

const toLocal = (dt) => (dt ? new Date(dt).toISOString().slice(0, 16) : "");
const fmtDate = (dt) =>
  dt
    ? new Date(dt).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "—";

function StudNotifyAdmin() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const qc = useQueryClient();
  const blank = {
    name: "",
    college_name: "",
    join_datetime: "",
    feature_datetime_start: "",
    feature_datetime_end: "",
    tbl_batch: "",
    tbl_phase: "",
  };
  const [form, setForm] = useState(blank);
  const [editId, setEditId] = useState(null);

  const { data: notifData, isLoading } = useQuery({
    queryKey: ["studNotify"],
    queryFn: getStudNotifies,
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

  const notifs = notifData?.data || [];
  const batches = batchData || [];
  const phases = phaseData || [];

  const inv = () => qc.invalidateQueries(["studNotify"]);

  const createMut = useMutation({
    mutationFn: createStudNotify,
    onSuccess: () => {
      toast.success("Created!");
      inv();
      setForm(blank);
      setEditId(null);
    },
    onError: (e) => toast.error(e?.response?.data?.message || "Error"),
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }) => updateStudNotify(id, data),
    onSuccess: () => {
      toast.success("Updated!");
      inv();
      setForm(blank);
      setEditId(null);
    },
    onError: (e) => toast.error(e?.response?.data?.message || "Error"),
  });
  const deleteMut = useMutation({
    mutationFn: deleteStudNotify,
    onSuccess: () => {
      toast.success("Deleted!");
      inv();
    },
    onError: (e) => toast.error(e?.response?.data?.message || "Error"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !form.name ||
      !form.college_name ||
      !form.join_datetime ||
      !form.feature_datetime_start ||
      !form.feature_datetime_end
    )
      return toast.error("All fields except batch/phase are required");
    const payload = {
      ...form,
      tbl_batch: form.tbl_batch || null,
      tbl_phase: form.tbl_phase || null,
    };
    if (editId) updateMut.mutate({ id: editId, data: payload });
    else createMut.mutate(payload);
  };

  const handleEdit = (n) => {
    setEditId(n.id);
    setForm({
      name: n.name,
      college_name: n.college_name,
      join_datetime: toLocal(n.join_datetime),
      feature_datetime_start: toLocal(n.feature_datetime_start),
      feature_datetime_end: toLocal(n.feature_datetime_end),
      tbl_batch: n.tbl_batch || "",
      tbl_phase: n.tbl_phase || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (n) => {
    Swal.fire({
      title: `Delete "${n.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((r) => {
      if (r.isConfirmed) deleteMut.mutate(n.id);
    });
  };

  const now = new Date();
  const isActive = (n) =>
    now >= new Date(n.feature_datetime_start) &&
    now <= new Date(n.feature_datetime_end);

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
                  Student Notifications
                </span>
              </li>
            </ul>
          </div>

          <div className="row g-20">
            {/* ── Form ── */}
            <div className="col-lg-4">
              <div className="card position-sticky" style={{ top: "20px" }}>
                <div className="card-body p-20">
                  <h6 className="fw-semibold text-main-600 mb-16 flex-align gap-8">
                    <i className="ph ph-bell-ringing" />
                    {editId ? "Edit Notification" : "Add Notification"}
                  </h6>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-12">
                      <label className="form-label fw-medium text-13 mb-6">
                        Student Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Nimesh Korat"
                        value={form.name}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, name: e.target.value }))
                        }
                        required
                      />
                    </div>
                    <div className="mb-12">
                      <label className="form-label fw-medium text-13 mb-6">
                        College Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. ABC College"
                        value={form.college_name}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            college_name: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="mb-12">
                      <label className="form-label fw-medium text-13 mb-6">
                        Join Date & Time <span className="text-danger">*</span>
                      </label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={form.join_datetime}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            join_datetime: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="mb-12">
                      <label className="form-label fw-medium text-13 mb-6">
                        Show From <span className="text-danger">*</span>
                      </label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={form.feature_datetime_start}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            feature_datetime_start: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="mb-12">
                      <label className="form-label fw-medium text-13 mb-6">
                        Show Until <span className="text-danger">*</span>
                      </label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={form.feature_datetime_end}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            feature_datetime_end: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="mb-12">
                      <label className="form-label fw-medium text-13 mb-6">
                        Batch{" "}
                        <span className="text-gray-400 fw-normal">
                          (optional — blank = all)
                        </span>
                      </label>
                      <select
                        className="form-control"
                        value={form.tbl_batch}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, tbl_batch: e.target.value }))
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
                    <div className="mb-16">
                      <label className="form-label fw-medium text-13 mb-6">
                        Phase{" "}
                        <span className="text-gray-400 fw-normal">
                          (optional — blank = all)
                        </span>
                      </label>
                      <select
                        className="form-control"
                        value={form.tbl_phase}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, tbl_phase: e.target.value }))
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
                          "Create"
                        )}
                      </button>
                      {editId && (
                        <button
                          type="button"
                          className="btn btn-secondary rounded-pill py-9 px-16"
                          onClick={() => {
                            setForm(blank);
                            setEditId(null);
                          }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* ── List ── */}
            <div className="col-lg-8">
              {isLoading && (
                <div className="text-center py-32">
                  <span className="spinner-border text-main-600" />
                </div>
              )}
              {!isLoading && notifs.length === 0 && (
                <div className="card">
                  <div className="card-body text-center py-48">
                    <i className="ph ph-bell-slash text-64 text-gray-300 d-block mb-16" />
                    <p className="text-gray-500">No notifications yet.</p>
                  </div>
                </div>
              )}
              <div className="d-flex flex-column gap-12">
                {notifs.map((n) => (
                  <div
                    key={n.id}
                    className={`card border-2 ${isActive(n) ? "border-success-200" : "border-gray-100"}`}
                  >
                    <div className="card-body p-16">
                      <div className="flex-between gap-8 mb-8">
                        <div>
                          <div className="flex-align gap-8 mb-4">
                            <h6 className="fw-semibold text-gray-800 mb-0">
                              {n.name}
                            </h6>
                            {isActive(n) && (
                              <span className="text-12 bg-success-50 text-success-700 py-2 px-10 rounded-pill fw-semibold">
                                🟢 Live
                              </span>
                            )}
                          </div>
                          <p className="text-13 text-gray-500 mb-0">
                            <i className="ph ph-buildings me-4 text-main-600" />
                            {n.college_name}
                          </p>
                        </div>
                        <div className="flex-align gap-6">
                          <button
                            className="btn btn-sm btn-info rounded-pill"
                            onClick={() => handleEdit(n)}
                          >
                            <i className="ph ph-pencil text-12" />
                          </button>
                          <button
                            className="btn btn-sm btn-danger rounded-pill"
                            onClick={() => handleDelete(n)}
                          >
                            <i className="ph ph-trash text-12" />
                          </button>
                        </div>
                      </div>
                      <div className="row g-8 text-13 text-gray-500">
                        <div className="col-md-4">
                          <i className="ph ph-calendar-check text-main-600 me-4" />
                          Joined: {fmtDate(n.join_datetime)}
                        </div>
                        <div className="col-md-4">
                          <i className="ph ph-play text-success-600 me-4" />
                          From: {fmtDate(n.feature_datetime_start)}
                        </div>
                        <div className="col-md-4">
                          <i className="ph ph-stop text-danger-600 me-4" />
                          Until: {fmtDate(n.feature_datetime_end)}
                        </div>
                      </div>
                      {(n.batch_title || n.phase_title) && (
                        <div className="flex-align gap-6 mt-8">
                          {n.batch_title && (
                            <span className="text-12 bg-main-50 text-main-700 py-2 px-10 rounded-pill">
                              {n.batch_title}
                            </span>
                          )}
                          {n.phase_title && (
                            <span className="text-12 bg-info-50 text-info-700 py-2 px-10 rounded-pill">
                              {n.phase_title}
                            </span>
                          )}
                        </div>
                      )}
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

export default StudNotifyAdmin;
