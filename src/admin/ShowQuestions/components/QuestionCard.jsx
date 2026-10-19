import { MathJax, MathJaxContext } from "better-react-mathjax";
import React, { forwardRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminDeleteQuestion,
  adminUpdateQuestion,
  adminPreviewUpdateQuestion,
} from "../../../apis/apis";
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

const difficultyLabel = (val) => {
  const map = {
    0: "Easy",
    1: "Medium",
    2: "Hard",
    3: "Time Consuming",
    Easy: "Easy",
    Medium: "Medium",
    Hard: "Hard",
    "Time Consuming": "Time Consuming",
  };
  return map[val] || val;
};

const difficultyBadge = (val) => {
  const v = String(val);
  if (v === "0" || v === "Easy") return "bg-success-50 text-success-600";
  if (v === "1" || v === "Medium") return "bg-info-50 text-info-600";
  if (v === "2" || v === "Hard") return "bg-warning-50 text-warning-600";
  return "bg-danger-50 text-danger-600";
};

// ── Impact Preview Panel ────────────────────────────────────────────────────
function ImpactPreview({ preview, onBack, onConfirm, isPending }) {
  const { quiz, practice, old_answer, new_answer, old_marks, new_marks } =
    preview;
  const noChange = !preview.changed;

  const deltaColor = (n) => (n > 0 ? "#16a34a" : n < 0 ? "#dc2626" : "#64748b");
  const deltaSign = (n) => (n > 0 ? `+${n}` : `${n}`);

  return (
    <div style={{ padding: "20px 24px 24px" }}>
      {noChange ? (
        <div style={{ textAlign: "center", padding: "32px 0" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>✅</div>
          <p style={{ fontSize: "15px", color: "#475569", fontWeight: 600 }}>
            No recalculation needed
          </p>
          <p style={{ fontSize: "13px", color: "#94a3b8" }}>
            Answer and marks are unchanged — student results will not be
            affected.
          </p>
        </div>
      ) : (
        <>
          {/* Answer/marks change summary */}
          <div
            style={{
              background: "#f8fafc",
              borderRadius: "10px",
              padding: "14px 16px",
              marginBottom: "18px",
            }}
          >
            <p
              style={{
                margin: "0 0 10px",
                fontSize: "13px",
                fontWeight: 700,
                color: "#334155",
              }}
            >
              Changes being applied
            </p>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              {old_answer !== new_answer && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "13px",
                  }}
                >
                  <span style={{ color: "#64748b", minWidth: "90px" }}>
                    Correct answer
                  </span>
                  <span
                    style={{
                      background: "#fee2e2",
                      color: "#dc2626",
                      borderRadius: "6px",
                      padding: "2px 10px",
                      fontWeight: 600,
                      textDecoration: "line-through",
                    }}
                  >
                    {old_answer}
                  </span>
                  <i className="ph ph-arrow-right text-gray-400" />
                  <span
                    style={{
                      background: "#dcfce7",
                      color: "#16a34a",
                      borderRadius: "6px",
                      padding: "2px 10px",
                      fontWeight: 600,
                    }}
                  >
                    {new_answer}
                  </span>
                </div>
              )}
              {old_marks !== new_marks && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "13px",
                  }}
                >
                  <span style={{ color: "#64748b", minWidth: "90px" }}>
                    Marks
                  </span>
                  <span
                    style={{
                      background: "#fee2e2",
                      color: "#dc2626",
                      borderRadius: "6px",
                      padding: "2px 10px",
                      fontWeight: 600,
                      textDecoration: "line-through",
                    }}
                  >
                    {old_marks}
                  </span>
                  <i className="ph ph-arrow-right text-gray-400" />
                  <span
                    style={{
                      background: "#dcfce7",
                      color: "#16a34a",
                      borderRadius: "6px",
                      padding: "2px 10px",
                      fontWeight: 600,
                    }}
                  >
                    {new_marks}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quiz impact */}
          <div style={{ marginBottom: "16px" }}>
            <p
              style={{
                margin: "0 0 8px",
                fontSize: "13px",
                fontWeight: 700,
                color: "#334155",
              }}
            >
              <i className="ph ph-exam me-6 text-main-600" />
              Quiz Results Impact
              <span
                style={{ marginLeft: "8px", fontWeight: 400, color: "#94a3b8" }}
              >
                ({quiz.affected} student{quiz.affected !== 1 ? "s" : ""}{" "}
                affected)
              </span>
            </p>
            {quiz.affected === 0 ? (
              <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>
                No quiz attempts for this question.
              </p>
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  {quiz.correct_gain > 0 && (
                    <span
                      style={{
                        background: "#dcfce7",
                        color: "#16a34a",
                        borderRadius: "20px",
                        padding: "4px 12px",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      +{quiz.correct_gain} newly correct
                    </span>
                  )}
                  {quiz.correct_loss > 0 && (
                    <span
                      style={{
                        background: "#fee2e2",
                        color: "#dc2626",
                        borderRadius: "20px",
                        padding: "4px 12px",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      −{quiz.correct_loss} now wrong
                    </span>
                  )}
                  <span
                    style={{
                      background: "#f1f5f9",
                      color: "#475569",
                      borderRadius: "20px",
                      padding: "4px 12px",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    Score Δ: {quiz.score_delta > 0 ? "+" : ""}
                    {quiz.score_delta} marks total
                  </span>
                </div>
                <div
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: "12px",
                    }}
                  >
                    <thead>
                      <tr style={{ background: "#f8fafc" }}>
                        <th style={thStyle}>Student</th>
                        <th style={thStyle}>Test ID</th>
                        <th style={{ ...thStyle, textAlign: "right" }}>
                          Score change
                        </th>
                        <th style={{ ...thStyle, textAlign: "right" }}>
                          Correct Δ
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {quiz.students.map((s, i) => (
                        <tr key={i} style={{ borderTop: "1px solid #f1f5f9" }}>
                          <td style={tdStyle}>{s.student_name}</td>
                          <td style={tdStyle}>#{s.test_id}</td>
                          <td
                            style={{
                              ...tdStyle,
                              textAlign: "right",
                              fontWeight: 600,
                              color: deltaColor(s.score_delta),
                            }}
                          >
                            {deltaSign(s.score_delta)}
                          </td>
                          <td
                            style={{
                              ...tdStyle,
                              textAlign: "right",
                              fontWeight: 600,
                              color: deltaColor(s.correct_delta),
                            }}
                          >
                            {deltaSign(s.correct_delta)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

          {/* Practice impact */}
          <div style={{ marginBottom: "20px" }}>
            <p
              style={{
                margin: "0 0 8px",
                fontSize: "13px",
                fontWeight: 700,
                color: "#334155",
              }}
            >
              <i className="ph ph-notepad me-6 text-info-600" />
              Practice Results Impact
              <span
                style={{ marginLeft: "8px", fontWeight: 400, color: "#94a3b8" }}
              >
                ({practice.affected} student{practice.affected !== 1 ? "s" : ""}{" "}
                affected)
              </span>
            </p>
            {practice.affected === 0 ? (
              <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>
                No practice attempts for this question.
              </p>
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  {practice.correct_gain > 0 && (
                    <span
                      style={{
                        background: "#dcfce7",
                        color: "#16a34a",
                        borderRadius: "20px",
                        padding: "4px 12px",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      +{practice.correct_gain} newly correct
                    </span>
                  )}
                  {practice.correct_loss > 0 && (
                    <span
                      style={{
                        background: "#fee2e2",
                        color: "#dc2626",
                        borderRadius: "20px",
                        padding: "4px 12px",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      −{practice.correct_loss} now wrong
                    </span>
                  )}
                </div>
                <div
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: "12px",
                    }}
                  >
                    <thead>
                      <tr style={{ background: "#f8fafc" }}>
                        <th style={thStyle}>Student</th>
                        <th style={{ ...thStyle, textAlign: "right" }}>
                          Correct Δ
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {practice.students.map((s, i) => (
                        <tr key={i} style={{ borderTop: "1px solid #f1f5f9" }}>
                          <td style={tdStyle}>{s.student_name}</td>
                          <td
                            style={{
                              ...tdStyle,
                              textAlign: "right",
                              fontWeight: 600,
                              color: deltaColor(s.correct_delta),
                            }}
                          >
                            {deltaSign(s.correct_delta)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "12px",
          borderTop: "1px solid #f1f5f9",
          paddingTop: "18px",
        }}
      >
        <button
          type="button"
          onClick={onBack}
          disabled={isPending}
          style={{
            border: "1.5px solid #cbd5e1",
            background: "#fff",
            color: "#64748b",
            borderRadius: "50px",
            padding: "9px 22px",
            fontWeight: 600,
            fontSize: "13px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <i className="ph ph-arrow-left" /> Back to Edit
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isPending}
          style={{
            background: "#4f46e5",
            color: "#fff",
            border: "none",
            borderRadius: "50px",
            padding: "9px 26px",
            fontWeight: 600,
            fontSize: "13px",
            cursor: isPending ? "not-allowed" : "pointer",
            opacity: isPending ? 0.7 : 1,
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          {isPending ? (
            <>
              <span className="spinner-border spinner-border-sm" /> Saving...
            </>
          ) : (
            <>
              <i className="ph ph-check" /> Confirm &amp; Update
            </>
          )}
        </button>
      </div>
    </div>
  );
}

const thStyle = {
  padding: "8px 12px",
  color: "#64748b",
  fontWeight: 600,
  textAlign: "left",
  whiteSpace: "nowrap",
};
const tdStyle = { padding: "7px 12px", color: "#334155" };

// ── Edit Modal ──────────────────────────────────────────────────────────────
function EditModal({ questionId, initial, onClose, onSaved }) {
  const [form, setForm] = useState({
    question_text: initial.question_text || "",
    option_a_text: initial.option_a_text || "",
    option_b_text: initial.option_b_text || "",
    option_c_text: initial.option_c_text || "",
    option_d_text: initial.option_d_text || "",
    answer_text: initial.answer_text || "",
    question_marks: initial.question_marks || "",
    question_difficulty: initial.question_difficulty || "0",
    prevAskedPaper: initial.prevAskedPaper || "",
    prevAskedYear: initial.prevAskedYear || "",
    fromBook: initial.fromBook || "",
    question_image: null,
    option_a_image: null,
    option_b_image: null,
    option_c_image: null,
    option_d_image: null,
    answer_image: null,
  });

  const [isImageQuestion, setIsImageQuestion] = useState(false);
  const [isImageOption, setIsImageOption] = useState(false);
  const [isAskedPrev, setIsAskedPrev] = useState(
    !!(initial.prevAskedPaper || initial.prevAskedYear),
  );
  const [isFromBook, setIsFromBook] = useState(!!initial.fromBook);

  // step: "edit" | "preview"
  const [step, setStep] = useState("edit");
  const [preview, setPreview] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleFile = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("File must be < 2 MB");
      e.target.value = "";
      return;
    }
    set(field, file);
  };

  const answerOptions = isImageOption
    ? ["Option A", "Option B", "Option C", "Option D"]
    : [
        form.option_a_text,
        form.option_b_text,
        form.option_c_text,
        form.option_d_text,
      ].filter(Boolean);

  const allOptionsFilled = isImageOption
    ? form.option_a_image &&
      form.option_b_image &&
      form.option_c_image &&
      form.option_d_image
    : form.option_a_text.trim() &&
      form.option_b_text.trim() &&
      form.option_c_text.trim() &&
      form.option_d_text.trim();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, data }) => adminUpdateQuestion(id, data),
    onSuccess: (res) => {
      const affected = res?.data?.students_affected ?? 0;
      const recalc = res?.data?.recalculated;
      toast.success(
        recalc && affected > 0
          ? `Question updated! Results recalculated for ${affected} student(s).`
          : "Question updated successfully!",
      );
      onSaved();
      onClose();
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to update question"),
  });

  const buildFormData = () => {
    const fd = new FormData();
    fd.append("question_text", form.question_text);
    fd.append("option_a_text", isImageOption ? "" : form.option_a_text);
    fd.append("option_b_text", isImageOption ? "" : form.option_b_text);
    fd.append("option_c_text", isImageOption ? "" : form.option_c_text);
    fd.append("option_d_text", isImageOption ? "" : form.option_d_text);
    fd.append("answer_text", form.answer_text);
    fd.append("question_marks", form.question_marks);
    fd.append("question_difficulty", form.question_difficulty);
    fd.append("prevAskedPaper", isAskedPrev ? form.prevAskedPaper : "");
    fd.append("prevAskedYear", isAskedPrev ? form.prevAskedYear : "");
    fd.append("fromBook", isFromBook ? form.fromBook : "");
    if (form.question_image) fd.append("question_image", form.question_image);
    if (form.option_a_image) fd.append("option_a_image", form.option_a_image);
    if (form.option_b_image) fd.append("option_b_image", form.option_b_image);
    if (form.option_c_image) fd.append("option_c_image", form.option_c_image);
    if (form.option_d_image) fd.append("option_d_image", form.option_d_image);
    if (form.answer_image) fd.append("answer_image", form.answer_image);
    return fd;
  };

  const handlePreview = async (e) => {
    e.preventDefault();
    if (!form.question_text || !form.answer_text || !form.question_marks) {
      toast.error("Please fill all required fields");
      return;
    }
    setLoadingPreview(true);
    try {
      const data = await adminPreviewUpdateQuestion(questionId, {
        answer_text: form.answer_text,
        question_marks: form.question_marks,
      });
      setPreview(data);
      setStep("preview");
    } catch (err) {
      toast.error("Failed to load impact preview");
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleConfirm = () => mutate({ id: questionId, data: buildFormData() });

  const stepTitle = step === "edit" ? "Edit Question" : "Impact Preview";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "14px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
          width: "100%",
          maxWidth: "740px",
          maxHeight: "94vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 24px",
            borderBottom: "1px solid #f1f5f9",
            position: "sticky",
            top: 0,
            background: "#fff",
            zIndex: 2,
          }}
        >
          <h5
            style={{
              margin: 0,
              fontWeight: 700,
              fontSize: "17px",
              color: "#1e293b",
            }}
          >
            {step === "preview" && (
              <i className="ph ph-chart-bar me-8 text-main-600" />
            )}
            {step === "edit" && (
              <i className="ph ph-pencil-simple me-8 text-main-600" />
            )}
            {stepTitle}
          </h5>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Step indicator */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12px",
                color: "#94a3b8",
              }}
            >
              <span
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: "#4f46e5",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                1
              </span>
              <span
                style={{
                  color: step === "edit" ? "#4f46e5" : "#94a3b8",
                  fontWeight: step === "edit" ? 600 : 400,
                }}
              >
                Edit
              </span>
              <i className="ph ph-caret-right" />
              <span
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: step === "preview" ? "#4f46e5" : "#e2e8f0",
                  color: step === "preview" ? "#fff" : "#94a3b8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                2
              </span>
              <span
                style={{
                  color: step === "preview" ? "#4f46e5" : "#94a3b8",
                  fontWeight: step === "preview" ? 600 : 400,
                }}
              >
                Preview
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                fontSize: "20px",
                color: "#94a3b8",
                lineHeight: 1,
              }}
            >
              <i className="ph ph-x" />
            </button>
          </div>
        </div>

        {step === "preview" && preview ? (
          <ImpactPreview
            preview={preview}
            onBack={() => setStep("edit")}
            onConfirm={handleConfirm}
            isPending={isPending}
          />
        ) : (
          <form onSubmit={handlePreview} style={{ padding: "20px 24px 24px" }}>
            {/* Question Text */}
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>
                Question Text <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <textarea
                rows={3}
                style={inputStyle}
                value={form.question_text}
                onChange={(e) => set("question_text", e.target.value)}
                placeholder="Enter question text"
                required
              />
            </div>

            {/* Image question toggle */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "10px",
              }}
            >
              <input
                type="checkbox"
                id="edit_imgQ"
                checked={isImageQuestion}
                onChange={(e) => setIsImageQuestion(e.target.checked)}
                style={{ cursor: "pointer" }}
              />
              <label
                htmlFor="edit_imgQ"
                style={{
                  margin: 0,
                  fontSize: "13px",
                  color: "#475569",
                  cursor: "pointer",
                }}
              >
                Upload/replace question image
              </label>
            </div>
            {isImageQuestion && (
              <div style={{ marginBottom: "14px" }}>
                <input
                  type="file"
                  accept="image/*"
                  style={inputStyle}
                  onChange={(e) => handleFile(e, "question_image")}
                />
                <p
                  style={{
                    fontSize: "11px",
                    color: "#94a3b8",
                    marginTop: "4px",
                  }}
                >
                  Max 2 MB. Leave blank to keep existing image.
                </p>
              </div>
            )}

            {/* Image options toggle */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              <input
                type="checkbox"
                id="edit_imgOpt"
                checked={isImageOption}
                onChange={(e) => {
                  setIsImageOption(e.target.checked);
                  set("answer_text", "");
                }}
                style={{ cursor: "pointer" }}
              />
              <label
                htmlFor="edit_imgOpt"
                style={{
                  margin: 0,
                  fontSize: "13px",
                  color: "#475569",
                  cursor: "pointer",
                }}
              >
                Options are images
              </label>
            </div>

            {/* Options */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              {["a", "b", "c", "d"].map((opt) => (
                <div key={opt}>
                  <label style={labelStyle}>Option {opt.toUpperCase()}</label>
                  {isImageOption ? (
                    <input
                      type="file"
                      accept="image/*"
                      style={inputStyle}
                      onChange={(e) => handleFile(e, `option_${opt}_image`)}
                    />
                  ) : (
                    <input
                      type="text"
                      style={inputStyle}
                      placeholder={`Option ${opt.toUpperCase()}`}
                      value={form[`option_${opt}_text`]}
                      onChange={(e) =>
                        set(`option_${opt}_text`, e.target.value)
                      }
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Correct Answer */}
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>
                Correct Answer <span style={{ color: "#ef4444" }}>*</span>
                {!isImageOption && (
                  <span
                    style={{
                      fontWeight: 400,
                      color: "#94a3b8",
                      marginLeft: "6px",
                    }}
                  >
                    (select from options above)
                  </span>
                )}
              </label>
              {allOptionsFilled ? (
                <select
                  style={inputStyle}
                  value={form.answer_text}
                  onChange={(e) => set("answer_text", e.target.value)}
                  required
                >
                  <option value="">Select correct answer</option>
                  {answerOptions.map((opt, i) => (
                    <option key={i} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  style={{
                    ...inputStyle,
                    background: "#f8fafc",
                    color: "#94a3b8",
                  }}
                  value="Fill all options first"
                  disabled
                />
              )}
            </div>

            {/* Marks + Difficulty */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              <div>
                <label style={labelStyle}>
                  Marks <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="number"
                  style={inputStyle}
                  value={form.question_marks}
                  min={0}
                  max={10}
                  step={0.5}
                  onChange={(e) =>
                    set(
                      "question_marks",
                      Math.min(10, Math.max(0, e.target.value)),
                    )
                  }
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Difficulty</label>
                <select
                  style={inputStyle}
                  value={form.question_difficulty}
                  onChange={(e) => set("question_difficulty", e.target.value)}
                >
                  <option value="0">Easy</option>
                  <option value="1">Medium</option>
                  <option value="2">Hard</option>
                  <option value="3">Time Consuming</option>
                </select>
              </div>
            </div>

            {/* Previously Asked */}
            <div style={{ marginBottom: "14px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                <input
                  type="checkbox"
                  id="edit_prevAsked"
                  checked={isAskedPrev}
                  onChange={(e) => setIsAskedPrev(e.target.checked)}
                  style={{ cursor: "pointer" }}
                />
                <label
                  htmlFor="edit_prevAsked"
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    color: "#475569",
                    cursor: "pointer",
                  }}
                >
                  Previously asked in exam
                </label>
              </div>
              {isAskedPrev && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                  }}
                >
                  <div>
                    <label style={labelStyle}>Paper</label>
                    <input
                      type="text"
                      style={inputStyle}
                      placeholder="e.g. BE01"
                      value={form.prevAskedPaper}
                      onChange={(e) => set("prevAskedPaper", e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Year</label>
                    <input
                      type="number"
                      style={inputStyle}
                      placeholder="e.g. 2024"
                      value={form.prevAskedYear}
                      onChange={(e) => set("prevAskedYear", e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* From Book */}
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                <input
                  type="checkbox"
                  id="edit_fromBook"
                  checked={isFromBook}
                  onChange={(e) => setIsFromBook(e.target.checked)}
                  style={{ cursor: "pointer" }}
                />
                <label
                  htmlFor="edit_fromBook"
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    color: "#475569",
                    cursor: "pointer",
                  }}
                >
                  From a book
                </label>
              </div>
              {isFromBook && (
                <input
                  type="text"
                  style={inputStyle}
                  placeholder="e.g. DDCET Solutions"
                  value={form.fromBook}
                  onChange={(e) => set("fromBook", e.target.value)}
                />
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                borderTop: "1px solid #f1f5f9",
                paddingTop: "18px",
              }}
            >
              <button
                type="button"
                onClick={onClose}
                disabled={loadingPreview}
                style={{
                  border: "1.5px solid #cbd5e1",
                  background: "#fff",
                  color: "#64748b",
                  borderRadius: "50px",
                  padding: "9px 22px",
                  fontWeight: 600,
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loadingPreview}
                style={{
                  background: "#4f46e5",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50px",
                  padding: "9px 26px",
                  fontWeight: 600,
                  fontSize: "13px",
                  cursor: loadingPreview ? "not-allowed" : "pointer",
                  opacity: loadingPreview ? 0.7 : 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {loadingPreview ? (
                  <>
                    <span className="spinner-border spinner-border-sm" />{" "}
                    Loading preview...
                  </>
                ) : (
                  <>
                    <i className="ph ph-arrow-right" /> Preview Impact
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  fontSize: "12px",
  fontWeight: 600,
  color: "#475569",
  marginBottom: "5px",
};
const inputStyle = {
  width: "100%",
  border: "1.5px solid #e2e8f0",
  borderRadius: "8px",
  padding: "8px 12px",
  fontSize: "13px",
  color: "#1e293b",
  outline: "none",
  background: "#fff",
  boxSizing: "border-box",
};

// ── Question Card ───────────────────────────────────────────────────────────
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
      prevAskedPaper,
      prevAskedYear,
      fromBook,
    },
    ref,
  ) => {
    const queryClient = useQueryClient();
    const [showEdit, setShowEdit] = useState(false);

    const deleteMutation = useMutation({
      mutationFn: (id) => adminDeleteQuestion(id),
      onSuccess: () => {
        toast.success("Question deleted!");
        queryClient.invalidateQueries(["questions"]);
      },
      onError: (err) =>
        toast.error(
          err?.response?.data?.message || "Failed to delete question",
        ),
    });

    const handleDelete = () => {
      Swal.fire({
        title: "Delete Question?",
        html: `<p class="text-sm text-gray-600">This question will be permanently deleted.<br>If it's used in a test, deletion will be blocked.</p>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Yes, Delete",
      }).then((r) => {
        if (r.isConfirmed) deleteMutation.mutate(questionId);
      });
    };

    return (
      <>
        <MathJaxContext config={config}>
          <div className="card question-card shadow" ref={ref}>
            <div className="card-body">
              {/* Header */}
              <div className="flex-between mb-8">
                <h5 className="card-title mb-0 flex-align gap-8">
                  <span>{index}.</span>
                  <MathJax inline>{question}</MathJax>
                </h5>
                <div className="flex-align gap-8 flex-shrink-0 ms-12">
                  {difficulty && (
                    <span
                      className={`text-12 py-2 px-10 rounded-pill fw-medium ${difficultyBadge(difficulty)}`}
                    >
                      {difficultyLabel(difficulty)}
                    </span>
                  )}
                  {marks && (
                    <span className="text-12 py-2 px-10 rounded-pill bg-main-50 text-main-600 fw-medium">
                      {marks} mark{marks != 1 ? "s" : ""}
                    </span>
                  )}
                  {prevAskedPaper && (
                    <span
                      className="text-12 py-2 px-10 rounded-pill bg-warning-50 text-warning-700 fw-medium"
                      title="Previously asked"
                    >
                      <i className="ph ph-clock-countdown me-4" />
                      {prevAskedPaper} {prevAskedYear}
                    </span>
                  )}
                  {fromBook && (
                    <span
                      className="text-12 py-2 px-10 rounded-pill bg-info-50 text-info-700 fw-medium"
                      title={`From: ${fromBook}`}
                    >
                      <i className="ph ph-book-open me-4" />
                      Book
                    </span>
                  )}
                  <button
                    className="btn btn-sm btn-info rounded-pill"
                    onClick={() => setShowEdit(true)}
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
                  ].map((opt) => {
                    const isCorrect = opt.text && opt.text === answer;
                    return (
                      <div className="col-6" key={opt.label}>
                        <div
                          className="option-card h-100"
                          style={
                            isCorrect
                              ? {
                                  background: "#dcfce7",
                                  borderColor: "#16a34a",
                                  borderWidth: "2px",
                                  borderStyle: "solid",
                                }
                              : {}
                          }
                        >
                          <div
                            className="question-bullet-icon"
                            style={
                              isCorrect
                                ? { background: "#16a34a", color: "#fff" }
                                : {}
                            }
                          >
                            {opt.label}
                          </div>
                          {opt.img === null ? (
                            <MathJax inline>
                              <span
                                style={
                                  isCorrect
                                    ? { color: "#15803d", fontWeight: 600 }
                                    : {}
                                }
                              >
                                {opt.text}
                              </span>
                            </MathJax>
                          ) : (
                            <img src={opt.img} alt={opt.text} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </MathJaxContext>

        {showEdit && (
          <EditModal
            questionId={questionId}
            initial={{
              question_text: question,
              option_a_text: option1,
              option_b_text: option2,
              option_c_text: option3,
              option_d_text: option4,
              answer_text: answer,
              question_marks: marks,
              question_difficulty: difficulty,
              prevAskedPaper,
              prevAskedYear,
              fromBook,
            }}
            onClose={() => setShowEdit(false)}
            onSaved={() => queryClient.invalidateQueries(["questions"])}
          />
        )}
      </>
    );
  },
);

export default AdminQuestionCard;
