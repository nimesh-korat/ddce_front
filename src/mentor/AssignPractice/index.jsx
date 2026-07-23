import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPractice,
  getAdminPractices,
  updatePractice,
  deletePractice,
  addQuestionsToPractice,
  removeQuestionFromPractice,
  assignPracticeToBatch,
  editPracticeBatchAssignment,
  togglePracticeVisibility,
  togglePracticeFeatured,
  deletePracticeBatchAssignment,
  getQuestionsForPractice,
  getMentorsList,
  getAllBatch,
  getAllPhase,
  getSubjects,
} from "../../apis/apis";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { format } from "date-fns";

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

// ── Searchable dropdown ───────────────────────────────────────
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
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      {/* Trigger */}
      <div
        onClick={() => {
          setOpen((o) => !o);
          setSearch("");
        }}
        className="form-control d-flex align-items-center justify-content-between"
        style={{ cursor: "pointer", userSelect: "none", minHeight: "38px" }}
      >
        <span
          className={selected ? "text-gray-800" : "text-gray-400"}
          style={{ fontSize: "14px" }}
        >
          {selected ? selected[labelKey] : placeholder}
        </span>
        <i
          className={`ph ph-caret-${open ? "up" : "down"} text-gray-400 text-13`}
        />
      </div>

      {/* Dropdown */}
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
          {/* Search input */}
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

          {/* Options list */}
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            {/* Clear option */}
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
                No results found
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

