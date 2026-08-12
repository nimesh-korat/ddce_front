import React, { useState } from "react";
import AdminSidebar from "../../common/AdminSidebar";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStudentCounts,
  upsertStudentCount,
  deleteStudentCount,
  getAllBatch,
  getAllPhase,
} from "../../apis/apis";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

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
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <div
        onClick={() => {
          setOpen((o) => !o);
          setSearch("");
        }}
        className="form-control d-flex align-items-center justify-content-between"
        style={{
          cursor: "pointer",
          userSelect: "none",
          minHeight: "38px",
          fontSize: "14px",
        }}
      >
        <span className={selected ? "text-gray-800" : "text-gray-400"}>
          {selected ? selected[labelKey] : placeholder}
        </span>
        <i
          className={`ph ph-caret-${open ? "up" : "down"} text-gray-400 text-13`}
        />
      </div>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            zIndex: 9999,
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "7px", borderBottom: "1px solid #f1f5f9" }}>
            <div className="position-relative">
              <i
                className="ph ph-magnifying-glass position-absolute text-gray-400"
                style={{
                  top: "50%",
                  left: "8px",
                  transform: "translateY(-50%)",
                  fontSize: "13px",
                  pointerEvents: "none",
                }}
              />
              <input
                autoFocus
                type="text"
                className="form-control form-control-sm"
                style={{ paddingLeft: "28px", fontSize: "13px" }}
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            <div
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              style={{
                padding: "8px 12px",
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
                  padding: "12px",
                  fontSize: "13px",
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
                  padding: "8px 12px",
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

export default function StudentCount() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const queryClient = useQueryClient();

  const emptyForm = {
    tbl_batch: "",
    tbl_phase: "",
    offline_count: "",
    online_count: "",
  };
  const [form, setForm] = useState(emptyForm);

  const { data: countsData, isLoading } = useQuery({
    queryKey: ["studentCounts"],
    queryFn: getStudentCounts,
    staleTime: 30 * 1000,
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

  const counts = countsData?.data || [];
  const batches = batchData || [];
  const phases = phaseData || [];

  const globalRow = counts.find((r) => r.tbl_batch === null);
  const batchRows = counts.filter((r) => r.tbl_batch !== null);

  const saveMutation = useMutation({
    mutationFn: upsertStudentCount,
    onSuccess: () => {
      toast.success("Saved!");
      queryClient.invalidateQueries(["studentCounts"]);
      setForm(emptyForm);
    },
    onError: (e) => toast.error(e?.response?.data?.message || "Failed to save"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteStudentCount,
    onSuccess: () => {
      toast.success("Deleted!");
      queryClient.invalidateQueries(["studentCounts"]);
    },
    onError: (e) =>
      toast.error(e?.response?.data?.message || "Failed to delete"),
  });

  const handleSave = () => {
    if (form.offline_count === "" && form.online_count === "")
      return toast.error("Enter at least one count");
    saveMutation.mutate({
      tbl_batch: form.tbl_batch || null,
      tbl_phase: form.tbl_phase || null,
      offline_count: parseInt(form.offline_count) || 0,
      online_count: parseInt(form.online_count) || 0,
    });
  };

  const handleDelete = (row) => {
    Swal.fire({
      title: "Delete this entry?",
      text: `${row.batch_title} ${row.phase_title ? "- " + row.phase_title : ""} counts will be removed. Global default will be used instead.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete",
    }).then((r) => {
      if (r.isConfirmed) deleteMutation.mutate(row.id);
    });
  };

  const handleEditGlobal = () => {
    if (!globalRow) return;
    setForm({
      tbl_batch: "",
      tbl_phase: "",
      offline_count: globalRow.offline_count,
      online_count: globalRow.online_count,
    });
  };

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
                  Student Count
                </span>
              </li>
            </ul>
          </div>

          <div className="row g-20">
            {/* ── Left: Form ── */}
            <div className="col-lg-4">
              <div className="card border border-gray-100 shadow-sm">
                <div className="card-body p-20">
                  <h6 className="fw-bold text-gray-800 mb-16 flex-align gap-8">
                    <i className="ph ph-users-three text-main-600" /> Set
                    Student Count
                  </h6>

                  <div className="mb-12">
                    <label
                      className="text-12 fw-semibold text-gray-500 text-uppercase mb-6 d-block"
                      style={{ letterSpacing: "0.5px" }}
                    >
                      Batch{" "}
                      <span className="text-gray-400 fw-normal text-11">
                        (leave blank for global default)
                      </span>
                    </label>
                    <SearchableSelect
                      options={batches.map((b) => ({
                        label: b.batch_title,
                        value: b.id,
                      }))}
                      value={form.tbl_batch}
                      onChange={(v) =>
                        setForm((f) => ({ ...f, tbl_batch: v, tbl_phase: "" }))
                      }
                      placeholder="Global Default"
                    />
                  </div>

                  <div className="mb-12">
                    <label
                      className="text-12 fw-semibold text-gray-500 text-uppercase mb-6 d-block"
                      style={{ letterSpacing: "0.5px" }}
                    >
                      Phase
                    </label>
                    <SearchableSelect
                      options={phases.map((p) => ({
                        label: p.title,
                        value: p.Id,
                      }))}
                      value={form.tbl_phase}
                      onChange={(v) => setForm((f) => ({ ...f, tbl_phase: v }))}
                      placeholder="All Phases"
                    />
                  </div>

                  <div className="mb-12">
                    <label
                      className="text-12 fw-semibold text-gray-500 text-uppercase mb-6 d-block"
                      style={{ letterSpacing: "0.5px" }}
                    >
                      <i className="ph ph-graduation-cap me-4 text-main-600" />{" "}
                      Offline Students
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="form-control rounded-8"
                      placeholder="e.g. 106"
                      value={form.offline_count}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          offline_count: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="mb-16">
                    <label
                      className="text-12 fw-semibold text-gray-500 text-uppercase mb-6 d-block"
                      style={{ letterSpacing: "0.5px" }}
                    >
                      <i className="ph ph-users-four me-4 text-purple-600" />{" "}
                      Online Students
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="form-control rounded-8"
                      placeholder="e.g. 45"
                      value={form.online_count}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, online_count: e.target.value }))
                      }
                    />
                  </div>

                  <div className="flex-align gap-8">
                    <button
                      className="btn btn-main rounded-8 flex-align gap-6 flex-1 justify-content-center"
                      onClick={handleSave}
                      disabled={saveMutation.isPending}
                    >
                      {saveMutation.isPending ? (
                        <>
                          <span className="spinner-border spinner-border-sm" />{" "}
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="ph ph-floppy-disk" /> Save
                        </>
                      )}
                    </button>
                    {(form.offline_count !== "" ||
                      form.online_count !== "" ||
                      form.tbl_batch) && (
                      <button
                        className="btn btn-secondary rounded-8"
                        onClick={() => setForm(emptyForm)}
                      >
                        <i className="ph ph-x" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Global Default card */}
              {globalRow && (
                <div className="card border border-main-200 shadow-sm mt-16 bg-main-50">
                  <div className="card-body p-16">
                    <div className="flex-between mb-10">
                      <p className="text-13 fw-semibold text-main-700 mb-0">
                        🌐 Global Default
                      </p>
                      <button
                        className="btn btn-sm btn-main rounded-pill text-12"
                        onClick={handleEditGlobal}
                      >
                        <i className="ph ph-pencil me-4 text-11" /> Edit
                      </button>
                    </div>
                    <div className="row g-8 text-center">
                      <div className="col-6">
                        <div className="bg-white rounded-8 py-10 border border-main-100">
                          <div className="text-20 fw-bold text-main-600">
                            {globalRow.offline_count}
                          </div>
                          <div className="text-11 text-gray-500 mt-2">
                            Offline
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="bg-white rounded-8 py-10 border border-purple-100">
                          <div className="text-20 fw-bold text-purple-600">
                            {globalRow.online_count}
                          </div>
                          <div className="text-11 text-gray-500 mt-2">
                            Online
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Right: Batch-wise entries ── */}
            <div className="col-lg-8">
              <div className="card border border-gray-100 shadow-sm">
                <div className="flex-between px-20 py-14 border-bottom border-gray-100">
                  <h6 className="fw-bold text-gray-800 mb-0">
                    Batch / Phase Specific Counts
                  </h6>
                  <span className="text-13 text-gray-400">
                    {batchRows.length} entries
                  </span>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table className="table table-hover mb-0">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-12 text-gray-500 fw-medium py-12 px-16">
                          #
                        </th>
                        <th className="text-12 text-gray-500 fw-medium py-12">
                          Batch
                        </th>
                        <th className="text-12 text-gray-500 fw-medium py-12">
                          Phase
                        </th>
                        <th className="text-12 text-gray-500 fw-medium py-12 text-center">
                          <i className="ph ph-graduation-cap me-4" />
                          Offline
                        </th>
                        <th className="text-12 text-gray-500 fw-medium py-12 text-center">
                          <i className="ph ph-users-four me-4" />
                          Online
                        </th>
                        <th className="text-12 text-gray-500 fw-medium py-12 text-center">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading &&
                        Array.from({ length: 3 }).map((_, i) => (
                          <tr key={i}>
                            {Array.from({ length: 6 }).map((__, j) => (
                              <td key={j} className="py-12 px-16">
                                <div
                                  className="bg-gray-100 rounded"
                                  style={{ height: "13px", width: "80%" }}
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      {!isLoading && batchRows.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="text-center text-gray-400 py-40"
                          >
                            <i className="ph ph-users text-48 d-block mb-12 text-gray-300" />
                            No batch-specific counts yet. Global default is used
                            for all batches.
                          </td>
                        </tr>
                      )}
                      {!isLoading &&
                        batchRows.map((row, i) => (
                          <tr key={row.id}>
                            <td className="text-13 text-gray-400 fw-medium py-12 px-16">
                              {i + 1}
                            </td>
                            <td className="py-12">
                              <span className="text-13 fw-semibold text-gray-800">
                                {row.batch_title}
                              </span>
                            </td>
                            <td className="py-12">
                              <span className="text-12 bg-info-50 text-info-700 py-2 px-8 rounded-pill fw-medium">
                                {row.phase_title || "All Phases"}
                              </span>
                            </td>
                            <td className="py-12 text-center">
                              <span className="text-16 fw-bold text-main-600">
                                {row.offline_count}
                              </span>
                            </td>
                            <td className="py-12 text-center">
                              <span className="text-16 fw-bold text-purple-600">
                                {row.online_count}
                              </span>
                            </td>
                            <td className="py-12 text-center">
                              <div className="flex-align gap-6 justify-content-center">
                                <button
                                  className="btn btn-sm btn-info rounded-pill"
                                  onClick={() =>
                                    setForm({
                                      tbl_batch: String(row.tbl_batch),
                                      tbl_phase: row.tbl_phase
                                        ? String(row.tbl_phase)
                                        : "",
                                      offline_count: row.offline_count,
                                      online_count: row.online_count,
                                    })
                                  }
                                >
                                  <i className="ph ph-pencil text-12" />
                                </button>
                                <button
                                  className="btn btn-sm btn-danger rounded-pill"
                                  onClick={() => handleDelete(row)}
                                  disabled={deleteMutation.isPending}
                                >
                                  <i className="ph ph-trash text-12" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
