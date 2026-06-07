import React, { useState, useCallback, useRef } from "react";
import MentorSidebar from "../../common/MentorSidebar";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";
import { Link } from "react-router-dom";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mentorGetQuestions, mentorUpdateQuestion, mentorDeleteQuestion, getSubjects } from "../../apis/apis";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Preloader from "../../utils/preloader/Preloader";
import { MathJax, MathJaxContext } from "better-react-mathjax";

const mathConfig = {
  tex2jax: { inlineMath: [["$","$"],["\\(","\\)"]], displayMath: [["$$","$$"],["\\[","\\]"]] },
  messageStyle: "none",
};

function MentorShowQuestions() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [filters, setFilters] = useState({ subject_id: "", date_from: "", date_to: "", search: "" });
  const [appliedFilters, setAppliedFilters] = useState({});
  const [editModal, setEditModal] = useState(null);
  const [editForm, setEditForm] = useState({});
  const queryClient = useQueryClient();
  const observer = useRef();

  const toggleSidebar = () => setIsSidebarActive((p) => !p);
  const closeSidebar = () => setIsSidebarActive(false);

  const { data: subjectsData } = useQuery({ queryKey: ["subjects"], queryFn: getSubjects, staleTime: 10 * 60 * 1000 });
  const subjects = subjectsData?.data || [];

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["mentorQuestions", appliedFilters],
    queryFn: ({ pageParam = 1 }) => mentorGetQuestions({ page: pageParam, limit: 10, ...appliedFilters }),
    getNextPageParam: (last) => last.hasMore ? last.nextPage : undefined,
    staleTime: 2 * 60 * 1000,
  });

  const questions = data?.pages?.flatMap((p) => p.data) || [];

  const lastRef = useCallback((node) => {
    if (isFetchingNextPage) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
    });
    if (node) observer.current.observe(node);
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => mentorUpdateQuestion(id, data),
    onSuccess: (res) => {
      const affected = res?.data?.students_affected ?? 0;
      toast.success(affected > 0 ? `Updated! ${affected} student result(s) recalculated.` : "Question updated!");
      queryClient.invalidateQueries(["mentorQuestions"]);
      setEditModal(null);
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to update"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => mentorDeleteQuestion(id),
    onSuccess: () => { toast.success("Question deleted!"); queryClient.invalidateQueries(["mentorQuestions"]); },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to delete"),
  });

  const handleApplyFilters = () => {
    const cleaned = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    setAppliedFilters(cleaned);
  };

  const handleClearFilters = () => { setFilters({ subject_id: "", date_from: "", date_to: "", search: "" }); setAppliedFilters({}); };

  const handleOpenEdit = (q) => {
    setEditForm({
      question_text: q.question_text || "", option_a_text: q.option_a_text || "",
      option_b_text: q.option_b_text || "", option_c_text: q.option_c_text || "",
      option_d_text: q.option_d_text || "", answer_text: q.answer_text || "",
      question_marks: q.question_marks || "", question_difficulty: q.question_difficulty || "Easy",
    });
    setEditModal(q);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(editForm).forEach(([k, v]) => formData.append(k, v));
    updateMutation.mutate({ id: editModal.id, data: formData });
  };

  const handleDelete = (q) => {
    Swal.fire({
      title: "Delete Question?", text: "This cannot be undone.", icon: "warning",
      showCancelButton: true, confirmButtonColor: "#d33", cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Delete",
    }).then((r) => { if (r.isConfirmed) deleteMutation.mutate(q.id); });
  };

  const diffBadge = (d) => {
    const map = { Easy: "bg-success-50 text-success-600", Medium: "bg-info-50 text-info-600", Hard: "bg-warning-50 text-warning-600", "Time Consuming": "bg-danger-50 text-danger-600" };
    return map[d] || "bg-gray-50 text-gray-500";
  };

  return (
    <>
      {isLoading && <Preloader />}
      <MentorSidebar isActive={isSidebarActive} closeSidebar={closeSidebar} />
      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={toggleSidebar} />
        <div className="dashboard-body">
          <div className="breadcrumb-with-buttons mb-24 flex-between flex-wrap gap-8">
            <div className="breadcrumb mb-0">
              <ul className="flex-align gap-4">
                <li><Link to="/mentor/dashboard" className="text-gray-200 fw-normal text-15 hover-text-main-600">Home</Link></li>
                <li><span className="text-gray-500 fw-normal d-flex"><i className="ph ph-caret-right" /></span></li>
                <li><span className="text-main-600 fw-normal text-15">My Questions</span></li>
              </ul>
            </div>
            <Link to="/mentor/addQuestion" className="btn btn-main rounded-pill py-9 flex-align gap-8">
              <i className="ph ph-plus" />Add Question
            </Link>
          </div>

          {/* Filters */}
          <div className="card mb-20">
            <div className="card-body">
              <div className="row g-12 align-items-end">
                <div className="col-md-3">
                  <label className="form-label fw-medium text-13 mb-4">Subject</label>
                  <select className="form-control form-control-sm" value={filters.subject_id}
                    onChange={(e) => setFilters((f) => ({ ...f, subject_id: e.target.value }))}>
                    <option value="">All Subjects</option>
                    {subjects.map((s) => <option key={s.Id} value={s.Id}>{s.Sub_Name}</option>)}
                  </select>
                </div>
                <div className="col-md-2">
                  <label className="form-label fw-medium text-13 mb-4">From Date</label>
                  <input type="date" className="form-control form-control-sm" value={filters.date_from}
                    onChange={(e) => setFilters((f) => ({ ...f, date_from: e.target.value }))} />
                </div>
                <div className="col-md-2">
                  <label className="form-label fw-medium text-13 mb-4">To Date</label>
                  <input type="date" className="form-control form-control-sm" value={filters.date_to}
                    onChange={(e) => setFilters((f) => ({ ...f, date_to: e.target.value }))} />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-medium text-13 mb-4">Search</label>
                  <input type="text" className="form-control form-control-sm" placeholder="Search question text..."
                    value={filters.search} onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))} />
                </div>
                <div className="col-md-2 d-flex gap-8">
                  <button className="btn btn-main rounded-pill py-7 px-16 flex-grow-1" onClick={handleApplyFilters}>Apply</button>
                  <button className="btn btn-outline-secondary rounded-pill py-7 px-12" onClick={handleClearFilters}>
                    <i className="ph ph-x" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Questions list */}
          {isError && <div className="alert alert-danger">Failed to load questions.</div>}

          {!isLoading && questions.length === 0 && (
            <div className="card">
              <div className="card-body text-center py-48">
                <i className="ph ph-question text-64 text-gray-300 d-block mb-16" />
                <h5 className="text-gray-500 fw-medium">No questions found</h5>
                <Link to="/mentor/addQuestion" className="btn btn-main rounded-pill py-9 mt-12">Add Your First Question</Link>
              </div>
            </div>
          )}

          <MathJaxContext config={mathConfig}>
            <div className="d-flex flex-column gap-16">
              {questions.map((q, i) => (
                <div key={q.id} ref={i === questions.length - 1 ? lastRef : null} className="card border border-gray-100">
                  <div className="card-body p-20">
                    <div className="flex-between mb-12">
                      <div className="flex-align gap-8">
                        <span className="w-28 h-28 rounded-circle bg-main-600 text-white d-flex align-items-center justify-content-center text-13 fw-semibold flex-shrink-0">{i + 1}</span>
                        <span className={`text-12 py-2 px-10 rounded-pill fw-medium ${diffBadge(q.question_difficulty)}`}>{q.question_difficulty}</span>
                        <span className="text-13 text-gray-500">{q.subject_name}</span>
                        <span className="text-12 bg-main-50 text-main-600 py-2 px-10 rounded-pill">{q.question_marks} marks</span>
                      </div>
                      <div className="flex-align gap-8">
                        <span className="text-12 text-gray-400">{q.added_on ? new Date(q.added_on).toLocaleDateString() : ""}</span>
                        <button className="btn btn-sm btn-outline-info-600 rounded-pill" onClick={() => handleOpenEdit(q)} title="Edit">
                          <i className="ph ph-pencil text-14" />
                        </button>
                        <button className="btn btn-sm btn-outline-danger rounded-pill" onClick={() => handleDelete(q)} disabled={deleteMutation.isPending} title="Delete">
                          <i className="ph ph-trash text-14" />
                        </button>
                      </div>
                    </div>
                    <div className="mb-12 fw-medium text-15">
                      <MathJax inline>{q.question_text}</MathJax>
                    </div>
                    <div className="row g-8">
                      {[{ l: "A", t: q.option_a_text }, { l: "B", t: q.option_b_text }, { l: "C", t: q.option_c_text }, { l: "D", t: q.option_d_text }].map((opt) => (
                        <div className="col-md-6" key={opt.l}>
                          <div className={`p-10 rounded-8 border text-13 ${q.answer_text === opt.t ? "border-success-600 bg-success-50" : "border-gray-100 bg-gray-50"}`}>
                            <span className="fw-semibold text-main-600 me-6">{opt.l}.</span>
                            {opt.t && <MathJax inline>{opt.t}</MathJax>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </MathJaxContext>

          {isFetchingNextPage && (
            <div className="text-center py-20"><span className="spinner-border spinner-border-sm text-main-600" /></div>
          )}
        </div>
        <Footer />
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div className="modal d-flex align-items-center justify-content-center"
          style={{ position: "fixed", inset: 0, zIndex: 9999, backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-12 shadow-lg w-100" style={{ maxWidth: "640px", maxHeight: "92vh", overflowY: "auto" }}>
            <div className="flex-between p-20 border-bottom border-gray-100">
              <h5 className="fw-semibold mb-0">Edit Question</h5>
              <button type="button" onClick={() => setEditModal(null)} className="btn btn-sm text-gray-500 p-4"><i className="ph ph-x text-20" /></button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-20">
              <div className="alert alert-warning text-13 py-8 px-12 mb-16 rounded-8">
                <i className="ph ph-warning me-6" />Changing the <strong>correct answer</strong> or <strong>marks</strong> will recalculate existing student results.
              </div>
              <div className="mb-12">
                <label className="form-label fw-medium text-14 mb-4">Question Text</label>
                <textarea rows={3} className="form-control" value={editForm.question_text} onChange={(e) => setEditForm((f) => ({ ...f, question_text: e.target.value }))} required />
              </div>
              <div className="row g-12 mb-12">
                {["a","b","c","d"].map((opt) => (
                  <div className="col-6" key={opt}>
                    <label className="form-label fw-medium text-14 mb-4">Option {opt.toUpperCase()}</label>
                    <input type="text" className="form-control" value={editForm[`option_${opt}_text`]}
                      onChange={(e) => setEditForm((f) => ({ ...f, [`option_${opt}_text`]: e.target.value }))} />
                  </div>
                ))}
              </div>
              <div className="mb-12">
                <label className="form-label fw-medium text-14 mb-4">Correct Answer <span className="text-danger">*</span></label>
                <input type="text" className="form-control" value={editForm.answer_text} onChange={(e) => setEditForm((f) => ({ ...f, answer_text: e.target.value }))} required />
              </div>
              <div className="row g-12 mb-12">
                <div className="col-6">
                  <label className="form-label fw-medium text-14 mb-4">Marks</label>
                  <input type="number" className="form-control" value={editForm.question_marks} onChange={(e) => setEditForm((f) => ({ ...f, question_marks: e.target.value }))} required min={1} step={0.5} />
                </div>
                <div className="col-6">
                  <label className="form-label fw-medium text-14 mb-4">Difficulty</label>
                  <select className="form-control" value={editForm.question_difficulty} onChange={(e) => setEditForm((f) => ({ ...f, question_difficulty: e.target.value }))}>
                    {["Easy","Medium","Hard","Time Consuming"].map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex-align gap-12 justify-content-end mt-20 pt-16 border-top border-gray-100">
                <button type="button" onClick={() => setEditModal(null)} className="btn btn-outline-secondary rounded-pill py-9 px-20" disabled={updateMutation.isPending}>Cancel</button>
                <button type="submit" className="btn btn-main rounded-pill py-9 px-24" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? <><span className="spinner-border spinner-border-sm me-6" />Saving...</> : "Update Question"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default MentorShowQuestions;
