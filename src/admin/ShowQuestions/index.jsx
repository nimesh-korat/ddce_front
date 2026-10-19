import React, { useState, useRef, useCallback, useEffect } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import AdminSidebar from "../../common/AdminSidebar";
import Preloader from "../../utils/preloader/Preloader";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";
import AdminQuestionCard from "./components/QuestionCard";
import {
  adminGetQuestions,
  fetchSubjectsForFilter,
  fetchTopicsForFilter,
  fetchSubtopicsForFilter,
} from "../../apis/apis";
import { Link } from "react-router-dom";

// ── Searchable dropdown ───────────────────────────────────────
function SearchableSelect({
  options,
  value,
  onChange,
  placeholder,
  disabled,
  renderOption,
  renderSelected,
}) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // keep input text in sync when value cleared externally
  useEffect(() => {
    if (!value) setSearch("");
  }, [value]);

  const filtered = options.filter(
    (o) => o.label && o.label.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (opt) => {
    onChange(opt.value);
    setSearch(opt.label);
    setOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange("");
    setSearch("");
    setOpen(false);
  };

  const displayValue = value
    ? options.find((o) => String(o.value) === String(value))?.label || search
    : search;

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          border: "1.5px solid #e2e8f0",
          borderRadius: "8px",
          background: disabled ? "#f8fafc" : "#fff",
          overflow: "hidden",
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <input
          type="text"
          value={open ? search : displayValue}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
            onChange("");
          }}
          onFocus={() => {
            if (!disabled) {
              setSearch("");
              setOpen(true);
            }
          }}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          disabled={disabled}
          placeholder={placeholder}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            padding: "8px 12px",
            fontSize: "13px",
            color: "#334155",
            background: "transparent",
          }}
        />
        {value && !disabled && (
          <button
            onMouseDown={handleClear}
            style={{
              border: "none",
              background: "none",
              padding: "0 8px",
              cursor: "pointer",
              color: "#94a3b8",
              fontSize: "14px",
            }}
          >
            <i className="ph ph-x" />
          </button>
        )}
        <span
          style={{
            padding: "0 10px",
            color: "#94a3b8",
            fontSize: "12px",
            pointerEvents: "none",
          }}
        >
          <i className={`ph ph-caret-${open ? "up" : "down"}`} />
        </span>
      </div>

      {open && !disabled && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1.5px solid #e2e8f0",
            borderRadius: "10px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
            zIndex: 999,
            maxHeight: "260px",
            overflowY: "auto",
          }}
        >
          {filtered.length === 0 ? (
            <div
              style={{
                padding: "12px 16px",
                fontSize: "13px",
                color: "#94a3b8",
              }}
            >
              No results
            </div>
          ) : (
            filtered.map((opt) => (
              <div
                key={opt.value}
                onMouseDown={() => handleSelect(opt)}
                style={{
                  padding: "10px 14px",
                  cursor: "pointer",
                  fontSize: "13px",
                  color:
                    String(opt.value) === String(value) ? "#6366f1" : "#334155",
                  background:
                    String(opt.value) === String(value)
                      ? "#f0f0ff"
                      : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "8px",
                }}
                onMouseEnter={(e) => {
                  if (String(opt.value) !== String(value))
                    e.currentTarget.style.background = "#f8fafc";
                }}
                onMouseLeave={(e) => {
                  if (String(opt.value) !== String(value))
                    e.currentTarget.style.background = "transparent";
                }}
              >
                <span>{opt.label}</span>
                {opt.tag && (
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: "20px",
                      background: "#ede9fe",
                      color: "#7c3aed",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {opt.tag}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function ShowQuestions() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);

  // ── Filter state ──────────────────────────────────────────
  const [selSubject, setSelSubject] = useState(""); // subject Id
  const [selTopic, setSelTopic] = useState(""); // topic Id
  const [selSubtopic, setSelSubtopic] = useState(""); // subtopic Id

  // active filters sent to query (only committed on selection)
  const filters = {
    subject_id: selSubject || undefined,
    topic_id: selTopic || undefined,
    subtopic_id: selSubtopic || undefined,
  };

  // ── Subjects ──────────────────────────────────────────────
  const { data: subjects = [] } = useQuery({
    queryKey: ["filterSubjects"],
    queryFn: fetchSubjectsForFilter,
    staleTime: 10 * 60 * 1000,
  });

  // ── Topics (only when subject selected) ──────────────────
  const { data: topics = [] } = useQuery({
    queryKey: ["filterTopics", selSubject],
    queryFn: () => fetchTopicsForFilter(selSubject),
    enabled: !!selSubject,
    staleTime: 5 * 60 * 1000,
  });

  // ── Subtopics (only when topic selected) ─────────────────
  const { data: subtopics = [] } = useQuery({
    queryKey: ["filterSubtopics", selTopic],
    queryFn: () => fetchSubtopicsForFilter(selTopic),
    enabled: !!selTopic,
    staleTime: 5 * 60 * 1000,
  });

  // ── Questions ─────────────────────────────────────────────
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["questions", filters],
    queryFn: adminGetQuestions,
    getNextPageParam: (lastPage) => lastPage.nextPage || false,
    staleTime: 5 * 60 * 1000,
  });

  const observer = useRef();
  const lastQuestionRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage],
  );

  if (isError)
    return (
      <div>
        <p>Something went wrong.</p>
      </div>
    );

  const questions = data?.pages?.flatMap((page) => page.data) || [];

  // build option arrays for SearchableSelect
  const subjectOptions = subjects.map((s) => ({
    value: s.Id,
    label: s.Sub_Name,
    tag: s.test_type_name || s.exam_type_name || null,
  }));
  const topicOptions = topics.map((t) => ({
    value: t.Id,
    label: t.Topic_Name || t.topic_name || "",
    tag: null,
  }));
  const subtopicOptions = subtopics.map((s) => ({
    value: s.Id,
    label: s.SubTopicName || s.subtopic_name || "",
    tag: null,
  }));

  const selSubjectName =
    subjectOptions.find((o) => String(o.value) === String(selSubject))?.label ||
    "";
  const selTopicName =
    topicOptions.find((o) => String(o.value) === String(selTopic))?.label || "";
  const selSubtopicName =
    subtopicOptions.find((o) => String(o.value) === String(selSubtopic))
      ?.label || "";

  return (
    <>
      {isLoading && <Preloader />}
      <AdminSidebar
        isActive={isSidebarActive}
        closeSidebar={() => setIsSidebarActive(false)}
      />
      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={() => setIsSidebarActive((p) => !p)} />
        <div className="dashboard-body">
          {/* ── Breadcrumb ── */}
          <div className="breadcrumb-with-buttons mb-24 flex-between flex-wrap gap-8">
            <div className="breadcrumb mb-0">
              <ul className="flex-align gap-4">
                <li>
                  <Link
                    to="/admin"
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
                    Show Questions
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* ── Filter bar ── */}
          <div className="card mb-20">
            <div className="card-body p-16">
              <div className="row g-12 align-items-end">
                {/* Subject */}
                <div className="col-md-4">
                  <label className="text-12 text-gray-500 fw-semibold mb-6 d-block">
                    Subject
                  </label>
                  <SearchableSelect
                    options={subjectOptions}
                    value={selSubject}
                    onChange={(val) => {
                      setSelSubject(val);
                      setSelTopic("");
                      setSelSubtopic("");
                    }}
                    placeholder="Search subject..."
                    disabled={false}
                  />
                </div>

                {/* Topic */}
                <div className="col-md-4">
                  <label className="text-12 text-gray-500 fw-semibold mb-6 d-block">
                    Topic
                  </label>
                  <SearchableSelect
                    options={topicOptions}
                    value={selTopic}
                    onChange={(val) => {
                      setSelTopic(val);
                      setSelSubtopic("");
                    }}
                    placeholder={
                      selSubject ? "Search topic..." : "Select subject first"
                    }
                    disabled={!selSubject}
                  />
                </div>

                {/* Subtopic */}
                <div className="col-md-4">
                  <label className="text-12 text-gray-500 fw-semibold mb-6 d-block">
                    Subtopic
                  </label>
                  <SearchableSelect
                    options={subtopicOptions}
                    value={selSubtopic}
                    onChange={setSelSubtopic}
                    placeholder={
                      selTopic ? "Search subtopic..." : "Select topic first"
                    }
                    disabled={!selTopic}
                  />
                </div>
              </div>

              {/* Active filter pills */}
              {(selSubject || selTopic || selSubtopic) && (
                <div className="flex-align gap-8 mt-12 flex-wrap">
                  <span className="text-12 text-gray-400">Filtering:</span>
                  {selSubjectName && (
                    <span className="text-12 bg-main-50 text-main-700 px-10 py-3 rounded-pill fw-medium">
                      {selSubjectName}
                    </span>
                  )}
                  {selTopicName && (
                    <>
                      <i className="ph ph-caret-right text-gray-300 text-11" />
                      <span className="text-12 bg-info-50 text-info-700 px-10 py-3 rounded-pill fw-medium">
                        {selTopicName}
                      </span>
                    </>
                  )}
                  {selSubtopicName && (
                    <>
                      <i className="ph ph-caret-right text-gray-300 text-11" />
                      <span className="text-12 bg-success-50 text-success-700 px-10 py-3 rounded-pill fw-medium">
                        {selSubtopicName}
                      </span>
                    </>
                  )}
                  <button
                    onClick={() => {
                      setSelSubject("");
                      setSelTopic("");
                      setSelSubtopic("");
                    }}
                    className="text-12 text-danger-600 bg-danger-50 px-10 py-3 rounded-pill fw-medium border-0 ms-4"
                  >
                    <i className="ph ph-x me-1" /> Clear
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── Questions list ── */}
          <div className="container-fluid dashboard-content">
            {!isLoading && questions.length === 0 && (
              <div className="text-center py-48">
                <i className="ph ph-question text-64 text-gray-300 d-block mb-16" />
                <p className="text-gray-400">
                  No questions found for this filter.
                </p>
              </div>
            )}

            {questions.map((question, index) => {
              const isLast = index === questions.length - 1;
              return (
                <AdminQuestionCard
                  key={question.id || index}
                  ref={isLast ? lastQuestionRef : undefined}
                  index={index + 1}
                  questionId={question.id}
                  question={question.question_text}
                  questionImg={question.question_image}
                  option1={question.option_a_text}
                  option2={question.option_b_text}
                  option3={question.option_c_text}
                  option4={question.option_d_text}
                  optionimg1={question.option_a_image}
                  optionimg2={question.option_b_image}
                  optionimg3={question.option_c_image}
                  optionimg4={question.option_d_image}
                  answer={question.answer_text}
                  marks={question.question_marks}
                  difficulty={question.question_difficulty}
                  prevAskedPaper={question.prevAskedPaper}
                  prevAskedYear={question.prevAskedYear}
                  fromBook={question.fromBook}
                />
              );
            })}
            {isFetchingNextPage && <Preloader />}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default ShowQuestions;
