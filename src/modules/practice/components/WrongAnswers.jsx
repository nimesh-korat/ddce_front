import React from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import Preloader from "../../../utils/preloader/Preloader";

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

function WrongAnswers({
  data,
  isLoading,
  subjects,
  subjectFilter,
  setSubjectFilter,
}) {
  if (isLoading) return <Preloader />;

  if (data.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center py-48">
          <i className="ph ph-check-circle text-64 text-success-600 d-block mb-16" />
          <h5 className="fw-semibold text-gray-700 mb-8">No wrong answers!</h5>
          <p className="text-gray-500 text-14">
            {subjectFilter
              ? "You have no wrong answers for this subject."
              : "You have not answered any questions incorrectly yet."}
          </p>
        </div>
      </div>
    );
  }

  const options = (q) => [
    { label: "A", text: q.option_a_text, image: q.option_a_image },
    { label: "B", text: q.option_b_text, image: q.option_b_image },
    { label: "C", text: q.option_c_text, image: q.option_c_image },
    { label: "D", text: q.option_d_text, image: q.option_d_image },
  ];

  const getOptionStyle = (opt, q) => {
    const value = opt.text || opt.image;
    if (value === q.correct_answer) return "border-success-600 bg-success-50";
    if (value === q.std_answer && value !== q.correct_answer)
      return "border-danger-600 bg-danger-50";
    return "border-gray-100 bg-gray-50";
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
    <MathJaxContext config={mathConfig}>
      <div className="d-flex flex-column gap-16">
        <div className="flex-between flex-wrap gap-8 col-sm-6 col-lg-2">
          <p className="text-14 text-gray-600 mb-0">
            <strong>{data.length}</strong> wrong answer
            {data.length !== 1 ? "s" : ""}
          </p>
          {/* Subject filter within wrong answers */}
          <select
            className="form-control form-control-sm rounded-pill "
            style={{ minWidth: "160px" }}
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
          >
            <option value="">All Subjects</option>
            {subjects.map((s) => (
              <option key={s.Id} value={s.Id}>
                {s.Sub_Name}
              </option>
            ))}
          </select>
        </div>

        {data.map((q, i) => (
          <div key={q.answer_id} className="card border border-danger-100">
            <div className="card-body p-24">
              {/* Header */}
              <div className="flex-between mb-14">
                <div className="flex-align gap-8">
                  <span className="w-28 h-28 rounded-circle bg-danger-600 text-white d-flex align-items-center justify-content-center text-13 fw-semibold flex-shrink-0">
                    {i + 1}
                  </span>
                  {/* {q.subject_name && (
                    <span className="text-12 bg-main-50 text-main-600 py-2 px-10 rounded-pill fw-medium">
                      {q.subject_name}
                    </span>
                  )} */}
                  {/* {q.question_difficulty && (
                    <span className={`text-12 py-2 px-10 rounded-pill fw-medium ${diffBadge(q.question_difficulty)}`}>
                      {q.question_difficulty}
                    </span>
                  )} */}
                </div>
                {/* <span className="text-12 text-gray-400">{q.assignment_title}</span> */}
              </div>

              {/* Question text */}
              <div className="mb-16">
                <p className="fw-medium text-15 text-gray-800 mb-8 lh-base">
                  <MathJax inline>{q.question_text}</MathJax>
                </p>
                {q.question_image && (
                  <img
                    src={q.question_image}
                    alt="question"
                    style={{
                      maxHeight: "180px",
                      objectFit: "contain",
                      borderRadius: "8px",
                    }}
                  />
                )}
              </div>

              {/* Options with highlights */}
              <div className="d-flex flex-column gap-8 mb-14">
                {options(q).map((opt) => {
                  const value = opt.text || opt.image;
                  if (!value) return null;
                  const style = getOptionStyle(opt, q);
                  const isCorrect = value === q.correct_answer;
                  const isWrong =
                    value === q.std_answer && value !== q.correct_answer;

                  return (
                    <div
                      key={opt.label}
                      className={`d-flex align-items-center gap-12 p-12 rounded-10 border-2 ${style}`}
                      style={{ border: "2px solid" }}
                    >
                      <span
                        className={`w-28 h-28 rounded-circle d-flex align-items-center justify-content-center fw-semibold text-13 flex-shrink-0 ${
                          isCorrect
                            ? "bg-success-600 text-white"
                            : isWrong
                              ? "bg-danger-600 text-white"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {opt.label}
                      </span>
                      <span className="flex-grow-1 text-14">
                        {opt.text && <MathJax inline>{opt.text}</MathJax>}
                        {opt.image && (
                          <img
                            src={opt.image}
                            alt={opt.label}
                            style={{
                              maxHeight: "70px",
                              objectFit: "contain",
                              display: "block",
                            }}
                          />
                        )}
                      </span>
                      {isCorrect && (
                        <span className="flex-align gap-4 text-success-700 text-12 fw-semibold flex-shrink-0">
                          <i className="ph-fill ph-check-circle text-16" />
                          Correct
                        </span>
                      )}
                      {isWrong && (
                        <span className="flex-align gap-4 text-danger-700 text-12 fw-semibold flex-shrink-0">
                          <i className="ph-fill ph-x-circle text-16" />
                          Your Answer
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Correct answer summary */}
              <div className="p-10 bg-success-50 rounded-8 border border-success-200">
                <span className="text-13 fw-semibold text-success-700">
                  <i className="ph ph-check-circle me-6" />
                  Correct Answer: <MathJax inline>{q.correct_answer}</MathJax>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </MathJaxContext>
  );
}

export default WrongAnswers;