function AssignPractice({ Sidebar, basePath = "/mentor" }) {
  const [isSidebarActive, setIsSidebarActive] = useState(false);

  // ── Create Practice form state ───────────────────────────────
  const [createForm, setCreateForm] = useState({
    title: "",
    description: "",
    image: null,
  });
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [practiceSearch, setPracticeSearch] = useState("");

  const [qFilters, setQFilters] = useState({
    subject_id: "",
    mentor_id: "",
    search: "",
    page: 1,
  });
  const [allQuestions, setAllQuestions] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  // ── Edit Practice modal state ────────────────────────────────
  const [editingPractice, setEditingPractice] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    image: null,
  });

  // ── Batch assignment inline form state ───────────────────────
  const [batchForm, setBatchForm] = useState(null); // { practice_id, tbl_batch, tbl_phase, start_date, end_date }
  const [editRow, setEditRow] = useState(null); // { batch_assignment_id, tbl_batch, tbl_phase, start_date, end_date }

  const queryClient = useQueryClient();
  const toggleSidebar = () => setIsSidebarActive((p) => !p);
  const closeSidebar = () => setIsSidebarActive(false);

  // ── Queries ──────────────────────────────────────────────────
  const { data: practicesData, isLoading: practicesLoading } = useQuery({
    queryKey: ["practices"],
    queryFn: getAdminPractices,
    staleTime: 1 * 60 * 1000,
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
  const { data: subjectsData } = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
    staleTime: 10 * 60 * 1000,
  });
  const { data: mentorsData } = useQuery({
    queryKey: ["mentorsList"],
    queryFn: getMentorsList,
    staleTime: 10 * 60 * 1000,
  });

  const { data: questionsData, isLoading: qLoading } = useQuery({
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
      if (qFilters.page === 1) setAllQuestions(questionsData.data);
      else
        setAllQuestions((prev) => {
          const existing = new Set(prev.map((q) => q.id));
          return [
            ...prev,
            ...questionsData.data.filter((q) => !existing.has(q.id)),
          ];
        });
      setHasMore(questionsData.hasMore || false);
    }
  }, [questionsData, qFilters.page]);

  const allPractices = practicesData?.data || [];
  const practices = practiceSearch
    ? allPractices.filter((p) =>
        p.title?.toLowerCase().includes(practiceSearch.toLowerCase()),
      )
    : allPractices;
  const batches = batchData || [];
  const phases = phaseData || [];
  const subjects = subjectsData?.data || [];
  const mentors = mentorsData?.data || [];

  // ── Mutations ────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: async ({ formData, question_ids }) => {
      const res = await createPractice(formData);
      if (question_ids.length > 0) {
        await addQuestionsToPractice(res.data.id, { question_ids });
      }
      return res;
    },
    onSuccess: () => {
      toast.success("Practice created successfully!");
      queryClient.invalidateQueries(["practices"]);
      setCreateForm({ title: "", description: "", image: null });
      setSelectedIds(new Set());
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to create practice"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updatePractice(id, data),
    onSuccess: () => {
      toast.success("Practice updated!");
      queryClient.invalidateQueries(["practices"]);
      setEditingPractice(null);
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to update"),
  });

  const deletePracticeMutation = useMutation({
    mutationFn: (id) => deletePractice(id),
    onSuccess: () => {
      toast.success("Practice deleted!");
      queryClient.invalidateQueries(["practices"]);
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to delete"),
  });

  const removeQuestionMutation = useMutation({
    mutationFn: ({ practiceId, questionId }) =>
      removeQuestionFromPractice(practiceId, questionId),
    onSuccess: () => {
      toast.success("Question removed!");
      queryClient.invalidateQueries(["practices"]);
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to remove"),
  });

  const assignBatchMutation = useMutation({
    mutationFn: (data) => assignPracticeToBatch(data),
    onSuccess: () => {
      toast.success("Assigned to batch!");
      queryClient.invalidateQueries(["practices"]);
      setBatchForm(null);
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to assign"),
  });

  const editBatchMutation = useMutation({
    mutationFn: ({ id, data }) => editPracticeBatchAssignment(id, data),
    onSuccess: () => {
      toast.success("Updated!");
      queryClient.invalidateQueries(["practices"]);
      setEditRow(null);
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to update"),
  });

  const toggleVisibilityMutation = useMutation({
    mutationFn: (id) => togglePracticeVisibility(id),
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries(["practices"]);
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to toggle"),
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: (id) => togglePracticeFeatured(id),
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries(["practices"]);
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to toggle"),
  });

  const deleteBatchMutation = useMutation({
    mutationFn: (id) => deletePracticeBatchAssignment(id),
    onSuccess: () => {
      toast.success("Batch assignment removed!");
      queryClient.invalidateQueries(["practices"]);
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to remove"),
  });

  // ── Handlers ─────────────────────────────────────────────────
  const handleFilterChange = (key, val) => {
    setQFilters((f) => ({ ...f, [key]: val, page: 1 }));
    setAllQuestions([]);
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!createForm.title.trim()) {
      toast.error("Title is required");
      return;
    }
    const formData = new FormData();
    formData.append("title", createForm.title.trim());
    formData.append("description", createForm.description || "");
    if (createForm.image) formData.append("image", createForm.image);
    createMutation.mutate({ formData, question_ids: Array.from(selectedIds) });
  };

  const handleOpenEdit = (p) => {
    setEditingPractice(p);
    setEditForm({
      title: p.title,
      description: p.description || "",
      image: null,
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", editForm.title.trim());
    formData.append("description", editForm.description || "");
    if (editForm.image) formData.append("image", editForm.image);
    updateMutation.mutate({ id: editingPractice.id, data: formData });
  };

  const handleDeletePractice = (p) => {
    Swal.fire({
      title: "Delete Practice?",
      text: `"${p.title}" and all its batch assignments will be deleted.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Delete",
    }).then((r) => {
      if (r.isConfirmed) deletePracticeMutation.mutate(p.id);
    });
  };

  const handleRemoveQuestion = (p, question_id) => {
    Swal.fire({
      title: "Remove Question?",
      text: "Remove this question from the practice?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Remove",
    }).then((r) => {
      if (r.isConfirmed)
        removeQuestionMutation.mutate({
          practiceId: p.id,
          questionId: question_id,
        });
    });
  };

  const handleSaveBatchAssign = () => {
    if (!batchForm.tbl_batch) {
      toast.error("Please select a batch");
      return;
    }
    assignBatchMutation.mutate({
      practice_id: batchForm.practice_id,
      tbl_batch: batchForm.tbl_batch,
      tbl_phase: batchForm.tbl_phase || null,
      start_date: batchForm.start_date || null,
      end_date: batchForm.end_date || null,
    });
  };

  const handleSaveEditRow = () => {
    if (!editRow.tbl_batch) {
      toast.error("Please select a batch");
      return;
    }
    editBatchMutation.mutate({
      id: editRow.batch_assignment_id,
      data: {
        tbl_batch: editRow.tbl_batch,
        tbl_phase: editRow.tbl_phase || null,
        start_date: editRow.start_date || null,
        end_date: editRow.end_date || null,
      },
    });
  };

  const handleDeleteBatch = (ba, practiceTitle) => {
    Swal.fire({
      title: "Remove Batch Assignment?",
      text: `Remove batch "${ba.batch_title}" from "${practiceTitle}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, Remove",
    }).then((r) => {
      if (r.isConfirmed) deleteBatchMutation.mutate(ba.batch_assignment_id);
    });
  };

  const toDatetimeLocal = (d) => {
    try {
      return d ? new Date(d).toISOString().slice(0, 16) : "";
    } catch {
      return "";
    }
  };
  const fmtDate = (d) =>
    d ? format(new Date(d), "dd MMM yyyy, hh:mm a") : "—";

  const statusBadge = (s) =>
    ({
      active: "bg-success-50 text-success-600",
      upcoming: "bg-info-50 text-info-600",
      ended: "bg-gray-100 text-gray-500",
      hidden: "bg-warning-50 text-warning-600",
    })[s] || "bg-gray-50 text-gray-500";

  const diffBadge = (d) =>
    ({
      Easy: "bg-success-50 text-success-600",
      Medium: "bg-info-50 text-info-600",
      Hard: "bg-warning-50 text-warning-600",
      "Time Consuming": "bg-danger-50 text-danger-600",
    })[d] || "bg-gray-50 text-gray-500";

  return (
    <>
      <Sidebar isActive={isSidebarActive} closeSidebar={closeSidebar} />
      <div className="dashboard-main-wrapper">
        <div className="dashboard-header d-flex align-items-center gap-16 p-16 border-bottom border-gray-100">
          <button className="sidebar-toggle d-xl-none" onClick={toggleSidebar}>
            <i className="ph ph-list text-24 text-gray-600" />
          </button>
        </div>
        <div className="dashboard-body">
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
                  Practice Assignments
                </span>
              </li>
            </ul>
          </div>

          <div className="row g-20">
            {/* ── LEFT: Create new practice ── */}
            <div className="col-lg-4">
              <div className="card position-sticky" style={{ top: "20px" }}>
                <div className="card-body">
                  <h6 className="fw-semibold mb-16 text-main-600">
                    <i className="ph ph-plus-circle me-8" />
                    Create Practice
                  </h6>
                  <form onSubmit={handleCreate}>
                    <div className="mb-12">
                      <label className="form-label fw-medium text-14 mb-6">
                        Title <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Physics - Wave Optics"
                        value={createForm.title}
                        onChange={(e) =>
                          setCreateForm((f) => ({
                            ...f,
                            title: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="mb-12">
                      <label className="form-label fw-medium text-14 mb-6">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        className="form-control"
                        placeholder="Optional description"
                        value={createForm.description}
                        onChange={(e) =>
                          setCreateForm((f) => ({
                            ...f,
                            description: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="mb-12">
                      <label className="form-label fw-medium text-14 mb-6">
                        Image (optional)
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) =>
                          setCreateForm((f) => ({
                            ...f,
                            image: e.target.files[0] || null,
                          }))
                        }
                      />
                    </div>

                    {/* Question filters */}
                    <div className="row g-8 mb-10">
                      <div className="col-6">
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
                        <div className="col-6">
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
                      <div className="col-12">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Search questions..."
                          value={qFilters.search}
                          onChange={(e) =>
                            handleFilterChange("search", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    {/* Selected count */}
                    <div className="p-10 bg-main-50 rounded-8 mb-10 flex-between">
                      <span className="text-13 fw-semibold text-main-600">
                        <i className="ph ph-check-square me-6" />
                        {selectedIds.size} question
                        {selectedIds.size !== 1 ? "s" : ""} selected
                      </span>
                      {selectedIds.size > 0 && (
                        <button
                          type="button"
                          className="btn btn-sm btn-link text-12 p-0 text-danger-600"
                          onClick={() => setSelectedIds(new Set())}
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    {/* Questions list */}
                    {qLoading && qFilters.page === 1 ? (
                      <div className="text-center py-12">
                        <span className="spinner-border spinner-border-sm text-main-600" />
                      </div>
                    ) : allQuestions.length === 0 ? (
                      <p className="text-center text-gray-400 text-13 py-12">
                        No questions found.
                      </p>
                    ) : (
                      <MathJaxContext config={mathConfig}>
                        <div
                          className="d-flex flex-column gap-8 mb-10"
                          style={{ maxHeight: "280px", overflowY: "auto" }}
                        >
                          {allQuestions.map((q) => {
                            const isSel = selectedIds.has(q.id);
                            return (
                              <div
                                key={q.id}
                                className={`p-10 rounded-8 border cursor-pointer transition-2 ${isSel ? "border-main-600 bg-main-50" : "border-gray-100 hover-bg-gray-50"}`}
                                onClick={() => toggleSelect(q.id)}
                              >
                                <div className="flex-align gap-8 mb-4">
                                  <div
                                    className={`w-16 h-16 rounded-4 border-2 d-flex align-items-center justify-content-center flex-shrink-0 ${isSel ? "border-main-600 bg-main-600" : "border-gray-300"}`}
                                  >
                                    {isSel && (
                                      <i className="ph-fill ph-check text-white text-10" />
                                    )}
                                  </div>
                                  <span
                                    className={`text-11 py-1 px-8 rounded-pill fw-medium ${diffBadge(q.question_difficulty)}`}
                                  >
                                    {q.question_difficulty}
                                  </span>
                                  {q.subject_name && (
                                    <span className="text-11 text-gray-400">
                                      {q.subject_name}
                                    </span>
                                  )}
                                </div>
                                <p
                                  className="text-12 mb-0 text-gray-800"
                                  style={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                  }}
                                >
                                  <MathJax inline>{q.question_text}</MathJax>
                                </p>
                              </div>
                            );
                          })}
                        </div>
                        {hasMore && (
                          <button
                            type="button"
                            className="btn btn-sm btn-main rounded-pill w-100 mb-10"
                            onClick={() =>
                              setQFilters((f) => ({ ...f, page: f.page + 1 }))
                            }
                            disabled={qLoading}
                          >
                            Load More
                          </button>
                        )}
                      </MathJaxContext>
                    )}

                    <button
                      type="submit"
                      className="btn btn-main rounded-pill py-10 w-100"
                      disabled={createMutation.isPending}
                    >
                      {createMutation.isPending ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-6" />
                          Creating...
                        </>
                      ) : (
                        "Create Practice"
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* ── RIGHT: My practices with batch management ── */}
            <div className="col-lg-8">
              <div className="card">
                <div className="card-body">
                  <div className="flex-between flex-wrap gap-10 mb-16">
                    <h6 className="fw-semibold mb-0 text-main-600">
                      <i className="ph ph-clipboard-text me-8" />
                      My Practices
                      {allPractices.length > 0 && (
                        <span className="text-13 text-gray-400 fw-normal ms-8">
                          ({practices.length}/{allPractices.length})
                        </span>
                      )}
                    </h6>
                    <div
                      className="position-relative"
                      style={{ minWidth: "220px" }}
                    >
                      <i
                        className="ph ph-magnifying-glass position-absolute text-gray-400"
                        style={{
                          top: "50%",
                          left: "10px",
                          transform: "translateY(-50%)",
                          fontSize: "14px",
                          pointerEvents: "none",
                        }}
                      />
                      <input
                        type="text"
                        className="form-control form-control-sm rounded-pill"
                        style={{ paddingLeft: "32px" }}
                        placeholder="Search practices..."
                        value={practiceSearch}
                        onChange={(e) => setPracticeSearch(e.target.value)}
                      />
                      {practiceSearch && (
                        <button
                          onClick={() => setPracticeSearch("")}
                          style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#94a3b8",
                            padding: 0,
                          }}
                        >
                          <i className="ph ph-x text-12" />
                        </button>
                      )}
                    </div>
                  </div>

                  {practicesLoading && (
                    <div className="text-center py-20">
                      <span className="spinner-border text-main-600" />
                    </div>
                  )}

                  {!practicesLoading && allPractices.length === 0 && (
                    <div className="text-center py-32">
                      <i className="ph ph-barbell text-48 text-gray-300 d-block mb-12" />
                      <p className="text-gray-500 text-14">
                        No practices yet. Create one on the left.
                      </p>
                    </div>
                  )}
                  {!practicesLoading &&
                    allPractices.length > 0 &&
                    practices.length === 0 && (
                      <div className="text-center py-32">
                        <i className="ph ph-magnifying-glass text-48 text-gray-300 d-block mb-12" />
                        <p className="text-gray-500 text-14">
                          No practices match "<strong>{practiceSearch}</strong>"
                        </p>
                        <button
                          className="btn btn-sm btn-secondary rounded-pill mt-8"
                          onClick={() => setPracticeSearch("")}
                        >
                          Clear search
                        </button>
                      </div>
                    )}

                  <div className="d-flex flex-column gap-20">
                    {practices.map((p) => (
                      <div
                        key={p.id}
                        className="border border-gray-100 rounded-10 overflow-hidden"
                      >
                        {/* Practice header */}
                        <div className="p-16 bg-gray-50 flex-between gap-8 flex-wrap">
                          <div className="flex-align gap-12">
                            {p.image_url && (
                              <img
                                src={p.image_url}
                                alt="practice"
                                style={{
                                  width: "44px",
                                  height: "44px",
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                }}
                              />
                            )}
                            <div>
                              <h6 className="fw-semibold mb-2 text-gray-800">
                                {p.title}
                              </h6>
                              <div className="flex-align gap-10">
                                {p.description && (
                                  <span
                                    className="text-12 text-gray-400"
                                    style={{
                                      display: "-webkit-box",
                                      WebkitLineClamp: 1,
                                      WebkitBoxOrient: "vertical",
                                      overflow: "hidden",
                                      maxWidth: "220px",
                                    }}
                                  >
                                    {p.description}
                                  </span>
                                )}
                                <span className="text-12 text-main-600 fw-medium">
                                  {p.total_questions} questions
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex-align gap-8">
                            <button
                              className="btn btn-sm btn-info rounded-pill"
                              onClick={() => handleOpenEdit(p)}
                              title="Edit"
                            >
                              <i className="ph ph-pencil text-13" />
                            </button>
                            <button
                              className="btn btn-sm btn-danger rounded-pill"
                              onClick={() => handleDeletePractice(p)}
                              title="Delete"
                            >
                              <i className="ph ph-trash text-13" />
                            </button>
                            <button
                              className="btn btn-sm btn-main rounded-pill flex-align gap-6"
                              onClick={() =>
                                setBatchForm({
                                  practice_id: p.id,
                                  tbl_batch: "",
                                  tbl_phase: "",
                                  start_date: "",
                                  end_date: "",
                                })
                              }
                            >
                              <i className="ph ph-plus text-12" />
                              Assign Batch
                            </button>
                          </div>
                        </div>

                        {/* New batch assignment inline form */}
                        {batchForm?.practice_id === p.id && (
                          <div className="p-14 bg-main-50 border-top border-main-100">
                            <div className="row g-10 mb-10">
                              <div className="col-md-6">
                                <SearchableSelect
                                  options={batches.map((b) => ({
                                    label: b.batch_title,
                                    value: b.id,
                                  }))}
                                  value={batchForm.tbl_batch}
                                  onChange={(val) =>
                                    setBatchForm((f) => ({
                                      ...f,
                                      tbl_batch: val,
                                    }))
                                  }
                                  placeholder="Select Batch *"
                                />
                              </div>
                              <div className="col-md-6">
                                <SearchableSelect
                                  options={phases.map((ph) => ({
                                    label: ph.title,
                                    value: ph.Id,
                                  }))}
                                  value={batchForm.tbl_phase}
                                  onChange={(val) =>
                                    setBatchForm((f) => ({
                                      ...f,
                                      tbl_phase: val,
                                    }))
                                  }
                                  placeholder="All Phases"
                                />
                              </div>
                              <div className="col-md-6">
                                <label className="text-11 text-gray-500 mb-2 d-block">
                                  Start (empty = now)
                                </label>
                                <input
                                  type="datetime-local"
                                  className="form-control form-control-sm"
                                  value={batchForm.start_date}
                                  onChange={(e) =>
                                    setBatchForm((f) => ({
                                      ...f,
                                      start_date: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                              <div className="col-md-6">
                                <label className="text-11 text-gray-500 mb-2 d-block">
                                  End (empty = no end)
                                </label>
                                <input
                                  type="datetime-local"
                                  className="form-control form-control-sm"
                                  value={batchForm.end_date}
                                  onChange={(e) =>
                                    setBatchForm((f) => ({
                                      ...f,
                                      end_date: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                            </div>
                            <div className="flex-align gap-8">
                              <button
                                className="btn btn-sm btn-success rounded-pill"
                                onClick={handleSaveBatchAssign}
                                disabled={assignBatchMutation.isPending}
                              >
                                {assignBatchMutation.isPending ? (
                                  <span className="spinner-border spinner-border-sm" />
                                ) : (
                                  <>
                                    <i className="ph ph-floppy-disk me-4" />
                                    Save
                                  </>
                                )}
                              </button>
                              <button
                                className="btn btn-sm btn-secondary rounded-pill"
                                onClick={() => setBatchForm(null)}
                              >
                                <i className="ph ph-x" />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Batch assignments table */}
                        {p.batch_assignments?.length > 0 ? (
                          <div className="table-responsive">
                            <table className="table table-sm mb-0">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="text-12 text-gray-500 fw-medium px-14 py-10">
                                    Batch
                                  </th>
                                  <th className="text-12 text-gray-500 fw-medium py-10">
                                    Phase
                                  </th>
                                  <th className="text-12 text-gray-500 fw-medium py-10">
                                    Start
                                  </th>
                                  <th className="text-12 text-gray-500 fw-medium py-10">
                                    End
                                  </th>
                                  <th className="text-12 text-gray-500 fw-medium py-10 text-center">
                                    Show to Students
                                  </th>
                                  <th className="text-12 text-gray-500 fw-medium py-10 text-center">
                                    Status
                                  </th>
                                  <th className="text-12 text-gray-500 fw-medium py-10 text-center">
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {p.batch_assignments.map((ba) => (
                                  <tr key={ba.batch_assignment_id}>
                                    {editRow?.batch_assignment_id ===
                                    ba.batch_assignment_id ? (
                                      /* Edit row */
                                      <>
                                        <td className="px-14">
                                          <SearchableSelect
                                            options={batches.map((b) => ({
                                              label: b.batch_title,
                                              value: b.id,
                                            }))}
                                            value={editRow.tbl_batch}
                                            onChange={(val) =>
                                              setEditRow((r) => ({
                                                ...r,
                                                tbl_batch: val,
                                              }))
                                            }
                                            placeholder="Select Batch"
                                          />
                                        </td>
                                        <td>
                                          <SearchableSelect
                                            options={phases.map((ph) => ({
                                              label: ph.title,
                                              value: ph.Id,
                                            }))}
                                            value={editRow.tbl_phase || ""}
                                            onChange={(val) =>
                                              setEditRow((r) => ({
                                                ...r,
                                                tbl_phase: val,
                                              }))
                                            }
                                            placeholder="All Phases"
                                          />
                                        </td>
                                        <td>
                                          <input
                                            type="datetime-local"
                                            className="form-control form-control-sm"
                                            value={toDatetimeLocal(
                                              editRow.start_date,
                                            )}
                                            onChange={(e) =>
                                              setEditRow((r) => ({
                                                ...r,
                                                start_date: e.target.value,
                                              }))
                                            }
                                          />
                                        </td>
                                        <td>
                                          <input
                                            type="datetime-local"
                                            className="form-control form-control-sm"
                                            value={toDatetimeLocal(
                                              editRow.end_date,
                                            )}
                                            onChange={(e) =>
                                              setEditRow((r) => ({
                                                ...r,
                                                end_date: e.target.value,
                                              }))
                                            }
                                          />
                                        </td>
                                        <td />
                                        <td />
                                        <td />
                                        <td className="text-center">
                                          <div className="flex-align gap-6 justify-content-center">
                                            <button
                                              className="btn btn-sm btn-success rounded-pill"
                                              onClick={handleSaveEditRow}
                                              disabled={
                                                editBatchMutation.isPending
                                              }
                                            >
                                              {editBatchMutation.isPending ? (
                                                <span className="spinner-border spinner-border-sm" />
                                              ) : (
                                                <>
                                                  <i className="ph ph-floppy-disk me-4" />
                                                  Save
                                                </>
                                              )}
                                            </button>
                                            <button
                                              className="btn btn-sm btn-secondary rounded-pill"
                                              onClick={() => setEditRow(null)}
                                            >
                                              <i className="ph ph-x" />
                                            </button>
                                          </div>
                                        </td>
                                      </>
                                    ) : (
                                      /* View row */
                                      <>
                                        <td className="text-13 px-14 py-10 fw-medium">
                                          {ba.batch_title || "—"}
                                        </td>
                                        <td className="text-13 py-10">
                                          {ba.phase_title || "All"}
                                        </td>
                                        <td className="text-12 text-gray-500 py-10">
                                          {fmtDate(ba.start_date)}
                                        </td>
                                        <td className="text-12 text-gray-500 py-10">
                                          {fmtDate(ba.end_date)}
                                        </td>
                                        {/* Show to Students toggle */}
                                        <td className="py-10 text-center">
                                          <div className="form-check form-switch mb-0 d-flex justify-content-center">
                                            <input
                                              className="form-check-input"
                                              type="checkbox"
                                              role="switch"
                                              checked={ba.is_featured === 1}
                                              onChange={() =>
                                                toggleFeaturedMutation.mutate(
                                                  ba.batch_assignment_id,
                                                )
                                              }
                                              disabled={
                                                toggleFeaturedMutation.isPending
                                              }
                                              title={
                                                ba.is_featured === 1
                                                  ? "Hide questions"
                                                  : "Show questions"
                                              }
                                            />
                                          </div>
                                          <span
                                            className={`text-10 fw-medium ${ba.is_featured === 1 ? "text-main-600" : "text-gray-400"}`}
                                          >
                                            {ba.is_featured === 1
                                              ? "On"
                                              : "Off"}
                                          </span>
                                        </td>
                                        <td className="py-10 text-center">
                                          <span
                                            className={`text-11 py-2 px-8 rounded-pill fw-medium ${statusBadge(ba.status)}`}
                                          >
                                            {ba.status}
                                          </span>
                                        </td>
                                        <td className="py-10 text-center">
                                          <div className="flex-align gap-6 justify-content-center">
                                            <button
                                              className="btn btn-sm btn-info rounded-pill"
                                              onClick={() =>
                                                setEditRow({
                                                  batch_assignment_id:
                                                    ba.batch_assignment_id,
                                                  tbl_batch: String(
                                                    ba.tbl_batch,
                                                  ),
                                                  tbl_phase: String(
                                                    ba.tbl_phase || "",
                                                  ),
                                                  start_date: ba.start_date,
                                                  end_date: ba.end_date,
                                                })
                                              }
                                            >
                                              <i className="ph ph-pencil text-12" />
                                            </button>
                                            <button
                                              className="btn btn-sm btn-danger rounded-pill"
                                              onClick={() =>
                                                handleDeleteBatch(ba, p.title)
                                              }
                                              disabled={
                                                deleteBatchMutation.isPending
                                              }
                                            >
                                              <i className="ph ph-trash text-12" />
                                            </button>
                                          </div>
                                        </td>
                                      </>
                                    )}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="text-13 text-gray-400 text-center py-14 mb-0">
                            No batches assigned yet. Click "Assign Batch" above.
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Edit Practice Modal ── */}
      {editingPractice && (
        <div
          className="modal d-flex align-items-center justify-content-center"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <div
            className="bg-white rounded-12 shadow-lg w-100"
            style={{ maxWidth: "480px" }}
          >
            <div className="flex-between p-20 border-bottom border-gray-100">
              <h5 className="fw-semibold mb-0">Edit Practice</h5>
              <button
                type="button"
                onClick={() => setEditingPractice(null)}
                className="btn btn-sm text-gray-500 p-4"
              >
                <i className="ph ph-x text-20" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-20">
              <div className="mb-12">
                <label className="form-label fw-medium text-14 mb-6">
                  Title <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, title: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="mb-12">
                <label className="form-label fw-medium text-14 mb-6">
                  Description
                </label>
                <textarea
                  rows={2}
                  className="form-control"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, description: e.target.value }))
                  }
                />
              </div>
              <div className="mb-16">
                <label className="form-label fw-medium text-14 mb-6">
                  Image{" "}
                  {editingPractice.image_url && (
                    <span className="text-12 text-success-600 fw-normal">
                      — already uploaded
                    </span>
                  )}
                </label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) =>
                    setEditForm((f) => ({
                      ...f,
                      image: e.target.files[0] || null,
                    }))
                  }
                />
              </div>
              <div className="flex-align gap-12 justify-content-end pt-16 border-top border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingPractice(null)}
                  className="btn btn-secondary rounded-pill py-9 px-20"
                  disabled={updateMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-main rounded-pill py-9 px-24"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-6" />
                      Saving...
                    </>
                  ) : (
                    "Update Practice"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default AssignPractice;
