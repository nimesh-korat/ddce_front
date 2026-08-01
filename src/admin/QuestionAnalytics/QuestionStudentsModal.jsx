import React from "react";
import ReactDOM from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { getQuestionStudentAnswers } from "../../apis/apis";
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

const OPTION_LABELS = { a: "A", b: "B", c: "C", d: "D" };

export default function QuestionStudentsModal({
  question,
  batchId,
  phaseId,
  onClose,
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["questionStudents", question?.question_id, batchId, phaseId],
    queryFn: () =>
      getQuestionStudentAnswers(question?.question_id, {
        batch_id: batchId,
        phase_id: phaseId,
      }),
    enabled: !!question?.question_id,
    staleTime: 30 * 1000,
  });

  const q = data?.question;
  const rows = data?.data || [];

  const correct = rows.filter((r) => r.is_correct === "1").length;
  const wrong = rows.filter((r) => r.is_correct === "0").length;
  const skipped = rows.filter((r) => r.is_correct === "2").length;
  const total = rows.length;
  const pct = total > 0 ? Math.round((correct * 100) / total) : 0;

  const optionText = (key) => {
    if (!q || !key) return key;
    const map = {
      a: q.option_a_text,
      b: q.option_b_text,
      c: q.option_c_text,
      d: q.option_d_text,
    };
    return map[key?.toLowerCase()] || key;
  };

  const statusStyle = (is_correct) => {
    if (is_correct === "1")
      return {
        bg: "#f0fdf4",
        border: "#86efac",
        badge: ["#dcfce7", "#166534", "✓ Correct"],
      };
    if (is_correct === "0")
      return {
        bg: "#fff7f7",
        border: "#fca5a5",
        badge: ["#fee2e2", "#991b1b", "✗ Wrong"],
      };
    return {
      bg: "#f8fafc",
      border: "#e2e8f0",
      badge: ["#f1f5f9", "#64748b", "— Skipped"],
    };
  };

  const pctColor = (p) =>
    p >= 75 ? "#22c55e" : p >= 50 ? "#f59e0b" : "#ef4444";

  return ReactDOM.createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "860px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 20px",
            borderBottom: "1px solid #f1f5f9",
            flexShrink: 0,
          }}
        >
          <div className="flex-between gap-12">
            <div style={{ flex: 1 }}>
              <p
                className="text-11 text-gray-400 fw-semibold text-uppercase mb-6"
                style={{ letterSpacing: "0.5px" }}
              >
                {question?.subject_name} › {question?.topic_name}
              </p>
              <MathJaxContext config={mathConfig}>
                <div
                  className="text-14 fw-semibold text-gray-800"
                  style={{ lineHeight: "1.5" }}
                >
                  <MathJax dynamic inline>
                    {q?.question_text || question?.question_text || ""}
                  </MathJax>
                </div>
              </MathJaxContext>
            </div>
            <button
              onClick={onClose}
              className="btn btn-sm btn-secondary rounded-circle flex-shrink-0"
              style={{ width: "34px", height: "34px" }}
            >
              <i className="ph ph-x" />
            </button>
          </div>

          {/* Correct answer */}
          {q?.answer_text && (
            <div
              className="mt-10 px-12 py-8 rounded-8"
              style={{
                background: "#f0fdf4",
                border: "1px solid #86efac",
                display: "inline-block",
              }}
            >
              <span className="text-12 text-gray-500 me-6">
                Correct Answer:
              </span>
              <span className="text-13 fw-bold" style={{ color: "#166534" }}>
                {OPTION_LABELS[q.answer_text?.toLowerCase()] && (
                  <span className="me-4">
                    {OPTION_LABELS[q.answer_text?.toLowerCase()]}.
                  </span>
                )}
                <MathJaxContext config={mathConfig}>
                  <MathJax dynamic inline>
                    {optionText(q.answer_text) || q.answer_text}
                  </MathJax>
                </MathJaxContext>
              </span>
            </div>
          )}
        </div>

        {/* Stats bar */}
        <div
          style={{
            padding: "12px 20px",
            borderBottom: "1px solid #f1f5f9",
            flexShrink: 0,
          }}
        >
          <div className="row g-12 text-center">
            {[
              ["Total", total, "#6366f1", "#ede9fe"],
              ["✓ Correct", correct, "#22c55e", "#f0fdf4"],
              ["✗ Wrong", wrong, "#ef4444", "#fff7f7"],
              ["— Skipped", skipped, "#94a3b8", "#f8fafc"],
              ["Accuracy", `${pct}%`, pctColor(pct), "#fff"],
            ].map(([label, val, color, bg]) => (
              <div key={label} className="col">
                <div
                  className="rounded-8 py-10 px-8"
                  style={{ background: bg, border: `1px solid ${color}22` }}
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

        {/* Student list */}
        <div style={{ overflowY: "auto", flex: 1, padding: "4px 0" }}>
          {isLoading && (
            <div className="text-center py-40">
              <span className="spinner-border text-main-600" />
            </div>
          )}

          {!isLoading && rows.length === 0 && (
            <div className="text-center py-40">
              <i className="ph ph-users text-48 text-gray-300 d-block mb-12" />
              <p className="text-gray-400">
                No students have answered this question yet
              </p>
            </div>
          )}

          <MathJaxContext config={mathConfig}>
            <table className="table table-hover mb-0">
              {rows.length > 0 && (
                <thead
                  className="bg-gray-50"
                  style={{ position: "sticky", top: 0, zIndex: 1 }}
                >
                  <tr>
                    <th className="text-12 text-gray-500 fw-medium py-10 px-16">
                      #
                    </th>
                    <th className="text-12 text-gray-500 fw-medium py-10">
                      Student
                    </th>
                    <th className="text-12 text-gray-500 fw-medium py-10">
                      College
                    </th>
                    <th className="text-12 text-gray-500 fw-medium py-10">
                      Batch
                    </th>
                    <th className="text-12 text-gray-500 fw-medium py-10 text-center">
                      Source
                    </th>
                    <th className="text-12 text-gray-500 fw-medium py-10 text-center">
                      Status
                    </th>
                    <th className="text-12 text-gray-500 fw-medium py-10">
                      Selected Option
                    </th>
                    <th className="text-12 text-gray-500 fw-medium py-10">
                      Marks
                    </th>
                  </tr>
                </thead>
              )}
              <tbody>
                {rows.map((row, i) => {
                  const { bg, border, badge } = statusStyle(row.is_correct);
                  const [badgeBg, badgeColor, badgeText] = badge;
                  return (
                    <tr key={row.id} style={{ background: bg }}>
                      <td className="text-13 text-gray-400 fw-medium py-10 px-16">
                        {i + 1}
                      </td>
                      <td className="py-10">
                        <span className="text-13 fw-semibold text-gray-800">
                          {row.student_name}
                        </span>
                      </td>
                      <td
                        className="text-12 text-gray-500 py-10"
                        style={{
                          maxWidth: "140px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {row.college || "—"}
                      </td>
                      <td className="py-10">
                        <span className="text-11 bg-main-50 text-main-700 py-2 px-8 rounded-pill fw-medium">
                          {row.batch_title || "—"}
                        </span>
                        {row.phase_title && (
                          <span className="text-11 bg-info-50 text-info-700 py-2 px-8 rounded-pill fw-medium ms-4">
                            {row.phase_title}
                          </span>
                        )}
                      </td>
                      <td className="py-10 text-center">
                        <span
                          className="text-11 fw-semibold py-3 px-10 rounded-pill"
                          style={{
                            background:
                              row.source === "practice" ? "#fef9c3" : "#ede9fe",
                            color:
                              row.source === "practice" ? "#854d0e" : "#6366f1",
                          }}
                        >
                          {row.source === "practice" ? "Practice" : "Quiz"}
                        </span>
                      </td>
                      <td className="py-10 text-center">
                        <span
                          className="text-11 fw-semibold py-3 px-10 rounded-pill"
                          style={{ background: badgeBg, color: badgeColor }}
                        >
                          {badgeText}
                        </span>
                      </td>
                      <td className="py-10">
                        {row.is_correct === "2" ? (
                          <span className="text-12 text-gray-400">—</span>
                        ) : (
                          <span
                            className={`text-12 fw-medium ${row.is_correct === "1" ? "" : ""}`}
                            style={{
                              color:
                                row.is_correct === "1" ? "#166534" : "#991b1b",
                            }}
                          >
                            {row.std_answer ? (
                              <>
                                {OPTION_LABELS[
                                  row.std_answer?.toLowerCase()
                                ] && (
                                  <span className="fw-bold me-4">
                                    {
                                      OPTION_LABELS[
                                        row.std_answer?.toLowerCase()
                                      ]
                                    }
                                    .
                                  </span>
                                )}
                                <MathJax dynamic inline>
                                  {optionText(row.std_answer)}
                                </MathJax>
                              </>
                            ) : (
                              "—"
                            )}
                          </span>
                        )}
                      </td>
                      <td
                        className="text-12 py-10"
                        style={{
                          color: row.obt_marks > 0 ? "#166534" : "#991b1b",
                          fontWeight: 600,
                        }}
                      >
                        {row.obt_marks !== null ? row.obt_marks : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </MathJaxContext>
        </div>
      </div>
    </div>,
    document.body,
  );
}
