import { MathJax, MathJaxContext } from "better-react-mathjax";
import React, { forwardRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminDeleteQuestion, adminUpdateQuestion } from "../../../apis/apis";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const config = {
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

const AdminQuestionCard = forwardRef(
  (
    {
      index,
      questionId,
      question,
      questionImg,
      option1,
      option2,
      option3,
      option4,
      optionimg1,
      optionimg2,
      optionimg3,
      optionimg4,
      answer,
      marks,
      difficulty,
    },
    ref,
  ) => {
    const queryClient = useQueryClient();
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({
      question_text: question || "",
      option_a_text: option1 || "",
      option_b_text: option2 || "",
      option_c_text: option3 || "",
      option_d_text: option4 || "",
      answer_text: answer || "",
      question_marks: marks || "",
      question_difficulty: difficulty || "0",
    });

    const difficultyLabel = (val) => {
      const map = { 0: "Easy", 1: "Medium", 2: "Hard", 3: "Time Consuming" };
      return map[val] || val;
    };

    const updateMutation = useMutation({
      mutationFn: ({ id, data }) => adminUpdateQuestion(id, data),
      onSuccess: (res) => {
        const affected = res?.data?.students_affected ?? 0;
        const recalc = res?.data?.recalculated;
        toast.success(
          recalc && affected > 0
            ? `Question updated! Results recalculated for ${affected} student(s).`
            : "Question updated successfully!",
        );
        queryClient.invalidateQueries(["questions"]);
        setShowEditModal(false);
      },
      onError: (err) => {
        toast.error(
          err?.response?.data?.message || "Failed to update question",
        );
      },
    });

    const deleteMutation = useMutation({
      mutationFn: (id) => adminDeleteQuestion(id),
      onSuccess: () => {
        toast.success("Question deleted successfully!");
        queryClient.invalidateQueries(["questions"]);
      },
      onError: (err) => {
        toast.error(
          err?.response?.data?.message || "Failed to delete question",
        );
      },
    });

    const handleEditSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData();
      Object.entries(editForm).forEach(([k, v]) => formData.append(k, v));
      updateMutation.mutate({ id: questionId, data: formData });
    };

    const handleDelete = () => {
      Swal.fire({
        title: "Delete Question?",
        html: `<p class="text-sm text-gray-600">This question will be permanently deleted.<br>If it's used in a test, deletion will be blocked.</p>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Yes, Delete",
      }).then((result) => {
        if (result.isConfirmed) deleteMutation.mutate(questionId);
      });
    };

    return (
      <>
        <MathJaxContext config={config}>
          <div className="card question-card shadow" ref={ref}>
            <div className="card-body">
              {/* Header row with index, difficulty, and action buttons */}
              <div className="flex-between mb-8">
                <h5 className="card-title mb-0 flex-align gap-8">
                  <span>{index}.</span>
                  <MathJax inline>{question}</MathJax>
                </h5>
                <div className="flex-align gap-8 flex-shrink-0 ms-12">
                  {difficulty && (
                    <span
                      className={`text-12 py-2 px-10 rounded-pill fw-medium ${
                        difficulty === "0"
                          ? "bg-success-50 text-success-600"
                          : difficulty === "1"
                            ? "bg-info-50 text-info-600"
                            : difficulty === "2"
                              ? "bg-warning-50 text-warning-600"
                              : "bg-danger-50 text-danger-600"
                      }`}
                    >
                      {difficultyLabel(difficulty)}
                    </span>
                  )}
                  {marks && (
                    <span className="text-12 py-2 px-10 rounded-pill bg-main-50 text-main-600 fw-medium">
                      {marks} mark{marks !== 1 ? "s" : ""}
                    </span>
                  )}
                  <button
                    className="btn btn-sm btn-info rounded-pill"
                    onClick={() => setShowEditModal(true)}
                    title="Edit question"
                  >
                    <i className="ph ph-pencil text-14" />
                  </button>
                  <button
                    className="btn btn-sm btn-danger rounded-pill"
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                    title="Delete question"
                  >
                    <i className="ph ph-trash text-14" />
                  </button>
                </div>
              </div>

              {questionImg && (
                <img
                  className="question-image"
                  style={{
                    width: "auto",
                    maxHeight: "200px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginBottom: "10px",
                  }}
                  src={questionImg}
                  alt="question"
                />
              )}

              <div className="container x">
                <div className="row question-row-gap align-items-stretch">
                  {[
                    { label: "A", text: option1, img: optionimg1 },
                    { label: "B", text: option2, img: optionimg2 },
                    { label: "C", text: option3, img: optionimg3 },
                    { label: "D", text: option4, img: optionimg4 },
                  ].map((opt) => (
                    <div className="col-6" key={opt.label}>
                      <div className="option-card h-100">
                        <div className="question-bullet-icon">{opt.label}</div>
                        {opt.img === null ? (
                          <MathJax inline>
                            <span>{opt.text}</span>
                          </MathJax>
                        ) : (
                          <img src={opt.img} alt={opt.text} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="correct-answer-section">
                  <div className="icon">✔</div>
                  <div>
                    The correct answer is{" "}
                    <MathJax inline>
                      <strong>{answer}</strong>
                    </MathJax>
                    .
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MathJaxContext>

        {/* Edit Modal */}
        {showEditModal && (
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
              style={{
                maxWidth: "640px",
                maxHeight: "92vh",
                overflowY: "auto",
              }}
            >
              <div className="flex-between p-20 border-bottom border-gray-100">
                <h5 className="fw-semibold mb-0">Edit Question</h5>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn btn-sm text-gray-500 p-4"
                >
                  <i className="ph ph-x text-20" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="p-20">
                {/* Warning if answer changes */}
                <div className="alert alert-warning text-13 py-8 px-12 mb-16 rounded-8">
                  <i className="ph ph-warning me-6" />
                  If you change the <strong>correct answer</strong> or{" "}
                  <strong>marks</strong>, all existing student results for this
                  question will be automatically recalculated.
                </div>

                <div className="mb-12">
                  <label className="form-label fw-medium text-14 mb-4">
                    Question Text
                  </label>
                  <textarea
                    rows={3}
                    className="form-control"
                    value={editForm.question_text}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        question_text: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="row g-12 mb-12">
                  <div className="col-6">
                    <label className="form-label fw-medium text-14 mb-4">
                      Option A
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={editForm.option_a_text}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          option_a_text: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-medium text-14 mb-4">
                      Option B
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={editForm.option_b_text}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          option_b_text: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-medium text-14 mb-4">
                      Option C
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={editForm.option_c_text}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          option_c_text: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-medium text-14 mb-4">
                      Option D
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={editForm.option_d_text}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          option_d_text: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="mb-12">
                  <label className="form-label fw-medium text-14 mb-4">
                    Correct Answer <span className="text-danger">*</span>
                    <span className="text-gray-400 fw-normal ms-4">
                      (must match one of the options exactly)
                    </span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={editForm.answer_text}
                    onChange={(e) =>
                      setEditForm({ ...editForm, answer_text: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="row g-12 mb-12">
                  <div className="col-6">
                    <label className="form-label fw-medium text-14 mb-4">
                      Marks
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={editForm.question_marks}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          question_marks: e.target.value,
                        })
                      }
                      required
                      min={1}
                      step={0.5}
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-medium text-14 mb-4">
                      Difficulty
                    </label>
                    <select
                      className="form-control"
                      value={editForm.question_difficulty}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          question_difficulty: e.target.value,
                        })
                      }
                    >
                      <option value="0">Easy</option>
                      <option value="1">Medium</option>
                      <option value="2">Hard</option>
                      <option value="3">Time Consuming</option>
                    </select>
                  </div>
                </div>

                <div className="flex-align gap-12 justify-content-end mt-20 pt-16 border-top border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="btn btn-outline-secondary rounded-pill py-9 px-20"
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
                      "Update Question"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    );
  },
);

export default AdminQuestionCard;
