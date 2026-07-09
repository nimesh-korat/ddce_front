import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getStudentProfile } from "../../apis/apis";
import AdminSidebar from "../../common/AdminSidebar";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";
import { MathJax, MathJaxContext } from "better-react-mathjax";

const mathConfig = {
  tex2jax: {
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"],
    ],
  },
  messageStyle: "none",
};

// ── Sub-components ───────────────────────────────────────────

function StatCard({ icon, label, value, sub, color = "main" }) {
  const colorMap = {
    main: { bg: "bg-main-50", text: "text-main-600" },
    success: { bg: "bg-success-50", text: "text-success-600" },
    danger: { bg: "bg-danger-50", text: "text-danger-600" },
    warning: { bg: "bg-warning-50", text: "text-warning-600" },
  };
  const c = colorMap[color] || colorMap.main;
  return (
    <div className="card h-100">
      <div className="card-body p-20">
        <div
          className={`w-48 h-48 rounded-12 ${c.bg} d-flex align-items-center justify-content-center mb-16`}
        >
          <i className={`ph ${icon} text-24 ${c.text}`} />
        </div>
        <h4 className={`fw-bold mb-4 ${c.text}`}>{value}</h4>
        <p className="text-13 text-gray-500 mb-0">{label}</p>
        {sub && <p className="text-11 text-gray-400 mt-4 mb-0">{sub}</p>}
      </div>
    </div>
  );
}

function AccuracyBar({ subject, accuracy, attempted, correct }) {
  const color =
    accuracy >= 75 ? "#22c55e" : accuracy >= 50 ? "#f59e0b" : "#ef4444";
  return (
    <div className="mb-14">
      <div className="flex-between mb-6">
        <span className="text-13 fw-medium text-gray-700">{subject}</span>
        <div className="flex-align gap-10">
          <span className="text-11 text-gray-400">
            {correct}/{attempted}
          </span>
          <span
            className="text-13 fw-bold"
            style={{ color, minWidth: "42px", textAlign: "right" }}
          >
            {accuracy}%
          </span>
        </div>
      </div>
      <div
        className="rounded-pill overflow-hidden"
        style={{ height: "8px", background: "#f1f5f9" }}
      >
        <div
          className="rounded-pill"
          style={{
            width: `${accuracy}%`,
            height: "100%",
            background: `linear-gradient(90deg,${color}88,${color})`,
            transition: "width 1.2s ease",
          }}
        />
      </div>
    </div>
  );
}

function RingChart({
  pct,
  size = 120,
  strokeWidth = 10,
  color = "#6366f1",
  label = "Accuracy",
}) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const off = circ - (pct / 100) * circ;
  return (
    <div className="position-relative d-inline-flex align-items-center justify-content-center">
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circ}
          strokeDashoffset={isNaN(off) ? circ : off}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.2s ease" }}
        />
      </svg>
      <div className="position-absolute text-center">
        <div
          style={{
            color,
            fontWeight: 800,
            fontSize: size > 100 ? "22px" : "16px",
            lineHeight: 1,
          }}
        >
          {pct}%
        </div>
        <div style={{ color: "#94a3b8", fontSize: "10px", marginTop: "2px" }}>
          {label}
        </div>
      </div>
    </div>
  );
}

const TABS = ["Overview", "Quiz Results", "Practice Results", "Activity"];

