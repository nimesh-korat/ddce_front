import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "../../common/AdminSidebar";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  getFeesReminders,
  createFeesReminder,
  updateFeesReminder,
  deleteFeesReminder,
  assignFeesReminder,
  getFeesReminderStudents,
  markPaidFeesReminder,
  bulkMarkPaidFeesReminder,
  removeFeesAssignment,
  updateFeesAssignment,
  bulkUpdateFeesAssignment,
  getAllBatch,
  getAllPhase,
  getStudentsForAssign,
} from "../../apis/apis";

// ─── Helpers ──────────────────────────────────────────────────────────────

function fmtDT(dt) {
  if (!dt) return "—";
  return new Date(dt).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

const TABS = ["Create / Edit", "Assign", "Manage"];

// ─── Searchable Single-Select Dropdown ────────────────────────────────────
function SearchSelect({
  options = [],
  value,
  onChange,
  placeholder = "Search…",
  labelKey = "label",
  valueKey = "value",
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef();
  const inputRef = useRef();

  const selected = options.find((o) => String(o[valueKey]) === String(value));
  const filtered = options.filter((o) =>
    String(o[labelKey]).toLowerCase().includes(q.toLowerCase()),
  );

  // close on outside click
  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const select = (o) => {
    onChange(String(o[valueKey]));
    setQ("");
    setOpen(false);
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div
        className={`form-control d-flex align-items-center justify-content-between gap-8 ${disabled ? "bg-light" : ""}`}
        style={{
          cursor: disabled ? "not-allowed" : "pointer",
          minHeight: 38,
          userSelect: "none",
        }}
        onClick={() => {
          if (!disabled) {
            setOpen((v) => !v);
            setTimeout(() => inputRef.current?.focus(), 50);
          }
        }}
      >
        <span
          className={selected ? "text-dark" : "text-muted"}
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {selected ? selected[labelKey] : placeholder}
        </span>
        <div className="d-flex align-items-center gap-4 flex-shrink-0">
          {value && !disabled && (
            <i
              className="ph ph-x text-muted"
              style={{ fontSize: 13 }}
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
                setQ("");
              }}
            />
          )}
          <i
            className={`ph ph-caret-${open ? "up" : "down"} text-muted`}
            style={{ fontSize: 13 }}
          />
        </div>
      </div>
      {open && (
        <div
          style={{
            position: "absolute",
            zIndex: 1050,
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #dee2e6",
            borderRadius: 8,
            boxShadow: "0 4px 16px rgba(0,0,0,.12)",
            maxHeight: 260,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{ padding: "8px 10px", borderBottom: "1px solid #f0f0f0" }}
          >
            <input
              ref={inputRef}
              className="form-control form-control-sm"
              placeholder="Type to search…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div style={{ overflowY: "auto", flex: 1 }}>
            {filtered.length === 0 ? (
              <div className="text-muted text-13 px-12 py-10">No results</div>
            ) : (
              filtered.map((o) => (
                <div
                  key={o[valueKey]}
                  onClick={() => select(o)}
                  style={{
                    padding: "9px 12px",
                    cursor: "pointer",
                    fontSize: 14,
                    background:
                      String(o[valueKey]) === String(value)
                        ? "#f0eeff"
                        : "transparent",
                    color:
                      String(o[valueKey]) === String(value)
                        ? "#6a6cf7"
                        : "#333",
                    fontWeight:
                      String(o[valueKey]) === String(value) ? 600 : 400,
                  }}
                  onMouseEnter={(e) => {
                    if (String(o[valueKey]) !== String(value))
                      e.currentTarget.style.background = "#f8f8ff";
                  }}
                  onMouseLeave={(e) => {
                    if (String(o[valueKey]) !== String(value))
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  {o[labelKey]}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab 0 — Create / Edit Form ───────────────────────────────────────────
function ReminderForm({ editing, onClose }) {
  const qc = useQueryClient();
  const fileRef = useRef();

  const [form, setForm] = useState({
    title: editing?.title || "",
    description: editing?.description || "",
    amount: editing?.amount || "",
    payment_link: editing?.payment_link || "",
  });
  const [qrFile, setQrFile] = useState(null);
  const [qrPreview, setQrPreview] = useState(editing?.qr_code || null);
  const [clearQr, setClearQr] = useState(false);

  // Sync form fields whenever a different reminder is selected for editing
  useEffect(() => {
    setForm({
      title: editing?.title || "",
      description: editing?.description || "",
      amount: editing?.amount || "",
      payment_link: editing?.payment_link || "",
    });
    setQrFile(null);
    setQrPreview(editing?.qr_code || null);
    setClearQr(false);
  }, [editing?.id]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const saveMut = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (qrFile) fd.append("qr_code", qrFile);
      if (editing && clearQr) fd.append("clear_qr", "1");
      return editing
        ? updateFeesReminder(editing.id, fd)
        : createFeesReminder(fd);
    },
    onSuccess: () => {
      qc.invalidateQueries(["feesReminders"]);
      toast.success(editing ? "Reminder updated!" : "Reminder created!");
      if (editing) onClose?.();
      else
        setForm({ title: "", description: "", amount: "", payment_link: "" });
    },
    onError: (e) => toast.error(e?.response?.data?.message || "Failed to save"),
  });

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setQrFile(f);
    setQrPreview(URL.createObjectURL(f));
    setClearQr(false);
  };

  const handleRemoveQr = () => {
    setQrFile(null);
    setQrPreview(null);
    setClearQr(true);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="card shadow-none border border-gray-200">
      <div className="card-header border-bottom border-gray-200 py-16 px-20">
        <h6 className="fw-semibold mb-0 d-flex align-items-center gap-8">
          <i
            className={`ph ${editing ? "ph-pencil-simple" : "ph-plus-circle"} text-main-600`}
          />
          {editing ? "Edit Reminder" : "New Reminder"}
        </h6>
      </div>
      <div className="card-body p-20">
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label fw-semibold">
              Title <span className="text-danger">*</span>
            </label>
            <input
              className="form-control"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Monthly Fees — October"
            />
          </div>

          <div className="col-12">
            <label className="form-label fw-semibold">Description</label>
            <textarea
              className="form-control"
              rows={3}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Payment instructions, bank details, UPI ID..."
            />
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold">Amount (₹)</label>
            <input
              type="number"
              className="form-control"
              value={form.amount}
              onChange={(e) => set("amount", e.target.value)}
              placeholder="Optional"
            />
          </div>

          <div className="col-md-8">
            <label className="form-label fw-semibold">Payment Link</label>
            <input
              className="form-control"
              value={form.payment_link}
              onChange={(e) => set("payment_link", e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="col-12">
            <label className="form-label fw-semibold">QR Code Image</label>
            <div className="d-flex align-items-start gap-3 flex-wrap">
              <div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="form-control"
                  style={{ maxWidth: 280 }}
                  onChange={handleFile}
                />
                <small className="text-muted">
                  JPG / PNG / WebP · max 5 MB
                </small>
              </div>
              {qrPreview && (
                <div className="position-relative">
                  <img
                    src={qrPreview}
                    alt="QR preview"
                    style={{
                      height: 90,
                      borderRadius: 8,
                      border: "1px solid #dee2e6",
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-danger btn-sm position-absolute top-0 end-0"
                    style={{ padding: "0 5px", lineHeight: 1.3 }}
                    onClick={handleRemoveQr}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="col-12">
            <div className="alert alert-info py-8 px-12 mb-0 text-13 d-flex align-items-start gap-8">
              <i className="ph ph-info mt-2" />
              <span>
                <strong>Portal lock</strong> is set per assignment — when
                assigning to a batch, you can choose a grace period after the
                deadline before access is restricted.
              </span>
            </div>
          </div>
        </div>

        <div className="d-flex gap-12 mt-20">
          <button
            className="btn btn-main px-24"
            onClick={() => saveMut.mutate()}
            disabled={saveMut.isPending || !form.title.trim()}
          >
            {saveMut.isPending ? (
              <>
                <i className="ph ph-spinner me-6" />
                Saving…
              </>
            ) : editing ? (
              <>
                <i className="ph ph-check me-6" />
                Update
              </>
            ) : (
              <>
                <i className="ph ph-plus me-6" />
                Create
              </>
            )}
          </button>
          {editing && (
            <button className="btn btn-secondary px-20" onClick={onClose}>
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Tab 1 — Assign ───────────────────────────────────────────────────────
function AssignTab() {
  // mode: "batch" = entire batch, "students" = pick students manually
  const [mode, setMode] = useState("batch");
  const [reminderId, setReminderId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [phaseId, setPhaseId] = useState("");
  const [deadline, setDeadline] = useState("");
  const [lockMins, setLockMins] = useState("");

  // student multi-select state
  const [selectedIds, setSelectedIds] = useState([]); // array of user id strings
  const [studentSearch, setStudentSearch] = useState("");

  const { data: remindersData } = useQuery({
    queryKey: ["feesReminders"],
    queryFn: getFeesReminders,
  });
  const { data: batches = [] } = useQuery({
    queryKey: ["batches"],
    queryFn: getAllBatch,
  });
  const { data: phases = [] } = useQuery({
    queryKey: ["phases"],
    queryFn: getAllPhase,
  });

  // fetch existing assignment info for the selected reminder + batch/phase
  // so admin can see current deadline and update it
  const { data: existingData } = useQuery({
    queryKey: [
      "feesReminderStudents",
      reminderId,
      batchId,
      phaseId,
      "assignCheck",
    ],
    queryFn: () =>
      getFeesReminderStudents(reminderId, {
        batch_id: batchId || undefined,
        phase_id: phaseId || undefined,
      }),
    enabled: !!(reminderId && (batchId || phaseId)),
    select: (d) => {
      const rows = d?.data || [];
      if (!rows.length) return null;
      // all rows in a batch assignment share the same deadline/lock — use first
      return {
        count: rows.length,
        deadline: rows[0].deadline,
        lock_after_minutes: rows[0].lock_after_minutes,
        paid: rows.filter((r) => r.is_paid).length,
      };
    },
  });

  const isUpdate = !!existingData; // true when this reminder is already assigned to this batch/phase

  // fetch students when batch or phase selected (in student-pick mode)
  const { data: studentsRaw, isLoading: studLoading } = useQuery({
    queryKey: ["assignStudents", batchId, phaseId],
    queryFn: () =>
      getStudentsForAssign({
        batch_id: batchId || undefined,
        phase_id: phaseId || undefined,
      }),
    enabled: !!(batchId || phaseId),
    select: (d) => d?.data || [],
  });
  const students = studentsRaw || [];

  // filtered by search
  const visibleStudents = students.filter((s) => {
    const q = studentSearch.toLowerCase();
    return (
      (s.Name || "").toLowerCase().includes(q) ||
      (s.Email_Id || "").toLowerCase().includes(q) ||
      (s.MobileNo || "").toLowerCase().includes(q)
    );
  });

  const allVisible =
    visibleStudents.length > 0 &&
    visibleStudents.every((s) => selectedIds.includes(String(s.Id)));

  const toggleStudent = (id) => {
    const sid = String(id);
    setSelectedIds((prev) =>
      prev.includes(sid) ? prev.filter((x) => x !== sid) : [...prev, sid],
    );
  };

  const toggleAll = () => {
    const visIds = visibleStudents.map((s) => String(s.Id));
    if (allVisible)
      setSelectedIds((prev) => prev.filter((x) => !visIds.includes(x)));
    else setSelectedIds((prev) => [...new Set([...prev, ...visIds])]);
  };

  const resetStudentState = () => {
    setBatchId("");
    setPhaseId("");
    setSelectedIds([]);
    setStudentSearch("");
  };

  const reminderOptions = (remindersData?.data || []).map((r) => ({
    label: r.title,
    value: r.id,
  }));
  const batchOptions = batches.map((b) => ({
    label: b.batch_title,
    value: b.id,
  }));
  // tbl_phase uses capital-I `Id` column
  const phaseOptions = phases.map((p) => ({
    label: p.title || p.phase_title || p.name || `Phase ${p.Id || p.id}`,
    value: p.Id ?? p.id,
  }));

  const assignMut = useMutation({
    mutationFn: () => {
      const payload = {
        deadline,
        lock_after_minutes: lockMins !== "" ? +lockMins : null,
      };
      if (mode === "batch") {
        payload.assign_type = "batch";
        payload.batch_id = +batchId;
      } else {
        payload.assign_type = "students";
        payload.student_ids = selectedIds.map(Number);
      }
      return assignFeesReminder(reminderId, payload);
    },
    onSuccess: (d) => {
      toast.success(d?.message || "Assigned!");
      resetStudentState();
      setDeadline("");
      setLockMins("");
    },
    onError: (e) =>
      toast.error(e?.response?.data?.message || "Failed to assign"),
  });

  const canSubmit =
    reminderId &&
    deadline &&
    (mode === "batch" ? !!batchId : selectedIds.length > 0);

  return (
    <div>
      {/* Mode Toggle */}
      <div className="d-flex gap-8 mb-20">
        {[
          { key: "batch", icon: "ph-users-four", label: "Entire Batch" },
          { key: "students", icon: "ph-user-check", label: "Select Students" },
        ].map((m) => (
          <button
            key={m.key}
            className={`btn d-flex align-items-center gap-8 px-20 py-10 fw-medium ${mode === m.key ? "btn-main" : "btn-secondary"}`}
            style={{ borderRadius: 8 }}
            onClick={() => {
              setMode(m.key);
              resetStudentState();
            }}
          >
            <i className={`ph ${m.icon}`} />
            {m.label}
          </button>
        ))}
      </div>

      <div className="card shadow-none border border-gray-200">
        <div className="card-header border-bottom border-gray-200 py-16 px-20">
          <h6 className="fw-semibold mb-0 d-flex align-items-center gap-8">
            <i
              className={`ph ${mode === "batch" ? "ph-users-four" : "ph-user-check"} text-main-600`}
            />
            {mode === "batch"
              ? "Assign to Entire Batch"
              : "Assign to Selected Students"}
          </h6>
        </div>
        <div className="card-body p-20">
          <div className="row g-3">
            {/* Reminder — searchable */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Reminder <span className="text-danger">*</span>
              </label>
              <SearchSelect
                options={reminderOptions}
                value={reminderId}
                onChange={setReminderId}
                placeholder="Search reminder…"
              />
            </div>

            {/* Batch — searchable, always shown */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Batch{" "}
                {mode === "batch" && <span className="text-danger">*</span>}
                {mode === "students" && (
                  <span className="text-muted fw-normal ms-4">
                    (filter students)
                  </span>
                )}
              </label>
              <SearchSelect
                options={batchOptions}
                value={batchId}
                onChange={(v) => {
                  setBatchId(v);
                  setSelectedIds([]);
                }}
                placeholder="Search batch…"
              />
            </div>

            {/* Phase — searchable */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Phase
                <span className="text-muted fw-normal ms-4">
                  (filter students)
                </span>
              </label>
              <SearchSelect
                options={phaseOptions}
                value={phaseId}
                onChange={(v) => {
                  setPhaseId(v);
                  setSelectedIds([]);
                }}
                placeholder="Search phase…"
              />
            </div>

            {/* Deadline */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Deadline <span className="text-danger">*</span>
              </label>
              <input
                type="datetime-local"
                className="form-control"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>

            {/* Lock grace */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Portal Lock Grace Period
                <span className="text-muted fw-normal ms-4">
                  (minutes — optional)
                </span>
              </label>
              <input
                type="number"
                min="0"
                className="form-control"
                value={lockMins}
                onChange={(e) => setLockMins(e.target.value)}
                placeholder="Leave blank = no lock"
              />
              <small className="text-muted d-block mt-4">
                Blank = no lock &nbsp;·&nbsp; <strong>0</strong> = at deadline
                &nbsp;·&nbsp; <strong>N</strong> = N min after deadline
              </small>
            </div>

            {/* Existing assignment info — shown when reminder+batch already assigned */}
            {isUpdate && (
              <div className="col-12">
                <div className="alert alert-warning py-10 px-14 mb-0 d-flex align-items-start gap-10 flex-wrap">
                  <i
                    className="ph ph-warning mt-1 flex-shrink-0"
                    style={{ fontSize: 16 }}
                  />
                  <div className="flex-grow-1">
                    <div className="fw-semibold mb-4">
                      Already assigned — {existingData.count} student
                      {existingData.count !== 1 ? "s" : ""}
                      &nbsp;({existingData.paid} paid,{" "}
                      {existingData.count - existingData.paid} unpaid)
                    </div>
                    <div className="text-13">
                      Current deadline:{" "}
                      <strong>{fmtDT(existingData.deadline)}</strong>
                      &nbsp;·&nbsp; Lock:{" "}
                      <strong>
                        {existingData.lock_after_minutes === null ||
                        existingData.lock_after_minutes === undefined
                          ? "No lock"
                          : existingData.lock_after_minutes === 0
                            ? "At deadline"
                            : `${existingData.lock_after_minutes} min after deadline`}
                      </strong>
                    </div>
                    <div className="mt-6">
                      <button
                        type="button"
                        className="btn btn-sm btn-warning"
                        onClick={() => {
                          try {
                            setDeadline(
                              new Date(existingData.deadline)
                                .toISOString()
                                .slice(0, 16),
                            );
                          } catch {
                            /* noop */
                          }
                          setLockMins(
                            existingData.lock_after_minutes !== null &&
                              existingData.lock_after_minutes !== undefined
                              ? String(existingData.lock_after_minutes)
                              : "",
                          );
                        }}
                      >
                        <i className="ph ph-arrow-counter-clockwise me-4" />
                        Load current values
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Student picker (only in "students" mode) ─────────────── */}
          {mode === "students" && (
            <div className="mt-20">
              <div className="d-flex align-items-center justify-content-between mb-10 flex-wrap gap-8">
                <div className="fw-semibold text-14">
                  {!(batchId || phaseId)
                    ? "Select a batch or phase above to load students"
                    : studLoading
                      ? "Loading students…"
                      : `${students.length} student${students.length !== 1 ? "s" : ""} found · ${selectedIds.length} selected`}
                </div>
                {selectedIds.length > 0 && (
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => setSelectedIds([])}
                  >
                    Clear selection
                  </button>
                )}
              </div>

              {(batchId || phaseId) && !studLoading && students.length > 0 && (
                <div className="border border-gray-200 rounded-12 overflow-hidden">
                  {/* Search bar */}
                  <div
                    className="p-12 border-bottom border-gray-200 d-flex gap-10 align-items-center"
                    style={{ background: "#fafafa" }}
                  >
                    <i className="ph ph-magnifying-glass text-gray-400" />
                    <input
                      className="form-control form-control-sm border-0 p-0"
                      style={{ background: "transparent", boxShadow: "none" }}
                      placeholder="Search by name, email, phone…"
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                    />
                    {studentSearch && (
                      <i
                        className="ph ph-x text-gray-400"
                        style={{ cursor: "pointer" }}
                        onClick={() => setStudentSearch("")}
                      />
                    )}
                  </div>

                  {/* Select-all row */}
                  <div
                    className="d-flex align-items-center gap-12 px-16 py-10 border-bottom border-gray-200"
                    style={{ background: "#f0eeff", cursor: "pointer" }}
                    onClick={toggleAll}
                  >
                    <input
                      type="checkbox"
                      checked={allVisible}
                      onChange={toggleAll}
                      onClick={(e) => e.stopPropagation()}
                      style={{ cursor: "pointer" }}
                    />
                    <span className="fw-semibold text-main-600 text-13">
                      {allVisible
                        ? "Deselect all visible"
                        : `Select all ${visibleStudents.length} visible`}
                    </span>
                  </div>

                  {/* Student rows */}
                  <div style={{ maxHeight: 320, overflowY: "auto" }}>
                    {visibleStudents.length === 0 ? (
                      <div className="text-muted text-13 px-16 py-12">
                        No students match your search.
                      </div>
                    ) : (
                      visibleStudents.map((s) => {
                        const checked = selectedIds.includes(String(s.Id));
                        return (
                          <div
                            key={s.Id}
                            className="d-flex align-items-center gap-12 px-16 py-10"
                            style={{
                              cursor: "pointer",
                              background: checked ? "#f8f7ff" : "white",
                              borderBottom: "1px solid #f5f5f5",
                              transition: "background 0.1s",
                            }}
                            onClick={() => toggleStudent(s.Id)}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleStudent(s.Id)}
                              onClick={(e) => e.stopPropagation()}
                              style={{ cursor: "pointer", flexShrink: 0 }}
                            />
                            <div className="flex-grow-1 min-w-0">
                              <div
                                className="fw-medium text-14"
                                style={{
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {s.Name}
                              </div>
                              <div className="text-muted text-12">
                                {s.Email_Id}
                                {s.MobileNo ? ` · ${s.MobileNo}` : ""}
                              </div>
                            </div>
                            {s.batch_title && (
                              <span
                                className="badge text-11 fw-medium px-8 py-3 flex-shrink-0"
                                style={{
                                  background: "#e3f2fd",
                                  color: "#1565c0",
                                  borderRadius: 6,
                                }}
                              >
                                {s.batch_title}
                              </span>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Submit */}
          <div className="d-flex align-items-center gap-12 mt-20 flex-wrap">
            <button
              className={`btn px-28 ${isUpdate ? "btn-warning" : "btn-main"}`}
              onClick={() => assignMut.mutate()}
              disabled={assignMut.isPending || !canSubmit}
            >
              {assignMut.isPending ? (
                <>
                  <i className="ph ph-spinner me-6" />
                  {isUpdate ? "Updating…" : "Assigning…"}
                </>
              ) : isUpdate ? (
                <>
                  <i className="ph ph-pencil-simple me-6" />
                  Update Assignment
                </>
              ) : mode === "batch" ? (
                <>
                  <i className="ph ph-users-four me-6" />
                  Assign Entire Batch
                </>
              ) : (
                <>
                  <i className="ph ph-user-check me-6" />
                  Assign{" "}
                  {selectedIds.length > 0
                    ? `${selectedIds.length} Student${selectedIds.length > 1 ? "s" : ""}`
                    : "Selected Students"}
                </>
              )}
            </button>
            {isUpdate && (
              <span className="text-muted text-13">
                <i className="ph ph-info me-4" />
                This will update deadline & lock for all {
                  existingData?.count
                }{" "}
                assigned students. Paid status is not affected.
              </span>
            )}
            {!isUpdate && mode === "batch" && batchId && (
              <span className="text-muted text-13">
                All students in the selected batch will be assigned.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tab 2 — Manage ───────────────────────────────────────────────────────
function ManageTab() {
  const qc = useQueryClient();
  const [reminderId, setReminderId] = useState("");
  const [filterBatch, setFilterBatch] = useState("");
  const [filterPhase, setFilterPhase] = useState("");
  const [search, setSearch] = useState("");
  const [editRow, setEditRow] = useState(null); // { user_id, deadline, lock_after_minutes }

  // Multi-select state
  const [selectedIds, setSelectedIds] = useState([]); // array of user_id strings
  const [bulkEditOpen, setBulkEditOpen] = useState(false);
  const [bulkEditForm, setBulkEditForm] = useState({
    deadline: "",
    lock_after_minutes: "",
  });

  const toInputDT = (dt) => {
    if (!dt) return "";
    try {
      const d = new Date(dt);
      // datetime-local needs local time, not UTC — pad to "YYYY-MM-DDTHH:mm"
      const pad = (n) => String(n).padStart(2, "0");
      return (
        d.getFullYear() +
        "-" +
        pad(d.getMonth() + 1) +
        "-" +
        pad(d.getDate()) +
        "T" +
        pad(d.getHours()) +
        ":" +
        pad(d.getMinutes())
      );
    } catch {
      return "";
    }
  };

  const { data: remindersData } = useQuery({
    queryKey: ["feesReminders"],
    queryFn: getFeesReminders,
  });
  const { data: batches = [] } = useQuery({
    queryKey: ["batches"],
    queryFn: getAllBatch,
  });
  const { data: phases = [] } = useQuery({
    queryKey: ["phases"],
    queryFn: getAllPhase,
  });

  const reminderOptions = (remindersData?.data || []).map((r) => ({
    label: `${r.title} (${r.total_paid ?? 0}/${r.total_assigned ?? 0} paid)`,
    value: r.id,
  }));
  const batchOptions = batches.map((b) => ({
    label: b.batch_title,
    value: b.id,
  }));
  const phaseOptions = phases.map((p) => ({
    label: p.title || `Phase ${p.Id || p.id}`,
    value: p.Id ?? p.id,
  }));

  const { data: studentsData, isLoading: studLoading } = useQuery({
    queryKey: ["feesReminderStudents", reminderId, filterBatch, filterPhase],
    queryFn: () =>
      getFeesReminderStudents(reminderId, {
        batch_id: filterBatch || undefined,
        phase_id: filterPhase || undefined,
      }),
    enabled: !!reminderId,
  });

  const markMut = useMutation({
    mutationFn: ({ user_id, is_paid }) =>
      markPaidFeesReminder(reminderId, { user_id, is_paid }),
    onSuccess: () => {
      qc.invalidateQueries(["feesReminderStudents"]);
      qc.invalidateQueries(["feesReminders"]);
      toast.success("Updated!");
    },
    onError: (e) => toast.error(e?.response?.data?.message || "Failed"),
  });

  const bulkMut = useMutation({
    mutationFn: (data) => bulkMarkPaidFeesReminder(reminderId, data),
    onSuccess: (d) => {
      qc.invalidateQueries(["feesReminderStudents"]);
      qc.invalidateQueries(["feesReminders"]);
      toast.success(d.message);
    },
    onError: (e) => toast.error(e?.response?.data?.message || "Failed"),
  });

  const removeMut = useMutation({
    mutationFn: (user_id) => removeFeesAssignment(reminderId, user_id),
    onSuccess: () => {
      qc.invalidateQueries(["feesReminderStudents"]);
      toast.success("Removed");
    },
    onError: (e) => toast.error(e?.response?.data?.message || "Failed"),
  });

  const updateMut = useMutation({
    mutationFn: ({ user_id, deadline, lock_after_minutes }) =>
      updateFeesAssignment(reminderId, user_id, {
        deadline,
        lock_after_minutes,
      }),
    onSuccess: () => {
      qc.invalidateQueries(["feesReminderStudents"]);
      toast.success("Assignment updated!");
      setEditRow(null);
    },
    onError: (e) =>
      toast.error(e?.response?.data?.message || "Failed to update"),
  });

  // Bulk update selected students via single API call
  const bulkUpdateMut = useMutation({
    mutationFn: (data) => bulkUpdateFeesAssignment(reminderId, data),
    onSuccess: (d) => {
      qc.invalidateQueries(["feesReminderStudents"]);
      toast.success(d.message || "Bulk updated!");
      setSelectedIds([]);
      setBulkEditOpen(false);
      setBulkEditForm({ deadline: "", lock_after_minutes: "" });
    },
    onError: (e) =>
      toast.error(e?.response?.data?.message || "Bulk update failed"),
  });

  // Checkbox helpers
  const allStudents = studentsData?.data || [];
  const students = search.trim()
    ? allStudents.filter((s) => {
        const q = search.toLowerCase();
        return (
          (s.Name || "").toLowerCase().includes(q) ||
          (s.Phone_Number || "").includes(q)
        );
      })
    : allStudents;
  const paid = students.filter((s) => s.is_paid).length;
  const unpaid = students.length - paid;

  const allVisibleIds = students.map((s) => String(s.user_id));
  const allChecked =
    allVisibleIds.length > 0 &&
    allVisibleIds.every((id) => selectedIds.includes(id));
  const someChecked =
    !allChecked && allVisibleIds.some((id) => selectedIds.includes(id));

  const toggleAll = () => {
    if (allChecked) {
      setSelectedIds((prev) =>
        prev.filter((id) => !allVisibleIds.includes(id)),
      );
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...allVisibleIds])]);
    }
  };

  const toggleOne = (uid) => {
    const id = String(uid);
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  // Clear selection when reminder / filters change
  const handleReminderChange = (v) => {
    setReminderId(v);
    setSelectedIds([]);
    setBulkEditOpen(false);
  };
  const handleBatchChange = (v) => {
    setFilterBatch(v);
    setSelectedIds([]);
    setBulkEditOpen(false);
  };
  const handlePhaseChange = (v) => {
    setFilterPhase(v);
    setSelectedIds([]);
    setBulkEditOpen(false);
  };

  const confirmBulkRemove = () => {
    if (!filterBatch && !filterPhase)
      return toast.warning("Select a batch or phase to bulk-remove");
    const count = students.length;
    if (!count) return toast.warning("No students to remove");
    Swal.fire({
      title: `Remove ${count} student${count !== 1 ? "s" : ""}?`,
      text: `This will remove all ${filterBatch ? "batch" : "phase"}-filtered students from this reminder.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      confirmButtonText: `Remove ${count} student${count !== 1 ? "s" : ""}`,
    }).then(async (r) => {
      if (!r.isConfirmed) return;
      try {
        await Promise.all(
          students.map((s) => removeFeesAssignment(reminderId, s.user_id)),
        );
        qc.invalidateQueries(["feesReminderStudents"]);
        qc.invalidateQueries(["feesReminders"]);
        toast.success(`Removed ${count} student${count !== 1 ? "s" : ""}`);
      } catch {
        toast.error("Some removals failed — please refresh and retry");
      }
    });
  };

  // Bulk delete selected students
  const confirmBulkDeleteSelected = () => {
    const count = selectedIds.length;
    if (!count) return;
    Swal.fire({
      title: `Remove ${count} selected student${count !== 1 ? "s" : ""}?`,
      text: "This will remove their assignment from this reminder. Paid status is not refunded.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      confirmButtonText: `Remove ${count} student${count !== 1 ? "s" : ""}`,
    }).then(async (r) => {
      if (!r.isConfirmed) return;
      try {
        await Promise.all(
          selectedIds.map((uid) => removeFeesAssignment(reminderId, uid)),
        );
        qc.invalidateQueries(["feesReminderStudents"]);
        qc.invalidateQueries(["feesReminders"]);
        toast.success(`Removed ${count} student${count !== 1 ? "s" : ""}`);
        setSelectedIds([]);
        setBulkEditOpen(false);
      } catch {
        toast.error("Some removals failed — please refresh and retry");
      }
    });
  };

  const confirmBulk = (is_paid) => {
    if (!filterBatch && !filterPhase)
      return toast.warning("Select a batch or phase to bulk-update");
    Swal.fire({
      title: `Mark all filtered students as ${is_paid ? "Paid" : "Unpaid"}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: is_paid ? "#28a745" : "#dc3545",
      confirmButtonText: `Yes, mark ${is_paid ? "paid" : "unpaid"}`,
    }).then((r) => {
      if (r.isConfirmed)
        bulkMut.mutate({
          batch_id: filterBatch || undefined,
          phase_id: filterPhase || undefined,
          is_paid,
        });
    });
  };

  return (
    <div>
      {/* Filters */}
      <div className="card shadow-none border border-gray-200 mb-20">
        <div className="card-header border-bottom border-gray-200 py-16 px-20">
          <h6 className="fw-semibold mb-0 d-flex align-items-center gap-8">
            <i className="ph ph-funnel text-main-600" />
            Filter & Bulk Actions
          </h6>
        </div>
        <div className="card-body p-20">
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label fw-semibold mb-1">
                Reminder <span className="text-danger">*</span>
              </label>
              <SearchSelect
                options={reminderOptions}
                value={reminderId}
                onChange={handleReminderChange}
                placeholder="Search reminder…"
              />
            </div>
            <div className="col-md-2">
              <label className="form-label fw-semibold mb-1">
                Filter by Batch
              </label>
              <SearchSelect
                options={batchOptions}
                value={filterBatch}
                onChange={handleBatchChange}
                placeholder="All batches"
              />
            </div>
            <div className="col-md-2">
              <label className="form-label fw-semibold mb-1">
                Filter by Phase
              </label>
              <SearchSelect
                options={phaseOptions}
                value={filterPhase}
                onChange={handlePhaseChange}
                placeholder="All phases"
              />
            </div>
            {(filterBatch || filterPhase) && reminderId && (
              <div className="col-auto d-flex gap-2 align-items-end flex-wrap">
                <button
                  className="btn btn-sm btn-success"
                  style={{ whiteSpace: "nowrap" }}
                  onClick={() => confirmBulk(true)}
                  disabled={bulkMut.isPending}
                >
                  ✓ All Paid
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  style={{ whiteSpace: "nowrap" }}
                  onClick={() => confirmBulk(false)}
                  disabled={bulkMut.isPending}
                >
                  ✗ All Unpaid
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  style={{ whiteSpace: "nowrap" }}
                  onClick={confirmBulkRemove}
                >
                  🗑 Remove All
                </button>
              </div>
            )}
            {reminderId && (
              <div className="col-12">
                <div
                  className="d-flex align-items-center gap-8 px-12 py-8 rounded-8 border border-gray-200"
                  style={{ background: "#fafafa" }}
                >
                  <i className="ph ph-magnifying-glass text-gray-400" />
                  <input
                    className="form-control form-control-sm border-0 p-0"
                    style={{ background: "transparent", boxShadow: "none" }}
                    placeholder="Search by name or mobile number…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <i
                      className="ph ph-x text-gray-400"
                      style={{ cursor: "pointer", flexShrink: 0 }}
                      onClick={() => setSearch("")}
                    />
                  )}
                  {search && (
                    <span className="text-muted text-12 flex-shrink-0">
                      {students.length} result{students.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {reminderId && (
        <>
          {/* Stats */}
          <div className="row g-2 mb-3">
            {[
              {
                label: "Total",
                val: students.length,
                color: "#5b4fcf",
                bg: "#f0eeff",
              },
              { label: "Paid", val: paid, color: "#28a745", bg: "#eafaf1" },
              { label: "Unpaid", val: unpaid, color: "#dc3545", bg: "#fdf0f0" },
            ].map((s) => (
              <div className="col-4" key={s.label}>
                <div
                  className="rounded-3 p-3 text-center"
                  style={{ background: s.bg }}
                >
                  <div className="fs-4 fw-bold" style={{ color: s.color }}>
                    {s.val}
                  </div>
                  <div className="small text-muted">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Bulk Selection Action Bar ── */}
          {selectedIds.length > 0 && (
            <div
              className="card shadow-sm mb-3"
              style={{
                border: "2px solid #5b4fcf",
                borderRadius: 10,
                background: "#f0eeff",
                position: "sticky",
                top: 10,
                zIndex: 10,
              }}
            >
              <div className="card-body p-12">
                <div className="d-flex align-items-center gap-12 flex-wrap">
                  <span className="fw-semibold" style={{ color: "#5b4fcf" }}>
                    {selectedIds.length} student
                    {selectedIds.length !== 1 ? "s" : ""} selected
                  </span>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => {
                      setSelectedIds([]);
                      setBulkEditOpen(false);
                    }}
                  >
                    ✕ Clear selection
                  </button>
                  <div className="ms-auto d-flex gap-2 flex-wrap align-items-center">
                    <button
                      className={`btn btn-sm ${bulkEditOpen ? "btn-primary" : "btn-primary"}`}
                      onClick={() => setBulkEditOpen((v) => !v)}
                    >
                      ✏ Bulk Edit Deadline
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={confirmBulkDeleteSelected}
                    >
                      🗑 Delete Selected
                    </button>
                  </div>
                </div>

                {/* Bulk edit inline form */}
                {bulkEditOpen && (
                  <div className="mt-12 pt-12 border-top border-main-200">
                    <div className="d-flex align-items-end gap-12 flex-wrap">
                      <div>
                        <label className="form-label fw-semibold mb-1 text-12">
                          New Deadline <span className="text-danger">*</span>
                        </label>
                        <input
                          type="datetime-local"
                          className="form-control form-control-sm"
                          style={{ minWidth: 190 }}
                          value={bulkEditForm.deadline}
                          onChange={(e) =>
                            setBulkEditForm((f) => ({
                              ...f,
                              deadline: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <label className="form-label fw-semibold mb-1 text-12">
                          Lock After (mins)
                        </label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          style={{ width: 140 }}
                          placeholder="blank = no lock"
                          min={0}
                          value={bulkEditForm.lock_after_minutes}
                          onChange={(e) =>
                            setBulkEditForm((f) => ({
                              ...f,
                              lock_after_minutes: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="d-flex gap-8">
                        <button
                          className="btn btn-sm btn-primary"
                          disabled={
                            !bulkEditForm.deadline || bulkUpdateMut.isPending
                          }
                          onClick={() =>
                            bulkUpdateMut.mutate({
                              user_ids: selectedIds,
                              deadline: bulkEditForm.deadline,
                              lock_after_minutes:
                                bulkEditForm.lock_after_minutes !== ""
                                  ? bulkEditForm.lock_after_minutes
                                  : null,
                            })
                          }
                        >
                          {bulkUpdateMut.isPending
                            ? `Saving ${selectedIds.length}…`
                            : `Save for ${selectedIds.length} student${selectedIds.length !== 1 ? "s" : ""}`}
                        </button>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => {
                            setBulkEditOpen(false);
                            setBulkEditForm({
                              deadline: "",
                              lock_after_minutes: "",
                            });
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                      <span className="text-muted text-12">
                        0 = lock at deadline · blank = no lock
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Table */}
          {studLoading ? (
            <div className="text-center py-4 text-muted">Loading…</div>
          ) : students.length === 0 ? (
            <div className="text-center py-4 text-muted">
              No students assigned yet.
            </div>
          ) : (
            <div className="card shadow-none border border-gray-200">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead style={{ background: "#f8f7ff" }}>
                    <tr>
                      <th style={{ width: 40 }}>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          style={{ cursor: "pointer" }}
                          checked={allChecked}
                          ref={(el) => {
                            if (el) el.indeterminate = someChecked;
                          }}
                          onChange={toggleAll}
                          title={allChecked ? "Deselect all" : "Select all"}
                        />
                      </th>
                      <th>#</th>
                      <th>Student</th>
                      <th>Batch</th>
                      <th>Phase</th>
                      <th>Deadline</th>
                      <th>Status</th>
                      <th>Paid At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s, i) => {
                      const isEditing = editRow?.user_id === s.user_id;
                      const isSelected = selectedIds.includes(
                        String(s.user_id),
                      );
                      return (
                        <React.Fragment key={s.id}>
                          <tr
                            style={{
                              background: isSelected
                                ? "#ede9ff"
                                : isEditing
                                  ? "#f0f4ff"
                                  : s.is_paid
                                    ? "#f0fff4"
                                    : "white",
                            }}
                          >
                            <td>
                              <input
                                type="checkbox"
                                className="form-check-input"
                                style={{ cursor: "pointer" }}
                                checked={isSelected}
                                onChange={() => toggleOne(s.user_id)}
                              />
                            </td>
                            <td className="text-muted small">{i + 1}</td>
                            <td>
                              <div className="fw-semibold">{s.Name}</div>
                              <div className="text-muted small">
                                {s.Phone_Number || s.Email_Id}
                              </div>
                            </td>
                            <td>
                              <span
                                className="badge"
                                style={{
                                  background: "#e9ecef",
                                  color: "#495057",
                                }}
                              >
                                {s.batch_title || "—"}
                              </span>
                            </td>
                            <td>
                              {s.phase_title ? (
                                <span
                                  className="badge"
                                  style={{
                                    background: "#e3f2fd",
                                    color: "#1565c0",
                                  }}
                                >
                                  {s.phase_title}
                                </span>
                              ) : (
                                <span className="text-muted small">—</span>
                              )}
                            </td>
                            <td className="small">{fmtDT(s.deadline)}</td>
                            <td>
                              {s.is_paid ? (
                                <span className="badge bg-success">Paid</span>
                              ) : (
                                <span className="badge bg-danger">Unpaid</span>
                              )}
                            </td>
                            <td className="small text-muted">
                              {s.paid_at ? fmtDT(s.paid_at) : "—"}
                            </td>
                            <td>
                              <div className="d-flex gap-1 flex-wrap">
                                <button
                                  className={`btn btn-sm ${s.is_paid ? "btn-danger" : "btn-success"}`}
                                  style={{ whiteSpace: "nowrap" }}
                                  onClick={() =>
                                    markMut.mutate({
                                      user_id: s.user_id,
                                      is_paid: !s.is_paid,
                                    })
                                  }
                                  disabled={markMut.isPending}
                                >
                                  {s.is_paid ? "✗ Unpaid" : "✓ Paid"}
                                </button>
                                <button
                                  className={`btn btn-sm ${isEditing ? "btn-primary" : "btn-primary"}`}
                                  title="Edit deadline / lock"
                                  onClick={() => {
                                    if (isEditing) {
                                      setEditRow(null);
                                      return;
                                    }
                                    setEditRow({
                                      user_id: s.user_id,
                                      deadline: toInputDT(s.deadline),
                                      lock_after_minutes:
                                        s.lock_after_minutes ?? "",
                                    });
                                  }}
                                >
                                  ✏
                                </button>
                                <button
                                  className="btn btn-sm btn-danger"
                                  title="Remove assignment"
                                  onClick={() =>
                                    Swal.fire({
                                      title: "Remove assignment?",
                                      text: `Remove ${s.Name} from this reminder?`,
                                      icon: "warning",
                                      showCancelButton: true,
                                      confirmButtonColor: "#dc3545",
                                      confirmButtonText: "Remove",
                                    }).then((r) => {
                                      if (r.isConfirmed)
                                        removeMut.mutate(s.user_id);
                                    })
                                  }
                                >
                                  🗑
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Inline edit row */}
                          {isEditing && (
                            <tr style={{ background: "#eef1ff" }}>
                              <td colSpan={9} className="px-20 py-12">
                                <div className="d-flex align-items-end gap-12 flex-wrap">
                                  <div>
                                    <label className="form-label fw-semibold mb-1 text-12">
                                      New Deadline
                                    </label>
                                    <input
                                      type="datetime-local"
                                      className="form-control form-control-sm"
                                      style={{ minWidth: 190 }}
                                      value={editRow.deadline}
                                      onChange={(e) =>
                                        setEditRow((r) => ({
                                          ...r,
                                          deadline: e.target.value,
                                        }))
                                      }
                                    />
                                  </div>
                                  <div>
                                    <label className="form-label fw-semibold mb-1 text-12">
                                      Lock After (mins)
                                    </label>
                                    <input
                                      type="number"
                                      className="form-control form-control-sm"
                                      style={{ width: 140 }}
                                      placeholder="blank = no lock"
                                      min={0}
                                      value={editRow.lock_after_minutes}
                                      onChange={(e) =>
                                        setEditRow((r) => ({
                                          ...r,
                                          lock_after_minutes: e.target.value,
                                        }))
                                      }
                                    />
                                  </div>
                                  <div className="d-flex gap-8">
                                    <button
                                      className="btn btn-sm btn-primary"
                                      disabled={
                                        !editRow.deadline || updateMut.isPending
                                      }
                                      onClick={() =>
                                        updateMut.mutate({
                                          user_id: editRow.user_id,
                                          deadline: editRow.deadline,
                                          lock_after_minutes:
                                            editRow.lock_after_minutes !== ""
                                              ? editRow.lock_after_minutes
                                              : null,
                                        })
                                      }
                                    >
                                      {updateMut.isPending ? "Saving…" : "Save"}
                                    </button>
                                    <button
                                      className="btn btn-sm btn-secondary"
                                      onClick={() => setEditRow(null)}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                  <span className="text-muted text-12">
                                    0 = lock at deadline · blank = no lock
                                  </span>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────
export default function FeesReminder() {
  const qc = useQueryClient();
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [tab, setTab] = useState(0);
  const [editing, setEditing] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["feesReminders"],
    queryFn: getFeesReminders,
  });

  const deleteMut = useMutation({
    mutationFn: deleteFeesReminder,
    onSuccess: () => {
      qc.invalidateQueries(["feesReminders"]);
      toast.success("Deleted!");
      setEditing(null);
    },
    onError: (e) =>
      toast.error(e?.response?.data?.message || "Failed to delete"),
  });

  const handleDelete = (r) =>
    Swal.fire({
      title: "Delete reminder?",
      text: `"${r.title}" and all assignments will be permanently deleted.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      confirmButtonText: "Delete",
    }).then((res) => {
      if (res.isConfirmed) deleteMut.mutate(r.id);
    });

  return (
    <>
      <AdminSidebar
        isActive={isSidebarActive}
        closeSidebar={() => setIsSidebarActive(false)}
      />
      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={() => setIsSidebarActive((p) => !p)} />
        <div className="dashboard-body">
          {/* Breadcrumb */}
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
              <li className="text-gray-500 mt-4">
                <i className="ph ph-caret-right" />
              </li>
              <li className="text-main-600 fw-semibold text-15">
                Fees Reminder
              </li>
            </ul>
          </div>

          {/* Page header */}
          <div className="card shadow-none border border-gray-200 mb-24">
            <div className="card-body p-20 d-flex align-items-center gap-12">
              <span className="w-44 h-44 d-flex align-items-center justify-content-center rounded-circle bg-main-50">
                <i className="ph ph-money text-main-600 text-xl" />
              </span>
              <div>
                <h5 className="fw-semibold mb-2">Fees Reminder</h5>
                <p className="text-gray-400 text-13 mb-0">
                  Create payment reminders, assign to batches with deadlines,
                  and track payment status.
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="card shadow-none border border-gray-200 mb-24">
            <div className="card-body p-0">
              <ul
                className="nav nav-tabs border-bottom border-gray-200 px-16"
                style={{ gap: 4 }}
              >
                {TABS.map((t, i) => (
                  <li className="nav-item" key={t}>
                    <button
                      className={`nav-link fw-medium px-20 py-14 ${tab === i ? "active" : "text-gray-500"}`}
                      onClick={() => {
                        setTab(i);
                        setEditing(null);
                      }}
                    >
                      {i === 0 && <i className="ph ph-plus-circle me-6" />}
                      {i === 1 && <i className="ph ph-users me-6" />}
                      {i === 2 && <i className="ph ph-list-checks me-6" />}
                      {t}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="p-24">
                {/* ── Tab 0: Create / Edit ── */}
                {tab === 0 && (
                  <div className="row g-24">
                    <div className="col-xl-7">
                      <ReminderForm
                        editing={editing}
                        onClose={() => setEditing(null)}
                      />
                    </div>
                    <div className="col-xl-5">
                      <div className="card shadow-none border border-gray-200 h-100">
                        <div className="card-header border-bottom border-gray-200 py-16 px-20">
                          <h6 className="fw-semibold mb-0 d-flex align-items-center gap-8">
                            <i className="ph ph-list text-main-600" />
                            Existing Reminders
                          </h6>
                        </div>
                        <div className="card-body p-16">
                          {isLoading ? (
                            <div className="text-center py-24 text-gray-400">
                              Loading…
                            </div>
                          ) : !data?.data?.length ? (
                            <div className="text-center py-24 text-gray-400">
                              <i className="ph ph-receipt text-48 d-block mb-8" />
                              No reminders yet. Create one →
                            </div>
                          ) : (
                            <div className="d-flex flex-column gap-12">
                              {data.data.map((r) => (
                                <div
                                  key={r.id}
                                  className="rounded-12 p-16"
                                  style={{
                                    background:
                                      editing?.id === r.id
                                        ? "#f0eeff"
                                        : "#fafafa",
                                    border:
                                      editing?.id === r.id
                                        ? "1.5px solid #6a6cf7"
                                        : "1px solid #e9ecef",
                                    cursor: "pointer",
                                    transition: "all 0.15s",
                                  }}
                                  onClick={() => setEditing(r)}
                                >
                                  <div className="d-flex justify-content-between align-items-start gap-8">
                                    <div className="flex-grow-1 min-w-0">
                                      <div className="fw-semibold text-14 mb-6">
                                        {r.title}
                                      </div>
                                      <div className="d-flex gap-6 flex-wrap">
                                        {r.amount && (
                                          <span
                                            className="badge text-12 fw-medium px-8 py-4"
                                            style={{
                                              background: "#e8f5e9",
                                              color: "#2e7d32",
                                              borderRadius: 6,
                                            }}
                                          >
                                            ₹
                                            {parseFloat(
                                              r.amount,
                                            ).toLocaleString()}
                                          </span>
                                        )}
                                        <span
                                          className="badge text-12 fw-medium px-8 py-4"
                                          style={{
                                            background: "#e3f2fd",
                                            color: "#1565c0",
                                            borderRadius: 6,
                                          }}
                                        >
                                          {r.total_paid ?? 0}/
                                          {r.total_assigned ?? 0} paid
                                        </span>
                                      </div>
                                    </div>
                                    <button
                                      className="btn btn-sm btn-danger flex-shrink-0"
                                      style={{ padding: "4px 8px" }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(r);
                                      }}
                                    >
                                      <i className="ph ph-trash" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {tab === 1 && <AssignTab />}
                {tab === 2 && <ManageTab />}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
