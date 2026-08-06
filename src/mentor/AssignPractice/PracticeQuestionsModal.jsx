import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { getPracticeQuestionsAdmin } from "../../apis/apis";
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

const OPTS = [
  { key: "option_a", label: "A" },
  { key: "option_b", label: "B" },
  { key: "option_c", label: "C" },
  { key: "option_d", label: "D" },
];

export default function PracticeQuestionsModal({ practice, onClose }) {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["practiceQuestionsAdmin", practice?.id],
    queryFn: () => getPracticeQuestionsAdmin(practice?.id),
    enabled: !!practice?.id,
    staleTime: 5 * 60 * 1000,
  });

  const all = data?.data || [];
  const total = all.length;
  const rows = all.slice((page - 1) * limit, page * limit);
  const totalPages = Math.ceil(total / limit);

  const pageNums = () => {
    const nums = [],
      s = Math.max(1, page - 2),
      e = Math.min(totalPages, page + 2);
    for (let i = s; i <= e; i++) nums.push(i);
    return nums;
  };

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
          maxWidth: "800px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex-between p-20 border-bottom border-gray-100"
          style={{ flexShrink: 0 }}
        >
          <div>
            <h5 className="fw-bold mb-2 text-gray-800">{practice?.title}</h5>
            <p className="text-13 text-gray-400 mb-0">
              {total} question{total !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-sm btn-secondary rounded-circle"
            style={{ width: "34px", height: "34px" }}
          >
            <i className="ph ph-x" />
          </button>
        </div>

        {/* Questions */}
        <div style={{ overflowY: "auto", flex: 1, padding: "16px 20px" }}>
          {isLoading && (
            <div className="text-center py-40">
              <span className="spinner-border text-main-600" />
            </div>
          )}

          {!isLoading && rows.length === 0 && (
            <div className="text-center py-40 text-gray-400">
              <i className="ph ph-question text-48 d-block mb-12 text-gray-300" />
              No questions in this practice set
            </div>
          )}

          <MathJaxContext config={mathConfig}>
            {rows.map((q, i) => (
              <div
                key={q.id}
                className="card border border-gray-100 mb-16 shadow-sm"
              >
                <div className="card-body p-16">
                  {/* Question number + subject */}
                  <div className="flex-between mb-10">
                    <span className="text-12 fw-semibold text-main-600 bg-main-50 px-10 py-3 rounded-pill">
                      Q{(page - 1) * limit + i + 1}
                    </span>
                    <span className="text-12 text-gray-400">
                      {q.subject_name}
                    </span>
                  </div>

                  {/* Question text */}
                  <div
                    className="text-14 fw-medium text-gray-800 mb-10"
                    style={{ lineHeight: "1.6" }}
                  >
                    <MathJax dynamic inline>
                      {q.question_text || ""}
                    </MathJax>
                  </div>

                  {/* Question image */}
                  {q.question_image && (
                    <img
                      src={q.question_image}
                      alt="question"
                      style={{
                        width: "100%",
                        height: "auto",
                        borderRadius: "8px",
                        marginBottom: "12px",
                      }}
                    />
                  )}

                  {/* Options */}
                  <div className="row g-8">
                    {OPTS.map((opt) => {
                      const text = q[`${opt.key}_text`];
                      const image = q[`${opt.key}_image`];
                      // correct_answer stores the actual text of the correct option
                      const isCorrect =
                        text && q.correct_answer && text === q.correct_answer;
                      if (!text && !image) return null;
                      return (
                        <div key={opt.key} className="col-md-6">
                          <div
                            className="px-12 py-10 rounded-8 border"
                            style={{
                              background: isCorrect ? "#22c55e" : "#f8fafc",
                              borderColor: isCorrect ? "#16a34a" : "#e2e8f0",
                            }}
                          >
                            <div className="flex-align gap-8">
                              <span
                                className="text-12 fw-bold rounded-circle flex-center"
                                style={{
                                  width: "22px",
                                  height: "22px",
                                  flexShrink: 0,
                                  background: isCorrect ? "#22c55e" : "#e2e8f0",
                                  color: isCorrect ? "#fff" : "#64748b",
                                }}
                              >
                                {opt.label}
                              </span>
                              {text && (
                                <span
                                  className={`text-13 ${isCorrect ? "fw-semibold" : "text-gray-600"}`}
                                  style={{
                                    color: isCorrect ? "#fff" : undefined,
                                  }}
                                >
                                  <MathJax dynamic inline>
                                    {text}
                                  </MathJax>
                                </span>
                              )}
                              {isCorrect && (
                                <i
                                  className="ph ph-check-circle ms-auto"
                                  style={{ color: "#fff", fontSize: "16px" }}
                                />
                              )}
                            </div>
                            {image && (
                              <img
                                src={image}
                                alt={opt.label}
                                style={{
                                  width: "100%",
                                  height: "auto",
                                  borderRadius: "6px",
                                  marginTop: "8px",
                                }}
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </MathJaxContext>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="flex-between flex-wrap gap-8 p-16 border-top border-gray-100"
            style={{ flexShrink: 0 }}
          >
            <p className="text-13 text-gray-500 mb-0">
              Showing <strong>{(page - 1) * limit + 1}</strong>–
              <strong>{Math.min(page * limit, total)}</strong> of{" "}
              <strong>{total}</strong>
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
    </div>,
    document.body,
  );
}
