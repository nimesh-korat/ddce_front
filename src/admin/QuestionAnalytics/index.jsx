import React, { useState, useEffect, useRef } from "react";
import AdminSidebar from "../../common/AdminSidebar";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getQuestionAnalytics,
  getAllBatch,
  getAllPhase,
  getSubjects,
  getTopics,
  getSubTopics,
} from "../../apis/apis";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import QuestionStudentsModal from "./QuestionStudentsModal";

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

function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  labelKey = "label",
  valueKey = "value",
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  const filtered = options.filter((o) =>
    String(o[labelKey] || "")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const selected = options.find((o) => String(o[valueKey]) === String(value));
  useEffect(() => {
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
          <div style={{ padding: "8px", borderBottom: "1px solid #f1f5f9" }}>
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

const DiffBadge = ({ d }) => {
  const map = {
    Easy: ["#dcfce7", "#166534"],
    Medium: ["#fef9c3", "#854d0e"],
    Hard: ["#fee2e2", "#991b1b"],
  };
  const [bg, color] = map[d] || ["#f1f5f9", "#64748b"];
  return (
    <span
      style={{
        background: bg,
        color,
        fontSize: "11px",
        fontWeight: 600,
        padding: "2px 8px",
        borderRadius: "20px",
      }}
    >
      {d || "—"}
    </span>
  );
};

export default function QuestionAnalytics() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [subjectId, setSubjectId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [subtopicId, setSubtopicId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [phaseId, setPhaseId] = useState("");
  const [search, setSearch] = useState("");
  const [dSearch, setDSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 25;
  const tableRef = useRef(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [sort, setSort] = useState("total_attempted");
  const [dir, setDir] = useState("desc");

  useEffect(() => {
    const t = setTimeout(() => setDSearch(search), 500);
    return () => clearTimeout(t);
  }, [search]);
  useEffect(() => {
    setPage(1);
  }, [subjectId, topicId, subtopicId, batchId, phaseId, dSearch]);
  useEffect(() => {
    if (tableRef.current)
      tableRef.current.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

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
  const { data: subjectData } = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
    staleTime: 5 * 60 * 1000,
  });
  const { data: topicData } = useQuery({
    queryKey: ["topics", subjectId],
    queryFn: () => getTopics({ subjectId }),
    enabled: !!subjectId,
    staleTime: 5 * 60 * 1000,
  });
  const { data: subtopicData } = useQuery({
    queryKey: ["subtopics", topicId],
    queryFn: () => getSubTopics({ topicId }),
    enabled: !!topicId,
    staleTime: 5 * 60 * 1000,
  });

  const batches = batchData || [];
  const phases = phaseData || [];
  const subjects = subjectData?.data || [];
  const topics = topicData?.data || [];
  const subtopics = subtopicData?.data || [];

  const hasFilter = !!(
    subjectId ||
    topicId ||
    subtopicId ||
    batchId ||
    phaseId ||
    dSearch
  );

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      "questionAnalytics",
      subjectId,
      topicId,
      subtopicId,
      batchId,
      phaseId,
      dSearch,
      page,
      sort,
      dir,
    ],
    queryFn: () =>
      getQuestionAnalytics({
        subject_id: subjectId,
        topic_id: topicId,
        subtopic_id: subtopicId,
        batch_id: batchId,
        phase_id: phaseId,
        search: dSearch,
        page,
        limit,
        sort,
        dir,
      }),
    staleTime: 30 * 1000,
    placeholderData: (prev) => prev,
  });

  const rows = data?.data || [];
  const summary = data?.summary || null;
  const { total = 0, totalPages = 1 } = data?.pagination || {};
  const pageNums = () => {
    const n = [],
      s = Math.max(1, page - 2),
      e = Math.min(totalPages, page + 2);
    for (let i = s; i <= e; i++) n.push(i);
    return n;
  };
  const clearAll = () => {
    setSubjectId("");
    setTopicId("");
    setSubtopicId("");
    setBatchId("");
    setPhaseId("");
    setSearch("");
  };
  const pctColor = (p) =>
    p >= 75 ? "#22c55e" : p >= 50 ? "#f59e0b" : "#ef4444";

  const handleSort = (col) => {
    if (sort === col) setDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSort(col);
      setDir("desc");
    }
    setPage(1);
  };

  const SortIcon = ({ col }) => {
    if (sort !== col)
      return <i className="ph ph-arrows-down-up text-gray-300 ms-4 text-11" />;
    return (
      <i
        className={`ph ph-arrow-${dir === "asc" ? "up" : "down"} text-main-600 ms-4 text-11`}
      />
    );
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
                  Question Analytics
                </span>
              </li>
            </ul>
          </div>

          {/* Filter Card */}
          <div className="card border border-gray-100 shadow-sm mb-20">
            <div className="card-body p-20">
              <div className="row g-12">
                <div className="col-12 mb-4">
                  <label
                    className="text-12 fw-semibold text-gray-500 text-uppercase mb-6 d-block"
                    style={{ letterSpacing: "0.5px" }}
                  >
                    Search Question
                  </label>
                  <div className="position-relative">
                    <i
                      className="ph ph-magnifying-glass position-absolute text-gray-400"
                      style={{
                        top: "50%",
                        left: "12px",
                        transform: "translateY(-50%)",
                        fontSize: "15px",
                        pointerEvents: "none",
                      }}
                    />
                    <input
                      type="text"
                      className="form-control rounded-8"
                      style={{
                        paddingLeft: "36px",
                        height: "40px",
                        fontSize: "14px",
                        border: "1.5px solid #e2e8f0",
                        background: "#f8fafc",
                      }}
                      placeholder="Search by question text..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                      <button
                        onClick={() => setSearch("")}
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#94a3b8",
                        }}
                      >
                        <i className="ph ph-x text-13" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="col-lg-4 col-md-6">
                  <label
                    className="text-12 fw-semibold text-gray-500 text-uppercase mb-6 d-block"
                    style={{ letterSpacing: "0.5px" }}
                  >
                    Subject
                  </label>
                  <SearchableSelect
                    options={subjects.map((s) => ({
                      label: s.Sub_Name,
                      value: s.Id,
                    }))}
                    value={subjectId}
                    onChange={(v) => {
                      setSubjectId(v);
                      setTopicId("");
                      setSubtopicId("");
                    }}
                    placeholder="All Subjects"
                  />
                </div>
                <div className="col-lg-4 col-md-6">
                  <label
                    className="text-12 fw-semibold text-gray-500 text-uppercase mb-6 d-block"
                    style={{ letterSpacing: "0.5px" }}
                  >
                    Topic
                  </label>
                  <SearchableSelect
                    options={topics.map((t) => ({
                      label: t.topic_name,
                      value: t.Id,
                    }))}
                    value={topicId}
                    onChange={(v) => {
                      setTopicId(v);
                      setSubtopicId("");
                    }}
                    placeholder={
                      subjectId ? "All Topics" : "Select subject first"
                    }
                  />
                </div>
                <div className="col-lg-4 col-md-6">
                  <label
                    className="text-12 fw-semibold text-gray-500 text-uppercase mb-6 d-block"
                    style={{ letterSpacing: "0.5px" }}
                  >
                    Subtopic
                  </label>
                  <SearchableSelect
                    options={subtopics.map((s) => ({
                      label: s.SubTopicName,
                      value: s.Id,
                    }))}
                    value={subtopicId}
                    onChange={setSubtopicId}
                    placeholder={
                      topicId ? "All Subtopics" : "Select topic first"
                    }
                  />
                </div>
                <div className="col-lg-4 col-md-6">
                  <label
                    className="text-12 fw-semibold text-gray-500 text-uppercase mb-6 d-block"
                    style={{ letterSpacing: "0.5px" }}
                  >
                    Batch
                  </label>
                  <SearchableSelect
                    options={batches.map((b) => ({
                      label: b.batch_title,
                      value: b.id,
                    }))}
                    value={batchId}
                    onChange={setBatchId}
                    placeholder="All Batches"
                  />
                </div>
                <div className="col-lg-4 col-md-6">
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
                    value={phaseId}
                    onChange={setPhaseId}
                    placeholder="All Phases"
                  />
                </div>
                <div className="col-lg-4 col-md-12 d-flex align-items-end gap-10">
                  {hasFilter && (
                    <>
                      <span className="text-13 text-main-600 fw-semibold bg-main-50 py-6 px-12 rounded-pill">
                        {total.toLocaleString()} question
                        {total !== 1 ? "s" : ""}
                      </span>
                      <button
                        className="btn btn-sm rounded-8 flex-align gap-6 fw-medium"
                        style={{
                          background: "#fee2e2",
                          color: "#dc2626",
                          border: "none",
                          height: "34px",
                          padding: "0 14px",
                          fontSize: "13px",
                        }}
                        onClick={clearAll}
                      >
                        <i className="ph ph-x text-12" /> Clear All
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Summary bar when subject/topic/subtopic filtered */}
          {summary && (
            <div className="card border border-gray-100 shadow-sm mb-16">
              <div className="card-body p-16">
                <p
                  className="text-12 fw-semibold text-gray-500 text-uppercase mb-12"
                  style={{ letterSpacing: "0.5px" }}
                >
                  Overall Summary —{" "}
                  {subjectId ? "Subject" : topicId ? "Topic" : "Subtopic"} Level
                </p>
                <div className="row g-12 text-center">
                  {[
                    [
                      "Questions",
                      summary.total_questions,
                      "#6366f1",
                      "#ede9fe",
                    ],
                    [
                      "Total Attempts",
                      summary.total_attempted,
                      "#0ea5e9",
                      "#f0f9ff",
                    ],
                    ["✓ Correct", summary.total_correct, "#22c55e", "#f0fdf4"],
                    ["✗ Wrong", summary.total_wrong, "#ef4444", "#fff7f7"],
                    ["— Skipped", summary.total_skipped, "#94a3b8", "#f8fafc"],
                    [
                      "Correct %",
                      `${summary.overall_correct_pct}%`,
                      summary.overall_correct_pct >= 75
                        ? "#22c55e"
                        : summary.overall_correct_pct >= 50
                          ? "#f59e0b"
                          : "#ef4444",
                      "#fff",
                    ],
                  ].map(([label, val, color, bg]) => (
                    <div key={label} className="col">
                      <div
                        className="rounded-8 py-10 px-4"
                        style={{
                          background: bg,
                          border: `1px solid ${color}22`,
                        }}
                      >
                        <div className="text-18 fw-bold" style={{ color }}>
                          {val}
                        </div>
                        <div className="text-11 text-gray-500 fw-medium mt-2">
                          {label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Results Table */}
          <div className="card border border-gray-100 shadow-sm">
            <div className="flex-between flex-wrap gap-8 px-20 py-12 border-bottom border-gray-100">
              <p className="text-14 text-gray-600 mb-0">
                {isFetching && !isLoading ? (
                  <span className="text-gray-400">Updating...</span>
                ) : (
                  <>
                    <strong>{total.toLocaleString()}</strong> question
                    {total !== 1 ? "s" : ""}
                  </>
                )}
              </p>
              <p className="text-13 text-gray-400 mb-0">
                Page {page} of {totalPages}
              </p>
            </div>

            <MathJaxContext config={mathConfig}>
              <div
                ref={tableRef}
                style={{
                  overflowX: "auto",
                  overflowY: "auto",
                  maxHeight: "65vh",
                }}
              >
                <table
                  className="table table-hover mb-0"
                  style={{ minWidth: "1100px" }}
                >
                  <thead
                    className="bg-gray-50"
                    style={{ position: "sticky", top: 0, zIndex: 1 }}
                  >
                    <tr>
                      <th
                        className="text-12 text-gray-500 fw-medium py-12 px-16"
                        style={{ width: "40px", whiteSpace: "nowrap" }}
                      >
                        #
                      </th>
                      <th
                        className="text-12 text-gray-500 fw-medium py-12"
                        style={{ minWidth: "280px" }}
                      >
                        Question
                      </th>
                      <th
                        className="text-12 text-gray-500 fw-medium py-12"
                        style={{ minWidth: "100px" }}
                      >
                        Correct Answer
                      </th>

                      <th
                        className="text-12 text-gray-500 fw-medium py-12 text-center cursor-pointer user-select-none"
                        onClick={() => handleSort("total_attempted")}
                      >
                        Attempted
                        <SortIcon col="total_attempted" />
                      </th>
                      <th
                        className="text-12 text-gray-500 fw-medium py-12 text-center cursor-pointer user-select-none"
                        style={{ color: "#22c55e" }}
                        onClick={() => handleSort("total_correct")}
                      >
                        ✓ Correct
                        <SortIcon col="total_correct" />
                      </th>
                      <th
                        className="text-12 text-gray-500 fw-medium py-12 text-center cursor-pointer user-select-none"
                        style={{ color: "#ef4444" }}
                        onClick={() => handleSort("total_wrong")}
                      >
                        ✗ Wrong
                        <SortIcon col="total_wrong" />
                      </th>
                      <th
                        className="text-12 text-gray-500 fw-medium py-12 text-center cursor-pointer user-select-none"
                        onClick={() => handleSort("total_skipped")}
                      >
                        — Skipped
                        <SortIcon col="total_skipped" />
                      </th>
                      <th
                        className="text-12 text-gray-500 fw-medium py-12 text-center cursor-pointer user-select-none"
                        style={{ minWidth: "110px" }}
                        onClick={() => handleSort("correct_pct")}
                      >
                        Correct %<SortIcon col="correct_pct" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading &&
                      Array.from({ length: 8 }).map((_, i) => (
                        <tr key={i}>
                          {Array.from({ length: 12 }).map((__, j) => (
                            <td key={j} className="py-12 px-16">
                              <div
                                className="bg-gray-100 rounded"
                                style={{
                                  height: "13px",
                                  width: j === 0 ? "20px" : "80%",
                                }}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    {!isLoading && rows.length === 0 && (
                      <tr>
                        <td
                          colSpan={12}
                          className="text-center text-gray-400 py-48"
                        >
                          <i className="ph ph-database text-48 d-block mb-12 text-gray-300" />
                          No data found for selected filters
                        </td>
                      </tr>
                    )}
                    {!isLoading &&
                      rows.map((row, i) => (
                        // eslint-disable-next-line
                        <tr
                          key={row.question_id}
                          className={isFetching ? "opacity-50" : ""}
                          style={{ cursor: "pointer" }}
                          onClick={() => setSelectedQuestion(row)}
                        >
                          <td
                            className="text-13 text-gray-400 fw-medium py-12 px-16"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            {total - ((page - 1) * limit + i)}
                          </td>
                          <td className="py-12" style={{ maxWidth: "280px" }}>
                            <div
                              className="text-13 text-gray-800"
                              style={{
                                overflow: "hidden",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                              }}
                            >
                              <MathJax dynamic inline>
                                {row.question_text || "—"}
                              </MathJax>
                            </div>
                          </td>
                          <td className="py-12">
                            <span
                              className="text-13 fw-semibold"
                              style={{ color: "#166534" }}
                            >
                              <MathJax dynamic inline>
                                {row.correct_answer || "—"}
                              </MathJax>
                            </span>
                          </td>
                          <td className="text-13 fw-semibold text-gray-700 py-12 text-center">
                            {row.total_attempted}
                          </td>
                          <td
                            className="text-13 fw-semibold py-12 text-center"
                            style={{ color: "#22c55e" }}
                          >
                            {row.total_correct}
                          </td>
                          <td
                            className="text-13 fw-semibold py-12 text-center"
                            style={{ color: "#ef4444" }}
                          >
                            {row.total_wrong}
                          </td>
                          <td className="text-13 text-gray-400 py-12 text-center">
                            {row.total_skipped}
                          </td>
                          <td className="py-12 text-center">
                            <span
                              className="text-13 fw-bold"
                              style={{ color: pctColor(row.correct_pct) }}
                            >
                              {row.correct_pct}%
                            </span>
                            <div
                              className="progress mt-4"
                              style={{ height: "4px" }}
                            >
                              <div
                                className="progress-bar"
                                style={{
                                  width: `${row.correct_pct}%`,
                                  background: pctColor(row.correct_pct),
                                }}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </MathJaxContext>

            {totalPages > 1 && (
              <div className="flex-between flex-wrap gap-8 p-16 border-top border-gray-100">
                <p className="text-13 text-gray-500 mb-0">
                  Showing <strong>{(page - 1) * limit + 1}</strong>–
                  <strong>{Math.min(page * limit, total)}</strong> of{" "}
                  <strong>{total.toLocaleString()}</strong>
                </p>
                <div className="flex-align gap-4">
                  <button
                    className="btn btn-sm btn-secondary rounded-pill px-10 py-4"
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                  >
                    <i className="ph ph-caret-double-left text-12" />
                  </button>
                  <button
                    className="btn btn-sm btn-secondary rounded-pill px-10 py-4"
                    onClick={() => setPage((p) => p - 1)}
                    disabled={page === 1}
                  >
                    <i className="ph ph-caret-left text-12" />
                  </button>
                  {pageNums().map((n) => (
                    <button
                      key={n}
                      className={`btn btn-sm rounded-pill px-12 py-4 ${n === page ? "btn-main" : "btn-secondary"}`}
                      onClick={() => setPage(n)}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    className="btn btn-sm btn-secondary rounded-pill px-10 py-4"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page === totalPages}
                  >
                    <i className="ph ph-caret-right text-12" />
                  </button>
                  <button
                    className="btn btn-sm btn-secondary rounded-pill px-10 py-4"
                    onClick={() => setPage(totalPages)}
                    disabled={page === totalPages}
                  >
                    <i className="ph ph-caret-double-right text-12" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
      {selectedQuestion && (
        <QuestionStudentsModal
          question={selectedQuestion}
          batchId={batchId}
          phaseId={phaseId}
          onClose={() => setSelectedQuestion(null)}
        />
      )}
    </>
  );
}
