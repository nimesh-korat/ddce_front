import React, { useState, useRef } from "react";
import AdminSidebar from "../../common/AdminSidebar";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  uploadAttendanceCSV,
  getAttendanceUploads,
  getAttendanceBatch,
  deleteAttendanceBatch,
  getSubjects,
  downloadAttendanceReport,
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

export default function Attendance() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const queryClient = useQueryClient();
  const fileRef = useRef(null);

  // Upload form
  const [form, setForm] = useState({
    session_date: "",
    subject_id: "",
    topic_name: "",
  });
  const [csvFile, setCsvFile] = useState(null);
  const [summary, setSummary] = useState(null);

  // View panel
  const [selectedBatch, setSelectedBatch] = useState(null);

  // Report panel
  const [report, setReport] = useState({
    from_date: "",
    to_date: "",
    batch_id: "",
    phase_id: "",
    search: "",
  });
  const [downloading, setDownloading] = useState(false);

  const { data: subjectData } = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
    staleTime: 5 * 60 * 1000,
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
  const subjects = subjectData?.data || [];

  const { data: uploadsData, isLoading: uploadsLoading } = useQuery({
    queryKey: ["attendanceUploads"],
    queryFn: getAttendanceUploads,
    staleTime: 30 * 1000,
  });
  const uploads = uploadsData?.data || [];

  const { data: batchStudentsData, isLoading: batchLoading } = useQuery({
    queryKey: ["attendanceBatch", selectedBatch],
    queryFn: () => getAttendanceBatch(selectedBatch),
    enabled: !!selectedBatch,
    staleTime: 30 * 1000,
  });
  const batchStudents = batchStudentsData?.data || [];

  const uploadMutation = useMutation({
    mutationFn: (fd) => uploadAttendanceCSV(fd),
    onSuccess: (res) => {
      setSummary(res.summary);
      queryClient.invalidateQueries(["attendanceUploads"]);
      setForm({ session_date: "", subject_id: "", topic_name: "" });
      setCsvFile(null);
      if (fileRef.current) fileRef.current.value = "";
      toast.success(`Marked ${res.summary.marked} students`);
    },
    onError: (e) => toast.error(e?.response?.data?.message || "Upload failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteAttendanceBatch(id),
    onSuccess: (_, id) => {
      toast.success("Upload batch deleted");
      queryClient.invalidateQueries(["attendanceUploads"]);
      if (selectedBatch === id) setSelectedBatch(null);
    },
    onError: () => toast.error("Failed to delete"),
  });

  const handleUpload = () => {
    if (!form.session_date) return toast.error("Select session date");
    if (!csvFile) return toast.error("Choose a CSV file");
    const fd = new FormData();
    fd.append("csv", csvFile);
    fd.append("session_date", form.session_date);
    if (form.subject_id) fd.append("subject_id", form.subject_id);
    if (form.topic_name) fd.append("topic_name", form.topic_name);
    uploadMutation.mutate(fd);
  };

  const handleDelete = (batch_id, date) => {
    Swal.fire({
      title: "Delete this upload?",
      text: `All attendance records for ${date} will be permanently deleted.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete",
    }).then((r) => {
      if (r.isConfirmed) deleteMutation.mutate(batch_id);
    });
  };

  const handleDownload = async () => {
    if (!report.from_date || !report.to_date)
      return toast.error("Select date range");
    if (!report.batch_id) return toast.error("Select batch");
    try {
      setDownloading(true);
      await downloadAttendanceReport({
        from_date: report.from_date,
        to_date: report.to_date,
        batch_id: report.batch_id,
        phase_id: report.phase_id || undefined,
        search: report.search || undefined,
      });
      toast.success("Report downloaded!");
    } catch {
      toast.error("Failed to download report");
    } finally {
      setDownloading(false);
    }
  };

  const fmtDate = (d) => {
    if (!d) return "—";
    // Parse as local date to avoid UTC midnight timezone shift
    const [year, month, day] = String(d).split("T")[0].split("-");
    const dt = new Date(+year, +month - 1, +day);
    return dt.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  const fmtDateTime = (d) =>
    d
      ? new Date(d).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
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
                  Attendance
                </span>
              </li>
            </ul>
          </div>

          <div className="row g-20">
            {/* ── Upload Panel ── */}
            <div className="col-lg-4">
              <div className="card border border-gray-100 shadow-sm h-100">
                <div className="card-body p-20">
                  <h6 className="fw-bold text-gray-800 mb-16 flex-align gap-8">
                    <i className="ph ph-upload-simple text-main-600" /> Upload
                    Attendance CSV
                  </h6>

                  <div className="mb-12">
                    <label
                      className="text-12 fw-semibold text-gray-500 text-uppercase mb-6 d-block"
                      style={{ letterSpacing: "0.5px" }}
                    >
                      Session Date *
                    </label>
                    <input
                      type="date"
                      className="form-control rounded-8"
                      value={form.session_date}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, session_date: e.target.value }))
                      }
                    />
                  </div>

                  <div className="mb-12">
                    <label
                      className="text-12 fw-semibold text-gray-500 text-uppercase mb-6 d-block"
                      style={{ letterSpacing: "0.5px" }}
                    >
                      Subject
                    </label>
                    <select
                      className="form-select rounded-8"
                      value={form.subject_id}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, subject_id: e.target.value }))
                      }
                    >
                      <option value="">Select Subject</option>
                      {subjects.map((s) => (
                        <option key={s.Id} value={s.Id}>
                          {s.Sub_Name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-12">
                    <label
                      className="text-12 fw-semibold text-gray-500 text-uppercase mb-6 d-block"
                      style={{ letterSpacing: "0.5px" }}
                    >
                      Topic Name
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-8"
                      placeholder="e.g. Limits and Continuity"
                      value={form.topic_name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, topic_name: e.target.value }))
                      }
                    />
                  </div>

                  <div className="mb-16">
                    <label
                      className="text-12 fw-semibold text-gray-500 text-uppercase mb-6 d-block"
                      style={{ letterSpacing: "0.5px" }}
                    >
                      CSV File *
                    </label>
                    <p className="text-12 text-gray-400 mb-8">
                      Columns: <code>email</code>, <code>minutes</code>{" "}
                      (optional)
                    </p>
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".csv"
                      className="form-control rounded-8"
                      onChange={(e) => setCsvFile(e.target.files[0] || null)}
                    />
                  </div>

                  <button
                    className="btn btn-main w-100 rounded-8 flex-align gap-8 justify-content-center"
                    onClick={handleUpload}
                    disabled={uploadMutation.isPending}
                  >
                    {uploadMutation.isPending ? (
                      <>
                        <span className="spinner-border spinner-border-sm" />{" "}
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="ph ph-upload-simple" /> Upload & Mark
                        Attendance
                      </>
                    )}
                  </button>

                  {/* Summary */}
                  {summary && (
                    <div className="mt-16 p-14 rounded-8 border border-gray-100 bg-gray-50">
                      <p className="text-13 fw-semibold text-gray-700 mb-10">
                        Upload Summary
                      </p>
                      <div className="row g-8 text-center">
                        {[
                          ["Total", summary.total, "#6366f1", "#ede9fe"],
                          ["Marked", summary.marked, "#22c55e", "#f0fdf4"],
                          [
                            "Not Found",
                            summary.not_found,
                            "#ef4444",
                            "#fff7f7",
                          ],
                        ].map(([label, val, color, bg]) => (
                          <div key={label} className="col-4">
                            <div
                              className="rounded-8 py-8"
                              style={{ background: bg }}
                            >
                              <div
                                className="text-16 fw-bold"
                                style={{ color }}
                              >
                                {val}
                              </div>
                              <div className="text-11 text-gray-500">
                                {label}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {summary.not_found_emails?.length > 0 && (
                        <div className="mt-10">
                          <p className="text-12 fw-semibold text-danger-600 mb-6">
                            Not found emails:
                          </p>
                          <div
                            style={{ maxHeight: "120px", overflowY: "auto" }}
                          >
                            {summary.not_found_emails.map((e) => (
                              <p key={e} className="text-12 text-gray-600 mb-2">
                                • {e}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Upload History ── */}
            <div className="col-lg-8">
              <div className="card border border-gray-100 shadow-sm">
                <div className="flex-between px-20 py-14 border-bottom border-gray-100">
                  <h6 className="fw-bold text-gray-800 mb-0 flex-align gap-8">
                    <i className="ph ph-clock-counter-clockwise text-main-600" />{" "}
                    Upload History
                  </h6>
                  <span className="text-13 text-gray-400">
                    {uploads.length} uploads
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
                          Date
                        </th>
                        <th className="text-12 text-gray-500 fw-medium py-12">
                          Subject
                        </th>
                        <th className="text-12 text-gray-500 fw-medium py-12">
                          Topic
                        </th>
                        <th className="text-12 text-gray-500 fw-medium py-12 text-center">
                          Students
                        </th>
                        <th className="text-12 text-gray-500 fw-medium py-12">
                          Uploaded
                        </th>
                        <th className="text-12 text-gray-500 fw-medium py-12 text-center">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {uploadsLoading &&
                        Array.from({ length: 4 }).map((_, i) => (
                          <tr key={i}>
                            {Array.from({ length: 7 }).map((__, j) => (
                              <td key={j} className="py-12 px-16">
                                <div
                                  className="bg-gray-100 rounded"
                                  style={{ height: "13px", width: "80%" }}
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      {!uploadsLoading && uploads.length === 0 && (
                        <tr>
                          <td
                            colSpan={7}
                            className="text-center text-gray-400 py-40"
                          >
                            <i className="ph ph-clipboard-text text-48 d-block mb-12 text-gray-300" />
                            No uploads yet
                          </td>
                        </tr>
                      )}
                      {!uploadsLoading &&
                        uploads.map((u, i) => (
                          <tr
                            key={u.upload_batch_id}
                            className={
                              selectedBatch === u.upload_batch_id
                                ? "bg-main-50"
                                : ""
                            }
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              setSelectedBatch(
                                selectedBatch === u.upload_batch_id
                                  ? null
                                  : u.upload_batch_id,
                              )
                            }
                          >
                            <td className="text-13 text-gray-400 fw-medium py-12 px-16">
                              {i + 1}
                            </td>
                            <td className="text-13 fw-semibold text-gray-800 py-12">
                              {fmtDate(u.session_date)}
                            </td>
                            <td className="text-13 text-gray-600 py-12">
                              {u.subject_name || "—"}
                            </td>
                            <td
                              className="text-13 text-gray-600 py-12"
                              style={{
                                maxWidth: "160px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {u.topic_name || "—"}
                            </td>
                            <td className="py-12 text-center">
                              <span className="text-13 fw-semibold text-main-600 bg-main-50 py-2 px-10 rounded-pill">
                                {u.total_students}
                              </span>
                            </td>
                            <td
                              className="text-12 text-gray-500 py-12"
                              style={{ whiteSpace: "nowrap" }}
                            >
                              {fmtDateTime(u.uploaded_on)}
                            </td>
                            <td
                              className="py-12 text-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                className="btn btn-sm btn-outline-danger rounded-pill"
                                onClick={() =>
                                  handleDelete(
                                    u.upload_batch_id,
                                    fmtDate(u.session_date),
                                  )
                                }
                                disabled={deleteMutation.isPending}
                              >
                                <i className="ph ph-trash text-12" />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {/* Selected batch student list */}
                {selectedBatch && (
                  <div className="border-top border-gray-100">
                    <div className="px-20 py-12 bg-main-50 flex-between">
                      <p className="text-13 fw-semibold text-main-700 mb-0 flex-align gap-6">
                        <i className="ph ph-users text-14" />
                        {batchStudents.length} student
                        {batchStudents.length !== 1 ? "s" : ""} in this upload
                      </p>
                      <button
                        className="btn btn-sm btn-outline-secondary rounded-pill text-12"
                        onClick={() => setSelectedBatch(null)}
                      >
                        Close <i className="ph ph-x ms-4 text-11" />
                      </button>
                    </div>
                    <div
                      style={{
                        overflowX: "auto",
                        maxHeight: "320px",
                        overflowY: "auto",
                      }}
                    >
                      <table className="table table-sm table-hover mb-0">
                        <thead
                          className="bg-gray-50"
                          style={{ position: "sticky", top: 0 }}
                        >
                          <tr>
                            <th className="text-12 text-gray-500 fw-medium py-10 px-16">
                              #
                            </th>
                            <th className="text-12 text-gray-500 fw-medium py-10">
                              Student
                            </th>
                            <th className="text-12 text-gray-500 fw-medium py-10">
                              Email
                            </th>
                            <th className="text-12 text-gray-500 fw-medium py-10">
                              Batch
                            </th>
                            <th className="text-12 text-gray-500 fw-medium py-10">
                              Phase
                            </th>
                            <th className="text-12 text-gray-500 fw-medium py-10 text-center">
                              Minutes
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {batchLoading &&
                            Array.from({ length: 3 }).map((_, i) => (
                              <tr key={i}>
                                {Array.from({ length: 6 }).map((__, j) => (
                                  <td key={j} className="py-8 px-16">
                                    <div
                                      className="bg-gray-100 rounded"
                                      style={{ height: "12px", width: "80%" }}
                                    />
                                  </td>
                                ))}
                              </tr>
                            ))}
                          {!batchLoading &&
                            batchStudents.map((s, i) => (
                              <tr key={s.id}>
                                <td className="text-12 text-gray-400 py-8 px-16">
                                  {i + 1}
                                </td>
                                <td className="text-13 fw-medium text-gray-800 py-8">
                                  {s.student_name}
                                </td>
                                <td className="text-12 text-gray-500 py-8">
                                  {s.email}
                                </td>
                                <td className="py-8">
                                  <span className="text-11 bg-main-50 text-main-700 py-1 px-8 rounded-pill fw-medium">
                                    {s.batch_title || "—"}
                                  </span>
                                </td>
                                <td className="py-8">
                                  <span className="text-11 bg-info-50 text-info-700 py-1 px-8 rounded-pill fw-medium">
                                    {s.phase_title || "—"}
                                  </span>
                                </td>
                                <td className="text-13 text-center py-8">
                                  {s.minutes !== null ? (
                                    <span className="text-main-600 fw-semibold">
                                      {s.minutes} min
                                    </span>
                                  ) : (
                                    <span className="text-gray-400">—</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Download Report Panel ── */}
          <div className="row g-20 mt-4">
            <div className="col-12">
              <div className="card border border-gray-100 shadow-sm">
                <div className="flex-between px-20 py-14 border-bottom border-gray-100">
                  <h6 className="fw-bold text-gray-800 mb-0 flex-align gap-8">
                    <i className="ph ph-file-csv text-main-600" /> Download
                    Attendance Report
                  </h6>
                </div>
                <div className="card-body p-20">
                  <div className="row g-12 align-items-end">
                    <div className="col-lg-2 col-md-6">
                      <label
                        className="text-12 fw-semibold text-gray-500 text-uppercase mb-6 d-block"
                        style={{ letterSpacing: "0.5px" }}
                      >
                        From Date *
                      </label>
                      <input
                        type="date"
                        className="form-control rounded-8"
                        value={report.from_date}
                        onChange={(e) =>
                          setReport((r) => ({
                            ...r,
                            from_date: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="col-lg-2 col-md-6">
                      <label
                        className="text-12 fw-semibold text-gray-500 text-uppercase mb-6 d-block"
                        style={{ letterSpacing: "0.5px" }}
                      >
                        To Date *
                      </label>
                      <input
                        type="date"
                        className="form-control rounded-8"
                        value={report.to_date}
                        onChange={(e) =>
                          setReport((r) => ({ ...r, to_date: e.target.value }))
                        }
                      />
                    </div>
                    <div className="col-lg-2 col-md-6">
                      <label
                        className="text-12 fw-semibold text-gray-500 text-uppercase mb-6 d-block"
                        style={{ letterSpacing: "0.5px" }}
                      >
                        Batch *
                      </label>
                      <SearchableSelect
                        options={batches.map((b) => ({
                          label: b.batch_title,
                          value: b.id,
                        }))}
                        value={report.batch_id}
                        onChange={(v) =>
                          setReport((r) => ({ ...r, batch_id: v }))
                        }
                        placeholder="Select Batch"
                      />
                    </div>
                    <div className="col-lg-2 col-md-6">
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
                        value={report.phase_id}
                        onChange={(v) =>
                          setReport((r) => ({ ...r, phase_id: v }))
                        }
                        placeholder="All Phases"
                      />
                    </div>
                    <div className="col-lg-2 col-md-6">
                      <label
                        className="text-12 fw-semibold text-gray-500 text-uppercase mb-6 d-block"
                        style={{ letterSpacing: "0.5px" }}
                      >
                        Search Email / Phone
                      </label>
                      <input
                        type="text"
                        className="form-control rounded-8"
                        placeholder="Search..."
                        value={report.search}
                        onChange={(e) =>
                          setReport((r) => ({ ...r, search: e.target.value }))
                        }
                      />
                    </div>
                    <div className="col-lg-2 col-md-6 d-flex align-items-end gap-12 flex-wrap">
                      <button
                        className="btn btn-main rounded-8 flex-align gap-8"
                        onClick={handleDownload}
                        disabled={downloading}
                      >
                        {downloading ? (
                          <>
                            <span className="spinner-border spinner-border-sm" />{" "}
                            Generating...
                          </>
                        ) : (
                          <>
                            <i className="ph ph-file-xls" /> Download Excel
                          </>
                        )}
                      </button>
                    </div>
                  </div>
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