export default function StudentProfile() {
  const { student_id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState("Overview");
  const [isSidebarActive, setIsSidebarActive] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["studentProfile", student_id],
    queryFn: async () => {
      const res = await getStudentProfile(student_id);
      return res.data;
    },
    staleTime: 2 * 60 * 1000,
  });

  const fmtDate = (d) => {
    if (!d) return "—";
    try {
      return new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };
  const fmtDateTime = (d) => {
    if (!d) return "—";
    try {
      return new Date(d).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "—";
    }
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
          {isLoading && (
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ minHeight: "60vh" }}
            >
              <div className="text-center">
                <span
                  className="spinner-border text-main-600 mb-16"
                  style={{ width: "3rem", height: "3rem" }}
                />
                <p className="text-gray-400 mt-16">
                  Loading student profile...
                </p>
              </div>
            </div>
          )}

          {isError && !isLoading && (
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ minHeight: "60vh" }}
            >
              <div className="text-center">
                <i className="ph ph-warning text-64 text-warning-400 d-block mb-16" />
                <p className="text-gray-500 mb-16">
                  Failed to load student profile.
                </p>
                <button
                  onClick={() => navigate(-1)}
                  className="btn btn-main rounded-pill px-24"
                >
                  Go Back
                </button>
              </div>
            </div>
          )}

          {!isLoading &&
            !isError &&
            data &&
            (() => {
              const {
                profile,
                stats,
                subjects,
                strongest,
                weakest,
                quiz_results,
                practice_results,
                activity,
                rank,
                engagement,
              } = data;
              const initials =
                profile.Name?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() || "?";
              const engPct = Math.min(
                Math.round((engagement.active_days_30 / 30) * 100),
                100,
              );
              const rankPct =
                rank.batch_rank && rank.batch_total
                  ? Math.round(
                      ((rank.batch_total - rank.batch_rank + 1) /
                        rank.batch_total) *
                        100,
                    )
                  : 0;

              return (
                <>
                  {/* Breadcrumb */}
                  <div className="flex-between flex-wrap gap-8 mb-24">
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
                          <span className="text-gray-500 d-flex">
                            <i className="ph ph-caret-right" />
                          </span>
                        </li>
                        <li>
                          <Link
                            to="/admin/studentWiseExamData"
                            className="text-gray-200 fw-normal text-15 hover-text-main-600"
                          >
                            Student Data
                          </Link>
                        </li>
                        <li>
                          <span className="text-gray-500 d-flex">
                            <i className="ph ph-caret-right" />
                          </span>
                        </li>
                        <li>
                          <span className="text-main-600 fw-normal text-15">
                            {profile.Name}
                          </span>
                        </li>
                      </ul>
                    </div>
                    <button
                      onClick={() => navigate(-1)}
                      className="btn btn-secondary rounded-pill py-8 px-20 flex-align gap-6"
                    >
                      <i className="ph ph-arrow-left text-14" /> Back
                    </button>
                  </div>

                  {/* ── HERO ── */}
                  <div className="card mb-20 overflow-hidden">
                    <div
                      style={{
                        background: "linear-gradient(135deg,#312e81,#1e3a5f)",
                        height: "90px",
                      }}
                    />
                    <div className="card-body pt-0 pb-20 px-24">
                      <div className="row align-items-end g-16">
                        <div
                          className="col-auto"
                          style={{ marginTop: "-48px" }}
                        >
                          <div
                            className="d-flex align-items-center justify-content-center rounded-circle fw-bold text-white"
                            style={{
                              width: "90px",
                              height: "90px",
                              background:
                                "linear-gradient(135deg,#6366f1,#8b5cf6)",
                              fontSize: "28px",
                              border: "4px solid #fff",
                              boxShadow: "0 4px 16px rgba(99,102,241,0.3)",
                            }}
                          >
                            {initials}
                          </div>
                        </div>
                        <div className="col">
                          <h4 className="fw-bold mb-4 text-gray-800 mt-16">
                            {profile.Name}
                          </h4>
                          <div className="flex-align gap-12 flex-wrap">
                            {profile.Email && (
                              <span className="text-13 text-gray-500 flex-align gap-4">
                                <i className="ph ph-envelope text-main-600" />
                                {profile.Email}
                              </span>
                            )}
                            {profile.Phone && (
                              <span className="text-13 text-gray-500 flex-align gap-4">
                                <i className="ph ph-phone text-main-600" />
                                {String(profile.Phone)}
                              </span>
                            )}
                            {profile.batch_title && (
                              <span className="text-12 bg-main-50 text-main-700 py-2 px-10 rounded-pill fw-medium">
                                {profile.batch_title}
                              </span>
                            )}
                            {profile.phase_title && (
                              <span className="text-12 bg-info-50 text-info-700 py-2 px-10 rounded-pill fw-medium">
                                {profile.phase_title}
                              </span>
                            )}
                          </div>
                        </div>
                        {rank.batch_rank && (
                          <div className="col-auto">
                            <div
                              className="text-center p-14 rounded-12"
                              style={{
                                background: "rgba(245,158,11,0.1)",
                                border: "1px solid rgba(245,158,11,0.3)",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "26px",
                                  fontWeight: 900,
                                  color: "#f59e0b",
                                  lineHeight: 1,
                                }}
                              >
                                #{rank.batch_rank}
                              </div>
                              <div className="text-11 text-gray-500 mt-4">
                                of {rank.batch_total} in batch
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ── TABS ── */}
                  <div
                    className="flex-align gap-4 mb-20 p-4 bg-gray-50 rounded-12"
                    style={{ width: "fit-content" }}
                  >
                    {TABS.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`btn rounded-10 py-8 px-20 text-14 fw-medium ${tab === t ? "btn-main text-white" : "bg-transparent text-gray-500"}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  {/* ══ OVERVIEW ══ */}
                  {tab === "Overview" && (
                    <>
                      {/* Strongest / Weakest */}
                      {(strongest || weakest) && (
                        <div className="row g-16 mb-20">
                          {strongest && (
                            <div className="col-md-6">
                              <div
                                className="card border-0"
                                style={{
                                  background:
                                    "linear-gradient(135deg,#dcfce7,#bbf7d0)",
                                }}
                              >
                                <div className="card-body p-16 flex-align gap-12">
                                  <div className="w-44 h-44 rounded-circle bg-success-600 d-flex align-items-center justify-content-center flex-shrink-0">
                                    <i className="ph ph-trophy text-white text-20" />
                                  </div>
                                  <div>
                                    <p className="text-11 text-success-700 fw-semibold mb-2">
                                      STRONGEST SUBJECT
                                    </p>
                                    <h6 className="fw-bold text-success-800 mb-0">
                                      {strongest.subject_name}
                                    </h6>
                                    <p className="text-12 text-success-600 mb-0">
                                      {strongest.accuracy}% accuracy ·{" "}
                                      {strongest.attempted} attempted
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {weakest &&
                            weakest.subject_name !==
                              strongest?.subject_name && (
                              <div className="col-md-6">
                                <div
                                  className="card border-0"
                                  style={{
                                    background:
                                      "linear-gradient(135deg,#fee2e2,#fecaca)",
                                  }}
                                >
                                  <div className="card-body p-16 flex-align gap-12">
                                    <div className="w-44 h-44 rounded-circle bg-danger-600 d-flex align-items-center justify-content-center flex-shrink-0">
                                      <i className="ph ph-trend-down text-white text-20" />
                                    </div>
                                    <div>
                                      <p className="text-11 text-danger-700 fw-semibold mb-2">
                                        NEEDS IMPROVEMENT
                                      </p>
                                      <h6 className="fw-bold text-danger-800 mb-0">
                                        {weakest.subject_name}
                                      </h6>
                                      <p className="text-12 text-danger-600 mb-0">
                                        {weakest.accuracy}% accuracy ·{" "}
                                        {weakest.attempted} attempted
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                        </div>
                      )}

                      {/* Stat cards */}
                      <div className="row g-16 mb-20">
                        <div className="col-xl-3 col-md-6">
                          <StatCard
                            icon="ph-list-checks"
                            label="Total Attempted"
                            value={stats.total_attempted?.toLocaleString()}
                            sub={`Test: ${stats.test_attempted} · Practice: ${stats.prac_attempted}`}
                            color="main"
                          />
                        </div>
                        <div className="col-xl-3 col-md-6">
                          <StatCard
                            icon="ph-check-circle"
                            label="Total Correct"
                            value={stats.total_correct?.toLocaleString()}
                            sub={`Test: ${stats.test_correct} · Practice: ${stats.prac_correct}`}
                            color="success"
                          />
                        </div>
                        <div className="col-xl-3 col-md-6">
                          <StatCard
                            icon="ph-x-circle"
                            label="Total Incorrect"
                            value={stats.total_incorrect?.toLocaleString()}
                            color="danger"
                          />
                        </div>
                        <div className="col-xl-3 col-md-6">
                          <StatCard
                            icon="ph-clipboard-text"
                            label="Quizzes Taken"
                            value={stats.quiz_count}
                            sub={`${stats.practice_count} practices`}
                            color="warning"
                          />
                        </div>
                      </div>

                      <div className="row g-16">
                        {/* Ring + bars */}
                        <div className="col-xl-4">
                          <div className="card h-100">
                            <div className="card-body p-24">
                              <h6 className="fw-semibold text-gray-700 mb-20">
                                Overall Performance
                              </h6>
                              <div className="text-center mb-24">
                                <RingChart
                                  pct={stats.accuracy_pct}
                                  color={
                                    stats.accuracy_pct >= 75
                                      ? "#22c55e"
                                      : stats.accuracy_pct >= 50
                                        ? "#f59e0b"
                                        : "#ef4444"
                                  }
                                />
                              </div>
                              <div className="d-flex flex-column gap-14">
                                {[
                                  {
                                    label: "Engagement (30d)",
                                    value: `${engagement.active_days_30} active days`,
                                    pct: engPct,
                                    color: "#6366f1",
                                  },
                                  {
                                    label: "Batch Rank Percentile",
                                    value: rank.batch_rank
                                      ? `Top ${Math.max(1, 100 - rankPct)}%`
                                      : "—",
                                    pct: rankPct,
                                    color: "#f59e0b",
                                  },
                                ].map((item) => (
                                  <div key={item.label}>
                                    <div className="flex-between mb-6">
                                      <span className="text-12 text-gray-500">
                                        {item.label}
                                      </span>
                                      <span
                                        className="text-12 fw-semibold"
                                        style={{ color: item.color }}
                                      >
                                        {item.value}
                                      </span>
                                    </div>
                                    <div
                                      className="rounded-pill overflow-hidden"
                                      style={{
                                        height: "6px",
                                        background: "#f1f5f9",
                                      }}
                                    >
                                      <div
                                        className="rounded-pill"
                                        style={{
                                          width: `${item.pct}%`,
                                          height: "100%",
                                          background: item.color,
                                          transition: "width 1s ease",
                                        }}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Personal info */}
                        <div className="col-xl-4">
                          <div className="card h-100">
                            <div className="card-body p-24">
                              <h6 className="fw-semibold text-gray-700 mb-20">
                                Personal Details
                              </h6>
                              <div className="d-flex flex-column gap-14">
                                {[
                                  {
                                    icon: "ph-user",
                                    label: "Full Name",
                                    value: profile.Name,
                                  },
                                  {
                                    icon: "ph-envelope",
                                    label: "Email",
                                    value: profile.Email || "—",
                                  },
                                  {
                                    icon: "ph-phone",
                                    label: "Mobile",
                                    value: profile.Phone
                                      ? String(profile.Phone)
                                      : "—",
                                  },
                                  {
                                    icon: "ph-identification-card",
                                    label: "Enrollment",
                                    value: profile.Enrollment_No || "—",
                                  },
                                  {
                                    icon: "ph-buildings",
                                    label: "College",
                                    value: profile.College_Name,
                                  },
                                  {
                                    icon: "ph-graduation-cap",
                                    label: "Branch",
                                    value: profile.Branch_Name,
                                  },
                                  {
                                    icon: "ph-stack-simple",
                                    label: "Semester",
                                    value: profile.Semester
                                      ? `Sem ${profile.Semester}`
                                      : "—",
                                  },
                                  {
                                    icon: "ph-users-three",
                                    label: "Batch",
                                    value: profile.batch_title || "—",
                                  },
                                  {
                                    icon: "ph-stack",
                                    label: "Phase",
                                    value: profile.phase_title || "—",
                                  },
                                  {
                                    icon: "ph-calendar-plus",
                                    label: "Joined",
                                    value: fmtDate(profile.registration_time),
                                  },
                                ].map((item) => (
                                  <div
                                    key={item.label}
                                    className="flex-align gap-12"
                                  >
                                    <div className="w-32 h-32 rounded-8 bg-main-50 d-flex align-items-center justify-content-center flex-shrink-0">
                                      <i
                                        className={`ph ${item.icon} text-main-600 text-16`}
                                      />
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                      <p className="text-11 text-gray-400 mb-0">
                                        {item.label}
                                      </p>
                                      <p
                                        className="text-13 fw-medium text-gray-700 mb-0"
                                        style={{
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          whiteSpace: "nowrap",
                                        }}
                                        title={item.value}
                                      >
                                        {item.value}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Subject accuracy */}
                        <div className="col-xl-4">
                          <div className="card h-100">
                            <div className="card-body p-24">
                              <h6 className="fw-semibold text-gray-700 mb-20">
                                Subject-wise Accuracy
                              </h6>
                              {subjects.length === 0 ? (
                                <div className="text-center py-24 text-gray-400">
                                  <i className="ph ph-chart-bar text-48 d-block mb-8" />
                                  No data
                                </div>
                              ) : (
                                <div
                                  style={{
                                    overflowY: "auto",
                                    maxHeight: "300px",
                                  }}
                                >
                                  {subjects.map((s) => (
                                    <AccuracyBar
                                      key={s.subject_name}
                                      subject={s.subject_name}
                                      accuracy={s.accuracy}
                                      attempted={s.attempted}
                                      correct={s.correct}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* ══ QUIZ RESULTS ══ */}
                  {tab === "Quiz Results" && (
                    <div className="card">
                      <div className="card-body p-0">
                        {quiz_results.length === 0 ? (
                          <div className="text-center py-48">
                            <i className="ph ph-clipboard-text text-64 text-gray-300 d-block mb-16" />
                            <p className="text-gray-400">No quiz results yet</p>
                          </div>
                        ) : (
                          <div className="table-responsive">
                            <table className="table table-hover mb-0">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="text-12 text-gray-500 fw-medium py-12 px-16">
                                    #
                                  </th>
                                  <th className="text-12 text-gray-500 fw-medium py-12">
                                    Quiz Name
                                  </th>
                                  <th className="text-12 text-gray-500 fw-medium py-12">
                                    Date
                                  </th>
                                  <th className="text-12 text-gray-500 fw-medium py-12 text-center">
                                    Attempted
                                  </th>
                                  <th className="text-12 text-gray-500 fw-medium py-12 text-center">
                                    Correct
                                  </th>
                                  <th className="text-12 text-gray-500 fw-medium py-12 text-center">
                                    Wrong
                                  </th>
                                  <th className="text-12 text-gray-500 fw-medium py-12 text-center">
                                    Marks
                                  </th>
                                  <th className="text-12 text-gray-500 fw-medium py-12 text-center">
                                    Accuracy
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {quiz_results.map((q, i) => {
                                  const acc = parseFloat(q.accuracy) || 0;
                                  const c =
                                    acc >= 75
                                      ? "text-success-600"
                                      : acc >= 50
                                        ? "text-warning-600"
                                        : "text-danger-600";
                                  return (
                                    <tr key={q.id || i}>
                                      <td className="text-13 text-gray-400 py-12 px-16">
                                        {i + 1}
                                      </td>
                                      <td className="text-13 fw-medium text-gray-800 py-12">
                                        {q.test_title}
                                      </td>
                                      <td className="text-12 text-gray-500 py-12">
                                        {fmtDate(q.exam_date)}
                                      </td>
                                      <td className="text-13 py-12 text-center">
                                        {q.total_attempted}
                                      </td>
                                      <td className="text-13 py-12 text-center text-success-600 fw-medium">
                                        {q.total_correct}
                                      </td>
                                      <td className="text-13 py-12 text-center text-danger-600">
                                        {q.total_incorrect}
                                      </td>
                                      <td className="text-13 py-12 text-center fw-semibold">
                                        {q.obtained_marks}/{q.total_marks}
                                      </td>
                                      <td className="py-12 text-center">
                                        <span
                                          className={`text-13 fw-bold ${c}`}
                                        >
                                          {acc}%
                                        </span>
                                        <div
                                          className="progress mt-4"
                                          style={{ height: "3px" }}
                                        >
                                          <div
                                            className={`progress-bar ${acc >= 75 ? "bg-success" : acc >= 50 ? "bg-warning" : "bg-danger"}`}
                                            style={{ width: `${acc}%` }}
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ══ PRACTICE RESULTS ══ */}
                  {tab === "Practice Results" && (
                    <div className="card">
                      <div className="card-body p-0">
                        {practice_results.length === 0 ? (
                          <div className="text-center py-48">
                            <i className="ph ph-barbell text-64 text-gray-300 d-block mb-16" />
                            <p className="text-gray-400">
                              No practice results yet
                            </p>
                          </div>
                        ) : (
                          <div className="table-responsive">
                            <table className="table table-hover mb-0">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="text-12 text-gray-500 fw-medium py-12 px-16">
                                    #
                                  </th>
                                  <th className="text-12 text-gray-500 fw-medium py-12">
                                    Practice Title
                                  </th>
                                  <th className="text-12 text-gray-500 fw-medium py-12 text-center">
                                    Attempted
                                  </th>
                                  <th className="text-12 text-gray-500 fw-medium py-12 text-center">
                                    Correct
                                  </th>
                                  <th className="text-12 text-gray-500 fw-medium py-12 text-center">
                                    Wrong
                                  </th>
                                  <th className="text-12 text-gray-500 fw-medium py-12 text-center">
                                    Accuracy
                                  </th>
                                  <th className="text-12 text-gray-500 fw-medium py-12">
                                    Last Active
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {practice_results.map((p, i) => {
                                  const acc = parseFloat(p.accuracy) || 0;
                                  const c =
                                    acc >= 75
                                      ? "text-success-600"
                                      : acc >= 50
                                        ? "text-warning-600"
                                        : "text-danger-600";
                                  return (
                                    <tr key={p.id || i}>
                                      <td className="text-13 text-gray-400 py-12 px-16">
                                        {i + 1}
                                      </td>
                                      <td className="text-13 fw-medium text-gray-800 py-12">
                                        {p.practice_title}
                                      </td>
                                      <td className="text-13 py-12 text-center">
                                        {p.attempted}
                                      </td>
                                      <td className="text-13 py-12 text-center text-success-600 fw-medium">
                                        {p.correct}
                                      </td>
                                      <td className="text-13 py-12 text-center text-danger-600">
                                        {p.incorrect}
                                      </td>
                                      <td className="py-12 text-center">
                                        <span
                                          className={`text-13 fw-bold ${c}`}
                                        >
                                          {acc}%
                                        </span>
                                        <div
                                          className="progress mt-4"
                                          style={{ height: "3px" }}
                                        >
                                          <div
                                            className={`progress-bar ${acc >= 75 ? "bg-success" : acc >= 50 ? "bg-warning" : "bg-danger"}`}
                                            style={{ width: `${acc}%` }}
                                          />
                                        </div>
                                      </td>
                                      <td className="text-12 text-gray-500 py-12">
                                        {fmtDate(p.last_attempted)}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ══ ACTIVITY ══ */}
                  {tab === "Activity" && (
                    <div className="row g-16">
                      {/* Engagement card */}
                      <div className="col-md-4">
                        <div className="card h-100">
                          <div className="card-body p-24">
                            <h6 className="fw-semibold text-gray-700 mb-20">
                              Engagement Score
                            </h6>
                            <div className="text-center mb-20">
                              <RingChart
                                pct={engPct}
                                color="#6366f1"
                                size={110}
                                label="Active"
                              />
                            </div>
                            <div className="text-center mb-16">
                              <p className="text-24 fw-bold text-main-600 mb-4">
                                {engagement.active_days_30}
                              </p>
                              <p className="text-13 text-gray-500">
                                active days in last 30
                              </p>
                            </div>
                            <div
                              className={`p-12 rounded-10 text-center ${engPct >= 70 ? "bg-success-50" : engPct >= 40 ? "bg-warning-50" : "bg-danger-50"}`}
                            >
                              <p
                                className={`text-12 mb-0 fw-medium ${engPct >= 70 ? "text-success-700" : engPct >= 40 ? "text-warning-700" : "text-danger-700"}`}
                              >
                                {engPct >= 70
                                  ? "🔥 Highly engaged!"
                                  : engPct >= 40
                                    ? "📈 Moderate engagement"
                                    : "⚠️ Low engagement"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="col-md-8">
                        <div className="card h-100">
                          <div className="card-body p-24">
                            <h6 className="fw-semibold text-gray-700 mb-20">
                              Recent Activity
                            </h6>
                            {activity.length === 0 ? (
                              <div className="text-center py-24 text-gray-400">
                                <i className="ph ph-clock text-48 d-block mb-8" />
                                No recent activity
                              </div>
                            ) : (
                              <MathJaxContext config={mathConfig}>
                                <div className="d-flex flex-column gap-0">
                                  {activity.map((a, i) => {
                                    const isCorrect = a.result === "Correct";
                                    const isSkipped = a.result === "Skipped";
                                    const dotColor = isCorrect
                                      ? "#22c55e"
                                      : isSkipped
                                        ? "#94a3b8"
                                        : "#ef4444";
                                    const badgeCls = isCorrect
                                      ? "bg-success-50 text-success-700"
                                      : isSkipped
                                        ? "bg-gray-50 text-gray-500"
                                        : "bg-danger-50 text-danger-700";
                                    return (
                                      <div
                                        key={i}
                                        className="d-flex gap-14 position-relative"
                                      >
                                        {i < activity.length - 1 && (
                                          <div
                                            style={{
                                              position: "absolute",
                                              left: "15px",
                                              top: "32px",
                                              bottom: 0,
                                              width: "2px",
                                              background: "#f1f5f9",
                                              zIndex: 0,
                                            }}
                                          />
                                        )}
                                        <div
                                          className="flex-shrink-0 position-relative"
                                          style={{ zIndex: 1 }}
                                        >
                                          <div
                                            className="w-32 h-32 rounded-circle d-flex align-items-center justify-content-center"
                                            style={{
                                              background: `${dotColor}22`,
                                              border: `2px solid ${dotColor}`,
                                            }}
                                          >
                                            <i
                                              className={`ph ${a.type === "test" ? "ph-clipboard-text" : "ph-barbell"} text-13`}
                                              style={{ color: dotColor }}
                                            />
                                          </div>
                                        </div>
                                        <div
                                          className="flex-grow-1 pb-16"
                                          style={{ minWidth: 0 }}
                                        >
                                          <div className="flex-between gap-8 mb-4">
                                            <p
                                              className="text-13 fw-medium text-gray-700 mb-0"
                                              style={{
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                              }}
                                            >
                                              <MathJax dynamic inline>
                                                {a.question_text}
                                              </MathJax>
                                            </p>
                                            <span
                                              className={`text-11 py-2 px-8 rounded-pill fw-medium flex-shrink-0 ${badgeCls}`}
                                            >
                                              {a.result}
                                            </span>
                                          </div>
                                          <div className="flex-align gap-8 flex-wrap">
                                            <span className="text-11 text-gray-400">
                                              {fmtDateTime(a.activity_time)}
                                            </span>
                                            <span className="text-11 bg-gray-50 text-gray-500 py-1 px-8 rounded-pill">
                                              {a.subject_name}
                                            </span>
                                            <span className="text-11 bg-main-50 text-main-600 py-1 px-8 rounded-pill">
                                              {a.type}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </MathJaxContext>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
        </div>
        <Footer />
      </div>
    </>
  );
}
