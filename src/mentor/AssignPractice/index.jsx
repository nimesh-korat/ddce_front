import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPracticeAssignment,
  getQuestionsForPractice,
  getMentorsList,
  getAllBatch,
  getAllPhase,
  getSubjects,
} from "../../apis/apis";
import { toast } from "react-toastify";
import Preloader from "../../utils/preloader/Preloader";
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

// This component is used by BOTH mentor (/mentor/assignPractice) and admin (/admin/assignPractice)
// Sidebar and header are passed as props so the same page works for both roles
function AssignPractice({
  Sidebar,
  headerText = "Assign Practice",
  basePath = "/mentor",
}) {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [form, setForm] = useState({
    title: "",
    tbl_batch: "",
    tbl_phase: "",
    start_date: "",
    end_date: "",
  });
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [qFilters, setQFilters] = useState({
    subject_id: "",
    mentor_id: "",
    search: "",
    page: 1,
  });
  const [allQuestions, setAllQuestions] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const queryClient = useQueryClient();

  const toggleSidebar = () => setIsSidebarActive((p) => !p);
  const closeSidebar = () => setIsSidebarActive(false);

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
  const { data: subjectsData } = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
    staleTime: 10 * 60 * 1000,
  });
  // Mentors list only relevant for admin
  const { data: mentorsData } = useQuery({
    queryKey: ["mentorsList"],
    queryFn: getMentorsList,
    staleTime: 10 * 60 * 1000,
  });

  const batches = batchData || [];

  const phases = phaseData || [];
  const subjects = subjectsData?.data || [];
  const mentors = mentorsData?.data || [];

  // Fetch questions with current filters
  const {
    data: questionsData,
    isLoading: qLoading,
    refetch,
  } = useQuery({
    queryKey: ["practiceQuestionsPool", qFilters],
    queryFn: () =>
      getQuestionsForPractice({
        subject_id: qFilters.subject_id || undefined,
        mentor_id: qFilters.mentor_id || undefined,
        search: qFilters.search || undefined,
        page: qFilters.page,
        limit: 15,
      }),
    staleTime: 1 * 60 * 1000,
  });

  useEffect(() => {
    if (questionsData?.data) {
      if (qFilters.page === 1) {
        setAllQuestions(questionsData.data);
      } else {
        setAllQuestions((prev) => {
          const existingIds = new Set(prev.map((q) => q.id));
          const newOnes = questionsData.data.filter(
            (q) => !existingIds.has(q.id),
          );
          return [...prev, ...newOnes];
        });
      }
      setHasMore(questionsData.hasMore || false);
    }
  }, [questionsData, qFilters.page]);

  const assignMutation = useMutation({
    mutationFn: (data) => createPracticeAssignment(data),
    onSuccess: (res) => {
      toast.success(
        `Practice assigned! ${res.data.question_count} questions added.`,
      );
      queryClient.invalidateQueries(["myPracticeAssignments"]);
      setForm({
        title: "",
        tbl_batch: "",
        tbl_phase: "",
        start_date: "",
        end_date: "",
      });
      setSelectedIds(new Set());
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to assign practice"),
  });

  const handleFilterChange = (key, value) => {
    setQFilters((f) => ({ ...f, [key]: value, page: 1 }));
    setAllQuestions([]);
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (allQuestions.every((q) => selectedIds.has(q.id))) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allQuestions.map((q) => q.id)));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!form.tbl_batch) {
      toast.error("Please select a batch");
      return;
    }
    if (selectedIds.size === 0) {
      toast.error("Please select at least one question");
      return;
    }
    assignMutation.mutate({
      title: form.title,
      tbl_batch: form.tbl_batch,
      tbl_phase: form.tbl_phase || null,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      question_ids: Array.from(selectedIds),
    });
  };

  const diffBadge = (d) => {
    const map = {
      Easy: "bg-success-50 text-success-600",
      Medium: "bg-info-50 text-info-600",
      Hard: "bg-warning-50 text-warning-600",
      "Time Consuming": "bg-danger-50 text-danger-600",
    };
    return map[d] || "bg-gray-50 text-gray-500";
  };

  return (
    <>
      <Sidebar isActive={isSidebarActive} closeSidebar={closeSidebar} />
      <div className="dashboard-main-wrapper">
        {/* Header */}
        <div className="dashboard-header d-flex align-items-center gap-16 p-16 border-bottom border-gray-100">
          <button className="sidebar-toggle d-xl-none" onClick={toggleSidebar}>
            <i className="ph ph-list text-24 text-gray-600" />
          </button>
          <h5 className="mb-0 fw-semibold">{headerText}</h5>
        </div>

        <div className="dashboard-body">
          {/* Breadcrumb */}
          <div className="breadcrumb mb-24">
            <ul className="flex-align gap-4">
              <li>
                <Link
                  to={`${basePath}/dashboard`}
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
                  Assign Practice
                </span>
              </li>
            </ul>
          </div>

          <div className="row g-20">
            {/* LEFT — Assignment details form */}
            <div className="col-lg-4">
              <div className="card position-sticky" style={{ top: "20px" }}>
                <div className="card-body">
                  <h6 className="fw-semibold mb-16 text-main-600">
                    <i className="ph ph-barbell me-8" />
                    Assignment Details
                  </h6>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-12">
                      <label className="form-label fw-medium text-14 mb-6">
                        Title <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Physics - Wave Optics"
                        value={form.title}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, title: e.target.value }))
                        }
                        required
                      />
                    </div>
                    <div className="mb-12">
                      <label className="form-label fw-medium text-14 mb-6">
                        Batch <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-control"
                        value={form.tbl_batch}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, tbl_batch: e.target.value }))
                        }
                        required
                      >
                        <option value="">Select Batch</option>
                        {batches.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.batch_title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-12">
                      <label className="form-label fw-medium text-14 mb-6">
                        Phase (optional)
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
                    <div className="mb-12">
                      <label className="form-label fw-medium text-14 mb-6">
                        Start Date
                        <span className="text-gray-400 fw-normal ms-4 text-12">
                          (empty = starts immediately)
                        </span>
                      </label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={form.start_date}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, start_date: e.target.value }))
                        }
                      />
                    </div>
                    <div className="mb-16">
                      <label className="form-label fw-medium text-14 mb-6">
                        End Date
                        <span className="text-gray-400 fw-normal ms-4 text-12">
                          (empty = no end date)
                        </span>
                      </label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={form.end_date}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, end_date: e.target.value }))
                        }
                      />
                    </div>

                    {/* Selected count */}
                    <div className="p-12 bg-main-50 rounded-8 mb-16">
                      <p className="text-14 fw-semibold text-main-600 mb-0">
                        <i className="ph ph-check-square me-6" />
                        {selectedIds.size} question
                        {selectedIds.size !== 1 ? "s" : ""} selected
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-main rounded-pill py-10 w-100"
                      disabled={
                        assignMutation.isPending || selectedIds.size === 0
                      }
                    >
                      {assignMutation.isPending ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-6" />
                          Assigning...
                        </>
                      ) : (
                        "Assign to Batch"
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* RIGHT — Question picker */}
            <div className="col-lg-8">
              <div className="card">
                <div className="card-body">
                  <div className="flex-between mb-16">
                    <h6 className="fw-semibold mb-0 text-main-600">
                      <i className="ph ph-list-checks me-8" />
                      Pick Questions
                    </h6>
                    {allQuestions.length > 0 && (
                      <button
                        className="btn btn-sm btn-outline-main rounded-pill"
                        onClick={handleSelectAll}
                      >
                        {allQuestions.every((q) => selectedIds.has(q.id))
                          ? "Deselect All"
                          : "Select All"}
                      </button>
                    )}
                  </div>

                  {/* Question filters */}
                  <div className="row g-10 mb-16">
                    <div className="col-md-4">
                      <select
                        className="form-control form-control-sm"
                        value={qFilters.subject_id}
                        onChange={(e) =>
                          handleFilterChange("subject_id", e.target.value)
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
                    {mentors.length > 0 && (
                      <div className="col-md-4">
                        <select
                          className="form-control form-control-sm"
                          value={qFilters.mentor_id}
                          onChange={(e) =>
                            handleFilterChange("mentor_id", e.target.value)
                          }
                        >
                          <option value="">All Mentors</option>
                          {mentors.map((m) => (
                            <option key={m.Id} value={m.Id}>
                              {m.Name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div className="col-md-4">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Search..."
                        value={qFilters.search}
                        onChange={(e) =>
                          handleFilterChange("search", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {qLoading && qFilters.page === 1 && (
                    <div className="text-center py-20">
                      <span className="spinner-border text-main-600" />
                    </div>
                  )}

                  {!qLoading && allQuestions.length === 0 && (
                    <div className="text-center py-32">
                      <i className="ph ph-question text-48 text-gray-300 d-block mb-12" />
                      <p className="text-gray-500 text-14">
                        No questions found. Try changing filters.
                      </p>
                    </div>
                  )}

                  <MathJaxContext config={mathConfig}>
                    <div className="d-flex flex-column gap-12">
                      {allQuestions.map((q) => {
                        const isSelected = selectedIds.has(q.id);
                        return (
                          <div
                            key={q.id}
                            className={`p-16 rounded-10 border cursor-pointer transition-2 ${isSelected ? "border-main-600 bg-main-50" : "border-gray-100 bg-white hover-bg-gray-50"}`}
                            onClick={() => toggleSelect(q.id)}
                          >
                            <div className="flex-between mb-8">
                              <div className="flex-align gap-8">
                                <div
                                  className={`w-20 h-20 rounded-4 border-2 d-flex align-items-center justify-content-center flex-shrink-0 ${isSelected ? "border-main-600 bg-main-600" : "border-gray-300"}`}
                                >
                                  {isSelected && (
                                    <i className="ph-fill ph-check text-white text-12" />
                                  )}
                                </div>
                                <span
                                  className={`text-12 py-2 px-8 rounded-pill fw-medium ${diffBadge(q.question_difficulty)}`}
                                >
                                  {q.question_difficulty}
                                </span>
                                {q.subject_name && (
                                  <span className="text-12 text-gray-500">
                                    {q.subject_name}
                                  </span>
                                )}
                                {q.added_by_name && (
                                  <span className="text-12 text-gray-400">
                                    by {q.added_by_name}
                                  </span>
                                )}
                              </div>
                              <span className="text-12 bg-main-50 text-main-600 py-2 px-8 rounded-pill">
                                {q.question_marks} marks
                              </span>
                            </div>
                            <p className="text-14 mb-6 fw-medium">
                              <MathJax inline>{q.question_text}</MathJax>
                            </p>
                            <div className="row g-6">
                              {[
                                { l: "A", t: q.option_a_text },
                                { l: "B", t: q.option_b_text },
                                { l: "C", t: q.option_c_text },
                                { l: "D", t: q.option_d_text },
                              ].map((opt) => (
                                <div className="col-6" key={opt.l}>
                                  <span
                                    className={`d-block text-12 py-4 px-8 rounded-6 ${q.answer_text === opt.t ? "bg-success-50 text-success-700" : "bg-gray-50 text-gray-600"}`}
                                  >
                                    <strong>{opt.l}.</strong> {opt.t}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </MathJaxContext>

                  {hasMore && (
                    <div className="text-center mt-16">
                      <button
                        className="btn btn-outline-main rounded-pill py-8 px-24"
                        onClick={() =>
                          setQFilters((f) => ({ ...f, page: f.page + 1 }))
                        }
                        disabled={qLoading}
                      >
                        {qLoading ? (
                          <span className="spinner-border spinner-border-sm" />
                        ) : (
                          "Load More"
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AssignPractice;
