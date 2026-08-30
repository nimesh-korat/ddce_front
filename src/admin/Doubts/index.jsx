import React, { useState } from "react";
import AdminSidebar from "../../common/AdminSidebar";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminDoubts,
  solveDoubt,
  getSubjects,
  getAllBatch,
  getAllPhase,
} from "../../apis/apis";
import { toast } from "react-toastify";

// Helper: render image or PDF link from signed URL + stored key
const FileDisplay = ({ url, label = "View File", imgStyle = {} }) => {
  if (!url) return null;
  // Check if URL path contains .pdf (before the ? query string)
  const path = url.split("?")[0].toLowerCase();
  const isPdf = path.endsWith(".pdf");
  return isPdf ? (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="btn btn-sm btn-main rounded-pill flex-align gap-6 d-inline-flex mt-6"
    >
      <i className="ph ph-file-pdf" /> {label}
    </a>
  ) : (
    <img
      src={url}
      alt={label}
      className="rounded-8 mt-6"
      style={{
        maxWidth: "100%",
        maxHeight: "220px",
        objectFit: "contain",
        display: "block",
        ...imgStyle,
      }}
    />
  );
};

export default function Doubts() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState({
    status: "",
    subject_id: "",
    batch_id: "",
    phase_id: "",
  });
  const [solving, setSolving] = useState(null); // doubt being solved
  const [answerText, setAnswerText] = useState("");
  const [answerImage, setAnswerImage] = useState(null);
  const [expanded, setExpanded] = useState(null);

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
  const subjects = subjectData?.data || [];
  const batches = batchData || [];
  const phases = phaseData || [];

  const { data: doubtsData, isLoading } = useQuery({
    queryKey: ["adminDoubts", filters],
    queryFn: () => getAdminDoubts(filters),
    staleTime: 30 * 1000,
  });
  const doubts = doubtsData?.data || [];
  const pending = doubts.filter((d) => d.status === "pending").length;

  const solveMutation = useMutation({
    mutationFn: ({ id, fd }) => solveDoubt(id, fd),
    onSuccess: () => {
      toast.success("Doubt solved! Student has been notified via SMS.");
      queryClient.invalidateQueries(["adminDoubts"]);
      setSolving(null);
      setAnswerText("");
      setAnswerImage(null);
    },
    onError: (e) =>
      toast.error(e?.response?.data?.message || "Failed to solve"),
  });

  const handleSolve = () => {
    if (!answerText.trim()) return toast.error("Answer text is required");
    const fd = new FormData();
    fd.append("answer_text", answerText);
    if (answerImage) fd.append("answer_image", answerImage);
    solveMutation.mutate({ id: solving.id, fd });
  };

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
                <span className="text-main-600 fw-normal text-15">Doubts</span>
              </li>
            </ul>
          </div>

          {/* Filters */}
          <div className="card border border-gray-100 shadow-sm mb-20">
            <div className="card-body p-16">
              <div className="row g-12 align-items-end">
                <div className="col-lg-3 col-md-6">
                  <label
                    className="text-12 fw-semibold text-gray-500 text-uppercase mb-6 d-block"
                    style={{ letterSpacing: "0.5px" }}
                  >
                    Status
                  </label>
                  <select
                    className="form-select rounded-8"
                    value={filters.status}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, status: e.target.value }))
                    }
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="solved">Solved</option>
                  </select>
                </div>
                <div className="col-lg-3 col-md-6">
                  <label
                    className="text-12 fw-semibold text-gray-500 text-uppercase mb-6 d-block"
                    style={{ letterSpacing: "0.5px" }}
                  >
                    Subject
                  </label>
                  <select
                    className="form-select rounded-8"
                    value={filters.subject_id}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, subject_id: e.target.value }))
                    }
                  >
                    <option value="">All Subjects</option>
                    {subjects.map((s) => (
                      <option key={s.Id} value={s.Id}>
                        {s.Sub_Name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-lg-2 col-md-6">
                  <label
                    className="text-12 fw-semibold text-gray-500 text-uppercase mb-6 d-block"
                    style={{ letterSpacing: "0.5px" }}
                  >
                    Batch
                  </label>
                  <select
                    className="form-select rounded-8"
                    value={filters.batch_id}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, batch_id: e.target.value }))
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
                <div className="col-lg-2 col-md-6">
                  <label
                    className="text-12 fw-semibold text-gray-500 text-uppercase mb-6 d-block"
                    style={{ letterSpacing: "0.5px" }}
                  >
                    Phase
                  </label>
                  <select
                    className="form-select rounded-8"
                    value={filters.phase_id}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, phase_id: e.target.value }))
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
                <div className="col-lg-2 col-md-6">
                  <button
                    className="btn btn-outline-secondary rounded-8 w-100"
                    onClick={() =>
                      setFilters({
                        status: "",
                        subject_id: "",
                        batch_id: "",
                        phase_id: "",
                      })
                    }
                  >
                    <i className="ph ph-x me-6" /> Clear
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-align gap-12 mb-20">
            <span className="text-13 fw-semibold text-gray-600">
              {doubts.length} doubts found
            </span>
            {pending > 0 && (
              <span className="text-12 bg-warning-50 text-warning-700 py-3 px-12 rounded-pill fw-semibold">
                {pending} pending
              </span>
            )}
          </div>

          {/* Doubts List */}
          {isLoading && (
            <div className="text-center py-48">
              <span className="spinner-border text-main-600" />
            </div>
          )}
          {!isLoading && doubts.length === 0 && (
            <div className="card">
              <div className="card-body text-center py-56">
                <i className="ph ph-question text-64 text-gray-300 d-block mb-16" />
                <p className="text-gray-400">No doubts found</p>
              </div>
            </div>
          )}

          <div className="d-flex flex-column gap-12">
            {doubts.map((d) => (
              <div
                key={d.id}
                className="card border shadow-sm"
                style={{
                  borderLeft: `4px solid ${d.status === "solved" ? "#22c55e" : "#f59e0b"}`,
                }}
              >
                <div className="card-body p-20">
                  <div className="flex-between flex-wrap gap-8 mb-12">
                    <div className="flex-align gap-8 flex-wrap">
                      <span
                        className={`text-12 fw-bold py-3 px-12 rounded-pill ${d.status === "solved" ? "bg-success-50 text-success-700" : "bg-warning-50 text-warning-700"}`}
                      >
                        {d.status === "solved" ? "✓ Solved" : "⏳ Pending"}
                      </span>
                      {d.subject_name && (
                        <span className="text-12 bg-main-50 text-main-700 py-3 px-10 rounded-pill">
                          {d.subject_name}
                        </span>
                      )}
                      <span className="text-12 bg-gray-100 text-gray-600 py-3 px-10 rounded-pill">
                        {d.batch_title || "—"}{" "}
                        {d.phase_title ? `· ${d.phase_title}` : ""}
                      </span>
                    </div>
                    <span className="text-12 text-gray-400">
                      {fmtDate(d.created_at)}
                    </span>
                  </div>

                  <div className="flex-align gap-8 mb-10">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle bg-main-50 text-main-600 fw-bold text-14"
                      style={{ width: "36px", height: "36px", flexShrink: 0 }}
                    >
                      {d.student_name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-13 fw-semibold text-gray-800 mb-0">
                        {d.student_name}
                      </p>
                      <p className="text-12 text-gray-400 mb-0">{d.email}</p>
                    </div>
                  </div>

                  <p
                    className="text-14 text-gray-700 mb-10"
                    style={{ lineHeight: "1.6" }}
                  >
                    {d.doubt_text}
                  </p>

                  <FileDisplay url={d.doubt_image} label="View Attached File" />

                  {/* Answer section */}
                  {d.status === "solved" && (
                    <div>
                      <button
                        className="btn btn-sm btn-main rounded-pill text-12 mb-10"
                        onClick={() =>
                          setExpanded(expanded === d.id ? null : d.id)
                        }
                      >
                        <i
                          className={`ph ph-caret-${expanded === d.id ? "up" : "down"} me-4`}
                        />
                        {expanded === d.id ? "Hide Answer" : "View Answer"}
                      </button>
                      {expanded === d.id && (
                        <div
                          className="rounded-8 p-16"
                          style={{
                            background: "#f0fdf4",
                            border: "1px solid #86efac",
                          }}
                        >
                          <p className="text-12 text-gray-500 mb-6 fw-medium">
                            Answered by {d.answered_by_name} •{" "}
                            {fmtDate(d.answered_at)}
                          </p>
                          <p className="text-14 text-gray-700 mb-0">
                            {d.answer_text}
                          </p>
                          <FileDisplay
                            url={d.answer_image}
                            label="View Answer File"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Solve button */}
                  {d.status === "pending" &&
                    (solving?.id === d.id ? (
                      <div className="mt-12 p-16 rounded-8 bg-gray-50 border border-gray-100">
                        <label className="text-13 fw-semibold text-gray-700 mb-8 d-block">
                          Your Answer *
                        </label>
                        <textarea
                          className="form-control rounded-8 mb-10"
                          rows={4}
                          placeholder="Type your answer here..."
                          value={answerText}
                          onChange={(e) => setAnswerText(e.target.value)}
                        />
                        <label className="text-13 fw-semibold text-gray-700 mb-6 d-block">
                          Attach Image / PDF{" "}
                          <span className="text-gray-400 fw-normal text-12">
                            (Optional)
                          </span>
                        </label>
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          className="form-control rounded-8 mb-4"
                          onChange={(e) => {
                            const f = e.target.files[0];
                            if (f && f.size > 10 * 1024 * 1024) {
                              toast.error(
                                "File too large. Maximum allowed size is 10MB.",
                              );
                              e.target.value = "";
                              setAnswerImage(null);
                              return;
                            }
                            setAnswerImage(f || null);
                          }}
                        />
                        <p className="text-12 text-gray-400 mb-10">
                          <i className="ph ph-info me-4" />
                          Max 10MB. Images or PDF accepted
                        </p>
                        <div className="flex-align gap-8">
                          <button
                            className="btn btn-success rounded-8 px-20 flex-align gap-6"
                            onClick={handleSolve}
                            disabled={solveMutation.isPending}
                          >
                            {solveMutation.isPending ? (
                              <>
                                <span className="spinner-border spinner-border-sm" />{" "}
                                Solving...
                              </>
                            ) : (
                              <>
                                <i className="ph ph-check-circle" /> Mark as
                                Solved
                              </>
                            )}
                          </button>
                          <button
                            className="btn btn-neutral-200 rounded-8"
                            onClick={() => {
                              setSolving(null);
                              setAnswerText("");
                              setAnswerImage(null);
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="btn btn-main rounded-pill px-16 py-7 text-13 mt-10 flex-align gap-6"
                        onClick={() => {
                          setSolving(d);
                          setAnswerText("");
                          setAnswerImage(null);
                        }}
                      >
                        <i className="ph ph-pencil-line" /> Solve This Doubt
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
